import Debug from '../debug';
import { Hasura } from '../hasura/hasura';

const debug = Debug('migration:up-geo');

export async function up(customHasura?: Hasura) {
  debug('🚀 Starting Hasura geo migration UP...');
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.ensureDefaultSource();

  try { await hasura.sql(`CREATE EXTENSION IF NOT EXISTS postgis;`); } catch {}
  await hasura.sql(`CREATE SCHEMA IF NOT EXISTS geo;`);

  await hasura.sql(`
    CREATE TABLE IF NOT EXISTS geo.features (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      type text NOT NULL,
      geom geometry(Geometry, 4326) NOT NULL,
      props jsonb NOT NULL DEFAULT '{}'::jsonb,
      centroid geometry(Point, 4326),
      bbox geometry(Polygon, 4326),
      area_m2 numeric,
      length_m numeric,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await hasura.sql(`CREATE INDEX IF NOT EXISTS geo_features_geom_gix ON geo.features USING GIST (geom);`);
  await hasura.sql(`CREATE INDEX IF NOT EXISTS geo_features_props_gin ON geo.features USING GIN (props jsonb_path_ops);`);
  await hasura.sql(`CREATE INDEX IF NOT EXISTS geo_features_type_idx ON geo.features (type);`);
  await hasura.sql(`CREATE INDEX IF NOT EXISTS geo_features_user_idx ON geo.features (user_id);`);

  await hasura.defineFunction({
    schema: 'geo',
    name: 'features_before_write',
    language: 'plpgsql',
    definition: `()
RETURNS trigger AS $$
BEGIN
  IF NEW.geom IS NOT NULL THEN
    IF ST_SRID(NEW.geom) IS DISTINCT FROM 4326 THEN
      NEW.geom := ST_Transform(NEW.geom, 4326);
    END IF;
    NEW.geom := ST_MakeValid(NEW.geom);
    NEW.centroid := ST_Centroid(NEW.geom);
    NEW.bbox := ST_Envelope(NEW.geom);
    IF GeometryType(NEW.geom) IN ('ST_Polygon','ST_MultiPolygon') THEN
      NEW.area_m2 := ST_Area(NEW.geom::geography);
      NEW.length_m := NULL;
    ELSIF GeometryType(NEW.geom) IN ('ST_LineString','ST_MultiLineString') THEN
      NEW.length_m := ST_Length(NEW.geom::geography);
      NEW.area_m2 := NULL;
    ELSE
      NEW.area_m2 := NULL;
      NEW.length_m := NULL;
    END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END
$$`,
  });

  await hasura.sql(`
    DROP TRIGGER IF EXISTS trg_geo_features_before_write ON geo.features;
    CREATE TRIGGER trg_geo_features_before_write
    BEFORE INSERT OR UPDATE ON geo.features
    FOR EACH ROW EXECUTE FUNCTION geo.features_before_write();
  `);

  await hasura.defineFunction({
    schema: 'geo',
    name: 'nearby',
    definition: `(
      lon double precision,
      lat double precision,
      radius_m integer
    ) RETURNS SETOF geo.features AS $$
    SELECT * FROM geo.features f
    WHERE ST_DWithin(
      f.geom::geography,
      ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography,
      radius_m
    );
    $$`,
  });

  await hasura.defineFunction({
    schema: 'geo',
    name: 'within_bbox',
    definition: `(
      min_lon double precision,
      min_lat double precision,
      max_lon double precision,
      max_lat double precision
    ) RETURNS SETOF geo.features AS $$
    SELECT * FROM geo.features f
    WHERE f.geom && ST_MakeEnvelope(min_lon, min_lat, max_lon, max_lat, 4326);
    $$`,
  });

  await hasura.trackTable({ schema: 'geo', table: 'features' });

  await hasura.definePermission({ schema: 'geo', table: 'features', operation: 'select', role: ['anonymous','user','me','admin'], filter: {}, aggregate: true });
  await hasura.definePermission({
    schema: 'geo', table: 'features', operation: 'insert', role: ['user','me'],
    filter: { user_id: { _eq: 'X-Hasura-User-Id' } },
    columns: true,
    set: { user_id: 'X-Hasura-User-Id' }
  });
  for (const op of ['update','delete'] as const) {
    await hasura.definePermission({ schema: 'geo', table: 'features', operation: op, role: ['user','me'], filter: { user_id: { _eq: 'X-Hasura-User-Id' } }, columns: true });
  }
  for (const op of ['insert','update','delete'] as const) {
    await hasura.definePermission({ schema: 'geo', table: 'features', operation: op, role: 'admin', filter: {}, columns: true });
  }

  debug('✨ Hasura geo migration UP completed successfully!');
  return true;
}



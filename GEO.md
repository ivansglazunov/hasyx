# Geo Module

PostGIS-powered geospatial layer for Hasyx. This module adds a `geo` schema with a universal `features` table, helper SQL functions, derived geometry metadata via trigger, indexes, and Hasura permissions. It is designed to work smoothly with the `Hasyx` client for GraphQL operations and SQL utilities.

## What’s Included

- PostgreSQL PostGIS extension and `geo` schema
- Table: `geo.features`
  - `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
  - `user_id uuid NOT NULL`
  - `type text NOT NULL` (e.g., `mark`, `path`, `zone`)
  - `geom geometry(Geometry, 4326) NOT NULL` (SRID normalized to 4326)
  - `props jsonb NOT NULL DEFAULT '{}'::jsonb`
  - Derived columns (trigger): `centroid geometry(Point,4326)`, `bbox geometry(Polygon,4326)`, `area_m2 numeric`, `length_m numeric`
  - `created_at timestamptz DEFAULT now()`, `updated_at timestamptz DEFAULT now()`
- Indexes: GIST on `geom`, GIN on `props`, BTree on `type` and `user_id`
- Trigger `geo.features_before_write`
  - Ensures SRID=4326 and `ST_MakeValid`
  - Populates `centroid`, `bbox`
  - Computes `area_m2` for polygonal and `length_m` for linear geometries
- SQL helper functions
  - `geo.nearby(lon float8, lat float8, radius_m int) RETURNS SETOF geo.features`
  - `geo.within_bbox(min_lon float8, min_lat float8, max_lon float8, max_lat float8) RETURNS SETOF geo.features`
- Hasura integration
  - Table tracked as `geo_features`
  - Permissions:
    - select: `anonymous`, `user`, `me`, `admin` — unrestricted filter, aggregates enabled
    - insert: `user`, `me` — `user_id` is set to `X-Hasura-User-Id`, filter by own user
    - update/delete: `user`, `me` — only own rows; `admin` — full access

See implementation in:
- `lib/geo/up-geo.ts`, `lib/geo/down-geo.ts`
- `lib/postgis/up-postgis.ts`, `lib/postgis/down-postgis.ts`
- Tests: `lib/hasura/geo.test.ts`, `lib/hasyx/geo.test.ts`

## Quick Start

1) Enable PostGIS and create geo schema (idempotent migrations):

```bash
npx hasyx migrate postgis
npx hasyx migrate geo
```

2) Generate Hasura schema/types for your app:

```bash
npx hasyx schema
```

3) Use the `Hasyx` client to work with geo data.

## Using Hasyx Client (GraphQL)

GraphQL exposes the table as `geo_features` (and `geo_features_by_pk`, `insert_geo_features`, `update_geo_features`, `delete_geo_features`).

Important: inserting/updating the `geom` field directly via GraphQL is typically unavailable by default because PostGIS `geometry` scalar is not enabled in most Hasura setups. Use SQL for geometry writes (examples below) and GraphQL for selecting/updating non-geometry columns.

### Select rows

```ts
// Get latest features (id, type, props)
const rows = await hasyx.select({
  table: 'geo_features',
  order_by: [{ created_at: 'desc' }],
  limit: 20,
  returning: ['id', 'type', 'props']
});
```

### Select by primary key

```ts
const feature = await hasyx.select({
  table: 'geo_features',
  pk_columns: { id },
  returning: ['id', 'type', 'props']
});
```

### Update non-geometry fields

```ts
await hasyx.update({
  table: 'geo_features',
  where: { id: { _eq: id } },
  _set: { type: 'zone-upd', props: { name: 'Z' } },
  returning: ['affected_rows']
});
```

### Delete

```ts
await hasyx.delete({
  table: 'geo_features',
  where: { id: { _eq: id } },
  returning: ['affected_rows']
});
```

## Geometry Writes via SQL

Use `hasyx.sql()` (admin context required) to insert or update geometry using PostGIS functions, e.g. `ST_GeomFromText`:

```ts
// Insert a polygon (SRID normalized by trigger to 4326 if needed)
await hasyx.sql(`
  INSERT INTO geo.features (user_id, type, props, geom)
  VALUES ('${userId}', 'zone', '{}'::jsonb,
          ST_GeomFromText('POLYGON((37.6 55.7,37.6 55.705,37.605 55.705,37.605 55.7,37.6 55.7))', 4326));
`);

// Update geometry
await hasyx.sql(`
  UPDATE geo.features
     SET geom = ST_GeomFromText('POLYGON((37.61 55.71,37.61 55.715,37.615 55.715,37.615 55.71,37.61 55.71))', 4326)
   WHERE id = '${id}';
`);
```

Tip: for points, use `ST_MakePoint(lon, lat)`; for WKT literals, include `SRID=4326;` in your WKT or pass SRID explicitly to `ST_GeomFromText`.

## Spatial Queries

You can query spatial functions either via SQL or expose them as GraphQL (by tracking functions in Hasura). The migration defines pure SQL functions; tests use SQL (not GraphQL) for them.

### Nearby

```ts
// Count features within radius (meters) of lon/lat
const res = await hasyx.sql(`SELECT count(*) FROM geo.nearby(37.6::float8, 55.7::float8, 2000);`);
```

### Within BBox

```ts
const res = await hasyx.sql(`
  SELECT count(*)
    FROM geo.within_bbox(37.59::float8, 55.69::float8, 37.605::float8, 55.705::float8);
`);
```

If you prefer to use these from GraphQL, track the functions in Hasura metadata and they will appear as root fields (typically prefixed with schema, e.g., `geo_nearby`).

## Permissions Model

- Anonymous and authenticated users can read features (aggregate allowed)
- Regular users (`user`, `me`):
  - insert: only with own `user_id` (server sets `user_id` from `X-Hasura-User-Id`)
  - update/delete: only own rows
- Admin: full insert/update/delete

These rules are codified in `up-geo.ts` with `definePermission()` calls and validated by tests.

## Trigger Logic (Derived Columns)

Executed `BEFORE INSERT OR UPDATE`:

- Normalize/repair geometry: `ST_Transform(..., 4326)`, `ST_MakeValid`
- Derive `centroid` via `ST_Centroid(geom)`
- Derive `bbox` via `ST_Envelope(geom)`
- Compute metrics:
  - Polygon/MultiPolygon: `area_m2 = ST_Area(geom::geography)`, `length_m = NULL`
  - LineString/MultiLineString: `length_m = ST_Length(geom::geography)`, `area_m2 = NULL`
- Maintain `updated_at = now()`

This provides consistent spatial metadata without additional round-trips.

## Under the Hood

- PostGIS extension installation is attempted in `up-postgis.ts` (logged and safely skipped if not allowed by the environment)
- The `geom` column uses a generic `geometry(Geometry,4326)` subtype for maximum flexibility; the trigger computes metrics depending on the actual shape
- GIST index on `geom` enables efficient spatial searches; GIN on `props` supports JSONB filtering; additional BTree indexes help common filters
- Functions `nearby` and `within_bbox` return `SETOF geo.features` to keep access control consistent (table-level permissions apply when tracked)

## Testing Notes

The repo includes comprehensive tests that:
- Validate permissions for update/delete of own vs foreign rows via GraphQL
- Ensure trigger-derived fields (`centroid`, `bbox`, `area_m2`/`length_m`) are populated and SRID is normalized
- Verify spatial query helpers (`nearby`, `within_bbox`) via SQL

See: `lib/hasura/geo.test.ts`, `lib/hasyx/geo.test.ts`.

## Migration Commands

Apply or rollback only this module by filtering names:

```bash
# Apply
npx hasyx migrate postgis
npx hasyx migrate geo

# Rollback
npx hasyx unmigrate geo
npx hasyx unmigrate postgis
```

Environment and URLs/secrets are generated from `hasyx.config.json`. Do not edit `.env` manually; use `npx hasyx config`.



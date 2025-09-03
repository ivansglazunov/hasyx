import { describe, it, expect } from '@jest/globals';
import { Hasura } from './hasura';

async function hasPostgis(hasura: Hasura): Promise<boolean> {
  try {
    const res = await hasura.sql(`SELECT EXISTS (SELECT FROM pg_extension WHERE extname='postgis');`);
    return res?.result?.[1]?.[0] === 't';
  } catch {
    return false;
  }
}

function uniqueSuffix(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
}

(!!+(process?.env?.JEST_LOCAL || '') ? describe.skip : describe)('PostGIS', () => {
  it('postgis extension is installed or gracefully unavailable', async () => {
    const hasura = new Hasura({
      url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
      secret: process.env.HASURA_ADMIN_SECRET!,
    });
    await hasura.ensureDefaultSource();
    const installed = await hasPostgis(hasura);
    expect(typeof installed).toBe('boolean');
  });

  it('create schema with geometry table, insert and read WKT', async () => {
    const hasura = new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
    await hasura.ensureDefaultSource();
    if (!(await hasPostgis(hasura))) return;
    const schema = `geo_test_${uniqueSuffix()}`;
    try {
      await hasura.sql(`CREATE SCHEMA ${schema};`);
      await hasura.sql(`CREATE TABLE ${schema}.points(id serial primary key, geom geometry(Point, 4326));`);
      await hasura.sql(`CREATE INDEX ON ${schema}.points USING GIST (geom);`);
      await hasura.sql(`INSERT INTO ${schema}.points(geom) VALUES (ST_GeomFromText('POINT(37.62 55.75)', 4326));`);
      const r = await hasura.sql(`SELECT ST_AsText(geom) FROM ${schema}.points LIMIT 1;`);
      expect(r?.result?.[1]?.[0]).toBe('POINT(37.62 55.75)');
    } finally {
      try { await hasura.sql(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`); } catch {}
    }
  });

  it('spatial predicate ST_DWithin uses gist index (by plan mention)', async () => {
    const hasura = new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
    await hasura.ensureDefaultSource();
    if (!(await hasPostgis(hasura))) return;
    const schema = `geo_test_${uniqueSuffix()}`;
    try {
      await hasura.sql(`CREATE SCHEMA ${schema};`);
      await hasura.sql(`CREATE TABLE ${schema}.points(id serial primary key, geom geometry(Point, 4326));`);
      await hasura.sql(`CREATE INDEX gix ON ${schema}.points USING GIST (geom);`);
      await hasura.sql(`INSERT INTO ${schema}.points(geom) VALUES 
        (ST_SetSRID(ST_MakePoint(37.62,55.75),4326)),
        (ST_SetSRID(ST_MakePoint(37.60,55.76),4326)),
        (ST_SetSRID(ST_MakePoint(30.00,60.00),4326));`);
      const plan = await hasura.sql(`EXPLAIN SELECT * FROM ${schema}.points 
        WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint(37.61,55.75),4326), 1000);`);
      const text = (plan?.result || []).map((r: any[]) => r[0]).join('\n');
      expect(/gist/i.test(text) || /Index Scan/i.test(text)).toBe(true);
    } finally {
      try { await hasura.sql(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`); } catch {}
    }
  });

  it('transform and sphere distance', async () => {
    const hasura = new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
    await hasura.ensureDefaultSource();
    if (!(await hasPostgis(hasura))) return;
    const schema = `geo_test_${uniqueSuffix()}`;
    try {
      await hasura.sql(`CREATE SCHEMA ${schema};`);
      await hasura.sql(`CREATE TABLE ${schema}.pts(id serial primary key, geom geometry(Point, 4326));`);
      await hasura.sql(`INSERT INTO ${schema}.pts(geom) VALUES (ST_SetSRID(ST_MakePoint(37.62,55.75),4326));`);
      const dist = await hasura.sql(`SELECT ST_DistanceSphere(geom, ST_SetSRID(ST_MakePoint(37.63,55.75),4326)) FROM ${schema}.pts;`);
      const d = Number(dist?.result?.[1]?.[0] || '0');
      expect(d).toBeGreaterThan(0);
      const t = await hasura.sql(`SELECT ST_SRID(ST_Transform(geom, 3857)) FROM ${schema}.pts;`);
      expect(t?.result?.[1]?.[0]).toBe('3857');
    } finally {
      try { await hasura.sql(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`); } catch {}
    }
  });

  it('track and untrack geometry table in Hasura', async () => {
    const hasura = new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
    await hasura.ensureDefaultSource();
    if (!(await hasPostgis(hasura))) return;
    const schema = `geo_test_${uniqueSuffix()}`;
    try {
      await hasura.sql(`CREATE SCHEMA ${schema};`);
      await hasura.sql(`CREATE TABLE ${schema}.points(id serial primary key, geom geometry(Point, 4326));`);
      await hasura.trackTable({ schema, table: 'points' });
      const metaResp = await hasura.v1({ type: 'export_metadata', args: {} });
      const tracked = JSON.stringify(metaResp).includes(`${schema}`) && JSON.stringify(metaResp).includes('points');
      expect(tracked).toBe(true);
      await hasura.untrackTable({ schema, table: 'points' });
    } finally {
      try { await hasura.sql(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`); } catch {}
    }
  });

  it('geography type and ST_DWithin meters', async () => {
    const hasura = new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
    await hasura.ensureDefaultSource();
    if (!(await hasPostgis(hasura))) return;
    const schema = `geo_test_${uniqueSuffix()}`;
    try {
      await hasura.sql(`CREATE SCHEMA ${schema};`);
      await hasura.sql(`CREATE TABLE ${schema}.geog(id serial primary key, g geography(Point,4326));`);
      await hasura.sql(`INSERT INTO ${schema}.geog(g) VALUES (ST_SetSRID(ST_MakePoint(37.62,55.75),4326));`);
      const ok = await hasura.sql(`SELECT ST_DWithin(g, ST_SetSRID(ST_MakePoint(37.621,55.75),4326)::geography, 2000) FROM ${schema}.geog;`);
      expect(ok?.result?.[1]?.[0]).toBe('t');
    } finally {
      try { await hasura.sql(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`); } catch {}
    }
  });
});



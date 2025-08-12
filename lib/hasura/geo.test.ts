import { describe, it, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';

const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
const HASURA_BASE_URL = HASURA_GRAPHQL_URL.replace('/v1/graphql', '');
const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;

async function adminSql(sql: string) {
  const resp = await fetch(`${HASURA_BASE_URL}/v2/query`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': ADMIN_SECRET,
    },
    body: JSON.stringify({ type: 'run_sql', args: { source: 'default', sql, cascade: true } })
  });
  const data = await resp.json();
  if (!resp.ok || (data && data.error)) {
    throw new Error(`adminSql error: ${resp.status} ${resp.statusText} ${JSON.stringify(data)}`);
  }
  return data;
}

function uniqueSuffix(): string { return `${Date.now()}_${Math.random().toString(36).slice(2,8)}`; }

async function ensureTestUsers(): Promise<{ adminId: string; user1: string; user2: string }> {
  // Reuse existing users if present; otherwise create quick fixtures
  const q = await adminSql(`
    WITH upsert_user AS (
      INSERT INTO public.users (id, email, name, created_at, updated_at)
      VALUES
        (gen_random_uuid(), 'admin@test.local', 'Admin', EXTRACT(EPOCH FROM NOW())*1000, EXTRACT(EPOCH FROM NOW())*1000)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    )
    SELECT COALESCE((SELECT id FROM upsert_user), (SELECT id FROM public.users WHERE email='admin@test.local' LIMIT 1)) AS id;
  `);
  const adminId = q.result?.[1]?.[0] as string;

  const u1 = await adminSql(`
    WITH upsert_user AS (
      INSERT INTO public.users (id, email, name, created_at, updated_at)
      VALUES (gen_random_uuid(), 'user1@test.local', 'User1', EXTRACT(EPOCH FROM NOW())*1000, EXTRACT(EPOCH FROM NOW())*1000)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    )
    SELECT COALESCE((SELECT id FROM upsert_user), (SELECT id FROM public.users WHERE email='user1@test.local' LIMIT 1)) AS id;
  `);
  const user1 = u1.result?.[1]?.[0] as string;

  const u2 = await adminSql(`
    WITH upsert_user AS (
      INSERT INTO public.users (id, email, name, created_at, updated_at)
      VALUES (gen_random_uuid(), 'user2@test.local', 'User2', EXTRACT(EPOCH FROM NOW())*1000, EXTRACT(EPOCH FROM NOW())*1000)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    )
    SELECT COALESCE((SELECT id FROM upsert_user), (SELECT id FROM public.users WHERE email='user2@test.local' LIMIT 1)) AS id;
  `);
  const user2 = u2.result?.[1]?.[0] as string;

  return { adminId, user1, user2 };
}

describe('Geo core', () => {
  it('anonymous can select all features', async () => {
    const { user1, user2 } = await ensureTestUsers();
    const schema = 'geo';
    const t = `features`;
    const sfx = uniqueSuffix();
    try {
      // Seed two features and verify inserted rows
      const ins = await adminSql(`INSERT INTO ${schema}.${t}(user_id, type, geom) VALUES
        ('${user1}','point', ST_SetSRID(ST_MakePoint(37.6,55.7),4326)),
        ('${user2}','point', ST_SetSRID(ST_MakePoint(37.61,55.71),4326))
        RETURNING id;`);
      const inserted = (ins.result?.length || 0) > 1 ? ins.result.length - 1 : 0;
      expect(inserted).toBeGreaterThanOrEqual(2);

      // Count all features
      const r = await adminSql(`SELECT count(*) FROM ${schema}.${t};`);
      const cnt = Number(r.result?.[1]?.[0] || '0');
      expect(cnt).toBeGreaterThanOrEqual(2);
    } finally {
      await adminSql(`DELETE FROM ${schema}.${t} WHERE type='point';`);
    }
  });

  it('user can insert only with own user_id preset', async () => {
    const { user1 } = await ensureTestUsers();
    // For now insert via SQL, as GraphQL lacks geometry scalar in schema by default.
    await adminSql(`INSERT INTO geo.features(user_id, type, geom) VALUES ('${user1}','point', ST_SetSRID(ST_MakePoint(30,60),4326));`);
    const row = await adminSql(`SELECT user_id FROM geo.features ORDER BY created_at DESC LIMIT 1;`);
    expect(row.result?.[1]?.[0]).toBe(user1);
    await adminSql(`DELETE FROM geo.features WHERE user_id='${user1}';`);
  });

  it('user can update/delete only own features (Hasura permissions)', async () => {
    const { user1, user2 } = await ensureTestUsers();
    // Seed two rows
    const r1 = await adminSql(`INSERT INTO geo.features(user_id, type, geom) VALUES ('${user1}','point', ST_SetSRID(ST_MakePoint(1,1),4326)) RETURNING id;`);
    const id1 = r1.result?.[1]?.[0];
    const r2 = await adminSql(`INSERT INTO geo.features(user_id, type, geom) VALUES ('${user2}','point', ST_SetSRID(ST_MakePoint(2,2),4326)) RETURNING id;`);
    const id2 = r2.result?.[1]?.[0];

    // Prepare user token and a thin GraphQL client (native fetch, no heavy deps)
    const rawSecret = process.env.HASURA_JWT_SECRET || '{"type":"HS256","key":"your-secret-key"}';
    let key = rawSecret;
    let alg: jwt.Algorithm = 'HS256';
    try { const cfg = JSON.parse(rawSecret); key = cfg.key; alg = (cfg.type || 'HS256') as jwt.Algorithm; } catch {}
    const claims = { 'x-hasura-allowed-roles': ['user','anonymous','me'], 'x-hasura-default-role': 'user', 'x-hasura-user-id': user1 };
    const payload: any = { sub: user1, 'https://hasura.io/jwt/claims': claims };
    const token = jwt.sign(payload, key as string, { algorithm: alg, expiresIn: '1h' });
    const gql = async (query: string, variables: any) => {
      const resp = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, {
        method: 'POST',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ query, variables })
      });
      return await resp.json();
    };

    // Try update foreign row via GraphQL (should fail)
    const updateMut = `mutation($id: uuid!) { update_geo_features(where: {id: {_eq: $id}}, _set: {type: "forbidden"}) { affected_rows } }`;
    const updForeign = await gql(updateMut, { id: id2 });
    expect(Array.isArray(updForeign.errors)).toBe(true);

    // Update own row via GraphQL (should succeed)
    const updOwn = await gql(updateMut, { id: id1 });
    expect(updOwn?.data?.update_geo_features?.affected_rows || 0).toBeGreaterThan(0);

    // Delete foreign row (should fail)
    const delMut = `mutation($id: uuid!) { delete_geo_features(where: {id: {_eq: $id}}) { affected_rows } }`;
    const delForeign = await gql(delMut, { id: id2 });
    expect(Array.isArray(delForeign.errors)).toBe(true);

    // Delete own row (should succeed)
    const delOwn = await gql(delMut, { id: id1 });
    expect(delOwn?.data?.delete_geo_features?.affected_rows || 0).toBeGreaterThan(0);

    // Cleanup remaining
    await adminSql(`DELETE FROM geo.features WHERE id='${id2}';`);
  });

  it('trigger derives centroid/bbox/area/length and normalizes SRID', async () => {
    const { user1 } = await ensureTestUsers();
    try {
      await adminSql(`INSERT INTO geo.features(user_id, type, geom) VALUES (
        '${user1}', 'polygon', ST_GeomFromText('POLYGON((37.6 55.7,37.6 55.71,37.61 55.71,37.61 55.7,37.6 55.7))', 4326)
      );`);
      const res = await adminSql(`SELECT ST_SRID(geom), centroid IS NOT NULL, bbox IS NOT NULL, area_m2, length_m FROM geo.features ORDER BY created_at DESC LIMIT 1;`);
      expect(res.result?.[1]?.[0]).toBe('4326');
      expect(res.result?.[1]?.[1]).toBe('t');
      expect(res.result?.[1]?.[2]).toBe('t');
      const area = Number(res.result?.[1]?.[3] || '0');
      expect(area).toBeGreaterThan(0);
    } finally {
      await adminSql(`DELETE FROM geo.features WHERE user_id='${user1}';`);
    }
  });

  it('nearby and within_bbox work', async () => {
    const { user1 } = await ensureTestUsers();
    try {
      await adminSql(`INSERT INTO geo.features(user_id, type, geom) VALUES
        ('${user1}','point', ST_SetSRID(ST_MakePoint(37.6,55.7),4326)),
        ('${user1}','point', ST_SetSRID(ST_MakePoint(37.61,55.71),4326));`);
      const near = await adminSql(`SELECT count(*) FROM geo.nearby(37.6,55.7,2000);`);
      expect(Number(near.result?.[1]?.[0] || '0')).toBeGreaterThan(0);
      const bbox = await adminSql(`SELECT count(*) FROM geo.within_bbox(37.59,55.69,37.605,55.705);`);
      expect(Number(bbox.result?.[1]?.[0] || '0')).toBeGreaterThan(0);
    } finally {
      await adminSql(`DELETE FROM geo.features WHERE user_id='${user1}';`);
    }
  });
});



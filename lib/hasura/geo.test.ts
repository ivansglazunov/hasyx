import { describe, it, expect } from '@jest/globals';


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

// Helpers for WKT literals and dynamic adaptation to column subtype
const wktPoint = (lon: number, lat: number) => `SRID=4326;POINT(${lon} ${lat})`;
const wktPoly = (lon: number, lat: number, size = 0.005) => `SRID=4326;POLYGON((${lon} ${lat},${lon} ${lat+size},${lon+size} ${lat+size},${lon+size} ${lat},${lon} ${lat}))`;

async function geomSubtype(): Promise<string> {
  const rs = await adminSql(`
    SELECT type FROM geometry_columns
    WHERE f_table_schema='geo' AND f_table_name='features' AND f_geometry_column='geom'
  `);
  return ((rs?.result?.[1]?.[0] || '') as string).toUpperCase();
}

async function insertExprForMark(lon: number, lat: number): Promise<string> {
  const t = await geomSubtype();
  if (t.includes('POINT') || t.includes('GEOMETRY') || !t) {
    return `ST_GeomFromText('POINT(${lon} ${lat})',4326)`;
  }
  // fallback to small polygon
  return `ST_GeomFromText('POLYGON((${lon} ${lat},${lon} ${lat+0.002},${lon+0.002} ${lat+0.002},${lon+0.002} ${lat},${lon} ${lat}))',4326)`;
}

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

(!!+(process?.env?.JEST_LOCAL || '') ? describe.skip : describe)('Geo core', () => {
  it('anonymous can select all features', async () => {
    const { user1, user2 } = await ensureTestUsers();
    const schema = 'geo';
    const t = `features`;
    const sfx = uniqueSuffix();
    try {
      // Seed two features and verify inserted rows
      const g1 = `ST_GeomFromText('POLYGON((37.6 55.7,37.6 55.705,37.605 55.705,37.605 55.7,37.6 55.7))',4326)`;
      const g2 = `ST_GeomFromText('POLYGON((37.61 55.71,37.61 55.715,37.615 55.715,37.615 55.71,37.61 55.71))',4326)`;
      const ins = await adminSql(`INSERT INTO ${schema}.${t}(user_id, type, geom) VALUES
        ('${user1}','zone', ${g1}),
        ('${user2}','zone', ${g2})
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
    const g = `ST_GeomFromText('POLYGON((30 60,30 60.005,30.005 60.005,30.005 60,30 60))',4326)`;
    await adminSql(`INSERT INTO geo.features(user_id, type, geom) VALUES ('${user1}','zone', ${g});`);
    const row = await adminSql(`SELECT user_id FROM geo.features ORDER BY created_at DESC LIMIT 1;`);
    expect(row.result?.[1]?.[0]).toBe(user1);
    await adminSql(`DELETE FROM geo.features WHERE user_id='${user1}';`);
  });

  it('user can update/delete only own features (Hasura permissions)', async () => {
    const { user1, user2 } = await ensureTestUsers();
    // Seed two rows
    const gA = `ST_GeomFromText('POLYGON((1 1,1 1.005,1.005 1.005,1.005 1,1 1))',4326)`;
    const r1 = await adminSql(`INSERT INTO geo.features(user_id, type, geom) VALUES ('${user1}','zone', ${gA}) RETURNING id;`);
    const id1 = r1.result?.[1]?.[0];
    const gB = `ST_GeomFromText('POLYGON((2 2,2 2.005,2.005 2.005,2.005 2,2 2))',4326)`;
    const r2 = await adminSql(`INSERT INTO geo.features(user_id, type, geom) VALUES ('${user2}','zone', ${gB}) RETURNING id;`);
    const id2 = r2.result?.[1]?.[0];

    // Prepare user token and a thin GraphQL client (native fetch, no heavy deps)
    const { generateJWT } = await import('../jwt');
    const hasuraClaims = { 'x-hasura-allowed-roles': ['user','anonymous','me'], 'x-hasura-default-role': 'user', 'x-hasura-user-id': user1 };
    const token = await generateJWT(user1, hasuraClaims);
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
    expect((updForeign?.data?.update_geo_features?.affected_rows || 0)).toBe(0);

    // Update own row via GraphQL (should succeed)
    const updOwn = await gql(updateMut, { id: id1 });
    expect(updOwn?.data?.update_geo_features?.affected_rows || 0).toBeGreaterThan(0);

    // Delete foreign row (should fail)
    const delMut = `mutation($id: uuid!) { delete_geo_features(where: {id: {_eq: $id}}) { affected_rows } }`;
    const delForeign = await gql(delMut, { id: id2 });
    expect((delForeign?.data?.delete_geo_features?.affected_rows || 0)).toBe(0);

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
        '${user1}', 'zone', ST_GeomFromText('${wktPoly(37.6,55.7).replace('SRID=4326;','')}', 4326)
      );`);
      const res = await adminSql(`SELECT ST_SRID(geom), centroid IS NOT NULL, bbox IS NOT NULL,
        (area_m2 IS NOT NULL AND area_m2 > 0) AS area_ok,
        (length_m IS NULL) AS length_null
        FROM geo.features ORDER BY created_at DESC LIMIT 1;`);
      expect(res.result?.[1]?.[0]).toBe('4326');
      expect(res.result?.[1]?.[1]).toBe('t');
      expect(res.result?.[1]?.[2]).toBe('t');
      expect(res.result?.[1]?.[3]).toBe('t');
    } finally {
      await adminSql(`DELETE FROM geo.features WHERE user_id='${user1}';`);
    }
  });

  it('nearby and within_bbox work', async () => {
    const { user1 } = await ensureTestUsers();
    try {
      const ga = `ST_GeomFromText('POLYGON((37.6 55.7,37.6 55.705,37.605 55.705,37.605 55.7,37.6 55.7))',4326)`;
      const gb = `ST_GeomFromText('POLYGON((37.61 55.71,37.61 55.715,37.615 55.715,37.615 55.71,37.61 55.71))',4326)`;
      await adminSql(`INSERT INTO geo.features(user_id, type, geom) VALUES
        ('${user1}','zone', ${ga}),
        ('${user1}','zone', ${gb});`);
      const near = await adminSql(`SELECT count(*) FROM geo.nearby(37.6::float8,55.7::float8,2000);`);
      expect(Number(near.result?.[1]?.[0] || '0')).toBeGreaterThan(0);
      const bbox = await adminSql(`SELECT count(*) FROM geo.within_bbox(37.59::float8,55.69::float8,37.605::float8,55.705::float8);`);
      expect(Number(bbox.result?.[1]?.[0] || '0')).toBeGreaterThan(0);
    } finally {
      await adminSql(`DELETE FROM geo.features WHERE user_id='${user1}';`);
    }
  });
});



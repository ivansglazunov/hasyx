import { describe, it, expect } from '@jest/globals';
import { _authorize } from 'hasyx/lib/users/auth';
import { gql } from '@apollo/client/core';

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

async function ensureUser(email: string, name: string): Promise<string> {
  const rs = await adminSql(`
    WITH upsert_user AS (
      INSERT INTO public.users (id, email, name, created_at, updated_at)
      VALUES (gen_random_uuid(), '${email}', '${name}', EXTRACT(EPOCH FROM NOW())*1000, EXTRACT(EPOCH FROM NOW())*1000)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    )
    SELECT COALESCE((SELECT id FROM upsert_user), (SELECT id FROM public.users WHERE email='${email}' LIMIT 1)) AS id;
  `);
  return rs.result?.[1]?.[0] as string;
}

function wktPolygonAround(lon: number, lat: number, sizeDeg = 0.001): string {
  const lon2 = lon + sizeDeg;
  const lat2 = lat + sizeDeg;
  const wkt = `POLYGON((${lon} ${lat},${lon} ${lat2},${lon2} ${lat2},${lon2} ${lat},${lon} ${lat}))`;
  return `SRID=4326;${wkt}`;
}

(!!+(process.env?.JEST_LOCAL || '') ? describe.skip : describe)('Geo client via Hasyx (mark/path/zone)', () => {
  it('mark: insert/select/update/delete via GraphQL client', async () => {
    const userId = await ensureUser('geo-client-mark@test.local', 'GeoClientMark');
    const { hasyx, apollo } = await _authorize(userId);

    // Insert via admin SQL (client GraphQL lacks geometry scalar by default)
    const ins = await adminSql(`INSERT INTO geo.features(user_id, type, props, geom)
      VALUES ('${userId}', 'mark', '{}'::jsonb, ST_GeomFromText('POLYGON((30 60,30 60.005,30.005 60.005,30.005 60,30 60))',4326))
      RETURNING id;`);
    const id = ins?.result?.[1]?.[0] as string;
    expect(typeof id).toBe('string');

    // Select
    const selQ = await apollo.query<any>({
      query: gql`
        query ByPk($id: uuid!) { geo_features_by_pk(id: $id) { id type } }
      `,
      variables: { id },
      fetchPolicy: 'network-only'
    });
    expect(selQ.data?.geo_features_by_pk?.id).toBe(id);
    expect(selQ.data?.geo_features_by_pk?.type).toBe('mark');

    // Update (own row)
    const upd = await apollo.mutate<any>({
      mutation: gql`
        mutation Upd($id: uuid!) { update_geo_features(where: {id: {_eq: $id}}, _set: { type: "mark-upd" }) { affected_rows } }
      `,
      variables: { id },
      fetchPolicy: 'no-cache'
    });
    expect(upd.data?.update_geo_features?.affected_rows || 0).toBeGreaterThan(0);

    // Delete (own row)
    const del = await apollo.mutate<any>({
      mutation: gql`
        mutation Del($id: uuid!) { delete_geo_features(where: {id: {_eq: $id}}) { affected_rows } }
      `,
      variables: { id },
      fetchPolicy: 'no-cache'
    });
    expect(del.data?.delete_geo_features?.affected_rows || 0).toBeGreaterThan(0);
  });

  it('path: insert/select/update/delete via GraphQL client', async () => {
    const userId = await ensureUser('geo-client-path@test.local', 'GeoClientPath');
    const { hasyx, apollo } = await _authorize(userId);

    const ins = await adminSql(`INSERT INTO geo.features(user_id, type, props, geom)
      VALUES ('${userId}', 'path', '{"speed":10}'::jsonb, ST_GeomFromText('POLYGON((31 61,31 61.003,31.003 61.003,31.003 61,31 61))',4326))
      RETURNING id;`);
    const id = ins?.result?.[1]?.[0] as string;
    expect(typeof id).toBe('string');

    const sel = await apollo.query<any>({ query: gql`query B($id: uuid!) { geo_features_by_pk(id: $id) { id type } }`, variables: { id }, fetchPolicy: 'network-only' });
    expect(sel.data?.geo_features_by_pk?.type).toBe('path');

    const upd = await apollo.mutate<any>({ mutation: gql`mutation U($id: uuid!) { update_geo_features(where: {id: {_eq: $id}}, _set: { type: "path-upd" }) { affected_rows } }`, variables: { id }, fetchPolicy: 'no-cache' });
    expect(upd.data?.update_geo_features?.affected_rows || 0).toBeGreaterThan(0);

    const del = await apollo.mutate<any>({ mutation: gql`mutation D($id: uuid!) { delete_geo_features(where: {id: {_eq: $id}}) { affected_rows } }`, variables: { id }, fetchPolicy: 'no-cache' });
    expect(del.data?.delete_geo_features?.affected_rows || 0).toBeGreaterThan(0);
  });

  it('zone: insert/select/update/delete via GraphQL client', async () => {
    const userId = await ensureUser('geo-client-zone@test.local', 'GeoClientZone');
    const { hasyx, apollo } = await _authorize(userId);

    const ins = await adminSql(`INSERT INTO geo.features(user_id, type, props, geom)
      VALUES ('${userId}', 'zone', '{"name":"Z"}'::jsonb, ST_GeomFromText('POLYGON((32 62,32 62.006,32.006 62.006,32.006 62,32 62))',4326))
      RETURNING id;`);
    const id = ins?.result?.[1]?.[0] as string;
    expect(typeof id).toBe('string');

    const sel = await apollo.query<any>({ query: gql`query B($id: uuid!) { geo_features_by_pk(id: $id) { id type } }`, variables: { id }, fetchPolicy: 'network-only' });
    expect(sel.data?.geo_features_by_pk?.type).toBe('zone');

    const upd = await apollo.mutate<any>({ mutation: gql`mutation U($id: uuid!) { update_geo_features(where: {id: {_eq: $id}}, _set: { type: "zone-upd" }) { affected_rows } }`, variables: { id }, fetchPolicy: 'no-cache' });
    expect(upd.data?.update_geo_features?.affected_rows || 0).toBeGreaterThan(0);

    const del = await apollo.mutate<any>({ mutation: gql`mutation D($id: uuid!) { delete_geo_features(where: {id: {_eq: $id}}) { affected_rows } }`, variables: { id }, fetchPolicy: 'no-cache' });
    expect(del.data?.delete_geo_features?.affected_rows || 0).toBeGreaterThan(0);
  });
});



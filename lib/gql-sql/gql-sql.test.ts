import dotenv from 'dotenv';
import path from 'path';
import { Generator } from '../generator';
import schema from '../../public/hasura-schema.json';
import { createApolloClient, HasyxApolloClient } from '../apollo/apollo';
import { Hasyx } from '../hasyx/hasyx';
import { gqlToSql } from './index';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Helper to create admin hasyx for executing SQL
function createAdminHasyx(): Hasyx {
  const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
  const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;
  const apollo = createApolloClient({ url: HASURA_URL, secret: ADMIN_SECRET, ws: false }) as HasyxApolloClient;
  const generate = Generator(schema as any);
  return new Hasyx(apollo, generate);
}

// Per-user rules: each `it` creates and cleans its own state without before/after
(!!+(process?.env?.JEST_LOCAL || '') ? describe.skip : describe)('gqlToSql', () => {
  it('converts generated select query to executable SQL and runs it via Hasura.sql', async () => {
    const admin = createAdminHasyx();
    try {
      const generate = admin.generate;
      const gen = generate({
        operation: 'query',
        table: 'users',
        returning: ['id'],
        limit: 1,
      });

      const sql = await gqlToSql(gen.queryString, gen.variables);
      const res = await admin.sql(sql);

      expect(res).toBeDefined();
      // Hasura run_sql returns { result_type, result } for SELECT
      expect(res.result_type || res.result || res.message).toBeDefined();
    } finally {
      // terminate apollo connection for this test only
      admin.apolloClient?.terminate?.();
    }
  });

  it('converts complex GraphQL query with where clause to executable SQL', async () => {
    const admin = createAdminHasyx();
    try {
      const generate = admin.generate;
      const gen = generate({
        operation: 'query',
        table: 'users',
        where: { is_admin: { _eq: false } },
        returning: ['id', 'email', 'is_admin'],
        limit: 5,
        order_by: [{ id: 'desc' }],
      });

      const sql = await gqlToSql(gen.queryString, gen.variables);
      const res = await admin.sql(sql);

      expect(res).toBeDefined();
      expect(res.result_type || res.result || res.message).toBeDefined();
      
      // Verify the SQL contains expected elements
      expect(sql).toContain('users');
      expect(sql).toContain('id');
      expect(sql).toContain('email');
    } finally {
      admin.apolloClient?.terminate?.();
    }
  });
});



import axios from 'axios';

/**
 * Convert a GraphQL operation into an executable SQL statement via Hasura's explain API.
 *
 * This function calls Hasura `/v1/graphql/explain` to obtain the underlying SQL for a given
 * GraphQL operation. The explain endpoint returns the actual SQL that Hasura would execute,
 * which can then be run directly using `Hasura.sql(...)`.
 *
 * Notes:
 * - Requires environment variables `NEXT_PUBLIC_HASURA_GRAPHQL_URL` and `HASURA_ADMIN_SECRET`.
 * - Works for read operations (queries). Mutations may produce different execution plans.
 * - Returns the raw SQL query that can be executed directly.
 *
 * @param gqlOperation - A GraphQL operation string (including operation name and variables definition if any).
 * @param variables - Optional variables object used by the GraphQL operation.
 * @returns A SQL string that can be executed using `new Hasura(...).sql(sql)`.
 * @throws Error when Hasura explain is unavailable or returns an unexpected payload.
 */
export async function gqlToSql(gqlOperation: string, variables?: Record<string, any>): Promise<string> {
  const graphqlUrl = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  if (!graphqlUrl || !adminSecret) {
    throw new Error('Missing NEXT_PUBLIC_HASURA_GRAPHQL_URL or HASURA_ADMIN_SECRET environment variables.');
  }

  const baseUrl = graphqlUrl.replace(/\/v1\/graphql$/i, '');
  const explainUrl = `${baseUrl}/v1/graphql/explain`;

  // Try to detect operation name from the GraphQL string
  const opMatch = gqlOperation.match(/\b(query|mutation|subscription)\s+([A-Za-z0-9_]+)/i);
  const operationName = opMatch ? opMatch[2] : undefined;


  const response = await axios.post(explainUrl, {
    query: {
      query: gqlOperation,
      variables: variables ?? {},
      ...(operationName && { operationName }),
    }
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-Hasura-Admin-Secret': adminSecret,
    },
    timeout: 120000,
    validateStatus: (s) => s < 500,
  });

  const data = response.data;


  if (!response.status || response.status >= 400) {
    const msg = data?.error || data?.message || `HTTP ${response.status}`;
    throw new Error(`Hasura explain failed: ${msg}`);
  }

  // Parse the explain response format: [{ field: string, sql: string, plan?: string[] }]
  if (Array.isArray(data) && data.length > 0) {
    const firstResult = data[0];
    if (firstResult && typeof firstResult.sql === 'string') {
      const sql = firstResult.sql;
      return sql;
    }
  }

  throw new Error('Unexpected Hasura explain response format: SQL not found.');
}



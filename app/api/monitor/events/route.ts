import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint for monitoring Hasura Event Triggers
 * GET /api/monitor/events?query=stats|recent|failed|pending
 */

const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;

// Convert GraphQL URL to API URL
const HASURA_URL = HASURA_GRAPHQL_URL?.replace('/v1/graphql', '');

async function executeSql(sql: string) {
  if (!ADMIN_SECRET) {
    throw new Error('HASURA_ADMIN_SECRET is not configured');
  }

  const response = await fetch(`${HASURA_GRAPHQL_URL.replace('/v1/graphql', '')}/v2/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hasura-Admin-Secret': ADMIN_SECRET,
    },
    body: JSON.stringify({
      type: 'run_sql',
      args: {
        source: 'default',
        sql: sql,
        cascade: false,
        read_only: true,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SQL execution failed: ${response.status} ${error}`);
  }

  return await response.json();
}

function transformResult(data: any) {
  if (!data.result || data.result.length === 0) {
    return [];
  }
  
  const [headers, ...rows] = data.result;
  
  return rows.map((row: any[]) => {
    const obj: any = {};
    headers.forEach((header: string, i: number) => {
      obj[header] = row[i];
    });
    return obj;
  });
}

const queries = {
  stats: `
    SELECT 
      trigger_name,
      COUNT(*) as total_events,
      SUM(CASE WHEN delivered THEN 1 ELSE 0 END) as delivered_count,
      SUM(CASE WHEN error THEN 1 ELSE 0 END) as error_count,
      SUM(CASE WHEN locked IS NOT NULL THEN 1 ELSE 0 END) as locked_count,
      AVG(tries) as avg_tries,
      MAX(created_at) as last_event_at
    FROM hdb_catalog.event_log
    GROUP BY trigger_name
    ORDER BY last_event_at DESC;
  `,
  
  recent: `
    SELECT 
      id,
      trigger_name,
      delivered,
      error,
      tries,
      created_at,
      locked,
      next_retry_at
    FROM hdb_catalog.event_log
    WHERE trigger_name = 'options'
    ORDER BY created_at DESC
    LIMIT 20;
  `,
  
  failed: `
    SELECT 
      el.id,
      el.trigger_name,
      el.error,
      el.tries,
      el.created_at,
      el.next_retry_at,
      eil.status as http_status,
      eil.response::json->>'body' as response_body
    FROM hdb_catalog.event_log el
    LEFT JOIN LATERAL (
      SELECT status, response 
      FROM hdb_catalog.event_invocation_logs 
      WHERE event_id = el.id 
      ORDER BY created_at DESC 
      LIMIT 1
    ) eil ON true
    WHERE el.error = true
      AND el.trigger_name = 'options'
    ORDER BY el.created_at DESC
    LIMIT 10;
  `,
  
  pending: `
    SELECT 
      id,
      trigger_name,
      delivered,
      error,
      tries,
      created_at,
      locked,
      next_retry_at
    FROM hdb_catalog.event_log
    WHERE delivered = false 
      AND trigger_name = 'options'
    ORDER BY created_at DESC
    LIMIT 20;
  `,
  
  triggers: `
    SELECT 
      name,
      schema_name,
      table_name,
      configuration::json->>'webhook' as webhook,
      configuration::json->>'retry_conf' as retry_conf
    FROM hdb_catalog.event_triggers
    ORDER BY name;
  `,
  
  invocations: `
    SELECT 
      eil.id,
      eil.event_id,
      eil.status,
      eil.created_at,
      el.trigger_name,
      el.delivered,
      el.error
    FROM hdb_catalog.event_invocation_logs eil
    JOIN hdb_catalog.event_log el ON el.id = eil.event_id
    WHERE el.trigger_name = 'options'
    ORDER BY eil.created_at DESC
    LIMIT 20;
  `,
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryType = searchParams.get('query') || 'stats';
    const triggerName = searchParams.get('trigger');
    
    if (!queries[queryType as keyof typeof queries]) {
      return NextResponse.json(
        { error: 'Invalid query type. Available: stats, recent, failed, pending, triggers, invocations' },
        { status: 400 }
      );
    }
    
    let sql = queries[queryType as keyof typeof queries];
    
    // Replace trigger name if provided
    if (triggerName) {
      sql = sql.replace(/'options'/g, `'${triggerName}'`);
    }
    
    const result = await executeSql(sql);
    const data = transformResult(result);
    
    return NextResponse.json({
      success: true,
      query: queryType,
      trigger: triggerName || 'options',
      count: data.length,
      data,
    });
  } catch (error: any) {
    console.error('Error querying events:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for specific event details
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId } = body;
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId is required' },
        { status: 400 }
      );
    }
    
    const sql = `
      SELECT 
        el.id,
        el.trigger_name,
        el.delivered,
        el.error,
        el.tries,
        el.created_at,
        el.locked,
        el.next_retry_at,
        eil.request as webhook_request,
        eil.response as webhook_response,
        eil.status as http_status
      FROM hdb_catalog.event_log el
      LEFT JOIN LATERAL (
        SELECT request, response, status
        FROM hdb_catalog.event_invocation_logs 
        WHERE event_id = el.id 
        ORDER BY created_at DESC 
        LIMIT 1
      ) eil ON true
      WHERE el.id = '${eventId}';
    `;
    
    const result = await executeSql(sql);
    const data = transformResult(result);
    
    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      event: data[0],
    });
  } catch (error: any) {
    console.error('Error fetching event details:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import { onOneOffExecuted } from 'hasyx/lib/schedule';
import Debug from 'hasyx/lib/debug';
import schema from '@/public/hasura-schema.json';

const debug = Debug('api:one-off');
const generate = Generator(schema as any);

export async function POST(request: Request) {
  try {
    const secretHeader = request.headers.get('x-hasura-event-secret') || request.headers.get('X-Hasura-Event-Secret');
    const expected = process.env.HASURA_EVENT_SECRET || '';
    if (!expected || secretHeader !== expected) {
      debug('Invalid or missing X-Hasura-Event-Secret');
      return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => { headers[key] = value; });

    const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
    const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;
    if (!HASURA_URL || !ADMIN_SECRET) {
      debug('Missing Hasura admin env');
      return NextResponse.json({ success: false, error: 'server_misconfigured' }, { status: 500 });
    }

    const apolloClient = createApolloClient({
      url: HASURA_URL,
      secret: ADMIN_SECRET,
      ws: false
    }) as HasyxApolloClient;
    
    const hasyx = new Hasyx(apolloClient, generate);

    // Callback для записи в debug (в реальных условиях заменяется на бизнес логику)
    const debugCallback = async (event: any, schedule?: any) => {
      try {
        await hasyx.insert({
          table: 'debug',
          object: {
            value: {
              action: 'one_off_executed',
              timestamp: new Date().toISOString(),
              event: event,
              schedule: schedule,
              headers: headers,
              body: body,
              source: 'api/one-off'
            }
          }
        });
      } catch (error) {
        debug('Error writing to debug:', error);
      }
    };

    // Делегируем основную логику в библиотеку
    await onOneOffExecuted(hasyx, body, debugCallback);

    debug('One-off request processed');
    return NextResponse.json({ success: true });

  } catch (error: any) {
    debug('Error processing one-off request:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'internal_error' 
    }, { status: 500 });
  }
}



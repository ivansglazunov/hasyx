import { NextResponse } from 'next/server';
import { hasyxEvent, HasuraEventPayload } from 'hasyx/lib/events';
import { createApolloClient, HasyxApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import { onEventRowChange } from 'hasyx/lib/schedule';
import Debug from 'hasyx/lib/debug';
import schema from '@/public/hasura-schema.json';

const debug = Debug('api:events:events');
const generate = Generator(schema as any);

export const POST = hasyxEvent(async (payload: HasuraEventPayload) => {
  const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
  const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;
  
  if (!HASURA_URL || !ADMIN_SECRET) {
    debug('Missing Hasura admin env');
    return { success: false, error: 'server_misconfigured' };
  }

  const apolloClient = createApolloClient({
    url: HASURA_URL,
    secret: ADMIN_SECRET,
    ws: false
  }) as HasyxApolloClient;
  
  const hasyx = new Hasyx(apolloClient, generate);

  try {
    // Callback для записи в debug (в реальных условиях заменяется на бизнес логику)
    const debugCallback = async (event: any, schedule?: any) => {
      try {
        await hasyx.insert({
          table: 'debug',
          object: {
            value: {
              action: 'event_executed',
              timestamp: new Date().toISOString(),
              event: event,
              schedule: schedule,
              source: 'api/events/events'
            }
          }
        });
      } catch (error) {
        debug('Error writing to debug:', error);
      }
    };

    // Делегируем основную логику в библиотеку
    await onEventRowChange(hasyx, payload, debugCallback);

    return { success: true };
  } catch (error: any) {
    debug('Error processing event row change:', error);
    return { success: false, error: error?.message || 'unknown error' };
  } finally {
    (apolloClient as any)?.terminate?.();
  }
});

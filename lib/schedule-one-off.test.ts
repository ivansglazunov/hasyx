import dotenv from 'dotenv';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createApolloClient, HasyxApolloClient } from './apollo/apollo';
import { Hasyx } from './hasyx/hasyx';
import { Generator } from './generator';
import schema from '../public/hasura-schema.json';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const generate = Generator(schema as any);

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;

function createAdminHasyx(): Hasyx {
  const adminApolloClient = createApolloClient({
    url: HASURA_URL,
    secret: ADMIN_SECRET,
    ws: false,
  }) as HasyxApolloClient;
  return new Hasyx(adminApolloClient, generate);
}

describe('Schedule one-off end-to-end', () => {
  it('schedules one-off and receives callback to /api/schedule-one-off with debug row persisted', async () => {
    const adminHasyx = createAdminHasyx();
    const markerId = uuidv4();

    try {
      const scheduleAtEpochSec = Math.floor(Date.now() / 1000) + 60; // +1 minute
      await adminHasyx.scheduleOneOff({
        scheduleAtEpochSec,
        webhookPath: '/api/schedule-one-off',
        payload: {
          client_event_id: markerId,
          source: 'schedule-one-off.test',
        },
      });

      // Wait ~2x the scheduled time window (up to ~2 minutes) and poll for debug row
      const deadline = Date.now() + 120000; // 120s
      let foundId: string | null = null;

      while (Date.now() < deadline) {
        const rows = await adminHasyx.select<any[]>({
          table: 'debug',
          where: {
            value: {
              _contains: { body: { payload: { client_event_id: markerId } } },
            },
          },
          returning: ['id', 'value'],
          order_by: [{ id: 'desc' }],
          limit: 1,
        });

        if (Array.isArray(rows) && rows.length > 0) {
          foundId = rows[0].id;
          break;
        }
        await new Promise((res) => setTimeout(res, 2000));
      }

      expect(foundId).toBeTruthy();

      // Optional: cleanup created debug row(s)
      if (foundId) {
        await adminHasyx.delete({
          table: 'debug',
          where: { id: { _eq: foundId } },
          returning: ['id'],
        });
      }
    } finally {
      // terminate apollo
      (adminHasyx.apolloClient as any)?.terminate?.();
    }
  }, 210000);
});



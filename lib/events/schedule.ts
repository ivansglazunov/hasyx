import { HasuraEventPayload } from '../events';
import { Hasura } from '../hasura/hasura';
import Debug from '../debug';

const debug = Debug('api:events:schedule');

export async function handleScheduleEvent(payload: HasuraEventPayload) {
  const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
  const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;
  if (!HASURA_URL || !ADMIN_SECRET) {
    debug('Missing Hasura admin env');
    return { success: false, error: 'server_misconfigured' };
  }

  const hasura = new Hasura({ url: HASURA_URL, secret: ADMIN_SECRET });

  // Первичная имплементация: протоколирование входа в таблицу debug для наблюдения
  const eventMeta = {
    trigger: payload.trigger?.name,
    table: payload.table,
    op: payload.event?.op,
    data: payload.event?.data,
    session_variables: payload.event?.session_variables,
  };

  await hasura.v1({
    type: 'insert',
    args: {
      table: { schema: 'public', name: 'debug' },
      objects: [{ value: { schedule_event: eventMeta } }],
      returning: ['id'],
    },
  });

  // На следующем шаге сюда добавим обработку INSERT/UPDATE/DELETE согласно SCHEDULE.md
  return { success: true };
}

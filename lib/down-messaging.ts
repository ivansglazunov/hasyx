import dotenv from 'dotenv';
import { Hasura } from './hasura/hasura';
import Debug from './debug';

dotenv.config();

const debug = Debug('migration:down-messaging');

export async function downMessagingSchema(hasura: Hasura) {
  debug('🗑️ Dropping messaging base tables…');
  // Drop dependent triggers first to avoid dependency errors
  try { await hasura.deleteTrigger({ schema: 'public', table: 'messages', name: 'messages_set_updated_at' }); } catch {}
  try { await hasura.deleteTrigger({ schema: 'public', table: 'replies', name: 'replies_set_updated_at' }); } catch {}
  try { await hasura.deleteTrigger({ schema: 'public', table: 'rooms', name: 'rooms_set_updated_at' }); } catch {}
  try { await hasura.deleteTrigger({ schema: 'public', table: 'messages', name: 'set_messages_user_id' }); } catch {}
  try { await hasura.deleteTrigger({ schema: 'public', table: 'replies', name: 'set_replies_user_id' }); } catch {}
  try { await hasura.deleteTrigger({ schema: 'public', table: 'message_reads', name: 'set_message_reads_user_id' }); } catch {}

  // Now drop tables (include message_reads) respecting FK dependencies
  for (const table of ['replies', 'messages', 'message_reads', 'rooms']) {
    try {
      await hasura.deleteTable({ schema: 'public', table });
    } catch (_) {/* ignore if missing */}
  }
  debug('✅ Base tables dropped.');
  // Drop triggers & functions
  try { await hasura.deleteFunction({ schema: 'public', name: 'set_current_timestamp_updated_at', cascade: true }); } catch {}
  // Drop sequence created for messages.i
  try { await hasura.sql(`DROP SEQUENCE IF EXISTS public.messages_i_seq;`); } catch {}
}

export async function down(customHasura?: Hasura) {
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  await downMessagingSchema(hasura);
} 
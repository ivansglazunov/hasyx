import dotenv from 'dotenv';
import { Hasura } from './hasura/hasura';
import Debug from './debug';

dotenv.config();

const debug = Debug('migration:down-messaging');

export async function downMessagingSchema(hasura: Hasura) {
  debug('🗑️ Dropping messaging base tables…');
  for (const table of ['replies', 'messages', 'rooms']) {
    try {
      await hasura.deleteTable({ schema: 'public', table });
    } catch (_) {/* ignore if missing */}
  }
  debug('✅ Base tables dropped.');
  // Drop triggers & functions
  await hasura.sql(`
    DROP TRIGGER IF EXISTS rooms_set_updated_at ON public.rooms;
    DROP TRIGGER IF EXISTS messages_set_updated_at ON public.messages;
    
    DROP FUNCTION IF EXISTS public.set_current_timestamp_updated_at CASCADE;
  `);
}

export async function down(customHasura?: Hasura) {
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  await downMessagingSchema(hasura);
} 
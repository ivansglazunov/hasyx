import { Hasura } from './hasura/hasura';
import Debug from './debug';

const debug = Debug('migration:down-schedule');

async function untrackAndDropRelations(hasura: Hasura) {
  // Drop permissions first
  try { await hasura.deletePermission({ schema: 'public', table: 'events', operation: 'select', role: 'user' }); } catch {}
  try { await hasura.deletePermission({ schema: 'public', table: 'events', operation: 'insert', role: 'user' }); } catch {}
  try { await hasura.deletePermission({ schema: 'public', table: 'events', operation: 'update', role: 'user' }); } catch {}
  try { await hasura.deletePermission({ schema: 'public', table: 'events', operation: 'delete', role: 'user' }); } catch {}
  try { await hasura.deletePermission({ schema: 'public', table: 'schedule', operation: 'select', role: 'user' }); } catch {}
  try { await hasura.deletePermission({ schema: 'public', table: 'schedule', operation: 'insert', role: 'user' }); } catch {}
  try { await hasura.deletePermission({ schema: 'public', table: 'schedule', operation: 'update', role: 'user' }); } catch {}
  try { await hasura.deletePermission({ schema: 'public', table: 'schedule', operation: 'delete', role: 'user' }); } catch {}

  // Drop relationships if they exist
  try { await hasura.deleteRelationship({ schema: 'public', table: 'events', name: 'schedule' }); } catch {}
  try { await hasura.deleteRelationship({ schema: 'public', table: 'schedule', name: 'events' }); } catch {}

  // Untrack tables
  try { await hasura.untrackTable({ schema: 'public', table: 'events' }); } catch {}
  try { await hasura.untrackTable({ schema: 'public', table: 'schedule' }); } catch {}
}

async function dropTables(hasura: Hasura) {
  // Drop foreign keys first
  try { await hasura.deleteForeignKey({ schema: 'public', table: 'events', name: 'events_schedule_id_fkey' }); } catch {}
  // Drop tables
  try { await hasura.deleteTable({ schema: 'public', table: 'events' }); } catch {}
  try { await hasura.deleteTable({ schema: 'public', table: 'schedule' }); } catch {}
}

export async function down(customHasura?: Hasura) {
  debug('🚀 Starting Schedule migration DOWN...');
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  try {
    await untrackAndDropRelations(hasura);
    await dropTables(hasura);
    debug('✨ Schedule migration DOWN complete.');
    return true;
  } catch (err) {
    console.error('❗ Schedule DOWN migration failed:', err);
    return false;
  }
}



import Debug from '../debug';
import { Hasura } from '../hasura/hasura';

const debug = Debug('migration:down-items');

export async function down(customHasura?: Hasura) {
  debug('🧹 Starting Hasura items migration DOWN...');
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  const schema = 'public';
  const table = 'items';

  // Clean relationships (best-effort)
  // Note: items.hasyx relationship is cleaned by down-hasyx.ts
  try { await hasura.v1({ type: 'pg_drop_relationship', args: { source: 'default', table: { schema: 'public', name: 'options' }, relationship: 'item' } }); } catch {}
  try { await hasura.v1({ type: 'pg_drop_relationship', args: { source: 'default', table: { schema: 'public', name: 'items' }, relationship: 'options' } }); } catch {}
  try { await hasura.v1({ type: 'pg_drop_relationship', args: { source: 'default', table: { schema: 'public', name: 'options' }, relationship: 'geo' } }); } catch {}

  // Drop triggers and functions
  await hasura.deleteTrigger({ schema, table, name: `trg_${table}_before_delete` }).catch(() => {});
  await hasura.deleteTrigger({ schema, table, name: `trg_${table}_after_update_parent` }).catch(() => {});
  await hasura.deleteTrigger({ schema, table, name: `trg_${table}_before_write` }).catch(() => {});
  await hasura.deleteTrigger({ schema, table, name: `${table}_set_updated_at` }).catch(() => {});
  await hasura.deleteFunction({ schema, name: 'items_before_delete' }).catch(() => {});
  await hasura.deleteFunction({ schema, name: 'items_after_update_parent' }).catch(() => {});
  await hasura.deleteFunction({ schema, name: 'items_before_write' }).catch(() => {});
  await hasura.deleteFunction({ schema, name: 'items_rebuild_descendants' }).catch(() => {});
  await hasura.deleteFunction({ schema, name: 'items_compute_parents_ids' }).catch(() => {});

  // Drop table
  await hasura.deleteTable({ schema, table, cascade: true });

  debug('✅ Hasura items migration DOWN completed.');
  return true;
}



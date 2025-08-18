import Debug from '../debug';
import { Hasura } from '../hasura/hasura';

const debug = Debug('migration:down-geo');

export async function down(customHasura?: Hasura) {
  debug('🚀 Starting Hasura geo migration DOWN...');
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.ensureDefaultSource();

  try { await hasura.untrackTable({ schema: 'geo', table: 'features' }); } catch {}
  try { await hasura.deleteTrigger({ schema: 'geo', table: 'features', name: 'trg_geo_features_before_write' }); } catch {}
  try { await hasura.deleteFunction({ schema: 'geo', name: 'features_before_write' }); } catch {}
  try { await hasura.deleteFunction({ schema: 'geo', name: 'nearby' }); } catch {}
  try { await hasura.deleteFunction({ schema: 'geo', name: 'within_bbox' }); } catch {}
  try { await hasura.deleteTable({ schema: 'geo', table: 'features', cascade: true }); } catch {}
  // Drop schema to ensure full cleanup after unmigrate using Hasura helper
  try { await hasura.deleteSchema({ schema: 'geo', cascade: true }); } catch {}

  debug('✨ Hasura geo migration DOWN completed successfully!');
  return true;
}



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
  try { await hasura.sql(`DROP TRIGGER IF EXISTS trg_geo_features_before_write ON geo.features;`); } catch {}
  try { await hasura.deleteFunction({ schema: 'geo', name: 'features_before_write' }); } catch {}
  try { await hasura.deleteFunction({ schema: 'geo', name: 'nearby' }); } catch {}
  try { await hasura.deleteFunction({ schema: 'geo', name: 'within_bbox' }); } catch {}
  try { await hasura.sql(`DROP TABLE IF EXISTS geo.features CASCADE;`); } catch {}
  // Keep schema for possible future use; if needed: DROP SCHEMA geo CASCADE;

  debug('✨ Hasura geo migration DOWN completed successfully!');
  return true;
}



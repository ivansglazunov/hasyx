import { Hasura } from '../hasura/hasura';
import Debug from '../debug';

const debug = Debug('migration:down-postgis');

async function dropPostgisExtension(hasura: Hasura) {
  debug('🧹 Dropping postgis extension...');
  try {
    await hasura.sql(`DROP EXTENSION IF EXISTS postgis CASCADE;`);
    debug('✅ postgis extension dropped (or did not exist)');
  } catch (error: any) {
    const msg = error?.message || error?.response?.data?.error || String(error);
    debug(`⚠️ Could not drop postgis extension: ${msg}`);
  }
}

export async function down(customHasura?: Hasura) {
  debug('🚀 Starting Hasura postgis migration DOWN...');
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  try {
    await hasura.ensureDefaultSource();
    await dropPostgisExtension(hasura);
    debug('✨ Hasura postgis migration DOWN completed successfully!');
    return true;
  } catch (error) {
    console.error('❗ Critical error during postgis DOWN migration:', error);
    debug('❌ postgis DOWN Migration failed.');
    return false;
  }
}



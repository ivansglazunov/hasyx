import { Hasura } from '../hasura/hasura';
import Debug from '../debug';

const debug = Debug('migration:up-postgis');

async function installPostgisExtension(hasura: Hasura) {
  debug('🔧 Installing postgis extension...');
  try {
    await hasura.sql(`CREATE EXTENSION IF NOT EXISTS postgis;`);
    const version = await hasura.sql(`SELECT postgis_full_version();`);
    debug('✅ postgis installed. version:', version?.result?.[1]?.[0] || 'unknown');
  } catch (error: any) {
    const msg = error?.message || error?.response?.data?.error || String(error);
    debug(`⚠️ Could not install postgis extension: ${msg}`);
    debug('Note: In Hasura Cloud or some managed databases CREATE EXTENSION may be restricted.');
  }
}

export async function up(customHasura?: Hasura) {
  debug('🚀 Starting Hasura postgis migration UP...');
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  try {
    await hasura.ensureDefaultSource();
    await installPostgisExtension(hasura);
    debug('✨ Hasura postgis migration UP completed successfully!');
    return true;
  } catch (error) {
    console.error('❗ Critical error during postgis UP migration:', error);
    debug('❌ postgis UP Migration failed.');
    return false;
  }
}



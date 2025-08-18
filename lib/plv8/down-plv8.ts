import dotenv from 'dotenv';
import { Hasura } from '../hasura/hasura';
import { removeAllValidationTriggers } from '../validation';
import Debug from '../debug';

// Initialize debug
const debug = Debug('migration:down-plv8');

export async function dropPlv8TestSchema(hasura: Hasura) {
  debug('🧹 Dropping plv8 test schema...');
  
  try {
    await hasura.deleteSchema({ schema: 'plv8_test', cascade: true });
    debug('✅ plv8 test schema dropped');
  } catch (error) {
    debug('⚠️ Could not drop plv8 test schema:', error);
  }
}

export async function dropPlv8Extension(hasura: Hasura) {
  debug('🧹 Dropping plv8 extension...');
  
  // Check if plv8 extension exists
  const extensionExists = await hasura.sql(`
    SELECT EXISTS (
      SELECT FROM pg_extension 
      WHERE extname = 'plv8'
    );
  `);
  
  if (extensionExists.result?.[1]?.[0] === 't') {
    try {
      await hasura.sql(`DROP EXTENSION IF EXISTS plv8 CASCADE;`);
      debug('✅ plv8 extension dropped');
    } catch (error) {
      debug('⚠️ Could not drop plv8 extension:', error);
      debug('Note: plv8 extension may be required by other parts of the system');
    }
  } else {
    debug('✅ plv8 extension does not exist');
  }
}

export async function down(customHasura?: Hasura) {
  debug('🚀 Starting Hasura plv8 migration DOWN...');
  
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  
  try {
    // Ensure default data source exists before any operations
    await hasura.ensureDefaultSource();
    
    await dropPlv8TestSchema(hasura);
    // Validation cleanup: drop our triggers and functions (keep validation.schemas content)
    try {
      await removeAllValidationTriggers(hasura);
    } catch {}
    try {
      await hasura.sql(`DROP FUNCTION IF EXISTS validation.validate_column() CASCADE;`);
      await hasura.sql(`DROP FUNCTION IF EXISTS validation.validate_json(JSONB, TEXT, TEXT) CASCADE;`);
    } catch {}
    // Drop validation schema entirely
    try {
      await hasura.deleteSchema({ schema: 'validation', cascade: true });
    } catch {}
    // Finally, drop extension if policy allows (optional)
    await dropPlv8Extension(hasura);
    
    debug('✨ Hasura plv8 migration DOWN completed successfully!');
    return true;
  } catch (error) {
    console.error('❗ Critical error during plv8 DOWN migration:', error);
    debug('❌ plv8 DOWN Migration failed.');
    return false;
  }
} 
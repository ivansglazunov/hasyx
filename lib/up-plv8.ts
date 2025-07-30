import dotenv from 'dotenv';
import { Hasura, ColumnType } from './hasura';
import Debug from './debug';

// Initialize debug
const debug = Debug('migration:up-plv8');

export async function installPlv8Extension(hasura: Hasura) {
  debug('🔧 Installing plv8 extension...');
  
  // Check if plv8 extension already exists
  const extensionExists = await hasura.sql(`
    SELECT EXISTS (
      SELECT FROM pg_extension 
      WHERE extname = 'plv8'
    );
  `);
  
  if (extensionExists.result?.[1]?.[0] === 't') {
    debug('✅ plv8 extension already exists');
    return;
  }
  
  // Try to install plv8 extension
  try {
    await hasura.sql(`CREATE EXTENSION IF NOT EXISTS plv8;`);
    debug('✅ plv8 extension installed successfully');
  } catch (error: any) {
    const errorMessage = error.message || error.response?.data?.error || '';
    debug(`⚠️ Could not install plv8 extension: ${errorMessage}`);
    debug('Note: plv8 may not be available in Hasura Cloud environment');
    
    // Check if we're in a cloud environment
    const isCloudEnvironment = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL?.includes('hasura.io') || 
                              process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL?.includes('deep.foundation');
    
    if (isCloudEnvironment) {
      debug('🌐 Detected cloud environment - plv8 may not be available');
      debug('Note: plv8 functionality will be limited in cloud environments');
    }
  }
}

export async function createPlv8TestSchema(hasura: Hasura) {
  debug('🔧 Creating plv8 test schema...');
  
  // Create a test schema for plv8 functions
  await hasura.defineSchema({ schema: 'plv8_test' });
  debug('✅ plv8 test schema created');
}

export async function createPlv8TestFunction(hasura: Hasura) {
  debug('🔧 Creating plv8 test function...');
  
  try {
    // Create a simple plv8 function for testing
    await hasura.defineFunction({
      schema: 'plv8_test',
      name: 'test_plv8_function',
      definition: `() RETURNS TEXT AS $$
        var result = "Hello from plv8!";
        return result;
      $$`,
      language: 'plv8'
    });
    
    debug('✅ plv8 test function created');
  } catch (error: any) {
    const errorMessage = error.message || error.response?.data?.error || '';
    debug(`⚠️ Could not create plv8 function: ${errorMessage}`);
    debug('Note: plv8 functions may not be available in this environment');
  }
}

export async function up(customHasura?: Hasura) {
  debug('🚀 Starting Hasura plv8 migration UP...');
  
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  
  try {
    // Ensure default data source exists before any operations
    await hasura.ensureDefaultSource();
    
    await installPlv8Extension(hasura);
    await createPlv8TestSchema(hasura);
    await createPlv8TestFunction(hasura);
    
    debug('✨ Hasura plv8 migration UP completed successfully!');
    return true;
  } catch (error) {
    console.error('❗ Critical error during plv8 UP migration:', error);
    debug('❌ plv8 UP Migration failed.');
    return false;
  }
} 
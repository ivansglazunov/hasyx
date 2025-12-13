#!/usr/bin/env tsx
/**
 * Cleanup script to remove all test schemas from Hasura database
 * 
 * Usage:
 *   npm run cleanup:test-schemas
 *   or
 *   tsx scripts/cleanup-test-schemas.ts
 */

import { Hasura } from '../lib/hasura/hasura';
import * as dotenv from 'dotenv';
import * as path from 'path';
import Debug from '../lib/debug';

const debug = Debug('cleanup:test-schemas');

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function cleanupTestSchemas() {
  if (!process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || !process.env.HASURA_ADMIN_SECRET) {
    console.error('❌ Missing required environment variables:');
    console.error('   NEXT_PUBLIC_HASURA_GRAPHQL_URL:', process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL ? '✅' : '❌');
    console.error('   HASURA_ADMIN_SECRET:', process.env.HASURA_ADMIN_SECRET ? '✅' : '❌');
    process.exit(1);
  }

  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
    secret: process.env.HASURA_ADMIN_SECRET,
  });

  try {
    console.log('🧹 Cleaning up test schemas...');
    
    // Get all test schemas
    const result = await hasura.sql(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name LIKE 'test_%' 
      AND schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name;
    `);
    
    if (!result.result || result.result.length <= 1) {
      console.log('✅ No test schemas found');
      return;
    }

    const schemas = result.result.slice(1).map(row => row[0]);
    console.log(`Found ${schemas.length} test schemas to clean up:`);
    schemas.forEach(schema => console.log(`  - ${schema}`));
    
    // Clean up each schema
    let cleaned = 0;
    let failed = 0;
    
    for (const schema of schemas) {
      try {
        // Untrack tables first
        try {
          const tables = await hasura.tables({ schema });
          for (const table of tables) {
            try {
              await hasura.untrackTable({ schema, table });
              debug(`Untracked ${schema}.${table}`);
            } catch (untrackError: any) {
              debug(`⚠️ Failed to untrack ${schema}.${table}: ${untrackError.message || untrackError}`);
            }
          }
        } catch (tablesError: any) {
          debug(`⚠️ Could not get tables for ${schema}: ${tablesError.message || tablesError}`);
        }
        
        // Delete schema
        await hasura.deleteSchema({ schema, cascade: true });
        console.log(`✅ Cleaned up: ${schema}`);
        cleaned++;
      } catch (error: any) {
        console.error(`❌ Failed to clean up ${schema}: ${error.message || error}`);
        failed++;
      }
    }
    
    // Clean up inconsistent metadata
    console.log('\n🧹 Cleaning up inconsistent metadata...');
    try {
      await hasura.dropInconsistentMetadata();
      await hasura.reloadMetadata();
      console.log('✅ Metadata cleaned');
    } catch (metadataError: any) {
      console.error(`⚠️ Failed to clean metadata: ${metadataError.message || metadataError}`);
    }
    
    console.log(`\n✅ Cleanup complete: ${cleaned} schemas cleaned, ${failed} failed`);
    
  } catch (error: any) {
    console.error(`❌ Error during cleanup: ${error.message || error}`);
    process.exit(1);
  }
}

cleanupTestSchemas();


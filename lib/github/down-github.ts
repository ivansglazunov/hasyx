import dotenv from 'dotenv';
import path from 'path';
import { Hasura } from '../hasura/hasura';
import Debug from '../debug';

// Initialize debug
const debug = Debug('migration:down-github');

/**
 * Drop permissions and relationships using high-level methods
 */
export async function dropMetadata(hasura: Hasura) {
  debug('🧹 Dropping GitHub issues permissions and untracking tables...');
  
  debug('  🗑️ Dropping permissions...');
  
  // Drop permissions for github_issues
  await hasura.deletePermission({
    schema: 'public',
    table: 'github_issues',
    operation: 'select',
    role: ['user', 'admin', 'anonymous']
  });
  
  debug('  📊 Untracking tables...');
  
  // Untrack github_issues table
  await hasura.untrackTable({
    schema: 'public',
    table: 'github_issues'
  });
  
  debug('✅ GitHub issues metadata dropped successfully');
}

/**
 * Drop GitHub issues tables using high-level methods
 */
export async function dropTables(hasura: Hasura) {
  debug('🗑️ Dropping GitHub issues tables using high-level methods...');
  
  // First try high-level method
  try {
    await hasura.deleteTable({
      schema: 'public',
      table: 'github_issues'
    });
    debug('✅ GitHub issues table dropped using high-level method');
  } catch (error) {
    debug(`⚠️ High-level delete failed: ${error}, trying direct SQL...`);
    
    // Fallback to direct SQL for guaranteed removal
    try {
      // Drop trigger first
      await hasura.sql(`DROP TRIGGER IF EXISTS set_user_id_on_github_issues ON public.github_issues;`);
      await hasura.sql(`DROP FUNCTION IF EXISTS public.set_user_id_trigger();`);
      
      // Drop all constraints first
      await hasura.sql(`
        DO $$ 
        DECLARE 
          r RECORD;
        BEGIN
          -- Drop ALL foreign key constraints on github_issues
          FOR r IN (
            SELECT tc.constraint_name, tc.table_name
            FROM information_schema.table_constraints tc
            WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND tc.table_schema = 'public' 
            AND tc.table_name = 'github_issues'
          ) LOOP
            BEGIN
              EXECUTE 'ALTER TABLE public.github_issues DROP CONSTRAINT IF EXISTS "' || r.constraint_name || '" CASCADE';
            EXCEPTION WHEN OTHERS THEN
              -- Ignore errors
            END;
          END LOOP;
          
          -- Drop ALL triggers on github_issues
          FOR r IN (
            SELECT trigger_name
            FROM information_schema.triggers
            WHERE event_object_schema = 'public' 
            AND event_object_table = 'github_issues'
          ) LOOP
            BEGIN
              EXECUTE 'DROP TRIGGER IF EXISTS "' || r.trigger_name || '" ON public.github_issues CASCADE';
            EXCEPTION WHEN OTHERS THEN
              -- Ignore errors
            END;
          END LOOP;
        END $$;
      `);
      
      // Now drop the table with maximum force
      await hasura.sql(`DROP TABLE IF EXISTS public.github_issues CASCADE;`);
      
      debug('✅ GitHub issues table dropped using direct SQL');
    } catch (sqlError) {
      debug(`❌ Direct SQL drop also failed: ${sqlError}`);
      throw sqlError;
    }
  }
  
  debug('✅ GitHub issues tables dropped successfully');
}

/**
 * Main migration function to remove GitHub issues tables
 */
export async function down(customHasura?: Hasura) {
  debug('🚀 Starting GitHub issues down migration...');
  
  const hasura = customHasura || new Hasura({
    secret: process.env.HASURA_ADMIN_SECRET!,
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!
  });
  
  try {
    await dropMetadata(hasura);
    await dropTables(hasura);
    
    console.log('✅ GitHub issues down migration completed successfully!');
  } catch (error) {
    console.error('❌ GitHub issues down migration failed:', error);
    throw error;
  }
}

import dotenv from 'dotenv';
import path from 'path';
import { Hasura } from './hasura';
import Debug from './debug';

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
  
  // Drop github_issues table
  await hasura.deleteTable({
    schema: 'public',
    table: 'github_issues'
  });
  
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

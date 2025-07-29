import dotenv from 'dotenv';
import path from 'path';
import { Hasura } from './hasura';
import Debug from './debug';

// Initialize debug
const debug = Debug('migration:down-storage');

/**
 * Drop permissions and relationships using high-level methods
 */
export async function dropMetadata(hasura: Hasura) {
  debug('🧹 Dropping storage permissions, relationships, and untracking tables...');
  
  debug('  🗑️ Dropping permissions...');
  
  // Drop permissions for files
  await hasura.deletePermission({
    schema: 'public',
    table: 'files',
    operation: 'select',
    role: ['user', 'admin', 'anonymous']
  });
  
  await hasura.deletePermission({
    schema: 'public',
    table: 'files',
    operation: 'insert',
    role: ['user', 'admin', 'anonymous']
  });
  
  await hasura.deletePermission({
    schema: 'public',
    table: 'files',
    operation: 'update',
    role: ['user', 'admin', 'anonymous']
  });
  
  await hasura.deletePermission({
    schema: 'public',
    table: 'files',
    operation: 'delete',
    role: ['user', 'admin', 'anonymous']
  });
  
  // Drop permissions for file_versions
  await hasura.deletePermission({
    schema: 'public',
    table: 'file_versions',
    operation: 'select',
    role: ['user', 'admin', 'anonymous']
  });
  
  await hasura.deletePermission({
    schema: 'public',
    table: 'file_versions',
    operation: 'insert',
    role: ['user', 'admin', 'anonymous']
  });
  
  await hasura.deletePermission({
    schema: 'public',
    table: 'file_versions',
    operation: 'update',
    role: ['user', 'admin', 'anonymous']
  });
  
  await hasura.deletePermission({
    schema: 'public',
    table: 'file_versions',
    operation: 'delete',
    role: ['user', 'admin', 'anonymous']
  });
  
  // Drop permissions for viruses
  await hasura.deletePermission({
    schema: 'public',
    table: 'viruses',
    operation: 'select',
    role: ['user', 'admin', 'anonymous']
  });
  
  await hasura.deletePermission({
    schema: 'public',
    table: 'viruses',
    operation: 'insert',
    role: ['user', 'admin', 'anonymous']
  });
  
  await hasura.deletePermission({
    schema: 'public',
    table: 'viruses',
    operation: 'update',
    role: ['user', 'admin', 'anonymous']
  });
  
  await hasura.deletePermission({
    schema: 'public',
    table: 'viruses',
    operation: 'delete',
    role: ['user', 'admin', 'anonymous']
  });
  
  debug('  ✅ Permissions dropped.');
  
  debug('  🗑️ Dropping relationships...');
  
  // Drop relationships from storage tables
  await hasura.deleteRelationship({
    schema: 'public',
    table: 'files',
    name: 'user'
  });
  
  await hasura.deleteRelationship({
    schema: 'public',
    table: 'file_versions',
    name: 'file'
  });
  
  await hasura.deleteRelationship({
    schema: 'public',
    table: 'viruses',
    name: 'file'
  });
  
  // Drop reverse relationships
  await hasura.deleteRelationship({
    schema: 'public',
    table: 'files',
    name: 'versions'
  });
  
  await hasura.deleteRelationship({
    schema: 'public',
    table: 'files',
    name: 'viruses'
  });
  
  await hasura.deleteRelationship({
    schema: 'public',
    table: 'users',
    name: 'files'
  });
  
  debug('  ✅ Relationships dropped.');

  debug('  🗑️ Untracking storage tables...');
  await hasura.untrackTable({ schema: 'public', table: 'viruses' });
  await hasura.untrackTable({ schema: 'public', table: 'file_versions' });
  await hasura.untrackTable({ schema: 'public', table: 'files' });
  debug('✅ Tables untracked.');
}

/**
 * Drop storage tables using high-level methods
 */
export async function dropTables(hasura: Hasura) {
  debug('🧹 Dropping storage tables...');
  
  // Drop triggers first
  await hasura.deleteTrigger({
    schema: 'public',
    table: 'files',
    name: 'set_public_files_updated_at'
  });
  
  // Drop foreign key constraints
  await hasura.deleteForeignKey({
    schema: 'public',
    table: 'viruses',
    name: 'viruses_file_id_fkey'
  });
  
  await hasura.deleteForeignKey({
    schema: 'public',
    table: 'file_versions',
    name: 'file_versions_file_id_fkey'
  });
  
  await hasura.deleteForeignKey({
    schema: 'public',
    table: 'files',
    name: 'files_user_id_fkey'
  });
  
  // Drop tables in proper order (dependent tables first)
  await hasura.deleteTable({ schema: 'public', table: 'viruses' });
  await hasura.deleteTable({ schema: 'public', table: 'file_versions' });
  await hasura.deleteTable({ schema: 'public', table: 'files' });
  
  // Drop trigger function
  await hasura.deleteFunction({
    schema: 'public',
    name: 'set_current_timestamp_updated_at'
  });
  
  debug('✅ Storage tables dropped successfully.');
}

/**
 * Main migration function to remove storage tables
 */
export async function down(customHasura?: Hasura) {
  debug('🚀 Starting Hasura Storage migration DOWN...');
  
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, 
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  
  try {
    // First remove metadata (permissions, relationships, tracking),
    // as they depend on tables
    await dropMetadata(hasura);

    // Then drop the tables themselves
    await dropTables(hasura);

    debug('✨ Hasura Storage migration DOWN completed successfully!');
    return true;
  } catch (error) {
    console.error('❗ Critical error during Storage DOWN migration:', error);
    debug('❌ Storage DOWN Migration failed.');
    return false;
  }
} 
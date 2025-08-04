import Debug from 'debug';
import { Hasura } from './hasura';

const debug = Debug('hasyx:migration:down-storage');

async function untrackStorageTables(hasura: Hasura) {
  debug('🔄 Untracking storage tables...');

  // Untrack storage tables in reverse order (to avoid dependency issues)
  await hasura.untrackTable({ schema: 'storage', table: 'virus' });
  await hasura.untrackTable({ schema: 'storage', table: 'files' });
  await hasura.untrackTable({ schema: 'storage', table: 'buckets' });
  await hasura.untrackTable({ schema: 'storage', table: 'schema_migrations' });

  debug('✅ Storage tables untracked.');
}

async function dropStoragePermissions(hasura: Hasura) {
  debug('🗑️ Dropping permissions for all roles (storage, user, anonymous)...');

  // All roles that had access to files
  const roles = ['storage', 'user', 'anonymous'];
  
  for (const role of roles) {
    // Drop permissions on storage.buckets
    await hasura.deletePermission({
      schema: 'storage',
      table: 'buckets',
      operation: 'select',
      role
    });

    await hasura.deletePermission({
      schema: 'storage',
      table: 'buckets',
      operation: 'insert',
      role
    });

    await hasura.deletePermission({
      schema: 'storage',
      table: 'buckets',
      operation: 'update',
      role
    });

    // Drop permissions on storage.files
    await hasura.deletePermission({
      schema: 'storage',
      table: 'files',
      operation: 'select',
      role
    });

    await hasura.deletePermission({
      schema: 'storage',
      table: 'files',
      operation: 'insert',
      role
    });

    await hasura.deletePermission({
      schema: 'storage',
      table: 'files',
      operation: 'update',
      role
    });

    await hasura.deletePermission({
      schema: 'storage',
      table: 'files',
      operation: 'delete',
      role
    });

    // Drop permissions on storage.virus
    await hasura.deletePermission({
      schema: 'storage',
      table: 'virus',
      operation: 'select',
      role
    });

    await hasura.deletePermission({
      schema: 'storage',
      table: 'virus',
      operation: 'insert',
      role
    });
  }

  debug('✅ Permissions dropped for all roles (storage, user, anonymous).');
}

async function dropStorageRelationships(hasura: Hasura) {
  debug('🗑️ Dropping storage relationships...');

  // Drop relationships created in createStorageRelationships()
  await hasura.deleteRelationship({
    schema: 'storage',
    table: 'virus',
    name: 'file'
  });

  await hasura.deleteRelationship({
    schema: 'storage', 
    table: 'buckets',
    name: 'files'
  });

  await hasura.deleteRelationship({
    schema: 'storage',
    table: 'files', 
    name: 'bucket'
  });

  debug('✅ Storage relationships dropped.');
}

async function rollback_migration_000005_add_viruses_table(hasura: Hasura) {
  debug('🔧 Rolling back migration 000005_add-viruses-table...');

  await hasura.sql(`
    DROP TRIGGER IF EXISTS set_storage_virus_updated_at ON storage.virus;
    DROP TABLE IF EXISTS storage.virus CASCADE;
  `);

  debug('✅ Migration 000005_add-viruses-table rolled back.');
}

async function rollback_migration_000004_add_metadata_column(hasura: Hasura) {
  debug('🔧 Rolling back migration 000004_add-metadata-column...');

  await hasura.sql(`
    ALTER TABLE "storage"."files" DROP COLUMN IF EXISTS "metadata";
  `);

  debug('✅ Migration 000004_add-metadata-column rolled back.');
}

async function rollback_migration_000003_remove_auth_dependency(hasura: Hasura) {
  debug('🔧 Rolling back migration 000003_remove_auth_dependency...');

  // Note: This migration removed fk_user constraint, so rollback would add it back
  // But since we're dropping everything anyway, we can skip this
  debug('✅ Migration 000003_remove_auth_dependency rolled back (skipped - dropping everything).');
}

async function rollback_migration_000002_download_expiration_constraint(hasura: Hasura) {
  debug('🔧 Rolling back migration 000002_download_expiration_constraint...');

  await hasura.sql(`
    ALTER TABLE storage.buckets DROP CONSTRAINT IF EXISTS download_expiration_valid_range;
  `);

  debug('✅ Migration 000002_download_expiration_constraint rolled back.');
}

async function rollback_migration_000001_create_initial_tables(hasura: Hasura) {
  debug('🔧 Rolling back migration 000001_create-initial-tables...');

  await hasura.sql(`
    -- Drop triggers
    DROP TRIGGER IF EXISTS check_default_bucket_update ON storage.buckets;
    DROP TRIGGER IF EXISTS check_default_bucket_delete ON storage.buckets;
    DROP TRIGGER IF EXISTS set_storage_files_updated_at ON storage.files;
    DROP TRIGGER IF EXISTS set_storage_buckets_updated_at ON storage.buckets;
    
    -- Drop tables
    DROP TABLE IF EXISTS storage.files CASCADE;
    DROP TABLE IF EXISTS storage.buckets CASCADE;
    
    -- Drop functions
    DROP FUNCTION IF EXISTS storage.protect_default_bucket_update() CASCADE;
    DROP FUNCTION IF EXISTS storage.protect_default_bucket_delete() CASCADE;
    DROP FUNCTION IF EXISTS storage.set_current_timestamp_updated_at() CASCADE;
  `);

  debug('✅ Migration 000001_create-initial-tables rolled back.');
}

async function dropSchemaAndMigrations(hasura: Hasura) {
  debug('🔧 Dropping storage schema and schema_migrations table...');

  // Drop schema_migrations table
  await hasura.sql(`DROP TABLE IF EXISTS storage.schema_migrations CASCADE;`);
  
  // Drop storage schema completely
  await hasura.sql(`DROP SCHEMA IF EXISTS storage CASCADE;`);

  debug('✅ Storage schema and schema_migrations table dropped.');
}

export async function down(customHasura?: Hasura) {
  debug('🚀 Starting Hasura Storage migration DOWN...');
  
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  
  try {
    // Ensure default data source exists
    await hasura.ensureDefaultSource();
    
    // Step 1: Remove Hasura metadata (permissions, relationships and tracking) first
    await dropStoragePermissions(hasura);
    await dropStorageRelationships(hasura);
    await untrackStorageTables(hasura);
    
    // Step 2: Rollback SQL migrations in reverse order
    await rollback_migration_000005_add_viruses_table(hasura);
    await rollback_migration_000004_add_metadata_column(hasura);
    await rollback_migration_000003_remove_auth_dependency(hasura);
    await rollback_migration_000002_download_expiration_constraint(hasura);
    await rollback_migration_000001_create_initial_tables(hasura);
    
    // Step 3: Drop schema and migrations table
    await dropSchemaAndMigrations(hasura);

    debug('✨ Hasura Storage migration DOWN completed successfully!');
    return true;
  } catch (error) {
    console.error('❗ Critical error during Storage DOWN migration:', error);
    debug('❌ Storage DOWN Migration failed.');
    return false;
  }
} 
import dotenv from 'dotenv';
import path from 'path';
import { Hasura, ColumnType } from './hasura';
import Debug from './debug';

// Initialize debug
const debug = Debug('migration:up-storage');

export async function applySQLSchema(hasura: Hasura) {
  debug('🔧 Applying storage SQL schema...');
  
  // Ensure public schema exists
  await hasura.defineSchema({ schema: 'public' });
  
  // Define files table
  await hasura.defineTable({
    schema: 'public',
    table: 'files',
    id: 'id',
    type: ColumnType.UUID
  });
  
  // Add files table columns
  await hasura.defineColumn({
    schema: 'public',
    table: 'files',
    name: 'name',
    type: ColumnType.TEXT,
    comment: 'File name'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'files',
    name: 'bucket_id',
    type: ColumnType.TEXT,
    comment: 'Storage bucket ID'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'files',
    name: 'mime_type',
    type: ColumnType.TEXT,
    comment: 'File MIME type'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'files',
    name: 'size',
    type: ColumnType.BIGINT,
    comment: 'File size in bytes'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'files',
    name: 'etag',
    type: ColumnType.TEXT,
    comment: 'File ETag'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'files',
    name: 'created_at',
    type: ColumnType.TIMESTAMPTZ,
    postfix: 'DEFAULT NOW()',
    comment: 'File creation timestamp'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'files',
    name: 'updated_at',
    type: ColumnType.TIMESTAMPTZ,
    postfix: 'DEFAULT NOW()',
    comment: 'File update timestamp'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'files',
    name: 'is_public',
    type: ColumnType.BOOLEAN,
    postfix: 'DEFAULT FALSE',
    comment: 'Public file flag'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'files',
    name: 'user_id',
    type: ColumnType.UUID,
    comment: 'File owner user ID'
  });
  
  // Define file_versions table
  await hasura.defineTable({
    schema: 'public',
    table: 'file_versions',
    id: 'id',
    type: ColumnType.UUID
  });
  
  // Add file_versions table columns
  await hasura.defineColumn({
    schema: 'public',
    table: 'file_versions',
    name: 'file_id',
    type: ColumnType.UUID,
    comment: 'Reference to files table'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'file_versions',
    name: 'version',
    type: ColumnType.TEXT,
    comment: 'File version'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'file_versions',
    name: 'created_at',
    type: ColumnType.TIMESTAMPTZ,
    postfix: 'DEFAULT NOW()',
    comment: 'Version creation timestamp'
  });
  
  // Define viruses table (for antivirus scanning)
  await hasura.defineTable({
    schema: 'public',
    table: 'viruses',
    id: 'id',
    type: ColumnType.UUID
  });
  
  // Add viruses table columns
  await hasura.defineColumn({
    schema: 'public',
    table: 'viruses',
    name: 'file_id',
    type: ColumnType.UUID,
    comment: 'Reference to infected file'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'viruses',
    name: 'virus_name',
    type: ColumnType.TEXT,
    comment: 'Detected virus name'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'viruses',
    name: 'detected_at',
    type: ColumnType.TIMESTAMPTZ,
    postfix: 'DEFAULT NOW()',
    comment: 'Virus detection timestamp'
  });
  
  // Create foreign key constraints
  await hasura.defineForeignKey({
    from: { schema: 'public', table: 'files', column: 'user_id' },
    to: { schema: 'public', table: 'users', column: 'id' },
    on_delete: 'CASCADE',
    on_update: 'CASCADE'
  });
  
  await hasura.defineForeignKey({
    from: { schema: 'public', table: 'file_versions', column: 'file_id' },
    to: { schema: 'public', table: 'files', column: 'id' },
    on_delete: 'CASCADE',
    on_update: 'CASCADE'
  });
  
  await hasura.defineForeignKey({
    from: { schema: 'public', table: 'viruses', column: 'file_id' },
    to: { schema: 'public', table: 'files', column: 'id' },
    on_delete: 'CASCADE',
    on_update: 'CASCADE'
  });
  
  // Create trigger function for updated_at
  await hasura.defineFunction({
    schema: 'public',
    name: 'set_current_timestamp_updated_at',
    definition: `()
      RETURNS TRIGGER AS $$
      DECLARE
        _new RECORD;
      BEGIN
        _new := NEW;
        _new."updated_at" = EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000;
        RETURN _new;
      END;
      $$`,
    language: 'plpgsql'
  });
  
  // Create triggers for updated_at
  await hasura.defineTrigger({
    schema: 'public',
    table: 'files',
    name: 'set_public_files_updated_at',
    timing: 'BEFORE',
    event: 'UPDATE',
    function_name: 'public.set_current_timestamp_updated_at'
  });
  
  // Create indexes
  await hasura.sql(`
    CREATE INDEX IF NOT EXISTS "idx_files_user_id" ON "public"."files" ("user_id");
    CREATE INDEX IF NOT EXISTS "idx_files_is_public" ON "public"."files" ("is_public");
    CREATE INDEX IF NOT EXISTS "idx_files_created_at" ON "public"."files" ("created_at");
    CREATE INDEX IF NOT EXISTS "idx_file_versions_file_id" ON "public"."file_versions" ("file_id");
    CREATE INDEX IF NOT EXISTS "idx_viruses_file_id" ON "public"."viruses" ("file_id");
    CREATE INDEX IF NOT EXISTS "idx_viruses_detected_at" ON "public"."viruses" ("detected_at");
  `);
  
  debug('✅ Storage SQL schema applied.');
}

export async function trackTables(hasura: Hasura) {
  debug('🔍 Tracking storage tables...');
  
  await hasura.trackTable({ schema: 'public', table: 'files' });
  await hasura.trackTable({ schema: 'public', table: 'file_versions' });
  await hasura.trackTable({ schema: 'public', table: 'viruses' });
  
  debug('✅ Storage tables tracked.');
}

export async function createRelationships(hasura: Hasura) {
  debug('🔗 Creating storage relationships...');
  
  // Files to users relationship
  await hasura.defineObjectRelationshipForeign({
    schema: 'public',
    table: 'files',
    name: 'user',
    key: 'user_id'
  });
  
  // Users to files relationship
  await hasura.defineArrayRelationshipForeign({
    schema: 'public',
    table: 'users',
    name: 'files',
    key: 'files.user_id'
  });
  
  // Files to file_versions relationship
  await hasura.defineArrayRelationshipForeign({
    schema: 'public',
    table: 'files',
    name: 'versions',
    key: 'file_versions.file_id'
  });
  
  // File_versions to files relationship
  await hasura.defineObjectRelationshipForeign({
    schema: 'public',
    table: 'file_versions',
    name: 'file',
    key: 'file_id'
  });
  
  // Files to viruses relationship
  await hasura.defineArrayRelationshipForeign({
    schema: 'public',
    table: 'files',
    name: 'viruses',
    key: 'viruses.file_id'
  });
  
  // Viruses to files relationship
  await hasura.defineObjectRelationshipForeign({
    schema: 'public',
    table: 'viruses',
    name: 'file',
    key: 'file_id'
  });
  
  debug('✅ Storage relationships created.');
}

export async function applyPermissions(hasura: Hasura) {
  debug('🔐 Applying storage permissions...');
  
  // Anonymous permissions - full access (for development, will be overridden in production)
  await hasura.definePermission({
    schema: 'public',
    table: 'files',
    operation: 'select',
    role: 'anonymous',
    filter: {},
    columns: true
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'files',
    operation: 'insert',
    role: 'anonymous',
    filter: {},
    columns: true
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'files',
    operation: 'update',
    role: 'anonymous',
    filter: {},
    columns: true
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'files',
    operation: 'delete',
    role: 'anonymous',
    filter: {}
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'file_versions',
    operation: 'select',
    role: 'anonymous',
    filter: {},
    columns: true
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'file_versions',
    operation: 'insert',
    role: 'anonymous',
    filter: {},
    columns: true
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'file_versions',
    operation: 'update',
    role: 'anonymous',
    filter: {},
    columns: true
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'file_versions',
    operation: 'delete',
    role: 'anonymous',
    filter: {}
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'viruses',
    operation: 'select',
    role: 'anonymous',
    filter: {},
    columns: true
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'viruses',
    operation: 'insert',
    role: 'anonymous',
    filter: {},
    columns: true
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'viruses',
    operation: 'update',
    role: 'anonymous',
    filter: {},
    columns: true
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'viruses',
    operation: 'delete',
    role: 'anonymous',
    filter: {}
  });
  
  // Files table permissions
  await hasura.definePermission({
    schema: 'public',
    table: 'files',
    operation: 'select',
    role: 'user',
    filter: {
      _or: [
        { user_id: { _eq: 'X-Hasura-User-Id' } },
        { is_public: { _eq: true } }
      ]
    },
    columns: true
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'files',
    operation: 'insert',
    role: 'user',
    filter: {
      user_id: { _eq: 'X-Hasura-User-Id' }
    },
    columns: ['id', 'name', 'bucket_id', 'mime_type', 'size', 'etag', 'created_at', 'updated_at', 'is_public', 'user_id']
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'files',
    operation: 'update',
    role: 'user',
    filter: {
      user_id: { _eq: 'X-Hasura-User-Id' }
    },
    columns: ['name', 'is_public', 'updated_at']
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'files',
    operation: 'delete',
    role: 'user',
    filter: {
      user_id: { _eq: 'X-Hasura-User-Id' }
    }
  });
  
  // Admin permissions
  await hasura.definePermission({
    schema: 'public',
    table: 'files',
    operation: 'select',
    role: 'admin',
    filter: {},
    columns: true
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'files',
    operation: 'insert',
    role: 'admin',
    filter: {},
    columns: true
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'files',
    operation: 'update',
    role: 'admin',
    filter: {},
    columns: true
  });
  
  await hasura.definePermission({
    schema: 'public',
    table: 'files',
    operation: 'delete',
    role: 'admin',
    filter: {}
  });
  
  // File_versions table permissions
  await hasura.definePermission({
    schema: 'public',
    table: 'file_versions',
    operation: 'select',
    role: 'user',
    filter: {
      file: {
        _or: [
          { user_id: { _eq: 'X-Hasura-User-Id' } },
          { is_public: { _eq: true } }
        ]
      }
    },
    columns: true
  });
  
  // Viruses table permissions (admin only)
  await hasura.definePermission({
    schema: 'public',
    table: 'viruses',
    operation: 'select',
    role: 'admin',
    filter: {},
    columns: true
  });
  
  debug('✅ Storage permissions applied.');
}

export async function up(customHasura?: Hasura) {
  debug('🚀 Starting Hasura Storage migration UP...');
  
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  
  try {
    // Ensure default data source exists before any operations
    await hasura.ensureDefaultSource();
    
    await applySQLSchema(hasura);
    await trackTables(hasura);
    await createRelationships(hasura);
    await applyPermissions(hasura);
    debug('✨ Hasura Storage migration UP completed successfully!');
    return true;
  } catch (error) {
    console.error('❗ Critical error during Storage UP migration:', error);
    debug('❌ Storage UP Migration failed.');
    return false;
  }
} 
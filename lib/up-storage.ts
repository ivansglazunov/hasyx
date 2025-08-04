import Debug from 'debug';
import { Hasura } from 'hasyx/lib/hasura';

const debug = Debug('hasyx:migration:up-storage');

async function migration_000001_create_initial_tables(hasura: Hasura) {
  debug('🔧 Applying migration 000001_create-initial-tables...');

  await hasura.sql(`
    BEGIN;
    -- functions
    CREATE OR REPLACE FUNCTION storage.set_current_timestamp_updated_at ()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $a$
    DECLARE
      _new record;
    BEGIN
      _new := new;
      _new. "updated_at" = now();
      RETURN _new;
    END;
    $a$;

    CREATE OR REPLACE FUNCTION storage.protect_default_bucket_delete ()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $a$
    BEGIN
      IF OLD.ID = 'default' THEN
        RAISE EXCEPTION 'Can not delete default bucket';
      END IF;
      RETURN OLD;
    END;
    $a$;

    CREATE OR REPLACE FUNCTION storage.protect_default_bucket_update ()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $a$
    BEGIN
      IF OLD.ID = 'default' AND NEW.ID <> 'default' THEN
        RAISE EXCEPTION 'Can not rename default bucket';
      END IF;
      RETURN NEW;
    END;
    $a$;

    -- tables
    CREATE TABLE IF NOT EXISTS storage.buckets (
      id text NOT NULL PRIMARY KEY,
      created_at timestamp with time zone DEFAULT now() NOT NULL,
      updated_at timestamp with time zone DEFAULT now() NOT NULL,
      download_expiration int NOT NULL DEFAULT 30, -- 30 seconds
      min_upload_file_size int NOT NULL DEFAULT 1,
      max_upload_file_size int NOT NULL DEFAULT 1073741824, -- 1GB
      cache_control text DEFAULT 'max-age=3600',
      presigned_urls_enabled boolean NOT NULL DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS storage.files (
      id uuid DEFAULT public.gen_random_uuid () NOT NULL PRIMARY KEY,
      created_at timestamp with time zone DEFAULT now() NOT NULL,
      updated_at timestamp with time zone DEFAULT now() NOT NULL,
      bucket_id text NOT NULL DEFAULT 'default',
      name text,
      size int,
      mime_type text,
      etag text,
      is_uploaded boolean DEFAULT FALSE,
      uploaded_by_user_id uuid
    );

    -- constraints
    DO $$
    BEGIN
      IF NOT EXISTS(SELECT table_name
                FROM information_schema.table_constraints
                WHERE table_schema = 'storage'
                  AND table_name = 'files'
                  AND constraint_name = 'fk_bucket')
      THEN
        ALTER TABLE storage.files
          ADD CONSTRAINT fk_bucket FOREIGN KEY (bucket_id) REFERENCES storage.buckets (id) ON UPDATE CASCADE ON DELETE CASCADE;
      END IF;
    END $$;

    -- triggers
    DROP TRIGGER IF EXISTS set_storage_buckets_updated_at ON storage.buckets;
    CREATE TRIGGER set_storage_buckets_updated_at
      BEFORE UPDATE ON storage.buckets
      FOR EACH ROW
      EXECUTE FUNCTION storage.set_current_timestamp_updated_at ();

    DROP TRIGGER IF EXISTS set_storage_files_updated_at ON storage.files;
    CREATE TRIGGER set_storage_files_updated_at
      BEFORE UPDATE ON storage.files
      FOR EACH ROW
      EXECUTE FUNCTION storage.set_current_timestamp_updated_at ();

    DROP TRIGGER IF EXISTS check_default_bucket_delete ON storage.buckets;
    CREATE TRIGGER check_default_bucket_delete
      BEFORE DELETE ON storage.buckets
      FOR EACH ROW
        EXECUTE PROCEDURE storage.protect_default_bucket_delete ();

    DROP TRIGGER IF EXISTS check_default_bucket_update ON storage.buckets;
    CREATE TRIGGER check_default_bucket_update
      BEFORE UPDATE ON storage.buckets
      FOR EACH ROW
        EXECUTE PROCEDURE storage.protect_default_bucket_update ();

    -- data
    DO $$
    BEGIN
      IF NOT EXISTS(SELECT id
                FROM storage.buckets
                WHERE id = 'default')
      THEN
        INSERT INTO storage.buckets (id)
          VALUES ('default');
      END IF;
    END $$;

    COMMIT;
  `);

  debug('✅ Migration 000001_create-initial-tables applied.');
}

async function migration_000002_download_expiration_constraint(hasura: Hasura) {
  debug('🔧 Applying migration 000002_download_expiration_constraint...');

  await hasura.sql(`
    ALTER TABLE storage.buckets
        ADD CONSTRAINT download_expiration_valid_range
            CHECK (download_expiration >= 1 AND download_expiration <= 604800);
  `);

  debug('✅ Migration 000002_download_expiration_constraint applied.');
}

async function migration_000003_remove_auth_dependency(hasura: Hasura) {
  debug('🔧 Applying migration 000003_remove_auth_dependency...');

  await hasura.sql(`
    ALTER TABLE storage.files DROP CONSTRAINT IF EXISTS fk_user;
  `);

  debug('✅ Migration 000003_remove_auth_dependency applied.');
}

async function migration_000004_add_metadata_column(hasura: Hasura) {
  debug('🔧 Applying migration 000004_add-metadata-column...');

  await hasura.sql(`
    ALTER TABLE "storage"."files" ADD COLUMN IF NOT EXISTS "metadata" JSONB;
  `);

  debug('✅ Migration 000004_add-metadata-column applied.');
}

async function migration_000005_add_viruses_table(hasura: Hasura) {
  debug('🔧 Applying migration 000005_add-viruses-table...');

  await hasura.sql(`
    CREATE TABLE IF NOT EXISTS storage.virus (
      id uuid DEFAULT public.gen_random_uuid () NOT NULL PRIMARY KEY,
      created_at timestamp with time zone DEFAULT now() NOT NULL,
      updated_at timestamp with time zone DEFAULT now() NOT NULL,
      file_id UUID NOT NULL REFERENCES storage.files(id),
      filename TEXT NOT NULL,
      virus TEXT NOT NULL,
      user_session JSONB NOT NULL
    );

    DROP TRIGGER IF EXISTS set_storage_virus_updated_at ON storage.virus;
    CREATE TRIGGER set_storage_virus_updated_at
      BEFORE UPDATE ON storage.virus
      FOR EACH ROW
      EXECUTE FUNCTION storage.set_current_timestamp_updated_at ();
  `);

  debug('✅ Migration 000005_add-viruses-table applied.');
}

async function createSchemaAndMigrations(hasura: Hasura) {
  debug('🔧 Creating storage schema and schema_migrations table...');

  // Create storage schema
  await hasura.sql(`CREATE SCHEMA IF NOT EXISTS storage;`);

  // Create schema_migrations table
  await hasura.sql(`
    CREATE TABLE IF NOT EXISTS storage.schema_migrations (
      version bigint NOT NULL PRIMARY KEY,
      dirty boolean NOT NULL DEFAULT FALSE
    );
  `);

  debug('✅ Storage schema and schema_migrations table created.');
}

async function trackStorageTables(hasura: Hasura) {
  debug('🔍 Tracking storage tables with customization...');

  // Track buckets table with customization (hasura-storage compatible)
  await hasura.v1({
    type: 'pg_track_table',
    args: {
      source: 'default',
      table: { schema: 'storage', name: 'buckets' },
      configuration: {
        custom_name: 'buckets',
        custom_root_fields: {
          select: 'buckets',
          select_by_pk: 'bucket',
          select_aggregate: 'bucketsAggregate',
          insert: 'insertBuckets',
          insert_one: 'insertBucket',
          update: 'updateBuckets',
          update_by_pk: 'updateBucket',
          delete: 'deleteBuckets',
          delete_by_pk: 'deleteBucket'
        },
        custom_column_names: {
          id: 'id',
          created_at: 'createdAt',
          updated_at: 'updatedAt',
          download_expiration: 'downloadExpiration',
          min_upload_file_size: 'minUploadFileSize',
          max_upload_file_size: 'maxUploadFileSize',
          cache_control: 'cacheControl',
          presigned_urls_enabled: 'presignedUrlsEnabled'
        }
      }
    }
  });

  // Track files table with customization (hasura-storage compatible)
  await hasura.v1({
    type: 'pg_track_table',
    args: {
      source: 'default',
      table: { schema: 'storage', name: 'files' },
      configuration: {
        custom_name: 'files',
        custom_root_fields: {
          select: 'files',
          select_by_pk: 'file',
          select_aggregate: 'filesAggregate',
          insert: 'insertFiles',
          insert_one: 'insertFile',  // ← hasura-storage uses this
          update: 'updateFiles', 
          update_by_pk: 'updateFile', // ← hasura-storage uses this
          delete: 'deleteFiles',
          delete_by_pk: 'deleteFile'  // ← hasura-storage uses this
        },
        custom_column_names: {
          id: 'id',
          created_at: 'createdAt',
          updated_at: 'updatedAt',
          bucket_id: 'bucketId',
          name: 'name',
          size: 'size',
          mime_type: 'mimeType',
          etag: 'etag',
          is_uploaded: 'isUploaded',
          uploaded_by_user_id: 'uploadedByUserId',
          metadata: 'metadata'
        }
      }
    }
  });

  // Track virus table with customization (hasura-storage compatible)
  await hasura.v1({
    type: 'pg_track_table',
    args: {
      source: 'default',
      table: { schema: 'storage', name: 'virus' },
      configuration: {
        custom_name: 'virus',
        custom_root_fields: {
          select: 'viruses',
          select_by_pk: 'virus',
          select_aggregate: 'virusesAggregate',
          insert: 'insertViruses',
          insert_one: 'insertVirus',  // ← hasura-storage uses this
          update: 'updateViruses',
          update_by_pk: 'updateVirus',
          delete: 'deleteViruses',
          delete_by_pk: 'deleteVirus'
        },
        custom_column_names: {
          id: 'id',
          created_at: 'createdAt',
          updated_at: 'updatedAt',
          file_id: 'fileId',
          filename: 'filename',
          virus: 'virus',
          user_session: 'userSession'
        }
      }
    }
  });

  debug('✅ Storage tables tracked with customization.');
}

async function createStoragePermissions(hasura: Hasura) {
  debug('🔐 Creating permissions for file operations (all roles - no restrictions for now)...');

  // All roles that can access files: storage, user, anonymous
  const roles = ['storage', 'user', 'anonymous'];
  
  for (const role of roles) {
    // Permissions on storage.buckets
    await hasura.definePermission({
      schema: 'storage',
      table: 'buckets',
      operation: 'select',
      role,
      filter: {}, // No restrictions for now
      columns: true
    });

    await hasura.definePermission({
      schema: 'storage',
      table: 'buckets',
      operation: 'insert',
      role,
      filter: {},
      columns: true
    });

    await hasura.definePermission({
      schema: 'storage',
      table: 'buckets',
      operation: 'update',
      role,
      filter: {},
      columns: true
    });

    // Permissions on storage.files
    await hasura.definePermission({
      schema: 'storage',
      table: 'files',
      operation: 'select',
      role,
      filter: {}, // No restrictions for now - all files accessible
      columns: true
    });

    await hasura.definePermission({
      schema: 'storage',
      table: 'files',
      operation: 'insert',
      role,
      filter: {},
      columns: true
    });

    await hasura.definePermission({
      schema: 'storage',
      table: 'files',
      operation: 'update',
      role,
      filter: {}, // No restrictions for now
      columns: true
    });

    await hasura.definePermission({
      schema: 'storage',
      table: 'files',
      operation: 'delete',
      role,
      filter: {}, // No restrictions for now
      columns: true
    });

    // Permissions on storage.virus
    await hasura.definePermission({
      schema: 'storage',
      table: 'virus',
      operation: 'select',
      role,
      filter: {},
      columns: true
    });

    await hasura.definePermission({
      schema: 'storage',
      table: 'virus',
      operation: 'insert',
      role,
      filter: {},
      columns: true
    });
  }

  debug('✅ Open permissions created for all roles (storage, user, anonymous).');
}

async function createStorageRelationships(hasura: Hasura) {
  debug('🔗 Creating storage relationships...');

  // Object relationship: files -> bucket (files.bucket_id -> buckets.id)
  await hasura.v1({
    type: 'pg_create_object_relationship',
    args: {
      source: 'default',
      table: { schema: 'storage', name: 'files' },
      name: 'bucket',
      using: {
        foreign_key_constraint_on: ['bucket_id']
      }
    }
  });

  // Array relationship: buckets -> files (buckets.id <- files.bucket_id)
  await hasura.v1({
    type: 'pg_create_array_relationship',
    args: {
      source: 'default',
      table: { schema: 'storage', name: 'buckets' },
      name: 'files',
      using: {
        foreign_key_constraint_on: {
          table: { schema: 'storage', name: 'files' },
          columns: ['bucket_id']
        }
      }
    }
  });

  // Object relationship: virus -> file (virus.file_id -> files.id)
  await hasura.v1({
    type: 'pg_create_object_relationship',
    args: {
      source: 'default',
      table: { schema: 'storage', name: 'virus' },
      name: 'file',
      using: {
        foreign_key_constraint_on: ['file_id']
      }
    }
  });

  debug('✅ Storage relationships created.');
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
    
    // Create schema and migrations table first
    await createSchemaAndMigrations(hasura);
    
    // Apply migrations in strict order
    await migration_000001_create_initial_tables(hasura);
    await migration_000002_download_expiration_constraint(hasura);
    await migration_000003_remove_auth_dependency(hasura);
    await migration_000004_add_metadata_column(hasura);
    await migration_000005_add_viruses_table(hasura);

    // Apply Hasura metadata (track tables with customization and create relationships)
    await trackStorageTables(hasura);
    await createStorageRelationships(hasura);
    await createStoragePermissions(hasura);

    debug('✨ Hasura Storage migration UP completed successfully!');
    return true;
  } catch (error) {
    console.error('❗ Critical error during Storage UP migration:', error);
    debug('❌ Storage UP Migration failed.');
    return false;
  }
}
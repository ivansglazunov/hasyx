import { Hasura, ColumnType } from '../hasura/hasura';
import { ensureValidationRuntime, syncSchemasToDatabase } from '../validation';
import Debug from '../debug';

const debug = Debug('migration:up-options');

export interface OptionsUpParams {
  schema?: string;
  optionsTable: string;
  tableHandler?: (tableName: string) => Promise<void> | void;
}

export async function up(params: OptionsUpParams, customHasura?: Hasura) {
  const {
    schema = 'public',
    optionsTable,
    tableHandler,
  } = params;

  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.ensureDefaultSource();
  await hasura.defineSchema({ schema });

  debug(`🚀 Creating options table: ${schema}.${optionsTable}`);

  // Create single options table with all value types
  await hasura.defineTable({ schema, table: optionsTable, id: 'id', type: ColumnType.UUID });
  await hasura.defineColumn({ schema, table: optionsTable, name: 'key', type: ColumnType.TEXT, postfix: 'NOT NULL' });
  await hasura.defineColumn({ schema, table: optionsTable, name: 'user_id', type: ColumnType.UUID, postfix: 'NULL' });
  await hasura.defineColumn({ schema, table: optionsTable, name: 'item_id', type: ColumnType.UUID });
  // Private column for plv8 computation results (not exposed in GraphQL)
  await hasura.defineColumn({ schema, table: optionsTable, name: '_result', type: ColumnType.TEXT });
  // Unified reference column for UUID-based options (e.g., friend_id, avatar)
  await hasura.defineColumn({ schema, table: optionsTable, name: 'to_id', type: ColumnType.UUID });
  
  // Value columns - exactly one should be non-null
  await hasura.defineColumn({ schema, table: optionsTable, name: 'string_value', type: ColumnType.TEXT });
  await hasura.defineColumn({ schema, table: optionsTable, name: 'number_value', type: ColumnType.NUMERIC });
  await hasura.defineColumn({ schema, table: optionsTable, name: 'boolean_value', type: ColumnType.BOOLEAN });
  await hasura.defineColumn({ schema, table: optionsTable, name: 'jsonb_value', type: ColumnType.JSONB });

  // FK to users for user_id (owner of the option record)
  await hasura.defineForeignKey({
    from: { schema, table: optionsTable, column: 'user_id' },
    to: { schema: 'public', table: 'users', column: 'id' },
    on_delete: 'CASCADE'
  });

  // Create relationships
  // options.item_options (array relationship): options pointing to this option via item_id
  try {
    await hasura.v1({
      type: 'pg_create_array_relationship',
      args: {
        source: 'default',
        table: { schema, name: optionsTable },
        name: 'item_options',
        using: {
          manual_configuration: {
            remote_table: { schema, name: optionsTable },
            column_mapping: { id: 'item_id' }
          }
        }
      }
    });
  } catch (e) {
    debug(`⚠️ Could not create item_options relationship: ${e}`);
  }

  // options.item (object relationship): the option this points to via item_id  
  try {
    await hasura.v1({
      type: 'pg_create_object_relationship',
      args: {
        source: 'default',
        table: { schema, name: optionsTable },
        name: 'item_option',
        using: {
          manual_configuration: {
            remote_table: { schema, name: optionsTable },
            column_mapping: { item_id: 'id' }
          }
        }
      }
    });
  } catch (e) {
    debug(`⚠️ Could not create item_option relationship: ${e}`);
  }

  // Ensure validation runtime and project schemas are available BEFORE creating triggers
  // This guarantees that validation.project_schemas() and validate_option_permission() exist
  try {
    await syncSchemasToDatabase(hasura);
  } catch {}
  try {
    await ensureValidationRuntime(hasura);
  } catch {}

  // 🎯 SMART VALIDATION TRIGGER: Auto-detects schema based on item_id
  await hasura.defineFunction({
    schema,
    name: `${optionsTable}_validate`,
    definition: `() RETURNS TRIGGER AS $$
    DECLARE
      value_count integer := 0;
      v_value jsonb;
      v_err_msg text;
      v_err_detail text;
      v_err_hint text;
      v_schema_path text;
      available_tables text[];
      table_name text;
      found_in_table text := NULL;
      schemas_data jsonb;
      rows_found integer := 0;
      meta jsonb := NULL;
      is_multiple boolean := false;
      ref_tables text[] := NULL;
      ref_ok boolean := false;
      ref_id uuid;
    BEGIN
      -- value checks will be applied later after meta detection
      value_count := 0;

      -- Basic presence validation for key
      IF NEW.key IS NULL OR NEW.key = '' THEN
        RAISE EXCEPTION 'Key cannot be empty';
      END IF;

      -- 🎯 DYNAMIC SCHEMA DETECTION: Determine which schema to use based on item_id
      IF NEW.item_id IS NULL THEN
        -- Allow keys explicitly declared under options[""] (aliased as options.__empty)
        BEGIN
          SELECT validation.project_schemas() INTO schemas_data;
          -- Check that options.__empty exists and key is declared
          IF jsonb_extract_path(schemas_data, 'options', '__empty', 'properties', NEW.key) IS NULL THEN
            RAISE EXCEPTION 'item_id is required unless key is declared under options[""] (global options)';
          END IF;
          v_schema_path := 'options.__empty';
        EXCEPTION WHEN OTHERS THEN
          RAISE EXCEPTION 'Error during global schema detection: %', SQLERRM;
        END;
      ELSE
        -- Get available table names from project schemas
        BEGIN
          -- Get schema data from PLV8 function
          SELECT validation.project_schemas() INTO schemas_data;
          
          -- Extract table names from options schema
          SELECT array_agg(key) INTO available_tables
          FROM jsonb_each(schemas_data->'options');

          -- Remove special groups from candidate table list
          IF available_tables IS NOT NULL THEN
            available_tables := array_remove(available_tables, '__any');
            available_tables := array_remove(available_tables, '__empty');
          END IF;
          
          -- Check each available table for the item_id
          FOREACH table_name IN ARRAY available_tables
          LOOP
            BEGIN
              -- Count matching rows in a safe way
              EXECUTE format('SELECT COUNT(1) FROM public.%I WHERE id = $1', table_name)
              INTO rows_found
              USING NEW.item_id;

              IF rows_found > 0 THEN
                found_in_table := table_name;
                EXIT; -- Found it, stop searching
              END IF;
            EXCEPTION 
              WHEN undefined_table THEN
                -- Table doesn't exist, skip it
                CONTINUE;
              WHEN OTHERS THEN
                -- Other SQL errors, skip this table
                CONTINUE;
            END;
          END LOOP;
          
          -- Set schema path based on found table
          IF found_in_table IS NOT NULL THEN
            v_schema_path := 'options.' || found_in_table;
          ELSE
            RAISE EXCEPTION 'item_id % not found in any of the available tables: %', NEW.item_id, array_to_string(available_tables, ', ');
          END IF;
          
        EXCEPTION WHEN OTHERS THEN
          RAISE EXCEPTION 'Error during schema detection: %', SQLERRM;
        END;
      END IF;

      -- Ensure the key exists in the determined or fallback (options.__any) schema
      BEGIN
        IF v_schema_path IS NULL OR v_schema_path = '' THEN
          RAISE EXCEPTION 'Internal error: v_schema_path not set';
        END IF;

        -- If not global (options.__empty), try table-specific first, then fallback to options.__any
        IF v_schema_path <> 'options.__empty' THEN
          -- Load schemas_data if missing
          IF schemas_data IS NULL THEN SELECT validation.project_schemas() INTO schemas_data; END IF;
          IF jsonb_extract_path(schemas_data, (string_to_array(v_schema_path, '.'))[1], (string_to_array(v_schema_path, '.'))[2], 'properties', NEW.key) IS NULL THEN
            -- Try wildcard group
            IF jsonb_extract_path(schemas_data, 'options', '__any', 'properties', NEW.key) IS NOT NULL THEN
              v_schema_path := 'options.__any';
            END IF;
          END IF;
        END IF;

        PERFORM validation.validate_option_key(NEW.key, v_schema_path);
      EXCEPTION WHEN undefined_function THEN
        RAISE EXCEPTION 'validation runtime is not installed (validate_option_key)';
      END;

      -- Build JSON value to validate (assigned after meta detection)
      v_value := NULL;

      -- Read meta for the option key (multiple, tables) - Zod 4 puts meta directly in schema, not x-meta
      BEGIN
        IF schemas_data IS NULL THEN
          SELECT validation.project_schemas() INTO schemas_data;
        END IF;
        -- Try x-meta first (if we had custom logic), then fallback to direct properties (Zod 4 behavior)
        -- Use correct table name based on v_schema_path
        IF v_schema_path = 'options.__empty' THEN
          meta := jsonb_extract_path(schemas_data, 'options', '__empty', 'properties', NEW.key, 'x-meta');
          IF meta IS NULL THEN
            meta := jsonb_extract_path(schemas_data, 'options', '__empty', 'properties', NEW.key);
          END IF;
        ELSIF v_schema_path = 'options.__any' THEN
          meta := jsonb_extract_path(schemas_data, 'options', '__any', 'properties', NEW.key, 'x-meta');
          IF meta IS NULL THEN
            meta := jsonb_extract_path(schemas_data, 'options', '__any', 'properties', NEW.key);
          END IF;
        ELSIF found_in_table IS NOT NULL THEN
          meta := jsonb_extract_path(schemas_data, 'options', found_in_table, 'properties', NEW.key, 'x-meta');
          IF meta IS NULL THEN
            meta := jsonb_extract_path(schemas_data, 'options', found_in_table, 'properties', NEW.key);
          END IF;
        END IF;
        
        IF meta IS NOT NULL THEN
          IF (meta ? 'multiple') THEN
            is_multiple := COALESCE((meta->>'multiple')::boolean, false);
          END IF;
          IF (meta ? 'tables') THEN
            SELECT array_agg(value::text) INTO ref_tables FROM jsonb_array_elements_text(meta->'tables');
          END IF;
        END IF;
      EXCEPTION WHEN OTHERS THEN
        -- ignore meta errors
        NULL;
      END;

      -- Enforce uniqueness for non-multiple keys: no duplicates per (key, item_id)
      IF NOT is_multiple THEN
        PERFORM 1 FROM "${schema}"."${optionsTable}" t
         WHERE t.key = NEW.key
           AND ((t.item_id IS NULL AND NEW.item_id IS NULL) OR t.item_id = NEW.item_id)
           AND (TG_OP = 'INSERT' OR t.id <> NEW.id)
         LIMIT 1;
        IF FOUND THEN
          RAISE EXCEPTION 'Duplicate option for key % and item_id % is not allowed', NEW.key, NEW.item_id;
        END IF;
      END IF;

      -- Value enforcement and referenced id checks
      IF ref_tables IS NOT NULL THEN
        -- For UUID-referenced options: require to_id and no other value columns
        IF NEW.to_id IS NULL THEN
          RAISE EXCEPTION 'to_id must be provided for key %', NEW.key;
        END IF;
        IF NEW.string_value IS NOT NULL OR NEW.number_value IS NOT NULL OR NEW.boolean_value IS NOT NULL OR NEW.jsonb_value IS NOT NULL THEN
          RAISE EXCEPTION 'Only to_id is allowed for UUID-referenced key %', NEW.key;
        END IF;

        -- Validate existence of referenced record
        ref_id := NEW.to_id;
        ref_ok := false;
        FOREACH table_name IN ARRAY ref_tables
        LOOP
          BEGIN
            IF position('.' IN table_name) > 0 THEN
              -- format schema.table
              EXECUTE format('SELECT COUNT(1) FROM %s WHERE id = $1', table_name)
              INTO rows_found
              USING ref_id;
            ELSE
              -- default to public schema
              EXECUTE format('SELECT COUNT(1) FROM public.%I WHERE id = $1', table_name)
              INTO rows_found
              USING ref_id;
            END IF;
            IF rows_found > 0 THEN
              ref_ok := true; EXIT;
            END IF;
          EXCEPTION WHEN undefined_table THEN
            CONTINUE;
          WHEN OTHERS THEN
            CONTINUE;
          END;
        END LOOP;
        IF NOT ref_ok THEN
          RAISE EXCEPTION 'Referenced id % for key % not found in allowed tables %', ref_id, NEW.key, array_to_string(ref_tables, ', ');
        END IF;

        -- JSON value for schema validation is textual UUID
        v_value := to_jsonb(NEW.to_id::text);
      ELSE
        -- For non-referenced options: exactly one of value columns must be set, to_id must be null
        value_count := 0;
        IF NEW.string_value IS NOT NULL THEN value_count := value_count + 1; END IF;
        IF NEW.number_value IS NOT NULL THEN value_count := value_count + 1; END IF;
        IF NEW.boolean_value IS NOT NULL THEN value_count := value_count + 1; END IF;
        IF NEW.jsonb_value IS NOT NULL THEN value_count := value_count + 1; END IF;
        IF NEW.to_id IS NOT NULL THEN
          RAISE EXCEPTION 'to_id is not allowed for non-referenced key %', NEW.key;
        END IF;
        IF value_count != 1 THEN
          RAISE EXCEPTION 'Exactly one value field must be set for key %', NEW.key;
        END IF;

        -- Build v_value from the single provided value column
      IF NEW.string_value IS NOT NULL THEN
        v_value := to_jsonb(NEW.string_value);
      ELSIF NEW.number_value IS NOT NULL THEN
        v_value := to_jsonb(NEW.number_value);
      ELSIF NEW.boolean_value IS NOT NULL THEN
        v_value := to_jsonb(NEW.boolean_value);
        ELSE
        v_value := NEW.jsonb_value;
        END IF;
      END IF;

      -- Validate against schema for this key using the determined schema path
      BEGIN
        PERFORM validation.validate_json(v_value, v_schema_path || '.properties.' || NEW.key, 'project');
      EXCEPTION WHEN undefined_function THEN
        -- plv8 runtime not installed; skip deep validation, only key existence enforced
        NULL;
      WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_err_msg = MESSAGE_TEXT, v_err_detail = PG_EXCEPTION_DETAIL, v_err_hint = PG_EXCEPTION_HINT;
        RAISE EXCEPTION 'options_validate error: msg=%, detail=%, hint=% (schema=%, key=%)', v_err_msg, COALESCE(v_err_detail,'null'), COALESCE(v_err_hint,'null'), v_schema_path, NEW.key;
      END;

      RETURN NEW;
    END;
    $$`,
    language: 'plpgsql'
  });

  await hasura.defineTrigger({
    schema,
    table: optionsTable,
    name: `${optionsTable}_validate_trigger`,
    timing: 'BEFORE',
    event: 'INSERT OR UPDATE',
    function_name: `${schema}.${optionsTable}_validate`
  });

  // Permission trigger (runs BEFORE validate to fail early)
  await hasura.defineTrigger({
    schema,
    table: optionsTable,
    name: `${optionsTable}_permission_trigger`,
    timing: 'BEFORE',
    event: 'INSERT OR UPDATE OR DELETE',
    function_name: `validation.validate_option_permission`
  });

  // Auto-set user_id from session using plpgsql
  await hasura.defineFunction({
    schema,
    name: `${optionsTable}_set_user_id`,
    definition: `() RETURNS TRIGGER AS $$
    DECLARE
      session_vars jsonb;
    BEGIN
      IF NEW.user_id IS NULL THEN
        session_vars := current_setting('hasura.user', true)::jsonb;
        IF session_vars ? 'x-hasura-user-id' THEN
          NEW.user_id := (session_vars ->> 'x-hasura-user-id')::uuid;
        END IF;
      END IF;
      RETURN NEW;
    END;
    $$`,
    language: 'plpgsql'
  });

  await hasura.defineTrigger({
    schema,
    table: optionsTable,
    name: `${optionsTable}_set_user_id_trigger`,
    timing: 'BEFORE',
    event: 'INSERT',
    function_name: `${schema}.${optionsTable}_set_user_id`
  });

  if (tableHandler) await tableHandler(optionsTable);

  // Remove strict FK to storage.files to allow referencing arbitrary UUIDs; validation handles type only
  await hasura.sql(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        WHERE tc.table_schema = '${schema}'
          AND tc.table_name = '${optionsTable}'
          AND tc.constraint_name = 'fk_${optionsTable}_file_id_storage_files_id'
      ) THEN
        ALTER TABLE "${schema}"."${optionsTable}"
        DROP CONSTRAINT IF EXISTS "fk_${optionsTable}_file_id_storage_files_id";
      END IF;
    END$$;
  `);

  // Track the table
  await hasura.trackTable({ schema, table: optionsTable });
  debug('✅ Options table created with validation triggers and permissions');
}

// Export permission specs to be applied strictly in migrations up.ts/down.ts
export const OPTIONS_EDITABLE_COLUMNS = ['key','item_id','to_id','string_value','number_value','boolean_value','jsonb_value'] as const;
export const OPTIONS_PERMISSIONS = {
  anonymous: {
    select: { filter: {}, columns: true }
  },
  user: {
    select: { filter: {}, columns: true },
    insert: { check: {}, set: {}, columns: OPTIONS_EDITABLE_COLUMNS },
    update: { 
      filter: { 
        _or: [
          { item_id: { _eq: 'X-Hasura-User-Id' } },
          { user_id: { _eq: 'X-Hasura-User-Id' } }
        ]
      }, 
      set: {}, 
      columns: OPTIONS_EDITABLE_COLUMNS 
    },
    delete: { 
      filter: { 
        _or: [
          { item_id: { _eq: 'X-Hasura-User-Id' } },
          { user_id: { _eq: 'X-Hasura-User-Id' } }
        ]
      }, 
      columns: true 
    }
  }
} as const;



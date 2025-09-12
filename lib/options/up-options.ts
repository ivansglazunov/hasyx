import { Hasura, ColumnType } from '../hasura/hasura';
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
  await hasura.defineColumn({ schema, table: optionsTable, name: 'user_id', type: ColumnType.UUID, postfix: 'NOT NULL' });
  await hasura.defineColumn({ schema, table: optionsTable, name: 'item_id', type: ColumnType.UUID });
  // File reference column (optional): points to storage.files.id when present
  await hasura.defineColumn({ schema, table: optionsTable, name: 'file_id', type: ColumnType.UUID });
  
  // Value columns - exactly one should be non-null
  await hasura.defineColumn({ schema, table: optionsTable, name: 'string_value', type: ColumnType.TEXT });
  await hasura.defineColumn({ schema, table: optionsTable, name: 'number_value', type: ColumnType.NUMERIC });
  await hasura.defineColumn({ schema, table: optionsTable, name: 'boolean_value', type: ColumnType.BOOLEAN });
  await hasura.defineColumn({ schema, table: optionsTable, name: 'jsonb_value', type: ColumnType.JSONB });

  // Constraint: unique (key, user_id, item_id) - prevent duplicate keys per user/item
  await hasura.defineForeignKey({
    from: { schema, table: optionsTable, column: 'user_id' },
    to: { schema: 'public', table: 'users', column: 'id' },
    on_delete: 'CASCADE'
  });

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
    BEGIN
      -- Check that exactly one value field is set
      IF NEW.string_value IS NOT NULL THEN value_count := value_count + 1; END IF;
      IF NEW.number_value IS NOT NULL THEN value_count := value_count + 1; END IF;
      IF NEW.boolean_value IS NOT NULL THEN value_count := value_count + 1; END IF;
      IF NEW.jsonb_value IS NOT NULL THEN value_count := value_count + 1; END IF;
      IF NEW.file_id IS NOT NULL THEN value_count := value_count + 1; END IF;
      
      IF value_count != 1 THEN
        RAISE EXCEPTION 'Exactly one value field must be set, got %', value_count;
      END IF;

      -- Basic presence validation for key
      IF NEW.key IS NULL OR NEW.key = '' THEN
        RAISE EXCEPTION 'Key cannot be empty';
      END IF;

      -- 🎯 DYNAMIC SCHEMA DETECTION: Determine which schema to use based on item_id
      IF NEW.item_id IS NULL THEN
        RAISE EXCEPTION 'item_id is required - options must be tied to a specific entity';
      ELSE
        -- Get available table names from project schemas
        BEGIN
          -- Get schema data from PLV8 function
          SELECT validation.project_schemas() INTO schemas_data;
          
          -- Extract table names from options schema
          SELECT array_agg(key) INTO available_tables
          FROM jsonb_each(schemas_data->'options');
          
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

      -- Ensure the key exists in the determined schema
      BEGIN
        PERFORM validation.validate_option_key(NEW.key, v_schema_path);
      EXCEPTION WHEN undefined_function THEN
        RAISE EXCEPTION 'validation runtime is not installed (validate_option_key)';
      END;

      -- Build JSON value to validate
      IF NEW.string_value IS NOT NULL THEN
        v_value := to_jsonb(NEW.string_value);
      ELSIF NEW.number_value IS NOT NULL THEN
        v_value := to_jsonb(NEW.number_value);
      ELSIF NEW.boolean_value IS NOT NULL THEN
        v_value := to_jsonb(NEW.boolean_value);
      ELSIF NEW.jsonb_value IS NOT NULL THEN
        v_value := NEW.jsonb_value;
      ELSE
        -- file_id provided: validate as string (uuid)
        v_value := to_jsonb(NEW.file_id::text);
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

  // Add unique index (expression) to prevent duplicate key+user_id+item_id (treat NULL item_id as fixed UUID)
  await hasura.sql(`
    CREATE UNIQUE INDEX IF NOT EXISTS "${optionsTable}_key_user_item_unique_idx"
    ON "${schema}"."${optionsTable}" ("key", "user_id", COALESCE("item_id", '00000000-0000-0000-0000-000000000000'::uuid));
  `);

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

  // Set up permissions
  // Anonymous can read all options
  await hasura.definePermission({ 
    schema, 
    table: optionsTable, 
    operation: 'select', 
    role: 'anonymous', 
    filter: {}, 
    columns: true 
  });

  // Users can manage their own options
  const ownerFilter = { user_id: { _eq: 'X-Hasura-User-Id' } } as any;
  // Explicit column lists to avoid metadata column resolution issues
  const editableColumns = ['key','item_id','file_id','string_value','number_value','boolean_value','jsonb_value'];
  await hasura.definePermission({ 
    schema, table: optionsTable, operation: 'select', role: 'user', filter: ownerFilter, columns: true 
  });
  await hasura.definePermission({ 
    schema, table: optionsTable, operation: 'insert', role: 'user', filter: ownerFilter, columns: editableColumns, set: { user_id: 'X-Hasura-User-Id' } 
  });
  await hasura.definePermission({ 
    schema, table: optionsTable, operation: 'update', role: 'user', filter: ownerFilter, columns: editableColumns, set: { user_id: 'X-Hasura-User-Id' } 
  });
  await hasura.definePermission({ 
    schema, table: optionsTable, operation: 'delete', role: 'user', filter: ownerFilter, columns: true 
  });

  debug('✅ Options table created with validation triggers and permissions');
}



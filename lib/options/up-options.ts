import { Hasura, ColumnType } from '../hasura/hasura';
import Debug from '../debug';

const debug = Debug('migration:up-options');

export interface OptionsUpParams {
  schema?: string;
  optionsViewTable: string;
  numbersTable: string;
  stringsTable: string;
  objectsTable: string;
  booleansTable: string;
  tableHandler?: (tableName: string) => Promise<void> | void;
}

export async function up(params: OptionsUpParams, customHasura?: Hasura) {
  const {
    schema = 'public',
    optionsViewTable,
    numbersTable,
    stringsTable,
    objectsTable,
    booleansTable,
    tableHandler,
  } = params;

  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.ensureDefaultSource();
  await hasura.defineSchema({ schema });

  const baseTables = [
    { name: numbersTable, type: ColumnType.INTEGER },
    { name: stringsTable, type: ColumnType.TEXT },
    { name: objectsTable, type: ColumnType.JSONB },
    { name: booleansTable, type: ColumnType.BOOLEAN },
  ];

  for (const base of baseTables) {
    await hasura.defineTable({ schema, table: base.name, id: 'id', type: ColumnType.UUID });
    await hasura.defineColumn({ schema, table: base.name, name: 'key', type: ColumnType.TEXT, postfix: 'NOT NULL' });
    await hasura.defineColumn({ schema, table: base.name, name: 'user_id', type: ColumnType.UUID, postfix: 'NOT NULL' });
    await hasura.defineColumn({ schema, table: base.name, name: 'item_id', type: ColumnType.UUID });
    await hasura.defineColumn({ schema, table: base.name, name: 'value', type: base.type, postfix: 'NOT NULL' });
    await hasura.defineColumn({ schema, table: base.name, name: 'created_at', type: ColumnType.TIMESTAMPTZ });
    await hasura.defineColumn({ schema, table: base.name, name: 'updated_at', type: ColumnType.TIMESTAMPTZ });

    // unique (key, item_id)
    await hasura.sql(`
      DO $$ BEGIN
        BEGIN
          ALTER TABLE "${schema}"."${base.name}" ADD CONSTRAINT "${base.name}_key_item_id_unique" UNIQUE ("key", "item_id");
        EXCEPTION WHEN duplicate_table THEN NULL; WHEN duplicate_object THEN NULL; END;
      END $$;
    `);

    // updated_at trigger
    await hasura.sql(`
      CREATE OR REPLACE FUNCTION "${schema}"."${base.name}_set_updated_at"() RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at := NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      DROP TRIGGER IF EXISTS "${base.name}_set_updated_at_trg" ON "${schema}"."${base.name}";
      CREATE TRIGGER "${base.name}_set_updated_at_trg" BEFORE UPDATE ON "${schema}"."${base.name}"
      FOR EACH ROW EXECUTE FUNCTION "${schema}"."${base.name}_set_updated_at"();
    `);

    // user_id from session vars if not provided
    await hasura.sql(`
      CREATE OR REPLACE FUNCTION "${schema}"."${base.name}_set_user_id"() RETURNS TRIGGER AS $$
      DECLARE session_vars JSON;
      BEGIN
        IF NEW.user_id IS NULL THEN
          session_vars := current_setting('hasura.user', true)::json;
          IF session_vars ? 'x-hasura-user-id' THEN
            NEW.user_id := (session_vars ->> 'x-hasura-user-id')::uuid;
          END IF;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      DROP TRIGGER IF EXISTS "${base.name}_set_user_id_trg" ON "${schema}"."${base.name}";
      CREATE TRIGGER "${base.name}_set_user_id_trg" BEFORE INSERT ON "${schema}"."${base.name}"
      FOR EACH ROW EXECUTE FUNCTION "${schema}"."${base.name}_set_user_id"();
    `);

    if (tableHandler) await tableHandler(base.name);
  }

  // Build view definition
  const def = `
    SELECT id, key, user_id, item_id, created_at, updated_at,
      value::numeric AS number, NULL::text AS string, NULL::jsonb AS object, NULL::boolean AS boolean,
      id AS number_id, NULL::uuid AS string_id, NULL::uuid AS object_id, NULL::uuid AS boolean_id
    FROM "${schema}"."${numbersTable}"
    UNION ALL
    SELECT id, key, user_id, item_id, created_at, updated_at,
      NULL::numeric AS number, value::text AS string, NULL::jsonb AS object, NULL::boolean AS boolean,
      NULL::uuid AS number_id, id AS string_id, NULL::uuid AS object_id, NULL::uuid AS boolean_id
    FROM "${schema}"."${stringsTable}"
    UNION ALL
    SELECT id, key, user_id, item_id, created_at, updated_at,
      NULL::numeric AS number, NULL::text AS string, value::jsonb AS object, NULL::boolean AS boolean,
      NULL::uuid AS number_id, NULL::uuid AS string_id, id AS object_id, NULL::uuid AS boolean_id
    FROM "${schema}"."${objectsTable}"
    UNION ALL
    SELECT id, key, user_id, item_id, created_at, updated_at,
      NULL::numeric AS number, NULL::text AS string, NULL::jsonb AS object, value::boolean AS boolean,
      NULL::uuid AS number_id, NULL::uuid AS string_id, NULL::uuid AS object_id, id AS boolean_id
    FROM "${schema}"."${booleansTable}"`;

  await hasura.defineView({ schema, name: optionsViewTable, definition: def });

  // INSTEAD OF triggers on view
  await hasura.sql(`
    CREATE OR REPLACE FUNCTION "${schema}"."${optionsViewTable}_ioi"() RETURNS TRIGGER AS $$
    BEGIN
      PERFORM validation.validate_option_key('${schema}', '${optionsViewTable}', NEW.key);
      IF NEW.number IS NOT NULL THEN
        INSERT INTO "${schema}"."${numbersTable}"(key, user_id, item_id, value, created_at, updated_at)
        VALUES (NEW.key, NEW.user_id, NEW.item_id, NEW.number, COALESCE(NEW.created_at, NOW()), COALESCE(NEW.updated_at, NOW()));
      ELSIF NEW.string IS NOT NULL THEN
        INSERT INTO "${schema}"."${stringsTable}"(key, user_id, item_id, value, created_at, updated_at)
        VALUES (NEW.key, NEW.user_id, NEW.item_id, NEW.string, COALESCE(NEW.created_at, NOW()), COALESCE(NEW.updated_at, NOW()));
      ELSIF NEW.object IS NOT NULL THEN
        INSERT INTO "${schema}"."${objectsTable}"(key, user_id, item_id, value, created_at, updated_at)
        VALUES (NEW.key, NEW.user_id, NEW.item_id, NEW.object, COALESCE(NEW.created_at, NOW()), COALESCE(NEW.updated_at, NOW()));
      ELSIF NEW.boolean IS NOT NULL THEN
        INSERT INTO "${schema}"."${booleansTable}"(key, user_id, item_id, value, created_at, updated_at)
        VALUES (NEW.key, NEW.user_id, NEW.item_id, NEW.boolean, COALESCE(NEW.created_at, NOW()), COALESCE(NEW.updated_at, NOW()));
      ELSE
        RAISE EXCEPTION 'One of number/string/object/boolean must be provided';
      END IF;
      RETURN QUERY
        SELECT
          o.*
        FROM "${schema}"."${optionsViewTable}" o
        WHERE o.key = NEW.key AND o.item_id = NEW.item_id AND o.user_id = NEW.user_id
        ORDER BY o.created_at DESC
        LIMIT 1;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public, ${schema};
    DROP TRIGGER IF EXISTS "${optionsViewTable}_ioi_trg" ON "${schema}"."${optionsViewTable}";
    CREATE TRIGGER "${optionsViewTable}_ioi_trg" INSTEAD OF INSERT ON "${schema}"."${optionsViewTable}"
    FOR EACH ROW EXECUTE FUNCTION "${schema}"."${optionsViewTable}_ioi"();
  `);

  await hasura.sql(`
    CREATE OR REPLACE FUNCTION "${schema}"."${optionsViewTable}_iou"() RETURNS TRIGGER AS $$
    BEGIN
      PERFORM validation.validate_option_key('${schema}', '${optionsViewTable}', COALESCE(NEW.key, OLD.key));
      -- same type update
      IF OLD.number_id IS NOT NULL AND NEW.number IS NOT NULL THEN
        UPDATE "${schema}"."${numbersTable}"
        SET value = NEW.number, key = COALESCE(NEW.key, OLD.key), item_id = COALESCE(NEW.item_id, OLD.item_id), updated_at = NOW()
        WHERE id = OLD.number_id;
      ELSIF OLD.string_id IS NOT NULL AND NEW.string IS NOT NULL THEN
        UPDATE "${schema}"."${stringsTable}"
        SET value = NEW.string, key = COALESCE(NEW.key, OLD.key), item_id = COALESCE(NEW.item_id, OLD.item_id), updated_at = NOW()
        WHERE id = OLD.string_id;
      ELSIF OLD.object_id IS NOT NULL AND NEW.object IS NOT NULL THEN
        UPDATE "${schema}"."${objectsTable}"
        SET value = NEW.object, key = COALESCE(NEW.key, OLD.key), item_id = COALESCE(NEW.item_id, OLD.item_id), updated_at = NOW()
        WHERE id = OLD.object_id;
      ELSIF OLD.boolean_id IS NOT NULL AND NEW.boolean IS NOT NULL THEN
        UPDATE "${schema}"."${booleansTable}"
        SET value = NEW.boolean, key = COALESCE(NEW.key, OLD.key), item_id = COALESCE(NEW.item_id, OLD.item_id), updated_at = NOW()
        WHERE id = OLD.boolean_id;
      END IF;
      -- type switch: delete old, insert new
      IF OLD.number_id IS NOT NULL THEN DELETE FROM "${schema}"."${numbersTable}" WHERE id = OLD.number_id; END IF;
      IF OLD.string_id IS NOT NULL THEN DELETE FROM "${schema}"."${stringsTable}" WHERE id = OLD.string_id; END IF;
      IF OLD.object_id IS NOT NULL THEN DELETE FROM "${schema}"."${objectsTable}" WHERE id = OLD.object_id; END IF;
      IF OLD.boolean_id IS NOT NULL THEN DELETE FROM "${schema}"."${booleansTable}" WHERE id = OLD.boolean_id; END IF;

      IF NEW.number IS NOT NULL THEN
        INSERT INTO "${schema}"."${numbersTable}"(key, user_id, item_id, value, created_at, updated_at)
        VALUES (COALESCE(NEW.key, OLD.key), COALESCE(NEW.user_id, OLD.user_id), COALESCE(NEW.item_id, OLD.item_id), NEW.number, COALESCE(NEW.created_at, OLD.created_at, NOW()), NOW());
        RETURN NEW;
      ELSIF NEW.string IS NOT NULL THEN
        INSERT INTO "${schema}"."${stringsTable}"(key, user_id, item_id, value, created_at, updated_at)
        VALUES (COALESCE(NEW.key, OLD.key), COALESCE(NEW.user_id, OLD.user_id), COALESCE(NEW.item_id, OLD.item_id), NEW.string, COALESCE(NEW.created_at, OLD.created_at, NOW()), NOW());
      ELSIF NEW.object IS NOT NULL THEN
        INSERT INTO "${schema}"."${objectsTable}"(key, user_id, item_id, value, created_at, updated_at)
        VALUES (COALESCE(NEW.key, OLD.key), COALESCE(NEW.user_id, OLD.user_id), COALESCE(NEW.item_id, OLD.item_id), NEW.object, COALESCE(NEW.created_at, OLD.created_at, NOW()), NOW());
      ELSIF NEW.boolean IS NOT NULL THEN
        INSERT INTO "${schema}"."${booleansTable}"(key, user_id, item_id, value, created_at, updated_at)
        VALUES (COALESCE(NEW.key, OLD.key), COALESCE(NEW.user_id, OLD.user_id), COALESCE(NEW.item_id, OLD.item_id), NEW.boolean, COALESCE(NEW.created_at, OLD.created_at, NOW()), NOW());
      ELSE
        RAISE EXCEPTION 'One of number/string/object/boolean must be provided';
      END IF;
      RETURN QUERY
        SELECT
          o.*
        FROM "${schema}"."${optionsViewTable}" o
        WHERE o.id = COALESCE(NEW.id, OLD.id)
        LIMIT 1;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public, ${schema};
    DROP TRIGGER IF EXISTS "${optionsViewTable}_iou_trg" ON "${schema}"."${optionsViewTable}";
    CREATE TRIGGER "${optionsViewTable}_iou_trg" INSTEAD OF UPDATE ON "${schema}"."${optionsViewTable}"
    FOR EACH ROW EXECUTE FUNCTION "${schema}"."${optionsViewTable}_iou"();
  `);

  await hasura.sql(`
    CREATE OR REPLACE FUNCTION "${schema}"."${optionsViewTable}_iod"() RETURNS TRIGGER AS $$
    BEGIN
      IF OLD.number_id IS NOT NULL THEN
        DELETE FROM "${schema}"."${numbersTable}" WHERE id = OLD.number_id;
      ELSIF OLD.string_id IS NOT NULL THEN
        DELETE FROM "${schema}"."${stringsTable}" WHERE id = OLD.string_id;
      ELSIF OLD.object_id IS NOT NULL THEN
        DELETE FROM "${schema}"."${objectsTable}" WHERE id = OLD.object_id;
      ELSIF OLD.boolean_id IS NOT NULL THEN
        DELETE FROM "${schema}"."${booleansTable}" WHERE id = OLD.boolean_id;
      END IF;
      RETURN OLD;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public, ${schema};
    DROP TRIGGER IF EXISTS "${optionsViewTable}_iod_trg" ON "${schema}"."${optionsViewTable}";
    CREATE TRIGGER "${optionsViewTable}_iod_trg" INSTEAD OF DELETE ON "${schema}"."${optionsViewTable}"
    FOR EACH ROW EXECUTE FUNCTION "${schema}"."${optionsViewTable}_iod"();
  `);

  // Track base and view
  for (const base of baseTables) {
    await hasura.trackTable({ schema, table: base.name });
  }
  await hasura.trackView({ schema, name: optionsViewTable });

  // Relationships from view to base (manual; views have no FKs)
  await hasura.defineRelationship({
    schema,
    table: optionsViewTable,
    name: 'number_row',
    type: 'object',
    using: {
      manual_configuration: {
        remote_table: { schema, name: numbersTable },
        column_mapping: { number_id: 'id' }
      }
    }
  } as any);
  await hasura.defineRelationship({
    schema,
    table: optionsViewTable,
    name: 'string_row',
    type: 'object',
    using: {
      manual_configuration: {
        remote_table: { schema, name: stringsTable },
        column_mapping: { string_id: 'id' }
      }
    }
  } as any);
  await hasura.defineRelationship({
    schema,
    table: optionsViewTable,
    name: 'object_row',
    type: 'object',
    using: {
      manual_configuration: {
        remote_table: { schema, name: objectsTable },
        column_mapping: { object_id: 'id' }
      }
    }
  } as any);
  await hasura.defineRelationship({
    schema,
    table: optionsViewTable,
    name: 'boolean_row',
    type: 'object',
    using: {
      manual_configuration: {
        remote_table: { schema, name: booleansTable },
        column_mapping: { boolean_id: 'id' }
      }
    }
  } as any);

  // Permissions: hide base tables; expose only view
  // Anonymous select all
  await hasura.definePermission({ schema, table: optionsViewTable, operation: 'select', role: 'anonymous', filter: {}, columns: true });
  // User can manage own rows by user_id
  const ownerFilter = { user_id: { _eq: 'X-Hasura-User-Id' } } as any;
  for (const op of ['select','insert','update','delete'] as const) {
    await hasura.definePermission({ schema, table: optionsViewTable, operation: op, role: 'user', filter: ownerFilter, columns: true, set: op === 'insert' || op === 'update' ? { user_id: 'X-Hasura-User-Id' } : undefined });
  }

  // Clean up any existing function duplicates first
  await hasura.sql(`
    DROP FUNCTION IF EXISTS "${schema}"."${optionsViewTable}_insert"(text, uuid, uuid, numeric, text, jsonb, boolean);
    DROP FUNCTION IF EXISTS "${schema}"."${optionsViewTable}_insert"(text, uuid, numeric, text, jsonb, boolean);
    DROP FUNCTION IF EXISTS "${schema}"."${optionsViewTable}_insert"(text, jsonb);
    DROP FUNCTION IF EXISTS "${schema}"."${optionsViewTable}_insert"(text, text, text);
    DROP FUNCTION IF EXISTS "${schema}"."${optionsViewTable}_update"(uuid, text, uuid, numeric, text, jsonb, boolean);
    DROP FUNCTION IF EXISTS "${schema}"."${optionsViewTable}_update"(uuid, jsonb);
    DROP FUNCTION IF EXISTS "${schema}"."${optionsViewTable}_update"(uuid);
    DROP FUNCTION IF EXISTS "${schema}"."${optionsViewTable}_delete"(uuid);
  `);

  // GraphQL-exposed helper functions (return SETOF base table to avoid view conflicts)
  // INSERT: simple key+value, derive user_id from session
  await hasura.sql(`
    CREATE OR REPLACE FUNCTION "${schema}"."${optionsViewTable}_insert"(
      _key TEXT,
      _value JSONB
    ) RETURNS SETOF "${schema}"."${stringsTable}" AS $$
    DECLARE
      session_vars jsonb;
      v_user uuid;
      v_type text;
    BEGIN
      -- Get user from session (admin can work without specific user_id)
      session_vars := current_setting('hasura.user', true)::jsonb;
      IF session_vars ? 'x-hasura-user-id' THEN
        v_user := (session_vars ->> 'x-hasura-user-id')::uuid;
      ELSIF session_vars ->> 'x-hasura-role' = 'admin' THEN
        v_user := '00000000-0000-0000-0000-000000000001'::uuid; -- Default admin user
      ELSE
        RAISE EXCEPTION 'Missing X-Hasura-User-Id';
      END IF;
      
      -- Validate key if validation is bound
      PERFORM validation.validate_option_key('${schema}', '${optionsViewTable}', _key);
      
      -- Determine value type and insert
      v_type := jsonb_typeof(_value);
      
      IF v_type = 'number' THEN
        INSERT INTO "${schema}"."${numbersTable}" (key, user_id, value, created_at, updated_at)
        VALUES (_key, v_user, (_value #>> '{}')::numeric, EXTRACT(EPOCH FROM NOW())::bigint * 1000, EXTRACT(EPOCH FROM NOW())::bigint * 1000);
      ELSIF v_type = 'string' THEN
        INSERT INTO "${schema}"."${stringsTable}" (key, user_id, value, created_at, updated_at)
        VALUES (_key, v_user, _value #>> '{}', EXTRACT(EPOCH FROM NOW())::bigint * 1000, EXTRACT(EPOCH FROM NOW())::bigint * 1000);
      ELSIF v_type = 'boolean' THEN
        INSERT INTO "${schema}"."${booleansTable}" (key, user_id, value, created_at, updated_at)
        VALUES (_key, v_user, (_value #>> '{}')::boolean, EXTRACT(EPOCH FROM NOW())::bigint * 1000, EXTRACT(EPOCH FROM NOW())::bigint * 1000);
      ELSE
        INSERT INTO "${schema}"."${objectsTable}" (key, user_id, value, created_at, updated_at)
        VALUES (_key, v_user, _value, EXTRACT(EPOCH FROM NOW())::bigint * 1000, EXTRACT(EPOCH FROM NOW())::bigint * 1000);
      END IF;
      
      -- Return the inserted row from appropriate table, or create placeholder for strings table
      IF v_type = 'string' THEN
        RETURN QUERY SELECT * FROM "${schema}"."${stringsTable}" 
        WHERE key = _key AND user_id = v_user
        ORDER BY created_at DESC LIMIT 1;
      ELSE
        -- For non-string types, create a temporary row in strings table to return
        INSERT INTO "${schema}"."${stringsTable}" (key, user_id, value, created_at, updated_at)
        VALUES (_key || '_placeholder', v_user, 'success', EXTRACT(EPOCH FROM NOW())::bigint * 1000, EXTRACT(EPOCH FROM NOW())::bigint * 1000);
        RETURN QUERY SELECT * FROM "${schema}"."${stringsTable}" 
        WHERE key = _key || '_placeholder' AND user_id = v_user
        ORDER BY created_at DESC LIMIT 1;
        -- Clean up the placeholder
        DELETE FROM "${schema}"."${stringsTable}" WHERE key = _key || '_placeholder' AND user_id = v_user;
      END IF;
    END;
    $$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = pg_catalog, public, ${schema};
  `);

  // UPDATE: simple id+value update
  await hasura.sql(`
    CREATE OR REPLACE FUNCTION "${schema}"."${optionsViewTable}_update"(
      _id UUID,
      _value JSONB
    ) RETURNS SETOF "${schema}"."${stringsTable}" AS $$
    DECLARE
      session_vars jsonb;
      v_user uuid;
      rec RECORD;
      v_type text;
    BEGIN
      -- Get user from session (admin can work without specific user_id)
      session_vars := current_setting('hasura.user', true)::jsonb;
      IF session_vars ? 'x-hasura-user-id' THEN
        v_user := (session_vars ->> 'x-hasura-user-id')::uuid;
      ELSIF session_vars ->> 'x-hasura-role' = 'admin' THEN
        v_user := '00000000-0000-0000-0000-000000000001'::uuid; -- Default admin user
      ELSE
        RAISE EXCEPTION 'Missing X-Hasura-User-Id';
      END IF;
      
      -- Get existing record from view
      SELECT * INTO rec FROM "${schema}"."${optionsViewTable}" WHERE id = _id;
      IF NOT FOUND THEN RAISE EXCEPTION 'Option not found'; END IF;
      IF rec.user_id <> v_user THEN RAISE EXCEPTION 'Forbidden'; END IF;
      
      -- Validate key
      PERFORM validation.validate_option_key('${schema}', '${optionsViewTable}', rec.key);
      v_type := jsonb_typeof(_value);
      
      -- Delete old value from appropriate table
      IF rec.number_id IS NOT NULL THEN DELETE FROM "${schema}"."${numbersTable}" WHERE id = rec.number_id; END IF;
      IF rec.string_id IS NOT NULL THEN DELETE FROM "${schema}"."${stringsTable}" WHERE id = rec.string_id; END IF;
      IF rec.object_id IS NOT NULL THEN DELETE FROM "${schema}"."${objectsTable}" WHERE id = rec.object_id; END IF;
      IF rec.boolean_id IS NOT NULL THEN DELETE FROM "${schema}"."${booleansTable}" WHERE id = rec.boolean_id; END IF;
      
      -- Insert new value to appropriate table
      IF v_type = 'number' THEN
        INSERT INTO "${schema}"."${numbersTable}" (key, user_id, item_id, value, created_at, updated_at)
        VALUES (rec.key, rec.user_id, rec.item_id, (_value #>> '{}')::numeric, rec.created_at, EXTRACT(EPOCH FROM NOW())::bigint * 1000);
        -- Return from strings table (placeholder, will be ignored)
        RETURN QUERY SELECT s.* FROM "${schema}"."${stringsTable}" s WHERE FALSE;
      ELSIF v_type = 'string' THEN
        INSERT INTO "${schema}"."${stringsTable}" (key, user_id, item_id, value, created_at, updated_at)
        VALUES (rec.key, rec.user_id, rec.item_id, _value #>> '{}', rec.created_at, EXTRACT(EPOCH FROM NOW())::bigint * 1000);
        RETURN QUERY SELECT * FROM "${schema}"."${stringsTable}"
        WHERE key = rec.key AND user_id = rec.user_id AND item_id = rec.item_id;
      ELSIF v_type = 'boolean' THEN
        INSERT INTO "${schema}"."${booleansTable}" (key, user_id, item_id, value, created_at, updated_at)
        VALUES (rec.key, rec.user_id, rec.item_id, (_value #>> '{}')::boolean, rec.created_at, EXTRACT(EPOCH FROM NOW())::bigint * 1000);
        -- Return from strings table (placeholder, will be ignored)
        RETURN QUERY SELECT s.* FROM "${schema}"."${stringsTable}" s WHERE FALSE;
      ELSE
        INSERT INTO "${schema}"."${objectsTable}" (key, user_id, item_id, value, created_at, updated_at)
        VALUES (rec.key, rec.user_id, rec.item_id, _value, rec.created_at, EXTRACT(EPOCH FROM NOW())::bigint * 1000);
        -- Return from strings table (placeholder, will be ignored)
        RETURN QUERY SELECT s.* FROM "${schema}"."${stringsTable}" s WHERE FALSE;
      END IF;
    END;
    $$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = pg_catalog, public, ${schema};
  `);

  // DELETE: simple id delete
  await hasura.sql(`
    CREATE OR REPLACE FUNCTION "${schema}"."${optionsViewTable}_delete"(
      _id UUID
    ) RETURNS SETOF "${schema}"."${stringsTable}" AS $$
    DECLARE
      session_vars jsonb;
      v_user uuid;
      rec RECORD;
    BEGIN
      -- Get user from session (admin can work without specific user_id)
      session_vars := current_setting('hasura.user', true)::jsonb;
      IF session_vars ? 'x-hasura-user-id' THEN
        v_user := (session_vars ->> 'x-hasura-user-id')::uuid;
      ELSIF session_vars ->> 'x-hasura-role' = 'admin' THEN
        v_user := '00000000-0000-0000-0000-000000000001'::uuid; -- Default admin user
      ELSE
        RAISE EXCEPTION 'Missing X-Hasura-User-Id';
      END IF;
      
      -- Get existing record from view
      SELECT * INTO rec FROM "${schema}"."${optionsViewTable}" WHERE id = _id;
      IF NOT FOUND THEN RAISE EXCEPTION 'Option not found'; END IF;
      IF rec.user_id <> v_user THEN RAISE EXCEPTION 'Forbidden'; END IF;
      
      -- Return placeholder before deletion (function must return something)
      RETURN QUERY SELECT s.* FROM "${schema}"."${stringsTable}" s WHERE FALSE;
      
      -- Delete from appropriate table
      IF rec.number_id IS NOT NULL THEN DELETE FROM "${schema}"."${numbersTable}" WHERE id = rec.number_id; END IF;
      IF rec.string_id IS NOT NULL THEN DELETE FROM "${schema}"."${stringsTable}" WHERE id = rec.string_id; END IF;
      IF rec.object_id IS NOT NULL THEN DELETE FROM "${schema}"."${objectsTable}" WHERE id = rec.object_id; END IF;
      IF rec.boolean_id IS NOT NULL THEN DELETE FROM "${schema}"."${booleansTable}" WHERE id = rec.boolean_id; END IF;
    END;
    $$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = pg_catalog, public, ${schema};
  `);

  // Ensure functions are untracked before re-tracking as mutations (idempotent)
  for (const fname of [
    `${optionsViewTable}_insert`,
    `${optionsViewTable}_update`,
    `${optionsViewTable}_delete`
  ]) {
    try {
      await hasura.v1({
        type: 'pg_untrack_function',
        args: { source: 'default', function: { schema, name: fname } }
      });
    } catch (e) { /* ignore */ }
  }

  // Track functions as mutations without custom names
  const functionNames = [
    `${optionsViewTable}_insert`,
    `${optionsViewTable}_update`, 
    `${optionsViewTable}_delete`
  ];
  
  for (const funcName of functionNames) {
    await hasura.v1({
      type: 'pg_track_function',
      args: { 
        source: 'default', 
        function: { schema, name: funcName }, 
        configuration: { exposed_as: 'mutation' } 
      }
    });
  }

  // Create function permissions via Hasura API (without SQL GRANT)
  for (const funcName of functionNames) {
    try {
      await hasura.v1({
        type: 'pg_create_function_permission',
        args: { 
          source: 'default', 
          function: { schema, name: funcName }, 
          role: 'user' 
        }
      });
    } catch (e) {
      console.warn(`Warning: Could not create permission for ${funcName}: ${e}`);
    }
  }

  debug('✅ Options schema applied');
}



import Debug from '../debug';
import { Hasura, ColumnType } from '../hasura/hasura';

const debug = Debug('migration:up-items');

export async function up(customHasura?: Hasura) {
  debug('🚀 Starting Hasura items migration UP...');
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.ensureDefaultSource();

  const schema = 'public';
  const table = 'items';

  // Create table via helpers (id uuid + created_at/updated_at bigint ms epoch)
  await hasura.defineTable({ schema, table, id: 'id', type: ColumnType.UUID });
  await hasura.defineColumn({ schema, table, name: 'parent_id', type: ColumnType.UUID });
  await hasura.defineColumn({ schema, table, name: 'parents_ids', type: ColumnType.JSONB, postfix: "NOT NULL DEFAULT '[]'::jsonb" });

  // FK to self with ON DELETE SET NULL
  await hasura.defineForeignKey({
    from: { schema, table, column: 'parent_id' },
    to: { schema, table, column: 'id' },
    on_delete: 'SET NULL',
    name: `${table}_parent_id_fkey`
  });

  // Indexes
  await hasura.sql(`CREATE INDEX IF NOT EXISTS ${table}_parent_idx ON ${schema}.${table} (parent_id);`);
  await hasura.sql(`CREATE INDEX IF NOT EXISTS ${table}_parents_ids_gin ON ${schema}.${table} USING GIN (parents_ids jsonb_path_ops);`);

  // Function to compute parents_ids for a given item id
  await hasura.defineFunction({
    schema,
    name: 'items_compute_parents_ids',
    language: 'plpgsql',
    definition: `(_parent uuid)
RETURNS jsonb AS $$
DECLARE
  result jsonb := '[]'::jsonb;
  cur_parent uuid;
  loop_guard integer := 0;
BEGIN
  cur_parent := _parent;
  WHILE cur_parent IS NOT NULL LOOP
    result := result || jsonb_build_array(cur_parent::text);
    SELECT parent_id INTO cur_parent FROM ${schema}.${table} WHERE id = cur_parent;
    loop_guard := loop_guard + 1;
    IF loop_guard > 100 THEN
      RAISE EXCEPTION 'items_compute_parents_ids: likely cycle detected starting from %', _parent;
    END IF;
  END LOOP;
  RETURN result;
END
$$`,
  });

  // Function to rebuild descendants for a given start id
  await hasura.defineFunction({
    schema,
    name: 'items_rebuild_descendants',
    language: 'plpgsql',
    definition: `(_start_id uuid)
RETURNS void AS $$
DECLARE
  rec record;
BEGIN
  -- Recompute for _start_id itself if exists
  UPDATE ${schema}.${table} AS t
  SET parents_ids = ${schema}.items_compute_parents_ids(t.parent_id), updated_at = (EXTRACT(EPOCH FROM NOW())*1000)::bigint
  WHERE t.id = _start_id;

  -- Recompute for all descendants
  FOR rec IN (
    WITH RECURSIVE down AS (
      SELECT id FROM ${schema}.${table} WHERE parent_id = _start_id
      UNION ALL
      SELECT c.id FROM ${schema}.${table} c
      JOIN down d ON c.parent_id = d.id
    )
    SELECT id FROM down
  ) LOOP
    UPDATE ${schema}.${table} AS t
    SET parents_ids = ${schema}.items_compute_parents_ids(t.parent_id), updated_at = (EXTRACT(EPOCH FROM NOW())*1000)::bigint
    WHERE t.id = rec.id;
  END LOOP;
END
$$`,
  });

  // BEFORE INSERT/UPDATE trigger: set parents_ids on change and protect parents_ids from manual edits
  await hasura.defineFunction({
    schema,
    name: 'items_before_write',
    language: 'plpgsql',
    definition: `()
RETURNS trigger AS $$
BEGIN
  -- basic cycle guard
  IF NEW.parent_id IS NOT NULL AND NEW.parent_id = NEW.id THEN
    RAISE EXCEPTION 'parent_id cannot reference self';
  END IF;

  -- always compute correct parents_ids
  DECLARE
    computed_parents_ids jsonb;
  BEGIN
    computed_parents_ids := ${schema}.items_compute_parents_ids(NEW.parent_id);
    
    -- on UPDATE, check if parents_ids was manually changed to incorrect value
    IF TG_OP = 'UPDATE' AND NEW.parents_ids IS DISTINCT FROM OLD.parents_ids 
       AND NEW.parents_ids IS DISTINCT FROM computed_parents_ids THEN
      RAISE EXCEPTION 'parents_ids is managed by trigger and cannot be updated directly';
    END IF;
    
    -- set correct parents_ids
    NEW.parents_ids := computed_parents_ids;
  END;

  NEW.updated_at := (EXTRACT(EPOCH FROM NOW())*1000)::bigint;
  RETURN NEW;
END
$$`,
  });

  await hasura.defineTrigger({
    schema,
    table,
    name: `trg_${table}_before_write`,
    timing: 'BEFORE',
    event: 'INSERT OR UPDATE',
    function_name: `${schema}.items_before_write`
  });

  // AFTER UPDATE OF parent_id -> rebuild descendants
  await hasura.defineFunction({
    schema,
    name: 'items_after_update_parent',
    language: 'plpgsql',
    definition: `()
RETURNS trigger AS $$
BEGIN
  PERFORM ${schema}.items_rebuild_descendants(NEW.id);
  RETURN NEW;
END
$$`,
  });
  await hasura.defineTrigger({
    schema,
    table,
    name: `trg_${table}_after_update_parent`,
    timing: 'AFTER',
    event: 'UPDATE OF parent_id',
    function_name: `${schema}.items_after_update_parent`
  });

  // BEFORE DELETE -> reattach children to OLD.parent_id before FK ON DELETE SET NULL fires
  await hasura.defineFunction({
    schema,
    name: 'items_before_delete',
    language: 'plpgsql',
    definition: `()
RETURNS trigger AS $$
DECLARE
  rec record;
BEGIN
  -- Reattach direct children to the deleted item's parent BEFORE the row is deleted,
  -- so FK ON DELETE SET NULL doesn't break the chain
  UPDATE ${schema}.${table}
  SET parent_id = OLD.parent_id, updated_at = (EXTRACT(EPOCH FROM NOW())*1000)::bigint
  WHERE parent_id = OLD.id;

  -- Rely on AFTER UPDATE OF parent_id trigger to rebuild descendants for each updated child
  RETURN OLD;
END
$$`,
  });
  await hasura.defineTrigger({
    schema,
    table,
    name: `trg_${table}_before_delete`,
    timing: 'BEFORE',
    event: 'DELETE',
    function_name: `${schema}.items_before_delete`
  });

  // Add timestamp trigger for updated_at
  await hasura.defineFunction({
    schema: 'public',
    name: 'set_current_timestamp_updated_at',
    replace: true,
    language: 'plpgsql',
    definition: `()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := (EXTRACT(EPOCH FROM NOW())*1000)::bigint;
  RETURN NEW;
END;$$`,
  });

  await hasura.defineTrigger({
    schema: 'public',
    table: 'items',
    name: 'items_set_updated_at',
    timing: 'BEFORE',
    event: 'UPDATE',
    function_name: 'public.set_current_timestamp_updated_at',
    replace: true,
  });

  // Track table and define permissions (default: any user can CRUD; anonymous can select)
  await hasura.trackTable({ schema, table });
  await hasura.definePermission({ schema, table, operation: 'select', role: ['anonymous','user','me','admin'], filter: {}, aggregate: true, columns: true });
  // Basic permissions for admin role (full access)
  await hasura.definePermission({ schema, table, operation: 'insert', role: 'admin', filter: {}, columns: ['id', 'parent_id', 'parents_ids'] });
  await hasura.definePermission({ schema, table, operation: 'update', role: 'admin', filter: {}, columns: true });
  await hasura.definePermission({ schema, table, operation: 'delete', role: 'admin', filter: {}, columns: true });

  // User/me permissions with user_id option logic
  for (const role of ['user','me'] as const) {
    // Insert: no restrictions at insert level (user_id option is added separately)
    await hasura.definePermission({ 
      schema, table, operation: 'insert', role,
      filter: {},
      columns: ['id', 'parent_id', 'parents_ids'] 
    });

    // Update/delete: allowed if no user_id option OR user_id option points to current user
    const userFilter = {
      _or: [
        // No user_id option exists
        {
          _not: {
            options: {
              key: { _eq: 'user_id' }
            }
          }
        },
        // user_id option exists and points to current user
        {
          options: {
            key: { _eq: 'user_id' },
            to_id: { _eq: 'X-Hasura-User-Id' }
          }
        }
      ]
    };
    
    await hasura.definePermission({ schema, table, operation: 'update', role, filter: userFilter, columns: true });
    await hasura.definePermission({ schema, table, operation: 'delete', role, filter: userFilter, columns: true });
  }

  // Relationships: items -> options (array), options -> items (object)
  // Note: items.hasyx relationship is created by up-hasyx.ts automatically
  try {
    // options.item (object relationship)
    await hasura.v1({
      type: 'pg_create_object_relationship',
      args: {
        source: 'default',
        table: { schema: 'public', name: 'options' },
        name: 'item',
        using: {
          manual_configuration: {
            remote_table: { schema: 'public', name: 'items' },
            column_mapping: { item_id: 'id' }
          }
        }
      }
    });
  } catch {}
  try {
    // items.options (array relationship)
    await hasura.v1({
      type: 'pg_create_array_relationship',
      args: {
        source: 'default',
        table: { schema: 'public', name: 'items' },
        name: 'options',
        using: {
          manual_configuration: {
            remote_table: { schema: 'public', name: 'options' },
            column_mapping: { id: 'item_id' }
          }
        }
      }
    });
  } catch {}

  // options.geo (object relationship to geo.features)
  try {
    await hasura.v1({
      type: 'pg_create_object_relationship',
      args: {
        source: 'default',
        table: { schema: 'public', name: 'options' },
        name: 'geo',
        using: {
          manual_configuration: {
            remote_table: { schema: 'geo', name: 'features' },
            column_mapping: { to_id: 'id' }
          }
        }
      }
    });
  } catch {}

  debug('✨ Hasura items migration UP completed successfully!');
  return true;
}



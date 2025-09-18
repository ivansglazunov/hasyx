import Debug from '../debug';
import { Hasura, ColumnType } from '../hasura/hasura';

const debug = Debug('migration:up-item-options');

export async function up(customHasura?: Hasura) {
  debug('🚀 Starting Hasura item_options view migration UP...');
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.ensureDefaultSource();

  const schema = 'public';
  const viewName = 'item_options';

  // Create view that shows inherited options from parents + direct options
  // For each item, we look at:
  // 1. Direct options (where options.item_id = items.id)
  // 2. Inherited options from parents (where options.item_id IN items.parents_ids)
  await hasura.sql(`
    CREATE OR REPLACE VIEW ${schema}.${viewName} AS
    WITH RECURSIVE item_hierarchy AS (
      -- Base case: all items with their direct options
      SELECT 
        i.id as item_id,
        o.id,
        o.key,
        o.user_id,
        o.item_id as _item_id,  -- original item_id from options table
        o.to_id,
        o.string_value,
        o.number_value,
        o.boolean_value,
        o.jsonb_value,
        o.created_at,
        o.updated_at,
        0 as inheritance_level  -- 0 = direct option
      FROM ${schema}.items i
      LEFT JOIN ${schema}.options o ON o.item_id = i.id
      
      UNION ALL
      
      -- Recursive case: options from parent items
      SELECT DISTINCT
        i.id as item_id,
        o.id,
        o.key,
        o.user_id,
        o.item_id as _item_id,
        o.to_id,
        o.string_value,
        o.number_value,
        o.boolean_value,
        o.jsonb_value,
        o.created_at,
        o.updated_at,
        COALESCE((
          SELECT pos
          FROM jsonb_array_elements_text(i.parents_ids) WITH ORDINALITY AS parent_elem(parent_id, pos)
          WHERE parent_elem.parent_id::uuid = o.item_id
          LIMIT 1
        ), 999) as inheritance_level
      FROM ${schema}.items i
      CROSS JOIN LATERAL (
        SELECT unnest(
          CASE 
            WHEN jsonb_array_length(i.parents_ids) > 0 THEN
              (SELECT array_agg(value::text::uuid) FROM jsonb_array_elements_text(i.parents_ids))
            ELSE ARRAY[]::uuid[]
          END
        ) as parent_id
      ) parents
      JOIN ${schema}.options o ON o.item_id = parents.parent_id
    )
    SELECT DISTINCT
      item_id,
      id,
      key,
      user_id,
      _item_id,
      to_id,
      string_value,
      number_value,
      boolean_value,
      jsonb_value,
      created_at,
      updated_at,
      inheritance_level
    FROM item_hierarchy
    WHERE id IS NOT NULL  -- Filter out items without any options
    ORDER BY item_id, key, inheritance_level;  -- Direct options (level 0) come first
  `);

  // Track the view as a table
  await hasura.trackTable({ schema, table: viewName });

  // Define permissions for the view (similar to options table)
  await hasura.definePermission({ 
    schema, 
    table: viewName, 
    operation: 'select', 
    role: ['anonymous','user','me','admin'], 
    filter: {}, 
    aggregate: true, 
    columns: true 
  });

  // Create relationships
  try {
    // item_options.item (object relationship to items)
    await hasura.v1({
      type: 'pg_create_object_relationship',
      args: {
        source: 'default',
        table: { schema, name: viewName },
        name: 'item',
        using: {
          manual_configuration: {
            remote_table: { schema, name: 'items' },
            column_mapping: { item_id: 'id' }
          }
        }
      }
    });
  } catch {}

  try {
    // item_options._item (object relationship to items - original owner)
    await hasura.v1({
      type: 'pg_create_object_relationship',
      args: {
        source: 'default',
        table: { schema, name: viewName },
        name: '_item',
        using: {
          manual_configuration: {
            remote_table: { schema, name: 'items' },
            column_mapping: { _item_id: 'id' }
          }
        }
      }
    });
  } catch {}

  try {
    // item_options.user (object relationship to users)
    await hasura.v1({
      type: 'pg_create_object_relationship',
      args: {
        source: 'default',
        table: { schema, name: viewName },
        name: 'user',
        using: {
          manual_configuration: {
            remote_table: { schema, name: 'users' },
            column_mapping: { user_id: 'id' }
          }
        }
      }
    });
  } catch {}

  try {
    // item_options.to (object relationship to hasyx view for UUID references)
    await hasura.v1({
      type: 'pg_create_object_relationship',
      args: {
        source: 'default',
        table: { schema, name: viewName },
        name: 'to',
        using: {
          manual_configuration: {
            remote_table: { schema, name: 'hasyx' },
            column_mapping: { to_id: 'id_uuid' }
          }
        }
      }
    });
  } catch {}

  try {
    // items.item_options (array relationship)
    await hasura.v1({
      type: 'pg_create_array_relationship',
      args: {
        source: 'default',
        table: { schema, name: 'items' },
        name: 'item_options',
        using: {
          manual_configuration: {
            remote_table: { schema, name: viewName },
            column_mapping: { id: 'item_id' }
          }
        }
      }
    });
  } catch {}

  debug('✨ Hasura item_options view migration UP completed successfully!');
  return true;
}

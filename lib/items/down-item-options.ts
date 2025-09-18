import Debug from '../debug';
import { Hasura } from '../hasura/hasura';

const debug = Debug('migration:down-item-options');

export async function down(customHasura?: Hasura) {
  debug('🚀 Starting Hasura item_options view migration DOWN...');
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.ensureDefaultSource();

  const schema = 'public';
  const viewName = 'item_options';

  try {
    // Remove array relationship from items
    await hasura.v1({
      type: 'pg_drop_relationship',
      args: {
        source: 'default',
        table: { schema, name: 'items' },
        relationship: 'item_options'
      }
    });
  } catch {}

  try {
    // Remove object relationships from item_options view
    const relationships = ['item', '_item', 'user', 'to'];
    for (const rel of relationships) {
      try {
        await hasura.v1({
          type: 'pg_drop_relationship',
          args: {
            source: 'default',
            table: { schema, name: viewName },
            relationship: rel
          }
        });
      } catch {}
    }
  } catch {}

  // Untrack the view
  try {
    await hasura.v1({
      type: 'pg_untrack_table',
      args: {
        source: 'default',
        table: { schema, name: viewName }
      }
    });
  } catch {}

  // Drop the view
  await hasura.sql(`DROP VIEW IF EXISTS ${schema}.${viewName};`);

  debug('✨ Hasura item_options view migration DOWN completed successfully!');
  return true;
}

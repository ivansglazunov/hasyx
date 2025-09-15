import dotenv from 'dotenv';
import { down } from 'hasyx/lib/options/down-options';
import { Hasura } from 'hasyx/lib/hasura/hasura';

dotenv.config();

// Run the down migration with same names as up migration
(async () => {
  try {
    // Remove permissions first to avoid metadata leftovers
    const hasura = new Hasura({
      url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
      secret: process.env.HASURA_ADMIN_SECRET!,
    });
    const schema = 'public';
    const table = 'options';
    try { await hasura.deletePermission({ schema, table, operation: 'select', role: 'anonymous' }); } catch {}
    try { await hasura.deletePermission({ schema, table, operation: 'select', role: 'user' }); } catch {}
    try { await hasura.deletePermission({ schema, table, operation: 'insert', role: 'user' }); } catch {}
    try { await hasura.deletePermission({ schema, table, operation: 'update', role: 'user' }); } catch {}
    try { await hasura.deletePermission({ schema, table, operation: 'delete', role: 'user' }); } catch {}

    await down({
      optionsTable: 'options'
    });
    console.log('✅ Options down migration completed successfully');
  } catch (error) {
    console.error('❌ Options down migration failed:', error);
    process.exit(1);
  }
})();




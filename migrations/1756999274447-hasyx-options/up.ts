import dotenv from 'dotenv';
import { up, OPTIONS_PERMISSIONS, OPTIONS_EDITABLE_COLUMNS } from 'hasyx/lib/options/up-options';
import { Hasura } from 'hasyx/lib/hasura/hasura';

dotenv.config();

// Run the migration with default names; projects can adjust by editing migration
(async () => {
  try {
    await up({
      optionsTable: 'options',
      tableHandler: async () => {}
    });

    // Apply strict permissions here per project rules
    const hasura = new Hasura({
      url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
      secret: process.env.HASURA_ADMIN_SECRET!,
    });

    const schema = 'public';
    const table = 'options';

    // Anonymous select all
    await hasura.definePermission({
      schema,
      table,
      operation: 'select',
      role: 'anonymous',
      filter: OPTIONS_PERMISSIONS.anonymous.select.filter,
      columns: OPTIONS_PERMISSIONS.anonymous.select.columns as any
    });

    // User-specific permissions: only if item_id == X-Hasura-User-Id
    await hasura.definePermission({
      schema,
      table,
      operation: 'select',
      role: 'user',
      filter: OPTIONS_PERMISSIONS.user.select.filter as any,
      columns: OPTIONS_PERMISSIONS.user.select.columns as any
    });
    await hasura.definePermission({
      schema,
      table,
      operation: 'insert',
      role: 'user',
      filter: OPTIONS_PERMISSIONS.user.insert.check as any,
      columns: OPTIONS_EDITABLE_COLUMNS as any,
      set: OPTIONS_PERMISSIONS.user.insert.set as any
    });
    await hasura.definePermission({
      schema,
      table,
      operation: 'update',
      role: 'user',
      filter: OPTIONS_PERMISSIONS.user.update.filter as any,
      columns: OPTIONS_EDITABLE_COLUMNS as any,
      set: OPTIONS_PERMISSIONS.user.update.set as any
    });
    await hasura.definePermission({
      schema,
      table,
      operation: 'delete',
      role: 'user',
      filter: OPTIONS_PERMISSIONS.user.delete.filter as any,
      columns: OPTIONS_PERMISSIONS.user.delete.columns as any
    });
    console.log('✅ Options migration completed successfully');
  } catch (error) {
    console.error('❌ Options migration failed:', error);
    process.exit(1);
  }
})();




import dotenv from 'dotenv';
import path from 'path';
import { Hasura } from '../hasura/hasura';
import Debug from '../debug';

// Initialize debug
const debug = Debug('migration:down-invites');

/**
 * Drop permissions, relationships and untrack tables for invites feature
 */
export async function dropMetadata(hasura: Hasura) {
  debug('🧹 Dropping invites permissions, relationships and untracking tables...');

  // Drop permissions (be exhaustive over roles and ops to be safe)
  const roles = ['user', 'me', 'admin', 'anonymous'];
  const operations = ['select', 'insert', 'update', 'delete'] as const;
  const tables = [
    { schema: 'public', table: 'invites' },
    { schema: 'public', table: 'invited' },
  ];

  for (const { schema, table } of tables) {
    for (const role of roles) {
      for (const operation of operations) {
        try {
          await hasura.deletePermission({ schema, table, operation: operation as any, role });
        } catch {}
      }
    }
  }

  debug('  🗑️ Dropping relationships...');

  // Relationships on invites
  try { await hasura.deleteRelationship({ schema: 'public', table: 'invites', name: 'user' }); } catch {}
  try { await hasura.deleteRelationship({ schema: 'public', table: 'invites', name: 'inviteds' }); } catch {}

  // Relationships on invited
  try { await hasura.deleteRelationship({ schema: 'public', table: 'invited', name: 'user' }); } catch {}
  try { await hasura.deleteRelationship({ schema: 'public', table: 'invited', name: 'invite' }); } catch {}

  // Relationships added to users
  try { await hasura.deleteRelationship({ schema: 'public', table: 'users', name: 'invites' }); } catch {}
  try { await hasura.deleteRelationship({ schema: 'public', table: 'users', name: 'invited' }); } catch {}

  debug('  ✅ Relationships dropped. Untracking tables...');

  // Untrack tables
  try { await hasura.untrackTable({ schema: 'public', table: 'invited' }); } catch {}
  try { await hasura.untrackTable({ schema: 'public', table: 'invites' }); } catch {}

  debug('✅ Invites metadata dropped.');
}

/**
 * Drop invites tables
 */
export async function dropTables(hasura: Hasura) {
  debug('🧹 Dropping invites tables...');

  // Drop child table first to avoid FK issues if any
  try { await hasura.deleteTable({ schema: 'public', table: 'invited' }); } catch {}
  try { await hasura.deleteTable({ schema: 'public', table: 'invites' }); } catch {}

  debug('✅ Invites tables dropped successfully.');
}

/**
 * Main migration function to remove invites feature
 */
export async function down(customHasura?: Hasura) {
  debug('🚀 Starting Hasura Invites migration DOWN...');

  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  try {
    // First remove metadata (tracking, relationships, permissions)
    await dropMetadata(hasura);

    // Then drop the tables themselves
    await dropTables(hasura);

    debug('✨ Hasura Invites migration DOWN completed successfully!');
    return true;
  } catch (error) {
    console.error('❗ Critical error during Invites DOWN migration:', error);
    debug('❌ Invites DOWN Migration failed.');
    return false;
  }
}



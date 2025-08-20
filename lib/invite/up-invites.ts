import dotenv from 'dotenv';
import path from 'path';
import { Hasura, ColumnType } from '../hasura/hasura';
import Debug from '../debug';

// Initialize debug
const debug = Debug('migration:up-invites');

export async function applySQLSchema(hasura: Hasura) {
  debug('🔧 Applying invites SQL schema...');
  
  // Ensure public schema exists
  await hasura.defineSchema({ schema: 'public' });
  
  // Define invites table
  debug('  🔧 Creating invites table...');
  await hasura.defineTable({
    schema: 'public',
    table: 'invites',
    id: 'id',
    type: ColumnType.UUID,
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'invites',
    name: 'user_id',
    type: ColumnType.UUID,
    postfix: 'NOT NULL',
    comment: 'User who created the invite'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'invites',
    name: 'code',
    type: ColumnType.TEXT,
    postfix: 'NOT NULL UNIQUE',
    comment: 'Unique invite code'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'invites',
    name: 'created_at',
    type: ColumnType.TIMESTAMPTZ,
    postfix: 'DEFAULT NOW()',
    comment: 'When the invite was created'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'invites',
    name: 'updated_at',
    type: ColumnType.TIMESTAMPTZ,
    postfix: 'DEFAULT NOW()',
    comment: 'When the invite was last updated'
  });
  
  // Define invited table
  debug('  🔧 Creating invited table...');
  await hasura.defineTable({
    schema: 'public',
    table: 'invited',
    id: 'id',
    type: ColumnType.UUID,
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'invited',
    name: 'invite_id',
    type: ColumnType.UUID,
    postfix: 'NOT NULL',
    comment: 'Reference to the invite'
  });
  // Ensure only one invited per invite
  try {
    await hasura.sql(`ALTER TABLE "public"."invited" ADD CONSTRAINT invited_invite_id_unique UNIQUE ("invite_id");`);
  } catch (e) {
    // ignore if exists
  }
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'invited',
    name: 'user_id',
    type: ColumnType.UUID,
    postfix: 'NOT NULL',
    comment: 'User who used the invite'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'invited',
    name: 'created_at',
    type: ColumnType.BIGINT,
    postfix: 'NOT NULL',
    comment: 'When the invite was used (unix timestamp)'
  });
  
  debug('✅ Invites SQL schema applied.');
}

export async function trackTables(hasura: Hasura) {
  debug('🔍 Tracking invites tables...');
  
  await hasura.trackTable({ schema: 'public', table: 'invites' });
  await hasura.trackTable({ schema: 'public', table: 'invited' });
  
  debug('✅ Invites tables tracking complete.');
}

export async function createRelationships(hasura: Hasura) {
  debug('🔗 Creating invites relationships...');
  
  // Object relationship: invites -> user
  await hasura.defineObjectRelationshipForeign({
    schema: 'public',
    table: 'invites',
    name: 'user',
    key: 'user_id'
  });
  
  // Array relationship: invites -> invited
  await hasura.defineArrayRelationshipForeign({
    schema: 'public',
    table: 'invites',
    name: 'inviteds',
    key: 'invited.invite_id'
  });
  
  // Object relationship: invited -> user
  await hasura.defineObjectRelationshipForeign({
    schema: 'public',
    table: 'invited',
    name: 'user',
    key: 'user_id'
  });
  
  // Object relationship: invited -> invite
  await hasura.defineObjectRelationshipForeign({
    schema: 'public',
    table: 'invited',
    name: 'invite',
    key: 'invite_id'
  });
  
  // Array relationship: users -> invites
  await hasura.defineArrayRelationshipForeign({
    schema: 'public',
    table: 'users',
    name: 'invites',
    key: 'invites.user_id'
  });
  
  // Array relationship: users -> invited
  await hasura.defineArrayRelationshipForeign({
    schema: 'public',
    table: 'users',
    name: 'invited',
    key: 'invited.user_id'
  });
  
  debug('✅ Invites relationships created.');
}

export async function applyPermissions(hasura: Hasura) {
  debug('🔧 Applying invites permissions...');

  // Invites permissions
  await hasura.definePermission({
    schema: 'public',
    table: 'invites',
    operation: 'select',
    role: 'user',
    filter: { user_id: { _eq: 'X-Hasura-User-Id' } },
    columns: ['id', 'user_id', 'code', 'created_at', 'updated_at']
  });
  await hasura.definePermission({
    schema: 'public',
    table: 'invites',
    operation: 'select',
    role: 'me',
    filter: { user_id: { _eq: 'X-Hasura-User-Id' } },
    columns: ['id', 'user_id', 'code', 'created_at', 'updated_at']
  });

  await hasura.definePermission({
    schema: 'public',
    table: 'invites',
    operation: 'insert',
    role: 'user',
    filter: { user_id: { _eq: 'X-Hasura-User-Id' } },
    columns: ['user_id', 'code']
  });
  await hasura.definePermission({
    schema: 'public',
    table: 'invites',
    operation: 'insert',
    role: 'me',
    filter: { user_id: { _eq: 'X-Hasura-User-Id' } },
    columns: ['user_id', 'code']
  });

  await hasura.definePermission({
    schema: 'public',
    table: 'invites',
    operation: 'delete',
    role: 'user',
    filter: { 
      user_id: { _eq: 'X-Hasura-User-Id' },
      inviteds: { _not: {} }
    },
    columns: ['id', 'user_id', 'code', 'created_at', 'updated_at']
  });
  await hasura.definePermission({
    schema: 'public',
    table: 'invites',
    operation: 'delete',
    role: 'me',
    filter: { 
      user_id: { _eq: 'X-Hasura-User-Id' },
      inviteds: { _not: {} }
    },
    columns: ['id', 'user_id', 'code', 'created_at', 'updated_at']
  });

  // Invited permissions - no insert/update/delete for anyone
  await hasura.definePermission({
    schema: 'public',
    table: 'invited',
    operation: 'select',
    role: 'user',
    filter: { 
      _or: [
        { user_id: { _eq: 'X-Hasura-User-Id' } },
        { invite: { user_id: { _eq: 'X-Hasura-User-Id' } } }
      ]
    },
    columns: ['id', 'invite_id', 'user_id', 'created_at']
  });
  await hasura.definePermission({
    schema: 'public',
    table: 'invited',
    operation: 'select',
    role: 'me',
    filter: { 
      _or: [
        { user_id: { _eq: 'X-Hasura-User-Id' } },
        { invite: { user_id: { _eq: 'X-Hasura-User-Id' } } }
      ]
    },
    columns: ['id', 'invite_id', 'user_id', 'created_at']
  });
  // Ensure anonymous has no visibility
  await hasura.deletePermission({ schema: 'public', table: 'invites', operation: 'select', role: 'anonymous' }).catch(() => {});
  await hasura.deletePermission({ schema: 'public', table: 'invited', operation: 'select', role: 'anonymous' }).catch(() => {});

  debug('✅ Invites permissions applied.');
}

export async function up(customHasura?: Hasura) {
  debug('🚀 Starting Hasura Invites migration UP...');
  
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  
  try {
    // Ensure default data source exists before any operations
    await hasura.ensureDefaultSource();
    
    await applySQLSchema(hasura);
    await trackTables(hasura);
    await createRelationships(hasura);
    await applyPermissions(hasura);
    debug('✨ Hasura Invites migration UP completed successfully!');
    return true;
  } catch (error) {
    console.error('❗ Critical error during Invites UP migration:', error);
    debug('❌ Invites UP Migration failed.');
    return false;
  }
}

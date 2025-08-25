import dotenv from 'dotenv';
import Debug from '../debug';
import { Hasura } from '../hasura/hasura';

dotenv.config();

const debug = Debug('migration:down-groups');

export async function down(customHasura?: Hasura) {
  debug('🚀 Starting Hasura groups migration DOWN...');
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  /* ------------------------------ permissions ------------------------------ */
  const roles = ['anonymous','user','admin'];
  const tables = ['groups','memberships','invitations'] as const;
  for (const table of tables) {
    for (const role of roles) {
      for (const op of ['select','insert','update','delete'] as const) {
        try { await hasura.deletePermission({ schema: 'public', table, operation: op, role }); } catch {}
      }
    }
  }

  /* ------------------------------ relationships ------------------------------ */
  const dropRels: Array<[string,string]> = [
    // groups
    ['groups','memberships'],
    ['groups','owner'],
    ['groups','invitations'],
    // memberships
    ['memberships','group'],
    ['memberships','user'],
    ['memberships','invited_by'],
    ['memberships','created_by'],
    // invitations
    ['invitations','group'],
    ['invitations','invited_by'],
    ['invitations','invitee_user'],
  ];
  for (const [table, name] of dropRels) {
    try { await hasura.deleteRelationship({ schema: 'public', table, name }); } catch {}
  }

  /* -------------------------- triggers and functions ------------------------- */
  const triggers: Array<[string,string]> = [
    ['groups','groups_before_insert_defaults'],
    ['groups','groups_after_insert_create_owner_membership'],
    ['groups','groups_before_update_owner_policy'],
    ['groups','groups_set_updated_at'],
    ['memberships','memberships_status_guard_before_insert'],
    ['memberships','memberships_status_guard_before_update'],
    ['memberships','memberships_set_updated_at'],
    ['invitations','invitations_after_update_accept'],
    ['invitations','invitations_set_updated_at'],
  ];
  for (const [table, name] of triggers) {
    try { await hasura.deleteTrigger({ schema: 'public', table, name }); } catch {}
  }

  const functions = [
    'groups_before_insert_defaults',
    'groups_after_insert_create_owner_membership',
    'groups_before_update_owner_policy',
    'memberships_status_guard',
    'invitations_after_update_accept',
    'set_current_timestamp_updated_at',
  ];
  for (const fn of functions) {
    try { await hasura.deleteFunction({ schema: 'public', name: fn }); } catch {}
  }

  /* ------------------------------- foreign keys ------------------------------ */
  const fkNames = [
    // groups
    ['groups', 'fk_groups_owner_id_users_id'],
    ['groups', 'fk_groups_created_by_id_users_id'],
    // memberships
    ['memberships', 'fk_memberships_group_id_groups_id'],
    ['memberships', 'fk_memberships_user_id_users_id'],
    ['memberships', 'fk_memberships_invited_by_id_users_id'],
    ['memberships', 'fk_memberships_created_by_id_users_id'],
    // invitations
    ['invitations', 'fk_invitations_group_id_groups_id'],
    ['invitations', 'fk_invitations_invited_by_id_users_id'],
    ['invitations', 'fk_invitations_invitee_user_id_users_id'],
  ] as const;
  for (const [table, name] of fkNames) {
    try { await hasura.deleteForeignKey({ schema: 'public', table, name }); } catch {}
  }

  /* ---------------------------------- tables --------------------------------- */
  for (const table of ['invitations','memberships','groups']) {
    try { await hasura.deleteTable({ schema: 'public', table, cascade: true }); } catch {}
  }

  debug('✨ Hasura groups migration DOWN completed successfully!');
  return true;
}

if (require.main === module) {
  down().catch((e) => {
    console.error('❌ Groups DOWN migration failed:', e);
    process.exit(1);
  });
}



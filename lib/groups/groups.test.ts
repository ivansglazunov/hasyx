import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { createApolloClient } from '../apollo/apollo';
import { Hasyx } from '../hasyx/hasyx';
import { Groups } from './groups';
import { Generator } from '../generator';
import schema from '../../public/hasura-schema.json';
import { createTestUser } from '../create-test-user';

dotenv.config();

const generate = Generator(schema as any);

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;

function createAdminHasyx(): Hasyx {
  const apollo = createApolloClient({ url: HASURA_URL, secret: ADMIN_SECRET, ws: false });
  return new Hasyx(apollo as any, generate);
}

(!!+(process?.env?.JEST_LOCAL || '') ? describe.skip : describe)('Groups module', () => {
  it('anonymous cannot create group; user can and becomes owner', async () => {
    const adminH = createAdminHasyx();

    // anonymous client
    const anonApollo = createApolloClient({ url: HASURA_URL, ws: false });
    const anonH = new Hasyx(anonApollo as any, generate);

    await expect(
      anonH.insert({ table: 'groups', object: { title: 'Anon Group' }, returning: ['id'], role: 'anonymous' })
    ).rejects.toThrow();

    const user = await createTestUser();
    const { hasyx: userH } = await adminH._authorize(user.id, { ws: false });

    const gid = uuidv4();
    const created = await new Groups(userH).createGroup({ id: gid, title: 'My Group' }) as any;

    expect(created.id).toBe(gid);
    expect(created.owner_id).toBe(user.id);
    expect(created.created_by_id).toBe(user.id);

    // cleanup
    await adminH.delete({ table: 'groups', pk_columns: { id: gid } });
    await adminH.delete({ table: 'users', pk_columns: { id: user.id } });

    anonH.apolloClient.terminate?.();
    userH.apolloClient.terminate?.();
    adminH.apolloClient.terminate?.();
  }, 30000);

  it('join by_request -> request then approve/deny; open -> approved immediately', async () => {
    const adminH = createAdminHasyx();
    const owner = await createTestUser();
    const joiner = await createTestUser();
    const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
    const { hasyx: joinerH } = await adminH._authorize(joiner.id, { ws: false });

    // by_request
    const g1 = uuidv4();
    await new Groups(ownerH).createGroup({ id: g1, title: 'Req Group', join_policy: 'by_request' });
    const m1 = await new Groups(joinerH).requestMembership(g1, joiner.id) as any;
    expect(m1.status).toBe('request');

    const upd = await ownerH.update({ table: 'memberships', where: { id: { _eq: m1.id } }, _set: { status: 'approved' as unknown as string }, returning: ['status'] });
    expect(upd.returning?.[0]?.status).toBe('approved');

    // open
    const g2 = uuidv4();
    await new Groups(ownerH).createGroup({ id: g2, title: 'Open Group', join_policy: 'open' });
    const m2 = await new Groups(joinerH).requestMembership(g2, joiner.id) as any;
    expect(m2.status).toBe('approved');

    // cleanup
    await adminH.delete({ table: 'groups', pk_columns: { id: g1 } });
    await adminH.delete({ table: 'groups', pk_columns: { id: g2 } });
    await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
    await adminH.delete({ table: 'users', pk_columns: { id: joiner.id } });

    ownerH.apolloClient.terminate?.();
    joinerH.apolloClient.terminate?.();
    adminH.apolloClient.terminate?.();
  }, 30000);

  it('owner can resign; admin can claim ownership if no owner', async () => {
    const adminH = createAdminHasyx();
    const owner = await createTestUser();
    const adminUser = await createTestUser();
    const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
    const { hasyx: adminUH } = await adminH._authorize(adminUser.id, { ws: false });

    const gid = uuidv4();
    await new Groups(ownerH).createGroup({ id: gid, title: 'Resign Group' });

    // make second user admin member
    await new Groups(ownerH).addMember(gid, adminUser.id, 'admin', 'approved');

    // owner resigns
    await new Groups(ownerH).resignOwnership(gid);

    // admin claims ownership
    await new Groups(adminUH).claimOwnership(gid, adminUser.id);

    const g = await adminH.select({ table: 'groups', where: { id: { _eq: gid } }, returning: ['owner_id'] });
    expect(g?.[0]?.owner_id).toBe(adminUser.id);

    // cleanup
    await adminH.delete({ table: 'groups', pk_columns: { id: gid } });
    await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
    await adminH.delete({ table: 'users', pk_columns: { id: adminUser.id } });

    ownerH.apolloClient.terminate?.();
    adminUH.apolloClient.terminate?.();
    adminH.apolloClient.terminate?.();
  }, 30000);

  it('invite_only with invitations: invite -> accept => membership approved', async () => {
    const adminH = createAdminHasyx();
    const inviter = await createTestUser();
    const invitee = await createTestUser();
    const { hasyx: inviterH } = await adminH._authorize(inviter.id, { ws: false });
    const { hasyx: inviteeH } = await adminH._authorize(invitee.id, { ws: false });

    const gid = uuidv4();
    await new Groups(inviterH).createGroup({ id: gid, title: 'Invite Group', join_policy: 'invite_only' });

    const inv = await new Groups(inviterH).inviteUser(gid, invitee.id) as any;
    expect(inv.status).toBe('pending');

    // accept
    await new Groups(inviteeH).acceptInvitation(inv.id);

    const mem = await adminH.select({ table: 'memberships', where: { group_id: { _eq: gid }, user_id: { _eq: invitee.id } }, returning: ['status'] });
    expect(mem?.[0]?.status).toBe('approved');

    // cleanup
    await adminH.delete({ table: 'groups', pk_columns: { id: gid } });
    await adminH.delete({ table: 'users', pk_columns: { id: inviter.id } });
    await adminH.delete({ table: 'users', pk_columns: { id: invitee.id } });

    inviterH.apolloClient.terminate?.();
    inviteeH.apolloClient.terminate?.();
    adminH.apolloClient.terminate?.();
  }, 30000);
  // Additional edge cases
  describe('Groups edge cases', () => {
    it('invite_only rejects direct requests; accepts via invitation', async () => {
      const adminH = createAdminHasyx();
      const owner = await createTestUser();
      const user = await createTestUser();
      const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
      const { hasyx: userH } = await adminH._authorize(user.id, { ws: false });
  
      const gid = uuidv4();
      await new Groups(ownerH).createGroup({ id: gid, title: 'InvOnly', join_policy: 'invite_only' });
  
      await expect(new Groups(userH).requestMembership(gid, user.id)).rejects.toThrow();
  
      const inv = await new Groups(ownerH).inviteUser(gid, user.id) as any;
      await new Groups(userH).acceptInvitation(inv.id);
  
      const mem = await adminH.select({ table: 'memberships', where: { group_id: { _eq: gid }, user_id: { _eq: user.id } }, returning: ['status'] });
      expect(mem?.[0]?.status).toBe('approved');
  
      await adminH.delete({ table: 'groups', pk_columns: { id: gid } });
      await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: user.id } });
  
      ownerH.apolloClient.terminate?.();
      userH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);
  
    it('closed group forbids any requests even from regular users', async () => {
      const adminH = createAdminHasyx();
      const owner = await createTestUser();
      const user = await createTestUser();
      const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
      const { hasyx: userH } = await adminH._authorize(user.id, { ws: false });
  
      const gid = uuidv4();
      await new Groups(ownerH).createGroup({ id: gid, title: 'Closed', join_policy: 'closed' });
  
      await expect(new Groups(userH).requestMembership(gid, user.id)).rejects.toThrow();
  
      await adminH.delete({ table: 'groups', pk_columns: { id: gid } });
      await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: user.id } });
  
      ownerH.apolloClient.terminate?.();
      userH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);
  
    it('owner/admin can change member role; user cannot self-escalate', async () => {
      const adminH = createAdminHasyx();
      const owner = await createTestUser();
      const member = await createTestUser();
      const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
      const { hasyx: memberH } = await adminH._authorize(member.id, { ws: false });
  
      const gid = uuidv4();
      await new Groups(ownerH).createGroup({ id: gid, title: 'Roles' });
      await new Groups(ownerH).addMember(gid, member.id, 'member', 'approved');
  
      // member cannot escalate self to admin (should get 0 affected rows)
      const selfEscalate = await new Groups(memberH).changeMemberRole(gid, member.id, 'admin');
      expect(selfEscalate.affected_rows).toBe(0);
  
      // owner can promote member
      const upd = await new Groups(ownerH).changeMemberRole(gid, member.id, 'admin');
      expect(upd.returning?.[0]?.role).toBe('admin');
  
      await adminH.delete({ table: 'groups', pk_columns: { id: gid } });
      await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: member.id } });
  
      ownerH.apolloClient.terminate?.();
      memberH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);
  
    it('approved member can set status to left', async () => {
      const adminH = createAdminHasyx();
      const owner = await createTestUser();
      const member = await createTestUser();
      const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
      const { hasyx: memberH } = await adminH._authorize(member.id, { ws: false });
  
      const gid = uuidv4();
      await new Groups(ownerH).createGroup({ id: gid, title: 'Leave' });
      const mem = await new Groups(ownerH).addMember(gid, member.id, 'member', 'approved') as any;
  
      const res = await ownerH.update({ table: 'memberships', where: { id: { _eq: mem.id } }, _set: { status: 'left' as unknown as string }, returning: ['status'] });
      expect(res.returning?.[0]?.status).toBe('left');
  
      await adminH.delete({ table: 'groups', pk_columns: { id: gid } });
      await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: member.id } });
  
      ownerH.apolloClient.terminate?.();
      memberH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);
  });
  
  describe('Groups allow_* policies', () => {
    it('allow_view_users grants read access to non-members', async () => {
      const adminH = createAdminHasyx();
      const owner = await createTestUser();
      const outsider = await createTestUser();
      const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
      const { hasyx: outsiderH } = await adminH._authorize(outsider.id, { ws: false });
  
      const gid = uuidv4();
      await ownerH.insert({ table: 'groups', object: { id: gid, title: 'Secret', visibility: 'secret' }, returning: ['id'] });
  
      // outsider cannot see before allow
      const before = await outsiderH.select({ table: 'groups', where: { id: { _eq: gid } }, returning: ['id'] });
      expect(before?.length).toBe(0);
  
      // grant allow_view to all users
      await ownerH.update({ table: 'groups', where: { id: { _eq: gid } }, _set: { allow_view_users: ['user'] as unknown as any } });
      const after = await outsiderH.select({ table: 'groups', where: { id: { _eq: gid } }, returning: ['id'] });
      expect(after?.[0]?.id).toBe(gid);
  
      await adminH.delete({ table: 'groups', pk_columns: { id: gid } });
      await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: outsider.id } });
  
      ownerH.apolloClient.terminate?.();
      outsiderH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);
  
    it('allow_invite_users permits non-admins to create invitations', async () => {
      const adminH = createAdminHasyx();
      const owner = await createTestUser();
      const inviter = await createTestUser();
      const invitee = await createTestUser();
      const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
      const { hasyx: inviterH } = await adminH._authorize(inviter.id, { ws: false });
  
      const gid = uuidv4();
      await ownerH.insert({ table: 'groups', object: { id: gid, title: 'InvAllow' }, returning: ['id'] });
  
      // should fail before allow
      await expect(
        inviterH.insert({ table: 'invitations', object: { group_id: gid, invitee_user_id: invitee.id }, returning: ['id'] })
      ).rejects.toThrow();
  
      // grant allow_invite to all users
      await ownerH.update({ table: 'groups', where: { id: { _eq: gid } }, _set: { allow_invite_users: ['user'] as unknown as any } });
      const inv = await inviterH.insert({ table: 'invitations', object: { group_id: gid, invitee_user_id: invitee.id }, returning: ['id','status'] });
      expect(inv.status).toBe('pending');
  
      await adminH.delete({ table: 'groups', pk_columns: { id: gid } });
      await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: inviter.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: invitee.id } });
  
      ownerH.apolloClient.terminate?.();
      inviterH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);
  
    it('allow_manage_members_users permits non-admins to manage members', async () => {
      const adminH = createAdminHasyx();
      const owner = await createTestUser();
      const manager = await createTestUser();
      const member = await createTestUser();
      const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
      const { hasyx: managerH } = await adminH._authorize(manager.id, { ws: false });
  
      const gid = uuidv4();
      await ownerH.insert({ table: 'groups', object: { id: gid, title: 'ManageAllow' }, returning: ['id'] });
      await ownerH.insert({ table: 'memberships', object: { group_id: gid, user_id: member.id, status: 'approved', role: 'member' }, returning: ['id'] });
  
      // manager can't change role before allow
      await expect(
        managerH.update({ table: 'memberships', where: { group_id: { _eq: gid }, user_id: { _eq: member.id } }, _set: { role: 'admin' } })
      ).resolves.toMatchObject({ affected_rows: 0 });
  
      // enable manage permission to all users
      await ownerH.update({ table: 'groups', where: { id: { _eq: gid } }, _set: { allow_manage_members_users: ['user'] as unknown as any } });
  
      const upd = await managerH.update({ table: 'memberships', where: { group_id: { _eq: gid }, user_id: { _eq: member.id } }, _set: { role: 'admin' }, returning: ['role'] });
      expect(upd.returning?.[0]?.role).toBe('admin');
  
      await adminH.delete({ table: 'groups', pk_columns: { id: gid } });
      await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: manager.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: member.id } });
  
      ownerH.apolloClient.terminate?.();
      managerH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);
  
    it('allow_request_users permits requests despite restrictive visibility', async () => {
      const adminH = createAdminHasyx();
      const owner = await createTestUser();
      const requester = await createTestUser();
      const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
      const { hasyx: requesterH } = await adminH._authorize(requester.id, { ws: false });
  
      const gid = uuidv4();
      await ownerH.insert({ table: 'groups', object: { id: gid, title: 'ReqAllow', visibility: 'secret', join_policy: 'by_request' }, returning: ['id'] });
  
      // requester cannot see the group yet
      const before = await requesterH.select({ table: 'groups', where: { id: { _eq: gid } }, returning: ['id'] });
      expect(before?.length).toBe(0);
  
      // grant explicit request permission to requester
      await ownerH.update({ table: 'groups', where: { id: { _eq: gid } }, _set: { allow_request_users: [requester.id] as unknown as any } });
  
      // can create request membership for this group
      const mem = await requesterH.insert({ table: 'memberships', object: { group_id: gid, user_id: requester.id }, returning: ['status'] });
      expect(mem.status).toBe('request');
  
      await adminH.delete({ table: 'groups', pk_columns: { id: gid } });
      await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: requester.id } });
  
      ownerH.apolloClient.terminate?.();
      requesterH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);
  
    it('allow_join_users permits direct approval in otherwise by_request policy', async () => {
      const adminH = createAdminHasyx();
      const owner = await createTestUser();
      const joiner = await createTestUser();
      const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
      const { hasyx: joinerH } = await adminH._authorize(joiner.id, { ws: false });
  
      const gid = uuidv4();
      await ownerH.insert({ table: 'groups', object: { id: gid, title: 'JoinAllow', join_policy: 'by_request' }, returning: ['id'] });
  
      // without allow_join -> request
      const m1 = await joinerH.insert({ table: 'memberships', object: { group_id: gid, user_id: joiner.id }, returning: ['status'] });
      expect(m1.status).toBe('request');
  
      // grant allow join -> should insert approved immediately
      await ownerH.update({ table: 'groups', where: { id: { _eq: gid } }, _set: { allow_join_users: [joiner.id] as unknown as any } });
      const m2 = await joinerH.insert({ table: 'memberships', object: { group_id: gid, user_id: joiner.id }, returning: ['status'] });
      expect(m2.status).toBe('approved');
  
      await adminH.delete({ table: 'groups', pk_columns: { id: gid } });
      await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: joiner.id } });
  
      ownerH.apolloClient.terminate?.();
      joinerH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);
  });
  
  // Additional allow_* suite for group-level updates and deletes
  describe('Groups allow_* policies (group-level)', () => {
    it('allow_update_group_users permits non-admins to update group', async () => {
      const adminH = createAdminHasyx();
      const owner = await createTestUser();
      const editor = await createTestUser();
      const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
      const { hasyx: editorH } = await adminH._authorize(editor.id, { ws: false });
  
      const gid = uuidv4();
      await new Groups(ownerH).createGroup({ id: gid, title: 'Updatable' });
  
      // before allow → permitted path filtered to zero rows
      const before = await editorH.update({ table: 'groups', where: { id: { _eq: gid } }, _set: { title: 'Nope' }, returning: ['id'] });
      expect(before.affected_rows).toBe(0);
  
      await ownerH.update({ table: 'groups', where: { id: { _eq: gid } }, _set: { allow_update_group_users: [editor.id] as unknown as any } });
      await new Groups(editorH).updateGroup(gid, { title: 'Yep' });
  
      await adminH.delete({ table: 'groups', pk_columns: { id: gid } });
      await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: editor.id } });
  
      ownerH.apolloClient.terminate?.();
      editorH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);
  
    it('allow_delete_group_users permits non-owners to delete group', async () => {
      const adminH = createAdminHasyx();
      const owner = await createTestUser();
      const deleter = await createTestUser();
      const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
      const { hasyx: deleterH } = await adminH._authorize(deleter.id, { ws: false });
  
      const gid = uuidv4();
      await new Groups(ownerH).createGroup({ id: gid, title: 'Deletable' });
  
      // before allow → delete_by_pk returns null (no row permitted)
      const denied = await deleterH.delete({ table: 'groups', pk_columns: { id: gid } });
      expect(denied).toBeNull();
  
      await ownerH.update({ table: 'groups', where: { id: { _eq: gid } }, _set: { allow_delete_group_users: [deleter.id] as unknown as any } });
      await new Groups(deleterH).deleteGroup(gid);
  
      await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: deleter.id } });
  
      ownerH.apolloClient.terminate?.();
      deleterH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);
  });

});


import { Hasyx } from '../hasyx/hasyx';
import { createApolloClient } from '../apollo/apollo';
import { Generator } from '../generator';
import { createTestUser } from '../create-test-user';
import { createInvite, useInvite, listUserInvites, deleteInvite, isUserInvited } from '../invite';
import schema from '../../public/hasura-schema.json';

(!!+(process?.env?.JEST_LOCAL || '') ? describe.skip : describe)('Invite System', () => {
  it('should create an invite for authenticated user', async () => {
    const originalOnlyInvitedUser = process.env.NEXT_PUBLIC_HASYX_ONLY_INVITE_USER;
    process.env.NEXT_PUBLIC_HASYX_ONLY_INVITE_USER = '1';
    const admin = new Hasyx(createApolloClient({}), Generator(schema));
    const adminRoot = new Hasyx(createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }), Generator(schema));
    const user = await createTestUser();
    let createdCode: string | undefined;
    try {
      const { hasyx: userClient } = await admin._authorize(user.id, { schema });
      userClient.user = user;
      const result = await createInvite(userClient);
      createdCode = result.data?.code;
      expect(result.success).toBe(true);
      expect(result.data?.code).toBeDefined();
      expect(result.data?.user_id).toBe(user.id);
    } finally {
      if (createdCode) {
        try { await adminRoot.delete({ table: 'invites', where: { code: { _eq: createdCode } }, returning: ['id'] }); } catch {}
      }
      if (originalOnlyInvitedUser !== undefined) process.env.NEXT_PUBLIC_HASYX_ONLY_INVITE_USER = originalOnlyInvitedUser; else delete process.env.NEXT_PUBLIC_HASYX_ONLY_INVITE_USER;
    }
  });

  it('should not create invite for unauthenticated user', async () => {
    const adminRoot = new Hasyx(createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }), Generator(schema));
    const anonymousClient = new Hasyx(createApolloClient({}), Generator(schema));
    const result = await createInvite(anonymousClient);
    expect(result.success).toBe(false);
    expect(result.message).toContain('not authenticated');
    // No cleanup needed
  });

  it('should use a valid invite code', async () => {
    const originalOnlyInvitedUser = process.env.NEXT_PUBLIC_HASYX_ONLY_INVITE_USER;
    process.env.NEXT_PUBLIC_HASYX_ONLY_INVITE_USER = '1';
    const admin = new Hasyx(createApolloClient({}), Generator(schema));
    const adminRoot = new Hasyx(createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }), Generator(schema));
    const user1 = await createTestUser();
    const user2 = await createTestUser();
    let createdCode: string | undefined;
    let invitedId: string | undefined;
    try {
      const { hasyx: u1 } = await admin._authorize(user1.id, { schema });
      u1.user = user1;
      const invite = await createInvite(u1);
      createdCode = invite.data?.code;

      const { hasyx: u2 } = await admin._authorize(user2.id, { schema });
      u2.user = user2;
      const result = await useInvite(u2, createdCode!);
      invitedId = result.data?.id;

      expect(result.success).toBe(true);
      expect(result.data?.invite_id).toBeDefined();
      expect(result.data?.user_id).toBe(user2.id);
    } finally {
      if (invitedId) { try { await adminRoot.delete({ table: 'invited', where: { id: { _eq: invitedId } }, returning: ['id'] }); } catch {} }
      if (createdCode) { try { await adminRoot.delete({ table: 'invites', where: { code: { _eq: createdCode } }, returning: ['id'] }); } catch {} }
      if (originalOnlyInvitedUser !== undefined) process.env.NEXT_PUBLIC_HASYX_ONLY_INVITE_USER = originalOnlyInvitedUser; else delete process.env.NEXT_PUBLIC_HASYX_ONLY_INVITE_USER;
    }
  });

  it('should not use an invalid invite code', async () => {
    const admin = new Hasyx(createApolloClient({}), Generator(schema));
    const user = await createTestUser();
    const { hasyx: client } = await admin._authorize(user.id, { schema });
    client.user = user;
    const result = await useInvite(client, 'INVALID_CODE');
    expect(result.success).toBe(false);
    expect(result.message).toContain('Invalid or already used');
  });

  it('should not use an already used invite code', async () => {
    const admin = new Hasyx(createApolloClient({}), Generator(schema));
    const adminRoot = new Hasyx(createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }), Generator(schema));
    const user1 = await createTestUser();
    const user2 = await createTestUser();
    let createdCode: string | undefined;
    let invitedId: string | undefined;
    try {
      const { hasyx: u1 } = await admin._authorize(user1.id, { schema });
      u1.user = user1;
      const invite = await createInvite(u1);
      createdCode = invite.data?.code;

      const { hasyx: u2 } = await admin._authorize(user2.id, { schema });
      u2.user = user2;
      const first = await useInvite(u2, createdCode!);
      invitedId = first.data?.id;
      expect(first.success).toBe(true);

      const second = await useInvite(u2, createdCode!);
      expect(second.success).toBe(false);
      expect(second.message).toContain('Invalid or already used');
    } finally {
      if (invitedId) { try { await adminRoot.delete({ table: 'invited', where: { id: { _eq: invitedId } }, returning: ['id'] }); } catch {} }
      if (createdCode) { try { await adminRoot.delete({ table: 'invites', where: { code: { _eq: createdCode } }, returning: ['id'] }); } catch {} }
    }
  });

  it('should not allow user to use multiple invites', async () => {
    const admin = new Hasyx(createApolloClient({}), Generator(schema));
    const adminRoot = new Hasyx(createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }), Generator(schema));
    const user1 = await createTestUser();
    const user2 = await createTestUser();
    let code1: string | undefined;
    let code2: string | undefined;
    let invitedId: string | undefined;
    try {
      const { hasyx: u1 } = await admin._authorize(user1.id, { schema });
      u1.user = user1;
      code1 = (await createInvite(u1)).data?.code;
      code2 = (await createInvite(u1)).data?.code;

      const { hasyx: u2 } = await admin._authorize(user2.id, { schema });
      u2.user = user2;
      const first = await useInvite(u2, code1!);
      invitedId = first.data?.id;
      expect(first.success).toBe(true);

      const second = await useInvite(u2, code2!);
      expect(second.success).toBe(false);
      expect(second.message).toContain('already used an invite');
    } finally {
      if (invitedId) { try { await adminRoot.delete({ table: 'invited', where: { id: { _eq: invitedId } }, returning: ['id'] }); } catch {} }
      if (code1) { try { await adminRoot.delete({ table: 'invites', where: { code: { _eq: code1 } }, returning: ['id'] }); } catch {} }
      if (code2) { try { await adminRoot.delete({ table: 'invites', where: { code: { _eq: code2 } }, returning: ['id'] }); } catch {} }
    }
  });

  it('should list user invites', async () => {
    const admin = new Hasyx(createApolloClient({}), Generator(schema));
    const adminRoot = new Hasyx(createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }), Generator(schema));
    const user = await createTestUser();
    let code1: string | undefined;
    let code2: string | undefined;
    try {
      const { hasyx: u } = await admin._authorize(user.id, { schema });
      u.user = user;
      code1 = (await createInvite(u)).data?.code;
      code2 = (await createInvite(u)).data?.code;
      const result = await listUserInvites(u);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.every((i: any) => i.user_id === user.id)).toBe(true);
    } finally {
      if (code1) { try { await adminRoot.delete({ table: 'invites', where: { code: { _eq: code1 } }, returning: ['id'] }); } catch {} }
      if (code2) { try { await adminRoot.delete({ table: 'invites', where: { code: { _eq: code2 } }, returning: ['id'] }); } catch {} }
    }
  });

  it('should delete unused invite', async () => {
    const admin = new Hasyx(createApolloClient({}), Generator(schema));
    const user = await createTestUser();
    const { hasyx: u } = await admin._authorize(user.id, { schema });
    u.user = user;
    const created = await createInvite(u);
    const inviteId = created.data.id;
    const del = await deleteInvite(u, inviteId);
    expect(del.success).toBe(true);
  });

  it('should not delete used invite', async () => {
    const admin = new Hasyx(createApolloClient({}), Generator(schema));
    const adminRoot = new Hasyx(createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }), Generator(schema));
    const user1 = await createTestUser();
    const user2 = await createTestUser();
    let code: string | undefined;
    let inviteId: string | undefined;
    let invitedId: string | undefined;
    try {
      const { hasyx: u1 } = await admin._authorize(user1.id, { schema });
      u1.user = user1;
      const created = await createInvite(u1);
      code = created.data.code;
      inviteId = created.data.id;

      const { hasyx: u2 } = await admin._authorize(user2.id, { schema });
      u2.user = user2;
      const used = await useInvite(u2, code!);
      invitedId = used.data?.id;

      expect(inviteId).toBeDefined();
      const del = await deleteInvite(u1, inviteId!);
      expect(del.success).toBe(false);
      expect(del.message).toContain('Cannot delete invite that has been used');
    } finally {
      if (invitedId) { try { await adminRoot.delete({ table: 'invited', where: { id: { _eq: invitedId } }, returning: ['id'] }); } catch {} }
      if (inviteId) { try { await adminRoot.delete({ table: 'invites', where: { id: { _eq: inviteId } }, returning: ['id'] }); } catch {} }
    }
  });

  it('should not delete invite that does not belong to user', async () => {
    const admin = new Hasyx(createApolloClient({}), Generator(schema));
    const adminRoot = new Hasyx(createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }), Generator(schema));
    const user1 = await createTestUser();
    const user2 = await createTestUser();
    let inviteId: string | undefined;
    try {
      const { hasyx: u1 } = await admin._authorize(user1.id, { schema });
      u1.user = user1;
      const created = await createInvite(u1);
      inviteId = created.data.id;

      const { hasyx: u2 } = await admin._authorize(user2.id, { schema });
      u2.user = user2;
      expect(inviteId).toBeDefined();
      const del = await deleteInvite(u2, inviteId!);
      expect(del.success).toBe(false);
      expect(del.message).toContain('not found or access denied');
    } finally {
      if (inviteId) { try { await adminRoot.delete({ table: 'invites', where: { id: { _eq: inviteId } }, returning: ['id'] }); } catch {} }
    }
  });

  it('should correctly identify invited users', async () => {
    const admin = new Hasyx(createApolloClient({}), Generator(schema));
    const adminRoot = new Hasyx(createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }), Generator(schema));
    const user1 = await createTestUser();
    const user2 = await createTestUser();
    let code: string | undefined;
    let invitedId: string | undefined;
    try {
      const { hasyx: u1 } = await admin._authorize(user1.id, { schema });
      u1.user = user1;
      code = (await createInvite(u1)).data?.code;

      const { hasyx: u2 } = await admin._authorize(user2.id, { schema });
      u2.user = user2;
      await useInvite(u2, code!);
      const invited = await isUserInvited(u2, user2.id);
      expect(invited).toBe(true);
      const notInvited = await isUserInvited(u2, user1.id);
      expect(notInvited).toBe(false);
    } finally {
      if (invitedId) { try { await adminRoot.delete({ table: 'invited', where: { id: { _eq: invitedId } }, returning: ['id'] }); } catch {} }
      if (code) { try { await adminRoot.delete({ table: 'invites', where: { code: { _eq: code } }, returning: ['id'] }); } catch {} }
    }
  });
});

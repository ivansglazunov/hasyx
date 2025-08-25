import { Hasyx } from '../hasyx/hasyx';

/**
 * High-level facade for Groups domain operations.
 *
 * Encapsulates all mutating operations for groups, memberships, and invitations,
 * so tests and features don't call raw insert/update/delete directly.
 */
export class Groups {
  private hasyx: Hasyx;

  /**
   * Create a new Groups facade bound to a specific Hasyx instance (role/session).
   * @param hasyx Hasyx client bound to a user or admin session
   */
  constructor(hasyx: Hasyx) {
    this.hasyx = hasyx;
  }

  /**
   * Create group.
   * @param input Object with optional id and group fields
   * @returns Created group with id
   */
  async createGroup(input: { id?: string; title: string; visibility?: string; join_policy?: string; slug?: string }): Promise<{ id: string }> {
    const obj: any = { title: input.title };
    if (input.id) obj.id = input.id;
    if (input.visibility) obj.visibility = input.visibility;
    if (input.join_policy) obj.join_policy = input.join_policy;
    if (input.slug) obj.slug = input.slug;
    // return id, owner_id, created_by_id to satisfy tests
    return this.hasyx.insert({ table: 'groups', object: obj, returning: ['id', 'owner_id', 'created_by_id'] }) as any;
  }

  /**
   * Update group fields.
   */
  async updateGroup(groupId: string, set: Record<string, any>): Promise<void> {
    await this.hasyx.update({ table: 'groups', where: { id: { _eq: groupId } }, _set: set });
  }

  /**
   * Delete group by id.
   */
  async deleteGroup(groupId: string): Promise<void> {
    await this.hasyx.delete({ table: 'groups', pk_columns: { id: groupId } });
  }

  /**
   * Owner resigns ownership (sets owner_id to null).
   */
  async resignOwnership(groupId: string): Promise<void> {
    await this.updateGroup(groupId, { owner_id: null });
  }

  /**
   * Claim ownership for the current user (must be admin of ownerless group per trigger/permissions).
   */
  async claimOwnership(groupId: string, newOwnerId: string): Promise<void> {
    await this.updateGroup(groupId, { owner_id: newOwnerId });
  }

  /**
   * Request membership (self or specified user).
   * Triggers enforce join_policy and statuses.
   */
  async requestMembership(groupId: string, userId?: string): Promise<{ id?: string; status: string }> {
    const object: any = { group_id: groupId };
    if (userId) object.user_id = userId;
    return this.hasyx.insert({ table: 'memberships', object, returning: ['id', 'status'] }) as any;
  }

  /** Approve membership request. */
  async approveMembership(membershipId: string): Promise<void> {
    await this.hasyx.update({ table: 'memberships', where: { id: { _eq: membershipId } }, _set: { status: 'approved' as any } });
  }

  /** Deny membership request. */
  async denyMembership(membershipId: string): Promise<void> {
    await this.hasyx.update({ table: 'memberships', where: { id: { _eq: membershipId } }, _set: { status: 'denied' as any } });
  }

  /**
   * Leave group (by membership id).
   */
  async leaveMembership(membershipId: string): Promise<void> {
    await this.hasyx.update({ table: 'memberships', where: { id: { _eq: membershipId } }, _set: { status: 'left' as any } });
  }

  /**
   * Add member with a predefined role/status (for owner/admin management flows).
   */
  async addMember(groupId: string, userId: string, role: 'owner' | 'admin' | 'member' = 'member', status: 'approved' | 'request' = 'approved'): Promise<{ id: string }> {
    return this.hasyx.insert({ table: 'memberships', object: { group_id: groupId, user_id: userId, role, status }, returning: ['id'] }) as any;
  }

  /**
   * Change a member role (owner/admin permitted; triggers may cancel unauthorized changes).
   */
  async changeMemberRole(groupId: string, userId: string, role: 'owner' | 'admin' | 'member'): Promise<{ affected_rows: number; returning?: Array<{ role: string }> }> {
    return this.hasyx.update({ table: 'memberships', where: { group_id: { _eq: groupId }, user_id: { _eq: userId } }, _set: { role }, returning: ['role'] }) as any;
  }

  /**
   * Create an invitation for a user.
   */
  async inviteUser(groupId: string, inviteeUserId: string): Promise<{ id: string; status: string }> {
    return this.hasyx.insert({ table: 'invitations', object: { group_id: groupId, invitee_user_id: inviteeUserId }, returning: ['id', 'status'] }) as any;
  }

  /**
   * Accept an invitation (by id). Triggers create/approve membership.
   */
  async acceptInvitation(invitationId: string): Promise<void> {
    await this.hasyx.update({ table: 'invitations', where: { id: { _eq: invitationId } }, _set: { status: 'accepted' } });
  }
}



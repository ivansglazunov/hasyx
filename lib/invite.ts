import { v4 as uuidv4 } from 'uuid';
import { Hasyx } from './hasyx/hasyx';
import { createApolloClient } from './apollo/apollo';
import { Generator } from './generator';
import schema from '../public/hasura-schema.json';
import Debug from './debug';

const debug = Debug('invite');

export interface InviteResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Creates a new invite for the authenticated user
 * @param hasyx - Hasyx client instance
 * @param code - Optional custom invite code, will be generated if not provided
 * @returns Promise resolving with invite creation result
 */
export async function createInvite(hasyx: Hasyx, code?: string): Promise<InviteResult> {
  try {
    console.log('[invite:createInvite] userId=', hasyx.userId, 'codeArg=', code);
    if (!hasyx.userId) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    const inviteCode = code || generateInviteCode();
    console.log('[invite:createInvite] attempt insert invite with code=', inviteCode);
    
    const result = await hasyx.insert({
      table: 'invites',
      object: {
        user_id: hasyx.userId,
        code: inviteCode
      },
      returning: ['id', 'code', 'created_at', 'user_id'],
      role: 'me'
    });

    console.log('[invite:createInvite] insert result=', result);
    debug('Invite created successfully:', result);
    
    return {
      success: true,
      message: 'Invite created successfully',
      data: result
    };
  } catch (error: any) {
    console.log('[invite:createInvite] error=', error?.message || error);
    debug('Error creating invite:', error);
    return {
      success: false,
      message: `Failed to create invite: ${error.message}`
    };
  }
}

/**
 * Uses an invite code to register the current user as invited
 * @param hasyx - Hasyx client instance
 * @param code - The invite code to use
 * @returns Promise resolving with invite usage result
 */
export async function useInvite(hasyx: Hasyx, code: string): Promise<InviteResult> {
  try {
    console.log('[invite:useInvite] userId=', hasyx.userId, 'code=', code);
    if (!hasyx.userId) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    // Use admin to check invite existence by code (regular users cannot see others' invites)
    const adminClient = new Hasyx(
      createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }),
      Generator(schema as any)
    );

    console.log('[invite:useInvite] admin url=', (adminClient.apolloClient as any)?._options?.url, 'user url=', (hasyx.apolloClient as any)?._options?.url);

    const invite = await adminClient.select({
      table: 'invites',
      where: { code: { _eq: code } },
      returning: ['id', 'user_id', 'code'],
    });
    console.log('[invite:useInvite] fetched invite by code=', invite);

    if (!invite || (Array.isArray(invite) && invite.length === 0)) {
      return {
        success: false,
        message: 'Invalid or already used invite code'
      };
    }

    const inviteId = Array.isArray(invite) ? invite[0].id : (invite as any).id;
    console.log('[invite:useInvite] inviteId=', inviteId);

    // Check if invite already used (any invited with this invite_id) using admin
    const existingForInvite = await adminClient.select({
      table: 'invited',
      where: { invite_id: { _eq: inviteId } },
      returning: ['id'],
      limit: 1
    });
    console.log('[invite:useInvite] existingForInvite=', existingForInvite);
    if (existingForInvite && (Array.isArray(existingForInvite) ? existingForInvite.length > 0 : (existingForInvite as any).id)) {
      return { success: false, message: 'Invalid or already used invite code' };
    }

    // Check if user already used an invite (use admin to avoid role/allowlist issues)
    const existingInvited = await adminClient.select({
      table: 'invited',
      where: { user_id: { _eq: hasyx.userId } },
      returning: ['id'],
      limit: 1
    });
    console.log('[invite:useInvite] existingInvitedByUser=', existingInvited);

    if (existingInvited && (Array.isArray(existingInvited) ? existingInvited.length > 0 : existingInvited.id)) {
      return {
        success: false,
        message: 'User has already used an invite'
      };
    }

    // Create invited record using admin client (no public insert permissions)
    const result = await adminClient.insert({
      table: 'invited',
      object: {
        invite_id: inviteId,
        user_id: hasyx.userId,
        created_at: Math.floor(Date.now() / 1000)
      },
      returning: ['id', 'invite_id', 'user_id', 'created_at']
    });
    console.log('[invite:useInvite] insert invited result=', result);

    debug('Invite used successfully:', result);
    
    return {
      success: true,
      message: 'Invite used successfully',
      data: result
    };
  } catch (error: any) {
    console.log('[invite:useInvite] error=', error?.message || error);
    debug('Error using invite:', error);
    return {
      success: false,
      message: `Failed to use invite: ${error.message}`
    };
  }
}

/**
 * Lists all invites for the authenticated user
 * @param hasyx - Hasyx client instance
 * @returns Promise resolving with user's invites
 */
export async function listUserInvites(hasyx: Hasyx): Promise<InviteResult> {
  try {
    console.log('[invite:listUserInvites] userId=', hasyx.userId);
    if (!hasyx.userId) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    const invites = await hasyx.select({
      table: 'invites',
      where: { user_id: { _eq: hasyx.userId } },
      returning: ['id', 'user_id', 'code', 'created_at', 'updated_at']
    });
    console.log('[invite:listUserInvites] invites=', invites);

    debug('User invites retrieved:', invites);
    
    return {
      success: true,
      message: 'Invites retrieved successfully',
      data: invites
    };
  } catch (error: any) {
    console.log('[invite:listUserInvites] error=', error?.message || error);
    debug('Error listing user invites:', error);
    return {
      success: false,
      message: `Failed to list invites: ${error.message}`
    };
  }
}

/**
 * Deletes an invite if it belongs to the user and has no invited records
 * @param hasyx - Hasyx client instance
 * @param inviteId - ID of the invite to delete
 * @returns Promise resolving with deletion result
 */
export async function deleteInvite(hasyx: Hasyx, inviteId: string): Promise<InviteResult> {
  try {
    console.log('[invite:deleteInvite] userId=', hasyx.userId, 'inviteId=', inviteId);
    if (!hasyx.userId) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    // Check if invite exists and belongs to user
    const invite = await hasyx.select({
      table: 'invites',
      where: { 
        id: { _eq: inviteId },
        user_id: { _eq: hasyx.userId }
      },
      returning: ['id', 'user_id']
    });
    console.log('[invite:deleteInvite] fetched invite=', invite);

    if (!invite || (Array.isArray(invite) && invite.length === 0)) {
      return {
        success: false,
        message: 'Invite not found or access denied'
      };
    }

    // Admin client (for checking usage and deletion)
    const adminClient = new Hasyx(
      createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }),
      Generator(schema as any)
    );
    console.log('[invite:deleteInvite] admin url=', (adminClient.apolloClient as any)?._options?.url);

    // Check if invite has been used (via admin to avoid role/allowlist issues)
    const invitedCount = await adminClient.select({
      table: 'invited',
      where: { invite_id: { _eq: inviteId } },
      aggregate: { count: true }
    });
    console.log('[invite:deleteInvite] invitedCount=', invitedCount);

    const count = (invitedCount as any)?.invited_aggregate?.aggregate?.count ?? (invitedCount as any)?.aggregate?.count ?? 0;
    if (count > 0) {
      return {
        success: false,
        message: 'Cannot delete invite that has been used'
      };
    }

    // Delete the invite by primary key using admin context
    const delResult = await adminClient.delete({
      table: 'invites',
      pk_columns: { id: inviteId },
      returning: ['id']
    });
    console.log('[invite:deleteInvite] delete result=', delResult);
    console.log('[invite:deleteInvite] deleted invite id=', inviteId);

    debug('Invite deleted successfully:', inviteId);
    
    return {
      success: true,
      message: 'Invite deleted successfully'
    };
  } catch (error: any) {
    console.log('[invite:deleteInvite] error=', error?.message || error);
    debug('Error deleting invite:', error);
    return {
      success: false,
      message: `Failed to delete invite: ${error.message}`
    };
  }
}

/**
 * Checks if a user has been invited (has an invited record)
 * @param hasyx - Hasyx client instance
 * @param userId - User ID to check (defaults to current user)
 * @returns Promise resolving with boolean indicating if user is invited
 */
export async function isUserInvited(hasyx: Hasyx, userId?: string): Promise<boolean> {
  try {
    console.log('[invite:isUserInvited] check userId=', userId || hasyx.userId);
    const targetUserId = userId || hasyx.userId;
    if (!targetUserId) {
      console.log('[invite:isUserInvited] no userId, return false');
      return false;
    }

    // Use admin client to avoid role/allowlist issues for invited visibility
    const adminClient = new Hasyx(
      createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }),
      Generator(schema as any)
    );
    console.log('[invite:isUserInvited] admin url=', (adminClient.apolloClient as any)?._options?.url);
    const invited = await adminClient.select({
      table: 'invited',
      where: { user_id: { _eq: targetUserId } },
      returning: ['id'],
      limit: 1
    });
    console.log('[invite:isUserInvited] invited select result=', invited);

    return !!(invited && (Array.isArray(invited) ? invited.length > 0 : invited.id));
  } catch (error: any) {
    console.log('[invite:isUserInvited] error=', error?.message || error);
    debug('Error checking if user is invited:', error);
    return false;
  }
}

/**
 * Generates a random invite code
 * @returns Random 8-character alphanumeric code
 */
function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

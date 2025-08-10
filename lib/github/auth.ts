import { debug } from '../users/auth-server';
import { Hasyx } from '../server';


/**
 * Gets GitHub access token for a user from the database
 * @param hasyx - Hasyx client instance
 * @param userId - User ID
 * @returns GitHub access token or null if not found/expired
 */

export async function getGitHubAccessToken(
  hasyx: Hasyx,
  userId: string
): Promise<string | null> {
  debug(`🔍 Getting GitHub access token for user ${userId}`);

  try {
    const accountResult = await hasyx.select({
      table: 'accounts',
      where: {
        user_id: { _eq: userId },
        provider: { _eq: 'github' }
      },
      returning: ['access_token', 'expires_at', 'scope'],
      limit: 1
    });

    if (!accountResult?.length || !accountResult[0]?.access_token) {
      debug(`❌ No GitHub access token found for user ${userId}`);
      return null;
    }

    const account = accountResult[0];

    // Check if token is expired
    if (account.expires_at) {
      const now = Math.floor(Date.now() / 1000);
      if (account.expires_at < now) {
        debug(`❌ GitHub access token expired for user ${userId}`);
        return null;
      }
    }

    debug(`✅ Found valid GitHub access token for user ${userId}`);
    return account.access_token;
  } catch (error) {
    debug(`⚠️ Error getting GitHub access token for user ${userId}:`, error);
    return null;
  }
}
/**
 * Checks if user has GitHub access token with required scope
 * @param hasyx - Hasyx client instance
 * @param userId - User ID
 * @param requiredScope - Required scope (e.g., 'repo', 'public_repo')
 * @returns true if user has valid token with required scope
 */

export async function hasGitHubScope(
  hasyx: Hasyx,
  userId: string,
  requiredScope: string
): Promise<boolean> {
  debug(`🔍 Checking GitHub scope ${requiredScope} for user ${userId}`);

  try {
    const accountResult = await hasyx.select({
      table: 'accounts',
      where: {
        user_id: { _eq: userId },
        provider: { _eq: 'github' }
      },
      returning: ['scope', 'expires_at'],
      limit: 1
    });

    if (!accountResult?.length || !accountResult[0]?.scope) {
      debug(`❌ No GitHub account found for user ${userId}`);
      return false;
    }

    const account = accountResult[0];

    // Check if token is expired
    if (account.expires_at) {
      const now = Math.floor(Date.now() / 1000);
      if (account.expires_at < now) {
        debug(`❌ GitHub access token expired for user ${userId}`);
        return false;
      }
    }

    // Check if scope includes required scope
    const scopes = account.scope.split(/[,\s]+/); // Split by comma or whitespace
    const hasScope = scopes.includes(requiredScope);

    debug(`✅ GitHub scope check for user ${userId}: ${hasScope ? 'HAS' : 'MISSING'} ${requiredScope}`);
    return hasScope;
  } catch (error) {
    debug(`⚠️ Error checking GitHub scope for user ${userId}:`, error);
    return false;
  }
}

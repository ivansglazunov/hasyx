"use server";

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ApolloError } from '@apollo/client/core'; // Import ApolloError
import { Hasyx } from './hasyx'; // Use the path alias
import Debug from './debug';
import { User as NextAuthUser } from 'next-auth'; // For typing
import { Account as NextAuthAccount } from 'next-auth'; // For typing

const debug = Debug('auth:db-utils');

const SALT_ROUNDS = 10;

/**
 * Hashes a password using bcrypt.
 * @param password The plain text password.
 * @returns The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  debug('Password hashed successfully.');
  return hashedPassword;
}

/**
 * Compares a plain text password with a hash.
 * @param password The plain text password.
 * @param hash The hash to compare against.
 * @returns True if the password matches the hash, false otherwise.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hash);
  debug(`Password comparison result: ${isMatch}`);
  return isMatch;
}

interface UserProfileFromProvider {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  // Add other relevant fields from OAuth profiles if needed
}

export interface HasuraUser { // Export interface for use in options.ts
  id: string;
  name?: string | null;
  email?: string | null;
  email_verified?: number | null; // unix timestamp in milliseconds
  image?: string | null;
  password?: string | null;
  created_at: string;
  updated_at: string;
  is_admin?: boolean | null;
  hasura_role?: string | null;
  // Include accounts if needed, depends on returning fields
  accounts?: { provider: string; provider_account_id: string }[];
}

/**
 * Finds or creates a user and their associated account based on provider information.
 * This function handles the core logic of linking OAuth/Credentials logins to Hasura users.
 *
 * @param hasyx The initialized NHA Client instance.
 * @param provider The OAuth provider name (e.g., 'google', 'credentials').
 * @param providerAccountId The user's unique ID from the provider.
 * @param profile Optional profile information from the provider (name, email, image).
 * @param image Optional image URL from the provider.
 * @param linkToUserId Optional user ID to link this account to (for account linking mode).
 * @returns The Hasura user object associated with the account.
 * @throws Error if user/account processing fails.
 */
export async function getOrCreateUserAndAccount(
  hasyx: Hasyx,
  provider: string,
  providerAccountId: string,
  profile?: UserProfileFromProvider | null,
  image?: string | null,
  linkToUserId?: string
): Promise<HasuraUser> {
  debug(`🔍 getOrCreateUserAndAccount called for provider: ${provider}, providerAccountId: ${providerAccountId}${linkToUserId ? ', linkToUserId: ' + linkToUserId : ''}`);

  // --- 1. Try to find the account --- 
  let existingUser: HasuraUser | null = null;
  
  // Check if we're in account linking mode with a specific user ID
  if (linkToUserId) {
    debug(`🔗 Account linking mode detected with linkToUserId: ${linkToUserId}`);
  }
  try {
    debug(`🔍 Step 1: Searching for existing account with provider: ${provider}, providerAccountId: ${providerAccountId}`);
    
    // 🛠️ Fix: For telegram providers, we search in both variants
    let whereCondition;
    if (provider === 'telegram' || provider === 'telegram-miniapp') {
      whereCondition = {
        provider: { _in: ['telegram', 'telegram-miniapp'] },
        provider_account_id: { _eq: providerAccountId },
      };
      debug(`🔍 Using telegram multi-provider search for providerAccountId: ${providerAccountId}`);
    } else {
      whereCondition = {
        provider: { _eq: provider },
        provider_account_id: { _eq: providerAccountId },
      };
    }
    
    const accountResult = await hasyx.select({
      table: 'accounts',
      where: whereCondition,
      returning: [
        { user: ['id', 'name', 'email', 'email_verified', 'image', 'password', 'created_at', 'updated_at', 'is_admin', 'hasura_role'] } 
      ],
      limit: 1, 
    });

    if (accountResult?.length > 0 && accountResult?.[0]?.user) {
      existingUser = accountResult?.[0]?.user;
      debug(`✅ Found existing account for ${provider}:${providerAccountId}. User ID: ${existingUser?.id}`);
      
      // If user exists and image is provided, update it
      if (existingUser && image && existingUser.image !== image) {
        debug(`Updating image for existing user ${existingUser.id}`);
        await hasyx.update({
          table: 'users',
          pk_columns: { id: existingUser.id },
          _set: { image: image, name: profile?.name ?? existingUser.name } // Also update name if provider has a newer one
        });
        // 🛠️ Fix: Create a new object instead of modifying readonly properties
        existingUser = {
          ...existingUser,
          image: image,
          name: profile?.name ?? existingUser.name
        };
      }
      
      // Create Telegram notification permission if this is a Telegram provider
      if ((provider === 'telegram' || provider === 'telegram-miniapp') && existingUser) {
        await ensureTelegramNotificationPermission(
          hasyx, 
          existingUser.id, 
          providerAccountId,
          {
            provider: provider,
            username: profile?.name,
            image: existingUser.image
          }
        );
      }
      
      return existingUser as HasuraUser;
    }
  } catch (error) {
    debug(`Error searching for account ${provider}:${providerAccountId}:`, error);
    throw new Error(`Failed to search for existing account: ${(error as Error).message}`);
  }

  debug(`🔍 Step 2: No existing account found for ${provider}:${providerAccountId}. Proceeding to find/create user.`);
  
  // --- 2a. If in linking mode, find the user by ID ---
  if (linkToUserId) {
    try {
      debug(`🔗 Step 2a: In linking mode - fetching user by ID: ${linkToUserId}`);
      
      const userByIdResult = await hasyx.select({
        table: 'users',
        pk_columns: { id: linkToUserId },
        returning: ['id', 'name', 'email', 'email_verified', 'image', 'password', 'created_at', 'updated_at', 'is_admin', 'hasura_role'],
      });

      if (userByIdResult) {
        existingUser = userByIdResult;
        debug(`✅ Found existing user by ID ${linkToUserId}. Linking account.`);
        
        // If user exists and image is provided, update it
        if (existingUser && image && existingUser.image !== image) {
          debug(`Updating image for existing user ${existingUser.id} in linking mode.`);
          await hasyx.update({
            table: 'users',
            pk_columns: { id: existingUser.id },
            _set: { image: image, name: profile?.name ?? existingUser.name } // Also update name
          });
          // Create a new object instead of modifying readonly properties
          existingUser = {
            ...existingUser,
            image: image,
            name: profile?.name ?? existingUser.name
          };
        }
        
        // Link account to this existing user
        // NORMALIZATION: Both telegram and telegram-miniapp are saved in DB as 'telegram'
        const normalizedProviderForExisting = (provider === 'telegram-miniapp') ? 'telegram' : provider;
        debug(`🔄 CREATING ACCOUNT RECORD (LINK MODE): original_provider=${provider}, normalized_provider=${normalizedProviderForExisting}, provider_account_id=${providerAccountId}, user_id=${existingUser?.id}`);
        await hasyx.insert({
          table: 'accounts',
          object: {
            user_id: existingUser?.id,
            provider: normalizedProviderForExisting,
            provider_account_id: providerAccountId,
            type: provider === 'credentials' ? 'credentials' : 'oauth',
          },
          returning: ['id'],
        });
        
        debug(`✅ Account ${provider}:${providerAccountId} linked to user ${existingUser?.id} in linking mode.`);
        
        // Create Telegram notification permission if this is a Telegram provider
        if ((provider === 'telegram' || provider === 'telegram-miniapp') && existingUser) {
          await ensureTelegramNotificationPermission(
            hasyx, 
            existingUser.id, 
            providerAccountId,
            {
              provider: provider,
              username: profile?.name,
              image: existingUser.image
            }
          );
        }
        
        return existingUser as HasuraUser;
      } else {
        debug(`⚠️ Linking mode enabled but user with ID ${linkToUserId} not found. Falling back to email search or new user creation.`);
      }
    } catch (error) {
      debug(`⚠️ Error in linking mode when fetching user by ID ${linkToUserId}:`, error);
      // Continue with normal flow if linking by ID fails
    }
  }

  // --- 2b. Try to find the user by email (if provided) ---
  // Important: Only link if email is provided and preferably verified by the OAuth provider.
  // For credentials, we find the user first in the `authorize` function.
  if (profile?.email && provider !== 'credentials') { // Avoid linking for credentials here
    try {
      debug(`🔍 Step 2a: Searching for user by email: ${profile.email}`);
      
      const userByEmailResult = await hasyx.select({
        table: 'users',
        where: { email: { _eq: profile.email } },
        returning: ['id', 'name', 'email', 'email_verified', 'image', 'password', 'created_at', 'updated_at', 'is_admin', 'hasura_role'], // Removed extra backslashes
        limit: 1,
      });


      if (userByEmailResult?.length > 0) {
        existingUser = userByEmailResult?.[0];
        debug(`✅ Found existing user by email ${profile.email}. User ID: ${existingUser?.id}. Linking account.`);
        
        // If user exists and image is provided, update it
        if (existingUser && image && existingUser.image !== image) {
          debug(`Updating image for existing user ${existingUser.id} found by email.`);
          await hasyx.update({
            table: 'users',
            pk_columns: { id: existingUser.id },
            _set: { image: image, name: profile?.name ?? existingUser.name } // Also update name
          });
          // 🛠️ Fix: Create a new object instead of modifying readonly properties
          existingUser = {
            ...existingUser,
            image: image,
            name: profile?.name ?? existingUser.name
          };
        }
        
        // Link account to this existing user
        // 🛠️ NORMALIZATION: Both telegram and telegram-miniapp are saved in DB as 'telegram'
        const normalizedProviderForExisting = (provider === 'telegram-miniapp') ? 'telegram' : provider;
        debug(`🔄 CREATING ACCOUNT RECORD: original_provider=${provider}, normalized_provider=${normalizedProviderForExisting}, provider_account_id=${providerAccountId}, user_id=${existingUser?.id}`);
        await hasyx.insert({
          table: 'accounts',
          object: {
            user_id: existingUser?.id,
            provider: normalizedProviderForExisting,
            provider_account_id: providerAccountId,
            type: provider === 'credentials' ? 'credentials' : 'oauth', // Set type based on provider
          },
          returning: ['id'], // Removed extra backslashes
        });
        
        debug(`✅ Account ${provider}:${providerAccountId} linked to user ${existingUser?.id}.`);
        return existingUser as HasuraUser;
      }
    } catch (error) {
      // Handle potential duplicate account insertion error gracefully if needed
      if (error instanceof ApolloError && error.message.includes('Uniqueness violation')) {
        debug(`Account ${provider}:${providerAccountId} likely already linked during concurrent request. Attempting to refetch.`);
        // Retry finding the account, as it might have been created concurrently
         return getOrCreateUserAndAccount(hasyx, provider, providerAccountId, profile, image);
      } else {
         debug(`Error searching for user by email ${profile.email} or linking account:`, error);
         throw new Error(`Failed to process user by email or link account: ${(error as Error).message}`);
      }
    }
  }

  // --- 3. Create new user and account --- 
  debug(`🔍 Step 3: No existing user found by email or account link. Creating new user and account for ${provider}:${providerAccountId}.`);
  
  try {
    // We need to insert the user first, then the account linking to it.
    // Hasura doesn't directly support nested inserts with linking back in the same mutation easily via the generator.

    const newUserInput: Partial<HasuraUser> = {
      name: profile?.name,
      email: profile?.email, 
      image: image ?? profile?.image, // Use passed image first, then profile.image
      hasura_role: 'user', 
      // email_verified: profile?.email_verified ? new Date().toISOString() : null, // Need verification logic for OAuth
    };

    // For credentials, the user is created *after* email verification, but we handle it here for OAuth
    const newUserResult = await hasyx.insert({
      table: 'users',
      object: newUserInput,
      // Return all fields needed for the session/JWT
      returning: ['id', 'name', 'email', 'email_verified', 'image', 'password', 'created_at', 'updated_at', 'is_admin', 'hasura_role'], // Removed extra backslashes
    });

    if (!newUserResult?.id) {
      throw new Error('Failed to create new user or retrieve its ID.');
    }
    const newUser = newUserResult;
    debug(`✅ New user created with ID: ${newUser.id}`);

    // Now create the account linked to the new user
    // 🛠️ NORMALIZATION: Both telegram and telegram-miniapp are saved in DB as 'telegram'
    const normalizedProvider = (provider === 'telegram-miniapp') ? 'telegram' : provider;
    debug(`🔄 CREATING ACCOUNT RECORD: original_provider=${provider}, normalized_provider=${normalizedProvider}, provider_account_id=${providerAccountId}, user_id=${newUser.id}`);
    await hasyx.insert({
      table: 'accounts',
      object: {
        user_id: newUser.id,
        provider: normalizedProvider,
        provider_account_id: providerAccountId,
        type: provider === 'credentials' ? 'credentials' : 'oauth', // Set type based on provider
      },
      returning: ['id'], // Removed extra backslashes
    });
    
    debug(`✅ Account ${provider}:${providerAccountId} created and linked to new user ${newUser.id}.`);
    
    // Create Telegram notification permission if this is a Telegram provider
    if (provider === 'telegram' || provider === 'telegram-miniapp') {
      await ensureTelegramNotificationPermission(
        hasyx, 
        newUser.id, 
        providerAccountId,
        {
          provider: provider,
          username: profile?.name,
          image: newUser.image
        }
      );
    }

    return newUser;

  } catch (error) {
    debug('Error creating new user or account:', error);
    // Handle potential duplicate user email error more gracefully if necessary
    if (error instanceof ApolloError && error.message.includes('Uniqueness violation') && error.message.includes('users_email_key')) {
        debug(`User with email ${profile?.email} likely already exists. Attempting to find and link.`);
        // If user creation failed due to duplicate email, retry finding by email and linking account
        if (profile?.email && provider !== 'credentials') {
            return getOrCreateUserAndAccount(hasyx, provider, providerAccountId, profile, image);
        }
    }
    throw new Error(`Failed to create new user/account: ${(error as Error).message}`);
  }
}

/**
 * Creates a Telegram notification permission for a user if they don't already have one
 * @param hasyx - Hasyx client instance
 * @param userId - User ID
 * @param telegramUserId - Telegram user ID to use as device_token
 * @param deviceInfo - Additional device information
 */
export async function ensureTelegramNotificationPermission(
  hasyx: Hasyx,
  userId: string,
  telegramUserId: string,
  deviceInfo: Record<string, any> = {}
): Promise<void> {
  debug(`🔔 Ensuring Telegram notification permission for user ${userId}, telegramUserId: ${telegramUserId}`);
  
  try {
    // Check if notification permission already exists
    const existingPermission = await hasyx.select({
      table: 'notify',
      where: {
        user_id: { _eq: userId },
        device_token: { _eq: telegramUserId.toString() }
      },
      returning: ['id'],
      limit: 1
    });
    
    if (existingPermission?.length > 0) {
      debug(`✅ Telegram notification permission already exists for user ${userId}`);
      return;
    }
    
    // Create new notification permission
    await hasyx.insert({
      table: 'notify',
      object: {
        user_id: userId,
        device_token: telegramUserId.toString(),
        device_type: 'telegram',
        device_info: deviceInfo,
        is_active: true
      },
      returning: ['id']
    });
    
    debug(`✅ Created Telegram notification permission for user ${userId}`);
  } catch (error) {
    debug(`⚠️ Error ensuring Telegram notification permission for user ${userId}:`, error);
    // Don't throw error to avoid breaking auth flow
  }
}

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
    const scopes = account.scope.split(' ');
    const hasScope = scopes.includes(requiredScope);
    
    debug(`✅ GitHub scope check for user ${userId}: ${hasScope ? 'HAS' : 'MISSING'} ${requiredScope}`);
    return hasScope;
  } catch (error) {
    debug(`⚠️ Error checking GitHub scope for user ${userId}:`, error);
    return false;
  }
}
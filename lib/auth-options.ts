import { getOrCreateUserAndAccount, HasuraUser } from 'hasyx/lib/authDbUtils';
import Debug from 'hasyx/lib/debug';
import { Session as DefaultSession, NextAuthOptions, User as NextAuthUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import YandexProvider from 'next-auth/providers/yandex';
import GitHubProvider from 'next-auth/providers/github';
import FacebookProvider from 'next-auth/providers/facebook';
import VkProvider from 'next-auth/providers/vk';
import { createApolloClient } from './apollo'; // Import from generated package
import { Hasyx } from './hasyx'; // Import from generated package
import { SignJWT } from 'jose';
import { TelegramProvider } from './telegram-credentials'; // Import TelegramProvider

// Ensure type augmentation is applied globally (can be in a separate .d.ts file or here)
import 'next-auth';
import 'next-auth/jwt';

const debug = Debug('auth:options-base');

// Variable for temporary storage of token between jwt and redirect
// Declare OUTSIDE createAuthOptions function to keep it in closure
let tempTokenForRedirect: string | null = null; 

// Type Augmentation - Extend default types carefully
declare module 'next-auth' {
  interface Session {
    provider?: string;
    error?: string;
    hasuraClaims?: Record<string, any>;
    accessToken?: string | null;
    // @ts-ignore
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    provider?: string;
    emailVerified?: string | null; // Store as string or null
    error?: string;
    "https://hasura.io/jwt/claims"?: Record<string, any>;
    // Keep other custom fields needed by session callback if any
  }
}

// Define base OAuth providers here
export const baseProviders = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  YandexProvider({
    clientId: process.env.YANDEX_CLIENT_ID!,
    clientSecret: process.env.YANDEX_CLIENT_SECRET!,
  }),
  GitHubProvider({
    clientId: process.env.GITHUB_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
    authorization: {
      params: {
        scope: 'read:user user:email repo public_repo'
      }
    }
  }),
  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
  }),
  VkProvider({
    clientId: process.env.VK_CLIENT_ID!,
    clientSecret: process.env.VK_CLIENT_SECRET!,
  }),
  // Add other base OAuth providers here if needed
];

// Function to create the main AuthOptions object
// Takes an array of additional providers to merge
export function createAuthOptions(additionalProviders: any[] = [], client: Hasyx): NextAuthOptions {
  debug('Creating AuthOptions...');

  // Define the Test Token Provider configuration conditionally
  const testTokenProvider = 
    process.env.NODE_ENV !== 'production' && process.env.TEST_TOKEN 
    ? CredentialsProvider({
        id: 'test-token', 
        name: 'Test Token Auth', 
        credentials: {
          userId: { label: "User ID", type: "text", placeholder: "user-uuid-to-impersonate" },
          token: { label: "Test Token", type: "password" }
        },
        async authorize(credentials, req): Promise<NextAuthUser | null> {
          const debugTest = Debug('auth:test-token'); // Specific debug instance
          debugTest('Test Token authorize attempt for userId:', credentials?.userId);

          const testTokenFromEnv = process.env.TEST_TOKEN;

          if (!testTokenFromEnv) {
            debugTest('TEST_TOKEN environment variable is not set. Denying.');
            throw new Error('Test token configuration is missing.');
          }
          if (!credentials?.userId || !credentials?.token) {
            debugTest('Missing userId or token in credentials.');
            return null; 
          }
          if (credentials.token !== testTokenFromEnv) {
            debugTest('Provided token does not match TEST_TOKEN.');
            return null; 
          }

          const userId = credentials.userId;
          debugTest(`Test token matched. Attempting to authenticate user: ${userId}`);

          try {
            const userResult = await client.select<any>({
              table: 'users',
              pk_columns: { id: userId },
              returning: ['id', 'name', 'email', 'image'] // Fetch fields for NextAuthUser
            });

            if (!userResult || !userResult.id) {
              debugTest(`User not found in database with ID: ${userId}`);
              return null;
            }

            debugTest(`Successfully authenticated user ${userId} via test token.`);
            // Return object matching NextAuthUser (id, name, email, image)
            return {
              id: userResult.id,
              name: userResult.name,
              email: userResult.email,
              image: userResult.image,
            };
          } catch (error: any) {
            debugTest(`Error fetching user ${userId} during test token auth:`, error);
            return null;
          }
        }
      })
    : null; // Set to null if not in dev/test or TEST_TOKEN is missing

  const allProviders = [
      ...baseProviders,
      ...additionalProviders,
      ...(testTokenProvider ? [testTokenProvider] : []), // Add test provider only if defined
      TelegramProvider({ hasyx: client }), // Add TelegramProvider
    ].filter(provider => provider !== null); // Filter out null providers

  debug('Final list of auth providers:', allProviders.map(p => p.id));

  return {
    providers: allProviders,
    session: {
      strategy: 'jwt',
    },
    callbacks: {
      // Handle automatic account linking via signIn callback
      async signIn({ user, account, profile, email, credentials }) {
        
        // Check if there's an existing user session for account linking
        if (account?.provider !== 'credentials') {
          try {
            // Try to get existing session from cookies
            // This is a server-side context, so we need to access cookies differently
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();
            
            // Look for existing NextAuth session cookie
            const sessionCookieName = process.env.NEXTAUTH_URL?.includes('localhost') 
              ? 'next-auth.session-token' 
              : '__Secure-next-auth.session-token';
            
            const existingSessionCookie = cookieStore.get(sessionCookieName);
            
            if (existingSessionCookie) {
              
              // Decode the existing JWT to get the current user ID
              const { getToken } = await import('next-auth/jwt');
              const existingToken = await getToken({ 
                req: { 
                  cookies: { [sessionCookieName]: existingSessionCookie.value } 
                } as any,
                secret: process.env.NEXTAUTH_SECRET 
              });
              
              if (existingToken && existingToken.userId && existingToken.userId !== user.id) {
                // Store the linking information in the user object for JWT callback
                (user as any).linkToUserId = existingToken.userId;
              }
            }
          } catch (error) {
          }
        }
        
        // Allow all credentials logins (internal auth)
        if (account?.provider === 'credentials') {
          return true;
        }
        
        // For OAuth providers, always allow sign in
        // The JWT callback will handle linking/creating accounts
        return true;
      },

      async jwt({ token, user, account, profile, trigger }): Promise<DefaultJWT> {
        debug('JWT Callback: input', { userId: token.sub, provider: account?.provider, trigger });

        let userId: string | undefined = token.sub;
        let provider: string | undefined = account?.provider;
        let emailVerified: string | null | undefined = token.emailVerified; // Start with existing token value
        
        // Note: Passive mode for OAuth is handled separately
        // For credentials, passive auth goes through custom endpoint
        
        // This block runs only on sign-in when account and user/profile are passed
        if (account && user) {
          userId = user.id; // Get ID from the user object passed by NextAuth
          provider = account.provider;
          
          if (provider === 'credentials') {
            emailVerified = (user as any).emailVerified; // Comes from authorize
            debug(`JWT Callback: Credentials sign-in for ${userId}`);
          } else { // OAuth Provider
            debug(`🔍 JWT Callback: OAuth sign-in via ${provider} for ${userId}`);
            
            // 🔍 DIAGNOSTIC LOG - CHECK IF getOrCreateUserAndAccount CALL IS NEEDED
            debug('🚨 JWT Callback: Checking if getOrCreateUserAndAccount call is needed:', {
              provider: provider,
              userId: user.id,
              providerAccountId: account.providerAccountId,
              userIdEqualsProviderAccountId: user.id === account.providerAccountId,
              isCredentialsProvider: provider === 'credentials'
            });
            
            // 🛠️ SIMPLE SOLUTION: Skip getOrCreateUserAndAccount only for regular credentials providers
            // Telegram providers should always call getOrCreateUserAndAccount for account linking
            const isTelegramProvider = provider === 'telegram' || provider === 'telegram-miniapp';
            if (provider === 'credentials' && 
                !isTelegramProvider && 
                user.id === account.providerAccountId) {
              debug('✅ JWT Callback: Skipping getOrCreateUserAndAccount call - credentials provider already returned correct UUID from authorize');
              debug('🔍 JWT Callback: User already exists, using existing data:', {
                userId: user.id,
                provider: provider
              });
              
              // Simply use existing user without additional DB call
              // Get current user data directly
              try {
                const existingUser = await client.select({
                  table: 'users',
                  pk_columns: { id: user.id },
                  returning: ['id', 'email_verified']
                });
                
                if (existingUser) {
                  emailVerified = existingUser.email_verified ? new Date(existingUser.email_verified).toISOString() : null;
                  debug(`✅ JWT Callback: Retrieved existing user data for ${user.id}`);
                } else {
                  debug(`⚠️ JWT Callback: Could not find existing user ${user.id} in database`);
                }
              } catch (error) {
                debug('⚠️ JWT Callback: Error retrieving existing user data:', error);
              }
              
            } else {
              // OAuth provider or credentials with new data - need to create/find user in DB
              debug('🔍 JWT Callback: Making getOrCreateUserAndAccount call for provider:', provider);
              
              // Check if we're in account linking mode
              // Check if token.sub corresponds to an existing user in the database
              let linkToUserId: string | undefined = undefined;
              
              // Check if we have account linking information from signIn callback
              let userLinkToUserId: string | undefined = (user as any).linkToUserId;
              
              if (userLinkToUserId) {
                try {
                  // Verify that the user to link to actually exists
                  const existingUser = await client.select({
                    table: 'users',
                    pk_columns: { id: userLinkToUserId },
                    returning: ['id']
                  });
                  
                  if (existingUser) {
                    linkToUserId = userLinkToUserId;
                    debug(`🔗 JWT Callback: Account linking mode confirmed - linking new account (${user.id}) to existing user: ${linkToUserId}`);
                  } else {
                    debug(`⚠️ JWT Callback: User to link to not found in DB, creating new user instead`);
                  }
                } catch (error) {
                  debug(`⚠️ JWT Callback: Error verifying user to link to:`, error);
                }
              } else {
                debug(`🆕 JWT Callback: No linking information found, creating new user`);
              }
              
              // 🛠️ FIX: For telegram providers NextAuth creates synthetic account with providerAccountId = user.id
              // But we need original Telegram ID. Get it from DB.
              let actualProviderAccountId = account.providerAccountId;
              if (isTelegramProvider && account.providerAccountId === user.id) {
                debug('🔧 JWT Callback: Detected NextAuth synthetic account for telegram provider, looking up real Telegram ID...');
                try {
                  // Find existing telegram account for this user
                  const existingTelegramAccount = await client.select({
                    table: 'accounts',
                    where: {
                      user_id: { _eq: user.id },
                      provider: { _in: ['telegram', 'telegram-miniapp'] }
                    },
                    returning: ['provider_account_id'],
                    limit: 1
                  });
                  
                  if (existingTelegramAccount?.length > 0) {
                    actualProviderAccountId = existingTelegramAccount[0].provider_account_id;
                    debug('✅ JWT Callback: Found existing Telegram ID:', actualProviderAccountId);
                  } else if ((user as any).telegramId) {
                    // Fallback: use telegramId from authorize function
                    actualProviderAccountId = (user as any).telegramId;
                    debug('🔄 JWT Callback: Using telegramId from authorize as fallback:', actualProviderAccountId);
                  } else {
                    debug('⚠️ JWT Callback: No Telegram ID found - neither in DB nor in user object');
                  }
                } catch (error) {
                  debug('⚠️ JWT Callback: Error looking up Telegram ID:', error);
                }
              }
              
              // 🔍 DIAGNOSTIC LOG - BEFORE getOrCreateUserAndAccount CALL
              debug('🚨 JWT Callback: About to call getOrCreateUserAndAccount with:', {
                provider: provider,
                originalProviderAccountId: account.providerAccountId,
                actualProviderAccountId: actualProviderAccountId,
                userImageFromNextAuth: user.image,
                profileFromNextAuth: profile
              });
              
              try {
                // Assume getOrCreateUserAndAccount returns HasuraUser directly
                const dbUser: HasuraUser | null = await getOrCreateUserAndAccount(
                  client,                 
                  provider!,              
                  actualProviderAccountId!, 
                  profile!,
                  user.image, // Pass user.image as the fifth argument
                  linkToUserId // Pass the existing user ID to link to if in linking mode
                );

                if (!dbUser || !dbUser.id) {
                    throw new Error('Failed to retrieve or create user from DB.');
                }
                
                // 🔍 DIAGNOSTIC LOG - AFTER getOrCreateUserAndAccount CALL
                debug('🔍 JWT Callback: getOrCreateUserAndAccount COMPLETED:', {
                  originalProviderUserId: userId,
                  dbUserId: dbUser.id,
                  userIdMappedToDbUser: userId !== dbUser.id
                });
                
                // Update userId ONLY if it changed (e.g., mapping to existing)
                userId = dbUser.id; 
                emailVerified = dbUser.email_verified ? new Date(dbUser.email_verified).toISOString() : null; // Convert unix timestamp to ISO string for NextAuth
                
                // 🔧 Save GitHub access token for issues management
                if (provider === 'github' && account?.access_token) {
                  debug('🔧 Saving GitHub access token for user:', userId);
                  try {
                    // Update the account record with the access token
                    await client.update({
                      table: 'accounts',
                      pk_columns: { 
                        provider: 'github',
                        provider_account_id: actualProviderAccountId!
                      },
                      _set: {
                        access_token: account.access_token,
                        token_type: account.token_type || 'Bearer',
                        scope: account.scope || 'read:user user:email repo public_repo',
                        expires_at: account.expires_at ? Math.floor(account.expires_at / 1000) : null
                      }
                    });
                    debug('✅ GitHub access token saved successfully');
                  } catch (tokenError) {
                    debug('⚠️ Error saving GitHub access token:', tokenError);
                    // Don't fail the auth process if token saving fails
                  }
                }
                
                debug(`JWT Callback: OAuth DB sync completed for ${userId}`); 
              } catch (error) {
                console.error('JWT Callback: Critical OAuth user sync error:', error);
                debug('JWT Callback: Error during OAuth user sync:', error);
                token.error = 'AccountSyncFailed';
                return token; // Stop on error
              }
            }
          }
        }

        // If no userId could be determined, it's an error state
        if (!userId) {
          debug('JWT Callback: Error - User ID could not be determined.');
          token.error = 'UserIDMissing';
          return token;
        }

        // --- Always fetch latest data and generate Hasura claims if userId exists ---
        let latestRole = 'user'; // Default role
        let isAdmin = false;
        try {
          // Fetch latest user data for roles/status
          const userResult = await client.select({
              table: 'users',
              pk_columns: { id: userId }, 
              returning: ['id', 'email_verified', 'is_admin', 'hasura_role']
          });
          const currentUserData = userResult;
          if (currentUserData) {
            latestRole = currentUserData.hasura_role ?? 'user';
            isAdmin = currentUserData.is_admin ?? false;
            emailVerified = currentUserData.email_verified; // Override with DB value
            debug(`JWT Callback: Fetched latest DB data for ${userId}. Role: ${latestRole}, Admin: ${isAdmin}, Verified: ${emailVerified}`);
          }
        } catch (fetchError) {
            console.error('JWT Callback: Critical error fetching latest user data:', fetchError);
            debug('JWT Callback: Error fetching latest user data, claims might be based on older data:', fetchError);
        }

        const allowedRoles = [latestRole, 'me'];
        if (isAdmin) allowedRoles.push('admin');
        if (latestRole !== 'anonymous') allowedRoles.push('anonymous');
        const uniqueAllowedRoles = [...new Set(allowedRoles)];

        // Update the token with necessary info for session & Hasura claims
        token.sub = userId; // Ensure NextAuth uses the correct user ID from database
        token.userId = userId;
        
        // Ensure token.sub contains the database user ID for future account linking
        // This is crucial for the smart linking logic above
        token.provider = provider ?? token.provider; // Keep existing if not sign-in
        token.emailVerified = emailVerified;
        // Generating Hasura claims
        token["https://hasura.io/jwt/claims"] = {
            'x-hasura-allowed-roles': uniqueAllowedRoles,
            'x-hasura-default-role': latestRole,
            'x-hasura-user-id': userId,
        };
        
        // Generate and save accessToken (Hasura JWT) in token
        // Using data from token for generation
        try {
            const jwtSecret = process.env.HASURA_JWT_SECRET;
            if (!jwtSecret) throw new Error('HASURA_JWT_SECRET is not configured.');
            
            const parsedJwtSecret = JSON.parse(jwtSecret);
            if (!parsedJwtSecret.key) throw new Error('Invalid HASURA_JWT_SECRET format.');
            
            const hasuraJwt = await new SignJWT(token["https://hasura.io/jwt/claims"])
              .setProtectedHeader({ alg: 'HS256' }) // Specify the algorithm
              .setIssuedAt()
              // .setExpirationTime('2h') // Set token expiration time if needed
              .sign(new TextEncoder().encode(parsedJwtSecret.key)); // Use key from secret
              
            (token as any).accessToken = hasuraJwt; // Save generated JWT
            tempTokenForRedirect = hasuraJwt; // Save for redirect callback
            debug('JWT Callback: Generated and stored Hasura accessToken.');
            
        } catch (error) {
             console.error('JWT Callback: Critical Hasura JWT generation error:', error);
             debug('JWT Callback: Error generating Hasura JWT:', error);
             token.error = 'HasuraJWTGenerationFailed';
             tempTokenForRedirect = null; // Reset if generation failed
        }
        
        delete token.error; 
        debug('JWT Callback: completed.', { userId: token.userId, provider: token.provider });
        return token; // Return the enriched JWT
      },

      async session({ session, token }: any): Promise<DefaultSession> {
        debug('Session Callback: input token', { userId: token.userId, provider: token.provider });
        
        // Assign properties from token to session, relying on default handling for session.user
        session.provider = token.provider ?? 'unknown'; 
        session.error = token.error;
        session.hasuraClaims = token["https://hasura.io/jwt/claims"];
        session.accessToken = (token as any).accessToken || null;

        // IMPORTANT: Set the user ID from token to session.user.id
        if (token.userId && session.user) {
          session.user.id = token.userId;
        }

        // Add emailVerified directly to the session root if needed, not user object
        // Or rely on it being in the hasuraClaims/token if client needs it
        // (session.user as any).emailVerified = token.emailVerified; // Avoid modifying session.user structure

        debug('Session Callback: output session', { userId: session.user?.id, provider: session.provider, hasToken: !!session.accessToken });
        return session; // Return the session adhering to DefaultSession + our extensions
      },
      
      // Updated redirect callback for token passing and passive support
      async redirect({ url, baseUrl }: { url: string, baseUrl: string }): Promise<string> {
        debug('Redirect Callback: url=', url, 'baseUrl=', baseUrl, 'tempToken=', tempTokenForRedirect ? 'present' : 'null');
        
        const defaultRedirectUrl = url.startsWith('/') ? `${baseUrl}${url}` : url;
        const targetOrigin = new URL(defaultRedirectUrl).origin;
        
        // If redirect is NOT to our baseUrl (i.e., to localhost callback)
        // and we have a token from jwt callback
        if (targetOrigin !== baseUrl && tempTokenForRedirect) {
            const redirectUrlWithToken = new URL(defaultRedirectUrl); // Use URL where NextAuth wanted to redirect
            redirectUrlWithToken.searchParams.set('auth_token', tempTokenForRedirect);
            debug('Redirect Callback: Different origin detected, appending token:', redirectUrlWithToken.toString());
            tempTokenForRedirect = null; // Reset temporary token
            return redirectUrlWithToken.toString();
        }
        
        // In all other cases (redirect within Vercel, no token)
        debug('Redirect Callback: Same origin or no token, returning default URL:', defaultRedirectUrl);
        tempTokenForRedirect = null; // Reset temporary token
        return defaultRedirectUrl;
      }
    },
    // Add custom pages if needed
    // pages: {
    //   signIn: '/auth/signin',
    //   signOut: '/auth/signout',
    //   error: '/auth/error', // Error code passed in query string as ?error=
    //   verifyRequest: '/auth/verify-request', // (used for email/passwordless login)
    //   newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // }
  };
} 
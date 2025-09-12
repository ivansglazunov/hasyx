import { Hasyx } from './hasyx/hasyx';
import { comparePassword, hashPassword } from './users/auth-server';
import Debug from './debug';
import type { User as NextAuthUser } from 'next-auth';
import CredentialsProviderImport from 'next-auth/providers/credentials';

const debug = Debug('auth:credentials');

// Define and export the Credentials Provider configuration
const CredentialsProvider = (CredentialsProviderImport as any)?.default || (CredentialsProviderImport as any);

export interface CredentialsInput {
  userId?: string;
  providerType?: 'email' | 'phone';
  identifier?: string;
  password?: string;
}

export async function authorizeCredentials(hasyx: Hasyx, credentials: CredentialsInput): Promise<NextAuthUser | null> {
  debug('Authorize attempt with payload:', Object.keys(credentials || {}));

  if (credentials?.userId) {
    const user = await hasyx.select<any>({
      table: 'users',
      pk_columns: { id: credentials.userId },
      returning: ['id', 'name', 'email', 'image', 'email_verified']
    });
    if (!user?.id) throw new Error('User not found.');
    return { id: user.id, name: user.name, email: user.email, image: user.image, emailVerified: user.email_verified } as any;
  }

  if (!credentials?.providerType || !credentials?.identifier || !credentials?.password) {
    throw new Error('Missing provider, identifier or password.');
  }

  const providerType = credentials.providerType as 'email' | 'phone';
  const identifier = credentials.identifier as string;
  const password = credentials.password as string;

  try {
    const account = await hasyx.select<any>({
      table: 'accounts',
      where: { provider: { _eq: providerType }, provider_account_id: { _eq: identifier } },
      returning: [
        'credential_hash',
        { user: ['id', 'name', 'email', 'image', 'email_verified'] }
      ],
      limit: 1,
    });

    if (!account?.length) throw new Error('Account not found');
    const a = account[0];
    const ok = a.credential_hash ? await comparePassword(password, a.credential_hash) : false;
    if (!ok) throw new Error('Invalid password');

    const user = a.user;
    if (!user?.id) throw new Error('Linked user not found');
    return { id: user.id, name: user.name, email: user.email, image: user.image, emailVerified: user.email_verified } as any;

  } catch (error) {
    debug('Error during authorize step:', error);
    if (error instanceof Error) {
      if (error.message.includes('Invalid password') ||
        error.message.includes('Account not found') ||
        error.message.includes('User not found')) {
        throw error;
      }
      throw new Error('An unexpected error occurred during login/registration.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
}

export const AppCredentialsProvider = ({
  hasyx,
  credentials = {
    userId: { label: 'User ID', type: 'text' }, // Preferred path after OTP verify
    providerType: { label: 'Provider', type: 'text' }, // 'email' | 'phone'
    identifier: { label: 'Identifier', type: 'text' }, // email or phone
    password: { label: 'Password', type: 'password' },
  },
}: {
  hasyx: Hasyx;
  credentials?: any;
}) => CredentialsProvider({
  name: 'Credentials',
  credentials,
  async authorize(credentials, req): Promise<NextAuthUser | null> {
    return authorizeCredentials(hasyx, credentials as any);
  }
}); 
import { NextRequest, NextResponse } from 'next/server';
import Debug from 'hasyx/lib/debug';
import { verifyAttempt } from 'hasyx/lib/verification-codes';
import { Hasyx, createApolloClient, Generator } from 'hasyx';
import { comparePassword, hashPassword } from 'hasyx/lib/users/auth-server';
import schema from 'hasyx/public/hasura-schema.json';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/options';

const debug = Debug('api:credentials:verify');

function getClient(): Hasyx {
  return new Hasyx(createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }), Generator(schema as any));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attemptId, code, password } = body as { attemptId: string; code: string; password: string };
    if (!attemptId || !code || !password) {
      return NextResponse.json({ error: 'Missing attemptId, code, or password' }, { status: 400 });
    }

    const result = await verifyAttempt({ attemptId, code });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

    const client = getClient();
    const session = await getServerSession(authOptions);
    const currentSessionUserId = (session as any)?.user?.id ?? null;
    const provider = result.provider!; // 'email' | 'phone'
    const identifier = result.identifier!;

    // Find existing account by provider+identifier
    const accountRows = await client.select<any>({
      table: 'accounts',
      where: { provider: { _eq: provider }, provider_account_id: { _eq: identifier } },
      returning: ['id', 'user_id', 'credential_hash'],
      limit: 1,
    });

    if (accountRows?.length > 0) {
      // Existing account: verify password
      const acc = accountRows[0];
      const ok = acc.credential_hash ? await comparePassword(password, acc.credential_hash) : false;
      if (!ok) return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      // Tell client to signIn as this user
      return NextResponse.json({ action: 'signed-in', userId: acc.user_id, provider, identifier });
    }

    // No account exists yet
    let targetUserId = currentSessionUserId;
    if (!targetUserId) {
      // create new user
      const newUser = await client.insert<any>({
        table: 'users',
        object: { hasura_role: 'user' },
        returning: ['id'],
      });
      targetUserId = newUser.id;
    }
    const credentialHash = await hashPassword(password);
    await client.insert({
      table: 'accounts',
      object: {
        user_id: targetUserId,
        provider,
        provider_account_id: identifier,
        type: 'credentials',
        credential_hash: credentialHash,
      },
      returning: ['id'],
    });

    return NextResponse.json({ action: currentSessionUserId ? 'linked' : 'signed-in', userId: targetUserId, provider, identifier });
  } catch (error: any) {
    debug('Error verifying credentials flow:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}



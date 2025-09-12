import { NextRequest, NextResponse } from 'next/server';
import Debug from '../debug';
import { verifyAttempt } from '../verification-codes';
import { Hasyx } from '../hasyx/hasyx';
import { createApolloClient } from '../apollo/apollo';
import { Generator } from '../generator';
import { comparePassword, hashPassword } from '../users/auth-server';
import schema from '../../public/hasura-schema.json';
import { getServerSession } from 'next-auth';

const debug = Debug('api:credentials:verify');

function getClient(): Hasyx {
  return new Hasyx(createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }), Generator(schema as any));
}

export async function handleCredentialsVerify(request: NextRequest, authOptions?: any) {
  try {
    const body = await request.json();
    const { attemptId, code, password } = body as { attemptId: string; code: string; password: string };
    if (!attemptId || !code || !password) return NextResponse.json({ error: 'Missing attemptId, code, or password' }, { status: 400 });

    const result = await verifyAttempt({ attemptId, code });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

    const client = getClient();
    let currentSessionUserId: string | null = null;
    try {
      if (authOptions) {
    const session = await getServerSession(authOptions as any);
        currentSessionUserId = (session as any)?.user?.id ?? null;
      }
    } catch {}
    const provider = result.provider!; // 'email' | 'phone'
    const identifier = result.identifier!;

    const accountRows = await client.select<any>({ table: 'accounts', where: { provider: { _eq: provider }, provider_account_id: { _eq: identifier } }, returning: ['id', 'user_id', 'credential_hash'], limit: 1 });

    if (accountRows?.length > 0) {
      const acc = accountRows[0];
      const ok = acc.credential_hash ? await comparePassword(password, acc.credential_hash) : false;
      if (!ok) return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      return NextResponse.json({ action: 'signed-in', userId: acc.user_id, provider, identifier });
    }

    let targetUserId = currentSessionUserId;
    if (!targetUserId) {
      const newUser = await client.insert<any>({ table: 'users', object: { hasura_role: 'user' }, returning: ['id'] });
      targetUserId = newUser.id;
    }
    const credentialHash = await hashPassword(password);
    await client.insert({ table: 'accounts', object: { user_id: targetUserId, provider, provider_account_id: identifier, type: 'credentials', credential_hash: credentialHash }, returning: ['id'] });
    return NextResponse.json({ action: currentSessionUserId ? 'linked' : 'signed-in', userId: targetUserId, provider, identifier });
  } catch (error: any) {
    debug('Error verifying credentials flow:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// OTP-only verification (no password, always sign-in/link account)
export async function handleOtpVerify(request: NextRequest, authOptions?: any) {
  const dbg = Debug('api:otp:verify');
  try {
    const body = await request.json();
    const { attemptId, code } = body as { attemptId: string; code: string };
    if (!attemptId || !code) return NextResponse.json({ error: 'Missing attemptId or code' }, { status: 400 });

    const result = await verifyAttempt({ attemptId, code });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

    const client = getClient();
    let currentSessionUserId: string | null = null;
    try {
      if (authOptions) {
        const session = await getServerSession(authOptions as any);
        currentSessionUserId = (session as any)?.user?.id ?? null;
      }
    } catch {}
    const provider = result.provider!; // 'email' | 'phone'
    const identifier = result.identifier!;

    // Find existing account by provider+identifier
    const accountRows = await client.select<any>({
      table: 'accounts',
      where: { provider: { _eq: provider }, provider_account_id: { _eq: identifier } },
      returning: ['id', 'user_id', 'credential_hash'],
      limit: 1,
    });

    let targetUserId = currentSessionUserId;
    if (accountRows?.length) {
      // If account exists, keep linked user
      targetUserId = accountRows[0].user_id;
    } else {
      // If no account exists yet, ensure we have a user to link
      if (!targetUserId) {
        const newUser = await client.insert<any>({ table: 'users', object: { hasura_role: 'user' }, returning: ['id'] });
        targetUserId = newUser.id;
      }
      await client.insert({
        table: 'accounts',
        object: { user_id: targetUserId, provider, provider_account_id: identifier, type: 'credentials', credential_hash: null },
        returning: ['id'],
      });
    }

    dbg('OTP verified for %s:%s user=%s', provider, identifier, targetUserId);
    return NextResponse.json({ action: currentSessionUserId ? 'linked' : 'signed-in', userId: targetUserId, provider, identifier });
  } catch (error: any) {
    const dbgErr = Debug('api:otp:verify:error');
    dbgErr('Error in OTP verify:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Set or change password for an identifier belonging to the current user
export async function handleCredentialsSet(request: NextRequest, authOptions?: any) {
  const dbg = Debug('api:credentials:set');
  try {
    let currentUserId: string | null = null;
    try {
      if (authOptions) {
        const session = await getServerSession(authOptions as any);
        currentUserId = (session as any)?.user?.id ?? null;
      }
    } catch {}
    if (!currentUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { providerType, identifier, oldPassword, newPassword, confirmNewPassword } = body as {
      providerType: 'email' | 'phone';
      identifier: string;
      oldPassword?: string;
      newPassword: string;
      confirmNewPassword: string;
    };
    if (!providerType || !identifier || !newPassword || !confirmNewPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    const client = getClient();
    // Find or create account for this user and identifier
    const accountRows = await client.select<any>({
      table: 'accounts',
      where: { provider: { _eq: providerType }, provider_account_id: { _eq: identifier } },
      returning: ['id', 'user_id', 'credential_hash'],
      limit: 1,
    });

    let account = accountRows?.[0] ?? null;
    if (account && account.user_id !== currentUserId) {
      // If identifier belongs to another user, prevent hijack
      return NextResponse.json({ error: 'Identifier is linked to another user' }, { status: 403 });
    }

    if (!account) {
      // Create account with this identifier for current user
      const inserted = await client.insert<any>({
        table: 'accounts',
        object: { user_id: currentUserId, provider: providerType, provider_account_id: identifier, type: 'credentials', credential_hash: null },
        returning: ['id', 'user_id', 'credential_hash'],
      });
      account = inserted;
    }

    // If there is an existing password, require oldPassword to change
    if (account.credential_hash) {
      const ok = oldPassword ? await comparePassword(oldPassword, account.credential_hash) : false;
      if (!ok) return NextResponse.json({ error: 'Invalid old password' }, { status: 401 });
    }

    const newHash = await hashPassword(newPassword);
    await client.update({
      table: 'accounts',
      pk_columns: { id: account.id },
      _set: { credential_hash: newHash },
      returning: ['id'],
    });

    dbg('Password set for %s:%s by user %s', providerType, identifier, currentUserId);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const dbgErr = Debug('api:credentials:set:error');
    dbgErr('Error setting credentials:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Get status for identifier: whether linked to current user and whether password exists
export async function handleCredentialsStatus(request: NextRequest, authOptions?: any) {
  const dbg = Debug('api:credentials:status');
  try {
    const { searchParams } = new URL(request.url);
    const providerType = searchParams.get('providerType') as 'email' | 'phone' | null;
    const identifier = searchParams.get('identifier');
    if (!providerType || !identifier) return NextResponse.json({ error: 'Missing providerType or identifier' }, { status: 400 });

    let currentUserId: string | null = null;
    try {
      if (authOptions) {
        const session = await getServerSession(authOptions as any);
        currentUserId = (session as any)?.user?.id ?? null;
      }
    } catch {}
    if (!currentUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const client = getClient();
    const accountRows = await client.select<any>({
      table: 'accounts',
      where: { provider: { _eq: providerType }, provider_account_id: { _eq: identifier } },
      returning: ['id', 'user_id', 'credential_hash'],
      limit: 1,
    });

    const account = accountRows?.[0] ?? null;
    const linked = !!account && account.user_id === currentUserId;
    const hasPassword = !!account?.credential_hash;
    dbg('Status for %s:%s linked=%s hasPassword=%s', providerType, identifier, linked, hasPassword);
    return NextResponse.json({ linked, hasPassword });
  } catch (error: any) {
    const dbgErr = Debug('api:credentials:status:error');
    dbgErr('Error reading credentials status:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

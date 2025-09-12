import 'dotenv/config';
import Debug from './debug';
import { Hasyx } from './hasyx/hasyx';
import { createApolloClient } from './apollo/apollo';
import { Generator } from './generator';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import schema from '../public/hasura-schema.json';

const debug = Debug('auth:verification');

const SALT_ROUNDS = 10;
const DEFAULT_TTL_MINUTES = 10;

let client: Hasyx | null = null;
function getClient(): Hasyx {
  if (!client) {
    if (!process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || !process.env.HASURA_ADMIN_SECRET) {
      throw new Error('Hasura env is not configured');
    }
    client = new Hasyx(createApolloClient({
      secret: process.env.HASURA_ADMIN_SECRET!,
    }), Generator(schema as any));
  }
  return client;
}

export type VerificationProvider = 'email' | 'phone';

export interface CreateAttemptInput {
  provider: VerificationProvider;
  identifier: string; // email or E.164 phone
  userId?: string; // optional initiator
  ttlMinutes?: number;
}

export interface CreateAttemptResult {
  attemptId: string;
  expiresAt: string;
  code: string; // return code for dev logs; do not expose to client
}

function generateNumericCode(length = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

export async function createAttempt(input: CreateAttemptInput): Promise<CreateAttemptResult> {
  const hasyx = getClient();
  const code = generateNumericCode(6);
  const codeHash = await bcrypt.hash(code, SALT_ROUNDS);
  const attemptId = uuidv4();
  const ttl = input.ttlMinutes ?? DEFAULT_TTL_MINUTES;
  const expiresAt = new Date(Date.now() + ttl * 60_000).toISOString();

  debug('Creating verification attempt %s for %s:%s TTL=%d', attemptId, input.provider, input.identifier, ttl);
  await hasyx.insert({
    table: 'verification_codes',
    object: {
      id: attemptId,
      provider: input.provider,
      identifier: input.identifier,
      user_id: input.userId ?? null,
      code_hash: codeHash,
      expires_at: expiresAt,
      attempts: 0,
    },
    returning: ['id'],
  });

  return { attemptId, expiresAt, code };
}

export interface VerifyAttemptInput {
  attemptId: string;
  code: string;
  maxAttempts?: number;
}

export interface VerifyAttemptResult {
  ok: boolean;
  provider?: VerificationProvider;
  identifier?: string;
  userId?: string | null;
  error?: string;
}

export async function verifyAttempt(input: VerifyAttemptInput): Promise<VerifyAttemptResult> {
  const hasyx = getClient();
  const maxAttempts = input.maxAttempts ?? 5;
  const rows = await hasyx.select<any>({
    table: 'verification_codes',
    pk_columns: { id: input.attemptId },
    returning: ['id', 'provider', 'identifier', 'user_id', 'code_hash', 'expires_at', 'consumed_at', 'attempts'],
  });

  if (!rows) return { ok: false, error: 'Attempt not found' };
  const rec = rows;

  if (rec.consumed_at) return { ok: false, error: 'Already used' };
  if (new Date(rec.expires_at).getTime() < Date.now()) return { ok: false, error: 'Expired' };
  if ((rec.attempts ?? 0) >= maxAttempts) return { ok: false, error: 'Too many attempts' };

  const isMatch = await bcrypt.compare(input.code, rec.code_hash);

  await hasyx.update({
    table: 'verification_codes',
    pk_columns: { id: rec.id },
    _set: {
      attempts: (rec.attempts ?? 0) + 1,
      consumed_at: isMatch ? new Date().toISOString() : null,
    },
  });

  if (!isMatch) return { ok: false, error: 'Invalid code' };

  return { ok: true, provider: rec.provider, identifier: rec.identifier, userId: rec.user_id };
}



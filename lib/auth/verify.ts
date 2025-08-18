import { NextRequest, NextResponse } from 'next/server';
import { verifyVerificationToken } from '../tokenUtils';
import { Hasyx } from '../hasyx/hasyx';
import { createApolloClient } from '../apollo/apollo';
import { Generator } from '../generator';
import schema from '../../public/hasura-schema.json';
import Debug from '../debug';
import { withCors } from '../cors';
import { API_URL } from '../url';

const debug = Debug('api:auth:verify');

const client = new Hasyx(createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }), Generator(schema as any));

export async function handleAuthVerifyGET(request: NextRequest) {
  return withCors(request, async (req) => {
    const token = req.nextUrl.searchParams.get('token');
    debug('Received verification request with token: %s', token ? 'present' : 'missing');
    if (!token) return NextResponse.redirect(`${API_URL}/auth/error?error=Verification token missing.`);

    const verificationResult = await verifyVerificationToken(token);
    if (!verificationResult?.userId) return NextResponse.redirect(`${API_URL}/auth/error?error=Invalid or expired verification link.`);

    const userId = verificationResult.userId;
    debug('Token verified for user ID: %s. Attempting to update database...', userId);
    try {
      const updateResult = await client.update({ table: 'users', pk_columns: { id: userId }, _set: { email_verified: new Date().toISOString() }, returning: ['id'] });
      if ((updateResult as any)?.id === userId) {
        debug('User email verified successfully in database for ID: %s', userId);
        return NextResponse.redirect(`${API_URL}/`);
      }
      debug('Database update failed for verification, user ID: %s.', userId);
      return NextResponse.redirect(`${API_URL}/auth/error?error=Failed to update verification status.`);
    } catch (error: any) {
      debug('Error updating user verification status in database for ID %s: %s', userId, error.message);
      return NextResponse.redirect(`${API_URL}/auth/error?error=Database error during verification.`);
    }
  });
}



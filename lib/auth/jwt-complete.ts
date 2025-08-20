import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createApolloClient } from '../apollo/apollo';
import { Hasyx } from '../hasyx/hasyx';
import { Generator } from '../generator';
import schema from '../../public/hasura-schema.json';
import { corsHeaders } from '../graphql-proxy';
import Debug from '../debug';

const debug = Debug('api:auth:jwt-complete');

const adminClient = new Hasyx(createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }), Generator(schema as any));

export async function handleJwtComplete(request: NextRequest) {
  debug('POST /api/auth/jwt-complete');
  try {
    const { jwtId } = await request.json();
    debug('jwt-complete: received jwtId:', jwtId);
    if (!jwtId) return NextResponse.json({ error: 'Missing jwtId' }, { status: 400, headers: corsHeaders });

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    debug('jwt-complete: getToken result present:', !!token);
    if (!token) return NextResponse.json({ error: 'Not authenticated (no token)' }, { status: 401, headers: corsHeaders });

    const hasuraJwt = (token as any).accessToken;
    debug('jwt-complete: accessToken present:', !!hasuraJwt);
    if (!hasuraJwt) return NextResponse.json({ error: 'No Hasura JWT available in session token' }, { status: 400, headers: corsHeaders });

    
    await adminClient.insert({ table: 'auth_jwt', object: { id: jwtId, jwt: hasuraJwt, redirect: null, created_at: Date.now() } });
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    debug('Error completing JWT auth:', error);
    return NextResponse.json({ error: 'Internal server error', message: (error as any)?.message }, { status: 500, headers: corsHeaders });
  }
}

export async function handleJwtCompleteOptions() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}



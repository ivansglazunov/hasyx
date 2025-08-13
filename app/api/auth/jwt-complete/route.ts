import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import schema from '../../../../public/hasura-schema.json';
import { corsHeaders } from 'hasyx/lib/graphql-proxy';
import Debug from 'hasyx/lib/debug';

const debug = Debug('api:auth:jwt-complete');

// Initialize admin client for database operations
const adminClient = new Hasyx(createApolloClient({
  secret: process.env.HASURA_ADMIN_SECRET!,
}), Generator(schema));

export async function POST(request: NextRequest) {
  debug('POST /api/auth/jwt-complete');
  
  try {
    const { jwtId } = await request.json();

    if (!jwtId) {
      return NextResponse.json(
        { error: 'Missing jwtId' },
        { status: 400, headers: corsHeaders }
      );
    }

    debug(`Completing JWT auth for ID: ${jwtId}`);

    // Get the JWT token from NextAuth
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      debug('No NextAuth token found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Get the Hasura JWT from the token
    const hasuraJwt = (token as any).accessToken;
    
    if (!hasuraJwt) {
      debug('No Hasura JWT found in token');
      return NextResponse.json(
        { error: 'No Hasura JWT available' },
        { status: 400, headers: corsHeaders }
      );
    }

    debug(`Saving JWT for JWT ID: ${jwtId}`);

    // Save JWT to auth_jwt table
    await adminClient.insert({
      table: 'auth_jwt',
      object: {
        id: jwtId,
        jwt: hasuraJwt,
        redirect: null,
        created_at: new Date().toISOString()
      }
    });

    debug(`JWT auth completed successfully for ID: ${jwtId}`);
    return NextResponse.json(
      { success: true },
      { headers: corsHeaders }
    );

  } catch (error) {
    debug('Error completing JWT auth:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
} 
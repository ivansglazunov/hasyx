import { NextRequest, NextResponse } from 'next/server';
import { createApolloClient } from 'hasyx/lib/apollo/apollo';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { Generator } from 'hasyx/lib/generator';
import schema from '../../../public/hasura-schema.json';
import { corsHeaders } from 'hasyx/lib/graphql-proxy';
import Debug from 'hasyx/lib/debug';

const debug = Debug('api:auth_jwt');

// Initialize admin client for database operations
const adminClient = new Hasyx(createApolloClient({
  secret: process.env.HASURA_ADMIN_SECRET!,
}), Generator(schema));

export async function GET(request: NextRequest) {
  debug('GET /api/auth_jwt');
  
  try {
    // Get JWT ID from query parameters
    const { searchParams } = new URL(request.url);
    const jwtId = searchParams.get('jwt');
    
    if (!jwtId) {
      return NextResponse.json(
        { error: 'JWT ID is required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    debug(`Checking JWT auth status for ID: ${jwtId}`);
    
    // Query the auth_jwt table
    const result = await adminClient.select({
      table: 'auth_jwt',
      where: { id: { _eq: jwtId } }
    });
    
    if (!result || result.length === 0) {
      debug(`JWT auth record not found for ID: ${jwtId}`);
      return NextResponse.json(
        { status: 'lost' },
        { headers: corsHeaders }
      );
    }
    
    const authRecord = result[0];
    
    if (authRecord.jwt) {
      debug(`JWT auth completed for ID: ${jwtId}`);
      return NextResponse.json(
        { 
          status: 'done', 
          jwt: authRecord.jwt,
          redirect: authRecord.redirect 
        },
        { headers: corsHeaders }
      );
    }
    
    debug(`JWT auth still waiting for ID: ${jwtId}`);
    return NextResponse.json(
      { status: 'await' },
      { headers: corsHeaders }
    );
    
  } catch (error) {
    debug('Error in JWT auth check:', error);
    console.error('JWT auth check error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
} 
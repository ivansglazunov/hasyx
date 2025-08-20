import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { useInvite } from '../invite';
import { Hasyx } from '../hasyx/hasyx';
import { Generator } from '../generator';
import { createApolloClient } from '../apollo/apollo';
import schema from '../../public/hasura-schema.json';
import Debug from '../debug';

const debug = Debug('invite:api');

export async function handleInvitePOST(request: NextRequest, authOptions): Promise<NextResponse> {
  try {
    // Get session to check authentication
    const session = await getServerSession(authOptions) as any;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 400 }
      );
    }

    // Create Hasyx client for the authenticated user
    const apolloClient = createApolloClient({
      url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
      token: session.accessToken as string,
    });

    const hasyx = new Hasyx(apolloClient, Generator(schema));
    hasyx.user = session.user;

    // Use the invite
    const result = await useInvite(hasyx, code);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    debug('Error in invite API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

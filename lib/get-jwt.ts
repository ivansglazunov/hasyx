import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getTokenFromRequest } from 'hasyx/lib/users/auth-next';
import { generateJWT } from 'hasyx/lib/jwt';
import { createApolloClient } from 'hasyx/lib/apollo/apollo';
import { Generator } from 'hasyx/lib/generator';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import hasyxSchema from '../public/hasura-schema.json';

export async function getJwtHandler(request: NextRequest, authOptions: any): Promise<NextResponse> {
  try {
    let userId: string | undefined;
    
    // First try to get user from JWT token in Authorization header
    const token = await getTokenFromRequest(request);
    
    if (token && token.sub) {
      userId = token.sub;
    } else {
      // If no JWT token, try to get user from Next-Auth session
      const session: any = await getServerSession(authOptions) as any;
      if (session?.user?.id) {
        userId = session.user.id;
      }
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in first.' },
        { status: 401 }
      );
    }

    // Create admin client to fetch user data
    const adminApollo = createApolloClient({
      secret: process.env.HASURA_ADMIN_SECRET!,
      ws: false,
    });
    
    const generate = Generator(hasyxSchema);
    const adminHasyx = new Hasyx(adminApollo, generate);

    // Get user data
    const userData = await adminHasyx.select({
      table: 'users',
      pk_columns: { id: userId },
      returning: ['id', 'hasura_role', 'is_admin']
    });

    if (!userData || !userData.id) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Generate Hasura claims
    const latestRole = userData.hasura_role ?? 'user';
    const isAdmin = userData.is_admin ?? false;
    const allowedRoles = [latestRole, 'me'];
    if (isAdmin) allowedRoles.push('admin');
    if (latestRole !== 'anonymous') allowedRoles.push('anonymous');
    const uniqueAllowedRoles = [...new Set(allowedRoles)];

    const hasuraClaims = {
      'x-hasura-allowed-roles': uniqueAllowedRoles,
      'x-hasura-default-role': latestRole,
      'x-hasura-user-id': userId,
    };

    // Generate JWT token
    const jwt = await generateJWT(userId, hasuraClaims);

    return NextResponse.json({ jwt }, { status: 200 });

  } catch (error) {
    console.error('Error generating JWT:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

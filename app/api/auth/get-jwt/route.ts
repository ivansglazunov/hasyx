import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getTokenFromRequest } from 'hasyx/lib/auth-next';
import authOptions from '../../../options';
import { generateJWT } from 'hasyx/lib/jwt';
import { createApolloClient } from 'hasyx/lib/apollo';
import { Generator } from 'hasyx/lib/generator';
import { Hasyx } from 'hasyx/lib/hasyx';
import hasyxSchema from '../../../../public/hasura-schema.json';

export async function POST(request: NextRequest) {
  try {
    let userId: string | undefined;
    
    // Сначала попробуем получить пользователя из JWT токена в заголовке Authorization
    const token = await getTokenFromRequest(request);
    
    if (token && token.sub) {
      userId = token.sub;
    } else {
      // Если нет JWT токена, попробуем получить пользователя из Next-Auth сессии
      const session = await getServerSession(authOptions);
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

    // Создаем админский клиент для получения данных пользователя
    const adminApollo = createApolloClient({
      secret: process.env.HASURA_ADMIN_SECRET!,
      ws: false,
    });
    
    const generate = Generator(hasyxSchema);
    const adminHasyx = new Hasyx(adminApollo, generate);

    // Получаем данные пользователя
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

    // Генерируем Hasura claims
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

    // Генерируем JWT токен
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
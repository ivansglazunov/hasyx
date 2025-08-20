import NextAuth from 'next-auth';
// import GitHubProvider from 'next-auth/providers/github'; // Uncomment if needed
// import { HasuraAdapter } from '@auth/hasura-adapter'; // REMOVE ADAPTER
import Debug from 'hasyx/lib/debug'; // Import from new path
import authOptions from '../../../options';
import { NextRequest, NextResponse } from 'next/server';
import { withCors } from 'hasyx/lib/cors';
import { getToken } from 'next-auth/jwt';
import { Hasyx } from 'hasyx/lib/hasyx/hasyx';
import { createApolloClient } from 'hasyx/lib/apollo/apollo';
import { Generator } from 'hasyx/lib/generator';
import schema from 'hasyx/public/hasura-schema.json';

// Provide static params for [...nextauth] route for static export
export function generateStaticParams() {
  return [
    { nextauth: ['signin'] },
    { nextauth: ['signout'] },
    { nextauth: ['session'] },
    { nextauth: ['providers'] }
  ];
}

// Create logger function for this module
const debug = Debug('auth:next-auth'); 

const handler = NextAuth(authOptions);
const adminClient = new Hasyx(createApolloClient({ secret: process.env.HASURA_ADMIN_SECRET! }), Generator(schema as any));

// Wrap original handler to add CORS support
export async function GET(request: NextRequest, ...args: any[]) {
  return withCors(request, async (req) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const nextauthParam = url.pathname.split('/api/auth/')[1] || '';

    // 1) Capture jwtId from callbackUrl on signin and set httpOnly cookie
    if (nextauthParam.startsWith('signin')) {
      try {
        const callbackUrlParam = url.searchParams.get('callbackUrl');
        if (callbackUrlParam) {
          const callbackUrl = new URL(callbackUrlParam);
          const jwtId = callbackUrl.searchParams.get('jwtId');
          if (jwtId) {
            debug('Capturing jwtId on signin and setting cookie', jwtId);
            const res = await handler(req as any, ...args);
            // Clone response to be able to append Set-Cookie
            const response = new NextResponse(res.body, { status: (res as Response).status, headers: (res as Response).headers });
            response.headers.append('Set-Cookie', `hasyx_jwt_id=${jwtId}; Path=/; HttpOnly; SameSite=Lax`);
            return response;
          }
        }
      } catch {}
    }

    // 2) On callback, read cookie + token.accessToken and insert auth_jwt; clear cookie
    if (nextauthParam.startsWith('callback')) {
      try {
        const res = await handler(req as any, ...args);
        const response = new NextResponse(res.body, { status: (res as Response).status, headers: (res as Response).headers });
        const cookies = request.cookies;
        const jwtIdCookie = cookies.get('hasyx_jwt_id')?.value;
        if (jwtIdCookie) {
          const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
          const hasuraJwt = (token as any)?.accessToken as string | undefined;
          if (hasuraJwt) {
            debug('Inserting auth_jwt from callback with jwtId from cookie');
            try {
              await adminClient.insert({
                table: 'auth_jwt',
                object: { id: jwtIdCookie, jwt: hasuraJwt, redirect: null, created_at: new Date().toISOString() },
              });
            } catch (e) {
              debug('Insert auth_jwt failed', e);
            }
          } else {
            debug('No hasuraJwt in token on callback');
          }
          response.headers.append('Set-Cookie', `hasyx_jwt_id=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
        }
        return response;
      } catch (e) {
        debug('Error in callback enhancement', e);
      }
    }

    return await handler(req as any, ...args);
  });
}

export async function POST(request: NextRequest, ...args: any[]) {
  return withCors(request, async (req) => {
    return await handler(req as any, ...args);
  });
}

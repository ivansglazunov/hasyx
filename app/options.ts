import { Hasyx, createApolloClient, Generator } from 'hasyx'; // Import Client and apollo creator
import { NextAuthOptions } from 'next-auth';

import 'next-auth';
import 'next-auth/jwt';

import { createAuthOptions } from 'hasyx/lib/auth-options';
import { AppCredentialsProvider } from 'hasyx/lib/credentials';
import { TelegramMiniappCredentialsProvider } from 'hasyx/lib/telegram-miniapp-server';

import schema from '../public/hasura-schema.json';

let authOptions: NextAuthOptions | undefined = { providers: [] }, client: Hasyx;

if (process?.env?.NEXT_PUBLIC_HASURA_GRAPHQL_URL && process?.env?.HASURA_ADMIN_SECRET) {
  client = new Hasyx(createApolloClient({
    secret: process.env.HASURA_ADMIN_SECRET!,
  }), Generator(schema));

  authOptions = createAuthOptions([
    AppCredentialsProvider({ hasyx: client }),
    TelegramMiniappCredentialsProvider({ hasyx: client }),
  ], client);
}

export default authOptions;

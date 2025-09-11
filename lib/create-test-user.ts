import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { createApolloClient } from './apollo/apollo';
import { Hasyx } from './hasyx/hasyx';
import { Generator } from './generator';
import schema from '../public/hasura-schema.json';

// Load environment variables
dotenv.config();

export async function createTestUser() {
  const adminClient = new Hasyx(
    createApolloClient({
      url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
      secret: process.env.HASURA_ADMIN_SECRET!,
    }),
    Generator(schema)
  );

  const email = `test-${uuidv4()}@example.com`;
  const name = `Test User ${uuidv4().slice(0, 8)}`;

  try {
    const inserted = await adminClient.insert({
      table: 'users',
      object: {
        email,
        name,
        is_admin: false,
        hasura_role: 'user',
      },
      returning: ['id', 'email', 'name'],
    });
    console.log('[create-test-user] insert result=', inserted);

    if (inserted && inserted.id) {
      return { id: inserted.id, email: inserted.email, name: inserted.name };
    }

    if (Array.isArray(inserted) && inserted.length > 0) {
      return { id: inserted[0].id, email: inserted[0].email, name: inserted[0].name };
    }

    if (inserted && inserted.returning && Array.isArray(inserted.returning) && inserted.returning.length > 0) {
      const row = inserted.returning[0];
      return { id: row.id, email: row.email, name: row.name };
    }

    throw new Error('Failed to create test user');
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    throw error;
  }
}
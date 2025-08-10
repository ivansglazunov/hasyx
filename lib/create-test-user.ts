import dotenv from 'dotenv';
import { createApolloClient } from './apollo/apollo';
import { Hasyx } from './hasyx/hasyx'; 
import { Generator } from './generator';
import { hashPassword } from './users/auth-server';
import schema from '../public/hasura-schema.json';

// Load environment variables
dotenv.config();

export async function createTestUser() {
  const adminClient = new Hasyx(createApolloClient({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  }), Generator(schema));

  const testEmail = 'test@example.com';
  const testPassword = '123456';

  try {
    // Check if user exists
    const existing = await adminClient.select({
      table: 'users',
      where: { email: { _eq: testEmail } },
      returning: ['id', 'email']
    });
    if (Array.isArray(existing) && existing.length > 0) {
      return { id: existing[0].id, email: existing[0].email };
    } else if (existing && existing.id) {
      return { id: existing.id, email: existing.email };
    }
      // Create test user
      const hashedPassword = await hashPassword(testPassword);
      const newUser = await adminClient.insert({
        table: 'users',
        objects: [{
          email: testEmail,
          password: hashedPassword,
          name: 'Test User',
          is_admin: false,
          hasura_role: 'user'
      }],
      returning: ['id', 'email']
    });
    // newUser может быть массивом, объектом или mutation response
    if (Array.isArray(newUser) && newUser.length > 0) {
      return { id: newUser[0].id, email: newUser[0].email };
    } else if (newUser && newUser.returning && Array.isArray(newUser.returning) && newUser.returning.length > 0) {
      return { id: newUser.returning[0].id, email: newUser.returning[0].email };
    } else if (newUser && newUser.id) {
      return { id: newUser.id, email: newUser.email };
    }
    throw new Error('Failed to create or find test user');
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    throw error;
  }
} 
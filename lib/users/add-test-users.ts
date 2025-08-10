import dotenv from 'dotenv';
import { Hasura } from '../hasura/hasura';

dotenv.config();

async function addTestUsers() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  console.log('🔧 Adding test users...');

  const testUsers = [
    { name: 'John Doe', email: 'johndoe@example.com' },
    { name: 'Jane Smith', email: 'janesmith@example.com' },
    { name: 'Bob Johnson', email: 'bobjohnson@example.com' },
    { name: 'Alice Brown', email: 'alicebrown@example.com' },
    { name: 'Charlie Wilson', email: 'charliewilson@example.com' },
    { name: 'Diana Davis', email: 'dianadavis@example.com' },
    { name: 'Eve Miller', email: 'evemiller@example.com' },
    { name: 'Frank Garcia', email: 'frankgarcia@example.com' },
    { name: 'Grace Lee', email: 'gracelee@example.com' },
    { name: 'Hector Garcia', email: 'hectorgarcia@example.com' },
  ];

  for (const user of testUsers) {
    try {
      // Check if user exists
      const existingUser = await hasura.sql(`
        SELECT id FROM public.users WHERE email = '${user.email}'
      `);

      if (existingUser.data?.result?.[0]?.length === 0) {
        // Insert user
        await hasura.sql(`
          INSERT INTO public.users (id, name, email, created_at, updated_at)
          VALUES (
            gen_random_uuid(),
            '${user.name}',
            '${user.email}',
            EXTRACT(EPOCH FROM NOW())*1000,
            EXTRACT(EPOCH FROM NOW())*1000
          )
        `);
        console.log(`✅ User created: ${user.name}`);
      } else {
        console.log(`⏩ User already exists: ${user.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating user ${user.name}:`, error);
    }
  }

  console.log('✅ Test users creation completed');
}

addTestUsers().catch(console.error); 
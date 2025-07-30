import dotenv from 'dotenv';
import { createApolloClient } from './lib/apollo';
import { Generator } from './lib/generator';
import { Hasyx } from './lib/hasyx';
import schema from './public/hasura-schema.json';

// Load environment variables
dotenv.config();

async function testSyncNow() {
  console.log('🔍 Testing sync right now...');
  
  try {
    // Test API call
    const response = await fetch('http://localhost:3004/api/github/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    console.log('📊 API response status:', response.status);
    console.log('📊 API response:', result);
    
    if (response.ok) {
      console.log('✅ Sync completed successfully!');
    } else {
      console.log('❌ Sync failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing sync:', error);
  }
}

testSyncNow().catch(console.error); 
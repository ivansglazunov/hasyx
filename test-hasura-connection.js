require('dotenv').config();
const axios = require('axios');

const url = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL?.replace('/v1/graphql', '') || 'https://hasyx.hasura.app';
const secret = process.env.HASURA_ADMIN_SECRET;

console.log('Testing Hasura connection...');
console.log('URL:', url);
console.log('Secret:', secret ? '[SET]' : '[NOT SET]');

const timeout = setTimeout(() => {
  console.error('❌ TIMEOUT after 10 seconds');
  process.exit(1);
}, 10000);

axios.post(`${url}/v1/metadata`, {}, {
  headers: { 'X-Hasura-Admin-Secret': secret },
  timeout: 5000
})
.then(res => {
  clearTimeout(timeout);
  console.log('✅ Hasura responds:', res.status);
  process.exit(0);
})
.catch(err => {
  clearTimeout(timeout);
  console.error('❌ Hasura error:', err.message);
  if (err.response) {
    console.error('Response status:', err.response.status);
    console.error('Response data:', err.response.data);
  }
  process.exit(1);
});

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { _authorize } from '@/lib/users/auth';
import { createApolloClient } from '@/lib/apollo/apollo';
import { Generator } from 'hasyx/lib/generator';
import { Hasyx } from '@/lib/hasyx/hasyx';
import hasyxSchema from '../../../../public/hasura-schema.json';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const isLocal = !!+process.env.JEST_LOCAL!;

(!isLocal ? describe : describe.skip)('JWT Auth API Route', () => {
  let adminHasyx: Hasyx;
  let testUser1: any;
  let testUser2: any;
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  beforeAll(async () => {
    // Skip if no environment variables
    if (!process.env.TEST_TOKEN || !process.env.HASURA_ADMIN_SECRET) {
      console.log('Skipping JWT API tests - environment not configured');
      return;
    }

    // Create admin client
    const adminApollo = createApolloClient({
      secret: process.env.HASURA_ADMIN_SECRET!,
      ws: false,
    });
    
    const generate = Generator(hasyxSchema);
    adminHasyx = new Hasyx(adminApollo, generate);

    // Create test users
    testUser1 = await adminHasyx.insert({
      table: 'users',
      object: {
        email: `test1-${Date.now()}@example.com`,
        hasura_role: 'user',
        is_admin: false,
      },
      returning: ['id', 'email', 'hasura_role', 'is_admin']
    });

    testUser2 = await adminHasyx.insert({
      table: 'users',
      object: {
        email: `test2-${Date.now()}@example.com`,
        hasura_role: 'user',
        is_admin: false,
      },
      returning: ['id', 'email', 'hasura_role', 'is_admin']
    });

    console.log('Created test users:', { 
      user1: testUser1.id, 
      user2: testUser2.id 
    });
  });

  afterAll(async () => {
    // Clean up test users
    if (adminHasyx && testUser1) {
      try {
        await adminHasyx.delete({
          table: 'users',
          pk_columns: { id: testUser1.id }
        });
      } catch (error) {
        console.warn('Failed to cleanup test user 1:', error);
      }
    }

    if (adminHasyx && testUser2) {
      try {
        await adminHasyx.delete({
          table: 'users',
          pk_columns: { id: testUser2.id }
        });
      } catch (error) {
        console.warn('Failed to cleanup test user 2:', error);
      }
    }
  });

  it('should allow authorized user to get their JWT token', async () => {
    // Skip if no environment variables
    if (!process.env.TEST_TOKEN || !process.env.HASURA_ADMIN_SECRET) {
      console.log('Skipping JWT API test - environment not configured');
      return;
    }

    // Authenticate as user 1
    const { axios: axios1 } = await _authorize(testUser1.id, { ws: false });
    axios1.defaults.baseURL = baseURL;

    // Make API request to get JWT
    const response1 = await axios1.post('/api/auth/get-jwt');

    expect(response1.status).toBe(200);
    expect(response1.data).toHaveProperty('jwt');
    expect(typeof response1.data.jwt).toBe('string');

    console.log('User 1 successfully got JWT:', response1.data.jwt.substring(0, 50) + '...');
  });

  it('should allow user to get JWT and use it to get another JWT', async () => {
    // Skip if no environment variables
    if (!process.env.TEST_TOKEN || !process.env.HASURA_ADMIN_SECRET) {
      console.log('Skipping JWT API test - environment not configured');
      return;
    }

    // Authenticate as user 1
    const { axios: axios1 } = await _authorize(testUser1.id, { ws: false });
    axios1.defaults.baseURL = baseURL;

    // Get JWT token
    const response1 = await axios1.post('/api/auth/get-jwt');
    const jwt1 = response1.data.jwt;

    // Create new axios with obtained JWT
    const axiosWithJwt = axios.create({
      baseURL: baseURL,
      headers: {
        'Authorization': `Bearer ${jwt1}`,
        'Content-Type': 'application/json',
      }
    });

    // Use JWT to get new JWT
    const response2 = await axiosWithJwt.post('/api/auth/get-jwt');

    expect(response2.status).toBe(200);
    expect(response2.data).toHaveProperty('jwt');
    expect(typeof response2.data.jwt).toBe('string');

    console.log('User 1 used JWT to get another JWT:', response2.data.jwt.substring(0, 50) + '...');
  });

  it('should not allow one user to impersonate another user', async () => {
    // Skip if no environment variables
    if (!process.env.TEST_TOKEN || !process.env.HASURA_ADMIN_SECRET) {
      console.log('Skipping JWT API test - environment not configured');
      return;
    }

    // Authenticate as user 1
    const { axios: axios1 } = await _authorize(testUser1.id, { ws: false });
    axios1.defaults.baseURL = baseURL;
    
    // Authenticate as user 2
    const { axios: axios2 } = await _authorize(testUser2.id, { ws: false });
    axios2.defaults.baseURL = baseURL;

    // Each user gets their own JWT
    const response1 = await axios1.post('/api/auth/get-jwt');
    const response2 = await axios2.post('/api/auth/get-jwt');

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);

    const jwt1 = response1.data.jwt;
    const jwt2 = response2.data.jwt;

    // JWT tokens should be different
    expect(jwt1).not.toBe(jwt2);

    // Decode JWT tokens to check user ID
    const payload1 = JSON.parse(Buffer.from(jwt1.split('.')[1], 'base64').toString());
    const payload2 = JSON.parse(Buffer.from(jwt2.split('.')[1], 'base64').toString());

    expect(payload1['https://hasura.io/jwt/claims']['x-hasura-user-id']).toBe(testUser1.id);
    expect(payload2['https://hasura.io/jwt/claims']['x-hasura-user-id']).toBe(testUser2.id);

    console.log('Verified users have different JWT tokens with correct user IDs');
  });

  it('should return 401 for unauthenticated requests', async () => {
    // Skip if no environment variables
    if (!process.env.TEST_TOKEN || !process.env.HASURA_ADMIN_SECRET) {
      console.log('Skipping JWT API test - environment not configured');
      return;
    }

    // Create axios without authorization
    const axiosUnauth = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    try {
      await axiosUnauth.post('/api/auth/get-jwt');
      // If request succeeded, test should fail
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toHaveProperty('error');
      expect(error.response.data.error).toContain('Unauthorized');
      console.log('Correctly rejected unauthenticated request');
    }
  });
}); 
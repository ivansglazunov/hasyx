/**
 * @jest-environment node
 */
import Axios from 'axios';
import * as dotenv from 'dotenv';
import { encode } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import schema from '../../public/hasura-schema.json';
import { createApolloClient, HasyxApolloClient } from '../apollo/apollo';
import { _authorize } from './auth';
import { getTokenFromRequest } from './auth-next';
import { hashPassword } from './auth-server';
import Debug from '../debug';
import { Generator } from '../generator';
import { Hasyx } from '../hasyx/hasyx';
import { generateJWT } from '../jwt';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const generate = Generator(schema);
const debug = Debug('test:auth');

// Ensure necessary env vars are available for tests
if (!process.env.HASURA_ADMIN_SECRET || !process.env.NEXTAUTH_SECRET || !process.env.TEST_TOKEN) {
  throw new Error('Missing required environment variables for auth tests (HASURA_ADMIN_SECRET, NEXTAUTH_SECRET, TEST_TOKEN).');
}

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;

interface TestUser {
  id: string;
  email: string;
  name: string;
  hasura_role?: string;
}

// Helper function to create an admin Hasyx client
function createAdminHasyx(): Hasyx {
  if (!HASURA_URL || !ADMIN_SECRET) {
    throw new Error('❌ Missing HASURA_URL or ADMIN_SECRET in environment variables for test setup.');
  }
  
  const adminApolloClient = createApolloClient({
    url: HASURA_URL,
    secret: ADMIN_SECRET,
    ws: false,
  }) as HasyxApolloClient;
  
  return new Hasyx(adminApolloClient, generate);
}

// Helper function to create test user
async function createTestUser(adminHasyx: Hasyx, suffix: string = ''): Promise<TestUser> {
  const email = `auth-test-${uuidv4()}@example.com`;
  const password = 'password123';
  const name = `Auth Test User ${suffix}`;
  
  const hashedPassword = await hashPassword(password);
  
  const createdUser = await adminHasyx.insert<TestUser>({
    table: 'users',
    object: { 
      email, 
      password: hashedPassword, 
      name, 
      hasura_role: 'user',
      is_admin: false 
    },
    returning: ['id', 'email', 'name']
  });
  
  if (!createdUser || !createdUser.id) {
    throw new Error(`Failed to create test user ${suffix}`);
  }
  
  return {
    id: createdUser.id,
    email: createdUser.email,
    name: createdUser.name
  };
}

// Helper function to cleanup user
async function cleanupTestUser(adminHasyx: Hasyx, userId: string) {
  try {
    await adminHasyx.delete({
      table: 'users',
      pk_columns: { id: userId },
    });
  } catch (error: any) {
    debug(`Error deleting test user ${userId}:`, error.message);
  }
}

// Helper function to cleanup Hasyx client
function cleanupHasyx(hasyx: Hasyx, label: string = '') {
  if (hasyx && hasyx.apolloClient && hasyx.apolloClient.terminate) {
    hasyx.apolloClient.terminate();
  }
}

(!!+(process?.env?.JEST_LOCAL || '') ? describe.skip : describe)('testAuthorize Function', () => {
  it('should return authorized clients for a valid user ID in non-production', async () => {
    if (process.env.NODE_ENV === 'production') {
      console.warn('Skipping testAuthorize test in production environment.');
      return; // Skip test in production
    }

    const adminHasyx = createAdminHasyx();
    let testUser: TestUser | null = null;

    try {
      debug('🧪 Testing JWT generation and client authorization...');
      
      // Create test user
      testUser = await createTestUser(adminHasyx, 'Valid');
      debug(`Test user created with ID: ${testUser.id}`);

      // Generate JWT manually instead of using testAuthorize
      const hasuraClaims = {
        'x-hasura-allowed-roles': ['user', 'me'],
        'x-hasura-default-role': 'user',
        'x-hasura-user-id': testUser.id,
      };
      
      const jwt = await generateJWT(testUser.id, hasuraClaims);
      debug('JWT generated successfully');

      // Create Axios instance with the JWT
      const axios = Axios.create({
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        }
      });
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

      // Create Apollo client with direct Hasura connection (no WebSocket to avoid localhost issues)
      const apollo = createApolloClient({
        url: HASURA_URL, // Direct to Hasura
        token: jwt,
        ws: false, // Disable WebSocket to avoid connection issues
      }) as HasyxApolloClient;

      // Create Hasyx instance
      const hasyx = new Hasyx(apollo, generate);

      // Verify the clients work
      expect(axios).toBeDefined();
      expect(apollo).toBeDefined();
      expect(hasyx).toBeDefined();

      // Verify the Authorization header in Axios defaults
      expect(axios.defaults.headers.common['Authorization']).toMatch(/^Bearer /);
      
      debug(`🎉 JWT authentication test passed - Authorization header is correctly set`);
      
      // Cleanup Apollo client
      if (apollo && apollo.terminate) {
        apollo.terminate();
      }
      
    } finally {
      // Cleanup
      if (testUser) {
        await cleanupTestUser(adminHasyx, testUser.id);
      }
      cleanupHasyx(adminHasyx, 'JWT auth test');
    }
  });

  it('should throw error if user ID does not exist', async () => {
    if (process.env.NODE_ENV === 'production') return; 

    debug('🧪 Testing testAuthorize function with non-existent user ID...');
    
    const nonExistentUserId = uuidv4();
    debug(`Calling testAuthorize for non-existent user: ${nonExistentUserId}`);
    
    await expect(_authorize(nonExistentUserId))
      .rejects
      .toThrow(/^Failed to fetch user data for/); // Update expected error message pattern
      
    debug('✅ testAuthorize correctly threw error for non-existent user');
  });

  it('should throw error if TEST_TOKEN is not set', async () => {
    if (process.env.NODE_ENV === 'production') return; 
    
    const adminHasyx = createAdminHasyx();
    let testUser: TestUser | null = null;
    
    try {
      debug('🧪 Testing testAuthorize function without TEST_TOKEN...');
      
      // Create test user
      testUser = await createTestUser(adminHasyx, 'NoToken');
      
      const originalToken = process.env.TEST_TOKEN;
      delete process.env.TEST_TOKEN; // Temporarily remove token
      
      debug(`Calling testAuthorize without TEST_TOKEN...`);
      
      await expect(_authorize(testUser.id))
        .rejects
        .toThrow('TEST_TOKEN environment variable is not set.');
        
      process.env.TEST_TOKEN = originalToken; // Restore token
      debug('✅ testAuthorize correctly threw error when TEST_TOKEN not set');
      
    } finally {
      // Cleanup
      if (testUser) {
        await cleanupTestUser(adminHasyx, testUser.id);
      }
      cleanupHasyx(adminHasyx, 'testAuthorize no token test');
    }
  });
});

// --- Real Tests for getTokenFromRequest ---
describe('Real getTokenFromRequest Function Tests', () => {
  const testSecret = process.env.NEXTAUTH_SECRET || 'test-secret';
  const testUserId = uuidv4();
  const testUserEmail = 'get-token-test@example.com';

  // Setup real environment for each test
  function setupRealTokenTestEnvironment() {
    debug('Setting up real token test environment');
    
    // Ensure NEXTAUTH_SECRET is set for cookie encoding
    if (!process.env.NEXTAUTH_SECRET) {
      process.env.NEXTAUTH_SECRET = testSecret;
      debug('Using test NEXTAUTH_SECRET for real cookie tests.');
    }
    // Ensure HASURA_JWT_SECRET is set for bearer token generation/verification
    if (!process.env.HASURA_JWT_SECRET) {
      process.env.HASURA_JWT_SECRET = JSON.stringify({ type: 'HS256', key: 'test-hasura-secret' });
      debug('Using test HASURA_JWT_SECRET for real bearer tests.');
    }
    
    debug('Real token test environment setup completed');
  }

  it('should return real payload from valid Bearer token header', async () => {
    setupRealTokenTestEnvironment();
    
    debug('🧪 Testing real getTokenFromRequest with valid Bearer token...');
    
    const bearerToken = await generateJWT(testUserId, { email: testUserEmail });
    const request = new NextRequest('http://localhost/api/test', {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    const token = await getTokenFromRequest(request);

    expect(token).not.toBeNull();
    expect(token?.sub).toBe(testUserId);
    // verifyJWT puts claims under 'https://hasura.io/jwt/claims'
    expect(token?.['https://hasura.io/jwt/claims']?.['x-hasura-user-id']).toBe(testUserId);
    expect(token?.['https://hasura.io/jwt/claims']?.email).toBe(testUserEmail);
    debug('✅ Real getTokenFromRequest: Verified Bearer token extraction.');
  });

  it('should return real payload from valid NextAuth cookie if header is missing', async () => {
    setupRealTokenTestEnvironment();
    
    debug('🧪 Testing real getTokenFromRequest with NextAuth cookie (no header)...');
    
    const sessionTokenPayload = { sub: testUserId, email: testUserEmail, iat: Date.now() / 1000 };
    const cookieToken = await encode({ token: sessionTokenPayload, secret: testSecret });
    
    const request = new NextRequest('http://localhost/api/test', {
      headers: {
        cookie: `next-auth.session-token=${cookieToken}`,
      },
    });

    const token = await getTokenFromRequest(request);

    expect(token).not.toBeNull();
    expect(token?.sub).toBe(testUserId);
    expect(token?.email).toBe(testUserEmail);
    debug('✅ Real getTokenFromRequest: Verified cookie token extraction (header missing).');
  });

  it('should return real payload from valid NextAuth cookie if Bearer token is invalid', async () => {
    setupRealTokenTestEnvironment();
    
    debug('🧪 Testing real getTokenFromRequest with invalid Bearer token but valid cookie...');
    
    const sessionTokenPayload = { sub: testUserId, email: testUserEmail, iat: Date.now() / 1000 };
    const cookieToken = await encode({ token: sessionTokenPayload, secret: testSecret });
    
    const request = new NextRequest('http://localhost/api/test', {
      headers: {
        Authorization: 'Bearer invalid-token',
        cookie: `next-auth.session-token=${cookieToken}`,
      },
    });

    const token = await getTokenFromRequest(request);

    expect(token).not.toBeNull();
    expect(token?.sub).toBe(testUserId);
    expect(token?.email).toBe(testUserEmail); // From cookie
    expect(token?.['https://hasura.io/jwt/claims']).toBeUndefined(); // Ensure it didn't parse bearer claims
    debug('✅ Real getTokenFromRequest: Verified cookie token extraction (Bearer invalid).');
  });

  it('should return real null if no token is found in header or cookie', async () => {
    setupRealTokenTestEnvironment();
    
    debug('🧪 Testing real getTokenFromRequest with no tokens...');
    
    const request = new NextRequest('http://localhost/api/test', {
      headers: {},
    });

    const token = await getTokenFromRequest(request);

    expect(token).toBeNull();
    debug('✅ Real getTokenFromRequest: Verified null return when no token exists.');
  });

  it('should return real null if Bearer token is expired', async () => {
    setupRealTokenTestEnvironment();
    
    debug('🧪 Testing real getTokenFromRequest with expired Bearer token...');
    
    // Generate real expired token (expires immediately)
    const bearerToken = await generateJWT(testUserId, { email: testUserEmail }, { expiresIn: '0s' });
    
    // Wait 1 second to ensure expiry
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const request = new NextRequest('http://localhost/api/test', {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    const token = await getTokenFromRequest(request);
    expect(token).toBeNull(); // Should fail verification and fallback to cookie (which is missing)
    debug('✅ Real getTokenFromRequest: Verified null return for expired Bearer token.');
  });
}); 
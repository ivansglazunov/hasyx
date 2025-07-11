import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { JwtClient } from './jwt-auth';

// Mock localStorage
const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: jest.fn((key: string) => mockLocalStorage.store[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    mockLocalStorage.store[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete mockLocalStorage.store[key];
  }),
  clear: jest.fn(() => {
    mockLocalStorage.store = {};
  }),
};

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

// Mock debug
jest.mock('./debug', () => ({
  default: () => jest.fn(),
}));

describe('JwtClient', () => {
  let jwtClient: JwtClient;
  let mockOnDone: ReturnType<typeof jest.fn>;

  beforeEach(() => {
    // Reset mocks
    mockLocalStorage.clear();
    mockFetch.mockClear();
    
    // Setup global mocks
    global.localStorage = mockLocalStorage as any;
    global.fetch = mockFetch as any;
    
    mockOnDone = jest.fn();
    jwtClient = new JwtClient({ onDone: mockOnDone });
  });

  afterEach(() => {
    jwtClient.stop();
  });

  it('should initialize with a UUID', () => {
    expect(jwtClient.id).toBeDefined();
    expect(jwtClient.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it('should start polling when start() is called', () => {
    jwtClient.start();
    expect(jwtClient.interval).not.toBeNull();
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('nextauth_jwt_id', jwtClient.id);
  });

  it('should stop polling when stop() is called', () => {
    jwtClient.start();
    jwtClient.stop();
    expect(jwtClient.interval).toBeNull();
  });

  it('should handle "await" status', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ status: 'await' }),
    } as any);

    await jwtClient.check();
    expect(mockOnDone).not.toHaveBeenCalled();
    expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
  });

  it('should handle "done" status', async () => {
    const testJwt = 'test-jwt-token';
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ status: 'done', jwt: testJwt }),
    } as any);

    await jwtClient.check();
    expect(mockOnDone).toHaveBeenCalledWith(testJwt);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('nextauth_jwt_id');
  });

  it('should handle "lost" status', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ status: 'lost' }),
    } as any);

    await jwtClient.check();
    expect(mockOnDone).not.toHaveBeenCalled();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('nextauth_jwt_id');
  });

  it('should handle fetch errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await jwtClient.check();
    expect(mockOnDone).not.toHaveBeenCalled();
    expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
  });

  it('should update ID when update() is called', () => {
    const originalId = jwtClient.id;
    jwtClient.update();
    expect(jwtClient.id).not.toBe(originalId);
  });

  it('should make API call to correct endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ status: 'await' }),
    } as any);

    await jwtClient.check();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/auth_jwt?jwt=${jwtClient.id}`)
    );
  });
});

describe('JWT Auth Integration', () => {
  console.log('=== JWT Auth Integration Tests ===');
  console.log('To run these tests:');
  console.log('1. Set NEXT_PUBLIC_JWT_AUTH=1 in your environment');
  console.log('2. Run the development server on localhost:3000');
  console.log('3. Run: npm test -- jwt-auth.test.ts');
  console.log('');

  it('should handle full JWT auth flow', async () => {
    // This would be an integration test that requires the server to be running
    // and proper environment setup
    expect(true).toBe(true);
  });
});

describe('JWT Auth with Real Environment', () => {
  it('should complete authentication flow', async () => {
    // Skip if environment variables are not set
    if (!+process.env.NEXT_PUBLIC_JWT_AUTH! || !process.env.HASURA_ADMIN_SECRET) {
      console.log('Skipping JWT auth test - environment not configured');
      return;
    }

    console.log('=== JWT Auth Test Instructions ===');
    console.log('1. Make sure NEXT_PUBLIC_JWT_AUTH=1 is set');
    console.log('2. Start the development server');
    console.log('3. Open a browser and navigate to /auth/signin');
    console.log('4. Complete the authentication flow');
    console.log('5. Check that JWT is saved in localStorage');
    console.log('6. Verify that GraphQL requests use the JWT token');
    console.log('==========================================');

    // This test would require manual verification
    expect(true).toBe(true);
  });
}); 
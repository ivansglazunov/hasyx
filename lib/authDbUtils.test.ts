import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { Hasyx } from './hasyx';
import { createApolloClient } from './apollo';
import { Generator } from './generator';
import { getGitHubAccessToken, hasGitHubScope } from './authDbUtils';
import schema from '../public/hasura-schema.json';

// Load environment variables from .env file
dotenv.config();

describe('GitHub Token Management', () => {
  let hasyx: Hasyx;

  beforeAll(() => {
    const apolloClient = createApolloClient({
      secret: process.env.HASURA_ADMIN_SECRET!,
    });
    const generator = Generator(schema);
    hasyx = new Hasyx(apolloClient, generator);
  });

  it('should return null when no GitHub account exists for user', async () => {
    const token = await getGitHubAccessToken(hasyx, 'non-existent-user-id');
    expect(token).toBeNull();
  });

  it('should return null when GitHub account exists but no access token', async () => {
    // Create a test user and GitHub account without access token
    const testUserId = uuidv4();
    const providerAccountId = uuidv4();
    
    try {
      // Create test user
      await hasyx.insert({
        table: 'users',
        object: {
          id: testUserId,
          name: 'Test User',
          email: `test-no-token-${uuidv4()}@example.com`,
          hasura_role: 'user'
        }
      });

      // Create GitHub account without access token
      await hasyx.insert({
        table: 'accounts',
        object: {
          user_id: testUserId,
          provider: 'github',
          provider_account_id: providerAccountId,
          type: 'oauth'
        }
      });

      const token = await getGitHubAccessToken(hasyx, testUserId);
      expect(token).toBeNull();
    } finally {
      // Cleanup
      await hasyx.delete({
        table: 'accounts',
        where: { user_id: { _eq: testUserId } }
      });
      await hasyx.delete({
        table: 'users',
        where: { id: { _eq: testUserId } }
      });
    }
  });

  it('should return access token when valid GitHub account exists', async () => {
    const testUserId = uuidv4();
    const providerAccountId = uuidv4();
    const testToken = 'ghp_testtoken123';
    
    try {
      // Create test user
      await hasyx.insert({
        table: 'users',
        object: {
          id: testUserId,
          name: 'Test User',
          email: `test-with-token-${uuidv4()}@example.com`,
          hasura_role: 'user'
        }
      });

      // Create GitHub account with access token
      await hasyx.insert({
        table: 'accounts',
        object: {
          user_id: testUserId,
          provider: 'github',
          provider_account_id: providerAccountId,
          type: 'oauth',
          access_token: testToken,
          token_type: 'Bearer',
          scope: 'read:user user:email repo public_repo',
          expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
        }
      });

      const token = await getGitHubAccessToken(hasyx, testUserId);
      expect(token).toBe(testToken);
    } finally {
      // Cleanup
      await hasyx.delete({
        table: 'accounts',
        where: { user_id: { _eq: testUserId } }
      });
      await hasyx.delete({
        table: 'users',
        where: { id: { _eq: testUserId } }
      });
    }
  });

  it('should return null when GitHub access token is expired', async () => {
    const testUserId = uuidv4();
    const providerAccountId = uuidv4();
    const testToken = 'ghp_expiredtoken123';
    
    try {
      // Create test user
      await hasyx.insert({
        table: 'users',
        object: {
          id: testUserId,
          name: 'Test User',
          email: `test-expired-token-${uuidv4()}@example.com`,
          hasura_role: 'user'
        }
      });

      // Create GitHub account with expired access token
      await hasyx.insert({
        table: 'accounts',
        object: {
          user_id: testUserId,
          provider: 'github',
          provider_account_id: providerAccountId,
          type: 'oauth',
          access_token: testToken,
          token_type: 'Bearer',
          scope: 'read:user user:email repo public_repo',
          expires_at: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
        }
      });

      const token = await getGitHubAccessToken(hasyx, testUserId);
      expect(token).toBeNull();
    } finally {
      // Cleanup
      await hasyx.delete({
        table: 'accounts',
        where: { user_id: { _eq: testUserId } }
      });
      await hasyx.delete({
        table: 'users',
        where: { id: { _eq: testUserId } }
      });
    }
  });

  it('should return false when no GitHub account exists for scope check', async () => {
    const hasScope = await hasGitHubScope(hasyx, 'non-existent-user-id', 'repo');
    expect(hasScope).toBe(false);
  });

  it('should return false when GitHub account exists but no scope', async () => {
    const testUserId = uuidv4();
    const providerAccountId = uuidv4();
    
    try {
      // Create test user
      await hasyx.insert({
        table: 'users',
        object: {
          id: testUserId,
          name: 'Test User',
          email: `test-no-scope-${uuidv4()}@example.com`,
          hasura_role: 'user'
        }
      });

      // Create GitHub account without scope
      await hasyx.insert({
        table: 'accounts',
        object: {
          user_id: testUserId,
          provider: 'github',
          provider_account_id: providerAccountId,
          type: 'oauth'
        }
      });

      const hasScope = await hasGitHubScope(hasyx, testUserId, 'repo');
      expect(hasScope).toBe(false);
    } finally {
      // Cleanup
      await hasyx.delete({
        table: 'accounts',
        where: { user_id: { _eq: testUserId } }
      });
      await hasyx.delete({
        table: 'users',
        where: { id: { _eq: testUserId } }
      });
    }
  });

  it('should return true when user has required GitHub scope', async () => {
    const testUserId = uuidv4();
    const providerAccountId = uuidv4();
    
    try {
      // Create test user
      await hasyx.insert({
        table: 'users',
        object: {
          id: testUserId,
          name: 'Test User',
          email: `test-with-scope-${uuidv4()}@example.com`,
          hasura_role: 'user'
        }
      });

      // Create GitHub account with repo scope
      await hasyx.insert({
        table: 'accounts',
        object: {
          user_id: testUserId,
          provider: 'github',
          provider_account_id: providerAccountId,
          type: 'oauth',
          access_token: 'ghp_testtoken123',
          token_type: 'Bearer',
          scope: 'read:user user:email repo public_repo',
          expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
        }
      });

      const hasRepoScope = await hasGitHubScope(hasyx, testUserId, 'repo');
      const hasPublicRepoScope = await hasGitHubScope(hasyx, testUserId, 'public_repo');
      const hasReadUserScope = await hasGitHubScope(hasyx, testUserId, 'read:user');
      
      expect(hasRepoScope).toBe(true);
      expect(hasPublicRepoScope).toBe(true);
      expect(hasReadUserScope).toBe(true);
    } finally {
      // Cleanup
      await hasyx.delete({
        table: 'accounts',
        where: { user_id: { _eq: testUserId } }
      });
      await hasyx.delete({
        table: 'users',
        where: { id: { _eq: testUserId } }
      });
    }
  });

  it('should return false when user does not have required GitHub scope', async () => {
    const testUserId = uuidv4();
    const providerAccountId = uuidv4();
    
    try {
      // Create test user
      await hasyx.insert({
        table: 'users',
        object: {
          id: testUserId,
          name: 'Test User',
          email: `test-limited-scope-${uuidv4()}@example.com`,
          hasura_role: 'user'
        }
      });

      // Create GitHub account with limited scope
      await hasyx.insert({
        table: 'accounts',
        object: {
          user_id: testUserId,
          provider: 'github',
          provider_account_id: providerAccountId,
          type: 'oauth',
          access_token: 'ghp_testtoken123',
          token_type: 'Bearer',
          scope: 'read:user user:email',
          expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
        }
      });

      const hasRepoScope = await hasGitHubScope(hasyx, testUserId, 'repo');
      const hasPublicRepoScope = await hasGitHubScope(hasyx, testUserId, 'public_repo');
      const hasReadUserScope = await hasGitHubScope(hasyx, testUserId, 'read:user');
      
      expect(hasRepoScope).toBe(false);
      expect(hasPublicRepoScope).toBe(false);
      expect(hasReadUserScope).toBe(true);
    } finally {
      // Cleanup
      await hasyx.delete({
        table: 'accounts',
        where: { user_id: { _eq: testUserId } }
      });
      await hasyx.delete({
        table: 'users',
        where: { id: { _eq: testUserId } }
      });
    }
  });

  it('should return false when GitHub access token is expired for scope check', async () => {
    const testUserId = uuidv4();
    const providerAccountId = uuidv4();
    
    try {
      // Create test user
      await hasyx.insert({
        table: 'users',
        object: {
          id: testUserId,
          name: 'Test User',
          email: `test-expired-scope-${uuidv4()}@example.com`,
          hasura_role: 'user'
        }
      });

      // Create GitHub account with expired token but valid scope
      await hasyx.insert({
        table: 'accounts',
        object: {
          user_id: testUserId,
          provider: 'github',
          provider_account_id: providerAccountId,
          type: 'oauth',
          access_token: 'ghp_expiredtoken123',
          token_type: 'Bearer',
          scope: 'read:user user:email repo public_repo',
          expires_at: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
        }
      });

      const hasScope = await hasGitHubScope(hasyx, testUserId, 'repo');
      expect(hasScope).toBe(false);
    } finally {
      // Cleanup
      await hasyx.delete({
        table: 'accounts',
        where: { user_id: { _eq: testUserId } }
      });
      await hasyx.delete({
        table: 'users',
        where: { id: { _eq: testUserId } }
      });
    }
  });
}); 
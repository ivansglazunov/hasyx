import { createApolloClient } from './apollo';
import { Generator } from './generator';
import { Hasyx } from './hasyx';
import { getGitHubAccessToken, hasGitHubScope } from './authDbUtils';
import schema from '../public/hasura-schema.json';
import Debug from './debug';

const debug = Debug('test:issue-saving');

// Skip tests if test user ID is not provided
(!!+(process?.env?.HASYX_ISSUES_TEST_USER_ID || '') ? describe : describe.skip)('GitHub Issues Saving Tests', () => {
  let hasyx: Hasyx;
  let testUserId: string;
  let testIssueId: string;
  let testIssueNumber: number;

  beforeAll(() => {
    // Initialize Hasyx client
    const apolloClient = createApolloClient();
    const generator = Generator(schema);
    hasyx = new Hasyx(apolloClient, generator);
    
    // Get test user ID from environment
    testUserId = process.env.HASYX_ISSUES_TEST_USER_ID!;
    debug('Using test user ID:', testUserId);
  });

  describe('GitHub Token and Scope Tests', () => {
    it('should have GitHub access token for test user', async () => {
      const token = await getGitHubAccessToken(hasyx, testUserId);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token!.length).toBeGreaterThan(0);
    });

    it('should have required GitHub scope for test user', async () => {
      const hasRepoScope = await hasGitHubScope(hasyx, testUserId, 'repo');
      const hasPublicRepoScope = await hasGitHubScope(hasyx, testUserId, 'public_repo');
      
      expect(hasRepoScope || hasPublicRepoScope).toBe(true);
    });
  });

  describe('GitHub Issues CRUD Operations', () => {
    it('should create a new GitHub issue', async () => {
      const issueData = {
        title: `Test Issue ${Date.now()}`,
        body: 'This is a test issue created by automated test',
        labels: ['test', 'automated']
      };

      // Create issue in database
      const insertResult = await hasyx.insert({
        table: 'github_issues',
        object: {
          title: issueData.title,
          body: issueData.body,
          state: 'open',
          user: 'test-user',
          labels: issueData.labels,
          created_at: Date.now(),
          updated_at: Date.now(),
          html_url: 'https://github.com/test/test/issues/999',
          comments_url: 'https://api.github.com/repos/test/test/issues/999/comments',
          events_url: 'https://api.github.com/repos/test/test/issues/999/events',
          node_id: 'test-node-id',
          url: 'https://api.github.com/repos/test/test/issues/999',
          repository_url: 'https://api.github.com/repos/test/test',
          labels_url: 'https://api.github.com/repos/test/test/issues/999/labels{/name}',
          comments: 0,
          assignee: null,
          milestone: null,
          locked: false,
          active_lock_reason: null,
          draft: false,
          pull_request: null,
          body_html: null,
          body_text: null,
          timeline_url: 'https://api.github.com/repos/test/test/issues/999/timeline',
          performed_via_github_app: null,
          reactions: null
        }
      });

      expect(insertResult).toBeTruthy();
      testIssueId = insertResult.id;
      testIssueNumber = insertResult.number;
      
      debug('Created test issue:', { id: testIssueId, number: testIssueNumber });
    });

    it('should update the GitHub issue', async () => {
      const updatedTitle = `Updated Test Issue ${Date.now()}`;
      const updatedBody = 'This issue has been updated by automated test';

      // Update issue in database
      const updateResult = await hasyx.update({
        table: 'github_issues',
        pk_columns: { id: testIssueId },
        _set: {
          title: updatedTitle,
          body: updatedBody,
          updated_at: Date.now()
        }
      });

      expect(updateResult).toBeTruthy();
      expect(updateResult.title).toBe(updatedTitle);
      expect(updateResult.body).toBe(updatedBody);
      
      debug('Updated test issue:', { id: testIssueId, number: testIssueNumber });
    });

    it('should delete the GitHub issue', async () => {
      // Delete issue from database
      const deleteResult = await hasyx.delete({
        table: 'github_issues',
        pk_columns: { id: testIssueId }
      });

      expect(deleteResult).toBeTruthy();
      
      debug('Deleted test issue:', { id: testIssueId, number: testIssueNumber });
    });
  });

  describe('Database Verification', () => {
    it('should verify issue was deleted from database', async () => {
      // Try to fetch the deleted issue
      const fetchResult = await hasyx.select({
        table: 'github_issues',
        pk_columns: { id: testIssueId }
      });

      expect(fetchResult).toBeNull();
    });
  });
}); 
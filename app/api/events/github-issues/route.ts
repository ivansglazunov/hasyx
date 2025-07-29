import { NextResponse } from 'next/server';
import { hasyxEvent, HasuraEventPayload } from 'hasyx/lib/events';
import { getGitHubAccessToken, hasGitHubScope } from 'hasyx/lib/authDbUtils';
import { createApolloClient } from 'hasyx/lib/apollo';
import { Generator } from 'hasyx/lib/generator';
import { Hasyx } from 'hasyx/lib/hasyx';
import { Octokit } from 'octokit';
import schema from '../../../../public/hasura-schema.json';
import Debug from 'hasyx/lib/debug';

const debug = Debug('events:github-issues');

// GitHub repository configuration
const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER;
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;

/**
 * Extract user ID from session variables
 */
function extractUserId(sessionVariables?: Record<string, string>): string | null {
  if (!sessionVariables) return null;
  
  // Try different possible keys for user ID
  return sessionVariables['x-hasura-user-id'] || 
         sessionVariables['user-id'] || 
         sessionVariables['user_id'] || 
         null;
}

/**
 * Check if the change was made by a user (not by system sync)
 */
function isUserChange(sessionVariables?: Record<string, string>): boolean {
  const userId = extractUserId(sessionVariables);
  return userId !== null;
}

/**
 * Get GitHub access token for user
 */
async function getUserGitHubToken(userId: string): Promise<string | null> {
  try {
    const apolloClient = createApolloClient();
    const generator = Generator(schema);
    const hasyx = new Hasyx(apolloClient, generator);
    
    return await getGitHubAccessToken(hasyx, userId);
  } catch (error) {
    debug('Error getting GitHub token for user:', error);
    return null;
  }
}

/**
 * Check if user has required GitHub scope
 */
async function userHasGitHubScope(userId: string, scope: string): Promise<boolean> {
  try {
    const apolloClient = createApolloClient();
    const generator = Generator(schema);
    const hasyx = new Hasyx(apolloClient, generator);
    
    return await hasGitHubScope(hasyx, userId, scope);
  } catch (error) {
    debug('Error checking GitHub scope for user:', error);
    return false;
  }
}

/**
 * Create GitHub issue
 */
async function createGitHubIssue(accessToken: string, issueData: any): Promise<any> {
  const octokit = new Octokit({ auth: accessToken });
  
  const response = await octokit.rest.issues.create({
    owner: GITHUB_OWNER!,
    repo: GITHUB_REPO!,
    title: issueData.title,
    body: issueData.body,
    labels: issueData.labels || [],
  });
  
  return response.data;
}

/**
 * Update GitHub issue
 */
async function updateGitHubIssue(accessToken: string, issueNumber: number, issueData: any): Promise<any> {
  const octokit = new Octokit({ auth: accessToken });
  
  const updateData: any = {};
  if (issueData.title) updateData.title = issueData.title;
  if (issueData.body !== undefined) updateData.body = issueData.body;
  if (issueData.state) updateData.state = issueData.state;
  if (issueData.labels) updateData.labels = issueData.labels;
  
  const response = await octokit.rest.issues.update({
    owner: GITHUB_OWNER!,
    repo: GITHUB_REPO!,
    issue_number: issueNumber,
    ...updateData
  });
  
  return response.data;
}

/**
 * Delete GitHub issue (close it)
 */
async function deleteGitHubIssue(accessToken: string, issueNumber: number): Promise<any> {
  const octokit = new Octokit({ auth: accessToken });
  
  const response = await octokit.rest.issues.update({
    owner: GITHUB_OWNER!,
    repo: GITHUB_REPO!,
    issue_number: issueNumber,
    state: 'closed'
  });
  
  return response.data;
}

/**
 * Event handler for GitHub issues table changes
 */
export const POST = hasyxEvent(async (payload: HasuraEventPayload) => {
  const { event, table } = payload;
  const { op, data, session_variables } = event;
  
  debug('Received GitHub issues event:', {
    operation: op,
    table: `${table.schema}.${table.name}`,
    hasSessionVars: !!session_variables,
    sessionVars: session_variables
  });
  
  // Check if this is a user-initiated change
  if (!isUserChange(session_variables)) {
    debug('Skipping event - not a user change');
    return {
      success: true,
      message: 'Skipped - not a user change',
      reason: 'system_sync'
    };
  }
  
  const userId = extractUserId(session_variables);
  if (!userId) {
    debug('No user ID found in session variables');
    return {
      success: false,
      message: 'No user ID found',
      error: 'missing_user_id'
    };
  }
  
  debug(`Processing ${op} operation for user ${userId}`);
  
  // Check if user has GitHub access
  const hasRepoScope = await userHasGitHubScope(userId, 'repo');
  const hasPublicRepoScope = await userHasGitHubScope(userId, 'public_repo');
  
  if (!hasRepoScope && !hasPublicRepoScope) {
    debug(`User ${userId} does not have required GitHub scope`);
    return {
      success: false,
      message: 'User does not have required GitHub scope',
      error: 'insufficient_github_scope'
    };
  }
  
  // Get user's GitHub access token
  const accessToken = await getUserGitHubToken(userId);
  if (!accessToken) {
    debug(`No GitHub access token found for user ${userId}`);
    return {
      success: false,
      message: 'No GitHub access token found',
      error: 'missing_github_token'
    };
  }
  
  try {
    let result;
    
    switch (op) {
      case 'INSERT':
        debug('Creating GitHub issue');
        result = await createGitHubIssue(accessToken, data.new);
        debug(`Created GitHub issue #${result.number}`);
        break;
        
      case 'UPDATE':
        debug('Updating GitHub issue');
        const issueNumber = data.new.number;
        result = await updateGitHubIssue(accessToken, issueNumber, data.new);
        debug(`Updated GitHub issue #${issueNumber}`);
        break;
        
      case 'DELETE':
        debug('Deleting GitHub issue');
        const deletedIssueNumber = data.old.number;
        result = await deleteGitHubIssue(accessToken, deletedIssueNumber);
        debug(`Deleted GitHub issue #${deletedIssueNumber}`);
        break;
        
      default:
        debug(`Unsupported operation: ${op}`);
        return {
          success: false,
          message: 'Unsupported operation',
          error: 'unsupported_operation'
        };
    }
    
    return {
      success: true,
      message: `GitHub issue ${op.toLowerCase()}d successfully`,
      operation: op,
      github_issue_number: result.number,
      github_issue_url: result.html_url
    };
    
  } catch (error) {
    debug('Error syncing with GitHub:', error);
    return {
      success: false,
      message: 'Failed to sync with GitHub',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}); 
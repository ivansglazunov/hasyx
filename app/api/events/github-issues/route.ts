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
        debug('Creating GitHub issue from database insert');
        
        // Extract issue data from the inserted record
        const issueData = {
          title: data.new.title,
          body: data.new.body || '',
          labels: [] // No labels
        };
        
        result = await createGitHubIssue(accessToken, issueData);
        debug(`Created GitHub issue #${result.number}`);
        
        // Update the database record with the GitHub data
        const apolloClient = createApolloClient();
        const generator = Generator(schema);
        const hasyx = new Hasyx(apolloClient, generator);
        
        await hasyx.update({
          table: 'github_issues',
          pk_columns: { id: data.new.id },
          _set: {
            github_id: result.id,
            number: result.number,
            node_id: result.node_id,
            html_url: result.html_url,
            url: result.url,
            user_data: result.user,
            assignee_data: result.assignee,
            assignees_data: result.assignees,
            labels_data: result.labels,
            milestone_data: result.milestone,
            pull_request_data: result.pull_request,
            closed_by_data: result.closed_by,
            created_at: new Date(result.created_at).getTime(),
            updated_at: new Date(result.updated_at).getTime(),
            closed_at: result.closed_at ? new Date(result.closed_at).getTime() : null,
            locked: result.locked,
            active_lock_reason: result.active_lock_reason,
            comments_count: result.comments,
            author_association: result.author_association,
          }
        });
        
        break;
        
      case 'UPDATE':
        debug('Updating GitHub issue');
        const issueNumber = data.new.number;
        if (issueNumber && issueNumber > 0) {
          result = await updateGitHubIssue(accessToken, issueNumber, data.new);
          debug(`Updated GitHub issue #${issueNumber}`);
        } else {
          debug('Skipping update - no valid issue number');
          return {
            success: true,
            message: 'Skipped - no valid issue number',
            reason: 'no_issue_number'
          };
        }
        break;
        
      case 'DELETE':
        debug('Deleting GitHub issue');
        const deletedIssueNumber = data.old.number;
        if (deletedIssueNumber && deletedIssueNumber > 0) {
          result = await deleteGitHubIssue(accessToken, deletedIssueNumber);
          debug(`Deleted GitHub issue #${deletedIssueNumber}`);
        } else {
          debug('Skipping delete - no valid issue number');
          return {
            success: true,
            message: 'Skipped - no valid issue number',
            reason: 'no_issue_number'
          };
        }
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
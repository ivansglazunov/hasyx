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
 * Check if the change was made by a user (not by system sync)
 */
function isUserChange(sessionVariables?: Record<string, string>): boolean {
  if (!sessionVariables) return false;
  
  // Check if this is an authenticated user (not system sync)
  const hasRole = sessionVariables['x-hasura-role'];
  
  // If there's a role, it's likely a user change
  if (hasRole === 'admin' || hasRole === 'user') {
    debug('Treating role as user change');
    return true;
  }
  
  return false;
}

/**
 * Extract user ID from session variables or data
 */
function extractUserId(sessionVariables?: Record<string, string>, data?: any): string | null {
  // First try to get from session variables
  if (sessionVariables) {
    const userId = sessionVariables['x-hasura-user-id'] || 
           sessionVariables['user-id'] || 
           sessionVariables['user_id'] || 
           null;
    
    if (userId) return userId;
  }
  
  // If no session user ID, try to get from data
  if (data?.new?._user_id) {
    debug('Using _user_id from data:', data.new._user_id);
    return data.new._user_id;
  }
  
  // If still no user ID but this is a user change (has role), 
  // we need to find the user ID from the database
  if (sessionVariables && (sessionVariables['x-hasura-role'] === 'admin' || sessionVariables['x-hasura-role'] === 'user')) {
    debug('User change detected but no user ID found, will need to find user from database');
    // For now, return null and let the calling function handle this
    return null;
  }
  
  return null;
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
  debug('Creating GitHub issue with data:', {
    title: issueData.title,
    body: issueData.body,
    labels: issueData.labels,
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO
  });
  
  const octokit = new Octokit({ auth: accessToken });
  
  try {
    const response = await octokit.rest.issues.create({
      owner: GITHUB_OWNER!,
      repo: GITHUB_REPO!,
      title: issueData.title,
      body: issueData.body,
      labels: issueData.labels || [],
    });
    
    debug('GitHub API response:', {
      status: response.status,
      issue_number: response.data.number,
      issue_id: response.data.id,
      html_url: response.data.html_url
    });
    
    return response.data;
  } catch (error) {
    debug('Error creating GitHub issue:', error);
    throw error;
  }
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
    sessionVars: session_variables,
    dataKeys: data ? Object.keys(data) : [],
    newData: data?.new ? {
      id: data.new.id,
      title: data.new.title,
      hasLabels: !!data.new.labels_data,
      labelsCount: data.new.labels_data?.length || 0,
      userId: data.new._user_id
    } : null
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
  
  const userId = extractUserId(session_variables, data);
  if (!userId) {
    debug('No user ID found in session variables or data');
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
        debug('Received data:', data.new);
        
        // Extract labels from labels_data
        const labels = data.new.labels_data && Array.isArray(data.new.labels_data) 
          ? data.new.labels_data.map((label: any) => label.name).filter(Boolean)
          : [];
        
        debug('Extracted labels:', labels);
        
        const issueData = {
          title: data.new.title,
          body: data.new.body || '',
          labels: labels
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
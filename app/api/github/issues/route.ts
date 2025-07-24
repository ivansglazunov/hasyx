import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import { createApolloClient } from 'hasyx/lib/apollo';
import { Generator } from 'hasyx/lib/generator';
import { Hasyx } from 'hasyx/lib/hasyx';
import schema from '../../../../public/hasura-schema.json';
import Debug from 'hasyx/lib/debug';

const debug = Debug('api:github:issues');

// GitHub repository configuration
const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER;
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;

export async function POST(request: NextRequest) {
  if (!GITHUB_OWNER || !GITHUB_REPO) throw new Error('GITHUB_OWNER or GITHUB_REPO not configured');

  try {
    debug('🚀 Starting GitHub issues sync...');
    
    // Check for GitHub token
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      debug('❌ GitHub token not found');
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }
    
    // Initialize Octokit
    const octokit = new Octokit({
      auth: githubToken,
    });
    
    // Initialize Hasyx client
    const apolloClient = createApolloClient();
    const generator = Generator(schema);
    const hasyx = new Hasyx(apolloClient, generator);
    
    debug('📊 Getting last updated issue from database...');
    
    // Get the last updated issue to determine sync starting point
    const lastIssueResult = await hasyx.select({
      table: 'github_issues',
      returning: ['updated_at'],
      order_by: [{ updated_at: 'desc' }],
      limit: 1
    });
    let since: string | undefined;
    
    if (lastIssueResult && Array.isArray(lastIssueResult) && lastIssueResult.length > 0) {
      // Convert unix timestamp back to ISO string for GitHub API
      const lastUpdatedTimestamp = lastIssueResult[0].updated_at;
      // Add 1 second buffer to avoid missing issues with exact same timestamp
      const sinceTimestamp = lastUpdatedTimestamp + 1000; // Add 1 second in milliseconds
      since = new Date(sinceTimestamp).toISOString();
      debug(`📅 Last updated issue timestamp: ${lastUpdatedTimestamp} (${new Date(lastUpdatedTimestamp).toISOString()})`);
      debug(`📅 Syncing issues since: ${since} (with 1s buffer)`);
    } else {
      debug('📅 No existing issues found, syncing all issues');
    }
    
    debug(`🔍 Fetching issues from GitHub (owner: ${GITHUB_OWNER}, repo: ${GITHUB_REPO})...`);
    
    // Fetch issues from GitHub API
    const issuesResponse = await octokit.rest.issues.listForRepo({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      state: 'all', // Get both open and closed issues
      since: since,
      per_page: 100, // Maximum allowed per page
      sort: 'updated',
      direction: 'asc'
    });
    
    const issues = issuesResponse.data;
    debug(`📥 Fetched ${issues.length} issues from GitHub`);
    
    // Debug: log first issue structure and date conversion
    if (issues.length > 0) {
      const firstIssue = issues[0];
      const createdAtMs = new Date(firstIssue.created_at).getTime();
      const updatedAtMs = new Date(firstIssue.updated_at).getTime();
      
      debug('🔍 Sample issue structure:', {
        id: firstIssue.id,
        id_type: typeof firstIssue.id,
        number: firstIssue.number,
        title: firstIssue.title,
        state: firstIssue.state,
        created_at_iso: firstIssue.created_at,
        created_at_ms: createdAtMs,
        updated_at_iso: firstIssue.updated_at,
        updated_at_ms: updatedAtMs
      });
    }
    
    if (issues.length === 0) {
      debug('✅ No new issues to sync');
      return NextResponse.json({
        success: true,
        message: 'No new issues to sync',
        synced: 0
      });
    }
    
    debug('💾 Syncing issues to database...');
    
    // Process each issue
    let syncedCount = 0;
    for (const issue of issues) {
      try {
        // Ensure proper data types for database insertion
        const issueData = {
          github_id: Number(issue.id), // Ensure it's a number
          node_id: issue.node_id || '',
          number: Number(issue.number),
          title: issue.title || '',
          body: issue.body || null,
          state: issue.state || 'open',
          state_reason: issue.state_reason || null,
          locked: Boolean(issue.locked),
          active_lock_reason: issue.active_lock_reason || null,
          comments_count: Number(issue.comments) || 0,
          author_association: issue.author_association || null,
          user_data: issue.user || null,
          assignee_data: issue.assignee || null,
          assignees_data: issue.assignees || [],
          labels_data: issue.labels || [],
          milestone_data: issue.milestone || null,
          pull_request_data: issue.pull_request || null,
          closed_by_data: issue.closed_by || null,
          repository_owner: GITHUB_OWNER,
          repository_name: GITHUB_REPO,
          url: issue.url || '',
          html_url: issue.html_url || '',
          created_at: issue.created_at ? new Date(issue.created_at).getTime() : Date.now(),
          updated_at: issue.updated_at ? new Date(issue.updated_at).getTime() : Date.now(),
          closed_at: issue.closed_at ? new Date(issue.closed_at).getTime() : null
        };
        
        // Validate date conversions
        if (isNaN(issueData.created_at) || isNaN(issueData.updated_at)) {
          debug(`⚠️ Invalid date conversion for issue #${issue.number}:`, {
            created_at_iso: issue.created_at,
            created_at_ms: issueData.created_at,
            updated_at_iso: issue.updated_at,
            updated_at_ms: issueData.updated_at
          });
          throw new Error(`Invalid date conversion for issue #${issue.number}`);
        }
        
        debug(`📝 Processing issue #${issue.number}: ${issue.title} (ID: ${issue.id})`);
        debug('📊 Issue data:', { 
          github_id: issueData.github_id, 
          number: issueData.number, 
          title: issueData.title,
          state: issueData.state,
          created_at_iso: issue.created_at,
          created_at_ms: issueData.created_at,
          updated_at_iso: issue.updated_at,
          updated_at_ms: issueData.updated_at
        });
        
        // Use insert with on_conflict to update existing issues
        await hasyx.insert({
          table: 'github_issues',
          objects: [issueData],
          on_conflict: {
            constraint: 'github_issues_github_id_key',
            update_columns: [
              'node_id', 'number', 'title', 'body', 'state', 'state_reason',
              'locked', 'active_lock_reason', 'comments_count', 'author_association',
              'user_data', 'assignee_data', 'assignees_data', 'labels_data',
              'milestone_data', 'pull_request_data', 'closed_by_data',
              'url', 'html_url', 'updated_at', 'closed_at'
            ]
          }
        });
        
        syncedCount++;
        debug(`✅ Synced issue #${issue.number}: ${issue.title}`);
      } catch (error) {
        debug(`❌ Error syncing issue #${issue.number}:`, error);
        // Continue with other issues even if one fails
      }
    }
    
    debug(`✅ GitHub issues sync completed. Synced ${syncedCount}/${issues.length} issues`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncedCount} GitHub issues`,
      synced: syncedCount,
      total: issues.length
    });
    
  } catch (error) {
    debug('❌ GitHub issues sync failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to sync GitHub issues',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

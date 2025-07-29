import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import { createApolloClient } from 'hasyx/lib/apollo';
import { Generator } from 'hasyx/lib/generator';
import { Hasyx } from 'hasyx/lib/hasyx';
import { getGitHubAccessToken, hasGitHubScope } from 'hasyx/lib/authDbUtils';
import { getServerSession } from 'next-auth';
import authOptions from 'hasyx/app/options';
import { validateGitHubWebhook } from 'hasyx/lib/github-webhook';
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
    
    if (lastIssueResult?.length > 0 && lastIssueResult[0]?.updated_at) {
      since = new Date(lastIssueResult[0].updated_at).toISOString();
      debug(`📅 Syncing issues since: ${since}`);
    } else {
      debug('📅 No previous issues found, syncing all issues');
    }
    
    // Fetch issues from GitHub
    const issuesResponse = await octokit.rest.issues.listForRepo({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      state: 'all',
      per_page: 100,
      since: since,
    });
    
    const issues = issuesResponse.data;
    debug(`📋 Found ${issues.length} issues from GitHub`);
    
    // Process and save issues
    for (const issue of issues) {
      const issueData = {
        id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        state: issue.state,
        user: issue.user?.login,
        assignees: issue.assignees?.map(a => a.login) || [],
        labels: issue.labels?.map(l => typeof l === 'string' ? l : l.name).filter(Boolean) || [],
        created_at: new Date(issue.created_at).getTime(),
        updated_at: new Date(issue.updated_at).getTime(),
        closed_at: issue.closed_at ? new Date(issue.closed_at).getTime() : null,
        html_url: issue.html_url,
        comments_url: issue.comments_url,
        events_url: issue.events_url,
        node_id: issue.node_id,
        url: issue.url,
        repository_url: issue.repository_url,
        labels_url: issue.labels_url,
        comments: issue.comments,
        assignee: issue.assignee?.login,
        milestone: issue.milestone?.title,
        locked: issue.locked,
        active_lock_reason: issue.active_lock_reason,
        draft: issue.draft,
        pull_request: issue.pull_request ? {
          url: issue.pull_request.url,
          html_url: issue.pull_request.html_url,
          diff_url: issue.pull_request.diff_url,
          patch_url: issue.pull_request.patch_url,
        } : null,
        body_html: issue.body_html,
        body_text: issue.body_text,
        timeline_url: issue.timeline_url,
        performed_via_github_app: issue.performed_via_github_app,
        reactions: issue.reactions,
      };
      
      try {
        // Upsert issue (insert or update)
        await hasyx.upsert({
          table: 'github_issues',
          object: issueData,
          on_conflict: {
            constraint: 'github_issues_id_key',
            update_columns: [
              'title', 'body', 'state', 'user', 'assignees', 'labels',
              'updated_at', 'closed_at', 'locked', 'active_lock_reason',
              'draft', 'pull_request', 'body_html', 'body_text',
              'performed_via_github_app', 'reactions'
            ]
          }
        });
        debug(`✅ Saved issue #${issue.number}`);
      } catch (error) {
        debug(`❌ Error saving issue #${issue.number}:`, error);
      }
    }
    
    debug('✅ GitHub issues sync completed');
    return NextResponse.json({ 
      success: true, 
      synced: issues.length,
      message: `Successfully synced ${issues.length} issues`
    });
    
  } catch (error) {
    debug('❌ Error during GitHub issues sync:', error);
    return NextResponse.json(
      { error: 'Failed to sync GitHub issues', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json(
      { error: 'GITHUB_OWNER or GITHUB_REPO not configured' },
      { status: 500 }
    );
  }

  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    debug(`🔍 User ${userId} requesting to create GitHub issue`);

    // Initialize Hasyx client
    const apolloClient = createApolloClient();
    const generator = Generator(schema);
    const hasyx = new Hasyx(apolloClient, generator);

    // Check if user has GitHub access token with required scope
    const hasRepoScope = await hasGitHubScope(hasyx, userId, 'repo');
    const hasPublicRepoScope = await hasGitHubScope(hasyx, userId, 'public_repo');
    
    if (!hasRepoScope && !hasPublicRepoScope) {
      return NextResponse.json(
        { error: 'GitHub authorization required. Please sign in with GitHub and grant repository access.' },
        { status: 403 }
      );
    }

    // Get user's GitHub access token
    const accessToken = await getGitHubAccessToken(hasyx, userId);
    if (!accessToken) {
      return NextResponse.json(
        { error: 'GitHub access token not found. Please re-authenticate with GitHub.' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, body: issueBody, labels = [] } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Issue title is required' },
        { status: 400 }
      );
    }

    // Initialize Octokit with user's token
    const octokit = new Octokit({
      auth: accessToken,
    });

    // Create issue
    const issueResponse = await octokit.rest.issues.create({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      title: title,
      body: issueBody,
      labels: labels,
    });

    const issue = issueResponse.data;
    debug(`✅ Created GitHub issue #${issue.number} for user ${userId}`);

    // Save the new issue to our database
    const issueData = {
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      state: issue.state,
      user: issue.user?.login,
      assignees: issue.assignees?.map(a => a.login) || [],
      labels: issue.labels?.map(l => typeof l === 'string' ? l : l.name).filter(Boolean) || [],
      created_at: new Date(issue.created_at).getTime(),
      updated_at: new Date(issue.updated_at).getTime(),
      closed_at: issue.closed_at ? new Date(issue.closed_at).getTime() : null,
      html_url: issue.html_url,
      comments_url: issue.comments_url,
      events_url: issue.events_url,
      node_id: issue.node_id,
      url: issue.url,
      repository_url: issue.repository_url,
      labels_url: issue.labels_url,
      comments: issue.comments,
      assignee: issue.assignee?.login,
      milestone: issue.milestone?.title,
      locked: issue.locked,
      active_lock_reason: issue.active_lock_reason,
      draft: issue.draft,
      pull_request: issue.pull_request ? {
        url: issue.pull_request.url,
        html_url: issue.pull_request.html_url,
        diff_url: issue.pull_request.diff_url,
        patch_url: issue.pull_request.patch_url,
      } : null,
      body_html: issue.body_html,
      body_text: issue.body_text,
      timeline_url: issue.timeline_url,
      performed_via_github_app: issue.performed_via_github_app,
      reactions: issue.reactions,
    };

    await hasyx.upsert({
      table: 'github_issues',
      object: issueData,
      on_conflict: {
        constraint: 'github_issues_id_key',
        update_columns: [
          'title', 'body', 'state', 'user', 'assignees', 'labels',
          'updated_at', 'closed_at', 'locked', 'active_lock_reason',
          'draft', 'pull_request', 'body_html', 'body_text',
          'performed_via_github_app', 'reactions'
        ]
      }
    });

    return NextResponse.json({
      success: true,
      issue: {
        id: issue.id,
        number: issue.number,
        title: issue.title,
        html_url: issue.html_url,
        created_at: issue.created_at,
      },
      message: `Issue #${issue.number} created successfully`
    });

  } catch (error) {
    debug('❌ Error creating GitHub issue:', error);
    return NextResponse.json(
      { error: 'Failed to create GitHub issue', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json(
      { error: 'GITHUB_OWNER or GITHUB_REPO not configured' },
      { status: 500 }
    );
  }

  try {
    // Initialize Hasyx client
    const apolloClient = createApolloClient();
    const generator = Generator(schema);
    const hasyx = new Hasyx(apolloClient, generator);
    
    debug('📊 Fetching issues from database...');
    
    // Get issues from database
    const issuesResult = await hasyx.select({
      table: 'github_issues',
      returning: [
        'id', 'number', 'title', 'body', 'state', 'user', 'assignees', 'labels',
        'created_at', 'updated_at', 'closed_at', 'html_url', 'comments',
        'locked', 'draft'
      ],
      order_by: [{ number: 'desc' }],
      limit: 100
    });
    
    const issues = issuesResult || [];
    debug(`✅ Found ${issues.length} issues in database`);
    
    return NextResponse.json({
      success: true,
      issues: issues,
      count: issues.length
    });
    
  } catch (error) {
    debug('❌ Error fetching issues from database:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues from database', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * GitHub Webhook handler
 * Processes webhook events from GitHub and updates the database
 */
export async function PATCH(request: NextRequest) {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json(
      { error: 'GITHUB_OWNER or GITHUB_REPO not configured' },
      { status: 500 }
    );
  }

  try {
    // Get raw body for signature verification
    const body = await request.text();
    
    // Validate GitHub webhook
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!webhookSecret) {
      debug('❌ GITHUB_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    const validation = validateGitHubWebhook(body, Object.fromEntries(request.headers), webhookSecret);
    
    if (!validation.isValid) {
      debug(`❌ Invalid webhook: ${validation.error}`);
      return NextResponse.json(
        { error: validation.error || 'Invalid webhook' },
        { status: 401 }
      );
    }

    const { eventType, payload } = validation;
    
    debug(`📥 Received GitHub webhook: ${eventType}`, { 
      action: payload.action,
      issueNumber: payload.issue?.number 
    });

    // Only process issues events
    if (eventType !== 'issues') {
      debug(`⏭️ Skipping non-issues event: ${eventType}`);
      return NextResponse.json({ success: true, message: 'Event ignored' });
    }

    // Initialize Hasyx client
    const apolloClient = createApolloClient();
    const generator = Generator(schema);
    const hasyx = new Hasyx(apolloClient, generator);

    const issue = payload.issue;
    if (!issue) {
      debug('❌ No issue data in webhook payload');
      return NextResponse.json(
        { error: 'No issue data in payload' },
        { status: 400 }
      );
    }

    // Convert GitHub issue to our database format
    const issueData = {
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      state: issue.state,
      user: issue.user?.login,
      assignees: issue.assignees?.map((a: any) => a.login) || [],
      labels: issue.labels?.map((l: any) => typeof l === 'string' ? l : l.name).filter(Boolean) || [],
      created_at: new Date(issue.created_at).getTime(),
      updated_at: new Date(issue.updated_at).getTime(),
      closed_at: issue.closed_at ? new Date(issue.closed_at).getTime() : null,
      html_url: issue.html_url,
      comments_url: issue.comments_url,
      events_url: issue.events_url,
      node_id: issue.node_id,
      url: issue.url,
      repository_url: issue.repository_url,
      labels_url: issue.labels_url,
      comments: issue.comments,
      assignee: issue.assignee?.login,
      milestone: issue.milestone?.title,
      locked: issue.locked,
      active_lock_reason: issue.active_lock_reason,
      draft: issue.draft,
      pull_request: issue.pull_request ? {
        url: issue.pull_request.url,
        html_url: issue.pull_request.html_url,
        diff_url: issue.pull_request.diff_url,
        patch_url: issue.pull_request.patch_url,
      } : null,
      body_html: issue.body_html,
      body_text: issue.body_text,
      timeline_url: issue.timeline_url,
      performed_via_github_app: issue.performed_via_github_app,
      reactions: issue.reactions,
    };

    // Handle different webhook actions
    switch (payload.action) {
      case 'opened':
      case 'created':
        debug(`✅ Creating/updating issue #${issue.number}`);
        await hasyx.upsert({
          table: 'github_issues',
          object: issueData,
          on_conflict: {
            constraint: 'github_issues_id_key',
            update_columns: [
              'title', 'body', 'state', 'user', 'assignees', 'labels',
              'updated_at', 'closed_at', 'locked', 'active_lock_reason',
              'draft', 'pull_request', 'body_html', 'body_text',
              'performed_via_github_app', 'reactions'
            ]
          }
        });
        break;

      case 'edited':
      case 'reopened':
      case 'closed':
        debug(`✅ Updating issue #${issue.number}`);
        await hasyx.upsert({
          table: 'github_issues',
          object: issueData,
          on_conflict: {
            constraint: 'github_issues_id_key',
            update_columns: [
              'title', 'body', 'state', 'user', 'assignees', 'labels',
              'updated_at', 'closed_at', 'locked', 'active_lock_reason',
              'draft', 'pull_request', 'body_html', 'body_text',
              'performed_via_github_app', 'reactions'
            ]
          }
        });
        break;

      case 'deleted':
        debug(`🗑️ Deleting issue #${issue.number}`);
        await hasyx.delete({
          table: 'github_issues',
          pk_columns: { id: issue.id }
        });
        break;

      default:
        debug(`⏭️ Ignoring action: ${payload.action}`);
        return NextResponse.json({ success: true, message: 'Action ignored' });
    }

    debug(`✅ Successfully processed GitHub webhook for issue #${issue.number}`);
    return NextResponse.json({
      success: true,
      message: `Issue #${issue.number} ${payload.action} successfully`,
      action: payload.action,
      issue_number: issue.number
    });

  } catch (error) {
    debug('❌ Error processing GitHub webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook', details: (error as Error).message },
      { status: 500 }
    );
  }
}

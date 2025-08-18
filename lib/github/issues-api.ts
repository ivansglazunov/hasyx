import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import { createApolloClient } from '../apollo/apollo';
import { Generator } from '../generator';
import { Hasyx } from '../hasyx/hasyx';
import { getGitHubAccessToken, hasGitHubScope } from '../github/auth';
import { getServerSession } from 'next-auth';
import { validateGitHubWebhook } from '../github/github-webhook';
import schema from '../../public/hasura-schema.json';
import Debug from '../debug';

const debug = Debug('api:github:issues');

const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER;
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;

export async function handleIssuesPOST(request: NextRequest, authOptions?: any) {
  if (!GITHUB_OWNER || !GITHUB_REPO) throw new Error('GITHUB_OWNER or GITHUB_REPO not configured');

  try {
    const isWebhook = request.headers.get('x-github-event') && request.headers.get('x-hub-signature');
    if (isWebhook) {
      debug('📥 Processing GitHub webhook...');
      return await handleGitHubWebhook(request);
    } else {
      debug('🚀 Starting GitHub issues sync...');
      return await handleUserSync(request, authOptions);
    }
  } catch (error) {
    debug('❌ Error in POST handler:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function handleIssuesPUT(request: NextRequest, authOptions?: any) {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json(
      { error: 'GITHUB_OWNER or GITHUB_REPO not configured' },
      { status: 500 }
    );
  }

  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    debug(`🔍 User ${userId} requesting to create GitHub issue`);

    const apolloClient = createApolloClient();
    const generator = Generator(schema as any);
    const hasyx = new Hasyx(apolloClient, generator);

    const hasRepoScope = await hasGitHubScope(hasyx, userId, 'repo');
    const hasPublicRepoScope = await hasGitHubScope(hasyx, userId, 'public_repo');
    if (!hasRepoScope && !hasPublicRepoScope) {
      return NextResponse.json(
        { error: 'GitHub authorization required. Please sign in with GitHub and grant repository access.' },
        { status: 403 }
      );
    }

    const accessToken = await getGitHubAccessToken(hasyx, userId);
    if (!accessToken) {
      return NextResponse.json(
        { error: 'GitHub access token not found. Please re-authenticate with GitHub.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, body: issueBody, labels = [] } = body;
    if (!title) {
      return NextResponse.json(
        { error: 'Issue title is required' },
        { status: 400 }
      );
    }

    const octokit = new Octokit({ auth: accessToken });
    const issueResponse = await octokit.rest.issues.create({
      owner: GITHUB_OWNER!,
      repo: GITHUB_REPO!,
      title,
      body: issueBody,
      labels,
    });

    const issue = issueResponse.data;
    debug(`✅ Created GitHub issue #${issue.number} for user ${userId}`);

    const issueData = {
      github_id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      state: issue.state,
      user_data: issue.user,
      assignee_data: issue.assignee,
      assignees_data: issue.assignees,
      labels_data: issue.labels,
      milestone_data: issue.milestone,
      pull_request_data: issue.pull_request,
      closed_by_data: issue.closed_by,
      created_at: new Date(issue.created_at).getTime(),
      updated_at: new Date(issue.updated_at).getTime(),
      closed_at: issue.closed_at ? new Date(issue.closed_at).getTime() : null,
      html_url: issue.html_url,
      node_id: issue.node_id,
      url: issue.url,
      repository_owner: GITHUB_OWNER!,
      repository_name: GITHUB_REPO!,
      locked: issue.locked,
      active_lock_reason: issue.active_lock_reason,
      comments_count: issue.comments,
      author_association: issue.author_association,
    } as any;

    await hasyx.upsert({
      table: 'github_issues',
      object: issueData,
      on_conflict: {
        constraint: 'github_issues_github_id_key',
        update_columns: [
          'title', 'body', 'state', 'user_data', 'assignee_data', 'assignees_data', 'labels_data',
          'updated_at', 'closed_at', 'locked', 'active_lock_reason',
          'pull_request_data', 'closed_by_data'
        ]
      }
    });

    return NextResponse.json({
      success: true,
      issue: { id: issue.id, number: issue.number, title: issue.title, html_url: issue.html_url, created_at: issue.created_at },
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

export async function handleIssuesGET() {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    return NextResponse.json(
      { error: 'GITHUB_OWNER or GITHUB_REPO not configured' },
      { status: 500 }
    );
  }

  try {
    const apolloClient = createApolloClient();
    const generator = Generator(schema as any);
    const hasyx = new Hasyx(apolloClient, generator);

    debug('📊 Fetching issues from database...');
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
    return NextResponse.json({ success: true, issues, count: issues.length });
  } catch (error) {
    debug('❌ Error fetching issues from database:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues from database', details: (error as Error).message },
      { status: 500 }
    );
  }
}

async function handleUserSync(request: NextRequest, authOptions?: any) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    debug(`🔍 User ${userId} requesting GitHub issues sync`);

    const apolloClient = createApolloClient();
    const generator = Generator(schema as any);
    const hasyx = new Hasyx(apolloClient, generator);

    const hasRepoScope = await hasGitHubScope(hasyx, userId, 'repo');
    const hasPublicRepoScope = await hasGitHubScope(hasyx, userId, 'public_repo');
    if (!hasRepoScope && !hasPublicRepoScope) {
      return NextResponse.json(
        { error: 'GitHub authorization required. Please sign in with GitHub and grant repository access.' },
        { status: 403 }
      );
    }

    const accessToken = await getGitHubAccessToken(hasyx, userId);
    if (!accessToken) {
      return NextResponse.json(
        { error: 'GitHub access token not found. Please re-authenticate with GitHub.' },
        { status: 403 }
      );
    }

    const octokit = new Octokit({ auth: accessToken });
    debug('📊 Getting last updated issue from database...');

    const lastIssueResult = await hasyx.select<any>({
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

    const issuesResponse = await octokit.rest.issues.listForRepo({ owner: GITHUB_OWNER!, repo: GITHUB_REPO!, state: 'all', per_page: 100, since });
    const issues = issuesResponse.data;
    debug(`📋 Found ${issues.length} issues from GitHub`);

    for (const issue of issues) {
      const issueData: any = {
        github_id: issue.id,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        state: issue.state,
        user_data: issue.user,
        assignee_data: issue.assignee,
        assignees_data: issue.assignees,
        labels_data: issue.labels,
        milestone_data: issue.milestone,
        pull_request_data: issue.pull_request,
        closed_by_data: issue.closed_by,
        created_at: new Date(issue.created_at).getTime(),
        updated_at: new Date(issue.updated_at).getTime(),
        closed_at: issue.closed_at ? new Date(issue.closed_at).getTime() : null,
        html_url: issue.html_url,
        node_id: issue.node_id,
        url: issue.url,
        repository_owner: GITHUB_OWNER!,
        repository_name: GITHUB_REPO!,
        locked: issue.locked,
        active_lock_reason: issue.active_lock_reason,
        comments_count: issue.comments,
        author_association: issue.author_association,
      };

      try {
        await hasyx.upsert({
          table: 'github_issues',
          object: issueData,
          on_conflict: {
            constraint: 'github_issues_github_id_key',
            update_columns: [
              'title', 'body', 'state', 'user_data', 'assignee_data', 'assignees_data', 'labels_data',
              'updated_at', 'closed_at', 'locked', 'active_lock_reason',
              'pull_request_data', 'closed_by_data'
            ]
          }
        });
        debug(`✅ Saved issue #${issue.number}`);
      } catch (error) {
        debug(`❌ Error saving issue #${issue.number}:`, error);
      }
    }

    debug('✅ GitHub issues sync completed');
    return NextResponse.json({ success: true, synced: issues.length, message: `Successfully synced ${issues.length} issues` });
  } catch (error) {
    debug('❌ Error during GitHub issues sync:', error);
    return NextResponse.json(
      { error: 'Failed to sync GitHub issues', details: (error as Error).message },
      { status: 500 }
    );
  }
}

async function handleGitHubWebhook(request: NextRequest) {
  try {
    const body = await request.text();

    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!webhookSecret) {
      debug('❌ GITHUB_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    const validation = validateGitHubWebhook(body, Object.fromEntries(request.headers as any), webhookSecret);
    if (!validation.isValid) {
      debug(`❌ Invalid webhook: ${validation.error}`);
      return NextResponse.json(
        { error: validation.error || 'Invalid webhook' },
        { status: 401 }
      );
    }

    const { eventType, payload } = validation as any;
    debug(`📥 Received GitHub webhook: ${eventType}`, { action: payload.action, issueNumber: payload.issue?.number });

    if (eventType !== 'issues') {
      debug(`⏭️ Skipping non-issues event: ${eventType}`);
      return NextResponse.json({ success: true, message: 'Event ignored' });
    }

    const apolloClient = createApolloClient();
    const generator = Generator(schema as any);
    const hasyx = new Hasyx(apolloClient, generator);

    const issue = payload.issue;
    if (!issue) {
      debug('❌ No issue data in webhook payload');
      return NextResponse.json(
        { error: 'No issue data in payload' },
        { status: 400 }
      );
    }

    const issueData: any = {
      github_id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      state: issue.state,
      user_data: issue.user,
      assignee_data: issue.assignee,
      assignees_data: issue.assignees,
      labels_data: issue.labels,
      milestone_data: issue.milestone,
      pull_request_data: issue.pull_request,
      closed_by_data: issue.closed_by,
      created_at: new Date(issue.created_at).getTime(),
      updated_at: new Date(issue.updated_at).getTime(),
      closed_at: issue.closed_at ? new Date(issue.closed_at).getTime() : null,
      html_url: issue.html_url,
      node_id: issue.node_id,
      url: issue.url,
      repository_owner: GITHUB_OWNER!,
      repository_name: GITHUB_REPO!,
      locked: issue.locked,
      active_lock_reason: issue.active_lock_reason,
      comments_count: issue.comments,
      author_association: issue.author_association,
    };

    switch (payload.action) {
      case 'opened':
      case 'created':
      case 'edited':
      case 'reopened':
      case 'closed':
      case 'labeled':
      case 'unlabeled':
        await hasyx.upsert({
          table: 'github_issues',
          object: issueData,
          on_conflict: {
            constraint: 'github_issues_github_id_key',
            update_columns: [
              'title', 'body', 'state', 'user_data', 'assignee_data', 'assignees_data', 'labels_data',
              'updated_at', 'closed_at', 'locked', 'active_lock_reason',
              'pull_request_data', 'closed_by_data'
            ]
          }
        });
        break;
      case 'deleted':
        await hasyx.delete({ table: 'github_issues', pk_columns: { github_id: issue.id } });
        break;
      default:
        debug(`⏭️ Ignoring action: ${payload.action}`);
        return NextResponse.json({ success: true, message: 'Action ignored' });
    }

    debug(`✅ Successfully processed GitHub webhook for issue #${issue.number}`);
    return NextResponse.json({ success: true, message: `Issue #${issue.number} ${payload.action} successfully`, action: payload.action, issue_number: issue.number });
  } catch (error) {
    debug('❌ Error processing GitHub webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook', details: (error as Error).message },
      { status: 500 }
    );
  }
}



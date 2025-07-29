import dotenv from 'dotenv';
import path from 'path';
import { Hasura, ColumnType } from './hasura';
import Debug from './debug';

// Initialize debug
const debug = Debug('migration:up-github');

export async function applySQLSchema(hasura: Hasura) {
  debug('🔧 Applying GitHub issues SQL schema...');
  
  // Define github_issues table
  await hasura.defineTable({
    schema: 'public',
    table: 'github_issues',
    id: 'id',
    type: ColumnType.UUID
  });
  
  // Add github_issues columns based on GitHub API response structure
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'github_id',
    type: ColumnType.BIGINT,
    postfix: 'NOT NULL UNIQUE',
    comment: 'GitHub issue ID from API'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'node_id',
    type: ColumnType.TEXT,
    postfix: 'NOT NULL',
    comment: 'GitHub GraphQL node ID'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'number',
    type: ColumnType.INTEGER,
    postfix: 'NOT NULL',
    comment: 'Issue number in repository'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'title',
    type: ColumnType.TEXT,
    postfix: 'NOT NULL',
    comment: 'Issue title'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'body',
    type: ColumnType.TEXT,
    comment: 'Issue body/description'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'state',
    type: ColumnType.TEXT,
    postfix: 'NOT NULL',
    comment: 'Issue state: open, closed'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'state_reason',
    type: ColumnType.TEXT,
    comment: 'Reason for state change'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'locked',
    type: ColumnType.BOOLEAN,
    postfix: 'NOT NULL DEFAULT false',
    comment: 'Whether issue is locked'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'active_lock_reason',
    type: ColumnType.TEXT,
    comment: 'Reason for locking the issue'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'comments_count',
    type: ColumnType.INTEGER,
    postfix: 'NOT NULL DEFAULT 0',
    comment: 'Number of comments on the issue'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'author_association',
    type: ColumnType.TEXT,
    comment: 'Author association with repository'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'user_data',
    type: ColumnType.JSONB,
    comment: 'GitHub user who created the issue'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'assignee_data',
    type: ColumnType.JSONB,
    comment: 'GitHub user assigned to the issue'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'assignees_data',
    type: ColumnType.JSONB,
    comment: 'Array of GitHub users assigned to the issue'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'labels_data',
    type: ColumnType.JSONB,
    comment: 'Array of labels attached to the issue'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'milestone_data',
    type: ColumnType.JSONB,
    comment: 'Milestone data if assigned'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'pull_request_data',
    type: ColumnType.JSONB,
    comment: 'Pull request data if issue is a PR'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'closed_by_data',
    type: ColumnType.JSONB,
    comment: 'GitHub user who closed the issue'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'repository_owner',
    type: ColumnType.TEXT,
    postfix: 'NOT NULL',
    comment: 'Repository owner name'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'repository_name',
    type: ColumnType.TEXT,
    postfix: 'NOT NULL',
    comment: 'Repository name'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'url',
    type: ColumnType.TEXT,
    postfix: 'NOT NULL',
    comment: 'GitHub API URL for the issue'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'html_url',
    type: ColumnType.TEXT,
    postfix: 'NOT NULL',
    comment: 'GitHub web URL for the issue'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'created_at',
    type: ColumnType.BIGINT,
    postfix: 'NOT NULL',
    comment: 'When the issue was created (unix timestamp)'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'updated_at',
    type: ColumnType.BIGINT,
    postfix: 'NOT NULL',
    comment: 'When the issue was last updated (unix timestamp)'
  });
  
  await hasura.defineColumn({
    schema: 'public',
    table: 'github_issues',
    name: 'closed_at',
    type: ColumnType.BIGINT,
    comment: 'When the issue was closed (unix timestamp)'
  });
  
  // Create index on github_id for fast lookups
  await hasura.sql(`
    CREATE INDEX IF NOT EXISTS idx_github_issues_github_id 
    ON public.github_issues (github_id);
  `);
  
  // Create index on repository for filtering
  await hasura.sql(`
    CREATE INDEX IF NOT EXISTS idx_github_issues_repository 
    ON public.github_issues (repository_owner, repository_name);
  `);
  
  // Create index on updated_at for sync operations
  await hasura.sql(`
    CREATE INDEX IF NOT EXISTS idx_github_issues_updated_at 
    ON public.github_issues (updated_at);
  `);
  
  debug('✅ GitHub issues SQL schema applied successfully');
}

export async function trackTables(hasura: Hasura) {
  debug('📊 Tracking GitHub issues tables...');
  
  await hasura.trackTable({
    schema: 'public',
    table: 'github_issues'
  });
  
  debug('✅ GitHub issues tables tracked successfully');
}

export async function applyPermissions(hasura: Hasura) {
  debug('🔐 Applying GitHub issues permissions...');
  
  // All roles have full read access to github_issues
  const roles = ['user', 'admin', 'anonymous'];
  
  for (const role of roles) {
    await hasura.definePermission({
      schema: 'public',
      table: 'github_issues',
      operation: 'select',
      role: role,
      filter: {},
      aggregate: true,
      columns: true
    });
  }
  
  // No write permissions for any role - data is managed by sync API only
  debug('✅ GitHub issues permissions applied successfully (read-only for all roles)');
}

export async function up(customHasura?: Hasura) {
  debug('🚀 Starting GitHub issues migration...');
  
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  
  try {
    await applySQLSchema(hasura);
    await trackTables(hasura);
    await applyPermissions(hasura);
    
    console.log('✅ GitHub issues migration completed successfully!');
  } catch (error) {
    console.error('❌ GitHub issues migration failed:', error);
    throw error;
  }
}

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
    postfix: 'UNIQUE',
    comment: 'GitHub issue ID from API (nullable for user-created issues)'
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
    postfix: '',
    comment: 'Issue number in repository (nullable for user-created issues)'
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
    name: '_user_id',
    type: ColumnType.UUID,
    comment: 'User ID who created/modified the issue (set by trigger)'
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

/**
 * Create trigger to automatically set _user_id
 */
export async function createUserTrigger(hasura: Hasura) {
  debug('🔧 Creating user trigger for github_issues...');
  
  // Create function to set user ID
  await hasura.sql(`
    CREATE OR REPLACE FUNCTION public.set_user_id_trigger()
    RETURNS TRIGGER AS $$
    DECLARE
      session_vars json;
      user_id text;
    BEGIN
      -- Get session variables from hasura.user
      session_vars := current_setting('hasura.user', true)::json;
      
      -- Extract user_id from session variables
      user_id := session_vars ->> 'x-hasura-user-id';
      
      -- If operation is performed by a user (has session variables), set _user_id
      IF user_id IS NOT NULL AND user_id != '' THEN
        NEW._user_id = user_id::uuid;
      ELSE
        -- If operation is performed by system (no user context), clear _user_id
        NEW._user_id = NULL;
      END IF;
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);
  
  // Create trigger
  await hasura.sql(`
    CREATE TRIGGER set_user_id_on_github_issues
      BEFORE INSERT OR UPDATE ON public.github_issues
      FOR EACH ROW
      EXECUTE FUNCTION public.set_user_id_trigger();
  `);
  
  debug('✅ User trigger created successfully');
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
  
  // Add INSERT permission for users with GitHub accounts
  await hasura.definePermission({
    schema: 'public',
    table: 'github_issues',
    operation: 'insert',
    role: 'user',
    filter: {
      // User must have a GitHub account
      _exists: {
        _table: { schema: 'public', name: 'accounts' },
        _where: {
          _and: [
            { user_id: { _eq: 'X-Hasura-User-Id' } },
            { provider: { _eq: 'github' } }
          ]
        }
      }
    },
    columns: [
      'github_id', 'node_id', 'number', 'title', 'body', 'state', 'state_reason',
      'locked', 'active_lock_reason', 'comments_count', 'author_association',
      'user_data', 'assignee_data', 'assignees_data', 'labels_data', 'milestone_data',
      'pull_request_data', 'closed_by_data', 'repository_owner', 'repository_name',
      'url', 'html_url', 'created_at', 'updated_at', 'closed_at'
    ],
  });
  
  debug('✅ GitHub issues permissions applied successfully (read for all, insert for users with GitHub accounts)');
}

export async function up(customHasura?: Hasura) {
  debug('🚀 Starting GitHub issues migration...');
  
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'http://localhost:8080/v1/graphql',
    secret: process.env.HASURA_ADMIN_SECRET || 'myadminsecretkey'
  });
  
  await applySQLSchema(hasura);
  await createUserTrigger(hasura);
  await trackTables(hasura);
  await applyPermissions(hasura);
  
  debug('✅ GitHub issues migration completed successfully!');
}
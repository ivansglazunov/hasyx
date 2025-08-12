# Hasura Client

Hasura Admin Client (`lib/hasura.ts`)

This document describes the `Hasura` class provided in `lib/hasura.ts`. This class offers a comprehensive TypeScript interface for managing your Hasura instance programmatically, including database schema operations, metadata management, and administrative tasks.

## Overview

The `Hasura` class provides methods for:
- **Schema Management**: Create, define, and delete database schemas
- **Table Operations**: Create, define, delete, track, and untrack tables
- **Column Management**: Add, modify, and remove table columns
- **Function Operations**: Create, define, and delete PostgreSQL functions
- **Trigger Management**: Create, define, and delete database triggers
- **Foreign Key Constraints**: Manage relationships between tables
- **View Operations**: Create, define, delete, track, and untrack database views
- **Relationship Management**: Define object and array relationships
- **Permission System**: Manage role-based access control
- **Event Triggers**: Set up webhook-based event handling
- **Computed Fields**: Add computed fields to tables
- **Remote Schemas**: Integrate external GraphQL schemas
- **Cron Triggers**: Schedule recurring tasks
- **Metadata Operations**: Export, import, and manage Hasura metadata
- **Raw SQL Execution**: Execute custom SQL queries

## One-off Scheduled Events

The Hasura client exposes helpers to manage one-off scheduled events via the Metadata API.

```ts
// Create a Hasura instance (admin context required)
const hasura = new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });

// Create (schedule) a one-off event
await hasura.defineOneOffEvent({
  webhook: 'https://your-app.com/api/events/one-off',
  scheduleAtIso: new Date(Date.now() + 60_000).toISOString(), // in 1 minute
  payload: { client_event_id: 'uuid', schedule_id: null },
  headers: [
    { name: 'X-Hasura-Event-Secret', value_from_env: 'HASURA_EVENT_SECRET' },
  ],
  retry_conf: { num_retries: 3, timeout_seconds: 60, retry_interval_seconds: 10 },
});

// Cancel a pending one-off event
await hasura.undefineOneOffEvent({ event_id: 'event-id-returned-by-hasura-or-found-in-hdb_catalog.hdb_scheduled_events' });
```

- Database verification tables (read-only):
  - `hdb_catalog.hdb_scheduled_events` — event state (`id`, `status`, `tries`, `next_retry_at`, `payload`, ...)
  - `hdb_catalog.hdb_scheduled_event_invocation_logs` — delivery logs (`event_id`, `request`, `response`, `status`, `created_at`)

- Typical verification:
  - Locate event by `payload ->> 'client_event_id'` in `hdb_catalog.hdb_scheduled_events` and check `status = 'delivered'` after scheduled time, or
  - Ensure at least one row exists in `hdb_catalog.hdb_scheduled_event_invocation_logs` for the `event_id` with a 200 response.

### Hasyx client convenience helper

The Hasyx client provides a convenience method to schedule a one-off to the current app webhook:

```ts
await hasyx.scheduleOneOff({
  scheduleAtEpochSec: Math.floor(Date.now() / 1000) + 60,
  payload: { client_event_id: 'uuid', schedule_id: null },
  // optional
  // webhookPath: '/api/events/one-off',
  // retry_conf: { num_retries: 3 },
});
```

This builds the webhook using base URL variables (`NEXT_PUBLIC_MAIN_URL`/`NEXT_PUBLIC_BASE_URL`) and passes `X-Hasura-Event-Secret` from env when available. These variables are auto-generated from `hasyx.config.json` via `npx hasyx config`. Do not edit `.env` manually; change settings through the configurator.

## Constructor

```typescript
const hasura = new Hasura({
  url: 'https://your-hasura-instance.hasura.app',
  secret: 'your-admin-secret'
});
```

### Options

- `url`: The base URL of your Hasura instance (without `/v1/graphql`)
- `secret`: Your Hasura admin secret for authentication

## Core Methods

### `sql(sql: string, source?: string, cascade?: boolean): Promise<any>`

Execute raw SQL queries against your database.

```typescript
// Simple query
const result = await hasura.sql('SELECT COUNT(*) FROM users');

// With cascade option for schema changes
await hasura.sql('DROP TABLE IF EXISTS old_table', 'default', true);

// Complex query with parameters
const stats = await hasura.sql(`
  SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as user_count
  FROM users 
  WHERE created_at >= NOW() - INTERVAL '7 days'
  GROUP BY DATE_TRUNC('day', created_at)
  ORDER BY date
`);
```

### `v1(request: { type: string; args: object }): Promise<any>`

Execute Hasura metadata API requests directly.

```typescript
// Track a table
await hasura.v1({
  type: 'pg_track_table',
  args: {
    source: 'default',
    schema: 'public',
    name: 'users'
  }
});

// Export metadata
const metadata = await hasura.v1({
  type: 'export_metadata',
  args: {}
});
```

## Schema Operations

### `createSchema(options: { schema: string }): Promise<any>`

Create a new database schema. Throws an error if the schema already exists.

```typescript
await hasura.createSchema({ schema: 'analytics' });
```

### `defineSchema(options: { schema: string }): Promise<any>`

Create a schema if it doesn't exist (idempotent operation).

```typescript
await hasura.defineSchema({ schema: 'analytics' });
```

### `deleteSchema(options: { schema: string; cascade?: boolean }): Promise<any>`

Delete a database schema and optionally cascade to dependent objects.

```typescript
// Delete schema with cascade (default)
await hasura.deleteSchema({ schema: 'analytics' });

// Delete schema without cascade
await hasura.deleteSchema({ schema: 'analytics', cascade: false });
```

### `schemas(): Promise<string[]>`

Get a list of all database schemas.

```typescript
const schemas = await hasura.schemas();
console.log(schemas); // ['public', 'analytics', 'reporting']
```

## Table Operations

### `createTable(options: CreateTableOptions): Promise<any>`

Create a new table with default columns. Throws an error if the table already exists.

```typescript
await hasura.createTable({
  schema: 'public',
  table: 'posts',
  id: 'id',           // ID column name (default: 'id')
  type: ColumnType.UUID // ID column type (default: UUID)
});
```

### `defineTable(options: CreateTableOptions): Promise<any>`

Create a table if it doesn't exist (idempotent operation).

```typescript
await hasura.defineTable({
  schema: 'public',
  table: 'posts'
});
```

### `deleteTable(options: DeleteTableOptions): Promise<any>`

Delete one or more tables.

```typescript
// Delete single table
await hasura.deleteTable({ schema: 'public', table: 'posts' });

// Delete multiple tables
await hasura.deleteTable({ 
  schema: 'public', 
  table: ['posts', 'comments', 'likes'] 
});
```

### `trackTable(options: TrackTableOptions): Promise<any>`

Track one or more tables in Hasura's GraphQL API.

```typescript
// Track single table
await hasura.trackTable({ schema: 'public', table: 'posts' });

// Track multiple tables
await hasura.trackTable({ 
  schema: 'public', 
  table: ['posts', 'comments'] 
});
```

### `untrackTable(options: TrackTableOptions): Promise<any>`

Untrack one or more tables from Hasura's GraphQL API.

```typescript
await hasura.untrackTable({ schema: 'public', table: 'posts' });
```

### `tables(options: { schema: string }): Promise<string[]>`

Get a list of all tables in a schema.

```typescript
const tables = await hasura.tables({ schema: 'public' });
console.log(tables); // ['users', 'posts', 'comments']
```

## Column Operations

### `defineColumn(options: DefineColumnOptions): Promise<any>`

Add or modify a column in a table.

```typescript
await hasura.defineColumn({
  schema: 'public',
  table: 'posts',
  name: 'title',
  type: ColumnType.TEXT,
  unique: false,
  comment: 'Post title'
});

// Add unique column
await hasura.defineColumn({
  schema: 'public',
  table: 'users',
  name: 'email',
  type: ColumnType.TEXT,
  unique: true,
  comment: 'User email address'
});
```

### `deleteColumn(options: DeleteColumnOptions): Promise<any>`

Remove a column from a table.

```typescript
await hasura.deleteColumn({
  schema: 'public',
  table: 'posts',
  name: 'old_column'
});
```

### `columns(options: { schema: string; table: string }): Promise<Record<string, ColumnInfo>>`

Get information about all columns in a table.

```typescript
const columns = await hasura.columns({ 
  schema: 'public', 
  table: 'users' 
});

console.log(columns);
// {
//   id: { type: 'uuid', _type: 'uuid' },
//   name: { type: 'text', _type: 'text' },
//   email: { type: 'text', _type: 'text' },
//   created_at: { type: 'bigint', _type: 'int8' }
// }
```

## Function Operations

### `createFunction(options: FunctionOptions): Promise<any>`

Create a new PostgreSQL function. Throws an error if the function already exists.

```typescript
await hasura.createFunction({
  schema: 'public',
  name: 'update_timestamp',
  definition: `()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = EXTRACT(EPOCH FROM NOW()) * 1000;
      RETURN NEW;
    END;
    $$`,
  language: 'plpgsql'
});
```

### `defineFunction(options: FunctionOptions): Promise<any>`

Create or replace a PostgreSQL function (idempotent operation).

```typescript
await hasura.defineFunction({
  schema: 'public',
  name: 'calculate_age',
  definition: `(birth_date DATE)
    RETURNS INTEGER AS $$
    BEGIN
      RETURN EXTRACT(YEAR FROM AGE(birth_date));
    END;
    $$`,
  language: 'plpgsql',
  replace: true
});
```

### `deleteFunction(options: { schema: string; name: string }): Promise<any>`

Delete a PostgreSQL function.

```typescript
await hasura.deleteFunction({
  schema: 'public',
  name: 'old_function'
});
```

## Trigger Operations

### `createTrigger(options: TriggerOptions): Promise<any>`

Create a new database trigger. Throws an error if the trigger already exists.

```typescript
await hasura.createTrigger({
  schema: 'public',
  table: 'posts',
  name: 'update_posts_timestamp',
  timing: 'BEFORE',
  event: 'UPDATE',
  function_name: 'public.update_timestamp'
});
```

### `defineTrigger(options: TriggerOptions): Promise<any>`

Create or replace a database trigger (idempotent operation).

```typescript
await hasura.defineTrigger({
  schema: 'public',
  table: 'users',
  name: 'audit_user_changes',
  timing: 'AFTER',
  event: 'INSERT OR UPDATE OR DELETE',
  function_name: 'public.audit_function',
  replace: true
});
```

### `deleteTrigger(options: { schema: string; table: string; name: string }): Promise<any>`

Delete a database trigger.

```typescript
await hasura.deleteTrigger({
  schema: 'public',
  table: 'posts',
  name: 'old_trigger'
});
```

## Foreign Key Operations

### `createForeignKey(options: ForeignKeyOptions): Promise<any>`

Create a new foreign key constraint. Throws an error if the constraint already exists.

```typescript
await hasura.createForeignKey({
  from: { schema: 'public', table: 'posts', column: 'author_id' },
  to: { schema: 'public', table: 'users', column: 'id' },
  on_delete: 'CASCADE',
  on_update: 'CASCADE',
  name: 'fk_posts_author'
});
```

### `defineForeignKey(options: ForeignKeyOptions): Promise<any>`

Create or replace a foreign key constraint (idempotent operation).

```typescript
await hasura.defineForeignKey({
  from: { schema: 'public', table: 'comments', column: 'post_id' },
  to: { schema: 'public', table: 'posts', column: 'id' },
  on_delete: 'CASCADE'
});
```

### `deleteForeignKey(options: { schema: string; table: string; name: string }): Promise<any>`

Delete a foreign key constraint.

```typescript
await hasura.deleteForeignKey({
  schema: 'public',
  table: 'posts',
  name: 'fk_posts_author'
});
```

## View Operations

### `createView(options: ViewOptions): Promise<any>`

Create a new database view. Throws an error if the view already exists.

```typescript
await hasura.createView({
  schema: 'public',
  name: 'active_users',
  definition: `
    SELECT id, name, email 
    FROM users 
    WHERE last_seen > NOW() - INTERVAL '30 days'
  `
});
```

### `defineView(options: ViewOptions): Promise<any>`

Create or replace a database view and track it in Hasura (idempotent operation).

```typescript
await hasura.defineView({
  schema: 'public',
  name: 'user_stats',
  definition: `
    SELECT 
      u.id,
      u.name,
      COUNT(p.id) as post_count,
      COUNT(c.id) as comment_count
    FROM users u
    LEFT JOIN posts p ON u.id = p.author_id
    LEFT JOIN comments c ON u.id = c.author_id
    GROUP BY u.id, u.name
  `
});
```

### `deleteView(options: { schema: string; name: string }): Promise<any>`

Delete a database view and untrack it from Hasura.

```typescript
await hasura.deleteView({
  schema: 'public',
  name: 'old_view'
});
```

## Relationship Operations

### `defineRelationship(options: DefineUniversalRelationshipOptions): Promise<any>`

Create or replace a relationship between tables (idempotent operation). This is the universal method that can handle both object and array relationships with various configuration options.

```typescript
// Object relationship using foreign key constraint
await hasura.defineRelationship({
  schema: 'public',
  table: 'posts',
  name: 'author',
  type: 'object',
  using: {
    foreign_key_constraint_on: 'author_id'
  }
});

// Array relationship using foreign key constraint
await hasura.defineRelationship({
  schema: 'public',
  table: 'users',
  name: 'posts',
  type: 'array',
  using: {
    foreign_key_constraint_on: {
      table: { schema: 'public', name: 'posts' },
      column: 'author_id'
    }
  }
});

// Manual relationship configuration
await hasura.defineRelationship({
  schema: 'public',
  table: 'posts',
  name: 'author',
  type: 'object',
  using: {
    manual_configuration: {
      remote_table: { schema: 'public', name: 'users' },
      column_mapping: { author_id: 'id' }
    }
  }
});
```

### `defineObjectRelationshipForeign(options: DefineRelationshipOptions): Promise<any>`

Create or replace an object relationship using a foreign key constraint (idempotent operation).

```typescript
await hasura.defineObjectRelationshipForeign({
  schema: 'public',
  table: 'posts',
  name: 'author',
  key: 'author_id'
});
```

### `defineArrayRelationshipForeign(options: DefineRelationshipOptions): Promise<any>`

Create or replace an array relationship using a foreign key constraint (idempotent operation).

```typescript
await hasura.defineArrayRelationshipForeign({
  schema: 'public',
  table: 'users',
  name: 'posts',
  key: 'posts.author_id'
});
```

### `deleteRelationship(options: DeleteRelationshipOptions): Promise<any>`

Delete a relationship from a table.

```typescript
await hasura.deleteRelationship({
  schema: 'public',
  table: 'posts',
  name: 'author'
});
```
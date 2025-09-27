## Options System

This document explains how the Options system works end-to-end, how it is configured from your project source (`schema.tsx`), how the database trigger validates data, and how to use it from the Hasyx client and tests.

> **📖 Related Documentation**: For hierarchical option inheritance through items, see [Items System & Option Inheritance](ITEMS.md)

### What the Options system is

- A single table (default `public.options`) to store key/value options scoped to a specific target entity via `item_id` and owned by a user (`user_id`).
- Keys and value types are defined centrally in your project source in `schema.tsx → export const options = { ... }` as Zod objects.
- At runtime, validation is performed by a database trigger that enforces:
  - Only allowed keys (those declared in `options[tableName]`) are accepted
  - Exactly one value column among `string_value`, `number_value`, `boolean_value`, `jsonb_value` must be set
  - `item_id` must reference an existing record in one of the declared `options[tableName]` tables; the trigger auto-detects which table it belongs to
  - **Multiple options**: Respects `meta.multiple` - prevents duplicates by default, allows multiple entries when `multiple: true`
  - **Reference validation**: Validates UUIDs against specified tables when `meta.tables` is defined
  - **Permission rules**: Enforces optional `meta.permission` rules (exported to JSON Schema under `x-meta.permission`) via a database trigger

### Authoritative source: `schema.tsx`

Define allowed option keys per target table:

```ts
import { z } from 'zod';

export const options = {
  users: z.object({
    fio: z.string().min(1).max(200).optional(),
    displayName: z.string().min(1).max(100).optional(),
    timezone: z.string().min(1).max(50).optional(),
    // File reference with table validation
    avatar: z
      .string()
      .uuid()
      .describe('User avatar file id (uuid from storage.files)')
      .meta({ widget: 'file-id', tables: ['storage.files'] })
      .optional(),
    // Multiple references with table validation
    friend_id: z
      .string()
      .uuid()
      .describe('Friend user id (uuid from public.users)')
      .meta({ multiple: true, tables: ['users'] })
      .optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      sms: z.boolean().optional(),
    }).partial().optional(),
  }),
  // Options for items table (item_id = items.id)
  items: z.object({
    // User ownership assignment for items
    user_id: z.string().uuid().meta({ tables: ['users'] }),
    // Geo-references to features (marker/route/zone) in single table
    mark_id: z.string().uuid().meta({ tables: ['geo.features'] }),
    route_id: z.string().uuid().meta({ tables: ['geo.features'] }),
    zone_id: z.string().uuid().meta({ tables: ['geo.features'] }),
  }),
} as const;
```

You can add more tables and their option keys by adding more top-level keys to `options` (e.g., `projects`, `teams`, etc.).

### Database shape (created by migration)

`public.options` columns:

- `id uuid primary key`
- `key text not null`
- `user_id uuid not null` (auto-set from Hasura session if not provided)
- `item_id uuid not null` (the target entity id; must exist in one of the tables defined in `schema.tsx -> options`)
- `string_value text`
- `number_value numeric`
- `boolean_value boolean`
- `jsonb_value jsonb`
- `to_id uuid` (optional, unified reference column for UUID-based options with `meta.tables`)

Constraints and indexes:

- **No unique constraints** - multiple options with the same `(key, item_id)` are allowed when `meta.multiple: true` is set

Relationships:

- `options.to` (object relationship: `options.to_id -> hasyx.id_uuid`) - provides access to the referenced entity through the unified `hasyx` view
- `options.item` (object relationship: `options.item_id -> items.id`) - nullable, only for options targeting items table

Permissions (by default):

- Role `anonymous`: select all options
- Role `user`: 
  - **select**: read all options (no filter)
  - **insert**: can only create options where `item_id = X-Hasura-User-Id`
  - **update**: can only modify options where `item_id = X-Hasura-User-Id`
  - **delete**: can only delete options where `item_id = X-Hasura-User-Id`

### Validation trigger (dynamic schema detection)

The migration defines a plpgsql trigger function `public.options_validate` that runs on `BEFORE INSERT OR UPDATE`:

- Ensures exactly one of the value columns is set
- Ensures `key` is not empty
- Requires `item_id`
- **Multiple options support**: Checks `meta.multiple` from schema - if `false` (default), prevents duplicate `(key, item_id)` pairs; if `true`, allows multiple entries
- **Reference validation**: Checks `meta.tables` from schema - validates that `to_id` exists in one of the specified tables
- Dynamically determines the target table for `item_id` by scanning all `options[tableName]` declared in `schema.tsx` and checking the appropriate table for existence
- Builds a JSON value from the chosen column and validates it (if validation runtime is installed) against `validation.project_schemas()` at path `options.<tableName>.properties.<key>`. When `to_id` is used, it is validated as a UUID string (compatible with `z.string().uuid()` in `schema.tsx`).
  
If present, permission rules are enforced by an additional trigger using `validation.validate_option_permission()` (see Permission rules below).

The trigger relies on the plv8 validation runtime to be synchronized via the CLI (`validation sync/define`). If the runtime is not present, it still enforces key existence with `validation.validate_option_key` and the “one-of” value rule.

### Keeping validation in sync

After changing `schema.tsx → options`, run:

```bash
# Sync Zod → JSON Schema into plv8 function validation.project_schemas()
npm run cli -- validation sync

# Or ensure + apply column/table rules from hasyx.config.json
npm run validate
```

Notes:

- The project uses Zod 4 to generate JSON Schema at build/sync time and embeds it into `validation.project_schemas()`.
- During generation, Zod `.meta()` keys that are not part of JSON Schema are moved into `x-meta` to keep the schema valid. Known keys: `multiple`, `tables`, `permission`, `widget`.
- A diagnostic snapshot may be written to `schema.json` at the project root for inspection/debugging (optional; not required at runtime).

### Permission rules (x-meta.permission)

You can attach row-level permission checks to specific option keys via Zod `.meta({ permission: { ... } })`. These rules are exported into JSON Schema under `x-meta.permission` and enforced by the PLV8 trigger `validation.validate_option_permission()`.

- Attach rules under the operation you want to guard: `insert`, `update`, `delete`.
- Each rule can specify:
  - `table` (defaults to `options` if omitted)
  - `where`: a GraphQL-like filter object
  - `limit` (defaults to `1`)

The `where` object supports placeholders that are substituted at runtime:

- `${USER_ID}` or `'X-Hasura-User-Id'`: current user id from Hasura session
- `${OPTION_ID}`: the current option id (only for update/delete when available)
- `${ITEM_ID}`: `NEW.item_id`
- `${TO_ID}`: `NEW.to_id`

Example (from `options.users.friend_id`) — require that the referenced friend already has a `fio` option:

```ts
friend_id: z.string().uuid().meta({
  multiple: true,
  tables: ['users'],
  permission: {
    insert: {
      table: 'options',
      where: { key: { _eq: 'fio' }, item_id: { _eq: '${TO_ID}' } },
      limit: 1,
    },
  },
})
```

To enable permission enforcement, ensure this trigger exists (migration or setup):

```sql
DROP TRIGGER IF EXISTS options_permission_trigger ON public.options;
CREATE TRIGGER options_permission_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON public.options
  FOR EACH ROW
  EXECUTE FUNCTION validation.validate_option_permission();
```

The PLV8 function reads rules from `validation.project_schemas()` at paths like:

- `options.users.properties.friend_id.x-meta.permission.insert`

If no permission is defined for a key/operation, the check is skipped.

### Using from Hasyx client

Insert an option for a specific user target:

```typescript
const inserted = await hasyx.insert({
  table: 'options',
  objects: [{
    key: 'displayName',
    item_id: targetUser.id,
    string_value: 'Alice',
  }],
  returning: ['id', 'key', 'string_value', 'user_id', 'item_id']
});
```

Insert an avatar file reference (users.avatar with table validation):

```typescript
const inserted = await hasyx.insert({
  table: 'options',
  objects: [{
    key: 'avatar',
    item_id: targetUser.id,
    to_id: someFileId, // uuid from storage.files.id - validated against storage.files table
  }],
  returning: ['id', 'key', 'to_id', 'user_id', 'item_id']
});
```

Insert multiple friend references (users.friend_id with multiple: true):

```typescript
// First friend
const friend1 = await hasyx.insert({
  table: 'options',
  objects: [{
    key: 'friend_id',
    item_id: targetUser.id,
    to_id: friend1UserId, // uuid validated against users table
  }],
  returning: ['id', 'key', 'to_id', 'user_id', 'item_id']
});

// Second friend (allowed because friend_id has meta.multiple: true)
const friend2 = await hasyx.insert({
  table: 'options',
  objects: [{
    key: 'friend_id',
    item_id: targetUser.id,
    to_id: friend2UserId, // uuid validated against users table
  }],
  returning: ['id', 'key', 'to_id', 'user_id', 'item_id']
});
```

Insert options for items (items.user_id with table validation):

```typescript
const inserted = await hasyx.insert({
  table: 'options',
  objects: [{
    key: 'user_id',
    item_id: targetItem.id, // references items.id
    to_id: ownerUserId, // uuid validated against users table
  }],
  returning: ['id', 'key', 'to_id', 'user_id', 'item_id']
});
```

Query options for that target:

```typescript
const rows = await hasyx.select({
  table: 'options',
  where: { key: { _eq: 'displayName' }, item_id: { _eq: targetUser.id } },
  returning: ['key', 'string_value', 'item_id']
});
```

Invalid keys or keys not present under the detected `options[tableName]` will be rejected by the trigger.

### Tests

- See `lib/options.test.ts` for end-to-end tests using only the Hasyx API.
- Each test creates and cleans up its own data (no before/after hooks), and uses real DB triggers (no mocks).

### Migrations

- `lib/options/up-options.ts` creates the table, triggers, and functions.
- `lib/options/down-options.ts` removes them (dropping the table also removes triggers).
- **Permissions** are defined directly in `migrations/.../up.ts` and `migrations/.../down.ts` to ensure strict access control during migration.

To apply just this migration set in development:

```bash
DEBUG="hasyx*" npm run unmigrate options
DEBUG="hasyx*" npm run migrate options
```

### FAQ

- Q: Do I need `schema.json` in the repository?
  - A: No. It is an optional artifact for debugging or CI snapshots. Runtime validation reads from `validation.project_schemas()` in the database.
- Q: How do I add options for a new table?
  - A: Add a new key under `export const options` in `schema.tsx`, run `npm run validate` to sync, and the trigger will automatically validate against the new table via `item_id`.
- Q: How do I allow multiple options with the same key for one item?
  - A: Add `.meta({ multiple: true })` to your Zod schema definition. For example: `friend_id: z.string().uuid().meta({ multiple: true, tables: ['users'] })`.
- Q: How do I validate that a UUID option references an existing record?
  - A: Use `.meta({ tables: ['table_name'] })` in your Zod schema. The trigger will verify that the UUID exists in one of the specified tables. Supports `schema.table` format like `['storage.files']`. The UUID value should be stored in `to_id` column, not in value columns.
- Q: Can users read options created by other users?
  - A: Yes, by default users can **read** all options (no filter), but can only **create/modify/delete** options where `item_id` matches their own user ID (`X-Hasura-User-Id`).
- Q: What happens if I try to create duplicate options for a non-multiple key?
  - A: The trigger will reject the insert/update with an error message about duplicate options for that `(key, item_id)` combination.

## Options vs Items Inheritance

The Options system provides direct key-value storage for entities, while the Items system adds **hierarchical inheritance** capabilities:

### Direct Options Usage
- **Purpose**: Store options directly on specific entities
- **Query**: `SELECT * FROM options WHERE item_id = 'entity-123'`
- **Scope**: Only options attached to that specific entity
- **Use Case**: Entity-specific configuration, user preferences, metadata

### Items Inheritance Usage
- **Purpose**: Store options with automatic parent-child inheritance
- **Query**: `SELECT * FROM item_options WHERE item_id = 'entity-123'`
- **Scope**: Options from entity + all its parents in hierarchy
- **Use Case**: Cascading configuration, permission inheritance, organizational structure

### When to Choose Each

**Use Direct Options** when:
- Options are specific to individual entities
- No inheritance or hierarchy needed
- Simple key-value storage requirements

**Use Items Inheritance** when:
- You have hierarchical data structures
- Configuration should cascade from parents to children
- Override behavior is needed (child can override parent)
- Audit trail of option sources is important

**📖 Learn More**: See [Items System & Option Inheritance](ITEMS.md) for detailed documentation on hierarchical option inheritance.



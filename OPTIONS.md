## Options System

This document explains how the Options system works end-to-end, how it is configured from your project source (`schema.tsx`), how the database trigger validates data, and how to use it from the Hasyx client and tests.

### What the Options system is

- A single table (default `public.options`) to store key/value options scoped to a specific target entity via `item_id` and owned by a user (`user_id`).
- Keys and value types are defined centrally in your project source in `schema.tsx → export const options = { ... }` as Zod objects.
- At runtime, validation is performed by a database trigger that enforces:
  - Only allowed keys (those declared in `options[tableName]`) are accepted
  - Exactly one value column among `string_value`, `number_value`, `boolean_value`, `jsonb_value` must be set
  - `item_id` must reference an existing record in one of the declared `options[tableName]` tables; the trigger auto-detects which table it belongs to

### Authoritative source: `schema.tsx`

Define allowed option keys per target table:

```ts
import { z } from 'zod';

export const options = {
  users: z.object({
    fio: z.string().min(1).max(200),
    displayName: z.string().min(1).max(100),
    timezone: z.string().min(1).max(50),
    notifications: z.object({
      email: z.boolean(),
      push: z.boolean(),
      sms: z.boolean(),
    }),
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
- `file_id uuid` (optional, reference to `storage.files.id` when present)

Constraints and indexes:

- Unique index on `(key, user_id, COALESCE(item_id, '00000000-0000-0000-0000-000000000000'))`

Permissions (by default):

- Role `anonymous`: select all
- Role `user`: full CRUD with row filter `user_id = X-Hasura-User-Id`

### Validation trigger (dynamic schema detection)

The migration defines a plpgsql trigger function `public.options_validate` that runs on `BEFORE INSERT OR UPDATE`:

- Ensures exactly one of the value columns is set
- Ensures `key` is not empty
- Requires `item_id`
- Dynamically determines the target table for `item_id` by scanning all `options[tableName]` declared in `schema.tsx` and checking `public.<tableName>(id)` for existence
- Builds a JSON value from the chosen column and validates it (if validation runtime is installed) against `validation.project_schemas()` at path `options.<tableName>.properties.<key>`. When `file_id` is used, it is validated as a UUID string (compatible with `z.string().uuid()` in `schema.tsx`).

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
- A diagnostic snapshot may be written to `schema.json` at the project root for inspection/debugging (optional; not required at runtime).

### Using from Hasyx client

Insert an option for a specific user target:

```ts
const inserted = await userClient.insert({
  table: 'options',
  object: {
    key: 'displayName',
    item_id: targetUser.id,
    string_value: 'Alice',
  },
  returning: ['id', 'key', 'string_value', 'user_id', 'item_id']
});
```

Insert an avatar file reference (users.avatar):

```ts
const inserted = await userClient.insert({
  table: 'options',
  object: {
    key: 'avatar',
    item_id: targetUser.id,
    file_id: someFileId, // uuid from storage.files.id
  },
  returning: ['id', 'key', 'file_id', 'user_id', 'item_id']
});
```

Query options for that target:

```ts
const rows = await userClient.select({
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

- `lib/options/up-options.ts` creates the table, triggers, functions, permissions, and unique index.
- `lib/options/down-options.ts` removes them (dropping the table also removes the index/trigger).

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



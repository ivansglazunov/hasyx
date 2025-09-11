## Validation with plv8 + Zod (database-level)

This document explains how Hasyx applies validation at the database level using PostgreSQL plv8 functions and Zod schemas from your project.

### Overview

- Zod 4 schemas defined in your project are converted to JSON Schema using Zod's built-in JSON Schema generation.
- The resulting JSON is embedded into a plv8 function `validation.project_schemas()` that returns a JSON object (authoritative at runtime).
- plv8 functions validate values before insert/update via triggers.
- You can bind validation to:
  - a specific column of a table; or
  - a whole table (e.g., an options view) using a Zod object: keys defined in that object become the only allowed `key` values.

### Where schemas come from

Schemas are collected from two places:
- `schema.tsx` exported object `schema` (e.g., `schema.email = z.object({ ... })`)
- Zod schemas defined in `lib/config.tsx` under `hasyxConfig` top-level keys

The tool generates JSON with shape:
```
{ schema: { ...from schema.tsx... }, config: { ...from lib/config.tsx... } }
```

### Commands

Use the CLI group `validation`:
- `npx hasyx validation sync` — generate JSON Schema from Zod and update plv8 function `validation.project_schemas()`.
- `npx hasyx validation define` — apply validation rules from `hasyx.config.json` (ensures sync first).
- `npx hasyx validation undefine` — remove all hasyx-managed validation triggers.

You can also wire your package.json:
```json
{
  "scripts": {
    "validate": "npx hasyx validation define"
  }
}
```

### Configuring validation rules

There are two supported formats in `hasyx.config.json`:
1) Top-level array `validation` (legacy/explicit):
```json
{
  "validation": [
    { "schema": "public", "table": "users", "column": "email", "validate": "schema.email", "schemaSet": "project" }
  ]
}
```

2) Interactive UI map `validationRules` (preferred for the UI):
```json
{
  "validationRules": {
    "user-email": { "schema": "public", "table": "users", "column": "email", "validate": "schema.email" },
    "options-table": { "schema": "public", "table": "options", "validate": "schema.optionsProfile" }
  }
}
```

- When `column` is provided, a per-column trigger is created that validates NEW[column] against the JSON Schema located at `validate` path.
- When `column` is omitted and you target the Options table, rely on the built-in Options trigger (see OPTIONS.md). It validates keys against `options.<table>` and values via `validation.validate_json`.

### Options table validation (built-in)

The Options system uses a dedicated plpgsql trigger to:

- Determine which table an `item_id` belongs to by scanning the `options` section of `schema.tsx`
- Enforce that `key` exists under `options.<table>.properties`
- Validate the provided value against `options.<table>.properties.<key>` using `validation.validate_json`

No explicit `validationRules` binding is required for options; the trigger uses `validation.project_schemas()` at runtime. See `OPTIONS.md` for details.

### How to write Zod objects for options

In `schema.tsx`:
```ts
import { z } from 'zod';

export const options = {
  users: z.object({
    fio: z.string().min(1).max(200),
    displayName: z.string().min(1).max(100),
    timezone: z.string().min(1).max(50),
    notifications: z.object({ email: z.boolean(), push: z.boolean(), sms: z.boolean() })
  })
} as const;
```

Only keys declared under `options.users` are accepted for `item_id` that belongs to `public.users`.

### Internals: plv8 functions and triggers

- `validation.project_schemas()` — returns a JSON object with merged Zod-derived schemas (from `schema.tsx` and config).
- `validation.validate_json(value, path, set)` — validates a JSONB value against the JSON Schema located by `path` in `project_schemas()` (set parameter is reserved; use `'project'`).
- `validation.validate_column()` — trigger function for per-column validation (created on the specified table/column).
- `validation.validate_option_key(option_key, schema_path)` — checks that the option key exists under the JSON Schema object's `properties` at `schema_path` (e.g., `options.users`).

Optional artifact: a diagnostic snapshot `schema.json` may be written in the project root during sync for inspection. It is not required at runtime.

### Permissions and behavior

Validation is enforced by triggers at the DB level and does not depend on API layer or client code. Any insert/update attempts that violate the schema will raise an error.

### Troubleshooting

- If you see errors like `project_schemas() not found`, ensure you ran `npx hasyx validation sync`.
- If you change Zod schemas, re-run `sync` before `define` to update `project_schemas()`.
- If you need to reset rules, use `npx hasyx validation undefine` and then `define` again.




## Validation with plv8 + Zod (database-level)

This document explains how Hasyx applies validation at the database level using PostgreSQL plv8 functions and Zod schemas from your project.

### Overview

- Zod schemas defined in your project are converted to JSON Schema via `zod-to-json-schema`.
- The resulting JSON is stored in your database under the `validation.schemas` table (jsonb).
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
- `npx hasyx validation sync` — generate JSON schemas and sync to DB (table `validation.schemas`, key `project`).
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
- When `column` is omitted, it creates a table-level binding in `validation.table_bindings` and enables an option-key validator for view-based options (see below).

### Table-level validation for options view

When you bind a Zod object to a whole table (e.g., the options view), Hasyx stores the mapping in `validation.table_bindings` and uses plv8 function `validation.validate_option_key(view_schema, view_table, key)` to ensure that `key` exists in the object’s `properties`.

This means only keys declared in your Zod object are allowed.

You typically bind the object like this:
```json
{
  "validationRules": {
    "options-profile": { "schema": "public", "table": "options", "validate": "schema.optionsProfile" }
  }
}
```

### How to write Zod objects for options

In `schema.tsx`:
```ts
import { z } from 'zod';

export const schema = {
  optionsProfile: z.object({
    theme: z.enum(['light', 'dark']),
    itemsPerPage: z.number().int().min(1).max(100),
    welcomeText: z.string().min(1).max(200)
  })
};
```

With the table-level binding to your options view, only `theme`, `itemsPerPage`, and `welcomeText` keys will be accepted.

### Internals: plv8 functions and triggers

- `validation.validate_json(value, path, set)` — validates a JSONB value against the JSON Schema located by path in the specified set (default `project`).
- `validation.validate_column()` — trigger function for per-column validation (created on the specified table/column).
- `validation.validate_option_key(view_schema, view_table, key)` — checks the options view binding; errors if key not in bound object properties.

The JSON schemas are stored in `validation.schemas` rows keyed by name (default: `project`).
Table-level bindings are stored in `validation.table_bindings` with `(schema, table_name)` as primary key.

### Permissions and behavior

Validation is enforced by triggers at the DB level and does not depend on API layer or client code. Any insert/update attempts that violate the schema will raise an error.

### Troubleshooting

- If you see errors like `Validation schemas not found`, ensure you ran `npx hasyx validation sync`.
- If you change Zod schemas, re-run `sync` before `define`.
- If you need to reset rules, use `npx hasyx validation undefine` and then `define` again.




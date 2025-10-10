import { z } from 'zod';

// Export all validation schemas as a single object
export const schema = {
  // Email validation schema
  email: z.object({
    email: z.string().email('Please enter a valid email address'),
  }),
} as const;

// Prepared brain options.
export const _brainEnything = {
  // Acts as registry of Brain participants (multiple allowed for different brain instances)
  brain: z.string().min(1).max(200).describe('Brain participant identifier').meta({ multiple: true, BrainComponent: 'DefaultBrainComponent' }),
  // Standalone brain nodes (not attached to specific items)
  brain_string: z.string().describe('Concrete string for Brain node').meta({ multiple: true, BrainComponent: 'BrainStringComponent' }),
  brain_number: z.number().describe('Concrete number for Brain node').meta({ multiple: true, BrainComponent: 'BrainNumberComponent' }),
  brain_object: z.object({}).passthrough().describe('Concrete object for Brain node').meta({ multiple: true, BrainComponent: 'BrainObjectComponent' }),
  brain_query: z
    .object({})
    .passthrough()
    .describe('Bool_exp query with ${VAR} and ${VAR_id} substitutions from own brain_prop_id names')
    .meta({ multiple: true, BrainComponent: 'BrainQueryComponent' }),
  brain_formula: z.string().min(1).describe('Formula to compute value into brain_string').meta({ 
    multiple: true, 
    BrainComponent: 'BrainFormulaComponent'
  }),
  brain_ask: z.string().min(1).describe('Prompt to compute value into brain_string').meta({ multiple: true, BrainComponent: 'BrainAskComponent' }),
  brain_js: z.string().min(1).describe('JavaScript code to execute; stdout -> brain_string; result -> brain_object').meta({ multiple: true, BrainComponent: 'BrainJSComponent' }),
};
export const _brainAny = {
  brain_name: z
    .string()
    .min(1)
    .max(200)
    .describe('Name of brain node')
    .meta({ BrainComponent: 'DefaultBrainComponent' }),
  // Brain computation/reference options (require item_id to attach to specific entities)
  brain_prop_id: z
    .string()
    .uuid()
    .meta({ tables: ['options'], multiple: true, BrainComponent: 'DefaultBrainComponent' })
    .describe('External dependency pointer to options (can be multiple)'),
};

// Options system for tables
// Structure: options.tableName.optionKey
//
// How to use (developer-facing):
// - Define per-table option keys using Zod under options.{table}.
// - For references to other entities, use z.string().uuid() with meta({ tables: [...] }) and
//   provide the value via to_id when inserting.
// - If a key can repeat for the same item, set meta({ multiple: true }); otherwise duplicates are rejected.
// - To require extra conditions on create/update/delete, add meta({ permission: { insert|update|delete: { table?, where, limit? } } }).
//   Placeholders in where are substituted at runtime: ${USER_ID}, ${OPTION_ID}, ${ITEM_ID}, ${TO_ID}, or 'X-Hasura-User-Id'.
// - All checks are performed transactionally on insert/update/delete; no client-side checks are required.
// - After schema changes, sync validation into DB (see OPTIONS.md → Keeping validation in sync).
//
// Extending the system:
// - Add a new top-level object (e.g. options.projects, options.teams) with z.object({...}).
// - Add option keys with Zod types. For UUID references use meta.tables and set to_id when inserting.
// - Use .describe(...) for human-readable descriptions and meta.widget for UI hints when needed.
export const options = {
  // Options for users table (item_id = user.id)
  users: z.object({
    fio: z.string().min(1).max(200).optional(),
    displayName: z.string().min(1).max(100).optional(),
    timezone: z.string().min(1).max(50).optional(),
    // Reference to avatar file (uuid from storage.files)
    avatar: z
      .string()
      .uuid()
      .describe('User avatar file id (uuid from storage.files)')
      .meta({ widget: 'file-id', tables: ['storage.files'] })
      .optional(),
    // Multiple references to friends (uuid from users)
    friend_id: z
      .string()
      .uuid()
      .describe('Friend user id (uuid from public.users)')
      .meta({
        multiple: true,
        tables: ['users'],
        // Permissions for options.users.friend_id
        // insert: require that the referenced friend (to_id) has an option with key 'fio'
        // Placeholders available here include ${TO_ID}, ${ITEM_ID}, ${USER_ID}.
        // In this example ${TO_ID} refers to the referenced id (to_id).
        permission: {
          insert: {
            table: 'options',
            where: {
              key: { _eq: 'fio' },
              item_id: { _eq: '${TO_ID}' }
            },
            returning: ['id'],
            limit: 1
          }
        }
      })
      .optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      sms: z.boolean().optional(),
    }).partial().optional(),
  }),
  // Options for items table (item_id = items.id)
  items: z.object({
    // Initial user binding to item
    user_id: z.string().uuid().meta({ tables: ['users'] }),
    // Bindings to geo.features (marker/route/zone) in one table
    mark_id: z.string().uuid().meta({ tables: ['geo.features'] }),
    route_id: z.string().uuid().meta({ tables: ['geo.features'] }),
    zone_id: z.string().uuid().meta({ tables: ['geo.features'] }),
    // Title field example
    title: z.string().min(1).max(500).optional(),
  }),
  // Options can reference other options (e.g. brain_formula -> brain_string)
  options: z.object({
    // Only brain_string can reference other options as item_id
    brain_string: z.string().describe('Result of brain_formula or brain_ask computation').meta({ multiple: true }),
  }),
  // Global options (no item_id required): aliased to options.__empty
  "": z.object(_brainEnything),
  // Wildcard options for any target table: aliased to options.__any
  "*": z.object({
    ..._brainEnything,
    ..._brainAny,
  }),
} as const;

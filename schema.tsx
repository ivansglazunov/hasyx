import { z } from 'zod';

// Export all validation schemas as a single object
export const schema = {
  // Email validation schema
  email: z.object({
    email: z.string().email('Please enter a valid email address'),
  }),
} as const;

// Options system for tables
// Structure: options.tableName.optionKey
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
    // Add title field to reproduce PLV8 bug with arrays
    title: z.string().min(1).max(500).optional(),
  }),
} as const;

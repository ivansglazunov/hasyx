"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.schema = void 0;
const zod_1 = require("zod");
// Export all validation schemas as a single object
exports.schema = {
    // Email validation schema
    email: zod_1.z.object({
        email: zod_1.z.string().email('Please enter a valid email address'),
    }),
};
// Options system for tables
// Structure: options.tableName.optionKey
exports.options = {
    // Options for users table (item_id = user.id)
    users: zod_1.z.object({
        fio: zod_1.z.string().min(1).max(200).optional(),
        displayName: zod_1.z.string().min(1).max(100).optional(),
        timezone: zod_1.z.string().min(1).max(50).optional(),
        // Reference to avatar file (uuid from storage.files)
        avatar: zod_1.z
            .string()
            .uuid()
            .describe('User avatar file id (uuid from storage.files)')
            .meta({ widget: 'file-id', tables: ['storage.files'] })
            .optional(),
        // Multiple references to friends (uuid from users)
        friend_id: zod_1.z
            .string()
            .uuid()
            .describe('Friend user id (uuid from public.users)')
            .meta({ multiple: true, tables: ['users'] })
            .optional(),
        notifications: zod_1.z.object({
            email: zod_1.z.boolean().optional(),
            push: zod_1.z.boolean().optional(),
            sms: zod_1.z.boolean().optional(),
        }).partial().optional(),
    }),
    // Options for items table (item_id = items.id)
    items: zod_1.z.object({
        // Initial user binding to item
        user_id: zod_1.z.string().uuid().meta({ tables: ['users'] }),
        // Bindings to geo.features (marker/route/zone) in one table
        mark_id: zod_1.z.string().uuid().meta({ tables: ['geo.features'] }),
        route_id: zod_1.z.string().uuid().meta({ tables: ['geo.features'] }),
        zone_id: zod_1.z.string().uuid().meta({ tables: ['geo.features'] }),
        // Add title field to reproduce PLV8 bug with arrays
        title: zod_1.z.string().min(1).max(500).optional(),
    }),
};

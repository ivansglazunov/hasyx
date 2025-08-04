"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const zod_1 = require("zod");
// Export all validation schemas as a single object
exports.schema = {
    // Email validation schema
    email: zod_1.z.object({
        email: zod_1.z.string().email('Please enter a valid email address'),
    }),
};

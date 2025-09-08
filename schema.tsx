import { z } from 'zod';

// Export all validation schemas as a single object
export const schema = {
  // Email validation schema
  email: z.object({
    email: z.string().email('Please enter a valid email address'),
  }),
  // Options validation for table-level binding (example)
  optionsProfile: z.object({
    theme: z.enum(['light', 'dark']),
    itemsPerPage: z.number().int().min(1).max(100),
    welcomeText: z.string().min(1).max(200).optional(),
  })
} as const;

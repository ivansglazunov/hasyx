import { z } from 'zod';

// Email validation schema
export const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Export type for TypeScript
export type EmailFormData = z.infer<typeof emailSchema>;

// Export validation function
export const validateEmail = (data: unknown): EmailFormData => {
  return emailSchema.parse(data);
};

// Export safe validation function (returns success/error instead of throwing)
export const safeValidateEmail = (data: unknown): { success: true; data: EmailFormData } | { success: false; error: string } => {
  try {
    const result = emailSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Validation failed' };
    }
    return { success: false, error: 'Unknown validation error' };
  }
};

// Export all validation schemas as a single object
export const validationSchemas = {
  email: emailSchema,
} as const;

// Export all validation functions as a single object
export const validationFunctions = {
  email: validateEmail,
  safeEmail: safeValidateEmail,
} as const;

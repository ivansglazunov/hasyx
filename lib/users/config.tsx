import { z } from 'zod';

export const ENV_ENABLED_NAME = 'NEXT_PUBLIC_NEXTAUTH_ENABLED';

export const nextAuthSecretsSchema = z.object({
  secret: z
    .string()
    .min(1, 'Please enter a valid NextAuth Secret')
    .describe('NextAuth Secret - Generate a 32-byte hex string for session encryption'),
  url: z
    .string()
    .url('Please enter a valid NextAuth URL')
    .optional()
    .describe('NextAuth URL - Base app URL used to build OAuth callbacks, e.g. http://localhost:3004'),
}).meta({
  type: 'nextauth-config',
  title: 'NextAuth Configuration',
  description: 'NEXTAUTH_SECRET secures session cookies. Generate a 32-byte hex, e.g.: openssl rand -hex 32. Store securely.\nNEXTAUTH_URL defines the base URL used by NextAuth (must match your dev/prod domain and port).',
  envMapping: {
    secret: 'NEXTAUTH_SECRET',
    url: 'NEXTAUTH_URL'
  },
  envEnabledName: ENV_ENABLED_NAME,
});

export function isEnabled(resolvedVariantConfig: any): boolean {
  const cfg = resolvedVariantConfig?.nextAuthSecrets;
  if (!cfg) return false;
  return Boolean(cfg.secret);
}

// Variant registration (reference selector) for NextAuth in variant editor
export const nextAuthVariantSelector = z.string().optional().meta({
  type: 'reference-selector',
  data: 'nextAuthSecrets',
  referenceKey: 'nextAuthSecrets',
  title: 'NextAuth Secrets',
  description: 'Select a NextAuth secrets configuration (optional)',
  emptyMessage: 'No NextAuth secrets available. Create NextAuth secrets first.',
  backLabel: '< back',
  descriptionTemplate: (_data: any) => 'NEXTAUTH_SECRET'
});

export const nextAuthSecretsList = z.record(
  z.string(),
  nextAuthSecretsSchema,
).meta({
  data: 'nextAuthSecrets',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: nextAuthSecretsSchema,
  descriptionTemplate: (_data: any) => 'NextAuth Secrets'
});



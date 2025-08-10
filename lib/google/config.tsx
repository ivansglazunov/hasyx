import { z } from 'zod';

export const ENV_ENABLED_NAME = 'NEXT_PUBLIC_GOOGLE_AUTH_ENABLED';

export const googleOAuthSchema = z.object({
  clientId: z
    .string()
    .describe('Google Client ID (GOOGLE_CLIENT_ID). Create OAuth credentials at console.developers.google.com.'),
  clientSecret: z
    .string()
    .describe('Google Client Secret (GOOGLE_CLIENT_SECRET). Copy from your OAuth client.'),
}).meta({
  type: 'google-oauth-config',
  title: 'Google OAuth Configuration',
  description: 'Configure Google OAuth provider',
  envMapping: {
    clientId: 'GOOGLE_CLIENT_ID',
    clientSecret: 'GOOGLE_CLIENT_SECRET'
  },
  envEnabledName: ENV_ENABLED_NAME,
});

export function isEnabled(resolvedVariantConfig: any): boolean {
  const cfg = resolvedVariantConfig?.googleOAuth;
  if (!cfg) return false;
  return Boolean(cfg.clientId && cfg.clientSecret);
}

export const googleOAuths = z.record(
  z.string(),
  googleOAuthSchema,
).meta({
  data: 'googleOAuth',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: googleOAuthSchema,
  descriptionTemplate: (data: any) => data?.clientId || 'no client id'
});



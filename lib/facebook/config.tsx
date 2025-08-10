import { z } from 'zod';

export const ENV_ENABLED_NAME = 'NEXT_PUBLIC_FACEBOOK_AUTH_ENABLED';

export const facebookOAuthSchema = z.object({
  clientId: z
    .string()
    .describe('Facebook App ID (FACEBOOK_CLIENT_ID). Create an app at developers.facebook.com.'),
  clientSecret: z
    .string()
    .describe('Facebook App Secret (FACEBOOK_CLIENT_SECRET). From your Facebook app.'),
}).meta({
  type: 'facebook-oauth-config',
  title: 'Facebook OAuth Configuration',
  description: 'Configure Facebook OAuth provider',
  envMapping: {
    clientId: 'FACEBOOK_CLIENT_ID',
    clientSecret: 'FACEBOOK_CLIENT_SECRET'
  },
  envEnabledName: ENV_ENABLED_NAME,
});

export function isEnabled(resolvedVariantConfig: any): boolean {
  const cfg = resolvedVariantConfig?.facebookOAuth;
  if (!cfg) return false;
  return Boolean(cfg.clientId && cfg.clientSecret);
}

export const facebookOAuths = z.record(
  z.string(),
  facebookOAuthSchema,
).meta({
  data: 'facebookOAuth',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: facebookOAuthSchema,
  descriptionTemplate: (data: any) => data?.clientId || 'no client id'
});



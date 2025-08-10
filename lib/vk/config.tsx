import { z } from 'zod';

export const ENV_ENABLED_NAME = 'NEXT_PUBLIC_VK_AUTH_ENABLED';

export const vkOAuthSchema = z.object({
  clientId: z
    .string()
    .describe('VK Client ID (VK_CLIENT_ID). Create an app at vk.com/apps?act=manage.'),
  clientSecret: z
    .string()
    .describe('VK Client Secret (VK_CLIENT_SECRET). From your VK application.'),
}).meta({
  type: 'vk-oauth-config',
  title: 'VK OAuth Configuration',
  description: 'Configure VK OAuth provider',
  envMapping: {
    clientId: 'VK_CLIENT_ID',
    clientSecret: 'VK_CLIENT_SECRET'
  },
  envEnabledName: ENV_ENABLED_NAME,
});

export function isEnabled(resolvedVariantConfig: any): boolean {
  const cfg = resolvedVariantConfig?.vkOAuth;
  if (!cfg) return false;
  return Boolean(cfg.clientId && cfg.clientSecret);
}

export const vkOAuths = z.record(
  z.string(),
  vkOAuthSchema,
).meta({
  data: 'vkOAuth',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: vkOAuthSchema,
  descriptionTemplate: (data: any) => data?.clientId || 'no client id'
});



import { z } from 'zod';

export const ENV_ENABLED_NAME = 'NEXT_PUBLIC_YANDEX_AUTH_ENABLED';

export const yandexOAuthSchema = z.object({
  clientId: z
    .string()
    .describe('Yandex Client ID (YANDEX_CLIENT_ID). Create an app at oauth.yandex.com.'),
  clientSecret: z
    .string()
    .describe('Yandex Client Secret (YANDEX_CLIENT_SECRET). From your Yandex OAuth app settings.'),
}).meta({
  type: 'yandex-oauth-config',
  title: 'Yandex OAuth Configuration',
  description: 'Configure Yandex OAuth provider',
  envMapping: {
    clientId: 'YANDEX_CLIENT_ID',
    clientSecret: 'YANDEX_CLIENT_SECRET'
  },
  envEnabledName: ENV_ENABLED_NAME,
});

export function isEnabled(resolvedVariantConfig: any): boolean {
  const cfg = resolvedVariantConfig?.yandexOAuth;
  if (!cfg) return false;
  return Boolean(cfg.clientId && cfg.clientSecret);
}

export const yandexOAuths = z.record(
  z.string(),
  yandexOAuthSchema,
).meta({
  data: 'yandexOAuth',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: yandexOAuthSchema,
  descriptionTemplate: (data: any) => data?.clientId || 'no client id'
});



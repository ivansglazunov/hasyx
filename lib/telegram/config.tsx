import { z } from 'zod';

// Public flag name that indicates Telegram Login auth availability on the client
export const ENV_ENABLED_NAME = 'NEXT_PUBLIC_TELEGRAM_AUTH_ENABLED';

// Telegram Bot configuration (infrastructure bot, not auth)
export const telegramSchema = z.object({
  token: z
    .string()
    .describe('Telegram Bot Token (TELEGRAM_BOT_TOKEN). Get from @BotFather after /newbot.'),
  name: z
    .string()
    .describe('Telegram Bot Username (TELEGRAM_BOT_NAME), e.g., my_project_bot (from @BotFather).'),
}).meta({
  type: 'telegram-config',
  title: 'Telegram Configuration',
  description: 'Configure Telegram bot for infrastructure notifications and integrations.',
  envMapping: {
    token: 'TELEGRAM_BOT_TOKEN',
    name: 'TELEGRAM_BOT_NAME',
  }
});

// Telegram Login OAuth configuration (used by NextAuth)
export const telegramLoginOAuthSchema = z.object({
  username: z
    .string()
    .describe('Telegram Login Bot Username (TELEGRAM_LOGIN_BOT_USERNAME), e.g., MyWebAppBot.'),
  token: z
    .string()
    .describe('Telegram Login Bot Token (TELEGRAM_LOGIN_BOT_TOKEN) from @BotFather.'),
}).meta({
  type: 'telegram-login-config',
  title: 'Telegram Login OAuth Configuration',
  description: 'Configure Telegram Login OAuth provider',
  envMapping: {
    username: 'TELEGRAM_LOGIN_BOT_USERNAME',
    token: 'TELEGRAM_LOGIN_BOT_TOKEN'
  },
  envEnabledName: ENV_ENABLED_NAME,
});

// Returns true when Telegram Login OAuth provider is fully configured for the selected variant
export function isEnabled(resolvedVariantConfig: any): boolean {
  const cfg = resolvedVariantConfig?.telegramLoginOAuth;
  if (!cfg) return false;
  return Boolean(cfg.username && cfg.token);
}

export const telegrams = z.record(
  z.string(),
  telegramSchema,
).meta({
  data: 'telegram',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: telegramSchema,
  descriptionTemplate: (data: any) => data?.name || 'no name'
});

export const telegramLoginOAuths = z.record(
  z.string(),
  telegramLoginOAuthSchema,
).meta({
  data: 'telegramLoginOAuth',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: telegramLoginOAuthSchema,
  descriptionTemplate: (data: any) => data?.username || 'no username'
});


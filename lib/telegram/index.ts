import path from 'path';
import fs from 'fs-extra';
// Minimal .env parser (replaces assist-common)
function parseEnvFile(filePath: string): Record<string, string> {
  const fs = require('fs');
  const env: Record<string, string> = {};
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx <= 0) continue;
      const key = trimmed.substring(0, idx).trim();
      const value = trimmed.substring(idx + 1).trim();
      env[key] = value;
    }
  } catch {}
  return env;
}

/** Telegram menu button structure supported by Telegram Bot API */
type TelegramMenuButton = {
  type: 'web_app' | 'default';
  text?: string;
  web_app?: { url: string };
};

/** Telegram command structure supported by Telegram Bot API */
type TelegramCommand = { command: string; description: string };

/**
 * Read TELEGRAM_BOT_TOKEN from .env or process.env
 * @param envPath path to .env
 * @returns token string or undefined if missing
 */
function readTokenFromEnv(envPath = path.join(process.cwd(), '.env')): string | undefined {
  if (!fs.existsSync(envPath)) return process.env.TELEGRAM_BOT_TOKEN;
  const env = parseEnvFile(envPath);
  return env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
}

/**
 * Set Telegram webhook to the provided URL.
 * Requires TELEGRAM_BOT_TOKEN from .env or explicit token param.
 */
export async function setWebhook(url: string, token?: string): Promise<void> {
  const botToken = token || readTokenFromEnv();
  if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  const res = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(url)}&drop_pending_updates=True`);
  const json = await res.json();
  if (!json.ok) throw new Error(`Failed to set webhook: ${json.description || 'unknown error'}`);
}

/**
 * Remove Telegram webhook.
 */
export async function removeWebhook(token?: string): Promise<void> {
  const botToken = token || readTokenFromEnv();
  if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  const res = await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`);
  const json = await res.json();
  if (!json.ok) throw new Error(`Failed to remove webhook: ${json.description || 'unknown error'}`);
}

/**
 * Set Telegram chat menu button.
 */
export async function setMenuButton(button: TelegramMenuButton, token?: string): Promise<void> {
  const botToken = token || readTokenFromEnv();
  if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  const res = await fetch(`https://api.telegram.org/bot${botToken}/setChatMenuButton?menu_button=${encodeURIComponent(JSON.stringify(button))}`);
  const json = await res.json();
  if (!json.ok) throw new Error(`Failed to set menu button: ${json.description || 'unknown error'}`);
}

/**
 * Set Telegram bot commands.
 */
export async function setCommands(commands: TelegramCommand[], token?: string): Promise<void> {
  const botToken = token || readTokenFromEnv();
  if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  const res = await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands?commands=${encodeURIComponent(JSON.stringify(commands))}`);
  const json = await res.json();
  if (!json.ok) throw new Error(`Failed to set commands: ${json.description || 'unknown error'}`);
}

/**
 * Calibrate Telegram bot by setting webhook, menu button and default commands.
 */
export async function calibrate(options: { webhookUrl?: string; projectName?: string; token?: string }): Promise<void> {
  const botToken = options.token || readTokenFromEnv();
  if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  const webhookUrl = options.webhookUrl;
  if (webhookUrl) {
    await setWebhook(webhookUrl, botToken);
  }
  const menu: TelegramMenuButton = options.projectName
    ? { type: 'web_app', text: `Open ${options.projectName}`, web_app: { url: webhookUrl?.replace(/\/api\/telegram_bot$/, '') || 'http://localhost:3000' } }
    : { type: 'default' };
  await setMenuButton(menu, botToken);
  await setCommands([
    { command: 'start', description: 'Start interacting with the bot' },
    { command: 'menu', description: 'Open the app' },
  ], botToken);
}

export type { TelegramMenuButton, TelegramCommand };


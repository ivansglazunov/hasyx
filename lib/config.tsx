import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .describe('Email address for user registration and notifications'),
});

export const hasuraSchema = z.object({
  NEXT_PUBLIC_HASURA_GRAPHQL_URL: z.string()
    .url('Введите корректный URL Hasura GraphQL')
    .describe('Hasura GraphQL URL - Create a new Hasura Cloud instance at https://cloud.hasura.io/signup'),
  HASURA_ADMIN_SECRET: z.string()
    .min(1, 'Требуется секрет администратора')
    .describe('Admin Secret - Get this from your Hasura project settings'),
  HASURA_JWT_SECRET: z.string()
    .refine(
      (val) => {
        try {
          const parsed = JSON.parse(val);
          return typeof parsed.key === 'string' && parsed.type === 'HS256';
        } catch {
          return false;
        }
      },
      { message: 'HASURA_JWT_SECRET должен быть JSON вида {"type":"HS256","key":"..."}' }
    )
    .describe('JWT Secret - Generate a 32-byte hex string for JWT signing'),
  HASURA_EVENT_SECRET: z.string()
    .min(1, 'Требуется секрет для событий Hasura')
    .describe('Event Secret - Generate a secret for webhook events'),
});

export const telegramSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string()
    .min(1, 'Требуется токен Telegram бота')
    .describe('Telegram Bot Token - Get from @BotFather on Telegram'),
  TELEGRAM_BOT_NAME: z.string()
    .min(1, 'Требуется имя Telegram бота')
    .describe('Telegram Bot Name - Your bot username'),
  TELEGRAM_ADMIN_CHAT_ID: z.string()
    .optional()
    .describe('Telegram Admin Chat ID - Optional, for admin notifications'),
});

export const googleOAuthSchema = z.object({
  GOOGLE_CLIENT_ID: z.string()
    .min(1, 'Требуется Google Client ID')
    .describe('Google Client ID - Go to https://console.developers.google.com/apis/credentials'),
  GOOGLE_CLIENT_SECRET: z.string()
    .min(1, 'Требуется Google Client Secret')
    .describe('Google Client Secret - Copy from your OAuth 2.0 Client'),
});

export const yandexOAuthSchema = z.object({
  YANDEX_CLIENT_ID: z.string()
    .min(1, 'Требуется Yandex Client ID')
    .describe('Yandex Client ID - Go to https://oauth.yandex.com/client/new'),
  YANDEX_CLIENT_SECRET: z.string()
    .min(1, 'Требуется Yandex Client Secret')
    .describe('Yandex Client Secret - Copy from your OAuth application'),
});

export const githubOAuthSchema = z.object({
  GITHUB_ID: z.string()
    .min(1, 'Требуется GitHub Client ID')
    .describe('GitHub Client ID - Go to https://github.com/settings/developers'),
  GITHUB_SECRET: z.string()
    .min(1, 'Требуется GitHub Client Secret')
    .describe('GitHub Client Secret - Copy from your OAuth App'),
});

export const facebookOAuthSchema = z.object({
  FACEBOOK_CLIENT_ID: z.string()
    .min(1, 'Требуется Facebook Client ID')
    .describe('Facebook Client ID - Go to https://developers.facebook.com/apps/'),
  FACEBOOK_CLIENT_SECRET: z.string()
    .min(1, 'Требуется Facebook Client Secret')
    .describe('Facebook Client Secret - Copy from your Facebook App'),
});

export const vkOAuthSchema = z.object({
  VK_CLIENT_ID: z.string()
    .min(1, 'Требуется VK Client ID')
    .describe('VK Client ID - Go to https://vk.com/apps?act=manage'),
  VK_CLIENT_SECRET: z.string()
    .min(1, 'Требуется VK Client Secret')
    .describe('VK Client Secret - Copy from your VK application'),
});

export const telegramLoginSchema = z.object({
  TELEGRAM_LOGIN_BOT_USERNAME: z.string()
    .min(1, 'Требуется Telegram Bot Username')
    .describe('Telegram Bot Username - Get from @BotFather'),
  TELEGRAM_LOGIN_BOT_TOKEN: z.string()
    .min(1, 'Требуется Telegram Bot Token')
    .describe('Telegram Bot Token - Get from @BotFather'),
  NEXT_PUBLIC_TELEGRAM_BOT_USERNAME: z.string()
    .optional()
    .describe('Public Telegram Bot Username - For client-side usage'),
});

export const oauthSchema = z.object({
  ...googleOAuthSchema.shape,
  ...yandexOAuthSchema.shape,
  ...githubOAuthSchema.shape,
  ...facebookOAuthSchema.shape,
  ...vkOAuthSchema.shape,
  ...telegramLoginSchema.shape,
});

export const storageSchema = z.object({
  provider: z.enum(['aws', 'gcp', 'azure', 'digitalocean', 'cloudflare', 'minio', 'local'])
    .describe('Storage Provider - Choose your cloud storage provider'),
  bucket: z.string()
    .min(1, 'Требуется имя bucket')
    .describe('Bucket Name - Your storage bucket name'),
  region: z.string()
    .optional()
    .describe('Region - Your storage region (optional for some providers)'),
  accessKeyId: z.string()
    .optional()
    .describe('Access Key ID - Your storage access key'),
  secretAccessKey: z.string()
    .optional()
    .describe('Secret Access Key - Your storage secret key'),
  endpoint: z.string()
    .optional()
    .describe('Endpoint - Custom endpoint URL (for MinIO, etc.)'),
  forcePathStyle: z.boolean()
    .optional()
    .describe('Force Path Style - Use path-style URLs'),
  useLocal: z.boolean()
    .describe('Use Local Storage - Whether to use local storage'),
  useAntivirus: z.boolean()
    .optional()
    .describe('Use Antivirus - Enable ClamAV scanning'),
  useImageManipulation: z.boolean()
    .optional()
    .describe('Use Image Manipulation - Enable image processing'),
});

export const pgSchema = z.object({
  POSTGRES_URL: z.string()
    .url('Введите корректный URL PostgreSQL')
    .describe('PostgreSQL URL - Complete connection string'),
  PGHOST: z.string()
    .optional()
    .describe('PostgreSQL Host - Database server hostname'),
  PGPORT: z.string()
    .optional()
    .describe('PostgreSQL Port - Database port (default: 5432)'),
  PGUSER: z.string()
    .optional()
    .describe('PostgreSQL User - Database username'),
  PGPASSWORD: z.string()
    .optional()
    .describe('PostgreSQL Password - Database password'),
  PGDATABASE: z.string()
    .optional()
    .describe('PostgreSQL Database - Database name'),
  PGSSLMODE: z.string()
    .optional()
    .describe('PostgreSQL SSL Mode - SSL connection mode'),
});

export const dnsSchema = z.object({
  HASYX_DNS_DOMAIN: z.string()
    .min(1, 'Требуется домен')
    .describe('DNS Domain - Your primary domain for DNS management'),
  CLOUDFLARE_API_TOKEN: z.string()
    .optional()
    .describe('Cloudflare API Token - Get from https://dash.cloudflare.com/profile/api-tokens'),
  CLOUDFLARE_ZONE_ID: z.string()
    .optional()
    .describe('Cloudflare Zone ID - Get from your domain dashboard'),
  LETSENCRYPT_EMAIL: z.string()
    .email('Введите корректный email')
    .optional()
    .describe('LetsEncrypt Email - For SSL certificate notifications'),
});

export const dockerSchema = z.object({
  DOCKER_CONTAINER_NAME: z.string()
    .optional()
    .describe('Docker Container Name - Name for your Docker container'),
});

export const githubSchema = z.object({
  GITHUB_TOKEN: z.string()
    .min(1, 'Требуется GitHub Token')
    .describe('GitHub Token - Get from https://github.com/settings/tokens'),
  NEXT_PUBLIC_GITHUB_OWNER: z.string()
    .min(1, 'Требуется владелец репозитория')
    .describe('GitHub Owner - Repository owner (username or organization)'),
  NEXT_PUBLIC_GITHUB_REPO: z.string()
    .min(1, 'Требуется имя репозитория')
    .describe('GitHub Repository - Repository name'),
});

export const resendSchema = z.object({
  RESEND_API_KEY: z.string()
    .min(1, 'Требуется Resend API Key')
    .describe('Resend API Key - Get from https://resend.com/docs/api-keys'),
});

export const openrouterSchema = z.object({
  OPENROUTER_API_KEY: z.string()
    .min(1, 'Требуется OpenRouter API Key')
    .describe('OpenRouter API Key - Get from https://openrouter.ai/keys'),
});

export const firebaseSchema = z.object({
  FIREBASE_PROJECT_ID: z.string()
    .min(1, 'Требуется Firebase Project ID')
    .describe('Firebase Project ID - Get this from your Firebase project settings'),
  FIREBASE_CLIENT_EMAIL: z.string()
    .email('Введите корректный email')
    .describe('Firebase Client Email - Get this from your service account JSON file'),
  FIREBASE_PRIVATE_KEY: z.string()
    .min(1, 'Требуется приватный ключ')
    .describe('Firebase Private Key - Get this from your service account JSON file'),
});

export const nextAuthSecretsSchema = z.object({
  NEXTAUTH_SECRET: z.string()
    .min(1, 'Требуется NextAuth Secret')
    .describe('NextAuth Secret - Generate a 32-byte hex string for session encryption'),
});

export const cloudflareSchema = z.object({
  CLOUDFLARE_API_TOKEN: z.string()
    .min(1, 'Требуется Cloudflare API Token')
    .describe('Cloudflare API Token - Get from https://dash.cloudflare.com/profile/api-tokens'),
  CLOUDFLARE_ZONE_ID: z.string()
    .min(1, 'Требуется Cloudflare Zone ID')
    .describe('Cloudflare Zone ID - Get from your domain dashboard'),
  LETSENCRYPT_EMAIL: z.string()
    .email('Введите корректный email')
    .describe('LetsEncrypt Email - For SSL certificate notifications'),
});

export const projectUserSchema = z.object({
  PROJECT_USER_EMAIL: z.string()
    .email('Введите корректный email')
    .describe('Project User Email - Default admin user for scripts and automation'),
  PROJECT_USER_PASSWORD: z.string()
    .min(1, 'Требуется пароль')
    .describe('Project User Password - Default admin password for scripts'),
});

export const vercelSchema = z.object({
  VERCEL_TOKEN: z.string()
    .min(1, 'Требуется Vercel Token')
    .describe('Vercel Access Token - Get from https://vercel.com/account/tokens'),
  VERCEL_TEAM_ID: z.string()
    .optional()
    .describe('Vercel Team ID - Optional, for team accounts'),
  VERCEL_PROJECT_NAME: z.string()
    .min(1, 'Требуется Vercel Project Name')
    .describe('Vercel Project Name - Your project name on Vercel'),
});

export const environmentSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string()
    .min(1, 'Требуется имя приложения')
    .describe('Application Name - Display name for your application'),
  NEXT_PUBLIC_BASE_URL: z.string()
    .url('Введите корректный URL')
    .describe('Base URL - Your application base URL'),
});

export const githubWebhooksSchema = z.object({
  GITHUB_WEBHOOK_SECRET: z.string()
    .min(1, 'Требуется GitHub Webhook Secret')
    .describe('GitHub Webhook Secret - Generate a secret for webhook verification'),
  GITHUB_WEBHOOK_URL: z.string()
    .url('Введите корректный URL')
    .describe('GitHub Webhook URL - Your webhook endpoint URL'),
});

export const configSchema = {
  email: emailSchema,
  hasura: hasuraSchema,
  telegram: telegramSchema,
  oauth: oauthSchema,
  googleOAuth: googleOAuthSchema,
  yandexOAuth: yandexOAuthSchema,
  githubOAuth: githubOAuthSchema,
  facebookOAuth: facebookOAuthSchema,
  vkOAuth: vkOAuthSchema,
  telegramLogin: telegramLoginSchema,
  storage: storageSchema,
  pg: pgSchema,
  dns: dnsSchema,
  docker: dockerSchema,
  github: githubSchema,
  resend: resendSchema,
  openrouter: openrouterSchema,
  firebase: firebaseSchema,
  nextAuthSecrets: nextAuthSecretsSchema,
  cloudflare: cloudflareSchema,
  projectUser: projectUserSchema,
  vercel: vercelSchema,
  environment: environmentSchema,
  githubWebhooks: githubWebhooksSchema,
} as const; 
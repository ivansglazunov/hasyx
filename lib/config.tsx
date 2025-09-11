import React from 'react';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { telegramSchema as telegramBotConfigSchema, telegramLoginOAuthSchema as telegramLoginSchema, telegrams, telegramLoginOAuths } from 'hasyx/lib/telegram/config';
import { githubOAuthSchema as githubOAuthConfigSchema, githubOAuths, githubTelegramBotSchema, githubTelegramBots } from 'hasyx/lib/github/config';
import { googleOAuthSchema as googleOAuthConfigSchema, googleOAuths } from 'hasyx/lib/google/config';
import { yandexOAuthSchema as yandexOAuthConfigSchema, yandexOAuths } from 'hasyx/lib/yandex/config';
import { facebookOAuthSchema as facebookOAuthConfigSchema, facebookOAuths } from 'hasyx/lib/facebook/config';
import { firebaseAdminSchema, firebasePublicSchema } from 'hasyx/lib/firebase/config';
import { vkOAuthSchema as vkOAuthConfigSchema, vkOAuths } from 'hasyx/lib/vk/config';
import { nextAuthSecretsSchema as nextAuthConfigSchema, nextAuthVariantSelector, nextAuthSecretsList } from 'hasyx/lib/users/config';
import { dockerHubSchema, dockerHubs } from 'hasyx/lib/dockerhub/config';

export const hasyxConfig: any = {};

// Schemas for selecting from existing configurations
hasyxConfig.hostSelector = z.string().meta({
  type: 'reference-selector',
  data: 'host',
  referenceKey: 'hosts', // key in config where hosts are stored
  title: 'Host Configuration',
  description: 'Select a host configuration',
  emptyMessage: 'No hosts available. Create hosts first.',
  backLabel: '< back',
  descriptionTemplate: (data: any) => data?.url || 'no url'
});

hasyxConfig.hasuraSelector = z.string().meta({
  type: 'reference-selector', 
  data: 'hasura',
  referenceKey: 'hasura', // key in config where hasura configurations are stored
  title: 'Hasura Configuration',
  description: 'Select a hasura configuration',
  emptyMessage: 'No hasura configurations available. Create hasura configurations first.',
  backLabel: '< back',
  descriptionTemplate: (data: any) => data?.url || data?.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'no url'
});


// selector for choosing the current variant
hasyxConfig.selectedVariant = z.string().meta({
  type: 'reference-selector',
  data: 'variant',
  referenceKey: 'variants', // key in config where variants are stored
  title: 'Current Variant',
  description: 'Select the current variant configuration',
  emptyMessage: 'No variants available. Create variants first.',
  backLabel: '< back to main menu',
  descriptionTemplate: (data: any) => `${data.host || 'no host'} -> ${data.hasura || 'no hasura'}${data.telegramBot ? ` -> ${data.telegramBot}` : ''}`
});

// single variant config (form for create/edit)
// see the final variant schema below

hasyxConfig.host = z.object({
  port: z
    .number()
    .default(3000)
    .describe('Application port. This is the port your Next.js app will listen on (default: 3000).'),
  image: z
    .string()
    .optional()
    .describe('Docker image for the application container. If not set, will try dockerhub.image. If neither set, app service will not be generated.'),
  url: z
    .string()
    .describe('Public base URL for your app (maps to NEXT_PUBLIC_MAIN_URL), e.g., https://example.com or http://localhost:3000.'),
  clientOnly: z
    .boolean()
    .describe('Client-only build flag (maps to NEXT_PUBLIC_CLIENT_ONLY). Enable only if server features are disabled.'),
  jwtAuth: z
    .boolean()
    .default(false)
    .describe('Enable JWT authentication mode for mobile apps (NEXT_PUBLIC_JWT_AUTH). Required for Android/iOS integration.')
    .meta({ numericBoolean: true }),
  jwtForce: z
    .boolean()
    .default(false)
    .describe('Force JWT token retrieval for serverless environments (NEXT_PUBLIC_JWT_FORCE). Ensures JWT is always available for WebSocket subscriptions.')
    .meta({ numericBoolean: true }),
  watchtower: z
    .boolean()
    .default(true)
    .describe('Enable Watchtower automatic updates for this container (default: true).'),
}).meta({
  title: 'Host Configuration',
  description: 'Configure the publicly accessible URL and port of your application. To enable app container generation, set dockerhub.image (and dockerhub.username). Otherwise only infrastructure services (Postgres/Hasura/MinIO) will be generated.',
  envMapping: {
    port: 'PORT',
    // Duplicate mapping: one source value -> multiple env targets
    url: ['NEXT_PUBLIC_MAIN_URL', 'NEXT_PUBLIC_BASE_URL', 'NEXT_PUBLIC_API_URL'],
    clientOnly: 'NEXT_PUBLIC_CLIENT_ONLY',
    jwtAuth: 'NEXT_PUBLIC_JWT_AUTH',
    jwtForce: 'NEXT_PUBLIC_JWT_FORCE'
  },
  // Автоматически включать JWT auth для client builds
  autoJwtAuth: (value: any) => {
    return value?.jwtAuth || value?.clientOnly;
  },
    compose: (value: any, _resolved?: any) => {
    const resolvedAll: any = _resolved || {};
    const port = value?.port || 3000;
    const dockerhub = resolvedAll?.dockerhub ? resolvedAll?.dockerhub : undefined;
    const dockerhubCreds = dockerhub ? dockerhub : undefined;
    const rawImage = value?.image || dockerhubCreds?.image; // prefer explicit host.image, else dockerhub.image
    // If image name has no namespace and dockerhub username is provided, prefix it
    const image = ((): string | undefined => {
      if (!rawImage) return undefined;
      if (rawImage.includes('/')) return rawImage;
      if (dockerhubCreds?.username) return `${dockerhubCreds.username}/${rawImage}`;
      return rawImage;
    })();
    const hasDockerhub = Boolean(dockerhubCreds?.username && dockerhubCreds?.image);
    const watchtower = value?.watchtower !== false; // default to true
    // Автоматически включать JWT auth для client builds
    const jwtAuth = value?.jwtAuth || value?.clientOnly;
    const jwtForce = value?.jwtForce || false;
    
    const labels: Record<string, string> = {};
    if (watchtower) {
      labels['com.centurylinklabs.watchtower.enable'] = 'true';
    }
    
    const services: any = {};
    // Generate app service ONLY when dockerhub.username and image provided
    if (hasDockerhub && image) {
      services.hasyx = {
        image,
        container_name: 'hasyx-app',
        restart: 'unless-stopped',
        env_file: ['.env'],
        ports: [`${port}:${port}`],
        environment: {
          NEXT_PUBLIC_JWT_AUTH: jwtAuth ? '1' : '0',
          NEXT_PUBLIC_JWT_FORCE: jwtForce ? '1' : '0'
        },
        ...(Object.keys(labels).length > 0 && { labels }),
      };
    }
    
    return { services };
  }
});

hasyxConfig.hosts = z.record(
  z.string(), // host name (local, dev, prod, test)
  hasyxConfig.host,
).meta({
  data: 'hosts',
  type: 'keys',
  default: ['local', 'dev', 'prod', 'vercel'],
  add: hasyxConfig.host,
  descriptionTemplate: (data: any) => data?.url || 'no url'
});

hasyxConfig.hasura = z.object({
  url: z
    .string()
    .describe('Hasura GraphQL URL (NEXT_PUBLIC_HASURA_GRAPHQL_URL). Example: http://localhost:8080/v1/graphql or your Hasura Cloud endpoint.'),
  secret: z
    .string()
    .describe('Hasura Admin Secret (HASURA_ADMIN_SECRET). Create in Hasura project settings.'),
  jwtSecret: z
    .string()
    .describe('Hasura JWT Secret (HASURA_JWT_SECRET). Must be JSON like {"type":"HS256","key":"<32-byte-hex>"}. A random 32-byte hex is recommended.'),
  eventSecret: z
    .string()
    .describe('Hasura Event Secret (HASURA_EVENT_SECRET). Used to verify event/webhook requests. Can be a random 32-byte hex string.'),
}).meta({
  title: 'Hasura Configuration',
  description: 'Steps:\n1) Create a Hasura project (Hasura Cloud or local).\n2) Copy GraphQL endpoint as NEXT_PUBLIC_HASURA_GRAPHQL_URL.\n3) Set HASURA_ADMIN_SECRET in project settings and copy it here.\n4) Generate a JWT secret: 32-byte hex -> embed as JSON: {"type":"HS256","key":"<hex>"}.\n5) Generate HASURA_EVENT_SECRET (random 32-byte hex).\n6) Set HASURA_GRAPHQL_UNAUTHORIZED_ROLE = anonymous in Hasura environment variables. These values secure your API and events.',
  envMapping: {
    url: 'NEXT_PUBLIC_HASURA_GRAPHQL_URL',
    secret: 'HASURA_ADMIN_SECRET',
    jwtSecret: 'HASURA_JWT_SECRET',
    eventSecret: 'HASURA_EVENT_SECRET'
  },
  compose: (value: any, _resolved?: any) => {
    const resolved: any = _resolved || {};
    const jwt = value?.jwtSecret || '{"type":"HS256","key":"your-jwt-secret-key"}';
    const admin = value?.secret || 'myadminsecretkey';
    const eventSecret = value?.eventSecret || 'your-event-secret';
    const pgUrlOriginal = resolved?.pg?.url || '';
    let pgUser = 'postgres';
    let pgPassword = 'postgrespassword';
    let pgDb = 'hasyx';
    try {
      const u = new URL(pgUrlOriginal);
      pgUser = decodeURIComponent(u.username) || pgUser;
      pgPassword = decodeURIComponent(u.password) || pgPassword;
      pgDb = (u.pathname?.replace(/^\//, '') || pgDb) as string;
    } catch {}
    const localPgUrl = `postgres://${pgUser}:${pgPassword}@postgres:5432/${pgDb}`;
    const pgUrl = resolved?.pg ? localPgUrl : pgUrlOriginal;
    const isLocalPg = Boolean(resolved?.pg);
    return {
      services: {
        'graphql-engine': {
          image: 'hasura/graphql-engine:v2.46.0',
          container_name: 'hasura-graphql-engine-1',
          ports: ['8080:8080'],
          restart: 'always',
          environment: {
            HASURA_GRAPHQL_METADATA_DATABASE_URL: pgUrl || '',
            HASURA_GRAPHQL_DATABASE_URL: pgUrl || '',
            PG_DATABASE_URL: pgUrl || '',
            HASURA_GRAPHQL_ENABLE_CONSOLE: 'true',
            HASURA_GRAPHQL_DEV_MODE: 'true',
            HASURA_GRAPHQL_ENABLED_LOG_TYPES: 'startup, http-log, webhook-log, websocket-log, query-log',
            HASURA_GRAPHQL_JWT_SECRET: jwt,
            HASURA_GRAPHQL_UNAUTHORIZED_ROLE: 'anonymous',
            HASURA_EVENT_SECRET: eventSecret,
            HASURA_GRAPHQL_ADMIN_SECRET: admin,
            HASURA_GRAPHQL_METADATA_DEFAULTS:
              '{"backend_configs":{"dataconnector":{"athena":{"uri":"http://data-connector-agent:8081/api/v1/athena"},"mariadb":{"uri":"http://data-connector-agent:8081/api/v1/mariadb"},"mysql8":{"uri":"http://data-connector-agent:8081/api/v1/mysql"},"oracle":{"uri":"http://data-connector-agent:8081/api/v1/oracle"},"snowflake":{"uri":"http://data-connector-agent:8081/api/v1/snowflake"}}}}',
          },
          ...(isLocalPg
            ? { depends_on: { postgres: { condition: 'service_healthy' }, 'data-connector-agent': { condition: 'service_healthy' } } }
            : { depends_on: { 'data-connector-agent': { condition: 'service_healthy' } } }),
          healthcheck: {
            test: ['CMD', 'curl', '-f', 'http://localhost:8080/healthz'],
            interval: '30s',
            timeout: '10s',
            retries: 3,
          },
        },
        'data-connector-agent': {
          image: 'hasura/graphql-data-connector:v2.46.0',
          container_name: 'hasura-data-connector-agent-1',
          restart: 'always',
          ports: ['8081:8081'],
          environment: {
            QUARKUS_LOG_LEVEL: 'ERROR',
            QUARKUS_OPENTELEMETRY_ENABLED: 'false',
          },
          healthcheck: {
            test: ['CMD', 'curl', '-f', 'http://localhost:8081/api/v1/athena/health'],
            interval: '5s',
            timeout: '10s',
            retries: 5,
            start_period: '5s',
          },
        },
      }
    };
  }
});

hasyxConfig.hasuras = z.record(
  z.string(), // имя варианта расположения базы
  hasyxConfig.hasura,
).meta({
  data: 'hasura',
  type: 'keys',
  default: ['local', 'dev', 'prod', 'cloud'],
  add: hasyxConfig.hasura,
  descriptionTemplate: (data: any) => data?.url || data?.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'no url'
});

// Telegram configuration
// Rename logical name to TelegramBot
hasyxConfig.telegramBot = telegramBotConfigSchema;

hasyxConfig.telegrams = telegrams;

// Telegram Channel configuration (for notifications)
hasyxConfig.telegramChannel = z.object({
  channelId: z
    .string()
    .describe('Telegram Channel ID for notifications (TELEGRAM_CHANNEL_ID). Example: -1001234567890'),
}).meta({
  type: 'telegram-channel-config',
  title: 'Telegram Channel Configuration',
  description: 'Configure Telegram channel for notifications and bots to post updates.',
  envMapping: {
    channelId: 'TELEGRAM_CHANNEL_ID'
  }
});

hasyxConfig.telegramChannels = z.record(
  z.string(),
  hasyxConfig.telegramChannel,
).meta({
  data: 'telegramChannel',
  type: 'keys',
  default: ['default'],
  add: hasyxConfig.telegramChannel,
  descriptionTemplate: (data: any) => data?.channelId || 'no channel id'
});

// Variant schema with a full set of configurations
hasyxConfig.variant = z.object({
  // Required configurations
  host: z.string().min(1, 'Host configuration is required').meta({
    type: 'reference-selector',
    data: 'host',
    referenceKey: 'hosts',
    title: 'Host Configuration',
    description: 'Select a host configuration',
    emptyMessage: 'No hosts available. Create hosts first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.url || 'no url'
  }),
  hasura: z.string().min(1, 'Hasura configuration is required').meta({
    type: 'reference-selector',
    data: 'hasura',
    referenceKey: 'hasura',
    title: 'Hasura Configuration',
    description: 'Select a hasura configuration',
    emptyMessage: 'No hasura configurations available. Create hasura configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.url || 'no url'
  }),
  
  // Primary optional configurations
  telegramBot: z.string().optional().meta({
    type: 'reference-selector',
    data: 'telegramBot',
    referenceKey: 'telegramBot',
    title: 'Telegram Bot Configuration',
    description: 'Select a Telegram bot configuration (optional)',
    emptyMessage: 'No Telegram bot configurations available. Create Telegram bot configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.name || 'no name'
  }),
  telegramChannel: z.string().optional().meta({
    type: 'reference-selector',
    data: 'telegramChannel',
    referenceKey: 'telegramChannel',
    title: 'Telegram Channel Configuration',
    description: 'Select a Telegram channel configuration (optional)',
    emptyMessage: 'No Telegram channel configurations available. Create Telegram channel configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.channelId || 'no channel id'
  }),
  environment: z.string().optional().meta({
    type: 'reference-selector',
    data: 'environment',
    referenceKey: 'environment',
    title: 'Environment Configuration',
    description: 'Select environment configuration (optional)',
    emptyMessage: 'No environment configurations available. Create environment configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.appName || 'no app name'
  }),
  // iOS Signing configuration
  iosSigning: z.string().optional().meta({
    type: 'reference-selector',
    data: 'iosSigning',
    referenceKey: 'iosSigning',
    title: 'iOS Signing Configuration',
    description: 'Select an iOS signing configuration (optional)',
    emptyMessage: 'No iOS signing configurations available. Create iOS signing configurations first.',
    backLabel: '< back',
    descriptionTemplate: (_data: any) => 'Apple signing'
  }),
  
  // OAuth configurations
  googleOAuth: z.string().optional().meta({
    type: 'reference-selector',
    data: 'googleOAuth',
    referenceKey: 'googleOAuth',
    title: 'Google OAuth Configuration',
    description: 'Select a Google OAuth configuration (optional)',
    emptyMessage: 'No Google OAuth configurations available. Create Google OAuth configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.clientId || 'no client id'
  }),
  yandexOAuth: z.string().optional().meta({
    type: 'reference-selector',
    data: 'yandexOAuth',
    referenceKey: 'yandexOAuth',
    title: 'Yandex OAuth Configuration',
    description: 'Select a Yandex OAuth configuration (optional)',
    emptyMessage: 'No Yandex OAuth configurations available. Create Yandex OAuth configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.clientId || 'no client id'
  }),
  githubOAuth: z.string().optional().meta({
    type: 'reference-selector',
    data: 'githubOAuth',
    referenceKey: 'githubOAuth',
    title: 'GitHub OAuth Configuration',
    description: 'Select a GitHub OAuth configuration (optional)',
    emptyMessage: 'No GitHub OAuth configurations available. Create GitHub OAuth configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.clientId || 'no client id'
  }),
  facebookOAuth: z.string().optional().meta({
    type: 'reference-selector',
    data: 'facebookOAuth',
    referenceKey: 'facebookOAuth',
    title: 'Facebook OAuth Configuration',
    description: 'Select a Facebook OAuth configuration (optional)',
    emptyMessage: 'No Facebook OAuth configurations available. Create Facebook OAuth configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.clientId || 'no client id'
  }),
  vkOAuth: z.string().optional().meta({
    type: 'reference-selector',
    data: 'vkOAuth',
    referenceKey: 'vkOAuth',
    title: 'VK OAuth Configuration',
    description: 'Select a VK OAuth configuration (optional)',
    emptyMessage: 'No VK OAuth configurations available. Create VK OAuth configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.clientId || 'no client id'
  }),
  telegramLoginOAuth: z.string().optional().meta({
    type: 'reference-selector',
    data: 'telegramLoginOAuth',
    referenceKey: 'telegramLoginOAuth',
    title: 'Telegram Login OAuth Configuration',
    description: 'Select a Telegram Login OAuth configuration (optional)',
    emptyMessage: 'No Telegram Login OAuth configurations available. Create Telegram Login OAuth configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.username || 'no username'
  }),
  // NextAuth secrets binding for variant
  nextAuthSecrets: nextAuthVariantSelector,
  
  // Additional services
  smsProvider: z.string().optional().meta({
    type: 'reference-selector',
    data: 'smsProvider',
    referenceKey: 'smsProviders', // специальный ключ для комбинированного списка
    title: 'SMS Provider',
    description: 'Select SMS provider configuration from available sms.ru and SMSAero configs',
    emptyMessage: 'No SMS providers available. Create sms.ru or SMSAero configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.type === 'smsru' ? 'sms.ru SMS Service' : 'SMSAero SMS Service'
  }),
  storage: z.string().optional().meta({
    type: 'reference-selector',
    data: 'storage',
    referenceKey: 'storage',
    title: 'Storage Configuration',
    description: 'Select storage configuration (optional)',
    emptyMessage: 'No storage configurations available. Create storage configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => `${data?.provider || 'no provider'} - ${data?.bucket || 'no bucket'}`
  }),
  pg: z.string().optional().meta({
    type: 'reference-selector',
    data: 'pg',
    referenceKey: 'pg',
    title: 'PostgreSQL Configuration',
    description: 'Select PostgreSQL configuration (optional)',
    emptyMessage: 'No PostgreSQL configurations available. Create PostgreSQL configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.host || data?.url || 'no connection'
  }),
  docker: z.string().optional().meta({
    type: 'reference-selector',
    data: 'docker',
    referenceKey: 'docker',
    title: 'Docker Configuration',
    description: 'Select Docker configuration (optional)',
    emptyMessage: 'No Docker configurations available. Create Docker configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.containerName || 'no container name'
  }),
  dockerhub: z.string().optional().meta({
    type: 'reference-selector',
    data: 'dockerhub',
    referenceKey: 'dockerhub',
    title: 'Docker Hub Credentials',
    description: 'Select Docker Hub credentials (optional)',
    emptyMessage: 'No Docker Hub credentials available. Create them first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.username || 'no username'
  }),
  github: z.string().optional().meta({
    type: 'reference-selector',
    data: 'github',
    referenceKey: 'github',
    title: 'GitHub Configuration',
    description: 'Select GitHub configuration (optional)',
    emptyMessage: 'No GitHub configurations available. Create GitHub configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => `${data?.owner || 'no owner'}/${data?.repo || 'no repo'}`
  }),
  vercel: z.string().optional().meta({
    type: 'reference-selector',
    data: 'vercel',
    referenceKey: 'vercel',
    title: 'Vercel Configuration',
    description: 'Select Vercel configuration (optional)',
    emptyMessage: 'No Vercel configurations available. Create Vercel configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.projectName || 'no project name'
  }),
  // Github Telegram Bot feature selection
  githubTelegramBot: z.string().optional().meta({
    type: 'reference-selector',
    data: 'githubTelegramBot',
    referenceKey: 'githubTelegramBot',
    title: 'GitHub Telegram Bot',
    description: 'Select GitHub Telegram Bot configuration (optional)',
    emptyMessage: 'No GitHub Telegram Bot configurations available. Create them first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => (data?.enabled ? 'enabled' : 'disabled')
  }),
  // Email provider (Resend)
  resend: z.string().optional().meta({
    type: 'reference-selector',
    data: 'resend',
    referenceKey: 'resend',
    title: 'Resend Configuration',
    description: 'Select a Resend configuration (optional)',
    emptyMessage: 'No Resend configurations available. Create Resend configurations first.',
    backLabel: '< back',
    descriptionTemplate: (_data: any) => 'Resend Email Service'
  }),
  // SMS provider (sms.ru)
  smsru: z.string().optional().meta({
    type: 'reference-selector',
    data: 'smsru',
    referenceKey: 'smsru',
    title: 'sms.ru Configuration',
    description: 'Select an sms.ru configuration (optional)',
    emptyMessage: 'No sms.ru configurations available. Create sms.ru configurations first.',
    backLabel: '< back',
    descriptionTemplate: (_data: any) => 'sms.ru SMS Service'
  }),
  // LLM provider (OpenRouter)
  openrouter: z.string().optional().meta({
    type: 'reference-selector',
    data: 'openrouter',
    referenceKey: 'openrouter',
    title: 'OpenRouter Configuration',
    description: 'Select an OpenRouter configuration (optional)',
    emptyMessage: 'No OpenRouter configurations available. Create OpenRouter configurations first.',
    backLabel: '< back',
    descriptionTemplate: (_data: any) => 'OpenRouter AI Service'
  }),
  // NPM publish token
  npm: z.string().optional().meta({
    type: 'reference-selector',
    data: 'npm',
    referenceKey: 'npm',
    title: 'NPM Configuration',
    description: 'Select an NPM configuration (optional) to expose NPM_TOKEN for CI publishing.',
    emptyMessage: 'No NPM configurations available. Create NPM configurations first.',
    backLabel: '< back',
    descriptionTemplate: (_data: any) => 'NPM'
  }),
  // Firebase Admin
  firebase: z.string().optional().meta({
    type: 'reference-selector',
    data: 'firebase',
    referenceKey: 'firebase',
    title: 'Firebase (Admin) Configuration',
    description: 'Select a Firebase Admin configuration (optional)',
    emptyMessage: 'No Firebase configurations available. Create Firebase configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.projectId || 'no project id'
  }),
  // Firebase Public
  firebasePublic: z.string().optional().meta({
    type: 'reference-selector',
    data: 'firebasePublic',
    referenceKey: 'firebasePublic',
    title: 'Firebase (Public) Configuration',
    description: 'Select a Firebase Web SDK Public configuration (optional)',
    emptyMessage: 'No Firebase Public configurations available. Create Firebase Public configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.projectId || 'no project id'
  }),
  // DNS
  dns: z.string().optional().meta({
    type: 'reference-selector',
    data: 'dns',
    referenceKey: 'dns',
    title: 'DNS Configuration',
    description: 'Select a DNS configuration (optional)',
    emptyMessage: 'No DNS configurations available. Create DNS configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.domain || 'no domain'
  }),
  // Cloudflare
  cloudflare: z.string().optional().meta({
    type: 'reference-selector',
    data: 'cloudflare',
    referenceKey: 'cloudflare',
    title: 'Cloudflare Configuration',
    description: 'Select a Cloudflare configuration (optional)',
    emptyMessage: 'No Cloudflare configurations available. Create Cloudflare configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.zoneId || 'no zone id'
  }),
  // Project User
  projectUser: z.string().optional().meta({
    type: 'reference-selector',
    data: 'projectUser',
    referenceKey: 'projectUser',
    title: 'Project User Configuration',
    description: 'Select a Project User configuration (optional)',
    emptyMessage: 'No Project User configurations available. Create Project User configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.email || 'no email'
  }),
  // GitHub Webhooks
  githubWebhooks: z.string().optional().meta({
    type: 'reference-selector',
    data: 'githubWebhooks',
    referenceKey: 'githubWebhooks',
    title: 'GitHub Webhooks Configuration',
    description: 'Select a GitHub Webhooks configuration (optional)',
    emptyMessage: 'No GitHub Webhooks configurations available. Create GitHub Webhooks configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.url || 'no webhook url'
  }),
  testing: z.string().optional().meta({
    type: 'reference-selector',
    data: 'testing',
    referenceKey: 'testing',
    title: 'Testing Configuration',
    description: 'Select a testing configuration (optional)',
    emptyMessage: 'No testing configurations available. Create testing configurations first.',
    backLabel: '< back',
    descriptionTemplate: (_data: any) => 'token'
  }),
}).meta({
  type: 'variant-editor',
  title: 'Variant Configuration',
  description: 'Configure variant settings',
  fields: [
    'host', 'hasura', 'telegramBot', 'telegramChannel', 'environment', 'testing',
    'googleOAuth', 'yandexOAuth', 'githubOAuth', 'facebookOAuth', 'vkOAuth', 'telegramLoginOAuth', 'nextAuthSecrets',
    'storage', 'pg', 'docker', 'dockerhub', 'github', 'vercel', 'iosSigning', 'githubTelegramBot',
    'resend', 'smsProvider', 'openrouter', 'npm', 'firebase', 'firebasePublic', 'dns', 'cloudflare', 'projectUser', 'githubWebhooks'
  ]
});

// Redefine variants to use the final (expanded) variant schema
hasyxConfig.variants = z.record(
  z.string(),
  hasyxConfig.variant,
).meta({
  data: 'variants',
  type: 'keys',
  default: ['local', 'dev', 'prod', 'vercel'],
  add: hasyxConfig.variant,
  descriptionTemplate: (data: any) => `${data.host || 'no host'} -> ${data.hasura || 'no hasura'}${data.telegramBot ? ` -> ${data.telegramBot}` : ''}`
});

// Validation rule schema for interactive UI (maps to hasyx.config.json validationRules)
hasyxConfig.validationRule = z.object({
  schema: z.string().default('public').describe('Schema name (default: public)'),
  table: z.string().min(1, 'Table is required').describe('Table name (without schema when schema=public)'),
  column: z.string().optional().describe('Column name (omit for table-level binding e.g. options view)'),
  validate: z.string().min(1, 'Path is required').describe('Path to JSON Schema inside generated schemas (e.g., schema.optionsProfile)'),
  schemaSet: z.string().default('project').describe('Schema set (default: project)')
}).meta({
  type: 'validation-rule',
  title: 'Validation Rule',
  description: 'Bind a JSON Schema path (from zod) to a specific column or a whole table (omit column) for plv8 validation.'
});

hasyxConfig.validationRules = z.record(
  z.string(),
  hasyxConfig.validationRule,
).meta({
  data: 'validationRules',
  type: 'keys',
  default: [],
  add: hasyxConfig.validationRule,
  descriptionTemplate: (data: any) => `${data?.schema || 'public'}.${data?.table}${data?.column ? '.' + data.column : ''} -> ${data?.validate || 'path'}`
});

// Google OAuth configuration
hasyxConfig.googleOAuth = googleOAuthConfigSchema;

hasyxConfig.googleOAuths = googleOAuths;

// Yandex OAuth configuration
hasyxConfig.yandexOAuth = yandexOAuthConfigSchema;

hasyxConfig.yandexOAuths = yandexOAuths;

// GitHub OAuth configuration
hasyxConfig.githubOAuth = githubOAuthConfigSchema;

hasyxConfig.githubOAuths = githubOAuths;

// Facebook OAuth configuration
hasyxConfig.facebookOAuth = facebookOAuthConfigSchema;

hasyxConfig.facebookOAuths = facebookOAuths;

// VK OAuth configuration
hasyxConfig.vkOAuth = vkOAuthConfigSchema;

hasyxConfig.vkOAuths = vkOAuths;

// Telegram Login OAuth configuration
hasyxConfig.telegramLoginOAuth = telegramLoginSchema;

hasyxConfig.telegramLoginOAuths = telegramLoginOAuths;

// NOTE: hasyxConfig.file is created AFTER all schemas below are declared


// Removed centralized envMappingSchema; mapping is taken from each schema's meta.envMapping

// ===== FULL CONFIG SCHEMAS (migrated from assist files) =====
// All schemas include meta data for mapping to env variables

// Storage Schema
hasyxConfig.storage = z.object({
  provider: z
    .enum(['minio', 'aws', 'gcp', 'azure', 'digitalocean', 'cloudflare', 'local'])
    .describe('Storage Provider - Choose your cloud storage provider')
    .meta({ options: ['aws', 'gcp', 'azure', 'digitalocean', 'cloudflare', 'minio', 'local'] }),
  bucket: z.string()
    .min(1, 'Please enter a valid bucket name')
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
  // Advanced settings
  jwtSecret: z.string().optional().describe('JWT secret for storage tokens (STORAGE_JWT_SECRET)'),
  jwtExpiresIn: z.string().optional().describe('JWT access token TTL e.g. 15m (STORAGE_JWT_EXPIRES_IN)'),
  jwtRefreshExpiresIn: z.string().optional().describe('JWT refresh token TTL e.g. 7d (STORAGE_JWT_REFRESH_EXPIRES_IN)'),
  maxFileSize: z.string().optional().describe('Max file size e.g. 100MB (STORAGE_MAX_FILE_SIZE)'),
  allowedMimeTypes: z.string().optional().describe('Comma-separated allowed MIME types (STORAGE_ALLOWED_MIME_TYPES)'),
  allowedFileExtensions: z.string().optional().describe('Comma-separated allowed file extensions (STORAGE_ALLOWED_FILE_EXTENSIONS)'),
  cacheControl: z.string().optional().describe('Cache-Control header default (STORAGE_CACHE_CONTROL)'),
  etag: z.string().optional().describe('Enable/disable ETag calculation (STORAGE_ETAG)'),
  imageMaxWidth: z.string().optional().describe('Max width for image manipulation (STORAGE_IMAGE_MAX_WIDTH)'),
  imageMaxHeight: z.string().optional().describe('Max height for image manipulation (STORAGE_IMAGE_MAX_HEIGHT)'),
  imageQuality: z.string().optional().describe('Image quality 1-100 (STORAGE_IMAGE_QUALITY)'),
  rateLimitWindow: z.string().optional().describe('Rate limit window e.g. 15m (STORAGE_RATE_LIMIT_WINDOW)'),
  rateLimitMaxRequests: z.string().optional().describe('Max requests per window (STORAGE_RATE_LIMIT_MAX_REQUESTS)'),
  logLevel: z.string().optional().describe('Storage log level (STORAGE_LOG_LEVEL)'),
  logFormat: z.string().optional().describe('Storage log format (STORAGE_LOG_FORMAT)'),
  // Additional endpoints used by app and services
  publicUrl: z.string().optional().describe('Public Storage URL for client (NEXT_PUBLIC_HASURA_STORAGE_URL)'),
  serviceUrl: z.string().optional().describe('Internal Storage URL for services (HASURA_STORAGE_URL)'),
}).meta({
  type: 'storage-config',
  title: 'Storage Configuration',
  description: 'Choose local MinIO or a cloud provider.\nLocal (MinIO): runs via docker-compose with default credentials (minioadmin/minioadmin).\nCloud: prepare credentials first.\n- AWS S3: Create user/keys in IAM; create bucket; region like us-east-1.\n- GCP Storage: Create service account with Storage Admin; use key JSON.\n- Azure Blob: Use Storage Account name as Access Key ID; Account Key as Secret.\n- DigitalOcean Spaces: Region like nyc3; endpoint is <region>.digitaloceanspaces.com.\n- Cloudflare R2: Access Key ID = Account ID; Secret = R2 API Token; endpoint is <account_id>.r2.cloudflarestorage.com.',
  envMapping: {
    provider: 'STORAGE_BACKEND',
    bucket: 'STORAGE_S3_BUCKET',
    region: 'STORAGE_S3_REGION',
    accessKeyId: 'STORAGE_S3_ACCESS_KEY_ID',
    secretAccessKey: 'STORAGE_S3_SECRET_ACCESS_KEY',
    endpoint: 'STORAGE_S3_ENDPOINT',
    forcePathStyle: 'STORAGE_S3_FORCE_PATH_STYLE',
    useLocal: 'STORAGE_USE_LOCAL',
    useAntivirus: 'STORAGE_USE_ANTIVIRUS',
    useImageManipulation: 'STORAGE_USE_IMAGE_MANIPULATION',
    jwtSecret: 'STORAGE_JWT_SECRET',
    jwtExpiresIn: 'STORAGE_JWT_EXPIRES_IN',
    jwtRefreshExpiresIn: 'STORAGE_JWT_REFRESH_EXPIRES_IN',
    maxFileSize: 'STORAGE_MAX_FILE_SIZE',
    allowedMimeTypes: 'STORAGE_ALLOWED_MIME_TYPES',
    allowedFileExtensions: 'STORAGE_ALLOWED_FILE_EXTENSIONS',
    cacheControl: 'STORAGE_CACHE_CONTROL',
    etag: 'STORAGE_ETAG',
    imageMaxWidth: 'STORAGE_IMAGE_MAX_WIDTH',
    imageMaxHeight: 'STORAGE_IMAGE_MAX_HEIGHT',
    imageQuality: 'STORAGE_IMAGE_QUALITY',
    rateLimitWindow: 'STORAGE_RATE_LIMIT_WINDOW',
    rateLimitMaxRequests: 'STORAGE_RATE_LIMIT_MAX_REQUESTS',
    logLevel: 'STORAGE_LOG_LEVEL',
    logFormat: 'STORAGE_LOG_FORMAT',
    publicUrl: 'NEXT_PUBLIC_HASURA_STORAGE_URL',
    serviceUrl: 'HASURA_STORAGE_URL'
  },
  compose: (value: any, resolved?: any) => {
    if (!value) return {};
    const useLocal = value.useLocal || value.provider === 'minio';
    const bucket = value.bucket || 'default';
    const endpoint = value.endpoint || 'http://hasyx-minio:9000';
    const accessKey = value.accessKeyId || 'minioadmin';
    const secretKey = value.secretAccessKey || 'minioadmin';
    const jwt = resolved?.hasura?.jwtSecret || '{"type":"HS256","key":"your-jwt-secret-key"}';
    const admin = resolved?.hasura?.secret || 'myadminsecretkey';
    const pgUrlRaw = resolved?.pg?.url || '';
    const ensureSslmodeDisable = (u: string) => {
      if (!u) return '';
      return /[?&]sslmode=/.test(u) ? u : `${u}${u.includes('?') ? '&' : '?'}sslmode=disable`;
    };
    // If local pg is enabled, map hostname to 'postgres' service
    let pgUrlWithParams = ensureSslmodeDisable(pgUrlRaw);
    if (resolved?.pg && typeof pgUrlRaw === 'string' && pgUrlRaw.startsWith('postgres://')) {
      try {
        const u = new URL(pgUrlRaw);
        const user = decodeURIComponent(u.username) || 'postgres';
        const pass = decodeURIComponent(u.password) || 'postgrespassword';
        const db = (u.pathname?.replace(/^\//, '') || 'hasyx') as string;
        pgUrlWithParams = ensureSslmodeDisable(`postgres://${user}:${pass}@postgres:5432/${db}`);
      } catch {}
    }
    // collect optional advanced envs if provided
    const advancedEnv: Record<string, any> = {};
    if (value?.jwtSecret) advancedEnv.JWT_SECRET = value.jwtSecret; // note: service uses JWT_SECRET; keep Hasura JWT by default below
    if (value?.jwtExpiresIn) advancedEnv.STORAGE_JWT_EXPIRES_IN = value.jwtExpiresIn;
    if (value?.jwtRefreshExpiresIn) advancedEnv.STORAGE_JWT_REFRESH_EXPIRES_IN = value.jwtRefreshExpiresIn;
    if (value?.maxFileSize) advancedEnv.STORAGE_MAX_FILE_SIZE = value.maxFileSize;
    if (value?.allowedMimeTypes) advancedEnv.STORAGE_ALLOWED_MIME_TYPES = value.allowedMimeTypes;
    if (value?.allowedFileExtensions) advancedEnv.STORAGE_ALLOWED_FILE_EXTENSIONS = value.allowedFileExtensions;
    if (value?.cacheControl) advancedEnv.STORAGE_CACHE_CONTROL = value.cacheControl;
    if (value?.etag) advancedEnv.STORAGE_ETAG = value.etag;
    if (value?.imageMaxWidth) advancedEnv.STORAGE_IMAGE_MAX_WIDTH = value.imageMaxWidth;
    if (value?.imageMaxHeight) advancedEnv.STORAGE_IMAGE_MAX_HEIGHT = value.imageMaxHeight;
    if (value?.imageQuality) advancedEnv.STORAGE_IMAGE_QUALITY = value.imageQuality;
    if (value?.rateLimitWindow) advancedEnv.STORAGE_RATE_LIMIT_WINDOW = value.rateLimitWindow;
    if (value?.rateLimitMaxRequests) advancedEnv.STORAGE_RATE_LIMIT_MAX_REQUESTS = value.rateLimitMaxRequests;
    if (value?.logLevel) advancedEnv.STORAGE_LOG_LEVEL = value.logLevel;
    if (value?.logFormat) advancedEnv.STORAGE_LOG_FORMAT = value.logFormat;

    return {
      services: {
        'hasura-storage': {
          image: 'nhost/hasura-storage:0.6.1',
          container_name: 'hasyx-storage',
          restart: 'unless-stopped',
          command: 'serve',
          environment: {
            PORT: '8000',
            DEBUG: '*',
            LOG_LEVEL: 'debug',
            GIN_MODE: 'debug',
            AWS_SDK_LOAD_CONFIG: '1',
            AWS_LOG_LEVEL: 'debug',
            HASURA_ENDPOINT: 'http://graphql-engine:8080/v1',
            HASURA_GRAPHQL_ADMIN_SECRET: admin,
            S3_ENDPOINT: endpoint,
            S3_ACCESS_KEY: accessKey,
            S3_SECRET_KEY: secretKey,
            S3_BUCKET: bucket,
            S3_ROOT_FOLDER: 'f215cf48-7458-4596-9aa5-2159fc6a3caf',
            POSTGRES_MIGRATIONS: '0',
            HASURA_METADATA: '1',
            POSTGRES_MIGRATIONS_SOURCE: pgUrlWithParams,
            DATABASE_URL: pgUrlWithParams,
            GRAPHQL_ENGINE_BASE_URL: 'http://graphql-engine:8080/v1',
            GRAPHQL_ENDPOINT: 'http://graphql-engine:8080/v1',
            JWT_SECRET: jwt,
            ...advancedEnv,
          },
          ports: ['3001:8000'],
          volumes: ['./storage:/storage'],
          healthcheck: {
            test: ['CMD', 'curl', '-f', 'http://localhost:8000/healthz'],
            interval: '30s',
            timeout: '10s',
            retries: 3,
          },
          depends_on: {
            postgres: { condition: 'service_healthy' },
            'graphql-engine': { condition: 'service_healthy' },
            ...(useLocal ? { minio: { condition: 'service_healthy' } } : {}),
          },
        },
        ...(useLocal ? {
          minio: {
            image: 'minio/minio:latest',
            container_name: 'hasyx-minio',
            restart: 'unless-stopped',
            environment: {
              MINIO_ROOT_USER: 'minioadmin',
              MINIO_ROOT_PASSWORD: 'minioadmin',
            },
            command: 'server /data --console-address ":9001"',
            volumes: ['minio_data:/data'],
            ports: ['9000:9000', '9001:9001'],
            healthcheck: {
              test: ['CMD', 'curl', '-f', 'http://localhost:9000/minio/health/live'],
              interval: '30s',
              timeout: '20s',
              retries: 3,
            },
          }
        } : {}),
      },
      volumes: useLocal ? { minio_data: null } : {},
    };
  }
});

hasyxConfig.storages = z.record(
  z.string(), // storage configuration name
  hasyxConfig.storage,
).meta({
  data: 'storage',
  type: 'keys',
  default: ['localhost', 'minio'],
  add: hasyxConfig.storage,
  descriptionTemplate: (data: any) => `${data?.provider || 'no provider'} - ${data?.bucket || 'no bucket'}`
});

// PostgreSQL Schema
hasyxConfig.pg = z.object({
  url: z.string()
    .url('Please enter a valid PostgreSQL URL')
    .describe('PostgreSQL URL - Complete connection string'),
}).meta({
  type: 'pg-config',
  title: 'PostgreSQL Configuration',
  description: 'Provide a full PostgreSQL connection URL, e.g., postgres://user:password@host:5432/dbname?sslmode=disable. Alternatively, use assist to compose from individual parts (host, port, user, password, database, SSL).',
  envMapping: {
    url: 'POSTGRES_URL'
  },
  compose: (value: any, _resolved?: any) => {
    const url = value?.url || '';
    // parse connection details
    let user = 'postgres';
    let password = 'postgrespassword';
    let database = 'hasyx';
    try {
      const u = new URL(url);
      user = decodeURIComponent(u.username) || user;
      password = decodeURIComponent(u.password) || password;
      database = (u.pathname?.replace(/^\//, '') || database) as string;
      if (database === 'postgres') database = 'hasyx';
    } catch {}
    return {
      services: {
        postgres: {
          build: { context: '.', dockerfile: 'Dockerfile.postgres' },
          image: 'hasyx-postgres:15-plv8',
          container_name: 'hasura-postgres-1',
          restart: 'always',
          volumes: ['db_data:/var/lib/postgresql/data'],
          environment: {
            POSTGRES_PASSWORD: password,
            POSTGRES_DB: database,
          },
          healthcheck: {
            test: ['CMD-SHELL', `pg_isready -U ${user}`],
            interval: '10s',
            timeout: '5s',
            retries: 5,
          },
        },
      },
      volumes: { db_data: null },
    };
  }
});

hasyxConfig.pgs = z.record(
  z.string(), // pg configuration name
  hasyxConfig.pg,
).meta({
  data: 'pg',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.pg,
  descriptionTemplate: (data: any) => data?.url || 'no connection'
});

// Docker Schema
hasyxConfig.docker = z.object({
  containerName: z.string()
    .optional()
    .describe('Docker Container Name - Name for your Docker container'),
  port: z.string()
    .optional()
    .describe('Docker Port - Port mapping for the container'),
}).meta({
  type: 'docker-config',
  title: 'Docker Configuration',
  description: 'Optional container settings for local runs or CI. You can also configure Docker Hub credentials via assist to enable publishing images from GitHub Actions. Port is host:container mapping.',
  envMapping: {
    containerName: 'DOCKER_CONTAINER_NAME',
    port: 'DOCKER_PORT'
  }
});

hasyxConfig.dockers = z.record(
  z.string(), // docker configuration name
  hasyxConfig.docker,
).meta({
  data: 'docker',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.docker,
  descriptionTemplate: (data: any) => data?.containerName || 'no container name'
});

// GitHub Schema
hasyxConfig.github = z.object({
  token: z.string()
    .min(1, 'Please enter a valid GitHub Token')
    .describe('GitHub Token - Get from https://github.com/settings/tokens'),
  owner: z.string()
    .min(1, 'Please enter a valid GitHub Owner')
    .describe('GitHub Owner - Repository owner (username or organization)'),
  repo: z.string()
    .min(1, 'Please enter a valid GitHub Repository name')
    .describe('GitHub Repository - Repository name'),
}).meta({
  type: 'github-config',
  title: 'GitHub Configuration',
  description: 'Personal Access Token (classic):\n1) GitHub → Settings → Developer settings\n2) Personal access tokens → Tokens (classic) → Generate new token\n3) Scopes: repo (or public_repo)\n4) Copy token and set owner/repo',
  envMapping: {
    token: 'GITHUB_TOKEN',
    owner: 'NEXT_PUBLIC_GITHUB_OWNER',
    repo: 'NEXT_PUBLIC_GITHUB_REPO'
  }
});

hasyxConfig.githubs = z.record(
  z.string(), // github configuration name
  hasyxConfig.github,
).meta({
  data: 'github',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.github,
  descriptionTemplate: (data: any) => `${data?.owner || 'no owner'}/${data?.repo || 'no repo'}`
});

// Resend Schema
hasyxConfig.resend = z.object({
  apiKey: z.string()
    .min(1, 'Please enter a valid Resend API Key')
    .describe('Resend API Key - Get from https://resend.com/docs/api-keys'),
}).meta({
  type: 'resend-config',
  title: 'Resend Configuration',
  description: 'Get API key:\n1) Sign in at https://resend.com\n2) Dashboard → API Keys\n3) Create/copy your API key\n4) Paste it here to enable email sending',
  envMapping: {
    apiKey: 'RESEND_API_KEY'
  }
});

hasyxConfig.resends = z.record(
  z.string(), // resend configuration name
  hasyxConfig.resend,
).meta({
  data: 'resend',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.resend,
  descriptionTemplate: (data: any) => 'Resend Email Service'
});

// sms.ru Schema
hasyxConfig.smsru = z.object({
  apiId: z.string()
    .min(1, 'Please enter a valid sms.ru API ID')
    .describe('sms.ru API ID (SMSRU_API_ID). Get from sms.ru dashboard.'),
  from: z.string()
    .optional()
    .describe('sms.ru Sender name (SMSRU_FROM). Optional approved sender name.')
}).meta({
  type: 'smsru-config',
  title: 'sms.ru Configuration',
  description: 'Configure sms.ru credentials for SMS sending. Provide API ID and optional approved sender name.',
  envMapping: {
    apiId: 'SMSRU_API_ID',
    from: 'SMSRU_FROM'
  }
});

hasyxConfig.smsrus = z.record(
  z.string(), // smsru configuration name
  hasyxConfig.smsru,
).meta({
  data: 'smsru',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.smsru,
  descriptionTemplate: (data: any) => `${data?.apiId ? 'api set' : 'no api'}${data?.from ? ' • from set' : ''}`
});

// SMSAero Schema
hasyxConfig.smsaero = z.object({
  email: z.string()
    .min(1, 'Please enter a valid SMSAero account email')
    .describe('SMSAero Account Email (SMSAERO_EMAIL). Used for Basic Auth together with API key.'),
  apiKey: z.string()
    .min(1, 'Please enter a valid SMSAero API Key')
    .describe('SMSAero API Key (SMSAERO_API_KEY). Get from SMSAero dashboard.'),
  sign: z.string()
    .min(1, 'Please enter an approved SMSAero Sign')
    .describe('SMSAero Sender Name (SMSAERO_SIGN). Must be approved in SMSAero.'),
  channel: z.string()
    .optional()
    .describe('SMSAero Channel (SMSAERO_CHANNEL). Optional: direct, INTERNATIONAL, DIGITAL, SERVICE.')
}).meta({
  type: 'smsaero-config',
  title: 'SMSAero Configuration',
  description: 'Configure SMSAero credentials for SMS sending. All fields except channel are required.',
  envMapping: {
    email: 'SMSAERO_EMAIL',
    apiKey: 'SMSAERO_API_KEY',
    sign: 'SMSAERO_SIGN',
    channel: 'SMSAERO_CHANNEL'
  }
});

hasyxConfig.smsaeros = z.record(
  z.string(), // smsaero configuration name
  hasyxConfig.smsaero,
).meta({
  data: 'smsaero',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.smsaero,
  descriptionTemplate: (data: any) => `${data?.email || 'no email'}${data?.sign ? ' • ' + data.sign : ''}`
});

// OpenRouter Schema
hasyxConfig.openrouter = z.object({
  apiKey: z.string()
    .min(1, 'Please enter a valid OpenRouter API Key')
    .describe('OpenRouter API Key - Get from https://openrouter.ai/keys'),
}).meta({
  type: 'openrouter-config',
  title: 'OpenRouter Configuration',
  description: 'Get API key:\n1) Sign up or log in at https://openrouter.ai\n2) Open https://openrouter.ai/keys\n3) Create a new key (optionally set limits)\n4) Paste it here to enable AI features',
  envMapping: {
    apiKey: 'OPENROUTER_API_KEY'
  }
});

hasyxConfig.openrouters = z.record(
  z.string(), // openrouter configuration name
  hasyxConfig.openrouter,
).meta({
  data: 'openrouter',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.openrouter,
  descriptionTemplate: (data: any) => 'OpenRouter AI Service'
});

// NPM Schema
hasyxConfig.npm = z.object({
  token: z
    .string()
    .min(1, 'Please enter a valid NPM token')
    .describe('NPM Token (NPM_TOKEN). Use an Automation token for CI publishing.'),
}).meta({
  type: 'npm-config',
  title: 'NPM Configuration',
  description: 'Create an NPM Automation token: https://www.npmjs.com/settings/<org-or-user>/tokens → Generate new token → Automation. This token maps to NPM_TOKEN for CI publishing.',
  envMapping: {
    token: 'NPM_TOKEN',
  }
});

hasyxConfig.npms = z.record(
  z.string(),
  hasyxConfig.npm,
).meta({
  data: 'npm',
  type: 'keys',
  default: ['default'],
  add: hasyxConfig.npm,
  descriptionTemplate: (_data: any) => 'NPM Token'
});

// Firebase (Admin) and Firebase (Public) config moved to lib/firebase/config.tsx
hasyxConfig.firebase = firebaseAdminSchema;

hasyxConfig.firebases = z.record(
  z.string(),
  hasyxConfig.firebase,
).meta({
  data: 'firebase',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.firebase,
  descriptionTemplate: (data: any) => data?.projectId || 'no project id'
});

// NextAuth Secrets Schema
hasyxConfig.nextAuthSecrets = nextAuthConfigSchema;

hasyxConfig.nextAuthSecretsList = nextAuthSecretsList;

  // Invites configuration
  hasyxConfig.invites = z.object({
    onlyInvitedUser: z
      .boolean()
      .default(false)
      .describe('Only allow users with invites to get user role (NEXT_PUBLIC_HASYX_ONLY_INVITE_USER). When enabled, users must use an invite code to get user role access.')
      .meta({ numericBoolean: true }),
  }).meta({
    type: 'invites-config',
    title: 'Invites Configuration',
    description: 'Configure invite system behavior. When "Only Invited User" is enabled, users must use an invite code to get user role access.',
    envMapping: {
      onlyInvitedUser: 'NEXT_PUBLIC_HASYX_ONLY_INVITE_USER',
    },
  });

  hasyxConfig.invitesList = z.record(
    z.string(),
    hasyxConfig.invites,
  ).meta({
    data: 'invites',
    type: 'keys',
    default: ['default'],
    add: hasyxConfig.invites,
    descriptionTemplate: (_data: any) => 'Invite system settings',
  });

  // Global settings
  hasyxConfig.global = z.object({
    jestLocal: z.boolean().optional().describe('Enable Jest local mode (writes JEST_LOCAL=1 when true, 0 when false)'),
  }).meta({
    type: 'global-config',
    title: 'Global Settings',
    description: 'Global non-variant settings applied to all variants.',
    envMapping: {
      jestLocal: 'JEST_LOCAL',
    },
  });

  // Testing Schema (for test-data tokens)
  hasyxConfig.testing = z.object({
    token: z
      .string()
      .min(1, 'Please enter a valid Test Token')
      .describe('Test token to be exposed as TEST_TOKEN for selected variant'),
    app: z
      .boolean()
      .describe('Enable app-dependent tests (JEST_APP). Tests that need running app or Hasura events/cron triggers will check this flag.')
      .meta({ numericBoolean: true }),
    hasura: z
      .boolean()
      .describe('Enable Hasura-dependent tests (JEST_HASURA). Tests that need direct Hasura connection will check this flag.')
      .meta({ numericBoolean: true }),
    files: z
      .boolean()
      .describe('Enable files-dependent tests (JEST_FILES). Tests that need file storage or file operations will check this flag.')
      .meta({ numericBoolean: true }),
    instance: z
      .boolean()
      .describe('Enable instance tests (JEST_INSTANCE). Tests that create temporary project instances and run CLI commands will check this flag.')
      .meta({ numericBoolean: true }),
  }).meta({
    type: 'testing-config',
    title: 'Testing Configuration',
    description: 'Configure test behavior for different components. App: running application, Hasura: database connection, Files: file storage operations, Instance: CLI and project generation.',
    envMapping: {
      token: 'TEST_TOKEN',
      app: 'JEST_APP',
      hasura: 'JEST_HASURA',
      files: 'JEST_FILES',
      instance: 'JEST_INSTANCE',
    },
  });

  hasyxConfig.testings = z.record(
    z.string(),
    hasyxConfig.testing,
  ).meta({
    data: 'testing',
    type: 'keys',
    default: ['local', 'dev', 'prod'],
    add: hasyxConfig.testing,
    descriptionTemplate: (data: any) => `${data?.token ? 'token set' : 'no token'}${data?.app ? ' + app' : ''}${data?.hasura ? ' + hasura' : ''}${data?.files ? ' + files' : ''}${data?.instance ? ' + instance' : ''}`,
  });

// DNS Schema
hasyxConfig.dns = z.object({
  domain: z.string()
    .min(1, 'Please enter a valid DNS Domain')
    .describe('DNS Domain - Your primary domain for DNS management'),
}).meta({
  type: 'dns-config',
  title: 'DNS Configuration',
  description: 'Your primary domain for automated DNS/SSL tasks (e.g., example.com). Used together with Cloudflare integration for programmatic record management.',
  envMapping: {
    domain: 'HASYX_DNS_DOMAIN'
  }
});

hasyxConfig.dnsList = z.record(
  z.string(), // dns configuration name
  hasyxConfig.dns,
).meta({
  data: 'dns',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.dns,
  descriptionTemplate: (data: any) => data?.domain || 'no domain'
});

// Cloudflare Schema
hasyxConfig.cloudflare = z.object({
  apiToken: z.string()
    .min(1, 'Please enter a valid Cloudflare API Token')
    .describe('Cloudflare API Token - Get from https://dash.cloudflare.com/profile/api-tokens'),
  zoneId: z.string()
    .min(1, 'Please enter a valid Cloudflare Zone ID')
    .describe('Cloudflare Zone ID - Get from your domain dashboard'),
  letsEncryptEmail: z.string()
    .email('Please enter a valid email')
    .describe('LetsEncrypt Email - For SSL certificate notifications'),
}).meta({
  type: 'cloudflare-config',
  title: 'Cloudflare Configuration',
  description: 'Requirements:\n1) Cloudflare account and your domain added\n2) API Token with Zone:Edit\n3) Zone ID from domain overview\n\nGet token: https://dash.cloudflare.com/profile/api-tokens\nFind Zone ID: Dashboard → Domain → Overview (right sidebar)',
  envMapping: {
    apiToken: 'CLOUDFLARE_API_TOKEN',
    zoneId: 'CLOUDFLARE_ZONE_ID',
    letsEncryptEmail: 'LETSENCRYPT_EMAIL'
  }
});

hasyxConfig.cloudflares = z.record(
  z.string(), // cloudflare configuration name
  hasyxConfig.cloudflare,
).meta({
  data: 'cloudflare',
  type: 'keys',
  default: ['prod'],
  add: hasyxConfig.cloudflare,
  descriptionTemplate: (data: any) => data?.zoneId || 'no zone id'
});

// Project User Schema
hasyxConfig.projectUser = z.object({
  email: z.string()
    .email('Please enter a valid email')
    .describe('Project User Email - Default admin user for scripts and automation'),
  password: z.string()
    .min(1, 'Please enter a valid password')
    .describe('Project User Password - Default admin password for scripts'),
}).meta({
  type: 'project-user-config',
  title: 'Project User Configuration',
  description: 'Default admin user for scripts/automation. Ensure this user exists in DB with appropriate roles and is stored securely.',
  envMapping: {
    email: 'PROJECT_USER_EMAIL',
    password: 'PROJECT_USER_PASSWORD'
  }
});

hasyxConfig.projectUsers = z.record(
  z.string(), // project user configuration name
  hasyxConfig.projectUser,
).meta({
  data: 'projectUser',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.projectUser,
  descriptionTemplate: (data: any) => data?.email || 'no email'
});

// Vercel Schema
hasyxConfig.vercel = z.object({
  token: z.string()
    .min(1, 'Please enter a valid Vercel Token')
    .describe('Vercel Access Token - Get from https://vercel.com/account/tokens'),
  userId: z.string()
    .optional()
    .describe('Vercel User ID - Optional, for personal accounts (treated as personal mode when set and teamId is empty)'),
  teamId: z.string()
    .optional()
    .describe('Vercel Team ID - Optional, for team accounts'),
  projectName: z.string()
    .min(1, 'Please enter a valid Vercel Project Name')
    .describe('Vercel Project Name - Your project name on Vercel'),
}).meta({
  type: 'vercel-config',
  title: 'Vercel Configuration',
  description: 'Steps:\n1) Create Access Token: https://vercel.com/account/tokens\n2) (Optional) Team ID for team projects or User ID for personal projects\n3) Project Name: as in Vercel project (auto-detected from .vercel/project.json if present)',
  envMapping: {
    token: 'VERCEL_TOKEN',
    userId: 'VERCEL_USER_ID',
    teamId: 'VERCEL_TEAM_ID',
    projectName: 'VERCEL_PROJECT_NAME'
  }
});

hasyxConfig.vercels = z.record(
  z.string(), // vercel configuration name
  hasyxConfig.vercel,
).meta({
  data: 'vercel',
  type: 'keys',
  default: ['vercel'],
  add: hasyxConfig.vercel,
  descriptionTemplate: (data: any) => data?.projectName || 'no project name'
});

// iOS Signing Schema
hasyxConfig.iosSigning = z.object({
  teamId: z.string()
    .min(1, 'Please enter a valid Apple Team ID')
    .describe('Apple Developer Team ID (APPLE_TEAM_ID). Example: ABCDE12345'),
  codeSignIdentity: z.string()
    .default('Apple Distribution')
    .describe('Code Signing Identity (IOS_CODE_SIGN_IDENTITY). Usually "Apple Distribution" or "Apple Development"'),
  provisioningProfileSpecifier: z.string()
    .min(1, 'Please enter a valid Provisioning Profile name')
    .describe('Provisioning Profile Specifier name as shown in Xcode (IOS_PROVISIONING_PROFILE_SPECIFIER). Example: hasyx'),
  bundleId: z.string()
    .min(1, 'Please enter a valid Bundle Identifier')
    .describe('App Bundle Identifier (IOS_BUNDLE_ID). Example: com.hasyx.app'),
  certP12Base64: z.string()
    .optional()
    .describe('Base64 of your .p12 signing certificate (IOS_CERT_P12). Do not commit raw files.'),
  certP12Password: z.string()
    .optional()
    .describe('Password for the .p12 certificate (IOS_CERT_PASSWORD).'),
  provisioningProfileBase64: z.string()
    .optional()
    .describe('Base64 of your .mobileprovision profile (IOS_PROFILE). Do not commit raw files.'),
}).meta({
  type: 'ios-signing-config',
  title: 'iOS Signing Configuration',
  description: 'How to obtain signing assets:\n\n1) Create/identify your App ID (Bundle ID) in Apple Developer → Certificates, Identifiers & Profiles → Identifiers.\n2) Create a Provisioning Profile (Distribution or Development) for this App ID → Download the .mobileprovision.\n3) Create/obtain an Apple Distribution/Development certificate in Keychain Access → export as .p12 with a password.\n4) Base64-encode files for CI: macOS: `base64 -i file.p12 | pbcopy`, Linux: `base64 -w0 file.p12`. Do the same for the .mobileprovision.\n5) Fill fields below. In CI these map to env: APPLE_TEAM_ID, IOS_CODE_SIGN_IDENTITY, IOS_PROVISIONING_PROFILE_SPECIFIER, IOS_BUNDLE_ID, IOS_CERT_P12, IOS_CERT_PASSWORD, IOS_PROFILE.',
  envMapping: {
    teamId: 'APPLE_TEAM_ID',
    codeSignIdentity: 'IOS_CODE_SIGN_IDENTITY',
    provisioningProfileSpecifier: 'IOS_PROVISIONING_PROFILE_SPECIFIER',
    bundleId: 'IOS_BUNDLE_ID',
    certP12Base64: 'IOS_CERT_P12',
    certP12Password: 'IOS_CERT_PASSWORD',
    provisioningProfileBase64: 'IOS_PROFILE',
  }
});

hasyxConfig.iosSignings = z.record(
  z.string(),
  hasyxConfig.iosSigning,
).meta({
  data: 'iosSigning',
  type: 'keys',
  default: ['default'],
  add: hasyxConfig.iosSigning,
  descriptionTemplate: (data: any) => `${data?.teamId || 'no team'} • ${data?.bundleId || 'no bundle id'}`
});

// Environment Schema
 hasyxConfig.environment = z.object({
  appName: z.string()
    .min(1, 'Please enter a valid application name')
    .describe('Application Name - Display name for your application'),
  baseUrl: z.string()
    .url('Please enter a valid URL')
    .describe('Base URL - Your application base URL'),
  locale: z
    .string()
    .optional()
    .describe('Default locale for the application (e.g., en, ru). Mapped to NEXT_PUBLIC_LOCALE'),
}).meta({
  type: 'environment-config',
  title: 'Environment Configuration',
  description: 'Set the public app name and base URL used by the client. Base URL should match the deployment domain during production.',
  envMapping: {
    appName: 'NEXT_PUBLIC_APP_NAME',
    baseUrl: 'NEXT_PUBLIC_BASE_URL',
    locale: 'NEXT_PUBLIC_LOCALE'
  }
});

hasyxConfig.environments = z.record(
  z.string(), // environment configuration name
  hasyxConfig.environment,
).meta({
  data: 'environment',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.environment,
  descriptionTemplate: (data: any) => data?.appName || 'no app name'
});

// GitHub Webhooks Schema
hasyxConfig.githubWebhooks = z.object({
  secret: z.string()
    .min(1, 'Please enter a valid GitHub Webhook Secret')
    .describe('GitHub Webhook Secret - Generate a secret for webhook verification'),
  url: z.string()
    .url('Please enter a valid URL')
    .describe('GitHub Webhook URL - Your webhook endpoint URL'),
}).meta({
  type: 'github-webhooks-config',
  title: 'GitHub Webhooks Configuration',
  description: 'Setup steps:\n1) Repo → Settings → Webhooks → Add webhook\n2) Payload URL: BASE_URL/api/github/issues\n3) Content type: application/json\n4) Secret: GITHUB_WEBHOOK_SECRET\n5) Events: select only Issues\n6) Save and test',
  envMapping: {
    secret: 'GITHUB_WEBHOOK_SECRET',
    url: 'GITHUB_WEBHOOK_URL'
  }
});

hasyxConfig.githubWebhooksList = z.record(
  z.string(), // github webhooks configuration name
  hasyxConfig.githubWebhooks,
).meta({
  data: 'githubWebhooks',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.githubWebhooks,
  descriptionTemplate: (data: any) => data?.url || 'no webhook url'
});

// ===== ORIGINAL SCHEMAS =====
// previously extracted env variables from older configuration culture

export let hasuraSchema = z.object({
  url: z.string()
    .url('Please enter a valid Hasura GraphQL URL')
    .describe('Hasura GraphQL URL - Create a new Hasura Cloud instance at https://cloud.hasura.io/signup'),
  secret: z.string()
    .min(1, 'Please enter a valid Hasura Admin Secret')
    .describe('Admin Secret - Get this from your Hasura project settings'),
  jwtSecret: z.string()
    .refine(
      (val) => {
        try {
          const parsed = JSON.parse(val);
          return typeof parsed.key === 'string' && parsed.type === 'HS256';
        } catch {
          return false;
        }
      },
      { message: 'HASURA_JWT_SECRET must be JSON of the form {"type":"HS256","key":"..."}' }
    )
    .describe('JWT Secret - Generate a 32-byte hex string for JWT signing'),
  eventSecret: z.string()
    .min(1, 'Please enter a valid Hasura Event Secret')
    .describe('Event Secret - Generate a secret for webhook events'),
});

// Добавляем метаданные к схеме
hasuraSchema = hasuraSchema.meta({
  type: 'hasura-config',
  name: 'hasura',
  title: 'Hasura Configuration',
  description: 'Configure Hasura GraphQL settings',
  sections: ['connection', 'secrets'],
  envMapping: {
    url: 'NEXT_PUBLIC_HASURA_GRAPHQL_URL',
    secret: 'HASURA_ADMIN_SECRET',
    jwtSecret: 'HASURA_JWT_SECRET',
    eventSecret: 'HASURA_EVENT_SECRET'
  }
});

export const telegramSchema = z.object({
  token: z.string()
    .min(1, 'Please enter a valid Telegram Bot Token')
    .describe('Telegram Bot Token - Get from @BotFather on Telegram'),
  name: z.string()
    .min(1, 'Please enter a valid Telegram Bot Name')
    .describe('Telegram Bot Name - Your bot username'),
  // adminChatId removed
}).meta({
  type: 'telegram-config',
  title: 'Telegram Configuration',
  description: 'Configure Telegram bot settings',
  envMapping: {
    token: 'TELEGRAM_BOT_TOKEN',
    name: 'TELEGRAM_BOT_NAME',
    // adminChatId removed
  }
});

export const googleOAuthSchema = z.object({
  clientId: z.string()
    .min(1, 'Please enter a valid Google Client ID')
    .describe('Google Client ID - Go to https://console.developers.google.com/apis/credentials'),
  clientSecret: z.string()
    .min(1, 'Please enter a valid Google Client Secret')
    .describe('Google Client Secret - Copy from your OAuth 2.0 Client'),
}).meta({
  type: 'google-oauth-config',
  title: 'Google OAuth Configuration',
  description: 'Configure Google OAuth provider',
  envMapping: {
    clientId: 'GOOGLE_CLIENT_ID',
    clientSecret: 'GOOGLE_CLIENT_SECRET'
  },
  envEnabledName: 'NEXT_PUBLIC_GOOGLE_AUTH_ENABLED'
});

export const yandexOAuthSchema = z.object({
  clientId: z.string()
    .min(1, 'Please enter a valid Yandex Client ID')
    .describe('Yandex Client ID - Go to https://oauth.yandex.com/client/new'),
  clientSecret: z.string()
    .min(1, 'Please enter a valid Yandex Client Secret')
    .describe('Yandex Client Secret - Copy from your OAuth application'),
}).meta({
  type: 'yandex-oauth-config',
  title: 'Yandex OAuth Configuration',
  description: 'Configure Yandex OAuth provider',
  envMapping: {
    clientId: 'YANDEX_CLIENT_ID',
    clientSecret: 'YANDEX_CLIENT_SECRET'
  },
  envEnabledName: 'NEXT_PUBLIC_YANDEX_AUTH_ENABLED'
});

// moved to ./github/config

export const facebookOAuthSchema = z.object({
  clientId: z.string()
    .min(1, 'Please enter a valid Facebook Client ID')
    .describe('Facebook Client ID - Go to https://developers.facebook.com/apps/'),
  clientSecret: z.string()
    .min(1, 'Please enter a valid Facebook Client Secret')
    .describe('Facebook Client Secret - Copy from your Facebook App'),
}).meta({
  type: 'facebook-oauth-config',
  title: 'Facebook OAuth Configuration',
  description: 'Configure Facebook OAuth provider',
  envMapping: {
    clientId: 'FACEBOOK_CLIENT_ID',
    clientSecret: 'FACEBOOK_CLIENT_SECRET'
  },
  envEnabledName: 'NEXT_PUBLIC_FACEBOOK_AUTH_ENABLED'
});

export const vkOAuthSchema = z.object({
  clientId: z.string()
    .min(1, 'Please enter a valid VK Client ID')
    .describe('VK Client ID - Go to https://vk.com/apps?act=manage'),
  clientSecret: z.string()
    .min(1, 'Please enter a valid VK Client Secret')
    .describe('VK Client Secret - Copy from your VK application'),
}).meta({
  type: 'vk-oauth-config',
  title: 'VK OAuth Configuration',
  description: 'Configure VK OAuth provider',
  envMapping: {
    clientId: 'VK_CLIENT_ID',
    clientSecret: 'VK_CLIENT_SECRET'
  },
  envEnabledName: 'NEXT_PUBLIC_VK_AUTH_ENABLED'
});

// moved to ./telegram/config

// === Root file schema (must be after all schema declarations above)
hasyxConfig.file = z.object({
  // управление вариантами
  variant: hasyxConfig.selectedVariant, // текущий выбранный вариант
  variants: hasyxConfig.variants, // варианты конфигурации, для быстрого переключения между ними
  
  // основные конфигурации
  hosts: hasyxConfig.hosts, // зарегистрированные хосты
  hasura: hasyxConfig.hasuras, // зарегистрированные базы данных
  telegramBot: hasyxConfig.telegrams, // зарегистрированные Telegram Bot конфигурации
  telegramChannel: hasyxConfig.telegramChannels, // зарегистрированные Telegram каналы
  
  // OAuth конфигурации
  googleOAuth: hasyxConfig.googleOAuths,
  yandexOAuth: hasyxConfig.yandexOAuths,
  githubOAuth: hasyxConfig.githubOAuths,
  facebookOAuth: hasyxConfig.facebookOAuths,
  vkOAuth: hasyxConfig.vkOAuths,
  telegramLoginOAuth: hasyxConfig.telegramLoginOAuths,
  
  // дополнительные конфигурации из assist-файлов
  storage: hasyxConfig.storages, // файловое хранилище
  pg: hasyxConfig.pgs, // PostgreSQL
  docker: hasyxConfig.dockers, // Docker
  dockerhub: dockerHubs, // Docker Hub credentials
  github: hasyxConfig.githubs, // GitHub API
  resend: hasyxConfig.resends, // Resend email
  smsru: hasyxConfig.smsrus, // sms.ru SMS
  smsaero: hasyxConfig.smsaeros, // SMSAero SMS
  openrouter: hasyxConfig.openrouters, // OpenRouter AI
  npm: hasyxConfig.npms, // NPM (publish token)
  firebase: hasyxConfig.firebases, // Firebase (Admin)
  firebasePublic: z.record(z.string(), firebasePublicSchema).meta({
    data: 'firebasePublic',
    type: 'keys',
    default: ['local', 'dev', 'prod'],
    add: firebasePublicSchema,
    descriptionTemplate: (data: any) => data?.projectId || 'no project id'
  }), // Firebase Web SDK Public
  nextAuthSecrets: hasyxConfig.nextAuthSecretsList, // NextAuth secrets
  dns: hasyxConfig.dnsList, // DNS management
  cloudflare: hasyxConfig.cloudflares, // Cloudflare
  projectUser: hasyxConfig.projectUsers, // Project users
  vercel: hasyxConfig.vercels, // Vercel deployment
  iosSigning: hasyxConfig.iosSignings, // iOS signing configuration
  environment: hasyxConfig.environments, // Environment settings
  githubWebhooks: hasyxConfig.githubWebhooksList, // GitHub webhooks
  githubTelegramBot: githubTelegramBots, // GitHub Telegram Bot
  // global and other variant-bound extras
  testing: hasyxConfig.testings,
  global: hasyxConfig.global,
  invites: hasyxConfig.invitesList,
  // validation rules (optional, alternative to top-level array "validation")
  validationRules: hasyxConfig.validationRules,
});

 

// Test code to run the Config component (only when run directly)
if (require.main === module) {
  const args = process.argv.slice(2);
  const isSilent = args.includes('--silent') || args.includes('-s');
  
  // Initialize debug logging
  if (isSilent) {
    (async () => {
      try {
        const { generateEnv } = await import('./config/env');
        generateEnv();
        console.log('✅ .env file updated');
      } catch (error) {
        console.error('❌ Failed to generate .env:', error);
      }
      try {
        const { generateDockerCompose } = await import('./config/docker-compose');
        generateDockerCompose();
        console.log('✅ docker-compose.yml updated');
      } catch (error) {
        console.error('❌ Failed to generate docker-compose.yml:', error);
      }
    })();
  } else {
    (async () => {
      // Avoid static import analysis to keep ink out of Next.js bundles
      const dynamicImport = new Function('p', 'return import(p)');
      const inkModule = await (dynamicImport('hasyx/lib/ink') as Promise<any>);
      const renderConfigWith = inkModule.renderConfigWith || inkModule.default?.renderConfigWith;
      if (typeof renderConfigWith !== 'function') {
        throw new TypeError('renderConfigWith is not a function');
      }
      const fs = await import('fs');
      const path = await import('path');

      // Load/create config file
      const configPath = path.join(process.cwd(), 'hasyx.config.json');
      let currentConfig: any = {};
      try {
        const content = fs.readFileSync(configPath, 'utf8');
        currentConfig = JSON.parse(content);
      } catch {
        fs.writeFileSync(configPath, '{}');
      }

      // One-time regeneration on startup (even before any changes in UI)
      try {
        const { generateEnv } = await import('./config/env');
        generateEnv();
        console.log('✅ .env file updated');
      } catch (error) {
        console.error('❌ Failed to generate .env:', error);
      }
      try {
        const { generateDockerCompose } = await import('./config/docker-compose');
        generateDockerCompose();
        console.log('✅ docker-compose.yml updated');
      } catch (error) {
        console.error('❌ Failed to generate docker-compose.yml:', error);
      }

      const onChange = async (newConfig: any) => {
        fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
        
        // Generate side artifacts separately to keep UI isolated from mechanics
        try {
          const { generateEnv } = await import('./config/env');
          generateEnv();
          console.log('✅ .env file updated automatically');
        } catch (error) {
          console.error('❌ Failed to update .env file:', error);
        }
        try {
          const { generateDockerCompose } = await import('./config/docker-compose');
          generateDockerCompose();
          console.log('✅ docker-compose.yml updated automatically');
        } catch (error) {
          console.error('❌ Failed to update docker-compose.yml:', error);
        }
      };

      if (process.env.DEBUG) {
        console.log('🎭 Starting config UI with schema and config');
        console.log('🔧 Schema keys:', Object.keys(hasyxConfig.file.shape));
        console.log('📋 Current config keys:', Object.keys(currentConfig));
      }

      await renderConfigWith({ fileSchema: hasyxConfig.file, config: currentConfig, onChange });
    })();
  }
}

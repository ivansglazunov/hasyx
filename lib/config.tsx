import React from 'react';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { telegramSchema as telegramConfigSchema, telegramLoginOAuthSchema as telegramLoginSchema, telegrams, telegramLoginOAuths } from './telegram/config';
import { githubOAuthSchema as githubOAuthConfigSchema, githubOAuths } from './github/config';
import { googleOAuthSchema as googleOAuthConfigSchema, googleOAuths } from './google/config';
import { yandexOAuthSchema as yandexOAuthConfigSchema, yandexOAuths } from './yandex/config';
import { facebookOAuthSchema as facebookOAuthConfigSchema, facebookOAuths } from './facebook/config';
import { vkOAuthSchema as vkOAuthConfigSchema, vkOAuths } from './vk/config';
import { nextAuthSecretsSchema as nextAuthConfigSchema, nextAuthVariantSelector, nextAuthSecretsList } from './users/config';

export const hasyxConfig: any = {};

// Схемы для выбора из существующих конфигураций
hasyxConfig.hostSelector = z.string().meta({
  type: 'reference-selector',
  data: 'host',
  referenceKey: 'hosts', // ключ в конфиге где хранятся хосты
  title: 'Host Configuration',
  description: 'Select a host configuration',
  emptyMessage: 'No hosts available. Create hosts first.',
  backLabel: '< back',
  descriptionTemplate: (data: any) => data?.url || 'no url'
});

hasyxConfig.hasuraSelector = z.string().meta({
  type: 'reference-selector', 
  data: 'hasura',
  referenceKey: 'hasura', // ключ в конфиге где хранятся hasura конфигурации
  title: 'Hasura Configuration',
  description: 'Select a hasura configuration',
  emptyMessage: 'No hasura configurations available. Create hasura configurations first.',
  backLabel: '< back',
  descriptionTemplate: (data: any) => data?.url || data?.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'no url'
});


// селектор для выбора текущего варианта
hasyxConfig.selectedVariant = z.string().meta({
  type: 'reference-selector',
  data: 'variant',
  referenceKey: 'variants', // ключ в конфиге где хранятся варианты
  title: 'Current Variant',
  description: 'Select the current variant configuration',
  emptyMessage: 'No variants available. Create variants first.',
  backLabel: '< back to main menu',
  descriptionTemplate: (data: any) => `${data.host || 'no host'} -> ${data.hasura || 'no hasura'}${data.telegram ? ` -> ${data.telegram}` : ''}`
});

// конфиг для одного варианта окружения (форма для создания/редактирования)
// см. финальную схему variant ниже

hasyxConfig.host = z.object({
  port: z
    .number()
    .default(3000)
    .describe('Application port. This is the port your Next.js app will listen on (default: 3000).'),
  url: z
    .string()
    .describe('Public base URL for your app (maps to NEXT_PUBLIC_MAIN_URL), e.g., https://example.com or http://localhost:3000.'),
  clientOnly: z
    .boolean()
    .describe('Client-only build flag (maps to NEXT_PUBLIC_CLIENT_ONLY). Enable only if server features are disabled.'),
}).meta({
  title: 'Host Configuration',
  description: 'Configure the publicly accessible URL and port of your application. Use your production domain in production (e.g., https://example.com) and localhost during development. Set client-only mode only if your app must run without server features.',
  envMapping: {
    port: 'PORT',
    url: 'NEXT_PUBLIC_MAIN_URL',
    clientOnly: 'NEXT_PUBLIC_CLIENT_ONLY'
  },
  compose: (value: any, _resolved?: any) => {
    // Host presence should not by itself create any containers in compose
    return {};
  }
});

hasyxConfig.hosts = z.record(
  z.string(), // имя хоста (local, dev, prod, test)
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
  description: 'Steps:\n1) Create a Hasura project (Hasura Cloud or local).\n2) Copy GraphQL endpoint as NEXT_PUBLIC_HASURA_GRAPHQL_URL.\n3) Set HASURA_ADMIN_SECRET in project settings and copy it here.\n4) Generate a JWT secret: 32-byte hex -> embed as JSON: {"type":"HS256","key":"<hex>"}.\n5) Generate HASURA_EVENT_SECRET (random 32-byte hex). These values secure your API and events.',
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
    const pgUrl = resolved?.pg?.url || '';
    const isLocalPg = typeof pgUrl === 'string' && /postgres:\/\/.*@postgres(?::\d+)?\//.test(pgUrl);
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
          ...(isLocalPg ? { depends_on: { postgres: { condition: 'service_healthy' }, 'data-connector-agent': { condition: 'service_healthy' } } } : { depends_on: { 'data-connector-agent': { condition: 'service_healthy' } } }),
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

// Telegram конфигурация
hasyxConfig.telegram = telegramConfigSchema;

hasyxConfig.telegrams = telegrams;

// Схема variant с полным набором конфигураций
hasyxConfig.variant = z.object({
  // Обязательные конфигурации
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
  
  // Основные опциональные конфигурации
  telegram: z.string().optional().meta({
    type: 'reference-selector',
    data: 'telegram',
    referenceKey: 'telegram',
    title: 'Telegram Configuration',
    description: 'Select a telegram configuration (optional)',
    emptyMessage: 'No telegram configurations available. Create telegram configurations first.',
    backLabel: '< back',
    descriptionTemplate: (data: any) => data?.name || 'no name'
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
  
  // OAuth конфигурации
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
  
  // Дополнительные сервисы
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
}).meta({
  type: 'variant-editor',
  title: 'Variant Configuration',
  description: 'Configure variant settings',
  fields: [
    'host', 'hasura', 'telegram', 'environment',
    'googleOAuth', 'yandexOAuth', 'githubOAuth', 'facebookOAuth', 'vkOAuth', 'telegramLoginOAuth', 'nextAuthSecrets',
    'storage', 'pg', 'docker', 'github', 'vercel'
  ]
});

// Переопределяем variants, чтобы использовать финальную (расширенную) схему variant
hasyxConfig.variants = z.record(
  z.string(),
  hasyxConfig.variant,
).meta({
  data: 'variants',
  type: 'keys',
  default: ['local', 'dev', 'prod', 'vercel'],
  add: hasyxConfig.variant,
  descriptionTemplate: (data: any) => `${data.host || 'no host'} -> ${data.hasura || 'no hasura'}${data.telegram ? ` -> ${data.telegram}` : ''}`
});

// Google OAuth конфигурация
hasyxConfig.googleOAuth = googleOAuthConfigSchema;

hasyxConfig.googleOAuths = googleOAuths;

// Yandex OAuth конфигурация
hasyxConfig.yandexOAuth = yandexOAuthConfigSchema;

hasyxConfig.yandexOAuths = yandexOAuths;

// GitHub OAuth конфигурация
hasyxConfig.githubOAuth = githubOAuthConfigSchema;

hasyxConfig.githubOAuths = githubOAuths;

// Facebook OAuth конфигурация
hasyxConfig.facebookOAuth = facebookOAuthConfigSchema;

hasyxConfig.facebookOAuths = facebookOAuths;

// VK OAuth конфигурация
hasyxConfig.vkOAuth = vkOAuthConfigSchema;

hasyxConfig.vkOAuths = vkOAuths;

// Telegram Login OAuth конфигурация
hasyxConfig.telegramLoginOAuth = telegramLoginSchema;

hasyxConfig.telegramLoginOAuths = telegramLoginOAuths;

// NOTE: hasyxConfig.file будет создан ПОСЛЕ объявления всех схем ниже


// Removed centralized envMappingSchema; mapping is taken from each schema's meta.envMapping

// ===== ПОЛНЫЕ СХЕМЫ КОНФИГУРАЦИИ ИЗ ASSIST-ФАЙЛОВ =====
// Все схемы включают мета-данные для маппинга в env переменные

// Storage Schema (из assist-storage.ts)
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
    useImageManipulation: 'STORAGE_USE_IMAGE_MANIPULATION'
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
            POSTGRES_MIGRATIONS_SOURCE: '',
            DATABASE_URL: '',
            GRAPHQL_ENGINE_BASE_URL: 'http://graphql-engine:8080/v1',
            GRAPHQL_ENDPOINT: 'http://graphql-engine:8080/v1',
            JWT_SECRET: jwt,
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
  z.string(), // имя storage конфигурации
  hasyxConfig.storage,
).meta({
  data: 'storage',
  type: 'keys',
  default: ['localhost', 'minio'],
  add: hasyxConfig.storage,
  descriptionTemplate: (data: any) => `${data?.provider || 'no provider'} - ${data?.bucket || 'no bucket'}`
});

// PostgreSQL Schema (из assist-pg.ts)
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
  }
});

hasyxConfig.pgs = z.record(
  z.string(), // имя pg конфигурации
  hasyxConfig.pg,
).meta({
  data: 'pg',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.pg,
  descriptionTemplate: (data: any) => data?.url || 'no connection'
});

// Docker Schema (из assist-docker.ts)
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
  z.string(), // имя docker конфигурации
  hasyxConfig.docker,
).meta({
  data: 'docker',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.docker,
  descriptionTemplate: (data: any) => data?.containerName || 'no container name'
});

// GitHub Schema (из assist-github.ts)
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
  z.string(), // имя github конфигурации
  hasyxConfig.github,
).meta({
  data: 'github',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.github,
  descriptionTemplate: (data: any) => `${data?.owner || 'no owner'}/${data?.repo || 'no repo'}`
});

// Resend Schema (из assist-resend.ts)
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
  z.string(), // имя resend конфигурации
  hasyxConfig.resend,
).meta({
  data: 'resend',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.resend,
  descriptionTemplate: (data: any) => 'Resend Email Service'
});

// OpenRouter Schema (из assist-openrouter.ts)
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
  z.string(), // имя openrouter конфигурации
  hasyxConfig.openrouter,
).meta({
  data: 'openrouter',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.openrouter,
  descriptionTemplate: (data: any) => 'OpenRouter AI Service'
});

// Firebase Schema (из assist-firebase.ts)
hasyxConfig.firebase = z.object({
  projectId: z.string()
    .min(1, 'Please enter a valid Firebase Project ID')
    .describe('Firebase Project ID - Get this from your Firebase project settings'),
  clientEmail: z.string()
    .email('Please enter a valid email')
    .describe('Firebase Client Email - Get this from your service account JSON file'),
  privateKey: z.string()
    .min(1, 'Please enter a valid Firebase Private Key')
    .describe('Firebase Private Key - Get this from your service account JSON file'),
}).meta({
  type: 'firebase-config',
  title: 'Firebase Configuration',
  description: 'Service account steps:\n1) Firebase Console → Project settings → Service accounts\n2) Generate a new private key JSON\n3) Fill from JSON: project_id, client_email, private_key\n4) Escape newlines in private_key as \\n in .env\n5) Keep firebase-service-account.json out of VCS',
  envMapping: {
    projectId: 'FIREBASE_PROJECT_ID',
    clientEmail: 'FIREBASE_CLIENT_EMAIL',
    privateKey: 'FIREBASE_PRIVATE_KEY'
  }
});

hasyxConfig.firebases = z.record(
  z.string(), // имя firebase конфигурации
  hasyxConfig.firebase,
).meta({
  data: 'firebase',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.firebase,
  descriptionTemplate: (data: any) => data?.projectId || 'no project id'
});

// NextAuth Secrets Schema (из assist-auth-secrets.ts)
hasyxConfig.nextAuthSecrets = nextAuthConfigSchema;

hasyxConfig.nextAuthSecretsList = nextAuthSecretsList;

// DNS Schema (из assist-dns.ts)
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
  z.string(), // имя dns конфигурации
  hasyxConfig.dns,
).meta({
  data: 'dns',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.dns,
  descriptionTemplate: (data: any) => data?.domain || 'no domain'
});

// Cloudflare Schema (из assist-cloudflare.ts)
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
  z.string(), // имя cloudflare конфигурации
  hasyxConfig.cloudflare,
).meta({
  data: 'cloudflare',
  type: 'keys',
  default: ['prod'],
  add: hasyxConfig.cloudflare,
  descriptionTemplate: (data: any) => data?.zoneId || 'no zone id'
});

// Project User Schema (из assist-project-user.ts)
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
  z.string(), // имя project user конфигурации
  hasyxConfig.projectUser,
).meta({
  data: 'projectUser',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.projectUser,
  descriptionTemplate: (data: any) => data?.email || 'no email'
});

// Vercel Schema (из assist-vercel.ts)
hasyxConfig.vercel = z.object({
  token: z.string()
    .min(1, 'Please enter a valid Vercel Token')
    .describe('Vercel Access Token - Get from https://vercel.com/account/tokens'),
  teamId: z.string()
    .optional()
    .describe('Vercel Team ID - Optional, for team accounts'),
  projectName: z.string()
    .min(1, 'Please enter a valid Vercel Project Name')
    .describe('Vercel Project Name - Your project name on Vercel'),
}).meta({
  type: 'vercel-config',
  title: 'Vercel Configuration',
  description: 'Steps:\n1) Create Access Token: https://vercel.com/account/tokens\n2) (Optional) Team ID from team settings\n3) Project Name: as in Vercel project (auto-detected from .vercel/project.json if present)',
  envMapping: {
    token: 'VERCEL_TOKEN',
    teamId: 'VERCEL_TEAM_ID',
    projectName: 'VERCEL_PROJECT_NAME'
  }
});

hasyxConfig.vercels = z.record(
  z.string(), // имя vercel конфигурации
  hasyxConfig.vercel,
).meta({
  data: 'vercel',
  type: 'keys',
  default: ['vercel'],
  add: hasyxConfig.vercel,
  descriptionTemplate: (data: any) => data?.projectName || 'no project name'
});

// Environment Schema (из assist-env.ts)
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
  z.string(), // имя environment конфигурации
  hasyxConfig.environment,
).meta({
  data: 'environment',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.environment,
  descriptionTemplate: (data: any) => data?.appName || 'no app name'
});

// GitHub Webhooks Schema (из assist-github-webhooks.ts)
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
  z.string(), // имя github webhooks конфигурации
  hasyxConfig.githubWebhooks,
).meta({
  data: 'githubWebhooks',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: hasyxConfig.githubWebhooks,
  descriptionTemplate: (data: any) => data?.url || 'no webhook url'
});

// ===== ОРИГИНАЛЬНЫЕ СХЕМЫ =====
// ранее извлеченные из предыдущей культуры конфигураций в assist- файлах все env которые вообще есть в системе:

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
      { message: 'HASURA_JWT_SECRET должен быть JSON вида {"type":"HS256","key":"..."}' }
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
  telegram: hasyxConfig.telegrams, // зарегистрированные telegram конфигурации
  
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
  github: hasyxConfig.githubs, // GitHub API
  resend: hasyxConfig.resends, // Resend email
  openrouter: hasyxConfig.openrouters, // OpenRouter AI
  firebase: hasyxConfig.firebases, // Firebase
  nextAuthSecrets: hasyxConfig.nextAuthSecretsList, // NextAuth secrets
  dns: hasyxConfig.dnsList, // DNS management
  cloudflare: hasyxConfig.cloudflares, // Cloudflare
  projectUser: hasyxConfig.projectUsers, // Project users
  vercel: hasyxConfig.vercels, // Vercel deployment
  environment: hasyxConfig.environments, // Environment settings
  githubWebhooks: hasyxConfig.githubWebhooksList, // GitHub webhooks
});

 

// Тестовый код для запуска Config компонента (только при прямом запуске)
if (require.main === module) {
  (async () => {
    // Избегаем статического анализа импортов, чтобы не тянуть ink в бандлы Next.js
    const dynamicImport = new Function('p', 'return import(p)');
    const inkModule = await (dynamicImport('./ink') as Promise<any>);
    const renderConfigWith = inkModule.renderConfigWith || inkModule.default?.renderConfigWith;
    if (typeof renderConfigWith !== 'function') {
      throw new TypeError('renderConfigWith is not a function');
    }
    const fs = await import('fs');
    const path = await import('path');

    // Загружаем/создаем конфиг-файл
    const configPath = path.join(process.cwd(), 'hasyx.config.json');
    let currentConfig: any = {};
    try {
      const content = fs.readFileSync(configPath, 'utf8');
      currentConfig = JSON.parse(content);
    } catch {
      fs.writeFileSync(configPath, '{}');
    }

    const onChange = async (newConfig: any) => {
      fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
      // Генерация побочных артефактов — отдельно, чтобы UI был чистым от механик
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

    await renderConfigWith({ fileSchema: hasyxConfig.file, config: currentConfig, onChange });
  })();
}

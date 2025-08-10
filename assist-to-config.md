# Анализ Assist-файлов и их соответствия config.tsx

## Список всех assist-файлов в проекте

### Основные assist-файлы:
1. `lib/assist.ts` - главный файл assist
2. `lib/assist-common.ts` - общие утилиты для assist
3. `lib/assist-env.ts` - настройка окружения
4. `lib/assist-docker.ts` - настройка Docker
5. `lib/assist-vercel.ts` - настройка Vercel
6. `lib/assist-telegram.ts` - настройка Telegram бота
7. `lib/assist-openrouter.ts` - настройка OpenRouter API
8. `lib/assist-pg.ts` - настройка PostgreSQL
9. `lib/assist-migrations.ts` - запуск миграций
10. `lib/assist-commit.ts` - коммит изменений
11. `lib/assist-sync.ts` - синхронизация переменных окружения

### Assist-файлы для пользователей:
12. `lib/users/assist-auth-secrets.ts` - настройка NextAuth секретов
13. `lib/users/assist-oauth.ts` - настройка OAuth провайдеров
14. `lib/users/assist-resend.ts` - настройка Resend для email
15. `lib/users/assist-project-user.ts` - настройка пользователя проекта

### Assist-файлы для интеграций:
16. `lib/hasura/assist-hasura.ts` - настройка Hasura
17. `lib/hasyx/assist-hasyx.ts` - инициализация Hasyx
18. `lib/notify/assist-firebase.ts` - настройка Firebase уведомлений
19. `lib/files/assist-storage.ts` - настройка файлового хранилища

### Assist-файлы для GitHub:
20. `lib/github/assist-github-auth.ts` - проверка GitHub аутентификации
21. `lib/github/assist-github.ts` - настройка GitHub токена
22. `lib/github/assist-github-webhooks.ts` - настройка GitHub webhooks

### Assist-файлы для Cloudflare:
23. `lib/cloudflare/assist-cloudflare.ts` - настройка Cloudflare
24. `lib/cloudflare/assist-dns.ts` - настройка DNS управления

## Анализ соответствия переменных окружения

### Переменные из config.tsx, которые НЕ обрабатываются assist-файлами:

#### Email Schema:
- ✅ `email` - обрабатывается в `assist-env.ts`

#### Hasura Schema:
- ✅ `NEXT_PUBLIC_HASURA_GRAPHQL_URL` - обрабатывается в `assist-hasura.ts`
- ✅ `HASURA_ADMIN_SECRET` - обрабатывается в `assist-hasura.ts`
- ✅ `HASURA_JWT_SECRET` - обрабатывается в `assist-hasura.ts`
- ✅ `HASURA_EVENT_SECRET` - обрабатывается в `assist-hasura.ts`

#### Telegram Schema:
- ✅ `TELEGRAM_BOT_TOKEN` - обрабатывается в `assist-telegram.ts`
- ✅ `TELEGRAM_BOT_NAME` - обрабатывается в `assist-telegram.ts`

#### OAuth Schema:
- ✅ `GOOGLE_CLIENT_ID` - обрабатывается в `assist-oauth.ts`
- ✅ `GOOGLE_CLIENT_SECRET` - обрабатывается в `assist-oauth.ts`
- ✅ `YANDEX_CLIENT_ID` - обрабатывается в `assist-oauth.ts`
- ✅ `YANDEX_CLIENT_SECRET` - обрабатывается в `assist-oauth.ts`
- ✅ `GITHUB_ID` - обрабатывается в `assist-oauth.ts`
- ✅ `GITHUB_SECRET` - обрабатывается в `assist-oauth.ts`
- ✅ `FACEBOOK_CLIENT_ID` - обрабатывается в `assist-oauth.ts`
- ✅ `FACEBOOK_CLIENT_SECRET` - обрабатывается в `assist-oauth.ts`
- ✅ `VK_CLIENT_ID` - обрабатывается в `assist-oauth.ts`
- ✅ `VK_CLIENT_SECRET` - обрабатывается в `assist-oauth.ts`
- ✅ `TELEGRAM_LOGIN_BOT_USERNAME` - обрабатывается в `assist-oauth.ts`
- ✅ `TELEGRAM_LOGIN_BOT_TOKEN` - обрабатывается в `assist-oauth.ts`
- ✅ `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` - обрабатывается в `assist-oauth.ts`

#### Storage Schema:
- ✅ `provider` - обрабатывается в `assist-storage.ts`
- ✅ `bucket` - обрабатывается в `assist-storage.ts`
- ✅ `region` - обрабатывается в `assist-storage.ts`
- ✅ `accessKeyId` - обрабатывается в `assist-storage.ts`
- ✅ `secretAccessKey` - обрабатывается в `assist-storage.ts`
- ✅ `endpoint` - обрабатывается в `assist-storage.ts`
- ✅ `forcePathStyle` - обрабатывается в `assist-storage.ts`
- ✅ `useLocal` - обрабатывается в `assist-storage.ts`
- ✅ `useAntivirus` - обрабатывается в `assist-storage.ts`
- ✅ `useImageManipulation` - обрабатывается в `assist-storage.ts`

#### PostgreSQL Schema:
- ✅ `POSTGRES_URL` - обрабатывается в `assist-pg.ts`
- ✅ `PGHOST` - обрабатывается в `assist-pg.ts`
- ✅ `PGPORT` - обрабатывается в `assist-pg.ts`
- ✅ `PGUSER` - обрабатывается в `assist-pg.ts`
- ✅ `PGPASSWORD` - обрабатывается в `assist-pg.ts`
- ✅ `PGDATABASE` - обрабатывается в `assist-pg.ts`
- ✅ `PGSSLMODE` - обрабатывается в `assist-pg.ts`

#### DNS Schema:
- ✅ `HASYX_DNS_DOMAIN` - обрабатывается в `assist-dns.ts`
- ✅ `CLOUDFLARE_API_TOKEN` - обрабатывается в `assist-cloudflare.ts`
- ✅ `CLOUDFLARE_ZONE_ID` - обрабатывается в `assist-cloudflare.ts`
- ✅ `LETSENCRYPT_EMAIL` - обрабатывается в `assist-cloudflare.ts`

#### Docker Schema:
- ✅ `DOCKER_CONTAINER_NAME` - обрабатывается в `assist-docker.ts`

#### GitHub Schema:
- ✅ `GITHUB_TOKEN` - обрабатывается в `assist-github.ts`
- ✅ `NEXT_PUBLIC_GITHUB_OWNER` - обрабатывается в `assist-github.ts`
- ✅ `NEXT_PUBLIC_GITHUB_REPO` - обрабатывается в `assist-github.ts`

#### Resend Schema:
- ✅ `RESEND_API_KEY` - обрабатывается в `assist-resend.ts`

#### OpenRouter Schema:
- ✅ `OPENROUTER_API_KEY` - обрабатывается в `assist-openrouter.ts`

#### Firebase Schema:
- ✅ `FIREBASE_PROJECT_ID` - обрабатывается в `assist-firebase.ts`
- ✅ `FIREBASE_CLIENT_EMAIL` - обрабатывается в `assist-firebase.ts`
- ✅ `FIREBASE_PRIVATE_KEY` - обрабатывается в `assist-firebase.ts`

#### NextAuth Secrets Schema:
- ✅ `NEXTAUTH_SECRET` - обрабатывается в `assist-auth-secrets.ts`

#### Cloudflare Schema:
- ✅ `CLOUDFLARE_API_TOKEN` - обрабатывается в `assist-cloudflare.ts`
- ✅ `CLOUDFLARE_ZONE_ID` - обрабатывается в `assist-cloudflare.ts`
- ✅ `LETSENCRYPT_EMAIL` - обрабатывается в `assist-cloudflare.ts`

#### Project User Schema:
- ✅ `PROJECT_USER_EMAIL` - обрабатывается в `assist-project-user.ts`
- ✅ `PROJECT_USER_PASSWORD` - обрабатывается в `assist-project-user.ts`

#### Vercel Schema:
- ✅ `VERCEL_TOKEN` - обрабатывается в `assist-vercel.ts`
- ✅ `VERCEL_TEAM_ID` - обрабатывается в `assist-vercel.ts`
- ✅ `VERCEL_PROJECT_NAME` - обрабатывается в `assist-vercel.ts`

#### Environment Schema:
- ✅ `NEXT_PUBLIC_APP_NAME` - обрабатывается в `assist-env.ts`
- ✅ `NEXT_PUBLIC_BASE_URL` - обрабатывается в `assist-env.ts`

#### GitHub Webhooks Schema:
- ✅ `GITHUB_WEBHOOK_SECRET` - обрабатывается в `assist-github-webhooks.ts`
- ✅ `GITHUB_WEBHOOK_URL` - обрабатывается в `assist-github-webhooks.ts`

## Дополнительные действия assist-файлов (кроме заполнения .env)

- 🔄 in progress
- ✅ assist moved to config

### 1. 🔄 `lib/assist-docker.ts`
**Дополнительные действия:**
- Проверка установки Docker
- Автоматическая установка Docker через скрипт
- Создание и управление Docker контейнерами
- Настройка Watchtower для автоматических обновлений
- Просмотр логов контейнеров
- Просмотр переменных окружения контейнеров
- Остановка и удаление контейнеров

**Предлагаемые методы:**
```typescript
// Проверка и установка Docker
await docker.checkInstall() // Проверка установки
await docker.install() // Автоматическая установка

// Управление контейнерами
await docker.createContainer(port?: string) // Создание контейнера
await docker.listContainers() // Список контейнеров
await docker.showLogs(port: string, tail?: number) // Просмотр логов
await docker.showEnv(port: string) // Просмотр переменных окружения
await docker.removeContainer(port: string) // Удаление контейнера

// Пример запроса:
await docker.createContainer('3000') // Создать контейнер на порту 3000
```

### 2. `lib/files/assist-storage.ts`
Перенесено в конфигурацию: генерация docker-compose теперь формируется из meta.compose в `lib/config.tsx`, а переменные окружения — из meta.envMapping. Дополнительных действий не требуется.

### 3. 🔄 `lib/assist-telegram.ts`
**Дополнительные действия:**
- Настройка webhook для Telegram бота
- Калибровка бота (установка команд, кнопок меню)
- Интеграция с GitHub Actions для уведомлений
- Создание кнопок меню для веб-приложения

**Предлагаемые методы:**
```typescript
// Настройка webhook
await telegram.setWebhook(url: string) // Установка webhook URL
await telegram.removeWebhook() // Удаление webhook

// Калибровка бота
await telegram.setCommands(commands: Command[]) // Установка команд
await telegram.setMenuButton(button: MenuButton) // Установка кнопки меню
await telegram.calibrate() // Полная калибровка бота

// Интеграция с GitHub
await telegram.setupGitHubIntegration() // Настройка интеграции с GitHub Actions

// Пример запроса:
await telegram.calibrate() // Полная калибровка бота с установкой команд и меню
```

### 4. `lib/assist-migrations.ts`
Удалено: миграции управляются существующими скриптами `npm run migrate`/`unmigrate` и `npx hasyx migrate`/`unmigrate` и не относятся к конфигуратору.

### 5. 🔄 `lib/assist-commit.ts`
**Дополнительные действия:**
- Автоматический коммит изменений в git
- Push изменений в удаленный репозиторий
- Проверка статуса git репозитория

**Предлагаемые методы:**
```typescript
// Управление git
await git.commit(message?: string) // Создание коммита
await git.push() // Push в удаленный репозиторий
await git.status() // Проверка статуса
await git.addAll() // Добавление всех файлов

// Комбинированные операции
await git.commitAndPush(message?: string) // Коммит и push
await git.checkAndCommit() // Проверка изменений и коммит

// Пример запроса:
await git.commitAndPush('feat: add new feature') // Коммит с сообщением и push
```

### 6. 🔄 `lib/assist-sync.ts`
**Дополнительные действия:**
- Синхронизация переменных окружения с Vercel
- Синхронизация секретов с GitHub Actions
- Линковка проекта с Vercel
- Управление переменными окружения в Vercel (production, preview, development)

**Предлагаемые методы:**
```typescript
// Синхронизация с Vercel
await sync.linkToVercel(projectName: string) // Линковка с Vercel проектом
await sync.syncToVercel() // Синхронизация переменных с Vercel
await sync.pullFromVercel() // Получение переменных из Vercel

// Синхронизация с GitHub
await sync.syncToGitHub() // Синхронизация секретов с GitHub Actions
await sync.setGitHubSecret(key: string, value: string) // Установка секрета

// Управление переменными
await sync.setVercelEnv(key: string, value: string, environment: 'production' | 'preview' | 'development') // Установка переменной в Vercel

// Пример запроса:
await sync.syncToVercel() // Синхронизировать .env с Vercel
```

### 7. 🔄 `lib/github/assist-github-auth.ts`
**Дополнительные действия:**
- Проверка аутентификации GitHub CLI
- Создание GitHub репозитория
- Настройка git remote
- Клонирование существующих репозиториев

**Предлагаемые методы:**
```typescript
// Аутентификация
await github.checkAuth() // Проверка аутентификации
await github.login() // Вход в GitHub CLI

// Управление репозиториями
await github.createRepo(name: string, isPublic?: boolean) // Создание репозитория
await github.cloneRepo(url: string) // Клонирование репозитория
await github.setRemote(url: string) // Настройка remote

// Проверки
await github.isRepo() // Проверка наличия git репозитория
await github.hasGitHubRemote() // Проверка GitHub remote

// Пример запроса:
await github.createRepo('my-project', true) // Создать публичный репозиторий
```

### 8. 🔄 `lib/github/assist-github-webhooks.ts`
**Дополнительные действия:**
- Создание документации по настройке webhooks
- Генерация случайных секретов для webhooks
- Настройка различных типов событий (issues, pull_request, push, release)
- Создание файла `GITHUB-WEBHOOKS.md` с инструкциями

**Предлагаемые методы:**
```typescript
// Генерация секретов
await webhooks.generateSecret() // Генерация случайного секрета
await webhooks.validateSecret(secret: string) // Валидация секрета

// Настройка событий
await webhooks.configureEvents(events: string[]) // Настройка типов событий
await webhooks.setDefaultEvents() // Установка событий по умолчанию

// Документация
await webhooks.createDocumentation() // Создание документации
await webhooks.updateDocumentation() // Обновление документации

// Полная настройка
await webhooks.setup() // Полная настройка webhooks

// Пример запроса:
await webhooks.setup() // Полная настройка webhooks с документацией
```

### 9. 🔄 `lib/hasyx/assist-hasyx.ts`
**Дополнительные действия:**
- Инициализация Hasyx проекта
- Запуск `npx hasyx init`
- Создание `.hasyx.lock` файла

**Предлагаемые методы:**
```typescript
// Инициализация
await hasyx.init() // Инициализация Hasyx проекта
await hasyx.checkInit() // Проверка инициализации
await hasyx.createLockFile() // Создание .hasyx.lock

// Проверки
await hasyx.isInitialized() // Проверка инициализации
await hasyx.hasLockFile() // Проверка наличия lock файла

// Пример запроса:
await hasyx.init() // Инициализировать Hasyx проект
```

### 10. 🔄 `lib/assist-env.ts`
**Дополнительные действия:**
- Настройка `package.json`
- Изменение имени проекта в package.json
- Инициализация нового package.json если не существует

**Предлагаемые методы:**
```typescript
// Управление package.json
await env.setupPackageJson(name?: string) // Настройка package.json
await env.updateProjectName(name: string) // Изменение имени проекта
await env.initPackageJson() // Инициализация нового package.json

// Проверки
await env.hasPackageJson() // Проверка наличия package.json
await env.getProjectName() // Получение имени проекта

// Настройка окружения
await env.setupEnvironment() // Настройка переменных окружения
await env.validateEnvironment() // Валидация переменных окружения

// Пример запроса:
await env.setupPackageJson('my-project') // Настроить package.json с именем проекта
```

## Заключение

**Все переменные окружения из config.tsx полностью покрыты assist-файлами.** Каждая схема из config.tsx имеет соответствующий assist-файл, который обрабатывает все переменные этой схемы.

**Дополнительные действия assist-файлов включают:**
- Управление Docker контейнерами и их жизненным циклом
- Создание конфигурационных файлов (docker-compose.yml, документация)
- Интеграция с внешними сервисами (Telegram, GitHub, Vercel)
- Автоматизация процессов разработки (коммиты, миграции, синхронизация)
- Настройка инфраструктуры (DNS, SSL, webhooks)
- Управление секретами и токенами
- Создание и настройка репозиториев
- Инициализация проектов и зависимостей

Assist-файлы предоставляют комплексное решение для настройки всего проекта, выходящее далеко за рамки простого заполнения .env файла. 

## Неиспользуемые из config.tsx

```typescript
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
});

export const pgSchema = z.object({
  POSTGRES_URL: z.string()
    .url('Please enter a valid PostgreSQL URL')
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
    .min(1, 'Please enter a valid DNS Domain')
    .describe('DNS Domain - Your primary domain for DNS management'),
  CLOUDFLARE_API_TOKEN: z.string()
    .optional()
    .describe('Cloudflare API Token - Get from https://dash.cloudflare.com/profile/api-tokens'),
  CLOUDFLARE_ZONE_ID: z.string()
    .optional()
    .describe('Cloudflare Zone ID - Get from your domain dashboard'),
  LETSENCRYPT_EMAIL: z.string()
    .email('Please enter a valid email')
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
    .min(1, 'Please enter a valid GitHub Token')
    .describe('GitHub Token - Get from https://github.com/settings/tokens'),
  NEXT_PUBLIC_GITHUB_OWNER: z.string()
    .min(1, 'Please enter a valid GitHub Owner')
    .describe('GitHub Owner - Repository owner (username or organization)'),
  NEXT_PUBLIC_GITHUB_REPO: z.string()
    .min(1, 'Please enter a valid GitHub Repository name')
    .describe('GitHub Repository - Repository name'),
});

export const resendSchema = z.object({
  RESEND_API_KEY: z.string()
    .min(1, 'Please enter a valid Resend API Key')
    .describe('Resend API Key - Get from https://resend.com/docs/api-keys'),
});

export const openrouterSchema = z.object({
  OPENROUTER_API_KEY: z.string()
    .min(1, 'Please enter a valid OpenRouter API Key')
    .describe('OpenRouter API Key - Get from https://openrouter.ai/keys'),
});

export const firebaseSchema = z.object({
  FIREBASE_PROJECT_ID: z.string()
    .min(1, 'Please enter a valid Firebase Project ID')
    .describe('Firebase Project ID - Get this from your Firebase project settings'),
  FIREBASE_CLIENT_EMAIL: z.string()
    .email('Please enter a valid email')
    .describe('Firebase Client Email - Get this from your service account JSON file'),
  FIREBASE_PRIVATE_KEY: z.string()
    .min(1, 'Please enter a valid Firebase Private Key')
    .describe('Firebase Private Key - Get this from your service account JSON file'),
});

export const nextAuthSecretsSchema = z.object({
  NEXTAUTH_SECRET: z.string()
    .min(1, 'Please enter a valid NextAuth Secret')
    .describe('NextAuth Secret - Generate a 32-byte hex string for session encryption'),
});

export const cloudflareSchema = z.object({
  CLOUDFLARE_API_TOKEN: z.string()
    .min(1, 'Please enter a valid Cloudflare API Token')
    .describe('Cloudflare API Token - Get from https://dash.cloudflare.com/profile/api-tokens'),
  CLOUDFLARE_ZONE_ID: z.string()
    .min(1, 'Please enter a valid Cloudflare Zone ID')
    .describe('Cloudflare Zone ID - Get from your domain dashboard'),
  LETSENCRYPT_EMAIL: z.string()
    .email('Please enter a valid email')
    .describe('LetsEncrypt Email - For SSL certificate notifications'),
});

export const projectUserSchema = z.object({
  PROJECT_USER_EMAIL: z.string()
    .email('Please enter a valid email')
    .describe('Project User Email - Default admin user for scripts and automation'),
  PROJECT_USER_PASSWORD: z.string()
    .min(1, 'Please enter a valid password')
    .describe('Project User Password - Default admin password for scripts'),
});

export const vercelSchema = z.object({
  VERCEL_TOKEN: z.string()
    .min(1, 'Please enter a valid Vercel Token')
    .describe('Vercel Access Token - Get from https://vercel.com/account/tokens'),
  VERCEL_TEAM_ID: z.string()
    .optional()
    .describe('Vercel Team ID - Optional, for team accounts'),
  VERCEL_PROJECT_NAME: z.string()
    .min(1, 'Please enter a valid Vercel Project Name')
    .describe('Vercel Project Name - Your project name on Vercel'),
});

export const environmentSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string()
    .min(1, 'Please enter a valid application name')
    .describe('Application Name - Display name for your application'),
  NEXT_PUBLIC_BASE_URL: z.string()
    .url('Please enter a valid URL')
    .describe('Base URL - Your application base URL'),
});

export const githubWebhooksSchema = z.object({
  GITHUB_WEBHOOK_SECRET: z.string()
    .min(1, 'Please enter a valid GitHub Webhook Secret')
    .describe('GitHub Webhook Secret - Generate a secret for webhook verification'),
  GITHUB_WEBHOOK_URL: z.string()
    .url('Please enter a valid URL')
    .describe('GitHub Webhook URL - Your webhook endpoint URL'),
});

export const configSchema = {
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
```

## Рекомендации

Эти схемы можно:
1. **Удалить** из `config.tsx` если они не нужны
2. **Вынести в отдельные файлы** для лучшей организации кода
3. **Интегрировать в hasyxConfig** если они нужны для конфигурации
4. **Оставить как есть** если они используются в других частях системы

Все эти схемы полностью покрыты assist-файлами и могут быть безопасно удалены из `config.tsx` для упрощения структуры. 
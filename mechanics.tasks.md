# План выноса операционного функционала assist в классы mechanics

Документ описывает, как вынести все операции (не связанные с .env) из assist-слоя в самостоятельные классы в директории `lib/<domain>/mechanic.ts`, какие ENV переменные будут приниматься конструкторами, какие методы появятся и где именно будут заменены текущие реализации на вызовы классов.

## Базовая инфраструктура (core)
- **Назначение**: единые обёртки для CLI, файловой системы, логгера, типизированного результата и базового класса механик.
- **Файлы** (создать позже):
  - `lib/core/shell.ts` — безопасный раннер команд (spawn/exec, timeout, env injection, dry-run)
  - `lib/core/filesystem.ts` — работа с FS (чтение/запись JSON/YAML/MD, атомарные записи)
  - `lib/core/logger.ts` — унифицированный логгер
  - `lib/core/result.ts` — `Result<T>` для успешных/ошибочных исходов
  - `lib/core/base-mechanic.ts` — базовый абстрактный класс, DI: Shell, FileSystem, Logger

## Docker
- **Сущность**: управление Docker (проверка/установка, контейнеры, логи, env, Watchtower).
- **ENV для конструктора**:
  - `DOCKER_CONTAINER_NAME?`
- **Конструктор**: `new DockerMechanic({ containerName?: string })`
- **Методы класса**:
  - `checkInstall()`
  - `install()`
  - `createContainer(port?: string)`
  - `listContainers()`
  - `showLogs(port: string, tail?: number)`
  - `showEnv(port: string)`
  - `removeContainer(port: string)`
  - `stopContainer(port: string)`
  - `setupWatchtower()`
- **Где заменить**:
  - `lib/assist-docker.ts` — заменить текущие операции на вызовы `DockerMechanic`.

## Storage (files)
- **Сущность**: генерация `docker-compose.yml`, миграций и документации; настройка MinIO; конфигурация S3-совместимых провайдеров.
- **ENV для конструктора**:
  - `provider`, `bucket`, `region?`, `accessKeyId?`, `secretAccessKey?`, `endpoint?`, `forcePathStyle?`, `useLocal`, `useAntivirus?`, `useImageManipulation?`
- **Конструктор**: 
  - `new StorageMechanic({ provider, bucket, region, accessKeyId, secretAccessKey, endpoint, forcePathStyle, useLocal, useAntivirus, useImageManipulation })`
- **Методы класса**:
  - `createDockerCompose()`
  - `createMigrations()`
  - `createDocumentation()`
  - `configureLocal()`
  - `configureCloud(provider)`
- **Где заменить**:
  - `lib/files/assist-storage.ts` — делегировать операции в `StorageMechanic`.

## Telegram Bot
- **Сущность**: webhook, команды, кнопка меню, калибровка, интеграция с GitHub Actions.
- **ENV для конструктора**:
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_NAME`, `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?`
- **Конструктор**: `new TelegramMechanic({ botToken, botName, publicBotUsername? })`
- **Методы класса**:
  - `setWebhook(url)`
  - `removeWebhook()`
  - `setCommands(commands)`
  - `setMenuButton(button)`
  - `calibrate()`
  - `setupGitHubIntegration()`
- **Где заменить**:
  - `lib/assist-telegram.ts` — перенаправить операции в `TelegramMechanic`.

## Hasura Migrations/Metadata
- **Сущность**: миграции и метаданные Hasura, статус, перезагрузка remote schemas, проверка Hasura CLI.
- **ENV для конструктора**:
  - `NEXT_PUBLIC_HASURA_GRAPHQL_URL`, `HASURA_ADMIN_SECRET`, `HASURA_JWT_SECRET?`, `HASURA_EVENT_SECRET?`
- **Конструктор**: `new MigrationsMechanic({ hasuraUrl, adminSecret, jwtSecret?, eventSecret? })`
- **Методы класса**:
  - `apply()`
  - `rollback()`
  - `status()`
  - `applyMetadata()`
  - `reloadRemoteSchemas()`
  - `checkHasuraCLI()`
- **Где заменить**:
  - `lib/assist-migrations.ts` — заменить shell-интеграции на вызовы `MigrationsMechanic`.

## Git (commit/push)
- **Сущность**: локальные операции git и push.
- **ENV для конструктора**:
  - `GIT_AUTHOR_NAME?`, `GIT_AUTHOR_EMAIL?` (опционально)
- **Конструктор**: `new GitMechanic({ authorName?, authorEmail? })`
- **Методы класса**:
  - `status()`
  - `addAll()`
  - `commit(message?)`
  - `push()`
  - `commitAndPush(message?)`
  - `checkAndCommit()`
- **Где заменить**:
  - `lib/assist-commit.ts` — делегировать вызовы в `GitMechanic`.

## Sync (Vercel/GitHub secrets)
- **Сущность**: линковка проекта с Vercel, синхронизация переменных окружения с Vercel, синхронизация секретов GitHub Actions, установка отдельных env.
- **ENV для конструктора**:
  - Vercel: `VERCEL_TOKEN`, `VERCEL_TEAM_ID?`, `VERCEL_PROJECT_NAME`
  - GitHub: `GITHUB_TOKEN`, `NEXT_PUBLIC_GITHUB_OWNER`, `NEXT_PUBLIC_GITHUB_REPO`
- **Конструктор**: 
  - `new SyncMechanic({ vercelToken, vercelTeamId?, vercelProjectName, githubToken, githubOwner, githubRepo })`
- **Методы класса**:
  - `linkToVercel(projectName)`
  - `syncToVercel()`
  - `pullFromVercel()`
  - `syncToGitHub()`
  - `setGitHubSecret(key, value)`
  - `setVercelEnv(key, value, environment)`
- **Где заменить**:
  - `lib/assist-sync.ts` — перенаправить в `SyncMechanic`.

## GitHub Auth/Repo
- **Сущность**: аутентификация gh-cli, создание/клонирование репозитория, настройка remote, проверки.
- **ENV для конструктора**:
  - `GITHUB_TOKEN`, `NEXT_PUBLIC_GITHUB_OWNER?`, `NEXT_PUBLIC_GITHUB_REPO?`
- **Конструктор**: `new GitHubAuthMechanic({ githubToken, owner?, repo? })`
- **Методы класса**:
  - `checkAuth()`
  - `login()`
  - `createRepo(name, isPublic?)`
  - `cloneRepo(url)`
  - `setRemote(url)`
  - `isRepo()`
  - `hasGitHubRemote()`
- **Где заменить**:
  - `lib/github/assist-github-auth.ts` и `lib/github/assist-github.ts` — делегировать в `GitHubAuthMechanic`.

## GitHub Webhooks
- **Сущность**: генерация/валидация секрета, настройка событий, документация, полная настройка.
- **ENV для конструктора**:
  - `GITHUB_TOKEN`, `NEXT_PUBLIC_GITHUB_OWNER`, `NEXT_PUBLIC_GITHUB_REPO`, `GITHUB_WEBHOOK_SECRET?`, `GITHUB_WEBHOOK_URL?`
- **Конструктор**: `new GitHubWebhooksMechanic({ githubToken, owner, repo, defaultSecret?, defaultUrl? })`
- **Методы класса**:
  - `generateSecret()`
  - `validateSecret(secret)`
  - `configureEvents(events)`
  - `setDefaultEvents()`
  - `createDocumentation()`
  - `updateDocumentation()`
  - `setup()`
- **Где заменить**:
  - `lib/github/assist-github-webhooks.ts` — маршрутизировать в `GitHubWebhooksMechanic`.

## Hasyx Init
- **Сущность**: инициализация проекта через `npx hasyx init`, создание `.hasyx.lock`, проверки.
- **ENV для конструктора**:
  - без обязательных; опционально путь проекта
- **Конструктор**: `new HasyxMechanic({ projectRoot? })`
- **Методы класса**:
  - `init()`
  - `checkInit()`
  - `createLockFile()`
  - `isInitialized()`
  - `hasLockFile()`
- **Где заменить**:
  - `lib/hasyx/assist-hasyx.ts` — заменить локальные вызовы/скрипты на методы `HasyxMechanic`.

## Env/Package
- **Сущность**: управление `package.json`, имя проекта, базовая настройка окружения и валидация.
- **ENV для конструктора**:
  - `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_BASE_URL`
- **Конструктор**: `new EnvMechanic({ appName, baseUrl })`
- **Методы класса**:
  - `setupPackageJson(name?)`
  - `updateProjectName(name)`
  - `initPackageJson()`
  - `hasPackageJson()`
  - `getProjectName()`
  - `setupEnvironment()`
  - `validateEnvironment()`
- **Где заменить**:
  - `lib/assist-env.ts` — делегировать соответствующие операции в `EnvMechanic`.

## Дополнительно (Cloudflare/DNS — позже)
- **Сущность**: управление DNS/SSL.
- **ENV для конструктора**:
  - `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_ID`, `LETSENCRYPT_EMAIL`, `HASYX_DNS_DOMAIN`
- **Класс**: `DnsMechanic`/`CloudflareMechanic` (определить при реализации)
- **Где заменить**:
  - `lib/cloudflare/assist-cloudflare.ts`, `lib/cloudflare/assist-dns.ts`

---

## Полный список запланированных правок

1) Добавить классы (файлы создать позже, без изменения внешних API ассистов):
   - `lib/docker/mechanic.ts` — `DockerMechanic`
   - `lib/storage/mechanic.ts` — `StorageMechanic`
   - `lib/telegram/mechanic.ts` — `TelegramMechanic`
   - `lib/migrations/mechanic.ts` — `MigrationsMechanic`
   - `lib/git/mechanic.ts` — `GitMechanic`
   - `lib/sync/mechanic.ts` — `SyncMechanic`
   - `lib/github/auth/mechanic.ts` — `GitHubAuthMechanic`
   - `lib/github/webhooks/mechanic.ts` — `GitHubWebhooksMechanic`
   - `lib/hasyx/mechanic.ts` — `HasyxMechanic`
   - `lib/env/mechanic.ts` — `EnvMechanic`

2) Внедрить core-утилиты (создать позже):
   - `lib/core/shell.ts`, `lib/core/filesystem.ts`, `lib/core/logger.ts`, `lib/core/result.ts`, `lib/core/base-mechanic.ts`

3) В ассист-файлах заменить реализацию операций на делегацию методам классов (внешние API ассистов оставить неизменными):
   - `lib/assist-docker.ts` → `DockerMechanic`
   - `lib/files/assist-storage.ts` → `StorageMechanic`
   - `lib/assist-telegram.ts` → `TelegramMechanic`
   - `lib/assist-migrations.ts` → `MigrationsMechanic`
   - `lib/assist-commit.ts` → `GitMechanic`
   - `lib/assist-sync.ts` → `SyncMechanic`
   - `lib/github/assist-github-auth.ts`, `lib/github/assist-github.ts` → `GitHubAuthMechanic`
   - `lib/github/assist-github-webhooks.ts` → `GitHubWebhooksMechanic`
   - `lib/hasyx/assist-hasyx.ts` → `HasyxMechanic`
   - `lib/assist-env.ts` → `EnvMechanic`

4) Общие требования к реализации:
   - Идемпотентность методов (проверка состояния до изменений)
   - Безопасность CLI-вызовов (timeouts, проверка наличия бинарей, dry-run)
   - Единый логгер и формат ошибок
   - Возврат через `Result<T>` без бросания ожидаемых ошибок
   - Ассист-слой занимается только валидацией входов и маршрутизацией к механикам


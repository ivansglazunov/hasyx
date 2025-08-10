# Config Tasks - План автоматической регенерации .env

## Цель
При любом изменении в `hasyx.config.json` должна происходить автоматическая регенерация `.env` файла на основе выбранного варианта конфигурации.

## Анализ текущего состояния

### Существующие файлы:
- `hasyx.config.json` - новая система конфигурации
- `.env.backup` - резервная копия всех переменных окружения (99 строк)
- `env.template` - шаблон для создания .env файла
- `lib/config.tsx` - схемы конфигурации
- `lib/ink.tsx` - UI для управления конфигурацией

### Структура hasyx.config.json:
```json
{
  "variant": "local",           // текущий выбранный вариант
  "variants": {                 // варианты конфигурации
    "local": {
      "host": "local",          // ссылка на хост
      "hasura": "prod"          // ссылка на hasura конфигурацию
    }
  },
  "hosts": {                    // конфигурации хостов
    "local": {
      "port": 3004,
      "url": "http://localhost:3004",
      "clientOnly": false
    }
  },
  "hasura": {                   // конфигурации hasura
    "prod": {
      "url": "https://hasura.deep.foundation/v1/graphql",
      "secret": "myadminsecretkey",
      "jwtSecret": "...",
      "eventSecret": "..."
    }
  }
}
```

## План реализации

### Этап 1: Создание базового генератора .env

#### 1.1 Создать `lib/config.env.tsx`:
- Функция для генерации .env на основе выбранного варианта
- Базовый маппинг для hasura и host конфигураций
- Тестирование на существующем hasyx.config.json

#### 1.2 Протестировать генерацию .env:
- ✅ Сгенерировать .env на основе текущего hasyx.config.json
- ✅ Сравнить с .env.backup
- ✅ Убедиться что все hasura и host переменные корректны
- ✅ Генератор работает правильно и создает структурированный .env файл

### Этап 2: Пошаговое добавление схем

#### 2.1 Добавить поддержку Telegram схемы:
- ✅ Добавить маппинг для telegramSchema в config.env.tsx
- ✅ Протестировать генерацию .env с telegram переменными
- ✅ Проверить корректность против .env.backup
- ✅ Telegram поддержка работает корректно

#### 2.2 Добавить поддержку OAuth схемы:
- ✅ Добавить маппинг для oauthSchema в config.env.tsx
- ✅ Протестировать генерацию .env с oauth переменными
- ✅ Проверить корректность против .env.backup
- ✅ OAuth поддержка работает корректно

#### 2.3 Добавить поддержку Storage схемы:
- Добавить маппинг для storageSchema в config.env.tsx
- Протестировать генерацию .env с storage переменными
- Проверить корректность против .env.backup

#### 2.4 Добавить поддержку PostgreSQL схемы:
- Добавить маппинг для pgSchema в config.env.tsx
- Протестировать генерацию .env с pg переменными
- Проверить корректность против .env.backup

#### 2.5 Добавить поддержку DNS схемы:
- Добавить маппинг для dnsSchema в config.env.tsx
- Протестировать генерацию .env с dns переменными
- Проверить корректность против .env.backup

#### 2.6 Добавить поддержку GitHub схемы:
- Добавить маппинг для githubSchema в config.env.tsx
- Протестировать генерацию .env с github переменными
- Проверить корректность против .env.backup

#### 2.7 Добавить поддержку Resend схемы:
- Добавить маппинг для resendSchema в config.env.tsx
- Протестировать генерацию .env с resend переменными
- Проверить корректность против .env.backup

#### 2.8 Добавить поддержку OpenRouter схемы:
- Добавить маппинг для openrouterSchema в config.env.tsx
- Протестировать генерацию .env с openrouter переменными
- Проверить корректность против .env.backup

#### 2.9 Добавить поддержку Firebase схемы:
- Добавить маппинг для firebaseSchema в config.env.tsx
- Протестировать генерацию .env с firebase переменными
- Проверить корректность против .env.backup

#### 2.10 Добавить поддержку NextAuth схемы:
- Добавить маппинг для nextAuthSecretsSchema в config.env.tsx
- Протестировать генерацию .env с nextAuth переменными
- Проверить корректность против .env.backup

#### 2.11 Добавить поддержку Cloudflare схемы:
- Добавить маппинг для cloudflareSchema в config.env.tsx
- Протестировать генерацию .env с cloudflare переменными
- Проверить корректность против .env.backup

#### 2.12 Добавить поддержку Project User схемы:
- Добавить маппинг для projectUserSchema в config.env.tsx
- Протестировать генерацию .env с projectUser переменными
- Проверить корректность против .env.backup

#### 2.13 Добавить поддержку Vercel схемы:
- Добавить маппинг для vercelSchema в config.env.tsx
- Протестировать генерацию .env с vercel переменными
- Проверить корректность против .env.backup

#### 2.14 Добавить поддержку Environment схемы:
- Добавить маппинг для environmentSchema в config.env.tsx
- Протестировать генерацию .env с environment переменными
- Проверить корректность против .env.backup

#### 2.15 Добавить поддержку GitHub Webhooks схемы:
- Добавить маппинг для githubWebhooksSchema в config.env.tsx
- Протестировать генерацию .env с githubWebhooks переменными
- Проверить корректность против .env.backup

### Этап 3: Интеграция с UI

#### 3.1 Интегрировать с ink.tsx:
- Добавить автоматическую регенерацию .env при изменениях
- Показывать уведомления о сгенерированных переменных

### Этап 4: Очистка config.tsx

#### 4.1 Удалить все схемы после hasuraSchema:
- Удалить все схемы из config.tsx
- Оставить только `hasuraSchema` и `hasyxConfig`
- Обновить импорты в ink.tsx

#### 2.2 Определить маппинг конфигураций:
```typescript
// Маппинг для hasura конфигурации
const hasuraMapping = {
  url: 'NEXT_PUBLIC_HASURA_GRAPHQL_URL',
  secret: 'HASURA_ADMIN_SECRET', 
  jwtSecret: 'HASURA_JWT_SECRET',
  eventSecret: 'HASURA_EVENT_SECRET'
};

// Маппинг для host конфигурации
const hostMapping = {
  port: 'PORT',
  url: 'NEXT_PUBLIC_MAIN_URL',
  clientOnly: 'NEXT_PUBLIC_CLIENT_ONLY'
};
```

### Этап 3: Интеграция с существующими схемами

#### 3.1 Поддержка всех переменных из assist-to-config.md:
**Основные схемы (остаются в config.tsx):**
- `hasuraSchema` - Hasura конфигурация (остается в config.tsx)

**Переменные из assist-файлов (переносятся в env-generator.tsx):**
- **Telegram**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_NAME`
- **OAuth**: `GOOGLE_CLIENT_ID/SECRET`, `YANDEX_CLIENT_ID/SECRET`, `GITHUB_ID/SECRET`, `FACEBOOK_CLIENT_ID/SECRET`, `VK_CLIENT_ID/SECRET`, `TELEGRAM_LOGIN_BOT_USERNAME/TOKEN`
- **Storage**: `STORAGE_BACKEND`, `STORAGE_S3_BUCKET`, `STORAGE_S3_REGION`, `STORAGE_S3_ACCESS_KEY_ID`, `STORAGE_S3_SECRET_ACCESS_KEY`, `STORAGE_S3_ENDPOINT`, `STORAGE_S3_FORCE_PATH_STYLE`
- **PostgreSQL**: `POSTGRES_URL`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGSSLMODE`
- **DNS**: `HASYX_DNS_DOMAIN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_ID`, `LETSENCRYPT_EMAIL`
- **Docker**: `DOCKER_CONTAINER_NAME`
- **GitHub**: `GITHUB_TOKEN`, `NEXT_PUBLIC_GITHUB_OWNER`, `NEXT_PUBLIC_GITHUB_REPO`
- **Resend**: `RESEND_API_KEY`
- **OpenRouter**: `OPENROUTER_API_KEY`
- **Firebase**: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- **NextAuth**: `NEXTAUTH_SECRET`
- **Cloudflare**: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_ID`, `LETSENCRYPT_EMAIL`
- **Project User**: `PROJECT_USER_EMAIL`, `PROJECT_USER_PASSWORD`
- **Vercel**: `VERCEL_TOKEN`, `VERCEL_TEAM_ID`, `VERCEL_PROJECT_NAME`
- **Environment**: `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_BASE_URL`
- **GitHub Webhooks**: `GITHUB_WEBHOOK_SECRET`, `GITHUB_WEBHOOK_URL`

#### 3.2 Создать маппинги для каждой схемы:
```typescript
// Основные маппинги (остаются в config.tsx)
const hasuraMapping = {
  url: 'NEXT_PUBLIC_HASURA_GRAPHQL_URL',
  secret: 'HASURA_ADMIN_SECRET', 
  jwtSecret: 'HASURA_JWT_SECRET',
  eventSecret: 'HASURA_EVENT_SECRET'
};

// Маппинги для assist-переменных (переносятся в env-generator.tsx)
const assistMappings = {
  // Telegram
  telegram: {
    TELEGRAM_BOT_TOKEN: 'TELEGRAM_BOT_TOKEN',
    TELEGRAM_BOT_NAME: 'TELEGRAM_BOT_NAME',
  },
  
  // OAuth
  oauth: {
    GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_ID',
    GOOGLE_CLIENT_SECRET: 'GOOGLE_CLIENT_SECRET',
    YANDEX_CLIENT_ID: 'YANDEX_CLIENT_ID',
    YANDEX_CLIENT_SECRET: 'YANDEX_CLIENT_SECRET',
    GITHUB_ID: 'GITHUB_ID',
    GITHUB_SECRET: 'GITHUB_SECRET',
    FACEBOOK_CLIENT_ID: 'FACEBOOK_CLIENT_ID',
    FACEBOOK_CLIENT_SECRET: 'FACEBOOK_CLIENT_SECRET',
    VK_CLIENT_ID: 'VK_CLIENT_ID',
    VK_CLIENT_SECRET: 'VK_CLIENT_SECRET',
    TELEGRAM_LOGIN_BOT_USERNAME: 'TELEGRAM_LOGIN_BOT_USERNAME',
    TELEGRAM_LOGIN_BOT_TOKEN: 'TELEGRAM_LOGIN_BOT_TOKEN'
  },
  
  // Storage
  storage: {
    STORAGE_BACKEND: 'STORAGE_BACKEND',
    STORAGE_S3_BUCKET: 'STORAGE_S3_BUCKET',
    STORAGE_S3_REGION: 'STORAGE_S3_REGION',
    STORAGE_S3_ACCESS_KEY_ID: 'STORAGE_S3_ACCESS_KEY_ID',
    STORAGE_S3_SECRET_ACCESS_KEY: 'STORAGE_S3_SECRET_ACCESS_KEY',
    STORAGE_S3_ENDPOINT: 'STORAGE_S3_ENDPOINT',
    STORAGE_S3_FORCE_PATH_STYLE: 'STORAGE_S3_FORCE_PATH_STYLE'
  },
  
  // PostgreSQL
  pg: {
    POSTGRES_URL: 'POSTGRES_URL',
    PGHOST: 'PGHOST',
    PGPORT: 'PGPORT',
    PGUSER: 'PGUSER',
    PGPASSWORD: 'PGPASSWORD',
    PGDATABASE: 'PGDATABASE',
    PGSSLMODE: 'PGSSLMODE'
  },
  
  // DNS
  dns: {
    HASYX_DNS_DOMAIN: 'HASYX_DNS_DOMAIN',
    CLOUDFLARE_API_TOKEN: 'CLOUDFLARE_API_TOKEN',
    CLOUDFLARE_ZONE_ID: 'CLOUDFLARE_ZONE_ID',
    LETSENCRYPT_EMAIL: 'LETSENCRYPT_EMAIL'
  },
  
  // GitHub
  github: {
    GITHUB_TOKEN: 'GITHUB_TOKEN',
    NEXT_PUBLIC_GITHUB_OWNER: 'NEXT_PUBLIC_GITHUB_OWNER',
    NEXT_PUBLIC_GITHUB_REPO: 'NEXT_PUBLIC_GITHUB_REPO'
  },
  
  // Resend
  resend: {
    RESEND_API_KEY: 'RESEND_API_KEY'
  },
  
  // OpenRouter
  openrouter: {
    OPENROUTER_API_KEY: 'OPENROUTER_API_KEY'
  },
  
  // Firebase
  firebase: {
    FIREBASE_PROJECT_ID: 'FIREBASE_PROJECT_ID',
    FIREBASE_CLIENT_EMAIL: 'FIREBASE_CLIENT_EMAIL',
    FIREBASE_PRIVATE_KEY: 'FIREBASE_PRIVATE_KEY'
  },
  
  // NextAuth
  nextAuth: {
    NEXTAUTH_SECRET: 'NEXTAUTH_SECRET'
  },
  
  // Project User
  projectUser: {
    PROJECT_USER_EMAIL: 'PROJECT_USER_EMAIL',
    PROJECT_USER_PASSWORD: 'PROJECT_USER_PASSWORD'
  },
  
  // Vercel
  vercel: {
    VERCEL_TOKEN: 'VERCEL_TOKEN',
    VERCEL_TEAM_ID: 'VERCEL_TEAM_ID',
    VERCEL_PROJECT_NAME: 'VERCEL_PROJECT_NAME'
  },
  
  // Environment
  environment: {
    NEXT_PUBLIC_APP_NAME: 'NEXT_PUBLIC_APP_NAME',
    NEXT_PUBLIC_BASE_URL: 'NEXT_PUBLIC_BASE_URL'
  },
  
  // GitHub Webhooks
  githubWebhooks: {
    GITHUB_WEBHOOK_SECRET: 'GITHUB_WEBHOOK_SECRET',
    GITHUB_WEBHOOK_URL: 'GITHUB_WEBHOOK_URL'
  }
};
```

### Этап 4: Система разрешения ссылок

#### 4.1 Реализовать разрешение ссылок в вариантах:
```typescript
function resolveVariant(variant: string, config: any) {
  const variantConfig = config.variants[variant];
  const hostConfig = config.hosts[variantConfig.host];
  const hasuraConfig = config.hasura[variantConfig.hasura];
  
  return {
    host: hostConfig,
    hasura: hasuraConfig,
    // другие конфигурации по мере добавления
  };
}
```

#### 4.2 Поддержка вложенных конфигураций:
- Варианты могут ссылаться на другие конфигурации
- Автоматическое разрешение всех ссылок
- Поддержка циклических зависимостей

### Этап 5: Генерация .env файла

#### 5.1 Создать функцию генерации:
```typescript
function generateEnvFile(config: any, variant: string): string {
  const resolvedConfig = resolveVariant(variant, config);
  const envVars = [];
  
  // Генерируем переменные для каждой секции
  for (const [section, mapping] of Object.entries(schemaMappings)) {
    if (resolvedConfig[section]) {
      for (const [configKey, envKey] of Object.entries(mapping)) {
        if (resolvedConfig[section][configKey]) {
          envVars.push(`${envKey}=${resolvedConfig[section][configKey]}`);
        }
      }
    }
  }
  
  return envVars.join('\n');
}
```

#### 5.2 Поддержка комментариев и структуры:
- Добавить заголовки секций как в env.template
- Поддержка опциональных переменных
- Сохранение пользовательских переменных

### Этап 6: Интеграция с UI

#### 6.1 Автоматическая регенерация при изменениях:
```typescript
// В ink.tsx при изменении конфигурации
const handleConfigChange = (newConfig: any) => {
  // Сохраняем конфигурацию
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
  
  // Регенерируем .env
  const envContent = generateEnvFile(newConfig, newConfig.variant);
  fs.writeFileSync('.env', envContent);
};
```

#### 6.2 Уведомления пользователю:
- Показывать какие переменные были изменены
- Предупреждать о конфликтах
- Возможность отката изменений

### Этап 7: Миграция существующих данных

#### 7.1 Создать миграционный скрипт:
```typescript
function migrateFromEnvBackup() {
  const envBackup = parseEnvFile('.env.backup');
  const config = loadHasyxConfig();
  
  // Маппинг существующих переменных в новую структуру
  // Создание вариантов на основе существующих данных
  // Сохранение в hasyx.config.json
}
```

#### 7.2 Поддержка обратной совместимости:
- Возможность импорта из .env.backup
- Экспорт в старый формат
- Валидация существующих данных

### Этап 8: Тестирование и валидация

#### 8.1 Создать тесты:
```typescript
describe('ENV Generator', () => {
  it('should generate correct env from hasura config', () => {
    const config = { /* test config */ };
    const env = generateEnvFile(config, 'test');
    expect(env).toContain('NEXT_PUBLIC_HASURA_GRAPHQL_URL=');
  });
  
  it('should resolve variant references correctly', () => {
    // тест разрешения ссылок
  });
  
  it('should preserve user custom variables', () => {
    // тест сохранения пользовательских переменных
  });
});
```

#### 8.2 Валидация сгенерированного .env:
- Проверка всех обязательных переменных
- Валидация форматов (URL, JSON, etc.)
- Проверка отсутствия конфликтов

## Приоритеты реализации

### Высокий приоритет:
1. ✅ **Создать `lib/config.env.tsx`** - базовый генератор .env
2. ✅ **Протестировать генерацию** на существующем hasyx.config.json
3. ✅ **Пошагово добавить схемы** - по одной схеме с тестированием
4. ✅ **Интегрировать с ink.tsx** - автоматическая регенерация
5. ✅ **Очистить config.tsx** - только после полного тестирования

### Средний приоритет:
5. ✅ Поддержка всех схем из config.tsx
6. ✅ Система разрешения ссылок
7. ✅ Миграция из .env.backup

### Низкий приоритет:
8. ✅ Расширенная валидация
9. ✅ Поддержка пользовательских переменных
10. ✅ Тесты и документация

## Следующие шаги

1. **Создать `lib/config.env.tsx`** - базовый генератор .env
2. **Протестировать генерацию** на существующем hasyx.config.json
3. **Добавить поддержку Telegram** - первая схема для тестирования
4. **Добавить поддержку OAuth** - вторая схема для тестирования
5. **Продолжить по схеме** - по одной схеме с тестированием
6. **Интегрировать с ink.tsx** - автоматическая регенерация
7. **Очистить config.tsx** - только после полного тестирования

## Вопросы для обсуждения

1. **Структура маппингов** - как лучше организовать маппинг конфигураций в ENV переменные?
2. **Пользовательские переменные** - как сохранять переменные, не входящие в схемы?
3. **Валидация** - какие проверки нужны для сгенерированного .env?
4. **Миграция** - как лучше мигрировать из .env.backup?
5. **Обратная совместимость** - нужно ли поддерживать старый формат?

## Ожидаемый результат

После реализации система должна:
- Автоматически генерировать .env при изменении hasyx.config.json
- Поддерживать все существующие переменные из .env.backup
- Предоставлять удобный UI для управления конфигурацией
- Обеспечивать валидацию и безопасность данных
- Поддерживать расширение новыми схемами 
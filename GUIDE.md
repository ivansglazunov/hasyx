# Полное руководство по Hasyx

> **Modern full-stack framework с интегрированными GraphQL, AI и бесшовным development experience**

Hasyx — это комплексный фреймворк, объединяющий Next.js 15, Hasura GraphQL Engine и мощные паттерны аутентификации для ускорения разработки приложений. Он предоставляет полный инструментарий для создания современных веб-приложений с real-time возможностями, AI интеграцией и enterprise-grade функциями.

## 🎯 Что такое Hasyx

**Коротко:** «Next.js + Hasura + Auth + CLI + PWA + платежи + AI» — запускаем production за часы, без изобретения велосипеда.

Hasyx устраняет сложности интеграции современного tech stack'а, предоставляя:
- ✅ **Безопасный GraphQL прокси** к Hasura без экспозиции секретов
- ✅ **JWT-based аутентификацию** через NextAuth.js
- ✅ **Real-time подписки** через WebSocket
- ✅ **Динамический генератор запросов** для Hasura
- ✅ **Автоматизированные миграции БД**
- ✅ **AI-ассистента** с возможностью выполнения кода
- ✅ **PWA поддержку** с push уведомлениями
- ✅ **Комплексную систему логирования**
- ✅ **Управление поддоменами** с автоматическим SSL
- ✅ **Docker контейнеризацию** с мульти-архитектурной поддержкой

**Демо:** [https://hasyx.vercel.app/](https://hasyx.vercel.app/)
**Репозиторий:** [https://github.com/ivansglazunov/hasyx](https://github.com/ivansglazunov/hasyx)

## 👥 Для кого и зачем

### Целевая аудитория
- **Стартапы и команды** — создание MVP за минимальное время
- **Enterprise разработчики** — внутренние инструменты с enterprise-grade возможностями  
- **DevOps инженеры** — быстрый деплой с готовой CI/CD инфраструктурой
- **AI/ML команды** — интеграция ИИ в веб-приложения

### Ключевые случаи использования

| Сценарий | Описание |
|----------|----------|
| **SaaS MVP** | Быстрый старт B2B/B2C продукта с аутентификацией, платежами и уведомлениями |
| **Внутренние инструменты** | Админки, дашборды, системы мониторинга с real-time обновлениями |
| **API-first продукты** | GraphQL API с автогенерацией типов и готовой документацией |
| **AI-powered приложения** | Интеграция LLM с возможностью выполнения кода и анализом данных |
| **Мобильные приложения** | PWA или нативные приложения через Capacitor |
| **Telegram боты/WebApps** | Интеграция с Telegram API и WebApp |

### Hasyx vs разработка с нуля

| Аспект | С нуля | Hasyx |
|--------|--------|-------|
| **Время до MVP** | 2-6 месяцев | 1-2 недели |
| **Настройка инфраструктуры** | Weeks | Minutes |
| **Интеграция аутентификации** | Days | Ready |
| **GraphQL + TypeScript** | Complex setup | Auto-generated |
| **Real-time функции** | Manual WebSocket setup | Built-in |
| **CI/CD pipeline** | Manual configuration | Auto-configured |
| **Безопасность** | Manual implementation | Enterprise-grade |

## 🏗️ Архитектура

### Основные компоненты

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   Infrastructure│
│                 │    │                  │    │                 │
│ • Next.js 15    │◄──►│ • GraphQL Proxy  │◄──►│ • Hasura Engine │
│ • React 19      │    │ • NextAuth.js    │    │ • PostgreSQL    │
│ • Apollo Client │    │ • API Routes     │    │ • Redis Cache   │
│ • PWA Support   │    │ • Webhooks       │    │ • Docker        │
│ • TypeScript    │    │ • File Storage   │    │ • nginx/SSL     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                        │
         └───────────────────────┼────────────────────────┘
                                 │
                    ┌──────────────────┐
                    │ External Services│
                    │                  │
                    │ • OpenRouter AI  │
                    │ • Firebase FCM   │
                    │ • TBank Payments │
                    │ • Telegram Bot   │
                    │ • CloudFlare DNS │
                    └──────────────────┘
```

### Ключевые технические решения

- **Multi-layered архитектура** с четким разделением presentation, business logic и data слоев
- **Proxy Pattern** для защищенного доступа к Hasura endpoints
- **Factory Pattern** для создания терминалов и клиентов
- **Command Pattern** для CLI команд
- **Observer Pattern** для event triggers и подписок
- **Provider Pattern** для state management (HasyxProvider)

## 🚀 Быстрый старт

### Предварительные требования
```bash
# Node.js 22+
node --version  # должно быть ≥ 22.14

# npm, yarn или pnpm
npm --version
```

### 1. Установка

```bash
npm install hasyx
# Обновление на новую версию
npm install hasyx@latest
```

### 2. Инициализация

```bash
# Инициализация Hasyx в проекте
npx hasyx init
# Обновление, при отстутствии git изменений
npx hasyx init --force
```

Эта команда создает:
- 📁 **API routes** (`app/api/`) для GraphQL, auth, events
- 📁 **Компоненты** (`components/`) UI элементы и layouts
- 📁 **Миграции** (`migrations/`) для управления схемой БД
- 📁 **Events** (`events/`) конфигурации Hasura triggers
- 📄 **Конфигурация** TypeScript, Jest, Docker, GitHub Actions
- 📄 **Диагностические страницы** (`app/hasyx/`) для отладки

### 3. Конфигурация

```bash
# Интерактивная настройка
npx hasyx config

# Или автоматическая ргенерация из hasyx.config.json без интерактивной настройки
npx hasyx config --silent
```

**Важно:** Все параметры окружения управляются через `hasyx.config.json`. Файлы `.env` и `docker-compose.yml` автогенерируются и **не должны редактироваться вручную**.

### 4. Запуск

```bash
# Development сервер
npx hasyx dev

# Production build
npx hasyx build
npx hasyx start

# Docker deployment
npx hasyx docker define 3000
```

## ⚙️ Система конфигурации

### Концепция

Вся мощь Hasyx заключается в централизованной системе конфигурации. Все настройки хранятся в `hasyx.config.json`, а файлы `.env` и `docker-compose.yml` автоматически генерируются.

### Структура hasyx.config.json

```json
{
  "variant": "development", // активный вариант конфигурации
  "variants": {
    "development": {
      "database": "local_postgres",
      "auth": "credentials_google",
      "storage": "local_minio",
      "ai": "openrouter"
    },
    "production": {
      "database": "hasura_cloud",
      "auth": "google_yandex",
      "storage": "aws_s3",
      "ai": "openrouter_ollama"
    }
  },
  "database": {
    "local_postgres": {
      "POSTGRES_URL": "postgresql://postgres:password@localhost:5432/hasyx",
      "HASURA_ADMIN_SECRET": "admin_secret_dev"
    },
    "hasura_cloud": {
      "NEXT_PUBLIC_HASURA_GRAPHQL_URL": "https://your-app.hasura.app/v1/graphql",
      "HASURA_ADMIN_SECRET": "your_cloud_secret"
    }
  },
  "auth": {
    "credentials_google": {
      "NEXTAUTH_SECRET": "your_nextauth_secret",
      "GOOGLE_CLIENT_ID": "your_google_client_id",
      "GOOGLE_CLIENT_SECRET": "your_google_secret"
    }
  },
  "ai": {
    "openrouter": {
      "OPENROUTER_API_KEY": "your_openrouter_key"
    }
  }
}
```

### Основные CLI команды

| Команда | Описание | Примеры |
|---------|----------|----------|
| `npx hasyx config` | Интерактивная конфигурация | Настройка всех параметров |
| `npx hasyx init` | Инициализация проекта | Создание структуры файлов |
| `npx hasyx migrate` | Применение миграций БД | `npx hasyx migrate users` |
| `npx hasyx schema` | Генерация типов из Hasura | TypeScript типы + schema |
| `npx hasyx events` | Синхронизация event triggers | Hasura webhooks |
| `npx hasyx ask` | AI-ассистент | `-e "Generate user CRUD"` |
| `npx hasyx docker` | Управление контейнерами | `define 3000`, `logs 3000` |
| `npx hasyx subdomain` | DNS и SSL управление | `define api 192.168.1.100` |

### Автоматическая генерация

При изменении `hasyx.config.json` автоматически обновляются:
- **`.env`** — переменные окружения для Next.js
- **`docker-compose.yml`** — конфигурация для Docker
- **GitHub secrets** — через `npx hasyx github` (опционально)
- **Vercel env vars** — через `npx hasyx vercel` (опционально)

**⚠️ Важно:** Никогда не редактируйте `.env` и `docker-compose.yml` вручную! Используйте только `npx hasyx config`.

## 🔐 Authentication and Authorization

### Supported Providers

Hasyx supports multiple authentication providers via NextAuth.js. Important change: the Credentials flow is split into two independent scenarios — OTP and password-based sign-in.

```
// Available providers (configured via npx hasyx config)
- ✅ **OTP (email/phone)** — verification code sign-in (no password)
- ✅ **Credentials (email/phone + password)** — classic login/password
- ✅ **Google OAuth** — Google accounts
- ✅ **Yandex OAuth** — Yandex accounts  
- ✅ **GitHub OAuth** — GitHub accounts
- ✅ **Telegram WebApp** — Telegram Bot API integration
- ✅ **JWT Auth** — Custom JWT tokens
- 🔄 **Facebook, VK, ...** — In progress
```

### Базовая настройка аутентификации

``tsx
// app/layout.tsx
import { HasyxProvider } from "hasyx";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <HasyxProvider>
          {children} {/* Аутентификация работает автоматически */}
        </HasyxProvider>
      </body>
    </html>
  );
}
```

### Использование в компонентах

```tsx
import { useSession, signIn, signOut } from 'hasyx';

function AuthComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Загрузка...</div>;
  
  if (session) {
    return (
      <div>
        <p>Добро пожаловать, {session.user?.name}!</p>
        <p>ID пользователя: {session.user?.id}</p>
        <button onClick={() => signOut()}>Выйти</button>
      </div>
    );
  }
  
  return (
    <div>
      <button onClick={() => signIn('google')}>Войти через Google</button>
      <button onClick={() => signIn('credentials')}>Войти по Email</button>
    </div>
  );
}
```

### New sign-in scheme: OTP vs Password

- OTP sign-in (no password):
  - Start: `POST /api/auth/credentials/start` with `{ provider: 'email'|'phone', identifier }`
  - Verify: `POST /api/auth/otp/verify` with `{ attemptId, code }`
  - After successful verification the client calls `signIn('credentials', { userId })` to establish a session
- Password sign-in:
  - Unauthenticated users: `signIn('credentials', { providerType, identifier, password })`
  - Authenticated users: manage password via `POST /api/auth/credentials/set` and check status via `GET /api/auth/credentials/status`

Diagnostics components:
- `OtpSignInCard` — pure OTP flow (send code + input OTP)
- `CredentialsSignInCard` — password sign-in and password management when authenticated

### Роли и разрешения

Hasyx автоматически интегрируется с системой ролей Hasura:

```
// Проверка роли на клиенте
import { useClient } from 'hasyx';

function AdminPanel() {
  const client = useClient();
  
  // Запрос с указанием роли
  const { data } = client.useQuery({
    table: 'admin_data',
    returning: ['id', 'sensitive_info'],
    role: 'admin' // Hasura проверит права автоматически
  });
  
  return <div>{/* админ интерфейс */}</div>;
}
```

## 🚀 GraphQL и Hasura интеграция

### Архитектура GraphQL Proxy

Hasyx использует собственный GraphQL прокси для безопасности:

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Frontend   │◄──►│ GraphQL Proxy│◄──►│   Hasura    │
│ (React App) │    │ /api/graphql │    │   Engine    │
└─────────────┘    └──────────────┘    └─────────────┘
                           │
                    ┌──────▼──────┐
                    │  NextAuth   │
                    │ JWT Tokens  │
                    └─────────────┘
```

**Преимущества прокси:**
- 🔒 **Скрывает HASURA_ADMIN_SECRET** от клиента
- 🎯 **Автоматическая авторизация** через NextAuth сессии
- 🔄 **WebSocket поддержка** для real-time подписок
- 🛡️ **Безопасность на уровне транспорта**

### Генератор запросов

Hasyx предоставляет мощный генератор типизированных запросов:

```tsx
import { useQuery, useClient } from 'hasyx';

// Типизированный запрос с автодополнением
const { data, loading, error } = useQuery({
  table: 'users',
  returning: ['id', 'name', 'email', 'created_at'],
  where: {
    name: { _ilike: '%john%' },
    created_at: { _gte: '2024-01-01' }
  },
  order_by: { created_at: 'desc' },
  limit: 10
});

// Результат автоматически типизирован!
data?.forEach(user => {
  console.log(user.name); // TypeScript знает все поля
});
```

### Real-time подписки

```
import { useSubscription } from 'hasyx';

// Real-time обновления
const { data } = useSubscription({
  table: 'messages',
  returning: ['id', 'text', 'user_id', 'created_at'],
  where: { room_id: { _eq: roomId } },
  order_by: { created_at: 'desc' }
});

// Данные обновляются автоматически при изменениях в БД
```

### Мутации (CUD операции)

```
import { useClient } from 'hasyx';

function UserForm() {
  const client = useClient();
  
  const handleSubmit = async (formData) => {
    try {
      // INSERT
      const newUser = await client.insert({
        table: 'users',
        objects: [{ name: formData.name, email: formData.email }],
        returning: ['id', 'name']
      });
      
      // UPDATE
      await client.update({
        table: 'users',
        where: { id: { _eq: newUser.id } },
        _set: { last_login: new Date().toISOString() },
        returning: ['id']
      });
      
      // DELETE (если нужно)
      // await client.delete({
      //   table: 'users',
      //   where: { id: { _eq: userId } }
      // });
      
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };
}
```

## 🗄️ База данных и миграции

### Структура миграций

```
migrations/
├── 1746660891582-hasyx-users/
│   ├── up.ts          # Создание/изменение схемы
│   └── down.ts        # Откат изменений
├── 1746670608552-hasyx-notify/
│   ├── up.ts
│   └── down.ts
└── 1748511896530-my-feature/
    ├── up.ts
    └── down.ts
```

### Пример миграции

```typescript
// migrations/1748511896530-my-feature/up.ts
import { Hasura, ColumnType } from 'hasyx/lib/hasura';

export default async function up() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!
  });

  // Создание схемы (идемпотентно)
  await hasura.defineSchema({ schema: 'public' });
  
  // Создание таблицы
  await hasura.defineTable({ schema: 'public', table: 'posts' });
  
  // Добавление колонок
  await hasura.defineColumn({
    schema: 'public', table: 'posts',
    name: 'id', type: ColumnType.UUID,
    default: 'gen_random_uuid()', nullable: false
  });
  
  await hasura.defineColumn({
    schema: 'public', table: 'posts',
    name: 'title', type: ColumnType.TEXT,
    nullable: false
  });
  
  await hasura.defineColumn({
    schema: 'public', table: 'posts', 
    name: 'content', type: ColumnType.TEXT
  });
  
  await hasura.defineColumn({
    schema: 'public', table: 'posts',
    name: 'user_id', type: ColumnType.UUID,
    nullable: false
  });
  
  // Создание связей
  await hasura.defineRelationship({
    schema: 'public', table: 'posts',
    name: 'user',
    type: 'object',
    remote_table: { schema: 'public', name: 'users' },
    column_mapping: { user_id: 'id' }
  });
  
  // Настройка разрешений
  await hasura.definePermission({
    schema: 'public', table: 'posts',
    role: 'user',
    permission: 'select',
    definition: {
      columns: ['id', 'title', 'content', 'user_id'],
      filter: { user_id: { _eq: 'X-Hasura-User-Id' } }
    }
  });
}
```

### Команды миграций

```bash
# Применить все миграции
npx hasyx migrate

# Применить конкретные миграции
npx hasyx migrate users   # только миграции содержащие "users"
npx hasyx migrate posts   # только миграции содержащие "posts"

# Откатить миграции
npx hasyx unmigrate
npx hasyx unmigrate users  # откатить только "users" миграции

# Сгенерировать TypeScript типы из схемы Hasura
npx hasyx schema
```

### Автогенерация типов

После применения миграций и выполнения `npx hasyx schema`:

```
// types/hasura-types.d.ts (автогенерируется)
export interface Users {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Posts {
  id: string;
  title: string;
  content?: string;
  user_id: string;
  user?: Users;  // связанная таблица
}

// Использование в коде
import { useQuery } from 'hasyx';
import type { Posts } from '@/types/hasura-types';

const { data }: { data: Posts[] } = useQuery({
  table: 'posts',
  returning: ['id', 'title', 'user.name'] // автодополнение!
});
```

## 📁 Файловое хранилище

### Поддерживаемые провайдеры хранилища

Hasyx поддерживает множественные провайдеры хранилища файлов:

| Провайдер | Описание | Использование |
|-----------|----------|---------------|
| **Local MinIO** | Локальное S3-совместимое хранилище | Development |
| **AWS S3** | Amazon Web Services | Production |
| **Google Cloud Storage** | Google Cloud Platform | Production |
| **Azure Blob Storage** | Microsoft Azure | Enterprise |
| **DigitalOcean Spaces** | DigitalOcean | Cost-effective |
| **Cloudflare R2** | Cloudflare | Edge storage |

### Настройка хранилища

```
# Интерактивная настройка хранилища
npx hasyx config
# Выберите Storage → Local MinIO / AWS S3 / другой провайдер
```

### Использование файлового API

```
import { useState } from 'react';
import { useClient } from 'hasyx';

function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const client = useClient();
  
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    
    try {
      // Загрузка файла
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', client.userId!);
      
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Файл загружен:', result.fileUrl);
        
        // Сохранение метаданных в БД
        await client.insert({
          table: 'files',
          objects: [{
            filename: file.name,
            url: result.fileUrl,
            size: file.size,
            mime_type: file.type,
            user_id: client.userId
          }],
          returning: ['id']
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
        disabled={uploading}
      />
      {uploading && <div>Загрузка...</div>}
    </div>
  );
}
```

### Безопасность и ограничения

```
// Настройки безопасности (настраиваются через hasyx.config.json)
{
  "files": {
    "max_size": "10MB",           // Максимальный размер файла
    "allowed_types": [            // Разрешенные типы файлов
      "image/jpeg", "image/png", 
      "application/pdf", "text/plain"
    ],
    "virus_scan": true,           // ClamAV антивирус сканирование
    "image_optimization": true,   // Автоматическая оптимизация изображений
    "storage_quota_per_user": "1GB"
  }
}
```

## ⚡ События и фоновые задачи

### Event Triggers

Автоматическая обработка изменений в базе данных:

```
// events/users.json
{
  "name": "users_trigger",
  "table": { "schema": "public", "name": "users" },
  "webhook_path": "/api/events/users",
  "insert": { "columns": "*" },
  "update": { "columns": "*" },
  "delete": { "columns": "*" }
}
```

```
// app/api/events/users/route.ts
import { hasyxEvent, HasuraEventPayload } from 'hasyx/lib/events';

export const POST = hasyxEvent(async (payload: HasuraEventPayload) => {
  const { event, table, data } = payload;
  
  switch (event.op) {
    case 'INSERT':
      // Отправка welcome email новому пользователю
      await sendWelcomeEmail(data.new.email, data.new.name);
      break;
      
    case 'UPDATE':
      // Логирование изменений профиля
      if (data.old.email !== data.new.email) {
        console.log(`Email changed for user ${data.new.id}`);
      }
      break;
      
    case 'DELETE':
      // Cleanup пользовательских файлов
      await cleanupUserFiles(data.old.id);
      break;
  }
  
  return { success: true };
});
```

### Cron Triggers

Запланированные задачи:

```
// events/daily-cleanup.json
{
  "name": "daily_cleanup",
  "webhook_path": "/api/events/daily-cleanup",
  "schedule": "0 2 * * *",  // Каждый день в 2:00
  "comment": "Daily cleanup of temporary files"
}
```

```
// app/api/events/daily-cleanup/route.ts
import { hasyxEvent } from 'hasyx/lib/events';
import { useClient } from 'hasyx/lib/server';

export const POST = hasyxEvent(async () => {
  const client = useClient({ secret: process.env.HASURA_ADMIN_SECRET });
  
  // Удаление временных файлов старше 24 часов
  await client.delete({
    table: 'temp_files',
    where: {
      created_at: { _lt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
    }
  });
  
  // Очистка логов старше 30 дней
  await client.delete({
    table: 'logs',
    where: {
      created_at: { _lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
    }
  });
  
  return { success: true, message: 'Cleanup completed' };
});
```

### Команды управления событиями

```
# Синхронизация всех event triggers с Hasura
npx hasyx events

# Создание шаблонов событий
npx hasyx events --init

# Очистка security headers (для миграции)
npx hasyx events --clean
```

## 🔔 Система уведомлений

### Поддерживаемые каналы

| Канал | Описание | Ограничения | Стоимость |
|-------|----------|-------------|-----------||
| **Firebase FCM** | Push уведомления в браузер/мобильные | Rate limits | Бесплатно |
| **Telegram Bot** | Сообщения в Telegram | 30 сообщений/сек | Бесплатно |
| **Email (Resend)** | Email уведомления | 100 emails/день | От $20/мес |
| **SMS** | СМС уведомления | Зависит от провайдера | Платно |
| **Webhook** | Кастомные HTTP callbacks | Нет | Бесплатно |

### Унифицированный API уведомлений

```
import { notify } from 'hasyx/lib/notify';

// Отправка через любой канал
await notify.send({
  userId: 'user-123',
  title: 'Новое сообщение',
  body: 'У вас есть непрочитанное сообщение',
  channels: ['push', 'telegram'], // автоматический выбор доступных каналов
  data: { messageId: 'msg-456' }   // дополнительные данные
});

// Отправка Push уведомления
await notify.push({
  userId: 'user-123',
  title: 'Заказ готов!',
  body: 'Ваш заказ #1234 готов к получению',
  icon: '/icons/order.png',
  click_action: '/orders/1234'
});

// Отправка в Telegram
await notify.telegram({
  chatId: '@username',
  message: `🎉 *Поздравляем!*\n\nВаш заказ успешно оформлен.`,
  parse_mode: 'Markdown',
  reply_markup: {
    inline_keyboard: [[
      { text: 'Отследить заказ', url: 'https://app.example.com/track/1234' }
    ]]
  }
});
```

### Настройка пользовательских предпочтений

```
import { useClient } from 'hasyx';

function NotificationSettings() {
  const client = useClient();
  
  const updatePreferences = async (preferences: any) => {
    await client.update({
      table: 'user_preferences',
      where: { user_id: { _eq: client.userId } },
      _set: {
        notifications: {
          push_enabled: preferences.push,
          telegram_enabled: preferences.telegram,
          email_enabled: preferences.email
        }
      }
    });
  };
  
  return (
    <div>
      {/* UI для настройки предпочтений */}
    </div>
  );
}
```

## 💳 Платежи | 🤖 AI | 📱 PWA | 🔧 DevOps

### Платежная система
- ✅ **T-Bank** — одноразовые/рекуррентные платежи

### AI-ассистент
```
npx hasyx ask -e "Создай CRUD компонент"
```
- **OpenRouter** (GPT-4, Claude) + **Ollama** (локально)

### Telegram интеграция
```
const { webApp, user } = useTelegramMiniapp();
```

### PWA и мобильные приложения
```
npx hasyx assets  # PWA иконки
npm run build:android && npm run open:android
```

### DevOps
```
# Docker
npx hasyx docker define 3000

# Поддомены с SSL
npx hasyx subdomain define api 192.168.1.100 3000
# Результат: https://api.yourdomain.com
```

## 🔍 Мониторинг и тестирование

```
# Логи
npx hasyx logs

# Тесты
npm test

# Debug в production
HASYX_DEBUG=1 npm start
```

## 🚀 Лучшие практики

### Безопасность
1. **Никогда** не редактируйте `.env` вручную
2. Используйте `define*` методы в миграциях
3. Тестируйте миграции на staging
4. Настройте monitoring для критичных API

### Оптимизация
- Используйте React.memo для тяжёлых компонентов
- Оптимизируйте GraphQL запросы (только нужные поля)
- Используйте кэширование для статичных данных

## 🔗 Полезные ссылки

- 🌐 **Документация:** [README.md](README.md)
- 🐛 **GitHub:** [github.com/ivansglazunov/hasyx](https://github.com/ivansglazunov/hasyx)  
- ✨ **Демо:** [hasyx.vercel.app](https://hasyx.vercel.app/)
- 📝 **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)

## 🎯 Заключение

Hasyx — мощный full-stack фреймворк для быстрого создания современных веб-приложений. Он объединяет лучшие практики в едином решении, позволяя сосредоточиться на бизнес-логике.

**Ключевые преимущества:**
- ⚡ От идеи до MVP за недели
- 🔒 Enterprise-grade безопасность
- 🌐 Полная экосистема (фронтенд → DevOps)
- 🤖 AI-first подход
- 🛠️ Production-ready с первого дня

Начните с `npx hasyx init` и создайте ваше следующее приложение! 🎉

---

*Этот гайд основан на Hasyx v0.2.0-alpha.43 и будет обновляться по мере развития проекта.*
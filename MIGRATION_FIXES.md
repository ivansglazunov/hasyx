# Исправления миграций Hasura

Этот документ описывает все правки, внесенные для исправления ошибок миграций Hasura.

## Проблемы, которые были исправлены

### 1. SQL синтаксис для DEFAULT при изменении типа колонки
**Проблема:** В PostgreSQL нельзя указывать `DEFAULT` в одном `ALTER COLUMN TYPE` statement. При попытке изменить тип колонки с `DEFAULT` возникала ошибка синтаксиса.

**Ошибка:**
```
syntax error at or near "DEFAULT"
```

### 2. Преобразование bigint → timestamptz с DEFAULT
**Проблема:** При преобразовании колонки из `bigint` в `timestamptz`, PostgreSQL не может автоматически преобразовать DEFAULT значение. Также требуется явное указание `USING` clause для преобразования данных.

**Ошибка:**
```
column "created_at" cannot be cast automatically to type timestamp with time zone
default for column "created_at" cannot be cast automatically to type timestamp with time zone
```

### 3. Триггеры и constraints уже существуют
**Проблема:** При повторном запуске миграций возникали ошибки, что триггеры и constraints уже существуют. Миграции не были идемпотентными.

**Ошибки:**
```
trigger "set_user_id_on_github_issues" for relation "github_issues" already exists
relation "providers_name_type_test_mode_unique" already exists
constraint "fk_replies_room" for relation "replies" already exists
```

### 4. Таблицы уже существуют
**Проблема:** Использование `createTable` вместо `defineTable` приводило к ошибкам при повторном запуске миграций.

**Ошибка:**
```
Table public.auth_jwt already exists
Table public.verification_codes already exists
```

### 5. ECONNRESET - разрыв соединения с Hasura Cloud
**Проблема:** При работе с Hasura Cloud (`hasyx.hasura.app`) возникали сетевые ошибки `ECONNRESET`, которые прерывали выполнение миграций.

**Ошибка:**
```
read ECONNRESET
```

---

## Детальное описание правок

### Файл: `lib/hasura/hasura.ts`

#### Правка 1: Исправление SQL синтаксиса для DEFAULT (строки 699-711)

**Было:**
```typescript
await this.sql(`
  ALTER TABLE "${schema}"."${table}" 
  ALTER COLUMN "${name}" TYPE ${type} ${postfix};
`);
```

**Стало:**
```typescript
// Разделяем TYPE change и DEFAULT setting на два отдельных ALTER TABLE
const hasDefault = postfix.includes('DEFAULT');
const postfixWithoutDefault = postfix.replace(/\s*DEFAULT\s+[^;]+/gi, '').trim();

// Сначала изменяем тип (без DEFAULT)
await this.sql(`
  ALTER TABLE "${schema}"."${table}" 
  ALTER COLUMN "${name}" TYPE ${type}${postfixWithoutDefault ? ' ' + postfixWithoutDefault : ''};
`);

// Затем устанавливаем DEFAULT отдельно, если он был в postfix
if (hasDefault) {
  const defaultMatch = postfix.match(/DEFAULT\s+([^;]+)/i);
  if (defaultMatch) {
    const defaultValue = defaultMatch[1].trim();
    await this.sql(`
      ALTER TABLE "${schema}"."${table}" 
      ALTER COLUMN "${name}" SET DEFAULT ${defaultValue};
    `);
  }
}
```

**Зачем:** PostgreSQL требует разделять изменение типа и установку DEFAULT на два отдельных `ALTER TABLE` statement. Это исправляет синтаксическую ошибку.

---

#### Правка 2: Добавление USING clause для bigint → timestamptz (строки 704-694)

**Добавлено:**
```typescript
// Если преобразуем из bigint в timestamptz, нужен USING clause
const typeStr = String(type);
const needsUsing = currentType === 'bigint' && 
                   (typeStr === 'timestamptz' || 
                    typeStr === ColumnType.TIMESTAMPTZ || 
                    typeStr.includes('timestamp'));

if (needsUsing) {
  // Преобразуем bigint (Unix timestamp в миллисекундах) в timestamptz
  usingClause = ' USING to_timestamp(CAST("' + name + '" AS bigint) / 1000.0)';
}

await this.sql(`
  ALTER TABLE "${schema}"."${table}" 
  ALTER COLUMN "${name}" TYPE ${type}${usingClause}...;
`);
```

**Зачем:** PostgreSQL не может автоматически преобразовать `bigint` в `timestamptz`. Нужно явно указать `USING` clause с функцией преобразования. Мы делим на 1000, так как в базе хранятся миллисекунды (Unix timestamp * 1000).

---

#### Правка 3: Улучшение логики удаления DEFAULT (строки 704-737)

**Было:**
```typescript
try {
  await this.sql(`ALTER TABLE ... ALTER COLUMN "${name}" DROP DEFAULT;`);
} catch (e) {
  // Ignore if DEFAULT doesn't exist
}
```

**Стало:**
```typescript
// Сначала проверяем, есть ли DEFAULT
const defaultCheck = await this.sql(`
  SELECT column_default
  FROM information_schema.columns
  WHERE table_schema = '${schema}'
    AND table_name = '${table}'
    AND column_name = '${name}';
`);

const hasDefault = defaultCheck.result && 
                   defaultCheck.result.length > 1 && 
                   defaultCheck.result[1][0] !== null;

if (hasDefault) {
  // Удаляем DEFAULT только если он существует
  await this.sql(`
    ALTER TABLE "${schema}"."${table}" 
    ALTER COLUMN "${name}" DROP DEFAULT;
  `);
}
```

**Зачем:** Предыдущая логика пыталась удалить DEFAULT и игнорировала ошибку, если его не было. Новая логика сначала проверяет наличие DEFAULT через `information_schema`, что более надежно и предотвращает ненужные ошибки.

---

#### Правка 4: Добавление retry логики для ECONNRESET (строки 301-348)

**Добавлено:**
```typescript
async sql(sql: string, source: string = 'default', cascade: boolean = true): Promise<any> {
  const maxRetries = 3;
  let lastError: any = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        // Прогрессивная задержка: 1s, 2s, 3s
        const delay = attempt * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      const response = await this.clientInstance.post('/v2/query', {...});
      // ... обработка ответа
      return data;
    } catch (error: any) {
      lastError = error;
      const isNetworkError = errorCode === 'ECONNRESET' || 
                            errorCode === 'ETIMEDOUT' || 
                            errorCode === 'ECONNREFUSED' ||
                            errorMessage.includes('ECONNRESET') ||
                            (error.response?.status >= 500 && error.response?.status < 600);
      
      if (isNetworkError && attempt < maxRetries) {
        // Retry на следующей итерации
        continue;
      }
      throw error;
    }
  }
}
```

**Зачем:** Hasura Cloud может разрывать соединения (`ECONNRESET`) при длительных операциях или высокой нагрузке. Retry логика автоматически повторяет запрос до 3 раз с прогрессивной задержкой, что значительно повышает надежность миграций.

---

#### Правка 5: Исправление метода createTrigger для идемпотентности (строки 1146-1171)

**Было:**
```typescript
async createTrigger(options: TriggerOptions): Promise<any> {
  // Проверяем существование триггера
  const triggerExists = await this.sql(`SELECT EXISTS ...`);
  
  if (triggerExists.result?.[1]?.[0] === 't') {
    throw new Error(`❌ Trigger ${name} already exists`);
  }
  
  await this.sql(`CREATE TRIGGER "${name}" ...`);
}
```

**Стало:**
```typescript
async createTrigger(options: TriggerOptions): Promise<any> {
  // Удаляем триггер если существует (для идемпотентности)
  await this.sql(`DROP TRIGGER IF EXISTS "${name}" ON "${schema}"."${table}";`);
  
  await this.sql(`CREATE TRIGGER "${name}" ...`);
}
```

**Зачем:** Предыдущая логика выбрасывала ошибку, если триггер уже существует. Новая логика использует `DROP TRIGGER IF EXISTS` перед созданием, что делает миграции идемпотентными - их можно запускать многократно без ошибок.

---

### Файл: `lib/github/up-github.ts`

#### Правка: Добавление DROP TRIGGER IF EXISTS (строки 297-302)

**Было:**
```typescript
await hasura.sql(`
  CREATE TRIGGER set_user_id_on_github_issues
    BEFORE INSERT OR UPDATE ON public.github_issues
    FOR EACH ROW
    EXECUTE FUNCTION public.set_user_id_trigger();
`);
```

**Стало:**
```typescript
await hasura.sql(`
  DROP TRIGGER IF EXISTS set_user_id_on_github_issues ON public.github_issues;
  CREATE TRIGGER set_user_id_on_github_issues
    BEFORE INSERT OR UPDATE ON public.github_issues
    FOR EACH ROW
    EXECUTE FUNCTION public.set_user_id_trigger();
`);
```

**Зачем:** При повторном запуске миграции триггер уже существует, что вызывало ошибку. `DROP TRIGGER IF EXISTS` делает миграцию идемпотентной.

---

### Файл: `lib/payments/up-payments.ts`

#### Правка 1: Constraint для providers (строки 100-105)

**Было:**
```typescript
await hasura.sql(`ALTER TABLE "payments"."providers" 
  ADD CONSTRAINT "providers_name_type_test_mode_unique" 
  UNIQUE ("name", "type", "is_test_mode");`);
```

**Стало:**
```typescript
await hasura.sql(`
  ALTER TABLE "payments"."providers" 
  DROP CONSTRAINT IF EXISTS "providers_name_type_test_mode_unique";
  ALTER TABLE "payments"."providers" 
  ADD CONSTRAINT "providers_name_type_test_mode_unique" 
  UNIQUE ("name", "type", "is_test_mode");
`);
```

**Зачем:** Constraint уже существует при повторном запуске миграции. `DROP CONSTRAINT IF EXISTS` делает миграцию идемпотентной.

---

#### Правка 2: Constraint для methods (строки 213-218)

**Было:**
```typescript
await hasura.sql(`ALTER TABLE "payments"."methods" 
  ADD CONSTRAINT "methods_user_provider_external_type_unique" 
  UNIQUE ("user_id", "provider_id", "external_id", "type");`);
```

**Стало:**
```typescript
await hasura.sql(`
  ALTER TABLE "payments"."methods" 
  DROP CONSTRAINT IF EXISTS "methods_user_provider_external_type_unique";
  ALTER TABLE "payments"."methods" 
  ADD CONSTRAINT "methods_user_provider_external_type_unique" 
  UNIQUE ("user_id", "provider_id", "external_id", "type");
`);
```

**Зачем:** Аналогично первой правке - делает миграцию идемпотентной.

---

### Файл: `lib/users/up-users.ts`

#### Правка 1: Замена createTable на defineTable для auth_jwt (строка 224)

**Было:**
```typescript
await hasura.createTable({
  schema: 'public',
  table: 'auth_jwt',
  id: 'id',
  type: ColumnType.UUID,
});
```

**Стало:**
```typescript
await hasura.defineTable({
  schema: 'public',
  table: 'auth_jwt',
  id: 'id',
  type: ColumnType.UUID,
});
```

**Зачем:** `createTable` выбрасывает ошибку, если таблица уже существует. `defineTable` проверяет существование и создает только если нужно, делая миграцию идемпотентной.

---

#### Правка 2: Замена createTable на defineTable для verification_codes (строка 264)

**Было:**
```typescript
await hasura.createTable({
  schema: 'public',
  table: 'verification_codes',
  id: 'id',
  type: ColumnType.UUID,
});
```

**Стало:**
```typescript
await hasura.defineTable({
  schema: 'public',
  table: 'verification_codes',
  id: 'id',
  type: ColumnType.UUID,
});
```

**Зачем:** Аналогично первой правке - делает миграцию идемпотентной.

---

### Файл: `lib/up-messaging.ts`

#### Правка 1: Unique constraint для message_reads (строки 79-85)

**Было:**
```typescript
await hasura.sql(`ALTER TABLE public.message_reads 
  ADD CONSTRAINT unique_user_room UNIQUE (user_id, room_id);`);
```

**Стало:**
```typescript
await hasura.sql(`
  ALTER TABLE public.message_reads 
  DROP CONSTRAINT IF EXISTS unique_user_room;
  ALTER TABLE public.message_reads 
  ADD CONSTRAINT unique_user_room UNIQUE (user_id, room_id);
`);
```

**Зачем:** Constraint уже существует при повторном запуске. `DROP CONSTRAINT IF EXISTS` делает миграцию идемпотентной.

---

#### Правка 2: Foreign key constraints для replies (строки 87-96)

**Было:**
```typescript
await hasura.sql(`ALTER TABLE public.replies
  ADD CONSTRAINT fk_replies_room FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_replies_message FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE;
`);
```

**Стало:**
```typescript
await hasura.sql(`
  ALTER TABLE public.replies
  DROP CONSTRAINT IF EXISTS fk_replies_room,
  DROP CONSTRAINT IF EXISTS fk_replies_message;
  ALTER TABLE public.replies
  ADD CONSTRAINT fk_replies_room FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_replies_message FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE;
`);
```

**Зачем:** Foreign key constraints уже существуют при повторном запуске. `DROP CONSTRAINT IF EXISTS` делает миграцию идемпотентной.

---

#### Правка 3: Foreign key constraint для message_reads (строки 98-103)

**Было:**
```typescript
await hasura.sql(`ALTER TABLE public.message_reads
  ADD CONSTRAINT fk_message_reads_room FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;
`);
```

**Стало:**
```typescript
await hasura.sql(`
  ALTER TABLE public.message_reads
  DROP CONSTRAINT IF EXISTS fk_message_reads_room;
  ALTER TABLE public.message_reads
  ADD CONSTRAINT fk_message_reads_room FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;
`);
```

**Зачем:** Аналогично предыдущим правкам - делает миграцию идемпотентной.

---

### Файл: `lib/files/up-storage.ts`

#### Правка: Constraint для download_expiration (строки 139-149)

**Было:**
```typescript
await hasura.sql(`
  ALTER TABLE storage.buckets
      ADD CONSTRAINT download_expiration_valid_range
          CHECK (download_expiration >= 1 AND download_expiration <= 604800);
`);
```

**Стало:**
```typescript
await hasura.sql(`
  ALTER TABLE storage.buckets
  DROP CONSTRAINT IF EXISTS download_expiration_valid_range;
  ALTER TABLE storage.buckets
  ADD CONSTRAINT download_expiration_valid_range
      CHECK (download_expiration >= 1 AND download_expiration <= 604800);
`);
```

**Зачем:** Constraint уже существует при повторном запуске. `DROP CONSTRAINT IF EXISTS` делает миграцию идемпотентной.

---

## Итоговые результаты

После всех исправлений:

1. ✅ **Миграции стали идемпотентными** - их можно запускать многократно без ошибок
2. ✅ **Исправлен SQL синтаксис** - DEFAULT правильно обрабатывается при изменении типа
3. ✅ **Корректное преобразование bigint → timestamptz** - с проверкой и удалением DEFAULT
4. ✅ **Retry логика для сетевых ошибок** - автоматическое повторение при ECONNRESET
5. ✅ **Все constraints и триггеры идемпотентны** - используют DROP IF EXISTS перед созданием

## Рекомендации

1. **Всегда используйте `define*` методы** вместо `create*` для идемпотентности
2. **Используйте `DROP IF EXISTS`** перед созданием constraints и триггеров
3. **Разделяйте TYPE и DEFAULT** на отдельные ALTER TABLE statements
4. **Проверяйте наличие DEFAULT** перед удалением при преобразовании типов
5. **Используйте USING clause** при преобразовании bigint в timestamptz

## Связанные проблемы

Аналогичные проблемы были исправлены в проекте LisEng:
- `migrations/1770000000000-fix-users-timestamps/up.ts` - конвертация timestamp → bigint
- `migrations/1771000000000-fix-all-timestamps/up.ts` - массовая конвертация timestamp → bigint

В hasyx была обратная задача - конвертация bigint → timestamptz, но принципы исправления те же.


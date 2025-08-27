# TODO

## Тестирование

### 1. Промаркировать тесты, требующие запущенного приложения

Промаркировать все тесты, которые используют прямо или косвенно запущенный апп (не только базу данных или исходный код), используя паттерн:

```typescript
(!!+process.env.JEST_APP ? describe : describe.skip)('App-dependent tests', () => {
  // тесты, требующие запущенного приложения
});
```

**Пример использования:**
```typescript
// Вместо обычного describe
describe('Files API Integration', () => {
  // тесты
});

// Использовать условный describe
(!!+process.env.JEST_APP ? describe : describe.skip)('Files API Integration', () => {
  it('should upload file via API', async () => {
    // тест, требующий работающий API сервер
    const response = await fetch('http://localhost:3004/api/files', {
      method: 'POST',
      body: formData
    });
    expect(response.status).toBe(200);
  });
});
```

**Тесты, требующие маркировки:**
- `lib/files/files.test.ts` - API integration tests
- `lib/jwt.test.ts` - JWT API tests  
- `lib/graphql.test.ts` - GraphQL proxy tests
- `lib/wstunnel.test.ts` - WebSocket tunnel tests
- `lib/nginx/nginx.test.ts` - Nginx configuration tests
- `lib/ai/providers/ollama.test.ts` - Ollama server tests

### 2. Применить jest-skip во всех тестах проекта

Утилита `lib/jest-skip.ts` уже создана. Теперь нужно применить метод `jestSkip(...conditions)` во всех тестах проекта для замены старого подхода с `JEST_LOCAL`.

**Новые конфигурируемые параметры:**
- `app: JEST_APP` - тесты, требующие запущенного приложения
- `hasura: JEST_HASURA` - тесты, требующие прямого подключения к Hasura
- `files: JEST_FILES` - тесты, требующие файловых операций
- `instance: JEST_INSTANCE` - тесты, создающие временные проекты и запускающие CLI команды

**Задачи:**
1. Заменить все использования `JEST_LOCAL` на новые конфигурируемые параметры
2. Применить `jestSkip()` во всех тестах проекта
3. Убедиться, что при полностью развернутой системе и всех значениях `true` все тесты проходят
4. Проверить, что новый подход полностью заменяет старый `JEST_LOCAL`

**Примеры использования:**
```typescript
// Вместо старого подхода
(!!+process.env.JEST_LOCAL ? describe : describe.skip)('Tests', () => {});

// Использовать новый подход
jestSkip(!!+process.env.JEST_APP)('App tests', () => {});
jestSkip(!!+process.env.JEST_HASURA)('Hasura tests', () => {});
jestSkip(!!+process.env.JEST_FILES)('Files tests', () => {});
jestSkip(!!+process.env.JEST_APP, !!+process.env.JEST_HASURA)('Integration tests', () => {});
```

### 3. Ручное тестирование VTB интеграции

Провести ручное тестирование VTB интеграции используя интерфейс `app/hasyx/payments` и по пути улучшить его:

**Что тестировать:**
- Создание подписок через VTB API
- Добавление карт
- Обработка webhook'ов
- Интеграция с Hasura событиями

**Улучшения интерфейса:**
- Улучшить UX/UI платежного интерфейса
- Добавить валидацию форм
- Улучшить обработку ошибок
- Добавить индикаторы загрузки
- Улучшить мобильную версию

**Путь к интерфейсу:** `app/hasyx/payments`

### 4. Тестирование API endpoints

Мы добавили новые API endpoints:
- `app/api/events/events` - обработка событий
- `app/api/events/schedule` - планировщик событий  
- `app/api/one-off` - разовые задачи

**Задачи:**
1. Аккуратно протестировать все endpoints целиком
2. Проверить интеграцию с Hasura событиями
3. Убедиться в корректной обработке ошибок
4. Протестировать различные сценарии использования
5. Проверить производительность при высокой нагрузке

### 5. Реализация системы бенчмаркинга и мониторинга

Интегрировать Grafana и K6 для комплексного бенчмаркинга системы с поддержкой как локального Docker Compose, так и cloud.hasura.io.

**Архитектура решения:**

1. **Docker Compose интеграция:**
   - Grafana (порт 3000) - визуализация метрик
   - Prometheus (порт 9090) - сбор метрик
   - K6 (порт 6565) - нагрузочное тестирование
   - InfluxDB - хранение результатов тестов
   - Jaeger (порт 16686) - трейсинг запросов

2. **Конфигурация в hasyxConfig:**
   ```typescript
   hasyxConfig.monitoring = z.object({
     enabled: z.boolean().default(true),
     grafanaPort: z.number().default(3000),
     prometheusPort: z.number().default(9090),
     jaegerPort: z.number().default(16686),
   });

   hasyxConfig.benchmarking = z.object({
     enabled: z.boolean().default(true),
     k6Port: z.number().default(6565),
     testScenarios: z.array(z.string()).default(['load', 'stress', 'spike']),
     targetRPS: z.number().default(100),
     duration: z.string().default('5m'),
   });
   ```

3. **Структура бенчмарков:**
   ```
   benchmarks/
   ├── scenarios/
   │   ├── load-test.js      # Нагрузочное тестирование
   │   ├── stress-test.js    # Стресс-тестирование  
   │   ├── spike-test.js     # Спайк-тестирование
   │   └── smoke-test.js     # Дымовое тестирование
   ├── config/
   │   ├── k6-config.js      # Конфигурация K6
   │   └── thresholds.js     # Пороги производительности
   ├── utils/
   │   ├── auth-helper.js    # Помощник для аутентификации
   │   ├── data-generator.js # Генератор тестовых данных
   │   └── metrics.js        # Метрики и отчеты
   └── results/              # Результаты тестов
   ```

4. **Формат бенчмарков на JS:**
   - Использование K6 для написания тестов
   - Кастомные метрики (error rate, response time)
   - Конфигурируемые пороги производительности
   - Интеграция с Hasura GraphQL API
   - Тестирование аутентификации и авторизации

5. **Cloud Hasura интеграция:**
   - Поддержка cloud.hasura.io метрик
   - API ключи для доступа к облачным метрикам
   - Синхронизация локальных и облачных данных
   - Единая панель мониторинга

6. **CI/CD интеграция:**
   - Автоматический запуск бенчмарков в пайплайне
   - Сравнение результатов между коммитами
   - Алерты при деградации производительности
   - Генерация отчетов в HTML/JSON формате

**Команды для запуска:**
```bash
npm run benchmark:load      # Нагрузочное тестирование
npm run benchmark:stress    # Стресс-тестирование
npm run benchmark:spike     # Спайк-тестирование
npm run benchmark:all       # Все тесты
npm run benchmark:cloud     # Тестирование cloud.hasura.io
```

**Преимущества:**
- Комплексный мониторинг производительности
- Автоматизация тестирования нагрузки
- Интеграция с существующей инфраструктурой
- Поддержка как локальной, так и облачной разработки
- Визуализация метрик через Grafana
- Исторические данные для анализа трендов


## Инвайты / JWT

- [DONE] Проверка инвайта при генерации JWT при `NEXT_PUBLIC_HASYX_ONLY_INVITE_USER=1` реализована в `lib/jwt.ts`: роль `user` отрезается у неприглашённых.

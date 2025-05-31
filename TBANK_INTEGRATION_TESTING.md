# T-Bank Integration Testing

Полный интеграционный тест T-Bank платежей с использованием AI и Puppeteer.

## 🎯 Что Тестируется

Тесты проверяют полный цикл платежей T-Bank:
1. **Создание платежа** через наш API
2. **Автоматическое заполнение форм** с помощью AI и Puppeteer  
3. **Обработка webhook'ов** от T-Bank
4. **Проверка финального состояния** платежа

## 🔧 Настройка Окружения

### 1. Настройка Тестовых Данных

Запустите assist для настройки T-Bank тестового окружения:

```bash
npm run cli -- assist tbank-test
```

Или если используете npx:

```bash
npx hasyx assist tbank-test
```

Команда запросит:
- **T-Bank Test Terminal Key** - ключ терминала из тестового аккаунта T-Bank
- **T-Bank Test Secret Key** - секретный ключ терминала  
- **Тестовые карты для успешных платежей** (например, 4300000000000777)
- **Тестовые карты для неудачных платежей** (например, 4300000000000002)
- **OpenRouter API Key** - для работы AI автоматизации

### 2. Проверка .env Файла

После настройки ваш `.env` должен содержать:

```env
# T-Bank Test Configuration
TBANK_TEST_TERMINAL_KEY=your_test_terminal_key
TBANK_TEST_SECRET_KEY=your_test_secret_key
TBANK_TEST_SUCCESS_CARD_NUMBER=4300000000000777
TBANK_TEST_SUCCESS_CARD_EXP=12/25
TBANK_TEST_SUCCESS_CARD_CVC=123
TBANK_TEST_FAIL_CARD_NUMBER=4300000000000002
TBANK_TEST_FAIL_CARD_EXP=12/25
TBANK_TEST_FAIL_CARD_CVC=456

# AI Configuration
OPENROUTER_API_KEY=your_openrouter_key
```

## 🧪 Запуск Тестов

### Локальный Запуск (Ограниченный)

**⚠️ ВАЖНО**: Локальные тесты НЕ могут проверить webhook'и от T-Bank, так как T-Bank не может достучаться до localhost.

```bash
# Запуск всех интеграционных тестов T-Bank
npm test -- lib/payments/tbank.integration.test.ts

# Запуск конкретного теста
npm test -- lib/payments/tbank.integration.test.ts -t "should complete full payment cycle"
```

Локально будут работать:
- ✅ Создание платежей
- ✅ AI автоматизация форм  
- ✅ Проверка статуса через API
- ❌ Webhook'и от T-Bank (нужен публичный URL)

### Серверный Запуск (Полный)

Для полного тестирования с webhook'ами нужен сервер с публичным URL:

1. **Деплой на тестовый сервер** (например, VPS, Vercel, Heroku)
2. **Настройка webhook endpoint'а** в провайдере
3. **Запуск тестов на сервере**

```bash
# На тестовом сервере
NODE_ENV=test npm test -- lib/payments/tbank.integration.test.ts
```

## 🤖 Как Работает AI Автоматизация

Тесты используют AI (через OpenRouter API) для автоматического заполнения форм T-Bank:

### Пример AI Промпта

```typescript
const automationPrompt = `
You need to automate a T-Bank payment process using Puppeteer:

1. Open the payment URL: ${paymentUrl}
2. Wait for the page to load completely
3. Fill in the card details:
   - Card Number: 4300000000000777
   - Expiry Date: 12/25
   - CVC: 123
4. Submit the payment form
5. Wait for payment to complete
6. Return the final page URL and success/error messages

Use Puppeteer with proper waits and error handling.
`;

const result = await ai.ask(automationPrompt);
```

### AI Выполняет

1. **Запускает Puppeteer** в браузере
2. **Открывает страницу** оплаты T-Bank
3. **Находит поля** для ввода карточных данных  
4. **Заполняет форму** тестовыми данными
5. **Отправляет форму** и ждет результат
6. **Обрабатывает 3DS** если требуется
7. **Возвращает результат** (успех/ошибка)

## 📋 Типы Тестов

### 1. Успешный Платеж

```typescript
it('should complete full payment cycle with AI automation', async () => {
  // 1. Создаем платеж
  const payment = await processor.initiatePayment(args);
  
  // 2. AI заполняет форму успешной картой
  const result = await ai.ask(automationPrompt);
  
  // 3. Проверяем статус
  const status = await processor.getPaymentStatus(paymentId);
  expect(status.status).toBe('succeeded');
});
```

### 2. Неудачный Платеж

```typescript
it('should handle failed payment with error card', async () => {
  // Используется карта, которая всегда отклоняется
  // AI заполняет форму и получает ошибку
  // Проверяем что статус = 'failed'
});
```

### 3. Отмена Платежа

```typescript
it('should handle payment cancellation', async () => {
  // Создаем платеж и сразу отменяем через API
  // Проверяем что статус = 'canceled'
});
```

## 🔍 Диагностика

### Проверка Конфигурации

```typescript
it('should verify test environment configuration', () => {
  expect(testConfig.terminalKey).toBeTruthy();
  expect(testConfig.successCard.number).toBeTruthy();
  expect(ai).toBeInstanceOf(AI);
});
```

### Debug Логи

Включите debug для подробных логов:

```bash
DEBUG="hasyx:*,payment:*" npm test -- lib/payments/tbank.integration.test.ts
```

### Проверка AI

Если AI не работает:

```bash
# Проверить OpenRouter API ключ
npm run js -- -e "
const { AI } = require('./lib/ai');
const ai = new AI(process.env.OPENROUTER_API_KEY);
console.log(await ai.ask('Hello, are you working?'));
"
```

## ⚠️ Ограничения и Замечания

### Webhook'и

- **Локально**: webhook'и НЕ работают (T-Bank не может достучаться до localhost)
- **Сервер**: нужен публичный HTTPS endpoint для webhook'ов
- **Тестирование**: используем polling статуса вместо webhook'ов в тестах

### Тестовые Карты

Используйте только официальные тестовые карты T-Bank:
- **Успешные**: 4300000000000777, 4300000000000110  
- **Неудачные**: 4300000000000002, 4300000000000028

### AI Ограничения

- **Стабильность**: AI может иногда не найти элементы на странице
- **Таймауты**: увеличены до 3 минут для AI операций
- **Headless**: используйте headless: false для отладки

## 🚀 Следующие Шаги

1. **Настройте тестовый сервер** с публичным URL
2. **Настройте webhook endpoint** для приема уведомлений от T-Bank
3. **Запустите полный цикл тестов** на сервере
4. **Добавьте мониторинг** webhook'ов в реальном времени

## 📞 Поддержка

Если тесты не работают:

1. Проверьте `.env` конфигурацию
2. Убедитесь что OpenRouter API key активен
3. Проверьте тестовые ключи T-Bank
4. Включите debug логи для диагностики

```bash
DEBUG="hasyx:*" npm test -- lib/payments/tbank.integration.test.ts
``` 
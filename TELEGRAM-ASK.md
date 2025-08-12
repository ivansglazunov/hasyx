# Telegram Ask Integration

Telegram Ask Integration позволяет использовать возможности Hasyx AI через Telegram bot с полной поддержкой выполнения кода и стриминга ответов.

## Features

- **🤖 AI Assistant через Telegram**: Полнофункциональный AI помощник в Telegram боте
- **⚡ Real-time Streaming**: Ответы AI приходят в Telegram в реальном времени
- **😈 Code Execution**: Выполнение JavaScript, TypeScript и терминальных команд через Telegram
- **📊 Instance Management**: Умное управление экземплярами AI для каждого пользователя  
- **💾 Memory Management**: Автоматическая очистка неактивных экземпляров
- **🛡️ Error Handling**: Graceful обработка ошибок с информативными сообщениями
- **📱 Message Buffering**: Оптимизация отправки сообщений в Telegram
- **🔧 Configurable**: Настраиваемые опции для различных сценариев использования

## Architecture

### Основные компоненты

1. **`AskHasyx`** (базовый класс) - Расширенный AI с переопределяемыми методами вывода
2. **`TelegramAskWrapper`** - Специализированный класс для работы с Telegram  
3. **Instance Manager** - Менеджер экземпляров для оптимизации ресурсов
4. **Output Handlers** - Система переопределяемых обработчиков вывода

### Схема работы

```
User Message (Telegram) 
    ↓
Telegram Bot API 
    ↓  
handleStartEvent() (database operations)
    ↓
route.ts (response generation)
    ↓
defineTelegramAsk() (get/create AI instance)
    ↓
TelegramAskWrapper.ask() (AI processing)
    ↓
Output Handlers (send to Telegram)
    ↓
Telegram Bot API → User
```

## Quick Start

### 1. Environment Setup (via configurator)

Переменные окружения настраиваются через `npx hasyx config`. Файл `.env` автогенерируется и не должен редактироваться вручную. Убедитесь, что заданы:
- `TELEGRAM_BOT_TOKEN`
- `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_HASURA_GRAPHQL_URL`
- `HASURA_ADMIN_SECRET`

### 2. Basic Integration in route.ts

```typescript
import { NextResponse } from 'next/server';
import { handleStartEvent, TelegramUpdate } from 'hasyx/lib/telegram-bot';
import { defineTelegramAsk } from 'hasyx/lib/ask-telegram';

export async function POST(request: Request) {
  const payload = (await request.json()) as TelegramUpdate;
  
  // Handle /start and database operations
  const result = await handleStartEvent(payload, adminClient);
  
  if (result.success && result.chatId && result.userId && payload.message?.text) {
    if (payload.message.text.trim().toLowerCase() !== '/start') {
      // Get AI instance for this user
      const askInstance = defineTelegramAsk(
        result.userId,
        result.chatId,
        process.env.TELEGRAM_BOT_TOKEN!,
        process.env.OPENROUTER_API_KEY!,
        'My Project'
      );

      // Process with AI (responses sent automatically to Telegram)
      await askInstance.ask(payload.message.text);
    }
  }
  
  return NextResponse.json(result);
}
```

### 3. Testing

1. Create Telegram bot via [@BotFather](https://t.me/BotFather)
2. Set webhook: `https://your-app.com/api/telegram_bot`
3. Send `/start` to your bot
4. Ask any question: "Calculate 5 factorial with code"

## API Reference

### `defineTelegramAsk()`

Создает или получает экземпляр AI для конкретного пользователя.

```typescript
function defineTelegramAsk(
  userId: number,          // Telegram user ID
  chatId: number,          // Telegram chat ID  
  botToken: string,        // Telegram bot token
  openRouterToken: string, // OpenRouter API key
  projectName?: string,    // Project name for system prompt
  askOptions?: TelegramAskOptions // Additional options
): TelegramAskWrapper
```

### `TelegramAskOptions`

```typescript
interface TelegramAskOptions extends AskOptions {
  telegram?: {
    botToken: string;
    chatId: number;
    bufferTime?: number;         // Buffer timeout (default: 1000ms)
    maxMessageLength?: number;   // Max Telegram message length (default: 4096)
    enableCodeBlocks?: boolean;  // Format code blocks (default: true)
  };
}
```

### `TelegramAskWrapper`

Основной класс для работы с AI через Telegram.

```typescript
class TelegramAskWrapper extends AskHasyx {
  async ask(question: string): Promise<string>
  async flush(): Promise<void>
}
```

### Instance Management

```typescript
// Get statistics about active instances
const stats = getTelegramAskStats();
console.log(`Active instances: ${stats.totalInstances}`);

// Cleanup all instances (useful for testing)
clearAllTelegramAskInstances();
```

## Advanced Usage

### Custom Ask Options

```typescript
const askInstance = defineTelegramAsk(
  userId,
  chatId,
  botToken,
  openRouterToken,
  'Advanced Project',
  {
    exec: true,      // Enable JavaScript
    execTs: false,   // Disable TypeScript
    terminal: true,  // Enable terminal
    telegram: {
      botToken,
      chatId,
      bufferTime: 500,        // Faster responses
      maxMessageLength: 2000, // Shorter messages
      enableCodeBlocks: false // Disable code formatting
    }
  }
);
```

### Manual AskHasyx Creation with Custom Handlers

```typescript
import { AskHasyx, OutputHandlers } from 'hasyx/lib/ask-hasyx';
import { sendTelegramMessage } from 'hasyx/lib/telegram-bot';

const customHandlers: OutputHandlers = {
  onThinking: () => sendTelegramMessage(botToken, chatId, '🤔 Думаю...'),
  onCodeFound: async (code, format) => {
    await sendTelegramMessage(botToken, chatId, `🔍 Нашел ${format} код:`);
    await sendTelegramMessage(botToken, chatId, `\`\`\`${format}\n${code}\n\`\`\``);
  },
  onCodeResult: async (result) => {
    await sendTelegramMessage(botToken, chatId, `💡 Результат:\n\`\`\`\n${result}\n\`\`\``);
  },
  onError: (error) => sendTelegramMessage(botToken, chatId, `❌ Ошибка: ${error}`)
};

const askInstance = new AskHasyx(
  openRouterToken,
  {
    systemPrompt: 'Custom system prompt',
    askOptions: { exec: true, execTs: true, terminal: true },
    outputHandlers: customHandlers
  }
);
```

## Error Handling

### Automatic Error Handling

Система автоматически обрабатывает ошибки и отправляет понятные сообщения:

```typescript
// AI execution error
❌ Ошибка: JavaScript execution is disabled

// Network error
❌ Ошибка: Network timeout occurred

// API error  
❌ Sorry, there was an error processing your question: Invalid API key
```

### Custom Error Handling

```typescript
try {
  const response = await askInstance.ask(userQuestion);
} catch (error) {
  await sendTelegramMessage(
    botToken,
    chatId,
    `🔧 Техническая ошибка: ${error.message}\n\nПопробуйте позже или обратитесь к администратору.`
  );
}
```

## Performance & Optimization

### Instance Lifecycle

- **Creation**: Экземпляры создаются по требованию для каждого пользователя
- **Reuse**: Повторные запросы используют существующий экземпляр
- **Cleanup**: Автоматическая очистка неактивных экземпляров (1 час)
- **Memory**: Ограничение количества активных экземпляров

### Message Buffering

```typescript
// Messages are buffered for optimal delivery
onThinking: () => buffer.add('🧠 AI думает...')
onCodeFound: (code) => buffer.add(`📋 Код: ${code}`)
// Buffer flushes every 1000ms or when full
```

### Rate Limiting

```typescript
// Automatic delays between chunked messages
for (const chunk of chunks) {
  await sendTelegramMessage(botToken, chatId, chunk);
  await sleep(100); // Prevent rate limiting
}
```

## Monitoring & Debugging

### Statistics

```typescript
const stats = getTelegramAskStats();
console.log('Active instances:', stats.totalInstances);
console.log('Instances by age:', stats.instancesByAge);
```

### Debug Logging

```bash
DEBUG="hasyx:ask-telegram,hasyx:ask-hasyx" npm start
```

Output:
```
hasyx:ask-telegram Creating new TelegramAsk instance for user 12345, chat 67890
hasyx:ask-hasyx Processing question with beautiful output: What is 2+2?
hasyx:ask-telegram Processing question for chat 67890: What is 2+2?
```

### Health Check

```typescript
// Add to your monitoring
app.get('/health/telegram-ask', (req, res) => {
  const stats = getTelegramAskStats();
  res.json({
    status: 'healthy',
    activeInstances: stats.totalInstances,
    oldestInstance: stats.instancesByAge[0]?.ageMinutes || 0
  });
});
```

## Examples

### Simple Math Bot

```typescript
// User: "Calculate 15 * 27"
🧠 AI думает...
📋 Найден JS код для выполнения:
15 * 27
⚡ Выполняется JS код...
✅ Результат выполнения:
405

The result of 15 * 27 is 405.
```

### Code Generation Bot

```typescript
// User: "Create a React component for a button"
🧠 AI думает...

Here's a simple React button component:

```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

This component accepts children, click handler, and optional variant.
```
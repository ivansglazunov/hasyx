import { AskHasyx, AskOptions, OutputHandlers } from './ask-hasyx';
import { OpenRouter } from './openrouter';
import { ExecResult, ConsoleLog } from './exec';
import { sendTelegramMessage } from './telegram-bot';
import Debug from './debug';

const debug = Debug('hasyx:ask-telegram');

export interface TelegramConfig {
  botToken: string;
  chatId: number;
  bufferTime?: number; // Milliseconds to buffer messages (default: 1000)
  maxMessageLength?: number; // Max Telegram message length (default: 4096)
  enableCodeBlocks?: boolean; // Whether to format code blocks (default: true)
}

export interface TelegramAskOptions extends AskOptions {
  telegram?: TelegramConfig;
}

export interface TelegramAskInstance {
  ask: TelegramAskWrapper;
  lastActivity: Date;
  chatId: number;
  userId: number;
}

// Global instance manager
const instances = new Map<string, TelegramAskInstance>();

export class TelegramAskWrapper extends AskHasyx {
  private chatId: number;
  private botToken: string;
  private messageBuffer: string[] = [];
  private bufferTimeout: NodeJS.Timeout | null = null;
  private bufferTime: number;
  private maxMessageLength: number;
  private enableCodeBlocks: boolean;
  protected suppressConsoleOutput: boolean = true; // Suppress automatic console output for Telegram

  constructor(
    token: string,
    chatId: number,
    botToken: string,
    context: any = {},
    options: any = {},
    systemPrompt?: string,
    askOptions: TelegramAskOptions = {}
  ) {
    // Extract telegram options with proper default handling
    const telegramOptions = askOptions.telegram || {
      botToken,
      chatId,
      bufferTime: 1000,
      maxMessageLength: 4096,
      enableCodeBlocks: true
    };
    
    // Simple output handlers for Telegram (we handle most logic in overridden methods)
    const outputHandlers: OutputHandlers = {
      onWelcome: async (enabledEngines: string[]) => {
        await this.sendBufferedMessage('🤖 Добро пожаловать в Hasyx AI Telegram Bot!');
        if (enabledEngines.length > 0) {
          await this.sendBufferedMessage(`😈 Доступны движки: ${enabledEngines.join(', ')}`);
        }
        await this.sendBufferedMessage('Задавайте любые вопросы, я отвечу со стримингом!');
      },
      onGoodbye: () => this.sendBufferedMessage('👋 До свидания!')
    };

    // Remove telegram options from askOptions to avoid passing to parent
    const { telegram, ...cleanAskOptions } = askOptions;

    // Create OpenRouter provider for the new architecture
    const provider = new OpenRouter({
      token,
      ...options
    });

    super({
      provider,
      systemPrompt,
      askOptions: cleanAskOptions,
      outputHandlers
    });

    this.chatId = chatId;
    this.botToken = botToken;
    this.bufferTime = telegramOptions.bufferTime || 1000;
    this.maxMessageLength = telegramOptions.maxMessageLength || 4096;
    this.enableCodeBlocks = telegramOptions.enableCodeBlocks !== false;

    debug(`TelegramAskWrapper created for chat ${chatId}`);
  }

  // Override defaultOutput to use our Telegram message system
  protected defaultOutput(message: string): void {
    this.sendBufferedMessage(message);
  }

  // Override defaultError to use our Telegram message system  
  protected defaultError(error: string): void {
    this.sendBufferedMessage(`❌ ${error}`);
  }

  private async sendBufferedMessage(message: string): Promise<void> {
    this.messageBuffer.push(message);
    
    // Clear existing timeout
    if (this.bufferTimeout) {
      clearTimeout(this.bufferTimeout);
    }

    // Set new timeout to flush buffer
    this.bufferTimeout = setTimeout(() => {
      this.flushMessageBuffer();
    }, this.bufferTime);
  }

  private async flushMessageBuffer(): Promise<void> {
    if (this.messageBuffer.length === 0) return;

    try {
      const fullMessage = this.messageBuffer.join('\n');
      this.messageBuffer = [];
      this.bufferTimeout = null;

      // Split message if too long
      if (fullMessage.length <= this.maxMessageLength) {
        await sendTelegramMessage(this.botToken, this.chatId, fullMessage);
      } else {
        // Split into chunks
        const chunks = this.splitMessage(fullMessage, this.maxMessageLength);
        for (const chunk of chunks) {
          await sendTelegramMessage(this.botToken, this.chatId, chunk);
          // Small delay between chunks to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      debug('Error sending buffered message:', error);
      console.error('Failed to send Telegram message:', error);
    }
  }

  private splitMessage(message: string, maxLength: number): string[] {
    if (message.length <= maxLength) return [message];

    const chunks: string[] = [];
    let currentChunk = '';
    const lines = message.split('\n');

    for (const line of lines) {
      if ((currentChunk + '\n' + line).length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk);
          currentChunk = line;
        } else {
          // Line itself is too long, split it
          for (let i = 0; i < line.length; i += maxLength) {
            chunks.push(line.substring(i, i + maxLength));
          }
          currentChunk = '';
        }
      } else {
        currentChunk = currentChunk ? currentChunk + '\n' + line : line;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  // Override askWithBeautifulOutput to handle final text properly for Telegram
  async askWithBeautifulOutput(question: string): Promise<string> {
    debug(`Processing question with Telegram output for chat ${this.chatId}:`, question);
    
    try {
      let operationStartTime = Date.now();
      
      this.defaultOutput('🧠 AI думает...');
      this.defaultOutput(`🔧 Debug: Container ${process.env.HOSTNAME || 'unknown'}, Started: ${new Date().toISOString()}`);
      
      // Use the parent's askWithBeautifulOutput which handles code execution
      // Console output is suppressed by suppressConsoleOutput flag
      const processedResponse = await super.askWithBeautifulOutput(question);
      
      // ИСПРАВЛЕНО: Отправляем ответ AI в Telegram!
      if (processedResponse && processedResponse.trim()) {
        // Format the response as markdown for Telegram
        const { formatMarkdown } = await import('./markdown-terminal');
        const formatted = await formatMarkdown(processedResponse);
        this.defaultOutput(formatted);
      }
      
      const totalTime = Math.round((Date.now() - operationStartTime) / 1000);
      this.defaultOutput(`💭 Завершено (${totalTime}s)`);
      this.defaultOutput(`🔧 Debug: Container ${process.env.HOSTNAME || 'unknown'}, Complete`);
      
      // Flush any remaining messages
      await this.flushMessageBuffer();
      
      return processedResponse;
    } catch (error) {
      this.defaultError(`Ошибка: ${error instanceof Error ? error.message : String(error)}`);
      this.defaultOutput(`🔧 Debug: Error in Container ${process.env.HOSTNAME || 'unknown'}: ${error instanceof Error ? error.stack || 'No stack' : 'Unknown'}`);
      await this.flushMessageBuffer();
      throw error;
    }
  }

  // Override ask method to use our Telegram-specific askWithBeautifulOutput
  async ask(question: string): Promise<string> {
    debug(`Processing question for chat ${this.chatId}:`, question);
    return await super.ask(question);
  }

  // Force flush any pending messages
  async flush(): Promise<void> {
    await this.flushMessageBuffer();
  }
}

/**
 * Format execution result properly including logs (similar to AskHasyx.formatResult)
 */
function formatExecutionResult(result: any): string {
  // Handle new { result, logs } format from exec/exec-tsx
  if (result && typeof result === 'object' && 'result' in result && 'logs' in result) {
    const execResult = result as ExecResult;
    const formattedResult = formatSingleResult(execResult.result);
    
    if (execResult.logs && execResult.logs.length > 0) {
      const formattedLogs = execResult.logs.map(log => 
        `[${log.level.toUpperCase()}] ${log.args.map(arg => formatSingleResult(arg, true)).join(' ')}`
      ).join('\n');
      return `Result:\n${formattedResult}\n\nLogs:\n${formattedLogs}`;
    }
    return formattedResult;
  }
  
  // Handle terminal results or other direct results
  return formatSingleResult(result);
}

/**
 * Format single result value
 */
function formatSingleResult(result: any, isLogArg: boolean = false): string {
  if (result === undefined) return 'undefined';
  if (result === null) return 'null';
  if (typeof result === 'string') return result;
  if (typeof result === 'number' || typeof result === 'boolean') return String(result);
  if (result instanceof Error) return `Error: ${result.message}`;
  if (typeof result === 'function') return `[Function: ${result.name || 'anonymous'}]`;
  if (typeof result === 'object') {
    try {
      // For log arguments, use more compact format. For main results, pretty print.
      return JSON.stringify(result, null, isLogArg ? 0 : 2);
    } catch {
      return String(result);
    }
  }
  return String(result);
}

/**
 * Creates or retrieves a Telegram Ask instance for a specific user
 */
export function defineTelegramAsk(
  userId: number,
  chatId: number,
  botToken: string,
  openRouterToken: string,
  projectName: string = 'Telegram Bot',
  askOptions: TelegramAskOptions = {}
): TelegramAskWrapper {
  const instanceKey = `${userId}_${chatId}`;
  
  let instance = instances.get(instanceKey);
  
  if (!instance) {
    debug(`Creating new TelegramAsk instance for user ${userId}, chat ${chatId}`);
    
    // Create system prompt for Telegram bot
    const systemPrompt = `[SESSION ${Date.now()}] You are an AI assistant for the "${projectName}" project via Telegram.

We are working together through Telegram messages. When we need to execute code, analyze data, or perform operations, we work as a team.

**Communication Guidelines:**
- Always use "we" when referring to our work together ("we implemented", "we will try", "we observed", "we succeeded", "we agree", "we made a mistake")
- Execute code ONLY when calculations, demonstrations, or verification are actually needed
- For simple questions, conversations, or general knowledge - respond directly without code execution
- Keep responses concise and focused for Telegram format
- Use proper error handling and provide helpful explanations
- Remember this is a Telegram conversation - format responses appropriately

**IMPORTANT CODE EXECUTION RULES:**
- When you need to execute JavaScript, you MUST use the exact format: > 😈<uuid>/do/exec/js followed by \`\`\`js
- When you need to execute TypeScript, you MUST use the exact format: > 😈<uuid>/do/exec/tsx followed by \`\`\`tsx
- When you need to execute terminal commands, you MUST use the exact format: > 😈<uuid>/do/terminal/bash followed by \`\`\`bash
- NEVER use \`\`\`javascript or \`\`\`typescript or \`\`\`terminal - always use the exact formats above
- Always generate a unique UUID for each operation (use crypto.randomUUID() pattern)
- Only execute code when it's actually necessary to answer the question

**Examples:**
> 😈calc-123e4567-e89b-12d3-a456-426614174000/do/exec/js
\`\`\`js
2 + 2
\`\`\`

> 😈types-123e4567-e89b-12d3-a456-426614174001/do/exec/tsx
\`\`\`tsx
interface User { id: number; name: string }
const user: User = { id: 1, name: "John" };
user
\`\`\`

> 😈cmd-123e4567-e89b-12d3-a456-426614174002/do/terminal/bash
\`\`\`bash
echo "Hello World"
\`\`\`

**Important:** Don't separate yourself from the user - we are working together as a team. Only execute code when it's actually necessary to answer the question.`;

    const ask = new TelegramAskWrapper(
      openRouterToken,
      chatId,
      botToken,
      {}, // context
      {
        model: 'google/gemini-2.5-flash-preview',
        temperature: 0.1,
        max_tokens: 2048,
        user: `telegram_${userId}` // Unique user ID for OpenRouter to prevent caching conflicts
      }, // options
      systemPrompt,
      {
        exec: true,
        execTs: true,
        terminal: true,
        telegram: {
          botToken,
          chatId,
          bufferTime: 1000,
          maxMessageLength: 4096,
          enableCodeBlocks: true
        },
        ...askOptions
      }
    );

    // Code execution is now handled by the parent AskHasyx class automatically
    // No need to set up custom _do handler anymore
    
    // Clear memory for fresh start (important to prevent "memory" between containers)
    ask.clearMemory();

    instance = {
      ask,
      lastActivity: new Date(),
      chatId,
      userId
    };

    instances.set(instanceKey, instance);
    
    // Cleanup old instances (older than 1 hour)
    cleanupOldInstances();
  } else {
    // Update last activity
    instance.lastActivity = new Date();
    debug(`Retrieved existing TelegramAsk instance for user ${userId}, chat ${chatId}`);
    
    // For existing instances, clear memory if it's too large
    const memorySize = instance.ask.memory.length;
    if (memorySize > 20) { // If more than 20 messages, clear
      debug(`Clearing memory for user ${userId} (${memorySize} messages)`);
      instance.ask.clearMemory();
    }
  }

  return instance.ask;
}

/**
 * Cleanup instances older than 1 hour to prevent memory leaks
 */
function cleanupOldInstances(): void {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  for (const [key, instance] of instances.entries()) {
    if (instance.lastActivity < oneHourAgo) {
      debug(`Cleaning up old instance: ${key}`);
      instances.delete(key);
    }
  }
}

/**
 * Get statistics about active instances
 */
export function getTelegramAskStats(): {
  totalInstances: number;
  instancesByAge: { key: string; userId: number; chatId: number; ageMinutes: number }[];
} {
  const now = new Date();
  const instancesByAge = Array.from(instances.entries()).map(([key, instance]) => ({
    key,
    userId: instance.userId,
    chatId: instance.chatId,
    ageMinutes: Math.floor((now.getTime() - instance.lastActivity.getTime()) / (1000 * 60))
  }));

  return {
    totalInstances: instances.size,
    instancesByAge: instancesByAge.sort((a, b) => a.ageMinutes - b.ageMinutes)
  };
}

/**
 * Force cleanup all instances (useful for testing or maintenance)
 */
export function clearAllTelegramAskInstances(): void {
  debug(`Clearing all ${instances.size} instances`);
  instances.clear();
}

/**
 * Force cleanup and restart all instances (useful for container restarts)
 */
export function resetAllTelegramAskInstances(): void {
  debug(`Resetting all ${instances.size} instances`);
  
  // Clear memory for all instances  
  for (const [key, instance] of instances.entries()) {
    try {
      instance.ask.clearMemory();
      debug(`Cleared memory for instance: ${key}`);
    } catch (error) {
      debug(`Error clearing memory for instance ${key}:`, error);
    }
  }
  
  // Clear the instances map
  instances.clear();
  debug('All instances reset and cleared');
}

/**
 * Auto-cleanup function that should be called on container startup
 */
export function initializeTelegramAsk(): void {
  debug('Initializing Telegram Ask system...');
  
  // Force clear all instances on startup to prevent "memory" between container restarts
  resetAllTelegramAskInstances();
  
  // Set up periodic cleanup
  setInterval(() => {
    cleanupOldInstances();
    debug(`Periodic cleanup complete. Active instances: ${instances.size}`);
  }, 30 * 60 * 1000); // Every 30 minutes
  
  debug('Telegram Ask system initialized');
}

/**
 * Wraps any Ask class to work with Telegram
 * Creates a factory function that returns TelegramAskWrapper instances
 */
export function wrapTelegramAsk<T extends typeof AskHasyx>(
  AskClass: T,
  chatId: number,
  botToken: string,
  telegramOptions: Partial<TelegramConfig> = {}
): new (token: string, context?: any, options?: any, systemPrompt?: string, askOptions?: TelegramAskOptions) => TelegramAskWrapper {
  
  const fullTelegramOptions: Required<TelegramConfig> = {
    botToken,
    chatId,
    bufferTime: telegramOptions.bufferTime || 1000,
    maxMessageLength: telegramOptions.maxMessageLength || 4096,
    enableCodeBlocks: telegramOptions.enableCodeBlocks !== false
  };

  return class TelegramWrappedAsk extends TelegramAskWrapper {
    constructor(
      token: string,
      context: any = {},
      options: any = {},
      systemPrompt?: string,
      askOptions: TelegramAskOptions = {}
    ) {
      // Merge telegram options
      const mergedAskOptions: TelegramAskOptions = {
        ...askOptions,
        telegram: {
          botToken: fullTelegramOptions.botToken,
          chatId: fullTelegramOptions.chatId,
          bufferTime: askOptions.telegram?.bufferTime || fullTelegramOptions.bufferTime,
          maxMessageLength: askOptions.telegram?.maxMessageLength || fullTelegramOptions.maxMessageLength,
          enableCodeBlocks: askOptions.telegram?.enableCodeBlocks !== undefined 
            ? askOptions.telegram.enableCodeBlocks 
            : fullTelegramOptions.enableCodeBlocks
        }
      };

      super(
        token,
        chatId,
        botToken,
        context,
        options,
        systemPrompt,
        mergedAskOptions
      );
    }
  };
} 
/**
 * Basic AskTool Usage Example
 *
 * This example demonstrates how to use AskTool to wrap a single tool
 * and execute commands through it.
 */

import { AskTool } from '../../lib/ai/ask-tool';
import { ExecJSTool } from '../../lib/ai/tools/exec-js-tool';
import { OllamaProvider } from '../../lib/ai/providers/ollama';
import { OpenRouterProvider } from '../../lib/ai/providers/openrouter';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function basicExample() {
  console.log('=== Basic AskTool Usage Example ===\n');

  // Choose provider (Ollama for local, OpenRouter for cloud)
  const provider = process.env.OPENROUTER_API_KEY
    ? new OpenRouterProvider({
        token: process.env.OPENROUTER_API_KEY,
        model: 'deepseek/deepseek-chat-v3-0324:free'
      })
    : new OllamaProvider({ model: 'gemma2:2b' });

  // Create AskTool wrapper for JavaScript execution
  const askJS = new AskTool({
    tool: new ExecJSTool(),
    provider,
    onEvent: (event) => {
      // Optional: Log events for debugging
      if (event.type === 'tool_call') {
        console.log(`[Executing ${event.name}...]`);
      }
    }
  });

  // Example 1: Simple calculation
  console.log('Example 1: Simple calculation');
  const result1 = await askJS.ask('Calculate 42 * 137');
  console.log('Result:', result1.result);
  console.log('');

  // Example 2: Array operations
  console.log('Example 2: Array operations');
  const result2 = await askJS.ask('Get the sum of numbers from 1 to 100');
  console.log('Result:', result2.result);
  console.log('');

  // Example 3: String manipulation
  console.log('Example 3: String manipulation');
  const result3 = await askJS.ask('Reverse the string "Hello World"');
  console.log('Result:', result3.result);
  console.log('');

  // Example 4: Date operations
  console.log('Example 4: Date operations');
  const result4 = await askJS.ask('What is the current date and time?');
  console.log('Result:', result4.result);
  console.log('');

  console.log('=== Example completed ===');
}

// Run if executed directly
if (require.main === module) {
  basicExample().catch(console.error);
}

export { basicExample };

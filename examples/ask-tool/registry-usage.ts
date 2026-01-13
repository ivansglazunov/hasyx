/**
 * AskToolRegistry Usage Example
 *
 * This example demonstrates how to use AskToolRegistry to manage
 * multiple tools and provide a unified interface.
 */

import { AskToolRegistry } from '../../lib/ai/ask-tool';
import { ExecJSTool } from '../../lib/ai/tools/exec-js-tool';
import { ExecTSXTool } from '../../lib/ai/tools/exec-tsx-tool';
import { TerminalTool } from '../../lib/ai/tools/terminal-tool';
import { OllamaProvider } from '../../lib/ai/providers/ollama';
import { OpenRouterProvider } from '../../lib/ai/providers/openrouter';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function registryExample() {
  console.log('=== AskToolRegistry Usage Example ===\n');

  // Choose provider
  const provider = process.env.OPENROUTER_API_KEY
    ? new OpenRouterProvider({
        token: process.env.OPENROUTER_API_KEY,
        model: 'deepseek/deepseek-chat-v3-0324:free'
      })
    : new OllamaProvider({ model: 'gemma2:2b' });

  // Create registry
  const registry = new AskToolRegistry(provider, {
    onEvent: (event) => {
      if (event.type === 'tool_call') {
        console.log(`[${event.name}] Executing...`);
      }
    }
  });

  // Register multiple tools
  registry.register(new ExecJSTool());
  registry.register(new ExecTSXTool());
  registry.register(new TerminalTool({ timeout: 5000 }));

  // List available tools
  console.log('Available tools:');
  registry.list().forEach(tool => {
    console.log(`- ${tool.name}: ${tool.description.split('\n')[0]}`);
  });
  console.log('');

  // Example 1: Use JavaScript tool
  console.log('Example 1: JavaScript calculation');
  const result1 = await registry.ask('javascript', 'Calculate factorial of 5');
  console.log('Result:', result1.result);
  console.log('');

  // Example 2: Use Terminal tool
  console.log('Example 2: Terminal command');
  const result2 = await registry.ask('terminal', 'List files in current directory');
  console.log('Result:', result2.result);
  console.log('');

  // Example 3: Use TypeScript tool
  console.log('Example 3: TypeScript execution');
  const result3 = await registry.ask('typescript', 'Create a simple interface and object');
  console.log('Result:', result3.result);
  console.log('');

  // Example 4: Check if tool exists
  console.log('Example 4: Tool existence check');
  console.log('Has "javascript" tool:', registry.has('javascript'));
  console.log('Has "unknown" tool:', registry.has('unknown'));
  console.log('');

  console.log('=== Example completed ===');
}

// Run if executed directly
if (require.main === module) {
  registryExample().catch(console.error);
}

export { registryExample };

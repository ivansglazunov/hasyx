/**
 * Custom Tool with AskTool Example
 *
 * This example demonstrates how to create a custom tool and wrap it
 * with AskTool for easy usage.
 */

import { Tool, ToolResult } from '../../lib/ai/tool';
import { AskTool } from '../../lib/ai/ask-tool';
import { OllamaProvider } from '../../lib/ai/providers/ollama';
import { OpenRouterProvider } from '../../lib/ai/providers/openrouter';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Custom Math Tool - Performs advanced mathematical operations
 */
class MathTool extends Tool {
  constructor() {
    super({
      name: 'math',
      contextPreprompt: `📊 **Math Computation Tool (math)**

Perform advanced mathematical operations including:
- Basic arithmetic (add, subtract, multiply, divide)
- Statistical operations (mean, median, mode, stddev)
- Trigonometric functions (sin, cos, tan)
- Power and root operations

Format: > 😈<uuid>/math/exec
Example: > 😈calc-123/math/exec`
    });
  }

  async execute(command: string, content: string, tooler: any): Promise<ToolResult> {
    if (command.trim() !== 'exec') {
      throw new Error(`Unknown command for MathTool: ${command}`);
    }

    try {
      // Parse the mathematical expression or operation
      const operation = content.trim().toLowerCase();

      // Example operations
      if (operation.includes('mean') || operation.includes('average')) {
        const numbers = this.extractNumbers(content);
        const result = numbers.reduce((a, b) => a + b, 0) / numbers.length;
        return { id: 'not_used', result };
      }

      if (operation.includes('sum')) {
        const numbers = this.extractNumbers(content);
        const result = numbers.reduce((a, b) => a + b, 0);
        return { id: 'not_used', result };
      }

      if (operation.includes('max')) {
        const numbers = this.extractNumbers(content);
        const result = Math.max(...numbers);
        return { id: 'not_used', result };
      }

      if (operation.includes('min')) {
        const numbers = this.extractNumbers(content);
        const result = Math.min(...numbers);
        return { id: 'not_used', result };
      }

      // Default: try to evaluate as expression
      // Note: In production, use a safe math evaluator library
      const result = eval(content);
      return { id: 'not_used', result };

    } catch (error) {
      return {
        id: 'not_used',
        result: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private extractNumbers(text: string): number[] {
    const matches = text.match(/-?\d+\.?\d*/g);
    return matches ? matches.map(Number) : [];
  }
}

async function customToolExample() {
  console.log('=== Custom Tool with AskTool Example ===\n');

  // Choose provider
  const provider = process.env.OPENROUTER_API_KEY
    ? new OpenRouterProvider({
        token: process.env.OPENROUTER_API_KEY,
        model: 'deepseek/deepseek-chat-v3-0324:free'
      })
    : new OllamaProvider({ model: 'gemma2:2b' });

  // Create custom math tool
  const mathTool = new MathTool();

  // Wrap it with AskTool
  const askMath = new AskTool({
    tool: mathTool,
    provider,
    onEvent: (event) => {
      if (event.type === 'tool_call') {
        console.log(`[Math Tool] Executing operation...`);
      }
    }
  });

  // Example 1: Calculate mean
  console.log('Example 1: Calculate mean of numbers');
  const result1 = await askMath.ask('Calculate the mean of: 10, 20, 30, 40, 50');
  console.log('Result:', result1.result);
  console.log('');

  // Example 2: Find maximum
  console.log('Example 2: Find maximum value');
  const result2 = await askMath.ask('What is the max of: 42, 17, 89, 23, 61');
  console.log('Result:', result2.result);
  console.log('');

  // Example 3: Calculate sum
  console.log('Example 3: Sum of numbers');
  const result3 = await askMath.ask('Sum these numbers: 100, 200, 300');
  console.log('Result:', result3.result);
  console.log('');

  // Example 4: Get tool info
  console.log('Example 4: Tool information');
  const info = askMath.getToolInfo();
  console.log('Tool Name:', info.name);
  console.log('Description:', info.description.split('\n')[0]);
  console.log('');

  console.log('=== Example completed ===');
}

// Run if executed directly
if (require.main === module) {
  customToolExample().catch(console.error);
}

export { customToolExample, MathTool };

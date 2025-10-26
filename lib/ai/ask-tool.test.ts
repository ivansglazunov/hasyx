/**
 * Tests for AskTool universal wrapper
 */

import { jest } from '@jest/globals';
import { AskTool, AskToolRegistry } from './ask-tool';
import { Tool, ToolResult } from './tool';
import { AIProvider, AIMessage } from './ai';

/**
 * Mock Tool for testing
 */
class MockCalculatorTool extends Tool {
  constructor() {
    super({
      name: 'calculator',
      contextPreprompt: `Calculate mathematical expressions`
    });
  }

  async execute(command: string, content: string): Promise<ToolResult> {
    if (command !== 'exec') {
      throw new Error(`Unknown command: ${command}`);
    }

    try {
      // Simple calculator: just evaluate numbers and basic operators
      const result = eval(content.replace(/[^0-9+\-*/().]/g, ''));
      return { id: 'test-id', result };
    } catch (error) {
      return {
        id: 'test-id',
        result: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

/**
 * Mock Provider for testing
 */
class MockProvider implements AIProvider {
  private mockResponse: string;

  constructor(mockResponse?: string) {
    this.mockResponse = mockResponse || this.generateMockToolResponse();
  }

  private generateMockToolResponse(): string {
    return `> 😈test-uuid/calculator/exec
\`\`\`javascript
2 + 2
\`\`\``;
  }

  async query(messages: AIMessage[]): Promise<AIMessage> {
    return {
      role: 'assistant',
      content: this.mockResponse
    };
  }

  async stream(messages: AIMessage[]): Promise<ReadableStream<string>> {
    const content = this.mockResponse;
    return new ReadableStream({
      start(controller) {
        controller.enqueue(content);
        controller.close();
      }
    });
  }

  setMockResponse(response: string) {
    this.mockResponse = response;
  }
}

describe('AskTool', () => {
  let mockProvider: MockProvider;
  let calculatorTool: MockCalculatorTool;

  beforeEach(() => {
    mockProvider = new MockProvider();
    calculatorTool = new MockCalculatorTool();
  });

  describe('Basic Functionality', () => {
    it('should create AskTool instance', () => {
      const askTool = new AskTool({
        tool: calculatorTool,
        provider: mockProvider
      });

      expect(askTool).toBeDefined();
      expect(askTool.getTool()).toBe(calculatorTool);
    });

    it('should execute tool and return result', async () => {
      const askTool = new AskTool({
        tool: calculatorTool,
        provider: mockProvider
      });

      const result = await askTool.ask('Calculate 2 + 2');

      expect(result).toBeDefined();
      expect(result.result).toBe(4);
      expect(result.error).toBeUndefined();
    });

    it('should handle tool execution errors', async () => {
      mockProvider.setMockResponse(`> 😈test-uuid/calculator/exec
\`\`\`javascript
invalid expression!!!
\`\`\``);

      const askTool = new AskTool({
        tool: calculatorTool,
        provider: mockProvider
      });

      const result = await askTool.ask('Invalid calculation');

      expect(result).toBeDefined();
      expect(result.error).toBeDefined();
    });

    it('should return conversation history', async () => {
      const askTool = new AskTool({
        tool: calculatorTool,
        provider: mockProvider
      });

      const result = await askTool.ask('Calculate 5 * 5');

      expect(result.conversation).toBeDefined();
      expect(result.conversation?.length).toBe(2);
      expect(result.conversation?.[0]).toBe('Calculate 5 * 5');
    });

    it('should emit events during execution', async () => {
      const events: string[] = [];

      const askTool = new AskTool({
        tool: calculatorTool,
        provider: mockProvider,
        onEvent: (event) => {
          events.push(event.type);
        }
      });

      await askTool.ask('Calculate 10 + 10');

      expect(events.length).toBeGreaterThan(0);
      expect(events).toEqual(expect.arrayContaining(['ask', 'done']));
    });
  });

  describe('Tool Information', () => {
    it('should return tool info', () => {
      const askTool = new AskTool({
        tool: calculatorTool,
        provider: mockProvider
      });

      const info = askTool.getToolInfo();

      expect(info).toBeDefined();
      expect(info.name).toBe('calculator');
      expect(info.description).toBe('Calculate mathematical expressions');
    });

    it('should allow custom system prompt', () => {
      const customPrompt = 'Custom system instructions';
      const askTool = new AskTool({
        tool: calculatorTool,
        provider: mockProvider,
        systemPrompt: customPrompt
      });

      expect(askTool).toBeDefined();
    });
  });

  describe('Streaming Mode', () => {
    it('should support streaming mode', async () => {
      const askTool = new AskTool({
        tool: calculatorTool,
        provider: mockProvider,
        stream: true
      });

      const result = await askTool.ask('Calculate 3 + 7');

      expect(result).toBeDefined();
      expect(result.result).toBe(10);
    });
  });
});

describe('AskToolRegistry', () => {
  let mockProvider: MockProvider;
  let calculatorTool: MockCalculatorTool;

  beforeEach(() => {
    mockProvider = new MockProvider();
    calculatorTool = new MockCalculatorTool();
  });

  describe('Registration', () => {
    it('should create registry instance', () => {
      const registry = new AskToolRegistry(mockProvider);
      expect(registry).toBeDefined();
    });

    it('should register a tool', () => {
      const registry = new AskToolRegistry(mockProvider);
      const askTool = registry.register(calculatorTool);

      expect(askTool).toBeDefined();
      expect(registry.has('calculator')).toBe(true);
    });

    it('should register multiple tools', () => {
      const registry = new AskToolRegistry(mockProvider);

      const tool1 = new MockCalculatorTool();
      const tool2 = new (class extends Tool {
        constructor() {
          super({ name: 'tool2', contextPreprompt: 'Test tool 2' });
        }
        async execute(): Promise<ToolResult> {
          return { id: 'test', result: 'test' };
        }
      })();

      registry.register(tool1);
      registry.register(tool2);

      expect(registry.has('calculator')).toBe(true);
      expect(registry.has('tool2')).toBe(true);
    });

    it('should get registered tool', () => {
      const registry = new AskToolRegistry(mockProvider);
      registry.register(calculatorTool);

      const askTool = registry.get('calculator');
      expect(askTool).toBeDefined();
      expect(askTool?.getTool()).toBe(calculatorTool);
    });

    it('should return undefined for non-existent tool', () => {
      const registry = new AskToolRegistry(mockProvider);
      const askTool = registry.get('nonexistent');
      expect(askTool).toBeUndefined();
    });
  });

  describe('Tool Operations', () => {
    it('should list all registered tools', () => {
      const registry = new AskToolRegistry(mockProvider);
      registry.register(calculatorTool);

      const tools = registry.list();
      expect(tools).toHaveLength(1);
      expect(tools[0].name).toBe('calculator');
    });

    it('should execute tool by name', async () => {
      const registry = new AskToolRegistry(mockProvider);
      registry.register(calculatorTool);

      const result = await registry.ask('calculator', 'Calculate 20 + 22');
      expect(result).toBeDefined();
      expect(result.result).toBe(42);
    });

    it('should throw error for non-existent tool', async () => {
      const registry = new AskToolRegistry(mockProvider);

      await expect(
        registry.ask('nonexistent', 'Do something')
      ).rejects.toThrow(/not found in registry/);
    });

    it('should unregister a tool', () => {
      const registry = new AskToolRegistry(mockProvider);
      registry.register(calculatorTool);

      expect(registry.has('calculator')).toBe(true);
      const result = registry.unregister('calculator');
      expect(result).toBe(true);
      expect(registry.has('calculator')).toBe(false);
    });

    it('should return false when unregistering non-existent tool', () => {
      const registry = new AskToolRegistry(mockProvider);
      const result = registry.unregister('nonexistent');
      expect(result).toBe(false);
    });

    it('should clear all tools', () => {
      const registry = new AskToolRegistry(mockProvider);
      registry.register(calculatorTool);
      registry.register(new (class extends Tool {
        constructor() {
          super({ name: 'tool2', contextPreprompt: 'Test' });
        }
        async execute(): Promise<ToolResult> {
          return { id: 'test', result: 'test' };
        }
      })());

      expect(registry.list()).toHaveLength(2);
      registry.clear();
      expect(registry.list()).toHaveLength(0);
    });
  });

  describe('Default Options', () => {
    it('should apply default options to registered tools', () => {
      const onEvent = jest.fn();
      const registry = new AskToolRegistry(mockProvider, {
        stream: true,
        onEvent
      });

      const askTool = registry.register(calculatorTool);
      expect(askTool).toBeDefined();
    });
  });
});

describe('Integration Tests', () => {
  it('should work end-to-end with real tool flow', async () => {
    const mockProvider = new MockProvider(`> 😈uuid-123/calculator/exec
\`\`\`javascript
15 * 3
\`\`\``);

    const calculatorTool = new MockCalculatorTool();
    const askTool = new AskTool({
      tool: calculatorTool,
      provider: mockProvider
    });

    const result = await askTool.ask('What is 15 times 3?');

    expect(result.result).toBe(45);
    expect(result.error).toBeUndefined();
    expect(result.conversation).toHaveLength(2);
    expect(result.events).toBeDefined();
  });

  it('should work with registry end-to-end', async () => {
    const mockProvider = new MockProvider(`> 😈uuid-456/calculator/exec
\`\`\`javascript
100 - 42
\`\`\``);

    const registry = new AskToolRegistry(mockProvider);
    registry.register(new MockCalculatorTool());

    const result = await registry.ask('calculator', 'Subtract 42 from 100');

    expect(result.result).toBe(58);
    expect(result.error).toBeUndefined();
  });
});

# AskTool Examples

This directory contains examples demonstrating how to use the AskTool universal wrapper for AI tools.

## Overview

AskTool provides a simple, unified interface for executing AI tools without dealing with the complexity of Dialog, Tooler, and Provider configuration.

## Examples

### 1. Basic Usage (`basic-usage.ts`)

Demonstrates how to wrap a single tool (ExecJSTool) and execute simple commands:

```bash
npx tsx examples/ask-tool/basic-usage.ts
```

**Features:**
- Simple AskTool initialization
- Executing calculations, array operations, string manipulation
- Event callbacks for monitoring execution

### 2. Registry Usage (`registry-usage.ts`)

Shows how to use AskToolRegistry to manage multiple tools:

```bash
npx tsx examples/ask-tool/registry-usage.ts
```

**Features:**
- Managing multiple tools in a registry
- Listing available tools
- Executing commands on specific tools by name
- Checking tool existence

### 3. Custom Tool (`custom-tool.ts`)

Demonstrates creating a custom tool and wrapping it with AskTool:

```bash
npx tsx examples/ask-tool/custom-tool.ts
```

**Features:**
- Creating a custom MathTool
- Implementing tool logic
- Using AskTool with custom tools
- Getting tool information

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   # For OpenRouter (cloud)
   export OPENROUTER_API_KEY=your_api_key_here

   # OR use Ollama (local)
   # Make sure Ollama is running with a model installed
   ollama pull gemma2:2b
   ```

3. **Run an example:**
   ```bash
   npx tsx examples/ask-tool/basic-usage.ts
   ```

## API Reference

### AskTool

```typescript
import { AskTool } from 'hasyx/lib/ai/ask-tool';

const askTool = new AskTool({
  tool: myTool,           // Any Tool instance
  provider: myProvider,   // AIProvider instance
  systemPrompt?: string,  // Optional custom system prompt
  stream?: boolean,       // Use streaming (default: false)
  onEvent?: (event) => {} // Event callback
});

// Execute a request
const result = await askTool.ask('Your request here');
console.log(result.result);
```

### AskToolRegistry

```typescript
import { AskToolRegistry } from 'hasyx/lib/ai/ask-tool';

const registry = new AskToolRegistry(provider);

// Register tools
registry.register(new ExecJSTool());
registry.register(new TerminalTool());

// Execute on specific tool
const result = await registry.ask('javascript', 'Calculate 2 + 2');

// List tools
const tools = registry.list();

// Check existence
if (registry.has('javascript')) {
  // ...
}
```

## Creating Custom Tools

To create a custom tool:

1. **Extend the Tool class:**

```typescript
import { Tool, ToolResult } from 'hasyx/lib/ai/tool';

class MyCustomTool extends Tool {
  constructor() {
    super({
      name: 'mycustom',
      contextPreprompt: `Description of your tool and how to use it`
    });
  }

  async execute(command: string, content: string, tooler: any): Promise<ToolResult> {
    // Implement your tool logic
    try {
      const result = doSomething(content);
      return { id: 'not_used', result };
    } catch (error) {
      return {
        id: 'not_used',
        result: null,
        error: error.message
      };
    }
  }
}
```

2. **Wrap it with AskTool:**

```typescript
const askCustom = new AskTool({
  tool: new MyCustomTool(),
  provider: myProvider
});

const result = await askCustom.ask('Do something');
```

## Provider Configuration

### OpenRouter (Cloud)

```typescript
import { OpenRouterProvider } from 'hasyx/lib/ai/providers/openrouter';

const provider = new OpenRouterProvider({
  token: process.env.OPENROUTER_API_KEY,
  model: 'deepseek/deepseek-chat-v3-0324:free'
});
```

### Ollama (Local)

```typescript
import { OllamaProvider } from 'hasyx/lib/ai/providers/ollama';

const provider = new OllamaProvider({
  model: 'gemma2:2b'
});
```

## Use Cases

### 1. Simple Tool Wrapper

When you have a single tool and want the simplest possible interface:

```typescript
const askJS = new AskTool({ tool: new ExecJSTool(), provider });
const result = await askJS.ask('Calculate factorial of 10');
```

### 2. Multi-Tool Application

When your application needs multiple tools:

```typescript
const registry = new AskToolRegistry(provider);
registry.register(new ExecJSTool());
registry.register(new TerminalTool());
registry.register(new MyCustomTool());

// Use any registered tool
await registry.ask('javascript', 'Calculate sum');
await registry.ask('terminal', 'List files');
await registry.ask('mycustom', 'Do custom operation');
```

### 3. Custom Business Logic

When you need domain-specific tools:

```typescript
class DatabaseTool extends Tool {
  // Implement database operations
}

class APITool extends Tool {
  // Implement API calls
}

const registry = new AskToolRegistry(provider);
registry.register(new DatabaseTool());
registry.register(new APITool());
```

## Benefits

1. **Simplicity**: No need to manage Dialog, Tooler, or complex configuration
2. **Consistency**: Unified interface across all tools
3. **Flexibility**: Works with any Tool implementation
4. **Type Safety**: Full TypeScript support
5. **Event Handling**: Optional callbacks for monitoring execution
6. **Registry Pattern**: Easy management of multiple tools

## Best Practices

1. **Use Registry for Multiple Tools**: If you have more than one tool, use AskToolRegistry
2. **Provide Clear Prompts**: The quality of results depends on clear, specific requests
3. **Handle Errors**: Always check `result.error` for error handling
4. **Custom System Prompts**: Customize system prompts for domain-specific behavior
5. **Event Callbacks**: Use `onEvent` for logging and monitoring in production

## Troubleshooting

### Tool Not Executing

- Ensure the provider is correctly configured
- Check that the tool's `contextPreprompt` is clear and descriptive
- Verify the AI model understands the request

### Unexpected Results

- Make your request more specific
- Check the tool's implementation
- Use `onEvent` callback to see what's happening

### Provider Errors

- Verify API keys are set correctly
- Check network connectivity
- Ensure the model is available (for Ollama, ensure it's pulled)

## Contributing

To add new examples:

1. Create a new `.ts` file in this directory
2. Follow the existing example structure
3. Add documentation to this README
4. Test your example thoroughly

## License

Same as the parent project.

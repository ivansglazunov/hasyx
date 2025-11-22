/**
 * Universal Tool Wrapper for Ask Interface
 *
 * This module provides a universal wrapper that allows any Tool to be called
 * through a simple "ask" interface. It abstracts away the complexity of tool
 * registration, dialog management, and provider configuration.
 *
 * Usage:
 * ```typescript
 * import { AskTool } from './ask-tool';
 * import { ExecJSTool } from './tools/exec-js-tool';
 *
 * const askTool = new AskTool({
 *   tool: new ExecJSTool(),
 *   provider: myProvider
 * });
 *
 * const result = await askTool.ask('console.log("Hello World")');
 * console.log(result); // "Hello World"
 * ```
 */

import { Tool, ToolResult } from './tool';
import { Dialog, DialogEvent } from './dialog';
import { AIProvider } from './ai';
import { createSystemPrompt } from './core-prompts';
import Debug from '../debug';

const debug = Debug('ai:ask-tool');

export interface AskToolOptions {
  /** The tool to wrap */
  tool: Tool;
  /** AI Provider for generating responses */
  provider: AIProvider;
  /** Optional system prompt override */
  systemPrompt?: string;
  /** Whether to use streaming (default: false for simpler usage) */
  stream?: boolean;
  /** Optional callback for events during execution */
  onEvent?: (event: DialogEvent) => void;
}

export interface AskResult {
  /** The result from the tool execution */
  result: any;
  /** Any error that occurred */
  error?: string;
  /** The full conversation history */
  conversation?: string[];
  /** Raw dialog events */
  events?: DialogEvent[];
}

/**
 * Universal wrapper that makes any Tool callable through a simple ask() interface.
 *
 * This class encapsulates the complexity of Dialog, Tooler, and Provider configuration,
 * providing a single, simple entry point for tool execution.
 */
export class AskTool {
  private tool: Tool;
  private provider: AIProvider;
  private systemPrompt: string;
  private stream: boolean;
  private onEvent?: (event: DialogEvent) => void;

  constructor(options: AskToolOptions) {
    this.tool = options.tool;
    this.provider = options.provider;
    this.stream = options.stream ?? false;
    this.onEvent = options.onEvent;

    // Generate system prompt
    const appContext = `You are an AI assistant that helps users by executing ${this.tool.name} operations.
Your role is to understand the user's request and execute it using the ${this.tool.name} tool.

**IMPORTANT:**
- When the user provides a request, analyze it and execute it using the tool
- Always respond with the tool execution format, not with explanatory text
- Be precise and execute exactly what the user asks for`;

    const toolDescriptions = [`- ${this.tool.name}: ${this.tool.contextPreprompt}`];

    this.systemPrompt = options.systemPrompt || createSystemPrompt(appContext, toolDescriptions);

    debug('AskTool initialized for tool: %s', this.tool.name);
  }

  /**
   * Ask the AI to execute a task using the wrapped tool.
   *
   * @param request - The user's request/command to execute
   * @returns Promise resolving to the tool execution result
   */
  async ask(request: string): Promise<AskResult> {
    debug('Processing ask request: %s', request);

    const events: DialogEvent[] = [];
    let toolResult: ToolResult | undefined;
    let aiResponse: string = '';

    return new Promise((resolve, reject) => {
      const dialog = new Dialog({
        provider: this.provider,
        tools: [this.tool],
        systemPrompt: this.systemPrompt,
        method: this.stream ? 'stream' : 'query',
        onChange: (event: DialogEvent) => {
          debug('Dialog event: %s', event.type);
          events.push(event);

          // Forward events to user callback if provided
          if (this.onEvent) {
            this.onEvent(event);
          }

          switch (event.type) {
            case 'ai_response':
              aiResponse = event.content;
              break;
            case 'tool_result':
              toolResult = {
                id: event.id,
                result: event.result,
                error: event.error
              };
              break;
            case 'done':
              debug('Dialog completed');
              resolve({
                result: toolResult?.result,
                error: toolResult?.error,
                conversation: [request, aiResponse],
                events
              });
              break;
            case 'error':
              debug('Dialog error: %s', event.error);
              reject(new Error(event.error));
              break;
          }
        },
        onError: (error) => {
          debug('Dialog error callback: %o', error);
          reject(error);
        }
      });

      dialog.ask(request).catch(reject);
    });
  }

  /**
   * Get the wrapped tool instance
   */
  getTool(): Tool {
    return this.tool;
  }

  /**
   * Get information about the wrapped tool
   */
  getToolInfo(): { name: string; description: string } {
    return {
      name: this.tool.name,
      description: this.tool.contextPreprompt
    };
  }
}

/**
 * Registry for managing multiple AskTool instances.
 *
 * Useful when you want to wrap multiple tools and provide a unified interface.
 */
export class AskToolRegistry {
  private tools: Map<string, AskTool> = new Map();
  private provider: AIProvider;
  private defaultOptions: Partial<AskToolOptions>;

  constructor(provider: AIProvider, defaultOptions: Partial<AskToolOptions> = {}) {
    this.provider = provider;
    this.defaultOptions = defaultOptions;
    debug('AskToolRegistry initialized');
  }

  /**
   * Register a tool in the registry
   */
  register(tool: Tool, options?: Partial<AskToolOptions>): AskTool {
    const askTool = new AskTool({
      tool,
      provider: this.provider,
      ...this.defaultOptions,
      ...options
    });

    this.tools.set(tool.name, askTool);
    debug('Registered tool: %s', tool.name);

    return askTool;
  }

  /**
   * Get a registered AskTool by name
   */
  get(toolName: string): AskTool | undefined {
    return this.tools.get(toolName);
  }

  /**
   * Ask a specific tool by name
   */
  async ask(toolName: string, request: string): Promise<AskResult> {
    const askTool = this.tools.get(toolName);
    if (!askTool) {
      throw new Error(`Tool '${toolName}' not found in registry. Available tools: ${Array.from(this.tools.keys()).join(', ')}`);
    }
    return askTool.ask(request);
  }

  /**
   * List all registered tools
   */
  list(): Array<{ name: string; description: string }> {
    return Array.from(this.tools.values()).map(askTool => askTool.getToolInfo());
  }

  /**
   * Check if a tool is registered
   */
  has(toolName: string): boolean {
    return this.tools.has(toolName);
  }

  /**
   * Unregister a tool
   */
  unregister(toolName: string): boolean {
    const result = this.tools.delete(toolName);
    if (result) {
      debug('Unregistered tool: %s', toolName);
    }
    return result;
  }

  /**
   * Clear all registered tools
   */
  clear(): void {
    this.tools.clear();
    debug('Cleared all tools from registry');
  }
}

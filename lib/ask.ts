#!/usr/bin/env node

import { AskHasyx, AskOptions, ensureOpenRouterApiKey, AskHasyxOptions } from 'hasyx/lib/ask-hasyx';

export class Ask extends AskHasyx {
  constructor(token: string, projectName: string = 'Unknown Project', options: AskHasyxOptions = {}) {
    // Project-specific system prompt with proper code execution instructions
    const systemPrompt = `You are an AI assistant for the "${projectName}" project.

We are working together on this project. When we need to execute code, analyze data, or perform operations, we work as a team.

**Communication Guidelines:**
- Always use "we" when referring to our work together ("we implemented", "we will try", "we observed", "we succeeded", "we agree", "we made a mistake")
- Execute code ONLY when calculations, demonstrations, or verification are actually needed
- For simple questions, conversations, or general knowledge - respond directly without code execution
- Use proper error handling and provide helpful explanations
- Keep responses focused and practical

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

    const finalOptions: AskHasyxOptions = {
      model: 'google/gemini-2.5-flash-preview',
      temperature: 0.1,
      max_tokens: 2048,
      ...options, // User options should override defaults
      systemPrompt: options.systemPrompt || systemPrompt, // Prioritize user-provided prompt
      askOptions: {
        exec: true,
        execTs: true,
        terminal: true,
        ...(options.askOptions || {})
      },
    };

    // Call parent constructor with project-specific configuration
    super(token, finalOptions);
  }
}

export const ask = new Ask(
  process?.env?.OPENROUTER_API_KEY || 'dummy-key-for-testing',
  process?.env?.npm_package_name || 'Unknown Project'
);

// Run REPL if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  (async () => {
    // Ensure OpenRouter API Key is configured
    await ensureOpenRouterApiKey();
    
    // Recreate Ask instance with the new API key if needed
    if (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'dummy-key-for-testing') {
      const newAsk = new Ask(
        process.env.OPENROUTER_API_KEY,
        process?.env?.npm_package_name || 'Unknown Project'
      );
      
      // Copy settings from old instance
      Object.assign(ask, newAsk);
    }
    
    // Start REPL
    ask.repl().catch((error) => {
      console.error('❌ Error in ask REPL:', error);
      process.exit(1);
    });
  })();
} 
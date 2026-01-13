// Server-side only exports
// This file should only be imported in server-side code (API routes, server components, etc.)

// Export all utilities from the lib directory (including server-only modules)
export * from './apollo/apollo';
export * from './users/auth';
export * from './generator';
export * from './hasura/hasura';
export * from './hasyx/hasyx';
export * from './jwt';
export * from './utils';
export * from './provider';
export * from './notify/notify';
export * from './hid';
export * from './hasyx/hasyx-client';
export * from './pwa';

// Server-only modules (use Node.js APIs like fs, node-pty, etc.)
export * from './exec';
export * from './exec-tsx';
export * from './terminal';
export * from './markdown-terminal';

// AI module exports (event-driven LLM interaction system)
export * from './ai/ai';
export * from './ai/dialog';
export * from './ai/dialog-parser';
export * from './ai/tool';
export * from './ai/tooler';
export * from './ai/core-prompts';
export * from './ai/console';
export * from './ai/terminal';
export * from './ai/telegram';

// AI providers
export * from './ai/providers/ollama';
export * from './ai/providers/openrouter';
export * from './ai/providers/api-route';

// AI tools
export * from './ai/tools/exec-js-tool';
export * from './ai/tools/exec-tsx-tool';
export * from './ai/tools/terminal-tool';

// AI handlers
export * from './ai/handlers/api-dialog';

// Re-export from auth.tsx (now including auth-next.ts indirectly)
export * from './users/auth';

// For backwards compatibility: explicitly re-export getTokenFromRequest
export type { JWT } from './users/auth-next';

// Re-export main client hooks for convenience
// These are available from ./provider.tsx directly
export { 
  useQuery, 
  useSubscription, 
  useMutation, 
  useSelect, 
  useInsert, 
  useUpdate, 
  useDelete, 
  useSubscribe 
} from './hasyx/hasyx-client'; 
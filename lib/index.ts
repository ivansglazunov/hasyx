// Client-safe exports
// This file can be safely imported in both client and server environments

// Export all utilities from the lib directory (client-safe modules only)
export * from './apollo/apollo';
export * from './users/auth';
export * from './users/auth-callback';
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

// Server-only modules are now in ./server.ts
// export * from './exec';        // Moved to server.ts
// export * from './exec-tsx';     // Moved to server.ts  
// export * from './terminal';    // Moved to server.ts
// export * from './openrouter';  // Moved to server.ts (uses exec)

// Re-export from auth.tsx (now including auth-next.ts indirectly)
export * from './users/auth';

// For backwards compatibility: explicitly re-export getTokenFromRequest
export type { JWT } from './users/auth-next';

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

export * from './i18n/hook';
export * from './i18n/index';

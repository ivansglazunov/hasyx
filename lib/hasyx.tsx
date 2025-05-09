import { useCreateApolloClient } from './apollo'; // Our client creation function
// import { useSession } from './auth'; // Removed useSession
import { ThemeProvider } from "hasyx/components/theme-provider";
import toUrl, { API_URL, url } from 'hasyx/lib/url';
import { SessionProvider } from "next-auth/react"; // SessionProvider needed for signIn/signOut
import { useMemo } from "react"; // Removed useEffect
import isEqual from 'react-fast-compare'; // Import for deep equality checks
import { Generate, GenerateOptions, GenerateResult } from "./generator";

import {
  ApolloError,
  MutationHookOptions as ApolloMutationHookOptions,
  QueryHookOptions as ApolloQueryHookOptions,
  ApolloQueryResult,
  SubscriptionHookOptions as ApolloSubscriptionHookOptions,
  FetchResult,
  Observable,
  OperationVariables,
  QueryResult,
  SubscriptionResult
} from '@apollo/client';
import { HasyxApolloClient } from './apollo';
import Debug from './debug';

// Import and re-export all client-side hooks from hasyx-client.tsx
export {
  useClient, useDelete, useInsert, useMutation, useQuery, useSelect, useSubscribe, useSubscription, useUpdate
} from './hasyx-client';

const debug = Debug('client');

// Check if WebSockets are disabled via environment variable
const isWsDisabled = !+(process.env.NEXT_PUBLIC_WS || '1');

// Default polling interval for subscription polling fallback in milliseconds
const DEFAULT_POLLING_INTERVAL = 1000;

interface ClientMethodOptions extends Omit<GenerateOptions, 'operation'> {
  role?: string;
  pollingInterval?: number; // New option for controlling polling interval
}

export class Hasyx {
  public apolloClient: HasyxApolloClient;
  public generate: Generate;
  private _options?: { secret?: string };

  constructor(apolloClient: HasyxApolloClient, generate: Generate, options?: { secret?: string }) {
    if (!apolloClient) {
      throw new Error('❌ ApolloClient instance must be provided to the Client constructor.');
    }
    this.apolloClient = apolloClient;
    this.generate = generate; // Use the imported generator function
    this._options = options; // Store options, including a potential admin secret
    debug('Client class initialized with ApolloClient instance.');
  }

  /**
   * Executes a GraphQL query (select operation).
   * @param options - Options for generating the query, including an optional `role`.
   * @returns Promise resolving with the query result data (unwrapped from the top-level key, e.g., the array or single object), except for aggregate queries which return the full `{ aggregate, nodes }` structure.
   * @throws ApolloError if the query fails or returns GraphQL errors.
   */
  async select<TData = any>(options: ClientMethodOptions): Promise<TData> {
    const { role, ...genOptions } = options; // Extract role
    debug('Executing select with options:', genOptions, 'Role:', role);
    const generated: GenerateResult = this.generate({ ...genOptions, operation: 'query' });
    try {
      const result: ApolloQueryResult<any> = await this.apolloClient.query({ // Use any for intermediate result
        query: generated.query,
        variables: generated.variables,
        fetchPolicy: 'network-only', // Ensure fresh data for direct calls
        context: role ? { role } : undefined, // Pass role in context
      });

      if (result.errors) {
        debug('GraphQL errors during select:', result.errors);
        throw new ApolloError({ graphQLErrors: result.errors });
      }
      debug('Select successful, raw data:', result.data);

      // --- Data Extraction Logic ---
      // Keep full structure for aggregate queries
      if (genOptions.aggregate) {
          return result.data as TData;
      }
      // Extract data using the queryName from generator
      const extractedData = result.data?.[generated.queryName] ?? null;
      debug('Select extracted data:', extractedData);
      return extractedData as TData;
      // --- End Extraction Logic ---

    } catch (error) {
      debug('Error during select:', error);
      throw error; // Re-throw original error (could be ApolloError or network error)
    }
  }

  /**
   * Executes a GraphQL insert mutation.
   * @param options - Options for generating the mutation, including an optional `role`.
   * @returns Promise resolving with the mutation result data. For single inserts (`insert_table_one`), returns the inserted object. For bulk inserts, returns the full `{ affected_rows, returning }` object.
   * @throws ApolloError if the mutation fails or returns GraphQL errors.
   */
  async insert<TData = any>(options: ClientMethodOptions): Promise<TData> {
    const { role, ...genOptions } = options; // Extract role
    debug('Executing insert with options:', genOptions, 'Role:', role);
    const generated: GenerateResult = this.generate({ ...genOptions, operation: 'insert' });
    try {
      const result: FetchResult<any> = await this.apolloClient.mutate({ // Use any for intermediate result
        mutation: generated.query,
        variables: generated.variables,
        context: role ? { role } : undefined, // Pass role in context
      });

      if (result.errors) {
        debug('GraphQL errors during insert:', result.errors);
        throw new ApolloError({ graphQLErrors: result.errors });
      }
      const rawData = result.data ?? {};
      debug('Insert successful, raw data:', rawData);

      // --- Data Extraction Logic ---
      // Keep full structure for bulk inserts (returning { affected_rows, returning }) 
      // Check if it looks like a bulk response based on queryName AND presence of affected_rows/returning
      const isBulkInsert = !generated.queryName.endsWith('_one') && ('affected_rows' in rawData || 'returning' in rawData);
      if (isBulkInsert) {
          debug('Insert identified as bulk, returning full data object.');
          return rawData as TData;
      } else {
          // Extract data for single inserts (insert_table_one returns the object directly)
          const extractedData = rawData?.[generated.queryName] ?? null;
          debug('Insert identified as single, returning extracted data:', extractedData);
          return extractedData as TData;
      }
      // --- End Extraction Logic ---

    } catch (error) {
      debug('Error during insert:', error);
      throw error;
    }
  }

  /**
   * Executes a GraphQL update mutation.
   * @param options - Options for generating the mutation, including an optional `role`.
   * @returns Promise resolving with the mutation result data. For `_by_pk` updates, returns the updated object. For bulk updates (using `where`), returns the full `{ affected_rows, returning }` object.
   * @throws ApolloError if the mutation fails or returns GraphQL errors.
   */
  async update<TData = any>(options: ClientMethodOptions): Promise<TData> {
    const { role, ...genOptions } = options; // Extract role
    debug('Executing update with options:', genOptions, 'Role:', role);
    const generated: GenerateResult = this.generate({ ...genOptions, operation: 'update' });
    try {
      const result: FetchResult<any> = await this.apolloClient.mutate({ // Use any for intermediate result
        mutation: generated.query,
        variables: generated.variables,
        context: role ? { role } : undefined, // Pass role in context
      });

      if (result.errors) {
        debug('GraphQL errors during update:', result.errors);
        throw new ApolloError({ graphQLErrors: result.errors });
      }
      const rawData = result.data ?? {};
      debug('Update successful, raw data:', rawData);

      // --- Data Extraction Logic ---
      // Keep full structure for bulk updates (returning { affected_rows, returning })
      const isBulkUpdate = !generated.queryName.endsWith('_by_pk') && ('affected_rows' in rawData || 'returning' in rawData);
      if (isBulkUpdate) {
          debug('Update identified as bulk, returning full data object.');
          return rawData as TData;
      } else {
          // Extract data for single updates (update_table_by_pk returns the object directly)
          const extractedData = rawData?.[generated.queryName] ?? null;
          debug('Update identified as single (_by_pk), returning extracted data:', extractedData);
          return extractedData as TData;
      }
      // --- End Extraction Logic ---

    } catch (error) {
      debug('Error during update:', error);
      throw error;
    }
  }

  /**
   * Executes a GraphQL delete mutation.
   * @param options - Options for generating the mutation, including an optional `role`.
   * @returns Promise resolving with the mutation result data. For `_by_pk` deletes, returns the deleted object. For bulk deletes (using `where`), returns the full `{ affected_rows, returning }` object.
   * @throws ApolloError if the mutation fails or returns GraphQL errors.
   */
  async delete<TData = any>(options: ClientMethodOptions): Promise<TData> {
    const { role, ...genOptions } = options; // Extract role
    debug('Executing delete with options:', genOptions, 'Role:', role);
    const generated: GenerateResult = this.generate({ ...genOptions, operation: 'delete' });
    try {
      const result: FetchResult<any> = await this.apolloClient.mutate({ // Use any for intermediate result
        mutation: generated.query,
        variables: generated.variables,
        context: role ? { role } : undefined, // Pass role in context
      });

      if (result.errors) {
        debug('GraphQL errors during delete:', result.errors);
        throw new ApolloError({ graphQLErrors: result.errors });
      }
      const rawData = result.data ?? {};
      debug('Delete successful, raw data:', rawData);

      // --- Data Extraction Logic ---
      // Keep full structure for bulk deletes (returning { affected_rows, returning })
      const isBulkDelete = !generated.queryName.endsWith('_by_pk') && ('affected_rows' in rawData || 'returning' in rawData);
      if (isBulkDelete) {
          debug('Delete identified as bulk, returning full data object.');
          return rawData as TData;
      } else {
          // Extract data for single deletes (delete_table_by_pk returns the object directly)
          const extractedData = rawData?.[generated.queryName] ?? null;
          debug('Delete identified as single (_by_pk), returning extracted data:', extractedData);
          return extractedData as TData;
      }
      // --- End Extraction Logic ---

    } catch (error) {
      debug('Error during delete:', error);
      throw error;
    }
  }

  /**
   * Initiates a GraphQL subscription or sets up polling as a fallback when WebSockets are disabled.
   * @param options - Options for generating the subscription, including an optional `role` and `pollingInterval`.
   * @returns An Observable for the subscription results, emitting the unwrapped data directly.
   */
  subscribe<TData = any, TVariables extends OperationVariables = OperationVariables>(
    options: ClientMethodOptions
  ): Observable<TData> {
    const { role, pollingInterval, ...genOptions } = options;
    const interval = pollingInterval || DEFAULT_POLLING_INTERVAL;
    
    debug(`Initiating ${isWsDisabled ? 'polling-based' : 'WebSocket'} subscription with options:`, 
          genOptions, 'Role:', role, isWsDisabled ? `Polling interval: ${interval}ms` : '');
    
    // If WebSockets are disabled, use polling as a fallback
    if (isWsDisabled) {
      // Create a new Observable that implements polling via repeated queries
      return new Observable<TData>(observer => {
        let lastData: TData | null = null;
        let isActive = true;
        let timeoutId: NodeJS.Timeout | null = null;
        
        // Function to execute the query and emit results if they've changed
        const pollForChanges = async () => {
          if (!isActive) return;
          
          try {
            // Use the select method which already handles data extraction
            const result = await this.select<TData>({ 
              ...genOptions, 
              role
            });
            
            // Only emit if data has changed (deep equality check)
            if (!isEqual(result, lastData)) {
              debug('Polling subscription detected changes:', JSON.stringify(result));
              lastData = result as TData;
              observer.next(result);
            }
            
            // Schedule next poll if still active
            if (isActive) {
              timeoutId = setTimeout(pollForChanges, interval);
            }
          } catch (error) {
            debug('Error during polling subscription:', error);
            // Only emit error if still active
            if (isActive) {
              observer.error(error);
            }
          }
        };
        
        // Start polling immediately
        pollForChanges();
        
        // Return unsubscribe function
        return () => {
          debug('Unsubscribing from polling subscription.');
          isActive = false;
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        };
      });
    }
    
    // Use WebSocket-based subscription if WebSockets are enabled (default behavior)
    const generated: GenerateResult = this.generate({ ...genOptions, operation: 'subscription' });

    // Create a new Observable to wrap the Apollo subscription
    return new Observable<TData>(observer => {
      // Subscribe to the actual Apollo client subscription
      const apolloSubscription = this.apolloClient.subscribe<any, TVariables>({
        query: generated.query,
        variables: generated.variables as TVariables,
        context: role ? { role } : undefined,
      }).subscribe({
        next: (result: FetchResult<any>) => {
          if (result.errors) {
            debug('GraphQL errors during subscription:', result.errors);
            // Forward ApolloError to the observer
            observer.error(new ApolloError({ graphQLErrors: result.errors }));
            return;
          }
          const rawData = result.data ?? null; // Use null if no data
          debug('Subscription received raw data:', JSON.stringify(rawData));
          debug('Subscription expected queryName:', generated.queryName);

          // --- Data Extraction Logic ---
          let extractedData: TData;
          // Keep full structure for aggregate queries
          if (genOptions.aggregate) {
            debug('Subscription is aggregate, returning raw data.');
            extractedData = rawData as TData;
          } else {
            // Extract data using the queryName from generator
            extractedData = rawData?.[generated.queryName] ?? null;
            // Fallback: If queryName extraction failed, try using the base table name
            if (!extractedData && rawData?.[genOptions.table]) {
                debug(`Subscription extracted data using queryName ('${generated.queryName}') failed, falling back to base table name ('${genOptions.table}').`);
                extractedData = rawData[genOptions.table];
                 // For _by_pk subscriptions returning an array with one item under the base table name
                 if (generated.queryName.endsWith('_by_pk') && Array.isArray(extractedData) && extractedData.length === 1) {
                     debug(`Subscription fallback found array for _by_pk, extracting first element.`);
                     extractedData = extractedData[0];
                 } else if (generated.queryName.endsWith('_by_pk') && Array.isArray(extractedData) && extractedData.length === 0) {
                     debug(`Subscription fallback found empty array for _by_pk, setting to null.`);
                     extractedData = null as TData; // Cast null to TData
                 } else {
                  debug('Subscription extracted data using queryName:', JSON.stringify(extractedData));
                 }
            } else {
              debug('Subscription extracted data using queryName:', JSON.stringify(extractedData));
            }
          }
          debug('Subscription emitting final extracted data:', JSON.stringify(extractedData));
          observer.next(extractedData); // Emit the extracted data
          // --- End Extraction Logic ---
        },
        error: (error) => {
          debug('Error during subscription:', error);
          observer.error(error); // Forward the error
        },
        complete: () => {
          debug('Subscription completed.');
          observer.complete(); // Forward the completion
        },
      });

      // Return the unsubscribe function
      return () => {
        debug('Unsubscribing from Apollo subscription.');
        apolloSubscription.unsubscribe();
      };
    });
  }

  // Instance methods that return React hooks
  // These are implemented by delegating to the exported hooks from hasyx-client.tsx
  useSubscription<TData = any, TVariables extends OperationVariables = OperationVariables>(
    generateOptions: ClientGeneratorOptions,
    hookOptions?: SubscriptionHookOptions<TData, TVariables> & { variables?: TVariables }
  ): SubscriptionResult<TData, TVariables> {
    // This is just a stub - actual implementation is in hasyx-client.tsx
    throw new Error("This method should not be called directly from the server component.");
  }

  useQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(
    generateOptions: ClientGeneratorOptions,
    hookOptions?: QueryHookOptions<TData, TVariables> & { variables?: TVariables }
  ): QueryResult<TData, TVariables> {
    // This is just a stub - actual implementation is in hasyx-client.tsx
    throw new Error("This method should not be called directly from the server component.");
  }

  /**
   * Inserts a debug log entry if HASYX_DEBUG is enabled and admin secret is present.
   * This method is intended for server-side admin use only.
   * @param value - The JSONB value to log.
   * @returns The result of the insert operation promise, or undefined if not executed.
   */
  debug(value: any): Promise<any> | undefined {
    // Check for HASYX_DEBUG environment variable
    const hasyxDebugEnabled = typeof process !== 'undefined' && typeof process.env !== 'undefined' && !!+(process.env.HASYX_DEBUG || '0');

    // Check for admin secret via the _options property
    const isAdminContext = !!this?.apolloClient?._options?.secret;

    if (hasyxDebugEnabled && isAdminContext) {
      debug('Executing debug log insert with value:', value);
      try {
        // Return the promise directly without await, fire-and-forget style
        return this.insert<any>({ 
          table: 'debug', 
          object: { value: value } 
        });
      } catch (error) {
        // Log error but don't throw, as it's fire-and-forget
        console.error('Error during debug insert (fire-and-forget):', error);
        debug('Error during debug insert (fire-and-forget):', error);
        return undefined;
      }
    } else {
      if (!hasyxDebugEnabled) {
        debug('Debug insert skipped: HASYX_DEBUG is not enabled.');
      }
      if (!isAdminContext) {
        debug('Debug insert skipped: Not in admin context (no admin secret found in Hasyx options).');
      }
      return undefined;
    }
  }
}

// Type Definitions (shared with hasyx-client.tsx)
type ClientGeneratorOptions = Omit<GenerateOptions, 'operation'>;

type BaseHookOptions = {
  role?: string;
  pollingInterval?: number; // Add polling interval option
};

type QueryHookOptions<TData, TVariables extends OperationVariables> = BaseHookOptions & Omit<ApolloQueryHookOptions<TData, TVariables>, 'query' | 'variables' | 'context'>;
type SubscriptionHookOptions<TData, TVariables extends OperationVariables> = BaseHookOptions & Omit<ApolloSubscriptionHookOptions<TData, TVariables>, 'query' | 'variables' | 'context'>;
type MutationHookOptions<TData, TVariables extends OperationVariables> = BaseHookOptions & Omit<ApolloMutationHookOptions<TData, TVariables>, 'mutation' | 'variables' | 'context'>;

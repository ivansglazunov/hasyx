import { Hasura } from './hasura';
import Debug from './debug';
import fs from 'fs-extra';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import dotenv from 'dotenv';

// dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config();

const debug = Debug('events');

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_MAIN_URL || process.env.NEXT_PUBLIC_BASE_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_MAIN_URL | NEXT_PUBLIC_BASE_URL || NEXT_PUBLIC_API_URL is not set');
}

/**
 * Structure of a Hasura Event Trigger definition file
 */
export interface EventTriggerDefinition {
  name: string;
  table: {
    schema: string;
    name: string;
  };
  source?: string; // Defaults to 'default' if not specified
  webhook?: string; // Full URL for webhook
  webhook_path?: string; // Path only, to be combined with API_URL
  insert?: {
    columns: string | string[];
  };
  update?: {
    columns: string | string[];
  };
  delete?: {
    columns: string | string[];
  };
  enable_manual?: boolean;
  retry_conf?: {
    num_retries?: number;
    interval_sec?: number;
    timeout_sec?: number;
  };
  headers?: {
    name: string;
    value?: string;
    value_from_env?: string;
  }[];
}

/**
 * Structure of a Hasura Cron Trigger definition file
 */
export interface CronTriggerDefinition {
  name: string;
  webhook?: string; // Full URL for webhook
  webhook_path?: string; // Path only, to be combined with API_URL
  schedule: string; // Cron expression
  payload?: any; // JSON payload to send
  comment?: string; // Optional comment
  retry_conf?: {
    num_retries?: number;
    timeout_seconds?: number;
    tolerance_seconds?: number;
    retry_interval_seconds?: number;
  };
  headers?: {
    name: string;
    value?: string;
    value_from_env?: string;
  }[];
  include_in_metadata?: boolean; // Whether to include in metadata export
}

/**
 * Union type for both event and cron trigger definitions
 */
export type TriggerDefinition = EventTriggerDefinition | CronTriggerDefinition;

/**
 * Type guard to check if definition is a cron trigger
 */
export function isCronTrigger(def: TriggerDefinition): def is CronTriggerDefinition {
  return 'schedule' in def;
}

/**
 * Type guard to check if definition is an event trigger
 */
export function isEventTrigger(def: TriggerDefinition): def is EventTriggerDefinition {
  return 'table' in def;
}

/**
 * Validate that an event trigger definition has all required fields
 */
export function validateEventTriggerDefinition(def: EventTriggerDefinition): string[] {
  const errors: string[] = [];

  if (!def.name) {
    errors.push('Event trigger must have a name');
  }

  if (!def.table) {
    errors.push('Event trigger must specify a table');
  } else {
    if (!def.table.schema) {
      errors.push('Event trigger table must specify a schema');
    }
    if (!def.table.name) {
      errors.push('Event trigger table must specify a name');
    }
  }

  // Either webhook or webhook_path must be specified
  if (!def.webhook && !def.webhook_path) {
    errors.push('Event trigger must specify either webhook or webhook_path');
  }

  // At least one operation must be defined
  if (!def.insert && !def.update && !def.delete && !def.enable_manual) {
    errors.push('Event trigger must specify at least one operation (insert, update, delete) or enable_manual');
  }

  return errors;
}

/**
 * Validate that a cron trigger definition has all required fields
 */
export function validateCronTriggerDefinition(def: CronTriggerDefinition): string[] {
  const errors: string[] = [];

  if (!def.name) {
    errors.push('Cron trigger must have a name');
  }

  if (!def.schedule) {
    errors.push('Cron trigger must specify a schedule (cron expression)');
  }

  // Either webhook or webhook_path must be specified
  if (!def.webhook && !def.webhook_path) {
    errors.push('Cron trigger must specify either webhook or webhook_path');
  }

  return errors;
}

/**
 * Validate a trigger definition (either event or cron)
 */
export function validateTriggerDefinition(def: TriggerDefinition): string[] {
  if (isCronTrigger(def)) {
    return validateCronTriggerDefinition(def);
  } else {
    return validateEventTriggerDefinition(def);
  }
}

/**
 * Load all trigger definitions from a directory (both event and cron triggers)
 */
export async function loadTriggerDefinitions(eventsDir: string): Promise<{
  eventTriggers: EventTriggerDefinition[];
  cronTriggers: CronTriggerDefinition[];
}> {
  debug(`Loading trigger definitions from ${eventsDir}`);
  const eventTriggers: EventTriggerDefinition[] = [];
  const cronTriggers: CronTriggerDefinition[] = [];

  try {
    // Ensure the directory exists
    if (!await fs.pathExists(eventsDir)) {
      debug(`Events directory ${eventsDir} does not exist`);
      return { eventTriggers, cronTriggers };
    }

    // Read all files in the directory
    const files = await fs.readdir(eventsDir);
    debug(`Found ${files.length} files in events directory`);

    for (const file of files) {
      // Only process .json files
      if (!file.endsWith('.json')) {
        debug(`Skipping non-JSON file: ${file}`);
        continue;
      }

      try {
        const filePath = path.join(eventsDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const triggerDef: TriggerDefinition = JSON.parse(content);

        // Use filename (without extension) as trigger name if not specified
        if (!triggerDef.name) {
          triggerDef.name = path.basename(file, '.json');
          debug(`Using filename as trigger name: ${triggerDef.name}`);
        }

        // Validate and categorize the trigger definition
        const errors = validateTriggerDefinition(triggerDef);
        if (errors.length > 0) {
          debug(`Invalid trigger definition in ${file}: ${errors.join(', ')}`);
        } else {
          if (isCronTrigger(triggerDef)) {
            cronTriggers.push(triggerDef);
            debug(`Loaded cron trigger definition: ${triggerDef.name}`);
          } else {
            eventTriggers.push(triggerDef);
            debug(`Loaded event trigger definition: ${triggerDef.name}`);
          }
        }
      } catch (error) {
        debug(`Error processing file ${file}: ${error}`);
      }
    }
  } catch (error) {
    debug(`Error loading trigger definitions: ${error}`);
  }

  return { eventTriggers, cronTriggers };
}

/**
 * Load all event trigger definitions from a directory (legacy function)
 */
export async function loadEventTriggerDefinitions(eventsDir: string): Promise<EventTriggerDefinition[]> {
  const { eventTriggers } = await loadTriggerDefinitions(eventsDir);
  return eventTriggers;
}

/**
 * Creates or updates an event trigger in Hasura
 */
export async function createOrUpdateEventTrigger(
  hasura: Hasura,
  trigger: EventTriggerDefinition,
  baseUrl?: string
): Promise<boolean> {
  try {
    debug(`Creating/updating event trigger: ${trigger.name}`);

    // Prepare the URL - use webhook if provided, otherwise combine baseUrl with webhook_path
    let webhookUrl = trigger.webhook;
    if (!webhookUrl && trigger.webhook_path) {
      if (!baseUrl) {
        baseUrl = API_URL || '';
        if (!baseUrl) {
          debug('No base URL specified and API_URL is not set');
          return false;
        }
      }

      // Normalize base URL to not end with slash
      baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

      // Normalize webhook_path to start with slash
      const webhookPath = trigger.webhook_path.startsWith('/')
        ? trigger.webhook_path
        : `/${trigger.webhook_path}`;

      webhookUrl = `${baseUrl}${webhookPath}`;
      debug(`Constructed webhook URL: ${webhookUrl}`);
    }

    // Set default source if not specified
    const source = trigger.source || 'default';

    // Always try to delete the trigger first to ensure clean state
    debug(`Attempting to delete event trigger ${trigger.name} before creating (if it exists)`);
    try {
      await hasura.v1({
        type: 'delete_event_trigger',
        args: {
          name: trigger.name,
          source
        }
      });
      debug(`Event trigger ${trigger.name} deleted successfully`);
      
      // Verify deletion by checking metadata
      try {
        const verifyResponse = await hasura.v1({
          type: 'export_metadata',
          args: {}
        });
        
        let stillExists = false;
        if (verifyResponse?.sources) {
          for (const sourceObj of verifyResponse.sources) {
            if (sourceObj.name !== source) continue;
            if (sourceObj.tables) {
              for (const table of sourceObj.tables) {
                if (table.event_triggers) {
                  stillExists = table.event_triggers.some((et: { name: string }) => et.name === trigger.name);
                  if (stillExists) {
                    debug(`⚠️ Trigger ${trigger.name} still exists in table ${table.table.schema}.${table.table.name} after deletion!`);
                    break;
                  }
                }
              }
            }
            if (stillExists) break;
          }
        }
        
        if (!stillExists) {
          debug(`✅ Verified: Trigger ${trigger.name} successfully removed from metadata`);
        }
      } catch (verifyErr) {
        debug(`Failed to verify deletion: ${verifyErr}`);
      }
      
      // Small delay to ensure metadata consistency
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (delErr: any) {
      if (delErr?.response?.data?.error?.includes('does not exist')) {
        debug(`Event trigger ${trigger.name} did not exist, proceeding with creation`);
      } else {
        debug(`Failed to delete event trigger ${trigger.name}:`, delErr?.response?.data || delErr);
      }
    }

    // Prepare the arguments for the API call using the Postgres backend spec (pg_create_event_trigger)
    const args: any = {
      name: trigger.name,
      source,
      table: trigger.table,
      webhook: webhookUrl
    };

    if (trigger.insert) args.insert = trigger.insert;
    if (trigger.update) args.update = trigger.update;
    if (trigger.delete) args.delete = trigger.delete;
    if (trigger.enable_manual !== undefined) args.enable_manual = trigger.enable_manual;

    // Add retry configuration if specified
    if (trigger.retry_conf) args.retry_conf = trigger.retry_conf;

    // Get the HASURA_EVENT_SECRET from environment
    const eventSecret = process.env.HASURA_EVENT_SECRET;

    // Clone the headers array from the trigger definition or create a new one
    const headers = trigger.headers ? [...trigger.headers] : [];

    // Check if the event secret header already exists in the array
    const hasEventSecretHeader = headers.some(h =>
      h.name.toLowerCase() === 'x-hasura-event-secret' &&
      (h.value_from_env === 'HASURA_EVENT_SECRET' || h.value === eventSecret)
    );

    // Add the event secret header if it doesn't exist and the secret is set
    if (!hasEventSecretHeader && eventSecret) {
      headers.push({
        name: 'X-Hasura-Event-Secret',
        value_from_env: 'HASURA_EVENT_SECRET'
      });
      debug('Added X-Hasura-Event-Secret header to event trigger');
    } else if (!hasEventSecretHeader) {
      debug('WARNING: HASURA_EVENT_SECRET not set in environment, skipping secret header');
    }

    // Add headers to args if any exist
    if (headers.length > 0) args.headers = headers;

    // Set replace to false since we delete before creating
    args.replace = false;

    // Create or update the event trigger (Postgres backend)
    const type = 'pg_create_event_trigger';
    const result = await hasura.v1({ type, args });

    if (result && (result.error || result.code)) {
      debug(`❌ Error response for ${trigger.name}:`, JSON.stringify(result));
      return false;
    }

    debug(`✅ API response for ${trigger.name}:`, JSON.stringify(result));
    debug(`Event trigger ${trigger.name} created successfully`);
    return true;
  } catch (error) {
    debug(`Error creating/updating event trigger ${trigger.name}: ${error}`);
    return false;
  }
}

/**
 * Deletes an event trigger in Hasura
 */
export async function deleteEventTrigger(hasura: Hasura, name: string, source: string = 'default'): Promise<boolean> {
  try {
    debug(`Deleting event trigger: ${name}`);

    const result = await hasura.v1({
      type: 'pg_delete_event_trigger',
      args: {
        name,
        source
      }
    });

    debug(`Event trigger ${name} deleted successfully`);
    return true;
  } catch (error) {
    debug(`Error deleting event trigger ${name}: ${error}`);
    return false;
  }
}

/**
 * Gets all event triggers configured in Hasura
 */
export async function getExistingEventTriggers(hasura: Hasura): Promise<Record<string, EventTriggerDefinition>> {
  try {
    debug('Getting existing event triggers');

    const response = await hasura.v1({
      type: 'export_metadata',
      args: {}
    });

    const existingTriggers: Record<string, EventTriggerDefinition> = {};

    if (response?.metadata?.sources) {
      for (const source of response.metadata.sources) {
        if (source.tables) {
          for (const table of source.tables) {
            if (table.event_triggers) {
              for (const trigger of table.event_triggers) {
                existingTriggers[trigger.name] = {
                  name: trigger.name,
                  table: {
                    schema: table.table.schema,
                    name: table.table.name
                  },
                  source: source.name,
                  webhook: trigger.webhook,
                  ...trigger.definition
                };
                debug(`Found existing trigger: ${trigger.name}`);
              }
            }
          }
        }
      }
    }

    return existingTriggers;
  } catch (error) {
    debug(`Error getting existing event triggers: ${error}`);
    return {};
  }
}

/**
 * Synchronizes event triggers between local definitions and Hasura
 * - Creates triggers that exist locally but not in Hasura
 * - Updates triggers that exist both locally and in Hasura
 * - Deletes triggers that exist in Hasura but not locally
 */
export async function syncEventTriggers(hasura: Hasura, localTriggers: EventTriggerDefinition[], baseUrl?: string): Promise<void> {
  try {
    debug('Starting event trigger synchronization');
    
    // First, reload metadata with recreate_event_triggers to fix any ghost triggers
    debug('Reloading metadata with event trigger recreation to fix ghost triggers');
    try {
      await hasura.v1({
        type: 'reload_metadata',
        args: {
          reload_remote_schemas: false,
          reload_sources: false,
          recreate_event_triggers: true
        }
      });
      debug('Metadata reloaded successfully with event trigger recreation');
    } catch (reloadError) {
      debug('Failed to reload metadata:', reloadError);
    }

    // Get existing triggers from Hasura
    const existingTriggers = await getExistingEventTriggers(hasura);

    // Create a map of local triggers by name for easy lookup
    const localTriggerMap: Record<string, EventTriggerDefinition> = {};
    for (const trigger of localTriggers) {
      localTriggerMap[trigger.name] = trigger;
    }

    // Create or update local triggers
    debug(`Processing ${localTriggers.length} local triggers`);
    for (const trigger of localTriggers) {
      await createOrUpdateEventTrigger(hasura, trigger, baseUrl);
    }

    // Delete triggers that exist in Hasura but not locally
    for (const [name, trigger] of Object.entries(existingTriggers)) {
      if (!localTriggerMap[name]) {
        debug(`Deleting trigger ${name} as it no longer exists locally`);
        await deleteEventTrigger(hasura, name, trigger.source);
      }
    }

    debug('Event trigger synchronization completed');
  } catch (error) {
    debug(`Error synchronizing event triggers: ${error}`);
  }
}

/**
 * Create or update a cron trigger in Hasura
 */
export async function createOrUpdateCronTrigger(
  hasura: Hasura,
  trigger: CronTriggerDefinition,
  baseUrl?: string
): Promise<boolean> {
  debug(`Creating/updating cron trigger: ${trigger.name}`);

  try {
    // Validate the trigger definition
    const errors = validateCronTriggerDefinition(trigger);
    if (errors.length > 0) {
      debug(`Cron trigger ${trigger.name} validation errors: ${errors.join(', ')}`);
      return false;
    }

    // Construct the webhook URL
    let webhookUrl = trigger.webhook;
    if (!webhookUrl && trigger.webhook_path) {
      const base = baseUrl || API_URL;
      webhookUrl = `${base}${trigger.webhook_path}`;
    }

    if (!webhookUrl) {
      debug(`Cron trigger ${trigger.name} is missing webhook URL`);
      return false;
    }

    // Prepare headers with environment variable resolution
    const headers = (trigger.headers || []).map(header => {
      if (header.value_from_env) {
        return {
          name: header.name,
          value: process.env[header.value_from_env] || ''
        };
      }
      return {
        name: header.name,
        value: header.value || ''
      };
    });

    // Create or update the cron trigger
    await hasura.defineCronTrigger({
      name: trigger.name,
      webhook: webhookUrl,
      schedule: trigger.schedule,
      payload: trigger.payload,
      headers,
      replace: true
    });

    debug(`Cron trigger ${trigger.name} created/updated successfully`);
    return true;
  } catch (error) {
    debug(`Error creating/updating cron trigger ${trigger.name}: ${error}`);
    return false;
  }
}

/**
 * Delete a cron trigger from Hasura
 */
export async function deleteCronTrigger(hasura: Hasura, name: string): Promise<boolean> {
  debug(`Deleting cron trigger: ${name}`);

  try {
    await hasura.deleteCronTrigger({ name });
    debug(`Cron trigger ${name} deleted successfully`);
    return true;
  } catch (error) {
    debug(`Error deleting cron trigger ${name}: ${error}`);
    return false;
  }
}

/**
 * Get existing cron triggers from Hasura
 */
export async function getExistingCronTriggers(hasura: Hasura): Promise<Record<string, CronTriggerDefinition>> {
  debug('Getting existing cron triggers from Hasura');

  try {
    const metadata = await hasura.exportMetadata();
    const cronTriggers = metadata.cron_triggers || [];

    const existingTriggers: Record<string, CronTriggerDefinition> = {};

    for (const trigger of cronTriggers) {
      // Convert Hasura format back to our definition format
      const definition: CronTriggerDefinition = {
        name: trigger.name,
        webhook: trigger.webhook,
        schedule: trigger.schedule,
        payload: trigger.payload,
        comment: trigger.comment,
        retry_conf: trigger.retry_conf ? {
          num_retries: trigger.retry_conf.num_retries,
          timeout_seconds: trigger.retry_conf.timeout_seconds,
          tolerance_seconds: trigger.retry_conf.tolerance_seconds,
          retry_interval_seconds: trigger.retry_conf.retry_interval_seconds
        } : undefined,
        headers: trigger.headers ? trigger.headers.map((h: any) => ({
          name: h.name,
          value: h.value
        })) : undefined,
        include_in_metadata: trigger.include_in_metadata
      };

      existingTriggers[trigger.name] = definition;
    }

    debug(`Found ${Object.keys(existingTriggers).length} existing cron triggers`);
    return existingTriggers;
  } catch (error) {
    debug(`Error getting existing cron triggers: ${error}`);
    return {};
  }
}

/**
 * Synchronize local cron trigger definitions with Hasura
 */
export async function syncCronTriggers(hasura: Hasura, localTriggers: CronTriggerDefinition[], baseUrl?: string): Promise<void> {
  debug(`Synchronizing ${localTriggers.length} cron triggers with Hasura`);

  try {
    // Get existing triggers from Hasura
    const existingTriggers = await getExistingCronTriggers(hasura);
    const existingNames = new Set(Object.keys(existingTriggers));
    const localNames = new Set(localTriggers.map(t => t.name));

    // Create or update local triggers
    for (const trigger of localTriggers) {
      const success = await createOrUpdateCronTrigger(hasura, trigger, baseUrl);
      if (success) {
        debug(`✓ Cron trigger ${trigger.name} synchronized`);
      } else {
        debug(`✗ Failed to synchronize cron trigger ${trigger.name}`);
      }
    }

    // Delete triggers that exist in Hasura but not locally
    for (const existingName of existingNames) {
      if (!localNames.has(existingName)) {
        debug(`Deleting cron trigger ${existingName} (not found locally)`);
        await deleteCronTrigger(hasura, existingName);
      }
    }

    debug('Cron trigger synchronization completed');
  } catch (error) {
    debug(`Error synchronizing cron triggers: ${error}`);
  }
}

/**
 * Synchronize all triggers (both event and cron) from a directory
 */
export async function syncAllTriggersFromDirectory(eventsDir: string, hasuraUrl?: string, hasuraSecret?: string, baseUrl?: string): Promise<void> {
  debug('Synchronizing all triggers from directory');

  // Check if HASURA_EVENT_SECRET is set
  const eventSecret = process.env.HASURA_EVENT_SECRET;
  if (!eventSecret) {
    debug('HASURA_EVENT_SECRET not set in environment');
    console.warn('⚠️ WARNING: HASURA_EVENT_SECRET is not set. This is required for secure trigger handling.');
    console.warn('   Please set HASURA_EVENT_SECRET in your environment variables.');

    // In production, we should fail if the secret is not set
    if (process.env.NODE_ENV === 'production') {
      throw new Error('HASURA_EVENT_SECRET is required for trigger synchronization in production');
    }
  }

  // Create a Hasura client
  const url = hasuraUrl || process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
  const secret = hasuraSecret || process.env.HASURA_ADMIN_SECRET;

  if (!url || !secret) {
    debug('Missing Hasura URL or admin secret');
    throw new Error('NEXT_PUBLIC_HASURA_GRAPHQL_URL and HASURA_ADMIN_SECRET are required for trigger synchronization');
  }

  const hasura = new Hasura({ url, secret });

  // Load all trigger definitions from the directory
  const { eventTriggers, cronTriggers } = await loadTriggerDefinitions(eventsDir);
  debug(`Loaded ${eventTriggers.length} event triggers and ${cronTriggers.length} cron triggers`);

  // Synchronize both types of triggers
  await Promise.all([
    syncEventTriggers(hasura, eventTriggers, baseUrl),
    syncCronTriggers(hasura, cronTriggers, baseUrl)
  ]);

  debug('All triggers synchronized successfully');
}

/**
 * Main function to synchronize all event triggers from a directory (backward compatibility)
 */
export async function syncEventTriggersFromDirectory(eventsDir: string, hasuraUrl?: string, hasuraSecret?: string, baseUrl?: string): Promise<void> {
  debug('Synchronizing event triggers from directory (legacy function - use syncAllTriggersFromDirectory for full support)');
  
  // For backward compatibility, call the new function
  await syncAllTriggersFromDirectory(eventsDir, hasuraUrl, hasuraSecret, baseUrl);
}

/**
 * Verify that a request came from Hasura
 * This should be used in the event handler API route
 */
export function verifyHasuraRequest(headers: Record<string, string | string[] | undefined>, secret?: string): boolean {
  // If no secret is provided, use the HASURA_EVENT_SECRET environment variable
  const secretKey = secret || process.env.HASURA_EVENT_SECRET;

  // If no secret is configured, we should log a warning
  if (!secretKey) {
    // In production, this is a security risk, so we should fail the verification
    if (process.env.NODE_ENV === 'production') {
      debug('SECURITY WARNING: No HASURA_EVENT_SECRET configured in production environment! Request denied.');
      return false;
    }

    // In development, allow requests but log a warning
    debug('SECURITY WARNING: No HASURA_EVENT_SECRET configured! ANYONE can trigger your event handlers.');
    debug('Set HASURA_EVENT_SECRET in your .env file for secure event trigger handling.');
    return true;
  }

  // Get the secret from the request header
  const requestSecret = headers['x-hasura-event-secret'];
  const secretValue = Array.isArray(requestSecret) ? requestSecret[0] : requestSecret;

  // Compare the secrets
  const isValid = secretValue === secretKey;

  if (!isValid) {
    debug('Invalid event secret provided in request');
  }

  return isValid;
}

/**
 * Create default event trigger definitions for users and accounts tables
 */
export async function createDefaultEventTriggers(eventsDir: string): Promise<void> {
  debug(`Creating default event trigger definitions in ${eventsDir}`);

  // Ensure the events directory exists
  await fs.ensureDir(eventsDir);

  // Default users event trigger
  const usersEventTrigger: EventTriggerDefinition = {
    name: 'users',
    table: {
      schema: 'public',
      name: 'users'
    },
    webhook_path: '/api/events/users',
    insert: {
      columns: '*'
    },
    update: {
      columns: '*'
    },
    delete: {
      columns: '*'
    },
    retry_conf: {
      num_retries: 3,
      interval_sec: 15,
      timeout_sec: 60
    }
  };

  // Default accounts event trigger
  const accountsEventTrigger: EventTriggerDefinition = {
    name: 'accounts',
    table: {
      schema: 'public',
      name: 'accounts'
    },
    webhook_path: '/api/events/accounts',
    insert: {
      columns: '*'
    },
    update: {
      columns: '*'
    },
    delete: {
      columns: '*'
    },
    retry_conf: {
      num_retries: 3,
      interval_sec: 15,
      timeout_sec: 60
    }
  };

  // Write the trigger definitions to files
  await fs.writeFile(
    path.join(eventsDir, 'users.json'),
    JSON.stringify(usersEventTrigger, null, 2)
  );

  await fs.writeFile(
    path.join(eventsDir, 'accounts.json'),
    JSON.stringify(accountsEventTrigger, null, 2)
  );

  debug('Default event trigger definitions created');
}

// Event payload structure
export interface HasuraEventPayload {
  event: {
    session_variables?: Record<string, string>;
    op: 'INSERT' | 'UPDATE' | 'DELETE' | 'MANUAL';
    data: {
      old: any | null;
      new: any | null;
    };
    trace_context?: {
      trace_id: string;
      span_id: string;
    };
  };
  created_at: string;
  id: string;
  delivery_info: {
    max_retries: number;
    current_retry: number;
  };
  trigger: {
    name: string;
  };
  table: {
    schema: string;
    name: string;
  };
}

/**
 * Helper wrapper for Hasura event trigger handlers
 * This function handles verification, logging, and error handling for Hasura event triggers
 * 
 * @param handler Function to handle the validated event
 * @returns Next.js route handler
 */
export function hasyxEvent(
  handler: (payload: HasuraEventPayload) => Promise<Response | NextResponse | any>
) {
  return async (request: NextRequest, context?: any) => {
    const params = await context.params;
    const triggerName = params?.name || 'unknown';
    debug(`Received event trigger for ${triggerName}`);

    // Verify that the request is from Hasura
    if (!verifyHasuraRequest(Object.fromEntries(request.headers))) {
      debug(`Unauthorized request for event trigger ${triggerName}`);
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      // Parse the request body
      const body = await request.json();
      debug(`Raw request body for ${triggerName}:`, body);

      let actualPayload: HasuraEventPayload | null = null;

      // <<< ADAPTIVE PAYLOAD EXTRACTION >>>
      if (body && typeof body === 'object') {
        if ('payload' in body && body.payload && typeof body.payload === 'object') {
          // Standard case: Hasura sent { payload: { ... } }
          debug('Detected payload wrapped in top-level \'payload\' key.');
          actualPayload = body.payload as HasuraEventPayload;
        } else if ('event' in body && 'table' in body && 'trigger' in body) {
          // Non-standard case: It seems the outer 'payload' was unwrapped somewhere
          debug('Detected payload structure directly in request body (outer \'payload\' key possibly unwrapped).');
          actualPayload = body as HasuraEventPayload; // Consider body as the payload itself
        }
      }

      // Check if payload was extracted and has basic structure
      if (!actualPayload || !actualPayload.event || !actualPayload.table || !actualPayload.trigger) {
        const receivedBodyType = typeof body;
        const receivedBodyKeys = (body && typeof body === 'object') ? Object.keys(body) : null;
        const contentType = request.headers.get('content-type');

        const errorDetails = {
          message: 'Invalid or unrecognized payload structure received.',
          receivedBodyType: receivedBodyType,
          receivedBodyKeys: receivedBodyKeys,
          contentTypeHeader: contentType
        };

        debug('Invalid event payload details:', errorDetails);
        return NextResponse.json(
          errorDetails,
          { status: 400 }
        );
      }
      // <<< END OF ADAPTIVE EXTRACTION >>>

      const { event, table, trigger } = actualPayload;

      debug(`Extracted event payload for ${triggerName}:`, actualPayload);

      // Log details about the operation
      const { op, data } = event;
      const tableInfo = `${table.schema}.${table.name}`;

      // Extract the ID or primary key information for logging
      let recordInfo = '';
      if (op === 'INSERT' && data.new) {
        recordInfo = data.new.id ? `id:${data.new.id}` : JSON.stringify(data.new);
      } else if (op === 'UPDATE') {
        recordInfo = data.new?.id ? `id:${data.new.id}` : JSON.stringify(data.new);
      } else if (op === 'DELETE' && data.old) {
        recordInfo = data.old.id ? `id:${data.old.id}` : JSON.stringify(data.old);
      }

      debug(`Processing ${op} on ${tableInfo} ${recordInfo}`);

      // Call the handler with the *extracted* payload
      const result = await handler(actualPayload);

      // Convert the result to a NextResponse if it's not already
      if (!(result instanceof Response) && !(result instanceof NextResponse)) {
        return NextResponse.json(result || { success: true });
      }

      return result;
    } catch (error) {
      debug(`Error processing ${triggerName} event:`, error);
      return NextResponse.json(
        { message: 'Internal server error', error: String(error) },
        { status: 500 }
      );
    }
  };
}

/**
 * Main function that is executed when the script is called directly
 * Implements the same functionality as 'npx hasyx events' command
 */
export async function main() {
  debug('Executing events script directly.');
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const options = {
    init: args.includes('--init'),
    clean: args.includes('--clean'),
  };
  
  // Find project root and events directory
  const projectRoot = process.cwd();
  const eventsDir = path.join(projectRoot, 'events');
  
  // If --init flag is set, create default event trigger definitions
  if (options.init) {
    debug('Initializing events directory with default triggers');
    console.log('🏗️ Creating default event trigger definitions...');
    
    try {
      await createDefaultEventTriggers(eventsDir);
      console.log('✅ Default event trigger definitions created in events directory');
    } catch (error) {
      console.error('❌ Failed to create default event trigger definitions:', error);
      process.exit(1);
    }
    
    // Exit early if only initializing
    return;
  }
  
  // If --clean flag is set, clean security headers from event definitions
  if (options.clean) {
    debug('Cleaning security headers from event definitions');
    console.log('🧹 Cleaning security headers from event definitions...');
    
    try {
      // Ensure the events directory exists
      if (!fs.existsSync(eventsDir)) {
        console.log('⚠️ Events directory not found. Nothing to clean.');
        debug('Events directory does not exist, nothing to clean');
        return;
      }
      
      // Get all JSON files in the events directory
      const files = fs.readdirSync(eventsDir).filter(file => file.endsWith('.json'));
      debug(`Found ${files.length} JSON files in events directory`);
      
      if (files.length === 0) {
        console.log('⚠️ No event definition files found. Nothing to clean.');
        debug('No JSON files in events directory');
        return;
      }
      
      let cleanedCount = 0;
      
      // Process each file
      for (const file of files) {
        const filePath = path.join(eventsDir, file);
        debug(`Processing ${filePath}`);
        
        try {
          // Read the file
          const content = await fs.readFile(filePath, 'utf8');
          const triggerDef = JSON.parse(content);
          
          // Check if it has headers array with security header
          if (triggerDef.headers) {
            const originalLength = triggerDef.headers.length;
            
            // Filter out security headers
            triggerDef.headers = triggerDef.headers.filter((header: any) => 
              !(header.name.toLowerCase() === 'x-hasura-event-secret' && 
                (header.value_from_env === 'HASURA_EVENT_SECRET' || 
                 (header.value && header.value.length > 0)))
            );
            
            // If the headers array is now empty, remove it
            if (triggerDef.headers.length === 0) {
              delete triggerDef.headers;
              debug(`Removed empty headers array from ${file}`);
            }
            
            // If we made changes, write the file back
            if (!triggerDef.headers || triggerDef.headers.length !== originalLength) {
              await fs.writeFile(filePath, JSON.stringify(triggerDef, null, 2));
              console.log(`✅ Cleaned security headers from ${file}`);
              cleanedCount++;
              debug(`Cleaned security headers from ${file}`);
            }
          }
        } catch (error) {
          console.error(`❌ Failed to process ${file}:`, error);
          debug(`Error processing ${file}: ${error}`);
        }
      }
      
      console.log(`🧹 Cleaned security headers from ${cleanedCount} file(s).`);
      console.log('   Security headers will be added automatically during synchronization.');
      debug(`Finished cleaning ${cleanedCount} files`);
    } catch (error) {
      console.error('❌ Failed to clean security headers:', error);
      debug(`Error cleaning security headers: ${error}`);
      process.exit(1);
    }
    
    // Exit early if only cleaning
    return;
  }
  
  // Ensure the events directory exists
  if (!fs.existsSync(eventsDir)) {
    console.log('⚠️ Events directory not found. Creating empty directory.');
    debug('Creating events directory');
    try {
      fs.mkdirSync(eventsDir, { recursive: true });
    } catch (error) {
      console.error('❌ Failed to create events directory:', error);
      debug(`Error creating events directory: ${error}`);
      process.exit(1);
    }
  }
  
  // Check if the directory is empty and suggest --init
  const files = fs.readdirSync(eventsDir);
  if (files.length === 0) {
    console.log('⚠️ Events directory is empty. Use --init to create default event trigger definitions.');
    debug('Events directory is empty');
    process.exit(0);
  }
  
  // Synchronize event triggers
  console.log('🔄 Synchronizing Hasura event triggers...');
  debug('Synchronizing event triggers');
  
  try {
    // Determine base URL for webhook
    const baseUrl = API_URL;
    if (!baseUrl) {
      console.warn('⚠️ API_URL or NEXT_PUBLIC_BASE_URL not set. Using relative paths for webhooks.');
      console.warn('   This may cause issues if Hasura cannot access your API with relative paths.');
      console.warn('   For production, set NEXT_PUBLIC_MAIN_URL to your publicly accessible domain (e.g., https://your-domain.com).');
      debug('No base URL found in environment variables');
    } else {
      console.log(`ℹ️ Using base URL for webhooks: ${baseUrl}`);
    }
    
    await syncAllTriggersFromDirectory(eventsDir, undefined, undefined, baseUrl);
    console.log('✅ Event triggers synchronized successfully!');
    debug('Event triggers synchronized');
  } catch (error) {
    console.error('❌ Failed to synchronize event triggers:', error);
    debug(`Error synchronizing event triggers: ${error}`);
    process.exit(1);
  }
}

// Execute main function if this module is run directly
if (require.main === module) {
  main().catch(error => {
    console.error('Error executing events script:', error);
    process.exit(1);
  });
} 
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Debug from './debug'; // Assuming debug is in lib and alias @ points to root/src

const debug = Debug('hasura');

// Column types enum based on migrations analysis
export enum ColumnType {
  UUID = 'uuid',
  TEXT = 'text',
  BIGINT = 'bigint',
  BOOLEAN = 'boolean',
  JSONB = 'jsonb',
  NUMERIC = 'numeric',
  INTEGER = 'integer',
  TIMESTAMPTZ = 'timestamptz'
}

interface HasuraOptions {
  url: string;
  secret: string;
}

interface TrackTableOptions {
  schema: string;
  table: string | string[];
}

interface CreateTableOptions {
  schema: string;
  table: string;
  id?: string;
  type?: ColumnType;
}

interface DefineColumnOptions {
  schema: string;
  table: string;
  name: string;
  type: ColumnType;
  unique?: boolean;
  postfix?: string;
  comment?: string;
}

interface DeleteColumnOptions {
  schema: string;
  table: string;
  name: string;
  cascade?: boolean;
}

interface DeleteTableOptions {
  schema: string;
  table: string | string[];
  cascade?: boolean;
}

interface DefineRelationshipOptions {
  schema: string;
  table: string;
  name: string;
  key: string;
}

interface DefineUniversalRelationshipOptions {
  schema: string;
  table: string;
  name: string;
  type: 'object' | 'array';
  using: {
    foreign_key_constraint_on?: string | {
      table: { schema: string; name: string };
      column: string;
    };
    manual_configuration?: {
      remote_table: { schema: string; name: string };
      column_mapping: Record<string, string>;
    };
  };
}

interface DeleteRelationshipOptions {
  schema: string;
  table: string;
  name: string;
  cascade?: boolean;
}

interface DefinePermissionOptions {
  schema: string;
  table: string;
  operation: 'select' | 'insert' | 'update' | 'delete';
  role: string | string[];
  filter: any;
  check?: any; // For insert operations
  aggregate?: boolean;
  columns?: boolean | string[];
  set?: Record<string, string>; // Column presets for insert operations
}

interface DeletePermissionOptions {
  schema: string;
  table: string;
  operation: 'select' | 'insert' | 'update' | 'delete';
  role: string | string[];
  cascade?: boolean;
}

interface ColumnInfo {
  type: string;
  _type: string;
}

interface ForeignKeyOptions {
  from: { schema: string; table: string; column: string };
  to: { schema: string; table: string; column: string };
  on_delete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
  on_update?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
  name?: string;
}

interface FunctionOptions {
  schema: string;
  name: string;
  definition: string;
  language?: string;
  replace?: boolean;
}

interface TriggerOptions {
  schema: string;
  table: string;
  name: string;
  timing: 'BEFORE' | 'AFTER' | 'INSTEAD OF';
  event: 'INSERT' | 'UPDATE' | 'DELETE' | string;
  function_name: string;
  replace?: boolean;
}

interface ViewOptions {
  schema: string;
  name: string;
  definition: string;
}

interface ComputedFieldOptions {
  schema: string;
  table: string;
  name: string;
  definition: any;
}

interface RemoteSchemaOptions {
  name: string;
  definition: any;
}

interface RemoteRelationshipOptions {
  schema: string;
  table: string;
  name: string;
  remote_schema: string;
  hasura_fields: Record<string, any>;
  remote_field: any;
}

interface EventTriggerOptions {
  name: string;
  table: { schema: string; name: string };
  webhook: string;
  insert?: boolean;
  update?: boolean;
  delete?: boolean;
  headers?: Array<{ name: string; value?: string; value_from_env?: string }>;
  replace?: boolean;
}

interface CronTriggerOptions {
  name: string;
  webhook: string;
  schedule: string;
  payload?: any;
  headers?: Array<{ name: string; value?: string; value_from_env?: string }>;
  replace?: boolean;
}

interface DataSourceOptions {
  name: string;
  kind?: 'postgres' | 'mssql' | 'mysql' | 'bigquery';
  configuration: {
    connection_info: {
      database_url: string;
      isolation_level?: 'read-committed' | 'read-uncommitted' | 'repeatable-read' | 'serializable';
      use_prepared_statements?: boolean;
      pool_settings?: {
        max_connections?: number;
        idle_timeout?: number;
        retries?: number;
        pool_timeout?: number;
        connection_lifetime?: number;
      };
    };
  };
}

interface DataSourceInfo {
  name: string;
  kind: string;
  tables: any[];
  configuration: any;
}

export class Hasura {
  private readonly clientInstance: AxiosInstance;

  constructor(options: HasuraOptions) {
    const { url, secret } = options;

    if (!url || !secret) {
      const errorMessage = '❌ Hasura URL or Admin Secret is missing. Check NEXT_PUBLIC_HASURA_GRAPHQL_URL and HASURA_ADMIN_SECRET environment variables.';
      debug(errorMessage);
      throw new Error(errorMessage);
    }

    this.clientInstance = axios.create({
      baseURL: url.replace('/v1/graphql', ''), // Ensure base URL is correct
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': secret,
      },
      timeout: 30000, // 30 seconds timeout
      validateStatus: (status) => status < 500, // Accept 4xx as valid responses (they may contain error info)
    });
    debug('✅ Hasura client initialized successfully.');
  }

  get client(): AxiosInstance {
    return this.clientInstance;
  }

  /**
   * Universal wrapper for operations that might fail due to inconsistent metadata.
   * Automatically cleans up inconsistent metadata and retries the operation.
   */
  private async withInconsistentMetadataHandling<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      const errorMessage = error.message || error.response?.data?.error || '';
      
      // Check if error is related to inconsistent metadata
      if (errorMessage.includes('inconsistent metadata') || errorMessage.includes('cannot continue due to newly found inconsistent metadata')) {
        debug(`🔧 Inconsistent metadata detected in ${operationName}, attempting cleanup...`);
        
        try {
          // Get inconsistent metadata for debugging
          const inconsistentData = await this.getInconsistentMetadata();
          if (inconsistentData?.is_consistent === false && inconsistentData?.inconsistent_objects?.length > 0) {
            debug(`📋 Found ${inconsistentData.inconsistent_objects.length} inconsistent objects:`, 
              inconsistentData.inconsistent_objects.map((obj: any) => `${obj.type}: ${obj.name} - ${obj.reason}`));
          }
        } catch (getError) {
          debug('⚠️ Could not retrieve inconsistent metadata details:', getError);
        }
        
        // Drop inconsistent metadata
        await this.dropInconsistentMetadata();
        debug(`🗑️ Inconsistent metadata cleaned up, retrying ${operationName}...`);
        
        // Retry the operation
        try {
          return await operation();
        } catch (retryError: any) {
          // If still failing, it might be a different issue
          const retryErrorMessage = retryError.message || retryError.response?.data?.error || '';
          if (retryErrorMessage.includes('inconsistent metadata')) {
            // If still inconsistent metadata, try one more cleanup and direct approach
            debug(`🔄 Still inconsistent metadata after cleanup, attempting final cleanup for ${operationName}...`);
            await this.dropInconsistentMetadata();
            
            // Try one more time with reload metadata
            try {
              await this.reloadMetadata();
            } catch (reloadError) {
              debug('⚠️ Could not reload metadata:', reloadError);
            }
            
            return await operation();
          } else {
            // Different error after cleanup, throw it
            throw retryError;
          }
        }
      } else {
        // Not an inconsistent metadata error, re-throw
        throw error;
      }
    }
  }

  async sql(sql: string, source: string = 'default', cascade: boolean = true): Promise<any> {
    return await this.withInconsistentMetadataHandling(async () => {
      debug('🔧 Executing SQL via /v2/query...');
      try {
        const response = await this.clientInstance.post('/v2/query', {
          type: 'run_sql',
          args: {
            source,
            sql,
            cascade,
          },
        });
        debug('✅ SQL executed successfully.');
        return response.data;
      } catch (error: any) {
        const errorMessage = `❌ Error executing SQL: ${error.response?.data?.error || error.message}`;
        debug(errorMessage, error.response?.data || error);
        throw new Error(errorMessage); // Re-throw after logging
      }
    }, `SQL: ${sql.substring(0, 50)}...`);
  }

  async v1(request: { type: string; args: object }): Promise<any> {
    // Operations that commonly fail due to inconsistent metadata and should be auto-handled
    const inconsistentMetadataSensitiveOperations = [
      'pg_untrack_table',
      'pg_track_table', 
      'pg_drop_relationship',
      'pg_create_object_relationship',
      'pg_create_array_relationship',
      'pg_delete_permission',
      'pg_drop_select_permission',
      'pg_drop_insert_permission',
      'pg_drop_update_permission',
      'pg_drop_delete_permission',
      'pg_create_select_permission',
      'pg_create_insert_permission',
      'pg_create_update_permission',
      'pg_create_delete_permission',
      'bulk'
    ];
    
    const shouldHandleInconsistentMetadata = inconsistentMetadataSensitiveOperations.includes(request.type);
    
    if (shouldHandleInconsistentMetadata) {
      return await this.withInconsistentMetadataHandling(async () => {
        return await this._executeV1Request(request);
      }, `v1/${request.type}`);
    } else {
      return await this._executeV1Request(request);
    }
  }
  
  async _executeV1Request(request: { type: string; args: object }): Promise<any> {
    debug(`🚀 Sending request to /v1/metadata: ${request.type}`);
    try {
      const response = await this.clientInstance.post('/v1/metadata', request);
      // Ensure that if Hasura returns a 2xx status but with an error in the body (e.g. for bulk operations with allow_inconsistent_metadata)
      // we still check for it. However, typically Hasura non-2xx status means an error.
      // For now, we assume non-2xx is caught by catch block, and 2xx with error payload is handled by callers if necessary.
      // For now, we assume non-2xx is caught by catch block, and 2xx with error payload is handled by callers if necessary.
      debug(`✅ /v1/metadata request successful for type: ${request.type}`);
      return response.data;
    } catch (error: any) {
       const responseData = error.response?.data;
       const requestType = request.type;

       // Extract error message and code carefully
       let mainErrorMessage = 'Unknown Hasura API error';
       let mainErrorCode = 'unknown';

       if (responseData) {
         // Handle cases where responseData is an array (e.g., some bulk responses)
         if (Array.isArray(responseData) && responseData.length > 0) {
           const firstError = responseData.find(item => item.error || item.message || item.code);
           if (firstError) {
             mainErrorMessage = firstError.message || firstError.error || 'Error in bulk operation array';
             mainErrorCode = firstError.code || 'unknown';
           } else {
             mainErrorMessage = 'Error in bulk response array structure';
           }
         } else if (typeof responseData === 'object') {
           mainErrorMessage = responseData.message || responseData.error || (responseData.errors && responseData.errors[0]?.message) || error.message || mainErrorMessage;
           mainErrorCode = responseData.code || (responseData.internal && responseData.internal[0]?.code) || (responseData.error?.code) || (responseData.errors && responseData.errors[0]?.extensions?.code) || mainErrorCode;
           // Specific for error "view/table already untracked: "payments" (Code: already-untracked)" where type is bulk
           if (requestType === 'bulk' && typeof mainErrorMessage === 'string' && !mainErrorCode && mainErrorMessage.includes('(Code: ')) {
             const codeMatch = mainErrorMessage.match(/\(Code: ([\w-]+)\)/);
             if (codeMatch && codeMatch[1]) {
               mainErrorCode = codeMatch[1];
             }
           }
         } else {
           mainErrorMessage = error.message || mainErrorMessage;
         }
       } else {
         mainErrorMessage = error.message || mainErrorMessage;
       }
       
       // Standardized ignorable error codes from Hasura
       const ignorableErrorCodes = [
           'already-exists',
           'already-tracked',
           'already-untracked',
           'not-found', // Can be ignorable for drop/delete operations
           'already-defined',
           'not-exists', // Added for cases like trying to drop something that isn't there
           // 'permission-denied', // Handle this more specifically below
       ];

       let isIgnorable = ignorableErrorCodes.includes(mainErrorCode);

       // Specifically ignore 'permission-denied' or 'not-found' for drop/untrack/delete operations
       if (!isIgnorable && (mainErrorCode === 'permission-denied' || mainErrorCode === 'not-found')) {
           if (requestType.startsWith('pg_drop_') || requestType.startsWith('pg_untrack_') || requestType.startsWith('delete_') || requestType.endsWith('_delete_permission')) {
               debug(`📝 Note: Ignoring '${mainErrorCode}' for ${requestType}, likely means target object was not found or permission did not exist.`);
               isIgnorable = true;
           }
       }
       
       // If type is bulk and we got a generic bulk error code, inspect internal errors if any
       if (requestType === 'bulk' && (mainErrorCode === 'bulk-error' || mainErrorCode === 'pg-error') && responseData?.internal) {
           const internalErrors = Array.isArray(responseData.internal) ? responseData.internal : [responseData.internal];
           let allInternalIgnorable = internalErrors.length > 0;
           for (const internalItem of internalErrors) {
               const internalCode = internalItem.code || (internalItem.error?.code);
               let currentInternalIgnorable = ignorableErrorCodes.includes(internalCode);
               if (!currentInternalIgnorable && (internalCode === 'permission-denied' || internalCode === 'not-found')) {
                   // Assuming items in bulk args have a 'type' field to check if it's a drop op. This is a simplification.
                   // For simplicity, we'll be more lenient with permission-denied/not-found inside bulk for now.
                   currentInternalIgnorable = true; 
               }
               if (!currentInternalIgnorable) {
                   allInternalIgnorable = false;
                   // Update main error message to be more specific if a non-ignorable internal error is found
                   mainErrorMessage = internalItem.message || internalItem.error || mainErrorMessage;
                   mainErrorCode = internalCode || mainErrorCode;
                   break;
               }
           }
           if (allInternalIgnorable) isIgnorable = true;
       }


       if (isIgnorable) {
           const logMessage = `📝 Note: Non-critical Hasura issue for type '${requestType}' - ${mainErrorMessage} (Code: ${mainErrorCode}). Proceeding.`;
           console.warn(logMessage); // Make it more visible
           debug(logMessage, `Raw response data: ${JSON.stringify(responseData, null, 2)}`);
           // Return the original response data as if it were a success, or a generic success object.
           // This makes the calling function not misinterpret it as an error structure.
           // If the original success returns response.data, we should mimic that.
           // error.response.data might be the actual data Hasura sent with the "ignorable error".
           return responseData || { success: true, info: mainErrorMessage, code: mainErrorCode };
       } else {
           const errorMessageToThrow = `❌ Error in /v1/metadata for type ${requestType}: ${mainErrorMessage} (Code: ${mainErrorCode})`;
           debug(errorMessageToThrow, `Raw response data: ${JSON.stringify(responseData, null, 2)}`, error);
           throw new Error(errorMessageToThrow); // Re-throw critical errors
       }
    }
  }

  async trackTable(options: TrackTableOptions): Promise<any> {
    const { schema, table } = options;
    
    if (Array.isArray(table)) {
      debug(`🔍 Tracking multiple tables in schema ${schema}: ${table.join(', ')}`);
      const results: any[] = [];
      for (const tableName of table) {
        const result = await this.trackTable({ schema, table: tableName });
        results.push(result);
      }
      return results;
    }

    debug(`🔍 Tracking table ${schema}.${table}`);
    return await this.v1({
      type: 'pg_track_table',
      args: {
        source: 'default',
        schema,
        name: table
      }
    });
  }

  async untrackTable(options: TrackTableOptions): Promise<any> {
    const { schema, table } = options;
    
    if (Array.isArray(table)) {
      debug(`🔄 Untracking multiple tables in schema ${schema}: ${table.join(', ')}`);
      const results: any[] = [];
      for (const tableName of table) {
        const result = await this.untrackTable({ schema, table: tableName });
        results.push(result);
      }
      return results;
    }

    debug(`🔄 Untracking table ${schema}.${table}`);
    return await this.v1({
      type: 'pg_untrack_table',
      args: {
        source: 'default',
        schema,
        name: table,
        cascade: true  // Force cascade to remove dependencies
      }
    });
  }

  async createTable(options: CreateTableOptions): Promise<any> {
    const { schema, table, id = 'id', type = ColumnType.UUID } = options;
    
    debug(`🏗️ Creating table ${schema}.${table} with id column ${id} of type ${type}`);
    
    // Check if table exists
    const tableExists = await this.sql(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = '${schema}' 
        AND table_name = '${table}'
      );
    `);
    
    if (tableExists.result?.[1]?.[0] === 't') {
      throw new Error(`❌ Table ${schema}.${table} already exists`);
    }
    
    // Create schema if not exists
    await this.sql(`CREATE SCHEMA IF NOT EXISTS "${schema}";`);
    
    // Create table with id column
    const defaultValue = type === ColumnType.UUID ? 'DEFAULT gen_random_uuid()' : '';
    await this.sql(`
      CREATE TABLE "${schema}"."${table}" (
        "${id}" ${type} PRIMARY KEY ${defaultValue},
        created_at bigint NOT NULL DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000,
        updated_at bigint NOT NULL DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000
      );
    `);
    debug(`✅ Created table ${schema}.${table}`);
    
    // Track table in Hasura
    await this.trackTable({ schema, table });
    
    return { success: true };
  }

  async defineTable(options: CreateTableOptions): Promise<any> {
    const { schema, table, id = 'id', type = ColumnType.UUID } = options;
    
    debug(`🔧 Defining table ${schema}.${table} with id column ${id} of type ${type}`);
    
    // Check if table exists
    const tableExists = await this.sql(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = '${schema}' 
        AND table_name = '${table}'
      );
    `);
    
    if (tableExists.result?.[1]?.[0] === 't') {
      debug(`📋 Table ${schema}.${table} already exists, checking id column`);
      
      // Check id column
      const idColumnInfo = await this.sql(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = '${schema}' 
        AND table_name = '${table}' 
        AND column_name = '${id}';
      `);
      
      if (idColumnInfo.result && idColumnInfo.result.length > 1) {
        const columnData = idColumnInfo.result[1];
        const actualType = columnData?.[1];
        
        if (actualType !== type) {
          debug(`⚠️ Table ${schema}.${table} exists but id column ${id} has type ${actualType}, expected ${type}. Continuing anyway.`);
        } else {
          debug(`✅ Table ${schema}.${table} exists with correct id column`);
        }
      } else {
        debug(`⚠️ Table ${schema}.${table} exists but missing id column ${id}. Continuing anyway.`);
      }
    } else {
      // Create schema if not exists
      await this.sql(`CREATE SCHEMA IF NOT EXISTS "${schema}";`);
      
      // Create table with id column
      const defaultValue = type === ColumnType.UUID ? 'DEFAULT gen_random_uuid()' : '';
      await this.sql(`
        CREATE TABLE "${schema}"."${table}" (
          "${id}" ${type} PRIMARY KEY ${defaultValue},
          created_at bigint NOT NULL DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000,
          updated_at bigint NOT NULL DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000
        );
      `);
      debug(`✅ Created table ${schema}.${table}`);
    }
    
    // Track table in Hasura
    await this.trackTable({ schema, table });
    
    return { success: true };
  }

  async defineColumn(options: DefineColumnOptions): Promise<any> {
    const { schema, table, name, type, unique = false, postfix = '', comment } = options;
    
    debug(`🔧 Defining column ${name} in ${schema}.${table} with type ${type}`);
    
    // Check if column exists
    const columnExists = await this.sql(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = '${schema}' 
      AND table_name = '${table}' 
      AND column_name = '${name}';
    `);
    
    const uniqueConstraint = unique ? 'UNIQUE' : '';
    const commentSql = comment ? `COMMENT ON COLUMN "${schema}"."${table}"."${name}" IS '${comment.replace(/'/g, "''")}';` : '';
    
    if (columnExists.result && columnExists.result.length > 1) {
      debug(`📝 Column ${name} exists, checking if modification needed`);
      const currentType = columnExists.result?.[1]?.[1];
      
      if (currentType !== type) {
        // Try to alter column type
        try {
          await this.sql(`
            ALTER TABLE "${schema}"."${table}" 
            ALTER COLUMN "${name}" TYPE ${type} ${postfix};
            ${uniqueConstraint ? `ALTER TABLE "${schema}"."${table}" ADD CONSTRAINT "${table}_${name}_unique" UNIQUE ("${name}");` : ''}
            ${commentSql}
          `);
          debug(`✅ Modified column ${name} type from ${currentType} to ${type}`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`❌ Cannot modify column ${name} from ${currentType} to ${type}: ${errorMessage}`);
        }
      } else {
        debug(`✅ Column ${name} already has correct type ${type}`);
      }
    } else {
      // Create new column
      await this.sql(`
        ALTER TABLE "${schema}"."${table}" 
        ADD COLUMN "${name}" ${type} ${postfix} ${uniqueConstraint};
        ${commentSql}
      `);
      debug(`✅ Created column ${name} with type ${type}`);
    }
    
    // Re-track table to update metadata
    await this.untrackTable({ schema, table });
    await this.trackTable({ schema, table });
    
    return { success: true };
  }

  async deleteColumn(options: DeleteColumnOptions): Promise<any> {
    const { schema, table, name, cascade = true } = options;
    
    debug(`🗑️ Deleting column ${name} from ${schema}.${table} (cascade: ${cascade})`);
    
    // Check if column exists
    const columnExists = await this.sql(`
      SELECT column_name
      FROM information_schema.columns 
      WHERE table_schema = '${schema}' 
      AND table_name = '${table}' 
      AND column_name = '${name}';
    `, 'default', false);
    
    if (columnExists.result && columnExists.result.length > 1) {
      const cascadeClause = cascade ? ' CASCADE' : '';
      await this.sql(`ALTER TABLE "${schema}"."${table}" DROP COLUMN "${name}"${cascadeClause};`, 'default', false);
      debug(`✅ Deleted column ${name} with cascade: ${cascade}`);
    } else {
      debug(`📝 Column ${name} does not exist, nothing to delete`);
    }
    
    return { success: true };
  }

  async deleteTable(options: DeleteTableOptions): Promise<any> {
    const { schema, table, cascade = true } = options;
    
    if (Array.isArray(table)) {
      debug(`🗑️ Deleting multiple tables in schema ${schema}: ${table.join(', ')} (cascade: ${cascade})`);
      const results: any[] = [];
      for (const tableName of table) {
        const result = await this.deleteTable({ schema, table: tableName, cascade });
        results.push(result);
      }
      return results;
    }

    debug(`🗑️ Deleting table ${schema}.${table} (cascade: ${cascade})`);
    
    // Untrack table first with cascade
    await this.untrackTable({ schema, table });
    
    // Drop table if exists with CASCADE or without based on option
    const cascadeClause = cascade ? ' CASCADE' : '';
    await this.sql(`DROP TABLE IF EXISTS "${schema}"."${table}"${cascadeClause};`, 'default', true);
    debug(`✅ Deleted table ${schema}.${table} with cascade: ${cascade}`);
    
    return { success: true };
  }

  async defineObjectRelationshipForeign(options: DefineRelationshipOptions): Promise<any> {
    const { schema, table, name, key } = options;
    
    debug(`🔗 Defining object relationship ${name} in ${schema}.${table} using foreign key ${key}`);
    
    // Delete existing relationship if exists
    await this.deleteRelationship({ schema, table, name });
    
    // Create new relationship
    return await this.v1({
      type: 'pg_create_object_relationship',
      args: {
        source: 'default',
        table: { schema, name: table },
        name,
        using: {
          foreign_key_constraint_on: key
        }
      }
    });
  }

  async defineArrayRelationshipForeign(options: DefineRelationshipOptions): Promise<any> {
    const { schema, table, name, key } = options;
    
    debug(`🔗 Defining array relationship ${name} in ${schema}.${table} using foreign key ${key}`);
    
    // Delete existing relationship if exists
    await this.deleteRelationship({ schema, table, name });
    
    // Create new relationship
    return await this.v1({
      type: 'pg_create_array_relationship',
      args: {
        source: 'default',
        table: { schema, name: table },
        name,
        using: {
          foreign_key_constraint_on: {
            table: { schema, name: key.split('.')[0] },
            column: key.split('.')[1] || key
          }
        }
      }
    });
  }

  async defineRelationship(options: DefineUniversalRelationshipOptions): Promise<any> {
    const { schema, table, name, type, using } = options;
    
    debug(`🔧 Defining ${type} relationship ${name} in ${schema}.${table}`);
    
    // Delete existing relationship if exists
    await this.deleteRelationship({ schema, table, name });
    
    // Determine the API type based on relationship type
    const apiType = type === 'object' ? 'pg_create_object_relationship' : 'pg_create_array_relationship';
    
    // Create new relationship
    return await this.v1({
      type: apiType,
      args: {
        source: 'default',
        table: { schema, name: table },
        name,
        using
      }
    });
  }

  async deleteRelationship(options: DeleteRelationshipOptions): Promise<any> {
    const { schema, table, name } = options;
    
    debug(`🗑️ Deleting relationship ${name} from ${schema}.${table}`);
    
    return await this.v1({
      type: 'pg_drop_relationship',
      args: {
        source: 'default',
        table: { schema, name: table },
        relationship: name
      }
    });
  }

  async definePermission(options: DefinePermissionOptions): Promise<any> {
    const { schema, table, operation, role, filter, check, aggregate = false, columns = true, set } = options;
    
    if (Array.isArray(role)) {
      debug(`🔐 Defining ${operation} permission for multiple roles in ${schema}.${table}: ${role.join(', ')}`);
      const results: any[] = [];
      for (const roleName of role) {
        const result = await this.definePermission({ 
          schema, table, operation, role: roleName, filter, aggregate, columns 
        });
        results.push(result);
      }
      return results;
    }

    debug(`🔐 Defining ${operation} permission for role ${role} in ${schema}.${table}`);
    
    // Delete existing permission
    await this.deletePermission({ schema, table, operation, role });
    
    // Get table columns if columns is true
    let columnList = columns;
    if (columns === true) {
      const tableColumns = await this.columns({ schema, table });
      columnList = Object.keys(tableColumns);
    }
    
    const permissionArgs: any = {
      source: 'default',
      table: { schema, name: table },
      role,
      permission: {
        columns: columnList
      }
    };
    
    // For insert operations, use 'check' instead of 'filter'
    if (operation === 'insert') {
      permissionArgs.permission.check = filter;
      // Add column presets if provided
      if (set) {
        permissionArgs.permission.set = set;
      }
    } else {
      permissionArgs.permission.filter = filter;
    }
    
    if (operation === 'select' && aggregate) {
      permissionArgs.permission.allow_aggregations = true;
    }
    
    return await this.withInconsistentMetadataHandling(async () => {
      return await this.v1({
        type: `pg_create_${operation}_permission`,
        args: permissionArgs
      });
    }, `create ${operation} permission for role ${role} in ${schema}.${table}`);
  }

  async deletePermission(options: DeletePermissionOptions): Promise<any> {
    const { schema, table, operation, role } = options;
    
    if (Array.isArray(role)) {
      debug(`🗑️ Deleting ${operation} permission for multiple roles in ${schema}.${table}: ${role.join(', ')}`);
      const results: any[] = [];
      for (const roleName of role) {
        const result = await this.deletePermission({ schema, table, operation, role: roleName });
        results.push(result);
      }
      return results;
    }

    debug(`🗑️ Deleting ${operation} permission for role ${role} in ${schema}.${table}`);
    
    return await this.withInconsistentMetadataHandling(async () => {
      return await this.v1({
        type: `pg_drop_${operation}_permission`,
        args: {
          source: 'default',
          table: { schema, name: table },
          role
        }
      });
    }, `delete ${operation} permission for role ${role} in ${schema}.${table}`);
  }

  async schemas(): Promise<string[]> {
    debug('📋 Getting list of schemas');
    
    const result = await this.sql(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'pg_temp_1', 'pg_toast_temp_1')
      ORDER BY schema_name;
    `);
    
    return result.result ? result.result.slice(1).map((row: any[]) => row[0]) : [];
  }

  async tables(options: { schema: string }): Promise<string[]> {
    const { schema } = options;
    debug(`📋 Getting list of tables in schema ${schema}`);
    
    const result = await this.sql(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = '${schema}' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    return result.result ? result.result.slice(1).map((row: any[]) => row[0]) : [];
  }

  async columns(options: { schema: string; table: string }): Promise<Record<string, ColumnInfo>> {
    const { schema, table } = options;
    debug(`📋 Getting columns for table ${schema}.${table}`);
    
    const result = await this.sql(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_schema = '${schema}' 
      AND table_name = '${table}'
      ORDER BY ordinal_position;
    `);
    
    const columns: Record<string, ColumnInfo> = {};
    if (result.result && result.result.length > 1) {
      for (let i = 1; i < result.result.length; i++) {
        const row = result.result[i];
        if (row && row.length >= 3) {
          const [columnName, dataType, udtName] = row;
          columns[columnName] = {
            type: dataType,
            _type: udtName
          };
        }
      }
    }
    
    return columns;
  }

  // Functions and Triggers
  async defineFunction(options: FunctionOptions): Promise<any> {
    const { schema, name, definition, language = 'plpgsql', replace = true } = options;
    
    debug(`🔧 Defining function ${schema}.${name}`);
    
    const createOrReplace = replace ? 'CREATE OR REPLACE' : 'CREATE';
    await this.sql(`
      ${createOrReplace} FUNCTION "${schema}"."${name}"
      ${definition}
      LANGUAGE '${language}';
    `);
    
    return { success: true };
  }

  async createFunction(options: FunctionOptions): Promise<any> {
    const { schema, name, definition, language = 'plpgsql' } = options;
    
    debug(`🏗️ Creating function ${schema}.${name}`);
    
    // Check if function exists
    const functionExists = await this.sql(`
      SELECT EXISTS (
        SELECT FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = '${schema}' AND p.proname = '${name}'
      );
    `);
    
    if (functionExists.result?.[1]?.[0] === 't') {
      throw new Error(`❌ Function ${schema}.${name} already exists`);
    }
    
    await this.sql(`
      CREATE FUNCTION "${schema}"."${name}"
      ${definition}
      LANGUAGE '${language}';
    `);
    
    return { success: true };
  }

  async deleteFunction(options: { schema: string; name: string; cascade?: boolean }): Promise<any> {
    const { schema, name, cascade = true } = options;
    
    debug(`🗑️ Deleting function ${schema}.${name} (cascade: ${cascade})`);
    
    const cascadeClause = cascade ? ' CASCADE' : '';
    await this.sql(`DROP FUNCTION IF EXISTS "${schema}"."${name}"${cascadeClause};`, 'default', false);
    
    return { success: true };
  }

  async defineTrigger(options: TriggerOptions): Promise<any> {
    const { schema, table, name, timing, event, function_name, replace = true } = options;
    
    debug(`🔧 Defining trigger ${name} on ${schema}.${table}`);
    
    if (replace) {
      await this.sql(`DROP TRIGGER IF EXISTS "${name}" ON "${schema}"."${table}";`);
    }
    
    await this.sql(`
      CREATE TRIGGER "${name}"
        ${timing} ${event} ON "${schema}"."${table}"
        FOR EACH ROW
        EXECUTE FUNCTION ${function_name}();
    `);
    
    return { success: true };
  }

  async createTrigger(options: TriggerOptions): Promise<any> {
    const { schema, table, name, timing, event, function_name } = options;
    
    debug(`🏗️ Creating trigger ${name} on ${schema}.${table}`);
    
    // Check if trigger exists
    const triggerExists = await this.sql(`
      SELECT EXISTS (
        SELECT FROM pg_trigger
        WHERE tgname = '${name}' AND tgrelid = '${schema}.${table}'::regclass
      );
    `);
    
    if (triggerExists.result?.[1]?.[0] === 't') {
      throw new Error(`❌ Trigger ${name} already exists on ${schema}.${table}`);
    }
    
    await this.sql(`
      CREATE TRIGGER "${name}"
        ${timing} ${event} ON "${schema}"."${table}"
        FOR EACH ROW
        EXECUTE FUNCTION ${function_name}();
    `);
    
    return { success: true };
  }

  async deleteTrigger(options: { schema: string; table: string; name: string; cascade?: boolean }): Promise<any> {
    const { schema, table, name, cascade = true } = options;
    
    debug(`🗑️ Deleting trigger ${name} from ${schema}.${table} (cascade: ${cascade})`);
    
    const cascadeClause = cascade ? ' CASCADE' : '';
    await this.sql(`DROP TRIGGER IF EXISTS "${name}" ON "${schema}"."${table}"${cascadeClause};`, 'default', false);
    
    return { success: true };
  }

  // Foreign Keys
  async defineForeignKey(options: ForeignKeyOptions): Promise<any> {
    const { from, to, on_delete = 'RESTRICT', on_update = 'CASCADE', name } = options;
    
    const constraintName = name || `fk_${from.table}_${from.column}_${to.table}_${to.column}`;
    
    debug(`🔗 Defining foreign key ${constraintName}`);
    
    return await this.withInconsistentMetadataHandling(async () => {
      // Drop existing constraint if exists
      await this.sql(`
        ALTER TABLE "${from.schema}"."${from.table}" 
        DROP CONSTRAINT IF EXISTS "${constraintName}";
      `);
      
      // Create new constraint
      await this.sql(`
        ALTER TABLE "${from.schema}"."${from.table}" 
        ADD CONSTRAINT "${constraintName}" 
        FOREIGN KEY ("${from.column}") 
        REFERENCES "${to.schema}"."${to.table}"("${to.column}")
        ON DELETE ${on_delete} ON UPDATE ${on_update};
      `);
      
      return { success: true };
    }, `define foreign key ${constraintName}`);
  }

  async createForeignKey(options: ForeignKeyOptions): Promise<any> {
    const { from, to, on_delete = 'RESTRICT', on_update = 'CASCADE', name } = options;
    
    const constraintName = name || `fk_${from.table}_${from.column}_${to.table}_${to.column}`;
    
    debug(`🏗️ Creating foreign key ${constraintName}`);
    
    // Check if constraint exists
    const constraintExists = await this.sql(`
      SELECT EXISTS (
        SELECT FROM information_schema.table_constraints
        WHERE constraint_schema = '${from.schema}' 
        AND table_name = '${from.table}'
        AND constraint_name = '${constraintName}'
        AND constraint_type = 'FOREIGN KEY'
      );
    `);
    
    if (constraintExists.result?.[1]?.[0] === 't') {
      throw new Error(`❌ Foreign key constraint ${constraintName} already exists`);
    }
    
    await this.sql(`
      ALTER TABLE "${from.schema}"."${from.table}" 
      ADD CONSTRAINT "${constraintName}" 
      FOREIGN KEY ("${from.column}") 
      REFERENCES "${to.schema}"."${to.table}"("${to.column}")
      ON DELETE ${on_delete} ON UPDATE ${on_update};
    `);
    
    return { success: true };
  }

  async deleteForeignKey(options: { schema: string; table: string; name: string; cascade?: boolean }): Promise<any> {
    const { schema, table, name, cascade = true } = options;
    
    debug(`🗑️ Deleting foreign key ${name} from ${schema}.${table} (cascade: ${cascade})`);
    
    const cascadeClause = cascade ? ' CASCADE' : '';
    await this.sql(`
      ALTER TABLE "${schema}"."${table}" 
      DROP CONSTRAINT IF EXISTS "${name}"${cascadeClause};
    `, 'default', false);
    
    return { success: true };
  }

  // Views
  async defineView(options: ViewOptions): Promise<any> {
    const { schema, name, definition } = options;
    
    debug(`🔧 Defining view ${schema}.${name}`);
    
    // Untrack view first
    await this.untrackView({ schema, name });
    
    // Drop and recreate view
    await this.sql(`DROP VIEW IF EXISTS "${schema}"."${name}" CASCADE;`);
    await this.sql(`CREATE VIEW "${schema}"."${name}" AS ${definition};`);
    
    // Track view
    await this.trackView({ schema, name });
    
    return { success: true };
  }

  async createView(options: ViewOptions): Promise<any> {
    const { schema, name, definition } = options;
    
    debug(`🏗️ Creating view ${schema}.${name}`);
    
    // Check if view exists
    const viewExists = await this.sql(`
      SELECT EXISTS (
        SELECT FROM information_schema.views
        WHERE table_schema = '${schema}' AND table_name = '${name}'
      );
    `);
    
    if (viewExists.result?.[1]?.[0] === 't') {
      throw new Error(`❌ View ${schema}.${name} already exists`);
    }
    
    await this.sql(`CREATE VIEW "${schema}"."${name}" AS ${definition};`);
    
    return { success: true };
  }

  async deleteView(options: { schema: string; name: string; cascade?: boolean }): Promise<any> {
    const { schema, name, cascade = true } = options;
    
    debug(`🗑️ Deleting view ${schema}.${name} (cascade: ${cascade})`);
    
    // Untrack view with cascade first
    await this.untrackView({ schema, name });
    // Drop view with CASCADE to handle dependencies
    const cascadeClause = cascade ? ' CASCADE' : '';
    await this.sql(`DROP VIEW IF EXISTS "${schema}"."${name}"${cascadeClause};`, 'default', false);
    
    return { success: true };
  }

  async trackView(options: { schema: string; name: string }): Promise<any> {
    const { schema, name } = options;
    
    debug(`🔍 Tracking view ${schema}.${name}`);
    
    return await this.v1({
      type: 'pg_track_table',
      args: {
        source: 'default',
        schema,
        name
      }
    });
  }

  async untrackView(options: { schema: string; name: string }): Promise<any> {
    const { schema, name } = options;
    
    debug(`🔄 Untracking view ${schema}.${name}`);
    
    return await this.v1({
      type: 'pg_untrack_table',
      args: {
        source: 'default',
        schema,
        name,
        cascade: true  // Force cascade to remove dependencies
      }
    });
  }

  // Computed Fields
  async defineComputedField(options: ComputedFieldOptions): Promise<any> {
    const { schema, table, name, definition } = options;
    
    debug(`🔧 Defining computed field ${name} on ${schema}.${table}`);
    
    // Delete existing computed field
    await this.deleteComputedField({ schema, table, name });
    
    // Create new computed field
    return await this.v1({
      type: 'pg_add_computed_field',
      args: {
        source: 'default',
        table: { schema, name: table },
        name,
        definition
      }
    });
  }

  async createComputedField(options: ComputedFieldOptions): Promise<any> {
    const { schema, table, name, definition } = options;
    
    debug(`🏗️ Creating computed field ${name} on ${schema}.${table}`);
    
    return await this.v1({
      type: 'pg_add_computed_field',
      args: {
        source: 'default',
        table: { schema, name: table },
        name,
        definition
      }
    });
  }

  async deleteComputedField(options: { schema: string; table: string; name: string }): Promise<any> {
    const { schema, table, name } = options;
    
    debug(`🗑️ Deleting computed field ${name} from ${schema}.${table}`);
    
    return await this.v1({
      type: 'pg_drop_computed_field',
      args: {
        source: 'default',
        table: { schema, name: table },
        name
      }
    });
  }

  // Remote Schemas
  async defineRemoteSchema(options: RemoteSchemaOptions): Promise<any> {
    const { name, definition } = options;
    
    debug(`🔧 Defining remote schema ${name}`);
    
    // Delete existing remote schema
    await this.deleteRemoteSchema({ name });
    
    // Create new remote schema
    return await this.v1({
      type: 'add_remote_schema',
      args: {
        name,
        definition
      }
    });
  }

  async createRemoteSchema(options: RemoteSchemaOptions): Promise<any> {
    const { name, definition } = options;
    
    debug(`🏗️ Creating remote schema ${name}`);
    
    return await this.v1({
      type: 'add_remote_schema',
      args: {
        name,
        definition
      }
    });
  }

  async deleteRemoteSchema(options: { name: string }): Promise<any> {
    const { name } = options;
    
    debug(`🗑️ Deleting remote schema ${name}`);
    
    return await this.v1({
      type: 'remove_remote_schema',
      args: { name }
    });
  }

  async defineRemoteRelationship(options: RemoteRelationshipOptions): Promise<any> {
    const { schema, table, name, remote_schema, hasura_fields, remote_field } = options;
    
    debug(`🔧 Defining remote relationship ${name} on ${schema}.${table}`);
    
    // Delete existing remote relationship
    await this.deleteRemoteRelationship({ schema, table, name });
    
    // Create new remote relationship
    return await this.v1({
      type: 'pg_create_remote_relationship',
      args: {
        source: 'default',
        table: { schema, name: table },
        name,
        definition: {
          remote_schema,
          hasura_fields,
          remote_field
        }
      }
    });
  }

  async createRemoteRelationship(options: RemoteRelationshipOptions): Promise<any> {
    const { schema, table, name, remote_schema, hasura_fields, remote_field } = options;
    
    debug(`🏗️ Creating remote relationship ${name} on ${schema}.${table}`);
    
    return await this.v1({
      type: 'pg_create_remote_relationship',
      args: {
        source: 'default',
        table: { schema, name: table },
        name,
        definition: {
          remote_schema,
          hasura_fields,
          remote_field
        }
      }
    });
  }

  async deleteRemoteRelationship(options: { schema: string; table: string; name: string }): Promise<any> {
    const { schema, table, name } = options;
    
    debug(`🗑️ Deleting remote relationship ${name} from ${schema}.${table}`);
    
    return await this.v1({
      type: 'pg_delete_remote_relationship',
      args: {
        source: 'default',
        table: { schema, name: table },
        name
      }
    });
  }

  // Event Triggers
  async defineEventTrigger(options: EventTriggerOptions): Promise<any> {
    const { name, table, webhook, insert = false, update = false, delete: del = false, headers, replace = true } = options;
    
    debug(`🔧 Defining event trigger ${name}`);
    
    if (replace) {
      await this.deleteEventTrigger({ name });
    }
    
    const triggerDefinition: any = {
      name,
      table,
      webhook,
      insert: insert ? { columns: '*' } : undefined,
      update: update ? { columns: '*' } : undefined,
      delete: del ? { columns: '*' } : undefined,
      headers
    };
    
    // Remove undefined properties
    Object.keys(triggerDefinition).forEach(key => 
      triggerDefinition[key] === undefined && delete triggerDefinition[key]
    );
    
    return await this.withInconsistentMetadataHandling(async () => {
      return await this.v1({
        type: 'pg_create_event_trigger',
        args: triggerDefinition
      });
    }, `create event trigger ${name}`);
  }

  async createEventTrigger(options: EventTriggerOptions): Promise<any> {
    const { name, table, webhook, insert = false, update = false, delete: del = false, headers } = options;
    
    debug(`🏗️ Creating event trigger ${name}`);
    
    const triggerDefinition: any = {
      name,
      table,
      webhook,
      insert: insert ? { columns: '*' } : undefined,
      update: update ? { columns: '*' } : undefined,
      delete: del ? { columns: '*' } : undefined,
      headers
    };
    
    // Remove undefined properties
    Object.keys(triggerDefinition).forEach(key => 
      triggerDefinition[key] === undefined && delete triggerDefinition[key]
    );
    
    return await this.v1({
      type: 'pg_create_event_trigger',
      args: triggerDefinition
    });
  }

  async deleteEventTrigger(options: { name: string }): Promise<any> {
    const { name } = options;
    
    debug(`🗑️ Deleting event trigger ${name}`);
    
    try {
      // First, delete the event trigger from metadata
      await this.v1({
        type: 'pg_delete_event_trigger',
        args: { name }
      });
      debug(`✅ Event trigger ${name} deleted from metadata`);
    } catch (error: any) {
      debug(`⚠️ Could not delete event trigger ${name} from metadata:`, error.message);
    }
    
    // Then, clean up any orphaned SQL functions and triggers
    try {
      await this.withInconsistentMetadataHandling(async () => {
        // Drop the event trigger functions if they exist
        await this.sql(`DROP FUNCTION IF EXISTS hdb_catalog."notify_hasura_${name}_INSERT"() CASCADE;`);
        await this.sql(`DROP FUNCTION IF EXISTS hdb_catalog."notify_hasura_${name}_UPDATE"() CASCADE;`);
        await this.sql(`DROP FUNCTION IF EXISTS hdb_catalog."notify_hasura_${name}_DELETE"() CASCADE;`);
        
        // Drop the event trigger if it exists in the database
        await this.sql(`DROP EVENT TRIGGER IF EXISTS "${name}";`);
        
        // Also try to drop any orphaned functions with different naming patterns
        await this.sql(`DROP FUNCTION IF EXISTS hdb_catalog."notify_hasura_${name.replace(/-/g, '_')}_INSERT"() CASCADE;`);
        await this.sql(`DROP FUNCTION IF EXISTS hdb_catalog."notify_hasura_${name.replace(/-/g, '_')}_UPDATE"() CASCADE;`);
        await this.sql(`DROP FUNCTION IF EXISTS hdb_catalog."notify_hasura_${name.replace(/-/g, '_')}_DELETE"() CASCADE;`);
        
        debug(`✅ SQL cleanup completed for event trigger ${name}`);
      }, `SQL cleanup for event trigger ${name}`);
    } catch (error: any) {
      debug(`⚠️ Could not clean up SQL for event trigger ${name}:`, error.message);
    }
    
    return { success: true };
  }

  // Cron Triggers
  async defineCronTrigger(options: CronTriggerOptions): Promise<any> {
    const { name, webhook, schedule, payload, headers, replace = true } = options;
    
    debug(`🔧 Defining cron trigger ${name}`);
    
    if (replace) {
      await this.deleteCronTrigger({ name });
    }
    
    return await this.v1({
      type: 'create_cron_trigger',
      args: {
        name,
        webhook,
        schedule,
        payload: payload || {},
        headers: headers || [],
        include_in_metadata: true
      }
    });
  }

  async createCronTrigger(options: CronTriggerOptions): Promise<any> {
    const { name, webhook, schedule, payload, headers } = options;
    
    debug(`🏗️ Creating cron trigger ${name}`);
    
    return await this.v1({
      type: 'create_cron_trigger',
      args: {
        name,
        webhook,
        schedule,
        payload: payload || {},
        headers: headers || [],
        include_in_metadata: true
      }
    });
  }

  async deleteCronTrigger(options: { name: string }): Promise<any> {
    const { name } = options;
    
    debug(`🗑️ Deleting cron trigger ${name}`);
    
    return await this.v1({
      type: 'delete_cron_trigger',
      args: { name }
    });
  }

  // Metadata Operations
  async exportMetadata(): Promise<any> {
    debug('📤 Exporting metadata');
    
    return await this.v1({
      type: 'export_metadata',
      args: {}
    });
  }

  async replaceMetadata(metadata: any): Promise<any> {
    debug('🔄 Replacing metadata');
    
    return await this.v1({
      type: 'replace_metadata',
      args: metadata
    });
  }

  async clearMetadata(): Promise<any> {
    debug('🧹 Clearing metadata');
    
    return await this.v1({
      type: 'clear_metadata',
      args: {}
    });
  }

  async reloadMetadata(): Promise<any> {
    debug('🔄 Reloading metadata');
    
    return await this.v1({
      type: 'reload_metadata',
      args: {}
    });
  }

  async getInconsistentMetadata(): Promise<any> {
    debug('🔍 Getting inconsistent metadata');
    
    return await this.v1({
      type: 'get_inconsistent_metadata',
      args: {}
    });
  }

  async dropInconsistentMetadata(): Promise<any> {
    debug('🗑️ Dropping inconsistent metadata');
    
    return await this.v1({
      type: 'drop_inconsistent_metadata',
      args: {}
    });
  }

  // Schema Operations
  async createSchema(options: { schema: string }): Promise<any> {
    const { schema } = options;
    
    debug(`🏗️ Creating schema ${schema}`);
    
    // Check if schema exists
    const schemaExists = await this.sql(`
      SELECT EXISTS (
        SELECT FROM information_schema.schemata
        WHERE schema_name = '${schema}'
      );
    `);
    
    if (schemaExists.result?.[1]?.[0] === 't') {
      throw new Error(`❌ Schema ${schema} already exists`);
    }
    
    await this.sql(`CREATE SCHEMA "${schema}";`);
    
    return { success: true };
  }

  async defineSchema(options: { schema: string }): Promise<any> {
    const { schema } = options;
    
    debug(`🔧 Defining schema ${schema}`);
    
    await this.sql(`CREATE SCHEMA IF NOT EXISTS "${schema}";`);
    
    return { success: true };
  }

  async deleteSchema(options: { schema: string; cascade?: boolean }): Promise<any> {
    const { schema, cascade = true } = options;
    
    debug(`💀 FORCE DELETING schema ${schema} - GUARANTEED REMOVAL MODE`);
    
    // Check if schema exists before attempting deletion
    const schemasBefore = await this.schemas();
    if (!schemasBefore.includes(schema)) {
      debug(`📝 Schema ${schema} does not exist, nothing to delete`);
      return { success: true, message: `Schema ${schema} does not exist` };
    }
    
    debug(`🚨 AGGRESSIVE MODE: Obliterating all objects in schema ${schema}`);
    
    // PHASE 1: Brutal untracking (ignore all errors)
    try {
      const tables = await this.tables({ schema });
      debug(`💣 Found ${tables.length} tables, force untracking ALL (errors ignored)`);
      
      for (const table of tables) {
        try {
          await this.untrackTable({ schema, table });
        } catch (error) {
          // Ignore all untrack errors
        }
      }
      
      const views = await this.sql(`SELECT table_name FROM information_schema.views WHERE table_schema = '${schema}';`);
      if (views.result && views.result.length > 1) {
        for (let i = 1; i < views.result.length; i++) {
          const viewName = views.result[i][0];
          if (viewName) {
            try {
              await this.untrackView({ schema, name: viewName });
            } catch (error) {
              // Ignore all untrack errors
            }
          }
        }
      }
    } catch (error) {
      // Ignore ALL API errors
    }
    
    // PHASE 2: NUCLEAR SQL CLEANUP - Remove everything with extreme prejudice
    debug(`☢️ NUCLEAR PHASE: Direct SQL obliteration of ALL objects`);
    
    // Step 1: Disable all constraints and dependencies
    try {
      await this.sql(`
        DO $$ 
        DECLARE 
          r RECORD;
        BEGIN
          -- Drop ALL foreign key constraints in the schema
          FOR r IN (
            SELECT tc.constraint_name, tc.table_name, tc.table_schema
            FROM information_schema.table_constraints tc
            WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = '${schema}'
          ) LOOP
            BEGIN
              EXECUTE 'ALTER TABLE "' || r.table_schema || '"."' || r.table_name || '" DROP CONSTRAINT IF EXISTS "' || r.constraint_name || '" CASCADE';
            EXCEPTION WHEN OTHERS THEN
              -- Ignore all errors
            END;
          END LOOP;
          
          -- Drop ALL triggers in the schema
          FOR r IN (
            SELECT trigger_name, event_object_table, event_object_schema
            FROM information_schema.triggers
            WHERE event_object_schema = '${schema}'
          ) LOOP
            BEGIN
              EXECUTE 'DROP TRIGGER IF EXISTS "' || r.trigger_name || '" ON "' || r.event_object_schema || '"."' || r.event_object_table || '" CASCADE';
            EXCEPTION WHEN OTHERS THEN
              -- Ignore all errors
            END;
          END LOOP;
        END $$;
      `);
    } catch (error) {
      // Ignore constraint cleanup errors
    }
    
    // Step 2: Obliterate all schema objects with maximum force
    try {
      await this.sql(`
        DO $$ 
        DECLARE 
          r RECORD;
        BEGIN
          -- Drop ALL materialized views
          FOR r IN (
            SELECT schemaname, matviewname
            FROM pg_matviews
            WHERE schemaname = '${schema}'
          ) LOOP
            BEGIN
              EXECUTE 'DROP MATERIALIZED VIEW IF EXISTS "' || r.schemaname || '"."' || r.matviewname || '" CASCADE';
            EXCEPTION WHEN OTHERS THEN
              -- Ignore all errors
            END;
          END LOOP;
          
          -- Drop ALL views  
          FOR r IN (
            SELECT table_schema, table_name
            FROM information_schema.views
            WHERE table_schema = '${schema}'
          ) LOOP
            BEGIN
              EXECUTE 'DROP VIEW IF EXISTS "' || r.table_schema || '"."' || r.table_name || '" CASCADE';
            EXCEPTION WHEN OTHERS THEN
              -- Ignore all errors
            END;
          END LOOP;
          
          -- Drop ALL functions and procedures
          FOR r IN (
            SELECT routine_schema, routine_name, routine_type
            FROM information_schema.routines
            WHERE routine_schema = '${schema}'
          ) LOOP
            BEGIN
              IF r.routine_type = 'FUNCTION' THEN
                EXECUTE 'DROP FUNCTION IF EXISTS "' || r.routine_schema || '"."' || r.routine_name || '" CASCADE';
              ELSIF r.routine_type = 'PROCEDURE' THEN
                EXECUTE 'DROP PROCEDURE IF EXISTS "' || r.routine_schema || '"."' || r.routine_name || '" CASCADE';
              END IF;
            EXCEPTION WHEN OTHERS THEN
              -- Ignore all errors
            END;
          END LOOP;
          
          -- Drop ALL sequences
          FOR r IN (
            SELECT sequence_schema, sequence_name
            FROM information_schema.sequences
            WHERE sequence_schema = '${schema}'
          ) LOOP
            BEGIN
              EXECUTE 'DROP SEQUENCE IF EXISTS "' || r.sequence_schema || '"."' || r.sequence_name || '" CASCADE';
            EXCEPTION WHEN OTHERS THEN
              -- Ignore all errors
            END;
          END LOOP;
          
          -- Drop ALL tables (BASE TABLES)
          FOR r IN (
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE table_schema = '${schema}' AND table_type = 'BASE TABLE'
          ) LOOP
            BEGIN
              EXECUTE 'DROP TABLE IF EXISTS "' || r.table_schema || '"."' || r.table_name || '" CASCADE';
            EXCEPTION WHEN OTHERS THEN
              -- Ignore all errors
            END;
          END LOOP;
          
          -- Drop ALL types
          FOR r IN (
            SELECT n.nspname, t.typname
            FROM pg_type t 
            JOIN pg_namespace n ON t.typnamespace = n.oid 
            WHERE n.nspname = '${schema}' AND t.typtype IN ('c', 'e', 'd')
          ) LOOP
            BEGIN
              EXECUTE 'DROP TYPE IF EXISTS "' || r.nspname || '"."' || r.typname || '" CASCADE';
            EXCEPTION WHEN OTHERS THEN
              -- Ignore all errors
            END;
          END LOOP;
        END $$;
      `);
    } catch (error) {
      // Ignore ALL object cleanup errors
    }
    
    // PHASE 3: ULTIMATE FORCE - Multiple schema deletion attempts
    debug(`🎯 FINAL ASSAULT: Guaranteed schema deletion`);
    
    const maxAttempts = 5;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Try with increasing levels of force
        if (attempt === 1) {
          await this.sql(`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`);
        } else if (attempt === 2) {
          // Try to kill any remaining dependencies
          await this.sql(`
            DROP SCHEMA IF EXISTS "${schema}" CASCADE;
          `);
        } else if (attempt >= 3) {
          // Maximum brutality - try to remove any remaining references
          await this.sql(`
            DO $$ 
            BEGIN
              -- Force drop any remaining objects
              DROP SCHEMA IF EXISTS "${schema}" CASCADE;
            EXCEPTION WHEN OTHERS THEN
              -- Try direct system catalog manipulation (dangerous but effective)
              BEGIN
                DELETE FROM pg_depend 
                WHERE objid IN (SELECT oid FROM pg_namespace WHERE nspname = '${schema}');
                DELETE FROM pg_description 
                WHERE objoid IN (SELECT oid FROM pg_namespace WHERE nspname = '${schema}');
                DELETE FROM pg_namespace WHERE nspname = '${schema}';
              EXCEPTION WHEN OTHERS THEN
                -- Even system manipulation failed
              END;
            END $$;
          `);
        }
        
        // Check if schema was nuked
        const schemasAfter = await this.schemas();
        const stillExists = schemasAfter.includes(schema);
        
        if (!stillExists) {
          debug(`🏆 VICTORY: Schema ${schema} OBLITERATED on attempt ${attempt}/${maxAttempts}`);
          return { success: true, schema_exists: false, attempts: attempt, mode: 'aggressive' };
        }
        
        if (attempt < maxAttempts) {
          debug(`⚔️ Attempt ${attempt} failed, escalating force level...`);
          // Brief pause before escalating
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (error) {
        debug(`💥 Deletion attempt ${attempt} encountered resistance: ${error}`);
        // Continue to next attempt regardless of errors
      }
    }
    
    // Final status check
    const finalSchemas = await this.schemas();
    const finalExists = finalSchemas.includes(schema);
    
    if (finalExists) {
      debug(`🚨 CRITICAL: Schema ${schema} has survived all deletion attempts - supernatural resistance detected`);
      
      // Last resort diagnostics
      const stubborness = await this.sql(`
        SELECT 
          'Zombie tables' as issue,
          COUNT(*) as count
        FROM information_schema.tables 
        WHERE table_schema = '${schema}'
        UNION ALL
        SELECT 
          'Undead views' as issue,
          COUNT(*) as count
        FROM information_schema.views 
        WHERE table_schema = '${schema}'
        UNION ALL
        SELECT 
          'Ghost functions' as issue,
          COUNT(*) as count
        FROM information_schema.routines 
        WHERE routine_schema = '${schema}';
      `);
      
      return { 
        success: false, 
        error: `Schema ${schema} is INDESTRUCTIBLE and has resisted all ${maxAttempts} deletion attempts with maximum force. Manual intervention or database admin privileges may be required.`,
        schema_exists: true,
        attempts: maxAttempts,
        mode: 'aggressive',
        stubborness_report: stubborness.result
      };
    }
    
    debug(`🎉 TOTAL VICTORY: Schema ${schema} has been completely ANNIHILATED`);
    return { success: true, schema_exists: false, attempts: maxAttempts, mode: 'aggressive' };
  }

  // Data Source Operations
  async listSources(): Promise<DataSourceInfo[]> {
    debug('📋 Getting list of data sources');
    
    const metadata = await this.exportMetadata();
    return metadata.sources || [];
  }

  async checkSourceExists(sourceName: string): Promise<boolean> {
    debug(`🔍 Checking if source ${sourceName} exists`);
    
    try {
      const sources = await this.listSources();
      return sources.some(source => source.name === sourceName);
    } catch (error) {
      debug(`❌ Error checking source existence: ${error}`);
      return false;
    }
  }

  async createSource(options: DataSourceOptions): Promise<any> {
    const { name, kind = 'postgres', configuration } = options;
    
    debug(`🏗️ Creating data source ${name}`);
    
    // Check if source already exists
    const exists = await this.checkSourceExists(name);
    if (exists) {
      throw new Error(`❌ Data source ${name} already exists`);
    }
    
    return await this.v1({
      type: 'pg_add_source',
      args: {
        name,
        configuration
      }
    });
  }

  async defineSource(options: DataSourceOptions): Promise<any> {
    const { name, kind = 'postgres', configuration } = options;
    
    debug(`🔧 Defining data source ${name}`);
    
    // Check if source already exists
    const exists = await this.checkSourceExists(name);
    if (exists) {
      debug(`📝 Data source ${name} already exists, updating configuration if needed`);
      
      // For now, we'll remove and recreate to update configuration
      // In production, you might want to use pg_update_source if available
      try {
        await this.deleteSource({ name });
      } catch (error) {
        debug(`Warning: Could not delete existing source ${name}: ${error}`);
      }
    }
    
    return await this.v1({
      type: 'pg_add_source',
      args: {
        name,
        configuration
      }
    });
  }

  async deleteSource(options: { name: string }): Promise<any> {
    const { name } = options;
    
    debug(`🗑️ Deleting data source ${name}`);
    
    return await this.v1({
      type: 'pg_drop_source',
      args: {
        name,
        cascade: true
      }
    });
  }

  async ensureDefaultSource(databaseUrl?: string): Promise<any> {
    debug('🔍 Ensuring default data source exists');
    
    const defaultExists = await this.checkSourceExists('default');
    
    if (!defaultExists) {
      debug('📝 Default source does not exist, creating it...');
      
      // Use provided database URL or try to get from environment
      const dbUrl = databaseUrl || 
                   process.env.POSTGRES_URL || 
                   process.env.DATABASE_URL ||
                   'postgres://postgres:postgrespassword@postgres:5432/postgres';
      
      await this.defineSource({
        name: 'default',
        kind: 'postgres',
        configuration: {
          connection_info: {
            database_url: dbUrl,
            isolation_level: 'read-committed',
            use_prepared_statements: false
          }
        }
      });
      
      debug('✅ Default data source created successfully');
    } else {
      debug('✅ Default data source already exists');
    }
    
    return { success: true };
  }

  async trackFunction(options: { schema: string; name: string }): Promise<any> {
    const { schema, name } = options;
    debug(`🔍 Tracking function ${schema}.${name}`);
    return await this.v1({
      type: 'pg_track_function',
      args: {
        source: 'default',
        schema,
        name
      }
    });
  }

  async untrackFunction(options: { schema: string; name: string }): Promise<any> {
    const { schema, name } = options;
    debug(`🔄 Untracking function ${schema}.${name}`);
    return await this.v1({
      type: 'pg_untrack_function',
      args: {
        source: 'default',
        schema,
        name
      }
    });
  }
}
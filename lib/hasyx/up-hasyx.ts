import fs from 'fs-extra';
import path from 'path';
import spawn from 'cross-spawn';
import { Hasura } from '../hasura/hasura';
import Debug from '../debug';
import { DEFAULT_NAMESPACE } from '../hid';
import { getProperSchemaAndTable, getTablesFromGraphQLSchema, HasuraTable, HasuraTableColumn } from '../hasyx-schema-utils';

const debug = Debug('migration:up-hasyx');

// Retry function for critical operations
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
  operationName: string = 'operation'
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`❌ ${operationName} failed after ${maxRetries} attempts:`, error);
        throw error;
      }
      console.warn(`⚠️ ${operationName} failed on attempt ${attempt}/${maxRetries}, retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      delayMs *= 2; // Exponential backoff
    }
  }
  throw new Error(`Failed to complete ${operationName} after ${maxRetries} attempts`);
}

function getCurrentProjectName(projectRoot: string): string {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  let projectName = path.basename(projectRoot);
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      if (pkg.name) {
        projectName = pkg.name;
      }
    } catch (e: any) {
      debug('Could not read project name from package.json:', e.message);
    }
  }
  return projectName.replace(/[^a-zA-Z0-9-]/g, '_');
}

// Function to clean up test schemas
async function cleanupTestSchemas(hasura: Hasura): Promise<void> {
  try {
    debug('🧹 Cleaning up test schemas (test_*)...');
    
    // Get all schemas that start with 'test_'
    const getSchemasQuery = `
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name LIKE 'test_%';
    `;
    
    const result = await hasura.sql(getSchemasQuery);
    
    if (result && result.length > 0) {
      debug(`Found ${result.length} test schemas to clean up`);
      
      for (const row of result) {
        const schemaName = row.schema_name;
        debug(`Dropping test schema: ${schemaName}`);
        
        try {
          await hasura.sql(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`);
          debug(`✅ Dropped schema: ${schemaName}`);
        } catch (error) {
          debug(`⚠️ Failed to drop schema ${schemaName}: ${String(error)}`);
        }
      }
    } else {
      debug('No test schemas found to clean up');
    }
  } catch (error) {
    debug(`⚠️ Error during test schema cleanup: ${String(error)}`);
  }
}

export async function up(): Promise<boolean> {
  const projectRoot = process.cwd();
  debug('🚀 Starting Hasyx View migration UP...');

  if (!process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || !process.env.HASURA_ADMIN_SECRET) {
    console.error('❌ Hasura URL or Admin Secret not found in environment variables.');
    debug('Missing Hasura credentials in .env');
    return false;
  }

  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  // Clean up test schemas before proceeding
  await cleanupTestSchemas(hasura);

  const currentProjectName = getCurrentProjectName(projectRoot);
  const hidNamespace = DEFAULT_NAMESPACE;

  try {
  
  

    const schemaPath = path.join(projectRoot, 'public', 'hasura-schema.json');
    let tablesToProcess: HasuraTable[] = [];
    let tableMappings: Record<string, { schema: string, table: string }> | undefined;

    if (!fs.existsSync(schemaPath)) {
      console.error(`❌ Hasura schema file not found at ${schemaPath}. Make sure schema is generated first.`);
      return false;
    } else {
      try {
        const rawSchemaFileContent = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
        debug(`Raw schema file content keys: ${Object.keys(rawSchemaFileContent).join(', ')}`);
        
      
        if (rawSchemaFileContent && rawSchemaFileContent.hasyx && rawSchemaFileContent.hasyx.tableMappings) {
          tableMappings = rawSchemaFileContent.hasyx.tableMappings;
          debug(`Found ${Object.keys(tableMappings || {}).length} table mappings in hasura-schema.json`);
          
        
          if (tableMappings) {
            tablesToProcess = Object.entries(tableMappings).map(([typeName, mapping]) => {
              return {
                table: {
                  schema: mapping.schema,
                  name: mapping.table
                },
              
                primary_key: { columns: ['id'] }
              };
            });
            
            debug(`Created ${tablesToProcess.length} table definitions from mappings`);
          }
          
        } else {
          debug('⚠️ Table mappings not found in hasura-schema.json. Will use basic heuristics for schema detection.');
          debug('No tableMappings found in schema file');
          
          if (rawSchemaFileContent && rawSchemaFileContent.hasyx) {
            debug('hasyx section found but no tableMappings property');
            debug(`hasyx section keys: ${Object.keys(rawSchemaFileContent.hasyx).join(', ')}`);
          } else {
            debug('hasyx section not found in schema file');
          }
          
        
          if (rawSchemaFileContent && rawSchemaFileContent.data && rawSchemaFileContent.data.__schema && rawSchemaFileContent.data.__schema.types) {
          
            tablesToProcess = getTablesFromGraphQLSchema(rawSchemaFileContent.data.__schema.types, tableMappings);
             if (tablesToProcess.length === 0) {
               debug('⚠️ Parsed GraphQL schema but found no suitable table objects in data.__schema.types. Check filter logic in getTablesFromGraphQLSchema.');
             }
          } else {
            console.error(`❌ Hasura schema file at ${schemaPath} does not have the expected structure (data.__schema.types). Cannot proceed.`);
            debug('Unexpected schema file content:', rawSchemaFileContent);
            return false;
          }
        }
      } catch (parseError: any) {
        console.error(`❌ Error parsing ${schemaPath}: ${parseError.message}. Cannot proceed.`);
        debug('JSON parse error for schema file:', parseError);
        return false;
      }
    }
    
    if (tablesToProcess.length === 0) {
      debug('⚠️ No tables found in schema to process for Hasyx view. Migration will complete, but view might be empty or not created/updated optimally.');
    }

    let viewSqlUnionParts: string[] = [];

  
    for (const tableDef of tablesToProcess) {
      const schemaName = tableDef.table.schema;
      const tableName = tableDef.table.name;

    
      try {
        debug(`Checking if table ${schemaName}.${tableName} exists...`);
        const checkTableSql = `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = '${schemaName}' 
            AND table_name = '${tableName}'
          );
        `;
        const tableExists = await hasura.sql(checkTableSql);
        debug(`Table existence check result: ${JSON.stringify(tableExists)}`);
        
      
        if (!tableExists.result || !tableExists.result[1] || tableExists.result[1][0] !== 't') {
          debug(`⚠️ Table ${schemaName}.${tableName} does not exist! Skipping.`);
          continue;
        } else {
          debug(`✅ Table ${schemaName}.${tableName} exists.`);
        }
      } catch (error) {
        console.error(`❌ Error checking if table ${schemaName}.${tableName} exists:`, error);
        continue;
      }

    
      if (!tableDef.primary_key || !tableDef.primary_key.columns || tableDef.primary_key.columns.length === 0) {
      
        try {
          debug(`Looking for primary key columns in ${schemaName}.${tableName}...`);
          const columnsResult = await hasura.sql(`SELECT column_name FROM information_schema.columns 
                                                WHERE table_schema = '${schemaName}' 
                                                AND table_name = '${tableName}' 
                                                AND column_name IN ('id', 'uuid')
                                                ORDER BY CASE WHEN column_name = 'id' THEN 1 ELSE 2 END;`);
          
          debug(`Primary key columns result: ${JSON.stringify(columnsResult)}`);
          
          if (columnsResult && columnsResult.result && columnsResult.result.length > 1) {
            // columnsResult.result[0] contains headers, columnsResult.result[1] contains first data row
            const pkColumn = columnsResult.result[1][0]; // First column of first data row
            tableDef.primary_key = { columns: [pkColumn] };
            debug(`Found primary key for ${schemaName}.${tableName}: ${pkColumn}`);
          } else {
            debug(`⚠️ No id or uuid column found for ${schemaName}.${tableName}. Skipping.`);
            continue;
          }
        } catch (error) {
          console.error(`❌ Error checking for primary key in ${schemaName}.${tableName}:`, error);
          continue;
        }
      }

    
      const pkColumns = tableDef.primary_key?.columns;
      if (!pkColumns || pkColumns.length === 0) {
        debug(`⚠️ Table ${schemaName}.${tableName} has no determinable primary key. Skipping for HID view.`);
        continue;
      }
      const pkColumn = pkColumns[0];

      // Determine if PK is uuid to expose id_uuid in the view
      let pkIsUuid = false;
      try {
        const pkTypeRes = await hasura.sql(`SELECT data_type FROM information_schema.columns WHERE table_schema='${schemaName}' AND table_name='${tableName}' AND column_name='${pkColumn}'`);
        const pkType = pkTypeRes?.result?.[1]?.[0] as string | undefined;
        pkIsUuid = (pkType === 'uuid');
      } catch (e) {
        debug(`⚠️ Could not determine PK type for ${schemaName}.${tableName}.${pkColumn}: ${String(e)}`);
        pkIsUuid = false;
      }

      if (['pg_catalog', 'information_schema', 'hdb_catalog', 'graphql_public'].includes(schemaName)) {
      
        debug(`Skipping system or internal table: ${schemaName}.${tableName}`);
        continue;
      }
      if (tableName === 'hasyx' && schemaName === 'public') {
        debug('Skipping self-reference to public.hasyx view');
        continue;
      }

      const addColsSql = `
        ALTER TABLE "${schemaName}"."${tableName}"
        ADD COLUMN IF NOT EXISTS "_hasyx_schema_name" TEXT GENERATED ALWAYS AS ('${schemaName}') STORED,
        ADD COLUMN IF NOT EXISTS "_hasyx_table_name" TEXT GENERATED ALWAYS AS ('${tableName}') STORED;`;
      debug('Adding generated columns to ' + schemaName + '.' + tableName + ':\n' + addColsSql);
      debug(`Executing SQL to add columns to ${schemaName}.${tableName}...`);
      try {
        const alterResult = await hasura.sql(addColsSql);
        debug(`Add columns result: ${JSON.stringify(alterResult)}`);
      } catch (error) {
        console.error(`❌ Error adding columns to ${schemaName}.${tableName}:`, error);
      
        if (String(error).includes('already exists')) {
          debug('Columns already exist, continuing...');
        } else {
          continue;
        }
      }

      const idUuidExpr = pkIsUuid ? `"${pkColumn}"::uuid` : `NULL::uuid`;
      viewSqlUnionParts.push(
        `SELECT
          '${hidNamespace}' || '/' || '${currentProjectName}' || '/' || '${schemaName}' || '/' || '${tableName}' || '/' || "${pkColumn}"::text AS hid,
          '${hidNamespace}' AS namespace,
          '${currentProjectName}' AS project,
          '${schemaName}' AS schema,
          '${tableName}' AS table,
          "${pkColumn}"::text AS id,
          ${idUuidExpr} AS id_uuid
        FROM "${schemaName}"."${tableName}"`
      );
    }

    if (viewSqlUnionParts.length > 0) {
      const createViewSql = `CREATE OR REPLACE VIEW "public"."hasyx" AS\n${viewSqlUnionParts.join('\nUNION ALL\n')};`;
      debug('Creating/Replacing view public.hasyx:\n' + createViewSql);
      debug('Creating view public.hasyx...');
      debug(createViewSql);
      try {
        const viewResult = await hasura.sql(createViewSql);
        debug(`Create view result: ${JSON.stringify(viewResult)}`);
      } catch (error) {
        console.error(`❌ Error creating view:`, error);
        return false;
      }

      debug('Tracking view public.hasyx...');
      let viewTracked = false;
      try {
        const trackResult = await retryOperation(async () => {
          return await hasura.v1({
            type: 'pg_track_table',
            args: { source: 'default', schema: 'public', name: 'hasyx' },
          });
        });
        debug(`Track view result: ${JSON.stringify(trackResult)}`);
        viewTracked = true;
      } catch (error) {
        console.error(`❌ Error tracking view:`, error);
        debug('⚠️ View was created but could not be tracked. Continuing with relationships...');
        // Don't return false here, view creation was successful
        viewTracked = false;
      }

      // Create relationships only if we have existing tables and view tracking was attempted
      if (tablesToProcess.length > 0) {
        debug('🔗 Creating relationships...');
        for (const tableDef of tablesToProcess) {
          const schemaName = tableDef.table.schema;
          const tableName = tableDef.table.name;

          // Skip non-existent tables
          try {
            const checkTableSql = `
              SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = '${schemaName}' 
                AND table_name = '${tableName}'
              );
            `;
            const tableExists = await hasura.sql(checkTableSql);
            
            if (!tableExists.result || !tableExists.result[1] || tableExists.result[1][0] !== 't') {
              debug(`⚠️ Skipping relationships for non-existent table ${schemaName}.${tableName}.`);
              continue;
            }
          } catch (error) {
            console.error(`❌ Error checking if table ${schemaName}.${tableName} exists for relationships:`, error);
            continue;
          }

          const pkColumns = tableDef.primary_key?.columns;
          if (!pkColumns || pkColumns.length === 0) continue;
          const pkColumn = pkColumns[0];
          
          if (tableName === 'hasyx' && schemaName === 'public') continue;
          if (['pg_catalog', 'information_schema', 'hdb_catalog', 'graphql_public'].includes(schemaName)) continue;

          // Create relationship from table to hasyx view
          const relToHasyxName = 'hasyx';
          debug(`Creating relationship ${relToHasyxName} from ${schemaName}.${tableName} to public.hasyx`);
          try {
            await retryOperation(async () => {
              await hasura.v1({
                type: 'pg_create_object_relationship',
                args: {
                  source: 'default',
                  table: { schema: schemaName, name: tableName },
                  name: relToHasyxName,
                  using: {
                    manual_configuration: {
                      remote_table: { schema: 'public', name: 'hasyx' },
                      column_mapping: {
                        [pkColumn]: 'id_uuid',
                      },
                    },
                  },
                },
              });
            });
            debug(`✅ Created relationship ${relToHasyxName} from ${schemaName}.${tableName}`);
          } catch (error) {
            debug(`⚠️ Error creating relationship ${relToHasyxName} from ${schemaName}.${tableName} to public.hasyx: ${String(error)}`);
          }

          // Create relationship from hasyx view to table (only if view was tracked)
          if (viewTracked) {
            const relFromHasyxName = `${schemaName}_${tableName}`;
            debug(`Creating relationship ${relFromHasyxName} from public.hasyx to ${schemaName}.${tableName}`);
            try {
              await retryOperation(async () => {
                await hasura.v1({
                  type: 'pg_create_object_relationship',
                  args: {
                    source: 'default',
                    table: { schema: 'public', name: 'hasyx' },
                    name: relFromHasyxName,
                    using: {
                      manual_configuration: {
                        remote_table: { schema: schemaName, name: tableName },
                        column_mapping: {
                          id_uuid: pkColumn,
                        },
                      },
                    },
                    comment: `Points to ${schemaName}.${tableName} if this HID entry corresponds to it.`
                  },
                });
              });
              debug(`✅ Created relationship ${relFromHasyxName} from public.hasyx`);
            } catch (error) {
              debug(`⚠️ Error creating relationship ${relFromHasyxName} from public.hasyx to ${schemaName}.${tableName}: ${String(error)}`);
            }
          } else {
            debug(`⚠️ Skipping reverse relationship from hasyx to ${schemaName}.${tableName} because view is not tracked`);
          }
        }
      }

      // Define select permissions on public.hasyx so nested relations resolve for non-admin roles
      try {
        debug('Defining select permissions on public.hasyx for anonymous and user');
        await retryOperation(async () => {
          await hasura.definePermission({ schema: 'public', table: 'hasyx', operation: 'select', role: 'anonymous', filter: {}, columns: true });
        });
        await retryOperation(async () => {
          await hasura.definePermission({ schema: 'public', table: 'hasyx', operation: 'select', role: 'user', filter: {}, columns: true });
        });
        debug('✅ Select permissions set on public.hasyx');
      } catch (e) {
        debug(`⚠️ Failed setting hasyx view permissions: ${String(e)}`);
      }

      // Create relationship from options.to_id -> hasyx.id_uuid (if options table exists)
      try {
        const optExists = await hasura.sql(`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='options')`);
        if (optExists?.result?.[1]?.[0] === 't') {
          debug('Creating relationship options.to -> public.hasyx via to_id -> id_uuid');
          await retryOperation(async () => {
            await hasura.v1({
              type: 'pg_create_object_relationship',
              args: {
                source: 'default',
                table: { schema: 'public', name: 'options' },
                name: 'to',
                using: {
                  manual_configuration: {
                    remote_table: { schema: 'public', name: 'hasyx' },
                    column_mapping: { to_id: 'id_uuid' }
                  }
                }
              }
            });
          });
          debug('✅ Created relationship options.to');
        } else {
          debug('public.options not found; skipping options.to relationship');
        }
      } catch (e) {
        debug(`⚠️ Failed to create options.to relationship: ${String(e)}`);
      }
    } else {
      debug('⚠️ No suitable tables (with assumed PKs) found to include in the hasyx view. View will not be created/updated.');
      const dropViewSql = 'DROP VIEW IF EXISTS "public"."hasyx";';
      debug('No tables for hasyx view, ensuring it is dropped if it exists:\n' + dropViewSql);
      await hasura.sql(dropViewSql);
      try {
        await retryOperation(async () => {
          await hasura.v1({ type: 'pg_untrack_table', args: { source: 'default', table: { schema: 'public', name: 'hasyx' } } });
        });
      } catch (e) { /* ignore if not tracked */ }
    }
    
    debug('✨ Hasyx View migration UP completed successfully!');
    return true;
  } catch (error: any) {
    console.error('❗ Critical error during Hasyx View UP migration:', error.message);
    debug('❌ Hasyx View UP Migration failed:', error);
    return false;
  }
} 
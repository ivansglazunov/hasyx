import * as fs from 'fs-extra';
import * as path from 'path';
import * as spawn from 'cross-spawn';
import { Hasura } from '../hasura/hasura';
import Debug from '../debug';
import { getProperSchemaAndTable, getTablesFromGraphQLSchema, HasuraTable } from '../hasyx-schema-utils';

const debug = Debug('migration:down-hasyx');

// Function to clean up test schemas
async function cleanupTestSchemas(hasura: Hasura): Promise<void> {
  try {
    console.log('🧹 Cleaning up test schemas and temporary objects...');
    
    try {
      debug('🔍 Checking inconsistent metadata...');
      const inconsistentMetadata = await hasura.getInconsistentMetadata();
      if (inconsistentMetadata && inconsistentMetadata.inconsistent_objects && inconsistentMetadata.inconsistent_objects.length > 0) {
        debug(`Found ${inconsistentMetadata.inconsistent_objects.length} inconsistent metadata objects`);
        await hasura.dropInconsistentMetadata();
        debug('✅ Inconsistent metadata cleaned');
      } else {
        debug('✅ No inconsistent metadata found');
      }
    } catch (e: any) {
      debug('⚠️ Error cleaning inconsistent metadata:', e.message);
      console.warn('⚠️ Error cleaning inconsistent metadata:', e.message);
    }
    
    const getSchemasQuery = `
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name LIKE 'test%';
    `;
    
    const result = await hasura.sql(getSchemasQuery);
    
    debug(`Schema query result: ${JSON.stringify(result)}`);
    
    let schemas: string[] = [];
    
    if (result && typeof result === 'object' && 'result_type' in result && result.result_type === 'TuplesOk' && Array.isArray(result.result) && result.result.length > 1) {
      for (let i = 1; i < result.result.length; i++) {
        if (Array.isArray(result.result[i]) && result.result[i].length > 0) {
          schemas.push(String(result.result[i][0])); // Take first column of each row
        }
      }
    } else if (Array.isArray(result) && result.length > 0) {
      schemas = result.map(row => typeof row === 'object' && row !== null && 'schema_name' in row ? String(row.schema_name) : '');
      schemas = schemas.filter(name => name !== '');
    }
    
    if (schemas.length > 0) {
      console.log(`Found ${schemas.length} test schemas to delete: ${schemas.join(', ')}`);
      
      for (const schemaName of schemas) {
        console.log(`Processing test schema: ${schemaName}`);
        
        try {
          // 3.1. Get list of tables in schema
          const getTablesQuery = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = '${schemaName}';
          `;
          
          const tables = await hasura.sql(getTablesQuery);
          
          // 3.2. For each table, disable tracking via Hasura API
          if (tables && tables.length > 0) {
            for (const tableRow of tables) {
              const tableName = tableRow.table_name;
              debug(`Disabling table tracking: ${schemaName}.${tableName}`);
              
              try {
                // Use Hasura API to disable table tracking
                await hasura.v1({
                  type: 'pg_untrack_table',
                  args: {
                    source: 'default',
                    table: {
                      schema: schemaName,
                      name: tableName
                    },
                    cascade: true
                  }
                }).catch(e => {
                  // Ignore errors if table is already untracked
                  debug(`Ignoring untrack error: ${e.message}`);
                });
              } catch (e: any) {
                debug(`⚠️ Error disabling tracking for ${schemaName}.${tableName}: ${e.message}`);
              }
            }
          }
          
          // 3.3. Drop schema with CASCADE
          debug(`Dropping schema: ${schemaName}`);
          await hasura.sql(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`);
          console.log(`✅ Schema dropped: ${schemaName}`);
        } catch (error) {
          console.warn(`⚠️ Failed to fully drop schema ${schemaName}:`, error);
        }
      }
    } else {
      console.log('No test schemas found for deletion');
    }
    
    try {
      const getTestTablesQuery = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND 
              (table_name LIKE 'test%');
      `;
      
      const testTables = await hasura.sql(getTestTablesQuery);
      debug(`Test tables query result: ${JSON.stringify(testTables)}`);
      
      let tableNames: string[] = [];
      
      if (testTables && typeof testTables === 'object' && 'result_type' in testTables && 
          testTables.result_type === 'TuplesOk' && Array.isArray(testTables.result) && testTables.result.length > 1) {
        for (let i = 1; i < testTables.result.length; i++) {
          if (Array.isArray(testTables.result[i]) && testTables.result[i].length > 0) {
            tableNames.push(String(testTables.result[i][0])); // Take first column of each row
          }
        }
      } else if (Array.isArray(testTables) && testTables.length > 0) {
        tableNames = testTables.map(row => typeof row === 'object' && row !== null && 'table_name' in row ? String(row.table_name) : '');
        tableNames = tableNames.filter(name => name !== '');
      }
      
      if (tableNames.length > 0) {
        console.log(`Found ${tableNames.length} test tables in public schema: ${tableNames.join(', ')}`);
        
        for (const tableName of tableNames) {
          console.log(`Dropping test table: public.${tableName}`);
          
          try {
            // First disable table tracking
            await hasura.v1({
              type: 'pg_untrack_table',
              args: {
                source: 'default',
                table: {
                  schema: 'public',
                  name: tableName
                },
                cascade: true
              }
            }).catch(e => {
              debug(`Ignoring untrack error: ${e.message}`);
            });
            
            // Then drop the table
            await hasura.sql(`DROP TABLE IF EXISTS public."${tableName}" CASCADE;`);
            console.log(`✅ Table dropped: public.${tableName}`);
          } catch (error) {
            console.warn(`⚠️ Failed to drop table public.${tableName}:`, error);
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Error dropping test tables:', error);
    }
    
    try {
      debug('🔍 Final inconsistent metadata check...');
      const inconsistentMetadata = await hasura.getInconsistentMetadata();
      if (inconsistentMetadata && inconsistentMetadata.inconsistent_objects && inconsistentMetadata.inconsistent_objects.length > 0) {
        debug(`Found ${inconsistentMetadata.inconsistent_objects.length} inconsistent metadata objects`);
        await hasura.dropInconsistentMetadata();
        debug('✅ Final inconsistent metadata cleanup completed');
      } else {
        debug('✅ No inconsistent metadata found');
      }
    } catch (e: any) {
      debug('⚠️ Error during final metadata cleanup:', e.message);
    }
    
    console.log('✅ Test schemas and objects cleanup completed');
  } catch (error) {
    console.warn('⚠️ Error during test schemas cleanup:', error);
  }
}

export async function down(): Promise<boolean> {
  const projectRoot = process.cwd();
  debug('🚀 Starting Hasyx View migration DOWN...');

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

  try {

    debug('🔧 Starting forced cleanup of all metadata related to hasyx...');
    console.log('Starting forced cleanup of all metadata related to hasyx...');
    
    try {
      debug('🗑️ Removing all relationships to hasyx in metadata...');
      console.log('Removing all relationships to hasyx in metadata...');
      
      await hasura.sql(`
        -- Remove all relationships where hasyx is the remote table
        DELETE FROM hdb_catalog.hdb_relationship 
        WHERE remote_table::text LIKE '%"hasyx"%';
        
        -- Remove all relationships named hasyx
        DELETE FROM hdb_catalog.hdb_relationship 
        WHERE rel_name = 'hasyx';
        
        -- Remove all permissions for hasyx
        DELETE FROM hdb_catalog.hdb_permission 
        WHERE table_schema = 'public' AND table_name = 'hasyx';
        
        -- Remove all computed fields for hasyx
        DELETE FROM hdb_catalog.hdb_computed_field 
        WHERE table_schema = 'public' AND table_name = 'hasyx';
        
        -- Remove all tracked tables named hasyx
        DELETE FROM hdb_catalog.hdb_table 
        WHERE table_schema = 'public' AND table_name = 'hasyx';
      `, 'default', true);
      
      debug('✅ Metadata successfully cleaned via direct SQL');
    } catch (e: any) {
      debug('⚠️ Error cleaning metadata via SQL:', e.message);
      console.warn('⚠️ Error cleaning metadata via SQL:', e.message);
    }
    
    debug('🔍 Checking inconsistent metadata...');
    try {
      await hasura.dropInconsistentMetadata();
      debug('✅ Inconsistent metadata cleaned via API');
    } catch (e: any) {
      debug('⚠️ Error cleaning inconsistent metadata:', e.message);
      console.warn('⚠️ Error cleaning inconsistent metadata:', e.message);
      console.log('❗ Continuing execution despite the error...');
    }
    
    debug('🗑️ Dropping view public.hasyx...');
    console.log('Dropping view public.hasyx...');
    try {
      await hasura.sql('DROP VIEW IF EXISTS public.hasyx CASCADE;', 'default', true);
      debug('✅ View dropped successfully with CASCADE');
    } catch (e: any) {
      debug('⚠️ Error dropping view:', e.message);
      console.warn('⚠️ Error dropping view:', e.message);
      console.log('❗ Continuing execution despite the error...');
    }
    
    debug('⚠️ Ignoring inconsistent metadata errors and continuing...');
    console.log('⚠️ Ignoring inconsistent metadata errors and continuing...');
    
    debug('🔍 Finding all relationships to hasyx table...');
    console.log('Finding all relationships to hasyx table...');
    
    try {
      const metadata = await hasura.exportMetadata();
      
      if (metadata && metadata.metadata && metadata.metadata.sources) {
        for (const source of metadata.metadata.sources) {
          if (source.tables) {
            for (const table of source.tables) {
              const schemaName = table.table.schema;
              const tableName = table.table.name;
              
              if (tableName === 'hasyx' && schemaName === 'public') continue;
              
              interface HasyxRelation {
                type: 'object' | 'array';
                name: string;
                schema: string;
                table: string;
              }
              
              const hasyxRelations: HasyxRelation[] = [];
              
              if (table.object_relationships) {
                for (const rel of table.object_relationships) {
                  if (rel.name === 'hasyx' || 
                      (rel.using?.manual_configuration?.remote_table?.name === 'hasyx' && 
                       rel.using?.manual_configuration?.remote_table?.schema === 'public')) {
                    hasyxRelations.push({
                      type: 'object',
                      name: rel.name,
                      schema: schemaName,
                      table: tableName
                    });
                  }
                }
              }
              
              if (table.array_relationships) {
                for (const rel of table.array_relationships) {
                  if (rel.name === 'hasyx' || 
                      (rel.using?.manual_configuration?.remote_table?.name === 'hasyx' && 
                       rel.using?.manual_configuration?.remote_table?.schema === 'public')) {
                    hasyxRelations.push({
                      type: 'array',
                      name: rel.name,
                      schema: schemaName,
                      table: tableName
                    });
                  }
                }
              }
              
              for (const rel of hasyxRelations) {
                debug(`Dropping ${rel.type} relationship ${rel.name} from ${rel.schema}.${rel.table}`);
                console.log(`Dropping ${rel.type} relationship ${rel.name} from ${rel.schema}.${rel.table}`);
                
                try {
                  await hasura.v1({
                    type: 'pg_drop_relationship',
                    args: {
                      source: 'default',
                      table: { schema: rel.schema, name: rel.table },
                      relationship: rel.name,
                    },
                  });
                  debug(`✅ Successfully dropped relationship ${rel.name} from ${rel.schema}.${rel.table}`);
                } catch (e: any) {
                  debug(`⚠️ Failed to drop relationship ${rel.name} from ${rel.schema}.${rel.table}: ${e.message}`);
                  console.warn(`⚠️ Failed to drop relationship ${rel.name} from ${rel.schema}.${rel.table}`);
                }
              }
            }
          }
        }
      }
    } catch (e: any) {
      debug('⚠️ Error analyzing metadata for relationships:', e.message);
      console.warn('⚠️ Error analyzing metadata for relationships:', e.message);
    }

    debug('Untracking view public.hasyx...');
    try {
      await hasura.v1({
        type: 'pg_untrack_table',
        args: { source: 'default', schema: 'public', name: 'hasyx' },
      });
      debug('✅ View untracked successfully');
    } catch (e: any) {
      debug('Failed to untrack view (may not exist):', e.message);
    }

    debug('Dropping view public.hasyx...');
    try {
      await hasura.sql('DROP VIEW IF EXISTS public.hasyx;');
      debug('✅ View dropped successfully');
    } catch (e: any) {
      debug('Failed to drop view (may not exist):', e.message);
    }

    const schemaPath = path.join(projectRoot, 'public', 'hasura-schema.json');
    let tablesToClean: HasuraTable[] = [];
    let tableMappings: Record<string, { schema: string, table: string }> | undefined;

    if (fs.existsSync(schemaPath)) {
      try {
        const rawSchemaFileContent = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
        debug(`Raw schema file content keys: ${Object.keys(rawSchemaFileContent).join(', ')}`);

        if (rawSchemaFileContent && rawSchemaFileContent.hasyx && rawSchemaFileContent.hasyx.tableMappings) {
          tableMappings = rawSchemaFileContent.hasyx.tableMappings;
          debug(`Found ${Object.keys(tableMappings || {}).length} table mappings in hasura-schema.json`);

          if (tableMappings) {
            tablesToClean = Object.entries(tableMappings).map(([typeName, mapping]) => {
              return {
                table: {
                  schema: mapping.schema,
                  name: mapping.table
                },
                primary_key: { columns: ['id'] }
              };
            });
          }
        } else if (rawSchemaFileContent && rawSchemaFileContent.data && rawSchemaFileContent.data.__schema && rawSchemaFileContent.data.__schema.types) {
          tablesToClean = getTablesFromGraphQLSchema(rawSchemaFileContent.data.__schema.types, tableMappings);
          if (tablesToClean.length === 0) {
            console.warn(`⚠️ Parsed GraphQL schema but found no suitable table objects to clean up. Check filter logic.`);
          }
        } else {
          debug('Unexpected schema file content for down script:', rawSchemaFileContent);
        }
      } catch (parseError: any) {
        debug('JSON parse error for schema file (down script): ', parseError);
      }
    }
    debug('🔍 Checking for inconsistent metadata after schema processing...');
    try {
      const inconsistentData = await hasura.getInconsistentMetadata();
      if (inconsistentData?.is_consistent === false && inconsistentData?.inconsistent_objects?.length > 0) {
        debug(`📋 Found ${inconsistentData.inconsistent_objects.length} inconsistent objects after schema processing`);
        console.log(`⚠️ Found ${inconsistentData.inconsistent_objects.length} inconsistent metadata objects after schema processing`);
        
        debug('🗑️ Dropping all inconsistent metadata...');
        console.log('Dropping all inconsistent metadata...');
        await hasura.dropInconsistentMetadata();
        debug('✅ Inconsistent metadata dropped successfully');
      } else {
        debug('✅ No inconsistent metadata found after schema processing');
      }
    } catch (e: any) {
      debug('⚠️ Error checking inconsistent metadata:', e.message);
      console.warn('⚠️ Error checking inconsistent metadata:', e.message);
    }

    for (const tableDef of tablesToClean) {
      const schemaName = tableDef.table.schema;
      const tableName = tableDef.table.name;

      if (tableName === 'hasyx' && schemaName === 'public') continue;

      const relToHasyxName = 'hasyx';
      debug(`Dropping relationship ${relToHasyxName} from ${schemaName}.${tableName}`);
      try {
        await hasura.v1({
          type: 'pg_drop_relationship',
          args: {
            source: 'default',
            table: { schema: schemaName, name: tableName },
            relationship: relToHasyxName,
          },
        });
      } catch (e: any) {
        debug(`Failed to drop relationship ${relToHasyxName} from ${schemaName}.${tableName} (may not exist):`, e.message);
      }

      const dropColsSql = `
        ALTER TABLE IF EXISTS "${schemaName}"."${tableName}"
        DROP COLUMN IF EXISTS "_hasyx_schema_name",
        DROP COLUMN IF EXISTS "_hasyx_table_name";`;
      debug('Dropping generated columns from ' + schemaName + '.' + tableName + ':\n' + dropColsSql);
      await hasura.sql(dropColsSql);


      const relFromHasyxName = `${schemaName}_${tableName}`;
      debug(`Dropping relationship ${relFromHasyxName} from public.hasyx to ${schemaName}.${tableName}`);
      try {
        await hasura.v1({
          type: 'pg_drop_relationship',
          args: {
            source: 'default',
            table: { schema: 'public', name: 'hasyx' },
            relationship: relFromHasyxName,
          },
        });
      } catch (e: any) {
        debug(`Failed to drop relationship ${relFromHasyxName} from public.hasyx (may not exist):`, e.message);
      }
    }

    debug('Untracking view public.hasyx...');
    try {
      await hasura.v1({
        type: 'pg_untrack_table',
        args: {
          source: 'default',
          table: { schema: 'public', name: 'hasyx' },
          cascade: true,
        },
      });
    } catch (e: any) {
      debug('Failed to untrack public.hasyx (may not exist or already untracked):', e.message);
    }

    debug('🔍 Final check for inconsistent metadata...');
    console.log('🔍 Final check for inconsistent metadata...');
    try {
      const inconsistentData = await hasura.getInconsistentMetadata();
      if (inconsistentData?.is_consistent === false && inconsistentData?.inconsistent_objects?.length > 0) {
        debug(`📋 Found ${inconsistentData.inconsistent_objects.length} inconsistent objects at the end of migration`);
        console.log(`⚠️ Found ${inconsistentData.inconsistent_objects.length} inconsistent metadata objects at the end of migration`);
        
        debug('🗑️ Final dropping of all inconsistent metadata...');
        console.log('Final dropping of all inconsistent metadata...');
        try {
          await hasura.dropInconsistentMetadata();
          debug('✅ Final inconsistent metadata cleanup successful');
        } catch (dropError: any) {
          debug('⚠️ Error during final inconsistent metadata cleanup:', dropError.message);
          console.warn('⚠️ Error during final inconsistent metadata cleanup:', dropError.message);
          console.log('❗ Ignoring error and finishing migration...');
        }
      } else {
        debug('✅ No inconsistent metadata found at the end of migration');
      }
    } catch (e: any) {
      debug('⚠️ Error during final inconsistent metadata check:', e.message);
      console.warn('⚠️ Error during final inconsistent metadata check:', e.message);
      console.log('❗ Ignoring error and finishing migration...');
    }
    
    debug('✨ Hasyx View migration DOWN completed successfully!');
    
    console.log('🧹 Performing additional cleanup of test schemas...');
    await cleanupTestSchemas(hasura);
    console.log('✅ Additional cleanup of test schemas completed');
    
    return true;
  } catch (error: any) {
    debug('⚠️ Error during Hasyx View DOWN migration:', error);
    console.warn('⚠️ Error during Hasyx View DOWN migration, continuing.');
    
    debug('✅ Continuing migration despite errors');
    return true;
  }
}
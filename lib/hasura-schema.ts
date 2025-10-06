import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import { IntrospectionQuery, getIntrospectionQuery } from 'graphql';
import Debug from './debug';
import { GRAPHQL_SCALAR_TYPES, GRAPHQL_AGGREGATE_SUFFIXES, GRAPHQL_ROOT_TYPES } from './graphql-constants';

dotenv.config();

async function fetchSchema() {
  const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
  const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;
  const PUBLIC_OUTPUT_DIR = path.resolve(process.cwd(), 'public');
  const PUBLIC_OUTPUT_PATH = path.join(PUBLIC_OUTPUT_DIR, 'hasura-schema.json');
  const APP_OUTPUT_DIR = path.resolve(process.cwd(), 'app', 'hasyx');
  const APP_OUTPUT_PATH = path.join(APP_OUTPUT_DIR, 'hasura-schema.json');

  const debug = Debug('hasura:schema');

  if (!HASURA_GRAPHQL_URL) {
    throw new Error('❌ Error: NEXT_PUBLIC_HASURA_GRAPHQL_URL is not defined in .env');
  }

  /**
   * Analyzes GraphQL schema types to identify PostgreSQL tables and their schemas
   * @param schemaTypes - Array of GraphQL types from introspection
   * @returns Mapping of GraphQL type names to their PostgreSQL schemas and table names
   */
  function identifyTableSchemas(schemaTypes: any[]) {
    const tableMappings: Record<string, { schema: string, table: string }> = {};
    
    
    debug(`Total types in schema: ${schemaTypes.length}`);
    
    
    const allObjectTypes = schemaTypes.filter(type => type.kind === 'OBJECT' && type.name);
    debug(`Object types in schema: ${allObjectTypes.length}`);
    debug(`Object type names: ${allObjectTypes.map(t => t.name).join(', ')}`);
    console.log(`📊 Total OBJECT types: ${allObjectTypes.length}`);
    console.log(`📋 All OBJECT type names: ${allObjectTypes.map(t => t.name).join(', ')}`);
    
    

    const potentialTableTypes = schemaTypes.filter(type =>
      type.kind === 'OBJECT' &&
      type.name &&
      !type.name.startsWith('__') &&
      !Array.from(GRAPHQL_AGGREGATE_SUFFIXES).some(suffix => type.name.endsWith(suffix)) &&
      !GRAPHQL_ROOT_TYPES.has(type.name)
    );

    debug(`Found ${potentialTableTypes.length} potential table types in schema`);
    debug(`Potential table type names: ${potentialTableTypes.map(t => t.name).slice(0, 10).join(', ')}...`);
    console.log(`📊 Found ${potentialTableTypes.length} potential table types in schema`);
    console.log(`📋 First 10 table types: ${potentialTableTypes.map(t => t.name).slice(0, 10).join(', ')}`);
    
    // Log warning if very few tables found, but don't add fallback tables
    if (potentialTableTypes.length < 5) {
      console.log(`⚠️  Warning: Found only ${potentialTableTypes.length} tables in Hasura schema.`);
      console.log(`⚠️  This might indicate that tables are not tracked in Hasura.`);
      console.log(`⚠️  Generator will work with available tables only.`);
    }
    
    
    for (const type of potentialTableTypes) {
      let schema = 'public';
      let tableName = type.name;
      
      
      const schemaTableMatch = type.name.match(/^([a-z0-9_]+)_([a-z0-9_]+)$/i);
      if (schemaTableMatch) {
        
        const potentialSchema = schemaTableMatch[1];
        const potentialTable = schemaTableMatch[2];

        const sameSchemaTypes = potentialTableTypes.filter(t =>
          t.name !== type.name && t.name.startsWith(`${potentialSchema}_`)
        );

        if (sameSchemaTypes.length > 0) {
          debug(`Type ${type.name} appears to belong to schema '${potentialSchema}' based on name pattern and other types with same prefix`);
          schema = potentialSchema;
          tableName = potentialTable;
        }
      }
      
      
      if (type.fields) {
        
        const schemaField = type.fields.find((f: any) =>
          f.name === '_hasyx_schema_name' ||
          f.name === 'schema_name' ||
          f.name === 'schema'
        );

        if (schemaField && schemaField.defaultValue) {
          const match = schemaField.defaultValue.match(/['"]([a-z0-9_]+)['"]/i);
          if (match) {
            schema = match[1];
            debug(`Type ${type.name} explicitly specifies schema '${schema}' in field ${schemaField.name}`);
          }
        }
        
        
        const tableField = type.fields.find((f: any) =>
          f.name === '_hasyx_table_name' ||
          f.name === 'table_name' ||
          f.name === 'table'
        );

        if (tableField && tableField.defaultValue) {
          const match = tableField.defaultValue.match(/['"]([a-z0-9_]+)['"]/i);
          if (match) {
            tableName = match[1];
            debug(`Type ${type.name} explicitly specifies table '${tableName}' in field ${tableField.name}`);
          }
        }
      }
      
      // Use the determined schema and table name
        tableMappings[type.name] = {
          schema,
          table: tableName
        };
        debug(`Mapped type: ${type.name} -> ${schema}.${tableName}`);
    }

    return tableMappings;
  }

  debug(`🚀 Requesting introspection schema from ${HASURA_GRAPHQL_URL}...`);
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (HASURA_ADMIN_SECRET) {
      headers['X-Hasura-Admin-Secret'] = HASURA_ADMIN_SECRET;
      debug('🔑 Using Hasura Admin Secret.');
    } else {
      debug('⚠️ HASURA_ADMIN_SECRET not found. Requesting schema without admin rights (may be incomplete).');
    }

    const response = await axios.post(
      HASURA_GRAPHQL_URL!,
      {
        query: getIntrospectionQuery(),
      },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(`GraphQL error when requesting schema: ${JSON.stringify(response.data.errors)}`);
    }

    if (!response.data || !response.data.data || !response.data.data.__schema) {
      throw new Error('Invalid response from Hasura server. Missing data.__schema.');
    }

    const introspectionResult = response.data;
    
    // Analyze the schema and identify table mappings
    const schemaTypes = introspectionResult.data.__schema.types;
    const tableMappings = identifyTableSchemas(schemaTypes);

    // Fetch metadata to get permissions
    const metadataUrl = HASURA_GRAPHQL_URL!.replace('/v1/graphql', '/v1/metadata');
    debug(`🚀 Requesting metadata for permissions from ${metadataUrl}...`);
    const metadataResponse = await axios.post(
        metadataUrl,
        { type: 'export_metadata', args: {} },
        { headers }
    );

    if (metadataResponse.data.errors) {
        throw new Error(`Hasura metadata error: ${JSON.stringify(metadataResponse.data.errors)}`);
    }

    const metadata = metadataResponse.data.metadata || metadataResponse.data;
    const permissions: Record<string, any> = {};

    const sources = metadata.sources || [];
    for (const source of sources) {
        if (!source.tables) continue;
        for (const tableInfo of source.tables) {
            const { table: { schema: tableSchema, name: tableName } } = tableInfo;
            
            const gqlTypeName = Object.keys(tableMappings).find(key => 
                tableMappings[key].schema === tableSchema && tableMappings[key].table === tableName
            );

            if (gqlTypeName) {
                const tablePermissions: Record<string, any> = {};

                if (tableInfo.select_permissions) {
                    const selectPermissions: Record<string, string[]> = {};
                    for (const perm of tableInfo.select_permissions) {
                        let columns = perm.permission.columns;
                        if (columns === '*') {
                            const tableGraphQLType = schemaTypes.find((t: any) => t.name === gqlTypeName);
                            if (tableGraphQLType && tableGraphQLType.fields) {
                                columns = tableGraphQLType.fields
                                    .filter((field: any) => {
                                        let type = field.type;
                                        while (type.ofType) {
                                            type = type.ofType;
                                        }
                                        return type.kind === 'SCALAR' || type.kind === 'ENUM';
                                    })
                                    .map((field: any) => field.name);
                            } else {
                                columns = ['*']; 
                            }
                        }
                        if (Array.isArray(columns)) {
                            selectPermissions[perm.role] = columns;
                        }
                    }
                    tablePermissions.select = selectPermissions;
                }

                if (Object.keys(tablePermissions).length > 0) {
                    permissions[gqlTypeName] = tablePermissions;
                }
            }
        }
    }
    debug(`✅ Permissions for ${Object.keys(permissions).length} tables identified.`);
    
    // Build compact generator schema from introspection
    const buildTypeString = (typeNode: any): string => {
      if (!typeNode) return '';
      if (typeNode.kind === 'NON_NULL') {
        return `${buildTypeString(typeNode.ofType)}!`;
      }
      if (typeNode.kind === 'LIST') {
        return `[${buildTypeString(typeNode.ofType)}]`;
      }
      return typeNode.name || '';
    };

    const unwrapBase = (typeNode: any): { name: string; kind: string } => {
      let t = typeNode;
      while (t && (t.kind === 'NON_NULL' || t.kind === 'LIST' || t.ofType)) {
        if (t.kind === 'NON_NULL' || t.kind === 'LIST') {
          t = t.ofType;
        } else if (t.ofType) {
          t = t.ofType;
        } else {
          break;
        }
      }
      return { name: t?.name || '', kind: t?.kind || '' };
    };

    const isListReturn = (typeNode: any): boolean => {
      let t = typeNode;
      while (t && t.kind === 'NON_NULL') t = t.ofType;
      return t?.kind === 'LIST';
    };

    const findType = (name: string) => schemaTypes.find((t: any) => t.name === name);

    const queryRootName = introspectionResult.data.__schema.queryType?.name;
    const mutationRootName = introspectionResult.data.__schema.mutationType?.name;
    const subscriptionRootName = introspectionResult.data.__schema.subscriptionType?.name;

    const extractRootFields = (rootTypeName?: string) => {
      if (!rootTypeName) return { fields: [] as any[] };
      const t = findType(rootTypeName);
      if (!t || !t.fields) return { fields: [] as any[] };
      return {
        fields: t.fields.map((f: any) => ({
          name: f.name,
          args: (f.args || []).map((a: any) => ({ name: a.name, gqlType: buildTypeString(a.type) })),
          returnType: unwrapBase(f.type),
        }))
      };
    };

    // Track which types we actually need for generator
    const neededTypes = new Set<string>();
    
    // Add root types to needed types
    if (queryRootName) neededTypes.add(queryRootName);
    if (mutationRootName) neededTypes.add(mutationRootName);
    if (subscriptionRootName) neededTypes.add(subscriptionRootName);

    // Collect types referenced by root fields
    const collectReferencedTypes = (rootFields: any[]) => {
      rootFields.forEach(field => {
        if (field.returnType?.name) {
          neededTypes.add(field.returnType.name);
        }
        field.args?.forEach((arg: any) => {
          // Parse arg type to find referenced types
          const argTypeStr = arg.gqlType;
          if (argTypeStr) {
            // Simple regex to extract type names from GraphQL type strings
            const typeMatches = argTypeStr.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
            if (typeMatches) {
              typeMatches.forEach(match => {
                if (!GRAPHQL_SCALAR_TYPES.has(match)) {
                  neededTypes.add(match);
                }
              });
            }
          }
        });
      });
    };

    // First pass: collect all types we need
    const queryFields = extractRootFields(queryRootName).fields;
    const mutationFields = extractRootFields(mutationRootName).fields;
    const subscriptionFields = extractRootFields(subscriptionRootName).fields;
    
    collectReferencedTypes(queryFields);
    collectReferencedTypes(mutationFields);
    collectReferencedTypes(subscriptionFields);

    // Second pass: recursively collect types referenced by collected types
    let changed = true;
    let iterations = 0;
    while (changed && iterations < 3) { // Prevent infinite loops
      changed = false;
      const newTypes = Array.from(neededTypes);
      
      for (const typeName of newTypes) {
        const type = findType(typeName);
        if (type && (type.kind === 'OBJECT' || type.kind === 'INTERFACE') && type.fields) {
          type.fields.forEach((field: any) => {
            const baseType = unwrapBase(field.type);
            if (baseType.name && !neededTypes.has(baseType.name)) {
              neededTypes.add(baseType.name);
              changed = true;
            }
            // Also check field args
            field.args?.forEach((arg: any) => {
              const argBaseType = unwrapBase(arg.type);
              if (argBaseType.name && !neededTypes.has(argBaseType.name)) {
                neededTypes.add(argBaseType.name);
                changed = true;
              }
            });
          });
        }
      }
      iterations++;
    }

    const extractObjectTypes = () => {
      const out: Record<string, any> = {};
      
      // Get base table types from tableMappings
      const tables = Object.keys(tableMappings);
      
      // Build MINIMAL types - store scalar fields + relations from introspection
      // prepareSchema will add aggregates and standard args at runtime
      for (const tableName of tables) {
        const t = findType(tableName);
        if (!t || (t.kind !== 'OBJECT' && t.kind !== 'INTERFACE')) continue;
        if (!t.fields) continue;
        
        // Store scalar fields + relation fields (OBJECT types that are also tables)
        out[tableName] = {
          kind: t.kind,
          fields: t.fields
            .filter((f: any) => {
              const baseType = unwrapBase(f.type);
              // Include: scalars, enums, and relations to other tables (but NOT aggregates or special types)
              if (baseType.kind === 'SCALAR' || baseType.kind === 'ENUM') return true;
              if (baseType.kind === 'OBJECT' && tables.includes(baseType.name)) return true; // This is a relation!
              return false;
            })
            .map((f: any) => {
              const baseType = unwrapBase(f.type);
              const isRelation = baseType.kind === 'OBJECT' && tables.includes(baseType.name);
              
              return {
                name: f.name,
                isList: isListReturn(f.type),
                // For relations, store minimal args (prepareSchema will add standard ones)
                args: isRelation ? [] : [],
                returnType: baseType,
              };
            })
        };
        
        // Store mutation_response types (needed for insert/update/delete)
        const mutationResponseType = findType(`${tableName}_mutation_response`);
        if (mutationResponseType && mutationResponseType.fields) {
          out[`${tableName}_mutation_response`] = {
            kind: mutationResponseType.kind,
            fields: mutationResponseType.fields.map((f: any) => ({
              name: f.name,
              isList: isListReturn(f.type),
              args: [],
              returnType: unwrapBase(f.type),
            }))
          };
        }
        
        // Store essential input types (for where, order_by, etc.)
        const inputTypes = [
          `${tableName}_bool_exp`,
          `${tableName}_insert_input`,
          `${tableName}_set_input`,
          `${tableName}_pk_columns_input`
        ];
        
        inputTypes.forEach(typeName => {
          const inputType = findType(typeName);
          if (inputType) {
            out[typeName] = {
              kind: inputType.kind,
              fields: [] // Empty - prepareSchema will handle these generically
            };
          }
        });
      }
      
      return out;
    };

    const compactGenerator = {
      roots: {
        query: extractRootFields(queryRootName),
        mutation: extractRootFields(mutationRootName),
        subscription: extractRootFields(subscriptionRootName),
      },
      types: extractObjectTypes(),
    };

    // Store MINIMAL schema - prepareSchema in generator will enrich it at runtime
    // We only store the absolutely essential data from the full schema
    const minimalGenerator = {
      roots: {
        query: extractRootFields(queryRootName),
        mutation: extractRootFields(mutationRootName),
        subscription: extractRootFields(subscriptionRootName),
      },
      types: extractObjectTypes(),
    };

    // Compose minimal hasyx payload - prepareSchema will expand this at runtime
    const compactPayload = {
      hasyx: {
      tableMappings,
      permissions,
        generator: minimalGenerator,
      timestamp: new Date().valueOf(),
        version: "3.0.0"
      }
    };

    const jsonContent = JSON.stringify(compactPayload, null, 2);

    // Ensure directories exist
    fs.ensureDirSync(PUBLIC_OUTPUT_DIR);
    fs.ensureDirSync(APP_OUTPUT_DIR);

    // Save schema to public directory (for HTTP access)
    debug(`💾 Saving schema to public directory: ${PUBLIC_OUTPUT_PATH}...`);
    fs.writeFileSync(PUBLIC_OUTPUT_PATH, jsonContent);

    // Save schema to app/hasyx directory (for native import)
    debug(`💾 Saving schema to app directory: ${APP_OUTPUT_PATH}...`);
    fs.writeFileSync(APP_OUTPUT_PATH, jsonContent);

    debug(`✅ Schema successfully retrieved and saved to both directories`);
    debug(`📊 Table mappings included in schema file (${Object.keys(tableMappings).length} tables identified)`);
    console.log(`✅ Hasura schema saved to:`);
    console.log(`   📄 ${PUBLIC_OUTPUT_PATH} (for HTTP access)`);
    console.log(`   📄 ${APP_OUTPUT_PATH} (for native import)`);
  } catch (error: any) {
    throw new Error('❌ Error retrieving or saving schema:' + (error.response?.data || error.message || error));
  }
}

export { fetchSchema as generateHasuraSchema };

// Run schema generation if this file is executed directly
if (require.main === module) {
  fetchSchema();
} 
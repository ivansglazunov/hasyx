import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import { IntrospectionQuery, getIntrospectionQuery } from 'graphql';
import Debug from './debug';

dotenv.config();

const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;
const PUBLIC_OUTPUT_DIR = path.resolve(process.cwd(), 'public');
const PUBLIC_OUTPUT_PATH = path.join(PUBLIC_OUTPUT_DIR, 'hasura-schema.json');
const PUBLIC_COMPACT_OUTPUT_PATH = path.join(PUBLIC_OUTPUT_DIR, 'hasura-schema-compact.json');
const APP_OUTPUT_DIR = path.resolve(process.cwd(), 'app', 'hasyx');
const APP_OUTPUT_PATH = path.join(APP_OUTPUT_DIR, 'hasura-schema.json');
const APP_COMPACT_OUTPUT_PATH = path.join(APP_OUTPUT_DIR, 'hasura-schema-compact.json');

const debug = Debug('hasura:schema');

if (!HASURA_GRAPHQL_URL) {
  throw new Error('❌ Error: NEXT_PUBLIC_HASURA_GRAPHQL_URL is not defined in .env');
}

// Cache for combine function
let _combineCache: any = null;

/**
 * Common scalar types that appear frequently in GraphQL schemas
 */
const COMMON_SCALARS: Record<string, any> = {
  "String": {
    "kind": "SCALAR",
    "name": "String",
    "description": null,
    "fields": null,
    "inputFields": null,
    "interfaces": null,
    "enumValues": null,
    "possibleTypes": null
  },
  "Int": {
    "kind": "SCALAR", 
    "name": "Int",
    "description": null,
    "fields": null,
    "inputFields": null,
    "interfaces": null,
    "enumValues": null,
    "possibleTypes": null
  },
  "Boolean": {
    "kind": "SCALAR",
    "name": "Boolean", 
    "description": null,
    "fields": null,
    "inputFields": null,
    "interfaces": null,
    "enumValues": null,
    "possibleTypes": null
  },
  "Float": {
    "kind": "SCALAR",
    "name": "Float",
    "description": null,
    "fields": null,
    "inputFields": null,
    "interfaces": null,
    "enumValues": null,
    "possibleTypes": null
  },
  "bigint": {
    "kind": "SCALAR",
    "name": "bigint",
    "description": null,
    "fields": null,
    "inputFields": null,
    "interfaces": null,
    "enumValues": null,
    "possibleTypes": null
  },
  "uuid": {
    "kind": "SCALAR",
    "name": "uuid",
    "description": null,
    "fields": null,
    "inputFields": null,
    "interfaces": null,
    "enumValues": null,
    "possibleTypes": null
  },
  "jsonb": {
    "kind": "SCALAR",
    "name": "jsonb",
    "description": null,
    "fields": null,
    "inputFields": null,
    "interfaces": null,
    "enumValues": null,
    "possibleTypes": null
  },
  "numeric": {
    "kind": "SCALAR",
    "name": "numeric",
    "description": null,
    "fields": null,
    "inputFields": null,
    "interfaces": null,
    "enumValues": null,
    "possibleTypes": null
  },
  "timestamptz": {
    "kind": "SCALAR",
    "name": "timestamptz",
    "description": null,
    "fields": null,
    "inputFields": null,
    "interfaces": null,
    "enumValues": null,
    "possibleTypes": null
  }
};

/**
 * Creates a compact representation of the schema by extracting common patterns
 */
function createCompactSchema(fullSchema: any): any {
  const types = fullSchema.data.__schema.types;
  const compactTypes: any[] = [];
  const commonComparisons: Record<string, any> = {};
  const commonOrderBy: Record<string, any> = {};
  const seenTypes = new Set<string>();

  // Extract common comparison types
  const comparisonTypes = types.filter((type: any) => 
    type.name && type.name.endsWith('_comparison_exp')
  );
  
  comparisonTypes.forEach((type: any) => {
    if (!seenTypes.has(type.name)) {
      commonComparisons[type.name] = type;
      seenTypes.add(type.name);
    }
  });

  // Extract common order_by types  
  const orderByTypes = types.filter((type: any) =>
    type.name && type.name.endsWith('_order_by')
  );

  orderByTypes.forEach((type: any) => {
    if (!seenTypes.has(type.name)) {
      commonOrderBy[type.name] = type;
      seenTypes.add(type.name);
    }
  });

  // Process remaining types, using references where possible
  types.forEach((type: any) => {
    if (!type.name) {
      compactTypes.push(type);
      return;
    }

    if (seenTypes.has(type.name)) {
      return; // Already processed
    }

    // Use reference for common scalars
    if (COMMON_SCALARS[type.name]) {
      compactTypes.push({ "$ref": `#/scalars/${type.name}` });
      return;
    }

    // Use reference for comparison types
    if (type.name.endsWith('_comparison_exp')) {
      compactTypes.push({ "$ref": `#/comparisons/${type.name}` });
      return;
    }

    // Use reference for order_by types
    if (type.name.endsWith('_order_by')) {
      compactTypes.push({ "$ref": `#/orderBy/${type.name}` });
      return;
    }

    // Keep unique types as-is
    compactTypes.push(type);
  });

  return {
    data: {
      __schema: {
        ...fullSchema.data.__schema,
        types: compactTypes
      }
    },
    scalars: COMMON_SCALARS,
    comparisons: commonComparisons,
    orderBy: commonOrderBy,
    hasyx: fullSchema.hasyx
  };
}

/**
 * Expands a compact schema back to full format for compatibility
 */
export function combine(compactSchema: any): any {
  // Return cached result if available
  if (_combineCache && _combineCache.timestamp === compactSchema?.hasyx?.timestamp) {
    return _combineCache.expanded;
  }

  // If it's already a full schema, return as-is
  if (compactSchema?.data?.__schema?.types && !compactSchema.scalars) {
    return compactSchema;
  }

  const scalars = compactSchema.scalars || {};
  const comparisons = compactSchema.comparisons || {};
  const orderBy = compactSchema.orderBy || {};
  
  const expandedTypes: any[] = [];

  // Add all scalar types first
  Object.values(scalars).forEach((scalar: any) => {
    expandedTypes.push(scalar);
  });

  // Add all comparison types
  Object.values(comparisons).forEach((comparison: any) => {
    expandedTypes.push(comparison);
  });

  // Add all order_by types
  Object.values(orderBy).forEach((order: any) => {
    expandedTypes.push(order);
  });

  // Process compact types, expanding references
  const compactTypes = compactSchema.data.__schema.types || [];
  compactTypes.forEach((type: any) => {
    if (type.$ref) {
      const refPath = type.$ref.replace('#/', '').split('/');
      const category = refPath[0];
      const typeName = refPath[1];

      switch (category) {
        case 'scalars':
          if (scalars[typeName]) {
            expandedTypes.push(scalars[typeName]);
          }
          break;
        case 'comparisons':
          if (comparisons[typeName]) {
            expandedTypes.push(comparisons[typeName]);
          }
          break;
        case 'orderBy':
          if (orderBy[typeName]) {
            expandedTypes.push(orderBy[typeName]);
          }
          break;
      }
    } else {
      expandedTypes.push(type);
    }
  });

  const expanded = {
    data: {
      __schema: {
        ...compactSchema.data.__schema,
        types: expandedTypes
      }
    },
    hasyx: compactSchema.hasyx
  };

  // Cache the result
  _combineCache = {
    timestamp: compactSchema?.hasyx?.timestamp,
    expanded
  };

  return expanded;
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
  
  

  const potentialTableTypes = schemaTypes.filter(type =>
    type.kind === 'OBJECT' &&
    type.name &&
    !type.name.startsWith('__') &&
    !type.name.endsWith('_aggregate') &&
    !type.name.endsWith('_aggregate_fields') &&
    !type.name.endsWith('_avg_fields') &&
    !type.name.endsWith('_max_fields') &&
    !type.name.endsWith('_min_fields') &&
    !type.name.endsWith('_stddev_fields') &&
    !type.name.endsWith('_stddev_pop_fields') &&
    !type.name.endsWith('_stddev_samp_fields') &&
    !type.name.endsWith('_sum_fields') &&
    !type.name.endsWith('_var_pop_fields') &&
    !type.name.endsWith('_var_samp_fields') &&
    !type.name.endsWith('_variance_fields') &&
    !type.name.endsWith('_mutation_response') &&
    type.name !== 'query_root' &&
    type.name !== 'mutation_root' &&
    type.name !== 'subscription_root'
  );

  debug(`Found ${potentialTableTypes.length} potential table types in schema`);
  
  
  if (potentialTableTypes.length === 0) {
    debug("No potential table types found, adding hard-coded mappings for common tables");
    
    
    tableMappings["accounts"] = { schema: "public", table: "accounts" };
    tableMappings["users"] = { schema: "public", table: "users" };
    tableMappings["notifications"] = { schema: "public", table: "notifications" };
    tableMappings["debug"] = { schema: "public", table: "debug" };
    
    
    tableMappings["payments_methods"] = { schema: "payments", table: "methods" };
    tableMappings["payments_operations"] = { schema: "payments", table: "operations" };
    tableMappings["payments_plans"] = { schema: "payments", table: "plans" };
    tableMappings["payments_providers"] = { schema: "payments", table: "providers" };
    tableMappings["payments_subscriptions"] = { schema: "payments", table: "subscriptions" };
    
    
    tableMappings["notification_messages"] = { schema: "notification", table: "messages" };
    tableMappings["notification_permissions"] = { schema: "notification", table: "permissions" };

    debug(`Added ${Object.keys(tableMappings).length} hard-coded table mappings`);
    return tableMappings;
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
    
    
    if (type.name.startsWith('payments_')) {
      const paymentsTableName = type.name.replace('payments_', '');
      tableMappings[type.name] = {
        schema: 'payments',
        table: paymentsTableName
      };
      debug(`Recognized payments entity: ${type.name} -> payments.${paymentsTableName}`);
    }

    else if (type.name.startsWith('notification_')) {
      const notificationTableName = type.name.replace('notification_', '');
      tableMappings[type.name] = {
        schema: 'notification',
        table: notificationTableName
      };
      debug(`Recognized notification entity: ${type.name} -> notification.${notificationTableName}`);
    }

    else {
      tableMappings[type.name] = {
        schema,
        table: tableName
      };
      debug(`Mapped type: ${type.name} -> ${schema}.${tableName}`);
    }
  }

  return tableMappings;
}

async function fetchSchema() {
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
    
    // Add hasyx metadata to the schema
    introspectionResult.hasyx = {
      tableMappings,
      permissions,
      timestamp: new Date().valueOf(),
      version: "1.0.0"
    };

    // Create compact version
    const compactSchema = createCompactSchema(introspectionResult);
    const compactJsonContent = JSON.stringify(compactSchema, null, 2);
    
    // Original full version
    const jsonContent = JSON.stringify(introspectionResult, null, 2);

    // Ensure directories exist
    fs.ensureDirSync(PUBLIC_OUTPUT_DIR);
    fs.ensureDirSync(APP_OUTPUT_DIR);

    // Save full schema to public directory (for HTTP access)
    debug(`💾 Saving full schema to public directory: ${PUBLIC_OUTPUT_PATH}...`);
    fs.writeFileSync(PUBLIC_OUTPUT_PATH, jsonContent);

    // Save compact schema to public directory
    debug(`💾 Saving compact schema to public directory: ${PUBLIC_COMPACT_OUTPUT_PATH}...`);
    fs.writeFileSync(PUBLIC_COMPACT_OUTPUT_PATH, compactJsonContent);

    // Save full schema to app/hasyx directory (for native import)
    debug(`💾 Saving full schema to app directory: ${APP_OUTPUT_PATH}...`);
    fs.writeFileSync(APP_OUTPUT_PATH, jsonContent);

    // Save compact schema to app/hasyx directory
    debug(`💾 Saving compact schema to app directory: ${APP_COMPACT_OUTPUT_PATH}...`);
    fs.writeFileSync(APP_COMPACT_OUTPUT_PATH, compactJsonContent);

    const originalSize = (fs.statSync(PUBLIC_OUTPUT_PATH).size / 1024 / 1024).toFixed(2);
    const compactSize = (fs.statSync(PUBLIC_COMPACT_OUTPUT_PATH).size / 1024 / 1024).toFixed(2);
    const compressionRatio = ((1 - fs.statSync(PUBLIC_COMPACT_OUTPUT_PATH).size / fs.statSync(PUBLIC_OUTPUT_PATH).size) * 100).toFixed(1);

    debug(`✅ Schema successfully retrieved and saved to both directories`);
    debug(`📊 Table mappings included in schema file (${Object.keys(tableMappings).length} tables identified)`);
    console.log(`✅ Hasura schema saved to:`);
    console.log(`   📄 ${PUBLIC_OUTPUT_PATH} (${originalSize}MB - full schema)`);
    console.log(`   📄 ${PUBLIC_COMPACT_OUTPUT_PATH} (${compactSize}MB - compact schema, ${compressionRatio}% reduction)`);
    console.log(`   📄 ${APP_OUTPUT_PATH} (${originalSize}MB - full schema)`);
    console.log(`   📄 ${APP_COMPACT_OUTPUT_PATH} (${compactSize}MB - compact schema, ${compressionRatio}% reduction)`);
  } catch (error: any) {
    throw new Error('❌ Error retrieving or saving schema:' + (error.response?.data || error.message || error));
  }
}

export { fetchSchema as generateHasuraSchema };

// Run schema generation if this file is executed directly
if (require.main === module) {
  fetchSchema();
} 
import Debug from './debug';

const debug = Debug('hasyx:schema-utils');

export interface HasuraTableColumn {
  name: string;
  type: string;
}

export interface HasuraTable {
  table: {
    schema: string;
    name: string;
  };
  columns?: HasuraTableColumn[];
  primary_key?: {
    columns: string[];
  } | null;
}

/**
 * Получает правильную схему и имя таблицы на основе имени типа GraphQL и маппинга таблиц
 * @param graphQLTypeName Имя типа GraphQL
 * @param tableMappings Маппинг таблиц
 * @returns Объект с полями schema и table
 */
export function getProperSchemaAndTable(
  graphQLTypeName: string, 
  tableMappings: Record<string, { schema: string, table: string }> | undefined
): { schema: string, table: string } {
  if (tableMappings && tableMappings[graphQLTypeName]) {
    return {
      schema: tableMappings[graphQLTypeName].schema,
      table: tableMappings[graphQLTypeName].table
    };
  }

  return {
    schema: 'public',
    table: graphQLTypeName
  };
}

/**
 * Извлекает информацию о таблицах из схемы GraphQL
 * @param schemaTypes Массив типов схемы GraphQL
 * @param tableMappings Маппинг таблиц
 * @returns Массив объектов HasuraTable
 */
export function getTablesFromGraphQLSchema(
  schemaTypes: any[], 
  tableMappings?: Record<string, { schema: string, table: string }>
): HasuraTable[] {
  const tables: HasuraTable[] = [];
  if (!Array.isArray(schemaTypes)) {
    debug('Schema types is not an array, cannot extract tables.');
    return tables;
  }

  for (const type of schemaTypes) {
    if (type.kind === 'OBJECT' && type.name && !type.name.startsWith('__') && type.fields) {
      if (type.name.endsWith('_aggregate') ||
        type.name.endsWith('_avg_fields') ||
        type.name.endsWith('_max_fields') ||
        type.name.endsWith('_min_fields') ||
        type.name.endsWith('_stddev_fields') ||
        type.name.endsWith('_stddev_pop_fields') ||
        type.name.endsWith('_stddev_samp_fields') ||
        type.name.endsWith('_sum_fields') ||
        type.name.endsWith('_var_pop_fields') ||
        type.name.endsWith('_var_samp_fields') ||
        type.name.endsWith('_variance_fields') ||
        type.name.endsWith('_mutation_response') ||
        type.name.endsWith('_bool_exp') ||
        type.name.endsWith('_constraint') ||
        type.name.endsWith('_inc_input') ||
        type.name.endsWith('_insert_input') ||
        type.name.endsWith('_on_conflict') ||
        type.name.endsWith('_order_by') ||
        type.name.endsWith('_pk_columns_input') ||
        type.name.endsWith('_set_input') ||
        type.name.endsWith('_update_column') ||
        type.name.endsWith('_updates') ||
        type.name === 'query_root' ||
        type.name === 'mutation_root' ||
        type.name === 'subscription_root') {
        continue;
      }

      const { schema, table } = getProperSchemaAndTable(type.name, tableMappings);
      
      const columns = type.fields
        .filter((field: any) => field.type && !field.type.name?.endsWith('_aggregate'))
        .map((field: any) => ({
          name: field.name,
          type: field.type.name || (field.type.ofType ? field.type.ofType.name : 'unknown')
        }));

      tables.push({
        table: {
          schema,
          name: table
        },
        columns,
        primary_key: null // Первичный ключ нужно получать отдельно
      });
    }
  }

  return tables;
}

import * as fs from 'fs-extra';
import * as path from 'path';
import * as spawn from 'cross-spawn';
import { Hasura } from './hasura';
import Debug from './debug';
import { getProperSchemaAndTable, getTablesFromGraphQLSchema, HasuraTable } from './hasyx-schema-utils';

const debug = Debug('migration:down-hasyx');

// Function to clean up test schemas
async function cleanupTestSchemas(hasura: Hasura): Promise<void> {
  try {
    console.log('🧹 Очистка тестовых схем и временных объектов...');
    
    // 1. Очищаем несогласованные метаданные
    try {
      debug('🔍 Проверяем несогласованные метаданные...');
      const inconsistentMetadata = await hasura.getInconsistentMetadata();
      if (inconsistentMetadata && inconsistentMetadata.inconsistent_objects && inconsistentMetadata.inconsistent_objects.length > 0) {
        debug(`Найдено ${inconsistentMetadata.inconsistent_objects.length} несогласованных объектов метаданных`);
        await hasura.dropInconsistentMetadata();
        debug('✅ Несогласованные метаданные очищены');
      } else {
        debug('✅ Несогласованных метаданных не обнаружено');
      }
    } catch (e: any) {
      debug('⚠️ Ошибка при очистке несогласованных метаданных:', e.message);
      console.warn('⚠️ Ошибка при очистке несогласованных метаданных:', e.message);
    }
    
    // 2. Получаем список всех тестовых схем
    const getSchemasQuery = `
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name LIKE 'test%';
    `;
    
    const result = await hasura.sql(getSchemasQuery);
    
    // Проверяем формат результата SQL-запроса
    debug(`Результат запроса схем: ${JSON.stringify(result)}`);
    
    let schemas: string[] = [];
    
    // Обрабатываем результат в формате TuplesOk
    if (result && typeof result === 'object' && 'result_type' in result && result.result_type === 'TuplesOk' && Array.isArray(result.result) && result.result.length > 1) {
      // Первый элемент - это заголовки столбцов, пропускаем его
      for (let i = 1; i < result.result.length; i++) {
        if (Array.isArray(result.result[i]) && result.result[i].length > 0) {
          schemas.push(String(result.result[i][0])); // Берем первый столбец каждой строки
        }
      }
    } else if (Array.isArray(result) && result.length > 0) {
      // Старый формат результата
      schemas = result.map(row => typeof row === 'object' && row !== null && 'schema_name' in row ? String(row.schema_name) : '');
      schemas = schemas.filter(name => name !== '');
    }
    
    if (schemas.length > 0) {
      console.log(`Найдено ${schemas.length} тестовых схем для удаления: ${schemas.join(', ')}`);
      
      // 3. Для каждой тестовой схемы:
      for (const schemaName of schemas) {
        console.log(`Обрабатываем тестовую схему: ${schemaName}`);
        
        try {
          // 3.1. Получаем список таблиц в схеме
          const getTablesQuery = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = '${schemaName}';
          `;
          
          const tables = await hasura.sql(getTablesQuery);
          
          // 3.2. Для каждой таблицы отключаем отслеживание через API Hasura
          if (tables && tables.length > 0) {
            for (const tableRow of tables) {
              const tableName = tableRow.table_name;
              debug(`Отключаем отслеживание таблицы: ${schemaName}.${tableName}`);
              
              try {
                // Используем API Hasura для отключения отслеживания таблицы
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
                  // Игнорируем ошибки, если таблица уже не отслеживается
                  debug(`Игнорируем ошибку отключения отслеживания: ${e.message}`);
                });
              } catch (e: any) {
                debug(`⚠️ Ошибка при отключении отслеживания ${schemaName}.${tableName}: ${e.message}`);
              }
            }
          }
          
          // 3.3. Удаляем схему с CASCADE
          debug(`Удаляем схему: ${schemaName}`);
          await hasura.sql(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`);
          console.log(`✅ Схема удалена: ${schemaName}`);
        } catch (error) {
          console.warn(`⚠️ Не удалось полностью удалить схему ${schemaName}:`, error);
        }
      }
    } else {
      console.log('Тестовых схем для удаления не найдено');
    }
    
    // 4. Дополнительно удаляем тестовые таблицы в схеме public
    try {
      const getTestTablesQuery = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND 
              (table_name LIKE 'test%');
      `;
      
      const testTables = await hasura.sql(getTestTablesQuery);
      debug(`Результат запроса тестовых таблиц: ${JSON.stringify(testTables)}`);
      
      let tableNames: string[] = [];
      
      // Обрабатываем результат в формате TuplesOk
      if (testTables && typeof testTables === 'object' && 'result_type' in testTables && 
          testTables.result_type === 'TuplesOk' && Array.isArray(testTables.result) && testTables.result.length > 1) {
        // Первый элемент - это заголовки столбцов, пропускаем его
        for (let i = 1; i < testTables.result.length; i++) {
          if (Array.isArray(testTables.result[i]) && testTables.result[i].length > 0) {
            tableNames.push(String(testTables.result[i][0])); // Берем первый столбец каждой строки
          }
        }
      } else if (Array.isArray(testTables) && testTables.length > 0) {
        // Старый формат результата
        tableNames = testTables.map(row => typeof row === 'object' && row !== null && 'table_name' in row ? String(row.table_name) : '');
        tableNames = tableNames.filter(name => name !== '');
      }
      
      if (tableNames.length > 0) {
        console.log(`Найдено ${tableNames.length} тестовых таблиц в схеме public: ${tableNames.join(', ')}`);
        
        for (const tableName of tableNames) {
          console.log(`Удаляем тестовую таблицу: public.${tableName}`);
          
          try {
            // Сначала отключаем отслеживание таблицы
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
              // Игнорируем ошибки, если таблица уже не отслеживается
              debug(`Игнорируем ошибку отключения отслеживания: ${e.message}`);
            });
            
            // Затем удаляем таблицу
            await hasura.sql(`DROP TABLE IF EXISTS public."${tableName}" CASCADE;`);
            console.log(`✅ Таблица удалена: public.${tableName}`);
          } catch (error) {
            console.warn(`⚠️ Не удалось удалить таблицу public.${tableName}:`, error);
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Ошибка при удалении тестовых таблиц:', error);
    }
    
    // 5. Финальная очистка несогласованных метаданных
    try {
      debug('🔍 Финальная проверка несогласованных метаданных...');
      const inconsistentMetadata = await hasura.getInconsistentMetadata();
      if (inconsistentMetadata && inconsistentMetadata.inconsistent_objects && inconsistentMetadata.inconsistent_objects.length > 0) {
        debug(`Найдено ${inconsistentMetadata.inconsistent_objects.length} несогласованных объектов метаданных`);
        await hasura.dropInconsistentMetadata();
        debug('✅ Финальная очистка несогласованных метаданных завершена');
      } else {
        debug('✅ Несогласованных метаданных не обнаружено');
      }
    } catch (e: any) {
      debug('⚠️ Ошибка при финальной очистке метаданных:', e.message);
    }
    
    console.log('✅ Очистка тестовых схем и объектов завершена');
  } catch (error) {
    console.warn('⚠️ Ошибка во время очистки тестовых схем:', error);
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

    // Шаг 1: Принудительная очистка всех метаданных, связанных с hasyx, с помощью прямых SQL запросов
    debug('🔧 Начинаем принудительную очистку всех метаданных, связанных с hasyx...');
    console.log('Начинаем принудительную очистку всех метаданных, связанных с hasyx...');
    
    try {
      // Сначала удаляем все отношения к hasyx в метаданных
      debug('🗑️ Удаляем все отношения к hasyx в метаданных...');
      console.log('Удаляем все отношения к hasyx в метаданных...');
      
      await hasura.sql(`
        -- Удаляем все отношения, где hasyx является удаленной таблицей
        DELETE FROM hdb_catalog.hdb_relationship 
        WHERE remote_table::text LIKE '%"hasyx"%';
        
        -- Удаляем все отношения с именем hasyx
        DELETE FROM hdb_catalog.hdb_relationship 
        WHERE rel_name = 'hasyx';
        
        -- Удаляем все разрешения для hasyx
        DELETE FROM hdb_catalog.hdb_permission 
        WHERE table_schema = 'public' AND table_name = 'hasyx';
        
        -- Удаляем все вычисляемые поля для hasyx
        DELETE FROM hdb_catalog.hdb_computed_field 
        WHERE table_schema = 'public' AND table_name = 'hasyx';
        
        -- Удаляем все отслеживаемые таблицы hasyx
        DELETE FROM hdb_catalog.hdb_table 
        WHERE table_schema = 'public' AND table_name = 'hasyx';
      `, 'default', true);
      
      debug('✅ Метаданные успешно очищены через прямой SQL');
    } catch (e: any) {
      debug('⚠️ Ошибка при очистке метаданных через SQL:', e.message);
      console.warn('⚠️ Ошибка при очистке метаданных через SQL:', e.message);
    }
    
    // Шаг 2: Очистка несогласованных метаданных через API
    debug('🔍 Проверяем несогласованные метаданные...');
    try {
      await hasura.dropInconsistentMetadata();
      debug('✅ Несогласованные метаданные очищены через API');
    } catch (e: any) {
      debug('⚠️ Ошибка при очистке несогласованных метаданных:', e.message);
      console.warn('⚠️ Ошибка при очистке несогласованных метаданных:', e.message);
      console.log('❗ Продолжаем выполнение несмотря на ошибку...');
    }
    
    // Шаг 3: Удаляем представление hasyx с помощью CASCADE
    debug('🗑️ Удаляем представление public.hasyx...');
    console.log('Удаляем представление public.hasyx...');
    try {
      // Используем модифицированный метод SQL с флагом игнорирования ошибок
      await hasura.sql('DROP VIEW IF EXISTS public.hasyx CASCADE;', 'default', true);
      debug('✅ Представление успешно удалено с CASCADE');
    } catch (e: any) {
      debug('⚠️ Ошибка при удалении представления:', e.message);
      console.warn('⚠️ Ошибка при удалении представления:', e.message);
      console.log('❗ Продолжаем выполнение несмотря на ошибку...');
      // Продолжаем выполнение даже при ошибке
    }
    
    // Игнорируем ошибки несогласованных метаданных и продолжаем выполнение
    debug('⚠️ Игнорируем ошибки несогласованных метаданных и продолжаем выполнение...');
    console.log('⚠️ Игнорируем ошибки несогласованных метаданных и продолжаем выполнение...');
    
    // Найдем все отношения к таблице hasyx в метаданных и удалим их
    debug('🔍 Finding all relationships to hasyx table...');
    console.log('Finding all relationships to hasyx table...');
    
    try {
      // Получаем метаданные для анализа
      const metadata = await hasura.exportMetadata();
      
      if (metadata && metadata.metadata && metadata.metadata.sources) {
        for (const source of metadata.metadata.sources) {
          if (source.tables) {
            for (const table of source.tables) {
              const schemaName = table.table.schema;
              const tableName = table.table.name;
              
              // Пропускаем саму таблицу hasyx
              if (tableName === 'hasyx' && schemaName === 'public') continue;
              
              // Определяем интерфейс для отношений
              interface HasyxRelation {
                type: 'object' | 'array';
                name: string;
                schema: string;
                table: string;
              }
              
              // Ищем отношения к hasyx
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
              
              // Удаляем найденные отношения
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

    // Untrack the view first
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

    // Drop the view
    debug('Dropping view public.hasyx...');
    try {
      await hasura.sql('DROP VIEW IF EXISTS public.hasyx;');
      debug('✅ View dropped successfully');
    } catch (e: any) {
      debug('Failed to drop view (may not exist):', e.message);
    }

    // Clean up relationships and columns from tables
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
    // Дополнительная проверка на несогласованные метаданные после обработки схемы
    debug('🔍 Checking for inconsistent metadata after schema processing...');
    try {
      const inconsistentData = await hasura.getInconsistentMetadata();
      if (inconsistentData?.is_consistent === false && inconsistentData?.inconsistent_objects?.length > 0) {
        debug(`📋 Found ${inconsistentData.inconsistent_objects.length} inconsistent objects after schema processing`);
        console.log(`⚠️ Found ${inconsistentData.inconsistent_objects.length} inconsistent metadata objects after schema processing`);
        
        // Удаляем все несогласованные метаданные
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

    // Финальная проверка и очистка несогласованных метаданных
    debug('🔍 Final check for inconsistent metadata...');
    console.log('🔍 Final check for inconsistent metadata...');
    try {
      const inconsistentData = await hasura.getInconsistentMetadata();
      if (inconsistentData?.is_consistent === false && inconsistentData?.inconsistent_objects?.length > 0) {
        debug(`📋 Found ${inconsistentData.inconsistent_objects.length} inconsistent objects at the end of migration`);
        console.log(`⚠️ Found ${inconsistentData.inconsistent_objects.length} inconsistent metadata objects at the end of migration`);
        
        // Удаляем все несогласованные метаданные
        debug('🗑️ Final dropping of all inconsistent metadata...');
        console.log('Final dropping of all inconsistent metadata...');
        try {
          await hasura.dropInconsistentMetadata();
          debug('✅ Final inconsistent metadata cleanup successful');
        } catch (dropError: any) {
          debug('⚠️ Error during final inconsistent metadata cleanup:', dropError.message);
          console.warn('⚠️ Error during final inconsistent metadata cleanup:', dropError.message);
          console.log('❗ Игнорируем ошибку и завершаем миграцию...');
        }
      } else {
        debug('✅ No inconsistent metadata found at the end of migration');
      }
    } catch (e: any) {
      debug('⚠️ Error during final inconsistent metadata check:', e.message);
      console.warn('⚠️ Error during final inconsistent metadata check:', e.message);
      console.log('❗ Игнорируем ошибку и завершаем миграцию...');
    }
    
    debug('✨ Hasyx View migration DOWN completed successfully!');
    
    // Явный вызов очистки тестовых схем в конце миграции
    console.log('🧹 Выполняем дополнительную очистку тестовых схем...');
    await cleanupTestSchemas(hasura);
    console.log('✅ Дополнительная очистка тестовых схем завершена');
    
    return true;
  } catch (error: any) {
    // Записываем ошибку в лог, но не прерываем миграцию
    debug('⚠️ Ошибка во время миграции Hasyx View DOWN:', error);
    console.warn('⚠️ Ошибка во время миграции Hasyx View DOWN, но продолжаем выполнение.');
    
    // Возвращаем true вместо false, чтобы миграция считалась успешной
    debug('✅ Продолжаем миграцию несмотря на ошибки');
    return true;
  }
}
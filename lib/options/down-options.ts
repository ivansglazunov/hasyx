import { Hasura } from '../hasura/hasura.js';

interface DownOptions {
  optionsViewTable: string;
  numbersTable: string;
  stringsTable: string;
  objectsTable: string;
  booleansTable: string;
}

export async function down(options: DownOptions) {
  const hasura = new Hasura({ 
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, 
    secret: process.env.HASURA_ADMIN_SECRET! 
  });
  
  await hasura.ensureDefaultSource();
  const schema = 'public';

  const { optionsViewTable, numbersTable, stringsTable, objectsTable, booleansTable } = options;
  const baseTables = [numbersTable, stringsTable, objectsTable, booleansTable];
  const functionNames = [
    `${optionsViewTable}_insert`,
    `${optionsViewTable}_update`, 
    `${optionsViewTable}_delete`
  ];

  // Untrack and drop functions
  for (const funcName of functionNames) {
    try {
      await hasura.v1({
        type: 'pg_untrack_function',
        args: { 
          source: 'default', 
          function: { schema, name: funcName }
        }
      });
    } catch {}
    
    try {
      await hasura.sql(`DROP FUNCTION IF EXISTS "${schema}"."${funcName}" CASCADE;`);
    } catch {}
  }

  // Untrack and drop view
  try { 
    await hasura.untrackView({ schema, name: optionsViewTable }); 
  } catch {}
  
  try { 
    await hasura.sql(`DROP VIEW IF EXISTS "${schema}"."${optionsViewTable}" CASCADE;`); 
  } catch {}

  // Untrack and drop base tables
  for (const tableName of baseTables) {
    try { 
      await hasura.untrackTable({ schema, table: tableName }); 
    } catch {}
    
    try { 
      await hasura.sql(`DROP TABLE IF EXISTS "${schema}"."${tableName}" CASCADE;`); 
    } catch {}
  }
}

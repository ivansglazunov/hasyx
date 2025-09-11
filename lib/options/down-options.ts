import { Hasura } from '../hasura/hasura';
import Debug from '../debug';

const debug = Debug('migration:down-options');

export interface OptionsDownParams {
  schema?: string;
  optionsTable: string;
}

export async function down(params: OptionsDownParams, customHasura?: Hasura) {
  const {
    schema = 'public',
    optionsTable,
  } = params;

  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.ensureDefaultSource();

  debug(`🚀 Starting Hasura Options migration DOWN for schema: ${schema}`);

  // Drop validation trigger functions
  const triggerFunctions = [
    `${optionsTable}_validate`,
    `${optionsTable}_set_user_id`
  ];

  for (const funcName of triggerFunctions) {
    try {
      debug(`🗑️ Dropping trigger function ${funcName}...`);
      await hasura.undefine({ kind: 'function', schema, name: funcName });
      debug(`✅ Dropped trigger function ${funcName}`);
    } catch (e) {
      debug(`⚠️ Could not drop trigger function ${funcName}: ${e}`);
    }
  }

  // Untrack and drop table
  try {
    debug(`🗑️ Untracking table ${optionsTable}...`);
    await hasura.untrackTable({ schema, table: optionsTable });
    debug(`✅ Untracked table ${optionsTable}`);
  } catch (e) {
    debug(`⚠️ Could not untrack table ${optionsTable}: ${e}`);
  }

  try {
    debug(`🗑️ Dropping table ${optionsTable}...`);
    await hasura.deleteTable({ schema, table: optionsTable, cascade: true });
    debug(`✅ Dropped table ${optionsTable}`);
  } catch (e) {
    debug(`⚠️ Could not drop table ${optionsTable}: ${e}`);
  }

  debug('✨ All DOWN migrations executed successfully!');
}

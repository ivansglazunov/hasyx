import dotenv from 'dotenv';
import Debug from 'hasyx/lib/debug';
import { Hasura } from 'hasyx/lib/hasura/hasura';
import { up as upGroups } from 'hasyx/lib/groups/up-groups';

dotenv.config();

const debug = Debug('migration:1756045271995-groups:up');

async function up() {
  debug('🚀 Executing groups UP migration...');
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  await upGroups(hasura);
  debug('✅ groups UP migration executed.');
}

up().catch((e) => {
  console.error('❌ groups UP failed:', e);
  process.exit(1);
});



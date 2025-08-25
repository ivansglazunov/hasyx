import dotenv from 'dotenv';
import Debug from '../../lib/debug';
import { Hasura } from '../../lib/hasura/hasura';
import { down as downGroups } from '../../lib/groups/down-groups';

dotenv.config();

const debug = Debug('migration:1756045271995-groups:down');

async function down() {
  debug('🚀 Executing groups DOWN migration...');
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  await downGroups(hasura);
  debug('✅ groups DOWN migration executed.');
}

down().catch((e) => {
  console.error('❌ groups DOWN failed:', e);
  process.exit(1);
});



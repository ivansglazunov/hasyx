import { Hasura, ColumnType } from './hasura/hasura';
import Debug from './debug';

const debug = Debug('migration:up-schedule');

async function createScheduleTables(hasura: Hasura) {
  debug('🔧 Defining schedule and events tables...');

  // Ensure schema
  await hasura.defineSchema({ schema: 'public' });

  // schedule
  await hasura.defineTable({ schema: 'public', table: 'schedule', id: 'id', type: ColumnType.UUID });

  const scheduleColumns: Array<[string, ColumnType, string | undefined]> = [
    ['title', ColumnType.TEXT, undefined],
    ['user_id', ColumnType.UUID, undefined],
    ['object_id', ColumnType.UUID, undefined],
    ['cron', ColumnType.TEXT, 'NOT NULL'],
    ['start_at', ColumnType.BIGINT, 'NOT NULL'],
    ['end_at', ColumnType.BIGINT, undefined],
    ['duration_sec', ColumnType.BIGINT, undefined],
    ['meta', ColumnType.JSONB, undefined],
    ['created_at', ColumnType.TIMESTAMPTZ, 'DEFAULT NOW()'],
    ['updated_at', ColumnType.TIMESTAMPTZ, 'DEFAULT NOW()'],
  ];

  for (const [name, type, postfix] of scheduleColumns) {
    await hasura.defineColumn({ schema: 'public', table: 'schedule', name, type, postfix });
  }

  // events
  await hasura.defineTable({ schema: 'public', table: 'events', id: 'id', type: ColumnType.UUID });

  const eventColumns: Array<[string, ColumnType, string | undefined]> = [
    ['title', ColumnType.TEXT, undefined],
    ['schedule_id', ColumnType.UUID, undefined],
    ['user_id', ColumnType.UUID, undefined],
    ['object_id', ColumnType.UUID, undefined],
    // New dual one-off ids for start and end notifications
    ['one_off_start_id', ColumnType.TEXT, undefined],
    ['one_off_end_id', ColumnType.TEXT, undefined],
    ['plan_start', ColumnType.BIGINT, 'NOT NULL'],
    ['plan_end', ColumnType.BIGINT, undefined],
    ['start', ColumnType.BIGINT, undefined],
    ['end', ColumnType.BIGINT, undefined],
    ['status', ColumnType.TEXT, "NOT NULL DEFAULT 'pending'"],
    ['meta', ColumnType.JSONB, undefined],
    ['created_at', ColumnType.TIMESTAMPTZ, 'DEFAULT NOW()'],
    ['updated_at', ColumnType.TIMESTAMPTZ, 'DEFAULT NOW()'],
  ];

  for (const [name, type, postfix] of eventColumns) {
    await hasura.defineColumn({ schema: 'public', table: 'events', name, type, postfix });
  }

  // FK
  await hasura.defineForeignKey({
    from: { schema: 'public', table: 'events', column: 'schedule_id' },
    to: { schema: 'public', table: 'schedule', column: 'id' },
    on_delete: 'SET NULL',
    on_update: 'CASCADE',
  });

  // Track tables
  await hasura.trackTable({ schema: 'public', table: 'schedule' });
  await hasura.trackTable({ schema: 'public', table: 'events' });

  // Relationships
  await hasura.defineArrayRelationshipForeign({
    schema: 'public',
    table: 'schedule',
    name: 'events',
    key: 'events.schedule_id',
  });

  await hasura.defineObjectRelationshipForeign({
    schema: 'public',
    table: 'events',
    name: 'schedule',
    key: 'schedule_id',
  });
}

async function applyPermissions(hasura: Hasura) {
  debug('🔐 Applying permissions for schedule/events...');

  // schedule select for owner
  await hasura.definePermission({
    schema: 'public',
    table: 'schedule',
    operation: 'select',
    role: 'user',
    filter: {},
    columns: true,
    aggregate: true,
  });

  // schedule insert: set user_id to session user
  await hasura.definePermission({
    schema: 'public',
    table: 'schedule',
    operation: 'insert',
    role: 'user',
    filter: {},
    check: {},
    columns: ['id', 'title', 'object_id', 'cron', 'start_at', 'end_at', 'duration_sec', 'meta'],
    set: { user_id: 'X-Hasura-User-Id' },
  });

  // schedule update/delete: only owner
  const ownerFilter = { user_id: { _eq: 'X-Hasura-User-Id' } } as any;
  await hasura.definePermission({
    schema: 'public',
    table: 'schedule',
    operation: 'update',
    role: 'user',
    filter: ownerFilter,
    columns: ['title', 'object_id', 'cron', 'start_at', 'end_at', 'duration_sec', 'meta'],
  });
  await hasura.definePermission({
    schema: 'public',
    table: 'schedule',
    operation: 'delete',
    role: 'user',
    filter: ownerFilter,
  });

  // events select for owner
  await hasura.definePermission({
    schema: 'public',
    table: 'events',
    operation: 'select',
    role: 'user',
    filter: {},
    columns: true,
    aggregate: true,
  });

  // events insert: user can create with own user_id preset
  await hasura.definePermission({
    schema: 'public',
    table: 'events',
    operation: 'insert',
    role: 'user',
    filter: {},
    check: {},
    // Do not allow client to set one_off_* ids directly
    columns: ['id', 'title', 'schedule_id', 'object_id', 'plan_start', 'plan_end', 'start', 'end', 'status', 'meta'],
    set: { user_id: 'X-Hasura-User-Id' },
  });

  // events update/delete: only owner
  await hasura.definePermission({
    schema: 'public',
    table: 'events',
    operation: 'update',
    role: 'user',
    filter: ownerFilter,
    columns: ['title', 'schedule_id', 'object_id', 'plan_start', 'plan_end', 'start', 'end', 'status', 'meta'],
  });
  await hasura.definePermission({
    schema: 'public',
    table: 'events',
    operation: 'delete',
    role: 'user',
    filter: ownerFilter,
  });

  debug('✅ Permissions applied for schedule/events.');
}

export async function up(customHasura?: Hasura) {
  debug('🚀 Starting Schedule migration UP...');
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  try {
    await hasura.ensureDefaultSource();
    await createScheduleTables(hasura);
    await applyPermissions(hasura);
    debug('✨ Schedule migration UP complete.');
    return true;
  } catch (err) {
    console.error('❗ Schedule UP migration failed:', err);
    return false;
  }
}



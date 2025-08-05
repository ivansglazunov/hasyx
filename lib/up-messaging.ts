import dotenv from 'dotenv';
import { Hasura, ColumnType } from './hasura';
import Debug from './debug';

dotenv.config();

const debug = Debug('migration:up-messaging');

/**
 * Foundation migration: create base tables (rooms, messages, replies).
 * Detailed triggers, permissions and cleaner job will be added later.
 */
export async function upMessagingSchema(hasura: Hasura) {
  debug('🔧 Creating messaging base tables…');

  /* ----------------------------- rooms ----------------------------- */
  await hasura.defineTable({ schema: 'public', table: 'rooms', id: 'id', type: ColumnType.UUID });

  const roomColumns: Array<[string, ColumnType, string | undefined]> = [
    ['user_id', ColumnType.UUID, 'NOT NULL'],
    ['title', ColumnType.TEXT, undefined],
    ['allow_select_users', ColumnType.JSONB, "NOT NULL DEFAULT '[]'::jsonb"],
    ['allow_change_users', ColumnType.JSONB, "NOT NULL DEFAULT '[]'::jsonb"],
    ['allow_reply_users', ColumnType.JSONB, "NOT NULL DEFAULT '[]'::jsonb"],
    ['allow_remove_users', ColumnType.JSONB, "NOT NULL DEFAULT '[]'::jsonb"],
    ['allow_delete_users', ColumnType.JSONB, "NOT NULL DEFAULT '[]'::jsonb"],
    ['created_at', ColumnType.BIGINT, "NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())*1000)::bigint"],
    ['updated_at', ColumnType.BIGINT, "NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())*1000)::bigint"],
  ];
  for (const [name, type, postfix] of roomColumns) {
    await hasura.defineColumn({ schema: 'public', table: 'rooms', name, type, postfix });
  }

  /* --------------------------- messages --------------------------- */
  await hasura.defineTable({ schema: 'public', table: 'messages', id: 'id', type: ColumnType.UUID });

  const msgColumns: Array<[string, ColumnType, string | undefined]> = [
    ['user_id', ColumnType.UUID, undefined],
    ['value', ColumnType.TEXT, undefined],
    ['i', ColumnType.BIGINT, "NOT NULL DEFAULT nextval('messages_i_seq')"],
    ['created_at', ColumnType.BIGINT, "NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())*1000)::bigint"],
    ['updated_at', ColumnType.BIGINT, "NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())*1000)::bigint"],
  ];
  // Create sequence for messages i column
  await hasura.sql(`CREATE SEQUENCE IF NOT EXISTS public.messages_i_seq;`);

  for (const [name, type, postfix] of msgColumns) {
    await hasura.defineColumn({ schema: 'public', table: 'messages', name, type, postfix });
  }

  /* ---------------------------- replies --------------------------- */
  await hasura.defineTable({ schema: 'public', table: 'replies', id: 'id', type: ColumnType.UUID });

  const replyColumns: Array<[string, ColumnType, string | undefined]> = [
    ['message_id', ColumnType.UUID, undefined],
    ['user_id', ColumnType.UUID, undefined],
    ['room_id', ColumnType.UUID, 'NOT NULL'],
    ['created_at', ColumnType.BIGINT, "NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())*1000)::bigint"],
    // removed_at column no longer needed – physical delete is used now
  ];
  for (const [name, type, postfix] of replyColumns) {
    await hasura.defineColumn({ schema: 'public', table: 'replies', name, type, postfix });
  }

  /* ------------------------ message_reads ------------------------ */
  await hasura.defineTable({ schema: 'public', table: 'message_reads', id: 'id', type: ColumnType.UUID });

  const readColumns: Array<[string, ColumnType, string | undefined]> = [
    ['user_id', ColumnType.UUID, 'NOT NULL'],
    ['room_id', ColumnType.UUID, 'NOT NULL'],
    ['last_i', ColumnType.BIGINT, 'NOT NULL DEFAULT 0'],
    ['created_at', ColumnType.BIGINT, "NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())*1000)::bigint"],
    ['updated_at', ColumnType.BIGINT, "NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())*1000)::bigint"],
  ];
  for (const [name, type, postfix] of readColumns) {
    await hasura.defineColumn({ schema: 'public', table: 'message_reads', name, type, postfix });
  }

  // Add unique constraint for user_id + room_id
  await hasura.sql(`ALTER TABLE public.message_reads ADD CONSTRAINT unique_user_room UNIQUE (user_id, room_id);`);

  // Foreign keys -------------------------------------------------------------
  await hasura.sql(`ALTER TABLE public.replies
    ADD CONSTRAINT fk_replies_room FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_replies_message FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE;
  `);

  await hasura.sql(`ALTER TABLE public.message_reads
    ADD CONSTRAINT fk_message_reads_room FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;
  `);

  /* ---------------- helper functions & triggers ---------------- */
  // Common function: update updated_at column
  await hasura.defineFunction({
    schema: 'public',
    name: 'set_current_timestamp_updated_at',
    replace: true,
    language: 'plpgsql',
    definition: `()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := (EXTRACT(EPOCH FROM NOW())*1000)::bigint;
  RETURN NEW;
END;$$`,
  });

  for (const tbl of ['rooms', 'messages', 'message_reads']) {
    await hasura.defineTrigger({
      schema: 'public',
      table: tbl,
      name: `${tbl}_set_updated_at`,
      timing: 'BEFORE',
      event: 'UPDATE',
      function_name: 'public.set_current_timestamp_updated_at',
      replace: true,
    });
  }

  // soft-delete trigger removed – replies are physically deleted now

  // User ID trigger for messages (similar to github_issues)
  await hasura.defineFunction({
    schema: 'public',
    name: 'set_messages_user_id_trigger',
    replace: true,
    language: 'plpgsql',
    definition: `()
RETURNS TRIGGER AS $$
DECLARE
  session_vars json;
  user_id text;
BEGIN
  -- Get session variables from hasura.user
  session_vars := current_setting('hasura.user', true)::json;
  
  -- Extract user_id from session variables
  user_id := session_vars ->> 'x-hasura-user-id';
  
  -- If operation is performed by a user (has session variables), set user_id
  IF user_id IS NOT NULL AND user_id != '' THEN
    NEW.user_id = user_id::uuid;
  END IF;
  
  RETURN NEW;
END;$$`,
  });
  await hasura.defineTrigger({
    schema: 'public',
    table: 'messages',
    name: 'set_messages_user_id',
    timing: 'BEFORE',
    event: 'INSERT',
    function_name: 'public.set_messages_user_id_trigger',
    replace: true,
  });

  // User ID trigger for replies
  await hasura.defineFunction({
    schema: 'public',
    name: 'set_replies_user_id_trigger',
    replace: true,
    language: 'plpgsql',
    definition: `()
RETURNS TRIGGER AS $$
DECLARE
  session_vars json;
  user_id text;
BEGIN
  -- Get session variables from hasura.user
  session_vars := current_setting('hasura.user', true)::json;
  
  -- Extract user_id from session variables
  user_id := session_vars ->> 'x-hasura-user-id';
  
  -- If operation is performed by a user (has session variables), set user_id
  IF user_id IS NOT NULL AND user_id != '' THEN
    NEW.user_id = user_id::uuid;
  END IF;
  
  RETURN NEW;
END;$$`,
  });
  await hasura.defineTrigger({
    schema: 'public',
    table: 'replies',
    name: 'set_replies_user_id',
    timing: 'BEFORE',
    event: 'INSERT',
    function_name: 'public.set_replies_user_id_trigger',
    replace: true,
  });

  // User ID trigger for message_reads
  await hasura.defineFunction({
    schema: 'public',
    name: 'set_message_reads_user_id_trigger',
    replace: true,
    language: 'plpgsql',
    definition: `()
RETURNS TRIGGER AS $$
DECLARE
  session_vars json;
  user_id text;
BEGIN
  -- Get session variables from hasura.user
  session_vars := current_setting('hasura.user', true)::json;
  
  -- Extract user_id from session variables
  user_id := session_vars ->> 'x-hasura-user-id';
  
  -- If operation is performed by a user (has session variables), set user_id
  IF user_id IS NOT NULL AND user_id != '' THEN
    NEW.user_id = user_id::uuid;
  END IF;
  
  RETURN NEW;
END;$$`,
  });
  await hasura.defineTrigger({
    schema: 'public',
    table: 'message_reads',
    name: 'set_message_reads_user_id',
    timing: 'BEFORE',
    event: 'INSERT',
    function_name: 'public.set_message_reads_user_id_trigger',
    replace: true,
  });

  // Track tables
  for (const tbl of ['rooms', 'messages', 'replies', 'message_reads']) {
    await hasura.trackTable({ schema: 'public', table: tbl });
  }

  /* -------------------- relationships --------------------------- */
  // Define foreign-key based relationships so that permission filters using them are valid
  await hasura.defineObjectRelationshipForeign({
    schema: 'public',
    table: 'replies',
    name: 'message',
    key: 'message_id',
  });
  await hasura.defineObjectRelationshipForeign({
    schema: 'public',
    table: 'replies',
    name: 'room',
    key: 'room_id',
  });
  await hasura.defineArrayRelationshipForeign({
    schema: 'public',
    table: 'messages',
    name: 'replies',
    key: 'replies.message_id', // remote table and column
  });
  // (optional) room -> replies, not strictly required but handy
  await hasura.defineArrayRelationshipForeign({
    schema: 'public',
    table: 'rooms',
    name: 'replies',
    key: 'replies.room_id',
  });

  /* ------------------------- basic permissions ------------------------- */
  // Rooms table permissions
  await hasura.definePermission({
    schema: 'public',
    table: 'rooms',
    operation: 'select',
    role: 'user',
    filter: {},
    columns: true,
    aggregate: true,
  });
  await hasura.definePermission({
    schema: 'public',
    table: 'rooms',
    operation: 'insert',
    role: 'user',
    filter: {},
    check: {},
    columns: ['id', 'title', 'allow_select_users', 'allow_change_users', 'allow_reply_users', 'allow_remove_users', 'allow_delete_users'],
    set: { user_id: 'X-Hasura-User-Id' },
  });
  // Anonymous has no insert
  await hasura.definePermission({
    schema: 'public',
    table: 'rooms',
    operation: 'select',
    role: 'anonymous',
    filter: { allow_select_users: { _contains: ['anonymous'] } },
    columns: true,
    aggregate: true,
  });

  /* -------------------- messages permissions --------------------------- */
  const messageSelectUserFilter = {
    _or: [
      { user_id: { _eq: 'X-Hasura-User-Id' } },
      {
        replies: {
          room: {
            _or: [
                    { allow_select_users: { _contains: ['X-Hasura-User-Id'] } },
      { allow_select_users: { _contains: ['user'] } },
            ],
          },
        },
      },
    ],
  } as any;

  const messageSelectAnonFilter = {
    _or: [
      {
        replies: {
          room: {
            allow_select_users: { _contains: ['anonymous'] },
          },
        },
      },
    ],
  } as any;

  await hasura.definePermission({
    schema: 'public',
    table: 'messages',
    operation: 'select',
    role: 'user',
    filter: messageSelectUserFilter,
    columns: true,
    aggregate: true,
  });

  await hasura.definePermission({
    schema: 'public',
    table: 'messages',
    operation: 'select',
    role: 'anonymous',
    filter: messageSelectAnonFilter,
    columns: true,
    aggregate: true,
  });

  // INSERT permission for messages - no restrictions (user_id set by trigger)
  await hasura.definePermission({
    schema: 'public',
    table: 'messages',
    operation: 'insert',
    role: 'user',
    filter: {},
    check: {},
    columns: ['id', 'value'],
  });

  // UPDATE/DELETE for author and all rooms must allow change
  const allowChangeOrKey = {
    _or: [
      { allow_change_users: { _contains: ['X-Hasura-User-Id'] } },
      { allow_change_users: { _contains: ['user'] } },
    ],
  } as any;

  const messageUpdateDeleteFilter = {
    user_id: { _eq: 'X-Hasura-User-Id' },
    _not: {
      replies: {
        room: {
          _not: allowChangeOrKey,
        },
      },
    },
  } as any;

  await hasura.definePermission({
    schema: 'public',
    table: 'messages',
    operation: 'update',
    role: 'user',
    filter: messageUpdateDeleteFilter,
    columns: ['value'],
  });

  await hasura.definePermission({
    schema: 'public',
    table: 'messages',
    operation: 'delete',
    role: 'user',
    filter: messageUpdateDeleteFilter,
  });

  /* -------------------- replies permissions --------------------------- */
  const replyInsertCheck = {
    room: {
      _or: [
        { allow_reply_users: { _contains: ['X-Hasura-User-Id'] } },
        { allow_reply_users: { _contains: ['user'] } },
        { allow_reply_users: { _contains: ['anonymous'] } },
      ],
    },
  } as any;

  await hasura.definePermission({
    schema: 'public',
    table: 'replies',
    operation: 'insert',
    role: 'user',
    filter: {},
    check: replyInsertCheck,
    columns: ['id', 'message_id', 'room_id'],
  });

  const replySelectUserFilter = {
    _or: [
      { user_id: { _eq: 'X-Hasura-User-Id' } },
      { room: { _or: [ { allow_select_users: { _contains: ['X-Hasura-User-Id'] } }, { allow_select_users: { _contains: ['user'] } } ] } },
    ],
  } as any;

  await hasura.definePermission({
    schema: 'public',
    table: 'replies',
    operation: 'select',
    role: 'user',
    filter: replySelectUserFilter,
    columns: true,
    aggregate: true,
  });

  await hasura.definePermission({
    schema: 'public',
    table: 'replies',
    operation: 'select',
    role: 'anonymous',
    filter: { room: { allow_select_users: { _contains: ['anonymous'] } } },
    columns: true,
    aggregate: true,
  });

  // DELETE – author or allow_remove/delete in room
  const replyDeleteFilter = {
    _or: [
      { user_id: { _eq: 'X-Hasura-User-Id' } },
      { room: { _or: [ 
        { allow_delete_users: { _contains: ['X-Hasura-User-Id'] } }, 
        { allow_delete_users: { _contains: ['user'] } }, 
        { allow_remove_users: { _contains: ['X-Hasura-User-Id'] } },
        { allow_remove_users: { _contains: ['user'] } }
      ] } },
    ],
  } as any;

  await hasura.definePermission({
    schema: 'public',
    table: 'replies',
    operation: 'delete',
    role: 'user',
    filter: replyDeleteFilter,
  });

  // UPDATE disabled – no permission
  await hasura.definePermission({
    schema: 'public',
    table: 'replies',
    operation: 'update',
    role: 'user',
    filter: { id: { _eq: '00000000-0000-0000-0000-000000000000' } },
    columns: [],
  });

  /* -------------------- message_reads permissions --------------------------- */
  await hasura.definePermission({
    schema: 'public',
    table: 'message_reads',
    operation: 'select',
    role: 'user',
    filter: { user_id: { _eq: 'X-Hasura-User-Id' } },
    columns: true,
    aggregate: true,
  });

  await hasura.definePermission({
    schema: 'public',
    table: 'message_reads',
    operation: 'insert',
    role: 'user',
    filter: {},
    check: {},
    columns: ['id', 'room_id', 'last_i'],
    set: { user_id: 'X-Hasura-User-Id' },
  });

  await hasura.definePermission({
    schema: 'public',
    table: 'message_reads',
    operation: 'update',
    role: 'user',
    filter: { user_id: { _eq: 'X-Hasura-User-Id' } },
    columns: ['last_i'],
  });

  debug('✅ Base tables created with helper triggers and tracked.');
}

export async function up(customHasura?: Hasura) {
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  await upMessagingSchema(hasura);
} 
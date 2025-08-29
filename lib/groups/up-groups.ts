import dotenv from 'dotenv';
import Debug from '../debug';
import { Hasura, ColumnType } from '../hasura/hasura';

dotenv.config();

const debug = Debug('migration:up-groups');

export async function up(customHasura?: Hasura) {
  debug('🚀 Starting Hasura groups migration UP...');
  const hasura = customHasura || new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.ensureDefaultSource();

  /* -------------------------------- tables -------------------------------- */
  // groups
  await hasura.defineTable({ schema: 'public', table: 'groups', id: 'id', type: ColumnType.UUID });

  const groupColumns: Array<[string, ColumnType, string | undefined, string | undefined]> = [
    ['owner_id', ColumnType.UUID, undefined, 'Current group owner (nullable)'],
    ['created_by_id', ColumnType.UUID, 'NOT NULL', 'Creator user id'],
    ['title', ColumnType.TEXT, "NOT NULL DEFAULT ''", 'Group title'],
    ['slug', ColumnType.TEXT, undefined, 'Unique slug'],
    ['description', ColumnType.TEXT, undefined, 'Description'],
    // avatar_file_id intentionally without FK to avoid hard dependency
    ['avatar_file_id', ColumnType.UUID, undefined, 'Optional avatar file id'],
    ['kind', ColumnType.TEXT, "NOT NULL DEFAULT 'group'", 'Semantic kind: group/team/class/etc'],
    [
      'visibility',
      ColumnType.TEXT,
      "NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','private','secret'))",
      'Visibility policy'
    ],
    [
      'join_policy',
      ColumnType.TEXT,
      "NOT NULL DEFAULT 'by_request' CHECK (join_policy IN ('open','by_request','invite_only','closed'))",
      'Join policy'
    ],
    ['namespace', ColumnType.TEXT, undefined, 'Optional namespace/tenant id'],
    ['attributes', ColumnType.JSONB, "NOT NULL DEFAULT '{}'::jsonb", 'Extensible attributes'],
    ['tags', ColumnType.JSONB, "NOT NULL DEFAULT '[]'::jsonb", 'Tags as jsonb array of strings'],
    // allow_* policies (jsonb arrays of tokens/user-ids)
    ['allow_view_users', ColumnType.JSONB, "NOT NULL DEFAULT '[]'::jsonb", 'Visibility allow-list'],
    ['allow_request_users', ColumnType.JSONB, "NOT NULL DEFAULT '[]'::jsonb", 'Who may request to join'],
    ['allow_join_users', ColumnType.JSONB, "NOT NULL DEFAULT '[]'::jsonb", 'Who joins immediately on open policy'],
    ['allow_invite_users', ColumnType.JSONB, "NOT NULL DEFAULT '[\"owner\",\"admin\"]'::jsonb", 'Who can send invites'],
    ['allow_manage_members_users', ColumnType.JSONB, "NOT NULL DEFAULT '[\"owner\",\"admin\"]'::jsonb", 'Who can manage members'],
    ['allow_update_group_users', ColumnType.JSONB, "NOT NULL DEFAULT '[\"owner\",\"admin\"]'::jsonb", 'Who can update group'],
    ['allow_delete_group_users', ColumnType.JSONB, "NOT NULL DEFAULT '[\"owner\",\"admin\"]'::jsonb", 'Who can delete group'],
  ];
  for (const [name, type, postfix, comment] of groupColumns) {
    await hasura.defineColumn({ schema: 'public', table: 'groups', name, type, postfix, comment });
  }

  // memberships
  await hasura.defineTable({ schema: 'public', table: 'memberships', id: 'id', type: ColumnType.UUID });
  const membershipColumns: Array<[string, ColumnType, string | undefined, string | undefined]> = [
    ['group_id', ColumnType.UUID, 'NOT NULL', 'Group id'],
    ['user_id', ColumnType.UUID, 'NOT NULL', 'User id'],
    ['role', ColumnType.TEXT, "NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','member'))", 'Role in group'],
    [
      'status',
      ColumnType.TEXT,
      "NOT NULL DEFAULT 'request' CHECK (status IN ('request','approved','denied','kicked','banned','left'))",
      'Membership status'
    ],
    ['invited_by_id', ColumnType.UUID, undefined, 'User who invited (optional)'],
    ['created_by_id', ColumnType.UUID, 'NOT NULL', 'User who created the membership record'],
  ];
  for (const [name, type, postfix, comment] of membershipColumns) {
    await hasura.defineColumn({ schema: 'public', table: 'memberships', name, type, postfix, comment });
  }

  // invitations
  await hasura.defineTable({ schema: 'public', table: 'invitations', id: 'id', type: ColumnType.UUID });
  const invitationColumns: Array<[string, ColumnType, string | undefined, string | undefined]> = [
    ['group_id', ColumnType.UUID, 'NOT NULL', 'Group id'],
    ['token', ColumnType.TEXT, 'NOT NULL', 'Unique invitation token'],
    ['invitee_user_id', ColumnType.UUID, undefined, 'Invitee user id (optional)'],
    ['invited_by_id', ColumnType.UUID, 'NOT NULL', 'Inviter user id'],
    ['status', ColumnType.TEXT, "NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','revoked','expired'))", 'Invitation status'],
    ['expires_at', ColumnType.BIGINT, undefined, 'Expiration in ms'],
  ];
  for (const [name, type, postfix, comment] of invitationColumns) {
    await hasura.defineColumn({ schema: 'public', table: 'invitations', name, type, postfix, comment });
  }

  /* ----------------------------- foreign keys ----------------------------- */
  // groups.owner_id -> users
  await hasura.defineForeignKey({
    from: { schema: 'public', table: 'groups', column: 'owner_id' },
    to: { schema: 'public', table: 'users', column: 'id' },
    on_delete: 'SET NULL',
    on_update: 'CASCADE',
  });
  await hasura.defineForeignKey({
    from: { schema: 'public', table: 'groups', column: 'created_by_id' },
    to: { schema: 'public', table: 'users', column: 'id' },
    on_delete: 'CASCADE',
    on_update: 'CASCADE',
  });

  // memberships
  await hasura.defineForeignKey({
    from: { schema: 'public', table: 'memberships', column: 'group_id' },
    to: { schema: 'public', table: 'groups', column: 'id' },
    on_delete: 'CASCADE',
    on_update: 'CASCADE',
  });
  await hasura.defineForeignKey({
    from: { schema: 'public', table: 'memberships', column: 'user_id' },
    to: { schema: 'public', table: 'users', column: 'id' },
    on_delete: 'CASCADE',
    on_update: 'CASCADE',
  });
  await hasura.defineForeignKey({
    from: { schema: 'public', table: 'memberships', column: 'invited_by_id' },
    to: { schema: 'public', table: 'users', column: 'id' },
    on_delete: 'SET NULL',
    on_update: 'CASCADE',
  });
  await hasura.defineForeignKey({
    from: { schema: 'public', table: 'memberships', column: 'created_by_id' },
    to: { schema: 'public', table: 'users', column: 'id' },
    on_delete: 'CASCADE',
    on_update: 'CASCADE',
  });

  // invitations
  await hasura.defineForeignKey({
    from: { schema: 'public', table: 'invitations', column: 'group_id' },
    to: { schema: 'public', table: 'groups', column: 'id' },
    on_delete: 'CASCADE',
    on_update: 'CASCADE',
  });
  await hasura.defineForeignKey({
    from: { schema: 'public', table: 'invitations', column: 'invited_by_id' },
    to: { schema: 'public', table: 'users', column: 'id' },
    on_delete: 'CASCADE',
    on_update: 'CASCADE',
  });
  await hasura.defineForeignKey({
    from: { schema: 'public', table: 'invitations', column: 'invitee_user_id' },
    to: { schema: 'public', table: 'users', column: 'id' },
    on_delete: 'SET NULL',
    on_update: 'CASCADE',
  });

  /* ------------------------- helper functions/triggers ------------------------- */
  // Common updated_at trigger
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

  for (const tbl of ['groups', 'memberships', 'invitations']) {
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

  // BEFORE INSERT on groups: default created_by_id/owner_id from session
  await hasura.defineFunction({
    schema: 'public',
    name: 'groups_before_insert_defaults',
    replace: true,
    language: 'plpgsql',
    definition: `()
RETURNS TRIGGER AS $$
DECLARE
  session_vars json;
  actor_id text;
BEGIN
  session_vars := current_setting('hasura.user', true)::json;
  actor_id := session_vars ->> 'x-hasura-user-id';
  IF NEW.created_by_id IS NULL AND actor_id IS NOT NULL THEN
    NEW.created_by_id := actor_id::uuid;
  END IF;
  IF NEW.owner_id IS NULL THEN
    NEW.owner_id := NEW.created_by_id;
  END IF;
  RETURN NEW;
END;$$`,
  });
  await hasura.defineTrigger({
    schema: 'public',
    table: 'groups',
    name: 'groups_before_insert_defaults',
    timing: 'BEFORE',
    event: 'INSERT',
    function_name: 'public.groups_before_insert_defaults',
    replace: true,
  });

  // AFTER INSERT on groups: create owner membership approved
  await hasura.defineFunction({
    schema: 'public',
    name: 'groups_after_insert_create_owner_membership',
    replace: true,
    language: 'plpgsql',
    definition: `()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.owner_id IS NOT NULL THEN
    INSERT INTO public.memberships(id, group_id, user_id, role, status, created_by_id)
    VALUES (gen_random_uuid(), NEW.id, NEW.owner_id, 'owner', 'approved', NEW.owner_id)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;$$`,
  });
  await hasura.defineTrigger({
    schema: 'public',
    table: 'groups',
    name: 'groups_after_insert_create_owner_membership',
    timing: 'AFTER',
    event: 'INSERT',
    function_name: 'public.groups_after_insert_create_owner_membership',
    replace: true,
  });

  // BEFORE UPDATE on groups: enforce owner change policy
  await hasura.defineFunction({
    schema: 'public',
    name: 'groups_before_update_owner_policy',
    replace: true,
    language: 'plpgsql',
    definition: `()
RETURNS TRIGGER AS $$
DECLARE
  session_vars jsonb;
  actor_id uuid;
  is_admin boolean := false;
BEGIN
  IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
    session_vars := current_setting('hasura.user', true)::jsonb;
    actor_id := NULLIF(session_vars ->> 'x-hasura-user-id', '')::uuid;

    -- determine if actor is admin member
    SELECT EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE m.group_id = OLD.id AND m.user_id = actor_id AND m.role = 'admin' AND m.status = 'approved'
    ) INTO is_admin;

    -- Owner may set owner_id to NULL (resign)
    IF OLD.owner_id IS NOT NULL AND actor_id = OLD.owner_id AND NEW.owner_id IS NULL THEN
      RETURN NEW;
    END IF;

    -- If no owner, an admin can set themselves as owner
    IF OLD.owner_id IS NULL AND is_admin AND NEW.owner_id = actor_id THEN
      RETURN NEW;
    END IF;
    -- Otherwise, do not enforce here; Hasura permissions gate updates
    RETURN NEW;
  END IF;
  RETURN NEW;
END;$$`,
  });
  await hasura.defineTrigger({
    schema: 'public',
    table: 'groups',
    name: 'groups_before_update_owner_policy',
    timing: 'BEFORE',
    event: 'UPDATE',
    function_name: 'public.groups_before_update_owner_policy',
    replace: true,
  });

  // BEFORE INSERT/UPDATE on memberships: status normalization and transitions
  await hasura.defineFunction({
    schema: 'public',
    name: 'memberships_status_guard',
    replace: true,
    language: 'plpgsql',
    definition: `()
RETURNS TRIGGER AS $$
DECLARE
  jp text;
  session_vars jsonb;
  actor_id uuid;
  is_admin boolean := false;
  owner uuid;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status IS NULL THEN NEW.status := 'request'; END IF;
    SELECT join_policy, owner_id INTO jp, owner FROM public.groups g WHERE g.id = NEW.group_id;
    -- Allow creating owner membership during group creation
    IF NEW.role = 'owner' AND NEW.user_id = owner THEN
      RETURN NEW;
    END IF;
    -- Allow explicit join bypass if user is whitelisted in allow_join_users
    IF EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = NEW.group_id AND (
        g.allow_join_users @> to_jsonb(array['user']::text[])
        OR g.allow_join_users @> to_jsonb(array[(current_setting('hasura.user', true)::jsonb ->> 'x-hasura-user-id')]::text[])
      )
    ) THEN
      NEW.status := 'approved';
      RETURN NEW;
    END IF;
    IF jp = 'open' THEN
      -- auto-approve for open policy
      NEW.status := 'approved';
      RETURN NEW;
    ELSIF jp = 'invite_only' THEN
      -- allow only via invitations (server-side inserts provide invited_by_id) or allow_request_users
      IF NEW.invited_by_id IS NOT NULL THEN
        RETURN NEW;
      END IF;
      -- allow explicit request bypass for whitelisted requesters
      IF EXISTS (
        SELECT 1 FROM public.groups g
        WHERE g.id = NEW.group_id AND (
          g.allow_request_users @> to_jsonb(array['user']::text[])
          OR g.allow_request_users @> to_jsonb(array[(current_setting('hasura.user', true)::jsonb ->> 'x-hasura-user-id')]::text[])
        )
      ) THEN
        RETURN NEW; -- permit as 'request'
      END IF;
      RAISE EXCEPTION 'Group accepts invitations only';
    ELSIF jp = 'closed' THEN
      RAISE EXCEPTION 'Group is closed for membership';
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Identify actor and whether they are admin of the group
    session_vars := current_setting('hasura.user', true)::jsonb;
    actor_id := NULLIF(session_vars ->> 'x-hasura-user-id', '')::uuid;
    SELECT EXISTS (
      SELECT 1 FROM public.memberships m
      WHERE m.group_id = NEW.group_id AND m.user_id = actor_id AND m.role = 'admin' AND m.status = 'approved'
    ) INTO is_admin;
    -- Check allow_manage_members_users allowlist
    IF NOT is_admin THEN
      PERFORM 1 FROM public.groups g
      WHERE g.id = NEW.group_id AND (
        g.allow_manage_members_users @> to_jsonb(array['user']::text[]) OR
        g.allow_manage_members_users @> to_jsonb(array[(session_vars ->> 'x-hasura-user-id')]::text[])
      );
      IF FOUND THEN
        is_admin := true; -- treat as allowed manager
      END IF;
    END IF;

    -- Block role self-escalation unless owner/admin. Cancel update to yield 0 affected_rows
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      IF NOT (is_admin OR (SELECT owner_id = actor_id FROM public.groups g WHERE g.id = NEW.group_id)) THEN
        RETURN NULL;
      END IF;
    END IF;

    IF OLD.status = NEW.status THEN RETURN NEW; END IF;
    IF OLD.status = 'request' AND NEW.status IN ('approved','denied') THEN RETURN NEW; END IF;
    IF OLD.status = 'approved' AND NEW.status IN ('left','kicked','banned') THEN RETURN NEW; END IF;
    IF OLD.status = 'denied' AND NEW.status = 'request' THEN RETURN NEW; END IF;
    RAISE EXCEPTION 'Invalid membership status transition from % to %', OLD.status, NEW.status;
  END IF;
  RETURN NEW;
END;$$`,
  });
  await hasura.defineTrigger({
    schema: 'public',
    table: 'memberships',
    name: 'memberships_status_guard_before_insert',
    timing: 'BEFORE',
    event: 'INSERT',
    function_name: 'public.memberships_status_guard',
    replace: true,
  });
  await hasura.defineTrigger({
    schema: 'public',
    table: 'memberships',
    name: 'memberships_status_guard_before_update',
    timing: 'BEFORE',
    event: 'UPDATE',
    function_name: 'public.memberships_status_guard',
    replace: true,
  });

  // BEFORE INSERT on memberships: default user_id/created_by_id from session if not provided
  await hasura.defineFunction({
    schema: 'public',
    name: 'memberships_before_insert_defaults',
    replace: true,
    language: 'plpgsql',
    definition: `()
RETURNS TRIGGER AS $$
DECLARE
  session_vars json;
  actor_id text;
BEGIN
  session_vars := current_setting('hasura.user', true)::json;
  actor_id := session_vars ->> 'x-hasura-user-id';
  IF NEW.user_id IS NULL AND actor_id IS NOT NULL THEN
    NEW.user_id := actor_id::uuid;
  END IF;
  IF actor_id IS NOT NULL THEN
    NEW.created_by_id := actor_id::uuid;
  END IF;
  RETURN NEW;
END;$$`,
  });
  await hasura.defineTrigger({
    schema: 'public',
    table: 'memberships',
    name: 'memberships_before_insert_defaults',
    timing: 'BEFORE',
    event: 'INSERT',
    function_name: 'public.memberships_before_insert_defaults',
    replace: true,
  });

  // AFTER UPDATE on invitations: accepted -> ensure approved membership
  await hasura.defineFunction({
    schema: 'public',
    name: 'invitations_after_update_accept',
    replace: true,
    language: 'plpgsql',
    definition: `()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND NEW.invitee_user_id IS NOT NULL THEN
    INSERT INTO public.memberships(id, group_id, user_id, role, status, invited_by_id, created_by_id)
    VALUES (gen_random_uuid(), NEW.group_id, NEW.invitee_user_id, 'member', 'approved', NEW.invited_by_id, NEW.invitee_user_id)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;$$`,
  });
  await hasura.defineTrigger({
    schema: 'public',
    table: 'invitations',
    name: 'invitations_after_update_accept',
    timing: 'AFTER',
    event: 'UPDATE',
    function_name: 'public.invitations_after_update_accept',
    replace: true,
  });

  // BEFORE INSERT on invitations: default invited_by_id from session and status pending
  await hasura.defineFunction({
    schema: 'public',
    name: 'invitations_before_insert_defaults',
    replace: true,
    language: 'plpgsql',
    definition: `()
RETURNS TRIGGER AS $$
DECLARE
  session_vars jsonb;
  actor_id uuid;
BEGIN
  session_vars := current_setting('hasura.user', true)::jsonb;
  actor_id := NULLIF(session_vars ->> 'x-hasura-user-id', '')::uuid;
  IF NEW.invited_by_id IS NULL THEN
    NEW.invited_by_id := actor_id;
  END IF;
  IF NEW.token IS NULL OR NEW.token = '' THEN
    NEW.token := gen_random_uuid()::text;
  END IF;
  IF NEW.status IS NULL THEN
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;$$`,
  });
  await hasura.defineTrigger({
    schema: 'public',
    table: 'invitations',
    name: 'invitations_before_insert_defaults',
    timing: 'BEFORE',
    event: 'INSERT',
    function_name: 'public.invitations_before_insert_defaults',
    replace: true,
  });

  /* ------------------------------- relationships ------------------------------- */
  // groups relations
  await hasura.defineArrayRelationshipForeign({ schema: 'public', table: 'groups', name: 'memberships', key: 'memberships.group_id' });
  await hasura.defineObjectRelationshipForeign({ schema: 'public', table: 'groups', name: 'owner', key: 'owner_id' });
  await hasura.defineArrayRelationshipForeign({ schema: 'public', table: 'groups', name: 'invitations', key: 'invitations.group_id' });

  // memberships relations
  await hasura.defineObjectRelationshipForeign({ schema: 'public', table: 'memberships', name: 'group', key: 'group_id' });
  await hasura.defineObjectRelationshipForeign({ schema: 'public', table: 'memberships', name: 'user', key: 'user_id' });
  await hasura.defineObjectRelationshipForeign({ schema: 'public', table: 'memberships', name: 'invited_by', key: 'invited_by_id' });
  await hasura.defineObjectRelationshipForeign({ schema: 'public', table: 'memberships', name: 'created_by', key: 'created_by_id' });

  // invitations relations
  await hasura.defineObjectRelationshipForeign({ schema: 'public', table: 'invitations', name: 'group', key: 'group_id' });
  await hasura.defineObjectRelationshipForeign({ schema: 'public', table: 'invitations', name: 'invited_by', key: 'invited_by_id' });
  await hasura.defineObjectRelationshipForeign({ schema: 'public', table: 'invitations', name: 'invitee_user', key: 'invitee_user_id' });

  /* -------------------------------- permissions -------------------------------- */
  // groups: select
  await hasura.definePermission({
    schema: 'public', table: 'groups', operation: 'select', role: 'anonymous', aggregate: true, columns: true,
    filter: { _or: [
      { visibility: { _eq: 'public' } },
      { allow_view_users: { _contains: ['anonymous'] } },
    ] }
  });

  await hasura.definePermission({
    schema: 'public', table: 'groups', operation: 'select', role: 'user', aggregate: true, columns: true,
    filter: { _or: [
      { visibility: { _eq: 'public' } },
      { allow_view_users: { _contains: ['user'] } },
      { allow_view_users: { _contains: ['X-Hasura-User-Id'] } },
      { memberships: { user_id: { _eq: 'X-Hasura-User-Id' }, status: { _eq: 'approved' } } },
    ] }
  });

  // groups: insert (user)
  await hasura.definePermission({
    schema: 'public', table: 'groups', operation: 'insert', role: 'user', columns: [
      'id','title','slug','description','avatar_file_id','kind','visibility','join_policy','namespace','attributes','tags',
      'allow_view_users','allow_request_users','allow_join_users','allow_invite_users','allow_manage_members_users','allow_update_group_users','allow_delete_group_users','created_by_id','owner_id'
    ],
    filter: {},
    set: { created_by_id: 'X-Hasura-User-Id' }
  });

  // groups: update (user)
  await hasura.definePermission({
    schema: 'public', table: 'groups', operation: 'update', role: 'user', columns: [
      'title','slug','description','avatar_file_id','kind','visibility','join_policy','namespace','attributes','tags',
      'allow_view_users','allow_request_users','allow_join_users','allow_invite_users','allow_manage_members_users','allow_update_group_users','allow_delete_group_users','owner_id'
    ],
    filter: { _or: [
      { owner_id: { _eq: 'X-Hasura-User-Id' } },
      { memberships: { user_id: { _eq: 'X-Hasura-User-Id' }, role: { _eq: 'admin' }, status: { _eq: 'approved' } } },
    ] }
  });

  // groups: delete (user)
  await hasura.definePermission({
    schema: 'public', table: 'groups', operation: 'delete', role: 'user',
    filter: { _or: [
      { owner_id: { _eq: 'X-Hasura-User-Id' } },
      { allow_delete_group_users: { _contains: ['X-Hasura-User-Id'] } },
      { allow_delete_group_users: { _contains: ['user'] } }
    ] }
  });

  // groups admin full
  for (const op of ['select','insert','update','delete'] as const) {
    await hasura.definePermission({ schema: 'public', table: 'groups', operation: op, role: 'admin', filter: {}, columns: true, aggregate: op==='select' });
  }

  // memberships: select
  // Only authenticated users can see memberships, and only where they are involved or manage the group.
  await hasura.definePermission({
    schema: 'public', table: 'memberships', operation: 'select', role: 'user', columns: true, aggregate: true,
    filter: { _or: [
      { user_id: { _eq: 'X-Hasura-User-Id' } },
      { group: { owner_id: { _eq: 'X-Hasura-User-Id' } } },
      { group: { memberships: { user_id: { _eq: 'X-Hasura-User-Id' }, role: { _eq: 'admin' }, status: { _eq: 'approved' } } } }
    ] }
  });

  // memberships: insert
  // Allow two paths:
  // 1) Self-request: user inserts own request (user_id preset to self, status 'request')
  // 2) Owner/Admin management: owner/admin can insert memberships for others, possibly with role/status
  await hasura.definePermission({
    schema: 'public', table: 'memberships', operation: 'insert', role: 'user',
    columns: ['id','group_id','user_id','status','invited_by_id','role'],
    // Self can request/join themselves; owner/admin can add others
    filter: { _or: [
      { user_id: { _eq: 'X-Hasura-User-Id' } },
      { group: { owner_id: { _eq: 'X-Hasura-User-Id' } } },
      { group: { memberships: { user_id: { _eq: 'X-Hasura-User-Id' }, role: { _eq: 'admin' }, status: { _eq: 'approved' } } } }
    ] }
  });

  // memberships: update (approve/deny by owner/admin; self can set left)
  // Update: status and role (self or owner/admin); trigger blocks illegal changes
  await hasura.definePermission({
    schema: 'public', table: 'memberships', operation: 'update', role: 'user',
    columns: ['status','role'],
    filter: { _or: [
      { user_id: { _eq: 'X-Hasura-User-Id' } },
      { group: { owner_id: { _eq: 'X-Hasura-User-Id' } } },
      { group: { memberships: { user_id: { _eq: 'X-Hasura-User-Id' }, role: { _eq: 'admin' }, status: { _eq: 'approved' } } } },
      { group: { allow_manage_members_users: { _contains: ['user'] } } },
      { group: { allow_manage_members_users: { _contains: ['X-Hasura-User-Id'] } } }
    ] }
  });

  // memberships: delete (owner/admin/allowed managers; user can delete own membership)
  await hasura.definePermission({
    schema: 'public', table: 'memberships', operation: 'delete', role: 'user',
    filter: { _or: [
      { user_id: { _eq: 'X-Hasura-User-Id' } },
      { group: { owner_id: { _eq: 'X-Hasura-User-Id' } } },
      { group: { memberships: { user_id: { _eq: 'X-Hasura-User-Id' }, role: { _eq: 'admin' }, status: { _eq: 'approved' } } } },
      { group: { allow_manage_members_users: { _contains: ['user'] } } },
      { group: { allow_manage_members_users: { _contains: ['X-Hasura-User-Id'] } } }
    ] }
  });

  // invitations: select
  // Invitations are visible to invitee, inviter, and group owner/admin.
  await hasura.definePermission({
    schema: 'public', table: 'invitations', operation: 'select', role: 'user', columns: true, aggregate: true,
    filter: { _or: [
      { invitee_user_id: { _eq: 'X-Hasura-User-Id' } },
      { invited_by_id: { _eq: 'X-Hasura-User-Id' } },
      { group: { owner_id: { _eq: 'X-Hasura-User-Id' } } },
      { group: { memberships: { user_id: { _eq: 'X-Hasura-User-Id' }, role: { _eq: 'admin' }, status: { _eq: 'approved' } } } }
    ] }
  });

  // invitations: insert (only owner/admin)
  await hasura.definePermission({
    schema: 'public', table: 'invitations', operation: 'insert', role: 'user',
    columns: true,
    filter: { _or: [
      { group: { owner_id: { _eq: 'X-Hasura-User-Id' } } },
      { group: { memberships: { user_id: { _eq: 'X-Hasura-User-Id' }, role: { _eq: 'admin' }, status: { _eq: 'approved' } } } },
      { group: { allow_invite_users: { _contains: ['user'] } } },
      { group: { allow_invite_users: { _contains: ['X-Hasura-User-Id'] } } }
    ] },
    set: { invited_by_id: 'X-Hasura-User-Id', status: 'pending' }
  });

  // invitations: update (accept/revoke)
  await hasura.definePermission({
    schema: 'public', table: 'invitations', operation: 'update', role: 'user',
    columns: ['status'],
    filter: { _or: [
      { invited_by_id: { _eq: 'X-Hasura-User-Id' } },
      { invitee_user_id: { _eq: 'X-Hasura-User-Id' } },
      { group: { owner_id: { _eq: 'X-Hasura-User-Id' } } },
      { group: { memberships: { user_id: { _eq: 'X-Hasura-User-Id' }, role: { _eq: 'admin' }, status: { _eq: 'approved' } } } },
      { group: { allow_invite_users: { _contains: ['user'] } } },
      { group: { allow_invite_users: { _contains: ['X-Hasura-User-Id'] } } }
    ] }
  });

  // Admin full permissions for memberships and invitations
  for (const tbl of ['memberships','invitations'] as const) {
    for (const op of ['select','insert','update','delete'] as const) {
      await hasura.definePermission({ schema: 'public', table: tbl, operation: op, role: 'admin', filter: {}, columns: true, aggregate: op==='select' });
    }
  }

  debug('✨ Hasura groups migration UP completed successfully!');
  return true;
}

// Execute directly
if (require.main === module) {
  up().catch((e) => {
    console.error('❌ Groups UP migration failed:', e);
    process.exit(1);
  });
}



# Hasyx Groups

Hasyx Groups provides a universal group/membership model implemented purely through Hasura schema, permissions and PostgreSQL triggers. It generalizes “clubs/teams/classes/orgs” into a single flexible entity controlled by JSONB allow-lists and explicit join policies.

## Overview

- groups: universal container with owner, visibility, join policy and allow-lists
- memberships: user participation in a group with role and status
- invitations: invitation flow that results in approved membership upon acceptance
- Triggers implement ownership, membership state machine, and invitation handling

## Database Schema

Created by migrations/1756045271995-groups/up.ts (see lib/groups/up-groups.ts).

### groups
- id uuid (PK)
- owner_id uuid (nullable) — current owner
- created_by_id uuid (NOT NULL) — creator (session)
- title text (NOT NULL default '')
- slug text (optional)
- description text (optional)
- avatar_file_id uuid (optional)
- kind text (NOT NULL default 'group')
- visibility text (NOT NULL default 'public', enum: public|private|secret)
- join_policy text (NOT NULL default 'by_request', enum: open|by_request|invite_only|closed)
- namespace text (optional)
- attributes jsonb (NOT NULL default {})
- tags jsonb (NOT NULL default [])
- allow_view_users jsonb (NOT NULL default [])
- allow_request_users jsonb (NOT NULL default [])
- allow_join_users jsonb (NOT NULL default [])
- allow_invite_users jsonb (NOT NULL default ["owner","admin"])
- allow_manage_members_users jsonb (NOT NULL default ["owner","admin"])
- allow_update_group_users jsonb (NOT NULL default ["owner","admin"])
- allow_delete_group_users jsonb (NOT NULL default ["owner","admin"])
- created_at bigint / updated_at bigint (ms epoch, updated via triggers)

### memberships
- id uuid (PK)
- group_id uuid (FK → groups, cascade)
- user_id uuid (FK → users, cascade)
- role text (NOT NULL default 'member', enum: owner|admin|member)
- status text (NOT NULL default 'request', enum: request|approved|denied|kicked|banned|left)
- invited_by_id uuid (FK → users, set null)
- created_by_id uuid (FK → users, cascade)
- created_at bigint / updated_at bigint

### invitations
- id uuid (PK)
- group_id uuid (FK → groups, cascade)
- token text (NOT NULL)
- invitee_user_id uuid (FK → users, set null)
- invited_by_id uuid (FK → users, cascade)
- status text (NOT NULL default 'pending', enum: pending|accepted|revoked|expired)
- expires_at bigint (optional)
- created_at bigint / updated_at bigint

## Triggers & Functions

- set_current_timestamp_updated_at: BEFORE UPDATE on all tables
- groups_before_insert_defaults: sets created_by_id and default owner_id
- groups_after_insert_create_owner_membership: inserts owner membership approved
- groups_before_update_owner_policy: allows owner resign and admin claim ownerless
- memberships_before_insert_defaults: presets user_id/created_by_id from session
- memberships_status_guard:
  - INSERT: enforces join_policy; open → approved; invite_only → require invite; closed → error; owner seed allowed; allow_join_users can bypass to approved; allow_request_users can bypass to request
  - UPDATE: validates finite state transitions; blocks unauthorized role changes (returns 0 affected rows); respects allow_manage_members_users
- invitations_before_insert_defaults: sets invited_by_id, status='pending', token
- invitations_after_update_accept: on accepted creates approved membership

## Permission Model

All enforced via Hasura in lib/groups/up-groups.ts.

### Allow-list tokens
Each allow_*_users may contain:
- Concrete user UUID
- "user" — any authenticated user
- "anonymous" — unauthenticated

### groups
- select:
  - anonymous: visibility='public' or allow_view_users contains "anonymous"
  - user: public or allow_view_users has "user"/viewer UUID or viewer is approved member
- insert (user): creator can set fields; created_by_id preset; owner set by trigger
- update (user): owner or approved admin; may be extended via allow_update_group_users
- delete (user): owner or in allow_delete_group_users
- admin: full access

### memberships
- select (user): self; or owner; or approved admin
- insert (user): self-request; or owner/admin (insert others)
- update (user): self; or owner/admin; or allowed via allow_manage_members_users; triggers cancel unauthorized role escalation

### invitations
- select (user): invitee; inviter; owner/admin
- insert (user): owner/admin or allowed via allow_invite_users
- update (user): inviter; invitee; owner/admin; or allowed via allow_invite_users

## Typical Flows

- Create group → owner membership auto-created
- Join (open): self insert → auto-approved
- Join (by_request): self insert → request; owner/admin approve/deny
- Join (invite_only): create invitation → accept → approved membership
- Join (closed): forbidden
- Owner resign → owner_id=null; admin can claim ownership

## Testing

See lib/groups/groups.test.ts — covers:
- Creation, joining (open/by_request), owner resign/admin claim, invite_only and closed policies
- Role changes (self escalation prevented), leaving
- allow_*: view, invite, manage members, request/join bypasses, update/delete group by allow-lists

## UI Pages

Planned pages under app/hasyx/groups:
- List all groups with actions
- Group detail page with members and management controls

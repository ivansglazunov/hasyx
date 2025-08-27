# Hasyx Invites

Hasyx Invites provide a simple, permissioned mechanism to gate access and track who was invited, fully enforced by Hasura permissions, and surfaced via a thin Next.js API + Hasyx client method for redemption.

## Overview

- Two tables: `invites` (codes created by users) and `invited` (records of redeemed invites).
- Strict permissions:
  - `invites`: users can create/list/delete only their own; delete only if unused.
  - `invited`: not insertable/updatable/deletable by user roles; readable only if you are the invited user or the inviter.
- Relationships:
  - `invite.user`, `invite.inviteds`, `invited.user`, `invited.invite`.
- API: `POST /api/invite` to redeem a code.
- Client: `hasyx.invite(code)` calls the API.
- Config flag: `NEXT_PUBLIC_HASYX_ONLY_INVITE_USER` (0/1). When enabled, the intended behavior is to only grant `user` role to invited users. See “JWT Behavior” below.
- Diagnostics UI: `Invites` card on `/hasyx/diagnostics` for manual testing (create, redeem, list, delete).

## Database Schema

Created via `lib/invite/up-invites.ts`:

### invites
- `id uuid` (PK)
- `user_id uuid` (inviter; set by client insert; restricted by permission to own id)
- `code text` (NOT NULL UNIQUE)
- `created_at bigint`
- `updated_at bigint`

### invited
- `id uuid` (PK)
- `invite_id uuid` (FK → invites)
- `user_id uuid` (the user who redeemed)
- `created_at bigint`
- Constraint: an invite may be used at most once (unique `invite_id`).

### Relationships
- `invites.user` → `users.id`
- `invites.inviteds` → `invited.invite_id`
- `invited.user` → `users.id`
- `invited.invite` → `invites.id`

## Permissions (Hasura)

Implemented in `lib/invite/up-invites.ts`:

- invites (role `user` / `me`):
  - select: only rows where `user_id = X-Hasura-User-Id`.
  - insert: allowed; must set `user_id = X-Hasura-User-Id`.
  - delete: allowed only if there is no referencing row in `invited`.
  - update: disabled.
- invited:
  - insert/update/delete: disabled for user roles.
  - select: allowed only if `user_id = X-Hasura-User-Id` OR the related `invite.user_id = X-Hasura-User-Id`.

## API Route

`POST /api/invite` – thin wrapper around `lib/invite.ts`:

Body: `{ code: string }`

Behavior:
- Requires authenticated session.
- Validates that `code` exists in `invites` and has no associated `invited` row.
- Creates a single `invited` row linking the invite to the current user.
- Returns success or error JSON.

## Client Integration

Hasyx client exposes `hasyx.invite(code: string)` which calls the API route. Use this from UI or tests to redeem a code.

## Business Logic (`lib/invite.ts`)

- `createInvite(hasyx, code?)`: insert into `invites` for the current user (role `me`).
- `useInvite(hasyx, code)`: redeem a code. Uses admin client internally to check/insert safely.
- `listUserInvites(hasyx)`: list current user’s invites.
- `deleteInvite(hasyx, inviteId)`: delete an unused invite; prevents deletion if `invited` exists.
- `isUserInvited(hasyx, userId?)`: check if a user has an `invited` record.

## JWT Behavior

Behavior when `NEXT_PUBLIC_HASYX_ONLY_INVITE_USER=1`:
- Only users with an `invited` record receive `user` in `x-hasura-allowed-roles` (and may keep default `user`).
- Non-invited users have `user` pruned and default role downgraded to `anonymous`.
- Implemented in `lib/jwt.ts` via admin-scoped check `isUserInvited(adminClient, userId)`.

## UI

- Diagnostics card `Invites` on `/hasyx/diagnostics` (`lib/invites/card.tsx`):
  - Create invite (optionally with custom code)
  - Redeem invite via `hasyx.invite(code)`
  - Lists: “My invites”, “My invited relations”, and admin overviews when admin secret is available
  - Delete unused invite

## Testing

Tests in `lib/invite/invite.test.ts` cover end-to-end:
- Creating invites (role `me`)
- Redeeming a code via API path (admin client mutation internally)
- Listing/visibility with proper permissions
- Preventing double-use of invites
- Deleting unused invites and rejecting deletion when used

Notes:
- Tests instantiate users via `@create-test-user.ts` and use `admin._authorize()` to obtain user-scoped Hasyx clients.
- `NEXT_PUBLIC_HASYX_ONLY_INVITE_USER` is backed up/restored per test.

## Migrations and Schema

- Schema and permissions are applied in `lib/invite/up-invites.ts`.
- After migration changes, regenerate local GraphQL schema via `npm run schema`.

## Troubleshooting

- If GraphQL fields like `insert_invites_one` are missing, ensure tables are tracked and permissions are set; re-run migrations and regenerate schema.
- Use `DEBUG="hasyx*"` to trace invite flow and errors.



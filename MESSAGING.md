# Hasyx Messaging

Hasyx Messaging provides a lightweight, Hasura-native messaging model built from three core tables: `rooms`, `messages`, and `replies`, plus `message_reads` for read cursors. It is designed to work entirely through Hasura permissions and streaming subscriptions with minimal server logic.

## Overview

- Rooms define who can view, reply, change, or delete content via JSONB allow-lists.
- Messages are authored by users and get linked to rooms via `replies` rows.
- Replies connect a message to a room and are physically deleted (no soft delete).
- Message read cursors track the highest message index a user has read per room.
- Real-time updates are exposed with Hasura `messages_stream` using an auto-incrementing `i` column.

UI: a demo page is available at `/hasyx/messaging` using `hasyx/components/hasyx/messaging/messaging`.

## Database Schema

Created by the migration in `migrations/1754300000000-hasyx-messaging` (see `lib/up-messaging.ts`):

### rooms
- `id uuid` (PK)
- `user_id uuid` (owner, set on insert)
- `title text`
- `allow_select_users jsonb` (NOT NULL default `[]`)
- `allow_change_users jsonb` (NOT NULL default `[]`)
- `allow_reply_users jsonb` (NOT NULL default `[]`)
- `allow_remove_users jsonb` (NOT NULL default `[]`)
- `allow_delete_users jsonb` (NOT NULL default `[]`)
- `created_at bigint` ms epoch
- `updated_at bigint` ms epoch

### messages
- `id uuid` (PK)
- `user_id uuid` (author, set by trigger from session)
- `value text`
- `i bigint` strictly increasing sequence (`messages_i_seq`)
- `created_at bigint` ms epoch
- `updated_at bigint` ms epoch

### replies
- `id uuid` (PK)
- `message_id uuid` (FK → messages, cascade delete)
- `user_id uuid` (author, set by trigger from session)
- `room_id uuid` (FK → rooms, cascade delete)
- `created_at bigint` ms epoch

### message_reads
- `id uuid` (PK)
- `user_id uuid` (set by trigger from session)
- `room_id uuid` (FK → rooms, cascade delete)
- `last_i bigint` last read message index for this user in this room
- `created_at bigint` / `updated_at bigint`

Triggers update `updated_at` on updates for `rooms`, `messages`, and `message_reads`.

## Permission Model

Permissions are fully enforced in Hasura (see `lib/up-messaging.ts`). Below is the effective behavior.

### Allow-list tokens
All `allow_*_users` JSONB arrays may contain any combination of:
- A concrete user UUID string
- The literal string `"user"` – any authenticated user
- The literal string `"anonymous"` – unauthenticated access

You can therefore target individuals by UUIDs, open a capability to all logged-in users via `"user"`, or make it public with `"anonymous"`.

### Rooms
- Select (role `user`): unrestricted (`filter: {}`)
- Select (role `anonymous`): only rooms with `allow_select_users` containing `"anonymous"`
- Insert (role `user`): allowed, `user_id` is set from session; may set: `id`, `title`, and all `allow_*_users`
- Anonymous cannot insert

### Messages
- Select (role `user`):
  - Author can always see own messages; OR
  - Messages linked via `replies` to rooms where `allow_select_users` contains the viewing user UUID or `"user"`.
- Select (role `anonymous`):
  - Messages linked to rooms where `allow_select_users` contains `"anonymous"`.
- Insert (role `user`): allowed with columns `id`, `value`. `user_id` is set by trigger.
- Update/Delete (role `user`): allowed only if BOTH are true:
  - The updater is the author (`user_id = X-Hasura-User-Id`); AND
  - For every room linked by `replies`, that room’s `allow_change_users` contains the updater’s UUID or `"user"`.

Implication: if a message is linked to multiple rooms, all of those rooms must allow change; otherwise the update/delete affects 0 rows. This is verified by tests.

### Replies
- Select (role `user`): author’s own replies; OR replies in rooms whose `allow_select_users` contains viewer UUID or `"user"`.
- Select (role `anonymous`): replies in rooms whose `allow_select_users` contains `"anonymous"`.
- Insert (role `user`): allowed only if the target room’s `allow_reply_users` contains the inserter’s UUID or `"user"` or `"anonymous"`.
- Update: disabled (no columns permitted; attempts will fail).
- Delete (role `user`): permitted if any of the following is true:
  - The deleter is the reply author; OR
  - The room’s `allow_delete_users` contains the deleter’s UUID or `"user"`; OR
  - The room’s `allow_remove_users` contains the deleter’s UUID or `"user"`.

Note: both `allow_remove_users` and `allow_delete_users` grant the ability to delete replies regardless of authorship in the current implementation. Use `allow_remove_users` for “moderated cleanup” semantics and `allow_delete_users` for broader moderator powers as needed.

### message_reads
- Select (role `user`): only own rows
- Insert/Update (role `user`): allowed; `user_id` is set by trigger; may update `last_i`

## Typical Flows

### Create a room (authenticated user)
```graphql
mutation CreateRoom($id: uuid!, $title: String!) {
  insert_rooms_one(object: {
    id: $id,
    title: $title,
    allow_select_users: ["user"],
    allow_reply_users: ["user"],
    allow_change_users: [],
    allow_remove_users: [],
    allow_delete_users: []
  }) { id user_id title }
}
```

### Post a message and link it to a room
```graphql
mutation PostMessage($msgId: uuid!, $roomId: uuid!) {
  insert_messages_one(object: { id: $msgId, value: "Hello" }) { id i user_id }
  insert_replies_one(object: { id: "<new-uuid>", message_id: $msgId, room_id: $roomId }) { id }
}
```

### Update a message (requires author AND all linked rooms allow change)
```graphql
mutation UpdateMessage($id: uuid!) {
  update_messages(where: { id: { _eq: $id } }, _set: { value: "Updated" }) {
    affected_rows
    returning { id value }
  }
}
```

### Delete a reply (author or allowed by room)
```graphql
mutation DeleteReply($id: uuid!) {
  delete_replies(where: { id: { _eq: $id } }) {
    affected_rows
  }
}
```

## Real-time Streaming

Use Hasura’s native streaming with the `i` sequence to receive new messages after a cursor:
```graphql
subscription StreamMessages($room_id: uuid!, $cursor: [messages_stream_cursor_input!]!) {
  messages_stream(
    batch_size: 5,
    cursor: $cursor,
    where: { replies: { room_id: { _eq: $room_id } } }
  ) {
    id
    value
    i
    user_id
  }
}
```
Cursor example: `[{ initial_value: { i: 12345 }, ordering: ASC }]`.

## Migrations

Messaging schema is provided as an idempotent migration wired to the Hasyx CLI:
- Up: `migrations/1754300000000-hasyx-messaging/up.ts` → `lib/up-messaging.ts`
- Down: `migrations/1754300000000-hasyx-messaging/down.ts` → `lib/down-messaging.ts`

Apply and rollback with the CLI:
```bash
npx hasyx migrate messaging
npx hasyx unmigrate messaging
```

## Testing

See `lib/messaging.test.ts` for end-to-end tests that validate:
- Anonymous cannot create rooms
- Authenticated users can create rooms
- Reply creation is gated by `allow_reply_users`
- Visibility follows `allow_select_users`
- Message editing requires author AND that all linked rooms allow change
- Replies cannot be updated and can be deleted by author or allowed room roles
- Streaming subscription emits new messages after the `i` cursor

## Tips

- When in doubt, model access via the room: link messages to one or more rooms using `replies`, and drive visibility and mutability from the room’s allow-lists.
- Remember that `allow_*_users` accept user UUIDs, `"user"` for all authenticated users, and `"anonymous"` for public access.
- Linking a message to multiple rooms strengthens constraints: all linked rooms must permit change for updates/deletes to succeed.



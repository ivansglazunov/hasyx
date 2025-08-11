import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

import { createApolloClient } from './apollo/apollo';
import { Generator } from './generator';
import { Hasyx } from './hasyx/hasyx';
import schema from '../public/hasura-schema.json';
import Debug from './debug';
import { hashPassword } from './users/auth-server';
import { gql } from '@apollo/client/core';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const debug = Debug('test:messaging');

const generate = Generator(schema as any);

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;

// Helper to build an admin-level Hasyx instance
function createAdminHasyx(): Hasyx {
  const apollo = createApolloClient({ url: HASURA_URL, secret: ADMIN_SECRET, ws: false });
  return new Hasyx(apollo as any, generate);
}

async function createTestUser(adminH: Hasyx, suffix: string) {
  const email = `msg-test-${uuidv4()}${suffix}@example.com`;
  const password = await hashPassword('password123');
  const inserted = await adminH.insert({
    table: 'users',
    object: { email, password, name: `Msg Test User ${suffix}`, hasura_role: 'user' },
    returning: ['id', 'name'],
  });
  return inserted;
}

// Custom matcher for timestamp proximity
expect.extend({
  toBeAround(received: number, expected: number, precision = 4000) {
    const pass = Math.abs(received - expected) <= precision;
    return {
      message: () =>
        pass
          ? `expected ${received} not to be around ${expected}`
          : `expected ${received} to be around ${expected} (±${precision})`,
      pass,
    } as any;
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAround(expected: number, precision?: number): R;
    }
  }
}

describe('Messaging module (skeleton)', () => {
  const notImpl = () => { throw new Error('NOT_IMPLEMENTED'); };

  describe('Rooms', () => {
    it('anonymous cannot create room', async () => {
      const adminH = createAdminHasyx();

      // Anonymous client
      const anonApollo = createApolloClient({ url: HASURA_URL, ws: false });
      const anonH = new Hasyx(anonApollo as any, generate);

      const roomId = uuidv4();
      await expect(
        anonH.insert({
          table: 'rooms',
          object: {
            id: roomId,
            title: 'Anon room',
            allow_select_users: ['anonymous'],
          },
          returning: ['id'],
          role: 'anonymous',
        })
      ).rejects.toThrow();

      anonH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);

    it('user can create room', async () => {
      const adminH = createAdminHasyx();
      const user = await createTestUser(adminH, 'room-owner');

      const { hasyx: userH } = await adminH._authorize(user.id, { ws: false });

      const roomId = uuidv4();
      const inserted = await userH.insert({
        table: 'rooms',
        object: {
          id: roomId,
          title: 'Test Room',
          allow_select_users: ['user'],
        },
        returning: ['id', 'user_id', 'title'],
      });

      expect(inserted.id).toBe(roomId);
      expect(inserted.user_id).toBe(user.id);

      // Clean up
      await adminH.delete({ table: 'rooms', pk_columns: { id: roomId } });
      await adminH.delete({ table: 'users', pk_columns: { id: user.id } });

      userH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);
  });

  describe('Messages', () => {
    it('user can create message in room (allow_reply)', async () => {
      const adminH = createAdminHasyx();
      const user = await createTestUser(adminH, 'msg-creator');
      const { hasyx: userH } = await adminH._authorize(user.id, { ws: false });

      // Create room with allow_reply_users: ['user']
      const roomId = uuidv4();
      await adminH.insert({
        table: 'rooms',
        object: {
          id: roomId,
          user_id: user.id,
          title: 'Test Room',
          allow_reply_users: ['user'],
          allow_select_users: ['user'],
        },
        returning: ['id'],
      });

      // Create message
      const messageId = uuidv4();
      const message = await userH.insert({
        table: 'messages',
        object: {
          id: messageId,
          value: 'Hello world',
        },
        returning: ['id', 'user_id', 'value'],
      });

      expect(message.id).toBe(messageId);
      expect(message.user_id).toBe(user.id);
      expect(message.value).toBe('Hello world');

      // Create reply linking message to room
      const replyId = uuidv4();
      const reply = await userH.insert({
        table: 'replies',
        object: {
          id: replyId,
          message_id: messageId,
          room_id: roomId,
        },
        returning: ['id', 'message_id', 'room_id'],
      });

      expect(reply.id).toBe(replyId);
      expect(reply.message_id).toBe(messageId);
      expect(reply.room_id).toBe(roomId);

      // Clean up
      await adminH.delete({ table: 'replies', pk_columns: { id: replyId } });
      await adminH.delete({ table: 'messages', pk_columns: { id: messageId } });
      await adminH.delete({ table: 'rooms', pk_columns: { id: roomId } });
      await adminH.delete({ table: 'users', pk_columns: { id: user.id } });

      userH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);

    it('user cannot edit message without allow_change', async () => {
      const adminH = createAdminHasyx();
      const author = await createTestUser(adminH, 'author');
      const editor = await createTestUser(adminH, 'editor');
      const { hasyx: authorH } = await adminH._authorize(author.id, { ws: false });
      const { hasyx: editorH } = await adminH._authorize(editor.id, { ws: false });

      // Create room without allow_change_users for editor
      const roomId = uuidv4();
      await adminH.insert({
        table: 'rooms',
        object: {
          id: roomId,
          user_id: author.id,
          title: 'No Change Room',
          allow_select_users: ['user'],
          allow_reply_users: ['user'],
          allow_change_users: [], // No change allowed
        },
        returning: ['id'],
      });

      // Create message
      const messageId = uuidv4();
      const message = await authorH.insert({
        table: 'messages',
        object: {
          id: messageId,
          value: 'Original message',
        },
        returning: ['id'],
      });

      // Create reply linking message to room
      await authorH.insert({
        table: 'replies',
        object: {
          id: uuidv4(),
          message_id: messageId,
          room_id: roomId,
        },
        returning: ['id'],
      });

      // Editor cannot update message
      await expect(
        editorH.update({
          table: 'messages',
          _set: { value: 'Hacked message' },
          where: { id: { _eq: messageId } },
          returning: ['id'],
        })
      ).resolves.toMatchObject({ affected_rows: 0 });

      // Clean up
      await adminH.delete({ table: 'replies', where: { message_id: { _eq: messageId } } });
      await adminH.delete({ table: 'messages', pk_columns: { id: messageId } });
      await adminH.delete({ table: 'rooms', pk_columns: { id: roomId } });
      await adminH.delete({ table: 'users', pk_columns: { id: author.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: editor.id } });

      authorH.apolloClient.terminate?.();
      editorH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);

    it('user can edit own message when allow_change permits', async () => {
      const adminH = createAdminHasyx();
      const author = await createTestUser(adminH, 'author');
      const { hasyx: authorH } = await adminH._authorize(author.id, { ws: false });

      // Create room with allow_change_users: ['user']
      const roomId = uuidv4();
      await adminH.insert({
        table: 'rooms',
        object: {
          id: roomId,
          user_id: author.id,
          title: 'Change Allowed Room',
          allow_select_users: ['user'],
          allow_reply_users: ['user'],
          allow_change_users: ['user'], // Change allowed
        },
        returning: ['id'],
      });

      // Create message
      const messageId = uuidv4();
      const message = await authorH.insert({
        table: 'messages',
        object: {
          id: messageId,
          value: 'Original message',
        },
        returning: ['id'],
      });

      // Create reply linking message to room
      await authorH.insert({
        table: 'replies',
        object: {
          id: uuidv4(),
          message_id: messageId,
          room_id: roomId,
        },
        returning: ['id'],
      });

      // Author can update message
      const updateResult = await authorH.update({
        table: 'messages',
        _set: { value: 'Updated message' },
        where: { id: { _eq: messageId } },
        returning: ['id', 'value'],
      });

      expect(updateResult.returning).toHaveLength(1);
      expect(updateResult.returning[0].value).toBe('Updated message');

      // Clean up
      await adminH.delete({ table: 'replies', where: { message_id: { _eq: messageId } } });
      await adminH.delete({ table: 'messages', pk_columns: { id: messageId } });
      await adminH.delete({ table: 'rooms', pk_columns: { id: roomId } });
      await adminH.delete({ table: 'users', pk_columns: { id: author.id } });

      authorH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);

    it('visibility follows allow_select rules', async () => {
      const adminH = createAdminHasyx();
      const author = await createTestUser(adminH, 'author');
      const viewer = await createTestUser(adminH, 'viewer');
      const { hasyx: authorH } = await adminH._authorize(author.id, { ws: false });
      const { hasyx: viewerH } = await adminH._authorize(viewer.id, { ws: false });

      // Create room with allow_select_users: ['user']
      const roomId = uuidv4();
      await adminH.insert({
        table: 'rooms',
        object: {
          id: roomId,
          user_id: author.id,
          title: 'Select Allowed Room',
          allow_select_users: ['user'],
          allow_reply_users: ['user'],
        },
        returning: ['id'],
      });

      // Create message
      const messageId = uuidv4();
      await authorH.insert({
        table: 'messages',
        object: {
          id: messageId,
          value: 'Visible message',
        },
        returning: ['id'],
      });

      // Create reply linking message to room
      await authorH.insert({
        table: 'replies',
        object: {
          id: uuidv4(),
          message_id: messageId,
          room_id: roomId,
        },
        returning: ['id'],
      });

      // Viewer can see message
      const messages = await viewerH.select({
        table: 'messages',
        where: { id: { _eq: messageId } },
        returning: ['id', 'value'],
      });

      expect(messages).toHaveLength(1);
      expect(messages[0].value).toBe('Visible message');

      // Clean up
      await adminH.delete({ table: 'replies', where: { message_id: { _eq: messageId } } });
      await adminH.delete({ table: 'messages', pk_columns: { id: messageId } });
      await adminH.delete({ table: 'rooms', pk_columns: { id: roomId } });
      await adminH.delete({ table: 'users', pk_columns: { id: author.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: viewer.id } });

      authorH.apolloClient.terminate?.();
      viewerH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);

    it('editing requires all rooms to allow change', async () => {
      const adminH = createAdminHasyx();
      const author = await createTestUser(adminH, 'author');
      const { hasyx: authorH } = await adminH._authorize(author.id, { ws: false });

      // Create two rooms - one allows change, one doesn't
      const room1Id = uuidv4();
      const room2Id = uuidv4();
      
      await adminH.insert({
        table: 'rooms',
        object: {
          id: room1Id,
          user_id: author.id,
          title: 'Change Allowed Room',
          allow_select_users: ['user'],
          allow_reply_users: ['user'],
          allow_change_users: ['user'], // Change allowed
        },
        returning: ['id'],
      });

      await adminH.insert({
        table: 'rooms',
        object: {
          id: room2Id,
          user_id: author.id,
          title: 'No Change Room',
          allow_select_users: ['user'],
          allow_reply_users: ['user'],
          allow_change_users: [], // No change allowed
        },
        returning: ['id'],
      });

      // Create message
      const messageId = uuidv4();
      await authorH.insert({
        table: 'messages',
        object: {
          id: messageId,
          value: 'Original message',
        },
        returning: ['id'],
      });

      // Create replies linking message to both rooms
      await authorH.insert({
        table: 'replies',
        object: {
          id: uuidv4(),
          message_id: messageId,
          room_id: room1Id,
        },
        returning: ['id'],
      });

      await authorH.insert({
        table: 'replies',
        object: {
          id: uuidv4(),
          message_id: messageId,
          room_id: room2Id,
        },
        returning: ['id'],
      });

      // Author cannot update message because one room doesn't allow change
      await expect(
        authorH.update({
          table: 'messages',
          _set: { value: 'Updated message' },
          where: { id: { _eq: messageId } },
          returning: ['id'],
        })
      ).resolves.toMatchObject({ affected_rows: 0 });

      // Clean up
      await adminH.delete({ table: 'replies', where: { message_id: { _eq: messageId } } });
      await adminH.delete({ table: 'messages', pk_columns: { id: messageId } });
      await adminH.delete({ table: 'rooms', pk_columns: { id: room1Id } });
      await adminH.delete({ table: 'rooms', pk_columns: { id: room2Id } });
      await adminH.delete({ table: 'users', pk_columns: { id: author.id } });

      authorH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);
  });

  describe('Replies', () => {
    it('user can reply when allow_reply permits', async () => {
      const adminH = createAdminHasyx();
      const user = await createTestUser(adminH, 'replier');
      const { hasyx: userH } = await adminH._authorize(user.id, { ws: false });

      // Create room with allow_reply_users: ['user']
      const roomId = uuidv4();
      await adminH.insert({
        table: 'rooms',
        object: {
          id: roomId,
          user_id: user.id,
          title: 'Reply Allowed Room',
          allow_reply_users: ['user'],
          allow_select_users: ['user'],
        },
        returning: ['id'],
      });

      // Create message
      const messageId = uuidv4();
      await adminH.insert({
        table: 'messages',
        object: {
          id: messageId,
          value: 'Original message',
        },
        returning: ['id'],
      });

      // User can create reply
      const replyId = uuidv4();
      const reply = await userH.insert({
        table: 'replies',
        object: {
          id: replyId,
          message_id: messageId,
          room_id: roomId,
        },
        returning: ['id', 'message_id', 'room_id'],
      });

      expect(reply.id).toBe(replyId);
      expect(reply.message_id).toBe(messageId);
      expect(reply.room_id).toBe(roomId);

      // Clean up
      await adminH.delete({ table: 'replies', pk_columns: { id: replyId } });
      await adminH.delete({ table: 'messages', pk_columns: { id: messageId } });
      await adminH.delete({ table: 'rooms', pk_columns: { id: roomId } });
      await adminH.delete({ table: 'users', pk_columns: { id: user.id } });

      userH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);

    it('user can remove own reply when allow_remove permits', async () => {
      const adminH = createAdminHasyx();
      const user = await createTestUser(adminH, 'remover');
      const { hasyx: userH } = await adminH._authorize(user.id, { ws: false });

      // Create room with allow_remove_users: ['user']
      const roomId = uuidv4();
      await adminH.insert({
        table: 'rooms',
        object: {
          id: roomId,
          user_id: user.id,
          title: 'Remove Allowed Room',
          allow_remove_users: ['user'],
          allow_select_users: ['user'],
        },
        returning: ['id'],
      });

      // Create message and reply
      const messageId = uuidv4();
      await adminH.insert({
        table: 'messages',
        object: {
          id: messageId,
          value: 'Original message',
        },
        returning: ['id'],
      });

      const replyId = uuidv4();
      await userH.insert({
        table: 'replies',
        object: {
          id: replyId,
          message_id: messageId,
          room_id: roomId,
        },
        returning: ['id'],
      });

      // User can delete own reply
      const deleteResult = await userH.delete({
        table: 'replies',
        where: { id: { _eq: replyId } },
        returning: ['id'],
      });

      expect(deleteResult.affected_rows).toBe(1);
      expect(deleteResult.returning).toHaveLength(1);

      // Clean up
      await adminH.delete({ table: 'replies', pk_columns: { id: replyId } });
      await adminH.delete({ table: 'messages', pk_columns: { id: messageId } });
      await adminH.delete({ table: 'rooms', pk_columns: { id: roomId } });
      await adminH.delete({ table: 'users', pk_columns: { id: user.id } });

      userH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);

    it('user with allow_delete can remove any reply', async () => {
      const adminH = createAdminHasyx();
      const author = await createTestUser(adminH, 'author');
      const deleter = await createTestUser(adminH, 'deleter');
      const { hasyx: authorH, jwt: authorJwt } = await adminH._authorize(author.id, { ws: false });
      const { hasyx: deleterH, jwt: deleterJwt } = await adminH._authorize(deleter.id, { ws: false });

      // Create room with allow_delete_users: ['user']
      const roomId = uuidv4();
      await adminH.insert({
        table: 'rooms',
        object: {
          id: roomId,
          user_id: author.id,
          title: 'Delete Allowed Room',
          allow_delete_users: ['user'],
          allow_select_users: ['user'],
        },
        returning: ['id'],
      });

      // Create message and reply by author
      const messageId = uuidv4();
      await adminH.insert({
        table: 'messages',
        object: {
          id: messageId,
          value: 'Original message',
        },
        returning: ['id'],
      });

      const replyId = uuidv4();
      await adminH.insert({
        table: 'replies',
        object: {
          id: replyId,
          message_id: messageId,
          room_id: roomId,
        },
        returning: ['id'],
      });

      // Deleter can delete any reply
      const deleteResult = await deleterH.delete({
        table: 'replies',
        where: { id: { _eq: replyId } },
        returning: ['id'],
      });

      expect(deleteResult.affected_rows).toBe(1);
      expect(deleteResult.returning).toHaveLength(1);

      // Clean up
      await adminH.delete({ table: 'replies', pk_columns: { id: replyId } });
      await adminH.delete({ table: 'messages', pk_columns: { id: messageId } });
      await adminH.delete({ table: 'rooms', pk_columns: { id: roomId } });
      await adminH.delete({ table: 'users', pk_columns: { id: author.id } });
      await adminH.delete({ table: 'users', pk_columns: { id: deleter.id } });

      authorH.apolloClient.terminate?.();
      deleterH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);

    it('update on replies is forbidden', async () => {
      const adminH = createAdminHasyx();
      const user = await createTestUser(adminH, 'updater');
      const { hasyx: userH } = await adminH._authorize(user.id, { ws: false });

      // Create room
      const roomId = uuidv4();
      await adminH.insert({
        table: 'rooms',
        object: {
          id: roomId,
          user_id: user.id,
          title: 'Test Room',
          allow_select_users: ['user'],
        },
        returning: ['id'],
      });

      // Create message and reply
      const messageId = uuidv4();
      await adminH.insert({
        table: 'messages',
        object: {
          id: messageId,
          value: 'Original message',
        },
        returning: ['id'],
      });

      const replyId = uuidv4();
      await userH.insert({
        table: 'replies',
        object: {
          id: replyId,
          message_id: messageId,
          room_id: roomId,
        },
        returning: ['id'],
      });

      // Update should fail (no permission)
      await expect(
        userH.update({
          table: 'replies',
          _set: { message_id: uuidv4() },
          where: { id: { _eq: replyId } },
          returning: ['id'],
        })
      ).rejects.toThrow();

      // Clean up
      await adminH.delete({ table: 'replies', pk_columns: { id: replyId } });
      await adminH.delete({ table: 'messages', pk_columns: { id: messageId } });
      await adminH.delete({ table: 'rooms', pk_columns: { id: roomId } });
      await adminH.delete({ table: 'users', pk_columns: { id: user.id } });

      userH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 30000);


  });

    // ❗ Real Hasura streaming subscription test (WebSocket)
    it('streaming subscription emits new messages after cursor', async () => {
      const adminH = createAdminHasyx();
      const user = await createTestUser(adminH, 'stream');
      const { hasyx: userH } = await adminH._authorize(user.id, { ws: true });

      // Create room
      const roomId = uuidv4();
      await adminH.insert({
        table: 'rooms',
        object: {
          id: roomId,
          user_id: user.id,
          title: 'Stream Room',
          allow_select_users: ['user'],
          allow_reply_users: ['user'],
        },
      });

      // Insert initial message (i1)
      const msg1Id = uuidv4();
      const msg1 = await userH.insert({
        table: 'messages',
        object: { id: msg1Id, value: 'Hello 1' },
        returning: ['i'],
      });
      // console.log('📝 Created msg1 with i:', msg1.i);
      await userH.insert({
        table: 'replies',
        object: { id: uuidv4(), message_id: msg1Id, room_id: roomId },
      });

      const SUB_QUERY = gql`
        subscription ($room_id: uuid!, $cursor: [messages_stream_cursor_input!]!) {
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
      `;

      const sub$ = userH.apolloClient.subscribe({
        query: SUB_QUERY,
        variables: {
          room_id: roomId,
          cursor: [{ initial_value: { i: msg1.i }, ordering: "ASC" }],
        },
      });

      const received: any[] = [];
      let subscription: any;

      const subPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          subscription?.unsubscribe();
          reject(new Error('subscription timeout'));
        }, 5000);
        
        subscription = sub$.subscribe({
          next: (data) => {
            // console.log('📨 Received message:', data.data.messages_stream[0]);
            received.push(data.data.messages_stream[0]);
            if (received.length === 1) {
              clearTimeout(timeout);
              subscription?.unsubscribe();
              resolve();
            }
          },
          error: (error) => {
            console.error('❌ Subscription error:', error);
            clearTimeout(timeout);
            subscription?.unsubscribe();
            reject(error);
          },
        });
      });

      // Insert new message (i2) that should be streamed
      const msg2Id = uuidv4();
      const msg2 = await userH.insert({
        table: 'messages',
        object: { id: msg2Id, value: 'Hello 2' },
        returning: ['i'],
      });
      // console.log('📝 Created msg2 with i:', msg2.i);
      await userH.insert({
        table: 'replies',
        object: { id: uuidv4(), message_id: msg2Id, room_id: roomId },
      });

      await subPromise; // wait for subscription to emit

      expect(received).toHaveLength(1);
      expect(received[0].value).toBe('Hello 2');

      // cleanup
      await adminH.delete({ table: 'replies', where: { room_id: { _eq: roomId } } });
      await adminH.delete({ table: 'messages', where: { id: { _in: [msg1Id, msg2Id] } } });
      await adminH.delete({ table: 'rooms', pk_columns: { id: roomId } });
      await adminH.delete({ table: 'users', pk_columns: { id: user.id } });

      userH.apolloClient.terminate?.();
      adminH.apolloClient.terminate?.();
    }, 20000);
}); 
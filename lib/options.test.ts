import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { createApolloClient } from './apollo/apollo';
import { Hasyx } from './hasyx/hasyx';
import { Generator } from './generator';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import schema from '../public/hasura-schema.json';
import { createTestUser } from './create-test-user';
import { processConfiguredValidationDefine } from './validation';
import { gql } from '@apollo/client/core';

// Ensure environment variables are loaded for Jest
dotenv.config();

(!!+(process?.env?.JEST_LOCAL || '') ? describe.skip : describe)('options table + validation', () => {
  // ВАЖНО: по правилам проекта каждый it сам себе готовит окружение и чистит за собой
  // Здесь никаких before/after не используем

  it('should support user options with valid item_id', async () => {
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    const user = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });

    // Create target user to use as item_id
    const targetUser = await createTestUser();

    // Test user option (fio)
    const inserted = await userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'fio', 
        item_id: targetUser.id,
        string_value: 'Иван Иванович Петров' 
      },
      returning: ['id', 'key', 'string_value', 'user_id', 'item_id']
    });

    expect(inserted?.key).toBe('fio');
    expect(inserted?.string_value).toBe('Иван Иванович Петров');
    expect(inserted?.item_id).toBe(targetUser.id);

    const rows = await userClient.select<any[]>({
      table: 'options',
      where: { 
        key: { _eq: 'fio' },
        item_id: { _eq: targetUser.id }
      },
      returning: ['key', 'string_value', 'item_id']
    });

    const row = Array.isArray(rows) ? rows[0] : rows;
    expect(row?.key).toBe('fio');
    expect(row?.string_value).toBe('Иван Иванович Петров');
    expect(row?.item_id).toBe(targetUser.id);
  }, 30000);
  it('should allow known keys and reject unknown keys', async () => {
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    const user = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });
    const targetUser = await createTestUser();

    // Test valid key using Hasyx insert
    const ok = await userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'displayName', 
        item_id: targetUser.id,
        string_value: 'Иван Петров' 
      },
      returning: ['id', 'key', 'string_value', 'user_id', 'item_id']
    });

    expect(ok?.key).toBe('displayName');
    expect(ok?.string_value).toBe('Иван Петров');
    expect(ok?.item_id).toBe(targetUser.id);

    // Test invalid key should fail due to validation trigger
    await expect(userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'unknown_key', 
        item_id: targetUser.id,
        string_value: 'oops' 
      },
      returning: ['id']
    })).rejects.toBeTruthy();
  }, 30000);

  it('should support complex object type (notifications)', async () => {
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    const user = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });
    const targetUser = await createTestUser();

    const notificationSettings = {
      email: true,
      push: false,
      sms: true
    };

    const inserted = await userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'notifications', 
        item_id: targetUser.id,
        jsonb_value: notificationSettings 
      },
      returning: ['id', 'key', 'jsonb_value', 'user_id', 'item_id']
    });

    expect(inserted?.key).toBe('notifications');
    expect(inserted?.jsonb_value).toEqual(notificationSettings);
    expect(inserted?.item_id).toBe(targetUser.id);

    const rows = await userClient.select<any[]>({
      table: 'options',
      where: { 
        key: { _eq: 'notifications' },
        item_id: { _eq: targetUser.id }
      },
      returning: ['key', 'jsonb_value', 'item_id']
    });
    const row = Array.isArray(rows) ? rows[0] : rows;
    expect(row?.key).toBe('notifications');
    expect(row?.jsonb_value).toEqual(notificationSettings);
  }, 30000);

  it('should prevent duplicate key+item_id combinations', async () => {
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    const user = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });
    const targetUser = await createTestUser();

    // Insert first option
    await userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'displayName', 
        item_id: targetUser.id,
        string_value: 'Первое имя' 
      },
      returning: ['id']
    });

    // Try to insert duplicate - should fail (same key + same item_id)
    await expect(userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'displayName', 
        item_id: targetUser.id,
        string_value: 'Другое имя' 
      },
      returning: ['id']
    })).rejects.toBeTruthy();
  }, 30000);

  it('should reject options with null item_id', async () => {
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    const user = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });

    // Should FAIL: item_id is required (accept any rejection due to Hasura masking)
    await expect(userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'displayName',
        string_value: 'Should fail - no item_id' 
      },
      returning: ['id']
    })).rejects.toBeTruthy();
  }, 30000);

  it('should reject options with non-existent user ID', async () => {
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    const user = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });

    // Generate a fake UUID that doesn't exist in users table
    const fakeUserId = '00000000-0000-0000-0000-000000000000';

    // Should FAIL: item_id doesn't exist in users table (accept any rejection)
    await expect(userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'displayName',
        item_id: fakeUserId,
        string_value: 'Should fail - user not found' 
      },
      returning: ['id']
    })).rejects.toBeTruthy();
  }, 30000);

  it('should reject invalid option keys for users', async () => {
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    const user = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });
    const targetUser = await createTestUser();

    // Test: completely invalid key should fail
    await expect(userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'invalid_key_name',
        item_id: targetUser.id,
        string_value: 'Should Fail' 
      },
      returning: ['id']
    })).rejects.toThrow();

    // Test: another invalid key should fail
    await expect(userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'nonexistent_option',
        item_id: targetUser.id,
        string_value: 'Should Also Fail' 
      },
      returning: ['id']
    })).rejects.toThrow();
  }, 30000);

  it('should test dynamic schema detection with valid users options', async () => {
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    const user = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });
    const targetUser = await createTestUser();

    // Test all valid user options from schema
    const validOptions = [
      { key: 'fio', value: 'Иван Петрович Сидоров' },
      { key: 'displayName', value: 'Ivan P.' },
      { key: 'timezone', value: 'Europe/Moscow' },
    ];

    for (const option of validOptions) {
      const inserted = await userClient.insert<any>({
        table: 'options',
        object: { 
          key: option.key,
          item_id: targetUser.id,
          string_value: option.value
        },
        returning: ['id', 'key', 'string_value', 'item_id']
      });

      expect(inserted?.key).toBe(option.key);
      expect(inserted?.string_value).toBe(option.value);
      expect(inserted?.item_id).toBe(targetUser.id);
    }

    // Test notifications (jsonb_value)
    const notificationsInserted = await userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'notifications',
        item_id: targetUser.id,
        jsonb_value: { email: true, push: false, sms: true }
      },
      returning: ['id', 'key', 'jsonb_value', 'item_id']
    });

    expect(notificationsInserted?.key).toBe('notifications');
    expect(notificationsInserted?.jsonb_value).toEqual({ email: true, push: false, sms: true });
    expect(notificationsInserted?.item_id).toBe(targetUser.id);
  }, 30000);

});



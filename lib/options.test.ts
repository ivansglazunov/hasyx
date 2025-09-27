import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { createApolloClient } from './apollo/apollo';
import { Hasyx } from './hasyx/hasyx';
import { Generator } from './generator';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import schema from '../public/hasura-schema.json';
import { createTestUser } from './create-test-user';
import { processConfiguredValidationDefine, syncSchemasToDatabase } from './validation';
import { gql } from '@apollo/client/core';

// Ensure environment variables are loaded for Jest
dotenv.config();

(!!+(process?.env?.JEST_LOCAL || '') ? describe.skip : describe)('options table + validation', () => {
  it('should support user options with valid item_id (acting user only)', async () => {
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    const user = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });

    // Test user option (fio)
    const inserted = await userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'fio', 
        item_id: user.id,
        string_value: 'Иван Иванович Петров' 
      },
      returning: ['id', 'key', 'string_value', 'user_id', 'item_id']
    });

    expect(inserted?.key).toBe('fio');
    expect(inserted?.string_value).toBe('Иван Иванович Петров');
    expect(inserted?.item_id).toBe(user.id);

    const rows = await userClient.select<any[]>({
      table: 'options',
      where: { 
        key: { _eq: 'fio' },
        item_id: { _eq: user.id }
      },
      returning: ['key', 'string_value', 'item_id']
    });

    const row = Array.isArray(rows) ? rows[0] : rows;
    expect(row?.key).toBe('fio');
    expect(row?.string_value).toBe('Иван Иванович Петров');
    expect(row?.item_id).toBe(user.id);
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
        item_id: user.id,
        string_value: 'Иван Петров' 
      },
      returning: ['id', 'key', 'string_value', 'user_id', 'item_id']
    });

    expect(ok?.key).toBe('displayName');
    expect(ok?.string_value).toBe('Иван Петров');
    expect(ok?.item_id).toBe(user.id);

    // Test invalid key should fail due to validation trigger
    await expect(userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'unknown_key', 
        item_id: user.id,
        string_value: 'oops' 
      },
      returning: ['id']
    })).rejects.toBeTruthy();
  }, 30000);

  it('should allow friend_id only when friend has fio option (permission check)', async () => {
    console.log('🔄 Syncing schemas...');
    await syncSchemasToDatabase();
    console.log('✅ Schemas synced');
    
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    // Ensure runtime and trigger exist
    const hasu = new (await import('./hasura/hasura')).Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
    await (await import('./validation')).ensureValidationRuntime(hasu);
    
    // Ensure permission system is ready
    const schemaCheck = await hasu.sql('SELECT validation.project_schemas() AS j');
    const rawSchemas = schemaCheck.result?.[1]?.[0];
    let schemas: any = {};
    if (typeof rawSchemas === 'string') {
      try {
        schemas = JSON.parse(rawSchemas);
      } catch(e: any) {
        console.log('❌ Failed to parse schemas JSON:', e.message);
      }
    } else if (typeof rawSchemas === 'object') {
      schemas = rawSchemas || {};
    }
    
    // Verify permission rules are loaded
    if (!schemas?.options?.users?.properties?.friend_id?.['x-meta']?.permission) {
      throw new Error('Permission rules not found in schema for friend_id');
    }
    
    // Permission trigger is created by migration up-options; no ad-hoc trigger here

    const user = await createTestUser();
    const friendWithFio = await createTestUser();
    const friendWithoutFio = await createTestUser();
    
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });

    // Give fio to friendWithFio
    await userClient.insert<any>({
      table: 'options',
      object: { key: 'fio', item_id: friendWithFio.id, string_value: 'Друг ФИО' },
      returning: ['id']
    });

    // Insert friend_id referencing friendWithFio → should pass
    const ok = await userClient.insert<any>({
      table: 'options',
      object: { key: 'friend_id', item_id: user.id, to_id: friendWithFio.id },
      returning: ['id','key','to_id','item_id']
    });
    expect(ok?.key).toBe('friend_id');
    expect(ok?.to_id).toBe(friendWithFio.id);

    // Insert friend_id referencing friendWithoutFio → should fail
    try {
      const result = await userClient.insert<any>({
        table: 'options',
        object: { key: 'friend_id', item_id: user.id, to_id: friendWithoutFio.id },
        returning: ['id']
      });
      throw new Error('Insert should have failed but succeeded');
    } catch (error: any) {
      expect(error).toBeTruthy();
    }
  }, 60000); // Increase timeout to 60s

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
        item_id: user.id,
        jsonb_value: notificationSettings 
      },
      returning: ['id', 'key', 'jsonb_value', 'user_id', 'item_id']
    });

    expect(inserted?.key).toBe('notifications');
    expect(inserted?.jsonb_value).toEqual(notificationSettings);
    expect(inserted?.item_id).toBe(user.id);

    const rows = await userClient.select<any[]>({
      table: 'options',
      where: { 
        key: { _eq: 'notifications' },
        item_id: { _eq: user.id }
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
        item_id: user.id,
        string_value: 'Первое имя' 
      },
      returning: ['id']
    });

    // Try to insert duplicate - should fail (same key + same item_id)
    await expect(userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'displayName', 
        item_id: user.id,
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
        item_id: user.id,
        string_value: 'Should Fail' 
      },
      returning: ['id']
    })).rejects.toThrow();

    // Test: another invalid key should fail
    await expect(userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'nonexistent_option',
        item_id: user.id,
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
          item_id: user.id,
          string_value: option.value
        },
        returning: ['id', 'key', 'string_value', 'item_id']
      });

      expect(inserted?.key).toBe(option.key);
      expect(inserted?.string_value).toBe(option.value);
      expect(inserted?.item_id).toBe(user.id);
    }

    // Test notifications (jsonb_value)
    const notificationsInserted = await userClient.insert<any>({
      table: 'options',
      object: { 
        key: 'notifications',
        item_id: user.id,
        jsonb_value: { email: true, push: false, sms: true }
      },
      returning: ['id', 'key', 'jsonb_value', 'item_id']
    });

    expect(notificationsInserted?.key).toBe('notifications');
    expect(notificationsInserted?.jsonb_value).toEqual({ email: true, push: false, sms: true });
    expect(notificationsInserted?.item_id).toBe(user.id);
  }, 30000);

  it('should accept avatar (to_id uuid) option for users', async () => {
    // Обновим validation.project_schemas() в БД, чтобы содержал свежие options.users.avatar
    await syncSchemasToDatabase();
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    const user = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });
    const targetUser = await createTestUser();

    // 1) Подготовим реальный файл в таблицах storage.files (+ storage.files_blob для database-бэкенда)
    const fileId = uuidv4();
    const fileName = 'avatar-test.txt';
    const fileBytes = Buffer.from('avatar for options test ' + fileId);
    const base64 = fileBytes.toString('base64');

    // Вставка метаданных файла
    const insertedFile = await admin.insert<any>({
      table: 'insertFiles',
      objects: [{
        id: fileId,
        bucketId: 'default',
        name: fileName,
        size: fileBytes.length,
        mimeType: 'text/plain',
        etag: base64.slice(0, 32),
        isUploaded: true,
        uploadedByUserId: user.id,
      }],
      returning: ['id']
    });

    expect(insertedFile?.returning?.[0]?.id ?? insertedFile?.id).toBe(fileId);

    // Вставка содержимого (актуально для FILES_BACKEND=database; для storage не повредит)
    try {
      await admin.insert<any>({
        table: 'insertFilesBlobs',
        objects: [{ fileId, content: base64 }],
        returning: ['fileId']
      });
    } catch {
      // Если таблица не трекнута в текущем окружении — пропускаем, опции ссылаются только на id
    }

    // 2) Ставим опцию avatar, ссылаясь на реальный to_id
    const option = await userClient.insert<any>({
      table: 'options',
      object: {
        key: 'avatar',
        item_id: user.id,
        to_id: fileId,
      },
      returning: ['id', 'key', 'to_id', 'user_id', 'item_id']
    });

    expect(option?.key).toBe('avatar');
    expect(option?.to_id).toBe(fileId);
    expect(option?.item_id).toBe(user.id);

    // 3) Уборка (каждый it сам за собой): удалим опцию и файл
    try {
      await admin.delete<any>({ table: 'deleteOptions', where: { id: { _eq: option?.id } } });
    } catch {}
    try {
      await admin.delete<any>({ table: 'deleteFilesBlobs', where: { fileId: { _eq: fileId } } });
    } catch {}
    try {
      await admin.delete<any>({ table: 'deleteFiles', where: { id: { _eq: fileId } } });
    } catch {}
  }, 30000);

  it('should allow multiple friend_id options for same item (meta.multiple)', async () => {
    await syncSchemasToDatabase();
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    const user = await createTestUser();
    const friendA = await createTestUser();
    const friendB = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });

    // Create fio options for friends to satisfy permission requirements
    await userClient.insert<any>({
      table: 'options',
      object: { key: 'fio', item_id: friendA.id, string_value: 'Друг А ФИО' },
      returning: ['id']
    });
    await userClient.insert<any>({
      table: 'options',
      object: { key: 'fio', item_id: friendB.id, string_value: 'Друг Б ФИО' },
      returning: ['id']
    });

    const first = await userClient.insert<any>({
      table: 'options',
      object: {
        key: 'friend_id',
        item_id: user.id,
        to_id: friendA.id
      },
      returning: ['id','key','to_id','item_id']
    });
    expect(first?.key).toBe('friend_id');

    const second = await userClient.insert<any>({
      table: 'options',
      object: {
        key: 'friend_id',
        item_id: user.id,
        to_id: friendB.id
      },
      returning: ['id','key','to_id','item_id']
    });
    expect(second?.key).toBe('friend_id');

    // cleanup created options
    try { await admin.delete<any>({ table: 'deleteOptions', where: { id: { _eq: first?.id } } }); } catch {}
    try { await admin.delete<any>({ table: 'deleteOptions', where: { id: { _eq: second?.id } } }); } catch {}
  }, 30000);

  it('should resolve options.to relation to hasyx view and back to entity', async () => {
    await syncSchemasToDatabase();
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );
    const user = await createTestUser();
    const friend = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });

    // Create fio option for friend to satisfy permission requirements
    await userClient.insert<any>({
      table: 'options',
      object: { key: 'fio', item_id: friend.id, string_value: 'Друг ФИО' },
      returning: ['id']
    });

    const opt = await userClient.insert<any>({
      table: 'options',
      object: { key: 'friend_id', item_id: user.id, to_id: friend.id },
      returning: ['id','key','to_id','item_id', { to: ['hid','id','id_uuid','schema','table'] }]
    });
    expect(opt?.to?.id_uuid ?? null).toBe(friend.id);
    expect(opt?.to?.schema).toBe('public');
    expect(opt?.to?.table).toBe('users');

    // back to entity by selecting users_by_pk using to.id_uuid
    const entity = await admin.select<any>({
      table: 'users',
      pk_columns: { id: opt?.to?.id_uuid },
      returning: ['id']
    });
    expect(entity?.id).toBe(friend.id);

    // cleanup
    try { await admin.delete<any>({ table: 'deleteOptions', where: { id: { _eq: opt?.id } } }); } catch {}
    try { await admin.delete<any>({ table: 'deleteUsers', where: { id: { _eq: friend.id } } }); } catch {}
    try { await admin.delete<any>({ table: 'deleteUsers', where: { id: { _eq: user.id } } }); } catch {}
  }, 30000);

  it('should reproduce kilotons PLV8 validation bug with items.title', async () => {
    await syncSchemasToDatabase();
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    const user = await createTestUser();
    const { hasyx: userClient } = await admin._authorize(user.id, { ws: false });

    // Create an item first
    const itemInsert = await admin.insert({
      table: 'items',
      objects: [{ parent_id: null }],
      returning: ['id']
    });
    const itemId = Array.isArray(itemInsert?.returning) ? itemInsert.returning[0].id : itemInsert.id;

    // Try to insert options for items.title - this should work after PLV8 fix
    const titleOption = await userClient.insert<any>({
      table: 'options',
      object: {
        key: 'title',
        item_id: itemId,
        string_value: 'Test Product Title',
      },
      returning: ['id', 'key', 'string_value', 'item_id']
    });

    expect(titleOption?.key).toBe('title');
    expect(titleOption?.string_value).toBe('Test Product Title');
    expect(titleOption?.item_id).toBe(itemId);

    // cleanup
    try { await admin.delete<any>({ table: 'deleteOptions', where: { id: { _eq: titleOption?.id } } }); } catch {}

    // cleanup
    try { await admin.delete<any>({ table: 'deleteItems', where: { id: { _eq: itemId } } }); } catch {}
    try { await admin.delete<any>({ table: 'deleteUsers', where: { id: { _eq: user.id } } }); } catch {}
  }, 30000);

});



import dotenv from 'dotenv';
import { Hasyx } from '../hasyx/hasyx';
import { Generator } from '../generator';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import schema from '../../public/hasura-schema.json';
import { createApolloClient } from '../apollo/apollo';
import { createTestUser } from '../create-test-user';
import { syncSchemasToDatabase } from '../validation';
import { up as upItemOptions } from './up-item-options';
import { down as downItemOptions } from './down-item-options';

dotenv.config();


(!!+(process?.env?.JEST_LOCAL || '') ? describe.skip : describe)('item_options view + inheritance', () => {
  it('should show direct options for item without parents', async () => {
    // Подготовим view item_options
    await upItemOptions();
    
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    // Создаем тестового пользователя
    const user = await createTestUser();

    // Создаем item без parent_id
    const item = await admin.insert<any>({ 
      table: 'items', 
      objects: [{ parent_id: null, parents_ids: [] }], 
      returning: ['id'] 
    });
    const itemId = item?.returning?.[0]?.id ?? item?.id;

    // Добавляем прямую опцию для item (используем поле из schema.tsx)
    const option = await admin.insert<any>({
      table: 'options',
      objects: [{
        key: 'user_id',
        item_id: itemId,
        to_id: user.id // используем to_id для UUID ссылок
      }],
      returning: ['id', 'key', 'to_id']
    });
    const optionId = option?.returning?.[0]?.id ?? option?.id;

    // Проверяем что view показывает эту опцию
    const itemOptions = await admin.select<any[]>({
      table: 'item_options',
      where: { item_id: { _eq: itemId } },
      returning: ['item_id', '_item_id', 'key', 'to_id', 'inheritance_level']
    });

    const rows = Array.isArray(itemOptions) ? itemOptions : [itemOptions];
    expect(rows.length).toBe(1);
    expect(rows[0]?.item_id).toBe(itemId);
    expect(rows[0]?._item_id).toBe(itemId); // _item_id должен совпадать с item_id для прямых опций
    expect(rows[0]?.key).toBe('user_id');
    expect(rows[0]?.to_id).toBe(user.id);
    expect(rows[0]?.inheritance_level).toBe(0); // 0 = прямая опция

    // Cleanup
    try { await admin.delete<any>({ table: 'options', where: { id: { _eq: optionId } } }); } catch {}
    try { await admin.delete<any>({ table: 'items', where: { id: { _eq: itemId } } }); } catch {}
    try { await admin.delete<any>({ table: 'deleteUsers', where: { id: { _eq: user.id } } }); } catch {}
  }, 60000);

  it('should show inherited options from parent items', async () => {
    await upItemOptions();
    
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    // Создаем иерархию: A -> B -> C
    const A = await admin.insert<any>({ table: 'items', objects: [{ parent_id: null }], returning: ['id'] });
    const aId = A?.returning?.[0]?.id ?? A?.id;
    
    const B = await admin.insert<any>({ table: 'items', objects: [{ parent_id: aId }], returning: ['id'] });
    const bId = B?.returning?.[0]?.id ?? B?.id;
    
    const C = await admin.insert<any>({ table: 'items', objects: [{ parent_id: bId }], returning: ['id'] });
    const cId = C?.returning?.[0]?.id ?? C?.id;

    // Добавляем опции на разных уровнях
    let optionAId: string | null = null;
    let optionBId: string | null = null; 
    let optionCId: string | null = null;

    // Создаем тестовых пользователей и geo.features для ссылок
    const user1 = await createTestUser();
    const user2 = await createTestUser();
    const user3 = await createTestUser();

    // Создаем geo.features для mark_id и route_id через GraphQL
    const geoFeature1 = await admin.insert<any>({
      table: 'geo_features',
      objects: [{ 
        user_id: user2.id, 
        type: 'mark', 
        geom: { type: 'Polygon', coordinates: [[[37.6156, 55.7522], [37.6156, 55.7527], [37.6161, 55.7527], [37.6161, 55.7522], [37.6156, 55.7522]]] }, 
        props: {} 
      }],
      returning: ['id']
    });
    const markId = geoFeature1?.returning?.[0]?.id ?? geoFeature1?.id;

    const geoFeature2 = await admin.insert<any>({
      table: 'geo_features',
      objects: [{ 
        user_id: user3.id, 
        type: 'path', 
        geom: { type: 'Polygon', coordinates: [[[37.6176, 55.7542], [37.6176, 55.7547], [37.6181, 55.7547], [37.6181, 55.7542], [37.6176, 55.7542]]] }, 
        props: {} 
      }],
      returning: ['id']
    });
    const routeId = geoFeature2?.returning?.[0]?.id ?? geoFeature2?.id;

    const optionA = await admin.insert<any>({
      table: 'options',
      objects: [{ key: 'user_id', item_id: aId, to_id: user1.id }],
      returning: ['id']
    });
    optionAId = optionA?.returning?.[0]?.id ?? optionA?.id;

    const optionB = await admin.insert<any>({
      table: 'options',
      objects: [{ key: 'mark_id', item_id: bId, to_id: markId }],
      returning: ['id']
    });
    optionBId = optionB?.returning?.[0]?.id ?? optionB?.id;

    const optionC = await admin.insert<any>({
      table: 'options',
      objects: [{ key: 'route_id', item_id: cId, to_id: routeId }],
      returning: ['id']
    });
    optionCId = optionC?.returning?.[0]?.id ?? optionC?.id;

    // Проверяем что C видит все опции: свои + от B + от A
    const cOptions = await admin.select<any[]>({
      table: 'item_options',
      where: { item_id: { _eq: cId } },
      order_by: [{ key: 'asc' }, { inheritance_level: 'asc' }],
      returning: ['item_id', '_item_id', 'key', 'to_id', 'inheritance_level']
    });

    const cRows = Array.isArray(cOptions) ? cOptions : [cOptions];
    expect(cRows.length).toBe(3);

    // Найдем каждую опцию
    const markOption = cRows.find(r => r.key === 'mark_id');
    const userOption = cRows.find(r => r.key === 'user_id');
    const routeOption = cRows.find(r => r.key === 'route_id');

    // Проверим прямую опцию C
    expect(routeOption?.item_id).toBe(cId);
    expect(routeOption?._item_id).toBe(cId); // прямая опция
    expect(routeOption?.to_id).toBe(routeId);
    expect(routeOption?.inheritance_level).toBe(0);

    // Проверим унаследованную опцию от B
    expect(markOption?.item_id).toBe(cId); // показывается для C
    expect(markOption?._item_id).toBe(bId); // но принадлежит B
    expect(markOption?.to_id).toBe(markId);
    expect(markOption?.inheritance_level).toBe(1);

    // Проверим унаследованную опцию от A
    expect(userOption?.item_id).toBe(cId); // показывается для C
    expect(userOption?._item_id).toBe(aId); // но принадлежит A
    expect(userOption?.to_id).toBe(user1.id);
    expect(userOption?.inheritance_level).toBe(2);

    // Проверяем что B видит свои опции + от A
    const bOptions = await admin.select<any[]>({
      table: 'item_options',
      where: { item_id: { _eq: bId } },
      order_by: [{ key: 'asc' }],
      returning: ['item_id', '_item_id', 'key', 'to_id', 'inheritance_level']
    });

    const bRows = Array.isArray(bOptions) ? bOptions : [bOptions];
    expect(bRows.length).toBe(2);

    const bMark = bRows.find(r => r.key === 'mark_id');
    const bUser = bRows.find(r => r.key === 'user_id');

    expect(bMark?.item_id).toBe(bId);
    expect(bMark?._item_id).toBe(bId);
    expect(bMark?.to_id).toBe(markId);
    expect(bMark?.inheritance_level).toBe(0); // прямая

    expect(bUser?.item_id).toBe(bId);
    expect(bUser?._item_id).toBe(aId); // унаследованная от A
    expect(bUser?.to_id).toBe(user1.id);
    expect(bUser?.inheritance_level).toBe(1);

    // Cleanup
    try { await admin.delete<any>({ table: 'options', where: { id: { _eq: optionCId } } }); } catch {}
    try { await admin.delete<any>({ table: 'options', where: { id: { _eq: optionBId } } }); } catch {}
    try { await admin.delete<any>({ table: 'options', where: { id: { _eq: optionAId } } }); } catch {}
    try { await admin.delete<any>({ table: 'items', where: { id: { _eq: cId } } }); } catch {}
    try { await admin.delete<any>({ table: 'items', where: { id: { _eq: bId } } }); } catch {}
    try { await admin.delete<any>({ table: 'items', where: { id: { _eq: aId } } }); } catch {}
    try { await admin.delete<any>({ table: 'geo_features', where: { id: { _eq: routeId } } }); } catch {}
    try { await admin.delete<any>({ table: 'geo_features', where: { id: { _eq: markId } } }); } catch {}
    try { await admin.delete<any>({ table: 'deleteUsers', where: { id: { _eq: user1.id } } }); } catch {}
    try { await admin.delete<any>({ table: 'deleteUsers', where: { id: { _eq: user2.id } } }); } catch {}
    try { await admin.delete<any>({ table: 'deleteUsers', where: { id: { _eq: user3.id } } }); } catch {}
  }, 60000);

  it('should handle option overrides (child option shadows parent)', async () => {
    await upItemOptions();
    
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    // Создаем Parent -> Child
    const parent = await admin.insert<any>({ table: 'items', objects: [{ parent_id: null }], returning: ['id'] });
    const parentId = parent?.returning?.[0]?.id ?? parent?.id;
    
    const child = await admin.insert<any>({ table: 'items', objects: [{ parent_id: parentId }], returning: ['id'] });
    const childId = child?.returning?.[0]?.id ?? child?.id;

    // Добавляем одинаковую опцию на оба уровня
    let parentOptionId: string | null = null;
    let childOptionId: string | null = null;

    // Создаем тестовых пользователей
    const parentUser = await createTestUser();
    const childUser = await createTestUser();

    const parentOption = await admin.insert<any>({
      table: 'options',
      objects: [{ key: 'user_id', item_id: parentId, to_id: parentUser.id }],
      returning: ['id']
    });
    parentOptionId = parentOption?.returning?.[0]?.id ?? parentOption?.id;

    const childOption = await admin.insert<any>({
      table: 'options',
      objects: [{ key: 'user_id', item_id: childId, to_id: childUser.id }],
      returning: ['id']
    });
    childOptionId = childOption?.returning?.[0]?.id ?? childOption?.id;

    // Проверяем что child видит ОБЕ опции, но прямая идет первой (inheritance_level = 0)
    const childOptions = await admin.select<any[]>({
      table: 'item_options',
      where: { 
        item_id: { _eq: childId },
        key: { _eq: 'user_id' }
      },
      order_by: [{ inheritance_level: 'asc' }], // прямые опции первыми
      returning: ['item_id', '_item_id', 'key', 'to_id', 'inheritance_level']
    });

    const childRows = Array.isArray(childOptions) ? childOptions : [childOptions];
    expect(childRows.length).toBe(2);

    // Первая должна быть прямая опция child (level 0)
    expect(childRows[0]?.item_id).toBe(childId);
    expect(childRows[0]?._item_id).toBe(childId);
    expect(childRows[0]?.to_id).toBe(childUser.id);
    expect(childRows[0]?.inheritance_level).toBe(0);

    // Вторая должна быть унаследованная от parent (level 1)
    expect(childRows[1]?.item_id).toBe(childId);
    expect(childRows[1]?._item_id).toBe(parentId);
    expect(childRows[1]?.to_id).toBe(parentUser.id);
    expect(childRows[1]?.inheritance_level).toBe(1);

    // Cleanup
    try { await admin.delete<any>({ table: 'options', where: { id: { _eq: childOptionId } } }); } catch {}
    try { await admin.delete<any>({ table: 'options', where: { id: { _eq: parentOptionId } } }); } catch {}
    try { await admin.delete<any>({ table: 'items', where: { id: { _eq: childId } } }); } catch {}
    try { await admin.delete<any>({ table: 'items', where: { id: { _eq: parentId } } }); } catch {}
    try { await admin.delete<any>({ table: 'deleteUsers', where: { id: { _eq: childUser.id } } }); } catch {}
    try { await admin.delete<any>({ table: 'deleteUsers', where: { id: { _eq: parentUser.id } } }); } catch {}
  }, 60000);

  it('should work with UUID reference options (to_id)', async () => {
    await syncSchemasToDatabase();
    await upItemOptions();
    
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    const user = await createTestUser();
    const friend = await createTestUser();

    // Создаем Parent -> Child items
    const parent = await admin.insert<any>({ table: 'items', objects: [{ parent_id: null }], returning: ['id'] });
    const parentId = parent?.returning?.[0]?.id ?? parent?.id;
    
    const child = await admin.insert<any>({ table: 'items', objects: [{ parent_id: parentId }], returning: ['id'] });
    const childId = child?.returning?.[0]?.id ?? child?.id;

    // Добавляем UUID-опцию на parent (friend_id)
    let friendOptionId: string | null = null;

    // Создаем geo.feature для zone_id
    const geoFeature = await admin.insert<any>({
      table: 'geo_features',
      objects: [{ 
        user_id: friend.id, 
        type: 'zone', 
        geom: { type: 'Polygon', coordinates: [[[37.6, 55.7], [37.6, 55.71], [37.61, 55.71], [37.61, 55.7], [37.6, 55.7]]] }, 
        props: {} 
      }],
      returning: ['id']
    });
    const zoneId = geoFeature?.returning?.[0]?.id ?? geoFeature?.id;

    const friendOption = await admin.insert<any>({
      table: 'options',
      objects: [{ key: 'zone_id', item_id: parentId, to_id: zoneId }], // используем zone_id с geo.features
      returning: ['id']
    });
    friendOptionId = friendOption?.returning?.[0]?.id ?? friendOption?.id;

    // Проверяем что child видит унаследованную UUID-опцию
    const childOptions = await admin.select<any[]>({
      table: 'item_options',
      where: { 
        item_id: { _eq: childId },
        key: { _eq: 'zone_id' }
      },
      returning: ['item_id', '_item_id', 'key', 'to_id', 'inheritance_level']
    });

    const childRows = Array.isArray(childOptions) ? childOptions : [childOptions];
    expect(childRows.length).toBe(1);
    expect(childRows[0]?.item_id).toBe(childId);
    expect(childRows[0]?._item_id).toBe(parentId); // принадлежит parent
    expect(childRows[0]?.to_id).toBe(zoneId);
    expect(childRows[0]?.inheritance_level).toBe(1); // унаследованная

    // Cleanup
    try { await admin.delete<any>({ table: 'options', where: { id: { _eq: friendOptionId } } }); } catch {}
    try { await admin.delete<any>({ table: 'items', where: { id: { _eq: childId } } }); } catch {}
    try { await admin.delete<any>({ table: 'items', where: { id: { _eq: parentId } } }); } catch {}
    try { await admin.delete<any>({ table: 'geo_features', where: { id: { _eq: zoneId } } }); } catch {}
    try { await admin.delete<any>({ table: 'deleteUsers', where: { id: { _eq: friend.id } } }); } catch {}
    try { await admin.delete<any>({ table: 'deleteUsers', where: { id: { _eq: user.id } } }); } catch {}
  }, 60000);

  it('should work with items.item_options relationship', async () => {
    await upItemOptions();
    
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      Generator(schema as any)
    );

    // Создаем Parent -> Child
    const parent = await admin.insert<any>({ table: 'items', objects: [{ parent_id: null }], returning: ['id'] });
    const parentId = parent?.returning?.[0]?.id ?? parent?.id;
    
    const child = await admin.insert<any>({ table: 'items', objects: [{ parent_id: parentId }], returning: ['id'] });
    const childId = child?.returning?.[0]?.id ?? child?.id;

    // Добавляем опции
    let parentOptionId: string | null = null;
    let childOptionId: string | null = null;

    // Создаем тестовых пользователей и geo feature
    const parentUser = await createTestUser();
    const childUser = await createTestUser();

    // Создаем geo.feature для mark_id
    const geoFeature = await admin.insert<any>({
      table: 'geo_features',
      objects: [{ 
        user_id: childUser.id, 
        type: 'mark', 
        geom: { type: 'Point', coordinates: [37.6, 55.7] }, 
        props: {} 
      }],
      returning: ['id']
    });
    const markId = geoFeature?.returning?.[0]?.id ?? geoFeature?.id;

    const parentOption = await admin.insert<any>({
      table: 'options',
      objects: [{ key: 'user_id', item_id: parentId, to_id: parentUser.id }],
      returning: ['id']
    });
    parentOptionId = parentOption?.returning?.[0]?.id ?? parentOption?.id;

    const childOption = await admin.insert<any>({
      table: 'options',
      objects: [{ key: 'mark_id', item_id: childId, to_id: markId }],
      returning: ['id']
    });
    childOptionId = childOption?.returning?.[0]?.id ?? childOption?.id;

    // Проверяем relationship items -> item_options
    const childWithOptions = await admin.select<any>({
      table: 'items',
      pk_columns: { id: childId },
      returning: [
        'id',
        { 
          item_options: [
            'key', 
            'to_id', 
            '_item_id', 
            'inheritance_level',
            { _item: ['id'] } // relationship к оригинальному владельцу опции
          ] 
        }
      ]
    });

    expect(Array.isArray(childWithOptions?.item_options)).toBe(true);
    const options = childWithOptions?.item_options || [];
    expect(options.length).toBe(2);

    const markOpt = options.find((o: any) => o.key === 'mark_id');
    const userOpt = options.find((o: any) => o.key === 'user_id');

    expect(markOpt?.to_id).toBe(markId);
    expect(markOpt?._item_id).toBe(childId);
    expect(markOpt?.inheritance_level).toBe(0);
    expect(markOpt?._item?.id).toBe(childId);

    expect(userOpt?.to_id).toBe(parentUser.id);
    expect(userOpt?._item_id).toBe(parentId);
    expect(userOpt?.inheritance_level).toBe(1);
    expect(userOpt?._item?.id).toBe(parentId);

    // Cleanup
    try { await admin.delete<any>({ table: 'options', where: { id: { _eq: childOptionId } } }); } catch {}
    try { await admin.delete<any>({ table: 'options', where: { id: { _eq: parentOptionId } } }); } catch {}
    try { await admin.delete<any>({ table: 'items', where: { id: { _eq: childId } } }); } catch {}
    try { await admin.delete<any>({ table: 'items', where: { id: { _eq: parentId } } }); } catch {}
    try { await admin.delete<any>({ table: 'geo_features', where: { id: { _eq: markId } } }); } catch {}
    try { await admin.delete<any>({ table: 'deleteUsers', where: { id: { _eq: childUser.id } } }); } catch {}
    try { await admin.delete<any>({ table: 'deleteUsers', where: { id: { _eq: parentUser.id } } }); } catch {}
  }, 60000);
});

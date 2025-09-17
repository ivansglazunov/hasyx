import { z } from 'zod';

// Export all validation schemas as a single object
export const schema = {
  // Email validation schema
  email: z.object({
    email: z.string().email('Please enter a valid email address'),
  }),
} as const;

// 🎯 СИСТЕМА ОПЦИЙ ПО ТАБЛИЦАМ
// Структура: options.tableName.optionKey
export const options = {
  // Опции для таблицы users (item_id = user.id)
  users: z.object({
    fio: z.string().min(1).max(200),
    displayName: z.string().min(1).max(100),
    timezone: z.string().min(1).max(50),
    // Ссылка на файл-аватар (uuid из storage.files)
    avatar: z
      .string()
      .uuid()
      .describe('User avatar file id (uuid from storage.files)')
      .meta({ widget: 'file-id', tables: ['storage.files'] }),
    // Множественные ссылки на друзей (uuid из users)
    friend_id: z
      .string()
      .uuid()
      .describe('Friend user id (uuid from public.users)')
      .meta({ multiple: true, tables: ['users'] }),
    notifications: z.object({
      email: z.boolean(),
      push: z.boolean(),
      sms: z.boolean(),
    }),
  }),
  // Опции для таблицы items (item_id = items.id)
  items: z.object({
    // Начальная привязка пользователя к айтему
    user_id: z.string().uuid().meta({ tables: ['users'] }),
    // Привязки к geo.features (маркер/маршрут/зона) в одной таблице
    mark_id: z.string().uuid().meta({ tables: ['geo.features'] }),
    route_id: z.string().uuid().meta({ tables: ['geo.features'] }),
    zone_id: z.string().uuid().meta({ tables: ['geo.features'] }),
  }),
} as const;

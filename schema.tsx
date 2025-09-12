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
    avatar: z.string().uuid().describe('User avatar file id (uuid from storage.files)').meta({ widget: 'file-id' }),
    notifications: z.object({
      email: z.boolean(),
      push: z.boolean(),
      sms: z.boolean(),
    }),
  }),
} as const;

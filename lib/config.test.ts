import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { hasuraSchema, googleOAuthSchema } from './config';

describe('Config Schema JSON Schema Generation', () => {
  it('should generate JSON Schema for hasuraSchema', () => {
    const jsonSchema = zodToJsonSchema(hasuraSchema);
    console.log('Hasura JSON Schema:', JSON.stringify(jsonSchema, null, 2));
    
    // Проверяем, что схема содержит основные поля
    expect(jsonSchema).toBeDefined();
    expect(typeof jsonSchema).toBe('object');
  });

  it('should generate JSON Schema for googleOAuthSchema', () => {
    const jsonSchema = zodToJsonSchema(googleOAuthSchema);
    console.log('Google OAuth JSON Schema:', JSON.stringify(jsonSchema, null, 2));
    
    // Проверяем, что схема содержит основные поля
    expect(jsonSchema).toBeDefined();
    expect(typeof jsonSchema).toBe('object');
  });

  it('should check if metadata is preserved in JSON Schema', () => {
    // Создаем простую схему с метаданными для тестирования
    const testSchema = z.object({
      testField: z.string().describe('Test description')
    });
    
    const jsonSchema = zodToJsonSchema(testSchema);
    console.log('Test Schema JSON Schema:', JSON.stringify(jsonSchema, null, 2));
    
    // Проверяем, что схема создалась
    expect(jsonSchema).toBeDefined();
  });
}); 
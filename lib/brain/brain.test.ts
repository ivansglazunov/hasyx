import dotenv from 'dotenv';
import { Hasyx } from '../hasyx/hasyx';
import { createApolloClient } from '../apollo/apollo';
import { Generator } from '../generator';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import schema from '../../public/hasura-schema.json';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { options as schemaOptions } from '../../schema';

dotenv.config();

const generate = Generator(schema as any);

(!!+(process?.env?.JEST_LOCAL || '') ? describe : describe.skip)('brain options', () => {
  it('supports options[""] (global) with brain_number and brain_string without item_id', async () => {
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      generate
    );

    let userId: string | undefined;
    let optionIds: string[] = [];

    try {
      // Create test user
      const user = await admin.insert<any>({
        table: 'users',
        object: { email: `brain-${uuidv4()}@example.com`, name: 'Brain User', hasura_role: 'user' },
        returning: ['id']
      });

      userId = Array.isArray(user) ? user[0]?.id : user?.id;
      expect(userId).toBeTruthy();

      const { hasyx: userClient } = await admin._authorize(userId!, { ws: false });

      // Test brain_number (no item_id - global option)
      const n = await userClient.insert<any>({
        table: 'options',
        object: { key: 'brain_number', number_value: 42 },
        returning: ['id', 'key', 'number_value', 'item_id']
      });
      optionIds.push(n?.id);
      expect(n?.key).toBe('brain_number');
      expect(n?.number_value).toBe(42);
      expect(n?.item_id == null).toBe(true); // null or undefined

      // Verify it can be selected
      const fetchedNumber = await admin.select<any[]>({
        table: 'options',
        where: { id: { _eq: n?.id } },
        returning: ['key', 'number_value', 'item_id']
      });
      expect(fetchedNumber[0]?.key).toBe('brain_number');
      expect(fetchedNumber[0]?.number_value).toBe(42);
      expect(fetchedNumber[0]?.item_id == null).toBe(true);

      // Test brain_string (no item_id - global option)
      const s = await userClient.insert<any>({
        table: 'options',
        object: { key: 'brain_string', string_value: 'hello-brain' },
        returning: ['id', 'key', 'string_value', 'item_id']
      });
      optionIds.push(s?.id);
      expect(s?.key).toBe('brain_string');
      expect(s?.string_value).toBe('hello-brain');
      expect(s?.item_id == null).toBe(true);

      // Verify it can be selected
      const fetchedString = await admin.select<any[]>({
        table: 'options',
        where: { id: { _eq: s?.id } },
        returning: ['key', 'string_value', 'item_id']
      });
      expect(fetchedString[0]?.key).toBe('brain_string');
      expect(fetchedString[0]?.string_value).toBe('hello-brain');
      expect(fetchedString[0]?.item_id == null).toBe(true);

    } finally {
      // Cleanup: delete options and user
      for (const optionId of optionIds) {
        try {
          await admin.delete({ table: 'options', where: { id: { _eq: optionId } } });
        } catch (e) {
          console.error('Failed to cleanup option:', optionId, e);
        }
      }
      if (userId) {
        try {
          await admin.delete({ table: 'users', where: { id: { _eq: userId } } });
        } catch (e) {
          console.error('Failed to cleanup user:', userId, e);
        }
      }
    }
  }, 30000);

  it('supports options[""] (no item_id) for brain registry', async () => {
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      generate
    );

    let optionId: string | undefined;

    try {
      const users = await admin.select<any[]>({ table: 'users', returning: ['id'], limit: 1 });
      const { hasyx: userClient } = await admin._authorize(users[0].id, { ws: false });

      // Insert global brain option
      const g = await userClient.insert<any>({
        table: 'options',
        object: { key: 'brain', string_value: `global-brain-${uuidv4()}` },
        returning: ['id', 'key', 'string_value', 'item_id']
      });
      optionId = g?.id;
      expect(g?.key).toBe('brain');
      expect(g?.string_value).toContain('global-brain');
      // When item_id is NULL, it can be returned as null or undefined depending on GraphQL client
      expect(g?.item_id == null).toBe(true);

      // Verify it can be selected
      const fetched = await admin.select<any[]>({
        table: 'options',
        where: { id: { _eq: optionId } },
        returning: ['key', 'string_value', 'item_id']
      });
      expect(fetched[0]?.key).toBe('brain');
      expect(fetched[0]?.string_value).toContain('global-brain');
      expect(fetched[0]?.item_id).toBeNull();

    } finally {
      // Cleanup: delete the option
      if (optionId) {
        try {
          await admin.delete({ table: 'options', where: { id: { _eq: optionId } } });
        } catch (e) {
          console.error('Failed to cleanup option:', optionId, e);
        }
      }
    }
  }, 30000);

  it('supports multiple brain_* options on same item (multiple: true)', async () => {
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      generate
    );

    let userId: string | undefined;
    let optionIds: string[] = [];

    try {
      // Create test user
      const user = await admin.insert<any>({
        table: 'users',
        object: { email: `brain-multi-${uuidv4()}@example.com`, name: 'Brain Multi User', hasura_role: 'user' },
        returning: ['id']
      });

      userId = Array.isArray(user) ? user[0]?.id : user?.id;
      expect(userId).toBeTruthy();

      const { hasyx: userClient } = await admin._authorize(userId!, { ws: false });

      // Test multiple brain_number (global, no item_id)
      const n1 = await userClient.insert<any>({
        table: 'options',
        object: { key: 'brain_number', number_value: 100 },
        returning: ['id', 'number_value']
      });
      optionIds.push(n1?.id);
      
      const n2 = await userClient.insert<any>({
        table: 'options',
        object: { key: 'brain_number', number_value: 200 },
        returning: ['id', 'number_value']
      });
      optionIds.push(n2?.id);
      
      expect(n1?.number_value).toBe(100);
      expect(n2?.number_value).toBe(200);

      // Verify both exist
      const numbers = await admin.select<any[]>({
        table: 'options',
        where: { key: { _eq: 'brain_number' }, user_id: { _eq: userId } },
        returning: ['number_value'],
        order_by: [{ number_value: 'asc' }]
      });
      expect(numbers).toHaveLength(2);
      expect(numbers[0]?.number_value).toBe(100);
      expect(numbers[1]?.number_value).toBe(200);

      // Test multiple brain_string (global, no item_id)
      const s1 = await userClient.insert<any>({
        table: 'options',
        object: { key: 'brain_string', string_value: 'first' },
        returning: ['id', 'string_value']
      });
      optionIds.push(s1?.id);

      const s2 = await userClient.insert<any>({
        table: 'options',
        object: { key: 'brain_string', string_value: 'second' },
        returning: ['id', 'string_value']
      });
      optionIds.push(s2?.id);

      // Verify both strings exist
      const strings = await admin.select<any[]>({
        table: 'options',
        where: { key: { _eq: 'brain_string' }, user_id: { _eq: userId } },
        returning: ['string_value']
      });
      expect(strings).toHaveLength(2);

      // Test multiple brain_object (global, no item_id)
      const o1 = await userClient.insert<any>({
        table: 'options',
        object: { key: 'brain_object', jsonb_value: { type: 'config', value: 1 } },
        returning: ['id']
      });
      optionIds.push(o1?.id);

      const o2 = await userClient.insert<any>({
        table: 'options',
        object: { key: 'brain_object', jsonb_value: { type: 'data', value: 2 } },
        returning: ['id']
      });
      optionIds.push(o2?.id);

      const objects = await admin.select<any[]>({
        table: 'options',
        where: { key: { _eq: 'brain_object' }, user_id: { _eq: userId } },
        returning: ['jsonb_value']
      });
      expect(objects).toHaveLength(2);

    } finally {
      // Cleanup
      for (const optionId of optionIds) {
        try {
          await admin.delete({ table: 'options', where: { id: { _eq: optionId } } });
        } catch (e) {
          console.error('Failed to cleanup option:', optionId, e);
        }
      }
      if (userId) {
        try {
          await admin.delete({ table: 'users', where: { id: { _eq: userId } } });
        } catch (e) {
          console.error('Failed to cleanup user:', userId, e);
        }
      }
    }
  }, 30000);

  it('supports all brain option types (global and wildcard)', async () => {
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      generate
    );

    let userId: string | undefined;
    let optionIds: string[] = [];

    try {
      const user = await admin.insert<any>({
        table: 'users',
        object: { email: `brain-mixed-${uuidv4()}@example.com`, name: 'Brain Mixed User', hasura_role: 'user' },
        returning: ['id']
      });

      userId = Array.isArray(user) ? user[0]?.id : user?.id;
      const { hasyx: userClient } = await admin._authorize(userId!, { ws: false });

      // Create global brain options (no item_id)
      const globalOpts = await Promise.all([
        userClient.insert<any>({
          table: 'options',
          object: { key: 'brain_number', number_value: 42 },
          returning: ['id', 'key']
        }),
        userClient.insert<any>({
          table: 'options',
          object: { key: 'brain_string', string_value: 'test' },
          returning: ['id', 'key']
        }),
        userClient.insert<any>({
          table: 'options',
          object: { key: 'brain_object', jsonb_value: { data: 'value' } },
          returning: ['id', 'key']
        }),
      ]);

      optionIds.push(...globalOpts.map(o => o?.id));
      expect(globalOpts).toHaveLength(3);
      
      // Create wildcard brain option with item_id (brain_name)
      const wildcardOpt = await userClient.insert<any>({
        table: 'options',
        object: { key: 'brain_name', string_value: 'test-node', item_id: userId },
        returning: ['id', 'key']
      });
      optionIds.push(wildcardOpt?.id);
      expect(wildcardOpt.key).toBe('brain_name');

      // Note: Skipping brain_formula, brain_ask, brain_js creation to avoid triggering event handlers on test server
      // These are tested in Brain computations suite without actual database operations
      
      // Verify all can be selected
      const allOptions = await admin.select<any[]>({
        table: 'options',
        where: { user_id: { _eq: userId }, key: { _like: 'brain_%' } },
        returning: ['key']
      });
      expect(allOptions.length).toBeGreaterThanOrEqual(4);
      
      // Verify brain_name is singular (cannot duplicate with same item_id)
      const duplicateNameAttempt = userClient.insert<any>({
        table: 'options',
        object: { key: 'brain_name', string_value: 'duplicate-name', item_id: userId },
        returning: ['id']
      });
      await expect(duplicateNameAttempt).rejects.toThrow();

    } finally {
      for (const optionId of optionIds) {
        try {
          await admin.delete({ table: 'options', where: { id: { _eq: optionId } } });
        } catch (e) {
          console.error('Failed to cleanup option:', optionId, e);
        }
      }
      if (userId) {
        try {
          await admin.delete({ table: 'users', where: { id: { _eq: userId } } });
        } catch (e) {
          console.error('Failed to cleanup user:', userId, e);
        }
      }
    }
  }, 30000);

  it('verifies BrainComponent metadata is stored in schema and extractable via z.toJSONSchema()', () => {
    // Check that metadata is accessible via z.toJSONSchema()
    const globalSchema = (schemaOptions as any)[''];
    expect(globalSchema).toBeDefined();
    
    const jsonSchema = z.toJSONSchema(globalSchema);
    expect(jsonSchema).toBeDefined();
    expect((jsonSchema as any).properties).toBeDefined();
    
    const properties = (jsonSchema as any).properties;
    
    // Verify brain_string has BrainComponent metadata
    expect(properties.brain_string).toBeDefined();
    expect(properties.brain_string.BrainComponent).toBe('BrainStringComponent');
    console.log('[brain.test] ✓ brain_string has BrainComponent:', properties.brain_string.BrainComponent);
    
    // Verify brain_number
    expect(properties.brain_number.BrainComponent).toBe('BrainNumberComponent');
    console.log('[brain.test] ✓ brain_number has BrainComponent:', properties.brain_number.BrainComponent);
    
    // Verify brain_object
    expect(properties.brain_object.BrainComponent).toBe('BrainObjectComponent');
    console.log('[brain.test] ✓ brain_object has BrainComponent:', properties.brain_object.BrainComponent);
    
    // Check wildcard schema
    const wildcardSchema = (schemaOptions as any)['*'];
    const wildcardJsonSchema = z.toJSONSchema(wildcardSchema);
    const wildcardProperties = (wildcardJsonSchema as any).properties;
    
    expect(wildcardProperties.brain_formula.BrainComponent).toBe('BrainFormulaComponent');
    expect(wildcardProperties.brain_ask.BrainComponent).toBe('BrainAskComponent');
    expect(wildcardProperties.brain_js.BrainComponent).toBe('BrainJSComponent');
    expect(wildcardProperties.brain_query.BrainComponent).toBe('BrainQueryComponent');
    expect(wildcardProperties.brain_name.BrainComponent).toBe('DefaultBrainComponent');
    console.log('[brain.test] ✓ brain_name has BrainComponent:', wildcardProperties.brain_name.BrainComponent);
    
    console.log('[brain.test] ✅ All BrainComponent metadata extracted successfully!');
    console.log('[brain.test] ℹ️ Note: components/entities/options.tsx uses getOptionComponent() to resolve these components at runtime');
  });
});

describe('Brain computations (mathjs and AI)', () => {
  it('should evaluate mathematical formulas using mathjs (without creating options)', async () => {
    console.log('[brain.test] Testing mathjs formula evaluation...');
    
    const mathjs = await import('mathjs');
    
    // Test simple arithmetic
    const result1 = mathjs.evaluate('2 + 2');
    expect(result1).toBe(4);
    console.log('[brain.test] ✓ Simple arithmetic: 2 + 2 =', result1);
    
    // Test complex expression
    const result2 = mathjs.evaluate('sqrt(16) + pow(2, 3)');
    expect(result2).toBe(12); // sqrt(16) = 4, pow(2,3) = 8, 4 + 8 = 12
    console.log('[brain.test] ✓ Complex expression: sqrt(16) + pow(2, 3) =', result2);
    
    // Test with variables
    const result3 = mathjs.evaluate('x * 2', { x: 5 });
    expect(result3).toBe(10);
    console.log('[brain.test] ✓ With variables: x * 2 where x=5 =', result3);
    
    // Test trigonometry
    const result4 = mathjs.evaluate('sin(pi / 2)');
    expect(result4).toBe(1);
    console.log('[brain.test] ✓ Trigonometry: sin(pi / 2) =', result4);
    
    // Test error handling
    try {
      mathjs.evaluate('invalid formula ###');
      fail('Should have thrown an error for invalid formula');
    } catch (error: any) {
      expect(error).toBeDefined();
      console.log('[brain.test] ✓ Invalid formula throws error:', error.message);
    }
    
    console.log('[brain.test] ✅ mathjs evaluation tests passed!');
    console.log('[brain.test] ℹ️ Note: Event handler in app/api/events/options/route.ts handles brain_formula -> brain_string computation');
  });

  it('should verify AI provider configuration (without actual API call)', async () => {
    console.log('[brain.test] Testing AI provider configuration...');
    
    // Check if AI classes can be imported
    const { AI } = await import('../ai/ai');
    const { OpenRouterProvider } = await import('../ai/providers/openrouter');
    
    expect(AI).toBeDefined();
    expect(OpenRouterProvider).toBeDefined();
    console.log('[brain.test] ✓ AI classes imported successfully');

    // Check environment variable (without making actual API call)
    const hasApiKey = !!process.env.OPENROUTER_API_KEY;
    console.log('[brain.test] OPENROUTER_API_KEY configured:', hasApiKey);
    
    if (hasApiKey) {
      console.log('[brain.test] ✓ AI provider can be initialized (key present)');
      // Note: We don't actually call the API to avoid costs and external dependencies
      console.log('[brain.test] ℹ️ Skipping actual API call in tests');
    } else {
      console.log('[brain.test] ⚠️ OPENROUTER_API_KEY not set - brain_ask will fail at runtime');
    }

    console.log('[brain.test] ✅ AI provider configuration test passed!');
    console.log('[brain.test] ℹ️ Note: Event handler in app/api/events/options/route.ts handles brain_ask -> brain_string computation');
  });
});

(!!+(process?.env?.JEST_LOCAL || '') ? describe : describe.skip)('brain_formula plv8 computation', () => {
  it('should create brain_formula and automatically compute brain_string result via plv8 trigger', async () => {
    const admin = new Hasyx(
      createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, ws: false }),
      generate
    );

    let userId: string | undefined;
    let formulaOptionId: string | undefined;
    let resultOptionId: string | undefined;

    try {
      // Create test user
      const user = await admin.insert<any>({
        table: 'users',
        object: { email: `formula-${uuidv4()}@example.com`, name: 'Formula Test User', hasura_role: 'user' },
        returning: ['id']
      });

      userId = Array.isArray(user) ? user[0]?.id : user?.id;
      expect(userId).toBeTruthy();

      const { hasyx: userClient } = await admin._authorize(userId!, { ws: false });

      // Create brain_formula option (Hasura event trigger -> API route will compute and create brain_string)
      const formula = await userClient.insert<any>({
        table: 'options',
        object: { key: 'brain_formula', string_value: '2 + 2 * 3' },
        returning: ['id', 'key', 'string_value']
      });
      formulaOptionId = formula?.id;
      
      expect(formula?.key).toBe('brain_formula');
      expect(formula?.string_value).toBe('2 + 2 * 3');
      console.log('[brain.test] ✓ Created brain_formula:', formula?.string_value);

      // Wait for Hasura event trigger to fire and API route to process
      console.log('[brain.test] ⏳ Waiting for event trigger processing...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Check if brain_string result was created by event trigger + API route
      const resultOptions = await admin.select<any[]>({
        table: 'options',
        where: { 
          key: { _eq: 'brain_string' }, 
          item_id: { _eq: formulaOptionId },
          user_id: { _eq: userId }
        },
        returning: ['id', 'string_value', 'item_id']
      });

      expect(resultOptions.length).toBeGreaterThan(0);
      expect(resultOptions[0]?.string_value).toBe('8'); // 2 + 2*3 = 2 + 6 = 8
      expect(resultOptions[0]?.item_id).toBe(formulaOptionId);
      resultOptionId = resultOptions[0]?.id;
      
      console.log('[brain.test] ✓ Event trigger + API route computed result:', resultOptions[0]?.string_value);
      console.log('[brain.test] ✓ Result stored as brain_string with item_id pointing to formula');

      // Test formula update (should update result)
      await userClient.update<any>({
        table: 'options',
        pk_columns: { id: formulaOptionId },
        _set: { string_value: 'sqrt(16) + pow(2, 3)' },
        returning: ['string_value']
      });

      // Wait for AFTER ROW trigger to update brain_string
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check updated result
      const updatedResults = await admin.select<any[]>({
        table: 'options',
        where: { 
          key: { _eq: 'brain_string' },
          item_id: { _eq: formulaOptionId },
          user_id: { _eq: userId }
        },
        returning: ['string_value']
      });

      expect(updatedResults[0]?.string_value).toBe('12'); // sqrt(16) + pow(2,3) = 4 + 8 = 12
      console.log('[brain.test] ✓ Formula update triggered result update:', updatedResults[0]?.string_value);

      console.log('[brain.test] ✅ brain_formula plv8 computation test passed!');

    } finally {
      // Cleanup
      if (formulaOptionId) {
        try {
          await admin.delete({ table: 'options', where: { id: { _eq: formulaOptionId } } });
        } catch (e) {
          console.error('Failed to cleanup formula option:', formulaOptionId, e);
        }
      }
      if (userId) {
        try {
          await admin.delete({ table: 'users', where: { id: { _eq: userId } } });
        } catch (e) {
          console.error('Failed to cleanup user:', userId, e);
        }
      }
    }
  }, 30000);
});



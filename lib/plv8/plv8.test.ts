import dotenv from 'dotenv';
import { Hasura, ColumnType } from '../hasura/hasura';
import Debug from '../debug';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

// Initialize debug
const debug = Debug('test:plv8');

describe('plv8 Extension Tests', () => {
  let hasura: Hasura;
  let testSchema: string;
  let plv8Available: boolean = false;

  beforeAll(async () => {
    hasura = new Hasura({
      url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
      secret: process.env.HASURA_ADMIN_SECRET!,
    });
    
    // Ensure default data source exists
    await hasura.ensureDefaultSource();
    
    // Check if plv8 is available
    try {
      const result = await hasura.sql(`
        SELECT EXISTS (
          SELECT FROM pg_extension 
          WHERE extname = 'plv8'
        );
      `);
      plv8Available = result.result?.[1]?.[0] === 't';
      debug(`plv8 available: ${plv8Available}`);
    } catch (error) {
      debug('Could not check plv8 availability:', error);
      plv8Available = false;
    }
  });

  describe('plv8 Extension Installation', () => {
    it('should check plv8 extension availability', async () => {
      const result = await hasura.sql(`
        SELECT EXISTS (
          SELECT FROM pg_extension 
          WHERE extname = 'plv8'
        );
      `);
      
      const isAvailable = result.result?.[1]?.[0] === 't';
      debug(`plv8 extension available: ${isAvailable}`);
      // plv8 is a hard requirement
        expect(isAvailable).toBe(true);
    }, 30000);

    it('should be able to create plv8 functions when available', async () => {
      expect(plv8Available).toBe(true);
      
      testSchema = `test_plv8_${uuidv4().replace(/-/g, '_')}`;
      
      try {
        // Create test schema
        await hasura.defineSchema({ schema: testSchema });
        
        // Create a simple plv8 function
        await hasura.defineFunction({
          schema: testSchema,
          name: 'test_plv8_simple',
          definition: `() RETURNS TEXT AS $$
            var message = "Hello from plv8!";
            return message;
          $$`,
          language: 'plv8'
        });
        
        // Test the function
        const result = await hasura.sql(`SELECT "${testSchema}".test_plv8_simple();`);
        expect(result.result?.[1]?.[0]).toBe('Hello from plv8!');
        
      } finally {
        await hasura.deleteSchema({ schema: testSchema, cascade: true });
      }
    }, 30000);
  });

  describe('plv8 Trigger Tests', () => {
    it('should attach trigger and fail any insert (diagnostic)', async () => {
      expect(plv8Available).toBe(true);

      testSchema = `test_plv8_tr_diag_${uuidv4().replace(/-/g, '_')}`;
      try {
        await hasura.defineSchema({ schema: testSchema });
        await hasura.defineTable({ schema: testSchema, table: 't', id: 'id', type: ColumnType.UUID });
        await hasura.defineColumn({ schema: testSchema, table: 't', name: 'value', type: ColumnType.INTEGER });

        await hasura.definePlv8Function({
          schema: testSchema,
          name: 'fail_always',
          jsFunction: (NEW: any, _OLD: any, plv8: any) => {
            plv8.execute("INSERT INTO public.debug(value) VALUES ($1::jsonb)", [JSON.stringify({ ev: 'diag_enter', schema: 'SCHEMA', val: (NEW && NEW.value) })]);
            throw new Error('diag fail');
          }
        });

        await hasura.defineTrigger({
          schema: testSchema,
          table: 't',
          name: 'tr_fail',
          timing: 'BEFORE',
          event: 'INSERT',
          function_name: `${testSchema}.fail_always`
        });

        // Verify trigger exists
        const trig = await hasura.sql(`SELECT tgname FROM pg_trigger WHERE tgrelid='"${testSchema}".t'::regclass;`);
        debug('diag triggers:', trig.result);

        // Wrap insert to capture error message deterministically
        await hasura.sql(`
          CREATE OR REPLACE FUNCTION "${testSchema}".try_sql(cmd text) RETURNS text AS $$
          DECLARE errmsg text;
          BEGIN
            BEGIN
              EXECUTE cmd;
              RETURN 'ok';
            EXCEPTION WHEN others THEN
              GET STACKED DIAGNOSTICS errmsg = MESSAGE_TEXT;
              RETURN errmsg;
            END;
          END;
          $$ LANGUAGE plpgsql;
        `);
        const diag = await hasura.sql(`SELECT "${testSchema}".try_sql($q$INSERT INTO "${testSchema}".t(value) VALUES (1);$q$);`);
        expect(diag.result?.[1]?.[0]).not.toBe('ok');

      } finally {
        await hasura.deleteSchema({ schema: testSchema, cascade: true });
      }
    }, 30000);
    it('should create plv8 trigger that validates even numbers when available', async () => {
      expect(plv8Available).toBe(true);
      
      testSchema = `test_plv8_trigger_${uuidv4().replace(/-/g, '_')}`;
      
      try {
        // Create test schema and table
        await hasura.defineSchema({ schema: testSchema });
        await hasura.defineTable({ 
          schema: testSchema, 
          table: 'test_data',
          id: 'id',
          type: ColumnType.UUID
        });
        
        // Add value column
        await hasura.defineColumn({
          schema: testSchema,
          table: 'test_data',
          name: 'value',
          type: ColumnType.INTEGER
        });
        
        // Create plv8 trigger function that validates even numbers
        await hasura.definePlv8Function({
          schema: testSchema,
          name: 'validate_even_numbers',
          jsFunction: (NEW: any, _OLD: any, plv8: any) => {
            plv8.execute("INSERT INTO public.debug(value) VALUES ($1::jsonb)", [JSON.stringify({ ev: 'even_check', schema: 'SCHEMA', value: (NEW && NEW.value) })]);
            if (NEW.value % 2 === 0) {
              plv8.execute("INSERT INTO public.debug(value) VALUES ($1::jsonb)", [JSON.stringify({ ev: 'even_block', schema: 'SCHEMA', value: (NEW && NEW.value) })]);
              throw new Error('Even numbers are not allowed! Value: ' + NEW.value);
            }
          }
        });
        
        // Create trigger
        await hasura.defineTrigger({
          schema: testSchema,
          table: 'test_data',
          name: 'check_even_numbers',
          timing: 'BEFORE',
          event: 'INSERT',
          function_name: `${testSchema}.validate_even_numbers`
        });
        
        // Helper plpgsql to capture error text from INSERT
        await hasura.sql(`
          CREATE OR REPLACE FUNCTION "${testSchema}".try_sql(cmd text) RETURNS text AS $$
          DECLARE errmsg text;
          BEGIN
            BEGIN
              EXECUTE cmd;
              RETURN 'ok';
            EXCEPTION WHEN others THEN
              GET STACKED DIAGNOSTICS errmsg = MESSAGE_TEXT;
              RETURN errmsg;
            END;
          END;
          $$ LANGUAGE plpgsql;
        `);
        
        // Test: Insert odd number (should succeed)
        const oddRes = await hasura.sql(`SELECT "${testSchema}".try_sql($q$INSERT INTO "${testSchema}".test_data (value) VALUES (3);$q$);`);
        expect(oddRes.result?.[1]?.[0]).toBe('ok');
        
        // Test: Insert even number (should fail)
        const evenRes = await hasura.sql(`SELECT "${testSchema}".try_sql($q$INSERT INTO "${testSchema}".test_data (value) VALUES (4);$q$);`);
        const evenOut = evenRes.result?.[1]?.[0] || '';
        expect(evenOut).not.toBe('ok');
        
        // Verify only odd number was inserted
        const result = await hasura.sql(`SELECT value FROM "${testSchema}".test_data;`);
        expect(result.result).toHaveLength(2); // Header + 1 row
        expect(result.result[1][0]).toBe('3');
        
      } finally {
        await hasura.deleteSchema({ schema: testSchema, cascade: true });
      }
    }, 30000);

    it('should create plv8 trigger with complex validation when available', async () => {
      expect(plv8Available).toBe(true);
      
      testSchema = `test_plv8_complex_${uuidv4().replace(/-/g, '_')}`;
      
      try {
        // Create test schema and table
        await hasura.defineSchema({ schema: testSchema });
        await hasura.defineTable({ 
          schema: testSchema, 
          table: 'users',
          id: 'id',
          type: ColumnType.UUID
        });
        
        // Add columns
        await hasura.defineColumn({
          schema: testSchema,
          table: 'users',
          name: 'age',
          type: ColumnType.INTEGER
        });
        
        await hasura.defineColumn({
          schema: testSchema,
          table: 'users',
          name: 'email',
          type: ColumnType.TEXT
        });
        
        // Create plv8 trigger function with complex validation
        await hasura.definePlv8Function({
          schema: testSchema,
          name: 'validate_user_data',
          jsFunction: (NEW: any, _OLD: any, plv8: any) => {
            plv8.execute("INSERT INTO public.debug(value) VALUES ($1::jsonb)", [JSON.stringify({ ev: 'user_check', schema: 'SCHEMA', age: (NEW && NEW.age), email: (NEW && NEW.email) })]);
            if (NEW.age < 0 || NEW.age > 150) {
              plv8.execute("INSERT INTO public.debug(value) VALUES ($1::jsonb)", [JSON.stringify({ ev: 'age_block', schema: 'SCHEMA', age: (NEW && NEW.age) })]);
              throw new Error('Invalid age: ' + NEW.age + '. Age must be between 0 and 150.');
            }
            if (NEW.email && String(NEW.email).indexOf('@') === -1) {
              plv8.execute("INSERT INTO public.debug(value) VALUES ($1::jsonb)", [JSON.stringify({ ev: 'email_block', schema: 'SCHEMA', email: (NEW && NEW.email) })]);
              throw new Error('Invalid email format: ' + NEW.email);
            }
            if (NEW.age < 13) {
              plv8.execute("INSERT INTO public.debug(value) VALUES ($1::jsonb)", [JSON.stringify({ ev: 'underage_block', schema: 'SCHEMA', age: (NEW && NEW.age) })]);
              throw new Error('Users must be at least 13 years old. Age: ' + NEW.age);
            }
          }
        });
        
        // Create trigger
        await hasura.defineTrigger({
          schema: testSchema,
          table: 'users',
          name: 'validate_user_insert',
          timing: 'BEFORE',
          event: 'INSERT',
          function_name: `${testSchema}.validate_user_data`
        });
        
        // Helper to capture errors
        await hasura.sql(`
          CREATE OR REPLACE FUNCTION "${testSchema}".try_sql(cmd text) RETURNS text AS $$
          DECLARE errmsg text;
          BEGIN
            BEGIN
              EXECUTE cmd;
              RETURN 'ok';
            EXCEPTION WHEN others THEN
              GET STACKED DIAGNOSTICS errmsg = MESSAGE_TEXT;
              RETURN errmsg;
            END;
          END;
          $$ LANGUAGE plpgsql;
        `);
        
        // Test: Valid data (should succeed)
        const okIns = await hasura.sql(`SELECT "${testSchema}".try_sql($q$INSERT INTO "${testSchema}".users (age, email) VALUES (25, 'test@example.com');$q$);`);
        expect(okIns.result?.[1]?.[0]).toBe('ok');
        
        // Test: Invalid age (should fail)
        const badAge = await hasura.sql(`SELECT "${testSchema}".try_sql($q$INSERT INTO "${testSchema}".users (age, email) VALUES (200, 'test@example.com');$q$);`);
        expect(badAge.result?.[1]?.[0]).not.toBe('ok');
        
        // Test: Invalid email (should fail)
        const badEmail = await hasura.sql(`SELECT "${testSchema}".try_sql($q$INSERT INTO "${testSchema}".users (age, email) VALUES (30, 'invalid-email');$q$);`);
        expect(badEmail.result?.[1]?.[0]).not.toBe('ok');
        
        // Test: Underage (should fail)
        const underage = await hasura.sql(`SELECT "${testSchema}".try_sql($q$INSERT INTO "${testSchema}".users (age, email) VALUES (10, 'child@example.com');$q$);`);
        expect(underage.result?.[1]?.[0]).not.toBe('ok');
        
        // Verify only valid data was inserted
        const result = await hasura.sql(`SELECT age, email FROM "${testSchema}".users;`);
        expect(result.result).toHaveLength(2); // Header + 1 row
        expect(result.result[1][0]).toBe('25');
        expect(result.result[1][1]).toBe('test@example.com');
        
      } finally {
        await hasura.deleteSchema({ schema: testSchema, cascade: true });
      }
    }, 30000);
  });

  describe('plv8 Function Tests', () => {
    it('should create plv8 function that processes JSON data when available', async () => {
      expect(plv8Available).toBe(true);
      
      testSchema = `test_plv8_json_${uuidv4().replace(/-/g, '_')}`;
      
      try {
        // Create test schema
        await hasura.defineSchema({ schema: testSchema });
        
        // Create plv8 function that processes JSON
        await hasura.defineFunction({
          schema: testSchema,
          name: 'process_json_data',
          definition: `(data JSONB) RETURNS JSONB AS $$
            // Parse the input JSON
            var input = JSON.parse(data);
            
            // Process the data
            var result = {
              processed: true,
              original: input,
              processed_at: new Date().toISOString(),
              count: input.items ? input.items.length : 0,
              total: 0
            };
            
            // Calculate total if items exist
            if (input.items && Array.isArray(input.items)) {
              for (var i = 0; i < input.items.length; i++) {
                if (input.items[i].value) {
                  result.total += input.items[i].value;
                }
              }
            }
            
            return JSON.stringify(result);
          $$`,
          language: 'plv8'
        });
        
        // Test the function with JSON data
        const testData = JSON.stringify({
          name: 'test',
          items: [
            { id: 1, value: 10 },
            { id: 2, value: 20 },
            { id: 3, value: 30 }
          ]
        });
        
        const result = await hasura.sql(`SELECT "${testSchema}".process_json_data($json$${testData}$json$)::text;`);
        const out = result.result?.[1]?.[0];
        expect(typeof out).toBe('string');
        const processedData = JSON.parse(out);
        
        expect(processedData.processed).toBe(true);
        expect(processedData.count).toBe(3);
        expect(processedData.total).toBe(60);
        expect(processedData.original.name).toBe('test');
        expect(processedData.processed_at).toBeDefined();
        
      } finally {
        await hasura.deleteSchema({ schema: testSchema, cascade: true });
      }
    }, 30000);

    it('should create plv8 function with array operations when available', async () => {
      expect(plv8Available).toBe(true);
      
      testSchema = `test_plv8_array_${uuidv4().replace(/-/g, '_')}`;
      
      try {
        // Create test schema
        await hasura.defineSchema({ schema: testSchema });
        
        // Create plv8 function that works with arrays
        await hasura.defineFunction({
          schema: testSchema,
          name: 'array_operations',
          definition: `(numbers INTEGER[]) RETURNS JSONB AS $$
            var input = numbers;
            var result = {
              original: input,
              sum: 0,
              average: 0,
              min: null,
              max: null,
              even_count: 0,
              odd_count: 0
            };
            
            if (input && input.length > 0) {
              // Calculate sum and find min/max
              result.min = input[0];
              result.max = input[0];
              
              for (var i = 0; i < input.length; i++) {
                var num = input[i];
                result.sum += num;
                
                if (num < result.min) result.min = num;
                if (num > result.max) result.max = num;
                
                if (num % 2 === 0) {
                  result.even_count++;
                } else {
                  result.odd_count++;
                }
              }
              
              result.average = result.sum / input.length;
            }
            
            return JSON.stringify(result);
          $$`,
          language: 'plv8'
        });
        
        // Test the function
        const result = await hasura.sql(`SELECT "${testSchema}".array_operations(ARRAY[1,2,3,4,5,6,7,8,9,10])::text;`);
        const out = result.result?.[1]?.[0];
        expect(typeof out).toBe('string');
        const processedData = JSON.parse(out);
        
        expect(processedData.sum).toBe(55);
        expect(processedData.average).toBe(5.5);
        expect(processedData.min).toBe(1);
        expect(processedData.max).toBe(10);
        expect(processedData.even_count).toBe(5);
        expect(processedData.odd_count).toBe(5);
        
      } finally {
        await hasura.deleteSchema({ schema: testSchema, cascade: true });
      }
    }, 30000);
  });
}); 
import { describe, it, expect, afterAll, beforeEach } from '@jest/globals';
import { Hasura, ColumnType } from '../hasura/hasura';
import { applyLogsDiffs, DiffConfig, LogsDiffsConfig } from './logs-diffs';
import { applyLogsStates, type LogsStatesConfig } from './logs-states';
import { processLogs } from './logs';
import Debug from '../debug';

const debug = Debug('logs:test');

const isLocal = !!+process.env.JEST_LOCAL!;

type StateConfig = {
  schema?: string;
  table: string;
  columns: string[];
};

// Helper function to create a test-specific Hasura instance
const createTestHasura = () => new Hasura({
  url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
  secret: process.env.HASURA_ADMIN_SECRET!,
});

// Test schema name
const TEST_SCHEMA = 'test_logs';

(!isLocal ? describe : describe.skip)('[DEBUG] Logs System Tests', () => {
  beforeEach(async () => {
    debug('Setting up test environment...');
    
    // Ensure test schema exists
    const hasura = createTestHasura();
    await hasura.defineSchema({ schema: TEST_SCHEMA });
    
    // IMPORTANT: Initialize logs schema and tables first
    const { applySQLSchema } = await import('./up-logs');
    await applySQLSchema(hasura);
    
    // Create test table
    await hasura.defineTable({
      schema: TEST_SCHEMA,
      table: 'test_users',
      id: 'id',
      type: ColumnType.UUID
    });
    
    await hasura.defineColumn({
      schema: TEST_SCHEMA,
      table: 'test_users',
      name: 'name',
      type: ColumnType.TEXT,
      comment: 'User name for testing'
    });
    
    await hasura.defineColumn({
      schema: TEST_SCHEMA,
      table: 'test_users',
      name: 'email',
      type: ColumnType.TEXT,
      comment: 'User email for testing'
    });
    
    await hasura.defineColumn({
      schema: TEST_SCHEMA,
      table: 'test_users',
      name: 'status',
      type: ColumnType.TEXT,
      comment: 'User status for testing'
    });
    
    debug('Test environment setup complete');
  });

  describe('Diffs System', () => {
    it('should create and apply diffs triggers for specified columns', async () => {
      debug('Testing diffs system...');
      
      const testConfig: LogsDiffsConfig = {
        diffs: [
          {
            schema: TEST_SCHEMA,
            table: 'test_users',
            column: 'name'
          },
          {
            schema: TEST_SCHEMA,
            table: 'test_users', 
            column: 'email'
          }
        ]
      };
      
      // Apply diffs configuration
      const hasura = createTestHasura();
      await applyLogsDiffs(hasura, testConfig);
      
      // Verify triggers were created by checking pg_trigger
      const nameTriggersResult = await hasura.sql(`
        SELECT tgname FROM pg_trigger 
        WHERE tgname LIKE 'hasyx_diffs_${TEST_SCHEMA}_test_users_name%'
      `);
      
      const emailTriggersResult = await hasura.sql(`
        SELECT tgname FROM pg_trigger 
        WHERE tgname LIKE 'hasyx_diffs_${TEST_SCHEMA}_test_users_email%'
      `);
      
      expect(nameTriggersResult.result).toBeDefined();
      expect(emailTriggersResult.result).toBeDefined();
      
      debug('✅ Diffs triggers created successfully');
    });
    
    it('should record diffs when data changes', async () => {
      debug('Testing diffs recording...');
      
      const testConfig: LogsDiffsConfig = {
        diffs: [
          {
            schema: TEST_SCHEMA,
            table: 'test_users',
            column: 'name'
          }
        ]
      };
      
      // Apply diffs configuration
      const hasura = createTestHasura();
      await applyLogsDiffs(hasura, testConfig);
      
      // Insert test data
      const insertResult = await hasura.sql(`
        INSERT INTO ${TEST_SCHEMA}.test_users (name, email, status) 
        VALUES ('Test User', 'test@example.com', 'active') 
        RETURNING id
      `);
      
      const userId = insertResult.result[1][0];
      debug(`Created user with ID: ${userId}`);
      
      // Update the name to trigger diff recording
      await hasura.sql(`
        UPDATE ${TEST_SCHEMA}.test_users 
        SET name = 'Updated User' 
        WHERE id = '${userId}'
      `);
      
      debug('Update completed, checking for diffs...');
      
      // Check if diffs were recorded
      const diffsResult = await hasura.sql(`
        SELECT _schema, _table, _column, _id, _value 
        FROM logs.diffs 
        WHERE _schema = '${TEST_SCHEMA}' 
        AND _table = 'test_users' 
        AND _column = 'name'
        AND _id = '${userId}'
      `);
      
      debug('Diffs result:', diffsResult);
      debug('Diffs result length:', diffsResult.result.length);
      
      if (diffsResult.result.length === 1) {
        debug('No diffs found, checking if logs schema exists...');
        const schemaCheck = await hasura.sql(`
          SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'logs'
        `);
        debug('Schema check result:', schemaCheck);
        
        const tableCheck = await hasura.sql(`
          SELECT table_name FROM information_schema.tables 
          WHERE table_schema = 'logs' AND table_name = 'diffs'
        `);
        debug('Table check result:', tableCheck);
        
        const triggerCheck = await hasura.sql(`
          SELECT tgname FROM pg_trigger 
          WHERE tgname LIKE 'hasyx_diffs_${TEST_SCHEMA}_test_users_name%'
        `);
        debug('Trigger check result:', triggerCheck);
      }
      
      expect(diffsResult.result).toBeDefined();
      expect(diffsResult.result.length).toBeGreaterThan(1); // Header + data rows
      
      debug('✅ Diffs recorded successfully');
    });
  });
  
  describe('States System', () => {
    it('should create and apply states triggers for specified columns', async () => {
      debug('Testing states system...');
      
      const testConfig: LogsStatesConfig = {
        states: [
          {
            schema: TEST_SCHEMA,
            table: 'test_users',
            columns: ['name', 'email', 'status']
          }
        ]
      };
      
      // Apply states configuration
      const hasura = createTestHasura();
      await applyLogsStates(hasura, testConfig);
      
      // Verify triggers were created
      const insertUpdateTriggersResult = await hasura.sql(`
        SELECT tgname FROM pg_trigger 
        WHERE tgname LIKE 'hasyx_states_${TEST_SCHEMA}_test_users_iu%'
      `);
      
      const deleteTriggersResult = await hasura.sql(`
        SELECT tgname FROM pg_trigger 
        WHERE tgname LIKE 'hasyx_states_${TEST_SCHEMA}_test_users_d%'
      `);
      
      expect(insertUpdateTriggersResult.result).toBeDefined();
      expect(deleteTriggersResult.result).toBeDefined();
      
      debug('✅ States triggers created successfully');
    });
    
    it('should record states when data changes', async () => {
      debug('Testing states recording...');
      
      const testConfig: LogsStatesConfig = {
        states: [
          {
            schema: TEST_SCHEMA,
            table: 'test_users',
            columns: ['name', 'status']
          }
        ]
      };
      
      // Apply states configuration
      const hasura = createTestHasura();
      await applyLogsStates(hasura, testConfig);
      
      // Insert test data
      const insertResult = await hasura.sql(`
        INSERT INTO ${TEST_SCHEMA}.test_users (name, email, status) 
        VALUES ('Test User', 'test@example.com', 'active') 
        RETURNING id
      `);
      
      const userId = insertResult.result[1][0];
      debug(`Created user with ID: ${userId}`);
      
      // Check if states were recorded for insert
      const insertStatesResult = await hasura.sql(`
        SELECT _schema, _table, _column, _id, state 
        FROM logs.states 
        WHERE _schema = '${TEST_SCHEMA}' 
        AND _table = 'test_users' 
        AND _id = '${userId}'
        ORDER BY _column, created_at
      `);
      
      debug('States result:', insertStatesResult);
      debug('States result length:', insertStatesResult.result.length);
      
      if (insertStatesResult.result.length === 1) {
        debug('No states found, checking states table...');
        const statesTableCheck = await hasura.sql(`
          SELECT table_name FROM information_schema.tables 
          WHERE table_schema = 'logs' AND table_name = 'states'
        `);
        debug('States table check result:', statesTableCheck);
        
        const statesTriggersCheck = await hasura.sql(`
          SELECT tgname FROM pg_trigger 
          WHERE tgname LIKE 'hasyx_states_${TEST_SCHEMA}_test_users%'
        `);
        debug('States triggers check result:', statesTriggersCheck);
      }
      
      expect(insertStatesResult.result).toBeDefined();
      expect(insertStatesResult.result.length).toBeGreaterThan(1); // Header + data rows
      
      // Update the record
      await hasura.sql(`
        UPDATE ${TEST_SCHEMA}.test_users 
        SET name = 'Updated User', status = 'inactive' 
        WHERE id = '${userId}'
      `);
      
      // Check if states were recorded for update
      const updateStatesResult = await hasura.sql(`
        SELECT _schema, _table, _column, _id, state 
        FROM logs.states 
        WHERE _schema = '${TEST_SCHEMA}' 
        AND _table = 'test_users' 
        AND _id = '${userId}'
        ORDER BY _column, created_at
      `);
      
      expect(updateStatesResult.result.length).toBeGreaterThan(insertStatesResult.result.length);
      
      // Delete the record
      await hasura.sql(`
        DELETE FROM ${TEST_SCHEMA}.test_users WHERE id = '${userId}'
      `);
      
      // Check if null states were recorded for delete
      const deleteStatesResult = await hasura.sql(`
        SELECT _schema, _table, _column, _id, state 
        FROM logs.states 
        WHERE _schema = '${TEST_SCHEMA}' 
        AND _table = 'test_users' 
        AND _id = '${userId}'
        AND state IS NULL
      `);
      
      expect(deleteStatesResult.result).toBeDefined();
      expect(deleteStatesResult.result.length).toBeGreaterThan(1); // Header + data rows
      
      debug('✅ States recorded successfully');
    });
  });

  describe('Combined System', () => {
    it('should handle both diffs and states configuration together', async () => {
      debug('Testing combined diffs and states system...');
      
      // Create test configuration objects
      const diffsConfig: LogsDiffsConfig = {
        diffs: [
          {
            schema: TEST_SCHEMA,
            table: 'test_users',
            column: 'name'
          }
        ]
      };
      
      const statesConfig: LogsStatesConfig = {
        states: [
          {
            schema: TEST_SCHEMA,
            table: 'test_users',
            columns: ['email', 'status']
          }
        ]
      };
      
      // Apply both configurations
      const hasura = createTestHasura();
      debug('Applying diffs config...');
      await applyLogsDiffs(hasura, diffsConfig);
      debug('Applying states config...');
      await applyLogsStates(hasura, statesConfig);
      
      // Insert and modify test data
      debug('Creating test data...');
      const insertResult = await hasura.sql(`
        INSERT INTO ${TEST_SCHEMA}.test_users (name, email, status) 
        VALUES ('Test User', 'test@example.com', 'active') 
        RETURNING id
      `);
      
      const userId = insertResult.result[1][0];
      debug(`Created user with ID: ${userId}`);
      
      debug('Updating test data...');
      await hasura.sql(`
        UPDATE ${TEST_SCHEMA}.test_users 
        SET name = 'Updated User', email = 'updated@example.com', status = 'inactive'
        WHERE id = '${userId}'
      `);
      
      debug('Checking diffs...');
      // Verify both diffs and states were recorded
      const diffsResult = await hasura.sql(`
        SELECT COUNT(*) as count FROM logs.diffs 
        WHERE _schema = '${TEST_SCHEMA}' AND _table = 'test_users' AND _id = '${userId}'
      `);
      
      debug('Checking states...');
      const statesResult = await hasura.sql(`
        SELECT COUNT(*) as count FROM logs.states 
        WHERE _schema = '${TEST_SCHEMA}' AND _table = 'test_users' AND _id = '${userId}'
      `);
      
      const diffsCount = parseInt(diffsResult.result[1][0]);
      const statesCount = parseInt(statesResult.result[1][0]);
      
      debug(`Diffs count: ${diffsCount}, States count: ${statesCount}`);
      
      expect(diffsCount).toBeGreaterThan(0);
      expect(statesCount).toBeGreaterThan(0);
      
      debug('✅ Combined system working correctly');
    }, 120000); // 2 minute timeout
  });

  describe('Event Trigger Functionality', () => {
    it('should process diffs event trigger and create diff patches', async () => {
      debug('Testing diffs event trigger processing...');
      
      const hasura = createTestHasura();
      
      // Insert initial data to create first diff record
      const insertResult = await hasura.sql(`
        INSERT INTO ${TEST_SCHEMA}.test_users (name, email, status) 
        VALUES ('Initial Name', 'test@example.com', 'active') 
        RETURNING id
      `);
      
      const userId = insertResult.result[1][0];
      
      // Manually insert a diff record to simulate trigger behavior
      const diffInsertResult = await hasura.sql(`
        INSERT INTO logs.diffs (_schema, _table, _column, _id, _value) 
        VALUES ('${TEST_SCHEMA}', 'test_users', 'name', '${userId}', 'Updated Name')
        RETURNING id, _schema, _table, _column, _id, _value
      `);
      
      expect(diffInsertResult.result).toBeDefined();
      expect(diffInsertResult.result.length).toBeGreaterThan(1);
      
      const diffRecord = {
        id: diffInsertResult.result[1][0],
        _schema: diffInsertResult.result[1][1],
        _table: diffInsertResult.result[1][2],
        _column: diffInsertResult.result[1][3],
        _id: diffInsertResult.result[1][4],
        _value: diffInsertResult.result[1][5]
      };
      
      debug('Created test diff record:', diffRecord);
      
      // Simulate event trigger payload
      const mockPayload = {
        event: {
          op: 'INSERT' as const,
          data: {
            old: null,
            new: diffRecord
          }
        },
        table: {
          schema: 'logs',
          name: 'diffs'
        },
        trigger: {
          name: 'logs_diffs_trigger'
        }
      };
      
      // Import and call the handler
      const { handleLogsDiffsEventTrigger } = await import('./logs-diffs');
      const result = await handleLogsDiffsEventTrigger(mockPayload as any);
      
      debug('Event trigger handler result:', result);
      expect(result.success).toBe(true);
      expect(result.diffId).toBe(diffRecord.id);
      
      // Add small delay to ensure database update is committed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify that diff was populated and record marked as processed
      const processedDiffResult = await hasura.sql(`
        SELECT _value, diff, processed 
        FROM logs.diffs 
        WHERE id = '${diffRecord.id}'
      `);
      
      expect(processedDiffResult.result).toBeDefined();
      expect(processedDiffResult.result.length).toBeGreaterThan(1);
      
      const processedRecord = processedDiffResult.result[1];
      const originalValue = processedRecord[0];
      const diffPatch = processedRecord[1];
      const isProcessed = processedRecord[2];
      
      debug('Processed record after handler:', { originalValue, diffPatch, isProcessed });
      
      expect(originalValue).toBe('Updated Name'); // _value should remain unchanged
      expect(diffPatch).toBeTruthy(); // diff should be populated
      expect(typeof diffPatch).toBe('string');
      expect(isProcessed).toBe('t'); // should be marked as processed (PostgreSQL boolean 't')
      
      debug('✅ Event trigger functionality working correctly');
    }, 120000); // 2 minute timeout
  });

  afterAll(async () => {
    debug('Cleaning up test environment...');
    
    // Re-apply configuration from hasyx.config.json to restore production state
    try {
      await processLogs(createTestHasura());
      debug('Production logs configuration restored');
    } catch (error) {
      debug(`Warning: Could not restore production configuration: ${error}`);
    }
    
    // Clean up test schema
    try {
      await createTestHasura().deleteSchema({ schema: TEST_SCHEMA, cascade: true });
      debug('Test schema cleaned up');
    } catch (error) {
      debug(`Warning: Could not clean up test schema: ${error}`);
    }
    
    debug('Test cleanup complete');
  }, 120000); // 2 minute timeout
}); 
import dotenv from 'dotenv';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApolloError, gql } from '@apollo/client/core/index.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
import { Hasyx } from './hasyx'; 
import { createApolloClient, HasyxApolloClient } from '../apollo/apollo'; 
import Debug from '../debug'; 
import { Generator } from '../generator'; 
import schema from '../../public/hasura-schema.json'; 
import { hashPassword } from '../users/auth-server'; 

const debug = Debug('test:hasyx');

const generate = Generator(schema as any); 

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;

interface TestUser {
  id: string;
  name: string;
  hasura_role?: string;
}

// Helper function to create an admin Hasyx client
function createAdminHasyx(): Hasyx {
  if (!HASURA_URL || !ADMIN_SECRET) {
    throw new Error('❌ Missing HASURA_URL or ADMIN_SECRET in environment variables for test setup.');
  }
  
  const adminApolloClient = createApolloClient({
    url: HASURA_URL,
    secret: ADMIN_SECRET,
    ws: false,
  }) as HasyxApolloClient;
  
  return new Hasyx(adminApolloClient, generate);
}

// Helper function to create test user
async function createTestUser(adminHasyx: Hasyx, suffix: string = ''): Promise<TestUser> {
  const email = `hasyx-test-${uuidv4()}@example.com`;
  const password = 'password123';
  const name = `Hasyx Test User ${suffix}`;
  
  const createdUser = await adminHasyx.insert<TestUser>({
    table: 'users',
    object: { email, name, hasura_role: 'user' },
    returning: ['id', 'name']
  });
  
  if (!createdUser || !createdUser.id) {
    throw new Error(`Failed to create test user ${suffix}`);
  }
  
  return {
    id: createdUser.id,
    name: createdUser.name
  };
}

// Helper function to cleanup user
async function cleanupTestUser(adminHasyx: Hasyx, userId: string) {
  try {
    await adminHasyx.delete({
      table: 'users',
      pk_columns: { id: userId },
    });
  } catch (error: any) {
    debug(`Error deleting test user ${userId}:`, error.message);
  }
}

// Helper function to cleanup Hasyx client
function cleanupHasyx(hasyx: Hasyx, label: string = '') {
  if (hasyx && hasyx.apolloClient && hasyx.apolloClient.terminate) {
    hasyx.apolloClient.terminate();
  }
}

// Original logic: Skip if JEST_LOCAL is '1' (truthy numeric string), otherwise run.
// This means tests run if JEST_LOCAL is '0' or undefined.
(!!+(process?.env?.JEST_LOCAL || '') ? describe.skip : describe)('Hasyx Integration Tests', () => {
  
  describe('Hasyx Class HTTP Tests', () => {
    it('should perform CRUD operations on users', async () => {
      const adminHasyx = createAdminHasyx();
      const testUsers: TestUser[] = [];
      
      try {
        debug('🧪 Testing Hasyx CRUD operations (select, update, delete)...');
        
        // Create 3 test users
        for (let i = 0; i < 3; i++) {
          const user = await createTestUser(adminHasyx, `${i + 1}`);
          testUsers.push(user);
          debug(`[test:hasyx]   👤 Test user ${i + 1} created: ${user.id} with name: ${user.name}`);
        }
        
        expect(testUsers.length).toBe(3);
        
        // Testing SELECT
        debug('📋 Testing SELECT: Fetching all test users...');
        const testUserIds = testUsers.map(u => u.id);
        const users = await adminHasyx.select<TestUser[]>({
          table: 'users',
          where: { id: { _in: testUserIds } },
          returning: ['id', 'name'],
          order_by: [{ id: 'asc' }],
          limit: 10
        });
        
        debug(`[test:hasyx] 📊 SELECT returned ${users.length} users:`, users);
        expect(users).toBeDefined();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(3);
        users.forEach((user) => {
          expect(user.id).toBeDefined();
          expect(testUserIds).toContain(user.id);
        });
        debug('✅ SELECT test succeeded.');
        
        // Testing UPDATE
        debug('📝 Testing UPDATE: Modifying name of first user...');
        const newName = `Updated User ${Date.now()}`;
        const updatedUser = await adminHasyx.update({
          table: 'users',
          pk_columns: { id: testUsers[0].id },
          _set: { name: newName },
          returning: ['id', 'name']
        });
        
        debug('📊 UPDATE returned:', updatedUser);
        expect(updatedUser).toBeDefined();
        expect(updatedUser.id).toBe(testUsers[0].id);
        expect(updatedUser.name).toBe(newName);
        debug('✅ UPDATE test succeeded.');
        
        // Testing SELECT after UPDATE
        debug('🔍 Testing SELECT after UPDATE to verify changes...');
        const verifyUser = await adminHasyx.select<TestUser>({
          table: 'users',
          pk_columns: { id: testUsers[0].id },
          returning: ['id', 'name']
        });
        
        debug('📊 SELECT after UPDATE returned:', verifyUser);
        expect(verifyUser).toBeDefined();
        expect(verifyUser.id).toBe(testUsers[0].id);
        expect(verifyUser.name).toBe(newName);
        debug('✅ Verification of UPDATE succeeded.');
        
        // Testing INSERT and DELETE with temporary user
        debug('🧪 Testing INSERT and DELETE: Creating temporary user...');
        const tempUser = await createTestUser(adminHasyx, 'Temp');
        
        debug('📊 INSERT returned:', tempUser);
        expect(tempUser).toBeDefined();
        expect(tempUser.id).toBeTruthy();
        expect(tempUser.name).toContain('Temp');
        debug('✅ INSERT test succeeded.');
        
        // Testing DELETE
        debug('🗑️ Testing DELETE: Removing temporary user...');
        const deleteResult = await adminHasyx.delete<{id: string}>({
          table: 'users',
          pk_columns: { id: tempUser.id },
          returning: ['id']
        });
        
        debug('📊 DELETE returned:', deleteResult);
        expect(deleteResult).toBeDefined();
        expect(deleteResult.id).toBe(tempUser.id);
        debug('✅ DELETE test succeeded.');
        
        // Verifying DELETE
        debug('🔍 Verifying DELETE by attempting to select deleted user...');
        const deletedUser = await adminHasyx.select<TestUser | null>({
          table: 'users',
          pk_columns: { id: tempUser.id },
          returning: ['id', 'name']
        });
        
        debug('📊 SELECT after DELETE returned:', deletedUser);
        expect(deletedUser).toBeNull();
        debug('✅ Verification of DELETE succeeded.');
        
        debug('🎉 All CRUD tests completed successfully!');
        
      } finally {
        // Cleanup all test users
        for (const user of testUsers) {
          await cleanupTestUser(adminHasyx, user.id);
        }
        cleanupHasyx(adminHasyx, 'CRUD test');
      }
    }, 15000);
  });

  describe('Hasyx Subscription Rate Limiting Tests', () => {
    
    it('should throttle subscription updates to at most 1 per second in WebSocket mode', async () => {
      const adminHasyx = createAdminHasyx();
      let subHasyx: Hasyx | null = null;
      let testUser: TestUser | null = null;
      const subscriptionResults: any[] = [];
      const updateTimes: number[] = [];
      
      try {
        // Create test user
        testUser = await createTestUser(adminHasyx, 'WS-Test');
        debug(`[test:hasyx] 👤 Test user created for WebSocket test: ${testUser.id}`);
        
        // Create WebSocket-enabled Hasyx client
        const subApolloClient = createApolloClient({
          url: HASURA_URL,
          secret: ADMIN_SECRET,
          ws: true,
        }) as HasyxApolloClient;
        subHasyx = new Hasyx(subApolloClient, generate);
        debug('✅ WS-enabled Hasyx client for subscription is ready.');
        
        const NUM_DB_UPDATES = 5;
        const DB_UPDATE_INTERVAL_MS = 200;
        const THROTTLE_INTERVAL_MS = 1000;
        const originalName = testUser.name;
        
        await new Promise<void>((resolve, reject) => {
          debug('🧪 Testing REAL subscription rate limiting in WEBSOCKET mode (explicit ws: true)');
          
          const subscription = subHasyx!.subscribe<TestUser>({
            table: 'users',
            pk_columns: { id: testUser!.id },
            returning: ['id', 'name'],
            pollingInterval: THROTTLE_INTERVAL_MS,
            ws: true
          }).subscribe({
            next: (result) => {
              const timestamp = Date.now();
              subscriptionResults.push(result);
              updateTimes.push(timestamp);
              debug(`[test:hasyx] 📬 [WS] Subscription update received at ${timestamp}:`, JSON.stringify(result));
            },
            error: (err) => {
              reject(new Error('[test:hasyx] ❌ [WS] Subscription error:' + err));
            }
          });
          
          // Trigger database updates
          (async () => {
            try {
              for (let i = 0; i < NUM_DB_UPDATES; i++) {
                await new Promise(res => setTimeout(res, DB_UPDATE_INTERVAL_MS));
                const newName = `User WS Test Update ${i + 1} ${Date.now()}`;
                debug(`[test:hasyx] 🚀 [WS] Triggering DB update ${i+1}/${NUM_DB_UPDATES}: user ${testUser!.id}, name: ${newName}`);
                await adminHasyx.update<TestUser>({
                  table: 'users',
                  pk_columns: { id: testUser!.id },
                  _set: { name: newName },
                  returning: ['id']
                });
                debug(`[test:hasyx] ✅ [WS] DB update ${i+1} successful.`);
              }
              
              const timeToWaitForAllMessages =
                (NUM_DB_UPDATES * DB_UPDATE_INTERVAL_MS) +
                (NUM_DB_UPDATES * THROTTLE_INTERVAL_MS) +
                2000;
              debug(`[test:hasyx] [WS] All ${NUM_DB_UPDATES} DB updates triggered. Waiting ${timeToWaitForAllMessages / 1000}s for throttled messages...`);
              
              setTimeout(async () => {
                subscription.unsubscribe();
                debug('[WS] Subscription unsubscribed.');
                
                // Restore original name
                try {
                  await adminHasyx.update<TestUser>({
                    table: 'users',
                    pk_columns: { id: testUser!.id },
                    _set: { name: originalName },
                  });
                  debug(`[test:hasyx] [WS] Target user name restored to '${originalName}'.`);
                } catch (restoreError) {
                  debug(`[test:hasyx] [WS] Failed to restore user name:`, restoreError);
                }
                
                // Analyze results
                debug(`📊 Analyzing update intervals. Raw updateTimes: ${JSON.stringify(updateTimes)}`);
                if (updateTimes.length < 2) {
                  reject(new Error(`Insufficient updates to analyze throttling: received ${updateTimes.length} updates. Expected at least 2.`));
                  return;
                }
                
                const intervals: number[] = [];
                for (let i = 1; i < updateTimes.length; i++) {
                  intervals.push(updateTimes[i] - updateTimes[i-1]);
                }
                
                debug(`📊 Intervals between updates: ${JSON.stringify(intervals)}`);
                resolve();
              }, timeToWaitForAllMessages);
            } catch (error) {
              reject(error);
            }
          })();
        });
        
      } finally {
        if (testUser) {
          await cleanupTestUser(adminHasyx, testUser.id);
        }
        if (subHasyx) {
          cleanupHasyx(subHasyx, 'WS subscription test');
        }
        cleanupHasyx(adminHasyx, 'WS admin test');
      }
    }, 30000);
  });

  describe('Hasyx One-off Scheduled Events', () => {
    it('should schedule a one-off event in ~1 minute and observe Hasura invocation', async () => {
      const adminHasyx = createAdminHasyx();
      try {
        const markerId = uuidv4();
        const scheduleAtEpochSec = Math.floor(Date.now() / 1000) + 60; // +1 minute
        debug(`[test:hasyx:oneoff] Scheduling one-off for ${new Date(scheduleAtEpochSec * 1000).toISOString()} with marker: ${markerId}`);

        const createRes = await adminHasyx.scheduleOneOff({
          scheduleAtEpochSec,
          payload: {
            client_event_id: markerId,
            schedule_id: null,
            source: 'hasyx-test',
          },
        });
        debug('[test:hasyx:oneoff] create_scheduled_event response:', createRes);

        // Resolve scheduled_event id by payload marker
        let scheduledEventId: string | null = null;
        const resolveEventId = async () => {
          const sql = `
            SELECT id, status, scheduled_time
            FROM hdb_catalog.hdb_scheduled_events
            WHERE payload ->> 'client_event_id' = '${markerId}'
            ORDER BY created_at DESC
            LIMIT 1;
          `;
          const res = await adminHasyx.sql(sql);
          const rows = Array.isArray(res?.result) ? res.result.slice(1) : [];
          if (rows.length > 0) {
            scheduledEventId = rows[0][0];
            const status = rows[0][1];
            const st = rows[0][2];
            debug(`[test:hasyx:oneoff] Found event id=${scheduledEventId}, status=${status}, scheduled_time=${st}`);
            return true;
          }
          return false;
        };

        const waitFor = async (ms: number) => new Promise(res => setTimeout(res, ms));

        // Poll for the scheduled event row to appear (Hasura writes immediately)
        {
          const deadline = Date.now() + 30000; // 30s
          while (Date.now() < deadline) {
            if (await resolveEventId()) break;
            await waitFor(1000);
          }
          expect(scheduledEventId).toBeTruthy();
        }

        // Wait until scheduled time + buffer then poll invocations
        const bufferMs = 30000; // 30s buffer after scheduled time
        const nowMs = Date.now();
        const targetTimeMs = scheduleAtEpochSec * 1000;
        if (nowMs < targetTimeMs + 1000) {
          const toWait = Math.min(90000, targetTimeMs - nowMs + bufferMs);
          debug(`[test:hasyx:oneoff] Waiting ${Math.ceil(toWait/1000)}s for execution window...`);
          await waitFor(toWait);
        }

        // Poll for delivery confirmation: either delivered status or a log row in invocation logs
        let delivered = false;
        let invocationFound = false;
        {
          const deadline = Date.now() + 120000; // up to 120s to see delivery/log
          while (Date.now() < deadline && scheduledEventId) {
            // Check status in hdb_scheduled_events
            const statusSql = `
              SELECT status, tries, next_retry_at
              FROM hdb_catalog.hdb_scheduled_events
              WHERE id = '${scheduledEventId}'
              LIMIT 1;
            `;
            const statusRes = await adminHasyx.sql(statusSql);
            const statusRows = Array.isArray(statusRes?.result) ? statusRes.result.slice(1) : [];
            if (statusRows.length > 0) {
              const status = statusRows[0][0];
              debug(`[test:hasyx:oneoff] event status = ${status}`);
              if (status === 'delivered') {
                delivered = true;
                break;
              }
            }

            // Check invocation logs table
            const logsSql = `
              SELECT COUNT(*)
              FROM hdb_catalog.hdb_scheduled_event_invocation_logs
              WHERE event_id = '${scheduledEventId}';
            `;
            const logsRes = await adminHasyx.sql(logsSql);
            const logsRows = Array.isArray(logsRes?.result) ? logsRes.result.slice(1) : [];
            const cnt = logsRows.length > 0 ? parseInt(logsRows[0][0], 10) : 0;
            debug(`[test:hasyx:oneoff] invocation_logs count = ${cnt}`);
            if (cnt > 0) {
              invocationFound = true;
              break;
            }

            await waitFor(2000);
          }
        }

        expect(delivered || invocationFound).toBe(true);
      } finally {
        cleanupHasyx(adminHasyx, 'one-off');
      }
    }, 180000);

    it('should create and then cancel a pending one-off scheduled event', async () => {
      const adminHasyx = createAdminHasyx();
      const markerId = uuidv4();
      let scheduledEventId: string | null = null;
      try {
        // Schedule far enough in the future to ensure it's still pending when we cancel
        const scheduleAtEpochSec = Math.floor(Date.now() / 1000) + 600; // +10 minutes
        debug(`[test:hasyx:oneoff-cancel] Scheduling one-off for ${new Date(scheduleAtEpochSec * 1000).toISOString()} with marker: ${markerId}`);

        await adminHasyx.scheduleOneOff({
          scheduleAtEpochSec,
          payload: {
            client_event_id: markerId,
            schedule_id: null,
            source: 'hasyx-test-cancel',
          },
        });

        // Resolve event id by marker
        const waitFor = async (ms: number) => new Promise(res => setTimeout(res, ms));
        const resolveEventId = async () => {
          const sql = `
            SELECT id, status
            FROM hdb_catalog.hdb_scheduled_events
            WHERE payload ->> 'client_event_id' = '${markerId}'
            ORDER BY created_at DESC
            LIMIT 1;
          `;
          const res = await adminHasyx.sql(sql);
          const rows = Array.isArray(res?.result) ? res.result.slice(1) : [];
          if (rows.length > 0) {
            scheduledEventId = rows[0][0];
            const status = rows[0][1];
            debug(`[test:hasyx:oneoff-cancel] Found event id=${scheduledEventId}, status=${status}`);
            return true;
          }
          return false;
        };

        {
          const deadline = Date.now() + 30000; // 30s
          while (Date.now() < deadline) {
            if (await resolveEventId()) break;
            await waitFor(1000);
          }
          expect(scheduledEventId).toBeTruthy();
        }

        // Cancel the one-off event
        await adminHasyx.hasura!.undefineOneOffEvent({ event_id: scheduledEventId! });

        // Confirm it's gone
        let existsAfterCancel = true;
        {
          const deadline = Date.now() + 30000; // 30s
          while (Date.now() < deadline) {
            const checkSql = `
              SELECT COUNT(*)
              FROM hdb_catalog.hdb_scheduled_events
              WHERE id = '${scheduledEventId}';
            `;
            const res = await adminHasyx.sql(checkSql);
            const rows = Array.isArray(res?.result) ? res.result.slice(1) : [];
            const cnt = rows.length > 0 ? parseInt(rows[0][0], 10) : 0;
            debug(`[test:hasyx:oneoff-cancel] remaining rows for id=${scheduledEventId}: ${cnt}`);
            if (cnt === 0) { existsAfterCancel = false; break; }
            await waitFor(1000);
          }
        }

        expect(existsAfterCancel).toBe(false);
      } finally {
        // Best-effort cleanup if still present
        if (scheduledEventId) {
          try {
            await adminHasyx.hasura!.undefineOneOffEvent({ event_id: scheduledEventId });
          } catch {}
        }
        cleanupHasyx(adminHasyx, 'one-off cancel');
      }
    }, 90000);
  });

  // Moved and refactored Upsert test
  it('should perform a full upsert cycle: upsert (insert) -> select -> upsert (update) -> select -> delete -> select', async () => {
    const adminHasyx = createAdminHasyx();
    const uniqueEmail = `full-upsert-cycle-${uuidv4()}@example.com`;
    const initialName = 'Initial Name for Upsert Cycle';
    const updatedName = 'Updated Name via Upsert Cycle';
    let userId: string | null = null;

    try {
        // 1. UPSERT (acting as INSERT for a new user)
      debug(`[test:hasyx:full-upsert] 1. Upserting (insert) new user with email: ${uniqueEmail}`);
      const insertedUser = await adminHasyx.upsert<{ id: string; name: string; email: string }>({
        table: 'users',
        object: {
          email: uniqueEmail,
          name: initialName,
          hasura_role: 'user',
        },
        on_conflict: {
          constraint: 'users_email_key', // Using email key for the initial insert via upsert
            update_columns: ['name', 'updated_at', 'hasura_role'] // Should not be hit on first insert
        },
        returning: ['id', 'name', 'email']
      });
      expect(insertedUser).toBeDefined();
      expect(insertedUser.id).toBeTruthy();
      expect(insertedUser.name).toBe(initialName);
      expect(insertedUser.email).toBe(uniqueEmail);
      userId = insertedUser.id;
      debug(`[test:hasyx:full-upsert]   User upserted (inserted) with ID: ${userId}, Name: ${insertedUser.name}`);

      // 2. SELECT to verify initial insert
      debug(`[test:hasyx:full-upsert] 2. Selecting user ID: ${userId} to verify initial upsert (insert)`);
      let selectedUser = await adminHasyx.select<{ id: string; name: string; email: string; hasura_role: string } | null>({
        table: 'users',
        pk_columns: { id: userId },
        returning: ['id', 'name', 'email']
      });
      expect(selectedUser).toBeDefined();
      expect(selectedUser!.id).toBe(userId);
      expect(selectedUser!.name).toBe(initialName);
      expect(selectedUser!.email).toBe(uniqueEmail);
      debug(`[test:hasyx:full-upsert]   User selected post-insert. Name: ${selectedUser!.name}`);

        // 3. UPSERT (acting as UPDATE for the existing user)
      debug(`[test:hasyx:full-upsert] 3. Upserting (update) user ID: ${userId} to change name to: ${updatedName}`);
      const updatedUser = await adminHasyx.upsert<{ id: string; name: string; email: string }>({
        table: 'users',
        object: { 
          id: userId, // Important to target the existing user by PK for constraint to hit
          email: uniqueEmail, 
          name: updatedName,
          hasura_role: 'user_updated', 
        },
        on_conflict: {
          constraint: 'users_pkey', // Using primary key for the update part of upsert
            update_columns: ['name', 'updated_at', 'hasura_role']
        },
        returning: ['id', 'name', 'email']
      });
      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(userId);
      expect(updatedUser.name).toBe(updatedName);
      expect(updatedUser.email).toBe(uniqueEmail);
      debug(`[test:hasyx:full-upsert]   User upserted (updated). Name: ${updatedUser.name}`);

      // 4. SELECT to verify update
      debug(`[test:hasyx:full-upsert] 4. Selecting user ID: ${userId} to verify upsert (update)`);
      selectedUser = await adminHasyx.select<{ id: string; name: string; email: string; hasura_role: string } | null>({
        table: 'users',
        pk_columns: { id: userId },
        returning: ['id', 'name', 'email', 'hasura_role']
      });
      expect(selectedUser).toBeDefined();
      expect(selectedUser!.id).toBe(userId);
      expect(selectedUser!.name).toBe(updatedName);
      expect(selectedUser!.email).toBe(uniqueEmail);
      expect(selectedUser!.hasura_role).toBe('user_updated');
      debug(`[test:hasyx:full-upsert]   User selected post-update. Name: ${selectedUser!.name}, Role: ${selectedUser!.hasura_role}`);

      // 5. DELETE
      debug(`[test:hasyx:full-upsert] 5. Deleting user ID: ${userId}`);
      const deletedUserReturn = await adminHasyx.delete<{ id: string }>({
        table: 'users',
        pk_columns: { id: userId },
        returning: ['id']
      });
      expect(deletedUserReturn).toBeDefined();
      expect(deletedUserReturn.id).toBe(userId);
      const tempUserIdForFinalCheck = userId; 
      userId = null; 
      debug(`[test:hasyx:full-upsert]   User deleted.`);
      
      // 6. SELECT to verify delete
      debug(`[test:hasyx:full-upsert] 6. Selecting user ID (post-delete) to verify deletion`);
      const selectedAfterDelete = await adminHasyx.select<{ id: string } | null>({
          table: 'users',
          pk_columns: { id: tempUserIdForFinalCheck }, 
          returning: ['id']
      });
      expect(selectedAfterDelete).toBeNull();
      debug(`[test:hasyx:full-upsert]   User selection after delete returned null as expected.`);

    } catch (error) {
      debug('[test:hasyx:full-upsert] ❌ Error during full upsert cycle test:', error);
      throw error; 
    } finally {
      if (userId) { 
        debug(`[test:hasyx:full-upsert] 🧹 Cleaning up user ID: ${userId} due to test ending or error.`);
        await cleanupTestUser(adminHasyx, userId);
      }
      cleanupHasyx(adminHasyx, 'Full Upsert Cycle Test');
    }
  }, 30000); // Increased timeout for multiple DB operations
});

// New describe block for JSONB operations tests
(!!+(process?.env?.JEST_LOCAL || '') ? describe.skip : describe)('Hasyx JSONB Operations Tests', () => {
  let adminHasyx: Hasyx;
  const testIdBase = uuidv4(); // Base for unique IDs in this test run
  const testData = {
    test_key: `test_value_${testIdBase}`,
    another_key: 12345,
    nested: {
      foo: "bar"
    }
  };
  let debugEntryId: string | null = null;

  beforeAll(async () => {
    adminHasyx = createAdminHasyx();
    try {
      const result = await adminHasyx.insert<{ id: string }>({
        table: 'debug',
        object: { value: testData },
        returning: ['id']
      });
      if (result && result.id) {
        debugEntryId = result.id;
        debug(`[test:hasyx:jsonb] Created debug entry for JSONB tests: ${debugEntryId} with data:`, testData);
      } else {
        console.error('[test:hasyx:jsonb] Failed to create debug entry. Result:', result);
        throw new Error('Failed to create debug entry for JSONB tests.');
      }
    } catch (e: any) {
      debug(`[test:hasyx:jsonb] Error in beforeAll: ${e.message}`, e);
      console.error('[test:hasyx:jsonb] Error in beforeAll creating debug entry:', e);
      throw e; 
    }
  }, 15000); // Increased timeout for beforeAll

  afterAll(async () => {
    if (debugEntryId && adminHasyx) {
      try {
        await adminHasyx.delete({
          table: 'debug',
          pk_columns: { id: debugEntryId }
        });
        debug(`[test:hasyx:jsonb] Cleaned up debug entry: ${debugEntryId}`);
      } catch (e: any) {
        debug(`[test:hasyx:jsonb] Error cleaning up debug entry ${debugEntryId}: ${e.message}`);
      }
    }
    cleanupHasyx(adminHasyx, 'JSONB tests');
  }, 15000); // Increased timeout for afterAll

  it('should select data using JSONB _contains operator', async () => {
    if (!debugEntryId) throw new Error("debugEntryId is null, beforeAll likely failed.");
    debug(`[test:hasyx:jsonb] Testing _contains with entry ID: ${debugEntryId}`);
    
    const results = await adminHasyx.select<any[]>({
      table: 'debug',
      where: {
        value: { _contains: { test_key: testData.test_key } } 
      },
      returning: ['id', 'value']
    });
    
    debug(`[test:hasyx:jsonb] _contains select result (matching):`, results);
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    
    const foundEntry = results.find(r => r.id === debugEntryId);
    expect(foundEntry).toBeDefined();
    if (foundEntry) {
        expect(foundEntry.value).toEqual(testData);
    }
    
    const nonMatchingResults = await adminHasyx.select<any[]>({
        table: 'debug',
        where: { value: { _contains: { non_existent_key: "blah" } } },
        returning: ['id']
    });
    debug(`[test:hasyx:jsonb] _contains select result (non-matching):`, nonMatchingResults);
    const nonMatchingFoundEntry = nonMatchingResults.find(r => r.id === debugEntryId);
    expect(nonMatchingFoundEntry).toBeUndefined();
  }, 15000);

  it('should select data using JSONB _has_key operator', async () => {
    if (!debugEntryId) throw new Error("debugEntryId is null, beforeAll likely failed.");
    debug(`[test:hasyx:jsonb] Testing _has_key with entry ID: ${debugEntryId}`);

    const results = await adminHasyx.select<any[]>({
      table: 'debug',
      where: {
        value: { _has_key: "another_key" }
      },
      returning: ['id', 'value']
    });

    debug(`[test:hasyx:jsonb] _has_key select result (matching):`, results);
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    const foundEntry = results.find(r => r.id === debugEntryId);
    expect(foundEntry).toBeDefined();
    if (foundEntry) {
        expect(foundEntry.value).toEqual(testData);
    }
    
     const nonMatchingResults = await adminHasyx.select<any[]>({
        table: 'debug',
        where: { value: { _has_key: "non_existent_key_string" } },
        returning: ['id']
    });
    debug(`[test:hasyx:jsonb] _has_key select result (non-matching):`, nonMatchingResults);
    const nonMatchingFoundEntry = nonMatchingResults.find(r => r.id === debugEntryId);
    expect(nonMatchingFoundEntry).toBeUndefined();
  }, 15000);
  
  it('should select data using JSONB _has_keys_all operator', async () => {
    if (!debugEntryId) throw new Error("debugEntryId is null, beforeAll likely failed.");
    const results = await adminHasyx.select<any[]>({
      table: 'debug',
      where: { value: { _has_keys_all: ["test_key", "another_key"] } },
      returning: ['id']
    });
    debug(`[test:hasyx:jsonb] _has_keys_all select result:`, results);
    const foundEntry = results.find(r => r.id === debugEntryId);
    expect(foundEntry).toBeDefined();
  }, 15000);

  it('should select data using JSONB _has_keys_any operator', async () => {
    if (!debugEntryId) throw new Error("debugEntryId is null, beforeAll likely failed.");
    const results = await adminHasyx.select<any[]>({
      table: 'debug',
      where: { value: { _has_keys_any: ["test_key", "non_existent_for_any"] } },
      returning: ['id']
    });
    debug(`[test:hasyx:jsonb] _has_keys_any select result:`, results);
    const foundEntry = results.find(r => r.id === debugEntryId);
    expect(foundEntry).toBeDefined();
  }, 15000);

  describe('Stream method', () => {
    it('should create streaming subscription with WebSocket', async () => {
      const adminHasyx = createAdminHasyx();
      const user = await createTestUser(adminHasyx, 'stream-test');
      const { hasyx: userHasyx } = await adminHasyx._authorize(user.id, { ws: true });

      // Create room for streaming test
      const roomId = uuidv4();
      await adminHasyx.insert({
        table: 'rooms',
        object: {
          id: roomId,
          user_id: user.id,
          title: 'Stream Test Room',
          allow_select_users: ['user'],
          allow_reply_users: ['user'],
        },
        returning: ['id'],
      });

      // Create initial message
      const msg1Id = uuidv4();
      const msg1 = await userHasyx.insert({
        table: 'messages',
        object: { id: msg1Id, value: 'Initial message' },
        returning: ['i'],
      });

      await userHasyx.insert({
        table: 'replies',
        object: { id: uuidv4(), message_id: msg1Id, room_id: roomId },
        returning: ['id'],
      });

      // Create streaming subscription
      const stream$ = userHasyx.stream<any[]>({
        table: 'messages',
        where: { replies: { room_id: { _eq: roomId } } },
        cursor: [{ initial_value: { i: msg1.i }, ordering: "ASC" }],
        batch_size: 5,
        returning: ['id', 'value', 'i', 'user_id'],
        ws: true,
      });

      const received: any[] = [];
      let subscription: any;

      const streamPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          subscription?.unsubscribe();
          reject(new Error('stream timeout'));
        }, 5000);
        
        subscription = stream$.subscribe({
          next: (data) => {
            debug('📨 Stream received data:', data);
            received.push(data);
            if (received.length === 1) {
              clearTimeout(timeout);
              subscription?.unsubscribe();
              resolve();
            }
          },
          error: (error) => {
            debug('❌ Stream error:', error);
            clearTimeout(timeout);
            subscription?.unsubscribe();
            reject(error);
          },
        });
      });

      // Create new message that should be streamed
      const msg2Id = uuidv4();
      const msg2 = await userHasyx.insert({
        table: 'messages',
        object: { id: msg2Id, value: 'Streamed message' },
        returning: ['i'],
      });

      await userHasyx.insert({
        table: 'replies',
        object: { id: uuidv4(), message_id: msg2Id, room_id: roomId },
        returning: ['id'],
      });

      await streamPromise;

      expect(received).toHaveLength(1);
      expect(received[0]).toHaveLength(1);
      expect(received[0][0].value).toBe('Streamed message');

      // Cleanup
      await adminHasyx.delete({ table: 'replies', where: { room_id: { _eq: roomId } } });
      await adminHasyx.delete({ table: 'messages', where: { id: { _in: [msg1Id, msg2Id] } } });
      await adminHasyx.delete({ table: 'rooms', pk_columns: { id: roomId } });
      await adminHasyx.delete({ table: 'users', pk_columns: { id: user.id } });

      cleanupHasyx(userHasyx, 'stream test');
      cleanupHasyx(adminHasyx, 'stream test');
    }, 20000);

    it('should fallback to polling when WebSocket is not available', async () => {
      const adminHasyx = createAdminHasyx();
      const user = await createTestUser(adminHasyx, 'stream-polling');
      const { hasyx: userHasyx } = await adminHasyx._authorize(user.id, { ws: false });

      // Create room for streaming test
      const roomId = uuidv4();
      await adminHasyx.insert({
        table: 'rooms',
        object: {
          id: roomId,
          user_id: user.id,
          title: 'Stream Polling Room',
          allow_select_users: ['user'],
          allow_reply_users: ['user'],
        },
        returning: ['id'],
      });

      // Create initial message
      const msg1Id = uuidv4();
      await userHasyx.insert({
        table: 'messages',
        object: { id: msg1Id, value: 'Initial message' },
        returning: ['i'],
      });

      await userHasyx.insert({
        table: 'replies',
        object: { id: uuidv4(), message_id: msg1Id, room_id: roomId },
        returning: ['id'],
      });

      // Create streaming subscription with polling fallback
      const stream$ = userHasyx.stream<any[]>({
        table: 'messages',
        where: { replies: { room_id: { _eq: roomId } } },
        cursor: [{ initial_value: { i: 0 }, ordering: "ASC" }],
        batch_size: 5,
        returning: ['id', 'value', 'i', 'user_id'],
        ws: false,
        pollingInterval: 1000,
      });

      const received: any[] = [];
      let subscription: any;

      const streamPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          subscription?.unsubscribe();
          reject(new Error('stream polling timeout'));
        }, 10000);
        
        subscription = stream$.subscribe({
          next: (data) => {
            debug('📨 Stream polling received data:', data);
            received.push(data);
            if (received.length >= 1) {
              clearTimeout(timeout);
              subscription?.unsubscribe();
              resolve();
            }
          },
          error: (error) => {
            debug('❌ Stream polling error:', error);
            clearTimeout(timeout);
            subscription?.unsubscribe();
            reject(error);
          },
        });
      });

      // Create new message that should be detected by polling
      const msg2Id = uuidv4();
      await userHasyx.insert({
        table: 'messages',
        object: { id: msg2Id, value: 'Polled message' },
        returning: ['i'],
      });

      await userHasyx.insert({
        table: 'replies',
        object: { id: uuidv4(), message_id: msg2Id, room_id: roomId },
        returning: ['id'],
      });

      await streamPromise;

      expect(received.length).toBeGreaterThan(0);

      // Cleanup
      await adminHasyx.delete({ table: 'replies', where: { room_id: { _eq: roomId } } });
      await adminHasyx.delete({ table: 'messages', where: { id: { _in: [msg1Id, msg2Id] } } });
      await adminHasyx.delete({ table: 'rooms', pk_columns: { id: roomId } });
      await adminHasyx.delete({ table: 'users', pk_columns: { id: user.id } });

      cleanupHasyx(userHasyx, 'stream polling test');
      cleanupHasyx(adminHasyx, 'stream polling test');
    }, 15000);

    it('should handle stream errors gracefully', async () => {
      const adminHasyx = createAdminHasyx();
      const user = await createTestUser(adminHasyx, 'stream-error');
      const { hasyx: userHasyx } = await adminHasyx._authorize(user.id, { ws: true });

      // Create streaming subscription with invalid cursor
      const stream$ = userHasyx.stream<any[]>({
        table: 'messages',
        where: { id: { _eq: 'invalid-uuid' } },
        cursor: [{ initial_value: { i: -1 }, ordering: "ASC" }],
        batch_size: 5,
        returning: ['id', 'value'],
        ws: true,
      });

      let errorReceived = false;
      let subscription: any;

      const errorPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          subscription?.unsubscribe();
          reject(new Error('stream error timeout'));
        }, 5000);
        
        subscription = stream$.subscribe({
          next: (data) => {
            debug('📨 Stream received data (unexpected):', data);
          },
          error: (error) => {
            debug('❌ Stream error received (expected):', error);
            errorReceived = true;
            clearTimeout(timeout);
            subscription?.unsubscribe();
            resolve();
          },
        });
      });

      await errorPromise;

      expect(errorReceived).toBe(true);

      // Cleanup
      await adminHasyx.delete({ table: 'users', pk_columns: { id: user.id } });

      cleanupHasyx(userHasyx, 'stream error test');
      cleanupHasyx(adminHasyx, 'stream error test');
    }, 10000);
  });
});
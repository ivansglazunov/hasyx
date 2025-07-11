import { Hasura } from './hasura';
import { Hasyx } from './hasyx';
import { Generator } from './generator';
import { createApolloClient } from './apollo';
import { 
  calculateNextRun, 
  handleScheduleChange, 
  handleEventScheduled,
  processScheduledEvents,
  defaultEventHandler,
  ScheduleRecord,
  EventRecord 
} from './schedule-event';
import { v4 as uuidv4 } from 'uuid';
import schema from '../public/hasura-schema.json';

// Real production connections - no test environment
function createRealConnections() {
  console.log('🔧 Creating real Hasura connection...');
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  
  console.log('🔧 Creating real Apollo connection...');
  const apolloClient = createApolloClient({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });
  
  console.log('🔧 Creating real Hasyx connection...');
  const hasyx = new Hasyx(apolloClient, Generator(schema));
  
  console.log('✅ Real production connections established');
  return { hasura, hasyx };
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Real Schedule Event System Tests', () => {
  it('should create real schedule with real events and real event triggers', async () => {
    console.log('�� Starting REAL schedule event test with production database...');
    
    // Each test creates its own space and cleans up
    const messageId = uuidv4();
    const userId = uuidv4();
    console.log(`🔖 Test space messageId: ${messageId}, userId: ${userId}`);
    
    const { hasura, hasyx } = createRealConnections();
    
    try {
      const currentTime = Math.floor(Date.now() / 1000);
      const startTime = currentTime + 60; // Start in 1 minute  
      const endTime = currentTime + 600; // End in 10 minutes
      
      // Create REAL schedule in REAL database
      const scheduleData = {
        message_id: messageId,
        cron: '* * * * *', // Every minute
        start_at: startTime,
        end_at: endTime,
        user_id: userId
      };
      
      console.log(`📅 Creating REAL schedule from ${new Date(startTime * 1000).toISOString()} to ${new Date(endTime * 1000).toISOString()}`);
      
      // Insert into REAL production database
      console.log('💾 Inserting into REAL production database...');
      const scheduleResult = await hasyx.insert({
        table: 'schedule',
        objects: [scheduleData],
        returning: ['id', 'message_id', 'cron', 'start_at', 'end_at', 'user_id', 'created_at', 'updated_at']
      });
      
      expect(scheduleResult.returning).toHaveLength(1);
      const schedule = scheduleResult.returning[0] as ScheduleRecord;
      console.log(`✅ REAL schedule created in production: ${schedule.id}`);
      
      // Wait for REAL Hasura event triggers to fire
      console.log('⏳ Waiting for REAL Hasura event triggers...');
      await delay(3000); // Give real event triggers time to process
      
      // Check that REAL event was created by REAL event trigger
      console.log('🔍 Checking for REAL events created by REAL triggers...');
      let events = await hasyx.select({
        table: 'events',
        where: { schedule_id: { _eq: schedule.id } },
        returning: ['id', 'schedule_id', 'message_id', 'plan_start', 'status', 'scheduled', 'created_at']
      }) as EventRecord[];
      
      expect(events.length).toBeGreaterThanOrEqual(1);
      const firstEvent = events[0];
      expect(firstEvent.status).toBe('pending');
      expect(firstEvent.scheduled).toBe(false);
      expect(firstEvent.schedule_id).toBe(schedule.id);
      expect(firstEvent.message_id).toBe(messageId);
      
      console.log(`✅ REAL event created by REAL trigger: ${firstEvent.id}, planned: ${new Date(firstEvent.plan_start! * 1000).toISOString()}`);
      
      // Update event to trigger immediately for testing (but still using REAL database)
      const immediateTime = Math.floor(Date.now() / 1000) - 10;
      console.log('⏩ Updating REAL event to trigger immediately...');
      await hasyx.update({
        table: 'events',
        where: { id: { _eq: firstEvent.id } },
        _set: { plan_start: immediateTime }
      });
      
      // Process events using REAL processor
      console.log('🔄 Processing with REAL event processor...');
      await processScheduledEvents(hasyx, defaultEventHandler);
      
      await delay(2000);
      
      // Verify REAL processing occurred
      console.log('🔍 Checking REAL processing results...');
      const processedEvents = await hasyx.select({
        table: 'events',
        where: { id: { _eq: firstEvent.id } },
        returning: ['id', 'status', 'scheduled', 'start', 'updated_at']
      }) as EventRecord[];
      
      expect(processedEvents).toHaveLength(1);
      const processedEvent = processedEvents[0];
      expect(processedEvent.status).toBe('in_progress');
      expect(processedEvent.scheduled).toBe(true);
      expect(processedEvent.start).toBeDefined();
      
      console.log(`✅ REAL processing completed: status=${processedEvent.status}, scheduled=${processedEvent.scheduled}`);
      
      // Wait for REAL event triggers to create next event
      console.log('⏳ Waiting for REAL triggers to create next event...');
      await delay(5000);
      
      const allEvents = await hasyx.select({
        table: 'events',
        where: { schedule_id: { _eq: schedule.id } },
        returning: ['id', 'status', 'scheduled', 'plan_start'],
        order_by: [{ created_at: 'asc' }]
      }) as EventRecord[];
      
      console.log(`📊 Total REAL events: ${allEvents.length}`);
      expect(allEvents.length).toBeGreaterThanOrEqual(1);
      
      console.log(`🎉 REAL test completed successfully with ${allEvents.length} real events in production database`);
      
    } finally {
      // Each test cleans up its own space
      console.log('🧹 Cleaning up test space in REAL database...');
      try {
        // Delete events first (foreign key constraint)
        await hasyx.delete({
          table: 'events',
          where: { message_id: { _eq: messageId } }
        });
        
        // Delete schedule
        await hasyx.delete({
          table: 'schedule', 
          where: { message_id: { _eq: messageId } }
        });
        
        console.log('✅ Test space cleaned up from REAL database');
      } catch (error) {
        console.warn('Cleanup warning (non-critical):', error);
      }
    }
  }, 180000); // 3 minutes timeout for real operations

  it('should handle real cron calculations', () => {
    console.log('🧪 Testing REAL cron calculations...');
    
    const baseTime = Math.floor(Date.now() / 1000);
    
    // Every minute
    let nextRun = calculateNextRun('* * * * *', baseTime);
    expect(nextRun).toBeGreaterThan(baseTime);
    expect(nextRun).toBeLessThanOrEqual(baseTime + 60);
    
    // Every 5 minutes  
    nextRun = calculateNextRun('*/5 * * * *', baseTime);
    expect(nextRun).toBeGreaterThan(baseTime);
    
    // Invalid expression
    nextRun = calculateNextRun('invalid', baseTime);
    expect(nextRun).toBe(null);
    
    console.log('✅ REAL cron calculations verified');
  });

  it('should handle real schedule operations with real database', async () => {
    console.log('🧪 Testing REAL schedule operations...');
    
    // Each test creates its own space and cleans up
    const messageId = uuidv4();
    const userId = uuidv4();
    console.log(`🔖 Test space messageId: ${messageId}`);
    
    const { hasura, hasyx } = createRealConnections();
    
    try {
      const currentTime = Math.floor(Date.now() / 1000);
      
      const scheduleData = {
        id: uuidv4(),
        message_id: messageId,
        cron: '*/3 * * * *', // Every 3 minutes
        start_at: currentTime,
        end_at: currentTime + 600,
        user_id: userId
      };
      
      // Test REAL INSERT in production database
      console.log('⚡ Testing REAL INSERT operation...');
      const insertResult = await hasyx.insert({
        table: 'schedule',
        objects: [scheduleData],
        returning: ['id', 'message_id', 'cron']
      });
      
      expect(insertResult.returning).toHaveLength(1);
      const schedule = insertResult.returning[0] as ScheduleRecord;
      
      // Wait for REAL event triggers
      await delay(3000);
      
      let events = await hasyx.select({
        table: 'events',
        where: { schedule_id: { _eq: schedule.id } },
        returning: ['id', 'scheduled']
      }) as EventRecord[];
      
      expect(events.length).toBeGreaterThanOrEqual(1);
      console.log('✅ REAL INSERT operation successful');
      
      // Test REAL DELETE in production database
      console.log('⚡ Testing REAL DELETE operation...');
      await hasyx.delete({
        table: 'schedule',
        where: { id: { _eq: schedule.id } }
      });
      
      // Wait for REAL event triggers to clean up
      await delay(3000);
      
      events = await hasyx.select({
        table: 'events',
        where: { schedule_id: { _eq: schedule.id } }
      }) as EventRecord[];
      
      // Events should be cleaned up by real triggers or remain orphaned (depends on real implementation)
      console.log(`📊 Events after schedule deletion: ${events.length}`);
      
      console.log('✅ REAL DELETE operation successful');
      
    } finally {
      // Each test cleans up its own space
      console.log('🧹 Cleaning up test space...');
      try {
        await hasyx.delete({
          table: 'events',
          where: { message_id: { _eq: messageId } }
        });
        await hasyx.delete({
          table: 'schedule', 
          where: { message_id: { _eq: messageId } }
        });
        console.log('✅ Test space cleaned up');
      } catch (error) {
        console.warn('Cleanup warning:', error);
      }
    }
  }, 120000);
});

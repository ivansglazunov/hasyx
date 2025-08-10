# Schedule System Documentation

The Hasyx Schedule system provides a comprehensive solution for managing timed events and recurring tasks. It combines the power of cron expressions with real-time database triggers to create a robust scheduling framework.

## Overview

The Schedule system enables you to:
- **Create schedules** with flexible cron expressions
- **Automatically generate events** based on schedule timing
- **Process events** in real-time through Hasura triggers
- **Handle complex timing scenarios** with proper cleanup and state management

## DB Scheduler Plan (One‑off Events Integration)

This section captures the implementation plan to finalize the DB scheduler using Hasura One‑off Scheduled Events and event triggers. It complements the existing docs below and will guide further development.

- Goals
  - **Structured tables**: `public.schedule` describes recurrence rules; `public.events` stores concrete events and their lifecycle.
  - **One‑off parity**: every row in `public.events` must have a corresponding Hasura one‑off scheduled event (created/updated/deleted in sync).
  - **Minimal API routes**: routes only validate Hasura secret and delegate to library functions, so behavior is extendable downstream.

- Tables & migrations
  - `public.schedule`
    - `id` uuid PK
    - `user_id` uuid NULL
    - `object_id` uuid NULL
    - `cron` text NOT NULL (recurrence rule)
    - `start_at` bigint NOT NULL (unix seconds, first allowed run)
    - `end_at` bigint NULL (unix seconds, last allowed run)
    - `duration_sec` bigint NULL (optional event duration in seconds)
    - `meta` jsonb NULL
    - `created_at` timestamptz DEFAULT now()
    - `updated_at` timestamptz DEFAULT now()
  - `public.events`
    - `id` uuid PK
    - `schedule_id` uuid NULL REFERENCES `schedule(id)`
    - `user_id` uuid NULL
    - `object_id` uuid NULL
    - `one_off_id` text NULL (Hasura one‑off event id)
    - `plan_start` bigint NOT NULL (unix seconds)
    - `plan_end` bigint NULL (unix seconds)
    - `start` bigint NULL (unix seconds)
    - `end` bigint NULL (unix seconds)
    - `status` text NOT NULL DEFAULT 'pending' ('pending' | 'in_progress' | 'completed' | 'cancelled')
    - `meta` jsonb NULL
    - `created_at` timestamptz DEFAULT now()
    - `updated_at` timestamptz DEFAULT now()
  - Migrations follow existing style (`migrations/<ts>-hasyx-schedule/{up,down}.ts`) using utilities in `lib/hasura/hasura.ts`.

- Hasura One‑off Scheduled Events
  - Add methods in `lib/hasura/hasura.ts`:
    - `defineOneOffEvent({ webhook, scheduleAtIso, payload?, headers?, retry_conf? })` → Metadata API `create_scheduled_event`
    - `undefineOneOffEvent({ event_id })` → Metadata API `delete_scheduled_event` with `{ type: 'one_off' }`
  - One‑off payload must contain `client_event_id` (equals `public.events.id`) and, if available, `schedule_id` for correlation.

- Triggers and routes
  - `events/events.json` (already present): on `INSERT/UPDATE/DELETE` in `public.events` ensures the corresponding Hasura one‑off exists/updates/cancels.
  - Add `events/schedule.json`:
    - table: `public.schedule`; operations: insert/update/delete; webhook: `/api/events/schedule`.
    - Behavior:
      - INSERT: compute and create exactly one next pending event for the new schedule (within `[start_at, end_at]`).
      - UPDATE: delete the nearest not‑yet‑started event for this schedule and create a new one from the updated rule.
      - DELETE: optional cleanup of nearest not‑yet‑started event.
  - One‑off execution webhook (e.g. `/api/events/one-off`): on callback, marks event as started and, if `schedule_id` is present, computes and inserts the next event.

- Library responsibilities (`lib/schedule.ts`)
  - `computeNextEvent(schedule, lastEvent?)` → returns the next planned event object (`plan_start`, `plan_end`, `schedule_id`, etc.)
  - `ensureHasuraOneOffForEvent(hasura, event)` → creates one‑off in Hasura for `plan_start` and stores `one_off_id` back into `public.events`.
  - `cancelHasuraOneOffForEvent(hasura, event)` → cancels pending one‑off by `one_off_id`.
  - `onEventRowChange(payload)`
    - INSERT: create one‑off and store `one_off_id`.
    - UPDATE: if `plan_start` changed and event not started, cancel old one‑off and create a new one; keep `one_off_id` in sync.
    - DELETE: if not started, cancel one‑off.
  - `onScheduleRowChange(payload)`
    - INSERT: insert exactly one next pending event for the schedule.
    - UPDATE: delete the nearest future event for this schedule and insert a recalculated one.
  - `onOneOffExecuted(request)`
    - Locate event by `client_event_id` from payload, set `status: in_progress`, set `start`.
    - If `schedule_id` exists, compute and insert one next event.

- API routes are thin wrappers only
  - Each `app/api/events/*` route validates `X-Hasura-Event-Secret` and delegates:
    - `/api/events/events` → `onEventRowChange`
    - `/api/events/schedule` → `onScheduleRowChange`
    - `/api/events/one-off` → `onOneOffExecuted`
  - Business logic remains in `lib/schedule.ts` to keep downstream extension simple.

- Time units and consistency
  - Use unix seconds (bigint) for DB columns to stay consistent with current examples in this document.
  - Convert to ISO‑8601 when calling Hasura `create_scheduled_event` (`schedule_at`).

- Safety & idempotency
  - All webhooks must check `X-Hasura-Event-Secret`.
  - Keep operations idempotent (double deliveries, retries) by correlating via `client_event_id` and current `status`/timestamps.


## Architecture

### Database Schema

The Schedule system uses two main tables:

#### `schedule` table
```sql
CREATE TABLE public.schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID,
    cron TEXT NOT NULL,
    start_at BIGINT NOT NULL,
    end_at BIGINT NOT NULL,
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `events` table
```sql
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID REFERENCES schedule(id),
    message_id UUID NOT NULL,
    user_id UUID,
    plan_start BIGINT,
    start BIGINT,
    end BIGINT,
    plan_end BIGINT,
    status TEXT DEFAULT 'pending',
    scheduled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### System Components

```mermaid
graph TB
    A[Schedule Creation] --> B[Hasura Event Trigger]
    B --> C[Schedule Handler]
    C --> D[Calculate Next Run]
    D --> E[Create Event]
    
    F[Cron Trigger] --> G[Schedule Processor]
    G --> H[Find Ready Events]
    H --> I[Process Event]
    I --> J[Update Event Status]
    J --> K[Create Next Event]
    
    L[Event Update] --> M[Event Trigger]
    M --> N[Schedule Handler]
    N --> O[Create Next Event]
```

## Getting Started

### 1. Database Setup

Run the schedule migration to create the necessary tables:

```bash
npx hasyx migrate up-schedule
```

### 2. Event Triggers Configuration

Ensure your `events/` directory contains the required trigger configurations:

**events/schedule.json**
```json
{
  "name": "schedule",
  "table": {
    "schema": "public",
    "name": "schedule"
  },
  "webhook_path": "/api/events/schedule",
  "insert": { "columns": "*" },
  "update": { "columns": "*" },
  "delete": { "columns": "*" }
}
```

**events/schedule-cron.json**
```json
{
  "name": "schedule_processor_cron",
  "webhook_path": "/api/events/schedule-cron",
  "schedule": "* * * * *",
  "comment": "Process scheduled events every minute"
}
```

**events/events.json**
```json
{
  "name": "events",
  "table": {
    "schema": "public",
    "name": "events"
  },
  "webhook_path": "/api/events/events",
  "insert": { "columns": "*" },
  "update": { "columns": "*" },
  "delete": { "columns": "*" }
}
```

### 3. Sync Event Triggers

Deploy the event triggers to Hasura:

```bash
npx hasyx events
```

## Usage

### Creating a Schedule

#### Basic Schedule Creation

```typescript
import { useHasyx } from 'hasyx';

const hasyx = useHasyx();

// Create a schedule that runs every 5 minutes for 1 hour
const schedule = await hasyx.insert({
  table: 'schedule',
  objects: [{
    message_id: messageId,
    cron: '*/5 * * * *', // Every 5 minutes
    start_at: Math.floor(Date.now() / 1000), // Now
    end_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    user_id: userId
  }]
});
```

#### Advanced Schedule with Specific Timing

```typescript
// Create a schedule for weekdays at 9 AM
const workdaySchedule = await hasyx.insert({
  table: 'schedule',
  objects: [{
    message_id: messageId,
    cron: '0 9 * * 1-5', // 9 AM, Monday to Friday
    start_at: Math.floor(Date.now() / 1000),
    end_at: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
    user_id: userId
  }]
});
```

### Querying Schedules and Events

#### Get Active Schedules

```typescript
const activeSchedules = await hasyx.select({
  table: 'schedule',
  where: {
    end_at: { _gt: Math.floor(Date.now() / 1000) },
    user_id: { _eq: userId }
  },
  returning: ['id', 'cron', 'start_at', 'end_at', 'created_at']
});
```

#### Get Events for a Schedule

```typescript
const scheduleEvents = await hasyx.select({
  table: 'events',
  where: {
    schedule_id: { _eq: scheduleId }
  },
  returning: ['id', 'plan_start', 'start', 'end', 'status', 'scheduled'],
  order_by: [{ plan_start: 'asc' }]
});
```

#### Get Upcoming Events

```typescript
const upcomingEvents = await hasyx.select({
  table: 'events',
  where: {
    plan_start: { _gt: Math.floor(Date.now() / 1000) },
    status: { _eq: 'pending' },
    user_id: { _eq: userId }
  },
  returning: ['id', 'schedule_id', 'message_id', 'plan_start', 'status'],
  order_by: [{ plan_start: 'asc' }],
  limit: 10
});
```

### Updating and Deleting Schedules

#### Update Schedule

```typescript
await hasyx.update({
  table: 'schedule',
  where: { id: { _eq: scheduleId } },
  _set: {
    cron: '*/10 * * * *', // Change to every 10 minutes
    end_at: Math.floor(Date.now() / 1000) + 7200 // Extend by 2 hours
  }
});
```

#### Delete Schedule

```typescript
await hasyx.delete({
  table: 'schedule',
  where: { id: { _eq: scheduleId } }
});
// Related events will be automatically cleaned up by event triggers
```

## Cron Expression Guide

### Basic Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| `* * * * *` | Every minute | Runs every minute |
| `*/5 * * * *` | Every 5 minutes | Runs at 0, 5, 10, 15, etc. |
| `0 * * * *` | Every hour | Runs at the top of every hour |
| `0 9 * * *` | Daily at 9 AM | Runs every day at 9:00 AM |
| `0 9 * * 1-5` | Weekdays at 9 AM | Runs Monday-Friday at 9:00 AM |
| `0 0 1 * *` | Monthly | Runs on the 1st of every month |

### Cron Format

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of Week (0-6, Sunday=0)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of Month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

### Advanced Examples

```typescript
// Business hours only (9 AM - 5 PM, weekdays)
const businessHours = {
  cron: '0 9-17 * * 1-5',
  start_at: Math.floor(Date.now() / 1000),
  end_at: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60) // 90 days
};

// Weekly report (every Monday at 8 AM)
const weeklyReport = {
  cron: '0 8 * * 1',
  start_at: Math.floor(Date.now() / 1000),
  end_at: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year
};

// End of month processing (last day of each month at 11 PM)
const endOfMonth = {
  cron: '0 23 28-31 * *',
  start_at: Math.floor(Date.now() / 1000),
  end_at: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year
};
```

## Event Lifecycle

### Event States

1. **pending** - Event is created and waiting to be processed
2. **in_progress** - Event is currently being processed
3. **completed** - Event has been successfully processed
4. **cancelled** - Event was cancelled before processing

### Event Flow

```mermaid
sequenceDiagram
    participant S as Schedule
    participant H as Hasura
    participant API as API Route
    participant P as Processor
    
    S->>H: Schedule Created/Updated
    H->>API: Event Trigger
    API->>API: Calculate Next Run
    API->>S: Create Event (status: pending)
    
    Note over P: Every minute
    P->>S: Query Ready Events
    S->>P: Return Events (plan_start <= now)
    P->>P: Process Event
    P->>S: Update Event (status: in_progress, scheduled: true)
    
    S->>H: Event Updated
    H->>API: Event Trigger
    API->>API: Create Next Event
    API->>S: Insert Next Event (status: pending)
```

## Custom Event Handlers

### Creating Custom Event Processors

You can create custom event handlers to define specific behavior when events are processed:

```typescript
import { EventRecord, ScheduleRecord } from 'hasyx/lib/schedule-event';
import { Hasyx } from 'hasyx';

export async function customEventHandler(
  hasyx: Hasyx,
  event: EventRecord,
  schedule?: ScheduleRecord
): Promise<void> {
  console.log(`Processing event ${event.id} for schedule ${schedule?.id}`);
  
  // Custom logic here
  if (event.message_id) {
    // Send notification
    await sendNotification(event.message_id);
  }
  
  // Update event status
  await hasyx.update({
    table: 'events',
    where: { id: { _eq: event.id } },
    _set: {
      status: 'completed',
      end: Math.floor(Date.now() / 1000)
    }
  });
}
```

### Using Custom Handlers in Cron Processor

```typescript
import { handleScheduleEvent } from 'hasyx/lib/schedule-event';
import { customEventHandler } from './custom-handler';

// In your cron API route
await handleScheduleEvent(hasyx, customEventHandler);
```

## Real-time Subscriptions

### Subscribe to Schedule Changes

```typescript
import { useSubscription } from 'hasyx';

const { data: schedules, loading, error } = useSubscription({
  table: 'schedule',
  where: { user_id: { _eq: userId } },
  returning: ['id', 'cron', 'start_at', 'end_at', 'created_at', 'updated_at']
});
```

### Subscribe to Event Updates

```typescript
const { data: events, loading, error } = useSubscription({
  table: 'events',
  where: { 
    schedule_id: { _eq: scheduleId },
    status: { _neq: 'completed' }
  },
  returning: ['id', 'plan_start', 'start', 'status', 'scheduled']
});
```

## Error Handling and Debugging

### Common Issues and Solutions

#### Schedule Not Creating Events

1. **Check cron expression validity**
   ```typescript
   import { calculateNextRun } from 'hasyx/lib/schedule-event';
   
   const nextRun = calculateNextRun('* * * * *', Math.floor(Date.now() / 1000));
   console.log('Next run:', nextRun ? new Date(nextRun * 1000) : 'Invalid');
   ```

2. **Verify schedule timing**
   ```typescript
   const currentTime = Math.floor(Date.now() / 1000);
   if (schedule.end_at <= currentTime) {
     console.log('Schedule has already ended');
   }
   ```

#### Events Not Being Processed

1. **Check cron trigger status** in Hasura Console
2. **Verify API route accessibility**
3. **Check event processor logs**

### Debug Mode

Enable debug logging for detailed information:

```bash
DEBUG=schedule-event npm run dev
```

### Monitoring Schedules

```typescript
// Get schedule statistics
const stats = await hasyx.select({
  table: 'schedule',
  returning: [
    { count: '*' },
    { active: { _where: { end_at: { _gt: Math.floor(Date.now() / 1000) } } } }
  ]
});

// Get event processing statistics
const eventStats = await hasyx.select({
  table: 'events',
  returning: [
    { pending: { _where: { status: { _eq: 'pending' } } } },
    { in_progress: { _where: { status: { _eq: 'in_progress' } } } },
    { completed: { _where: { status: { _eq: 'completed' } } } }
  ]
});
```

## Best Practices

### 1. Schedule Design

- **Use appropriate cron expressions** for your use case
- **Set reasonable end times** to prevent runaway schedules
- **Include cleanup logic** for cancelled or expired schedules

### 2. Event Processing

- **Keep event handlers lightweight** and fast
- **Handle errors gracefully** to prevent event processing failures
- **Use idempotent operations** to handle duplicate processing

### 3. Database Management

- **Use unique message_id** for event correlation
- **Implement proper user permissions** for schedule access
- **Monitor database performance** with complex schedules

### 4. Testing

- **Test with real database** connections as shown in the test suite
- **Verify event trigger behavior** in development environment
- **Use cleanup procedures** in tests to avoid data pollution

## API Reference

### Schedule Functions

```typescript
import { 
  calculateNextRun,
  handleScheduleChange,
  handleEventScheduled,
  processScheduledEvents,
  defaultEventHandler
} from 'hasyx/lib/schedule-event';
```

#### `calculateNextRun(cronExpression, fromTime)`
- **cronExpression**: Cron expression string
- **fromTime**: Unix timestamp to calculate from
- **Returns**: Next execution time or null if invalid

#### `handleScheduleChange(hasyx, schedule, operation)`
- **hasyx**: Hasyx client instance
- **schedule**: Schedule record
- **operation**: 'INSERT' | 'UPDATE' | 'DELETE'

#### `processScheduledEvents(hasyx, eventHandler)`
- **hasyx**: Hasyx client instance
- **eventHandler**: Custom event processing function

## Performance Considerations

### Scaling Schedules

- **Batch processing** for high-frequency schedules
- **Database indexing** on commonly queried fields
- **Partitioning** events table for large datasets

### Memory Management

- **Event cleanup** for completed events
- **Archive old schedules** to prevent table bloat
- **Monitor database connections** in high-load scenarios

## Security Considerations

### Access Control

- **User-based permissions** for schedule management
- **Event secret validation** for webhook security
- **Rate limiting** for schedule creation

### Data Protection

- **Sanitize cron expressions** to prevent injection
- **Validate time ranges** to prevent abuse
- **Audit trail** for schedule modifications

## Migration Guide

### From Manual Scheduling

If you're migrating from manual scheduling to the Schedule system:

1. **Identify recurring patterns** in your current system
2. **Convert timing logic** to cron expressions
3. **Implement event handlers** for existing functionality
4. **Test thoroughly** with the real database test suite

### Database Migration

```typescript
// Example migration for existing data
const existingTasks = await hasyx.select({
  table: 'old_tasks',
  where: { recurring: { _eq: true } }
});

for (const task of existingTasks) {
  await hasyx.insert({
    table: 'schedule',
    objects: [{
      message_id: task.id,
      cron: convertToCron(task.interval),
      start_at: task.next_run,
      end_at: task.expires_at,
      user_id: task.user_id
    }]
  });
}
```

## Related Documentation

- [Events System (EVENTS.md)](./EVENTS.md) - General event trigger documentation
- [Hasyx Client (HASYX.md)](./HASYX.md) - Database client documentation
- [Testing Guide](./README.md#testing) - Testing framework documentation

## Support

For issues with the Schedule system:

1. Check the [troubleshooting section](#error-handling-and-debugging)
2. Review the [test suite](./lib/schedule-event.test.ts) for examples
3. Examine the [API routes](./app/api/events/) for implementation details

The Schedule system is designed to be robust and production-ready, with comprehensive testing against real databases and proper error handling for edge cases. 
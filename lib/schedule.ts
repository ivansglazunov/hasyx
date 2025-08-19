import { Hasura } from './hasura/hasura';
import Debug from './debug';
import { v4 as uuidv4 } from 'uuid';

// Forward declaration для Hasyx класса (избегаем циклического импорта)
export interface HasyxForSchedule {
  insert<T = any>(options: any): Promise<T>;
  sql(sql: string, ...args: any[]): Promise<any>;
}

const debug = Debug('schedule');

export interface ScheduleRecord {
  id: string;
  user_id?: string;
  object_id?: string;
  cron: string;
  start_at: number;
  end_at?: number;
  duration_sec?: number;
  meta?: any;
  created_at?: string;
  updated_at?: string;
}

export interface EventRecord {
  id: string;
  schedule_id?: string;
  user_id?: string;
  object_id?: string;
  one_off_id?: string;
  plan_start: number;
  plan_end?: number;
  start?: number;
  end?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  meta?: any;
  created_at?: string;
  updated_at?: string;
}

export interface OneOffCallback {
  (event: EventRecord, schedule?: ScheduleRecord): Promise<void>;
}

/**
 * Вычисляет следующее событие на основе cron выражения и времени
 */
export function computeNextEvent(
  schedule: ScheduleRecord, 
  lastEvent?: EventRecord
): EventRecord | null {
  try {
    const now = Math.floor(Date.now() / 1000);
    const fromTime = lastEvent?.plan_start || schedule.start_at;
    
    if (fromTime >= (schedule.end_at || Number.MAX_SAFE_INTEGER)) {
      return null; // Расписание закончилось
    }

    // Простая реализация: добавляем 1 минуту к последнему событию
    // В реальной реализации здесь должна быть полноценная cron парсинг логика
    const nextStart = fromTime + 60;
    
    if (nextStart > (schedule.end_at || Number.MAX_SAFE_INTEGER)) {
      return null;
    }

    return {
      id: uuidv4(),
      schedule_id: schedule.id,
      user_id: schedule.user_id,
      object_id: schedule.object_id,
      plan_start: nextStart,
      plan_end: schedule.duration_sec ? nextStart + schedule.duration_sec : undefined,
      status: 'pending',
      meta: schedule.meta
    };
  } catch (error) {
    debug('Error computing next event:', error);
    return null;
  }
}

/**
 * Создает one-off событие в Hasura для указанного события
 */
export async function ensureHasuraOneOffForEvent(
  hasura: Hasura, 
  event: EventRecord
): Promise<string | null> {
  try {
    if (!event.plan_start) {
      debug('Event has no plan_start, skipping one-off creation');
      return null;
    }

    const scheduleAtIso = new Date(event.plan_start * 1000).toISOString();
    const webhook = `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL?.replace('/graphql', '')}/api/one-off`;
    
    const result = await hasura.defineOneOffEvent({
      webhook,
      scheduleAtIso,
      payload: {
        client_event_id: event.id,
        schedule_id: event.schedule_id,
        event_type: 'start'
      },
      headers: [
        { name: 'X-Hasura-Event-Secret', value_from_env: 'HASURA_EVENT_SECRET' }
      ]
    });

    debug('Created one-off event:', result);
    return result.scheduled_event?.id || null;
  } catch (error) {
    debug('Error creating one-off event:', error);
    return null;
  }
}

/**
 * Отменяет pending one-off событие в Hasura
 */
export async function cancelHasuraOneOffForEvent(
  hasura: Hasura, 
  event: EventRecord
): Promise<boolean> {
  try {
    if (!event.one_off_id) {
      debug('Event has no one_off_id, nothing to cancel');
      return false;
    }

    await hasura.undefineOneOffEvent({ event_id: event.one_off_id });
    debug('Cancelled one-off event:', event.one_off_id);
    return true;
  } catch (error) {
    debug('Error cancelling one-off event:', error);
    return false;
  }
}

/**
 * Обработчик изменений в таблице events
 */
export async function onEventRowChange(
  hasyx: HasyxForSchedule,
  payload: any,
  callback?: OneOffCallback
): Promise<void> {
  const { event, old_event, session_variables } = payload;
  const operation = payload.event?.op || 'UNKNOWN';

  debug(`Processing event row change: ${operation}`, { event_id: event?.id });

  try {
    switch (operation) {
      case 'INSERT':
        if (event && event.plan_start) {
          const oneOffId = await ensureHasuraOneOffForEvent(hasyx as any, event);
          if (oneOffId) {
            // Обновляем событие с one_off_id
            await hasyx.sql(`
              UPDATE public.events 
              SET one_off_id = '${oneOffId}' 
              WHERE id = '${event.id}'
            `);
          }
        }
        break;

      case 'UPDATE':
        if (event && old_event) {
          const planStartChanged = event.plan_start !== old_event.plan_start;
          const statusChanged = event.status !== old_event.status;
          
          if (planStartChanged && event.status === 'pending') {
            // Отменяем старый one-off и создаем новый
            if (old_event.one_off_id) {
              await cancelHasuraOneOffForEvent(hasyx as any, old_event);
            }
            if (event.plan_start) {
              const oneOffId = await ensureHasuraOneOffForEvent(hasyx as any, event);
              if (oneOffId) {
                await hasyx.sql(`
                  UPDATE public.events 
                  SET one_off_id = '${oneOffId}' 
                  WHERE id = '${event.id}'
                `);
              }
            }
          }
        }
        break;

      case 'DELETE':
        if (old_event && old_event.one_off_id && old_event.status === 'pending') {
          await cancelHasuraOneOffForEvent(hasyx as any, old_event);
        }
        break;
    }
  } catch (error) {
    debug('Error in onEventRowChange:', error);
    throw error;
  }
}

/**
 * Обработчик изменений в таблице schedule
 */
export async function onScheduleRowChange(
  hasyx: HasyxForSchedule,
  payload: any
): Promise<void> {
  const { event, old_event } = payload;
  const operation = payload.event?.op || 'UNKNOWN';

  debug(`Processing schedule row change: ${operation}`, { schedule_id: event?.id });

  try {
    switch (operation) {
      case 'INSERT':
        if (event) {
          // Создаем первое событие для нового расписания
          const nextEvent = computeNextEvent(event);
          if (nextEvent) {
            await hasyx.insert({
              table: 'events',
              object: {
                id: nextEvent.id,
                schedule_id: nextEvent.schedule_id,
                user_id: nextEvent.user_id,
                object_id: nextEvent.object_id,
                plan_start: nextEvent.plan_start,
                plan_end: nextEvent.plan_end,
                status: nextEvent.status,
                meta: nextEvent.meta
              }
            });
          }
        }
        break;

      case 'UPDATE':
        if (event && old_event) {
          const cronChanged = event.cron !== old_event.cron;
          const timingChanged = event.start_at !== old_event.start_at || event.end_at !== old_event.end_at;
          
          if (cronChanged || timingChanged) {
            // Удаляем ближайшее не начавшееся событие и создаем новое
            await hasyx.sql(`
              DELETE FROM public.events 
              WHERE schedule_id = '${event.id}' AND status = 'pending'
              ORDER BY plan_start ASC 
              LIMIT 1
            `);
            
            const nextEvent = computeNextEvent(event);
            if (nextEvent) {
              await hasyx.insert({
                table: 'events',
                object: {
                  id: nextEvent.id,
                  schedule_id: nextEvent.schedule_id,
                  user_id: nextEvent.user_id,
                  object_id: nextEvent.object_id,
                  plan_start: nextEvent.plan_start,
                  plan_end: nextEvent.plan_end,
                  status: nextEvent.status,
                  meta: nextEvent.meta
                }
              });
            }
          }
        }
        break;

      case 'DELETE':
        if (old_event) {
          // Удаляем все pending события для этого расписания
          await hasyx.sql(`
            DELETE FROM public.events 
            WHERE schedule_id = '${old_event.id}' AND status = 'pending'
          `);
        }
        break;
    }
  } catch (error) {
    debug('Error in onScheduleRowChange:', error);
    throw error;
  }
}

/**
 * Обработчик исполнения one-off события
 */
export async function onOneOffExecuted(
  hasyx: HasyxForSchedule,
  payload: any,
  callback?: OneOffCallback
): Promise<void> {
  const { client_event_id, schedule_id, event_type } = payload;

  debug(`Processing one-off execution:`, { client_event_id, schedule_id, event_type });

  try {
    // Находим событие
    const eventResult = await hasyx.sql(`
      SELECT * FROM public.events WHERE id = '${client_event_id}'
    `);

    if (!eventResult.result[1] || eventResult.result[1].length === 0) {
      debug('Event not found:', client_event_id);
      return;
    }

    const event = eventResult.result[1][0];
    
    // Обновляем статус события
    if (event_type === 'start') {
      await hasyx.sql(`
        UPDATE public.events 
        SET status = 'in_progress', start = ${Math.floor(Date.now() / 1000)} 
        WHERE id = '${client_event_id}'
      `);
    }

    // Если есть callback, вызываем его
    if (callback) {
      let schedule: ScheduleRecord | undefined;
      
      if (schedule_id) {
        const scheduleResult = await hasyx.sql(`
          SELECT * FROM public.schedule WHERE id = '${schedule_id}'
        `);
        
        if (scheduleResult.result[1] && scheduleResult.result[1].length > 0) {
          schedule = scheduleResult.result[1][0];
        }
      }

      await callback(event, schedule);
    }

    // Если событие привязано к расписанию, создаем следующее
    if (schedule_id && event_type === 'start') {
      const scheduleResult = await hasyx.sql(`
        SELECT * FROM public.schedule WHERE id = '${schedule_id}'
      `);
      
      if (scheduleResult.result[1] && scheduleResult.result[1].length > 0) {
        const schedule = scheduleResult.result[1][0];
        const nextEvent = computeNextEvent(schedule, event);
        
        if (nextEvent) {
          await hasyx.insert({
            table: 'events',
            object: {
              id: nextEvent.id,
              schedule_id: nextEvent.schedule_id,
              user_id: nextEvent.user_id,
              object_id: nextEvent.object_id,
              plan_start: nextEvent.plan_start,
              plan_end: nextEvent.plan_end,
              status: nextEvent.status,
              meta: nextEvent.meta
            }
          });
        }
      }
    }
  } catch (error) {
    debug('Error in onOneOffExecuted:', error);
    throw error;
  }
}

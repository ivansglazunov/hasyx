import dotenv from 'dotenv';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createApolloClient } from './apollo/apollo';
import { Generator } from './generator';
import { Hasyx } from './hasyx/hasyx';
import schema from '../public/hasura-schema.json';
import { hashPassword } from './users/auth-server';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const generate = Generator(schema as any);

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;

function createAdminHasyx(): Hasyx {
  const apollo = createApolloClient({ url: HASURA_URL, secret: ADMIN_SECRET, ws: false });
  return new Hasyx(apollo as any, generate);
}

async function createTestUser(adminH: Hasyx, suffix: string) {
  const email = `schedule-test-${uuidv4()}-${suffix}@example.com`;
  const password = await hashPassword('password123');
  const inserted = await adminH.insert({
    table: 'users',
    object: { email, password, name: `Schedule Test ${suffix}`, hasura_role: 'user' },
    returning: ['id', 'email'],
  });
  return inserted;
}

describe('Schedule permissions', () => {
  it('user can create and delete own schedule', async () => {
    const adminH = createAdminHasyx();
    const user = await createTestUser(adminH, 'owner');
    const { hasyx: userH } = await adminH._authorize(user.id, { ws: false });

    const scheduleId = uuidv4();
    const now = Math.floor(Date.now() / 1000);

    const schedule = await userH.insert({
      table: 'schedule',
      object: {
        id: scheduleId,
        title: 'My Title',
        cron: '*/5 * * * *',
        start_at: now,
        end_at: now + 3600,
        duration_sec: 60,
      },
      returning: ['id', 'user_id', 'title', 'cron', 'start_at', 'end_at'],
    });

    expect(schedule.id).toBe(scheduleId);
    expect(schedule.user_id).toBe(user.id);
    expect(schedule.title).toBe('My Title');

    // Any other user can select it (public visibility)
    const stranger = await createTestUser(adminH, 'viewer');
    const { hasyx: strangerH } = await adminH._authorize(stranger.id, { ws: false });
    const rows = await strangerH.select({
      table: 'schedule',
      where: { id: { _eq: scheduleId } },
      returning: ['id', 'title', 'user_id'],
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe(scheduleId);

    const del = await userH.delete({
      table: 'schedule',
      where: { id: { _eq: scheduleId } },
      returning: ['id'],
    });
    expect(del.affected_rows).toBe(1);

    await adminH.delete({ table: 'users', pk_columns: { id: user.id } });
    await adminH.delete({ table: 'users', pk_columns: { id: stranger.id } });
    userH.apolloClient.terminate?.();
    strangerH.apolloClient.terminate?.();
    adminH.apolloClient.terminate?.();
  }, 30000);

  it('user cannot edit or delete another user schedule', async () => {
    const adminH = createAdminHasyx();
    const owner = await createTestUser(adminH, 'owner');
    const stranger = await createTestUser(adminH, 'stranger');
    const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
    const { hasyx: strangerH } = await adminH._authorize(stranger.id, { ws: false });

    const scheduleId = uuidv4();
    const now = Math.floor(Date.now() / 1000);

    await ownerH.insert({
      table: 'schedule',
      object: { id: scheduleId, title: 'Owner Title', cron: '*/10 * * * *', start_at: now, end_at: now + 7200 },
      returning: ['id'],
    });

    // Stranger can see it
    const rows = await strangerH.select({ table: 'schedule', where: { id: { _eq: scheduleId } }, returning: ['id', 'title'] });
    expect(rows).toHaveLength(1);

    // Stranger cannot update
    await expect(
      strangerH.update({
        table: 'schedule',
        _set: { cron: '*/15 * * * *' },
        where: { id: { _eq: scheduleId } },
        returning: ['id'],
      })
    ).resolves.toMatchObject({ affected_rows: 0 });

    // Stranger cannot delete
    await expect(
      strangerH.delete({
        table: 'schedule',
        where: { id: { _eq: scheduleId } },
        returning: ['id'],
      })
    ).resolves.toMatchObject({ affected_rows: 0 });

    // Cleanup
    await adminH.delete({ table: 'schedule', pk_columns: { id: scheduleId } });
    await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
    await adminH.delete({ table: 'users', pk_columns: { id: stranger.id } });

    ownerH.apolloClient.terminate?.();
    strangerH.apolloClient.terminate?.();
    adminH.apolloClient.terminate?.();
  }, 30000);

  it('user can create and update own event; cannot modify others', async () => {
    const adminH = createAdminHasyx();
    const owner = await createTestUser(adminH, 'owner');
    const other = await createTestUser(adminH, 'other');
    const { hasyx: ownerH } = await adminH._authorize(owner.id, { ws: false });
    const { hasyx: otherH } = await adminH._authorize(other.id, { ws: false });

    // Owner creates schedule
    const scheduleId = uuidv4();
    const now = Math.floor(Date.now() / 1000);
    await ownerH.insert({
      table: 'schedule',
      object: { id: scheduleId, title: 'Sched', cron: '*/5 * * * *', start_at: now, end_at: now + 600 },
      returning: ['id'],
    });

    // Owner creates event
    const eventId = uuidv4();
    const event = await ownerH.insert({
      table: 'events',
      object: { id: eventId, title: 'My Event', schedule_id: scheduleId, plan_start: now + 60 },
      returning: ['id', 'user_id', 'schedule_id', 'plan_start', 'title'],
    });

    expect(event.id).toBe(eventId);
    expect(event.user_id).toBe(owner.id);

    // Other can read
    const seen = await otherH.select({ table: 'events', where: { id: { _eq: eventId } }, returning: ['id', 'title'] });
    expect(seen).toHaveLength(1);

    // Owner can update own event
    const upd = await ownerH.update({
      table: 'events',
      _set: { status: 'in_progress', title: 'Updated Event' },
      where: { id: { _eq: eventId } },
      returning: ['id', 'status', 'title'],
    });
    expect(upd.returning).toHaveLength(1);
    expect(upd.returning[0].status).toBe('in_progress');
    expect(upd.returning[0].title).toBe('Updated Event');

    // Other cannot delete or update owner's event
    await expect(
      otherH.update({ table: 'events', _set: { status: 'completed' }, where: { id: { _eq: eventId } }, returning: ['id'] })
    ).resolves.toMatchObject({ affected_rows: 0 });

    await expect(
      otherH.delete({ table: 'events', where: { id: { _eq: eventId } }, returning: ['id'] })
    ).resolves.toMatchObject({ affected_rows: 0 });

    // Cleanup
    await adminH.delete({ table: 'events', pk_columns: { id: eventId } });
    await adminH.delete({ table: 'schedule', pk_columns: { id: scheduleId } });
    await adminH.delete({ table: 'users', pk_columns: { id: owner.id } });
    await adminH.delete({ table: 'users', pk_columns: { id: other.id } });

    ownerH.apolloClient.terminate?.();
    otherH.apolloClient.terminate?.();
    adminH.apolloClient.terminate?.();
  }, 30000);
});



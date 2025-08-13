import { Hasura } from '../hasura/hasura';
import Debug from '../debug';
import { NextResponse } from 'next/server';
import { HasuraEventPayload } from '../events';

const debug = Debug('api:events:notify');

async function getOAuthAccessTokenForServer(): Promise<string> {
  const { GoogleAuth } = await import('google-auth-library');
  debug('Attempting to get OAuth 2.0 access token for FCM on server');
  const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/firebase.messaging'] });
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  if (!accessToken || !accessToken.token) throw new Error('Failed to retrieve access token from GoogleAuth. Ensure GOOGLE_APPLICATION_CREDENTIALS is set correctly.');
  debug('Successfully retrieved OAuth 2.0 access token on server');
  return accessToken.token;
}

export async function handleNotifyEvent(payload: HasuraEventPayload) {
  debug('Received notify event:', { table: `${payload.table.schema}.${payload.table.name}`, operation: payload.event.op });
  const hasura = new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, });
  try {
    const notification = (payload as any).event.data.new;
    if ((payload as any).event.op !== 'INSERT' || payload.table.name !== 'notifications') {
      debug('Ignoring event - not an insertion to notifications table');
      return { success: false, message: 'Unsupported event' };
    }

    const permissionResult = await hasura.v1({ type: 'select', args: { table: { schema: 'public', name: 'notification_permissions' }, columns: ['id', 'user_id', 'provider', 'device_token', 'device_info'], where: { id: { _eq: notification.permission_id } } } });
    if (!permissionResult || !permissionResult.length) throw new Error('Permission not found');
    const permissionData = permissionResult[0];

    const messageResult = await hasura.v1({ type: 'select', args: { table: { schema: 'public', name: 'notification_messages' }, columns: ['id', 'title', 'body', 'data'], where: { id: { _eq: notification.message_id } } } });
    if (!messageResult || !messageResult.length) throw new Error('Message not found');
    const messageData = messageResult[0];

    let result: any;
    switch (permissionData.provider) {
      case 'firebase': {
        const { sendFirebaseNotification } = await import('../notify/notify-firebase');
        result = await sendFirebaseNotification(permissionData, messageData, notification, getOAuthAccessTokenForServer);
        break;
      }
      case 'telegram_bot': {
        const { sendTelegramNotification } = await import('../notify/notify-telegram');
        result = await sendTelegramNotification(permissionData, messageData, notification);
        break;
      }
      default:
        debug(`Unsupported provider: ${permissionData.provider}`);
        result = { success: false, message: `Unsupported provider: ${permissionData.provider}` };
    }

    await hasura.v1({ type: 'update', args: { table: { schema: 'public', name: 'notifications' }, where: { id: { _eq: notification.id } }, _set: { status: result.success ? 'sent' : 'failed', error: result.success ? null : result.message, updated_at: new Date().toISOString() } } });
    return result;
  } catch (error: any) {
    debug('Error processing notification:', error);
    try {
      await hasura.v1({ type: 'update', args: { table: { schema: 'public', name: 'notifications' }, where: { id: { _eq: (payload as any).event.data.new.id } }, _set: { status: 'failed', error: error instanceof Error ? error.message : 'Unknown error', updated_at: new Date().toISOString() } } });
    } catch (updateError) {
      debug('Failed to update notification status:', updateError as any);
    }
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error sending notification' };
  }
}



import { hasyxEvent, HasuraEventPayload } from 'hasyx/lib/events';
import { handleNotifyEvent } from 'hasyx/lib/events/notify';

export const POST = hasyxEvent(async (payload: HasuraEventPayload) => {
  return handleNotifyEvent(payload);
});
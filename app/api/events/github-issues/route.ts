import { hasyxEvent, HasuraEventPayload } from 'hasyx/lib/events';
import { githubIssuesEventHandler } from 'hasyx/lib/events/github-issues';

export const POST = hasyxEvent(async (payload: HasuraEventPayload) => {
  return githubIssuesEventHandler(payload);
});
import { NextResponse } from 'next/server';
import { Hasura } from 'hasyx/lib/hasura/hasura';
import Debug from 'hasyx/lib/debug';

const debug = Debug('api:schedule-one-off');

export async function POST(request: Request) {
  try {
    const secretHeader = request.headers.get('x-hasura-event-secret') || request.headers.get('X-Hasura-Event-Secret');
    const expected = process.env.HASURA_EVENT_SECRET || '';
    if (!expected || secretHeader !== expected) {
      debug('Invalid or missing X-Hasura-Event-Secret');
      return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => { headers[key] = value; });

    const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
    const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;
    if (!HASURA_URL || !ADMIN_SECRET) {
      debug('Missing Hasura admin env');
      return NextResponse.json({ success: false, error: 'server_misconfigured' }, { status: 500 });
    }

    const hasura = new Hasura({ url: HASURA_URL, secret: ADMIN_SECRET });

    const insertRes = await hasura.v1({
      type: 'insert',
      args: {
        table: { schema: 'public', name: 'debug' },
        objects: [{ value: { headers, body } }],
        returning: ['id']
      }
    });

    const id = Array.isArray(insertRes) && insertRes[0]?.id ? insertRes[0].id : null;
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    debug('Error in schedule-one-off POST:', error?.message || String(error));
    return NextResponse.json({ success: false, error: 'internal_error' }, { status: 500 });
  }
}



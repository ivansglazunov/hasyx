import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, WsClientsManager } from '../users/auth-next';
import Debug from '../debug';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { withCors } from '../cors';

const debug = Debug('api:auth');

export async function handleAuthGET(request: NextRequest) {
  return withCors(request, async (req) => {
    debug('GET /api/auth: Getting authorization status...');
    try {
      const token = await getTokenFromRequest(req);
      if (token) {
        debug('GET /api/auth: User authenticated via getToken, returning token payload.', token);
        const { accessToken, ...tokenWithoutSensitiveData } = token as any;
        return NextResponse.json({ authenticated: true, token: tokenWithoutSensitiveData });
      }
      debug('GET /api/auth: User not authenticated (getToken returned null).');
      return NextResponse.json({ authenticated: false });
    } catch (error: any) {
      debug('GET /api/auth: Error getting token:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  });
}

const clients = WsClientsManager('/api/auth');
export function handleAuthSOCKET(
  ws: WebSocket,
  request: http.IncomingMessage,
  server: WebSocketServer
) {
  const clientId = clients.Client(ws as any);
  (async () => {
    const user = await clients.parseUser(request, clientId);
    if (user) {
      debug(`SOCKET /api/auth (${clientId}): User parsed and updated.`);
      ws.send(JSON.stringify({ type: 'auth_status', authenticated: true, userId: (user as any).sub, token: user }));
    } else {
      debug(`SOCKET /api/auth (${clientId}): No valid token found.`);
      ws.send(JSON.stringify({ type: 'auth_status', authenticated: false }));
    }
  })();

  ws.on('message', (_data: WebSocket.Data) => {
    const client = clients.getClient(clientId);
    if (client) {
      ws.send(JSON.stringify({ type: 'auth_status', authenticated: true, userId: client.userId, token: client.user }));
    }
  });

  ws.on('close', () => { clients.delete(clientId); });
  ws.on('error', () => { clients.delete(clientId); });
}

export async function handleAuthPOST(request: NextRequest) {
  return withCors(request, () => NextResponse.json({ message: 'API route for static builds' }));
}



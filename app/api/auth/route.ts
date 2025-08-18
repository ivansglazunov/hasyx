import { NextRequest } from 'next/server';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { handleAuthGET, handleAuthPOST, handleAuthSOCKET } from 'hasyx/lib/auth/route';

export async function GET(request: NextRequest) { return handleAuthGET(request); }
export function POST(request: NextRequest) { return handleAuthPOST(request); }
export function SOCKET(ws: WebSocket, request: http.IncomingMessage, server: WebSocketServer) { return handleAuthSOCKET(ws, request, server); }
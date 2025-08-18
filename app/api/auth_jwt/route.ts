import { NextRequest } from 'next/server';
import { handleAuthJwtGET, handleAuthJwtOPTIONS } from 'hasyx/lib/auth/jwt-status';

export async function GET(request: NextRequest) { return handleAuthJwtGET(request); }
export async function OPTIONS(request: NextRequest) { return handleAuthJwtOPTIONS(request); } 
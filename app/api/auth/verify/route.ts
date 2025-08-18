import { NextRequest } from 'next/server';
import { handleAuthVerifyGET } from 'hasyx/lib/auth/verify';

export async function GET(request: NextRequest) { return handleAuthVerifyGET(request); }
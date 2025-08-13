import { NextRequest } from 'next/server';
import { handleJwtComplete, handleJwtCompleteOptions } from 'hasyx/lib/auth/jwt-complete';

export async function POST(request: NextRequest) { return handleJwtComplete(request); }
export async function OPTIONS() { return handleJwtCompleteOptions(); }
import { NextRequest } from 'next/server';
import { handleCredentialsStart } from 'hasyx/lib/auth/credentials-start';

export async function POST(request: NextRequest) { return handleCredentialsStart(request); }



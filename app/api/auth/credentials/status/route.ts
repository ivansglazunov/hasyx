import { NextRequest } from 'next/server';
import { handleCredentialsStatus } from 'hasyx/lib/auth/credentials';
import authOptions from '@/app/options';

export async function GET(request: NextRequest) { return handleCredentialsStatus(request, authOptions); }



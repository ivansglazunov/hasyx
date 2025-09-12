import { NextRequest } from 'next/server';
import { handleCredentialsSet } from 'hasyx/lib/auth/credentials';
import authOptions from '@/app/options';

export async function POST(request: NextRequest) { return handleCredentialsSet(request, authOptions); }



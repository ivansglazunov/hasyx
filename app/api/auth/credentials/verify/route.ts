import { NextRequest } from 'next/server';
import { handleCredentialsVerify } from 'hasyx/lib/auth/credentials';
import authOptions from '@/app/options';

export async function POST(request: NextRequest) { return handleCredentialsVerify(request, authOptions); }



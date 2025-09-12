import { NextRequest } from 'next/server';
import { handleOtpVerify } from 'hasyx/lib/auth/credentials';
import authOptions from '@/app/options';

export async function POST(request: NextRequest) { return handleOtpVerify(request, authOptions); }



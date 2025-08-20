import { NextRequest, NextResponse } from 'next/server';
import { handleInvitePOST } from 'hasyx/lib/invite/api';
import authOptions from '@/app/options';

export async function POST(request: NextRequest) {
  return handleInvitePOST(request, authOptions);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

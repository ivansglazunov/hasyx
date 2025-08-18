import { NextRequest } from 'next/server';
import { handleWstunnelPOST } from 'hasyx/lib/wstunnel/api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
): Promise<Response> {
  const { uuid } = await params;
  return handleWstunnelPOST(request, { uuid });
} 
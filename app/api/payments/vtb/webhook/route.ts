import { NextRequest, NextResponse } from 'next/server';
import { handleVtbWebhook, handleVtbWebhookOptions } from 'hasyx/lib/payments/vtb/webhook';

export async function POST(request: NextRequest) { return handleVtbWebhook(request); }
export async function OPTIONS(): Promise<NextResponse> { return handleVtbWebhookOptions(); }



import { NextRequest, NextResponse } from 'next/server';
import { handleTbankWebhook, handleTbankWebhookOptions } from 'hasyx/lib/payments/tbank/webhook';

export async function POST(request: NextRequest) { return handleTbankWebhook(request); }
export async function OPTIONS(): Promise<NextResponse> { return handleTbankWebhookOptions(); }
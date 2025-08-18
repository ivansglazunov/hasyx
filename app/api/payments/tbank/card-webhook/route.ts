import { NextRequest } from 'next/server';
import { handleTbankCardWebhook, handleTbankCardWebhookOptions } from 'hasyx/lib/payments/tbank/card-webhook';

export async function POST(request: NextRequest) { return handleTbankCardWebhook(request); }
export async function OPTIONS(request: NextRequest) { return handleTbankCardWebhookOptions(request); } 
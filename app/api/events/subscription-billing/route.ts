import { NextRequest } from 'next/server';
import { handleSubscriptionBilling } from 'hasyx/lib/payments/subscription-billing';

export async function POST(request: NextRequest) { return handleSubscriptionBilling(request); }
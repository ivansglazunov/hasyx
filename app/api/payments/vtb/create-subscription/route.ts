import { NextRequest } from 'next/server';
import { handleVtbCreateSubscription } from 'hasyx/lib/payments/vtb/api';

export async function POST(request: NextRequest) { return handleVtbCreateSubscription(request); }

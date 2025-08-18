import { NextRequest } from 'next/server';
import authOptions from '@/app/options';
import { handleTbankCreateSubscription } from 'hasyx/lib/payments/tbank/api';

export async function POST(request: NextRequest) { return handleTbankCreateSubscription(request, authOptions); } 
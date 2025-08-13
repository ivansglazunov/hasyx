import { NextRequest } from 'next/server';
import { handleTbankInitPayment } from 'hasyx/lib/payments/tbank/api';

export async function POST(request: NextRequest) { return handleTbankInitPayment(request); }
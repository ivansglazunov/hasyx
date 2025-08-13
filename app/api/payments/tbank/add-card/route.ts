import { NextRequest } from 'next/server';
import { handleTbankAddCard } from 'hasyx/lib/payments/tbank/api';

export async function POST(request: NextRequest) { return handleTbankAddCard(request); }
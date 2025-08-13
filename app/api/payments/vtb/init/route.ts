import { NextRequest } from 'next/server';
import { handleVtbInitPayment } from 'hasyx/lib/payments/vtb/api';

export async function POST(request: NextRequest) { return handleVtbInitPayment(request); }





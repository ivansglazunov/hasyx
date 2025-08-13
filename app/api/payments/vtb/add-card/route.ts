import { NextRequest } from 'next/server';
import { handleVtbAddCard } from 'hasyx/lib/payments/vtb/api';

export async function POST(request: NextRequest) { return handleVtbAddCard(request); }



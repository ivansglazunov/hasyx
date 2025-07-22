import { NextRequest } from 'next/server';
import { getJwtHandler } from 'hasyx/lib/get-jwt';
import authOptions from '../../../options';

export async function POST(request: NextRequest) {
  return getJwtHandler(request, authOptions);
} 
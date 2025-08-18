import { NextRequest } from 'next/server';
import authOptions from '@/app/options';
import { handleConfigGET, handleConfigPOST } from 'hasyx/lib/config/api';

export const runtime = 'nodejs';
export async function GET() { return handleConfigGET(authOptions); }
export async function POST(req: NextRequest) { return handleConfigPOST(req, authOptions); }


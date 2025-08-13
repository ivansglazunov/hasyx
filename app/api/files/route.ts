import { NextRequest, NextResponse } from 'next/server';
import { handleUpload } from 'hasyx/lib/files/api';

export async function POST(request: NextRequest): Promise<NextResponse> { return handleUpload(request); }
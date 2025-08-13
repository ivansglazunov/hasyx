import { NextRequest, NextResponse } from 'next/server';
import { handleDownload, handleDelete } from 'hasyx/lib/files/api';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await context.params;
  return handleDownload(request, id);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await context.params;
  return handleDelete(request, id);
}
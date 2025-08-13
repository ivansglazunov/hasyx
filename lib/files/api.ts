import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, downloadFile, deleteFile } from './files';
import { getTokenFromRequest } from '../users/auth-next';
import Debug from '../debug';

const debug = Debug('api:files');

interface NextAuthToken {
  sub?: string;
  [key: string]: any;
}

async function getUserIdFromRequest(request: NextRequest): Promise<string | undefined> {
  try {
    const token = await getTokenFromRequest(request) as NextAuthToken | null;
    if (token?.sub) return token.sub;
  } catch (e) {
    debug('getUserIdFromRequest error', e as any);
  }
  return undefined;
}

export async function handleUpload(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = await getUserIdFromRequest(request);
    const isPublic = formData.get('isPublic') === 'true';
    const bucket = (formData.get('bucket') as string) || undefined;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadFile(fileBuffer, file.name, file.type, { userId, isPublic, bucket });
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ success: true, file: result.file, presignedUrl: result.presignedUrl });
  } catch (error: any) {
    debug('handleUpload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function handleDownload(request: NextRequest, fileId: string): Promise<NextResponse> {
  try {
    const userId = await getUserIdFromRequest(request);
    const result = await downloadFile(fileId, userId);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: result.error === 'File not found' ? 404 : 403 });
    return new NextResponse(result.fileContent, { headers: { 'Content-Type': result.mimeType || 'application/octet-stream', 'Content-Disposition': `inline; filename="${result.file?.name || 'file'}"`, 'Cache-Control': 'public, max-age=3600' } });
  } catch (error: any) {
    debug('handleDownload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function handleDelete(request: NextRequest, fileId: string): Promise<NextResponse> {
  try {
    const userId = await getUserIdFromRequest(request);
    const result = await deleteFile(fileId, userId);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: result.error === 'File not found' ? 404 : 403 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    debug('handleDelete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, downloadFile, deleteFile, listFiles, getFileInfo, updateFile } from 'hasyx/lib/files';
import Debug from 'hasyx/lib/debug';

const debug = Debug('api:files');

export async function GET(request: NextRequest): Promise<NextResponse> {
  debug(`GET /api/files from origin: ${request.headers.get('origin')}`);
  
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');
    const userId = request.headers.get('x-user-id') || undefined;
    
    if (fileId) {
      // Get specific file info
      const result = await getFileInfo(fileId, userId);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: result.error === 'File not found' ? 404 : 403 }
        );
      }
      
      return NextResponse.json(result.file);
    } else {
      // List files
      const publicOnly = searchParams.get('public') === 'true';
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');
      
      const result = await listFiles(userId, {
        publicOnly,
        limit,
        offset
      });
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        files: result.files,
        count: result.files?.length || 0
      });
    }
  } catch (error: any) {
    debug('GET /api/files error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  debug(`POST /api/files from origin: ${request.headers.get('origin')}`);
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = request.headers.get('x-user-id') || undefined;
    const isPublic = formData.get('isPublic') === 'true';
    const bucket = formData.get('bucket') as string || undefined;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadFile(
      fileBuffer,
      file.name,
      file.type,
      {
        userId,
        isPublic,
        bucket
      }
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      file: result.file,
      presignedUrl: result.presignedUrl
    });
    
  } catch (error: any) {
    debug('POST /api/files error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  debug(`PUT /api/files from origin: ${request.headers.get('origin')}`);
  
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');
    const userId = request.headers.get('x-user-id') || undefined;
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const updates: { name?: string; is_public?: boolean } = {};
    
    if (body.name) updates.name = body.name;
    if (typeof body.isPublic === 'boolean') updates.is_public = body.isPublic;
    
    const result = await updateFile(fileId, updates, userId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'File not found' ? 404 : 403 }
      );
    }
    
    return NextResponse.json({
      success: true,
      file: result.file
    });
    
  } catch (error: any) {
    debug('PUT /api/files error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  debug(`DELETE /api/files from origin: ${request.headers.get('origin')}`);
  
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');
    const userId = request.headers.get('x-user-id') || undefined;
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }
    
    const result = await deleteFile(fileId, userId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'File not found' ? 404 : 403 }
      );
    }
    
    return NextResponse.json({
      success: true
    });
    
  } catch (error: any) {
    debug('DELETE /api/files error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle download requests
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  debug(`PATCH /api/files from origin: ${request.headers.get('origin')}`);
  
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');
    const userId = request.headers.get('x-user-id') || undefined;
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }
    
    const result = await downloadFile(fileId, userId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'File not found' ? 404 : 403 }
      );
    }
    
    return NextResponse.json({
      success: true,
      file: result.file,
      downloadUrl: result.downloadUrl
    });
    
  } catch (error: any) {
    debug('PATCH /api/files error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
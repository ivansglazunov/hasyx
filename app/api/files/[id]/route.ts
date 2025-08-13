import { NextRequest, NextResponse } from 'next/server';
import { downloadFile, deleteFile } from 'hasyx/lib/files/files';
import { getTokenFromRequest } from 'hasyx/lib/users/auth-next';
import Debug from 'hasyx/lib/debug';

const debug = Debug('api:files:id');

// NextAuth Token Interface
interface NextAuthToken {
  sub?: string;
  name?: string;
  email?: string;
  'https://hasura.io/jwt/claims'?: {
    'x-hasura-default-role'?: string;
    'x-hasura-allowed-roles'?: string[];
    'x-hasura-user-id'?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// Helper function to extract user ID from request
async function extractUserId(request: NextRequest): Promise<string | undefined> {
  debug('🔍 Extracting user ID from request...');

  // Check for JWT token in Authorization header first
  const authHeader = request.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const jwtToken = authHeader.substring(7); // Remove 'Bearer ' prefix
    debug('🔓 Found Bearer token in Authorization header (JWT auth)');
    
    try {
      // Use the existing getTokenFromRequest function which properly handles JWT verification
      const token = await getTokenFromRequest(request) as NextAuthToken | null;
      
      debug('🎫 JWT getTokenFromRequest result:', {
        hasToken: !!token,
        hasSub: !!token?.sub,
        tokenType: typeof token,
        sub: token?.sub,
        provider: token?.provider,
        hasHasuraClaims: !!(token as any)?.['https://hasura.io/jwt/claims']
      });

      if (token?.sub) {
        debug(`👤 JWT user authenticated (ID: ${token.sub}).`);
        return token.sub;
      } else {
        debug('👤 JWT token invalid or missing user ID.');
      }
    } catch (jwtError: any) {
      debug('❌ Error processing JWT token:', jwtError.message);
    }
  }
  
  // Fall back to NextAuth cookie authentication
  debug('🔍 No valid JWT found, checking NextAuth session...');
  try {
    const token = await getTokenFromRequest(request) as NextAuthToken | null;
    
    debug('🎫 NextAuth getTokenFromRequest result:', {
      hasToken: !!token,
      hasSub: !!token?.sub,
      tokenType: typeof token,
      sub: token?.sub,
      provider: token?.provider,
      hasHasuraClaims: !!(token as any)?.['https://hasura.io/jwt/claims']
    });

    if (token?.sub) {
      debug(`👤 NextAuth user authenticated (ID: ${token.sub}).`);
      return token.sub;
    } else {
      debug('👤 User not authenticated.');
      return undefined;
    }
  } catch (sessionError: any) {
    debug('❌ Error checking user session:', sessionError.message);
    return undefined;
  }
}

// GET /api/files/[id] - Download file content
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id: fileId } = await context.params;
  debug(`GET /api/files/${fileId} from origin: ${request.headers.get('origin')}`);
  
  try {
    const userId = await extractUserId(request);
    debug(`User ID extracted: ${userId}`);
    
    const result = await downloadFile(fileId, userId);
    
    if (!result.success) {
      debug(`Download failed: ${result.error}`);
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'File not found' ? 404 : 403 }
      );
    }
    
    debug('Download successful, returning file content');
    return new NextResponse(result.fileContent, {
      headers: {
        'Content-Type': result.mimeType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${result.file?.name || 'file'}"`,
        'Cache-Control': 'public, max-age=3600'
      }
    });
    
  } catch (error: any) {
    debug('GET /api/files/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/files/[id] - Delete file
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id: fileId } = await context.params;
  debug(`DELETE /api/files/${fileId} from origin: ${request.headers.get('origin')}`);
  
  try {
    const userId = await extractUserId(request);
    debug(`User ID extracted: ${userId}`);
    
    const result = await deleteFile(fileId, userId);
    
    if (!result.success) {
      debug(`Delete failed: ${result.error}`);
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'File not found' ? 404 : 403 }
      );
    }
    
    debug('Delete successful');
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    debug('DELETE /api/files/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
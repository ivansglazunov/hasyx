import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from 'hasyx/lib/files/files';
import { getTokenFromRequest } from 'hasyx/lib/users/auth-next';
import Debug from 'hasyx/lib/debug';

const debug = Debug('api:files');

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

export async function POST(request: NextRequest): Promise<NextResponse> {
  debug(`POST /api/files from origin: ${request.headers.get('origin')}`);
  
  try {
    debug('Parsing form data...');
    const formData = await request.formData();
    debug('Form data parsed successfully');
    
    const file = formData.get('file') as File;
    debug(`File extracted: ${file ? file.name : 'null'}, size: ${file ? file.size : 'N/A'}, type: ${file ? file.type : 'N/A'}`);
    
    debug('Extracting user ID...');
    const userId = await extractUserId(request);
    debug(`User ID extracted: ${userId}`);
    
    const isPublic = formData.get('isPublic') === 'true';
    const bucket = formData.get('bucket') as string || undefined;
    debug(`isPublic: ${isPublic}, bucket: ${bucket}`);
    
    if (!file) {
      debug('No file provided in request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    debug('Converting file to buffer...');
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    debug(`File buffer created, size: ${fileBuffer.length} bytes`);
    
    debug('Calling uploadFile function...');
    debug(`📤 Passing to uploadFile:`, { userId, isPublic, bucket });
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
    
    debug(`📥 uploadFile result:`, { 
      success: result.success, 
      error: result.error,
      fileId: result.file?.id,
      uploadedByUserId: result.file?.uploadedByUserId
    });
    
    if (!result.success) {
      debug(`Upload failed: ${result.error}`);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    debug('Upload successful, returning response');
    return NextResponse.json({
      success: true,
      file: result.file,
      presignedUrl: result.presignedUrl
    });
    
  } catch (error: any) {
    debug('POST /api/files error:', error);
    debug('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

 
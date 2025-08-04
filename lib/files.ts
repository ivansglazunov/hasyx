import { Hasyx } from './hasyx';
import { createApolloClient, HasyxApolloClient } from './apollo';
import { Generator } from './generator';
import schema from '../public/hasura-schema.json';
import Debug from './debug';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { getTokenFromRequest } from 'hasyx/lib/auth-next';
import { generateJWT } from 'hasyx/lib/jwt';

const debug = Debug('files');
const generate = Generator(schema as any);

export interface FileUploadOptions {
  bucket?: string;
  isPublic?: boolean;
  userId?: string;
}

// FileInfo interface for files
interface FileInfo {
  id: string;
  name: string;
  bucketId?: string;
  mimeType?: string;
  size?: number;
  etag?: string;
  createdAt?: string;
  updatedAt?: string;
  isUploaded?: boolean;
  uploadedByUserId?: string;
}

export interface FileUploadResult {
  success: boolean;
  file?: FileInfo;
  error?: string;
  url?: string;
  presignedUrl?: string;
}

export interface FileDownloadResult {
  success: boolean;
  file?: FileInfo;
  fileContent?: Buffer;
  mimeType?: string;
  error?: string;
}

export interface FileDeleteResult {
  success: boolean;
  error?: string;
}

export interface FileListResult {
  success: boolean;
  files?: FileInfo[];
  error?: string;
}

/**
 * Create Hasyx client for file operations
 */
function createFilesHasyx(): Hasyx {
  const hasuraUrl = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;
  
  if (!hasuraUrl || !adminSecret) {
    throw new Error('Missing NEXT_PUBLIC_HASURA_GRAPHQL_URL or HASURA_ADMIN_SECRET for file operations');
  }
  
  const apolloClient = createApolloClient({
    url: hasuraUrl,
    secret: adminSecret,
    ws: false,
  }) as HasyxApolloClient;
  
  return new Hasyx(apolloClient, generate);
}

/**
 * Generate JWT token for hasura-storage with storage role
 */
function generateStorageJWT(userId?: string): string {
  const debug = Debug('files:jwt');
  debug(`🔑 Generating storage JWT for user: ${userId || 'anonymous'}`);
  
  const jwt = require('jsonwebtoken');
  const secret = process.env.HASURA_JWT_SECRET;
  
  if (!secret) {
    throw new Error('Missing HASURA_JWT_SECRET for storage JWT generation');
  }
  
  // Extract the key from the JWT secret JSON
  let jwtKey: string;
  try {
    const jwtConfig = JSON.parse(secret);
    jwtKey = jwtConfig.key;
  } catch (error) {
    // If it's not JSON, assume it's the key directly
    jwtKey = secret;
  }
  
  const payload = {
    sub: userId || 'anonymous',
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': ['user', 'storage'],
      'x-hasura-default-role': 'user',  // Change to user instead of storage
      'x-hasura-user-id': userId || 'anonymous'
    },
    // Add user_id to metadata for hasura-storage
    user_id: userId || 'anonymous',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
  };
  
  debug(`📦 JWT payload:`, payload);
  
  const token = jwt.sign(payload, jwtKey);
  debug(`✅ JWT generated successfully for user: ${userId || 'anonymous'}`);
  
  return token;
}

/**
 * Upload file to storage
 */
export async function uploadFile(
  file: Buffer | string,
  fileName: string,
  mimeType: string,
  options: FileUploadOptions = {}
): Promise<FileUploadResult> {
  const debug = Debug('files:upload');
  debug(`Starting file upload: ${fileName} (${mimeType})`);

  const { bucket = 'default', isPublic = false, userId } = options;
  
  debug(`👤 User ID for upload: ${userId || 'undefined'}`);
  debug(`📦 Upload options:`, { bucket, isPublic, userId });

  try {
    const fileBuffer = typeof file === 'string' ? Buffer.from(file, 'utf-8') : file;
    const fileSize = fileBuffer.length;

    debug(`File size: ${fileSize} bytes`);

    // Upload directly to hasura-storage
    debug(`Uploading to hasura-storage...`);
    const storageUrl = process.env.NEXT_PUBLIC_HASURA_STORAGE_URL || 'http://localhost:3001';
    
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer], { type: mimeType }), fileName);
    formData.append('bucketId', bucket);
    
    // Try to pass user_id as form data parameter
    if (userId) {
      formData.append('userId', userId);
      debug(`📤 Adding userId to form data: ${userId}`);
    }
    
    const jwtToken = generateStorageJWT(userId);
    debug(`🔐 Using JWT token for user: ${userId || 'anonymous'}`);
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${jwtToken}`,
    };
    
    // Try to pass user_id as HTTP header
    if (userId) {
      headers['X-Hasura-User-ID'] = userId;
      debug(`📤 Adding X-User-ID header: ${userId}`);
    }
    
    const uploadResponse = await fetch(`${storageUrl}/v1/files/`, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      debug(`Upload failed with status ${uploadResponse.status}: ${errorText}`);
      throw new Error(`Failed to upload file to storage: ${uploadResponse.statusText}`);
    }

    const uploadResult = await uploadResponse.json();
    debug(`Upload successful:`, uploadResult);
    debug(`🔍 Response from hasura-storage:`, {
      id: uploadResult.id,
      name: uploadResult.name,
      uploadedByUserId: uploadResult.uploadedByUserId,
      isUploaded: uploadResult.isUploaded
    });

    // 🔧 FIX: Update uploaded_by_user_id in database
    // because hasura-storage doesn't extract it from JWT token
    if (userId && uploadResult.id) {
      debug(`🔄 Updating uploaded_by_user_id in database for file: ${uploadResult.id}`);
      
      try {
        const hasyx = createFilesHasyx();
        await hasyx.update({
          table: 'updateFiles',  // Use custom name from migration
          where: { id: { _eq: uploadResult.id } },
          _set: { uploadedByUserId: userId },
          returning: ['id', 'uploadedByUserId']
        });
        debug(`✅ Successfully updated uploaded_by_user_id: ${userId}`);
      } catch (updateError: any) {
        debug(`❌ Failed to update uploaded_by_user_id:`, updateError);
        // Don't interrupt execution since file is already uploaded
      }
    }

    return {
      success: true,
      file: {
        id: uploadResult.id,
        name: uploadResult.name || fileName,
        bucketId: uploadResult.bucketId || bucket,
        mimeType: uploadResult.mimeType || mimeType,
        size: uploadResult.size || fileSize,
        etag: uploadResult.etag,
        createdAt: uploadResult.createdAt,
        updatedAt: uploadResult.updatedAt,
        isUploaded: true,
        uploadedByUserId: userId  // Return correct userId
      },
      url: uploadResult.url,
      presignedUrl: uploadResult.presignedUrl
    };

  } catch (error: any) {
    debug('Upload error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}

/**
 * Download file from storage
 */
export async function downloadFile(
  fileId: string,
  userId?: string
): Promise<FileDownloadResult> {
  try {
    debug(`Downloading file: ${fileId}`);
    
    const hasyx = createFilesHasyx();
    
    // Get file info from database
    const [file] = await hasyx.select<FileInfo[]>({
      table: 'files',
      where: { id: { _eq: fileId } },
      returning: ['id', 'name', 'bucketId', 'mimeType', 'size', 'etag', 'createdAt', 'updatedAt', 'isUploaded', 'uploadedByUserId']
    });
    
    if (!file) {
      return {
        success: false,
        error: 'File not found'
      };
    }
    
    // Check permissions
    if (!file.isUploaded && file.uploadedByUserId !== userId) {
      return {
        success: false,
        error: 'Access denied'
      };
    }
    
    // Download file content from Hasura Storage
    const storageUrl = process.env.HASURA_STORAGE_URL || process.env.NEXT_PUBLIC_HASURA_STORAGE_URL;
    const downloadUrl = `${storageUrl}/v1/files/${fileId}`;
    debug(`Downloading file content from: ${downloadUrl}`);

    try {
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Accept': '*/*'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        debug(`Download failed with status ${response.status}: ${errorText}`);
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }
      
      const fileContent = Buffer.from(await response.arrayBuffer());
      
      debug(`File content downloaded, size: ${fileContent.length} bytes`);
      
      return {
        success: true,
        file,
        fileContent,
        mimeType: file.mimeType
      };
      
    } catch (fetchError: any) {
      debug('Error fetching file from storage:', fetchError);
      return {
        success: false,
        error: `Failed to download file from storage: ${fetchError.message}`
      };
    }
    
  } catch (error: any) {
    debug('Download error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(
  fileId: string,
  userId?: string
): Promise<FileDeleteResult> {
  try {
    debug(`Deleting file: ${fileId}`);
    
    const hasyx = createFilesHasyx();
    
    // Get file info first
    const [file] = await hasyx.select<FileInfo[]>({
      table: 'files',
      where: { id: { _eq: fileId } },
      returning: ['id', 'uploadedByUserId', 'isUploaded']
    });
    
    if (!file) {
      return {
        success: false,
        error: 'File not found'
      };
    }
    
    // Check permissions
    if (!file.isUploaded && file.uploadedByUserId !== userId) {
      return {
        success: false,
        error: 'Access denied'
      };
    }
    
    // Delete from database
    await hasyx.delete({
      table: 'deleteFiles',
      where: { id: { _eq: fileId } }
    });

    // Clean up fallback storage, if any
    
    debug(`File deleted from database: ${fileId}`);
    
    return {
      success: true
    };
    
  } catch (error: any) {
    debug('Delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * List files for user
 */
export async function listFiles(
  userId?: string,
  options: {
    publicOnly?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<FileListResult> {
  try {
    debug(`Listing files for user: ${userId}, publicOnly: ${options.publicOnly}`);
    
    const hasyx = createFilesHasyx();
    
    let whereCondition: any = {};
    
    if (options.publicOnly) {
      whereCondition.isUploaded = { _eq: true };
    } else if (userId) {
      whereCondition._or = [
        { uploadedByUserId: { _eq: userId } },
        { isUploaded: { _eq: true } }
      ];
    } else {
      whereCondition.isUploaded = { _eq: true };
    }
    
    const files = await hasyx.select<FileInfo[]>({
      table: 'files',
      where: whereCondition,
      returning: ['id', 'name', 'bucketId', 'mimeType', 'size', 'etag', 'createdAt', 'updatedAt', 'isUploaded', 'uploadedByUserId'],
      order_by: [{ createdAt: 'desc' }],
      limit: options.limit || 50,
      offset: options.offset || 0
    });
    
    debug(`Found ${files.length} files`);
    
    return {
      success: true,
      files
    };
    
  } catch (error: any) {
    debug('List files error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get file info
 */
export async function getFileInfo(
  fileId: string,
  userId?: string
): Promise<FileDownloadResult> {
  try {
    debug(`Getting file info: ${fileId}, userId: ${userId}`);
    
    const hasyx = createFilesHasyx();
    
    const [file] = await hasyx.select<FileInfo[]>({
      table: 'files',
      where: { id: { _eq: fileId } },
      returning: ['id', 'name', 'bucketId', 'mimeType', 'size', 'etag', 'createdAt', 'updatedAt', 'isUploaded', 'uploadedByUserId']
    });
    
    if (!file) {
      debug(`File not found: ${fileId}`);
      return {
        success: false,
        error: 'File not found'
      };
    }
    
    debug(`File found:`, {
      id: file.id,
      isUploaded: file.isUploaded,
      uploadedByUserId: file.uploadedByUserId,
      userId: userId
    });
    
    // Check permissions - allow access to public files without user ID
    if (!file.isUploaded && file.uploadedByUserId !== userId) {
      debug(`Access denied: !isUploaded=${!file.isUploaded}, uploadedByUserId=${file.uploadedByUserId}, userId=${userId}`);
      return {
        success: false,
        error: 'Access denied'
      };
    }
    
    debug(`Access granted for file: ${fileId}`);
    return {
      success: true,
      file
    };
    
  } catch (error: any) {
    debug('Get file info error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update file metadata
 */
export async function updateFile(
  fileId: string,
  updates: {
    name?: string;
    isUploaded?: boolean;
  },
  userId?: string
): Promise<FileUploadResult> {
  try {
    debug(`Updating file: ${fileId}`, updates);
    
    const hasyx = createFilesHasyx();
    
    // Get file info first
    const [file] = await hasyx.select<FileInfo[]>({
      table: 'files',
      where: { id: { _eq: fileId } },
      returning: ['id', 'uploadedByUserId', 'isUploaded']
    });
    
    if (!file) {
      return {
        success: false,
        error: 'File not found'
      };
    }
    
    // Check permissions
    if (!file.isUploaded && file.uploadedByUserId !== userId) {
      return {
        success: false,
        error: 'Access denied'
      };
    }
    
    // Update file
    const updatedFile = await hasyx.update<FileInfo>({
      table: 'updateFiles',
      where: { id: { _eq: fileId } },
      _set: updates,
      returning: ['id', 'name', 'bucketId', 'mimeType', 'size', 'etag', 'createdAt', 'updatedAt', 'isUploaded', 'uploadedByUserId']
    });
    
    debug(`File updated: ${fileId}`);
    
    return {
      success: true,
      file: updatedFile
    };
    
  } catch (error: any) {
    debug('Update file error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate ETag for file
 */
function generateEtag(file: Buffer | string): string {
  const content = file instanceof Buffer ? file : Buffer.from(file as string, 'utf8');
  return crypto.createHash('md5').update(content).digest('hex');
} 
import { Hasyx } from './hasyx';
import { createApolloClient, HasyxApolloClient } from './apollo';
import { Generator } from './generator';
import schema from '../public/hasura-schema.json';
import Debug from './debug';

const debug = Debug('files');
const generate = Generator(schema as any);

export interface FileUploadOptions {
  bucket?: string;
  isPublic?: boolean;
  userId?: string;
}

export interface FileInfo {
  id: string;
  name: string;
  bucket_id: string;
  mime_type: string;
  size: number;
  etag: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  user_id?: string;
}

export interface FileUploadResult {
  success: boolean;
  file?: FileInfo;
  error?: string;
  presignedUrl?: string;
}

export interface FileDownloadResult {
  success: boolean;
  file?: FileInfo;
  downloadUrl?: string;
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
    throw new Error('Missing HASURA_URL or ADMIN_SECRET for file operations');
  }
  
  const apolloClient = createApolloClient({
    url: hasuraUrl,
    secret: adminSecret,
    ws: false,
  }) as HasyxApolloClient;
  
  return new Hasyx(apolloClient, generate);
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
  try {
    const fileSize = file instanceof Buffer ? file.length : file.length;
    debug(`Uploading file: ${fileName}, type: ${mimeType}, size: ${fileSize}`);
    
    const hasyx = createFilesHasyx();
    const bucket = options.bucket || process.env.STORAGE_S3_BUCKET || 'hasyx-storage';
    const isPublic = options.isPublic ?? false;
    const userId = options.userId;
    
    // Create file record in database
    const fileRecord = await hasyx.insert<FileInfo>({
      table: 'files',
      object: {
        name: fileName,
        bucket_id: bucket,
        mime_type: mimeType,
        size: fileSize,
        etag: generateEtag(file),
        is_public: isPublic,
        user_id: userId,
      },
      returning: ['id', 'name', 'bucket_id', 'mime_type', 'size', 'etag', 'created_at', 'updated_at', 'is_public', 'user_id']
    });
    
    if (!fileRecord) {
      throw new Error('Failed to create file record in database');
    }
    
    // Generate presigned URL for upload
    const storageUrl = process.env.HASURA_STORAGE_URL || 'http://localhost:3001';
    const presignedUrl = `${storageUrl}/files/${fileRecord.id}/upload`;
    
    debug(`File record created: ${fileRecord.id}, presigned URL: ${presignedUrl}`);
    
    return {
      success: true,
      file: fileRecord,
      presignedUrl
    };
    
  } catch (error: any) {
    debug('Upload error:', error);
    return {
      success: false,
      error: error.message
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
    const file = await hasyx.select<FileInfo | null>({
      table: 'files',
      pk_columns: { id: fileId },
      returning: ['id', 'name', 'bucket_id', 'mime_type', 'size', 'etag', 'created_at', 'updated_at', 'is_public', 'user_id']
    });
    
    if (!file) {
      return {
        success: false,
        error: 'File not found'
      };
    }
    
    // Check permissions
    if (!file.is_public && file.user_id !== userId) {
      return {
        success: false,
        error: 'Access denied'
      };
    }
    
    // Generate download URL
    const storageUrl = process.env.HASURA_STORAGE_URL || 'http://localhost:3001';
    const downloadUrl = `${storageUrl}/files/${fileId}/download`;
    
    debug(`File download URL generated: ${downloadUrl}`);
    
    return {
      success: true,
      file,
      downloadUrl
    };
    
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
    const file = await hasyx.select<FileInfo | null>({
      table: 'files',
      pk_columns: { id: fileId },
      returning: ['id', 'user_id', 'is_public']
    });
    
    if (!file) {
      return {
        success: false,
        error: 'File not found'
      };
    }
    
    // Check permissions
    if (!file.is_public && file.user_id !== userId) {
      return {
        success: false,
        error: 'Access denied'
      };
    }
    
    // Delete from database
    await hasyx.delete({
      table: 'files',
      pk_columns: { id: fileId }
    });
    
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
      whereCondition.is_public = { _eq: true };
    } else if (userId) {
      whereCondition._or = [
        { user_id: { _eq: userId } },
        { is_public: { _eq: true } }
      ];
    } else {
      whereCondition.is_public = { _eq: true };
    }
    
    const files = await hasyx.select<FileInfo[]>({
      table: 'files',
      where: whereCondition,
      returning: ['id', 'name', 'bucket_id', 'mime_type', 'size', 'etag', 'created_at', 'updated_at', 'is_public', 'user_id'],
      order_by: [{ created_at: 'desc' }],
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
    debug(`Getting file info: ${fileId}`);
    
    const hasyx = createFilesHasyx();
    
    const file = await hasyx.select<FileInfo | null>({
      table: 'files',
      pk_columns: { id: fileId },
      returning: ['id', 'name', 'bucket_id', 'mime_type', 'size', 'etag', 'created_at', 'updated_at', 'is_public', 'user_id']
    });
    
    if (!file) {
      return {
        success: false,
        error: 'File not found'
      };
    }
    
    // Check permissions
    if (!file.is_public && file.user_id !== userId) {
      return {
        success: false,
        error: 'Access denied'
      };
    }
    
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
    is_public?: boolean;
  },
  userId?: string
): Promise<FileUploadResult> {
  try {
    debug(`Updating file: ${fileId}`, updates);
    
    const hasyx = createFilesHasyx();
    
    // Get file info first
    const file = await hasyx.select<FileInfo | null>({
      table: 'files',
      pk_columns: { id: fileId },
      returning: ['id', 'user_id', 'is_public']
    });
    
    if (!file) {
      return {
        success: false,
        error: 'File not found'
      };
    }
    
    // Check permissions
    if (!file.is_public && file.user_id !== userId) {
      return {
        success: false,
        error: 'Access denied'
      };
    }
    
    // Update file
    const updatedFile = await hasyx.update<FileInfo>({
      table: 'files',
      pk_columns: { id: fileId },
      _set: updates,
      returning: ['id', 'name', 'bucket_id', 'mime_type', 'size', 'etag', 'created_at', 'updated_at', 'is_public', 'user_id']
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
  const crypto = require('crypto');
  const content = file instanceof Buffer ? file : Buffer.from(file as string, 'utf8');
  return crypto.createHash('md5').update(content).digest('hex');
} 
import { Hasyx } from '../hasyx/hasyx';
import { createApolloClient, HasyxApolloClient } from '../apollo/apollo';
import { Generator } from '../generator';
import schema from '../../public/hasura-schema.json';
import Debug from '../debug';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { getTokenFromRequest } from 'hasyx/lib/users/auth-next';
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
async function generateStorageJWT(userId?: string): Promise<string> {
  const debug = Debug('files:jwt');
  debug(`🔑 Generating storage JWT for user: ${userId || 'anonymous'}`);
  
  const { generateJWT } = await import('../jwt');
  
  const hasuraClaims = {
    'x-hasura-allowed-roles': ['user', 'storage'],
    'x-hasura-default-role': 'user',  // Change to user instead of storage
    'x-hasura-user-id': userId || 'anonymous'
  };
  
  // Add user_id to metadata for hasura-storage
  const additionalClaims = {
    user_id: userId || 'anonymous'
  };
  
  debug(`📦 JWT payload:`, { hasuraClaims, additionalClaims });
  
  const token = await generateJWT(userId || 'anonymous', hasuraClaims, { expiresIn: '1h' });
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

    const backend = (process.env.FILES_BACKEND || 'storage').toLowerCase();
    debug(`Files backend: ${backend}`);
    
    if (backend === 'database') {
      // Store metadata in storage.files and content in storage.files_blob
      const hasyx = createFilesHasyx();
      const id = uuidv4();
      const etag = generateEtag(fileBuffer);
      await hasyx.insert({
        table: 'insertFiles',
        objects: [{
          id,
          bucketId: bucket,
          name: fileName,
          size: fileSize,
          mimeType: mimeType,
          etag,
          isUploaded: true,
          uploadedByUserId: userId || null
        }],
        returning: ['id']
      });
      await hasyx.insert({
        table: 'insertFilesBlobs',
        objects: [{
          fileId: id,
          content: fileBuffer.toString('base64')
        }],
        returning: ['fileId']
      });
      return {
        success: true,
        file: {
          id,
          name: fileName,
          bucketId: bucket,
          mimeType,
          size: fileSize,
          etag,
          isUploaded: true,
          uploadedByUserId: userId
        }
      };
    } else {
      // Upload via hasura-storage
      debug(`Uploading to hasura-storage...`);
      const storageUrl = process.env.NEXT_PUBLIC_HASURA_STORAGE_URL || 'http://localhost:3001';
      const formData = new FormData();
      formData.append('file', new Blob([fileBuffer], { type: mimeType }), fileName);
      formData.append('bucketId', bucket);
      if (userId) {
        formData.append('userId', userId);
        debug(`📤 Adding userId to form data: ${userId}`);
      }
      const jwtToken = await generateStorageJWT(userId);
      debug(`🔐 Using JWT token for user: ${userId || 'anonymous'}`);
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${jwtToken}`,
      };
      if (userId) headers['X-Hasura-User-ID'] = userId;
      const uploadResponse = await fetch(`${storageUrl}/v1/files/`, { method: 'POST', body: formData, headers });
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        debug(`Upload failed with status ${uploadResponse.status}: ${errorText}`);
        throw new Error(`Failed to upload file to storage: ${uploadResponse.statusText}`);
      }
      const uploadResult = await uploadResponse.json();
      // Update uploadedByUserId if needed
      if (userId && uploadResult.id) {
        try {
          const hasyx = createFilesHasyx();
          await hasyx.update({
            table: 'updateFiles',
            where: { id: { _eq: uploadResult.id } },
            _set: { uploadedByUserId: userId },
            returning: ['id']
          });
        } catch {}
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
          uploadedByUserId: userId
        },
        url: uploadResult.url,
        presignedUrl: uploadResult.presignedUrl
      };
    }

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
    
    const backend = (process.env.FILES_BACKEND || 'storage').toLowerCase();
    if (backend === 'database') {
      const hasyx = createFilesHasyx();
      const [blob] = await hasyx.select<any[]>({
        table: 'filesBlobs',
        where: { fileId: { _eq: fileId } },
        returning: ['fileId', 'content']
      });
      if (!blob?.content) {
        return { success: false, error: 'File not found' };
      }
      const rawContent: string = String(blob.content);
      // Hasura/Postgres bytea often comes as hex ("\\x...").
      // В cloud.hasura.io мы фактически сохраняем base64-строку в bytea,
      // поэтому на чтении нужно декодировать дважды: hex -> ascii base64 -> bytes.
      let fileContent: Buffer;
      const looksBase64 = (s: string): boolean => /^[A-Za-z0-9+/]+={0,2}$/.test(s) && (s.length % 4 === 0);
      if (/^\\x[0-9a-fA-F]+$/.test(rawContent)) {
        const hexDecoded = Buffer.from(rawContent.slice(2), 'hex');
        const asString = hexDecoded.toString('utf8');
        if (looksBase64(asString)) {
          try {
            fileContent = Buffer.from(asString, 'base64');
          } catch {
            fileContent = hexDecoded;
          }
        } else {
          fileContent = hexDecoded;
        }
      } else if (/^[0-9a-fA-F]+$/.test(rawContent)) {
        const hexDecoded = Buffer.from(rawContent, 'hex');
        const asString = hexDecoded.toString('utf8');
        if (looksBase64(asString)) {
          try {
            fileContent = Buffer.from(asString, 'base64');
          } catch {
            fileContent = hexDecoded;
          }
        } else {
          fileContent = hexDecoded;
        }
      } else if (looksBase64(rawContent)) {
        fileContent = Buffer.from(rawContent, 'base64');
      } else {
        // Fallback: treat as utf8 bytes
        fileContent = Buffer.from(rawContent, 'utf8');
      }
      return { success: true, file, fileContent, mimeType: file.mimeType };
    } else {
      const storageUrl = process.env.HASURA_STORAGE_URL || process.env.NEXT_PUBLIC_HASURA_STORAGE_URL;
      const downloadUrl = `${storageUrl}/v1/files/${fileId}`;
      debug(`Downloading file content from: ${downloadUrl}`);
      const response = await fetch(downloadUrl, { method: 'GET', headers: { 'Accept': '*/*' } });
      if (!response.ok) {
        const errorText = await response.text();
        debug(`Download failed with status ${response.status}: ${errorText}`);
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }
      const fileContent = Buffer.from(await response.arrayBuffer());
      return { success: true, file, fileContent, mimeType: file.mimeType };
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
    // Clean up database blob if any (CASCADE handles it, but call for safety in metadata)
    try {
      await hasyx.delete({
        table: 'deleteFilesBlobs',
        where: { fileId: { _eq: fileId } }
      });
    } catch {}
    
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
      file: updatedFile as FileInfo
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
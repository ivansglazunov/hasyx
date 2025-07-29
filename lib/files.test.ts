import dotenv from 'dotenv';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApolloError, gql } from '@apollo/client/core/index.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
import { Hasyx } from './hasyx'; 
import { createApolloClient, HasyxApolloClient } from './apollo'; 
import Debug from './debug'; 
import { Generator } from './generator'; 
import schema from '../public/hasura-schema.json'; 
import { hashPassword } from './authDbUtils';
import { 
  uploadFile, 
  downloadFile, 
  deleteFile, 
  listFiles, 
  getFileInfo, 
  updateFile,
  FileInfo,
  FileUploadResult,
  FileDownloadResult,
  FileDeleteResult,
  FileListResult
} from './files';

const debug = Debug('test:files');

const generate = Generator(schema as any); 

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET!;

interface TestUser {
  id: string;
  name: string;
  hasura_role?: string;
}

// Helper function to create an admin Hasyx client
function createAdminHasyx(): Hasyx {
  if (!HASURA_URL || !ADMIN_SECRET) {
    throw new Error('❌ Missing HASURA_URL or ADMIN_SECRET in environment variables for test setup.');
  }
  
  const adminApolloClient = createApolloClient({
    url: HASURA_URL,
    secret: ADMIN_SECRET,
    ws: false,
  }) as HasyxApolloClient;
  
  return new Hasyx(adminApolloClient, generate);
}

// Helper function to create test user
async function createTestUser(adminHasyx: Hasyx, suffix: string = ''): Promise<TestUser> {
  const email = `files-test-${uuidv4()}@example.com`;
  const password = 'password123';
  const name = `Files Test User ${suffix}`;
  
  const hashedPassword = await hashPassword(password);
  
  const createdUser = await adminHasyx.insert<TestUser>({
    table: 'users',
    object: { email, password: hashedPassword, name, hasura_role: 'user' },
    returning: ['id', 'name']
  });
  
  if (!createdUser || !createdUser.id) {
    throw new Error(`Failed to create test user ${suffix}`);
  }
  
  return {
    id: createdUser.id,
    name: createdUser.name
  };
}

// Helper function to cleanup user
async function cleanupTestUser(adminHasyx: Hasyx, userId: string) {
  try {
    await adminHasyx.delete({
      table: 'users',
      pk_columns: { id: userId },
    });
  } catch (error: any) {
    debug(`Error deleting test user ${userId}:`, error.message);
  }
}

// Helper function to cleanup files
async function cleanupTestFiles(adminHasyx: Hasyx, fileIds: string[]) {
  for (const fileId of fileIds) {
    try {
      await adminHasyx.delete({
        table: 'files',
        pk_columns: { id: fileId },
      });
    } catch (error: any) {
      debug(`Error deleting test file ${fileId}:`, error.message);
    }
  }
}

// Helper function to cleanup Hasyx client
function cleanupHasyx(hasyx: Hasyx, label: string = '') {
  if (hasyx && hasyx.apolloClient && hasyx.apolloClient.terminate) {
    hasyx.apolloClient.terminate();
  }
}

// Original logic: Skip if JEST_LOCAL is '1' (truthy numeric string), otherwise run.
// This means tests run if JEST_LOCAL is '0' or undefined.
(!!+(process?.env?.JEST_LOCAL || '') ? describe.skip : describe)('Files Integration Tests', () => {
  
  describe('File Upload Tests', () => {
    it('should upload a file successfully', async () => {
      const adminHasyx = createAdminHasyx();
      let testUser: TestUser | null = null;
      let uploadedFileId: string | null = null;
      
      try {
        debug('🧪 Testing file upload...');
        
        // Create test user
        testUser = await createTestUser(adminHasyx, 'Upload');
        debug(`[test:files] 👤 Test user created: ${testUser.id}`);
        
        // Test file data
        const testFileName = `test-file-${uuidv4()}.txt`;
        const testFileContent = 'This is a test file content';
        const testMimeType = 'text/plain';
        
        // Upload file
        const uploadResult: FileUploadResult = await uploadFile(
          testFileContent,
          testFileName,
          testMimeType,
          {
            userId: testUser.id,
            isPublic: false
          }
        );
        
        debug(`[test:files] 📤 Upload result:`, uploadResult);
        
        if (!uploadResult.success) {
          console.log(`[test:files] ❌ Upload failed:`, uploadResult.error);
        }
        
        expect(uploadResult.success).toBe(true);
        expect(uploadResult.file).toBeDefined();
        expect(uploadResult.presignedUrl).toBeDefined();
        
        if (uploadResult.file) {
          uploadedFileId = uploadResult.file.id;
          expect(uploadResult.file.name).toBe(testFileName);
          expect(uploadResult.file.mime_type).toBe(testMimeType);
          expect(uploadResult.file.size).toBe(testFileContent.length);
          expect(uploadResult.file.user_id).toBe(testUser.id);
          expect(uploadResult.file.is_public).toBe(false);
        }
        
        debug('✅ File upload test succeeded.');
        
      } finally {
        if (uploadedFileId) {
          await cleanupTestFiles(adminHasyx, [uploadedFileId]);
        }
        if (testUser) {
          await cleanupTestUser(adminHasyx, testUser.id);
        }
        cleanupHasyx(adminHasyx, 'Upload test');
      }
    }, 15000);
    
    it('should upload a public file successfully', async () => {
      const adminHasyx = createAdminHasyx();
      let testUser: TestUser | null = null;
      let uploadedFileId: string | null = null;
      
      try {
        debug('🧪 Testing public file upload...');
        
        // Create test user
        testUser = await createTestUser(adminHasyx, 'Public');
        debug(`[test:files] 👤 Test user created: ${testUser.id}`);
        
        // Test file data
        const testFileName = `public-file-${uuidv4()}.jpg`;
        const testFileContent = Buffer.from('fake image data');
        const testMimeType = 'image/jpeg';
        
        // Upload public file
        const uploadResult: FileUploadResult = await uploadFile(
          testFileContent,
          testFileName,
          testMimeType,
          {
            userId: testUser.id,
            isPublic: true
          }
        );
        
        debug(`[test:files] 📤 Public upload result:`, uploadResult);
        
        expect(uploadResult.success).toBe(true);
        expect(uploadResult.file).toBeDefined();
        
        if (uploadResult.file) {
          uploadedFileId = uploadResult.file.id;
          expect(uploadResult.file.is_public).toBe(true);
        }
        
        debug('✅ Public file upload test succeeded.');
        
      } finally {
        if (uploadedFileId) {
          await cleanupTestFiles(adminHasyx, [uploadedFileId]);
        }
        if (testUser) {
          await cleanupTestUser(adminHasyx, testUser.id);
        }
        cleanupHasyx(adminHasyx, 'Public upload test');
      }
    }, 15000);
  });

  describe('File Download Tests', () => {
    it('should download a file successfully', async () => {
      const adminHasyx = createAdminHasyx();
      let testUser: TestUser | null = null;
      let uploadedFileId: string | null = null;
      
      try {
        debug('🧪 Testing file download...');
        
        // Create test user
        testUser = await createTestUser(adminHasyx, 'Download');
        debug(`[test:files] 👤 Test user created: ${testUser.id}`);
        
        // Upload a test file first
        const testFileName = `download-test-${uuidv4()}.txt`;
        const testFileContent = 'Download test content';
        const testMimeType = 'text/plain';
        
        const uploadResult: FileUploadResult = await uploadFile(
          testFileContent,
          testFileName,
          testMimeType,
          {
            userId: testUser.id,
            isPublic: false
          }
        );
        
        expect(uploadResult.success).toBe(true);
        expect(uploadResult.file).toBeDefined();
        
        if (uploadResult.file) {
          uploadedFileId = uploadResult.file.id;
          
          // Download the file
          const downloadResult: FileDownloadResult = await downloadFile(
            uploadedFileId,
            testUser.id
          );
          
          debug(`[test:files] 📥 Download result:`, downloadResult);
          
          expect(downloadResult.success).toBe(true);
          expect(downloadResult.file).toBeDefined();
          expect(downloadResult.downloadUrl).toBeDefined();
          
          if (downloadResult.file) {
            expect(downloadResult.file.id).toBe(uploadedFileId);
            expect(downloadResult.file.name).toBe(testFileName);
            expect(downloadResult.file.mime_type).toBe(testMimeType);
          }
        }
        
        debug('✅ File download test succeeded.');
        
      } finally {
        if (uploadedFileId) {
          await cleanupTestFiles(adminHasyx, [uploadedFileId]);
        }
        if (testUser) {
          await cleanupTestUser(adminHasyx, testUser.id);
        }
        cleanupHasyx(adminHasyx, 'Download test');
      }
    }, 15000);
    
    it('should download a public file without user ID', async () => {
      const adminHasyx = createAdminHasyx();
      let testUser: TestUser | null = null;
      let uploadedFileId: string | null = null;
      
      try {
        debug('🧪 Testing public file download without user ID...');
        
        // Create test user
        testUser = await createTestUser(adminHasyx, 'PublicDownload');
        debug(`[test:files] 👤 Test user created: ${testUser.id}`);
        
        // Upload a public test file
        const testFileName = `public-download-${uuidv4()}.pdf`;
        const testFileContent = 'Public download test content';
        const testMimeType = 'application/pdf';
        
        const uploadResult: FileUploadResult = await uploadFile(
          testFileContent,
          testFileName,
          testMimeType,
          {
            userId: testUser.id,
            isPublic: true
          }
        );
        
        expect(uploadResult.success).toBe(true);
        expect(uploadResult.file).toBeDefined();
        
        if (uploadResult.file) {
          uploadedFileId = uploadResult.file.id;
          
          // Download the file without user ID (should work for public files)
          const downloadResult: FileDownloadResult = await downloadFile(
            uploadedFileId
          );
          
          debug(`[test:files] 📥 Public download result:`, downloadResult);
          
          expect(downloadResult.success).toBe(true);
          expect(downloadResult.file).toBeDefined();
          expect(downloadResult.downloadUrl).toBeDefined();
        }
        
        debug('✅ Public file download test succeeded.');
        
      } finally {
        if (uploadedFileId) {
          await cleanupTestFiles(adminHasyx, [uploadedFileId]);
        }
        if (testUser) {
          await cleanupTestUser(adminHasyx, testUser.id);
        }
        cleanupHasyx(adminHasyx, 'Public download test');
      }
    }, 15000);
    
    it('should deny access to private file without user ID', async () => {
      const adminHasyx = createAdminHasyx();
      let testUser: TestUser | null = null;
      let uploadedFileId: string | null = null;
      
      try {
        debug('🧪 Testing private file access denial...');
        
        // Create test user
        testUser = await createTestUser(adminHasyx, 'Private');
        debug(`[test:files] 👤 Test user created: ${testUser.id}`);
        
        // Upload a private test file
        const testFileName = `private-file-${uuidv4()}.txt`;
        const testFileContent = 'Private file content';
        const testMimeType = 'text/plain';
        
        const uploadResult: FileUploadResult = await uploadFile(
          testFileContent,
          testFileName,
          testMimeType,
          {
            userId: testUser.id,
            isPublic: false
          }
        );
        
        expect(uploadResult.success).toBe(true);
        expect(uploadResult.file).toBeDefined();
        
        if (uploadResult.file) {
          uploadedFileId = uploadResult.file.id;
          
          // Try to download the file without user ID (should fail)
          const downloadResult: FileDownloadResult = await downloadFile(
            uploadedFileId
          );
          
          debug(`[test:files] 📥 Private download result:`, downloadResult);
          
          expect(downloadResult.success).toBe(false);
          expect(downloadResult.error).toBe('Access denied');
        }
        
        debug('✅ Private file access denial test succeeded.');
        
      } finally {
        if (uploadedFileId) {
          await cleanupTestFiles(adminHasyx, [uploadedFileId]);
        }
        if (testUser) {
          await cleanupTestUser(adminHasyx, testUser.id);
        }
        cleanupHasyx(adminHasyx, 'Private access test');
      }
    }, 15000);
  });

  describe('File Delete Tests', () => {
    it('should delete a file successfully', async () => {
      const adminHasyx = createAdminHasyx();
      let testUser: TestUser | null = null;
      let uploadedFileId: string | null = null;
      
      try {
        debug('🧪 Testing file deletion...');
        
        // Create test user
        testUser = await createTestUser(adminHasyx, 'Delete');
        debug(`[test:files] 👤 Test user created: ${testUser.id}`);
        
        // Upload a test file first
        const testFileName = `delete-test-${uuidv4()}.txt`;
        const testFileContent = 'Delete test content';
        const testMimeType = 'text/plain';
        
        const uploadResult: FileUploadResult = await uploadFile(
          testFileContent,
          testFileName,
          testMimeType,
          {
            userId: testUser.id,
            isPublic: false
          }
        );
        
        expect(uploadResult.success).toBe(true);
        expect(uploadResult.file).toBeDefined();
        
        if (uploadResult.file) {
          uploadedFileId = uploadResult.file.id;
          
          // Delete the file
          const deleteResult: FileDeleteResult = await deleteFile(
            uploadedFileId,
            testUser.id
          );
          
          debug(`[test:files] 🗑️ Delete result:`, deleteResult);
          
          expect(deleteResult.success).toBe(true);
          
          // Verify file is deleted by trying to get info
          const infoResult: FileDownloadResult = await getFileInfo(uploadedFileId);
          expect(infoResult.success).toBe(false);
          expect(infoResult.error).toBe('File not found');
        }
        
        debug('✅ File deletion test succeeded.');
        
      } finally {
        if (uploadedFileId) {
          await cleanupTestFiles(adminHasyx, [uploadedFileId]);
        }
        if (testUser) {
          await cleanupTestUser(adminHasyx, testUser.id);
        }
        cleanupHasyx(adminHasyx, 'Delete test');
      }
    }, 15000);
  });

  describe('File List Tests', () => {
    it('should list files for user', async () => {
      const adminHasyx = createAdminHasyx();
      let testUser: TestUser | null = null;
      let uploadedFileIds: string[] = [];
      
      try {
        debug('🧪 Testing file listing...');
        
        // Create test user
        testUser = await createTestUser(adminHasyx, 'List');
        debug(`[test:files] 👤 Test user created: ${testUser.id}`);
        
        // Upload multiple test files
        const testFiles = [
          { name: `list-test-1-${uuidv4()}.txt`, content: 'File 1 content', mime: 'text/plain', public: false },
          { name: `list-test-2-${uuidv4()}.jpg`, content: Buffer.from('File 2 content'), mime: 'image/jpeg', public: true },
          { name: `list-test-3-${uuidv4()}.pdf`, content: 'File 3 content', mime: 'application/pdf', public: false }
        ];
        
        for (const testFile of testFiles) {
          const uploadResult: FileUploadResult = await uploadFile(
            testFile.content,
            testFile.name,
            testFile.mime,
            {
              userId: testUser.id,
              isPublic: testFile.public
            }
          );
          
          expect(uploadResult.success).toBe(true);
          expect(uploadResult.file).toBeDefined();
          
          if (uploadResult.file) {
            uploadedFileIds.push(uploadResult.file.id);
          }
        }
        
        // List all files for user
        const listResult: FileListResult = await listFiles(testUser.id);
        
        debug(`[test:files] 📋 List result:`, listResult);
        
        expect(listResult.success).toBe(true);
        expect(listResult.files).toBeDefined();
        expect(Array.isArray(listResult.files)).toBe(true);
        expect(listResult.files!.length).toBeGreaterThanOrEqual(3);
        
        // Verify all uploaded files are in the list
        const fileIds = listResult.files!.map(f => f.id);
        for (const uploadedId of uploadedFileIds) {
          expect(fileIds).toContain(uploadedId);
        }
        
        debug('✅ File listing test succeeded.');
        
      } finally {
        if (uploadedFileIds.length > 0) {
          await cleanupTestFiles(adminHasyx, uploadedFileIds);
        }
        if (testUser) {
          await cleanupTestUser(adminHasyx, testUser.id);
        }
        cleanupHasyx(adminHasyx, 'List test');
      }
    }, 15000);
    
    it('should list only public files when publicOnly is true', async () => {
      const adminHasyx = createAdminHasyx();
      let testUser: TestUser | null = null;
      let uploadedFileIds: string[] = [];
      
      try {
        debug('🧪 Testing public files listing...');
        
        // Create test user
        testUser = await createTestUser(adminHasyx, 'PublicList');
        debug(`[test:files] 👤 Test user created: ${testUser.id}`);
        
        // Upload mixed public/private files
        const testFiles = [
          { name: `public-list-1-${uuidv4()}.txt`, content: 'Public file 1', mime: 'text/plain', public: true },
          { name: `public-list-2-${uuidv4()}.jpg`, content: Buffer.from('Public file 2'), mime: 'image/jpeg', public: true },
          { name: `private-list-3-${uuidv4()}.pdf`, content: 'Private file 3', mime: 'application/pdf', public: false }
        ];
        
        for (const testFile of testFiles) {
          const uploadResult: FileUploadResult = await uploadFile(
            testFile.content,
            testFile.name,
            testFile.mime,
            {
              userId: testUser.id,
              isPublic: testFile.public
            }
          );
          
          expect(uploadResult.success).toBe(true);
          expect(uploadResult.file).toBeDefined();
          
          if (uploadResult.file) {
            uploadedFileIds.push(uploadResult.file.id);
          }
        }
        
        // List only public files
        const listResult: FileListResult = await listFiles(testUser.id, { publicOnly: true });
        
        debug(`[test:files] 📋 Public list result:`, listResult);
        
        expect(listResult.success).toBe(true);
        expect(listResult.files).toBeDefined();
        expect(Array.isArray(listResult.files)).toBe(true);
        
        // Verify only public files are returned
        for (const file of listResult.files!) {
          expect(file.is_public).toBe(true);
        }
        
        // Should have exactly 2 public files
        const publicFiles = listResult.files!.filter(f => f.is_public);
        expect(publicFiles.length).toBe(2);
        
        debug('✅ Public files listing test succeeded.');
        
      } finally {
        if (uploadedFileIds.length > 0) {
          await cleanupTestFiles(adminHasyx, uploadedFileIds);
        }
        if (testUser) {
          await cleanupTestUser(adminHasyx, testUser.id);
        }
        cleanupHasyx(adminHasyx, 'Public list test');
      }
    }, 15000);
  });

  describe('File Update Tests', () => {
    it('should update file metadata successfully', async () => {
      const adminHasyx = createAdminHasyx();
      let testUser: TestUser | null = null;
      let uploadedFileId: string | null = null;
      
      try {
        debug('🧪 Testing file metadata update...');
        
        // Create test user
        testUser = await createTestUser(adminHasyx, 'Update');
        debug(`[test:files] 👤 Test user created: ${testUser.id}`);
        
        // Upload a test file
        const testFileName = `update-test-${uuidv4()}.txt`;
        const testFileContent = 'Update test content';
        const testMimeType = 'text/plain';
        
        const uploadResult: FileUploadResult = await uploadFile(
          testFileContent,
          testFileName,
          testMimeType,
          {
            userId: testUser.id,
            isPublic: false
          }
        );
        
        expect(uploadResult.success).toBe(true);
        expect(uploadResult.file).toBeDefined();
        
        if (uploadResult.file) {
          uploadedFileId = uploadResult.file.id;
          
          // Update file metadata
          const newName = `updated-${testFileName}`;
          const updateResult: FileUploadResult = await updateFile(
            uploadedFileId,
            {
              name: newName,
              is_public: true
            },
            testUser.id
          );
          
          debug(`[test:files] 📝 Update result:`, updateResult);
          
          expect(updateResult.success).toBe(true);
          expect(updateResult.file).toBeDefined();
          
          if (updateResult.file) {
            expect(updateResult.file.name).toBe(newName);
            expect(updateResult.file.is_public).toBe(true);
          }
          
          // Verify update by getting file info
          const infoResult: FileDownloadResult = await getFileInfo(uploadedFileId, testUser.id);
          expect(infoResult.success).toBe(true);
          expect(infoResult.file).toBeDefined();
          
          if (infoResult.file) {
            expect(infoResult.file.name).toBe(newName);
            expect(infoResult.file.is_public).toBe(true);
          }
        }
        
        debug('✅ File metadata update test succeeded.');
        
      } finally {
        if (uploadedFileId) {
          await cleanupTestFiles(adminHasyx, [uploadedFileId]);
        }
        if (testUser) {
          await cleanupTestUser(adminHasyx, testUser.id);
        }
        cleanupHasyx(adminHasyx, 'Update test');
      }
    }, 15000);
  });
}); 
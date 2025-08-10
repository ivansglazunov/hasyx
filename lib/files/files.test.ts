import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { createTestUser } from '../create-test-user';
import { generateJWT } from '../jwt';

const isLocal = !!+process.env.JEST_LOCAL!;

(!isLocal ? describe : describe.skip)('Files API Integration (full cycle)', () => {
  let uploadedFileId: string | undefined;
  let testJwt: string;
  const apiUrl = process.env.API_URL || 'http://localhost:3004/api/files';

  beforeAll(async () => {
    const testUser = await createTestUser();
    const hasuraClaims = {
      'x-hasura-allowed-roles': ['storage','user', 'anonymous', 'me'],
      'x-hasura-default-role': 'storage',
      'x-hasura-user-id': testUser.id,
    };
    testJwt = await generateJWT(testUser.id, hasuraClaims);
  });

  it('should upload a file via API', async () => {
    const form = new FormData();
    const fileContent = Buffer.from('Test file content for API upload', 'utf-8');
    form.append('file', fileContent, { filename: 'test-api.txt', contentType: 'text/plain' });
    // Can add authorization if needed
    const res = await fetch(apiUrl, { method: 'POST', body: form as any, headers: { Authorization: `Bearer ${testJwt}` } });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.file).toBeDefined();
    uploadedFileId = json.file.id;
  });

  it('should download file content via API', async () => {
    expect(uploadedFileId).toBeDefined();
    const res = await fetch(`${apiUrl}/${uploadedFileId}`, { headers: { Authorization: `Bearer ${testJwt}` } });
    expect(res.status).toBe(200);
    const buffer = await res.buffer();
    expect(buffer.toString()).toBe('Test file content for API upload');
  });

  it('should delete file via API', async () => {
    expect(uploadedFileId).toBeDefined();
    const res = await fetch(`${apiUrl}/${uploadedFileId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${testJwt}` } });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('should return 404 for deleted file', async () => {
    expect(uploadedFileId).toBeDefined();
    const res = await fetch(`${apiUrl}/${uploadedFileId}`, { headers: { Authorization: `Bearer ${testJwt}` } });
    expect(res.status).toBe(404);
  });

  it('should reject invalid file type', async () => {
    const form = new FormData();
    const fileContent = Buffer.from('malware', 'utf-8');
    form.append('file', fileContent, { filename: 'test.exe', contentType: 'application/x-msdownload' });
    const res = await fetch(apiUrl, { method: 'POST', body: form as any, headers: { Authorization: `Bearer ${testJwt}` } });
    expect(res.status).not.toBe(200);
  });

  it('should reject too large file', async () => {
    const form = new FormData();
    const bigContent = Buffer.alloc(101 * 1024 * 1024, 1); // 101MB
    form.append('file', bigContent, { filename: 'big.txt', contentType: 'text/plain' });
    const res = await fetch(apiUrl, { method: 'POST', body: form as any, headers: { Authorization: `Bearer ${testJwt}` } });
    expect(res.status).not.toBe(200);
  });
}); 
# Hasyx Files Storage

Hasyx Files Storage is an integrated file management system for Hasyx projects, providing secure storage, upload, and management of files using Hasura GraphQL API and hasura-storage service.

## Overview

Hasyx Files Storage provides:
- File upload and download with Hasura permissions
- Integration with hasura-storage service
- File metadata management through GraphQL
- Role-based user permission system
- Support for public and private files
- REST API for frontend integration
- JWT-based authentication for storage operations

## Quick Start

### 1. Configure File Storage

Run the file storage configuration assistant:

```bash
npx hasyx assist
```

Or configure storage specifically:

```bash
npx hasyx assist --skip-auth --skip-repo --skip-env --skip-package --skip-init --skip-hasura --skip-secrets --skip-oauth --skip-resend --skip-vercel --skip-sync --skip-commit --skip-migrations --skip-firebase --skip-telegram --skip-project-user --skip-openrouter --skip-pg --skip-dns --skip-docker --skip-github --skip-github-webhooks
```

### 2. Apply Migrations

Apply the file database schema:

```bash
npx hasyx migrate
```

### 3. Generate Types

Generate GraphQL types for files:

```bash
npx hasyx schema
```

## Configuration

### Local Storage (MinIO)

For development or self-hosted environments:

```bash
npx hasyx assist
```

This will create:
- MinIO as S3-compatible storage
- Local bucket for files
- hasura-storage service configuration
- Workflow for local development

### Cloud Storage

Supported cloud providers:
- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- DigitalOcean Spaces
- Cloudflare R2

## Environment Variables

The file storage configuration adds these environment variables:

```env
# Storage configuration
STORAGE_BACKEND=s3
STORAGE_S3_BUCKET=default
STORAGE_S3_REGION=us-east-1
STORAGE_S3_ACCESS_KEY_ID=minioadmin
STORAGE_S3_SECRET_ACCESS_KEY=minioadmin
STORAGE_S3_ENDPOINT=http://hasyx-minio:9000
STORAGE_S3_FORCE_PATH_STYLE=true

# Hasura storage endpoint
HASURA_STORAGE_URL=http://hasura-storage:8000
NEXT_PUBLIC_HASURA_STORAGE_URL=http://localhost:3001

# JWT configuration
STORAGE_JWT_SECRET={"type":"HS256","key":"your-jwt-secret-key"}
STORAGE_JWT_EXPIRES_IN=15m
STORAGE_JWT_REFRESH_EXPIRES_IN=7d

# File settings
STORAGE_MAX_FILE_SIZE=100MB
STORAGE_ALLOWED_MIME_TYPES=image/*,application/pdf,text/*
STORAGE_ALLOWED_FILE_EXTENSIONS=jpg,jpeg,png,gif,pdf,txt,doc,docx

# Cache settings
STORAGE_CACHE_CONTROL=public, max-age=31536000
STORAGE_ETAG=true

# Image manipulation
STORAGE_IMAGE_MANIPULATION=true
STORAGE_IMAGE_MAX_WIDTH=1920
STORAGE_IMAGE_MAX_HEIGHT=1080
STORAGE_IMAGE_QUALITY=80

# Rate limiting
STORAGE_RATE_LIMIT_WINDOW=15m
STORAGE_RATE_LIMIT_MAX_REQUESTS=100

# Logging
STORAGE_LOG_LEVEL=info
STORAGE_LOG_FORMAT=json
```

## Database Schema

The file integration creates these tables:

### files
- `id` (UUID) - Primary key
- `name` (TEXT) - File name
- `bucket_id` (TEXT) - Storage bucket ID
- `mime_type` (TEXT) - File MIME type
- `size` (BIGINT) - File size in bytes
- `etag` (TEXT) - File ETag
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Update timestamp
- `is_uploaded` (BOOLEAN) - File upload status
- `uploaded_by_user_id` (UUID) - File owner user ID

## Permissions

### User Permissions
- Users can upload files to their own storage
- Users can view their own files and public files (is_uploaded = true)
- Users can update and delete their own files
- Users can access public files without authentication

### Admin Permissions
- Admins have full access to all files
- Admins can manage all file operations

## API Endpoints

### Upload File
```bash
POST /api/files
Content-Type: multipart/form-data

Headers:
Authorization: Bearer <jwt-token> (optional)
Cookie: next-auth.session-token (optional)

Body:
file: <file>
isPublic: true/false (optional)
bucket: <bucket-name> (optional)
```

### Download File
```bash
GET /api/files/[id]

Headers:
Authorization: Bearer <jwt-token> (optional)
Cookie: next-auth.session-token (optional)
```

### Delete File
```bash
DELETE /api/files/[id]

Headers:
Authorization: Bearer <jwt-token> (optional)
Cookie: next-auth.session-token (optional)
```

## Usage Examples

### Upload File
```typescript
import { uploadFile } from 'hasyx/lib/files';

const fileBuffer = Buffer.from('file content');
const result = await uploadFile(
  fileBuffer,
  'example.jpg',
  'image/jpeg',
  {
    userId: 'user123',
    isPublic: false,
    bucket: 'default'
  }
);

if (result.success) {
  console.log('File uploaded:', result.file.id);
  console.log('Presigned URL:', result.presignedUrl);
}
```

### Download File
```typescript
import { downloadFile } from 'hasyx/lib/files';

const result = await downloadFile('file-id-123', 'user123');

if (result.success) {
  console.log('File content:', result.fileContent);
  console.log('File info:', result.file);
}
```

### Delete File
```typescript
import { deleteFile } from 'hasyx/lib/files';

const result = await deleteFile('file-id-123', 'user123');

if (result.success) {
  console.log('File deleted successfully');
}
```

### Get File Info
```typescript
import { getFileInfo } from 'hasyx/lib/files';

const result = await getFileInfo('file-id-123', 'user123');

if (result.success) {
  console.log('File info:', result.file);
} else {
  console.log('Error:', result.error);
}
```

### List Files
```typescript
import { listFiles } from 'hasyx/lib/files';

const result = await listFiles('user123', {
  publicOnly: false,
  limit: 20,
  offset: 0
});

if (result.success) {
  console.log('Files:', result.files);
}
```

### Update File
```typescript
import { updateFile } from 'hasyx/lib/files';

const result = await updateFile(
  'file-id-123',
  {
    name: 'new-name.jpg',
    isUploaded: true
  },
  'user123'
);

if (result.success) {
  console.log('File updated:', result.file);
}
```

## Using REST API

### Upload File via API
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('isPublic', 'false');
formData.append('bucket', 'default');

const response = await fetch('/api/files', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-jwt-token' // optional
  },
  body: formData
});

const result = await response.json();
console.log('Upload result:', result);
```

### Download File
```javascript
const response = await fetch('/api/files/file-id-123', {
  headers: {
    'Authorization': 'Bearer your-jwt-token' // optional
  }
});

if (response.ok) {
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
```

### Delete File
```javascript
const response = await fetch('/api/files/file-id-123', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer your-jwt-token' // optional
  }
});

const result = await response.json();
if (result.success) {
  console.log('File deleted successfully');
}
```

## Authentication

The file system supports multiple authentication methods:

### JWT Token Authentication
```javascript
// Using Bearer token in Authorization header
const response = await fetch('/api/files', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  },
  body: formData
});
```

### NextAuth Session Authentication
```javascript
// Using NextAuth session cookie (automatic)
const response = await fetch('/api/files', {
  method: 'POST',
  body: formData
});
```

### Anonymous Access
Public files (is_uploaded = true) can be accessed without authentication.

## Hasura Integration

### GraphQL Queries
```graphql
# Get user files
query GetUserFiles($userId: uuid!) {
  files(where: { uploaded_by_user_id: { _eq: $userId } }) {
    id
    name
    mime_type
    size
    created_at
    is_uploaded
  }
}

# Get public files
query GetPublicFiles {
  files(where: { is_uploaded: { _eq: true } }) {
    id
    name
    mime_type
    size
    created_at
    uploaded_by_user_id
  }
}
```

### GraphQL Mutations
```graphql
# Update file metadata
mutation UpdateFile($id: uuid!, $updates: files_set_input!) {
  update_files_by_pk(
    pk_columns: { id: $id }
    _set: $updates
  ) {
    id
    name
    is_uploaded
    updated_at
  }
}

# Delete file
mutation DeleteFile($id: uuid!) {
  delete_files_by_pk(id: $id) {
    id
    name
  }
}
```

## Security

### File Validation
- MIME type validation
- File extension validation
- File size limits

### Access Control
- User permission checks
- Public/private file separation
- Unauthorized access protection
- JWT token validation

### API Security
- Input validation
- Error handling
- Operation logging
- CORS support

## Performance

### Caching
- ETag support
- Cache-Control headers
- Browser caching

### Optimization
- Direct file streaming
- Efficient storage
- CDN integration

## Monitoring

### Health Checks
```bash
# Check files API
curl http://localhost:3000/api/files

# Check hasura-storage
curl http://localhost:3001/healthz

# Check MinIO
curl http://localhost:9000/minio/health/live
```

### Logs
```bash
# Files API logs
DEBUG="hasyx:files*" npm run dev

# hasura-storage logs
docker logs hasyx-storage

# MinIO logs
docker logs hasyx-minio
```

## Troubleshooting

### Common Issues

1. **Files API not responding**
   - Check environment variables
   - Verify database connection
   - Check hasura-storage service
   - Check logs

2. **File upload fails**
   - Check hasura-storage service
   - Check file size limits
   - Validate file types
   - Check JWT token

3. **Access denied**
   - Check user authentication
   - Verify user permissions
   - Check file ownership
   - Verify JWT token

### Debug Mode
```bash
# Enable debug logging
DEBUG="hasyx:files*" npm run dev
```

## Migrations

### Apply Migrations
```bash
npx hasyx migrate
```

### Rollback Migrations
```bash
npx hasyx unmigrate
```

### Custom Migrations
```bash
# Create custom file migration
npx hasyx migrate --filter files
```

## Backup and Recovery

### Database Backup
```bash
# Backup PostgreSQL
docker exec hasyx-postgres pg_dump -U postgres hasyx > backup.sql
```

### File Backup
```bash
# Backup MinIO data
docker exec hasyx-minio mc mirror /data /backup
```

### Restore
```bash
# Restore database
docker exec -i hasyx-postgres psql -U postgres hasyx < backup.sql

# Restore files
docker exec hasyx-minio mc mirror /backup /data
```

## Development

### Local Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access MinIO console
open http://localhost:9001

# Access Hasura console
open http://localhost:8080
```

### Testing
```bash
# Test file upload
curl -X POST http://localhost:3000/api/files \
  -H "Authorization: Bearer your-jwt-token" \
  -F "file=@test.jpg"

# Test file download
curl "http://localhost:3000/api/files/file-id" \
  -H "Authorization: Bearer your-jwt-token"
```

## Production Deployment

### Environment Variables
```bash
# Production storage configuration
STORAGE_S3_BUCKET=production-files
STORAGE_S3_REGION=us-east-1
STORAGE_S3_ACCESS_KEY_ID=$PRODUCTION_ACCESS_KEY
STORAGE_S3_SECRET_ACCESS_KEY=$PRODUCTION_SECRET_KEY
```

### Security
```bash
# Use HTTPS
STORAGE_S3_ENDPOINT=https://s3.amazonaws.com

# Configure CORS
STORAGE_CORS_ORIGINS=https://yourdomain.com
```

### Monitoring
```bash
# Enable structured logging
STORAGE_LOG_FORMAT=json

# Set appropriate log level
STORAGE_LOG_LEVEL=info
``` 
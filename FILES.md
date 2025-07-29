# Hasyx Files Storage

Hasyx Files Storage is an integrated file management system for Hasyx projects, providing secure storage, upload, and management of files using Hasura GraphQL API and S3-compatible storage.

## Overview

Hasyx Files Storage provides:
- File upload and download with Hasura permissions
- S3-compatible storage (local MinIO or cloud)
- File metadata management through GraphQL
- Role-based user permission system
- Support for public and private files
- REST API for frontend integration
- Automatic ETag generation and versioning

## Quick Start

### 1. Configure File Storage

Run the file storage configuration assistant:

```bash
npx hasyx files
```

Or configure as part of the full setup:

```bash
npx hasyx assist
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
npx hasyx files --skip-cloud
```

This will create:
- MinIO as S3-compatible storage
- Local bucket for files
- Workflow for local development

### Cloud Storage

Supported cloud providers:
- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- DigitalOcean Spaces
- Cloudflare R2

```bash
npx hasyx files --skip-local
```

## Environment Variables

The file storage configuration adds these environment variables:

```env
# S3 configuration
STORAGE_S3_BUCKET=hasyx-files
STORAGE_S3_REGION=us-east-1
STORAGE_S3_ACCESS_KEY_ID=your-access-key
STORAGE_S3_SECRET_ACCESS_KEY=your-secret-key
STORAGE_S3_ENDPOINT=https://s3.amazonaws.com
STORAGE_S3_FORCE_PATH_STYLE=false

# Hasura storage endpoint
HASURA_STORAGE_URL=http://localhost:3001
NEXT_PUBLIC_HASURA_STORAGE_URL=http://localhost:3001

# File settings
STORAGE_MAX_FILE_SIZE=100MB
STORAGE_ALLOWED_MIME_TYPES=image/*,application/pdf,text/*
STORAGE_ALLOWED_FILE_EXTENSIONS=jpg,jpeg,png,gif,pdf,txt,doc,docx

# Cache settings
STORAGE_CACHE_CONTROL=public, max-age=31536000
STORAGE_ETAG=true
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
- `is_public` (BOOLEAN) - Public file flag
- `user_id` (UUID) - File owner user ID

### file_versions
- `id` (UUID) - Primary key
- `file_id` (UUID) - Reference to files table
- `version` (TEXT) - File version
- `created_at` (TIMESTAMP) - Version creation timestamp

## Permissions

### User Permissions
- Users can upload files to their own storage
- Users can view their own files and public files
- Users can update and delete their own files

### Admin Permissions
- Admins have full access to all files
- Admins can manage all file operations

## API Endpoints

### Upload File
```bash
POST /api/files
Content-Type: multipart/form-data

Headers:
x-user-id: <user-id>

Body:
file: <file>
isPublic: true/false (optional)
bucket: <bucket-name> (optional)
```

### Get File Info
```bash
GET /api/files?id=<file-id>
Headers:
x-user-id: <user-id> (optional)
```

### List Files
```bash
GET /api/files?public=true&limit=50&offset=0
Headers:
x-user-id: <user-id> (optional)
```

### Download File
```bash
PATCH /api/files?id=<file-id>
Headers:
x-user-id: <user-id> (optional)
```

### Update File
```bash
PUT /api/files?id=<file-id>
Headers:
x-user-id: <user-id>
Content-Type: application/json

Body:
{
  "name": "new-name.jpg",
  "isPublic": false
}
```

### Delete File
```bash
DELETE /api/files?id=<file-id>
Headers:
x-user-id: <user-id>
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
    bucket: 'hasyx-files'
  }
);

if (result.success) {
  console.log('File uploaded:', result.file.id);
  console.log('Presigned URL:', result.presignedUrl);
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

### Download File
```typescript
import { downloadFile } from 'hasyx/lib/files';

const result = await downloadFile('file-id-123', 'user123');

if (result.success) {
  console.log('Download URL:', result.downloadUrl);
  console.log('File info:', result.file);
}
```

### Update File
```typescript
import { updateFile } from 'hasyx/lib/files';

const result = await updateFile(
  'file-id-123',
  {
    name: 'new-name.jpg',
    is_public: true
  },
  'user123'
);

if (result.success) {
  console.log('File updated:', result.file);
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

## Using REST API

### Upload File via API
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('isPublic', 'false');

const response = await fetch('/api/files', {
  method: 'POST',
  headers: {
    'x-user-id': 'user123'
  },
  body: formData
});

const result = await response.json();
console.log('Upload result:', result);
```

### Get File List
```javascript
const response = await fetch('/api/files?public=true&limit=10', {
  headers: {
    'x-user-id': 'user123'
  }
});

const result = await response.json();
console.log('Files:', result.files);
```

### Download File
```javascript
const response = await fetch('/api/files', {
  method: 'PATCH',
  headers: {
    'x-user-id': 'user123',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ id: 'file-id-123' })
});

const result = await response.json();
if (result.success) {
  window.open(result.downloadUrl, '_blank');
}
```

## Hasura Integration

### GraphQL Queries
```graphql
# Get user files
query GetUserFiles($userId: uuid!) {
  files(where: { user_id: { _eq: $userId } }) {
    id
    name
    mime_type
    size
    created_at
    is_public
  }
}

# Get public files
query GetPublicFiles {
  files(where: { is_public: { _eq: true } }) {
    id
    name
    mime_type
    size
    created_at
    user {
      id
      name
    }
  }
}
```

### GraphQL Mutations
```graphql
# Create file record
mutation CreateFile($file: files_insert_input!) {
  insert_files_one(object: $file) {
    id
    name
    created_at
  }
}

# Update file
mutation UpdateFile($id: uuid!, $updates: files_set_input!) {
  update_files_by_pk(
    pk_columns: { id: $id }
    _set: $updates
  ) {
    id
    name
    is_public
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

### API Security
- Input validation
- Error handling
- Operation logging

## Performance

### Caching
- ETag support
- Cache-Control headers
- Browser caching

### Optimization
- File compression
- Efficient storage
- CDN integration

## Monitoring

### Health Checks
```bash
# Check files API
curl http://localhost:3000/api/files

# Check MinIO
curl http://localhost:9000/minio/health/live
```

### Logs
```bash
# Files API logs
DEBUG="hasyx:files" npm run dev

# MinIO logs
docker logs hasyx-minio
```

## Troubleshooting

### Common Issues

1. **Files API not responding**
   - Check environment variables
   - Verify database connection
   - Check logs

2. **File upload fails**
   - Check S3 credentials
   - Check file size limits
   - Validate file types

3. **Access denied**
   - Check x-user-id header
   - Verify user permissions
   - Check file ownership

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
  -H "x-user-id: test-user" \
  -F "file=@test.jpg"

# Test file download
curl "http://localhost:3000/api/files?id=file-id" \
  -H "x-user-id: test-user"
```

## Production Deployment

### Environment Variables
```bash
# Production S3 configuration
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
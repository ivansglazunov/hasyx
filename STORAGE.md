# Hasura Storage Integration

Hasyx integrates with [hasura-storage](https://github.com/nhost/hasura-storage) from Nhost to provide file storage capabilities with S3-compatible cloud storage or local MinIO storage.

## Overview

Hasura Storage provides:
- File upload and download with Hasura permissions
- S3-compatible storage backend
- Image manipulation and optimization
- Antivirus scanning (ClamAV)
- Presigned URLs for temporary access
- Caching and CDN integration
- Rate limiting and security

## Quick Start

### 1. Configure Storage

Run the storage configuration assistant:

```bash
npx hasyx storage
```

Or configure as part of the full setup:

```bash
npx hasyx assist
```

### 2. Start Services

Start the storage services using Docker Compose:

```bash
docker-compose up -d
```

### 3. Apply Migrations

Apply the storage database schema:

```bash
npx hasyx migrate
```

### 4. Generate Types

Generate GraphQL types for storage:

```bash
npx hasyx schema
```

## Configuration Options

### Local Storage (MinIO)

For development or self-hosted environments:

```bash
npx hasyx storage --skip-cloud
```

This will:
- Use MinIO as S3-compatible storage
- Create local bucket for file storage
- Enable local development workflow

### Cloud Storage

Supported cloud providers:
- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- DigitalOcean Spaces
- Cloudflare R2

```bash
npx hasyx storage --skip-local
```

### Additional Features

Skip antivirus scanning:
```bash
npx hasyx storage --skip-antivirus
```

Skip image manipulation:
```bash
npx hasyx storage --skip-image-manipulation
```

## Environment Variables

The storage configuration adds these environment variables:

```env
# Storage backend
STORAGE_BACKEND=s3

# S3 configuration
STORAGE_S3_BUCKET=hasyx-storage
STORAGE_S3_REGION=us-east-1
STORAGE_S3_ACCESS_KEY_ID=your-access-key
STORAGE_S3_SECRET_ACCESS_KEY=your-secret-key
STORAGE_S3_ENDPOINT=https://s3.amazonaws.com
STORAGE_S3_FORCE_PATH_STYLE=false

# Security
STORAGE_JWT_SECRET=your-jwt-secret
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

# Hasura storage endpoint
HASURA_STORAGE_URL=http://localhost:3001
NEXT_PUBLIC_HASURA_STORAGE_URL=http://localhost:3001

# Antivirus (optional)
STORAGE_CLAMAV_SERVER=clamav:3310
```

## Database Schema

The storage integration creates these tables:

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

### viruses
- `id` (UUID) - Primary key
- `file_id` (UUID) - Reference to infected file
- `virus_name` (TEXT) - Detected virus name
- `detected_at` (TIMESTAMP) - Virus detection timestamp

## Permissions

### User Permissions
- Users can upload files to their own storage
- Users can view their own files and public files
- Users can update and delete their own files

### Admin Permissions
- Admins have full access to all files
- Admins can view virus detection logs
- Admins can manage all storage operations

## API Endpoints

### File Upload
```bash
POST /files
Content-Type: multipart/form-data

Authorization: Bearer <jwt-token>
```

### File Download
```bash
GET /files/{file-id}
Authorization: Bearer <jwt-token>
```

### Presigned URL
```bash
POST /files/{file-id}/presigned
Authorization: Bearer <jwt-token>
```

### Image Manipulation
```bash
GET /files/{file-id}?width=800&height=600&quality=80
Authorization: Bearer <jwt-token>
```

## Usage Examples

### Upload File
```typescript
import { createApolloClient } from 'hasyx';

const client = createApolloClient({
  url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
  secret: process.env.HASURA_ADMIN_SECRET!
});

// Upload file using hasura-storage
const formData = new FormData();
formData.append('file', file);

const response = await fetch(`${process.env.HASURA_STORAGE_URL}/files`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const fileData = await response.json();
```

### Query Files
```typescript
const { data } = await client.query({
  query: gql`
    query GetFiles {
      files {
        id
        name
        mime_type
        size
        created_at
        is_public
        user {
          id
          name
        }
      }
    }
  `
});
```

### Create File Record
```typescript
const { data } = await client.mutate({
  mutation: gql`
    mutation CreateFile($file: files_insert_input!) {
      insert_files_one(object: $file) {
        id
        name
        created_at
      }
    }
  `,
  variables: {
    file: {
      name: 'example.jpg',
      bucket_id: 'hasyx-storage',
      mime_type: 'image/jpeg',
      size: 1024,
      etag: 'abc123',
      is_public: false
    }
  }
});
```

## Docker Services

The storage setup creates these Docker services:

### hasura-storage
- Main storage service
- Handles file uploads/downloads
- Integrates with Hasura for permissions
- Supports S3-compatible storage

### minio (Optional)
- Local S3-compatible storage
- Used for development
- Web console at http://localhost:9001

### clamav (Optional)
- Antivirus scanning service
- Scans uploaded files for viruses
- Integrates with hasura-storage

### postgres
- Database for file metadata
- Stores file information and permissions

### hasura
- GraphQL API for file management
- Handles permissions and relationships

## Security Features

### File Type Restrictions
- Configurable allowed MIME types
- File extension validation
- Size limits per file

### Antivirus Scanning
- ClamAV integration
- Automatic virus detection
- Quarantine infected files

### Access Control
- JWT-based authentication
- Role-based permissions
- Public/private file flags

### Rate Limiting
- Configurable request limits
- Time-based restrictions
- DDoS protection

## Performance Optimization

### Image Manipulation
- Automatic image resizing
- Quality optimization
- Format conversion
- Thumbnail generation

### Caching
- ETag support
- Cache control headers
- CDN integration
- Browser caching

### Compression
- Gzip compression
- Image optimization
- Efficient storage

## Monitoring

### Health Checks
```bash
# Check storage service
curl http://localhost:3001/healthz

# Check MinIO
curl http://localhost:9000/minio/health/live

# Check ClamAV
docker exec hasyx-clamav clamdscan --version
```

### Logs
```bash
# Storage service logs
docker logs hasyx-storage

# MinIO logs
docker logs hasyx-minio

# ClamAV logs
docker logs hasyx-clamav
```

## Troubleshooting

### Common Issues

1. **Storage service not starting**
   - Check environment variables
   - Verify database connection
   - Check Docker logs

2. **File upload fails**
   - Verify S3 credentials
   - Check file size limits
   - Validate file types

3. **Permission denied**
   - Check JWT token
   - Verify user permissions
   - Check file ownership

4. **Antivirus not working**
   - Check ClamAV service
   - Verify virus database
   - Check network connectivity

### Debug Mode
```bash
# Enable debug logging
STORAGE_LOG_LEVEL=debug docker-compose up
```

## Migration

### Up Migration
```bash
npx hasyx migrate
```

### Down Migration
```bash
npx hasyx unmigrate
```

### Custom Migration
```bash
# Create custom storage migration
npx hasyx migrate --filter storage
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
curl -X POST http://localhost:3001/files \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.jpg"

# Test file download
curl http://localhost:3001/files/$FILE_ID \
  -H "Authorization: Bearer $TOKEN"
```

## Production Deployment

### Environment Variables
```bash
# Production S3 configuration
STORAGE_S3_BUCKET=production-storage
STORAGE_S3_REGION=us-east-1
STORAGE_S3_ACCESS_KEY_ID=$PRODUCTION_ACCESS_KEY
STORAGE_S3_SECRET_ACCESS_KEY=$PRODUCTION_SECRET_KEY
```

### Security
```bash
# Use strong JWT secrets
STORAGE_JWT_SECRET=$STRONG_SECRET

# Enable HTTPS
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

# Configure metrics
STORAGE_METRICS_ENABLED=true
``` 
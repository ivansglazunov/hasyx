import { createRlInterface } from './assist-common';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import Debug from './debug';

const debug = Debug('assist:storage');

export interface StorageConfig {
  provider: 'aws' | 'gcp' | 'azure' | 'digitalocean' | 'cloudflare' | 'minio' | 'local';
  bucket: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
  forcePathStyle?: boolean;
  useLocal: boolean;
  useAntivirus?: boolean;
  useImageManipulation?: boolean;
}

export interface StorageSetupOptions {
  skipStorage?: boolean;
  skipLocal?: boolean;
  skipCloud?: boolean;
  skipAntivirus?: boolean;
  skipImageManipulation?: boolean;
}

/**
 * Configure storage settings for hasura-storage
 */
export async function configureStorage(
  rl: any,
  envPath: string,
  options: StorageSetupOptions = {}
): Promise<boolean> {
  debug('Starting storage configuration...');
  
  console.log('\n📦 Storage Configuration');
  console.log('='.repeat(50));
  
  if (options.skipStorage) {
    console.log('⏩ Skipping storage configuration as requested');
    return true;
  }

  try {
    // Check if .env file exists
    const envExists = await fs.pathExists(envPath);
    if (!envExists) {
      console.error('❌ .env file not found. Please run environment setup first.');
      return false;
    }

    // Load current environment
    const envResult = dotenv.config({ path: envPath });
    if (envResult.error) {
      console.error('❌ Failed to load .env file:', envResult.error);
      return false;
    }

    // Ask about storage setup
    const setupStorage = await askYesNo(
      rl,
      'Would you like to configure file storage for your Hasura project?',
      false
    );

    if (!setupStorage) {
      console.log('⏩ Skipping storage configuration');
      return true;
    }

    // Choose between local and cloud storage
    const useLocal = !options.skipLocal && await askYesNo(
      rl,
      'Would you like to use local storage (MinIO) instead of cloud storage?',
      true
    );

    let config: StorageConfig;

    if (useLocal) {
      config = await configureLocalStorage(rl);
    } else {
      config = await configureCloudStorage(rl, options);
    }

    // Configure additional features
    if (!options.skipAntivirus) {
      const useAntivirus = await askYesNo(
        rl,
        'Would you like to enable antivirus scanning for uploaded files? (ClamAV)',
        false
      );
      config.useAntivirus = useAntivirus;
    }

    if (!options.skipImageManipulation) {
      const useImageManipulation = await askYesNo(
        rl,
        'Would you like to enable automatic image optimization?',
        true
      );
      config.useImageManipulation = useImageManipulation;
    }

    // Update environment variables
    await updateEnvironmentVariables(envPath, config);

    // Create docker-compose.yml if it doesn't exist
    await createDockerCompose();

    // Create storage migration files
    await createStorageMigrationFiles();

    console.log('\n✅ Storage configuration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Review the generated docker-compose.yml file');
    console.log('   2. Update your .env file with the correct credentials');
    console.log('   3. Run: docker-compose up -d');
    console.log('   4. Run: npx hasyx migrate');
    console.log('   5. Run: npx hasyx schema');

    return true;
  } catch (error) {
    console.error('❌ Storage configuration failed:', error);
    debug('Storage configuration error:', error);
    return false;
  }
}

/**
 * Configure local storage using MinIO
 */
async function configureLocalStorage(rl: any): Promise<StorageConfig> {
  console.log('\n🏠 Local Storage Configuration (MinIO)');
  console.log('-'.repeat(40));

  const bucket = await askQuestion(
    rl,
    'Enter bucket name for local storage:',
    'hasyx-storage'
  );

  return {
    provider: 'minio',
    bucket,
    useLocal: true,
    endpoint: 'http://minio:9000',
    forcePathStyle: true,
    accessKeyId: 'minioadmin',
    secretAccessKey: 'minioadmin'
  };
}

/**
 * Configure cloud storage
 */
async function configureCloudStorage(rl: any, options: StorageSetupOptions): Promise<StorageConfig> {
  console.log('\n☁️ Cloud Storage Configuration');
  console.log('-'.repeat(40));

  const providers = [
    { 
      name: 'AWS S3', 
      value: 'aws',
      docsLink: 'https://console.aws.amazon.com/iam/',
      instructions: '1. Go to AWS IAM Console\n2. Create a new user or use existing one\n3. Attach "AmazonS3FullAccess" policy or create custom policy\n4. Create Access Key and Secret Access Key\n5. Create S3 bucket in your chosen region'
    },
    { 
      name: 'Google Cloud Storage', 
      value: 'gcp',
      docsLink: 'https://console.cloud.google.com/iam-admin/serviceaccounts',
      instructions: '1. Go to Google Cloud Console\n2. Create a new project or select existing\n3. Enable Cloud Storage API\n4. Create Service Account with "Storage Admin" role\n5. Create and download JSON key file\n6. Create bucket in your chosen region\n\nNote: For GCP, you\'ll need to extract Access Key ID and Secret from the JSON key file. The Access Key ID is the "client_email" field, and the Secret is the "private_key" field.'
    },
    { 
      name: 'Azure Blob Storage', 
      value: 'azure',
      docsLink: 'https://portal.azure.com/#blade/Microsoft_Azure_Storage/Blade',
      instructions: '1. Go to Azure Portal\n2. Create Storage Account\n3. Create Container (bucket)\n4. Go to "Access keys" section\n5. Copy Storage Account Name and Key\n\nNote: For Azure, the Access Key ID is the Storage Account Name, and the Secret Access Key is one of the two access keys.'
    },
    { 
      name: 'DigitalOcean Spaces', 
      value: 'digitalocean',
      docsLink: 'https://cloud.digitalocean.com/spaces',
      instructions: '1. Go to DigitalOcean Cloud Console\n2. Navigate to Spaces section\n3. Create a new Space (bucket)\n4. Go to API section\n5. Generate Spaces Access Key and Secret\n\nNote: For DigitalOcean Spaces, the region should be in format like "nyc3", "sfo3", "fra1", etc. The endpoint will be automatically configured based on your region.'
    },
    { 
      name: 'Cloudflare R2', 
      value: 'cloudflare',
      docsLink: 'https://dash.cloudflare.com/r2/overview',
      instructions: '1. Go to Cloudflare Dashboard\n2. Navigate to R2 Object Storage\n3. Create a new bucket\n4. Go to "Manage R2 API tokens"\n5. Create API token with "Object Read & Write" permissions\n\nNote: For Cloudflare R2, you\'ll need to use your Account ID as the Access Key ID and the API Token as the Secret Access Key. The endpoint will be automatically configured.'
    }
  ];

  console.log('Available cloud storage providers:');
  providers.forEach((provider, index) => {
    console.log(`  ${index + 1}. ${provider.name}`);
  });

  const providerChoice = await askQuestion(
    rl,
    'Select cloud storage provider (1-5):',
    '1'
  );

  const providerIndex = parseInt(providerChoice) - 1;
  const selectedProvider = providers[providerIndex] || providers[0];

  console.log(`\n📋 Setting up ${selectedProvider.name}...`);
  console.log(`📖 Documentation: ${selectedProvider.docsLink}`);
  console.log(`📝 Instructions:`);
  console.log(selectedProvider.instructions);
  console.log('\nPress Enter when you have your credentials ready...');
  await new Promise(resolve => rl.question('', resolve));

  const bucket = await askQuestion(
    rl,
    'Enter bucket name:',
    'hasyx-storage'
  );

  const region = await askQuestion(
    rl,
    'Enter region (e.g., us-east-1):',
    'us-east-1'
  );

  const accessKeyId = await askQuestion(
    rl,
    'Enter access key ID:',
    ''
  );

  const secretAccessKey = await askQuestion(
    rl,
    'Enter secret access key:',
    ''
  );

  let endpoint = '';
  let forcePathStyle = false;

  switch (selectedProvider.value) {
    case 'aws':
      endpoint = 'https://s3.amazonaws.com';
      break;
    case 'gcp':
      endpoint = 'https://storage.googleapis.com';
      break;
    case 'azure':
      endpoint = 'https://blob.core.windows.net';
      break;
    case 'digitalocean':
      endpoint = 'https://{region}.digitaloceanspaces.com';
      forcePathStyle = true;
      break;
    case 'cloudflare':
      endpoint = 'https://{account-id}.r2.cloudflarestorage.com';
      forcePathStyle = true;
      break;
  }

  return {
    provider: selectedProvider.value as 'aws' | 'gcp' | 'azure' | 'digitalocean' | 'cloudflare',
    bucket,
    region,
    accessKeyId,
    secretAccessKey,
    endpoint,
    forcePathStyle,
    useLocal: false
  };
}

/**
 * Update environment variables for storage configuration
 */
async function updateEnvironmentVariables(envPath: string, config: StorageConfig): Promise<void> {
  debug('Updating environment variables for storage configuration');

  const envContent = await fs.readFile(envPath, 'utf-8');
  const envLines = envContent.split('\n');

  const storageVars = {
    // Storage backend
    'STORAGE_BACKEND': 's3',
    
    // S3 configuration
    'STORAGE_S3_BUCKET': config.bucket,
    'STORAGE_S3_REGION': config.region || 'us-east-1',
    'STORAGE_S3_ACCESS_KEY_ID': config.accessKeyId || '',
    'STORAGE_S3_SECRET_ACCESS_KEY': config.secretAccessKey || '',
    'STORAGE_S3_ENDPOINT': config.endpoint || 'https://s3.amazonaws.com',
    'STORAGE_S3_FORCE_PATH_STYLE': config.forcePathStyle ? 'true' : 'false',
    
    // Security
    'STORAGE_JWT_SECRET': process.env.HASURA_GRAPHQL_JWT_SECRET || 'your-jwt-secret-key',
    'STORAGE_JWT_EXPIRES_IN': '15m',
    'STORAGE_JWT_REFRESH_EXPIRES_IN': '7d',
    
    // File settings
    'STORAGE_MAX_FILE_SIZE': '100MB',
    'STORAGE_ALLOWED_MIME_TYPES': 'image/*,application/pdf,text/*',
    'STORAGE_ALLOWED_FILE_EXTENSIONS': 'jpg,jpeg,png,gif,pdf,txt,doc,docx',
    
    // Cache settings
    'STORAGE_CACHE_CONTROL': 'public, max-age=31536000',
    'STORAGE_ETAG': 'true',
    
    // Image manipulation
    'STORAGE_IMAGE_MANIPULATION': 'true',
    'STORAGE_IMAGE_MAX_WIDTH': '1920',
    'STORAGE_IMAGE_MAX_HEIGHT': '1080',
    'STORAGE_IMAGE_QUALITY': '80',
    
    // Rate limiting
    'STORAGE_RATE_LIMIT_WINDOW': '15m',
    'STORAGE_RATE_LIMIT_MAX_REQUESTS': '100',
    
    // Logging
    'STORAGE_LOG_LEVEL': 'info',
    'STORAGE_LOG_FORMAT': 'json',
    
    // Hasura storage endpoint
    'HASURA_STORAGE_URL': 'http://localhost:3001',
    'NEXT_PUBLIC_HASURA_STORAGE_URL': 'http://localhost:3001'
  };

  // Add or update environment variables
  for (const [key, value] of Object.entries(storageVars)) {
    const existingIndex = envLines.findIndex(line => line.startsWith(`${key}=`));
    if (existingIndex >= 0) {
      envLines[existingIndex] = `${key}=${value}`;
    } else {
      envLines.push(`${key}=${value}`);
    }
  }

  // Add antivirus configuration if enabled
  if (config.useAntivirus) {
    const clamavIndex = envLines.findIndex(line => line.startsWith('STORAGE_CLAMAV_SERVER='));
    if (clamavIndex >= 0) {
      envLines[clamavIndex] = 'STORAGE_CLAMAV_SERVER=clamav:3310';
    } else {
      envLines.push('STORAGE_CLAMAV_SERVER=clamav:3310');
    }
  }

  await fs.writeFile(envPath, envLines.join('\n'));
  console.log('✅ Environment variables updated');
}

/**
 * Create docker-compose.yml file
 */
async function createDockerCompose(): Promise<void> {
  debug('Creating docker-compose.yml file');

  const dockerComposePath = path.join(process.cwd(), 'docker-compose.yml');
  const exists = await fs.pathExists(dockerComposePath);

  if (exists) {
    console.log('⏩ docker-compose.yml already exists, skipping creation');
    return;
  }

  const dockerComposeContent = `version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15
    container_name: hasyx-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: hasyx
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_HOST_AUTH_METHOD: trust
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - hasyx-network

  # Hasura GraphQL Engine
  hasura:
    image: hasura/graphql-engine:v2.35.4
    container_name: hasyx-hasura
    restart: unless-stopped
    environment:
      HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgrespassword@postgres:5432/hasyx
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
      HASURA_GRAPHQL_DEV_MODE: "true"
      HASURA_GRAPHQL_ENABLED_LOG_TYPES: startup, http-log, webhook-log, websocket-log, query-log
      HASURA_GRAPHQL_ADMIN_SECRET: myadminsecretkey
      HASURA_GRAPHQL_JWT_SECRET: '{"type":"HS256", "key":"your-jwt-secret-key"}'
      HASURA_GRAPHQL_UNAUTHORIZED_ROLE: anonymous
      HASURA_GRAPHQL_ENABLE_TELEMETRY: "false"
      HASURA_GRAPHQL_ENABLE_ALLOWLIST: "false"
      HASURA_GRAPHQL_ENABLE_REMOTE_SCHEMA_PERMISSIONS: "true"
      HASURA_GRAPHQL_ENABLE_METADATA_CONSISTENCY_CHECK: "true"
      HASURA_GRAPHQL_METADATA_DATABASE_URL: postgres://postgres:postgrespassword@postgres:5432/hasyx
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - hasyx-network

  # Hasura Storage Service
  hasura-storage:
    image: nhost/hasura-storage:0.1.5
    container_name: hasyx-storage
    restart: unless-stopped
    environment:
      # Database configuration
      DATABASE_URL: postgres://postgres:postgrespassword@postgres:5432/hasyx
      
      # Hasura configuration
      HASURA_GRAPHQL_ENDPOINT: http://hasura:8080/v1/graphql
      HASURA_GRAPHQL_ADMIN_SECRET: myadminsecretkey
      
      # Storage configuration (S3-compatible)
      STORAGE_BACKEND: s3
      STORAGE_S3_BUCKET: \${STORAGE_S3_BUCKET}
      STORAGE_S3_REGION: \${STORAGE_S3_REGION}
      STORAGE_S3_ACCESS_KEY_ID: \${STORAGE_S3_ACCESS_KEY_ID}
      STORAGE_S3_SECRET_ACCESS_KEY: \${STORAGE_S3_SECRET_ACCESS_KEY}
      STORAGE_S3_ENDPOINT: \${STORAGE_S3_ENDPOINT}
      STORAGE_S3_FORCE_PATH_STYLE: \${STORAGE_S3_FORCE_PATH_STYLE}
      
      # Security settings
      STORAGE_JWT_SECRET: \${STORAGE_JWT_SECRET}
      STORAGE_JWT_EXPIRES_IN: \${STORAGE_JWT_EXPIRES_IN}
      STORAGE_JWT_REFRESH_EXPIRES_IN: \${STORAGE_JWT_REFRESH_EXPIRES_IN}
      
      # File settings
      STORAGE_MAX_FILE_SIZE: \${STORAGE_MAX_FILE_SIZE}
      STORAGE_ALLOWED_MIME_TYPES: \${STORAGE_ALLOWED_MIME_TYPES}
      STORAGE_ALLOWED_FILE_EXTENSIONS: \${STORAGE_ALLOWED_FILE_EXTENSIONS}
      
      # Cache settings
      STORAGE_CACHE_CONTROL: \${STORAGE_CACHE_CONTROL}
      STORAGE_ETAG: \${STORAGE_ETAG}
      
      # Image manipulation
      STORAGE_IMAGE_MANIPULATION: \${STORAGE_IMAGE_MANIPULATION}
      STORAGE_IMAGE_MAX_WIDTH: \${STORAGE_IMAGE_MAX_WIDTH}
      STORAGE_IMAGE_MAX_HEIGHT: \${STORAGE_IMAGE_MAX_HEIGHT}
      STORAGE_IMAGE_QUALITY: \${STORAGE_IMAGE_QUALITY}
      
      # Antivirus (optional)
      STORAGE_CLAMAV_SERVER: \${STORAGE_CLAMAV_SERVER:-}
      
      # Rate limiting
      STORAGE_RATE_LIMIT_WINDOW: \${STORAGE_RATE_LIMIT_WINDOW}
      STORAGE_RATE_LIMIT_MAX_REQUESTS: \${STORAGE_RATE_LIMIT_MAX_REQUESTS}
      
      # Logging
      STORAGE_LOG_LEVEL: \${STORAGE_LOG_LEVEL}
      STORAGE_LOG_FORMAT: \${STORAGE_LOG_FORMAT}
      
    ports:
      - "3001:3000"
    depends_on:
      postgres:
        condition: service_healthy
      hasura:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - hasyx-network

  # Optional: MinIO for local S3-compatible storage
  minio:
    image: minio/minio:latest
    container_name: hasyx-minio
    restart: unless-stopped
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3
    networks:
      - hasyx-network

  # Optional: ClamAV for virus scanning
  clamav:
    image: clamav/clamav:latest
    container_name: hasyx-clamav
    restart: unless-stopped
    volumes:
      - clamav_data:/var/lib/clamav
    ports:
      - "3310:3310"
    healthcheck:
      test: ["CMD", "clamdscan", "--version"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - hasyx-network

volumes:
  postgres_data:
    driver: local
  minio_data:
    driver: local
  clamav_data:
    driver: local

networks:
  hasyx-network:
    driver: bridge
`;

  await fs.writeFile(dockerComposePath, dockerComposeContent);
  console.log('✅ docker-compose.yml created');
}

/**
 * Create storage migration files
 */
async function createStorageMigrationFiles(): Promise<void> {
  debug('Creating storage migration files');

  const migrationsDir = path.join(process.cwd(), 'migrations');
  await fs.ensureDir(migrationsDir);

  // Check if migration already exists
  const existingMigration = '1753814873376-hasyx-files';
  const migrationDir = path.join(migrationsDir, existingMigration);
  
  if (await fs.pathExists(migrationDir)) {
    console.log('⏩ Storage migration already exists, skipping creation');
    return;
  }

  await fs.ensureDir(migrationDir);

  const upContent = `import dotenv from 'dotenv';
import { up } from 'hasyx/lib/up-storage';

// Load environment variables from root .env file
dotenv.config();

// Run the migration
up();
`;

  const downContent = `import dotenv from 'dotenv';
import { down } from 'hasyx/lib/down-storage';

// Load environment variables from root .env file
dotenv.config();

// Run the migration
down();
`;

  await fs.writeFile(path.join(migrationDir, 'up.ts'), upContent);
  await fs.writeFile(path.join(migrationDir, 'down.ts'), downContent);
  
  console.log('✅ Storage migration files created');
}

/**
 * Helper function to ask yes/no questions
 */
async function askYesNo(rl: any, question: string, defaultValue: boolean): Promise<boolean> {
  const defaultText = defaultValue ? 'Y/n' : 'y/N';
  const answer = await new Promise<string>((resolve) => {
    rl.question(`${question} (${defaultText}): `, resolve);
  });
  
  if (answer.trim() === '') {
    return defaultValue;
  }
  
  return answer.toLowerCase().startsWith('y');
}

/**
 * Helper function to ask questions
 */
async function askQuestion(rl: any, question: string, defaultValue: string = ''): Promise<string> {
  const answer = await new Promise<string>((resolve) => {
    rl.question(`${question}${defaultValue ? ` (${defaultValue})` : ''}: `, resolve);
  });
  
  return answer.trim() || defaultValue;
} 
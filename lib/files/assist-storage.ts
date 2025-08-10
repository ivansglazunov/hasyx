import { createRlInterface } from '../assist-common';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import Debug from '../debug';

// Load environment variables
dotenv.config();

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
    'default'
  );

  return {
    provider: 'minio',
    bucket,
    useLocal: true,
    endpoint: 'http://hasyx-minio:9000',
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
      instructions: '1. Go to Cloudflare Dashboard\n2. Navigate to R2 Object Storage\n3. Create a new bucket\n4. Go to "Manage R2 API tokens"\n5. Create API token with "Object Read & Write" permissions\n6. Copy your Account ID (found in dashboard right sidebar)\n7. Copy the API Token you just created\n\nNote: For Cloudflare R2:\n- Access Key ID = Your Cloudflare Account ID\n- Secret Access Key = Your R2 API Token\n- Endpoint will be automatically configured with your Account ID'
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
    'default'
  );

  const region = await askQuestion(
    rl,
    'Enter region (e.g., us-east-1):',
    'us-east-1'
  );

  let accessKeyIdPrompt = 'Enter access key ID:';
  let secretAccessKeyPrompt = 'Enter secret access key:';
  
  // Customize prompts for Cloudflare R2
  if (selectedProvider.value === 'cloudflare') {
    accessKeyIdPrompt = 'Enter your Cloudflare Account ID:';
    secretAccessKeyPrompt = 'Enter your Cloudflare R2 API Token:';
  }

  const accessKeyId = await askQuestion(
    rl,
    accessKeyIdPrompt,
    ''
  );

  const secretAccessKey = await askQuestion(
    rl,
    secretAccessKeyPrompt,
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
      endpoint = `https://${region}.digitaloceanspaces.com`;
      forcePathStyle = true;
      break;
    case 'cloudflare':
      endpoint = `https://${accessKeyId}.r2.cloudflarestorage.com`;
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
    'STORAGE_S3_ACCESS_KEY_ID': config.accessKeyId || 'minioadmin',
    'STORAGE_S3_SECRET_ACCESS_KEY': config.secretAccessKey || 'minioadmin',
    'STORAGE_S3_ENDPOINT': config.endpoint || 'http://hasyx-minio:9000',
    'STORAGE_S3_FORCE_PATH_STYLE': config.forcePathStyle ? 'true' : 'false',
    
    // Security
    'STORAGE_JWT_SECRET': process.env.STORAGE_JWT_SECRET || '{"type":"HS256","key":"your-jwt-secret-key"}',
    'STORAGE_JWT_EXPIRES_IN': process.env.STORAGE_JWT_EXPIRES_IN || '15m',
    'STORAGE_JWT_REFRESH_EXPIRES_IN': process.env.STORAGE_JWT_REFRESH_EXPIRES_IN || '7d',
    
    // File settings
    'STORAGE_MAX_FILE_SIZE': process.env.STORAGE_MAX_FILE_SIZE || '100MB',
    'STORAGE_ALLOWED_MIME_TYPES': process.env.STORAGE_ALLOWED_MIME_TYPES || 'image/*,application/pdf,text/*',
    'STORAGE_ALLOWED_FILE_EXTENSIONS': process.env.STORAGE_ALLOWED_FILE_EXTENSIONS || 'jpg,jpeg,png,gif,pdf,txt,doc,docx',
    
    // Cache settings
    'STORAGE_CACHE_CONTROL': process.env.STORAGE_CACHE_CONTROL || 'public, max-age=31536000',
    'STORAGE_ETAG': 'true',
    
    // Image manipulation
    'STORAGE_IMAGE_MANIPULATION': 'true',
    'STORAGE_IMAGE_MAX_WIDTH': process.env.STORAGE_IMAGE_MAX_WIDTH || '1920',
    'STORAGE_IMAGE_MAX_HEIGHT': process.env.STORAGE_IMAGE_MAX_HEIGHT || '1080',
    'STORAGE_IMAGE_QUALITY': process.env.STORAGE_IMAGE_QUALITY || '80',
    
    // Rate limiting
    'STORAGE_RATE_LIMIT_WINDOW': process.env.STORAGE_RATE_LIMIT_WINDOW || '15m',
    'STORAGE_RATE_LIMIT_MAX_REQUESTS': process.env.STORAGE_RATE_LIMIT_MAX_REQUESTS || '100',
    
    // Logging
    'STORAGE_LOG_LEVEL': process.env.STORAGE_LOG_LEVEL || 'info',
    'STORAGE_LOG_FORMAT': 'json',
    
    // Hasura storage endpoint
    'HASURA_STORAGE_URL': process.env.HASURA_STORAGE_URL || 'http://hasura-storage:8000',
    'NEXT_PUBLIC_HASURA_STORAGE_URL': process.env.NEXT_PUBLIC_HASURA_STORAGE_URL || 'http://localhost:3001'
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
 * Get package name from package.json in current directory
 */
async function getPackageName(): Promise<string> {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    return packageJson.name || 'hasyx';
  } catch (error) {
    debug('Failed to read package.json:', error);
    return 'hasyx';
  }
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

  // Get package name from package.json
  const packageName = await getPackageName();
  const dockerUsername = process.env.DOCKER_USERNAME || 'ivansglazunov';

  const dockerComposeContent = `version: "3.8"
services:
  postgres:
    image: postgres:15
    container_name: hasura-postgres-1
    restart: always
    volumes:
      - db_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_DB: hasyx
    healthcheck:
      test:
        - CMD-SHELL
        - pg_isready -U postgres
      interval: 10s
      timeout: 5s
      retries: 5
  graphql-engine:
    image: hasura/graphql-engine:v2.46.0
    container_name: hasura-graphql-engine-1
    ports:
      - 8080:8080
    restart: always
    environment:
      HASURA_GRAPHQL_METADATA_DATABASE_URL: postgres://postgres:postgrespassword@postgres:5432/hasyx
      HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:postgrespassword@postgres:5432/hasyx
      PG_DATABASE_URL: postgres://postgres:postgrespassword@postgres:5432/hasyx
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
      HASURA_GRAPHQL_DEV_MODE: "true"
      HASURA_GRAPHQL_ENABLED_LOG_TYPES: startup, http-log, webhook-log, websocket-log, query-log
      HASURA_GRAPHQL_JWT_SECRET: '${process.env.HASURA_JWT_SECRET || '{"type":"HS256","key":"your-jwt-secret-key"}'}'
      HASURA_GRAPHQL_UNAUTHORIZED_ROLE: anonymous
      HASURA_EVENT_SECRET: ${process.env.HASURA_EVENT_SECRET || 'your-event-secret'}
      HASURA_GRAPHQL_ADMIN_SECRET: ${process.env.HASURA_ADMIN_SECRET || 'myadminsecretkey'}
      HASURA_GRAPHQL_METADATA_DEFAULTS: '{"backend_configs":{"dataconnector":{"athena":{"uri":"http://data-connector-agent:8081/api/v1/athena"},"mariadb":{"uri":"http://data-connector-agent:8081/api/v1/mariadb"},"mysql8":{"uri":"http://data-connector-agent:8081/api/v1/mysql"},"oracle":{"uri":"http://data-connector-agent:8081/api/v1/oracle"},"snowflake":{"uri":"http://data-connector-agent:8081/api/v1/snowflake"}}}}'
    depends_on:
      postgres:
        condition: service_healthy
      data-connector-agent:
        condition: service_healthy
    healthcheck:
      test:
        - CMD
        - curl
        - -f
        - http://localhost:8080/healthz
      interval: 30s
      timeout: 10s
      retries: 3
  data-connector-agent:
    image: hasura/graphql-data-connector:v2.46.0
    container_name: hasura-data-connector-agent-1
    restart: always
    ports:
      - 8081:8081
    environment:
      QUARKUS_LOG_LEVEL: ERROR
      QUARKUS_OPENTELEMETRY_ENABLED: "false"
    healthcheck:
      test:
        - CMD
        - curl
        - -f
        - http://localhost:8081/api/v1/athena/health
      interval: 5s
      timeout: 10s
      retries: 5
      start_period: 5s
  hasura-storage:
    image: nhost/hasura-storage:0.6.1
    container_name: hasyx-storage
    restart: unless-stopped
    command: serve
    environment:
      PORT: "8000"
      DEBUG: "*"
      LOG_LEVEL: "debug"
      GIN_MODE: "debug"
      AWS_SDK_LOAD_CONFIG: "1"
      AWS_LOG_LEVEL: "debug"
      HASURA_ENDPOINT: "http://graphql-engine:8080/v1"
      HASURA_GRAPHQL_ADMIN_SECRET: "${process.env.HASURA_ADMIN_SECRET || 'myadminsecretkey'}"
      S3_ENDPOINT: "${process.env.STORAGE_S3_ENDPOINT || 'http://hasyx-minio:9000'}"
      S3_ACCESS_KEY: "${process.env.STORAGE_S3_ACCESS_KEY_ID || 'minioadmin'}"
      S3_SECRET_KEY: "${process.env.STORAGE_S3_SECRET_ACCESS_KEY || 'minioadmin'}"
      S3_BUCKET: "${process.env.STORAGE_S3_BUCKET || 'default'}"
      S3_ROOT_FOLDER: "f215cf48-7458-4596-9aa5-2159fc6a3caf"
      POSTGRES_MIGRATIONS: "0"
      HASURA_METADATA: "1"
      POSTGRES_MIGRATIONS_SOURCE: "postgres://postgres:postgrespassword@postgres:5432/hasyx?sslmode=disable"
      DATABASE_URL: "postgres://postgres:postgrespassword@postgres:5432/hasyx?sslmode=disable"
      GRAPHQL_ENGINE_BASE_URL: "http://graphql-engine:8080/v1"
      GRAPHQL_ENDPOINT: "http://graphql-engine:8080/v1"
      JWT_SECRET: '${process.env.STORAGE_JWT_SECRET || '{"type":"HS256","key":"your-jwt-secret-key"}'}'
    ports:
      - 3001:8000
    volumes:
      - ./storage:/storage
    healthcheck:
      test:
        - CMD
        - curl
        - -f
        - http://localhost:8000/healthz
      interval: 30s
      timeout: 10s
      retries: 3
    depends_on:
      postgres:
        condition: service_healthy
      graphql-engine:
        condition: service_healthy
      minio:
        condition: service_healthy
  hasyx:
    image: ${dockerUsername}/${packageName}:latest
    container_name: hasyx-app
    restart: unless-stopped
    ports:
      - ${process.env.PORT || '3000'}:${process.env.PORT || '3000'}
    env_file:
      - .env
    command: npm run dev
    environment:
      TEST_TOKEN: ${process.env.TEST_TOKEN || 'your-test-token'}
      NEXT_PUBLIC_HASURA_GRAPHQL_URL: ${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'http://localhost:8080/v1/graphql'}
      HASURA_ADMIN_SECRET: ${process.env.HASURA_ADMIN_SECRET || 'myadminsecretkey'}
      HASURA_JWT_SECRET: '${process.env.HASURA_JWT_SECRET || '{"type":"HS256","key":"your-jwt-secret-key"}'}'
      HASURA_EVENT_SECRET: ${process.env.HASURA_EVENT_SECRET || 'your-event-secret'}
      NEXT_PUBLIC_MAIN_URL: ${process.env.NEXT_PUBLIC_MAIN_URL || 'http://localhost:3000'}
      NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}
      NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}
      NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}
      NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET || 'your-nextauth-secret'}
      GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID || ''}
      GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET || ''}
      YANDEX_CLIENT_ID: ${process.env.YANDEX_CLIENT_ID || ''}
      YANDEX_CLIENT_SECRET: ${process.env.YANDEX_CLIENT_SECRET || ''}
      RESEND_API_KEY: ${process.env.RESEND_API_KEY || ''}
      NODE_ENV: ${process.env.NODE_ENV || 'development'}
      NEXT_PUBLIC_BUILD_TARGET: ${process.env.NEXT_PUBLIC_BUILD_TARGET || 'server'}
      NEXT_PUBLIC_WS: ${process.env.NEXT_PUBLIC_WS || '1'}
      NEXTAUTH_DEBUG: ${process.env.NEXTAUTH_DEBUG || 'true'}
      GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS || ''}
      NEXT_PUBLIC_FIREBASE_API_KEY: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''}
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || ''}
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''}
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || ''}
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || ''}
      NEXT_PUBLIC_FIREBASE_APP_ID: ${process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''}
      NEXT_PUBLIC_FIREBASE_VAPID_KEY: ${process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || ''}
      VERCEL_URL: ${process.env.VERCEL_URL || ''}
      TELEGRAM_BOT_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN || ''}
      NEXT_PUBLIC_PROJECT_USER_ID: ${process.env.NEXT_PUBLIC_PROJECT_USER_ID || ''}
      NEXT_PUBLIC_APP_NAME: ${process.env.NEXT_PUBLIC_APP_NAME || 'hasyx'}
      GITHUB_ID: ${process.env.GITHUB_ID || ''}
      GITHUB_SECRET: ${process.env.GITHUB_SECRET || ''}
      FACEBOOK_CLIENT_ID: ${process.env.FACEBOOK_CLIENT_ID || ''}
      FACEBOOK_CLIENT_SECRET: ${process.env.FACEBOOK_CLIENT_SECRET || ''}
      VK_CLIENT_ID: ${process.env.VK_CLIENT_ID || ''}
      VK_CLIENT_SECRET: ${process.env.VK_CLIENT_SECRET || ''}
      VERCEL_TOKEN: ${process.env.VERCEL_TOKEN || ''}
      TELEGRAM_BOT_NAME: ${process.env.TELEGRAM_BOT_NAME || ''}
      TELEGRAM_CHANNEL_ID: "${process.env.TELEGRAM_CHANNEL_ID || ''}"
      TBANK_PROD_TERMINAL_KEY: ${process.env.TBANK_PROD_TERMINAL_KEY || ''}
      TBANK_PROD_SECRET_KEY: ${process.env.TBANK_PROD_SECRET_KEY || ''}
      TBANK_TEST_TERMINAL_KEY: ${process.env.TBANK_TEST_TERMINAL_KEY || ''}
      TBANK_TEST_SECRET_KEY: ${process.env.TBANK_TEST_SECRET_KEY || ''}
      TBANK_USE_TEST_MODE: ${process.env.TBANK_USE_TEST_MODE || '1'}
      TBANK_DEFAULT_RETURN_URL: ${process.env.TBANK_DEFAULT_RETURN_URL || ''}
      TBANK_DEFAULT_WEBHOOK_URL: ${process.env.TBANK_DEFAULT_WEBHOOK_URL || ''}
      TBANK_DEFAULT_CARD_WEBHOOK_URL: ${process.env.TBANK_DEFAULT_CARD_WEBHOOK_URL || ''}
      PROJECT_USER_EMAIL: ${process.env.PROJECT_USER_EMAIL || 'admin@example.com'}
      PROJECT_USER_PASSWORD: ${process.env.PROJECT_USER_PASSWORD || 'password'}
      POSTGRES_URL: ${process.env.POSTGRES_URL || 'postgres://postgres:postgrespassword@hasura-postgres-1:5432/hasyx'}
      TELEGRAM_LOGIN_BOT_USERNAME: ${process.env.TELEGRAM_LOGIN_BOT_USERNAME || ''}
      TELEGRAM_LOGIN_BOT_TOKEN: ${process.env.TELEGRAM_LOGIN_BOT_TOKEN || ''}
      NEXT_PUBLIC_TELEGRAM_BOT_USERNAME: ${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ''}
      JEST_LOCAL: ${process.env.JEST_LOCAL || '0'}
      OPENROUTER_API_KEY: ${process.env.OPENROUTER_API_KEY || ''}
      PORT: ${process.env.PORT || '3000'}
      HOST: ${process.env.HOST || '127.0.0.1'}
      HASYX_DNS_DOMAIN: ${process.env.HASYX_DNS_DOMAIN || ''}
      CLOUDFLARE_API_TOKEN: ${process.env.CLOUDFLARE_API_TOKEN || ''}
      CLOUDFLARE_ZONE_ID: ${process.env.CLOUDFLARE_ZONE_ID || ''}
      LETSENCRYPT_EMAIL: ${process.env.LETSENCRYPT_EMAIL || ''}
      GITHUB_TELEGRAM_BOT: ${process.env.GITHUB_TELEGRAM_BOT || '1'}
      DOCKER_USERNAME: ${process.env.DOCKER_USERNAME || ''}
      DOCKER_PASSWORD: ${process.env.DOCKER_PASSWORD || ''}
      NEXT_PUBLIC_GITHUB_OWNER: ${process.env.NEXT_PUBLIC_GITHUB_OWNER || ''}
      NEXT_PUBLIC_GITHUB_REPO: ${process.env.NEXT_PUBLIC_GITHUB_REPO || ''}
      GITHUB_WEBHOOK_SECRET: ${process.env.GITHUB_WEBHOOK_SECRET || ''}
      GITHUB_WEBHOOK_URL: ${process.env.GITHUB_WEBHOOK_URL || ''}
      GITHUB_WEBHOOK_EVENTS: ${process.env.GITHUB_WEBHOOK_EVENTS || ''}
      GITHUB_TOKEN: ${process.env.GITHUB_TOKEN || ''}
      STORAGE_BACKEND: ${process.env.STORAGE_BACKEND || 's3'}
      STORAGE_S3_BUCKET: ${process.env.STORAGE_S3_BUCKET || 'default'}
      STORAGE_S3_REGION: ${process.env.STORAGE_S3_REGION || 'us-east-1'}
      STORAGE_S3_ACCESS_KEY_ID: ${process.env.STORAGE_S3_ACCESS_KEY_ID || 'minioadmin'}
      STORAGE_S3_SECRET_ACCESS_KEY: ${process.env.STORAGE_S3_SECRET_ACCESS_KEY || 'minioadmin'}
      STORAGE_S3_ENDPOINT: ${process.env.STORAGE_S3_ENDPOINT || 'http://hasyx-minio:9000'}
      STORAGE_S3_FORCE_PATH_STYLE: ${process.env.STORAGE_S3_FORCE_PATH_STYLE || 'true'}
      STORAGE_JWT_SECRET: '${process.env.STORAGE_JWT_SECRET || '{"type":"HS256","key":"your-jwt-secret-key"}'}'
      STORAGE_JWT_EXPIRES_IN: ${process.env.STORAGE_JWT_EXPIRES_IN || '15m'}
      STORAGE_JWT_REFRESH_EXPIRES_IN: ${process.env.STORAGE_JWT_REFRESH_EXPIRES_IN || '7d'}
      STORAGE_MAX_FILE_SIZE: ${process.env.STORAGE_MAX_FILE_SIZE || '100MB'}
      STORAGE_ALLOWED_MIME_TYPES: ${process.env.STORAGE_ALLOWED_MIME_TYPES || 'image/*,application/pdf,text/*'}
      STORAGE_ALLOWED_FILE_EXTENSIONS: ${process.env.STORAGE_ALLOWED_FILE_EXTENSIONS || 'jpg,jpeg,png,gif,pdf,txt,doc,docx'}
      STORAGE_CACHE_CONTROL: ${process.env.STORAGE_CACHE_CONTROL || 'public, max-age=31536000'}
      STORAGE_ETAG: ${process.env.STORAGE_ETAG || 'true'}
      STORAGE_IMAGE_MANIPULATION: ${process.env.STORAGE_IMAGE_MANIPULATION || 'true'}
      STORAGE_IMAGE_MAX_WIDTH: ${process.env.STORAGE_IMAGE_MAX_WIDTH || '1920'}
      STORAGE_IMAGE_MAX_HEIGHT: ${process.env.STORAGE_IMAGE_MAX_HEIGHT || '1080'}
      STORAGE_IMAGE_QUALITY: ${process.env.STORAGE_IMAGE_QUALITY || '80'}
      STORAGE_RATE_LIMIT_WINDOW: ${process.env.STORAGE_RATE_LIMIT_WINDOW || '15m'}
      STORAGE_RATE_LIMIT_MAX_REQUESTS: ${process.env.STORAGE_RATE_LIMIT_MAX_REQUESTS || '100'}
      STORAGE_LOG_LEVEL: ${process.env.STORAGE_LOG_LEVEL || 'info'}
      STORAGE_LOG_FORMAT: ${process.env.STORAGE_LOG_FORMAT || 'json'}
      HASURA_STORAGE_URL: ${process.env.HASURA_STORAGE_URL || 'http://hasura-storage:8000'}
      NEXT_PUBLIC_HASURA_STORAGE_URL: ${process.env.NEXT_PUBLIC_HASURA_STORAGE_URL || 'http://hasura-storage:8000'}
      HASURA_GRAPHQL_ENDPOINT: ${process.env.HASURA_GRAPHQL_ENDPOINT || 'http://graphql-engine:8080/v1/graphql'}
    env_file:
      - .env
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
volumes:
  db_data: null
  minio_data: null
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
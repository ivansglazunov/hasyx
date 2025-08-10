import fs from 'fs-extra';
import path from 'path';
import spawn from 'cross-spawn';
import Debug from './debug';
import { parse, stringify } from 'yaml';

const debug = Debug('env');

interface DockerComposeService {
  environment?: Record<string, string>;
  env_file?: string[];
}

interface DockerComposeConfig {
  version?: string;
  services: Record<string, DockerComposeService>;
}

/**
 * Set environment variables in docker-compose.yml file
 * and update them in a running container if it exists
 */
export const envCommand = async (): Promise<void> => {
  debug('Executing env command');
  console.log('🔧 Starting environment variables management...');
  
  const projectRoot = process.cwd();
  const envPath = path.join(projectRoot, '.env');
  const dockerComposePath = path.join(projectRoot, 'docker-compose.yml');
  
  // Check if .env file exists
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found');
    console.error('💡 Please create .env file first or run "npx hasyx init"');
    process.exit(1);
  }
  
  // Read variables from .env file
  console.log('📖 Reading environment variables from .env...');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars: Record<string, string> = {};
  
  // Parse .env file
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const equalIndex = trimmedLine.indexOf('=');
      if (equalIndex > 0) {
        const key = trimmedLine.substring(0, equalIndex);
        const value = trimmedLine.substring(equalIndex + 1);
        envVars[key] = value;
      }
    }
  });
  
  debug(`Found ${Object.keys(envVars).length} environment variables`);
  
  // Check if docker-compose.yml exists
  if (!fs.existsSync(dockerComposePath)) {
    console.log('📝 Creating docker-compose.yml...');
    await createDockerComposeFile(dockerComposePath, envVars);
    console.log('✅ Created docker-compose.yml with environment variables');
  } else {
    console.log('📝 Updating docker-compose.yml...');
    await updateDockerComposeFile(dockerComposePath, envVars);
    console.log('✅ Updated docker-compose.yml with environment variables');
  }
  
  // Check Docker and update container if running
  await updateRunningContainer(projectRoot, envVars);
};

/**
 * Create new docker-compose.yml file with environment variables
 */
const createDockerComposeFile = async (dockerComposePath: string, envVars: Record<string, string>): Promise<void> => {
  const projectName = getProjectName();
  
  const dockerComposeConfig: DockerComposeConfig = {
    version: '3.8',
    services: {
      [projectName]: {
        environment: envVars,
        env_file: ['.env']
      }
    }
  };
  
  await fs.writeJson(dockerComposePath, dockerComposeConfig, { spaces: 2 });
  debug('Created new docker-compose.yml file');
};

/**
 * Add environment variables to existing YAML file
 */
const addEnvToYamlFile = async (dockerComposePath: string, envVars: Record<string, string>): Promise<void> => {
  try {
    const fileContent = fs.readFileSync(dockerComposePath, 'utf-8');
    const config = parse(fileContent);
    
    const projectName = getProjectName();
    
    // Create service for app if it doesn't exist
    if (!config.services) {
      config.services = {};
    }
    
    if (!config.services[projectName]) {
      config.services[projectName] = {
        image: 'node:18-alpine',
        container_name: `${projectName}-app`,
        restart: 'unless-stopped',
        ports: ['3000:3000'],
        volumes: ['./:/app', '/app/node_modules'],
        working_dir: '/app',
        command: 'npm run dev'
      };
    }
    
    // Append environment variables to existing
    if (!config.services[projectName].environment) {
      config.services[projectName].environment = {};
    }
    
    // Update environment variables
    config.services[projectName].environment = { 
      ...config.services[projectName].environment, 
      ...envVars 
    };
    
    // Add env_file if missing
    if (!config.services[projectName].env_file) {
      config.services[projectName].env_file = ['.env'];
    }
    
    // Write back in YAML format
    const updatedContent = stringify(config, { 
      indent: 2,
      lineWidth: 120,
      minContentWidth: 20
    });
    
    fs.writeFileSync(dockerComposePath, updatedContent);
    debug('Updated existing YAML docker-compose.yml file');
  } catch (error) {
    console.warn('⚠️ Failed to update YAML docker-compose.yml:', error);
    throw error;
  }
};

/**
 * Update existing docker-compose.yml with new environment variables
 */
const updateDockerComposeFile = async (dockerComposePath: string, envVars: Record<string, string>): Promise<void> => {
  try {
    // Read file as text since it may be YAML
    const fileContent = fs.readFileSync(dockerComposePath, 'utf-8');
    
    // Check if file is JSON
    let existingConfig: DockerComposeConfig;
    try {
      existingConfig = JSON.parse(fileContent);
    } catch {
      // If not JSON, treat as YAML and add variables to existing services
      console.log('📝 File is in YAML format, adding environment variables to existing services...');
      await addEnvToYamlFile(dockerComposePath, envVars);
      return;
    }
    
    const projectName = getProjectName();
    
    // Update or create service
    if (!existingConfig.services) {
      existingConfig.services = {};
    }
    
    if (!existingConfig.services[projectName]) {
      existingConfig.services[projectName] = {};
    }
    
    // Update environment variables while preserving existing
    const currentEnv = existingConfig.services[projectName].environment || {};
    existingConfig.services[projectName].environment = { ...currentEnv, ...envVars };
    existingConfig.services[projectName].env_file = ['.env'];
    
    await fs.writeJson(dockerComposePath, existingConfig, { spaces: 2 });
    debug('Updated existing docker-compose.yml file');
  } catch (error) {
    console.warn('⚠️ Failed to update docker-compose.yml, creating new one...');
    await createDockerComposeFile(dockerComposePath, envVars);
  }
};

/**
 * Update environment variables in a running container
 */
const updateRunningContainer = async (projectRoot: string, envVars: Record<string, string>): Promise<void> => {
  // Check if Docker is installed
  const dockerVersionResult = spawn.sync('docker', ['--version'], { 
    stdio: 'pipe',
    cwd: projectRoot 
  });
  
  if (dockerVersionResult.status !== 0) {
    console.log('ℹ️ Docker not installed or not running, skipping container update');
    debug('Docker not available, skipping container update');
    return;
  }
  
  const projectName = getProjectName();
  
  // Check if container is running
  const psResult = spawn.sync('docker', ['ps', '--filter', `name=${projectName}`, '--format', '{{.Names}}'], {
    stdio: 'pipe',
    cwd: projectRoot,
    encoding: 'utf-8'
  });
  
  if (psResult.status !== 0 || !psResult.stdout.trim()) {
    console.log('ℹ️ Container not running, skipping container update');
    debug('Container not running, skipping container update');
    return;
  }
  
  console.log('🔄 Updating environment variables in running container...');
  
  // Stop container
  const stopResult = spawn.sync('docker-compose', ['stop'], {
    stdio: 'inherit',
    cwd: projectRoot
  });
  
  if (stopResult.status !== 0) {
    console.warn('⚠️ Failed to stop container');
    debug('Failed to stop container');
    return;
  }
  
  // Start container with new variables
  const upResult = spawn.sync('docker-compose', ['up', '-d'], {
    stdio: 'inherit',
    cwd: projectRoot
  });
  
  if (upResult.status !== 0) {
    console.warn('⚠️ Failed to restart container');
    debug('Failed to restart container');
    return;
  }
  
  console.log('✅ Container restarted with updated environment variables');
  debug('Container successfully restarted with new environment variables');
};

/**
 * Get project name from package.json
 */
const getProjectName = (): string => {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = fs.readJsonSync(packageJsonPath);
    return packageJson.name || 'app';
  } catch (error) {
    debug('Failed to read package.json, using default name "app"');
    return 'app';
  }
}; 
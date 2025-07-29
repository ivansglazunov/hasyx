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
 * Устанавливает переменные окружения в docker-compose.yml файле
 * и обновляет их в запущенном контейнере если он существует
 */
export const envCommand = async (): Promise<void> => {
  debug('Executing env command');
  console.log('🔧 Starting environment variables management...');
  
  const projectRoot = process.cwd();
  const envPath = path.join(projectRoot, '.env');
  const dockerComposePath = path.join(projectRoot, 'docker-compose.yml');
  
  // Проверяем существование .env файла
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found');
    console.error('💡 Please create .env file first or run "npx hasyx init"');
    process.exit(1);
  }
  
  // Читаем переменные из .env файла
  console.log('📖 Reading environment variables from .env...');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars: Record<string, string> = {};
  
  // Парсим .env файл
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
  
  // Проверяем существование docker-compose.yml
  if (!fs.existsSync(dockerComposePath)) {
    console.log('📝 Creating docker-compose.yml...');
    await createDockerComposeFile(dockerComposePath, envVars);
    console.log('✅ Created docker-compose.yml with environment variables');
  } else {
    console.log('📝 Updating docker-compose.yml...');
    await updateDockerComposeFile(dockerComposePath, envVars);
    console.log('✅ Updated docker-compose.yml with environment variables');
  }
  
  // Проверяем Docker и обновляем контейнер если он запущен
  await updateRunningContainer(projectRoot, envVars);
};

/**
 * Создает новый docker-compose.yml файл с переменными окружения
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
 * Добавляет переменные окружения к существующему YAML файлу
 */
const addEnvToYamlFile = async (dockerComposePath: string, envVars: Record<string, string>): Promise<void> => {
  try {
    const fileContent = fs.readFileSync(dockerComposePath, 'utf-8');
    const config = parse(fileContent);
    
    const projectName = getProjectName();
    
    // Создаем сервис для приложения, если его нет
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
    
    // Добавляем переменные окружения к существующим
    if (!config.services[projectName].environment) {
      config.services[projectName].environment = {};
    }
    
    // Обновляем переменные окружения
    config.services[projectName].environment = { 
      ...config.services[projectName].environment, 
      ...envVars 
    };
    
    // Добавляем env_file если его нет
    if (!config.services[projectName].env_file) {
      config.services[projectName].env_file = ['.env'];
    }
    
    // Записываем обратно в YAML формате
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
 * Обновляет существующий docker-compose.yml файл с новыми переменными окружения
 */
const updateDockerComposeFile = async (dockerComposePath: string, envVars: Record<string, string>): Promise<void> => {
  try {
    // Читаем файл как текст, так как он может быть в формате YAML
    const fileContent = fs.readFileSync(dockerComposePath, 'utf-8');
    
    // Проверяем, является ли файл JSON
    let existingConfig: DockerComposeConfig;
    try {
      existingConfig = JSON.parse(fileContent);
    } catch {
      // Если не JSON, то это YAML, добавляем переменные к существующим сервисам
      console.log('📝 File is in YAML format, adding environment variables to existing services...');
      await addEnvToYamlFile(dockerComposePath, envVars);
      return;
    }
    
    const projectName = getProjectName();
    
    // Обновляем или создаем сервис
    if (!existingConfig.services) {
      existingConfig.services = {};
    }
    
    if (!existingConfig.services[projectName]) {
      existingConfig.services[projectName] = {};
    }
    
    // Обновляем переменные окружения, сохраняя существующие
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
 * Обновляет переменные окружения в запущенном контейнере
 */
const updateRunningContainer = async (projectRoot: string, envVars: Record<string, string>): Promise<void> => {
  // Проверяем установлен ли Docker
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
  
  // Проверяем запущен ли контейнер
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
  
  // Останавливаем контейнер
  const stopResult = spawn.sync('docker-compose', ['stop'], {
    stdio: 'inherit',
    cwd: projectRoot
  });
  
  if (stopResult.status !== 0) {
    console.warn('⚠️ Failed to stop container');
    debug('Failed to stop container');
    return;
  }
  
  // Запускаем контейнер с новыми переменными
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
 * Получает имя проекта из package.json
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
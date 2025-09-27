import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import spawn from 'cross-spawn';
import Debug from './debug';
import { createDefaultEventTriggers, syncEventTriggersFromDirectory, syncAllTriggersFromDirectory } from './events';
import { printMarkdown } from './markdown-terminal';
import dotenv from 'dotenv';
import { buildClient } from './build-client';
import { migrate } from './migrate';
import { unmigrate } from './unmigrate';
import { generateHasuraSchema } from './hasura-schema';
// import moved to dynamic inside jsCommand to avoid loading heavy client code during unrelated commands
// Minimal .env parser (local replacement for assist-common)
function parseEnvFile(filePath: string): Record<string, string> {
  const fs = require('fs');
  const env: Record<string, string> = {};
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx <= 0) continue;
      const key = trimmed.substring(0, idx).trim();
      const value = trimmed.substring(idx + 1).trim();
      env[key] = value;
    }
  } catch {}
  return env;
}

/**
 * Получает имя проекта из git окружения
 * Если git репозиторий не найден, возвращает 'super-idea'
 */
function getProjectNameFromGit(): string {
  try {
    // Проверяем, есть ли .git папка в текущей директории
    if (!fs.existsSync('.git')) {
      return 'super-idea';
    }

    // Получаем remote origin URL
    const remoteUrl = spawn.sync('git', ['config', '--get', 'remote.origin.url'], { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).stdout?.trim();

    if (!remoteUrl) {
      return 'super-idea';
    }

    // Извлекаем имя репозитория из URL
    // Поддерживаем форматы:
    // https://github.com/username/repo-name.git
    // git@github.com:username/repo-name.git
    // ssh://git@github.com/username/repo-name.git
    
    let repoName = '';
    
    if (remoteUrl.includes('github.com') || remoteUrl.includes('gitlab.com') || remoteUrl.includes('bitbucket.org')) {
      // HTTPS/SSH формат для популярных платформ
      const parts = remoteUrl.split('/');
      repoName = parts[parts.length - 1];
    } else if (remoteUrl.includes('git@')) {
      // SSH формат
      const parts = remoteUrl.split(':');
      if (parts.length > 1) {
        const lastPart = parts[parts.length - 1];
        repoName = lastPart.split('/').pop() || '';
      }
    } else if (remoteUrl.includes('ssh://')) {
      // SSH URL формат
      const parts = remoteUrl.split('/');
      repoName = parts[parts.length - 1];
    }

    // Убираем .git расширение если есть
    if (repoName.endsWith('.git')) {
      repoName = repoName.slice(0, -4);
    }

    return repoName || 'super-idea';
  } catch (error) {
    // В случае любой ошибки возвращаем fallback
    return 'super-idea';
  }
}

import * as gh from './github';
import * as vercelApi from './vercel/index';
import { setWebhook as tgSetWebhook, removeWebhook as tgRemoveWebhook, calibrate as tgCalibrate } from './telegram';
// ask command will be registered with lazy import to avoid resolving 'hasyx/*' in child projects during other commands
// import moved to dynamic inside tsxCommand to avoid loading heavy client code during unrelated commands
import { assetsCommand } from './assets';
import { eventsCommand } from './events-cli';
import { unbuildCommand } from './unbuild';
// assist removed
import { localCommand } from './local';
import { vercelCommand } from './vercel';
import { CloudFlare, CloudflareConfig, DnsRecord } from './cloudflare/cloudflare';
import { SSL } from './ssl';
import { Nginx } from './nginx/nginx';
import { listContainers, defineContainer, undefineContainer, showContainerLogs, showContainerEnv } from './docker';
import { processLogs } from './logs/logs';
import { processConfiguredDiffs } from './logs/logs-diffs';
import { processConfiguredStates } from './logs/logs-states';
import { envCommand } from './env';
import { 
  generateProjectJsonSchemas, syncSchemasToDatabase,
  processConfiguredValidationDefine, processConfiguredValidationUndefine
} from './validation';

export { 
  assetsCommand, eventsCommand, unbuildCommand, localCommand, vercelCommand, processLogs, processConfiguredDiffs, processConfiguredStates, envCommand };

// Exported lists used by build-templates.ts to stage raw TS/TSX for publishing
export const LIB_SCAFFOLD_FILES: string[] = [
  'lib/entities.tsx',
  'lib/ask.ts',
  'lib/debug.ts',
  'lib/cli.ts',
  'lib/ssr.tsx',
  'lib/ssr-client.tsx',
  'lib/ssr-server.tsx',
  'lib/github-telegram-bot.ts',
  'lib/config.tsx',
  'lib/config/env.tsx',
  'lib/config/docker-compose.tsx',
  'lib/url.ts',
  'lib/i18n/config.ts',
  'lib/i18n/messages.ts',
  'lib/app-client-layout.tsx',
];

export const COMPONENTS_SCAFFOLD_FILES: string[] = [
  'components/sidebar/layout.tsx',
  'components/entities/default.tsx',
];

// Config command: runs the interactive or silent configuration tool
export const configCommand = async (options: { silent?: boolean } = {}) => {
  debug('Executing "config" command.', options);
  const cwd = process.cwd();
  const args = ['tsx', 'lib/config.tsx'];
  if (options.silent) args.push('--silent');

  const result = spawn.sync('npx', args, {
    stdio: 'inherit',
    cwd,
  });

  if (result.error) {
    console.error('❌ Config command failed to start:', result.error);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`❌ Config command exited with status ${result.status}`);
    process.exit(result.status ?? 1);
  }
};

// Gitpod command: automatically configure Hasyx for Gitpod environment
export const gitpodCommand = async () => {
  debug('Executing "gitpod" command');
  
  // Check if running in Gitpod environment
  if (!process.env.GITPOD_WORKSPACE_ID) {
    console.error('❌ This command must be run in Gitpod environment');
    console.error('💡 Gitpod environment variables not detected');
    process.exit(1);
  }

  console.log('🚀 Setting up Hasyx for Gitpod environment...');
  
  try {
    // Get Gitpod-specific configuration
    const gitpodConfig = await generateGitpodConfig();
    
    // Update or create hasyx.config.json
    await updateHasyxConfig(gitpodConfig);
    
    // Generate .env and docker-compose.yml using existing functions
    console.log('📝 Generating .env and docker-compose.yml...');
    await generateEnvAndDockerCompose();
    
    console.log('✅ Gitpod configuration completed successfully!');
    console.log('🚀 Next steps:');
    console.log('   1. Run "docker compose up -d" to start infrastructure services (PostgreSQL, Hasura, MinIO)');
    console.log('   2. Run "npm run migrate" to apply database migrations');
    console.log('   3. Run "npm run dev" to start development server (runs locally, not in Docker)');
    console.log('');
    console.log('💡 Note: In Gitpod, the app runs locally via "npm run dev", not in Docker container');
    console.log('   Docker is used only for infrastructure services (database, GraphQL, storage)');
    
  } catch (error) {
    console.error('❌ Gitpod setup failed:', error);
    debug('Gitpod command error:', error);
    process.exit(1);
  }
};

// Generate Gitpod-specific configuration
async function generateGitpodConfig() {
  const workspaceId = process.env.GITPOD_WORKSPACE_ID;
  const workspaceUrl = process.env.GITPOD_WORKSPACE_URL || 'gitpod.io';
  
  // Generate secure random secrets
  const crypto = await import('crypto');
  const generateSecret = (length: number = 32) => crypto.randomBytes(length).toString('hex');
  
  return {
    variant: 'gitpod',
    variants: {
      gitpod: {
        hasura: 'gitpod',
        pg: 'gitpod',
        storage: 'gitpod',
        nextAuthSecrets: 'gitpod'
      }
    },
    hasura: {
      gitpod: {
        url: 'http://localhost:8080/v1/graphql',
        secret: generateSecret(32),
        jwtSecret: JSON.stringify({
          type: 'HS256',
          key: generateSecret(32)
        }),
        eventSecret: generateSecret(32)
      }
    },
    pg: {
      gitpod: {
        url: 'postgres://postgres:postgrespassword@localhost:5432/hasyx?sslmode=disable'
      }
    },
    storage: {
      gitpod: {
        provider: 'minio',
        bucket: 'hasyx',
        region: 'us-east-1',
        useLocal: true,
        endpoint: 'http://localhost:9000',
        accessKeyId: 'minioadmin',
        secretAccessKey: 'minioadmin',
        forcePathStyle: true,
        useAntivirus: false,
        useImageManipulation: false
      }
    },
    nextAuthSecrets: {
      gitpod: {
        secret: generateSecret(32),
        url: `https://3000-${workspaceId}.ws-${workspaceUrl}`
      }
    }
  };
}

// Update or create hasyx.config.json
async function updateHasyxConfig(gitpodConfig: any) {
  const fs = await import('fs-extra');
  const path = await import('path');
  
  const configPath = path.join(process.cwd(), 'hasyx.config.json');
  let currentConfig: any = {};
  
  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      currentConfig = JSON.parse(content);
      console.log('📖 Found existing hasyx.config.json, updating...');
    } else {
      console.log('📝 Creating new hasyx.config.json...');
    }
  } catch (error) {
    console.warn('⚠️ Could not read existing config, creating new one');
    debug('Error reading existing config:', error);
  }
  
  // Merge Gitpod configuration with existing config
  const updatedConfig = {
    ...currentConfig,
    ...gitpodConfig,
    // Ensure variants object is properly merged
    variants: {
      ...currentConfig.variants,
      ...gitpodConfig.variants
    },
    // Ensure other objects are properly merged
    hasura: {
      ...currentConfig.hasura,
      ...gitpodConfig.hasura
    },
    pg: {
      ...currentConfig.pg,
      ...gitpodConfig.pg
    },
    storage: {
      ...currentConfig.storage,
      ...gitpodConfig.storage
    },
    nextAuthSecrets: {
      ...currentConfig.nextAuthSecrets,
      ...gitpodConfig.nextAuthSecrets
    }
  };
  
  // Write updated configuration
  await fs.writeJson(configPath, updatedConfig, { spaces: 2 });
  console.log('✅ hasyx.config.json updated successfully');
}

// Generate .env and docker-compose.yml using existing functions
async function generateEnvAndDockerCompose() {
  try {
    // Import and call generateEnv
    const { generateEnv } = await import('./config/env');
    await generateEnv();
    console.log('✅ .env file generated');
  } catch (error) {
    console.error('❌ Failed to generate .env:', error);
    throw error;
  }
  
  try {
    // Import and call generateDockerCompose
    const { generateDockerCompose } = await import('./config/docker-compose');
    await generateDockerCompose();
    console.log('✅ docker-compose.yml generated');
  } catch (error) {
    console.error('❌ Failed to generate docker-compose.yml:', error);
    throw error;
  }
}

/**
 * GitHub sync command: purge all repo secrets and sync from .env
 */
export const githubSyncCommand = async () => {
  const remoteUrl = gh.getRemoteUrl();
  if (!remoteUrl) {
    console.error('❌ Git remote origin not found. Initialize a GitHub repo first.');
    process.exit(1);
  }
  gh.ensureGhCli();
  try { gh.checkAuth(); } catch (e) { console.error('❌ GitHub CLI not authenticated. Run: gh auth login'); process.exit(1); }

  // List and remove all existing secrets
  const list = spawn.sync('gh', ['secret', 'list', '-R', remoteUrl], { encoding: 'utf-8' });
  const lines = (list.stdout || '').split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const name = line.split(/\s+/)[0];
    if (!name) continue;
    spawn.sync('gh', ['secret', 'remove', name, '-R', remoteUrl], { encoding: 'utf-8' });
  }

  // Add from .env
  const env = parseEnvFile('.env');
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith('GITHUB_')) continue; // reserved
    if (typeof value !== 'string') continue;
    try { gh.setSecret(remoteUrl, key, value); console.log(`✅ Set ${key}`); } catch { console.warn(`⚠️ Failed to set ${key}`); }
  }
  console.log('✅ GitHub secrets synchronized from .env');
};

/**
 * GitHub clear command: remove all repo secrets (no re-add)
 */
export const githubClearCommand = async () => {
  const remoteUrl = gh.getRemoteUrl();
  if (!remoteUrl) {
    console.error('❌ Git remote origin not found. Initialize a GitHub repo first.');
    process.exit(1);
  }
  gh.ensureGhCli();
  try { gh.checkAuth(); } catch (e) { console.error('❌ GitHub CLI not authenticated. Run: gh auth login'); process.exit(1); }

  // List and remove all existing secrets
  const list = spawn.sync('gh', ['secret', 'list', '-R', remoteUrl], { encoding: 'utf-8' });
  const lines = (list.stdout || '').split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const name = line.split(/\s+/)[0];
    if (!name) continue;
    spawn.sync('gh', ['secret', 'remove', name, '-R', remoteUrl], { encoding: 'utf-8' });
  }

  console.log('✅ GitHub secrets cleared');
};

/**
 * Describe GitHub commands
 */
export const githubCommandDescribe = (cmd: Command) => {
  const c = cmd.description('GitHub operations')
    .addHelpText('after', `\nExamples:\n  npx hasyx github sync\n  npx hasyx github clear\n  npm run cli -- github --help`);
  c.command('sync').description('Purge and sync GitHub Actions secrets from .env').action(githubSyncCommand);
  c.command('clear').description('Remove all GitHub Actions secrets (no re-add)').action(githubClearCommand);
  return c;
};

/**
 * Vercel sync command: purge Vercel envs and sync from .env for all environments
 */
export const vercelSyncCommand = async () => {
  const env = parseEnvFile('.env');
  const token = env.VERCEL_TOKEN;
  const project = env.VERCEL_PROJECT_NAME;
  const teamId = env.VERCEL_TEAM_ID;
  const userId = env.VERCEL_USER_ID;
  if (!token || !project) {
    console.error('❌ Missing VERCEL_TOKEN or VERCEL_PROJECT_NAME in .env');
    process.exit(1);
  }
  // Ensure linked
  if (!vercelApi.link(project, token, teamId, userId)) {
    console.error(`❌ Failed to link to Vercel project ${project}`);
    process.exit(1);
  }
  // Pull current to know keys
  if (!vercelApi.envPull(token, '.env.vercel')) {
    console.warn('⚠️ Could not pull current Vercel env; proceeding with sync');
  }
  const current = parseEnvFile('.env.vercel');
  // Print a clear plan so the Vercel CLI "Changes:" (pull step) is not confusing
  const currentKeys = Object.keys(current).filter(k => k);
  const envKeysToPush = Object.keys(env).filter(k => !['VERCEL_TOKEN','VERCEL_TEAM_ID','VERCEL_USER_ID','VERCEL_PROJECT_NAME'].includes(k));
  console.log(`ℹ️ Plan: will remove ${currentKeys.length} keys from development/preview/production and add ${envKeysToPush.length} keys from .env`);
  const envTypes: Array<'production'|'preview'|'development'> = ['production', 'preview', 'development'];
  // Remove all currently present keys
  for (const key of Object.keys(current)) {
    for (const t of envTypes) { vercelApi.envRemove(key, t, token); }
  }
  // Add all from .env excluding Vercel control keys
  for (const [key, value] of Object.entries(env)) {
    if (['VERCEL_TOKEN','VERCEL_TEAM_ID','VERCEL_USER_ID','VERCEL_PROJECT_NAME'].includes(key)) continue;
    if (typeof value !== 'string') continue;
    // Force WS off for Vercel runtime
    if (key === 'NEXT_PUBLIC_WS') {
      for (const t of envTypes) { vercelApi.envAdd(key, t, '0', token); }
      continue;
    }
    for (const t of envTypes) { vercelApi.envAdd(key, t, value, token); }
  }
  // Verify by pulling again and reporting concise summary
  if (vercelApi.envPull(token, '.env.vercel')) {
    const after = parseEnvFile('.env.vercel');
    console.log(`✅ Vercel environment synchronized: ${Object.keys(after).length} keys present (development) from .env`);
    console.log('ℹ️ Note: the "Changes:" list above refers only to the initial pull step, not the final state');
  } else {
    console.log('✅ Vercel environment variables synchronized from .env');
  }
};

/**
 * Vercel clear command: remove all env vars in production/preview/development (no re-add)
 */
export const vercelClearCommand = async () => {
  const env = parseEnvFile('.env');
  const token = env.VERCEL_TOKEN;
  const project = env.VERCEL_PROJECT_NAME;
  const teamId = env.VERCEL_TEAM_ID;
  const userId = env.VERCEL_USER_ID;
  if (!token || !project) {
    console.error('❌ Missing VERCEL_TOKEN or VERCEL_PROJECT_NAME in .env');
    process.exit(1);
  }
  // Ensure linked
  if (!vercelApi.link(project, token, teamId, userId)) {
    console.error(`❌ Failed to link to Vercel project ${project}`);
    process.exit(1);
  }
  // Pull current to know keys
  if (!vercelApi.envPull(token, '.env.vercel')) {
    console.warn('⚠️ Could not pull current Vercel env; proceeding with clear');
  }
  const current = parseEnvFile('.env.vercel');
  const envTypes: Array<'production'|'preview'|'development'> = ['production', 'preview', 'development'];
  // Remove all currently present keys
  for (const key of Object.keys(current)) {
    for (const t of envTypes) { vercelApi.envRemove(key, t, token); }
  }
  console.log('✅ Vercel environment variables cleared');
};

// (moved into existing describe functions below)

// Load .env file from current working directory
const envResult = dotenv.config({ path: path.join(process.cwd(), '.env') });

if (envResult.error) {
  // Only log in debug mode to avoid cluttering output for users without .env files
  console.debug('Failed to load .env file:', envResult.error);
} else {
  console.debug('.env file loaded successfully');
}

// Create a debugger instance for the CLI
const debug = Debug('cli');

// Helper function to get template content
export const getTemplateContent = (fileName: string, templatesDir?: string): string => {
  const baseDir = templatesDir || path.resolve(__dirname, '../');
  const filePath = path.join(baseDir, fileName);
  debug(`Attempting to read template file: ${filePath}`);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    debug(`Successfully read template: ${fileName}`);
    return content;
  } catch (error) {
    console.error(`Error reading template file: ${filePath}`, error);
    debug(`Failed to read template: ${fileName}`);
    throw new Error(`Template file not found: ${fileName}`);
  }
};

// Helper: recursively copy directory with optional overwrite
async function copyDirectoryRecursive(sourceDir: string, targetDir: string, options: { overwrite: boolean }) {
  debug(`copyDirectoryRecursive source=${sourceDir} target=${targetDir} overwrite=${options.overwrite}`);
  if (!fs.existsSync(sourceDir)) {
    console.warn(`⚠️ Source directory not found: ${sourceDir}`);
    return;
  }
  await fs.ensureDir(targetDir);
  await fs.copy(sourceDir, targetDir, { overwrite: options.overwrite, errorOnExist: false });
}

// Helper function to ensure WebSocket support in the project
export const ensureWebSocketSupport = (projectRoot: string): void => {
  debug('Ensuring WebSocket support');
  
  // Apply next-ws patch
  console.log('🩹 Applying next-ws patch...');
  debug('Running next-ws patch command: npx --yes next-ws-cli@latest patch -y');
  const patchResult = spawn.sync('npx', ['--yes', 'next-ws-cli@latest', 'patch', '-y'], {
    stdio: 'inherit',
    cwd: projectRoot,
  });
  debug('next-ws patch result:', JSON.stringify(patchResult, null, 2));
  if (patchResult.error) {
    console.error('❌ Failed to run next-ws patch:', patchResult.error);
    console.warn('⚠️ Please try running "npx --yes next-ws-cli@latest patch" manually.');
    debug(`next-ws patch failed to start: ${patchResult.error}`);
  } else if (patchResult.status !== 0) {
    console.error(`❌ next-ws patch process exited with status ${patchResult.status}`);
    console.warn('⚠️ Please try running "npx --yes next-ws-cli@latest patch" manually.');
    debug(`next-ws patch exited with non-zero status: ${patchResult.status}`);
  } else {
    console.log('✅ next-ws patch applied successfully!');
    debug('next-ws patch successful.');
  }

  // Check if ws is installed and add necessary scripts
  const checkWsInstalled = () => {
    try {
      const pkgJsonPath = path.join(projectRoot, 'package.json');
      const pkgJsonContent = fs.readFileSync(pkgJsonPath, 'utf8');
      const pkgJson = JSON.parse(pkgJsonContent);
      
      const hasWsDependency = 
        (pkgJson.dependencies && pkgJson.dependencies.ws) || 
        (pkgJson.devDependencies && pkgJson.devDependencies.ws);
      
      const hasPostinstall = 
        pkgJson.scripts && 
        pkgJson.scripts.postinstall && 
        pkgJson.scripts.postinstall.includes('ws');
      
      const hasWsScript = 
        pkgJson.scripts && 
        pkgJson.scripts.ws && 
        pkgJson.scripts.ws.includes('next-ws-cli');
      
      debug(`WS checks - direct dependency: ${hasWsDependency}, postinstall script: ${hasPostinstall}, ws script: ${hasWsScript}`);
      
      return { hasWsDependency, hasPostinstall, hasWsScript, pkgJson, pkgJsonPath };
    } catch (error) {
      debug(`Error checking for ws installation: ${error}`);
      return { hasWsDependency: false, hasPostinstall: false, hasWsScript: false };
    }
  };
  
  const { hasWsDependency, hasPostinstall, hasWsScript, pkgJson, pkgJsonPath } = checkWsInstalled();
  
  // Install ws if not present
  if (!hasWsDependency) {
    console.log('📦 Installing WebSocket (ws) dependency...');
    const installWsResult = spawn.sync('npm', ['install', 'ws@^8.18.1', '--save'], {
      stdio: 'inherit',
      cwd: projectRoot,
    });
    
    if (installWsResult.error || installWsResult.status !== 0) {
      console.warn('⚠️ Failed to install ws package automatically.');
      console.warn('   Please install it manually: npm install ws@^8.18.1 --save');
      debug(`ws installation failed: ${installWsResult.error || `Exit code: ${installWsResult.status}`}`);
    } else {
      console.log('✅ WebSocket dependency installed successfully.');
      debug('ws package installed successfully');
    }
  } else {
    debug('ws dependency already installed, skipping installation');
  }
  
  // Add necessary scripts to package.json if not present
  if (pkgJson && pkgJsonPath && (!hasPostinstall || !hasWsScript)) {
    console.log('📝 Adding WebSocket scripts to package.json...');
    
    let modified = false;
    
    if (!pkgJson.scripts) {
      pkgJson.scripts = {};
    }
    
    if (!hasWsScript) {
      pkgJson.scripts.ws = "npx --yes next-ws-cli@latest patch -y";
      modified = true;
      debug('Added ws script to package.json');
    }
    
    if (!hasPostinstall) {
      const currentPostinstall = pkgJson.scripts.postinstall || "";
      pkgJson.scripts.postinstall = currentPostinstall 
        ? `${currentPostinstall} && npm run ws -- -y` 
        : "npm run ws -- -y";
      modified = true;
      debug('Added/updated postinstall script in package.json');
    }
    
    if (modified) {
      try {
        fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
        console.log('✅ Package.json updated with WebSocket scripts.');
        debug('Successfully updated package.json with WebSocket scripts');
      } catch (error) {
        console.warn('⚠️ Failed to update package.json automatically.');
        console.warn('   Please add the following scripts manually:');
        console.warn('   "ws": "npx --yes next-ws-cli@latest patch -y"');
        console.warn('   "postinstall": "npm run ws -- -y"');
        debug(`Error updating package.json: ${error}`);
      }
    } else {
      debug('No changes needed to package.json scripts');
    }
  }
};

// Generate Docker-specific configuration (similar to generateGitpodConfig)
async function generateDockerConfig() {
  // Generate secure random secrets
  const crypto = await import('crypto');
  const generateSecret = (length: number = 32) => crypto.randomBytes(length).toString('hex');
  
  return {
    variant: 'docker',
    variants: {
      docker: {
        host: 'docker',
        hasura: 'docker',
        pg: 'docker',
        storage: 'docker',
        nextAuthSecrets: 'docker'
      }
    },
    hosts: {
      docker: {
        port: 3000,
        url: 'http://localhost:3000',
        clientOnly: false,
        jwtAuth: false,
        jwtForce: false,
        watchtower: true
      }
    },
    hasura: {
      docker: {
        url: 'http://localhost:8080/v1/graphql',
        secret: generateSecret(32),
        jwtSecret: JSON.stringify({
          type: 'HS256',
          key: generateSecret(32)
        }),
        eventSecret: generateSecret(32)
      }
    },
    pg: {
      docker: {
        url: 'postgres://postgres:postgrespassword@postgres:5432/hasyx?sslmode=disable'
      }
    },
    storage: {
      docker: {
        provider: 'minio',
        bucket: 'hasyx',
        region: 'us-east-1',
        useLocal: true,
        endpoint: 'http://hasyx-minio:9000',
        accessKeyId: 'minioadmin',
        secretAccessKey: 'minioadmin',
        forcePathStyle: true,
        useAntivirus: false,
        useImageManipulation: false
      }
    },
    nextAuthSecrets: {
      docker: {
        secret: generateSecret(32),
        url: 'http://localhost:3000'
      }
    }
  };
}

// Command implementations
export const initCommand = async (options: any, packageName: string = 'hasyx') => {
  debug('Executing "init" command.');
  debug('Options:', options);
  const forceReinit = options.reinit === true || options.force === true;
  if (forceReinit) {
    debug('Reinit/Force mode: Will replace all files, even those that would normally only be created if missing');
    console.log('🔄 Force mode: forcing replacement of all files');
  }
  console.log(`🚀 Initializing ${packageName}...`);
  const projectRoot = process.cwd();
  const targetDir = projectRoot;
  debug(`Target directory for init: ${targetDir}`);

  // Get project name from package.json or git repository
  let projectName = packageName; // Default fallback
  let pkgJson: any = {};
  const pkgJsonPath = path.join(projectRoot, 'package.json');
  let packageJsonExists = false;
  
  try {
    if (fs.existsSync(pkgJsonPath)) {
      pkgJson = await fs.readJson(pkgJsonPath);
      packageJsonExists = true;
      
      if (pkgJson.name) {
        projectName = pkgJson.name;
        debug(`Found project name in package.json: ${projectName}`);
      } else {
        // Если имя не задано, получаем из git
        const gitProjectName = getProjectNameFromGit();
        projectName = gitProjectName;
        pkgJson.name = gitProjectName;
        debug(`No project name found in package.json, using git repository name: ${projectName}`);
      }
    } else {
      // Если package.json не существует, создаем базовый
      const gitProjectName = getProjectNameFromGit();
      projectName = gitProjectName;
      pkgJson = {
        name: gitProjectName,
        version: '0.0.0',
        description: `A brilliant ${gitProjectName} project - turning ideas into reality`,
        private: true,
        scripts: {},
        dependencies: {},
        devDependencies: {}
      };
      debug(`Created new package.json with project name: ${projectName}`);
    }
  } catch (error) {
    console.warn(`⚠️ Could not read package.json to determine project name, using git repository name`);
    debug(`Error reading package.json: ${error}`);
    
    const gitProjectName = getProjectNameFromGit();
    projectName = gitProjectName;
    pkgJson = {
      name: gitProjectName,
      version: '0.0.0',
      description: `A brilliant ${gitProjectName} project - turning ideas into reality`,
      private: true,
      scripts: {},
      dependencies: {},
      devDependencies: {}
    };
  }

  // Prevent hasyx from initializing itself
  // Only block if we're actually in a hasyx project directory (has package.json with hasyx name)
  const hasPackageJson = fs.existsSync(pkgJsonPath);
  
  if (projectName === packageName && hasPackageJson) {
    console.warn(
      `❌ Error: Running \`${packageName} init\` within the \`${packageName}\` project itself is not allowed.\n` +
      'This command is intended to initialize hasyx in other projects.\n' +
      `If you are developing ${packageName}, its structure is already initialized.`
    );
    debug(`Attempted to run \`${packageName} init\` on the \`${packageName}\` project. Operation aborted.`);
    process.exit(1);
  }

  // Files to create or replace (always overwrite) — keep only non-app items, app copied as a whole below
  const filesToCreateOrReplace = {
            '.github/workflows/workflow.yml': '.github/workflows/workflow.yml',
  } as Record<string, string>;

  // Files to create if not exists (or force replace if --reinit)
  const filesToCreateIfNotExists: Record<string, string> = {
    // Non-app files that we still want to seed when missing
    'schema.tsx': 'schema.tsx',
    'public/favicon.ico': 'public/favicon.ico',
    'public/logo.svg': 'public/logo.svg',
    'public/hasura-schema.json': 'public/hasura-schema.json',
    'Dockerfile': 'Dockerfile',
    'Dockerfile.postgres': 'Dockerfile.postgres',
    '.dockerignore': '.dockerignore',
    'vercel.json': 'vercel.json',
    'babel.jest.config.mjs': 'babel.jest.config.mjs',
    'jest.config.mjs': 'jest.config.mjs',
    'jest.setup.js': 'jest.setup.js',
    'next.config.ts': 'next.config.ts',
    'i18n/en.json': 'i18n/en.json',
    'i18n/ru.json': 'i18n/ru.json',
    'capacitor.config.ts': 'capacitor.config.ts',
    'postcss.config.mjs': 'postcss.config.mjs',
    'components.json': 'components.json',
    'tsconfig.json': 'tsconfig.json',
    'tsconfig.lib.json': 'tsconfig.lib.json',
    '.vscode/extensions.json': '.vscode/extensions.json',
    // Events created if missing (migrations are copied as a whole earlier)
    'events/notify.json': 'events/notify.json',
    'events/events.json': 'events/events.json',
    'events/subscription-billing.json': 'events/subscription-billing.json',
    'events/logs-diffs.json': 'events/logs-diffs.json',
    'events/github-issues.json': 'events/github-issues.json',
  };

  // Ensure directories exist
  const ensureDirs = [
    '.github/workflows',
    '.vscode',
    'public',
    'events',
    'lib',
  ];

  debug('Ensuring directories exist:', ensureDirs);
  for (const dir of ensureDirs) {
    const fullDirPath = path.join(targetDir, dir);
    debug(`Ensuring directory: ${fullDirPath}`);
    await fs.ensureDir(fullDirPath);
    console.log(`✅ Ensured directory exists: ${dir}`);
  }

  // Copy entire app directory from hasyx package into target project
  try {
    const hasyxRoot = path.resolve(__dirname, '../');
    const appSrc = path.join(hasyxRoot, 'app');
    const appDest = path.join(targetDir, 'app');
    await copyDirectoryRecursive(appSrc, appDest, { overwrite: forceReinit });
    console.log(`✅ ${forceReinit ? 'Replaced' : 'Created'}: app (copied entire directory)`);
  } catch (error) {
    console.warn(`⚠️ Failed to copy app directory: ${error}`);
  }

  // Copy entire migrations directory from hasyx package into target project
  try {
    const hasyxRoot = path.resolve(__dirname, '../');
    const migrationsSrc = path.join(hasyxRoot, 'migrations');
    const migrationsDest = path.join(targetDir, 'migrations');
    await copyDirectoryRecursive(migrationsSrc, migrationsDest, { overwrite: forceReinit });
    console.log(`✅ ${forceReinit ? 'Replaced' : 'Created'}: migrations (copied entire directory)`);
  } catch (error) {
    console.warn(`⚠️ Failed to copy migrations directory: ${error}`);
  }

  // Create/Replace files (non-app)
  debug('Processing files to create or replace (non-app)...');
  for (const [targetPath, templateName] of Object.entries(filesToCreateOrReplace)) {
    const fullTargetPath = path.join(targetDir, targetPath);
    try {
      await fs.ensureDir(path.dirname(fullTargetPath));
      const templateContent = getTemplateContent(templateName);
      await fs.writeFile(fullTargetPath, templateContent);
      console.log(`✅ Created/Replaced: ${targetPath}`);
    } catch (error) {
      console.error(`❌ Failed to process ${targetPath} from template ${templateName}: ${error}`);
    }
  }
  // Create a minimal .env file to avoid errors during initialization
  try {
    const envPath = path.join(targetDir, '.env');
    if (!fs.existsSync(envPath)) {
      const minimalEnvContent = `# Environment variables for ${projectName}
# This file was auto-generated by hasyx init
# Please configure your environment variables here

# Database
# DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# NextAuth
# NEXTAUTH_SECRET=your-secret-here
# NEXTAUTH_URL=http://localhost:3000

# Hasura
# HASURA_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
# HASURA_GRAPHQL_ADMIN_SECRET=your-admin-secret

# OAuth Providers (configure as needed)
# GITHUB_ID=your-github-client-id
# GITHUB_SECRET=your-github-client-secret

# Other services
# TELEGRAM_BOT_TOKEN=your-telegram-bot-token
`;
      await fs.writeFile(envPath, minimalEnvContent);
      console.log('✅ Created: .env (with template variables)');
      debug('Created minimal .env file with template variables');
    } else {
      console.log('⏩ Skipped (already exists): .env');
      debug('.env file already exists, skipped creation');
    }
  } catch (error) {
    console.warn(`⚠️ Failed to create .env file: ${error}`);
    debug(`Error creating .env file: ${error}`);
  }

  // Special handling for CONTRIBUTING.md
  debug('Special handling for CONTRIBUTING.md');
  try {
    const contributingPath = path.join(targetDir, 'CONTRIBUTING.md');
    const hasContributing = fs.existsSync(contributingPath);
    const hasyxContributingContent = getTemplateContent('CONTRIBUTING.md');
    
    if (hasContributing) {
      const existingContent = fs.readFileSync(contributingPath, 'utf-8');
      const hasyxHeaderIndex = existingContent.indexOf('# Contributing to Hasyx based projects');
      
      if (hasyxHeaderIndex !== -1) {
        const updatedContent = existingContent.substring(0, hasyxHeaderIndex) + hasyxContributingContent;
        fs.writeFileSync(contributingPath, updatedContent);
        console.log('✅ Updated Hasyx section in existing CONTRIBUTING.md');
        debug('Updated Hasyx section in existing CONTRIBUTING.md');
      } else {
        const updatedContent = existingContent + '\n\n' + hasyxContributingContent;
        fs.writeFileSync(contributingPath, updatedContent);
        console.log('✅ Appended Hasyx contribution guidelines to existing CONTRIBUTING.md');
        debug('Appended Hasyx contribution guidelines to existing CONTRIBUTING.md');
      }
    } else {
      const newContent = '# Contributing\n\nWrite development rules for your repository here\n\n' + hasyxContributingContent;
      fs.writeFileSync(contributingPath, newContent);
      console.log('✅ Created new CONTRIBUTING.md with project and Hasyx sections');
      debug('Created new CONTRIBUTING.md with project and Hasyx sections');
    }
  } catch (error) {
    console.error(`❌ Failed to process CONTRIBUTING.md: ${error}`);
    debug(`Error processing CONTRIBUTING.md: ${error}`);
  }

  // Create .gitpod.yml for Gitpod integration
  debug('Creating .gitpod.yml for Gitpod integration');
  try {
    const gitpodPath = path.join(targetDir, '.gitpod.yml');
    const gitpodContent = `# Gitpod configuration for ${projectName}
# This file was auto-generated by hasyx init

tasks:
  - name: Setup Hasyx
    command: |
      echo "🚀 Setting up Hasyx in Gitpod..."
      npm install
      npm run gitpod
      echo "✅ Hasyx setup completed!"
      echo "🚀 Starting infrastructure services..."
      docker compose up -d
      echo "📋 Applying database migrations..."
      npm run migrate
      echo "🎉 Setup complete! Run 'npm run dev' to start development server"
      echo "💡 Note: App runs locally, Docker is used only for infrastructure"
    init: |
      npm install
      npm run gitpod

ports:
  - port: 3000
    onOpen: open-preview
  - port: 8080
    onOpen: open-preview
  - port: 9000
    onOpen: open-preview
  - port: 9001
    onOpen: open-preview

vscode:
  extensions:
    - ms-vscode.vscode-typescript-next
    - bradlc.vscode-tailwindcss
    - esbenp.prettier-vscode
    - ms-vscode.vscode-json
    - ms-vscode.vscode-docker
`;
    
    await fs.writeFile(gitpodPath, gitpodContent);
    console.log('✅ Created: .gitpod.yml (for Gitpod integration)');
    debug('Created .gitpod.yml for Gitpod integration');
  } catch (error) {
    console.warn(`⚠️ Failed to create .gitpod.yml: ${error}`);
    debug(`Error creating .gitpod.yml: ${error}`);
  }

  // Special handling for tsconfig files to replace 'hasyx' with project name
  const tsConfigFiles = ['tsconfig.json', 'tsconfig.lib.json'];
  debug(`Processing tsconfig files with project name replacement: ${projectName}`);
  
  for (const configFile of tsConfigFiles) {
    const fullTargetPath = path.join(targetDir, configFile);
    const exists = fs.existsSync(fullTargetPath);
    const shouldProcess = !exists || forceReinit;
    
    debug(`Processing ${configFile} (${exists ? (forceReinit ? 'Force Replace' : 'Skip') : 'Create'})`);
    
    if (shouldProcess) {
      try {
        let templateContent = getTemplateContent(configFile);
        
        // Replace package name mapping for the child project; do not shadow 'hasyx' package imports in child tsconfig
        templateContent = templateContent.replace(
          /"hasyx":\s*\[\s*"\.\/lib\/index\.ts"\s*\]/g,
          `"${projectName}": ["./lib/index.ts"]`
        );
        // Add projectName/* mapping; do not inject local hasyx/* mapping in child project
        templateContent = templateContent.replace(
          /"hasyx\/\*":\s*\[\s*"\.\/\*"\s*\]/g,
          `"${projectName}/*": ["./*"]`
        );
        
        await fs.writeFile(fullTargetPath, templateContent);
        console.log(`✅ ${exists && forceReinit ? 'Replaced' : 'Created'}: ${configFile} (with project name: ${projectName})`);
        debug(`Successfully wrote ${exists && forceReinit ? 'replaced' : 'new'} file with project name: ${fullTargetPath}`);
      } catch (error) {
        console.error(`❌ Failed to ${exists && forceReinit ? 'replace' : 'create'} ${configFile}: ${error}`);
        debug(`Error processing tsconfig file ${fullTargetPath}: ${error}`);
      }
      
      if (configFile in filesToCreateIfNotExists) {
        delete (filesToCreateIfNotExists as Record<string, string>)[configFile];
      }
    }
  }

  // Create files if they don't exist (or force replace if --reinit)
  debug('Processing remaining files to create if not exists... (or forced replace if reinit)');
  for (const [targetPath, templateName] of Object.entries(filesToCreateIfNotExists)) {
    const fullTargetPath = path.join(targetDir, targetPath);
    const exists = fs.existsSync(fullTargetPath);
    debug(`Processing ${targetPath} -> ${templateName} (${exists ? (forceReinit ? 'Force Replace' : 'Skip') : 'Create'})`);
    
    if (!exists || forceReinit) {
        debug(`File ${exists ? 'exists but forcing replacement' : 'does not exist, creating'}: ${fullTargetPath}`);
        if (targetPath.endsWith('favicon.ico')) {
           const templatePath = path.join(path.resolve(__dirname, '../'), templateName);
           debug(`Copying binary file from template: ${templatePath}`);
           try {
              await fs.ensureDir(path.dirname(fullTargetPath));
              await fs.copyFile(templatePath, fullTargetPath);
              console.log(`✅ ${exists && forceReinit ? 'Replaced' : 'Created'}: ${targetPath}`);
              debug(`Successfully copied binary file: ${fullTargetPath}`);
           } catch (copyError) {
              console.warn(`⚠️ Could not copy favicon template ${templateName}: ${copyError}`);
              debug(`Error copying binary file ${templatePath} to ${fullTargetPath}: ${copyError}`);
           }
        } else {
          try {
              await fs.ensureDir(path.dirname(fullTargetPath));
              const templateContent = getTemplateContent(templateName);
              await fs.writeFile(fullTargetPath, templateContent);
              console.log(`✅ ${exists && forceReinit ? 'Replaced' : 'Created'}: ${targetPath}`);
              debug(`Successfully wrote ${exists && forceReinit ? 'replaced' : 'new'} file: ${fullTargetPath}`);
          } catch (error) {
             console.error(`❌ Failed to ${exists && forceReinit ? 'replace' : 'create'} ${targetPath} from template ${templateName}: ${error}`);
             debug(`Error writing file ${fullTargetPath}: ${error}`);
          }
        }
    } else {
      console.log(`⏩ Skipped (already exists): ${targetPath}`);
      debug(`File already exists, skipped: ${fullTargetPath}`);
    }
  }

  // Copy staged scaffolds (_lib and _components) if present in package
  try {
    const pkgRoot = path.resolve(__dirname, '../');
    const stagedLib = path.join(pkgRoot, '_lib');
    const stagedComponents = path.join(pkgRoot, '_components');
    if (fs.existsSync(stagedLib)) {
      await copyDirectoryRecursive(stagedLib, path.join(targetDir, 'lib'), { overwrite: forceReinit });
      console.log(`✅ ${forceReinit ? 'Replaced' : 'Created'}: lib (from _lib)`);
      // copy staged dotfiles from _lib root to project root if exist
      for (const name of ['.gitignore', '.npmignore', '.npmrc']) {
        const src = path.join(stagedLib, name);
        const dst = path.join(targetDir, name);
        if (fs.existsSync(src) && (!fs.existsSync(dst) || forceReinit)) {
          await fs.copy(src, dst, { overwrite: true });
          console.log(`✅ ${forceReinit ? 'Replaced' : 'Created'}: ${name}`);
        }
      }
    }
    if (fs.existsSync(stagedComponents)) {
      // Copy only whitelisted subpaths from _components
      const whitelist = [
        'sidebar',
        'entities',
      ];
      for (const sub of whitelist) {
        const src = path.join(stagedComponents, sub);
        if (!fs.existsSync(src)) continue;
        const dst = path.join(targetDir, 'components', sub);
        await copyDirectoryRecursive(src, dst, { overwrite: forceReinit });
      }
      console.log(`✅ ${forceReinit ? 'Replaced' : 'Created'}: components/sidebar, components/entities (from _components)`);
    }
  } catch (e) {
    console.warn(`⚠️ Failed to copy staged templates (_lib/_components): ${e}`);
  }

  // Check for hasyx dependency
  debug(`Checking for ${packageName} dependency in package.json...`);
  try {
      const pkgJsonPath = path.join(projectRoot, 'package.json');
      const pkgJson = await fs.readJson(pkgJsonPath);
      debug('Read package.json content:', pkgJson);
      if (!pkgJson.dependencies?.[packageName] && !pkgJson.devDependencies?.[packageName]) {
          console.warn(`
⚠️ Warning: '${packageName}' package not found in your project dependencies.
  Please install it manually: npm install ${packageName}
          `);
          debug(`${packageName} dependency not found.`);
      } else {
           console.log(`✅ '${packageName}' package found in dependencies.`);
           debug(`${packageName} dependency found.`);
      }
  } catch (err) {
       console.warn(`⚠️ Could not check package.json for ${packageName} dependency.`);
       debug(`Error checking package.json: ${err}`);
  }

  // Apply the WebSocket patch
  ensureWebSocketSupport(projectRoot);

  // Ensure required npm scripts and overrides are set in package.json
  // Overrides ensure Zod 4.x is used instead of Zod 3.x that some dependencies require
  try {
    console.log('📝 Checking and updating npm scripts and overrides in package.json...');
    const pkgJsonPath = path.join(projectRoot, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = await fs.readJson(pkgJsonPath);

      // Update basic fields if they are missing
      let basicFieldsModified = false;
      
      if (!pkgJson.name) {
        pkgJson.name = projectName;
        basicFieldsModified = true;
      }
      
      if (!pkgJson.version) {
        pkgJson.version = '0.0.0';
        basicFieldsModified = true;
      }
      
      if (!pkgJson.description) {
        pkgJson.description = `A brilliant ${pkgJson.name || projectName} project - turning ideas into reality`;
        basicFieldsModified = true;
      }
      
      if (basicFieldsModified) {
        await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
        console.log('✅ Updated package.json with missing basic fields');
        debug('Updated package.json with basic fields');
      }

    if (!pkgJson.engine) {
      pkgJson.engine = {
        node: "^22.14",
      };
    }

      if (!pkgJson.scripts) {
        pkgJson.scripts = {};
      }

      // Add overrides to ensure Zod 4.x is used (required for hasyx functionality)
      if (!pkgJson.overrides) {
        pkgJson.overrides = {};
      }
      pkgJson.overrides.zod = "^4.0.15";
      
      const requiredScripts = {
        "test": "npm run unbuild; NODE_OPTIONS=\"--experimental-vm-modules\" jest --verbose --runInBand",
        "build": `NODE_ENV=production npx -y ${packageName} build`,
        "unbuild": `npx -y ${packageName} unbuild`,
        "start": `NODE_ENV=production NODE_OPTIONS=\"--experimental-vm-modules\" npx -y ${packageName} start`,
        "dev": `NODE_OPTIONS=\"--experimental-vm-modules\" npx -y ${packageName} dev`,
        "client": `npx ${packageName} client`,
        "build:css": "tailwindcss -i ./app/globals.css -o ./lib/styles.css",
        "doc:build": `NODE_OPTIONS=\"--experimental-vm-modules\" npx ${packageName} doc`,
        "ws": "npx --yes next-ws-cli@latest patch -y",
        "postinstall": "npm run ws -- -y",
        "migrate": `npx ${packageName} migrate`,
        "unmigrate": `npx ${packageName} unmigrate`,
        "events": `NODE_OPTIONS=\"--experimental-vm-modules\" npx ${packageName} events`,
        "schema": `npx ${packageName} schema`,
        "vercel": `npx ${packageName} vercel`,
        "github": `npx ${packageName} github`,
        "init:android": "node -e \"process.exit(require('fs').existsSync('android')?0:1)\" || npx cap add android",
        "init:ios": "node -e \"process.exit(require('fs').existsSync('ios/App')?0:1)\" || npx cap add ios",
        "build:android": "npm run init:android && npm run client && npm run cli -- assets && npx cap sync android",
        "open:android": "npx cap open android",
        "build:ios": "npm run init:ios && npm run client && npm run cli -- assets && npx cap sync ios",
        "open:ios": "npx cap open ios",
        "npm-publish": "npm run build && npm publish",
        "cli": `NODE_OPTIONS=\"--experimental-vm-modules\" npx ${packageName}`,
        "telegram": `NODE_OPTIONS=\"--experimental-vm-modules\" npx ${packageName} telegram`,
        "js": `NODE_OPTIONS=\"--experimental-vm-modules\" npx ${packageName} js`,
        "tsx": `NODE_OPTIONS=\"--experimental-vm-modules\" npx ${packageName} tsx`,
        "logs": `npx ${packageName} logs`,
        "logs-diffs": `npx ${packageName} logs-diffs`,
        "logs-states": `npx ${packageName} logs-states`,
        "config": `npx ${packageName} config`,
        "validation": `npx ${packageName} validation define`,
        "env": `npx ${packageName} env`,
        "gitpod": `npx ${packageName} gitpod`
      };
      
      // Ensure React runtime dependencies are present in child project
      const requiredDependencies: Record<string, string> = {
        react: "19.1.1",
        "react-dom": "19.1.1",
      };
      
      let scriptsModified = false;
      let overridesModified = false;
      let dependenciesModified = false;
      let devDependenciesModified = false;
      
      for (const [scriptName, scriptValue] of Object.entries(requiredScripts)) {
        if (!pkgJson.scripts[scriptName] || pkgJson.scripts[scriptName] !== scriptValue) {
          pkgJson.scripts[scriptName] = scriptValue;
          scriptsModified = true;
        }
      }

      // Add or update required dependencies; move from devDependencies if necessary
      if (!pkgJson.dependencies) {
        pkgJson.dependencies = {};
      }
      for (const [depName, depVersion] of Object.entries(requiredDependencies)) {
        const currentDepVersion: string | undefined = pkgJson.dependencies[depName];
        const currentDevDepVersion: string | undefined = pkgJson.devDependencies?.[depName];
        if (currentDevDepVersion) {
          delete pkgJson.devDependencies[depName];
        }
        if (!currentDepVersion || currentDepVersion !== depVersion || currentDevDepVersion) {
          pkgJson.dependencies[depName] = depVersion;
          dependenciesModified = true;
        }
      }

      // Ensure required devDependencies for Jest + ts-jest are present in child project
      const requiredDevDependencies: Record<string, string> = {
        jest: "29.7.0",
        "ts-jest": "29.1.2",
        "@types/jest": "29.5.12",
      };

      if (!pkgJson.devDependencies) {
        pkgJson.devDependencies = {};
      }
      for (const [depName, depVersion] of Object.entries(requiredDevDependencies)) {
        const currentDevDepVersion: string | undefined = pkgJson.devDependencies[depName];
        if (!currentDevDepVersion || currentDevDepVersion !== depVersion) {
          pkgJson.devDependencies[depName] = depVersion;
          devDependenciesModified = true;
        }
      }

      // Check if overrides need to be updated
      if (!pkgJson.overrides?.zod || pkgJson.overrides.zod !== "^4.0.15") {
        if (!pkgJson.overrides) {
          pkgJson.overrides = {};
        }
        pkgJson.overrides.zod = "^4.0.15";
        overridesModified = true;
      }
      
      if (scriptsModified || overridesModified || dependenciesModified || devDependenciesModified) {
        await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
        if (scriptsModified && overridesModified && dependenciesModified && devDependenciesModified) {
          console.log('✅ Required npm scripts, overrides, and dependencies updated in package.json.');
        } else if (scriptsModified) {
          console.log('✅ Required npm scripts updated in package.json.');
        } else if (overridesModified) {
          console.log('✅ Required overrides updated in package.json.');
        } else if (dependenciesModified) {
          console.log('✅ Required dependencies updated in package.json.');
        } else if (devDependenciesModified) {
          console.log('✅ Required devDependencies updated in package.json.');
        }
      } else {
        console.log('ℹ️ Required npm scripts and overrides already present in package.json.');
      }
    }
  } catch (error) {
    console.warn('⚠️ Failed to update npm scripts in package.json:', error);
    debug(`Error updating npm scripts in package.json: ${error}`);
  }

  // Do not auto-install dependencies here; use npm ci in the child project

  // Install/Update hasyx itself (allow override source via env)
  const localTgz = process.env.HASYX_INSTALL_TGZ;
  const localDir = process.env.HASYX_INSTALL_DIR;
  const installArg = localTgz && fs.existsSync(path.resolve(targetDir, localTgz))
    ? path.resolve(targetDir, localTgz)
    : (localDir && fs.existsSync(path.resolve(targetDir, localDir))
      ? path.resolve(targetDir, localDir)
      : `${packageName}@latest`);
  console.log(`📦 Ensuring ${packageName} is installed (${installArg === `${packageName}@latest` ? 'registry' : 'local'})...`);
  debug(`Running command: npm install ${installArg} --save`);
  const installHasyxResult = spawn.sync('npm', ['install', installArg, '--save'], {
    stdio: 'inherit',
    cwd: projectRoot,
  });
  if (installHasyxResult.error) {
    console.error(`❌ Failed to install/update ${packageName}:`, installHasyxResult.error);
    debug(`npm install ${packageName}@latest --save failed to start: ${installHasyxResult.error}`);
    console.warn(`⚠️ Please try running "npm install ${packageName}@latest --save" manually.`);
  } else if (installHasyxResult.status !== 0) {
    console.error(`❌ npm install ${packageName}@latest --save process exited with status ${installHasyxResult.status}`);
    debug(`npm install ${packageName}@latest --save exited with non-zero status: ${installHasyxResult.status}`);
    console.warn(`⚠️ Please try running "npm install ${packageName}@latest --save" manually.`);
  } else {
    console.log(`✅ ${packageName} package is up to date.`);
    debug(`npm install ${packageName}@latest --save successful.`);
  }

  // Create hasyx.config.json if it doesn't exist
  const configPath = path.join(projectRoot, 'hasyx.config.json');
  if (!fs.existsSync(configPath)) {
    console.log('📝 Creating hasyx.config.json with Docker configuration...');
    try {
      const dockerConfig = await generateDockerConfig();
      await fs.writeJson(configPath, dockerConfig, { spaces: 2 });
      console.log('✅ hasyx.config.json created successfully');
      
      // Generate .env and docker-compose.yml using existing functions
      console.log('📝 Generating .env and docker-compose.yml...');
      await generateEnvAndDockerCompose();
    } catch (error) {
      console.warn('⚠️ Failed to create hasyx.config.json:', error);
      debug(`Error creating hasyx.config.json: ${error}`);
    }
  } else {
    debug('hasyx.config.json already exists, skipping creation');
  }

  // Documentation generation removed

  console.log(`✨ ${packageName} initialization complete!`);

  console.log('👉 Next steps:');
  console.log('   1. Fill in your .env file with necessary secrets (Hasura, NextAuth, OAuth, etc.).');
  console.log(`   2. Apply Hasura migrations and metadata if not already done. You can use \`npx ${packageName} migrate\`.`);
  console.log(`   3. Generate Hasura schema and types using \`npx ${packageName} schema\`.`);
  console.log(`   4. Run \`npx ${packageName} dev\` to start the development server.`);
  debug('Finished "init" command.');
};

export const devCommand = () => {
  debug('Executing "dev" command.');
  const cwd = process.cwd();
  
  // Documentation generation removed
  
  console.log('🚀 Starting development server (using next dev --turbopack)...');
  const devArgs = ['next', 'dev', '--turbopack'];
  const portEnv = process.env.PORT || process.env.NEXT_PORT || process.env.APP_PORT;
  if (portEnv) {
    devArgs.push('-p', String(portEnv));
  }
  debug(`Running command: npx ${devArgs.join(' ')} in ${cwd}`);
  const result = spawn.sync('npx', devArgs, {
    stdio: 'inherit',
    cwd: cwd,
    env: { ...process.env, PORT: portEnv || process.env.PORT },
  });
  debug('next dev --turbopack result:', JSON.stringify(result, null, 2));
  if (result.error) {
    console.error('❌ Failed to start development server:', result.error);
    debug(`next dev failed to start: ${result.error}`);
    process.exit(1);
  }
  if (result.status !== 0) {
     console.error(`❌ Development server exited with status ${result.status}`);
     debug(`next dev exited with non-zero status: ${result.status}`);
     process.exit(result.status ?? 1);
  }
  debug('Finished "dev" command (likely interrupted).');
};

export const buildCommand = () => {
  debug('Executing "build" command.');
  const cwd = process.cwd();
  ensureWebSocketSupport(cwd);
  
  // Documentation generation removed
  
  console.log('🏗️ Building Next.js application...');
  debug(`Running command: npx next build --turbopack in ${cwd}`);
  const result = spawn.sync('npx', ['next', 'build', '--turbopack'], {
    stdio: 'inherit',
    cwd: cwd,
  });
  debug('next build --turbopack result:', JSON.stringify(result, null, 2));
   if (result.error) {
    console.error('❌ Build failed:', result.error);
    debug(`next build failed to start: ${result.error}`);
    process.exit(1);
  }
  if (result.status !== 0) {
     console.error(`❌ Build process exited with status ${result.status}`);
     debug(`next build exited with non-zero status: ${result.status}`);
     process.exit(result.status ?? 1);
  }
  console.log('✅ Build complete!');
  debug('Finished "build" command.');
};

export const startCommand = () => {
  debug('Executing "start" command.');
  const cwd = process.cwd();
  
  console.log('🛰️ Starting production server (using next start)...');
  const startArgs = ['next', 'start', '--turbopack'];
  const startPortEnv = process.env.PORT || process.env.NEXT_PORT || process.env.APP_PORT;
  if (startPortEnv) {
    startArgs.push('-p', String(startPortEnv));
  }
  debug(`Running command: npx ${startArgs.join(' ')} in ${cwd}`);
  const result = spawn.sync('npx', startArgs, {
    stdio: 'inherit',
    cwd: cwd,
    env: { ...process.env, PORT: startPortEnv || process.env.PORT },
  });
  debug('next start --turbopack result:', JSON.stringify(result, null, 2));
  if (result.error) {
    console.error('❌ Failed to start production server:', result.error);
    debug(`next start failed to start: ${result.error}`);
    process.exit(1);
  }
  if (result.status !== 0) {
     console.error(`❌ Production server exited with status ${result.status}`);
     debug(`next start exited with non-zero status: ${result.status}`);
     process.exit(result.status ?? 1);
  }
   debug('Finished "start" command (likely interrupted).');
};

export const buildClientCommand = async () => {
  debug('Executing "client" command via CLI.');
  const cwd = process.cwd();
  
  console.log('📦 Building Next.js application for client export...');
  debug('Running client build from current working directory:', cwd);
  
  try {
    await buildClient();
    console.log('✅ Client build completed successfully!');
    debug('Finished executing "client" command via CLI.');
  } catch (error) {
    console.error('❌ Client build failed:', error);
    debug(`Error in buildClient command: ${error}`);
    process.exit(1);
  }
};

export const migrateCommand = async (filter?: string) => {
  debug('Executing "migrate" command with filter:', filter);
  
  try {
    await migrate(filter);
    debug('Finished "migrate" command successfully.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    debug(`Error in migrate command: ${error}`);
    process.exit(1);
  }
};

export const unmigrateCommand = async (filter?: string) => {
  debug('Executing "unmigrate" command with filter:', filter);
  
  try {
    await unmigrate(filter);
    debug('Finished "unmigrate" command successfully.');
  } catch (error) {
    console.error('❌ Unmigration failed:', error);
    debug(`Error in unmigrate command: ${error}`);
    process.exit(1);
  }
};

export const schemaCommand = async () => {
  debug('Executing "schema" command.');
  console.log('🧬 Generating Hasura schema and types...');
  const projectRoot = process.cwd();
  const hasyxRoot = path.resolve(__dirname, '../');
  let success = true;

  const publicDir = path.join(projectRoot, 'public');
  const typesDir = path.join(projectRoot, 'types');
  debug(`Ensuring directories for schema command: ${publicDir}, ${typesDir}`);
  try {
      console.log(` ensuring directory: ${publicDir}`);
      await fs.ensureDir(publicDir);
      console.log(` ensuring directory: ${typesDir}`);
      await fs.ensureDir(typesDir);
      debug('Successfully ensured directories.');
  } catch (err) {
      console.error(`❌ Failed to ensure directories exist: ${err}`);
      debug(`Error ensuring directories: ${err}`);
      process.exit(1);
  }

  console.log('\n📄 Running hasura-schema generation...');
  try {
    await generateHasuraSchema();
    console.log('✅ Hasura schema generation completed successfully.');
    debug('hasura-schema generation successful.');
  } catch (error) {
    console.error('❌ Failed to generate Hasura schema:', error);
    debug(`hasura-schema generation failed: ${error}`);
    success = false;
  }

  if (success) {
    console.log('\n⌨️ Running GraphQL codegen...');
    const codegenConfigPath = path.join(hasyxRoot, 'lib', 'hasura-types.js');
    debug(`Codegen config path: ${codegenConfigPath}`);
    debug(`Running command: npx graphql-codegen --config ${codegenConfigPath} in cwd: ${projectRoot}`);
    const codegenResult = spawn.sync('npx', ['graphql-codegen', '--config', codegenConfigPath], {
      stdio: 'inherit',
      cwd: projectRoot,
    });
    debug('graphql-codegen result:', JSON.stringify(codegenResult, null, 2));

    if (codegenResult.error) {
      console.error('❌ Failed to run GraphQL codegen:', codegenResult.error);
      debug(`graphql-codegen failed to start: ${codegenResult.error}`);
      success = false;
    } else if (codegenResult.status !== 0) {
      console.error(`❌ GraphQL codegen process exited with status ${codegenResult.status}`);
       debug(`graphql-codegen exited with non-zero status: ${codegenResult.status}`);
      success = false;
    } else {
      console.log('✅ GraphQL codegen completed successfully.');
      debug('graphql-codegen successful.');
    }
  }

  if (success) {
    console.log('\n✨ Schema and types generation finished successfully!');
     debug('Finished "schema" command successfully.');
  } else {
    console.error('\n❌ Schema and types generation failed.');
    debug('Finished "schema" command with errors.');
    process.exit(1);
  }
};

// JS command
export const jsCommand = async (filePath: string | undefined, options: any) => {
  debug('Executing "js" command with filePath:', filePath, 'and options:', options);
  
  try {
    const { runJsEnvironment } = await import('./js');
    await runJsEnvironment(filePath, options.eval);
  } catch (error) {
    console.error('❌ Error executing JS environment:', error);
    debug('JS command error:', error);
    process.exit(1);
  }
};

// Ask command is now exported from ask.ts

/**
 * Ensures OPENROUTER_API_KEY is available, setting it up interactively if needed
 */
async function ensureOpenRouterApiKey() {
  if (process.env.OPENROUTER_API_KEY) return;
  console.log('🔑 OPENROUTER_API_KEY not found. Skipping interactive setup in this build.');
  console.log('   Set OPENROUTER_API_KEY in your .env if you intend to use OpenRouter.');
}

// TSX command
export const tsxCommand = async (filePath: string | undefined, options: any) => {
  debug('Executing "tsx" command with filePath:', filePath, 'and options:', options);
  
  try {
    const { runTsxEnvironment } = await import('./tsx');
    await runTsxEnvironment(filePath, options.eval);
  } catch (error) {
    console.error('❌ Error executing TSX environment:', error);
    debug('TSX command error:', error);
    process.exit(1);
  }
};

// Doc command
// doc command removed

// Helper function to validate environment variables for subdomain management
const validateSubdomainEnv = (): { domain: string; cloudflare: CloudflareConfig } => {
  const missingVars: string[] = [];
  
  const domain = process.env.HASYX_DNS_DOMAIN;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;
  
  if (!domain) missingVars.push('HASYX_DNS_DOMAIN');
  if (!apiToken) missingVars.push('CLOUDFLARE_API_TOKEN');
  if (!zoneId) missingVars.push('CLOUDFLARE_ZONE_ID');
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables for subdomain management:');
    missingVars.forEach(variable => {
      console.error(`   ${variable}`);
    });
    console.error('\n💡 Configure these via hasyx.config.json (dns/cloudflare) and regenerate .env');
    process.exit(1);
  }
  
  return {
    domain: domain!,
    cloudflare: {
      apiToken: apiToken!,
      zoneId: zoneId!,
      domain: domain!
    }
  };
};

// Subdomain list command
export const subdomainListCommand = async () => {
  debug('Executing "subdomain list" command');
  console.log('🌐 Listing DNS records...');
  
  try {
    const { cloudflare: config } = validateSubdomainEnv();
    const cloudflare = new CloudFlare(config);
    
    const records = await cloudflare.list();
    
    if (records.length === 0) {
      console.log('📭 No DNS records found for this domain.');
      return;
    }
    
    console.log(`\n📋 Found ${records.length} DNS record(s):`);
    console.log('═'.repeat(80));
    
    for (const record of records) {
      const subdomain = record.name === config.domain ? '@' : record.name.replace(`.${config.domain}`, '');
      const proxied = record.proxied ? '🟡 Proxied' : '🔴 Direct';
      
      console.log(`🌐 ${subdomain.padEnd(20)} → ${record.content.padEnd(15)} TTL:${record.ttl.toString().padEnd(6)} ${proxied}`);
    }
    
    console.log('═'.repeat(80));
    debug('Subdomain list command completed successfully');
  } catch (error) {
    console.error('❌ Failed to list DNS records:', error);
    debug(`Subdomain list command error: ${error}`);
    process.exit(1);
  }
};

// Subdomain define command
export const subdomainDefineCommand = async (subdomain: string, ip: string, port?: string) => {
  debug(`Executing "subdomain define" command: ${subdomain} -> ${ip}:${port || 'N/A'}`);
  
  if (!subdomain) {
    console.error('❌ Missing required argument: <subdomain>');
    console.error('Usage: npx hasyx subdomain define <subdomain> <ip> [port]');
    console.error('Example: npx hasyx subdomain define app1 149.102.136.233 3000');
    process.exit(1);
  }
  
  if (!ip) {
    console.error('❌ Missing required argument: <ip>');
    console.error('Usage: npx hasyx subdomain define <subdomain> <ip> [port]');
    console.error('Example: npx hasyx subdomain define app1 149.102.136.233 3000');
    process.exit(1);
  }
  
  // Basic IP validation
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (!ipRegex.test(ip)) {
    console.error('❌ Invalid IP address format');
    console.error('Example: 149.102.136.233');
    process.exit(1);
  }
  
  try {
    const { domain, cloudflare: cfConfig } = validateSubdomainEnv();
    const fullDomain = `${subdomain}.${domain}`;
    
    console.log(`🚀 Creating subdomain: ${fullDomain} → ${ip}${port ? `:${port}` : ''}`);
    
    // Initialize services
    const cloudflare = new CloudFlare(cfConfig);
    const ssl = new SSL({ email: process.env.LETSENCRYPT_EMAIL });
    const nginx = new Nginx();
    
    // Step 1: Create DNS record
    console.log('🌐 Creating DNS record...');
    try {
      await cloudflare.define(subdomain, { ip, ttl: 300, proxied: false });
      console.log('✅ DNS record created successfully');
    } catch (error) {
      console.error('❌ Failed to create DNS record:', error);
      process.exit(1);
    }
    
    // Step 2: Wait for DNS propagation and get SSL certificate (if port is provided)
    if (port) {
      console.log('⏳ Waiting for DNS propagation...');
      try {
        await ssl.wait(fullDomain, ip, 12);
        console.log('✅ DNS propagated successfully');
        
        console.log('🔒 Obtaining SSL certificate...');
        await ssl.define(fullDomain);
        console.log('✅ SSL certificate obtained');
      } catch (error) {
        console.warn('⚠️ SSL certificate creation failed:', error);
        console.warn('   You can try to obtain it manually later with: sudo certbot certonly --nginx -d ' + fullDomain);
      }
      
      // Step 3: Create Nginx configuration
      console.log('⚙️ Creating Nginx configuration...');
      try {
        const siteConfig = {
          serverName: fullDomain,
          proxyPass: `http://127.0.0.1:${port}`,
          ssl: true,
          sslCertificate: `/etc/letsencrypt/live/${fullDomain}/fullchain.pem`,
          sslCertificateKey: `/etc/letsencrypt/live/${fullDomain}/privkey.pem`
        };
        
        await nginx.define(fullDomain, siteConfig);
        console.log('✅ Nginx configuration created');
      } catch (error) {
        console.warn('⚠️ Nginx configuration failed:', error);
        console.warn('   You may need to configure Nginx manually');
      }
    }
    
    console.log(`\n🎉 Subdomain created successfully!`);
    console.log(`🌐 ${fullDomain} is now available`);
    if (port) {
      console.log(`🔗 https://${fullDomain} → http://127.0.0.1:${port}`);
    }
    
    debug('Subdomain define command completed successfully');
  } catch (error) {
    console.error('❌ Failed to create subdomain:', error);
    debug(`Subdomain define command error: ${error}`);
    process.exit(1);
  }
};

// Subdomain undefine command
export const subdomainUndefineCommand = async (subdomain: string) => {
  debug(`Executing "subdomain undefine" command: ${subdomain}`);
  
  if (!subdomain) {
    console.error('❌ Missing required argument: <subdomain>');
    console.error('Usage: npx hasyx subdomain undefine <subdomain>');
    console.error('Example: npx hasyx subdomain undefine app1');
    process.exit(1);
  }
  
  try {
    const { domain, cloudflare: cfConfig } = validateSubdomainEnv();
    const fullDomain = `${subdomain}.${domain}`;
    
    console.log(`🗑️ Removing subdomain: ${fullDomain}`);
    
    // Initialize services
    const cloudflare = new CloudFlare(cfConfig);
    const ssl = new SSL({ email: process.env.LETSENCRYPT_EMAIL });
    const nginx = new Nginx();
    
    // Step 1: Remove Nginx configuration
    console.log('⚙️ Removing Nginx configuration...');
    try {
      await nginx.undefine(fullDomain);
      console.log('✅ Nginx configuration removed');
    } catch (error) {
      console.warn('⚠️ Nginx configuration removal failed or not found:', error);
    }
    
    // Step 2: Remove SSL certificate
    console.log('🔒 Removing SSL certificate...');
    try {
      await ssl.undefine(fullDomain);
      console.log('✅ SSL certificate removed');
    } catch (error) {
      console.warn('⚠️ SSL certificate removal failed or not found:', error);
    }
    
    // Step 3: Remove DNS record
    console.log('🌐 Removing DNS record...');
    try {
      await cloudflare.undefine(subdomain);
      console.log('✅ DNS record removed');
    } catch (error) {
      console.warn('⚠️ DNS record removal failed or not found:', error);
    }
    
    console.log(`\n🎉 Subdomain ${fullDomain} removed successfully!`);
    debug('Subdomain undefine command completed successfully');
  } catch (error) {
    console.error('❌ Failed to remove subdomain:', error);
    debug(`Subdomain undefine command error: ${error}`);
    process.exit(1);
  }
};

// Docker list command
export const dockerListCommand = async () => {
  debug('Executing "docker ls" command');
  console.log('🐳 Listing Docker containers...');
  
  try {
    // Check Docker installation first
    const dockerResult = spawn.sync('docker', ['--version'], { encoding: 'utf-8' });
    if (dockerResult.status !== 0) {
      console.error('❌ Docker is not installed or not running');
      console.error('💡 Install Docker: https://docs.docker.com/engine/install/');
      process.exit(1);
    }
    
    const containers = await listContainers();
    
    if (containers.length === 0) {
      console.log('📭 No containers found for this project.');
      return;
    }
    
    console.log(`\n📋 Found ${containers.length} container(s):`);
    console.log('═'.repeat(80));
    
    for (const container of containers) {
      const portDisplay = container.port ? `:${container.port}` : '';
      console.log(`🐳 ${container.name.padEnd(30)} ${container.status.padEnd(20)} ${portDisplay}`);
      console.log(`   ${container.image}`);
    }
    
    console.log('═'.repeat(80));
    debug('Docker list command completed successfully');
  } catch (error) {
    console.error('❌ Failed to list containers:', error);
    debug(`Docker list command error: ${error}`);
    process.exit(1);
  }
};

// Docker define command  
export const dockerDefineCommand = async (port?: string) => {
  debug(`Executing "docker define" command with port: ${port || 'default'}`);
  
  try {
    // Check Docker installation first
    const dockerResult = spawn.sync('docker', ['--version'], { encoding: 'utf-8' });
    if (dockerResult.status !== 0) {
      console.error('❌ Docker is not installed or not running');
      console.error('💡 Install Docker: https://docs.docker.com/engine/install/');
      process.exit(1);
    }
    
    await defineContainer(port);
    debug('Docker define command completed successfully');
  } catch (error) {
    console.error('❌ Failed to create container:', error);
    debug(`Docker define command error: ${error}`);
    process.exit(1);
  }
};

// Docker undefine command
export const dockerUndefineCommand = async (port: string) => {
  debug(`Executing "docker undefine" command with port: ${port}`);
  
  if (!port) {
    console.error('❌ Missing required argument: <port>');
    console.error('Usage: npx hasyx docker undefine <port>');
    console.error('Example: npx hasyx docker undefine 3000');
    process.exit(1);
  }
  
  try {
    // Check Docker installation first
    const dockerResult = spawn.sync('docker', ['--version'], { encoding: 'utf-8' });
    if (dockerResult.status !== 0) {
      console.error('❌ Docker is not installed or not running');
      console.error('💡 Install Docker: https://docs.docker.com/engine/install/');
      process.exit(1);
    }
    
    await undefineContainer(port);
    debug('Docker undefine command completed successfully');
  } catch (error) {
    console.error('❌ Failed to remove container:', error);
    debug(`Docker undefine command error: ${error}`);
    process.exit(1);
  }
};

// Docker logs command
export const dockerLogsCommand = async (port: string, options: { tail?: string } = {}) => {
  debug(`Executing "docker logs" command for port: ${port}`);
  
  if (!port) {
    console.error('❌ Missing required argument: <port>');
    console.error('Usage: npx hasyx docker logs <port> [--tail <lines>]');
    console.error('Example: npx hasyx docker logs 3000 --tail 50');
    process.exit(1);
  }
  
  try {
    // Check Docker installation first
    const dockerResult = spawn.sync('docker', ['--version'], { encoding: 'utf-8' });
    if (dockerResult.status !== 0) {
      console.error('❌ Docker is not installed or not running');
      console.error('💡 Install Docker: https://docs.docker.com/engine/install/');
      process.exit(1);
    }
    
    const tail = options.tail ? parseInt(options.tail, 10) : 100;
    await showContainerLogs(port, tail);
    debug('Docker logs command completed successfully');
  } catch (error) {
    console.error('❌ Failed to show container logs:', error);
    debug(`Docker logs command error: ${error}`);
    process.exit(1);
  }
};

// Docker env command
export const dockerEnvCommand = async (port: string) => {
  debug(`Executing "docker env" command for port: ${port}`);
  
  if (!port) {
    console.error('❌ Missing required argument: <port>');
    console.error('Usage: npx hasyx docker env <port>');
    console.error('Example: npx hasyx docker env 3000');
    process.exit(1);
  }
  
  try {
    // Check Docker installation first
    const dockerResult = spawn.sync('docker', ['--version'], { encoding: 'utf-8' });
    if (dockerResult.status !== 0) {
      console.error('❌ Docker is not installed or not running');
      console.error('💡 Install Docker: https://docs.docker.com/engine/install/');
      process.exit(1);
    }
    
    await showContainerEnv(port);
    debug('Docker env command completed successfully');
  } catch (error) {
    console.error('❌ Failed to show container environment:', error);
    debug(`Docker env command error: ${error}`);
    process.exit(1);
  }
};

// Logs commands
export const logsCommand = async () => {
  debug('Executing "logs" command.');
  try {
    await processLogs();
  } catch (error) {
    console.error('❌ Failed to process logs configuration:', error);
    process.exit(1);
  }
};

export const logsDiffsCommand = async () => {
  debug('Executing "logs-diffs" command.');
  try {
    await processConfiguredDiffs();
  } catch (error) {
    console.error('❌ Failed to process logs-diffs configuration:', error);
    process.exit(1);
  }
};

export const logsStatesCommand = async () => {
  debug('Executing "logs-states" command.');
  try {
    await processConfiguredStates();
  } catch (error) {
    console.error('❌ Failed to process logs-states configuration:', error);
    process.exit(1);
  }
};

// Command descriptor functions
export const initCommandDescribe = (cmd: Command) => {
  return cmd
    .description('Initialize hasyx authentication and GraphQL proxy in a Next.js project.')
    .option('--reinit', 'Reinitialize all files, replacing even those that would normally only be created if missing')
    .option('--force', 'Alias for --reinit: force replacement of all files');
};

export const devCommandDescribe = (cmd: Command) => {
  return cmd.description('Starts the Next.js development server with WebSocket support.');
};

export const buildCommandDescribe = (cmd: Command) => {
  return cmd.description('Builds the Next.js application for production.');
};

export const startCommandDescribe = (cmd: Command) => {
  return cmd.description('Starts the Next.js production server.');
};

export const buildClientCommandDescribe = (cmd: Command) => {
  return cmd.description('Builds the Next.js application for static client export (e.g., for Capacitor).');
};

export const migrateCommandDescribe = (cmd: Command) => {
  return cmd
    .description('Run UP migration scripts located in subdirectories of ./migrations in alphabetical order.')
    .argument('[filter]', 'Optional filter to only run migrations containing this substring in their directory name');
};

export const unmigrateCommandDescribe = (cmd: Command) => {
  return cmd
    .description('Run DOWN migration scripts located in subdirectories of ./migrations in reverse alphabetical order.')
    .argument('[filter]', 'Optional filter to only run migrations containing this substring in their directory name');
};

export const schemaCommandDescribe = (cmd: Command) => {
  return cmd.description('Generate Hasura schema files and GraphQL types.');
};

export const docCommandDescribe = (cmd: Command) => {
  return cmd
    .description('Build documentation from markdown files')
    .option('-d, --dir <directory>', 'Root directory to scan for markdown files', process.cwd());
};

export const assetsCommandDescribe = (cmd: Command) => {
  return cmd.description('Generate app icons and splash screens from logo.svg for web, Capacitor, and Electron apps.');
};

export const eventsCommandDescribe = (cmd: Command) => {
  return cmd
    .description('Synchronize Hasura event triggers with local definitions')
    .option('--init', 'Create default event trigger definitions in the events directory')
    .option('--clean', 'Remove security headers from event definitions - they will be added automatically during sync');
};

export const unbuildCommandDescribe = (cmd: Command) => {
  return cmd.description('Remove compiled files (.js, .d.ts) from lib, components, and hooks directories only (preserves types directory), and delete tsconfig.lib.tsbuildinfo.');
};

// assist command removed

export const telegramCommandDescribe = (cmd: Command) => {
  const group = cmd
    .description('Telegram bot operations');
  group.addHelpText('after', '\nLegacy: Deprecated interactive setup is removed; use subcommands.');
  group
    .command('sync')
    .description('Sync Telegram settings from current variant: set webhook, menu button, and commands')
    .action(async () => {
      // Ensure .env exists and load it
      try {
        const { generateEnv } = await import('./config/env');
        await generateEnv();
      } catch {}
      const parse = (fp: string) => {
        const env: Record<string,string> = {};
        try {
          const content = require('fs').readFileSync(fp, 'utf-8');
          for (const line of content.split('\n')) {
            const t = line.trim();
            if (!t || t.startsWith('#')) continue;
            const i = t.indexOf('=');
            if (i <= 0) continue;
            env[t.slice(0,i).trim()] = t.slice(i+1).trim();
          }
        } catch {}
        return env;
      };
      const env = parse('.env');
      const baseUrl = env.NEXT_PUBLIC_API_URL || env.NEXT_PUBLIC_MAIN_URL || env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        console.error('❌ Base URL not found in .env (NEXT_PUBLIC_API_URL/NEXT_PUBLIC_MAIN_URL/NEXT_PUBLIC_BASE_URL)');
        process.exit(1);
      }
      const webhookUrl = `${baseUrl.replace(/\/$/, '')}/api/telegram_bot`;
      const projectName = env.NEXT_PUBLIC_APP_NAME || 'App';
      try {
        await tgCalibrate({ webhookUrl, projectName });
        console.log(`✅ Telegram synchronized: webhook=${webhookUrl}`);
      } catch (e) {
        console.error('❌ Telegram sync failed:', e);
        process.exit(1);
      }
    });
  group
    .command('webhook-define <url>')
    .description('Set Telegram webhook URL')
    .action(async (url: string) => { await tgSetWebhook(url); console.log('✅ Webhook defined'); });
  group
    .command('webhook-undefine')
    .description('Remove Telegram webhook')
    .action(async () => { await tgRemoveWebhook(); console.log('✅ Webhook removed'); });
  group
    .command('calibrate')
    .description('Calibrate Telegram bot (webhook/menu/commands)')
    .option('--project <name>', 'Project name for menu button')
    .option('--webhook <url>', 'Webhook URL to set before calibration')
    .action(async (options: { project?: string; webhook?: string }) => {
      await tgCalibrate({ projectName: options.project, webhookUrl: options.webhook });
      console.log('✅ Bot calibrated');
    });
  return group;
};

export const localCommandDescribe = (cmd: Command) => {
  return cmd.description('Switch environment URL variables to local development (http://localhost:3000)');
};

export const vercelCommandDescribe = (cmd: Command) => {
  const group = cmd.description('Vercel operations')
    .addHelpText('after', `\nExamples:\n  npx hasyx vercel sync\n  npx hasyx vercel clear\n  npm run cli -- vercel --help`);
  // legacy note removed
  group
    .command('sync')
    .description('Purge and sync Vercel environment variables from .env')
    .action(vercelSyncCommand);
  group
    .command('clear')
    .description('Remove all Vercel environment variables across production/preview/development (no re-add)')
    .action(vercelClearCommand);
  return group;
};

export const jsCommandDescribe = (cmd: Command) => {
  return cmd
    .description('Run a JavaScript file or start a REPL with hasyx client in context.')
    .option('-e, --eval <script>', 'Evaluate a string of JavaScript code');
};

// askCommandDescribe is now exported from ask.ts

export const tsxCommandDescribe = (cmd: Command) => {
  return cmd
    .description('Run a TypeScript file or start a TypeScript REPL with hasyx client in context.')
    .option('-e, --eval <script>', 'Evaluate a string of TypeScript code');
};

export const subdomainCommandDescribe = (cmd: Command) => {
  const subCmd = cmd
    .description('Manage DNS records, SSL certificates, and Nginx configurations for subdomains')
    .addHelpText('after', `
Examples:
  npx hasyx subdomain list                              # List all DNS records
  npx hasyx subdomain define app1 149.102.136.233      # Create DNS record only
  npx hasyx subdomain define app1 149.102.136.233 3000 # Create full subdomain with SSL and Nginx
  npx hasyx subdomain undefine app1                     # Remove subdomain completely

Requirements:
  Environment variables needed:
    HASYX_DNS_DOMAIN                - Your domain name
    CLOUDFLARE_API_TOKEN            - CloudFlare API token
    CLOUDFLARE_ZONE_ID              - CloudFlare Zone ID
    LETSENCRYPT_EMAIL (optional)    - Email for SSL certificates

   Configure via hasyx.config.json (dns/cloudflare) and regenerate .env
`);

  // Add subcommands
  subCmd
    .command('list')
    .description('List all DNS records for the domain')
    .action(subdomainListCommand);

  subCmd
    .command('define <subdomain> <ip> [port]')
    .description('Create subdomain with DNS record, SSL certificate (if port provided), and Nginx config')
    .action(subdomainDefineCommand);

  subCmd
    .command('undefine <subdomain>')
    .description('Remove subdomain: delete DNS record, SSL certificate, and Nginx config')
    .action(subdomainUndefineCommand);

  return subCmd;
};

export const logsCommandDescribe = (cmd: Command) => {
  return cmd.description('Apply logs configuration from hasyx.config.json (includes both diffs and states)');
};

export const logsDiffsCommandDescribe = (cmd: Command) => {
  return cmd.description('Apply logs-diffs configuration from hasyx.config.json');
};

export const logsStatesCommandDescribe = (cmd: Command) => {
  return cmd.description('Apply logs-states configuration from hasyx.config.json');
};

export const envCommandDescribe = (cmd: Command) => {
  return cmd.description('Update environment variables in docker-compose.yml and restart running container if needed');
};

export const dockerCommandDescribe = (cmd: Command) => {
  const subCmd = cmd
    .description('Manage Docker containers with automatic updates via Watchtower')
    .addHelpText('after', `
Examples:
  npx hasyx docker ls              # List running containers for this project
  npx hasyx docker define          # Create container on default port (from env PORT or 3000)
  npx hasyx docker define 8080     # Create container on port 8080
  npx hasyx docker undefine 8080   # Remove container and watchtower on port 8080
  npx hasyx docker logs 8080       # Show container logs
  npx hasyx docker logs 8080 --tail 50  # Show last 50 log lines
  npx hasyx docker env 8080        # Show container environment variables

Requirements:
  • Docker must be installed and running
  • Project must have package.json with name field
  • Optional: docker_container_name field in package.json overrides name
  • Optional: PORT environment variable for default port
  • .env file will be read and passed to containers (except PORT)

The docker define command will:
  1. Read all environment variables from .env file
  2. Create a Watchtower container for automatic updates
  3. Create and start your application container with env vars
  4. Set up port mapping (external:3000 - internal port is always 3000)
  5. Enable container restart policies

Container naming convention:
  • Main container: <project-name>-<port>
  • Watchtower: <project-name>-watchtower-<port>
  • Image name: <project-name>:latest
`);

  // Add subcommands
  subCmd
    .command('ls')
    .description('List running containers for this project')
    .action(dockerListCommand);

  subCmd
    .command('define [port]')
    .description('Create and start container with Watchtower (port optional, uses env PORT or 3000)')
    .action(dockerDefineCommand);

  subCmd
    .command('undefine <port>')
    .description('Stop and remove container and its Watchtower')
    .action(dockerUndefineCommand);

  subCmd
    .command('logs <port>')
    .description('Show container logs')
    .option('--tail <lines>', 'Number of lines to show from the end', '100')
    .action(dockerLogsCommand);

  subCmd
    .command('env <port>')
    .description('Show container environment variables (sensitive values masked)')
    .action(dockerEnvCommand);

  return subCmd;
};

// Export all command functions and utilities
export const setupCommands = (program: Command, packageName: string = 'hasyx') => {
  // Init command
  initCommandDescribe(program.command('init')).action(async (options) => {
    await initCommand(options, packageName);
  });

  // Dev command
  devCommandDescribe(program.command('dev')).action(devCommand);

  // Build command
  buildCommandDescribe(program.command('build')).action(buildCommand);

  // Start command
  startCommandDescribe(program.command('start')).action(startCommand);

  // Build client command
  buildClientCommandDescribe(program.command('client')).action(buildClientCommand);

  // Migrate command
  migrateCommandDescribe(program.command('migrate')).action(async (filter) => {
    await migrateCommand(filter);
  });

  // Unmigrate command
  unmigrateCommandDescribe(program.command('unmigrate')).action(async (filter) => {
    await unmigrateCommand(filter);
  });

  // Schema command
  schemaCommandDescribe(program.command('schema')).action(schemaCommand);

  // Doc command removed

  // Assets command
  assetsCommandDescribe(program.command('assets')).action(async () => {
    await assetsCommand();
  });

  // Events command
  eventsCommandDescribe(program.command('events')).action(async (options) => {
    await eventsCommand(options);
  });

  // Unbuild command
  unbuildCommandDescribe(program.command('unbuild')).action(async () => {
    await unbuildCommand();
  });

  // Assist command removed

  // Telegram command
  telegramCommandDescribe(program.command('telegram')).action(async (options) => {
    // actions are implemented in telegramCommandDescribe; no legacy assist calls
  });

  // Storage command removed (configure via hasyx.config.json)

  // Local command
  localCommandDescribe(program.command('local')).action(async () => {
    localCommand();
  });

  // Vercel command
  vercelCommandDescribe(program.command('vercel')).action(async () => {
    vercelCommand();
  });

  // JS command
  jsCommandDescribe(program.command('js [filePath]')).action(jsCommand);

  // Ask command (lazy import to avoid pulling heavy AI deps unless used)
  program
    .command('ask')
    .description('Interactive AI ask CLI')
    .action(async () => {
      const mod = await import('./ask');
      await mod.askCommand({});
    });

  // TSX command
  tsxCommandDescribe(program.command('tsx [filePath]')).action(tsxCommand);

  // Subdomain command
  subdomainCommandDescribe(program.command('subdomain'));

  // Logs command
  logsCommandDescribe(program.command('logs')).action(async () => {
    await logsCommand();
  });

  // Logs-diffs command
  logsDiffsCommandDescribe(program.command('logs-diffs')).action(async () => {
    await logsDiffsCommand();
  });

  // Logs-states command
  logsStatesCommandDescribe(program.command('logs-states')).action(async () => {
    await logsStatesCommand();
  });

  // Env command
  envCommandDescribe(program.command('env')).action(async () => {
    console.log('🚀 CLI: Starting env command...');
    try {
      await envCommand();
      console.log('✅ CLI: Env command completed successfully');
    } catch (error) {
      console.error('❌ CLI: Env command failed:', error);
      process.exit(1);
    }
  });

  // Config command
  program
    .command('config')
    .description('Open interactive configuration UI or generate files in silent mode')
    .option('--silent', 'Run in silent mode: only generate .env and docker-compose.yml and exit')
    .action(async (opts: { silent?: boolean }) => {
      await configCommand({ silent: !!opts?.silent });
    });

  // Gitpod command
  program
    .command('gitpod')
    .description('Automatically configure Hasyx for Gitpod environment')
    .action(async () => {
      await gitpodCommand();
    });

  // Docker command
  dockerCommandDescribe(program.command('docker'));

  // Validation command group
  const validationGroup = program.command('validation').description('Validation: sync schemas and define/undefine DB validation');
  validationGroup
    .command('sync')
    .description('Generate project JSON Schemas from Zod and sync into DB via plv8 (validation.project_schemas)')
    .action(async () => {
      await generateProjectJsonSchemas();
      await syncSchemasToDatabase();
      console.log('✅ validation: sync done');
    });
  validationGroup
    .command('define')
    .description('Apply validation rules from hasyx.config.json (ensures sync first)')
    .action(async () => {
      await processConfiguredValidationDefine();
    });
  validationGroup
    .command('undefine')
    .description('Remove all validation triggers created by hasyx')
    .action(async () => {
      await processConfiguredValidationUndefine();
    });

  // GitHub command
  githubCommandDescribe(program.command('github'));

  return program;
}; 
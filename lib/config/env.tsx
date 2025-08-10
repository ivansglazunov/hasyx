import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { hasyxConfig } from '../config';
import * as telegramMechanic from '../telegram/config';
import * as githubMechanic from '../github/config';

// Функция для разрешения ссылок в вариантах
function resolveVariant(variant: string, config: any) {
  const variantConfig = config.variants[variant];
  if (!variantConfig) {
    throw new Error(`Variant '${variant}' not found in configuration`);
  }

  // Разрешаем базовые конфигурации, но не считаем их обязательными
  const hostConfig = variantConfig.host && config.hosts ? config.hosts[variantConfig.host] : undefined;
  const hasuraConfig = variantConfig.hasura && config.hasura ? config.hasura[variantConfig.hasura] : undefined;

  // Разрешаем все опциональные конфигурации
  const resolvedConfig: any = {
    ...(hostConfig ? { host: hostConfig } : {}),
    ...(hasuraConfig ? { hasura: hasuraConfig } : {}),
  };

  // Добавляем все опциональные конфигурации если они указаны в варианте
  const optionalConfigs = [
    'telegramBot', 'telegramChannel', 'environment',
    'googleOAuth', 'yandexOAuth', 'githubOAuth', 'facebookOAuth', 'vkOAuth', 'telegramLoginOAuth',
    'storage', 'pg', 'docker', 'dockerhub', 'github', 'resend', 'openrouter', 'firebase', 'firebasePublic',
    'nextAuthSecrets', 'dns', 'cloudflare', 'projectUser', 'vercel', 'githubWebhooks', 'githubTelegramBot',
    'testing',
  ];

  for (const configType of optionalConfigs) {
    const variantKey = variantConfig[configType];
    if (variantKey && config[configType] && config[configType][variantKey]) {
      resolvedConfig[configType] = config[configType][variantKey];
    }
  }

  return resolvedConfig;
}

// Получение маппинга env из meta.envMapping для каждого типа
function getEnvMappingForType(typeKey: string): Record<string, string | string[]> | undefined {
  const fileSchema: any = (hasyxConfig as any).file;
  if (!fileSchema || !(fileSchema as any).shape) return undefined;
  const shape: any = (fileSchema as any).shape;
  // For list types we need the item schema meta, not the record wrapper
  let listSchema = shape[typeKey];
  // Fallback for singular/plural mismatch (e.g., host -> hosts)
  if (!listSchema && typeKey === 'host') listSchema = shape['hosts'];
  if (!listSchema && shape[`${typeKey}s`]) listSchema = shape[`${typeKey}s`];
  if (!listSchema || typeof (listSchema as any).meta !== 'function') return undefined;
  const listMeta = (listSchema as any).meta();
  const addSchema = listMeta?.add;
  if (addSchema && typeof (addSchema as any).meta === 'function') {
    const itemMeta = (addSchema as any).meta();
    return itemMeta?.envMapping as Record<string, string | string[]> | undefined;
  }
  // Fallback: the schema itself may carry envMapping (non-list)
  return listMeta?.envMapping as Record<string, string | string[]> | undefined;
}

// Получение имени публичного флага включенности фичи из meta.envEnabledName
function getEnvEnabledNameForType(typeKey: string): string | undefined {
  const fileSchema: any = (hasyxConfig as any).file;
  if (!fileSchema || !(fileSchema as any).shape) return undefined;
  const shape: any = (fileSchema as any).shape;
  let listSchema = shape[typeKey];
  if (!listSchema && typeKey === 'host') listSchema = shape['hosts'];
  if (!listSchema && shape[`${typeKey}s`]) listSchema = shape[`${typeKey}s`];
  if (!listSchema || typeof (listSchema as any).meta !== 'function') return undefined;
  const listMeta = (listSchema as any).meta();
  const addSchema = listMeta?.add;
  if (addSchema && typeof (addSchema as any).meta === 'function') {
    const itemMeta = (addSchema as any).meta();
    return itemMeta?.envEnabledName as string | undefined;
  }
  return listMeta?.envEnabledName as string | undefined;
}

// Функция для генерации .env файла на основе статического маппинга
function generateEnvFile(config: any, variant: string): string {
  const resolvedConfig = resolveVariant(variant, config);
  const envVars: string[] = [];

  // Генерируем переменные для каждой конфигурации
  for (const [configType, configData] of Object.entries(resolvedConfig)) {
    const envMapping = getEnvMappingForType(configType);
    if (!envMapping || !configData) continue;
    if (typeof configData !== 'object' || Object.keys(configData).length === 0) continue;

    for (const [configKey, envKeyOrKeys] of Object.entries(envMapping)) {
      let value: any = (configData as any)[configKey];
      if (value !== undefined && value !== null && value !== '') {
        const pushVar = (envKey: string, v: any) => {
          // Special-case booleans for specific flags
          if (envKey === 'JEST_LOCAL') {
            if (typeof v === 'boolean') {
              envVars.push(`${envKey}=${v ? '1' : '0'}`);
              return;
            }
          }
          envVars.push(`${envKey}=${v}`);
        };
        if (Array.isArray(envKeyOrKeys)) {
          for (const envKey of envKeyOrKeys) {
            pushVar(envKey, value);
          }
        } else {
          pushVar(envKeyOrKeys as string, value);
        }
      }
    }
  }

  // Also append global (non-variant) mappings if present
  try {
    const globalMapping = getEnvMappingForType('global');
    const globalConfig = (config as any).global;
    if (globalMapping && globalConfig && typeof globalConfig === 'object') {
      for (const [configKey, envKeyOrKeys] of Object.entries(globalMapping)) {
        const value: any = (globalConfig as any)[configKey];
        if (value === undefined || value === null || value === '') continue;
        const pushVar = (envKey: string, v: any) => {
          if (envKey === 'JEST_LOCAL') {
            envVars.push(`${envKey}=${v ? '1' : '0'}`);
            return;
          }
          envVars.push(`${envKey}=${v}`);
        };
        if (Array.isArray(envKeyOrKeys)) {
          for (const envKey of envKeyOrKeys) pushVar(envKey, value);
        } else {
          pushVar(envKeyOrKeys as string, value);
        }
      }
    }
  } catch {}

  // Append public enabled flags per mechanic
  const flags: Array<{ name: string; enabled: boolean }> = [];
  // NEXTAUTH is separate mechanism driven by nextAuthSecrets mapping
  {
    const name = getEnvEnabledNameForType('nextAuthSecrets') || 'NEXT_PUBLIC_NEXTAUTH_ENABLED';
    const enabled = Boolean(resolvedConfig.nextAuthSecrets?.secret);
    flags.push({ name, enabled });
  }

  // Telegram Login OAuth
  if (telegramMechanic && typeof telegramMechanic.isEnabled === 'function') {
    const name = (telegramMechanic as any).ENV_ENABLED_NAME || 'NEXT_PUBLIC_TELEGRAM_AUTH_ENABLED';
    flags.push({ name, enabled: telegramMechanic.isEnabled(resolvedConfig) });
  }

  // GitHub OAuth
  if (githubMechanic && typeof githubMechanic.isEnabled === 'function') {
    const name = (githubMechanic as any).ENV_ENABLED_NAME || 'NEXT_PUBLIC_GITHUB_AUTH_ENABLED';
    flags.push({ name, enabled: githubMechanic.isEnabled(resolvedConfig) });
  }

  // Generic OAuths without dedicated mechanic modules
  const genericProviders: Array<{ key: 'googleOAuth'|'yandexOAuth'|'facebookOAuth'|'vkOAuth'; required: string[] }> = [
    { key: 'googleOAuth', required: ['clientId', 'clientSecret'] },
    { key: 'yandexOAuth', required: ['clientId', 'clientSecret'] },
    { key: 'facebookOAuth', required: ['clientId', 'clientSecret'] },
    { key: 'vkOAuth', required: ['clientId', 'clientSecret'] },
  ];
  for (const provider of genericProviders) {
    const name = getEnvEnabledNameForType(provider.key);
    if (!name) continue;
    const cfg: any = (resolvedConfig as any)[provider.key];
    const enabled = Boolean(cfg && provider.required.every((k) => cfg[k] && String(cfg[k]).length > 0));
    flags.push({ name, enabled });
  }

  for (const { name, enabled } of flags) {
    envVars.push(`${name}=${enabled ? '1' : '0'}`);
  }

  return envVars.join('\n');
}

// Функция для сохранения .env файла
function saveEnvFile(content: string, filePath: string = '.env') {
  fs.writeFileSync(filePath, content);
  console.log(`✅ .env file generated at ${filePath}`);
}

// Функция для загрузки hasyx.config.json
function loadHasyxConfig(): any {
  const configPath = path.join(process.cwd(), 'hasyx.config.json');
  
  if (!fs.existsSync(configPath)) {
    throw new Error('hasyx.config.json not found');
  }
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(configContent);
}

// Функция для сравнения с .env.backup
function compareWithBackup(generatedEnv: string): void {
  const backupPath = path.join(process.cwd(), '.env.backup');
  
  if (!fs.existsSync(backupPath)) {
    console.log('⚠️  .env.backup not found, skipping comparison');
    return;
  }
  
  const backupContent = fs.readFileSync(backupPath, 'utf8');
  const backupLines = backupContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  const generatedLines = generatedEnv.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  console.log('\n📊 Comparison with .env.backup:');
  console.log(`Generated variables: ${generatedLines.length}`);
  console.log(`Backup variables: ${backupLines.length}`);
  
  // Проверяем hasura переменные
  const hasuraVars = ['NEXT_PUBLIC_HASURA_GRAPHQL_URL', 'HASURA_ADMIN_SECRET', 'HASURA_JWT_SECRET', 'HASURA_EVENT_SECRET'];
  const hostVars = ['PORT', 'NEXT_PUBLIC_MAIN_URL'];
  const telegramVars = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_BOT_NAME'];
  const oauthVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'YANDEX_CLIENT_ID', 'YANDEX_CLIENT_SECRET', 'GITHUB_ID', 'GITHUB_SECRET', 'FACEBOOK_CLIENT_ID', 'FACEBOOK_CLIENT_SECRET', 'VK_CLIENT_ID', 'VK_CLIENT_SECRET', 'TELEGRAM_LOGIN_BOT_USERNAME', 'TELEGRAM_LOGIN_BOT_TOKEN'];
  
  console.log('\n🔍 Checking Hasura variables:');
  for (const varName of hasuraVars) {
    const inGenerated = generatedLines.some(line => line.startsWith(varName));
    const inBackup = backupLines.some(line => line.startsWith(varName));
    
    if (inGenerated && inBackup) {
      console.log(`✅ ${varName} - present in both`);
    } else if (inGenerated && !inBackup) {
      console.log(`🆕 ${varName} - new in generated`);
    } else if (!inGenerated && inBackup) {
      console.log(`❌ ${varName} - missing in generated`);
    }
  }
  
  console.log('\n🔍 Checking Host variables:');
  for (const varName of hostVars) {
    const inGenerated = generatedLines.some(line => line.startsWith(varName));
    const inBackup = backupLines.some(line => line.startsWith(varName));
    
    if (inGenerated && inBackup) {
      console.log(`✅ ${varName} - present in both`);
    } else if (inGenerated && !inBackup) {
      console.log(`🆕 ${varName} - new in generated`);
    } else if (!inGenerated && inBackup) {
      console.log(`❌ ${varName} - missing in generated`);
    }
  }
  
  console.log('\n🔍 Checking Telegram variables:');
  for (const varName of telegramVars) {
    const inGenerated = generatedLines.some(line => line.startsWith(varName));
    const inBackup = backupLines.some(line => line.startsWith(varName));
    
    if (inGenerated && inBackup) {
      console.log(`✅ ${varName} - present in both`);
    } else if (inGenerated && !inBackup) {
      console.log(`🆕 ${varName} - new in generated`);
    } else if (!inGenerated && inBackup) {
      console.log(`❌ ${varName} - missing in generated`);
    }
  }
  
  console.log('\n🔍 Checking OAuth variables:');
  for (const varName of oauthVars) {
    const inGenerated = generatedLines.some(line => line.startsWith(varName));
    const inBackup = backupLines.some(line => line.startsWith(varName));
    
    if (inGenerated && inBackup) {
      console.log(`✅ ${varName} - present in both`);
    } else if (inGenerated && !inBackup) {
      console.log(`🆕 ${varName} - new in generated`);
    } else if (!inGenerated && inBackup) {
      console.log(`❌ ${varName} - missing in generated`);
    }
  }
}

// Основная функция для генерации .env
export function generateEnv(variant?: string): void {
  try {
    const config = loadHasyxConfig();
    const selectedVariant = variant || config.variant;
    if (!selectedVariant) {
      // No variant at all -> generate empty .env
      saveEnvFile('');
      console.log('⚠️  No variant specified, generated empty .env');
      return;
    }
    
    console.log(`🚀 Generating .env for variant: ${selectedVariant}`);
    
    let envContent = '';
    try {
      envContent = generateEnvFile(config, selectedVariant);
    } catch (e) {
      // If variant exists but missing referenced sections, fallback to empty .env
      console.log('⚠️  Incomplete variant configuration, generating empty .env');
      envContent = '';
    }
    saveEnvFile(envContent);
    
    // Сравниваем с .env.backup
    compareWithBackup(envContent);
    
    console.log('\n✅ .env generation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error generating .env:', error);
    process.exit(1);
  }
}

// Функция для тестирования генерации
export function testGeneration(): void {
  console.log('🧪 Testing .env generation...');
  generateEnv();
}

// Экспорт для использования в других файлах
export { generateEnvFile, resolveVariant, loadHasyxConfig };

// Запуск тестирования если файл запущен напрямую
if (require.main === module) {
  testGeneration();
} 
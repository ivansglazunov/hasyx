/**
 * Interactive environment management using hasyx.config.json
 */

import readline from 'readline';
import {
  configExists,
  readConfig,
  writeConfig,
  createDefaultConfig,
  getEnvironments,
  applyEnvironmentToEnvFile,
  migrateEnvToConfig,
  getEnvironmentVariables,
  setEnvironmentVariable,
  HasyxConfig,
  DEFAULT_ENVIRONMENTS
} from './hasyx-config';
import Debug from './debug';
import fs from 'fs-extra';
import path from 'path';

const debug = Debug('env-manager');

/**
 * Create readline interface for user input
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Ask user a question and return the answer
 */
function question(rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Display available environments and let user choose
 */
async function selectEnvironment(config: HasyxConfig): Promise<string | null> {
  const environments = getEnvironments(config);

  if (environments.length === 0) {
    console.log('❌ No environments found in hasyx.config.json');
    return null;
  }

  console.log('\n📋 Available environments:');
  environments.forEach((env, index) => {
    const vars = config[env] || {};
    const varCount = Object.keys(vars).length;
    const globalVarCount = Object.keys(config.global || {}).length;
    const totalVars = varCount + globalVarCount;
    console.log(`  ${index + 1}. ${env} (${totalVars} variables)`);
  });

  const rl = createReadlineInterface();
  const answer = await question(rl, '\n🔹 Select environment (number or name): ');
  rl.close();

  // Check if user entered a number
  const num = parseInt(answer, 10);
  if (!isNaN(num) && num >= 1 && num <= environments.length) {
    return environments[num - 1];
  }

  // Check if user entered a name
  if (environments.includes(answer)) {
    return answer;
  }

  console.log('❌ Invalid selection');
  return null;
}

/**
 * Setup wizard for first-time configuration
 */
export async function setupWizard(): Promise<void> {
  console.log('🚀 Welcome to Hasyx Environment Setup!\n');
  console.log('This wizard will help you create hasyx.config.json for managing');
  console.log('environment variables across different environments.\n');

  const rl = createReadlineInterface();

  // Ask if user wants to migrate existing .env
  const envPath = path.join(process.cwd(), '.env');
  const hasExistingEnv = fs.existsSync(envPath);

  let config: HasyxConfig;

  if (hasExistingEnv) {
    const migrate = await question(
      rl,
      '📄 Found existing .env file. Migrate it to hasyx.config.json? (y/n): '
    );

    if (migrate.toLowerCase() === 'y' || migrate.toLowerCase() === 'yes') {
      const targetEnv = await question(
        rl,
        '🔹 Which environment should .env be migrated to? (local/dev/prod) [local]: '
      );
      const env = targetEnv || 'local';
      config = migrateEnvToConfig(env);
      console.log(`✅ Migrated .env to ${env} environment`);
    } else {
      config = createDefaultConfig();
      console.log('✅ Created default configuration');
    }
  } else {
    config = createDefaultConfig();
    console.log('✅ Created default configuration with local, dev, and prod environments');
  }

  // Ask if user wants to customize PORT values
  const customizePorts = await question(
    rl,
    '\n🔹 Customize PORT values for each environment? (y/n) [n]: '
  );

  if (customizePorts.toLowerCase() === 'y' || customizePorts.toLowerCase() === 'yes') {
    for (const env of DEFAULT_ENVIRONMENTS) {
      const currentPort = config[env]?.PORT || '';
      const port = await question(
        rl,
        `  PORT for ${env} [${currentPort}]: `
      );
      if (port) {
        config = setEnvironmentVariable(config, env, 'PORT', port);
      }
    }
  }

  // Ask if user wants to customize HASURA_URL values
  const customizeHasura = await question(
    rl,
    '\n🔹 Customize HASURA_URL for each environment? (y/n) [n]: '
  );

  if (customizeHasura.toLowerCase() === 'y' || customizeHasura.toLowerCase() === 'yes') {
    for (const env of DEFAULT_ENVIRONMENTS) {
      const currentUrl = config[env]?.HASURA_URL || '';
      const url = await question(
        rl,
        `  HASURA_URL for ${env} [${currentUrl}]: `
      );
      if (url) {
        config = setEnvironmentVariable(config, env, 'HASURA_URL', url);
      }
    }
  }

  rl.close();

  // Write config
  writeConfig(config);
  console.log('\n✅ hasyx.config.json created successfully!');
  console.log('\n📝 Next steps:');
  console.log('  1. Edit hasyx.config.json to add more environment variables');
  console.log('  2. Run "npx hasyx env" to switch between environments');
  console.log('  3. The selected environment will be applied to .env\n');
}

/**
 * List all environments with their variables
 */
export function listEnvironments(config: HasyxConfig): void {
  const environments = getEnvironments(config);

  if (environments.length === 0) {
    console.log('❌ No environments found in hasyx.config.json');
    return;
  }

  console.log('\n📋 Available environments:\n');

  // Show global variables first if any
  const globalVars = config.global || {};
  if (Object.keys(globalVars).length > 0) {
    console.log('🌍 Global variables (apply to all environments):');
    Object.entries(globalVars).forEach(([key, value]) => {
      const displayValue = value.length > 50 ? value.substring(0, 47) + '...' : value;
      console.log(`  ${key}=${displayValue}`);
    });
    console.log();
  }

  // Show each environment
  environments.forEach((env) => {
    const vars = config[env] || {};
    const mergedVars = getEnvironmentVariables(config, env);
    console.log(`📦 ${env}:`);

    if (Object.keys(vars).length === 0) {
      console.log('  (no environment-specific variables)');
    } else {
      Object.entries(vars).forEach(([key, value]) => {
        const displayValue = value.length > 50 ? value.substring(0, 47) + '...' : value;
        console.log(`  ${key}=${displayValue}`);
      });
    }

    console.log(`  Total variables: ${Object.keys(mergedVars).length}\n`);
  });
}

/**
 * Main env command - interactive environment switching
 */
export async function envManagerCommand(options: { list?: boolean } = {}): Promise<void> {
  debug('Executing env manager command', options);

  // Check if hasyx.config.json exists
  if (!configExists()) {
    console.log('⚠️  hasyx.config.json not found');
    const rl = createReadlineInterface();
    const setup = await question(rl, '🔹 Run setup wizard? (y/n): ');
    rl.close();

    if (setup.toLowerCase() === 'y' || setup.toLowerCase() === 'yes') {
      await setupWizard();
      return;
    } else {
      console.log('\n💡 You can run "npx hasyx env" again anytime to set up environment management');
      return;
    }
  }

  const config = readConfig();

  // If --list flag is provided, just list environments
  if (options.list) {
    listEnvironments(config);
    return;
  }

  // Select and apply environment
  const selectedEnv = await selectEnvironment(config);

  if (!selectedEnv) {
    console.log('❌ No environment selected');
    return;
  }

  // Show what will be applied
  const vars = getEnvironmentVariables(config, selectedEnv);
  console.log(`\n📝 Applying ${selectedEnv} environment with ${Object.keys(vars).length} variables...`);

  // Apply to .env
  applyEnvironmentToEnvFile(config, selectedEnv);

  console.log('\n✅ Environment applied successfully!');
  console.log('\n💡 Next steps:');
  console.log('  - Review .env file to verify the variables');
  console.log('  - Restart your application to load the new environment');
  console.log('  - Edit hasyx.config.json to modify environment variables\n');
}

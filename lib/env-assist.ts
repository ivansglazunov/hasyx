/**
 * Interactive assistant for managing environment variables in hasyx.config.json
 */

import readline from 'readline';
import {
  configExists,
  readConfig,
  writeConfig,
  createDefaultConfig,
  getEnvironments,
  setEnvironmentVariable,
  removeEnvironmentVariable,
  getEnvironmentVariables,
  HasyxConfig
} from './hasyx-config';
import Debug from './debug';

const debug = Debug('env-assist');

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
 * Select an environment interactively
 */
async function selectEnvironment(config: HasyxConfig, rl: readline.Interface): Promise<string | null> {
  const environments = ['global', ...getEnvironments(config)];

  console.log('\n📋 Available environments:');
  environments.forEach((env, index) => {
    const isGlobal = env === 'global';
    const vars = config[env] || {};
    const varCount = Object.keys(vars).length;
    const label = isGlobal ? `${env} (applies to all environments)` : env;
    console.log(`  ${index + 1}. ${label} (${varCount} variables)`);
  });

  const answer = await question(rl, '\n🔹 Select environment (number or name): ');

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
 * Display variables in an environment
 */
function displayEnvironmentVariables(config: HasyxConfig, environment: string): void {
  const vars = config[environment] || {};
  const varEntries = Object.entries(vars);

  if (varEntries.length === 0) {
    console.log(`\n📦 ${environment}: (no variables)\n`);
    return;
  }

  console.log(`\n📦 ${environment}:`);
  varEntries.forEach(([key, value]) => {
    const displayValue = value.length > 60 ? value.substring(0, 57) + '...' : value;
    console.log(`  ${key}=${displayValue}`);
  });
  console.log();
}

/**
 * Set a variable in an environment
 */
async function setVariable(config: HasyxConfig, rl: readline.Interface): Promise<HasyxConfig> {
  const environment = await selectEnvironment(config, rl);
  if (!environment) {
    return config;
  }

  displayEnvironmentVariables(config, environment);

  const key = await question(rl, '🔹 Variable name (e.g., PORT, HASURA_URL): ');
  if (!key) {
    console.log('❌ Variable name is required');
    return config;
  }

  const currentValue = config[environment]?.[key];
  const prompt = currentValue
    ? `🔹 New value for ${key} [current: ${currentValue}]: `
    : `🔹 Value for ${key}: `;

  const value = await question(rl, prompt);
  if (!value && !currentValue) {
    console.log('❌ Value is required for new variables');
    return config;
  }

  const finalValue = value || currentValue || '';
  const newConfig = setEnvironmentVariable(config, environment, key, finalValue);

  console.log(`✅ Set ${key}=${finalValue} in ${environment}`);
  return newConfig;
}

/**
 * Remove a variable from an environment
 */
async function removeVariable(config: HasyxConfig, rl: readline.Interface): Promise<HasyxConfig> {
  const environment = await selectEnvironment(config, rl);
  if (!environment) {
    return config;
  }

  displayEnvironmentVariables(config, environment);

  const vars = config[environment] || {};
  if (Object.keys(vars).length === 0) {
    console.log('❌ No variables to remove');
    return config;
  }

  const key = await question(rl, '🔹 Variable name to remove: ');
  if (!key) {
    console.log('❌ Variable name is required');
    return config;
  }

  if (!vars[key]) {
    console.log(`❌ Variable ${key} not found in ${environment}`);
    return config;
  }

  const confirm = await question(rl, `⚠️  Remove ${key} from ${environment}? (y/n): `);
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log('❌ Cancelled');
    return config;
  }

  const newConfig = removeEnvironmentVariable(config, environment, key);
  console.log(`✅ Removed ${key} from ${environment}`);
  return newConfig;
}

/**
 * View all variables (merged) for an environment
 */
async function viewEnvironment(config: HasyxConfig, rl: readline.Interface): Promise<void> {
  const environment = await selectEnvironment(config, rl);
  if (!environment || environment === 'global') {
    if (environment === 'global') {
      displayEnvironmentVariables(config, 'global');
    }
    return;
  }

  console.log(`\n📦 Viewing ${environment} (with global variables merged):\n`);

  const mergedVars = getEnvironmentVariables(config, environment);
  const envVars = config[environment] || {};
  const globalVars = config.global || {};

  if (Object.keys(globalVars).length > 0) {
    console.log('🌍 Global variables:');
    Object.entries(globalVars).forEach(([key, value]) => {
      const overridden = envVars[key] !== undefined;
      const displayValue = value.length > 60 ? value.substring(0, 57) + '...' : value;
      const suffix = overridden ? ' (overridden by environment-specific value)' : '';
      console.log(`  ${key}=${displayValue}${suffix}`);
    });
    console.log();
  }

  if (Object.keys(envVars).length > 0) {
    console.log(`📝 ${environment}-specific variables:`);
    Object.entries(envVars).forEach(([key, value]) => {
      const displayValue = value.length > 60 ? value.substring(0, 57) + '...' : value;
      console.log(`  ${key}=${displayValue}`);
    });
    console.log();
  }

  console.log(`Total merged variables: ${Object.keys(mergedVars).length}\n`);
}

/**
 * Main assist command
 */
export async function assistCommand(): Promise<void> {
  debug('Executing assist command');

  // Check if hasyx.config.json exists
  if (!configExists()) {
    console.log('⚠️  hasyx.config.json not found');
    console.log('💡 Run "npx hasyx env" to create it with the setup wizard\n');
    return;
  }

  let config = readConfig();
  const rl = createReadlineInterface();

  console.log('\n🛠️  Hasyx Environment Assistant\n');
  console.log('Manage environment variables in hasyx.config.json interactively.\n');

  let running = true;

  while (running) {
    console.log('📋 Available actions:');
    console.log('  1. Set/update a variable');
    console.log('  2. Remove a variable');
    console.log('  3. View environment (with merged globals)');
    console.log('  4. List all environments');
    console.log('  5. Save and exit');
    console.log('  6. Exit without saving');

    const action = await question(rl, '\n🔹 Select action: ');

    switch (action) {
      case '1':
        config = await setVariable(config, rl);
        break;

      case '2':
        config = await removeVariable(config, rl);
        break;

      case '3':
        await viewEnvironment(config, rl);
        break;

      case '4':
        const environments = ['global', ...getEnvironments(config)];
        environments.forEach((env) => {
          displayEnvironmentVariables(config, env);
        });
        break;

      case '5':
        writeConfig(config);
        console.log('✅ Changes saved to hasyx.config.json');
        running = false;
        break;

      case '6':
        console.log('❌ Exiting without saving');
        running = false;
        break;

      default:
        console.log('❌ Invalid action');
    }

    console.log();
  }

  rl.close();
}

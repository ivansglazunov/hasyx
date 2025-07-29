import readline from 'readline';
import path from 'path';
import fs from 'fs-extra';
import dotenv from 'dotenv';

// Load environment variables FIRST, before any other imports that use process.env
dotenv.config({ path: path.join(process.cwd(), '.env') });

import Debug from './debug';
import { createRlInterface, askYesNo, askForInput, parseEnvFile, writeEnvFile, maskDisplaySecret } from './assist-common';

const debug = Debug('assist:github');

export async function configureGitHubToken(rl: readline.Interface, envPath: string): Promise<Record<string, string>> {
  debug('Configuring GitHub Token');
  
  let envVars = parseEnvFile(envPath);
  
  // Ask first if user wants to configure GitHub token
  const currentToken = envVars.GITHUB_TOKEN;
  const hasExistingConfig = currentToken && currentToken.trim() !== '';
  
  let shouldConfigure = false;
  
  if (hasExistingConfig) {
    console.log('🔑 GitHub Token is already configured.');
    console.log(`   Current token: ${maskDisplaySecret(currentToken)}`);
    shouldConfigure = await askYesNo(rl, 'Do you want to reconfigure GitHub Token?', false);
  } else {
    shouldConfigure = await askYesNo(rl, 'Do you want to configure GitHub Token for API access?', false);
  }
  
  if (!shouldConfigure) {
    console.log('⏭️ Skipping GitHub Token configuration.');
    return envVars;
  }
  
  console.log('🔑 Configuring GitHub Token...');
  let changed = false;

  console.log(
`To set up a GitHub Personal Access Token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token" (classic)
3. Select scopes: 'repo' (for private repos) or 'public_repo' (for public repos only)
4. Copy the generated token`
  );

  // Configure GITHUB_TOKEN
  let newToken = currentToken;
  if (currentToken) {
    if (await askYesNo(rl, `GitHub Token is already set (${maskDisplaySecret(currentToken)}). Do you want to change it?`, false)) {
      newToken = await askForInput(rl, 'Enter new GitHub Personal Access Token (press Enter to keep current)', currentToken, true);
    } else {
      newToken = currentToken; // Explicitly keep current if not changing
    }
  } else {
    newToken = await askForInput(rl, 'Enter GitHub Personal Access Token', '', true);
  }
  
  if (newToken !== currentToken) {
    envVars.GITHUB_TOKEN = newToken;
    changed = true;
  }

  // Configure NEXT_PUBLIC_GITHUB_OWNER
  const currentOwner = envVars.NEXT_PUBLIC_GITHUB_OWNER;
  let newOwner = currentOwner;
  if (currentOwner) {
    if (await askYesNo(rl, `GitHub Repository Owner is already set: ${currentOwner}. Do you want to change it?`, false)) {
      newOwner = await askForInput(rl, 'Enter new GitHub Repository Owner (e.g., username or organization, press Enter to keep current)', currentOwner);
    } else {
      newOwner = currentOwner;
    }
  } else {
    newOwner = await askForInput(rl, 'Enter GitHub Repository Owner (e.g., username or organization)');
  }
  
  if (newOwner !== currentOwner) {
    envVars.NEXT_PUBLIC_GITHUB_OWNER = newOwner;
    changed = true;
  }

  // Configure NEXT_PUBLIC_GITHUB_REPO
  const currentRepo = envVars.NEXT_PUBLIC_GITHUB_REPO;
  let newRepo = currentRepo;
  if (currentRepo) {
    if (await askYesNo(rl, `GitHub Repository Name is already set: ${currentRepo}. Do you want to change it?`, false)) {
      newRepo = await askForInput(rl, 'Enter new GitHub Repository Name (press Enter to keep current)', currentRepo);
    } else {
      newRepo = currentRepo;
    }
  } else {
    newRepo = await askForInput(rl, 'Enter GitHub Repository Name (e.g., my-project)');
  }
  
  if (newRepo !== currentRepo) {
    envVars.NEXT_PUBLIC_GITHUB_REPO = newRepo;
    changed = true;
  }

  if (changed) {
    writeEnvFile(envPath, envVars);
    console.log('✅ GitHub Token configuration saved to .env file.');
  } else {
    console.log('✅ GitHub Token configuration unchanged.');
  }
  
  return envVars;
}

export async function runGitHubSetup(rl: readline.Interface, envPath: string): Promise<void> {
  debug('Running GitHub setup');
  console.log('⚙️ Starting GitHub Token Setup...');
  
  try {
    await configureGitHubToken(rl, envPath);
    console.log('✅ GitHub Token setup completed successfully.');
  } catch (error) {
    console.error('❌ Error during GitHub Token setup:', error);
    throw error;
  }
}

// Main function for standalone execution
async function main() {
  const rl = createRlInterface();
  const envPath = path.join(process.cwd(), '.env');
  
  try {
    await runGitHubSetup(rl, envPath);
    console.log('✅ GitHub Token setup checks complete.');
  } catch (error) {
    console.error('❌ Error during GitHub setup:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Check if this script is being run directly
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].includes('assist-github')) {
  main();
}

import readline from 'readline';
import Debug from './debug';
import { createRlInterface, askYesNo, parseEnvFile, getGitHubRemoteUrl, writeEnvFile, askForInput, maskDisplaySecret } from './assist-common';
import { getVercelProjectName } from './assist-vercel';
import path from 'path';
import spawn from 'cross-spawn';
import { SpawnSyncOptions } from 'child_process';
import fs from 'fs-extra';
import * as vercel from './vercel/index';
import * as gh from './github';

const debug = Debug('assist:sync');

export async function syncEnvironmentVariables(rl: readline.Interface, envPath: string, options: { skipVercel?: boolean, skipGithub?: boolean } = {}): Promise<void> {
  debug('Starting environment variable synchronization process...');
  console.log('🔄 Syncing environment variables...');
  const envVars = parseEnvFile(envPath);
  debug('Initial local .env variables loaded:', JSON.stringify(envVars, null, 2));

  const vercelToken = envVars.VERCEL_TOKEN;
  const vercelOrgId = envVars.VERCEL_TEAM_ID;
  let vercelProjectNameForLink = envVars.VERCEL_PROJECT_NAME;

  // Keys that should NOT be set to WS=0 on Vercel, or are managed differently
  const vercelKeepAsIsKeys = [
    'OPENROUTER_API_KEY', // Should be synced as is
    // Add other keys here if they should not be forced to WS=0 or need special handling
  ];

  if (!options.skipVercel) {
    if (await askYesNo(rl, 'Do you want to sync .env with Vercel?', false)) {
      debug('Proceeding with Vercel sync.');
      if (!vercelToken) {
        console.log('⚠️ VERCEL_TOKEN not found in .env. Skipping Vercel sync.');
        debug('VERCEL_TOKEN missing, skipping Vercel sync.');
      } else {
        let isLinkedSuccessfully = false;

        if (!vercelProjectNameForLink) {
          vercelProjectNameForLink = await askForInput(rl, 'Enter Vercel Project Name to link with (e.g., my-vercel-project). Leave blank to attempt using an existing link or skip Vercel setup:');
          debug('Vercel project name for linking (user input or from .env):', vercelProjectNameForLink);
        }

        if (vercelProjectNameForLink) {
          console.log(`\n🔗 Ensuring your local directory is linked to Vercel project "${vercelProjectNameForLink}".`);
          console.log("   You might be prompted by Vercel CLI to confirm the project and scope (team/organization).");

          // First try to link using project name via environment variable or use interactive mode
          const linked = vercel.link(vercelProjectNameForLink, vercelToken, vercelOrgId);
          if (linked) {
            console.log(`✅ Successfully linked to Vercel project: ${vercelProjectNameForLink}.`);
            debug('Vercel link successful.');
            isLinkedSuccessfully = true;
            if (envVars.VERCEL_PROJECT_NAME !== vercelProjectNameForLink) {
              envVars.VERCEL_PROJECT_NAME = vercelProjectNameForLink;
              debug('Updated VERCEL_PROJECT_NAME in envVars to:', vercelProjectNameForLink);
            }
          } else {
            console.error(`❌ Failed to link to Vercel project "${vercelProjectNameForLink}". Vercel environment sync will be skipped.`);
            debug('Vercel link failed.');
          }
        } else {
          const vercelJsonPath = path.join(process.cwd(), '.vercel', 'project.json');
          if (fs.existsSync(vercelJsonPath)) {
            try {
              const projectJson = fs.readJsonSync(vercelJsonPath);
              if (projectJson.projectId && projectJson.orgId) {
                console.log(`✅ Using existing Vercel link (Project ID: ${projectJson.projectId}, Org ID: ${projectJson.orgId}). Vercel project name for display is taken from .env if present.`);
                debug('Found existing Vercel link in .vercel/project.json:', projectJson);
                isLinkedSuccessfully = true;
              }
            } catch (e) {
              debug('Error reading .vercel/project.json, assuming not reliably linked:', e);
            }
          }
          if (!isLinkedSuccessfully) {
            console.log('No Vercel project name specified for linking and not already linked. Skipping Vercel sync.');
            debug('No Vercel project name to link with and no existing link found. Skipping Vercel env sync.');
          }
        }

        if (isLinkedSuccessfully) {
          console.log(`\n🔄 Now syncing environment variables with the linked Vercel project...`);
          const tokenArgsForEnv = [`--token=${vercelToken}`];

          const pulled = vercel.envPull(vercelToken, '.env.vercel');
          if (!pulled) {
            console.error('❌ Failed to pull Vercel environment variables.');
            debug('Vercel env pull failed.');
          } else {
            console.log('✅ Pulled Vercel environment. Merging and pushing local settings...');
            debug('Vercel env pull successful.');
            const vercelEnvPulled = parseEnvFile('.env.vercel');
            debug('Variables pulled from Vercel (.env.vercel):', JSON.stringify(vercelEnvPulled, null, 2));
            
            const desiredVercelState = { ...envVars };
            // Set NEXT_PUBLIC_WS='0' for Vercel, unless it's in keepAsIsKeys (which it isn't here)
            if (!vercelKeepAsIsKeys.includes('NEXT_PUBLIC_WS')) {
                desiredVercelState.NEXT_PUBLIC_WS = '0';
            }
            debug('Desired state for Vercel (local .env potentially modified for WS):', JSON.stringify(desiredVercelState, null, 2));

            let changesPushed = false;
            for (const [key, value] of Object.entries(desiredVercelState)) {
              if (typeof value !== 'string') {
                debug(`Skipping non-string value for key ${key}`);
                continue;
              }
              
              let valueToPush = value; 
              if (vercelKeepAsIsKeys.includes(key)) {
                valueToPush = envVars[key] || '';
              }

              // We will attempt to set it regardless of whether it differs or not,
              // to ensure it's correctly set or updated.
              // The rm + add strategy handles creation and update.
              changesPushed = true; // Assume a change is pushed if we attempt to set any variable
              debug(`Processing variable for Vercel: ${key}`);

              for (const envType of ['production', 'preview', 'development']) {
                // 1. Attempt to remove the variable first (suppress errors, as it might not exist)
                vercel.envRemove(key, envType as any, vercelToken);

                // 2. Add the variable
                vercel.envAdd(key, envType as any, valueToPush, vercelToken);
                console.log(`✅ Added/Updated ${key} in Vercel ${envType} env.`);
              }
            }
            if (changesPushed) { // This will always be true if desiredVercelState is not empty
                console.log("✅ Relevant changes from local .env (and NEXT_PUBLIC_WS=0) pushed to Vercel.")
                debug('Changes were pushed to Vercel.');
            } else {
                console.log("ℹ️ No differing variables (or only NEXT_PUBLIC_WS was already 0) needed to be pushed to Vercel.")
                debug('No changes needed to be pushed to Vercel.');
            }

            debug('Final local envVars before writing to envPath:', JSON.stringify(envVars, null, 2));
            writeEnvFile(envPath, envVars);
            console.log(`✅ Local ${envPath} has been updated/saved.`);
            debug(`Local ${envPath} saved.`);
            console.log('✅ Vercel environment sync complete.');
            fs.removeSync('.env.vercel');
            debug('Removed temporary .env.vercel file.');
          }
        } else if (envVars.VERCEL_PROJECT_NAME && !isLinkedSuccessfully) {
            debug(`Skipping Vercel env sync because linking to ${envVars.VERCEL_PROJECT_NAME} failed earlier.`);
        }
      }
    } else {
      debug('User chose to skip Vercel sync.');
    }
  }

  if (!options.skipGithub) {
    if (await askYesNo(rl, 'Do you want to sync .env with GitHub Actions secrets?', false)) {
      debug('Proceeding with GitHub Actions secrets sync.');
        const remoteUrl = getGitHubRemoteUrl() || gh.getRemoteUrl();
      if (!remoteUrl) { 
        console.log('⚠️ GitHub remote URL not found. Skipping GitHub secrets sync.');
        debug('GitHub remote URL not found, skipping GitHub secrets sync.');
      } else {
        console.log(`Syncing .env with GitHub Actions secrets for repository: ${remoteUrl}`);
        const baseEnvForGithub = parseEnvFile(envPath);
        const excludedKeys = (baseEnvForGithub.GITHUB_SECRETS_EXCLUDE || '').split(',').map(k => k.trim()).filter(Boolean);
        excludedKeys.push('GITHUB_TOKEN', 'VERCEL_TOKEN', 'NPM_TOKEN');
        excludedKeys.push('VERCEL_TEAM_ID', 'VERCEL_PROJECT_NAME', 'GITHUB_SECRETS_EXCLUDE');
        // DOCKER_USERNAME and DOCKER_PASSWORD should be synced to GitHub for CI/CD
        // OPENROUTER_API_KEY should NOT be in excludedKeys by default if we want to sync it.
        debug('GitHub Actions secrets excluded keys:', excludedKeys);
        
          for (const [key, value] of Object.entries(baseEnvForGithub)) {
          if (excludedKeys.includes(key) || typeof value !== 'string') {
            debug(`Skipping ${key} from GitHub secrets sync (excluded or not a string).`);
            continue;
          }
          if (key.startsWith('GITHUB_')) {
            console.warn(`⚠️ Skipping GitHub secret ${key}: Names starting with GITHUB_ are reserved.`);
            debug(`Skipping reserved GitHub secret name: ${key}`);
            continue;
          }
          debug(`Attempting to set GitHub secret: ${key}`);
            try {
              gh.setSecret(remoteUrl, key, value);
              console.log(`✅ Set GitHub secret: ${key}`);
              debug(`Successfully set GitHub secret: ${key}`);
            } catch (e) {
              console.error(`❌ Failed to set GitHub secret: ${key}`);
            }
        }
        console.log('✅ GitHub Actions secrets sync complete.');
      }
    } else {
      debug('User chose to skip GitHub Actions secrets sync.');
    }
  }
  debug('Environment variable synchronization process finished.');
}

async function main() {
  const rl = createRlInterface();
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found. Please create or configure it first.');
    rl.close();
    process.exit(1);
  }
  try {
    await syncEnvironmentVariables(rl, envPath);
    console.log('✅ Environment variable synchronization process finished.');
  } catch (error) {
    console.error('❌ Error during environment variable synchronization process:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
} 
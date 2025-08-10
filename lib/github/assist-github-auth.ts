import readline from 'readline';
import fs from 'fs-extra';
import path from 'path';
import spawn from 'cross-spawn';
import Debug from '../debug';
import { createRlInterface, askYesNo, askForInput } from '../assist-common'; // Import common helpers

const debug = Debug('assist:github');

export async function checkGitHubAuth(rl: readline.Interface): Promise<void> {
  debug('Checking GitHub authentication');
  console.log('🔑 Checking GitHub authentication...');
  try {
    const ghVersionResult = spawn.sync('gh', ['--version'], { stdio: 'pipe', encoding: 'utf-8' });
    if (ghVersionResult.error || ghVersionResult.status !== 0) {
      console.error('❌ GitHub CLI is not installed or not in PATH.');
      console.log('\nPlease install GitHub CLI to continue: https://cli.github.com/');
      process.exit(1);
    }
    const authStatusResult = spawn.sync('gh', ['auth', 'status'], { stdio: 'pipe', encoding: 'utf-8' });
    if (authStatusResult.status !== 0) {
      console.log('❌ You are not authenticated with GitHub. Please login:');
      console.log('\n📋 To authenticate with GitHub, please run the following command in a separate terminal:');
      console.log('   gh auth login');
      console.log('\n🔗 Or use a web browser authentication:');
      console.log('   gh auth login --web');
      console.log('\n⚠️ After authentication, please run this command again.');
      console.log('\nPress Enter after you have completed GitHub authentication...');
      
      // Wait for user to press Enter
      await new Promise<void>((resolve) => {
        rl.question('', () => {
          resolve();
        });
      });
      
      // Check again after user indicates they have authenticated
      const recheckResult = spawn.sync('gh', ['auth', 'status'], { stdio: 'pipe', encoding: 'utf-8' });
      if (recheckResult.status !== 0) {
        console.error('❌ GitHub authentication still not detected. Please ensure you have completed authentication.');
        process.exit(1);
      }
      console.log('✅ GitHub authentication verified successfully!');
    } else { 
      console.log('✅ Already authenticated with GitHub.'); 
    }
  } catch (error) { 
    console.error('❌ Error checking GitHub authentication:', error); 
    process.exit(1); 
  }
}

export async function setupRepository(rl: readline.Interface): Promise<void> {
  debug('Setting up repository'); console.log('📁 Setting up repository...');
  const isRepo = fs.existsSync(path.join(process.cwd(), '.git'));
  if (isRepo) {
    const remoteUrlRes = spawn.sync('git', ['remote', 'get-url', 'origin'], { encoding: 'utf-8' });
    if (remoteUrlRes.status === 0 && remoteUrlRes.stdout?.includes('github.com')) {
      console.log(`✅ Current directory is already a GitHub repository: ${remoteUrlRes.stdout.trim()}`); return;
    }
    console.log('⚠️ Current directory is a git repository but has no GitHub remote or it is not GitHub.');
    if (await askYesNo(rl, 'Would you like to add a GitHub remote?', false)) {
      const repoName = path.basename(process.cwd());
      const createPublic = await askYesNo(rl, 'Create as public repository?', false);
      console.log(`🔨 Creating GitHub repository: ${repoName}...`);
      const createResult = spawn.sync('gh', ['repo', 'create', repoName, '--source=.', createPublic ? '--public' : '--private', '--push'], { stdio: 'inherit' });
      if (createResult.error || createResult.status !== 0) { console.error('❌ Failed to create GitHub repository.'); if (!await askYesNo(rl, 'Continue without GitHub remote?', false)) process.exit(1); }
      else { console.log('✅ GitHub repository created and configured as remote.'); }
    }
  } else {
    console.log('⚠️ Current directory is not a git repository.');
    if (await askYesNo(rl, 'Would you like to create a new GitHub repository here?', false)) {
      spawn.sync('git', ['init'], { stdio: 'inherit' });
      const repoName = path.basename(process.cwd());
      const createPublic = await askYesNo(rl, 'Create as public repository?', false);
      console.log(`🔨 Creating GitHub repository: ${repoName}...`);
      const createResult = spawn.sync('gh', ['repo', 'create', repoName, '--source=.', createPublic ? '--public' : '--private', '--push'], { stdio: 'inherit' });
      if (createResult.error || createResult.status !== 0) { console.error('❌ Failed to create GitHub repository.'); if (!await askYesNo(rl, 'Continue without GitHub remote?', false)) process.exit(1); }
      else { console.log('✅ GitHub repository created and configured as remote.'); }
    } else if (await askYesNo(rl, 'Do you have an existing GitHub repository you want to use?', false)) {
      const repoUrl = await askForInput(rl, 'Enter the GitHub repository URL');
      if (!repoUrl) { console.error('❌ No repository URL provided.'); process.exit(1); }
      if (fs.readdirSync(process.cwd()).length !== 0) { console.error('❌ Current directory is not empty. Please use an empty directory for cloning.'); process.exit(1); }
      console.log(`🔄 Cloning repository from ${repoUrl}...`);
      const cloneResult = spawn.sync('git', ['clone', repoUrl, '.'], { stdio: 'inherit' });
      if (cloneResult.error || cloneResult.status !== 0) { console.error('❌ Failed to clone repository.'); process.exit(1); }
      console.log('✅ Repository cloned successfully.');
    } else { console.error('❌ A GitHub repository is required.'); process.exit(1); }
  }
}

// Main function for standalone execution
async function main() {
  const rl = createRlInterface();
  try {
    await checkGitHubAuth(rl);
    await setupRepository(rl);
    console.log('✅ GitHub Auth and Repository setup checks complete.');
  } catch (error) {
    console.error('❌ Error during GitHub setup:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
} 
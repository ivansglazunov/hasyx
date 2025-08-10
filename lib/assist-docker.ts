import readline from 'readline';
import path from 'path';
import Debug from './debug';
import { createRlInterface, askYesNo, askForInput, parseEnvFile, writeEnvFile, maskDisplaySecret } from './assist-common';
import { checkDockerInstallation, installDocker } from './docker';

export const debug = Debug('assist:docker');

/**
 * Configure Docker settings
 */
export async function configureDocker(rl: readline.Interface, envPath: string): Promise<Record<string, string>> {
  debug('Starting Docker configuration');
  console.log('\n🐳 Docker Configuration');
  console.log('========================');
  
  let envVars = parseEnvFile(envPath);
  let changed = false;

  // Check Docker installation first
  const isDockerInstalled = await checkDockerInstallation();
  if (!isDockerInstalled) {
    const installSuccess = await installDocker(rl);
    if (!installSuccess) {
      console.log('❌ Cannot configure Docker without installation. Skipping Docker configuration.');
      return envVars;
    }
  }

  console.log('✅ Docker is installed and ready');
  
  // Ask first if user wants to configure Docker Hub credentials
  const currentDockerUsername = envVars.DOCKER_USERNAME;
  const currentDockerPassword = envVars.DOCKER_PASSWORD;
  const hasExistingConfig = (currentDockerUsername && currentDockerUsername.trim() !== '') || 
                           (currentDockerPassword && currentDockerPassword.trim() !== '');
  
  let shouldConfigure = false;
  
  if (hasExistingConfig) {
    console.log('🐳 Docker Hub credentials are already configured.');
    if (currentDockerUsername) {
      console.log(`   Current username: ${currentDockerUsername}`);
    }
    if (currentDockerPassword) {
      console.log(`   Current password/token: ${maskDisplaySecret(currentDockerPassword)}`);
    }
    shouldConfigure = await askYesNo(rl, 'Do you want to reconfigure Docker Hub credentials?', false);
  } else {
    shouldConfigure = await askYesNo(rl, 'Do you want to configure Docker Hub credentials for automatic publishing?', false);
  }
  
  if (!shouldConfigure) {
    console.log('⏭️ Skipping Docker Hub credentials configuration.');
    return envVars;
  }
  
  console.log('🐳 Configuring Docker Hub credentials...');
  
  // Configure Docker Hub credentials for automatic publishing
  console.log('\n📋 Docker Hub Credentials Configuration');
  console.log('========================================');
  console.log('To enable automatic Docker image publishing via GitHub Actions,');
  console.log('you need Docker Hub credentials:');
  console.log('   • Docker Hub username');
  console.log('   • Docker Hub password or access token');
  console.log('');
  console.log('💡 Tip: Use Docker Hub access tokens instead of passwords for better security');
  console.log('   Generate at: https://hub.docker.com/settings/security');

  // Ask for Docker username
  if (currentDockerUsername) {
    console.log(`\n🔍 Current Docker username: ${currentDockerUsername}`);
    const keepUsername = await askYesNo(rl, 'Keep this Docker username?', true);
    
    if (!keepUsername) {
      const newUsername = await askForInput(
        rl,
        'Enter your Docker Hub username: ',
        currentDockerUsername
      );
      
      if (newUsername !== currentDockerUsername) {
        envVars.DOCKER_USERNAME = newUsername;
        changed = true;
        console.log(`✅ Docker username updated to: ${newUsername}`);
      }
    }
  } else {
    const username = await askForInput(
      rl,
      'Enter your Docker Hub username: '
    );
    
    if (username) {
      envVars.DOCKER_USERNAME = username;
      changed = true;
      console.log(`✅ Docker username set to: ${username}`);
    } else {
      console.log('⚠️  No Docker username provided. GitHub Actions Docker publishing will not work.');
    }
  }

  // Ask for Docker password/token
  if (currentDockerPassword) {
    console.log(`\n🔍 Docker password/token is already set (${maskDisplaySecret(currentDockerPassword)})`);
    const keepPassword = await askYesNo(rl, 'Keep this Docker password/token?', true);
    
    if (!keepPassword) {
      const newPassword = await askForInput(
        rl,
        'Enter your Docker Hub password or access token: ',
        '', // Don't show current value as default for security
        true // Hide input
      );
      
      if (newPassword && newPassword !== currentDockerPassword) {
        envVars.DOCKER_PASSWORD = newPassword;
        changed = true;
        console.log('✅ Docker password/token updated');
      }
    }
  } else {
    const password = await askForInput(
      rl,
      'Enter your Docker Hub password or access token: ',
      '',
      true // Hide input
    );
    
    if (password) {
      envVars.DOCKER_PASSWORD = password;
      changed = true;
      console.log('✅ Docker password/token set');
    } else {
      console.log('⚠️  No Docker password/token provided. GitHub Actions Docker publishing will not work.');
    }
  }

  // Configure Docker publishing
  console.log('\n🚀 Docker Publishing Configuration');
  console.log('==================================');
  console.log('Controls whether GitHub Actions will automatically build and push Docker images');
  console.log('to Docker Hub when code is pushed to the repository.');

  // Configure default port
  const currentPort = envVars.PORT;
  if (currentPort) {
    console.log(`\n🔍 Current default port: ${currentPort}`);
    const keepPort = await askYesNo(rl, 'Keep this default port?', true);
    
    if (!keepPort) {
      const newPort = await askForInput(
        rl,
        'Enter default port for containers: ',
        currentPort
      );
      
      if (newPort !== currentPort) {
        envVars.PORT = newPort;
        changed = true;
        console.log(`✅ Default port updated to: ${newPort}`);
      }
    }
  } else {
    const port = await askForInput(
      rl,
      'Enter default port for containers (default: 3000): ',
      '3000'
    );
    
    if (port) {
      envVars.PORT = port;
      changed = true;
      console.log(`✅ Default port set to: ${port}`);
    }
  }

  // Summary
  console.log('\n📊 Docker Configuration Summary');
  console.log('===============================');
  
  if (envVars.DOCKER_USERNAME) {
    console.log(`🐳 Docker Hub Username: ${envVars.DOCKER_USERNAME}`);
  } else {
    console.log('🐳 Docker Hub Username: Not configured');
  }
  
  if (envVars.DOCKER_PASSWORD) {
    console.log(`🔐 Docker Hub Password/Token: ${maskDisplaySecret(envVars.DOCKER_PASSWORD)}`);
  } else {
    console.log('🔐 Docker Hub Password/Token: Not configured');
  }
  
  if (envVars.PORT) {
    console.log(`🚪 Default Port: ${envVars.PORT}`);
  }

  // Save changes if any
  if (changed) {
    writeEnvFile(envPath, envVars);
    debug('Docker configuration saved to .env file');
    console.log('\n💾 Configuration saved to .env file');
  }

  console.log('\n🎉 Docker configuration completed!');
  
  if (envVars.DOCKER_USERNAME && envVars.DOCKER_PASSWORD) {
    console.log('\n🚀 Next steps for GitHub Actions:');
    console.log('   1. Push your code to GitHub repository');
    console.log('   2. Docker credentials will be automatically synced to GitHub secrets');
    console.log('   3. GitHub Actions will build and publish Docker images automatically');
    console.log('   4. Use `npx hasyx docker define [port]` to create containers');
  } else {
    console.log('\n💡 To enable automatic Docker publishing:');
    if (!envVars.DOCKER_USERNAME || !envVars.DOCKER_PASSWORD) {
      console.log('   • Set DOCKER_USERNAME and DOCKER_PASSWORD in .env');
    }
    console.log('   • Run sync command to upload secrets to GitHub');
    console.log('   • GitHub Actions will handle the rest');
  }

  return envVars;
}

/**
 * Main setup function for standalone execution
 */
export async function setupDockerManagement(): Promise<void> {
  const rl = createRlInterface();
  const envPath = path.resolve('.env');
  
  try {
    await configureDocker(rl, envPath);
  } catch (error) {
    console.error(`❌ Docker configuration failed: ${error}`);
    debug(`Docker setup error: ${error}`);
  } finally {
    rl.close();
  }
}

// Export for CLI usage
if (require.main === module) {
  setupDockerManagement().catch(console.error);
} 
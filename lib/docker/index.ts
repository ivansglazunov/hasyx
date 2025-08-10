import spawn from 'cross-spawn';
import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';
import Debug from '../debug';

// Local logger for the docker module
const debug = Debug('docker');
// Minimal .env parser (replaces assist-common)
function parseEnvFile(filePath: string): Record<string, string> {
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

// Minimal yes/no prompt (replaces assist-common)
function askYesNo(rl: readline.Interface, question: string, defaultValue: boolean = false): Promise<boolean> {
  const suffix = defaultValue ? ' [Y/n] ' : ' [y/N] ';
  return new Promise((resolve) => {
    rl.question(`${question}${suffix}`, (answer: string) => {
      const normalized = (answer || '').trim().toLowerCase();
      if (!normalized) return resolve(defaultValue);
      if (['y', 'yes'].includes(normalized)) return resolve(true);
      if (['n', 'no'].includes(normalized)) return resolve(false);
      resolve(defaultValue);
    });
  });
}

interface DockerContainerInfo {
  name: string;
  port: string;
  status: string;
  image: string;
}
/**
 * Check whether Docker CLI is installed and accessible on this system.
 *
 * Uses `docker --version` to determine presence of Docker.
 *
 * @returns Promise that resolves to true when Docker is available, false otherwise.
 */
export async function checkDockerInstallation(): Promise<boolean> {
  debug('Checking Docker installation');

  try {
    const result = spawn.sync('docker', ['--version'], { encoding: 'utf-8' });
    if (result.status === 0) {
      debug('Docker is installed');
      return true;
    }
  } catch (error) {
    debug('Docker check failed:', error);
  }

  return false;
}
/**
 * Install Docker on the system via the official convenience script.
 *
 * This method is interactive and uses the provided `readline.Interface` to ask
 * the user for confirmation before running the installation steps.
 * The installation is performed by executing the script from `get.docker.com`.
 *
 * Note: This will require sudo privileges and may require the user to re-login
 * for group permission changes to take effect.
 *
 * @param rl - Readline interface for interactive prompts.
 * @returns Promise that resolves to true if installation succeeded, false otherwise.
 */
export async function installDocker(rl: readline.Interface): Promise<boolean> {
  debug('Starting Docker installation');
  console.log('\n🐳 Docker Installation');
  console.log('=====================');

  const shouldInstall = await askYesNo(rl, 'Docker is not installed. Would you like to install it?', false);

  if (!shouldInstall) {
    console.log('❌ Docker installation cancelled. Cannot proceed without Docker.');
    return false;
  }

  console.log('📦 Installing Docker...');
  console.log('This may take a few minutes.');

  // Install Docker using the official script
  const installScript = `
    curl -fsSL https://get.docker.com -o get-docker.sh &&
    sudo sh get-docker.sh &&
    sudo usermod -aG docker $USER &&
    rm get-docker.sh
  `;

  const result = spawn.sync('bash', ['-c', installScript], {
    stdio: 'inherit',
    encoding: 'utf-8'
  });

  if (result.status !== 0) {
    console.error('❌ Failed to install Docker automatically');
    console.error('Please install Docker manually: https://docs.docker.com/engine/install/');
    return false;
  }

  console.log('✅ Docker installed successfully!');
  console.log('⚠️  You may need to log out and log back in for group permissions to take effect.');

  return true;
}
/**
 * Get project (container) name from `package.json`.
 *
 * Prefers the `docker_container_name` field and falls back to `name`.
 * Throws if neither is present.
 *
 * @param projectRoot - Absolute path to the project root that contains `package.json`.
 * @returns The project/container name.
 */
function getProjectName(projectRoot: string): string {
  try {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = fs.readJsonSync(packageJsonPath);

    // Check for docker_container_name first, then fallback to name
    const containerName = packageJson.docker_container_name || packageJson.name;

    if (!containerName) {
      throw new Error('No name or docker_container_name found in package.json');
    }

    debug(`Project name: ${containerName}`);
    return containerName;
  } catch (error) {
    debug('Error reading package.json:', error);
    throw new Error(`Failed to read project name from package.json: ${error}`);
  }
}
/**
 * Resolve the default external port for the project from environment.
 *
 * Reads `PORT` from process env and falls back to `3000`.
 *
 * @returns Default port as string.
 */
function getDefaultPort(): string {
  const port = process.env.PORT || '3000';
  debug(`Default port: ${port}`);
  return port;
}
/**
 * List running containers for the current project.
 *
 * Parses `docker ps` output and returns only containers that belong to this
 * project (by matching container name or image name against the project name).
 * Attempts to extract the external port from the ports column.
 *
 * @returns Promise resolving to an array of container infos.
 */

export async function listContainers(): Promise<DockerContainerInfo[]> {
  debug('Listing containers');
  const projectName = getProjectName(process.cwd());

  try {
    const result = spawn.sync('docker', ['ps', '--format', 'table {{.Names}}\t{{.Ports}}\t{{.Status}}\t{{.Image}}'], {
      encoding: 'utf-8'
    });

    if (result.status !== 0) {
      throw new Error(`Docker ps failed: ${result.stderr}`);
    }

    const lines = result.stdout.split('\n').slice(1); // Skip header
    const containers: DockerContainerInfo[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;

      const parts = line.split('\t');
      if (parts.length >= 4) {
        const name = parts[0].trim();
        const ports = parts[1].trim();
        const status = parts[2].trim();
        const image = parts[3].trim();

        // Filter containers that belong to this project
        if (name.startsWith(projectName) || image.includes(projectName)) {
          // Extract external port from ports string (e.g., "0.0.0.0:8080->3000/tcp")
          const portMatch = ports.match(/0\.0\.0\.0:(\d+)->/);
          const port = portMatch ? portMatch[1] : '';

          containers.push({ name, port, status, image });
        }
      }
    }

    debug(`Found ${containers.length} containers for project ${projectName}`);
    return containers;
  } catch (error) {
    debug('Error listing containers:', error);
    throw error;
  }
}
/**
 * Show logs for a specific project container.
 *
 * Prints the last N lines (configurable via `tail`) with timestamps by calling
 * `docker logs` for the derived container name `<projectName>-<port>`.
 *
 * @param port - External port used to compose the container name.
 * @param tail - Number of log lines to show (default 100).
 * @returns Promise that resolves when logs have been printed.
 */

export async function showContainerLogs(port: string, tail: number = 100): Promise<void> {
  debug(`Showing logs for container on port ${port}`);
  const projectName = getProjectName(process.cwd());
  const containerName = `${projectName}-${port}`;

  console.log(`📝 Showing last ${tail} lines of logs for: ${containerName}`);
  console.log('═'.repeat(80));

  try {
    const result = spawn.sync('docker', ['logs', '--tail', tail.toString(), '--timestamps', containerName], {
      stdio: 'inherit',
      encoding: 'utf-8'
    });

    if (result.status !== 0) {
      throw new Error(`Failed to show logs for container ${containerName}`);
    }

    console.log('═'.repeat(80));
    console.log(`💡 To follow logs in real-time: docker logs -f ${containerName}`);
  } catch (error) {
    console.error(`❌ Error showing logs: ${error}`);
    throw error;
  }
}
/**
 * Show environment variables inside a specific project container.
 *
 * Executes `env` inside the container and prints variables alphabetically,
 * masking sensitive values (keys containing secret/password/token/key).
 *
 * @param port - External port used to compose the container name.
 * @returns Promise that resolves when environment variables have been printed.
 */

export async function showContainerEnv(port: string): Promise<void> {
  debug(`Showing environment variables for container on port ${port}`);
  const projectName = getProjectName(process.cwd());
  const containerName = `${projectName}-${port}`;

  console.log(`🔧 Environment variables for: ${containerName}`);
  console.log('═'.repeat(80));

  try {
    const result = spawn.sync('docker', ['exec', containerName, 'env'], {
      encoding: 'utf-8'
    });

    if (result.status !== 0) {
      throw new Error(`Failed to show environment variables for container ${containerName}`);
    }

    const envLines = result.stdout.split('\n').filter(line => line.trim()).sort();
    envLines.forEach(line => {
      if (line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=');

        // Mask sensitive values
        if (key.toLowerCase().includes('secret') ||
          key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('token') ||
          key.toLowerCase().includes('key')) {
          console.log(`${key}=********`);
        } else {
          console.log(`${key}=${value}`);
        }
      }
    });

    console.log('═'.repeat(80));
  } catch (error) {
    console.error(`❌ Error showing environment variables: ${error}`);
    throw error;
  }
}
/**
 * Stop and remove a project container and its associated Watchtower.
 *
 * This attempts to stop/remove both the main container and the matching
 * Watchtower container. Warnings are printed if resources are already stopped
 * or missing.
 *
 * @param port - External port used to compose the container and watchtower names.
 * @returns Promise that resolves when cleanup attempts finish.
 */

export async function undefineContainer(port: string): Promise<void> {
  debug(`Undefining container on port ${port}`);
  const projectName = getProjectName(process.cwd());
  const containerName = `${projectName}-${port}`;
  const watchtowerName = `${projectName}-watchtower-${port}`;

  console.log(`🗑️ Removing container: ${containerName}`);

  // Stop and remove the main container
  try {
    const stopResult = spawn.sync('docker', ['stop', containerName], { encoding: 'utf-8' });
    if (stopResult.status === 0) {
      console.log(`✅ Stopped container: ${containerName}`);
    } else {
      console.warn(`⚠️ Failed to stop container ${containerName} (it may not be running)`);
    }

    const removeResult = spawn.sync('docker', ['rm', containerName], { encoding: 'utf-8' });
    if (removeResult.status === 0) {
      console.log(`✅ Removed container: ${containerName}`);
    } else {
      console.warn(`⚠️ Failed to remove container ${containerName} (it may not exist)`);
    }
  } catch (error) {
    console.error(`❌ Error managing container ${containerName}:`, error);
  }

  // Stop and remove the watchtower container
  try {
    const stopWatchtowerResult = spawn.sync('docker', ['stop', watchtowerName], { encoding: 'utf-8' });
    if (stopWatchtowerResult.status === 0) {
      console.log(`✅ Stopped watchtower: ${watchtowerName}`);
    } else {
      console.warn(`⚠️ Failed to stop watchtower ${watchtowerName} (it may not be running)`);
    }

    const removeWatchtowerResult = spawn.sync('docker', ['rm', watchtowerName], { encoding: 'utf-8' });
    if (removeWatchtowerResult.status === 0) {
      console.log(`✅ Removed watchtower: ${watchtowerName}`);
    } else {
      console.warn(`⚠️ Failed to remove watchtower ${watchtowerName} (it may not exist)`);
    }
  } catch (error) {
    console.error(`❌ Error managing watchtower ${watchtowerName}:`, error);
  }

  console.log(`🎉 Container cleanup completed for port ${port}`);
}
/**
 * Create and start the project container along with a Watchtower companion.
 *
 * - Reads environment from `.env` and passes them into the container (excluding PORT).
 * - Forces internal `PORT=3000` and maps `<external>:3000`.
 * - Starts a Watchtower container to auto-update the main container image.
 *
 * If `port` is omitted, the default port is resolved from `process.env.PORT` or `3000`.
 *
 * @param port - Optional external port to expose.
 * @returns Promise that resolves when both containers are running.
 */

export async function defineContainer(port?: string): Promise<void> {
  const actualPort = port || getDefaultPort();
  debug(`Defining container on port ${actualPort}`);

  const projectName = getProjectName(process.cwd());
  const containerName = `${projectName}-${actualPort}`;
  const watchtowerName = `${projectName}-watchtower-${actualPort}`;

  // Read environment variables from .env file to get Docker username
  const envPath = path.resolve('.env');
  const envVars = parseEnvFile(envPath);

  // Construct image name with Docker Hub username if available
  let imageName = `${projectName}:latest`;
  if (envVars.DOCKERHUB_USERNAME) {
    imageName = `${envVars.DOCKERHUB_USERNAME}/${projectName}:latest`;
  }

  console.log(`🚀 Creating container: ${containerName}`);
  console.log(`   Image: ${imageName}`);
  console.log(`   External Port: ${actualPort} -> Internal Port: 3000`);

  // Prepare environment variables for Docker
  const dockerEnvArgs: string[] = [];

  // Always set internal PORT to 3000
  dockerEnvArgs.push('-e', 'PORT=3000');

  // Add all other environment variables except PORT
  Object.entries(envVars).forEach(([key, value]) => {
    if (key !== 'PORT' && value) {
      dockerEnvArgs.push('-e', `${key}=${value}`);
    }
  });

  console.log(`📋 Passing ${dockerEnvArgs.length / 2} environment variables to container`);
  debug(`Environment variables: ${dockerEnvArgs.join(' ')}`);

  // Start watchtower for auto-updates
  console.log(`🔄 Starting watchtower: ${watchtowerName}`);
  try {
    const watchtowerResult = spawn.sync('docker', [
      'run', '-d',
      '--name', watchtowerName,
      '--restart', 'unless-stopped',
      '-v', '/var/run/docker.sock:/var/run/docker.sock',
      'containrrr/watchtower',
      '--interval', '30', // Check every 30 seconds
      '--cleanup', // Remove old images
      containerName
    ], {
      stdio: 'inherit',
      encoding: 'utf-8'
    });

    if (watchtowerResult.status !== 0) {
      throw new Error(`Failed to start watchtower: ${watchtowerResult.stderr}`);
    }

    console.log(`✅ Watchtower started: ${watchtowerName}`);
  } catch (error) {
    console.error(`❌ Failed to start watchtower: ${error}`);
    throw error;
  }

  // Start the main container
  console.log(`🐳 Starting container: ${containerName}`);
  try {
    const containerArgs = [
      'run', '-d',
      '--name', containerName,
      '--restart', 'unless-stopped',
      '-p', `${actualPort}:3000`, // Map external port to internal port 3000
      ...dockerEnvArgs, // Spread environment variables
      imageName
    ];

    debug(`Docker run command: docker ${containerArgs.join(' ')}`);

    const containerResult = spawn.sync('docker', containerArgs, {
      stdio: 'inherit',
      encoding: 'utf-8'
    });

    if (containerResult.status !== 0) {
      throw new Error(`Failed to start container: ${containerResult.stderr}`);
    }

    console.log(`✅ Container started: ${containerName}`);
    console.log(`🌐 Available at: http://localhost:${actualPort}`);
    console.log(`📝 Container logs: docker logs ${containerName}`);
    console.log(`🔄 Auto-updates enabled via Watchtower`);
  } catch (error) {
    console.error(`❌ Failed to start container: ${error}`);

    // Cleanup watchtower if container failed
    console.log('🧹 Cleaning up watchtower due to container failure...');
    spawn.sync('docker', ['stop', watchtowerName], { encoding: 'utf-8' });
    spawn.sync('docker', ['rm', watchtowerName], { encoding: 'utf-8' });

    throw error;
  }

  console.log(`🎉 Container setup completed successfully!`);
}

/**
 * Thin object-oriented facade over the module-level Docker functions.
 *
 * This class does not hold any configuration or state; it simply delegates to
 * the exported functions in this module to provide an alternative, OO-style
 * calling surface. Logic remains in the standalone functions above.
 */
export class Docker {
  /** See {@link checkDockerInstallation} */
  public async checkDockerInstallation(): Promise<boolean> {
    return checkDockerInstallation();
  }

  /** See {@link installDocker} */
  public async installDocker(rl: readline.Interface): Promise<boolean> {
    return installDocker(rl);
  }

  /** See {@link listContainers} */
  public async listContainers(): Promise<DockerContainerInfo[]> {
    return listContainers();
  }

  /** See {@link showContainerLogs} */
  public async showContainerLogs(port: string, tail: number = 100): Promise<void> {
    return showContainerLogs(port, tail);
  }

  /** See {@link showContainerEnv} */
  public async showContainerEnv(port: string): Promise<void> {
    return showContainerEnv(port);
  }

  /** See {@link undefineContainer} */
  public async undefineContainer(port: string): Promise<void> {
    return undefineContainer(port);
  }

  /** See {@link defineContainer} */
  public async defineContainer(port?: string): Promise<void> {
    return defineContainer(port);
  }
}

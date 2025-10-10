#!/usr/bin/env node
/**
 * Auto-install wstunnel binary for the current platform
 * Used in postinstall script to ensure wstunnel is available
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { mkdir, chmod, writeFile } from 'fs/promises';
import { homedir, platform, arch } from 'os';
import { join } from 'path';
import https from 'https';
import { createWriteStream } from 'fs';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import * as tar from 'tar';

const WSTUNNEL_VERSION = '10.4.0';
const WSTUNNEL_REPO = 'erebe/wstunnel';

interface PlatformInfo {
  platform: string;
  arch: string;
  filename: string;
}

function getPlatformInfo(): PlatformInfo | null {
  const os = platform();
  const architecture = arch();
  
  let platformStr: string;
  let archStr: string;
  
  // Map Node.js platform to wstunnel platform
  switch (os) {
    case 'darwin':
      platformStr = 'darwin';
      break;
    case 'linux':
      platformStr = 'linux';
      break;
    case 'win32':
      platformStr = 'windows';
      break;
    default:
      console.warn(`⚠️  Platform ${os} is not supported for auto-installation`);
      return null;
  }
  
  // Map Node.js arch to wstunnel arch
  switch (architecture) {
    case 'x64':
      archStr = 'amd64';
      break;
    case 'arm64':
      archStr = 'arm64';
      break;
    default:
      console.warn(`⚠️  Architecture ${architecture} is not supported for auto-installation`);
      return null;
  }
  
  const ext = os === 'win32' ? '.zip' : '.tar.gz';
  const filename = `wstunnel_${WSTUNNEL_VERSION}_${platformStr}_${archStr}${ext}`;
  
  return {
    platform: platformStr,
    arch: archStr,
    filename
  };
}

async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      const fileStream = createWriteStream(destPath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function extractTarGz(archivePath: string, destDir: string): Promise<void> {
  await tar.extract({
    file: archivePath,
    cwd: destDir
  });
}

async function checkWstunnelExists(): Promise<boolean> {
  return new Promise((resolve) => {
    const check = spawn('wstunnel', ['--version'], { stdio: 'pipe' });
    check.on('exit', (code) => {
      resolve(code === 0);
    });
    check.on('error', () => {
      resolve(false);
    });
  });
}

async function installWstunnel(): Promise<void> {
  console.log('🔍 Checking wstunnel installation...');
  
  // Check if wstunnel is already installed
  const exists = await checkWstunnelExists();
  if (exists) {
    console.log('✅ wstunnel is already installed');
    return;
  }
  
  console.log('📦 wstunnel not found, installing...');
  
  const platformInfo = getPlatformInfo();
  if (!platformInfo) {
    console.warn('⚠️  Automatic installation not supported for this platform');
    console.warn('Please install wstunnel manually from:');
    console.warn(`https://github.com/${WSTUNNEL_REPO}/releases/tag/v${WSTUNNEL_VERSION}`);
    return;
  }
  
  const downloadUrl = `https://github.com/${WSTUNNEL_REPO}/releases/download/v${WSTUNNEL_VERSION}/${platformInfo.filename}`;
  const binDir = join(homedir(), 'bin');
  const tmpDir = join(homedir(), '.hasyx-tmp');
  const archivePath = join(tmpDir, platformInfo.filename);
  const binaryPath = join(binDir, platform() === 'win32' ? 'wstunnel.exe' : 'wstunnel');
  
  try {
    // Create directories
    await mkdir(binDir, { recursive: true });
    await mkdir(tmpDir, { recursive: true });
    
    console.log(`📥 Downloading wstunnel v${WSTUNNEL_VERSION}...`);
    console.log(`   ${downloadUrl}`);
    
    await downloadFile(downloadUrl, archivePath);
    console.log('✅ Download complete');
    
    console.log('📦 Extracting...');
    await extractTarGz(archivePath, tmpDir);
    
    // Move binary to bin directory
    const extractedBinary = join(tmpDir, platform() === 'win32' ? 'wstunnel.exe' : 'wstunnel');
    
    // Read and write to move file
    const fs = await import('fs/promises');
    await fs.copyFile(extractedBinary, binaryPath);
    await chmod(binaryPath, 0o755);
    
    // Clean up
    await fs.unlink(archivePath);
    await fs.unlink(extractedBinary);
    
    console.log(`✅ wstunnel installed to ${binaryPath}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Add ~/bin to your PATH if not already added:');
    console.log('   export PATH="$HOME/bin:$PATH"');
    console.log('   Add this line to your ~/.zshrc or ~/.bashrc');
    
  } catch (error) {
    console.error('❌ Failed to install wstunnel:', error);
    console.warn('Please install wstunnel manually from:');
    console.warn(`https://github.com/${WSTUNNEL_REPO}/releases/tag/v${WSTUNNEL_VERSION}`);
  }
}

// Run if called directly (CommonJS compatible check)
if (typeof require !== 'undefined' && require.main === module) {
  installWstunnel().catch(console.error);
}

export { installWstunnel };


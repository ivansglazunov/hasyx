import { describe, it, expect } from '@jest/globals';
import fs from 'fs-extra';
import * as nodeFs from 'node:fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import Debug from './debug';

const debug = Debug('test:instance');

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateTempProjectDir(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 10);
  // Must be ignored by git/npm (repo .gitignore contains *.temp)
  return path.resolve(__dirname, `../hasyx-instance-${timestamp}-${random}.temp`);
}

function runInitInDirectory(targetDir: string) {
  const cliTsPath = path.resolve(__dirname, './cli.ts');
  // Hint init to install hasyx from the local repository directory instead of npm registry
  const hasyxRepoRoot = path.resolve(__dirname, '..');
  // Ensure staged templates (_lib and _components) are present for init
  try {
    const stagedLib = path.join(hasyxRepoRoot, '_lib');
    const stagedComponents = path.join(hasyxRepoRoot, '_components');
    if (!nodeFs.existsSync(stagedLib) || !nodeFs.existsSync(stagedComponents)) {
      debug('Staged templates not found, running build-templates...');
      const stage = spawnSync('npx', ['tsx', path.join(hasyxRepoRoot, 'lib', 'build-templates.ts')], {
        cwd: hasyxRepoRoot,
        encoding: 'utf-8',
        stdio: 'inherit',
      });
      if (stage.error || (typeof stage.status === 'number' && stage.status !== 0)) {
        throw stage.error || new Error(`build-templates exited with code ${stage.status}`);
      }
    }
  } catch (e) {
    throw e instanceof Error ? e : new Error(String(e));
  }
  // Prefer tarball install to ensure prepack/build outputs are present
  const pack = spawnSync('npm', ['pack', '--silent'], { cwd: hasyxRepoRoot, encoding: 'utf-8' });
  if (pack.error || typeof pack.stdout !== 'string' || pack.stdout.trim().length === 0) {
    throw pack.error || new Error('Failed to create npm pack tarball');
  }
  const tgzName = pack.stdout.trim().split(/\s+/).pop()!;
  const tgzPath = path.resolve(hasyxRepoRoot, tgzName);

  const result = spawnSync('npx', ['tsx', cliTsPath, 'init', '--reinit'], {
    cwd: targetDir,
    encoding: 'utf-8',
    stdio: 'inherit',
    env: {
      ...process.env,
      HASYX_INSTALL_TGZ: tgzPath,
      HASYX_INSTALL_DIR: '',
    },
  });
  // stdout/stderr are streamed via 'inherit'
  if (result.error) {
    throw result.error;
  }
  if (typeof result.status === 'number' && result.status !== 0) {
    throw new Error(`Init process exited with code ${result.status}`);
  }
  // Remove created tarball after successful init
  try { nodeFs.existsSync(tgzPath) && nodeFs.unlinkSync(tgzPath); } catch {}
}

function runConfigSilentInDirectory(targetDir: string) {
  debug('Running npm run config -- --silent in temp project...');
  const cliTsPath = path.resolve(__dirname, './cli.ts');
  const result = spawnSync('npx', ['tsx', cliTsPath, 'config', '--silent'], {
    cwd: targetDir,
    encoding: 'utf-8',
    stdio: 'inherit',
  });
  // logs streamed
  if (result.error) throw result.error;
  if (typeof result.status === 'number' && result.status !== 0) {
    throw new Error(`Config process exited with code ${result.status}`);
  }
}

function npmCiInDirectory(targetDir: string) {
  debug('Running npm ci in temp project...');
  const result = spawnSync('npm', ['ci'], {
    cwd: targetDir,
    encoding: 'utf-8',
    stdio: 'inherit',
  });
  // logs streamed
  if (result.error) throw result.error;
  if (typeof result.status === 'number' && result.status !== 0) {
    throw new Error(`npm ci exited with code ${result.status}`);
  }
    // After install, ensure temp artifacts are cleaned from repo root (_lib, _components)
    try {
      debug('Running repo-level unbuild (cleanup staged artifacts)...');
      const hasyxRepoRoot = path.resolve(__dirname, '..');
      spawnSync('npm', ['run', 'unbuild'], { cwd: hasyxRepoRoot, encoding: 'utf-8', stdio: 'inherit' });
    } catch {}
}

function buildInDirectory(targetDir: string) {
  debug('Attempting to build temp project...');
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: targetDir,
    encoding: 'utf-8',
    stdio: 'pipe',
  });
  debug(`build stdout (truncated): ${String(result.stdout || '').slice(0, 5000)}`);
  debug(`build stderr (truncated): ${String(result.stderr || '').slice(0, 5000)}`);
  if (result.error) {
    // Print logs to help diagnose
    // eslint-disable-next-line no-console
    console.error('Build error:', result.error);
    // eslint-disable-next-line no-console
    console.error('Build stdout (tail):', String(result.stdout || '').slice(-2000));
    // eslint-disable-next-line no-console
    console.error('Build stderr (tail):', String(result.stderr || '').slice(-2000));
    throw result.error;
  }
  if (typeof result.status === 'number' && result.status !== 0) {
    // eslint-disable-next-line no-console
    console.error('Build failed with non-zero exit code');
    // eslint-disable-next-line no-console
    console.error('Build stdout (tail):', String(result.stdout || '').slice(-2000));
    // eslint-disable-next-line no-console
    console.error('Build stderr (tail):', String(result.stderr || '').slice(-2000));
    throw new Error(`Build process exited with code ${result.status}`);
  }
}

describe('Child project instance initialization (local tsx)', () => {
  it('should create and initialize a temp child project via local CLI and verify artifacts', async () => {
    // 1) Prepare isolated temp directory (unique per test) and ensure cleanup at the end
    const tempProjectDir = generateTempProjectDir();
    try {
      if (await fs.pathExists(tempProjectDir)) {
        await fs.remove(tempProjectDir);
      }
      await fs.ensureDir(tempProjectDir);

      // Ensure its name matches *.temp ignore pattern and repo root .gitignore contains it
      expect(tempProjectDir.endsWith('.temp')).toBe(true);
      const repoGitignore = nodeFs.readFileSync(path.resolve(__dirname, '../.gitignore'), 'utf-8');
      expect(repoGitignore.includes('*.temp')).toBe(true);

      // 2) Seed a minimal package.json so init can tailor config (name must not be "hasyx")
      const pkgJsonPath = path.join(tempProjectDir, 'package.json');
      const tempProjectName = `hasyx-instance-e2e-${Math.random().toString(36).slice(2, 6)}`;
      await fs.writeJson(
        pkgJsonPath,
        { name: tempProjectName, version: '0.0.0', private: true },
        { spaces: 2 }
      );

      // 3) Run local CLI via npx tsx to perform init in the child dir
      runInitInDirectory(tempProjectDir);

      // 4) Verify key artifacts were created by init
      const mustExistRelativePaths: string[] = [
        '.github/workflows/npm-publish.yml',
        'app/api/auth/[...nextauth]/route.ts',
        'app/api/auth/verify/route.ts',
        'app/api/graphql/route.ts',
        'public/logo.svg',
        'jest.config.mjs',
        'next.config.ts',
        'tsconfig.json',
        'tsconfig.lib.json',
        'migrations/1746660891582-hasyx-users/up.ts',
        'events/events.json',
      ];

      for (const rel of mustExistRelativePaths) {
        const abs = path.join(tempProjectDir, rel);
        const exists = await fs.pathExists(abs);
        if (!exists) {
          throw new Error(`Expected file missing after init: ${rel}`);
        }
      }

      // 5) Verify tsconfig alias replacement uses child project name
      const tsconfigPath = path.join(tempProjectDir, 'tsconfig.json');
      const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf-8');
      expect(tsconfigContent.includes(`"${tempProjectName}": ["./lib/index.ts"]`)).toBe(true);
      expect(tsconfigContent.includes(`"${tempProjectName}/*": ["./*"]`)).toBe(true);

      // 6) Generate env and compose, then check .env exists and not empty
      runConfigSilentInDirectory(tempProjectDir);
      const envContent = nodeFs.readFileSync(path.join(tempProjectDir, '.env'), 'utf-8');
      expect(envContent.length).toBeGreaterThan(0);

      // 7) Install dependencies (must succeed)
      npmCiInDirectory(tempProjectDir);
    } finally {
      // Cleanup the temp project directory created by this test
      if (await fs.pathExists(tempProjectDir)) {
        await fs.remove(tempProjectDir);
      }
    }
  }, 1800000); // Allow up to 30 minutes due to real installs/patches
});



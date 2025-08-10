import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs-extra';
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
  const result = spawnSync('npx', ['tsx', cliTsPath, 'init', '--reinit'], {
    cwd: targetDir,
    encoding: 'utf-8',
    stdio: 'pipe',
    env: {
      ...process.env,
      // Ensure non-interactive environment
      CI: '1',
    },
  });
  debug(`stdout (truncated): ${String(result.stdout || '').slice(0, 5000)}`);
  debug(`stderr (truncated): ${String(result.stderr || '').slice(0, 5000)}`);
  if (result.error) {
    throw result.error;
  }
  if (typeof result.status === 'number' && result.status !== 0) {
    throw new Error(`Init process exited with code ${result.status}`);
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
      const repoGitignore = fs.readFileSync(path.resolve(__dirname, '../.gitignore'), 'utf-8');
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
        '.env',
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

      // 6) Sanity check of .env existence and not empty
      const envContent = fs.readFileSync(path.join(tempProjectDir, '.env'), 'utf-8');
      expect(envContent.length).toBeGreaterThan(0);
    } finally {
      // Cleanup the temp project directory created by this test
      if (await fs.pathExists(tempProjectDir)) {
        await fs.remove(tempProjectDir);
      }
    }
  }, 300000); // Allow up to 5 minutes due to real installs/patches
});



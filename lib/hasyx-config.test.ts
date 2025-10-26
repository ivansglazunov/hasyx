/**
 * Unit tests for hasyx-config module
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import {
  getConfigPath,
  configExists,
  readConfig,
  writeConfig,
  getEnvironments,
  getEnvironmentVariables,
  setEnvironmentVariable,
  removeEnvironmentVariable,
  createDefaultConfig,
  applyEnvironmentToEnvFile,
  readEnvFile,
  migrateEnvToConfig,
  HasyxConfig
} from './hasyx-config';

describe('hasyx-config', () => {
  const testDir = path.join(process.cwd(), 'test-hasyx-config');
  const originalCwd = process.cwd();

  beforeEach(() => {
    // Create test directory
    fs.ensureDirSync(testDir);
    process.chdir(testDir);
  });

  afterEach(() => {
    // Clean up
    process.chdir(originalCwd);
    fs.removeSync(testDir);
  });

  describe('configExists', () => {
    it('should return false when config does not exist', () => {
      expect(configExists()).toBe(false);
    });

    it('should return true when config exists', () => {
      const config = createDefaultConfig();
      writeConfig(config);
      expect(configExists()).toBe(true);
    });
  });

  describe('readConfig', () => {
    it('should return empty config when file does not exist', () => {
      const config = readConfig();
      expect(config).toEqual({});
    });

    it('should read config correctly', () => {
      const testConfig: HasyxConfig = {
        global: { TOKEN: 'test-token' },
        local: { PORT: '3000' }
      };
      writeConfig(testConfig);
      const config = readConfig();
      expect(config).toEqual(testConfig);
    });
  });

  describe('writeConfig', () => {
    it('should write config to file', () => {
      const testConfig: HasyxConfig = {
        global: { TOKEN: 'test' },
        local: { PORT: '3000' }
      };
      writeConfig(testConfig);

      const configPath = getConfigPath();
      expect(fs.existsSync(configPath)).toBe(true);

      const written = fs.readJsonSync(configPath);
      expect(written).toEqual(testConfig);
    });
  });

  describe('getEnvironments', () => {
    it('should return empty array for empty config', () => {
      const config: HasyxConfig = {};
      expect(getEnvironments(config)).toEqual([]);
    });

    it('should return environments excluding global', () => {
      const config: HasyxConfig = {
        global: { TOKEN: 'test' },
        local: { PORT: '3000' },
        dev: { PORT: '3001' },
        prod: { PORT: '80' }
      };
      const envs = getEnvironments(config);
      expect(envs).toEqual(['local', 'dev', 'prod']);
      expect(envs).not.toContain('global');
    });
  });

  describe('getEnvironmentVariables', () => {
    it('should merge global and environment-specific variables', () => {
      const config: HasyxConfig = {
        global: { TOKEN: 'global-token', SHARED: 'global' },
        local: { PORT: '3000', SHARED: 'local-override' }
      };

      const vars = getEnvironmentVariables(config, 'local');

      expect(vars).toEqual({
        TOKEN: 'global-token',
        SHARED: 'local-override',
        PORT: '3000'
      });
    });

    it('should return only global vars if environment does not exist', () => {
      const config: HasyxConfig = {
        global: { TOKEN: 'test' }
      };

      const vars = getEnvironmentVariables(config, 'nonexistent');

      expect(vars).toEqual({ TOKEN: 'test' });
    });

    it('should return empty object if no variables exist', () => {
      const config: HasyxConfig = {};
      const vars = getEnvironmentVariables(config, 'local');
      expect(vars).toEqual({});
    });
  });

  describe('setEnvironmentVariable', () => {
    it('should set variable in existing environment', () => {
      const config: HasyxConfig = {
        local: { PORT: '3000' }
      };

      const updated = setEnvironmentVariable(config, 'local', 'HASURA_URL', 'http://localhost:8080');

      expect(updated.local).toEqual({
        PORT: '3000',
        HASURA_URL: 'http://localhost:8080'
      });
    });

    it('should create environment if it does not exist', () => {
      const config: HasyxConfig = {};

      const updated = setEnvironmentVariable(config, 'dev', 'PORT', '3001');

      expect(updated.dev).toEqual({ PORT: '3001' });
    });

    it('should override existing variable', () => {
      const config: HasyxConfig = {
        local: { PORT: '3000' }
      };

      const updated = setEnvironmentVariable(config, 'local', 'PORT', '8080');

      expect(updated.local?.PORT).toBe('8080');
    });
  });

  describe('removeEnvironmentVariable', () => {
    it('should remove variable from environment', () => {
      const config: HasyxConfig = {
        local: { PORT: '3000', HASURA_URL: 'http://localhost:8080' }
      };

      const updated = removeEnvironmentVariable(config, 'local', 'PORT');

      expect(updated.local).toEqual({ HASURA_URL: 'http://localhost:8080' });
    });

    it('should do nothing if environment does not exist', () => {
      const config: HasyxConfig = {};

      const updated = removeEnvironmentVariable(config, 'nonexistent', 'PORT');

      expect(updated).toEqual(config);
    });

    it('should do nothing if variable does not exist', () => {
      const config: HasyxConfig = {
        local: { PORT: '3000' }
      };

      const updated = removeEnvironmentVariable(config, 'local', 'NONEXISTENT');

      expect(updated.local).toEqual({ PORT: '3000' });
    });
  });

  describe('createDefaultConfig', () => {
    it('should create config with standard environments', () => {
      const config = createDefaultConfig();

      expect(config).toHaveProperty('global');
      expect(config).toHaveProperty('local');
      expect(config).toHaveProperty('dev');
      expect(config).toHaveProperty('prod');

      expect(config.local?.PORT).toBe('3000');
      expect(config.dev?.PORT).toBe('3001');
      expect(config.prod?.PORT).toBe('80');
    });
  });

  describe('applyEnvironmentToEnvFile', () => {
    it('should write environment variables to .env file', () => {
      const config: HasyxConfig = {
        global: { TOKEN: 'test-token' },
        local: { PORT: '3000', HASURA_URL: 'http://localhost:8080' }
      };

      applyEnvironmentToEnvFile(config, 'local');

      const envPath = path.join(testDir, '.env');
      expect(fs.existsSync(envPath)).toBe(true);

      const content = fs.readFileSync(envPath, 'utf-8');
      expect(content).toContain('TOKEN=test-token');
      expect(content).toContain('PORT=3000');
      expect(content).toContain('HASURA_URL=http://localhost:8080');
      expect(content).toContain('# Environment: local');
    });

    it('should handle values with spaces by adding quotes', () => {
      const config: HasyxConfig = {
        local: { MESSAGE: 'hello world' }
      };

      applyEnvironmentToEnvFile(config, 'local');

      const content = fs.readFileSync(path.join(testDir, '.env'), 'utf-8');
      expect(content).toContain('MESSAGE="hello world"');
    });
  });

  describe('readEnvFile', () => {
    it('should return empty object if .env does not exist', () => {
      const vars = readEnvFile();
      expect(vars).toEqual({});
    });

    it('should parse .env file correctly', () => {
      const envContent = `
# Comment
PORT=3000
HASURA_URL=http://localhost:8080
MESSAGE="hello world"
      `.trim();

      fs.writeFileSync(path.join(testDir, '.env'), envContent);

      const vars = readEnvFile();
      expect(vars).toEqual({
        PORT: '3000',
        HASURA_URL: 'http://localhost:8080',
        MESSAGE: 'hello world'
      });
    });

    it('should handle quoted values', () => {
      const envContent = `
VALUE1="quoted value"
VALUE2='single quoted'
VALUE3=unquoted
      `.trim();

      fs.writeFileSync(path.join(testDir, '.env'), envContent);

      const vars = readEnvFile();
      expect(vars.VALUE1).toBe('quoted value');
      expect(vars.VALUE2).toBe('single quoted');
      expect(vars.VALUE3).toBe('unquoted');
    });

    it('should ignore comments and empty lines', () => {
      const envContent = `
# This is a comment
PORT=3000

# Another comment
HASURA_URL=http://localhost:8080
      `.trim();

      fs.writeFileSync(path.join(testDir, '.env'), envContent);

      const vars = readEnvFile();
      expect(vars).toEqual({
        PORT: '3000',
        HASURA_URL: 'http://localhost:8080'
      });
    });
  });

  describe('migrateEnvToConfig', () => {
    it('should migrate .env variables to config', () => {
      const envContent = `
PORT=3000
HASURA_URL=http://localhost:8080
TOKEN=test-token
      `.trim();

      fs.writeFileSync(path.join(testDir, '.env'), envContent);

      const config = migrateEnvToConfig('local');

      expect(config.local).toEqual({
        PORT: '3000',
        HASURA_URL: 'http://localhost:8080',
        TOKEN: 'test-token'
      });
    });

    it('should merge with existing config', () => {
      const existingConfig: HasyxConfig = {
        global: { GLOBAL_VAR: 'test' },
        local: { EXISTING: 'value' }
      };
      writeConfig(existingConfig);

      const envContent = `
PORT=3000
NEW_VAR=new-value
      `.trim();

      fs.writeFileSync(path.join(testDir, '.env'), envContent);

      const config = migrateEnvToConfig('local');

      expect(config.local).toEqual({
        EXISTING: 'value',
        PORT: '3000',
        NEW_VAR: 'new-value'
      });
    });

    it('should return default config if no .env exists', () => {
      const config = migrateEnvToConfig('local');

      // Should create default config structure
      expect(config).toHaveProperty('local');
      expect(config).toHaveProperty('dev');
      expect(config).toHaveProperty('prod');
    });
  });
});

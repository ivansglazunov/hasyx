import fs from 'fs';
import path from 'path';
import { stringify } from 'yaml';
import { resolveVariant, loadHasyxConfig, generateEnvFile } from './env';
import { hasyxConfig } from '../config';

type Dictionary<T> = Record<string, T>;

type ComposeService = Dictionary<any>;
type ComposeVolume = any;

interface ComposeSpec {
  version: string;
  services: Dictionary<ComposeService>;
  volumes?: Dictionary<ComposeVolume>;
}

type ComposeFragment = Partial<ComposeSpec>;

function deepMergeCompose(base: ComposeFragment, fragment: ComposeFragment): ComposeFragment {
  const merged: ComposeFragment = {
    version: fragment.version || base.version,
    services: { ...(base.services || {}), ...(fragment.services || {}) },
    volumes: { ...(base.volumes || {}), ...(fragment.volumes || {}) },
  };
  return merged;
}

// === Generic meta-driven composer ===
function runComposeMeta(resolved: any): ComposeFragment {
  let out: ComposeFragment = { version: '3.8', services: {}, volumes: {} };

  // Helper to merge
  const append = (fragment: ComposeFragment) => {
    out = deepMergeCompose(out, fragment || {});
  };

  // Iterate over primary entity types we know about from file schema
  const metaAwareSchemas: Array<{ listKey: string; itemSchema: any; selectedKey?: string }> = [
    { listKey: 'hosts', itemSchema: hasyxConfig.host, selectedKey: resolved?.host ? 'host' : undefined },
    { listKey: 'pg', itemSchema: hasyxConfig.pg, selectedKey: resolved?.pg ? 'pg' : undefined },
    { listKey: 'hasura', itemSchema: hasyxConfig.hasura, selectedKey: resolved?.hasura ? 'hasura' : undefined },
    { listKey: 'storage', itemSchema: hasyxConfig.storage, selectedKey: resolved?.storage ? 'storage' : undefined },
    { listKey: 'docker', itemSchema: hasyxConfig.docker, selectedKey: resolved?.docker ? 'docker' : undefined },
    // Add more schemas here when they gain compose meta
  ];

  for (const entry of metaAwareSchemas) {
    const schema: any = entry.itemSchema;
    const composeFn = schema?.meta && typeof schema.meta === 'function' ? (schema as any).meta().compose : undefined;
    if (!composeFn) continue;
    if (!entry.selectedKey) continue; // skip when this section is not selected in the variant
    const value = resolved[entry.selectedKey];
    if (value === undefined) continue;
    const fragment = composeFn(value, resolved);
    if (fragment && typeof fragment === 'object') append(fragment);
  }

  return out;
}

function getProjectName(): string {
  try {
    const pkgPath = path.join(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { name?: string };
    return pkg.name || 'app';
  } catch {
    return 'app';
  }
}

export function generateDockerCompose(variant?: string): void {
  const config = loadHasyxConfig();
  const selectedVariant = variant || config.variant;
  if (!selectedVariant) {
    // No variant: write minimal compose or empty file
    const filePath = path.join(process.cwd(), 'docker-compose.yml');
    const emptySpec: ComposeSpec = { version: '3.8', services: {} };
    fs.writeFileSync(filePath, stringify(emptySpec, { indent: 2 }));
    console.log(`⚠️  No variant specified, generated empty docker-compose.yml at ${filePath}`);
    return;
  }

  let resolved: any = {};
  try {
    resolved = resolveVariant(selectedVariant, config);
  } catch {
    // Incomplete variant: produce empty spec
    const filePath = path.join(process.cwd(), 'docker-compose.yml');
    const emptySpec: ComposeSpec = { version: '3.8', services: {} };
    fs.writeFileSync(filePath, stringify(emptySpec, { indent: 2 }));
    console.log(`⚠️  Incomplete variant, generated empty docker-compose.yml at ${filePath}`);
    return;
  }

  // Build compose strictly from meta compose() functions in schemas
  const aggregate: ComposeFragment = runComposeMeta(resolved);

  // Finalize spec
  const spec: ComposeSpec = {
    version: aggregate.version || '3.8',
    services: aggregate.services || {},
    ...(aggregate.volumes && Object.keys(aggregate.volumes).length ? { volumes: aggregate.volumes } : {}),
  };

  // Inject application service with public feature flags only
  const projectName = getProjectName();
  if (!spec.services[projectName]) {
    spec.services[projectName] = {
      restart: 'unless-stopped',
      env_file: ['.env'],
    };
  }

  // Parse generated env to extract only NEXT_PUBLIC_*_ENABLED flags
  try {
    const envContent = generateEnvFile(config, selectedVariant);
    const envLines = envContent.split('\n');
    const enabledFlags: Record<string, string> = {};
    const appEnv: Record<string, string> = {};
    for (const line of envLines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq);
      const val = trimmed.slice(eq + 1);
      if (/^NEXT_PUBLIC_.*_ENABLED$/.test(key)) {
        enabledFlags[key] = val;
        continue;
      }
      // Pass storage settings to storage service via compose meta; for app we only inject flags.
      // However, some runtime envs may be needed by the app (e.g., GOOGLE_APPLICATION_CREDENTIALS for admin code if used in app container)
      if (key === 'GOOGLE_APPLICATION_CREDENTIALS') {
        appEnv[key] = val;
      }
    }
    if (Object.keys(enabledFlags).length) {
      const appSvc = spec.services[projectName] as any;
      appSvc.environment = { ...(appSvc.environment || {}), ...enabledFlags, ...appEnv };
      // ensure env_file is present (already set), keep others untouched
    }
  } catch (e) {
    // If env generation fails, skip flags injection silently
  }

  const filePath = path.join(process.cwd(), 'docker-compose.yml');
  const yaml = stringify(spec, { indent: 2, lineWidth: 120, minContentWidth: 20 });
  fs.writeFileSync(filePath, yaml);
  console.log(`✅ docker-compose.yml generated at ${filePath}`);
}

export function testDockerComposeGeneration(): void {
  console.log('🧪 Testing docker-compose.yml generation...');
  generateDockerCompose();
}

// Allow running this file directly for testing
if (require.main === module) {
  testDockerComposeGeneration();
}


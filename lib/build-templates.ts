import path from 'path';
import fs from 'fs-extra';
import { LIB_SCAFFOLD_FILES, COMPONENTS_SCAFFOLD_FILES } from './cli-hasyx';

async function stageFiles(files: string[], srcRoot: string, dstRoot: string) {
  for (const rel of files) {
    const src = path.join(srcRoot, rel);
    const dst = path.join(dstRoot, rel.replace(/^lib\//, '').replace(/^components\//, ''));
    const dstDir = path.dirname(dst);
    if (!fs.existsSync(src)) {
      console.warn(`⚠️ Missing source for staging: ${src}`);
      continue;
    }
    await fs.ensureDir(dstDir);
    await fs.copy(src, dst, { overwrite: true });
    console.log(`📦 staged: ${rel} -> ${dst}`);
  }
}

async function stageDotfiles(srcRoot: string, dstRoot: string) {
  const dotfiles = ['.gitignore', '.npmignore', '.npmrc'];
  for (const name of dotfiles) {
    const src = path.join(srcRoot, name);
    const dst = path.join(dstRoot, name);
    if (!fs.existsSync(src)) continue;
    await fs.copy(src, dst, { overwrite: true });
    console.log(`📦 staged dotfile: ${name}`);
  }
}

async function main() {
  const repoRoot = path.resolve(__dirname, '../');
  const outLib = path.join(repoRoot, '_lib');
  const outComponents = path.join(repoRoot, '_components');
  await fs.remove(outLib).catch(() => {});
  await fs.remove(outComponents).catch(() => {});
  await fs.ensureDir(outLib);
  await fs.ensureDir(outComponents);

  await stageFiles(LIB_SCAFFOLD_FILES, repoRoot, outLib);
  // Filter components to avoid heavy UI set
  const filteredComponents = COMPONENTS_SCAFFOLD_FILES.filter((rel) => {
    return !/\/ui(\/|$)/.test(rel);
  });
  await stageFiles(filteredComponents, repoRoot, outComponents);
  await stageDotfiles(repoRoot, outLib);

  console.log('✅ build-templates: staged _lib and _components');
}

main().catch((e) => { console.error(e); process.exit(1); });



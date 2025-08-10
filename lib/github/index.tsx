import spawn from 'cross-spawn';
import path from 'path';
import fs from 'fs-extra';

export function isGitRepo(cwd: string = process.cwd()): boolean {
  return fs.existsSync(path.join(cwd, '.git'));
}

export function getRemoteUrl(cwd: string = process.cwd()): string | undefined {
  const res = spawn.sync('git', ['remote', 'get-url', 'origin'], { cwd, encoding: 'utf-8' });
  if (res.status !== 0) return undefined;
  return res.stdout?.trim();
}

export function ensureGhCli(): void {
  const res = spawn.sync('gh', ['--version'], { encoding: 'utf-8' });
  if (res.status !== 0) throw new Error('GitHub CLI (gh) is not installed');
}

export function checkAuth(): void {
  ensureGhCli();
  const res = spawn.sync('gh', ['auth', 'status'], { encoding: 'utf-8' });
  if (res.status !== 0) throw new Error('Not authenticated in GitHub CLI');
}

export function createRepo(name: string, isPublic: boolean = false, cwd: string = process.cwd()): void {
  ensureGhCli();
  const args = ['repo', 'create', name, '--source=.', isPublic ? '--public' : '--private', '--push'];
  const res = spawn.sync('gh', args, { cwd, stdio: 'inherit' });
  if (res.status !== 0) throw new Error('Failed to create GitHub repository');
}

export function cloneRepo(url: string, cwd: string = process.cwd()): void {
  const res = spawn.sync('git', ['clone', url, '.'], { cwd, stdio: 'inherit' });
  if (res.status !== 0) throw new Error('Failed to clone repository');
}

export function setRemote(url: string, cwd: string = process.cwd()): void {
  const res = spawn.sync('git', ['remote', 'add', 'origin', url], { cwd, stdio: 'inherit' });
  if (res.status !== 0) throw new Error('Failed to set git remote');
}

export function setSecret(repoUrl: string, key: string, value: string): void {
  ensureGhCli();
  const res = spawn.sync('gh', ['secret', 'set', key, '--body', value, '-R', repoUrl], { encoding: 'utf-8' });
  if (res.status !== 0) throw new Error(`Failed to set GitHub secret: ${key}`);
}


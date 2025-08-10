import spawn from 'cross-spawn';

export function link(projectName: string, token: string, teamId?: string): boolean {
  const args = ['vercel', 'link', '--yes', `--token=${token}`];
  if (teamId) args.push(`--scope=${teamId}`);
  const res = spawn.sync('npx', args, { stdio: 'inherit', env: { ...process.env, VERCEL_PROJECT_ID: projectName } });
  return res.status === 0;
}

export function envPull(token: string, outputFile = '.env.vercel'): boolean {
  const args = ['vercel', 'env', 'pull', outputFile, '--yes', `--token=${token}`];
  const res = spawn.sync('npx', args, { stdio: 'inherit' });
  return res.status === 0;
}

export function envRemove(key: string, envType: 'production' | 'preview' | 'development', token: string): void {
  const args = ['vercel', 'env', 'rm', key, envType, '--yes', `--token=${token}`];
  spawn.sync('npx', args, { stdio: 'pipe', encoding: 'utf-8' });
}

export function envAdd(key: string, envType: 'production' | 'preview' | 'development', value: string, token: string): void {
  const args = ['vercel', 'env', 'add', key, envType, `--token=${token}`];
  spawn.sync('npx', args, { stdio: ['pipe', 'pipe', 'pipe'], input: value, encoding: 'utf-8' });
}


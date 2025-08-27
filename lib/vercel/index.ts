import spawn from 'cross-spawn';

export function link(projectName: string, token: string, teamId?: string, userId?: string): boolean {
  // Prefer explicit --project to avoid triggering ORG_ID requirement via VERCEL_PROJECT_ID
  const baseArgs = ['vercel', 'link', '--yes', '--project', projectName, `--token=${token}`];

  // Decide scope based on provided ids: teamId has priority over userId. Personal mode if neither.
  let args = [...baseArgs];
  if (teamId) args = [...baseArgs, `--scope=${teamId}`];
  else if (userId) args = [...baseArgs, `--scope=${userId}`];

  let res = spawn.sync('npx', args, { stdio: 'pipe', encoding: 'utf-8' });

  // If scope is invalid for personal account, retry without --scope
  const stderr = (res.stderr || '').toString();
  if (res.status !== 0 && teamId && /Personal Account as the scope|cannot set your Personal Account as the scope/i.test(stderr)) {
    const retry = spawn.sync('npx', baseArgs, { stdio: 'pipe', encoding: 'utf-8' });
    res = retry;
  }

  // Also retry without scope for generic scope errors when userId was used
  if (res.status !== 0 && userId && /Personal Account as the scope|cannot set your Personal Account as the scope|Invalid team/i.test(stderr)) {
    const retry2 = spawn.sync('npx', baseArgs, { stdio: 'pipe', encoding: 'utf-8' });
    res = retry2;
  }

  // Output captured logs to console for transparency
  if (res.stdout) process.stdout.write(res.stdout);
  if (res.stderr) process.stderr.write(res.stderr);

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


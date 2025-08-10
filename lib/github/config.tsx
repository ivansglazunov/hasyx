import { z } from 'zod';

// Public flag name that indicates GitHub OAuth availability on the client
export const ENV_ENABLED_NAME = 'NEXT_PUBLIC_GITHUB_AUTH_ENABLED';

export const githubOAuthSchema = z.object({
  clientId: z
    .string()
    .describe('GitHub Client ID (GITHUB_ID). Create an OAuth App at github.com/settings/developers.'),
  clientSecret: z
    .string()
    .describe('GitHub Client Secret (GITHUB_SECRET). From your GitHub OAuth App.'),
}).meta({
  type: 'github-oauth-config',
  title: 'GitHub OAuth Configuration',
  description: 'Configure GitHub OAuth provider',
  envMapping: {
    clientId: 'GITHUB_ID',
    clientSecret: 'GITHUB_SECRET'
  },
  envEnabledName: ENV_ENABLED_NAME,
});

// Returns true when GitHub OAuth provider is fully configured for the selected variant
export function isEnabled(resolvedVariantConfig: any): boolean {
  const cfg = resolvedVariantConfig?.githubOAuth;
  if (!cfg) return false;
  return Boolean(cfg.clientId && cfg.clientSecret);
}

export const githubOAuths = z.record(
  z.string(),
  githubOAuthSchema,
).meta({
  data: 'githubOAuth',
  type: 'keys',
  default: ['local', 'dev', 'prod'],
  add: githubOAuthSchema,
  descriptionTemplate: (data: any) => data?.clientId || 'no client id'
});


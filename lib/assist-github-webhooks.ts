import { createRlInterface } from './assist-common';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import Debug from './debug';

const debug = Debug('assist:github-webhooks');

export interface GitHubWebhookConfig {
  enabled: boolean;
  repository: string;
  webhookUrl: string;
  webhookSecret: string;
  events: string[];
  baseUrl: string;
}

export interface GitHubWebhookSetupOptions {
  skipWebhooks?: boolean;
  skipRepository?: boolean;
  skipSecret?: boolean;
  skipEvents?: boolean;
}

/**
 * Configure GitHub webhooks for issues synchronization
 */
export async function configureGitHubWebhooks(
  rl: any,
  envPath: string,
  options: GitHubWebhookSetupOptions = {}
): Promise<boolean> {
  debug('Starting GitHub webhooks configuration...');
  
  console.log('\n🔗 GitHub Webhooks Configuration');
  console.log('='.repeat(50));
  
  if (options.skipWebhooks) {
    console.log('⏩ Skipping GitHub webhooks configuration as requested');
    return true;
  }

  try {
    // Check if .env file exists
    const envExists = await fs.pathExists(envPath);
    if (!envExists) {
      console.error('❌ .env file not found. Please run environment setup first.');
      return false;
    }

    // Load current environment
    const envResult = dotenv.config({ path: envPath });
    if (envResult.error) {
      console.error('❌ Failed to load .env file:', envResult.error);
      return false;
    }

    // Ask about webhook setup
    const setupWebhooks = await askYesNo(
      rl,
      'Would you like to configure GitHub webhooks for issues synchronization?',
      true
    );

    if (!setupWebhooks) {
      console.log('⏩ Skipping GitHub webhooks configuration');
      return true;
    }

    const config = await configureWebhookSettings(rl, options);

    // Update environment variables
    await updateEnvironmentVariables(envPath, config);

    // Create webhook documentation
    await createWebhookDocumentation(config);

    console.log('\n✅ GitHub webhooks configuration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Go to your GitHub repository settings');
    console.log('   2. Navigate to Webhooks section');
    console.log('   3. Add the webhook URL and secret');
    console.log('   4. Select "Issues" events only');
    console.log('   5. Test the webhook delivery');
    console.log('\n📖 See GITHUB-WEBHOOKS.md for detailed instructions');

    return true;
  } catch (error) {
    console.error('❌ GitHub webhooks configuration failed:', error);
    debug('GitHub webhooks configuration error:', error);
    return false;
  }
}

/**
 * Configure webhook settings
 */
async function configureWebhookSettings(rl: any, options: GitHubWebhookSetupOptions): Promise<GitHubWebhookConfig> {
  console.log('\n🔧 Webhook Configuration');
  console.log('-'.repeat(30));

  // Determine base URL
  const baseUrl = await determineBaseUrl(rl);

  // Repository configuration
  const repository = !options.skipRepository ? await configureRepository(rl) : '';

  // Webhook URL
  const webhookUrl = `${baseUrl}/api/github/issues`;

  // Generate webhook secret
  const webhookSecret = !options.skipSecret ? await generateWebhookSecret(rl) : generateRandomSecret();

  // Configure events
  const events = !options.skipEvents ? await configureEvents(rl) : ['issues'];

  return {
    enabled: true,
    repository,
    webhookUrl,
    webhookSecret,
    events,
    baseUrl
  };
}

/**
 * Determine base URL for webhooks
 */
async function determineBaseUrl(rl: any): Promise<string> {
  console.log('\n🌐 Base URL Configuration');
  console.log('-'.repeat(30));

  const options = [
    'Use Vercel URL (production)',
    'Use custom domain URL',
    'Use local development URL (http://localhost:3000)',
    'Enter custom URL manually'
  ];

  console.log('Available base URL options:');
  options.forEach((option, index) => {
    console.log(`  ${index + 1}. ${option}`);
  });

  const choice = await askQuestion(
    rl,
    'Select base URL option (1-4):',
    '3'
  );

  let baseUrl = '';
  switch (choice) {
    case '1':
      baseUrl = await askQuestion(
        rl,
        'Enter your Vercel URL (e.g., https://your-app.vercel.app):',
        ''
      );
      break;
    case '2':
      baseUrl = await askQuestion(
        rl,
        'Enter your custom domain URL (e.g., https://yourdomain.com):',
        ''
      );
      break;
    case '3':
      baseUrl = 'http://localhost:3000';
      break;
    case '4':
      baseUrl = await askQuestion(
        rl,
        'Enter custom base URL:',
        ''
      );
      break;
    default:
      baseUrl = 'http://localhost:3000';
  }

  if (!baseUrl) {
    console.log('⚠️ No URL provided, using localhost:3000');
    baseUrl = 'http://localhost:3000';
  }

  console.log(`✅ Using base URL: ${baseUrl}`);
  return baseUrl;
}

/**
 * Configure repository settings
 */
async function configureRepository(rl: any): Promise<string> {
  console.log('\n📁 Repository Configuration');
  console.log('-'.repeat(30));

  const repository = await askQuestion(
    rl,
    'Enter GitHub repository (format: owner/repo-name):',
    ''
  );

  if (!repository || !repository.includes('/')) {
    console.log('⚠️ Invalid repository format. Please use format: owner/repo-name');
    return await configureRepository(rl);
  }

  console.log(`✅ Repository: ${repository}`);
  return repository;
}

/**
 * Generate webhook secret
 */
async function generateWebhookSecret(rl: any): Promise<string> {
  console.log('\n🔐 Webhook Secret Configuration');
  console.log('-'.repeat(30));

  const generateNew = await askYesNo(
    rl,
    'Would you like to generate a new webhook secret?',
    true
  );

  if (generateNew) {
    const secret = generateRandomSecret();
    console.log(`✅ Generated webhook secret: ${secret}`);
    return secret;
  } else {
    const secret = await askQuestion(
      rl,
      'Enter your existing webhook secret:',
      ''
    );
    
    if (!secret) {
      console.log('⚠️ No secret provided, generating new one');
      return generateRandomSecret();
    }
    
    return secret;
  }
}

/**
 * Configure webhook events
 */
async function configureEvents(rl: any): Promise<string[]> {
  console.log('\n📋 Webhook Events Configuration');
  console.log('-'.repeat(30));

  const availableEvents = [
    { name: 'Issues', value: 'issues', description: 'Issue creation, updates, and deletion' },
    { name: 'Pull Requests', value: 'pull_request', description: 'PR creation, updates, and merging' },
    { name: 'Commits', value: 'push', description: 'Code pushes and commits' },
    { name: 'Releases', value: 'release', description: 'Release creation and updates' }
  ];

  console.log('Available webhook events:');
  availableEvents.forEach((event, index) => {
    console.log(`  ${index + 1}. ${event.name} - ${event.description}`);
  });

  const events = await askQuestion(
    rl,
    'Select events to enable (comma-separated, e.g., 1,2):',
    '1'
  );

  const selectedIndices = events.split(',').map(s => parseInt(s.trim()) - 1);
  const selectedEvents = selectedIndices
    .filter(i => i >= 0 && i < availableEvents.length)
    .map(i => availableEvents[i].value);

  if (selectedEvents.length === 0) {
    console.log('⚠️ No events selected, using issues only');
    return ['issues'];
  }

  console.log(`✅ Selected events: ${selectedEvents.join(', ')}`);
  return selectedEvents;
}

/**
 * Generate random webhook secret
 */
function generateRandomSecret(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Update environment variables
 */
async function updateEnvironmentVariables(envPath: string, config: GitHubWebhookConfig): Promise<void> {
  debug('Updating environment variables for GitHub webhooks');

  const envContent = await fs.readFile(envPath, 'utf-8');
  const envLines = envContent.split('\n');

  const webhookVars = {
    // GitHub repository
    'NEXT_PUBLIC_GITHUB_OWNER': config.repository.split('/')[0] || '',
    'NEXT_PUBLIC_GITHUB_REPO': config.repository.split('/')[1] || '',
    
    // Webhook configuration
    'GITHUB_WEBHOOK_SECRET': config.webhookSecret,
    'GITHUB_WEBHOOK_URL': config.webhookUrl,
    'GITHUB_WEBHOOK_EVENTS': config.events.join(','),
    
    // Base URL for webhooks
    'NEXT_PUBLIC_API_URL': config.baseUrl,
    'NEXT_PUBLIC_MAIN_URL': config.baseUrl,
    
    // GitHub API configuration
    'GITHUB_TOKEN': process.env.GITHUB_TOKEN || '',
    'GITHUB_ID': process.env.GITHUB_ID || '',
    'GITHUB_SECRET': process.env.GITHUB_SECRET || ''
  };

  // Add or update environment variables
  for (const [key, value] of Object.entries(webhookVars)) {
    const existingIndex = envLines.findIndex(line => line.startsWith(`${key}=`));
    if (existingIndex >= 0) {
      envLines[existingIndex] = `${key}=${value}`;
    } else {
      envLines.push(`${key}=${value}`);
    }
  }

  await fs.writeFile(envPath, envLines.join('\n'));
  console.log('✅ Environment variables updated');
}

/**
 * Create webhook documentation
 */
async function createWebhookDocumentation(config: GitHubWebhookConfig): Promise<void> {
  debug('Creating webhook documentation');

  const docsPath = path.join(process.cwd(), 'GITHUB-WEBHOOKS.md');
  
  const documentation = `# GitHub Webhooks Setup

## Overview

This document explains how to set up GitHub webhooks to automatically sync issues between GitHub and your local database.

## Current Configuration

- **Repository**: ${config.repository}
- **Webhook URL**: ${config.webhookUrl}
- **Events**: ${config.events.join(', ')}
- **Base URL**: ${config.baseUrl}

## Prerequisites

1. **GitHub Repository**: You need access to the repository where you want to track issues
2. **Public URL**: Your API must be accessible from the internet (for GitHub to send webhooks)
3. **Environment Variables**: Ensure the following are set:
   - \`GITHUB_WEBHOOK_SECRET\`: A secret key for webhook verification
   - \`NEXT_PUBLIC_GITHUB_OWNER\`: Repository owner
   - \`NEXT_PUBLIC_GITHUB_REPO\`: Repository name

## Setup Steps

### 1. Verify Webhook Secret

Your webhook secret is: \`${config.webhookSecret}\`

This secret is used to verify that webhook requests come from GitHub.

### 2. Configure GitHub Webhook

1. Go to your GitHub repository: https://github.com/${config.repository}
2. Navigate to **Settings** → **Webhooks**
3. Click **Add webhook**
4. Configure the webhook:

   **Payload URL:**
   \`\`\`
   ${config.webhookUrl}
   \`\`\`

   **Content type:**
   \`\`\`
   application/json
   \`\`\`

   **Secret:**
   \`\`\`
   ${config.webhookSecret}
   \`\`\`

   **Events:**
   - Select **Let me select individual events**
   - Check **Issues** (this will capture all issue-related events)
   - Uncheck all other events

5. Click **Add webhook**

### 3. Webhook Events Handled

The webhook handler processes the following GitHub issue events:

- **\`opened\`**: New issue created
- **\`created\`**: Issue created (alternative event)
- **\`edited\`**: Issue title or body edited
- **\`reopened\`**: Issue reopened
- **\`closed\`**: Issue closed
- **\`deleted\`**: Issue deleted

### 4. Testing Webhooks

#### Using GitHub's Webhook Testing

1. Go to your webhook settings in GitHub
2. Click **Recent Deliveries**
3. Click on any delivery to see the request/response
4. Click **Redeliver** to test again

#### Using ngrok for Local Development

For local development, use ngrok to expose your local server:

\`\`\`bash
# Install ngrok
npm install -g ngrok

# Start your development server
npm run dev

# In another terminal, expose your local server
ngrok http 3000
\`\`\`

Use the ngrok URL as your webhook payload URL:
\`\`\`
https://abc123.ngrok.io/api/github/issues
\`\`\`

### 5. Security Considerations

#### Webhook Signature Verification

The webhook handler verifies the signature to ensure requests come from GitHub:

\`\`\`typescript
const isValid = verifyGitHubWebhook(body, signature, process.env.GITHUB_WEBHOOK_SECRET);
if (!isValid) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}
\`\`\`

#### Rate Limiting

GitHub webhooks have rate limits:
- **Authenticated requests**: 5,000 requests per hour
- **Unauthenticated requests**: 60 requests per hour

### 6. Troubleshooting

#### Common Issues

1. **Webhook not receiving events**:
   - Check that the webhook URL is accessible
   - Verify the secret is correct
   - Ensure the repository has issues enabled

2. **Database sync issues**:
   - Check database connection
   - Verify table schema matches expected format
   - Review server logs for errors

3. **Authentication errors**:
   - Verify GitHub access tokens are valid
   - Check user permissions on the repository

#### Debugging

Enable debug logging by setting the debug environment variable:

\`\`\`bash
DEBUG=api:github:issues
\`\`\`

### 7. Monitoring

Monitor webhook delivery in GitHub:
- **Settings** → **Webhooks** → **Recent Deliveries**
- Check response codes and payloads
- Review failed deliveries for errors

### 8. Environment Variables

Required environment variables:

\`\`\`bash
# GitHub Repository Configuration
NEXT_PUBLIC_GITHUB_OWNER=${config.repository.split('/')[0]}
NEXT_PUBLIC_GITHUB_REPO=${config.repository.split('/')[1]}

# Webhook Security
GITHUB_WEBHOOK_SECRET=${config.webhookSecret}

# GitHub API Access (for user operations)
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret
GITHUB_TOKEN=your-github-personal-access-token
\`\`\`

### 9. API Endpoints

The webhook handler is available at:
- **URL**: \`/api/github/issues\`
- **Method**: \`PATCH\`
- **Content-Type**: \`application/json\`
- **Headers**: 
  - \`x-hub-signature-256\`: GitHub webhook signature
  - \`x-github-event\`: Event type (e.g., "issues")

## Integration with Events System

The webhook handler integrates with the existing events system:

1. **Database Updates**: Webhook events update the \`github_issues\` table
2. **Event Triggers**: Changes to the table trigger events that sync back to GitHub
3. **Bidirectional Sync**: Changes flow both ways between GitHub and your database

This creates a complete bidirectional synchronization system for GitHub issues.
`;

  await fs.writeFile(docsPath, documentation);
  console.log('✅ Webhook documentation created (GITHUB-WEBHOOKS.md)');
}

/**
 * Helper function to ask yes/no questions
 */
async function askYesNo(rl: any, question: string, defaultValue: boolean): Promise<boolean> {
  const defaultText = defaultValue ? 'Y/n' : 'y/N';
  const answer = await new Promise<string>((resolve) => {
    rl.question(`${question} (${defaultText}): `, resolve);
  });
  
  if (answer.trim() === '') {
    return defaultValue;
  }
  
  return answer.toLowerCase().startsWith('y');
}

/**
 * Helper function to ask questions
 */
async function askQuestion(rl: any, question: string, defaultValue: string = ''): Promise<string> {
  const answer = await new Promise<string>((resolve) => {
    rl.question(`${question}${defaultValue ? ` (${defaultValue})` : ''}: `, resolve);
  });
  
  return answer.trim() || defaultValue;
} 
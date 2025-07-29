# GitHub Webhooks Setup

## Overview

This document explains how to set up GitHub webhooks to automatically sync issues between GitHub and your local database.

## Quick Setup with Hasyx Assistant

The easiest way to configure GitHub webhooks is using the Hasyx assistant:

```bash
# Run the assistant and follow the prompts
npx hasyx-assist

# Or skip other steps and only configure webhooks
npx hasyx-assist --skip-auth --skip-repo --skip-env --skip-package --skip-init --skip-hasura --skip-secrets --skip-oauth --skip-resend --skip-vercel --skip-sync --skip-commit --skip-migrations --skip-firebase --skip-telegram --skip-project-user --skip-openrouter --skip-pg --skip-dns --skip-docker --skip-github --skip-storage
```

The assistant will:
1. Ask for your GitHub repository details
2. Generate a secure webhook secret
3. Configure environment variables
4. Create detailed documentation
5. Provide step-by-step instructions

## Manual Setup

If you prefer to configure webhooks manually, follow these steps:

### Prerequisites

1. **GitHub Repository**: You need access to the repository where you want to track issues
2. **Public URL**: Your API must be accessible from the internet (for GitHub to send webhooks)
3. **Environment Variables**: Ensure the following are set:
   - `GITHUB_WEBHOOK_SECRET`: A secret key for webhook verification
   - `NEXT_PUBLIC_GITHUB_OWNER`: Repository owner
   - `NEXT_PUBLIC_GITHUB_REPO`: Repository name

### Setup Steps

#### 1. Generate Webhook Secret

Create a secure webhook secret:

```bash
# Generate a random 32-byte hex string
openssl rand -hex 32
```

Or use the assistant which will generate this automatically.

#### 2. Configure GitHub Webhook

1. Go to your GitHub repository: `https://github.com/OWNER/REPO-NAME`
2. Navigate to **Settings** → **Webhooks**
3. Click **Add webhook**
4. Configure the webhook:

   **Payload URL:**
   ```
   https://your-domain.com/api/github/issues
   ```

   **Content type:**
   ```
   application/json
   ```

   **Secret:**
   ```
   your-generated-webhook-secret
   ```

   **Events:**
   - Select **Let me select individual events**
   - Check **Issues** (this will capture all issue-related events)
   - Uncheck all other events

5. Click **Add webhook**

#### 3. Environment Variables

Add these to your `.env` file:

```bash
# GitHub Repository Configuration
NEXT_PUBLIC_GITHUB_OWNER=your-github-username
NEXT_PUBLIC_GITHUB_REPO=your-repo-name

# Webhook Security
GITHUB_WEBHOOK_SECRET=your-generated-webhook-secret

# GitHub API Access (for user operations)
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret
GITHUB_TOKEN=your-github-personal-access-token
```

### Webhook Events Handled

The webhook handler processes the following GitHub issue events:

- **`opened`**: New issue created
- **`created`**: Issue created (alternative event)
- **`edited`**: Issue title or body edited
- **`reopened`**: Issue reopened
- **`closed`**: Issue closed
- **`deleted`**: Issue deleted

### Testing Webhooks

#### Using GitHub's Webhook Testing

1. Go to your webhook settings in GitHub
2. Click **Recent Deliveries**
3. Click on any delivery to see the request/response
4. Click **Redeliver** to test again

#### Using ngrok for Local Development

For local development, use ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Start your development server
npm run dev

# In another terminal, expose your local server
ngrok http 3000
```

Use the ngrok URL as your webhook payload URL:
```
https://abc123.ngrok.io/api/github/issues
```

### Security Considerations

#### Webhook Signature Verification

The webhook handler verifies the signature to ensure requests come from GitHub:

```typescript
const isValid = verifyGitHubWebhook(body, signature, process.env.GITHUB_WEBHOOK_SECRET);
if (!isValid) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}
```

#### Rate Limiting

GitHub webhooks have rate limits:
- **Authenticated requests**: 5,000 requests per hour
- **Unauthenticated requests**: 60 requests per hour

### Troubleshooting

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

```bash
DEBUG=api:github:issues
```

### Monitoring

Monitor webhook delivery in GitHub:
- **Settings** → **Webhooks** → **Recent Deliveries**
- Check response codes and payloads
- Review failed deliveries for errors

### API Endpoints

The webhook handler is available at:
- **URL**: `/api/github/issues`
- **Method**: `PATCH`
- **Content-Type**: `application/json`
- **Headers**: 
  - `x-hub-signature-256`: GitHub webhook signature
  - `x-github-event`: Event type (e.g., "issues")

## Integration with Events System

The webhook handler integrates with the existing events system:

1. **Database Updates**: Webhook events update the `github_issues` table
2. **Event Triggers**: Changes to the table trigger events that sync back to GitHub
3. **Bidirectional Sync**: Changes flow both ways between GitHub and your database

This creates a complete bidirectional synchronization system for GitHub issues.

## Assistant Features

The Hasyx assistant provides:

- **Interactive Configuration**: Step-by-step setup with prompts
- **Automatic Secret Generation**: Secure webhook secrets
- **Environment Variable Management**: Automatic `.env` updates
- **Documentation Generation**: Creates detailed setup instructions
- **Base URL Detection**: Automatically determines webhook URLs
- **Repository Validation**: Ensures correct repository format
- **Event Selection**: Choose which GitHub events to handle

Run `npx hasyx-assist` to get started with the interactive setup! 
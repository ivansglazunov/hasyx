# GitHub Webhooks Setup

## Overview

This document explains how to set up GitHub webhooks to automatically sync issues between GitHub and your local database.

## Current Configuration

- **Repository**: ivansglazunov/hasyx
- **Webhook URL**: https://hasyx-dev.deep.foundation/api/github/issues
- **Events**: issues, pull_request, push, release
- **Base URL**: https://hasyx-dev.deep.foundation

## Prerequisites

1. **GitHub Repository**: You need access to the repository where you want to track issues
2. **Public URL**: Your API must be accessible from the internet (for GitHub to send webhooks)
3. **Environment Variables**: Ensure the following are set:
   - `GITHUB_WEBHOOK_SECRET`: A secret key for webhook verification
   - `NEXT_PUBLIC_GITHUB_OWNER`: Repository owner
   - `NEXT_PUBLIC_GITHUB_REPO`: Repository name

## Setup Steps

### 1. Verify Webhook Secret

Your webhook secret is: `ff6564c83f88612849a02b15f5161dea4e3ebcdb4a6d4d5c8f71bcc277c97db0`

This secret is used to verify that webhook requests come from GitHub.

### 2. Configure GitHub Webhook

1. Go to your GitHub repository: https://github.com/ivansglazunov/hasyx
2. Navigate to **Settings** → **Webhooks**
3. Click **Add webhook**
4. Configure the webhook:

   **Payload URL:**
   ```
   https://hasyx-dev.deep.foundation/api/github/issues
   ```

   **Content type:**
   ```
   application/json
   ```

   **Secret:**
   ```
   ff6564c83f88612849a02b15f5161dea4e3ebcdb4a6d4d5c8f71bcc277c97db0
   ```

   **Events:**
   - Select **Let me select individual events**
   - Check **Issues** (this will capture all issue-related events)
   - Uncheck all other events

5. Click **Add webhook**

### 3. Webhook Events Handled

The webhook handler processes the following GitHub issue events:

- **`opened`**: New issue created
- **`created`**: Issue created (alternative event)
- **`edited`**: Issue title or body edited
- **`reopened`**: Issue reopened
- **`closed`**: Issue closed
- **`deleted`**: Issue deleted

### 4. Testing Webhooks

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

### 5. Security Considerations

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

```bash
DEBUG=api:github:issues
```

### 7. Monitoring

Monitor webhook delivery in GitHub:
- **Settings** → **Webhooks** → **Recent Deliveries**
- Check response codes and payloads
- Review failed deliveries for errors

### 8. Environment Variables

Required environment variables:

```bash
# GitHub Repository Configuration
NEXT_PUBLIC_GITHUB_OWNER=ivansglazunov
NEXT_PUBLIC_GITHUB_REPO=hasyx

# Webhook Security
GITHUB_WEBHOOK_SECRET=ff6564c83f88612849a02b15f5161dea4e3ebcdb4a6d4d5c8f71bcc277c97db0

# GitHub API Access (for user operations)
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret
GITHUB_TOKEN=your-github-personal-access-token
```

### 9. API Endpoints

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

# Telegram Bot Webhook Configuration

This document describes the automatic webhook setup functionality for Telegram bots in hasyx.

## Overview

Use the Telegram CLI or configure via hasyx.config.json. The Telegram CLI can set or remove webhooks, and the config controls public bot settings.

## Features

### Automatic Webhook Setup
- During Telegram bot configuration, you can choose to set your application as the webhook URL
- Uses `API_URL` from environment variables to determine the webhook endpoint
- Automatically formats the webhook URL as `{API_URL}/api/telegram_bot`
- Ensures HTTPS protocol for production environments (Telegram requirement)

### Security Features
- Server-side validation using Telegram bot token
- Automatic protocol conversion (HTTP → HTTPS for non-localhost URLs)
- Error handling for webhook setup failures

## Usage

### CLI Commands

Webhook operations:
```bash
npx hasyx telegram webhook define https://your-base-url/api/telegram_bot
npx hasyx telegram webhook undefine
npx hasyx telegram calibrate --project "Your Project" --webhook https://your-base-url/api/telegram_bot
```

### Configuration via hasyx.config.json

Public username/token for Telegram Login OAuth are configured in `hasyx.config.json` (section `telegramLoginOAuth`).

When prompted with "Do you want to set this application as the webhook URL for your Telegram bot?":
- **Yes**: Automatically configures webhook using current `API_URL`
- **No**: Skips webhook configuration

### Environment Variables

Recommended webhook URL: `{BASE_URL}/api/telegram_bot`, where `BASE_URL` = `NEXT_PUBLIC_MAIN_URL` (or `NEXT_PUBLIC_BASE_URL`).

### Webhook Endpoint

Your application should handle Telegram webhooks at:
```
{API_URL}/api/telegram_bot
```

## Technical Implementation

### URL Processing
- Non-localhost HTTP URLs are automatically converted to HTTPS
- Localhost URLs remain HTTP for development
- URL encoding is handled automatically for API calls

### API Call
The webhook is set using Telegram Bot API:
```
https://api.telegram.org/bot{TOKEN}/setWebhook?url={ENCODED_WEBHOOK_URL}
```

### Error Handling
- Invalid bot tokens are detected and reported
- Network errors are caught and displayed
- Webhook validation failures show descriptive error messages

## Testing
Use API route tests or integration tests for your project setup.

Tests cover:
- Successful webhook setup
- User declining webhook setup
- API error handling
- URL format validation

## Integration

This functionality is available via `npx hasyx telegram` subcommands.

## Security Notes

- Webhook URLs must use HTTPS in production (Telegram requirement)
- Bot tokens are handled securely and not logged
- Only the configured API URL endpoint receives webhook data
- Server-side validation ensures webhook authenticity

## Troubleshooting

### Common Issues

1. **Webhook setup fails**: Check bot token validity and URL accessibility
2. **HTTP URL rejected**: Ensure production URLs use HTTPS protocol  
3. **URL not accessible**: Verify `API_URL` points to accessible endpoint
4. **Permission errors**: Ensure bot token has necessary permissions

### Debug Information

The setup process logs:
- Webhook URL being configured
- API response status
- Error details for troubleshooting 
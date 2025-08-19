# GitHub → Telegram Bot Integration

This document describes the GitHub Actions integration with Telegram bot that automatically sends commit notifications to all bot users with detailed information about changes, test results, publications, and deployment status.

## 🎯 Overview

The integration provides:
- ✅ Automatic notifications after all workflows complete
- 🤖 AI-generated rich messages in English with project context
- 📊 Detailed commit information (author, files changed, etc.)
- 🧪 Test results and build status
- 📦 Publication status (npm/GitHub releases)
- 🚀 Deployment status and URLs
- 📈 Performance metrics and timing

## 🏗️ Architecture

### Components:
1. **GitHub Actions Workflow** (`.github/workflows/workflow.yml`)
   - Unified workflow that handles all CI/CD tasks
   - Automatically triggers Telegram notifications after completion

2. **Notification Script** (`lib/github-telegram-bot.ts`)
   - Fetches commit and workflow data from GitHub API
   - Generates AI-powered messages via OpenRouter
   - Sends notifications to Telegram users

3. **Environment Configuration**
   - Uses environment variables for configuration
   - Supports multiple notification targets

## 🔧 Setup Instructions

### 1. Enable in Your Project

When you run `npx hasyx init`, the unified GitHub Actions workflow is automatically created in your project.

### 2. Configure Environment Variables

Set these variables in your `.env` file and GitHub repository secrets:

#### Required:
```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=your_channel_id_here
OPENROUTER_API_KEY=your_openrouter_api_key
```

#### Optional:
```bash
GITHUB_TELEGRAM_BOT=1  # 1=enabled, 2=test mode, unset=disabled
```

### 3. GitHub Repository Secrets

Configure these secrets in your GitHub repository settings:

- `TELEGRAM_BOT_TOKEN` - Your Telegram bot API token
- `TELEGRAM_CHANNEL_ID` - Channel ID for GitHub commit notifications
- `OPENROUTER_API_KEY` - OpenRouter API key for AI message generation
- `GITHUB_TELEGRAM_BOT` - (Optional) Control mode: `1` or `2`

### 4. Telegram Bot Setup

1. Create a bot via @BotFather on Telegram
2. Get the bot token
3. Add the bot to your channel as an administrator
4. Get the channel ID (e.g., `@your_channel` or `-1001234567890`)

## 📋 Configuration Options

### GITHUB_TELEGRAM_BOT Modes:
- **`1`** - Production mode: sends real notifications
- **`2`** - Test mode: generates messages but doesn't send
- **Unset** - Disabled: no notifications sent

### Target Workflows:
The unified workflow automatically handles all CI/CD tasks in sequence:
- `test` - Test suite
- `npm-publish` - NPM package publication
- `deploy-nextjs` - GitHub Pages deployment
- `docker-build` - Docker image building and publishing
- `android-build` - Android APK building
- `create-release` - GitHub Release creation with APK attachment
- `telegram-notification` - Telegram notifications

All tasks are handled by the single `.github/workflows/workflow.yml` file.

## 🔄 How It Works

### Workflow Sequence:
1. **Trigger**: Push to main branch
2. **Execute**: All CI/CD tasks run sequentially in the unified workflow
3. **Collect**: Gather commit info, workflow results, file changes
4. **Generate**: Create AI-powered message with full context
5. **Send**: Notify all registered Telegram bot users

### Message Content:
- 📊 Project info (name, version)
- 👤 Commit author and message
- 📝 File change statistics
- ✅/❌ Workflow results with timing
- 🔗 Deployment URLs
- 🤖 AI-generated summary in English

## 🧪 Testing

### Test Mode:
Set `GITHUB_TELEGRAM_BOT=2` to enable test mode where:
- Messages are generated but not sent to Telegram
- Output is displayed in GitHub Actions logs
- Perfect for verifying configuration

### Local Testing:
```bash
# Set environment variables
export GITHUB_SHA=your_commit_sha
export GITHUB_TOKEN=your_github_token
export TELEGRAM_BOT_TOKEN=your_bot_token
export OPENROUTER_API_KEY=your_openrouter_key
export GITHUB_TELEGRAM_BOT=2  # Test mode

# Run the notification script
npx tsx lib/github-telegram-bot.ts
```

## 📊 API Integrations

### GitHub API:
- Repository information
- Commit details and file changes
- Workflow run status and timing
- Deployment information

### OpenRouter AI API:
- Message generation with context
- English language output
- Project-aware content

### Telegram Bot API:
- User management (via bot `/start` command)
- Message sending to individuals/groups/channels
- Rich text formatting

## 🛠️ Customization

### Message Templates:
Edit the AI prompt in `lib/github-telegram-bot.ts` to customize:
- Language (currently English)
- Message structure
- Information emphasis
- Tone and style

### Workflow Configuration:
The unified workflow automatically handles all timing and sequencing. No need to modify individual workflow configurations.

## 🔍 Troubleshooting

### Common Issues:

**No notifications sent:**
- Check `GITHUB_TELEGRAM_BOT` is set to `1`
- Verify `TELEGRAM_CHANNEL_ID` is configured correctly
- Ensure bot has administrator permissions in the channel
- Check GitHub Actions logs for errors

**API rate limits:**
- The script includes rate limiting protection
- Failed requests are logged for debugging

**Workflow issues:**
- Check GitHub Actions logs for the unified workflow
- Verify all required secrets are configured

**Bot permissions:**
- Bot must be added to the channel as administrator
- Ensure bot has permission to send messages in the channel

## 🔗 Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [OpenRouter API](https://openrouter.ai/docs)
 

## 🤝 Contributing

The integration is part of the Hasyx framework. To contribute:
1. Fork the repository
2. Make your changes
3. Test with `HASYX_GITHUB_TELEGRAM_BOT=2`
4. Submit a pull request

For issues or feature requests, please use the GitHub issue tracker. 
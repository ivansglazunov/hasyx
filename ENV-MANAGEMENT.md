# Environment Management with hasyx.config.json

Hasyx provides a centralized environment management system using `hasyx.config.json` to manage environment variables across different environments (local, dev, prod, etc.).

## Overview

The new environment management system solves common problems:

- **Centralized Configuration**: All environment variables in one place
- **Easy Environment Switching**: Switch between local, dev, and prod with one command
- **Global Variables**: Define variables that apply to all environments
- **Environment-Specific Overrides**: Override global variables per environment
- **Migration Support**: Import existing `.env` files

## Quick Start

### 1. Initialize Environment Configuration

Run the setup wizard to create `hasyx.config.json`:

```bash
npx hasyx env
```

The wizard will:
- Detect and optionally migrate your existing `.env` file
- Create a default configuration with `local`, `dev`, and `prod` environments
- Let you customize PORT and HASURA_URL values
- Save everything to `hasyx.config.json`

### 2. Switch Environments

To switch between environments:

```bash
npx hasyx env
```

Select an environment (e.g., `local`, `dev`, or `prod`), and the command will apply all variables to `.env`.

### 3. List Available Environments

To see all environments and their variables:

```bash
npx hasyx env --list
```

### 4. Manage Variables Interactively

Use the assist command for interactive variable management:

```bash
npx hasyx assist
```

This opens an interactive menu where you can:
- Add or update variables
- Remove variables
- View merged variables (global + environment-specific)
- Save changes to `hasyx.config.json`

## Configuration File Structure

The `hasyx.config.json` file has a simple structure:

```json
{
  "global": {
    "ACCESS_TOKEN": "abc123",
    "SHARED_SECRET": "xyz789"
  },
  "local": {
    "PORT": "3000",
    "HASURA_URL": "http://localhost:8080",
    "NODE_ENV": "development"
  },
  "dev": {
    "PORT": "3001",
    "HASURA_URL": "https://dev.example.com",
    "NODE_ENV": "development"
  },
  "prod": {
    "PORT": "80",
    "HASURA_URL": "https://api.example.com",
    "NODE_ENV": "production"
  }
}
```

### Environment Types

- **`global`**: Variables that apply to all environments (e.g., persistent tokens, shared secrets)
- **Environment-specific** (e.g., `local`, `dev`, `prod`): Variables unique to each environment

Environment-specific variables override global variables with the same name.

## Commands

### `npx hasyx env`

Interactive environment switcher. Lists all available environments and applies the selected one to `.env`.

**Options:**
- `--list, -l`: List all environments and their variables without switching
- `--docker-sync`: Legacy mode - sync `.env` to `docker-compose.yml` (deprecated)

**Examples:**

```bash
# Interactive environment switching
npx hasyx env

# List all environments
npx hasyx env --list

# Legacy docker-compose sync
npx hasyx env --docker-sync
```

### `npx hasyx assist`

Interactive assistant for managing environment variables. Opens a menu-driven interface to:
- Set or update variables in any environment
- Remove variables
- View merged variables (global + environment-specific)
- List all environments
- Save changes

**Example:**

```bash
npx hasyx assist
```

Then follow the on-screen prompts:
1. Select action (set, remove, view, list, save, exit)
2. Choose environment
3. Enter variable name and value
4. Save changes when done

## Workflow Examples

### Initial Setup from Scratch

```bash
# 1. Run setup wizard
npx hasyx env

# 2. Follow prompts to create environments
# 3. Edit hasyx.config.json manually to add more variables
# 4. Switch to local environment
npx hasyx env
# Select: 1 (local)

# 5. Start development
npm run dev
```

### Migrating from Existing .env

```bash
# 1. Run setup wizard (detects .env automatically)
npx hasyx env

# 2. Choose to migrate .env
# Enter: y

# 3. Select target environment
# Enter: local

# 4. Wizard migrates all variables to hasyx.config.json
# 5. Your .env is now managed by hasyx.config.json
```

### Switching Environments for Deployment

```bash
# Development
npx hasyx env
# Select: 1 (local)
npm run dev

# Testing on staging
npx hasyx env
# Select: 2 (dev)
npm run build && npm run start

# Production deployment
npx hasyx env
# Select: 3 (prod)
npm run build && npm run start
```

### Adding Variables Interactively

```bash
# 1. Open assist
npx hasyx assist

# 2. Select action: 1 (Set/update a variable)
# 3. Select environment: global
# 4. Enter variable name: API_KEY
# 5. Enter value: your-api-key-here
# 6. Select action: 5 (Save and exit)

# Variable is now in hasyx.config.json
```

### Managing Environment-Specific Variables

```bash
# Add PORT to each environment
npx hasyx assist

# For each environment (local, dev, prod):
# 1. Action: 1 (Set/update)
# 2. Select environment
# 3. Variable name: PORT
# 4. Value: <environment-specific-port>

# Save when done
```

## Best Practices

### 1. Use Global for Shared Secrets

Put tokens and secrets that are the same across all environments in `global`:

```json
{
  "global": {
    "JWT_SECRET": "your-jwt-secret",
    "ENCRYPTION_KEY": "your-encryption-key"
  }
}
```

### 2. Override Per Environment

Use environment-specific sections to override global values:

```json
{
  "global": {
    "API_TIMEOUT": "30000"
  },
  "prod": {
    "API_TIMEOUT": "60000"  // Longer timeout in production
  }
}
```

### 3. Keep hasyx.config.json Private

The file is already in `.gitignore`. Never commit it to version control as it contains sensitive data.

### 4. Document Required Variables

Create a `hasyx.config.example.json` (without sensitive values) to document required variables:

```json
{
  "global": {
    "ACCESS_TOKEN": "your-token-here"
  },
  "local": {
    "PORT": "3000",
    "HASURA_URL": "http://localhost:8080"
  }
}
```

Commit this example file to help team members set up their environments.

### 5. Automate Environment Loading

Before running your app, always load the correct environment:

```bash
# In package.json scripts
{
  "scripts": {
    "dev": "npx hasyx env && npm run dev:start",
    "dev:start": "next dev"
  }
}
```

Or create environment-specific scripts:

```bash
{
  "scripts": {
    "dev:local": "npx hasyx env && <select local> && npm run dev",
    "dev:staging": "npx hasyx env && <select dev> && npm run dev"
  }
}
```

## Migration Guide

### From Old Assist Commands

If you were using old assist commands, here's how to migrate:

**Old way:**
```bash
npx hasyx assist  # Old interactive config tool
```

**New way:**
```bash
npx hasyx env     # Setup and environment switching
npx hasyx assist  # Variable management
```

The new `assist` command now manages `hasyx.config.json` instead of directly modifying `.env`.

### From Manual .env Management

**Old workflow:**
```bash
# Manually edit .env for each environment
nano .env

# Copy .env.example to .env
cp .env.example .env
```

**New workflow:**
```bash
# One-time setup
npx hasyx env

# Switch environments anytime
npx hasyx env
# Select environment from list

# Manage variables
npx hasyx assist
```

## Troubleshooting

### Q: My changes to .env are being overwritten

**A:** Don't edit `.env` directly anymore. Use `npx hasyx assist` to modify variables in `hasyx.config.json`, then apply them with `npx hasyx env`.

### Q: I need different variables for CI/CD

**A:** Create a `ci` environment in `hasyx.config.json`:

```json
{
  "ci": {
    "PORT": "3000",
    "NODE_ENV": "test",
    "CI": "true"
  }
}
```

Then in your CI pipeline:
```bash
npx hasyx env
# Select: ci
npm test
```

### Q: How do I share configuration with team?

**A:** Create a `hasyx.config.example.json` with placeholder values (no secrets), commit it to git, and document the setup process in your README.

### Q: Can I use this with Docker?

**A:** Yes! The generated `.env` file works with Docker Compose:

```bash
# Select environment
npx hasyx env

# Start Docker Compose (reads .env automatically)
docker-compose up
```

For the legacy docker-compose sync feature:
```bash
npx hasyx env --docker-sync
```

## Advanced Usage

### Programmatic Access

You can also use the configuration utilities in your code:

```typescript
import {
  readConfig,
  getEnvironmentVariables,
  applyEnvironmentToEnvFile
} from 'hasyx/lib/hasyx-config';

// Read config
const config = readConfig();

// Get merged variables for an environment
const vars = getEnvironmentVariables(config, 'prod');

// Apply environment
applyEnvironmentToEnvFile(config, 'prod');
```

### Custom Environments

You can create custom environments beyond the defaults:

```json
{
  "global": { ... },
  "local": { ... },
  "staging": {
    "PORT": "3002",
    "HASURA_URL": "https://staging.example.com"
  },
  "preview": {
    "PORT": "3003",
    "HASURA_URL": "https://preview.example.com"
  }
}
```

All custom environments will appear in the `npx hasyx env` menu.

## See Also

- [CONTRIBUTING.md](./CONTRIBUTING.md) - Project contribution guidelines
- [README.md](./README.md) - Main project documentation
- `.gitignore` - Ensures `hasyx.config.json` stays private

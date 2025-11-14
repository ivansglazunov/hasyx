# Hasyx Feature Extraction Analysis

## Overview

This document provides a comprehensive analysis of the Hasyx repository structure to identify major features that could be separated into independent packages. The analysis is based on the repository structure, documentation files, and code organization.

## Repository Structure Summary

- **Total TypeScript/TSX files in lib/**: 263 files
- **Total subdirectories in lib/**: 38 subdirectories
- **Documentation files**: 60+ markdown files
- **Migration scripts**: Multiple migration directories
- **Package type**: Monolithic framework with library structure

---

## Feature Categories and Extraction Candidates

### 1. AI & LLM Integration

#### Package: `@hasyx/ai`

**Description:** Event-driven AI engine with dialog orchestration, tool usage, and multiple LLM backend support.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/AI.md` - High-level AI architecture overview
- `/tmp/gh-issue-solver-1761492339563/ASK.md` - AI CLI interface guide
- `/tmp/gh-issue-solver-1761492339563/OLLAMA.md` - Local model integration
- `/tmp/gh-issue-solver-1761492339563/OPENROUTER.md` - Cloud model integration

**Related Files in lib/:**
- `lib/ai/` (13 files)
  - `ai.ts` - Core AI class with memory management
  - `ai.test.ts` - AI tests
  - `console.ts` - Console integration
  - `core-prompts.ts` - System prompts
  - `dialog.ts` - Dialog orchestrator
  - `dialog.test.ts` - Dialog tests
  - `dialog-parser.ts` - Dialog parser
  - `dialog-parser.test.ts` - Parser tests
  - `telegram.ts` - Telegram integration
  - `terminal.ts` - Terminal integration
  - `tool.ts` - Tool interface
  - `tooler.ts` - Tool executor
  - `tooler.test.ts` - Tool tests
- `lib/ai/handlers/` - AI event handlers
- `lib/ai/providers/` - LLM provider implementations (Ollama, OpenRouter)
- `lib/ai/tools/` - Built-in tools (exec-js-tool, exec-tsx-tool, terminal-tool)
- `lib/ask.ts` - AI CLI implementation

**Dependencies:**
- Core: None (provider pattern)
- Optional: `@hasyx/exec` (for code execution tools)
- Optional: `@hasyx/terminal` (for terminal tools)
- External: `ollama-node`, `@openrouter/ai-sdk-provider`

**Features:**
- Dialog-based AI orchestration
- Memory management and context handling
- Multiple LLM provider support (Ollama, OpenRouter)
- Tool calling and execution
- CLI interface for AI interaction
- Stream and non-stream responses
- Telegram and terminal integration handlers

---

### 2. Authentication & Authorization

#### Package: `@hasyx/auth`

**Description:** Complete authentication system with NextAuth.js integration, JWT handling, and multiple OAuth providers.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/AUTH.md` - Authentication helpers and JWT auth

**Related Files in lib/:**
- `lib/auth/` (7 files)
  - `credentials.ts` - Credentials provider
  - `credentials-start.ts` - Credentials startup
  - `jwt-complete.ts` - JWT completion
  - `jwt-status.ts` - JWT status
  - `route.ts` - Auth routes
  - `verify.ts` - Email verification
  - `verify-telegram-webapp.ts` - Telegram WebApp verification
- `lib/users/` (11 files)
  - Auth-related user management
  - OAuth callbacks
  - Session management
- `lib/jwt.ts` - JWT token generation and validation
- `lib/jwt.test.ts` - JWT tests
- `lib/jwt-auth.ts` - JWT authentication
- `lib/jwt-auth.test.ts` - JWT auth tests
- `lib/next-auth-options.ts` - NextAuth configuration
- `lib/get-jwt.ts` - JWT retrieval
- `lib/verification-codes.ts` - Verification code management

**Dependencies:**
- Core: `@hasyx/hasura` (for user storage)
- Optional: `@hasyx/email` (for email verification)
- External: `next-auth`, `@auth/core`, `@auth/hasura-adapter`, `bcrypt`, `jsonwebtoken`

**Features:**
- Multiple OAuth providers (Google, GitHub, Yandex, Facebook, VK)
- Credentials-based authentication
- JWT token management
- Email verification
- Telegram WebApp authentication
- Session management
- Hasura JWT integration

---

### 3. GraphQL Client & Query Generation

#### Package: `@hasyx/graphql`

**Description:** Powerful GraphQL client with dynamic query generation, Apollo integration, and secure proxy.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/APOLLO.md` - Apollo Client documentation
- `/tmp/gh-issue-solver-1761492339563/GENERATOR.md` - Query generator documentation
- `/tmp/gh-issue-solver-1761492339563/HASYX.md` - Hasyx client documentation
- `/tmp/gh-issue-solver-1761492339563/GRAPHQL-PROXY.md` - GraphQL proxy documentation

**Related Files in lib/:**
- `lib/apollo/` (2 files)
  - Apollo Client configuration
- `lib/generator.ts` - Dynamic query generator (64KB, complex)
- `lib/generator.test.ts` - Generator tests
- `lib/hasyx/` (6 files)
  - `hasyx.tsx` - Core Hasyx client class
  - Specialized clients (geo.test.ts, etc.)
- `lib/graphql-proxy.ts` - Secure GraphQL proxy
- `lib/graphql-constants.ts` - GraphQL constants
- `lib/graphql.test.ts` - GraphQL tests
- `lib/gql-sql/` (2 files) - GraphQL to SQL conversion

**Dependencies:**
- Core: None (can be standalone)
- Optional: `@hasyx/auth` (for JWT integration)
- External: `@apollo/client`, `graphql`, `graphql-ws`

**Features:**
- Dynamic query generation from TypeScript objects
- Type-safe GraphQL operations
- Apollo Client integration
- Subscription support (WebSocket)
- Secure proxy for Hasura
- Multiple query patterns (insert, update, delete, select, subscribe)
- React hooks (useQuery, useSubscription, useClient)

---

### 4. Database Management (Hasura)

#### Package: `@hasyx/hasura`

**Description:** Hasura admin client for schema management, migrations, and database operations.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/HASURA.md` - Hasura admin client documentation

**Related Files in lib/:**
- `lib/hasura/` (4 files)
  - Hasura admin client
  - Schema management
  - Migration helpers
- `lib/hasura-schema.ts` - Schema introspection
- `lib/hasura-types.ts` - Type generation
- `lib/hasura-schema-utils.ts` - Schema utilities
- `lib/migrate.ts` - Migration runner
- `lib/unmigrate.ts` - Migration rollback

**Dependencies:**
- Core: None
- External: `graphql`, `@graphql-codegen/cli`

**Features:**
- Schema management (define/create operations)
- Migration system
- Table and column management
- Relationship management
- Permission management
- Type generation from schema
- Idempotent operations

---

### 5. Code Execution Engine

#### Package: `@hasyx/exec`

**Description:** Universal code execution engine for JavaScript and TypeScript in Node.js and browser environments.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/EXEC.md` - JavaScript execution engine
- `/tmp/gh-issue-solver-1761492339563/EXEC-TSX.md` - TypeScript execution engine

**Related Files in lib/:**
- `lib/exec.ts` - JavaScript execution engine
- `lib/exec.test.ts` - Exec tests
- `lib/exec-tsx.ts` - TypeScript execution engine
- `lib/exec-tsx.test.ts` - Exec TSX tests
- `lib/js.ts` - JS CLI interface
- `lib/tsx.ts` - TSX CLI interface

**Dependencies:**
- Core: None (standalone)
- External: `tsx`, `vm-browserify`

**Features:**
- JavaScript execution in isolated VM
- TypeScript compilation and execution
- In-memory module system
- Browser and Node.js environment support
- Secure sandboxing
- CLI interfaces

---

### 6. Terminal Emulation

#### Package: `@hasyx/terminal`

**Description:** Terminal emulation library for spawning and managing shell processes.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/TERMINAL.md` - Terminal library documentation
- `/tmp/gh-issue-solver-1761492339563/MARKDOWN-TERMINAL.md` - Markdown formatting for terminal

**Related Files in lib/:**
- `lib/terminal.ts` - Terminal emulation core
- `lib/terminal.test.ts` - Terminal tests
- `lib/markdown-terminal.ts` - Markdown terminal formatter
- `lib/markdown-terminal.test.ts` - Markdown terminal tests

**Dependencies:**
- Core: None
- External: `cross-spawn`, `marked`, `marked-terminal`

**Features:**
- Process spawning and management
- Session management
- Command execution
- Terminal factory functions
- Markdown formatting for terminal output
- Syntax highlighting

---

### 7. Telegram Integration

#### Package: `@hasyx/telegram`

**Description:** Complete Telegram integration including Bot API, WebApp authentication, and Mini Apps.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/TELEGRAM-BOT.md` - Telegram Bot documentation
- `/tmp/gh-issue-solver-1761492339563/TELEGRAM-WEBAPP.md` - Telegram WebApp documentation
- `/tmp/gh-issue-solver-1761492339563/TELEGRAM-ASK.md` - Telegram AI assistant
- `/tmp/gh-issue-solver-1761492339563/TELEGRAM-WEBHOOK.md` - Telegram webhook handling
- `/tmp/gh-issue-solver-1761492339563/TELEGRAM_BOT.md` - GitHub-Telegram bot integration

**Related Files in lib/:**
- `lib/telegram/` (8 files)
  - `index.ts` - Main telegram module
  - `config.tsx` - Telegram configuration
  - `telegram-bot.ts` - Bot API client
  - `telegram-credentials.ts` - Credentials management
  - `telegram-handler.ts` - Webhook handler
  - `telegram-miniapp-page.tsx` - Mini App page
  - `telegram-miniapp-server.ts` - Mini App server
  - `telegram-miniapp.tsx` - Mini App client
- `lib/github-telegram-bot.ts` - GitHub to Telegram integration

**Dependencies:**
- Core: `@hasyx/auth` (for authentication)
- Optional: `@hasyx/ai` (for AI assistant features)
- External: `@twa-dev/sdk`

**Features:**
- Telegram Bot API integration
- Webhook handling
- Mini App support
- WebApp authentication
- GitHub integration (CI/CD notifications)
- AI assistant integration

---

### 8. Notification System

#### Package: `@hasyx/notify`

**Description:** Multi-channel notification system with Firebase, Telegram, and push notification support.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/NOTIFY.md` - Notification system overview
- `/tmp/gh-issue-solver-1761492339563/NOTIFY-FIREBASE.md` - Firebase notifications
- `/tmp/gh-issue-solver-1761492339563/NOTIFY-TELEGRAM-BOT.md` - Telegram notifications
- `/tmp/gh-issue-solver-1761492339563/NOTIFY-ANDROID.md` - Android notifications
- `/tmp/gh-issue-solver-1761492339563/NOTIFY-IOS.md` - iOS notifications

**Related Files in lib/:**
- `lib/notify/` (5 files)
  - `notify.ts` - Core notification system
  - `notify-firebase.ts` - Firebase Cloud Messaging
  - `notify-telegram.ts` - Telegram notifications
  - `up-notify.ts` - Notification migrations (up)
  - `down-notify.ts` - Notification migrations (down)

**Dependencies:**
- Core: `@hasyx/hasura` (for storage)
- Optional: `@hasyx/telegram` (for Telegram notifications)
- External: `firebase`, `@capacitor-firebase/messaging`

**Features:**
- Multi-channel notifications (Firebase, Telegram, push)
- Device token management
- Platform-specific handling (iOS, Android)
- Migration support for notification tables

---

### 9. Payment Integration

#### Package: `@hasyx/payments`

**Description:** Payment gateway integration with TBank and VTB support, including subscription billing.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/TBANK.md` - TBank payments documentation
- `/tmp/gh-issue-solver-1761492339563/TINKOFF_API.md` - Tinkoff API base documentation
- `/tmp/gh-issue-solver-1761492339563/VTB.md` - VTB integration
- `/tmp/gh-issue-solver-1761492339563/TBANK_RECURRENT_STATUS.md` - Recurrent payment status
- `/tmp/gh-issue-solver-1761492339563/TBANK_TESTING.md` - Payment testing
- `/tmp/gh-issue-solver-1761492339563/VTB_TESTING.md` - VTB testing

**Related Files in lib/:**
- `lib/payments/` (6 files)
  - `base.ts` - Base payment interface
  - `tbank.ts` - TBank integration (35KB)
  - `vtb.ts` - VTB integration
  - `subscription-billing.ts` - Subscription management
  - `up-payments.ts` - Payment migrations (up)
  - `down-payments.ts` - Payment migrations (down)
- `lib/payments/tbank/` - TBank-specific modules
- `lib/payments/vtb/` - VTB-specific modules

**Dependencies:**
- Core: `@hasyx/hasura` (for storage)
- External: `axios`

**Features:**
- TBank payment gateway integration
- VTB payment integration
- Subscription billing system
- Recurrent payments
- Payment status tracking
- Test mode support

---

### 10. File Storage

#### Package: `@hasyx/files`

**Description:** S3-compatible file storage with upload/download, metadata management, and REST API.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/FILES.md` - Files storage documentation

**Related Files in lib/:**
- `lib/files/` (5 files)
  - `files.ts` - Core file storage (16KB)
  - `files.test.ts` - File storage tests
  - `api.ts` - REST API for files
  - `up-storage.ts` - Storage migrations (up)
  - `down-storage.ts` - Storage migrations (down)

**Dependencies:**
- Core: `@hasyx/hasura` (for metadata storage)
- External: S3-compatible storage SDK

**Features:**
- S3-compatible storage integration
- File upload/download
- Metadata management
- REST API
- Migration support

---

### 11. Geospatial (PostGIS)

#### Package: `@hasyx/geo`

**Description:** PostGIS-powered geospatial layer with spatial queries and features.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/GEO.md` - Geo module documentation

**Related Files in lib/:**
- `lib/geo/` (2 files)
  - Geospatial queries and helpers
- `lib/postgis/` (2 files)
  - PostGIS integration

**Dependencies:**
- Core: `@hasyx/hasura` (for storage)
- Database: PostGIS extension

**Features:**
- PostGIS integration
- Spatial queries
- Feature management
- Geospatial permissions

---

### 12. PWA Support

#### Package: `@hasyx/pwa`

**Description:** Progressive Web App support with service workers, offline functionality, and push notifications.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/PWA.md` - PWA support documentation

**Related Files in lib/:**
- `lib/pwa.ts` - Core PWA functionality
- `lib/pwa.test.ts` - PWA tests
- `lib/pwa-cache-utils.ts` - Cache utilities
- `lib/pwa-dev-utils.ts` - Development utilities
- `lib/pwa-diagnostics.tsx` - PWA diagnostics

**Dependencies:**
- Core: None
- External: Service worker APIs

**Features:**
- Service worker management
- Offline support
- Installability
- Push notifications
- Cache management
- PWA diagnostics

---

### 13. Scheduling System

#### Package: `@hasyx/schedule`

**Description:** Cron-based event planning system with real-time processing and database integration.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/SCHEDULE.md` - Schedule system documentation

**Related Files in lib/:**
- `lib/schedule.ts` - Schedule system
- `lib/schedule.test.ts` - Schedule tests
- `lib/up-schedule.ts` - Schedule migrations (up)
- `lib/down-schedule.ts` - Schedule migrations (down)

**Dependencies:**
- Core: `@hasyx/hasura` (for storage)
- External: Cron parser

**Features:**
- Cron-based scheduling
- Real-time event processing
- Database integration
- Migration support

---

### 14. Audit Logging

#### Package: `@hasyx/logs`

**Description:** Comprehensive audit trail with granular diff tracking and state snapshots.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/LOGS.md` - Logs system documentation

**Related Files in lib/:**
- `lib/logs/` (6 files)
  - Audit trail implementation
  - Diff tracking
  - State snapshots
- `lib/up-debug.ts` - Debug logging (up)
- `lib/down-debug.ts` - Debug logging (down)
- `lib/debug.ts` - Debug utilities

**Dependencies:**
- Core: `@hasyx/hasura` (for storage)
- External: `diff-match-patch`

**Features:**
- Granular change tracking
- Diff generation
- State snapshots
- CLI management
- JSON configuration
- Hasura permissions integration

---

### 15. Messaging System

#### Package: `@hasyx/messaging`

**Description:** Real-time messaging with rooms, messages, replies, and streaming subscriptions.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/MESSAGING.md` - Messaging system documentation

**Related Files in lib/:**
- `lib/messaging.test.ts` - Messaging tests
- `lib/up-messaging.ts` - Messaging migrations (up)
- `lib/down-messaging.ts` - Messaging migrations (down)

**Dependencies:**
- Core: `@hasyx/hasura` (for storage)
- Core: `@hasyx/graphql` (for subscriptions)

**Features:**
- Real-time messaging
- Room management
- Message replies
- Read cursors
- Streaming subscriptions

---

### 16. Groups & Permissions

#### Package: `@hasyx/groups`

**Description:** Groups schema with memberships, invitations, and permission model.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/GROUPS.md` - Groups system documentation

**Related Files in lib/:**
- `lib/groups/` (4 files)
  - Group management
  - Membership handling
  - Invitation system

**Dependencies:**
- Core: `@hasyx/hasura` (for storage)

**Features:**
- Group management
- Membership system
- Invitation system
- Triggers and allow-lists

---

### 17. Items & Inheritance

#### Package: `@hasyx/items`

**Description:** Items system with inheritance and relationship management.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/ITEMS.md` - Items system documentation

**Related Files in lib/:**
- `lib/items/` (5 files)
  - Item management
  - Inheritance system
- `lib/items.test.ts` - Items tests

**Dependencies:**
- Core: `@hasyx/hasura` (for storage)

**Features:**
- Item management
- Inheritance system
- Relationship management

---

### 18. Validation System

#### Package: `@hasyx/validation`

**Description:** Database validation using plv8 and Zod schemas.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/VALIDATION.md` - Validation documentation
- `/tmp/gh-issue-solver-1761492339563/PLV8.md` - plv8 extension documentation

**Related Files in lib/:**
- `lib/validation.ts` - Validation system (33KB)
- `lib/validation.test.ts` - Validation tests
- `lib/plv8/` (3 files)
  - plv8 integration
  - JavaScript functions in PostgreSQL

**Dependencies:**
- Core: `@hasyx/hasura` (for storage)
- Database: plv8 extension
- External: `zod`

**Features:**
- Zod schema validation
- plv8 integration
- Database-level validation
- Cross-platform compatibility

---

### 19. Options System

#### Package: `@hasyx/options`

**Description:** Configuration management system with key-value storage.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/OPTIONS.md` - Options system documentation

**Related Files in lib/:**
- `lib/options/` (2 files)
  - Options management
- `lib/options.test.ts` - Options tests

**Dependencies:**
- Core: `@hasyx/hasura` (for storage)

**Features:**
- Key-value configuration storage
- Type-safe options
- Migration support

---

### 20. Infrastructure Management

#### Package: `@hasyx/infra`

**Description:** Infrastructure management including DNS, SSL, Nginx, and subdomain management.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/CLOUDFLARE.md` - CloudFlare DNS management
- `/tmp/gh-issue-solver-1761492339563/SSL.md` - SSL certificate management
- `/tmp/gh-issue-solver-1761492339563/NGINX.md` - Nginx configuration
- `/tmp/gh-issue-solver-1761492339563/SUBDOMAIN.md` - Subdomain management

**Related Files in lib/:**
- `lib/cloudflare/` (2 files)
  - CloudFlare API integration
- `lib/ssl.ts` - SSL certificate management
- `lib/ssl.test.ts` - SSL tests
- `lib/nginx/` (2 files)
  - Nginx configuration
- `lib/subdomain.ts` - Subdomain management (17KB)
- `lib/subdomain.test.ts` - Subdomain tests

**Dependencies:**
- Core: None (standalone infrastructure tools)
- External: CloudFlare API, Let's Encrypt

**Features:**
- CloudFlare DNS management
- Let's Encrypt SSL certificates
- Nginx configuration
- Subdomain lifecycle management
- DNS propagation waiting
- Certificate renewal

---

### 21. Docker Integration

#### Package: `@hasyx/docker`

**Description:** Docker containerization with automated Hub publishing and multi-architecture builds.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/DOCKER.md` - Docker documentation

**Related Files in lib/:**
- `lib/docker/` (1 file)
  - Docker utilities
- `lib/dockerhub/` (1 file)
  - Docker Hub publishing

**Dependencies:**
- Core: None
- External: Docker, Docker Hub

**Features:**
- Docker image building
- Multi-architecture support (AMD64/ARM64)
- Docker Hub publishing
- GitHub Actions integration

---

### 22. Event System

#### Package: `@hasyx/events`

**Description:** Hasura event triggers with automatic synchronization and webhook handling.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/EVENTS.md` - Events system documentation

**Related Files in lib/:**
- `lib/events/` (3 files)
  - Event trigger management
- `lib/events.ts` - Event system core
- `lib/events-cli.ts` - Event CLI

**Dependencies:**
- Core: `@hasyx/hasura` (for event triggers)

**Features:**
- Event trigger management
- Webhook handling
- Automatic synchronization
- CLI management

---

### 23. Graph Visualization

#### Package: `@hasyx/cyto`

**Description:** Cytoscape.js integration for graph visualizations with custom HTML rendering.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/CYTO.md` - Cytoscape integration documentation

**Related Files in lib/:**
- `lib/cyto.tsx` - Cytoscape integration (50KB, complex)

**Dependencies:**
- Core: None
- External: `cytoscape`, `react-cytoscapejs`, cytoscape plugins

**Features:**
- Graph visualization
- Custom HTML node rendering
- Reactive style updates
- Multiple layout algorithms
- Interactive editing

---

### 24. Visual Query Builder

#### Package: `@hasyx/constructor`

**Description:** Visual GraphQL query builder with real-time results.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/CONSTRUCTOR.md` - Constructor documentation

**Related Files in lib/:**
- `lib/constructor.tsx` - Visual query builder (54KB)
- `lib/constructor.test.ts` - Constructor tests

**Dependencies:**
- Core: `@hasyx/graphql` (for query execution)
- External: React components

**Features:**
- Visual query building
- Real-time results
- Type-safe operations
- Interactive UI

---

### 25. GitHub Integration

#### Package: `@hasyx/github`

**Description:** GitHub integration including webhooks, issues sync, and OAuth.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/GITHUB-WEBHOOKS.md` - GitHub webhooks documentation

**Related Files in lib/:**
- `lib/github/` (8 files)
  - GitHub API integration
  - Webhook handling
  - Issues synchronization
  - OAuth configuration

**Dependencies:**
- Core: `@hasyx/auth` (for OAuth)
- Optional: `@hasyx/telegram` (for bot integration)
- External: `octokit`

**Features:**
- GitHub OAuth
- Webhook handling
- Issues synchronization
- CI/CD notifications

---

### 26. Invite System

#### Package: `@hasyx/invite`

**Description:** Invitation management system for user onboarding.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/INVITE.md` - Invite system documentation

**Related Files in lib/:**
- `lib/invite/` (4 files)
  - Invite management
- `lib/invites/` (multiple files)
  - Invite UI components
- `lib/invite.ts` - Invite system core

**Dependencies:**
- Core: `@hasyx/hasura` (for storage)
- Core: `@hasyx/auth` (for user integration)

**Features:**
- Invite code generation
- Invite management
- User onboarding
- UI components

---

### 27. HID (Hasyx Identifiers)

#### Package: `@hasyx/hid`

**Description:** Standardized resource identification system.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/HID.md` - HID documentation

**Related Files in lib/:**
- `lib/hid.ts` - HID implementation
- `lib/hid.test.ts` - HID tests

**Dependencies:**
- Core: None (standalone utility)

**Features:**
- Resource identification
- ID parsing and generation
- Type-safe IDs

---

### 28. Internationalization

#### Package: `@hasyx/i18n`

**Description:** Internationalization support with message management.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/translations.md` - Translations documentation

**Related Files in lib/:**
- `lib/i18n/` (5 files)
  - Message management
  - Language support

**Dependencies:**
- Core: None
- External: `next-intl`

**Features:**
- Multi-language support
- Message management
- Next.js integration

---

### 29. URL State Management

#### Package: `@hasyx/use-query`

**Description:** URL query state management for synchronizing state between components.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/USE-QUERY.md` - use-query hook documentation

**Related Files in lib/:**
- `lib/url.ts` - URL utilities
- `lib/url.test.ts` - URL tests

**Dependencies:**
- Core: None
- External: React hooks

**Features:**
- URL parameter synchronization
- Multi-component state sharing
- TypeScript support
- SSR safety

---

### 30. WebSocket Tunnel

#### Package: `@hasyx/wstunnel`

**Description:** WebSocket tunnel client for secure connections.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/WSTUNNEL.md` - WebSocket tunnel documentation
- `/tmp/gh-issue-solver-1761492339563/WSTUNNEL-QUICKSTART.md` - Quick start guide

**Related Files in lib/:**
- `lib/wstunnel/` (1 file)
  - WebSocket tunnel
- `lib/wstunnel.ts` - Tunnel core
- `lib/wstunnel.test.ts` - Tunnel tests
- `lib/wstunnel-client.ts` - Tunnel client
- `lib/install-wstunnel.ts` - Installation script

**Dependencies:**
- Core: None
- External: WebSocket libraries

**Features:**
- WebSocket tunneling
- Secure connections
- Client management

---

### 31. Mobile Development

#### Package: `@hasyx/mobile`

**Description:** Mobile app development with Capacitor and Fastlane integration.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/FASTLANE.md` - Fastlane integration
- `/tmp/gh-issue-solver-1761492339563/NOTIFY-ANDROID.md` - Android notifications
- `/tmp/gh-issue-solver-1761492339563/NOTIFY-IOS.md` - iOS notifications

**Related Files in lib/:**
- `lib/build-client.ts` - Client builder
- `lib/assets.ts` - Asset management

**Dependencies:**
- Core: Multiple hasyx packages
- External: `@capacitor/*` packages

**Features:**
- Capacitor integration
- Fastlane automation
- Asset generation
- Platform-specific builds

---

### 32. WYSIWYG Editor

#### Package: `@hasyx/wysiwyg`

**Description:** Rich text editor integration.

**Related Files in lib/:**
- `lib/wysiwyg/` (1 file)
  - WYSIWYG editor

**Dependencies:**
- External: Slate, editor libraries

**Features:**
- Rich text editing
- Markdown support

---

### 33. Brain System

#### Package: `@hasyx/brain`

**Description:** Advanced formula evaluation and variable management system.

**Related Documentation:**
- `/tmp/gh-issue-solver-1761492339563/BRAIN.md` - Brain system documentation

**Related Files in lib/:**
- `lib/brain/` (4 files)
  - Formula evaluation
  - Variable management
  - Expression parsing

**Dependencies:**
- Core: `@hasyx/hasura` (for storage)
- External: `mathjs`

**Features:**
- Formula evaluation
- Variable management
- Expression parsing
- Mathematical operations

---

### 34. Email Integration

#### Package: `@hasyx/email`

**Description:** Email sending via Resend API.

**Related Files in lib/:**
- `lib/email.ts` - Email integration
- `lib/sms.ts` - SMS integration

**Dependencies:**
- External: `resend`

**Features:**
- Email sending
- Template support
- Verification emails

---

### 35. Configuration Management

#### Package: `@hasyx/config`

**Description:** Interactive configuration management system.

**Related Files in lib/:**
- `lib/config/` (4 files)
  - Configuration management
  - Environment generation
- `lib/config.tsx` - Configuration UI (74KB, complex)
- `lib/env.ts` - Environment utilities

**Dependencies:**
- Core: None
- External: `ink` (for CLI UI)

**Features:**
- Interactive configuration
- Environment generation
- Docker Compose generation
- JSON-based configuration

---

## Dependency Graph Summary

### Core Infrastructure Packages (No dependencies)
1. `@hasyx/exec` - Code execution
2. `@hasyx/terminal` - Terminal emulation
3. `@hasyx/hid` - Resource identification
4. `@hasyx/url` - URL utilities
5. `@hasyx/config` - Configuration management

### Database Layer
- `@hasyx/hasura` - Hasura admin client (standalone)
- `@hasyx/graphql` - GraphQL client (can be standalone)

### Authentication & Authorization
- `@hasyx/auth` - Depends on: `@hasyx/hasura`

### Feature Packages (Depend on core packages)
- `@hasyx/ai` - Depends on: Optional `@hasyx/exec`, `@hasyx/terminal`
- `@hasyx/telegram` - Depends on: `@hasyx/auth`
- `@hasyx/notify` - Depends on: `@hasyx/hasura`, Optional `@hasyx/telegram`
- `@hasyx/payments` - Depends on: `@hasyx/hasura`
- `@hasyx/files` - Depends on: `@hasyx/hasura`
- `@hasyx/geo` - Depends on: `@hasyx/hasura`
- `@hasyx/pwa` - Standalone
- `@hasyx/schedule` - Depends on: `@hasyx/hasura`
- `@hasyx/logs` - Depends on: `@hasyx/hasura`
- `@hasyx/messaging` - Depends on: `@hasyx/hasura`, `@hasyx/graphql`
- `@hasyx/groups` - Depends on: `@hasyx/hasura`
- `@hasyx/items` - Depends on: `@hasyx/hasura`
- `@hasyx/validation` - Depends on: `@hasyx/hasura`
- `@hasyx/options` - Depends on: `@hasyx/hasura`
- `@hasyx/infra` - Standalone
- `@hasyx/docker` - Standalone
- `@hasyx/events` - Depends on: `@hasyx/hasura`
- `@hasyx/cyto` - Standalone
- `@hasyx/constructor` - Depends on: `@hasyx/graphql`
- `@hasyx/github` - Depends on: `@hasyx/auth`, Optional `@hasyx/telegram`
- `@hasyx/invite` - Depends on: `@hasyx/hasura`, `@hasyx/auth`
- `@hasyx/brain` - Depends on: `@hasyx/hasura`
- `@hasyx/email` - Standalone
- `@hasyx/i18n` - Standalone
- `@hasyx/wstunnel` - Standalone
- `@hasyx/mobile` - Depends on: Multiple packages

---

## Recommended Extraction Priority

### Phase 1: Core Utilities (No dependencies)
1. `@hasyx/exec` - Universal code execution
2. `@hasyx/terminal` - Terminal emulation
3. `@hasyx/hid` - Resource identification
4. `@hasyx/url` - URL utilities
5. `@hasyx/email` - Email integration

### Phase 2: Database & GraphQL
6. `@hasyx/hasura` - Database management
7. `@hasyx/graphql` - GraphQL client and generator

### Phase 3: Authentication
8. `@hasyx/auth` - Authentication system

### Phase 4: High-Value Features
9. `@hasyx/ai` - AI integration
10. `@hasyx/telegram` - Telegram integration
11. `@hasyx/payments` - Payment gateways
12. `@hasyx/notify` - Notification system
13. `@hasyx/files` - File storage

### Phase 5: Infrastructure
14. `@hasyx/infra` - DNS, SSL, Nginx, subdomains
15. `@hasyx/docker` - Docker integration
16. `@hasyx/pwa` - PWA support

### Phase 6: Additional Features
17. `@hasyx/schedule` - Scheduling system
18. `@hasyx/logs` - Audit logging
19. `@hasyx/messaging` - Messaging system
20. `@hasyx/groups` - Groups & permissions
21. `@hasyx/validation` - Validation system
22. `@hasyx/events` - Event triggers

### Phase 7: UI & Visualization
23. `@hasyx/cyto` - Graph visualization
24. `@hasyx/constructor` - Visual query builder
25. `@hasyx/wysiwyg` - Rich text editor

### Phase 8: Integration Features
26. `@hasyx/github` - GitHub integration
27. `@hasyx/geo` - Geospatial features
28. `@hasyx/items` - Items system
29. `@hasyx/options` - Options system
30. `@hasyx/invite` - Invite system
31. `@hasyx/brain` - Brain system
32. `@hasyx/i18n` - Internationalization
33. `@hasyx/wstunnel` - WebSocket tunnel
34. `@hasyx/mobile` - Mobile development
35. `@hasyx/config` - Configuration UI

---

## Extraction Considerations

### Cross-Cutting Concerns
- **Testing**: Each package should include its own test files
- **Documentation**: Each package should have its own README.md
- **Types**: TypeScript types should be exported from each package
- **Migrations**: Packages with database schemas should include migration scripts

### Shared Dependencies
- Many packages depend on `@hasyx/hasura` for storage
- Authentication features depend on `@hasyx/auth`
- GraphQL operations depend on `@hasyx/graphql`

### External Dependencies
- Most packages have external npm dependencies that should be specified in their package.json
- Some packages have system-level dependencies (Docker, Nginx, PostgreSQL extensions)

### Configuration
- Each package should support environment-based configuration
- Configuration schema should be exportable for use in parent applications

---

## Conclusion

The Hasyx repository contains **35 distinct feature areas** that could be extracted into independent packages. The features range from core utilities (exec, terminal) to complex systems (AI, payments, infrastructure management).

The modular structure already present in the `lib/` directory makes extraction feasible, though care must be taken with:
1. **Dependency management** - Many features depend on Hasura for storage
2. **Shared types** - TypeScript types used across packages
3. **Configuration** - Environment variables and configuration schemas
4. **Testing** - Ensuring each package has comprehensive tests
5. **Documentation** - Maintaining documentation for each extracted package

This analysis provides a roadmap for gradually extracting features into independent `@hasyx/*` packages while maintaining the ability to use them together as a cohesive framework.

# Contributing

Contributing to Hasyx

We welcome contributions to Hasyx! Please follow these guidelines to help us keep the project consistent and maintainable.

## Development Setup

1.  **Fork & Clone:** Fork the repository on GitHub and clone your fork locally.
2.  **Install Dependencies:** Run `npm install` (or `yarn install` / `pnpm install`) to get all necessary packages.
3.  **Environment:** Copy `.env.example` to `.env` and fill in the required variables for your local Hasura instance, GitHub, etc. (If `.env.example` is not present, refer to `README.md` for necessary environment variables).
4.  **Run Hasyx Init (Optional):** If you are setting up a fresh clone for development *within* the Hasyx project itself, you might want to run `npx tsx lib/cli.ts init` to ensure all local template files are correctly set up. Be cautious if you have made local modifications that you don't want overwritten.

## Debug Information

To see debug information during development and testing, set the DEBUG environment variable:

```bash
# For hasyx projects
DEBUG="hasyx*" npm run your-command
DEBUG="hasyx*" npm test

# For child projects using hasyx
DEBUG="<packagename>*" npm run your-command
DEBUG="<packagename>*" npm test

# Examples
DEBUG="hasyx*" npm run ask -- -e "Calculate 2+2"
DEBUG="hasyx:ai" npm test -- lib/ai.test.ts
DEBUG="hasyx:exec*" npm run js -- -e "console.log('test')"
```

**Available debug namespaces:**
- `hasyx:ai` - AI class operations and code execution
- `hasyx:exec` - JavaScript execution engine
- `hasyx:exec-tsx` - TypeScript execution engine
- `hasyx:openrouter` - OpenRouter API interactions
- `hasyx:hasyx` - Main Hasyx client operations
- `hasyx:generator` - GraphQL query generation
- `hasyx:apollo` - Apollo client operations
- `hasyx:auth` - Authentication and JWT handling
- `hasyx:terminal` - Terminal and CLI operations
- `hasyx:events` - Event triggers and webhook handling
- `hasyx:events-cli` - Event CLI command operations

### Database Debug Logging

For server-side debugging and production monitoring, Hasyx provides database debug logging:

```bash
# Enable database debug logging
HASYX_DEBUG=1
```

**Usage in code:**
```typescript
const adminClient = createApolloClient({
  url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
  secret: process.env.HASURA_ADMIN_SECRET!,
});
const hasyx = new Hasyx(adminClient, Generator(schema));

await hasyx.debug({
  action: 'user_login',
  userId: 'user123',
  timestamp: Date.now(),
  metadata: { ip: '192.168.1.1' }
});
```

## Running Tests

-   `npm test`: Runs all Jest tests.
-   `npm run test:build`: Runs tests specifically for the build process (if configured).

### Test Environment Guidelines

**CRITICAL: Test Isolation and Real Database Testing**

All tests MUST follow these strict guidelines:

1. **No Mocks for Database Operations**: Tests must use real database connections, not mocks.
2. **No `beforeAll` or `beforeEach`**: Each test (`it`) must create its own test environment from scratch and clean up after itself. Prefer `try/finally` inside each `it`.
3. **Unique Test Resources**: Always use unique names (UUIDs) for schemas, tables, and other resources.
4. **Complete Cleanup**: Every test must clean up ALL resources it creates, even if the test fails.

**Test Structure Pattern:**
```typescript
it('should perform specific operation', async () => {
  const testSchema = `test_${uuidv4().replace(/-/g, '_')}`;
  const hasura = new Hasura({ url: process.env.HASURA_URL!, secret: process.env.HASURA_SECRET! });
  
  try {
    await hasura.defineSchema({ schema: testSchema });
    await hasura.defineTable({ schema: testSchema, table: 'test_table' });
    
    const result = await hasura.someOperation();
    expect(result).toBeDefined();
    
  } finally {
    await hasura.deleteSchema({ schema: testSchema });
  }
});
```

## Code Style

-   Please follow the existing code style. ESLint and Prettier should be configured and used.
-   Use TypeScript for all new code in `lib/`, `components/`, `hooks/`, and `app/`.

## ⚠️ CRITICAL: Table Naming in Hasyx

**When working with Hasyx client operations, table names MUST use underscore format, NOT dot notation:**

### ✅ CORRECT - Use underscores:
```typescript
await hasyx.select({ table: "payments_providers", ... });
await hasyx.insert({ table: "users", ... });
```

### ❌ INCORRECT - Do NOT use dots:
```typescript
await hasyx.select({ table: "payments.providers", ... }); // ❌ Wrong!
```

### Schema to Table Name Mapping:
- Database: `payments.providers` → Hasyx: `payments_providers`
- Database: `public.users` → Hasyx: `users`

**This applies to ALL Hasyx client operations:**
- `hasyx.select()`, `hasyx.insert()`, `hasyx.update()`, `hasyx.delete()`
- `hasyx.useSubscription()`, `hasyx.useQuery()`

## Commit Messages

-   Follow conventional commit message format (e.g., `feat: add new feature`, `fix: resolve a bug`).

## Pull Requests

1.  Ensure your code lints and passes all tests.
2.  Update documentation if your changes affect usage, features, or setup.
3.  Create a pull request from your fork to the `main` branch.
4.  Provide a clear and detailed description of your changes in the PR.

## Debugging Data Issues

If you encounter unexpected behavior related to data fetching, mutations, or subscriptions:

*   **Check Hasura Console:** Use the GraphiQL interface in your Hasura console.
*   **Inspect Network Requests:** Use browser developer tools to inspect network requests.
*   **Use `npx hasyx js` for Quick Tests:** For quick tests and debugging:

```bash
# Test database operations directly
npx hasyx js -e "console.log(await client.select({ table: 'users', where: { id: { _eq: 'your-user-id' } }, returning: ['id', 'name', 'email'] }))"

# Execute raw SQL for debugging
npx hasyx js -e "const result = await client.sql('SELECT COUNT(*) as total_users FROM users'); console.log('Total users:', result.result[1][0]);"
```

## Testing Aggregation Features

When working with or testing aggregation functionality in Hasyx:

### Quick Aggregation Tests

```bash
# Test basic aggregation
npx hasyx js -e "
const result = await client.select({
  table: 'users',
  where: { created_at: { _gte: '2024-01-01' } },
  aggregate: { count: true, max: { created_at: true } }
});
console.log('Users aggregate:', JSON.stringify(result, null, 2));
"
```

### Aggregation Testing Guidelines

*   **Always test both top-level and nested aggregations** when adding new aggregate functionality
*   **Verify that aggregate results return actual numbers, not just `__typename`** 
*   **Test aggregation with filtering conditions** (`where` clauses)
*   **Test multiple aggregate functions together** (`count`, `sum`, `avg`, `min`, `max`)

## Writing Database Migrations

When creating or modifying database migration scripts, use the Hasura class from `hasyx/lib/hasura` for consistent and reliable schema management.

### Migration File Structure

Create migration files as TypeScript modules that export `up` and `down` functions:

```typescript
// migrations/001_initial_schema/up.ts
import { Hasura, ColumnType } from 'hasyx/lib/hasura';

export default async function up() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!
  });

  await hasura.defineSchema({ schema: 'public' });
  await hasura.defineTable({ schema: 'public', table: 'users' });
}
```

### Running Migrations with Filters

```bash
# Run all migrations
npx hasyx migrate

# Run only migrations with "users" in directory name
npx hasyx migrate users

# Rollback specific migrations
npx hasyx unmigrate payments
```

### Core Migration Principles

#### 1. **Always Use `define*` Methods for Idempotency**

```typescript
// ✅ GOOD: Idempotent operations
await hasura.defineSchema({ schema: 'analytics' });
await hasura.defineTable({ schema: 'analytics', table: 'events' });

// ❌ AVOID: Will fail if already exists
await hasura.createSchema({ schema: 'analytics' });
```

#### 2. **Use Transactions for Related Operations**

```typescript
export default async function up() {
  const hasura = new Hasura({...});
  
  await hasura.sql('BEGIN');
  try {
    await hasura.defineTable({ schema: 'public', table: 'categories' });
    await hasura.defineTable({ schema: 'public', table: 'products' });
    await hasura.sql('COMMIT');
  } catch (error) {
    await hasura.sql('ROLLBACK');
    throw error;
  }
}
```

## Project Structure Philosophy

This project distinguishes between core library code and application-specific code:

-   **`lib/`**: Contains core, reusable logic intended for broader use, potentially as an importable part of the `hasyx` package (`hasyx/lib/*`). This directory should **not** house project-specific business logic or default configurations that are meant to be overridden by consuming projects. Interfaces and core implementations reside here.

-   **`app/`**: Contains application-level code, configurations, and stubs. Parts of `app/` are often duplicated into downstream projects using `npx hasyx init`. Project configuration is managed via `hasyx.config.json` with `.env` generated by the config tool.

## ⚠️ CRITICAL: API Architecture Principle

**When developing the Hasyx project itself (not child projects), all files in the `app/api/` directory recursively MUST NOT contain direct implementation logic. Instead, they should call implementations declared in the `lib/` directory by importing them from `import ... from 'hasyx/lib/something'`.**

### Why This Matters

This architecture ensures that:
- Child projects can copy the entire `app/` directory and get a working version of the system
- Child projects can extend capabilities by adding their own specific business logic to the pre-declared functionality
- The core Hasyx library remains clean and reusable
- API routes serve as thin wrappers around core library functionality

### Example Implementation

```typescript
// ❌ WRONG - Direct implementation in API route
// app/api/auth/route.ts
export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Direct business logic implementation - DON'T DO THIS
  const user = await db.users.findFirst({ where: { email } });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
  return Response.json({ token });
}

// ✅ CORRECT - API route calls library implementation
// app/api/auth/route.ts
import { authenticateUser } from 'hasyx/lib/auth';

export async function POST(request: Request) {
  try {
    const result = await authenticateUser(request);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 401 });
  }
}
```

### Benefits of This Approach

1. **Reusability**: Core logic can be imported and used in other parts of the system
2. **Testability**: Core functions can be unit tested independently of HTTP layer
3. **Maintainability**: Business logic is centralized in one place
4. **Extensibility**: Child projects can override or extend core functionality
5. **Separation of Concerns**: API routes handle HTTP concerns, library handles business logic

## Specific Guidance for `app/payments/tbank/options.ts`

The file `app/payments/tbank/options.ts` is a prime example of the `app/` philosophy. It's designed to host minimal, overridable business logic, such as the TBank receipt generator.

### `generateReceipt` Function Stub

When providing a `generateReceipt` function (or similar customizable logic) in `app/payments/tbank/options.ts`:

1.  **Keep it Minimal**: The function should be as concise as possible, acting as a clear extension point.
2.  **Clear I/O Comment**: Include a brief comment (3-5 lines max) specifying the expected input arguments and the structure of the returned object.
3.  **File Conciseness**: The entire `app/payments/tbank/options.ts` file should ideally be less than 10-15 lines, focusing solely on providing these minimal, clearly documented stubs.

**Example for `generateReceipt` in `app/payments/tbank/options.ts`:**

```typescript
// Args: { items: TBankReceiptItem[], paymentDetails: any, operationType: 'payment' | 'refund' }
// Returns: TBankReceipt object or null
export function defaultGenerateReceipt(args, operationType) {
  // Minimal placeholder logic or project-specific implementation
  console.warn('Placeholder: defaultGenerateReceipt in app/payments/tbank/options.ts needs implementation.');
  return null;
}

export const tbankAppOptions = {
  generateReceipt: defaultGenerateReceipt,
  // Other app-specific TBank configurations
};
```

## DNS and SSL Management

Hasyx includes comprehensive DNS and SSL management modules for automated subdomain creation with HTTPS setup:

### Quick Setup

Configure `dns` and `cloudflare` in `hasyx.config.json`, then regenerate `.env`:

```typescript
// Environment variables (configured via hasyx.config.json)
HASYX_DNS_DOMAIN=yourdomain.com
CLOUDFLARE_API_TOKEN=your_token_here
CLOUDFLARE_ZONE_ID=your_zone_id_here  
LETSENCRYPT_EMAIL=admin@yourdomain.com

// Usage example
import { SubdomainManager } from 'hasyx';

const subdomainManager = new SubdomainManager({
  domain: process.env.HASYX_DNS_DOMAIN!,
  cloudflare: {
    apiToken: process.env.CLOUDFLARE_API_TOKEN!,
    zoneId: process.env.CLOUDFLARE_ZONE_ID!,
    domain: process.env.HASYX_DNS_DOMAIN!
  },
  ssl: { email: process.env.LETSENCRYPT_EMAIL! },
  defaultIp: '149.102.136.233'
});

// Create complete HTTPS subdomain in one command
await subdomainManager.define('app', { port: 3000 });
```

### Testing Philosophy
DNS/SSL modules follow the project's real functionality testing approach:
- **No Mocks**: All tests use real services (CloudFlare API, certbot, nginx)
- **Environment Checks**: Tests gracefully skip when required tools/credentials are unavailable
- **Isolation**: Each test creates and cleans up its own test environment

For detailed documentation, see [`CLOUDFLARE.md`](CLOUDFLARE.md), [`SSL.md`](SSL.md), [`NGINX.md`](NGINX.md), and [`SUBDOMAIN.md`](SUBDOMAIN.md). 

## Testing

### Adding Tests for New Features (e.g., Database Operators)

When adding support for new database features, data types, or specific operators (e.g., JSONB operators), it is crucial to provide comprehensive testing and documentation.

1.  **Unit Tests (`generator.test.ts`):
    *   Add specific unit tests to `generator.test.ts` to verify that the query generator (`lib/generator.ts`) correctly produces the expected GraphQL query strings and variables for the new feature.
    *   These tests should cover various use cases and edge cases for the operator(s) or data type(s) in question.
    *   Ensure these tests are based on the `hasura-schema.json` and that expected types (e.g., `jsonb_comparison_exp`) are correctly referenced.

2.  **Integration Tests (`hasyx.test.ts`):
    *   Add integration tests to `hasyx.test.ts` to validate the end-to-end functionality with a live Hasura instance.
    *   These tests should use the `Hasyx` class methods (e.g., `hasyx.select()`, `hasyx.insert()`) to interact with the database.
    *   If applicable, create temporary test data within a `beforeAll` or `beforeEach` block and clean it up in an `afterAll` or `afterEach` block.
    *   For example, when testing JSONB operators, the integration tests for `hasyx.select` should target a table with a JSONB column (like the `debug` table) and verify that the operators (`_contains`, `_has_key`, etc.) filter data as expected.

3.  **Documentation (`GENERATOR.md`, `HASYX.md`, etc.):
    *   Document the new feature in `GENERATOR.md`, explaining how to use the relevant options in `GenerateOptions` to utilize the feature.
    *   Provide clear examples in `HASYX.md` showing how to use the feature with both the `Hasyx` class methods and the React hooks (`useQuery`, `useSelect`, etc.).
    *   All examples in documentation must be based on successfully tested scenarios.

4.  **Debugging Aids:
    *   Utilize the existing `debug` utility (e.g., `DEBUG="hasyx*" npm test ...`) to trace execution flow during testing and development.
    *   If adding new complex logic, consider adding relevant debug statements to aid in future troubleshooting.

By following these steps, we ensure that new Hasyx features are robust, well-documented, and maintainable.

Thank you for contributing! 
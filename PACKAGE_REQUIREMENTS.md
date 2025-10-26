# Requirements and Rules for Separated @hasyx Packages

## Overview

This document defines the strict requirements and rules that EVERY separated `@hasyx/<feature>` package MUST follow to ensure consistency, quality, and compatibility across the Hasyx ecosystem.

## 1. Naming Requirements

### Package Names
- **NPM Package**: MUST be named `@hasyx/<feature>` (lowercase, hyphenated if needed)
- **GitHub Repository**: MUST be named `hasyx/<feature>` (matching npm package name without @)
- **Main Export**: MUST export a primary class or object matching the feature name

**Examples**:
```
Feature: AI
- NPM: @hasyx/ai
- GitHub: hasyx/ai
- Main Export: class AI or export const ai

Feature: Auth
- NPM: @hasyx/auth
- GitHub: hasyx/auth
- Main Export: class Auth or export const auth
```

### File Naming
- Use kebab-case for file names: `my-feature.ts`
- Use PascalCase for class files: `MyClass.ts` (if class is the primary export)
- Test files: `<feature>.test.ts` or `<feature>.spec.ts`

## 2. Repository Structure Requirements

Every package repository MUST have this structure:

```
@hasyx/<feature>/
├── src/                      # REQUIRED: Source code
│   ├── index.ts             # REQUIRED: Main export file
│   ├── *.ts                 # Feature implementation
│   └── *.test.ts            # Test files
├── dist/                     # GENERATED: Build output (gitignored)
│   ├── index.js
│   ├── index.d.ts
│   └── ...
├── docs/                     # OPTIONAL: Additional documentation
│   └── api.md
├── examples/                 # RECOMMENDED: Usage examples
│   ├── basic.ts
│   └── advanced.ts
├── migrations/               # REQUIRED for DB features: Migration scripts
│   ├── up.ts
│   └── down.ts
├── package.json             # REQUIRED: Package configuration
├── tsconfig.json            # REQUIRED: TypeScript configuration
├── jest.config.js           # REQUIRED: Test configuration
├── .gitignore               # REQUIRED: Git ignore rules
├── .npmignore               # REQUIRED: NPM ignore rules
├── README.md                # REQUIRED: Package documentation
├── CHANGELOG.md             # REQUIRED: Version history
├── LICENSE                  # REQUIRED: MIT License
└── .github/                 # REQUIRED: GitHub configuration
    └── workflows/
        └── ci.yml           # REQUIRED: CI/CD pipeline
```

## 3. Package.json Requirements

Every package.json MUST include these fields:

### Required Fields

```json
{
  "name": "@hasyx/<feature>",
  "version": "0.1.0",
  "description": "Clear one-line description of the feature",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE",
    "CHANGELOG.md"
  ],
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "clean": "rm -rf dist",
    "prepublishOnly": "npm run clean && npm run build && npm test"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/hasyx/<feature>.git"
  },
  "bugs": {
    "url": "https://github.com/hasyx/<feature>/issues"
  },
  "homepage": "https://github.com/hasyx/<feature>#readme",
  "keywords": ["hasyx", "<feature>", "..."],
  "author": "Hasyx Contributors",
  "license": "MIT",
  "engines": {
    "node": "^22.14"
  }
}
```

### Dependency Management Rules

#### peerDependencies
- **MUST** list `hasyx` if the package is designed to integrate with main framework
- **MUST** list other `@hasyx/*` packages that users need to install separately
- **MUST NOT** include packages that are only used internally

Example for `@hasyx/auth`:
```json
{
  "peerDependencies": {
    "hasyx": "^0.2.0"
  }
}
```

#### dependencies
- **MUST** include all npm packages directly used by the feature
- **MUST** include other `@hasyx/*` packages that are hard requirements
- **MUST** use exact or caret versions for stability
- **MUST NOT** include hasyx main package (use peerDependencies)

Example for `@hasyx/auth`:
```json
{
  "dependencies": {
    "@hasyx/hasura": "^0.1.0",
    "next-auth": "4.24.11",
    "bcrypt": "5.1.1",
    "jsonwebtoken": "9.0.2"
  }
}
```

#### devDependencies
- **MUST** include `hasyx` for building demo pages and integration tests
- **MUST** include TypeScript, testing tools, and linters
- **SHOULD** include other dev tools needed for development

Example:
```json
{
  "devDependencies": {
    "hasyx": "*",
    "typescript": "5",
    "jest": "30.0.0-alpha.6",
    "@types/jest": "29.5.12",
    "@types/node": "20.17.30",
    "eslint": "^8.0.0",
    "prettier": "3.5.3"
  }
}
```

## 4. TypeScript Configuration Requirements

Every package MUST have a `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

**Requirements**:
- MUST enable `strict` mode
- MUST generate declaration files (`declaration: true`)
- MUST exclude test files from build
- MUST target ES2022 or later

## 5. Testing Requirements

### Test Framework
- **MUST** use Jest for testing
- **MUST** follow hasyx testing philosophy (no mocks for real functionality)

### Jest Configuration

Every package MUST have `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Test Requirements

Every package MUST:

1. **Have comprehensive tests** covering:
   - All public APIs
   - Error handling
   - Edge cases
   - Integration with dependencies

2. **Follow test isolation principles**:
   ```typescript
   it('should perform operation', async () => {
     const testId = `test_${uuidv4().replace(/-/g, '_')}`;
     // Create test resources

     try {
       // Test logic
       expect(result).toBeDefined();
     } finally {
       // ALWAYS clean up
       await cleanup();
     }
   });
   ```

3. **No beforeAll/beforeEach hooks** - Create test environment in each test
4. **Use real services** - No mocks for database operations
5. **Unique resource names** - Use UUIDs for test resources
6. **Complete cleanup** - Clean up in finally blocks

### Test Coverage
- **MUST** maintain >80% code coverage
- **MUST** test all public APIs
- **SHOULD** aim for >90% coverage for critical packages (auth, hasura, payments)

## 6. Documentation Requirements

### README.md Structure

Every package MUST have a README.md with:

```markdown
# @hasyx/<feature>

Brief one-line description

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\`\`\`bash
npm install @hasyx/<feature>
\`\`\`

### Peer Dependencies

If your package requires other packages:

\`\`\`bash
npm install hasyx @hasyx/other-package
\`\`\`

## Quick Start

\`\`\`typescript
import { Feature } from '@hasyx/<feature>';

const feature = new Feature({
  // configuration
});

await feature.someMethod();
\`\`\`

## API Reference

### Class: Feature

Description of main class

#### Constructor

\`\`\`typescript
new Feature(options: FeatureOptions)
\`\`\`

#### Methods

##### someMethod()

Description and example

## Configuration

Details about configuration options

## Environment Variables

List of required environment variables

## Migration from hasyx

How to migrate from \`import { Feature } from 'hasyx'\` to \`import { Feature } from '@hasyx/<feature>'\`

## Examples

Link to examples directory

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT - see [LICENSE](LICENSE)

## Related Packages

- [@hasyx/other-package](https://github.com/hasyx/other-package) - Description
```

### API Documentation

All public APIs MUST have:

1. **JSDoc comments**:
   ```typescript
   /**
    * Description of the function
    *
    * @param param1 - Description of param1
    * @param param2 - Description of param2
    * @returns Description of return value
    * @throws {ErrorType} Description of when error is thrown
    *
    * @example
    * ```typescript
    * const result = await feature.method(param1, param2);
    * ```
    */
   public async method(param1: string, param2: number): Promise<Result> {
     // Implementation
   }
   ```

2. **TypeScript types** for all parameters and returns
3. **Examples** in JSDoc comments
4. **Error documentation** for thrown errors

### CHANGELOG.md

Every package MUST maintain a changelog following [Keep a Changelog](https://keepachangelog.com/):

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security fixes

## [0.1.0] - 2025-01-01

### Added
- Initial release
- Feature 1
- Feature 2
```

## 7. CI/CD Requirements

Every package MUST have GitHub Actions workflow (`.github/workflows/ci.yml`):

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [22.x]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Test coverage
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json

  publish:
    needs: test
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/v')

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 22.x
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Publish to npm
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Requirements**:
- MUST run on every push and PR
- MUST run linter, tests, and build
- MUST check test coverage
- MUST publish on version tags (v*)
- SHOULD upload coverage to codecov

## 8. Import/Export Requirements

### Main Export File (src/index.ts)

Every package MUST have a clear main export:

```typescript
// Export main class or function
export { Feature } from './feature';

// Export types
export type { FeatureOptions, FeatureResult } from './types';

// Export utilities if needed
export { helperFunction } from './helpers';

// Re-export dependencies if needed
export { SomeDependency } from '@hasyx/other-package';
```

**Rules**:
- MUST export at least one primary feature
- MUST export all TypeScript types used in public APIs
- SHOULD re-export commonly used dependencies
- MUST NOT export internal implementation details

### Import Paths

Packages MUST support both import styles:

#### Direct Import (Recommended)
```typescript
import { Feature } from '@hasyx/<feature>';
```

#### Re-export from Main Package (Backward Compatibility)
```typescript
import { Feature } from 'hasyx';
```

The main `hasyx` package will re-export all features for backward compatibility.

## 9. Dependency Requirements

### Circular Dependencies
- **MUST NOT** create circular dependencies between packages
- Each package MUST be able to function independently
- Dependencies MUST form a directed acyclic graph (DAG)

### Dependency Graph Rules

Valid dependency chains:
```
@hasyx/feature → @hasyx/hasura → (no hasyx deps)
@hasyx/auth → @hasyx/hasura → (no hasyx deps)
@hasyx/ai → @hasyx/exec → (no hasyx deps)
```

Invalid (circular):
```
@hasyx/package-a → @hasyx/package-b → @hasyx/package-a ❌
```

### Version Compatibility

Packages MUST:
- Use semver for versioning
- Specify compatible version ranges in dependencies
- Document breaking changes in CHANGELOG.md
- Update major version for breaking changes

## 10. Migration Requirements

### For Database Features

Packages with database schemas MUST include:

1. **Migration Scripts**:
   ```typescript
   // migrations/up.ts
   import { Hasura } from '@hasyx/hasura';

   export default async function up() {
     const hasura = new Hasura({
       url: process.env.HASURA_URL!,
       secret: process.env.HASURA_SECRET!
     });

     await hasura.defineSchema({ schema: 'feature' });
     await hasura.defineTable({
       schema: 'feature',
       table: 'items'
     });
   }
   ```

2. **Rollback Scripts**:
   ```typescript
   // migrations/down.ts
   export default async function down() {
     // Rollback logic
   }
   ```

3. **Migration Documentation** in README explaining:
   - How to run migrations
   - Required environment variables
   - Schema structure
   - Migration order (if multiple)

### Breaking Changes

When introducing breaking changes:
1. MUST bump major version
2. MUST document in CHANGELOG.md
3. MUST provide migration guide
4. SHOULD provide deprecation warnings before removal

## 11. Code Quality Requirements

### Linting

Every package MUST use ESLint:

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

**Rules**:
- MUST pass linting before merge
- MUST NOT use `any` type (use `unknown` if needed)
- MUST handle unused variables
- SHOULD have explicit return types

### Code Style

- MUST use Prettier for formatting
- MUST follow existing hasyx code style
- SHOULD use 2-space indentation
- SHOULD use single quotes for strings

## 12. Security Requirements

Every package MUST:

1. **Not include secrets** in code or repository
2. **Use environment variables** for sensitive configuration
3. **Validate all inputs** to prevent injection attacks
4. **Handle errors securely** without leaking sensitive information
5. **Keep dependencies updated** to patch security vulnerabilities
6. **Document security considerations** in README

## 13. Licensing Requirements

Every package MUST:

1. Include MIT License file
2. Include copyright notice: "Copyright (c) [Year] Hasyx Contributors"
3. Not include incompatible licenses
4. Document third-party licenses if applicable

## 14. Publishing Requirements

Before publishing to npm:

1. **MUST** run all tests successfully
2. **MUST** pass linting
3. **MUST** build successfully
4. **MUST** have version bumped appropriately
5. **MUST** have CHANGELOG.md updated
6. **MUST** have clean git working directory
7. **SHOULD** have reviewed code changes

### Publishing Checklist

```bash
# 1. Run tests
npm test

# 2. Run linter
npm run lint

# 3. Build package
npm run build

# 4. Check package contents
npm pack --dry-run

# 5. Bump version
npm version patch|minor|major

# 6. Update CHANGELOG.md
# Edit manually

# 7. Commit changes
git add .
git commit -m "Release v0.1.1"

# 8. Create tag
git tag v0.1.1

# 9. Push
git push && git push --tags

# 10. Publish (automated by CI/CD on tag push)
# Or manually: npm publish --access public
```

## 15. Examples Requirements

Every package SHOULD include:

1. **Basic Example** (`examples/basic.ts`):
   ```typescript
   import { Feature } from '@hasyx/<feature>';

   async function main() {
     const feature = new Feature({
       // Basic configuration
     });

     const result = await feature.someMethod();
     console.log(result);
   }

   main().catch(console.error);
   ```

2. **Advanced Examples** showing:
   - Complex configurations
   - Integration with other packages
   - Error handling
   - Best practices

3. **Demo Page** (optional but recommended):
   - Interactive demonstration
   - Visual examples
   - Built using hasyx framework

## 16. Monitoring and Maintenance

Every package SHOULD:

1. **Monitor npm downloads** to understand usage
2. **Track GitHub issues** for bug reports and feature requests
3. **Review pull requests** promptly
4. **Update dependencies** regularly
5. **Respond to security advisories** immediately
6. **Maintain compatibility** with latest hasyx version

## 17. Community and Support

Every package MUST:

1. Have clear **contribution guidelines**
2. Have issue templates for:
   - Bug reports
   - Feature requests
   - Questions
3. Have pull request template
4. Welcome community contributions
5. Provide support through GitHub issues

## Summary Checklist

Before considering a package "complete":

- [ ] Repository structure matches requirements
- [ ] package.json includes all required fields
- [ ] TypeScript configuration is correct
- [ ] Tests exist and pass with >80% coverage
- [ ] README.md is comprehensive
- [ ] CHANGELOG.md is initialized
- [ ] LICENSE file exists
- [ ] CI/CD pipeline is configured
- [ ] Main export file is clear
- [ ] No circular dependencies
- [ ] Code passes linting
- [ ] Security considerations documented
- [ ] Examples provided
- [ ] Published to npm
- [ ] Re-exported from main hasyx package

## References

- **Separation Plan**: `SEPARATION_PLAN.md`
- **Feature Analysis**: `FEATURE_EXTRACTION_ANALYSIS.md`
- **Contributing**: `CONTRIBUTING.md` (from main hasyx repo)
- **Issue #10**: https://github.com/ivansglazunov/hasyx/issues/10

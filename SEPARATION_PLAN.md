# Hasyx Feature Separation Plan

## Overview

This document provides a comprehensive plan for separating Hasyx framework features into independent `@hasyx/*` packages while maintaining backward compatibility and ensuring all packages can work together seamlessly.

## Objectives

1. **Modularity**: Extract 35+ distinct features into independent npm packages
2. **Backward Compatibility**: Ensure the main `hasyx` package continues to work as before
3. **Independent Use**: Allow developers to install and use individual features without the full framework
4. **Maintainability**: Improve code organization and reduce coupling between features
5. **Testing**: Ensure each package has comprehensive tests
6. **Documentation**: Provide clear documentation for each package

## Organization Structure

### Create @hasyx GitHub Organization

Before starting the separation, we need to:

1. **Create GitHub Organization**: `@hasyx`
   - Organization name: `hasyx`
   - Owner: Repository maintainers
   - Visibility: Public

2. **Organization Repository Naming**:
   - Format: `@hasyx/<feature-name>`
   - Examples: `@hasyx/ai`, `@hasyx/auth`, `@hasyx/hasura`

3. **Organization Settings**:
   - Enable GitHub Actions for CI/CD
   - Set up npm organization for package publishing
   - Configure access controls and team permissions

## Package Structure Requirements

Each separated package must follow these requirements:

### 1. Package Naming Convention

- NPM package name: `@hasyx/<feature>`
- GitHub repository: `hasyx/<feature>`
- Examples:
  - `@hasyx/ai` → `hasyx/ai`
  - `@hasyx/auth` → `hasyx/auth`
  - `@hasyx/hasura` → `hasyx/hasura`

### 2. Directory Structure

```
@hasyx/<feature>/
├── src/                    # Source code (migrated from hasyx/lib/<feature>/)
│   ├── index.ts           # Main export file
│   ├── *.ts               # Feature implementation files
│   └── *.test.ts          # Test files
├── docs/                   # Documentation
│   └── README.md          # Feature-specific docs (migrated from hasyx/<FEATURE>.md)
├── examples/              # Usage examples
│   └── basic.ts           # Basic usage example
├── migrations/            # Database migrations (if applicable)
│   ├── up.ts
│   └── down.ts
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
├── jest.config.js         # Jest configuration
├── .gitignore            # Git ignore rules
├── .npmignore            # NPM ignore rules
├── README.md             # Package overview
├── CHANGELOG.md          # Version history
└── LICENSE               # MIT License
```

### 3. Package.json Requirements

Each package must include:

```json
{
  "name": "@hasyx/<feature>",
  "version": "0.1.0",
  "description": "Brief description of the feature",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/",
    "prepublishOnly": "npm run build && npm test"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/hasyx/<feature>.git"
  },
  "keywords": ["hasyx", "<feature>", "..."],
  "author": "Hasyx Contributors",
  "license": "MIT",
  "peerDependencies": {
    // Required by parent applications
  },
  "dependencies": {
    // Required dependencies from hasyx
  },
  "devDependencies": {
    "hasyx": "*",  // For demo page building and testing
    // Development tools
  }
}
```

### 4. Dependency Management

#### peerDependencies
- List `hasyx` as a peerDependency for packages that need to integrate with the main framework
- This allows users to install the separated package without installing the full framework if they don't need it

#### dependencies
- Move feature-specific dependencies from main `hasyx` package to the separated package
- Include only the dependencies directly used by the feature

#### devDependencies
- Add `hasyx` as a devDependency for building demo pages and integration tests
- Include testing and build tools

### 5. Import Paths

After separation, imports should work in two ways:

#### Option 1: Direct package import (recommended for new projects)
```typescript
import { AI } from '@hasyx/ai';
import { Auth } from '@hasyx/auth';
import { Hasura } from '@hasyx/hasura';
```

#### Option 2: Re-exported from main hasyx package (backward compatibility)
```typescript
import { AI, Auth, Hasura } from 'hasyx';
```

### 6. Testing Requirements

Each package must:

1. **Include comprehensive tests**:
   - Unit tests for core functionality
   - Integration tests with dependencies
   - Follow existing test patterns from `hasyx`

2. **Test isolation**:
   - Tests must create their own test environment
   - Use unique resource names (UUIDs)
   - Clean up all resources in `finally` blocks
   - No `beforeAll` or `beforeEach` hooks

3. **Test coverage**:
   - Aim for >80% code coverage
   - Test all public APIs
   - Test error handling

### 7. Documentation Requirements

Each package must include:

1. **README.md** with:
   - Overview of the feature
   - Installation instructions
   - Basic usage examples
   - API reference
   - Configuration options
   - Migration guide (if applicable)

2. **API Documentation**:
   - JSDoc comments for all public APIs
   - TypeScript type definitions
   - Examples in documentation

3. **Migration from hasyx**:
   - Clear instructions for migrating from `hasyx` imports to `@hasyx/<feature>` imports
   - Breaking changes (if any)
   - Compatibility notes

## Migration Strategy

### Phase 1: Core Utilities (No dependencies)

**Packages**: `@hasyx/exec`, `@hasyx/terminal`, `@hasyx/hid`, `@hasyx/url`, `@hasyx/email`

**Steps**:
1. Create GitHub repositories for each package
2. Extract code from `hasyx/lib/<feature>` to `@hasyx/<feature>/src`
3. Move tests and documentation
4. Configure package.json with dependencies
5. Set up CI/CD pipelines
6. Publish to npm
7. Update main `hasyx` package to re-export from `@hasyx/<feature>`
8. Test backward compatibility

**Benefits**:
- No complex dependencies
- Easy to test independently
- Can be used without hasyx framework

### Phase 2: Database & GraphQL

**Packages**: `@hasyx/hasura`, `@hasyx/graphql`

**Steps**:
1. Extract `@hasyx/hasura` first (no dependencies on other hasyx packages)
2. Extract `@hasyx/graphql` (can be standalone but works well with hasura)
3. Update migration scripts
4. Test schema management and query generation
5. Publish packages
6. Update main `hasyx` to re-export

**Considerations**:
- Many other packages depend on these
- Critical for backward compatibility
- Must maintain API compatibility

### Phase 3: Authentication

**Package**: `@hasyx/auth`

**Dependencies**: `@hasyx/hasura` (for user storage)

**Steps**:
1. Extract auth code to `@hasyx/auth`
2. Add `@hasyx/hasura` as dependency
3. Test all authentication flows
4. Verify NextAuth.js integration
5. Publish package
6. Update main `hasyx` to re-export

### Phase 4-8: Feature Packages

Follow similar process for remaining packages based on the extraction priority defined in `FEATURE_EXTRACTION_ANALYSIS.md`.

For each package:
1. Create repository
2. Extract code
3. Configure dependencies
4. Write/migrate tests
5. Write documentation
6. Set up CI/CD
7. Publish to npm
8. Update main `hasyx` package

## Main Hasyx Package Updates

After separating features, the main `hasyx` package will:

1. **Re-export all packages**:
```typescript
// hasyx/lib/index.ts
export * from '@hasyx/ai';
export * from '@hasyx/auth';
export * from '@hasyx/hasura';
// ... all other packages
```

2. **Update package.json dependencies**:
```json
{
  "name": "hasyx",
  "dependencies": {
    "@hasyx/ai": "^0.1.0",
    "@hasyx/auth": "^0.1.0",
    "@hasyx/hasura": "^0.1.0",
    // ... all other @hasyx packages
  }
}
```

3. **Maintain backward compatibility**:
   - All existing imports continue to work
   - No breaking changes for existing users
   - Users can gradually migrate to direct package imports

## Testing Strategy

### 1. Package-Level Tests

Each package includes:
- Unit tests for core functionality
- Integration tests with dependencies
- Mock-free database testing (following CONTRIBUTING.md guidelines)

### 2. Integration Tests in Main Hasyx Package

Test that:
- All packages work together
- Re-exports function correctly
- No circular dependencies
- Version compatibility

### 3. Backward Compatibility Tests

Verify that:
- Existing code using `import { X } from 'hasyx'` continues to work
- All APIs remain unchanged
- No breaking changes

### 4. CI/CD Pipeline

Each package repository:
1. Runs tests on every commit
2. Runs tests on every PR
3. Publishes to npm on release tags
4. Generates documentation
5. Reports test coverage

Main hasyx repository:
1. Tests all packages together
2. Verifies backward compatibility
3. Publishes main package on release

## Version Management

### Semantic Versioning

All packages follow semver:
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes

### Version Coordination

1. **Independent versioning**: Each package has its own version
2. **Main package**: Main `hasyx` package versions track the ecosystem
3. **Compatibility matrix**: Document which versions work together

### Initial Versions

- All separated packages start at `0.1.0`
- Main `hasyx` package bumps minor version when packages are integrated

## Demo Pages and Examples

Each package should include:

1. **Basic example** in `examples/basic.ts`
2. **Advanced examples** for complex features
3. **Demo page** that can be built with `hasyx` (using devDependencies)

Demo pages help:
- Show package capabilities
- Serve as integration tests
- Provide copy-paste examples for users

## Migration Timeline

### Immediate (Week 1-2)
- Create @hasyx organization
- Set up repository templates
- Define CI/CD pipelines
- Create documentation templates

### Short-term (Week 3-6)
- **Phase 1**: Extract core utilities
- **Phase 2**: Extract database & GraphQL
- **Phase 3**: Extract authentication
- Test and publish initial packages

### Medium-term (Week 7-12)
- **Phase 4**: Extract high-value features (AI, Telegram, Payments, Notify, Files)
- **Phase 5**: Extract infrastructure (Infra, Docker, PWA)
- Update main hasyx package

### Long-term (Week 13+)
- **Phase 6-8**: Extract remaining features
- Complete documentation
- Community feedback and iteration
- Stabilize APIs

## Success Criteria

The separation is successful when:

1. ✅ All 35 features are extracted to independent packages
2. ✅ All packages are published to npm under `@hasyx/*` scope
3. ✅ Main `hasyx` package maintains 100% backward compatibility
4. ✅ Each package has >80% test coverage
5. ✅ Each package has comprehensive documentation
6. ✅ All packages pass CI/CD checks
7. ✅ Demo pages work for all packages
8. ✅ Users can install packages independently
9. ✅ No circular dependencies between packages
10. ✅ Clear dependency graph is documented

## Risk Mitigation

### Potential Risks

1. **Breaking backward compatibility**
   - Mitigation: Extensive testing, gradual rollout, semver

2. **Circular dependencies**
   - Mitigation: Clear dependency graph, careful package design

3. **Version conflicts**
   - Mitigation: Peer dependencies, compatibility matrix

4. **Incomplete extraction**
   - Mitigation: Thorough code analysis, comprehensive testing

5. **Documentation drift**
   - Mitigation: Automated doc generation, clear ownership

### Rollback Plan

If issues arise:
1. Keep original `hasyx` package as fallback
2. Packages can be deprecated if problematic
3. Users not affected until they choose to migrate
4. Gradual adoption allows for course correction

## Community Involvement

1. **Open source contribution**:
   - Clear contribution guidelines for each package
   - Issue templates for bug reports and features
   - PR templates for code contributions

2. **Package ownership**:
   - Core team maintains critical packages (hasura, graphql, auth)
   - Community can maintain specialized packages
   - Clear CODEOWNERS files

3. **Feedback channels**:
   - GitHub Discussions for each package
   - Main repository for cross-package discussions
   - Regular community updates

## Next Steps

1. **Create this plan document** ✅
2. **Get approval from repository owner** - Create issue comment or discussion
3. **Create @hasyx organization** - Once approved
4. **Start Phase 1 extraction** - Begin with core utilities
5. **Iterate and improve** - Based on experience and feedback

## References

- **Feature Extraction Analysis**: `FEATURE_EXTRACTION_ANALYSIS.md`
- **Contributing Guidelines**: `CONTRIBUTING.md`
- **Main README**: `README.md`
- **Issue #10**: https://github.com/ivansglazunov/hasyx/issues/10

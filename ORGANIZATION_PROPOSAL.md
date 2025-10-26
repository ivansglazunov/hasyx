# @hasyx Organization Proposal

## Overview

This document proposes the creation of a `@hasyx` GitHub Organization to house all separated packages from the monolithic `hasyx` framework. This organization will serve as the central hub for the Hasyx ecosystem.

## Rationale

### Why Create an Organization?

1. **Clear Namespace**: Provides a clear namespace for all Hasyx-related packages under `@hasyx/*`
2. **Independent Repositories**: Each feature gets its own repository with independent versioning
3. **Team Management**: Easier to manage contributors and permissions across multiple packages
4. **Professional Structure**: Demonstrates maturity and serious commitment to the ecosystem
5. **Discoverability**: Makes it easier for users to discover related packages
6. **Scalability**: Allows the ecosystem to grow without cluttering the main repository

### Benefits

**For Maintainers**:
- Distributed ownership and maintenance responsibilities
- Easier to onboard contributors to specific packages
- Independent release cycles for each package
- Better issue tracking per feature
- Clearer code ownership

**For Users**:
- Install only what they need
- Smaller bundle sizes
- Easier to understand feature boundaries
- Better documentation per feature
- Independent versioning reduces breaking changes

**For Contributors**:
- Easier to find relevant code
- Smaller codebases to understand
- Feature-specific contribution
- Clear ownership and review process

## Organization Details

### Basic Information

- **Organization Name**: `hasyx`
- **GitHub URL**: `https://github.com/hasyx`
- **NPM Scope**: `@hasyx`
- **Website**: `https://hasyx.vercel.app` (existing)
- **Description**: "Modern full-stack framework with real-time GraphQL, AI integration, and seamless development experience"

### Organization Settings

#### Repository Naming Convention
- Format: `hasyx/<feature-name>`
- Examples:
  - `hasyx/ai` → `@hasyx/ai` on npm
  - `hasyx/auth` → `@hasyx/auth` on npm
  - `hasyx/hasura` → `@hasyx/hasura` on npm

#### Visibility
- **Public** - All repositories should be public
- Open source under MIT license
- Community contributions welcome

#### Features to Enable
- ✅ GitHub Actions
- ✅ GitHub Discussions
- ✅ GitHub Issues
- ✅ GitHub Projects
- ✅ GitHub Packages (npm registry)
- ✅ GitHub Pages (for documentation)
- ✅ Branch protection rules
- ✅ Required status checks

## Team Structure

### Proposed Teams

#### 1. Core Team
**Responsibilities**:
- Strategic direction
- Architecture decisions
- Breaking changes approval
- Release coordination
- Security responses

**Permissions**: Admin on all repositories

**Members**: Current `hasyx` maintainers

#### 2. Maintainers
**Responsibilities**:
- Day-to-day maintenance
- PR reviews
- Issue triage
- Release management for specific packages
- Documentation updates

**Permissions**: Maintain on assigned repositories

**Members**: Active contributors who demonstrate commitment

#### 3. Contributors
**Responsibilities**:
- Submit PRs
- Report issues
- Improve documentation
- Help other users

**Permissions**: Triage on repositories they contribute to

**Members**: Community contributors

### Access Control

**Repository Permissions**:
```
Core Team:     Admin (all repos)
Maintainers:   Maintain (assigned repos)
Contributors:  Triage (contributed repos)
Public:        Read (all repos)
```

**Special Repositories**:
- `.github` repository: Admin only (org-wide configs)
- `hasyx` (main): Core team only initially
- Security-critical packages (auth, payments): Core team + selected maintainers

## Repository Management

### Repository Template

Create a template repository (`hasyx/.github-template`) with:
- Standard directory structure
- CI/CD workflows
- Issue templates
- PR templates
- Contributing guidelines
- Code of conduct
- License file

### Required Files in Each Repository

1. **README.md** - Package documentation
2. **CONTRIBUTING.md** - Contribution guidelines
3. **LICENSE** - MIT License
4. **CHANGELOG.md** - Version history
5. **CODE_OF_CONDUCT.md** - Community standards
6. **.github/workflows/ci.yml** - CI/CD pipeline
7. **.github/ISSUE_TEMPLATE/** - Issue templates
8. **.github/PULL_REQUEST_TEMPLATE.md** - PR template
9. **SECURITY.md** - Security policy

### Branch Protection Rules

For all repositories:
- ✅ Require PR before merging
- ✅ Require at least 1 approval
- ✅ Require status checks to pass
- ✅ Require up-to-date branches
- ✅ Require linear history
- ✅ No force push
- ✅ No deletion

## NPM Organization

### Setup

1. **Create NPM Organization**: `@hasyx`
2. **Transfer Ownership**: Transfer to organization
3. **Team Configuration**:
   - Publishers: Core team + package maintainers
   - Developers: Can publish pre-release versions
   - Members: Can view private packages (if any)

### Publishing Policy

#### Version Management
- Follow semantic versioning (semver)
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes

#### Release Process
1. Create PR with changes
2. Update CHANGELOG.md
3. Get approval from maintainers
4. Merge to main
5. Tag release (e.g., `v0.1.0`)
6. CI/CD automatically publishes to npm
7. Create GitHub release with notes

#### Access Control
- **Owners**: Core team (can publish any version)
- **Maintainers**: Can publish patches and minor versions for assigned packages
- **CI/CD**: Automated publishing on tagged releases

### Package Naming Rules

All packages MUST:
- Start with `@hasyx/` scope
- Use lowercase
- Use hyphens for multi-word names
- Match GitHub repository name

Examples:
```
✅ @hasyx/ai
✅ @hasyx/auth
✅ @hasyx/graphql-proxy
❌ @hasyx/GraphQL (uppercase)
❌ @hasyx/ai_core (underscore)
```

## Documentation

### Organization Documentation

Create `hasyx/.github` repository with:
- Organization profile README
- Contributing guidelines for the ecosystem
- Code of conduct
- Security policy
- Support resources
- Package list and overview

### Package Documentation

Each package maintains its own:
- README.md - Package-specific docs
- API documentation - Generated from JSDoc
- Examples - Usage examples
- Migration guides - From hasyx main package

### Central Documentation Hub

Use GitHub Pages or dedicated site:
- **Landing Page**: Overview of the ecosystem
- **Package Catalog**: List all packages with descriptions
- **Getting Started**: Quick start guides
- **Tutorials**: Step-by-step guides
- **API Reference**: Generated API docs
- **Migration Guide**: From monolithic hasyx

## Communication Channels

### GitHub Discussions
- **General**: General discussions about the ecosystem
- **Announcements**: Release announcements, important updates
- **Q&A**: User questions and support
- **Ideas**: Feature requests and brainstorming
- **Show and Tell**: Community projects using hasyx

### Other Channels
- **Issue Tracking**: GitHub Issues on individual repositories
- **Real-time Chat**: Consider Discord/Slack for community
- **Newsletter**: Monthly updates on ecosystem progress
- **Blog**: Technical articles and tutorials

## Initial Repository Setup

### Priority Repositories (Create First)

1. **hasyx/.github** - Organization profile and templates
2. **hasyx/hasura** - Core database management
3. **hasyx/graphql** - GraphQL client and generator
4. **hasyx/exec** - Code execution engine
5. **hasyx/auth** - Authentication system

### Repository Creation Steps

For each repository:

1. **Create repository**:
   ```bash
   gh repo create hasyx/<feature> --public --description "Description"
   ```

2. **Apply template**:
   - Use repository template for structure
   - Customize for specific feature

3. **Configure settings**:
   - Enable required features
   - Set up branch protection
   - Configure Actions secrets

4. **Set up CI/CD**:
   - Configure GitHub Actions
   - Set up npm publishing
   - Enable code coverage

5. **Initialize documentation**:
   - Create README.md
   - Add examples
   - Write API documentation

6. **Add code**:
   - Migrate from `hasyx/lib/<feature>`
   - Update imports
   - Add tests

7. **Publish**:
   - Tag initial version
   - Publish to npm
   - Create GitHub release

## Security Considerations

### Security Policies

1. **Vulnerability Reporting**: SECURITY.md in each repo
2. **Security Advisories**: Use GitHub Security Advisories
3. **Dependency Scanning**: Dependabot enabled on all repos
4. **Code Scanning**: CodeQL enabled on all repos
5. **Secret Scanning**: Enabled to prevent credential leaks

### Security Team

- Designated security contacts
- Private security mailing list
- Coordinated disclosure policy
- Security release process

### Security Best Practices

- Regular dependency updates
- Security audits for critical packages
- Least privilege access
- Two-factor authentication required
- Signed commits encouraged

## Cost Considerations

### GitHub
- **Organization**: Free for public repositories
- **Actions Minutes**: 2000 minutes/month (free tier)
- **Storage**: 500MB (free tier)
- **Additional costs**: None expected for initial phase

### NPM
- **Organization**: Free for public packages
- **Publishing**: Free
- **Bandwidth**: Unlimited for public packages
- **Additional costs**: None expected

### Infrastructure
- **Documentation Hosting**: GitHub Pages (free)
- **CI/CD**: GitHub Actions (free tier)
- **Domain**: hasyx.vercel.app (already owned)

**Total Expected Cost**: $0/month initially

## Timeline

### Week 1: Organization Setup
- Day 1: Create GitHub organization
- Day 2: Create NPM organization
- Day 3: Set up teams and permissions
- Day 4: Create repository template
- Day 5: Set up CI/CD workflows

### Week 2: Initial Repositories
- Create `.github` repository
- Set up organization profile
- Create documentation structure
- Prepare migration tools

### Week 3-4: First Package Migrations
- Migrate core utilities (exec, terminal, hid)
- Set up CI/CD for each package
- Publish initial versions
- Document migration process

### Week 5+: Ongoing Migration
- Follow phased approach from SEPARATION_PLAN.md
- Migrate packages according to priority
- Update main hasyx package
- Community feedback and iteration

## Success Metrics

### Immediate Success (Month 1)
- ✅ Organization created
- ✅ 5+ packages published
- ✅ CI/CD working for all packages
- ✅ Documentation published

### Short-term Success (Month 3)
- ✅ 15+ packages published
- ✅ Main hasyx package re-exports all packages
- ✅ 100% backward compatibility maintained
- ✅ Community contributors onboarded

### Long-term Success (Month 6)
- ✅ All 35+ packages published
- ✅ Active community contributions
- ✅ Growing npm download numbers
- ✅ Positive community feedback
- ✅ Clear package ownership

## Risk Mitigation

### Potential Risks

1. **Complexity**: Managing 35+ repositories is complex
   - **Mitigation**: Good tooling, automation, clear ownership

2. **Fragmentation**: Community might fragment across repos
   - **Mitigation**: Central communication channels, unified docs

3. **Maintenance Burden**: More repos = more maintenance
   - **Mitigation**: Shared CI/CD, clear contributor guidelines

4. **Version Conflicts**: Different package versions might conflict
   - **Mitigation**: Peer dependencies, compatibility matrix

5. **Breaking Changes**: Harder to coordinate breaking changes
   - **Mitigation**: Semantic versioning, deprecation warnings

## Alternatives Considered

### Alternative 1: Monorepo
**Pros**: Single repository, easier coordination
**Cons**: Large codebase, harder to contribute, slower CI/CD
**Decision**: Rejected - Doesn't solve the modularity goal

### Alternative 2: Keep as Single Package
**Pros**: Simplest approach, no changes needed
**Cons**: Doesn't address issue #10 goals, bundle size problems
**Decision**: Rejected - Issue #10 specifically requests separation

### Alternative 3: Separate Without Organization
**Pros**: No organization overhead
**Cons**: Harder to discover packages, inconsistent naming
**Decision**: Rejected - Organization provides better structure

## Community Feedback

### Gathering Feedback

Before full implementation:
1. Post proposal to GitHub Discussions
2. Get feedback from current users
3. Survey community on preferences
4. Adjust plan based on feedback

### Feedback Channels

- GitHub Discussions on main repo
- Issue comments on issue #10
- Twitter/social media
- Direct outreach to major users

## Next Steps

1. **Review this proposal** with repository owner
2. **Get approval** to proceed
3. **Create GitHub organization** `hasyx`
4. **Create NPM organization** `@hasyx`
5. **Set up initial repositories** and templates
6. **Begin Phase 1 migration** (core utilities)
7. **Announce to community** and gather feedback
8. **Iterate and improve** based on experience

## Approval

This proposal requires approval from:
- [ ] Repository owner (@ivansglazunov)
- [ ] Core maintainers
- [ ] Key stakeholders

Once approved, proceed with implementation according to timeline.

## References

- **Issue #10**: https://github.com/ivansglazunov/hasyx/issues/10
- **Separation Plan**: `SEPARATION_PLAN.md`
- **Package Requirements**: `PACKAGE_REQUIREMENTS.md`
- **Feature Analysis**: `FEATURE_EXTRACTION_ANALYSIS.md`

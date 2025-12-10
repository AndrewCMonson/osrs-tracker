# Contributing to OSRS Tracker

Thank you for your interest in contributing to OSRS Tracker! This document outlines the Git branching and commit conventions we follow to maintain a clean and organized codebase.

## Table of Contents

- [Branch Naming Conventions](#branch-naming-conventions)
- [Commit Message Conventions](#commit-message-conventions)
- [Branching Strategy](#branching-strategy)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Commit Best Practices](#commit-best-practices)
- [Additional Best Practices](#additional-best-practices)
- [Example Workflow](#example-workflow)

## Branch Naming Conventions

### Branch Prefixes

Use lowercase prefixes with forward slash separator:

- `feature/` - New features or enhancements
  - Example: `feature/user-dashboard`, `feature/graphql-api`
  
- `bugfix/` or `fix/` - Bug fixes
  - Example: `bugfix/dashboard-loading-error`, `fix/milestone-calculation`
  
- `hotfix/` - Critical production fixes (merge directly to main)
  - Example: `hotfix/auth-security-patch`
  
- `refactor/` - Code refactoring without changing functionality
  - Example: `refactor/player-service-cleanup`
  
- `chore/` - Maintenance tasks, dependencies, config changes
  - Example: `chore/update-dependencies`, `chore/eslint-config`
  
- `docs/` - Documentation updates
  - Example: `docs/api-documentation`, `docs/readme-update`
  
- `test/` - Adding or updating tests
  - Example: `test/player-service-tests`
  
- `review/` - Code review or experimental changes
  - Example: `review/general-fixes`

### Branch Name Format

- Use kebab-case (lowercase with hyphens)
- Be descriptive but concise (3-5 words max)
- Include issue/ticket number if applicable: `feature/123-user-authentication`
- Avoid special characters except hyphens

**Good Examples:**
- `feature/milestone-tracking`
- `bugfix/skill-chart-rendering`
- `refactor/api-error-handling`

**Bad Examples:**
- `new-feature` (missing prefix)
- `Feature/UserDashboard` (wrong case, no separator)
- `fix-bug` (too vague)

## Commit Message Conventions

### Format: Conventional Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes
- `build:` - Build system changes

### Scope (Optional)

Scope should be the area of codebase affected:

- `api` - API routes
- `components` - React components
- `services` - Service layer
- `types` - TypeScript types
- `db` - Database/Prisma
- `auth` - Authentication
- `ui` - UI components

### Subject

- Use imperative mood ("add" not "added" or "adds")
- First letter lowercase
- No period at the end
- Max 72 characters
- Be specific and descriptive

### Body (Optional)

- Explain what and why, not how
- Wrap at 72 characters
- Can include multiple paragraphs

### Footer (Optional)

- Reference issues: `Closes #123`, `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`

### Examples

**Simple:**
```
feat(api): add GraphQL endpoint for player queries
```

**With scope and body:**
```
fix(components): resolve skill chart rendering issue

The skill chart was not displaying data points correctly
when switching between time periods. This was caused by
improper state management in the useEffect hook.

Fixes #42
```

**Breaking change:**
```
refactor(api): restructure dashboard response format

BREAKING CHANGE: Dashboard API now returns nested structure.
Update frontend to use response.accounts instead of response.data.
```

## Branching Strategy

### Primary Branch: `main`

- Always deployable
- Protected branch (require PR reviews)
- Only merge via Pull Requests

### Workflow: GitHub Flow (Simplified)

1. Create feature branch from `main`
2. Make commits following conventions
3. Push branch and create Pull Request
4. Code review and address feedback
5. Merge to `main` after approval
6. Delete feature branch after merge

### Branch Lifecycle

- Create branch from latest `main`
- Keep branch updated: `git rebase main` or `git merge main`
- One feature per branch (atomic changes)
- Delete branch after merge

## Pull Request Guidelines

### PR Title

- Follow commit message format: `feat(api): add GraphQL endpoint`
- Or use descriptive title: `Add GraphQL API for player queries`

### PR Description

Use the PR template (see `.github/PULL_REQUEST_TEMPLATE.md`) which includes:

- Description of changes
- Type of change
- Testing information
- Checklist items

### PR Size

- Keep PRs focused and small (< 400 lines ideally)
- Split large features into multiple PRs
- Each PR should be independently reviewable

## Commit Best Practices

### Atomic Commits

- One logical change per commit
- Commit frequently (every 20-30 minutes of work)
- Each commit should be a working state

### Commit Message Quality

- Write clear, descriptive messages
- Explain why, not just what
- Reference related issues/PRs
- Use present tense, imperative mood

### When to Commit

- After completing a logical unit of work
- Before switching tasks
- After fixing a bug
- Before refactoring
- After adding tests

### When NOT to Commit

- Broken code (fix first, then commit)
- Multiple unrelated changes (split commits)
- Temporary/debug code (remove first)

## Additional Best Practices

### Pre-Commit

- Run linter: `npm run lint`
- Run type check: `tsc --noEmit`
- Test locally before committing

### Branch Management

- Keep branches short-lived (< 1 week ideally)
- Rebase instead of merge when updating (cleaner history)
- Use `git rebase -i` to clean up commits before PR

### Code Review

- Request reviews from at least one team member
- Address all feedback before merging
- Use "Request Changes" for blocking issues
- Use "Approve" only when ready to merge

### Merge Strategy

- Prefer "Squash and Merge" for feature branches (clean history)
- Use "Rebase and Merge" for single-commit PRs
- Avoid "Merge Commit" unless necessary

### Tagging

- Tag releases: `v1.0.0`, `v1.1.0`
- Use semantic versioning
- Tag from `main` branch after merge

## Example Workflow

Here's a typical workflow for contributing:

```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/player-search

# Make changes and commit
git add .
git commit -m "feat(components): add player search input"

# Continue working
git add .
git commit -m "feat(api): add search endpoint"

# Update from main
git fetch origin
git rebase origin/main

# Push and create PR
git push origin feature/player-search
# Create PR on GitHub/GitLab

# After review and merge, clean up
git checkout main
git pull origin main
git branch -d feature/player-search
```

### Working with Multiple Commits

If you need to clean up commits before creating a PR:

```bash
# Interactive rebase to edit/squash commits
git rebase -i HEAD~3

# Or squash all commits in branch
git rebase -i main
```

### Handling Conflicts During Rebase

```bash
# If conflicts occur during rebase
git rebase origin/main

# Resolve conflicts in files
# Then continue rebase
git add .
git rebase --continue

# Or abort if needed
git rebase --abort
```

## Getting Help

If you have questions about these conventions or need help with Git:

- Check the [Conventional Commits](https://www.conventionalcommits.org/) specification
- Review existing PRs and commits in the repository
- Ask in pull request comments or issues

Thank you for contributing to OSRS Tracker!

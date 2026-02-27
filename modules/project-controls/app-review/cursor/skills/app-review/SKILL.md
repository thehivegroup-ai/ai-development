---
name: app-review
description: Structured discovery and documentation of an existing application's architecture, patterns, and conventions. Use when onboarding to an unfamiliar project, first time working with a codebase, or when generating architecture documentation for a repository.
---

# Application Review

## When to Use

- First time working with a project or repository.
- Onboarding to an unfamiliar codebase before making changes.
- When the user says "review this project", "understand this app", or "document this codebase".
- Before any significant refactor or feature addition in an undocumented project.

## Design Goals

- Produce a comprehensive, actionable understanding of the application.
- Document conventions as observed, not as assumed.
- Identify patterns that new code must follow.
- Surface inconsistencies and risks early.

## Instructions

### Phase 1: Orientation (Structure and Stack)

1. **Read the root directory** — identify `package.json`, `pom.xml`, `requirements.txt`, `go.mod`, or equivalent to determine the language, framework, and key dependencies.
2. **Map the directory tree** (3 levels deep minimum) — identify source roots, test directories, configuration files, build outputs, and documentation.
3. **Read configuration files** — `tsconfig.json`, `angular.json`, `vite.config.*`, `.env.example`, `docker-compose.yml`, CI/CD configs. These reveal build targets, environments, and runtime expectations.
4. **Identify the tech stack** — framework (React, Angular, Fastify, Spring, etc.), ORM/database client, test framework, bundler, linter, formatter.

### Phase 2: Patterns (How the App Works)

5. **Trace a request end-to-end** — pick a representative feature and follow data from UI to API to database and back. Document each layer's responsibilities.
6. **Identify API conventions** — route naming, HTTP method usage, request/response shapes, error envelopes, versioning strategy.
7. **Document state management** — frontend state (Context, Redux, signals), backend service patterns, caching strategies.
8. **Review authentication and authorization** — provider (Keycloak, Cognito, Auth0, custom), flow (BFF, direct, OAuth), token handling, role enforcement patterns.
9. **Examine error handling** — how errors propagate, logging patterns, user-facing error messages, retry strategies.

### Phase 3: Quality (Testing and Standards)

10. **Review test structure** — unit test framework, integration test patterns, test data strategy, mocking approach.
11. **Check code style** — linter config (ESLint, Prettier, etc.), naming conventions (camelCase, kebab-case for files), import ordering.
12. **Identify shared utilities** — common helpers, constants, types, and abstractions the team has built.

### Phase 4: Output

13. **Produce a structured summary** following the template in `references/review-template.md`.
14. **Flag risks and inconsistencies** — areas where the codebase contradicts itself or where patterns are unclear.
15. **Recommend follow-up** — suggest rules, skills, or agents that should be created based on the project's specific patterns.

## References

- `references/review-template.md` — structured output template for the review summary.

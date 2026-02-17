# Application Review Discover

Perform a structured review of the current project to document its architecture, patterns, and conventions.

## Steps

1. Identify the project root and read configuration files (`package.json`, `tsconfig.json`, `docker-compose.yml`, `.env.example`, CI/CD configs).
2. Map the directory structure (3+ levels deep) and identify source roots, test directories, and shared utilities.
3. Determine the full tech stack: language, framework, ORM, test framework, bundler, linter, cloud provider.
4. Trace a representative feature end-to-end: UI component to API route to database query.
5. Document API conventions: route naming, validation, error handling, response shapes.
6. Document authentication and authorization: provider, flow, token handling, role enforcement.
7. Document state management and data flow patterns.
8. Document testing patterns: framework, file organization, mocking approach, coverage expectations.
9. Document code style: naming conventions, import ordering, linter/formatter config.
10. Produce a structured summary using the review template.
11. Flag inconsistencies, risks, and recommended follow-up actions.

## Guidance

- Apply the `app-review` skill for the full methodology.
- Invoke the `ctrl.app-reviewer` agent for the exploration and documentation work.
- Cross-reference patterns across multiple files before documenting conventions.
- The output should be a complete, self-contained reference that enables productive work in the project.

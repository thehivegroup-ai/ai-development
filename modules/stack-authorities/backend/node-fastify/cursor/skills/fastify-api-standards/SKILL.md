---
name: fastify-api-standards
description: Fastify API structure, validation, and error handling. Use when creating or modifying Fastify routes, adding request validation with JSON Schema, implementing error handling, or structuring Fastify plugins.
---

# Fastify API Standards

## When to Use

- Creating or modifying Fastify routes or plugins.
- Refactoring API structure or validation logic.

## Instructions

1. Use plugins for shared concerns (auth, logging, validation).
2. Validate input and output with schemas.
3. Keep handlers thin; move logic to services.
4. Return consistent error envelopes and status codes.
5. Add tests for edge cases and error paths.

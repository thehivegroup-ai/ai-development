---
name: fastify-api-standards
version: 1.0.0
description: >
  Fastify API structure, validation, and error handling. Use when creating or modifying Fastify 
  routes, adding request validation with JSON Schema, implementing error handling, or structuring 
  Fastify plugins.
  
  Trigger when user mentions: Fastify route, API endpoint, JSON Schema validation, request validation, 
  error handling, Fastify plugin, service layer, API structure, or asks about Fastify best practices 
  or how to validate requests.
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

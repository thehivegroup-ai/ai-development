---
name: java-api-standards
description: Java API design, validation, and testing patterns. Use when building or refactoring Java API layers, designing REST endpoints, implementing validation, or writing API tests.
---

# Java API Standards

## When to Use

- Building or refactoring Java API layers.
- Designing request/response models.

## Instructions

1. Keep controllers thin; use services for business logic.
2. Validate inputs at boundaries (DTO validation).
3. Use consistent error models and status codes.
4. Write tests for service logic and endpoint contracts.

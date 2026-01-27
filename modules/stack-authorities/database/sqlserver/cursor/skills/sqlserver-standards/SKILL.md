---
name: sqlserver-standards
description: SQL Server migration and performance practices.
---

# SQL Server Standards

## When to Use

- Designing or changing schema.
- Auditing queries or indexes.

## Instructions

1. Use migrations for all schema changes.
2. Provide rollback or declare irreversible changes.
3. Add indexes for query-critical fields.
4. Avoid long-running locks; plan safe migration windows.

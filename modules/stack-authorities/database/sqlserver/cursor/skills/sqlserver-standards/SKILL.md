---
name: sqlserver-standards
version: 1.0.0
description: >
  SQL Server migration and performance practices. Use when designing SQL Server schemas, writing or 
  reviewing migrations, optimizing queries, or auditing index strategies.
  
  Trigger when user mentions: SQL Server migration, T-SQL, database schema, create table, add index, 
  query optimization, execution plan, stored procedure, or asks about SQL Server best practices.
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

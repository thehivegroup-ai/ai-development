# SQL Server Database Standards

**Platform-Agnostic Instructions**

This module provides SQL Server database standards for schema design, migrations, indexing, and T-SQL patterns.

---

## Migration Standards

**All schema changes MUST use migrations:**

```sql
-- migrations/001_create_users.up.sql
CREATE TABLE users (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  email NVARCHAR(255) NOT NULL,
  name NVARCHAR(255) NOT NULL,
  created_at DATETIME2 DEFAULT GETUTCDATE(),
  updated_at DATETIME2,
  CONSTRAINT UQ_users_email UNIQUE (email)
);

CREATE NONCLUSTERED INDEX IX_users_email ON users(email);

-- migrations/001_create_users.down.sql
DROP INDEX IF EXISTS IX_users_email ON users;
DROP TABLE IF EXISTS users;
```

**Migration best practices:**
- Write both up and down migrations
- Test rollback before deploying
- Mark irreversible migrations explicitly
- Use transactions for multi-statement migrations
- Consider ONLINE index operations for large tables
- Plan for minimal downtime during schema changes

---

## Indexing Strategy

**Create indexes for:**
- Foreign keys
- Columns used in WHERE clauses
- Columns used in JOIN conditions
- Columns used in ORDER BY

```sql
-- Single column index
CREATE NONCLUSTERED INDEX IX_users_email ON users(email);

-- Composite index (order matters)
CREATE NONCLUSTERED INDEX IX_posts_user_created 
  ON posts(user_id, created_at DESC);

-- Unique index
CREATE UNIQUE NONCLUSTERED INDEX UQ_users_username ON users(username);

-- Filtered index (SQL Server specific)
CREATE NONCLUSTERED INDEX IX_active_users 
  ON users(email) WHERE is_active = 1;

-- ONLINE index rebuild (Enterprise Edition)
CREATE INDEX IX_users_status ON users(status) WITH (ONLINE = ON);
```

**Index maintenance:**
- Monitor index usage with sys.dm_db_index_usage_stats
- Remove unused indexes
- Rebuild or reorganize fragmented indexes
- Consider columnstore indexes for analytics workloads

---

## Query Optimization

**Use execution plans to verify performance:**

```sql
SET STATISTICS TIME, IO ON;

SELECT u.name, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
WHERE u.is_active = 1
GROUP BY u.id, u.name
ORDER BY post_count DESC
OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;
```

**Avoid N+1 queries:**

```sql
-- ❌ BAD: N+1 queries in application code
SELECT * FROM users;
-- Then for each user:
SELECT * FROM posts WHERE user_id = ?;

-- ✅ GOOD: Single query with JOIN
SELECT u.*, p.* 
FROM users u
LEFT JOIN posts p ON p.user_id = u.id;
```

---

## Transactions

**Use transactions for multi-step changes:**

```sql
BEGIN TRANSACTION;

BEGIN TRY
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
    UPDATE accounts SET balance = balance + 100 WHERE id = 2;
    INSERT INTO transactions (from_account, to_account, amount) VALUES (1, 2, 100);
    
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    THROW;
END CATCH;
```

**Isolation levels:**
- READ COMMITTED (default) - sufficient for most cases
- REPEATABLE READ - when consistency across queries matters
- SERIALIZABLE - when concurrent modifications must be prevented
- SNAPSHOT - optimistic concurrency with row versioning

---

## Connection Management

**Configure appropriate connection pooling:**

```csharp
// C# with Entity Framework
services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        connectionString,
        sqlOptions => {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null
            );
        }
    )
);
```

---

## Data Types

**Choose appropriate types:**

```sql
-- ✅ GOOD: Appropriate types
user_id BIGINT
email NVARCHAR(255)
amount DECIMAL(19,4)  -- Exact decimal for currency
is_active BIT
created_at DATETIME2  -- More precise than DATETIME
metadata NVARCHAR(MAX)  -- For JSON storage (or use JSON functions in SQL Server 2016+)

-- ❌ BAD: Poor type choices
user_id NVARCHAR(50)  -- Inefficient for numeric IDs
amount FLOAT  -- Inexact for currency
created_at DATETIME  -- Less precise, no timezone awareness
```

---

## Success Metrics

Migration reviews MUST verify:
- ✅ Migrations are reversible (or marked irreversible)
- ✅ Indexes created for query patterns
- ✅ ONLINE operations used for large tables where possible
- ✅ Transactions used for multi-step changes
- ✅ Foreign keys properly indexed
- ✅ Connection pooling configured
- ✅ Query performance validated with execution plans

# PostgreSQL Database Standards

**Platform-Agnostic Instructions**

This module provides PostgreSQL database standards for schema design, migrations, indexing, and query optimization.

---

## Migration Standards

**All schema changes MUST use migrations:**

```sql
-- migrations/001_create_users.up.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);

-- migrations/001_create_users.down.sql
DROP INDEX IF EXISTS idx_users_email;
DROP TABLE IF EXISTS users;
```

**Migration best practices:**
- Write both up and down migrations
- Test rollback before deploying
- Mark irreversible migrations explicitly
- Use transactions for multi-statement migrations
- Avoid blocking operations on large tables (use CONCURRENTLY where applicable)

---

## Indexing Strategy

**Create indexes for:**
- Foreign keys
- Columns used in WHERE clauses
- Columns used in JOIN conditions
- Columns used in ORDER BY

```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (order matters)
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);

-- Unique index
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Partial index
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;

-- Concurrent index (no table lock)
CREATE INDEX CONCURRENTLY idx_users_status ON users(status);
```

**Index maintenance:**
- Monitor index usage with pg_stat_user_indexes
- Remove unused indexes
- Rebuild fragmented indexes
- Consider covering indexes for frequently queried columns

---

## Query Optimization

**Use EXPLAIN ANALYZE to verify query plans:**

```sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
WHERE u.is_active = true
GROUP BY u.id, u.name
ORDER BY post_count DESC
LIMIT 10;
```

**Avoid N+1 queries:**

```sql
-- ❌ BAD: N+1 queries
SELECT * FROM users; -- Then for each user:
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
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
INSERT INTO transactions (from_account, to_account, amount) VALUES (1, 2, 100);

COMMIT;
```

**Transaction isolation levels:**
- READ COMMITTED (default) - sufficient for most cases
- REPEATABLE READ - when consistency across queries matters
- SERIALIZABLE - when concurrent modifications must be prevented

---

## Connection Pooling

**Configure appropriate pool size:**

```javascript
// Node.js with pg
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'dbuser',
  password: process.env.DB_PASSWORD,
  max: 20,          // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

```python
# Python with asyncpg
from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True,  # Check connection health
)
```

---

## Data Types

**Choose appropriate types:**

```sql
-- ✅ GOOD: Appropriate types
user_id BIGINT
email VARCHAR(255)  -- or TEXT if no limit needed
amount NUMERIC(10,2)  -- Exact decimal
is_active BOOLEAN
created_at TIMESTAMP WITH TIME ZONE  -- Always use timezone
metadata JSONB  -- For flexible structured data

-- ❌ BAD: Poor type choices
user_id VARCHAR(50)  -- Inefficient for numeric IDs
amount FLOAT  -- Inexact for currency
created_at TIMESTAMP WITHOUT TIME ZONE  -- Ambiguous
```

---

## Performance Monitoring

**Key metrics to track:**
- Query execution time
- Index hit ratio
- Connection pool usage
- Table bloat
- Lock contention

**Useful queries:**

```sql
-- Slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Unused indexes
SELECT schemaname, tablename, indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- Table sizes
SELECT tablename, pg_size_pretty(pg_total_relation_size(tablename::regclass))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
```

---

## Success Metrics

Migration reviews MUST verify:
- ✅ Migrations are reversible (or marked irreversible)
- ✅ Indexes created for query patterns
- ✅ No blocking operations on production tables
- ✅ Transactions used for multi-step changes
- ✅ Foreign keys properly indexed
- ✅ Connection pooling configured
- ✅ Query performance validated with EXPLAIN

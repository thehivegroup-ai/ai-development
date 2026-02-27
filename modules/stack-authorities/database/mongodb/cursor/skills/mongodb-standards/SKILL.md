---
name: mongodb-standards
description: MongoDB schema design patterns for embedding, referencing, and indexing. Use when designing MongoDB collections, choosing between embedding and referencing, creating indexes, or optimizing query performance.
---

# Skill: MongoDB Data Modeling

**Technology:** MongoDB + Mongoose/Motor  
**Skill Type:** Database Design

---

## Core Patterns

### 1. Schema Design
Define structure even for schemaless MongoDB.

### 2. Embedding
```javascript
// Embed when data is always accessed together
{
  user: {
    name: "John",
    address: { street: "123 Main", city: "NYC" }
  }
}
```

### 3. Referencing
```javascript
// Reference for large or shared data
{
  user: { _id: ObjectId("..."), name: "John" },
  posts: [ObjectId("..."), ObjectId("...")]
}
```

### 4. Indexing
```javascript
// Create indexes for query patterns
db.users.createIndex({ email: 1 }, { unique: true });
db.posts.createIndex({ userId: 1, createdAt: -1 });
```

---

This skill provides MongoDB best practices.

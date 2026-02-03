# DB MongoDB: Schema

Create MongoDB schema with proper indexing.

---

## Workflow

### Step 1: Define Schema

```typescript
// Mongoose
const schema = new Schema({
  field: { type: String, required: true, index: true }
});
```

### Step 2: Create Indexes

```typescript
schema.index({ email: 1 }, { unique: true });
schema.index({ createdAt: -1 });
```

### Step 3: Export Model

```typescript
export const Model = mongoose.model('Model', schema);
```

---

This command generates MongoDB schemas with proper validation and indexing.

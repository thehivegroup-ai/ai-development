---
name: vue-component-standards
description: Vue 3 component patterns with Composition API, TypeScript, and Tailwind CSS. Use when building or refactoring Vue 3 components, migrating from Options API, creating composables, or integrating Pinia state management.
---

# Skill: Vue.js Component Standards

**Technology:** Vue 3 + Composition API + TypeScript + Tailwind CSS  
**Skill Type:** Implementation Patterns  
**Applies To:** Frontend development with Vue.js

---

## When to Use This Skill

Use this skill when:
- Building Vue 3 components
- Refactoring Options API to Composition API
- Setting up TypeScript with Vue
- Implementing Tailwind CSS patterns
- Creating reusable composables
- Integrating Pinia state management

---

## Core Patterns

### 1. Component Structure (Composition API)

**Always use `<script setup>` for new components:**

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { ComponentType } from '@/types';

// Props
interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});

// Emits
const emit = defineEmits<{
  click: [id: string];
  update: [value: number];
}>();

// State
const internalCount = ref(props.count);
const loading = ref(false);

// Computed
const displayText = computed(() =>
  `${props.title}: ${internalCount.value}`
);

// Methods
function increment() {
  internalCount.value++;
  emit('update', internalCount.value);
}

// Lifecycle
onMounted(() => {
  console.log('Component mounted');
});
</script>

<template>
  <div class="space-y-4">
    <h2>{{ displayText }}</h2>
    <button @click="increment">Increment</button>
  </div>
</template>

<style scoped>
/* Only for complex animations */
</style>
```

### 2. TypeScript Integration

**Define all interfaces:**

```typescript
// types/user.ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export type UserRole = User['role'];
```

**Use in components:**

```vue
<script setup lang="ts">
import type { User, UserFormData } from '@/types/user';

interface Props {
  user: User;
  onSave: (data: UserFormData) => Promise<void>;
}

const props = defineProps<Props>();

const formData = ref<UserFormData>({
  firstName: props.user.firstName,
  lastName: props.user.lastName,
  email: props.user.email,
});
</script>
```

### 3. Composables (Reusable Logic)

**File: `composables/useUser.ts`**

```typescript
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import type { User } from '@/types';

export interface UseUserReturn {
  user: Ref<User | null>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  displayName: Ref<string>;
  loadUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

export function useUser(userId: string): UseUserReturn {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const displayName = computed(() =>
    user.value
      ? `${user.value.firstName} ${user.value.lastName}`
      : ''
  );

  async function loadUser() {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to load user');
      user.value = await response.json();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(data: Partial<User>) {
    if (!user.value) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update user');
      user.value = await response.json();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    loading,
    error,
    displayName,
    loadUser,
    updateUser,
  };
}
```

**Usage in component:**

```vue
<script setup lang="ts">
import { useUser } from '@/composables/useUser';

const props = defineProps<{ userId: string }>();

const { user, loading, error, displayName, loadUser } = useUser(props.userId);

onMounted(() => {
  loadUser();
});
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else-if="user">
    <h1>{{ displayName }}</h1>
    <p>{{ user.email }}</p>
  </div>
</template>
```

### 4. State Management (Pinia)

**Store setup with Composition API:**

```typescript
// stores/user.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types';

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null);
  const users = ref<Map<string, User>>(new Map());

  // Getters
  const isAuthenticated = computed(() => currentUser.value !== null);
  const isAdmin = computed(() => currentUser.value?.role === 'admin');

  // Actions
  async function login(email: string, password: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Login failed');

    currentUser.value = await response.json();
  }

  function logout() {
    currentUser.value = null;
    users.value.clear();
  }

  async function fetchUser(id: string) {
    if (users.value.has(id)) {
      return users.value.get(id)!;
    }

    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    users.value.set(id, user);
    return user;
  }

  return {
    // State
    currentUser,
    users,
    // Getters
    isAuthenticated,
    isAdmin,
    // Actions
    login,
    logout,
    fetchUser,
  };
});
```

**Usage:**

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// Reactive access
const user = computed(() => userStore.currentUser);
const isAdmin = computed(() => userStore.isAdmin);

// Call actions
async function handleLogin() {
  await userStore.login(email.value, password.value);
}
</script>
```

### 5. Tailwind CSS Patterns

**Layout components:**

```vue
<template>
  <!-- Container with padding and max-width -->
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- Content -->
  </div>

  <!-- Grid layout (responsive) -->
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="item in items" :key="item.id" class="...">
      {{ item.name }}
    </div>
  </div>

  <!-- Flex with gap -->
  <div class="flex items-center gap-4">
    <img src="..." class="h-10 w-10 rounded-full" />
    <div class="flex-1">
      <p class="text-sm font-medium text-gray-900">{{ name }}</p>
      <p class="text-sm text-gray-500">{{ email }}</p>
    </div>
  </div>
</template>
```

**Form components:**

```vue
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Text input -->
    <div>
      <label
        for="email"
        class="block text-sm font-medium text-gray-700"
      >
        Email
      </label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        data-testid="email-input"
      />
    </div>

    <!-- Submit button -->
    <button
      type="submit"
      class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      data-testid="submit-button"
    >
      Submit
    </button>
  </form>
</template>
```

### 6. Testing Patterns

**Component test:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import UserCard from '@/components/UserCard.vue';
import type { User } from '@/types';

describe('UserCard', () => {
  let wrapper: VueWrapper;
  const mockUser: User = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'user',
    createdAt: new Date(),
  };

  beforeEach(() => {
    wrapper = mount(UserCard, {
      props: { user: mockUser },
    });
  });

  it('renders user name', () => {
    expect(wrapper.text()).toContain('John Doe');
  });

  it('emits update event when save clicked', async () => {
    await wrapper.find('[data-testid="save-button"]').trigger('click');

    expect(wrapper.emitted()).toHaveProperty('update');
    expect(wrapper.emitted('update')?.[0]).toEqual([mockUser]);
  });

  it('shows loading state', async () => {
    await wrapper.setProps({ loading: true });

    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true);
  });
});
```

**Composable test:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { useUser } from '@/composables/useUser';

// Mock fetch
global.fetch = vi.fn();

describe('useUser', () => {
  it('loads user successfully', async () => {
    const mockUser = { id: '1', name: 'John' };
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const { user, loading, loadUser } = useUser('1');

    expect(loading.value).toBe(false);

    await loadUser();

    expect(loading.value).toBe(false);
    expect(user.value).toEqual(mockUser);
  });

  it('handles errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const { error, loadUser } = useUser('1');

    await loadUser();

    expect(error.value).toBeTruthy();
    expect(error.value?.message).toBe('Network error');
  });
});
```

---

## Quick Reference

### Component Checklist
- [ ] `<script setup lang="ts">`
- [ ] TypeScript interfaces for props/emits
- [ ] Proper reactive state (ref/computed)
- [ ] Tailwind CSS classes
- [ ] `data-testid` attributes
- [ ] Loading/error states
- [ ] Accessibility (labels, ARIA)
- [ ] Unit tests

### File Organization
```
src/
├── components/      # Reusable components
├── composables/     # Reusable logic
├── stores/          # Pinia stores
├── types/           # TypeScript types
├── views/           # Route views
├── router/          # Vue Router config
└── main.ts          # App entry
```

### Naming Conventions
- Components: PascalCase (`UserCard.vue`)
- Composables: `use` prefix (`useUser.ts`)
- Stores: `use` + `Store` suffix (`useUserStore.ts`)
- Types: PascalCase (`User`, `UserRole`)
- Props: camelCase in script, kebab-case in template

---

## Common Pitfalls

❌ **Using Options API**
```vue
<script>
export default {
  data() { return {} }
}
</script>
```

✅ **Use Composition API**
```vue
<script setup lang="ts">
const data = ref({});
</script>
```

❌ **Mixing v-for and v-if**
```vue
<div v-for="item in items" v-if="item.active">
```

✅ **Filter then iterate**
```vue
<div v-for="item in activeItems" :key="item.id">
```

❌ **No key on v-for**
```vue
<div v-for="item in items">
```

✅ **Always use unique keys**
```vue
<div v-for="item in items" :key="item.id">
```

---

This skill provides complete patterns for production-ready Vue 3 development with TypeScript and Tailwind CSS.

# Web Vue: Build Component

Build a Vue 3 component using Composition API, TypeScript, and Tailwind CSS.

**Apply `vue-component-standards` skill for detailed patterns.**

---

## Purpose

Generate a production-ready Vue component with proper TypeScript typing, reactive state, and Tailwind styling.

---

## Prerequisites

**Before building, you MUST have:**
- Component requirements clearly defined
- Data model understood
- User interactions identified
- Visual design reference (or Tailwind guidelines)

**If unclear, use `/std-solution` first.**

---

## Component Building Workflow

### Step 1: Define Component Interface

**Questions to answer:**
1. What props does this component accept?
2. What events does it emit?
3. What state does it manage?
4. What computed values does it need?

**Example:**
```
Component: UserProfileCard
Props: userId (string, required), editable (boolean, optional)
Emits: update (User), delete ()
State: user (User | null), loading (boolean), editing (boolean)
Computed: displayName, canEdit
```

---

### Step 2: Create Component File

**File naming:** PascalCase with `.vue` extension

```bash
# Components go in src/components/
touch src/components/UserProfileCard.vue
```

---

### Step 3: Implement Script Section

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { User } from '@/types';

// 1. Define Props Interface
interface Props {
  userId: string;
  editable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
});

// 2. Define Emits
const emit = defineEmits<{
  update: [user: User];
  delete: [];
}>();

// 3. Reactive State
const user = ref<User | null>(null);
const loading = ref(false);
const editing = ref(false);

// 4. Computed Properties
const displayName = computed(() =>
  user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
);

const canEdit = computed(() =>
  props.editable && user.value !== null
);

// 5. Methods
async function loadUser() {
  loading.value = true;
  try {
    const response = await fetch(`/api/users/${props.userId}`);
    user.value = await response.json();
  } catch (error) {
    console.error('Failed to load user:', error);
  } finally {
    loading.value = false;
  }
}

function startEdit() {
  if (canEdit.value) {
    editing.value = true;
  }
}

function saveChanges() {
  if (user.value) {
    emit('update', user.value);
    editing.value = false;
  }
}

function deleteUser() {
  if (confirm('Are you sure?')) {
    emit('delete');
  }
}

// 6. Lifecycle
onMounted(() => {
  loadUser();
});
</script>
```

---

### Step 4: Implement Template Section

**Use Tailwind classes for styling:**

```vue
<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-8"
      data-testid="user-profile-loading"
    >
      <svg
        class="h-8 w-8 animate-spin text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>

    <!-- User Content -->
    <div
      v-else-if="user"
      class="space-y-4"
      data-testid="user-profile-content"
    >
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ displayName }}
        </h2>
        
        <button
          v-if="canEdit && !editing"
          @click="startEdit"
          class="text-sm text-blue-600 hover:text-blue-700"
          data-testid="user-profile-edit-button"
        >
          Edit
        </button>
      </div>

      <!-- User Info (Read Mode) -->
      <div v-if="!editing" class="space-y-2">
        <p class="text-sm text-gray-600">{{ user.email }}</p>
        <p class="text-sm text-gray-600">{{ user.role }}</p>
      </div>

      <!-- User Info (Edit Mode) -->
      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            v-model="user.firstName"
            type="text"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            data-testid="user-profile-firstname-input"
          />
        </div>

        <div class="flex gap-2">
          <button
            @click="saveChanges"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            data-testid="user-profile-save-button"
          >
            Save
          </button>
          
          <button
            @click="editing = false"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            data-testid="user-profile-cancel-button"
          >
            Cancel
          </button>
          
          <button
            @click="deleteUser"
            class="ml-auto rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            data-testid="user-profile-delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else
      class="py-8 text-center text-gray-500"
      data-testid="user-profile-error"
    >
      Failed to load user
    </div>
  </div>
</template>
```

---

### Step 5: Add Styles (if needed)

**Only for animations or complex layouts:**

```vue
<style scoped>
/* Transition for edit mode */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

---

### Step 6: Add Tests

```typescript
// UserProfileCard.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import UserProfileCard from './UserProfileCard.vue';

describe('UserProfileCard', () => {
  it('renders loading state', () => {
    const wrapper = mount(UserProfileCard, {
      props: { userId: '1' },
    });

    expect(wrapper.find('[data-testid="user-profile-loading"]').exists()).toBe(true);
  });

  it('emits update event when saved', async () => {
    const wrapper = mount(UserProfileCard, {
      props: { userId: '1', editable: true },
    });

    // Wait for user to load
    await wrapper.vm.$nextTick();

    // Click edit
    await wrapper.find('[data-testid="user-profile-edit-button"]').trigger('click');

    // Click save
    await wrapper.find('[data-testid="user-profile-save-button"]').trigger('click');

    expect(wrapper.emitted()).toHaveProperty('update');
  });
});
```

---

## Output

**Report component created:**

```markdown
## Component Created: UserProfileCard ✅

### Location
`src/components/UserProfileCard.vue`

### Interface
**Props:**
- `userId: string` (required)
- `editable?: boolean` (optional, default: false)

**Emits:**
- `update: (user: User) => void`
- `delete: () => void`

**State:**
- user, loading, editing

**Computed:**
- displayName, canEdit

### Features
- ✅ TypeScript with full typing
- ✅ Composition API with `<script setup>`
- ✅ Tailwind CSS styling
- ✅ Loading, content, and error states
- ✅ Edit mode (if editable=true)
- ✅ `data-testid` attributes for testing
- ✅ Responsive design
- ✅ Accessibility (labels, ARIA where needed)

### Usage Example
\`\`\`vue
<UserProfileCard
  :user-id="selectedUserId"
  :editable="currentUserIsAdmin"
  @update="handleUserUpdate"
  @delete="handleUserDelete"
/>
\`\`\`

### Next Steps
1. Add to parent view
2. Wire up event handlers
3. Run tests: `npm run test`
4. Review in browser
```

---

## Guidance

- **Apply `vue-component-standards` skill** for Vue 3 + Composition API patterns
- **Follow `21-web-vue-tailwind.mdc` rule** for standards
- Use **Volar** extension in VS Code for Vue TypeScript support

---

## Common Patterns

### Form Handling
Use `v-model` for two-way binding with TypeScript

### API Calls
Extract to composables (`useApi.ts`, `useUser.ts`)

### Loading States
Always show loading, content, and error states

### Responsive Design
Mobile-first with Tailwind breakpoints

---

## Anti-Patterns

❌ Options API (`data()`, `methods`)  
❌ Custom CSS instead of Tailwind  
❌ Missing TypeScript types  
❌ No `data-testid` attributes  
❌ No loading/error states

---

This command generates production-ready Vue 3 components following all best practices.

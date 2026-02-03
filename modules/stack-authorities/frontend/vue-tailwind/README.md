# Vue.js + Tailwind CSS Stack Authority

**Module ID:** `frontend/vue-tailwind`  
**Type:** Stack Authority (Frontend)  
**Version:** 1.0.0

---

## Overview

This module provides comprehensive standards, commands, and guidance for building modern Vue.js 3 applications with Composition API, TypeScript, and Tailwind CSS.

---

## What's Included

### Rules (1)
- **21-web-vue-tailwind.mdc** - Complete Vue 3 + Tailwind standards
  - Composition API patterns
  - TypeScript integration
  - Component structure
  - Tailwind CSS usage
  - State management (Pinia)
  - Testing standards
  - Accessibility guidelines

### Commands (1)
- **web.vue.build-component** - Generate production-ready Vue components
  - Props/emits setup
  - TypeScript typing
  - Tailwind styling
  - Testing patterns
  - Step-by-step workflow

### Skills (1)
- **vue-component-standards** - Detailed implementation patterns
  - Component structure
  - TypeScript examples
  - Composables patterns
  - Pinia store setup
  - Testing examples
  - Common pitfalls

### Agents (1)
- **web.vue-critic** - Code review specialist
  - Composition API verification
  - TypeScript checking
  - Tailwind CSS review
  - Testability assessment
  - Accessibility audit

---

## Technology Stack

This module supports:
- **Vue.js:** 3.3+ (Composition API)
- **TypeScript:** 5.0+
- **Tailwind CSS:** 3.0+
- **Build Tool:** Vite
- **State Management:** Pinia
- **Router:** Vue Router 4+
- **Testing:** Vitest + Vue Test Utils

---

## Installation

### Using MCP Server

```javascript
install_environment({
  projectPath: "/path/to/your/project",
  selection: {
    enterprise: "",
    controls: ["base"],
    stacks: ["frontend/vue-tailwind"]
  }
})
```

### Manual Installation

```bash
cd your-project/
cp -r ../ai-development/modules/stack-authorities/frontend/vue-tailwind/cursor/* .cursor/
```

---

## Quick Start

### 1. Install Dependencies

```bash
npm create vue@latest
# Select: TypeScript, Vue Router, Pinia, Vitest

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Configure Tailwind

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```css
/* src/assets/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Build Your First Component

```bash
# Use the command
/web.vue.build-component
```

Follow the prompts to create a fully-typed, Tailwind-styled Vue 3 component.

---

## Key Features

### Composition API First
All components use `<script setup>` with Composition API for better TypeScript support and code organization.

### Full TypeScript
Complete type safety with interfaces for props, emits, state, and composables.

### Tailwind CSS
Utility-first styling with minimal custom CSS. Responsive, accessible designs out of the box.

### Reusable Composables
Extract shared logic into composables (`useUser`, `useApi`, etc.) for better code reuse.

### State Management
Pinia stores with TypeScript support for global state management.

### Testing Ready
All components include `data-testid` attributes and follow testable patterns.

---

## Usage Examples

### Basic Component

```bash
/web.vue.build-component
```

Creates a component like:

```vue
<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  title: string;
}

const props = defineProps<Props>();
const count = ref(0);
</script>

<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h2 class="text-xl font-bold">{{ title }}</h2>
    <p class="text-gray-600">Count: {{ count }}</p>
    <button
      @click="count++"
      class="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      data-testid="increment-button"
    >
      Increment
    </button>
  </div>
</template>
```

### With Composable

```typescript
// composables/useCounter.ts
import { ref } from 'vue';

export function useCounter(initial = 0) {
  const count = ref(initial);
  
  function increment() {
    count.value++;
  }
  
  function decrement() {
    count.value--;
  }
  
  return { count, increment, decrement };
}
```

```vue
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter';

const { count, increment, decrement } = useCounter(0);
</script>
```

### With Pinia Store

```typescript
// stores/user.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null);
  const isAuthenticated = computed(() => currentUser.value !== null);
  
  async function login(email, password) {
    // Login logic
  }
  
  return { currentUser, isAuthenticated, login };
});
```

---

## Common Workflows

### Building a Feature

```
1. /std.solution - Frame the feature
2. /std.plan - Plan implementation
3. /web.vue.build-component - Build components
4. /std.clean-sweep - Review code
5. /std.test-loop - Run tests
```

### Code Review

```
1. Write component
2. Invoke web.vue-critic agent for review
3. Address feedback
4. Run tests
5. Commit
```

### Refactoring Options API to Composition API

```
1. Read existing component
2. Apply vue-component-standards skill
3. Convert to <script setup>
4. Add TypeScript types
5. Test functionality
6. Review with web.vue-critic
```

---

## Best Practices

### DO:
✅ Use `<script setup lang="ts">` for all components  
✅ Define TypeScript interfaces for props/emits  
✅ Use Tailwind utilities instead of custom CSS  
✅ Extract shared logic to composables  
✅ Add `data-testid` to interactive elements  
✅ Write unit tests with Vitest  
✅ Follow accessibility guidelines

### DON'T:
❌ Use Options API for new code  
❌ Skip TypeScript types  
❌ Write custom CSS instead of Tailwind  
❌ Mix v-for and v-if on same element  
❌ Forget keys on v-for items  
❌ Skip data-testid attributes

---

## Troubleshooting

### TypeScript Errors in Vue Files
**Solution:** Install Volar extension in VS Code (replaces Vetur)

### Tailwind Classes Not Working
**Solution:** Check `tailwind.config.js` content paths include `.vue` files

### Tests Failing
**Solution:** Ensure using `@vue/test-utils` and proper async handling

### State Not Reactive
**Solution:** Use `ref()` or `reactive()`, access with `.value`

---

## Integration with Other Modules

### Works Best With:
- `backend/node-fastify` - Full JavaScript stack
- `backend/python-fastapi` - Modern Python API
- `database/postgres` - Relational data
- `database/mongodb` - Document store
- `cloud/aws` or `cloud/gcp` or `cloud/azure` - Any cloud

### Cannot Combine With:
- Other frontend frameworks (React, Angular, Next.js)

---

## Examples

See complete example in:
```
examples/vue-fastapi-postgres-aws/
```

(To be created with Initiative 3 updates)

---

## Support

- **Rule:** `.cursor/rules/21-web-vue-tailwind.mdc`
- **Skill:** `.cursor/skills/vue-component-standards/SKILL.md`
- **Command:** Use `/web.vue.build-component`
- **Agent:** Invoke `web.vue-critic` for reviews

---

## Contributing

To extend this module:
1. Add examples to skill references
2. Create additional commands for common patterns
3. Update rule with new patterns
4. Test with real projects

---

**Module Maintained By:** AI Development Standards Team  
**Last Updated:** 2026-01-26

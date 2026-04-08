---
name: modern-frontend-architecture
version: 1.0.0
description: >
  Modern frontend architecture principles: declarative reactive state, component-based design,
  performance optimization, accessibility, design system integration, type safety, and progressive
  enhancement. Use when architecting new frontend applications, refactoring legacy UIs, or
  establishing frontend development standards.
  
  Trigger when user mentions: frontend architecture, modern UI patterns, declarative state,
  component architecture, frontend best practices, UI performance, accessibility standards,
  design system integration, type safety, progressive enhancement, or asks about building
  scalable maintainable UIs.
---

# Modern Frontend Architecture

Use this skill when architecting frontend applications or establishing UI development standards.

## Core Principles

This skill outlines seven foundational principles for building modern, production-grade frontend applications:

1. **Declarative & Reactive State Management**
2. **Component-Based Architecture**
3. **Performance Optimization**
4. **Robust Accessibility (a11y) & Responsiveness**
5. **Design System Integration**
6. **Type Safety and Reliability**
7. **Progressive Enhancement & Lazy Loading**

---

## 1. Declarative & Reactive State Management

### Principle

**The UI is a direct, predictable function of application state, automatically updating when data changes, eliminating manual DOM manipulation.**

### Why It Matters

- **Predictability:** UI always reflects current state (no stale views)
- **Debuggability:** State changes are traceable and reversible
- **Maintainability:** Logic is separated from presentation
- **Testability:** State logic can be tested independently of UI

### Implementation Patterns

#### React: State + Effects

```tsx
// ✅ CORRECT: Declarative reactive state
interface UserDashboardState {
  readonly user: User | null;
  readonly loading: boolean;
  readonly error: string | null;
}

export const UserDashboard = memo(function UserDashboard() {
  const [state, setState] = useState<UserDashboardState>({
    user: null,
    loading: true,
    error: null,
  });

  // Effect reacts to userId changes
  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const user = await api.getUser();
        if (!cancelled) {
          setState({ user, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState({ user: null, loading: false, error: err.message });
        }
      }
    };

    fetchUser();
    return () => { cancelled = true; };
  }, []); // Empty deps: runs once

  // UI is a pure function of state
  if (state.loading) return <LoadingSpinner />;
  if (state.error) return <ErrorMessage message={state.error} />;
  if (!state.user) return <EmptyState />;

  return <UserProfile user={state.user} />;
});
```

#### State Management Libraries

**When to use:**
- **Local state:** `useState`, `useReducer` (component-scoped)
- **Shared state:** Context API (small apps, theme, auth)
- **Global state:** Zustand, Jotai (medium apps, cross-component state)
- **Server state:** TanStack Query (React Query), SWR (API data, caching)
- **Complex state:** Redux Toolkit (large apps, time-travel debugging)

```tsx
// ✅ CORRECT: TanStack Query for server state
import { useQuery } from '@tanstack/react-query';

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

// Usage
export const UserProfile = memo(function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorBoundary error={error} />;
  if (!user) return null;

  return <div>{user.name}</div>;
});
```

### Anti-Patterns

```tsx
// ❌ WRONG: Imperative DOM manipulation
function updateUserName(name: string) {
  document.getElementById('user-name').textContent = name; // Breaks reactivity
}

// ❌ WRONG: Stale closures
const [count, setCount] = useState(0);
useEffect(() => {
  setInterval(() => {
    setCount(count + 1); // Always increments from initial value
  }, 1000);
}, []);

// ✅ CORRECT: Functional setState
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1); // Always gets current value
  }, 1000);
  return () => clearInterval(id);
}, []);
```

---

## 2. Component-Based Architecture

### Principle

**UI is broken into small, reusable, and self-contained components, promoting maintainability, testability, and consistency.**

### Component Hierarchy

```
App (Layout, routing, global providers)
├── Page (Route-level, fetch data, manage page state)
│   ├── Section (Group related components, shared state)
│   │   ├── Widget (Reusable UI block, props-driven)
│   │   │   ├── Control (Button, Input, Select, etc.)
│   │   │   └── Primitive (Icon, Badge, Avatar, etc.)
```

### Component Types

#### 1. Container Components (Smart)

**Purpose:** Fetch data, manage state, handle business logic.

```tsx
// ✅ Container component
export function UserDashboardContainer() {
  const { data: user, isLoading, error } = useUser();
  const [selectedTab, setSelectedTab] = useState<TabId>('overview');

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} />;
  if (!user) return <EmptyState />;

  return (
    <UserDashboard
      user={user}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
    />
  );
}
```

#### 2. Presentational Components (Dumb)

**Purpose:** Render UI based on props, no side effects.

```tsx
// ✅ Presentational component
interface UserDashboardProps {
  readonly user: User;
  readonly selectedTab: TabId;
  readonly onTabChange: (tab: TabId) => void;
}

export const UserDashboard = memo(function UserDashboard({
  user,
  selectedTab,
  onTabChange,
}: UserDashboardProps) {
  return (
    <div className="dashboard">
      <UserHeader user={user} />
      <TabNav selectedTab={selectedTab} onTabChange={onTabChange} />
      <TabContent tab={selectedTab} user={user} />
    </div>
  );
});
```

#### 3. Compound Components

**Purpose:** Components that work together (shared context).

```tsx
// ✅ Compound component pattern
interface TabsContextValue {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({ children, defaultTab }: TabsProps) {
  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const value = useMemo(
    () => ({ selectedTab, onTabChange: setSelectedTab }),
    [selectedTab]
  );

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

Tabs.List = function TabsList({ children }: { children: ReactNode }) {
  return <div className="tabs-list">{children}</div>;
};

Tabs.Tab = function Tab({ value, children }: TabProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tab must be inside Tabs');

  return (
    <button
      className={cn("tab", ctx.selectedTab === value && "tab-active")}
      onClick={() => ctx.onTabChange(value)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function TabPanel({ value, children }: TabPanelProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabPanel must be inside Tabs');
  if (ctx.selectedTab !== value) return null;

  return <div className="tab-panel">{children}</div>;
};

// Usage
<Tabs defaultTab="profile">
  <Tabs.List>
    <Tabs.Tab value="profile">Profile</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="profile"><ProfileView /></Tabs.Panel>
  <Tabs.Panel value="settings"><SettingsView /></Tabs.Panel>
</Tabs>
```

### Component Design Principles

**Single Responsibility:**
- Each component has one clear purpose
- Split components when they do multiple things

**Composition over Inheritance:**
- Build complex UIs by composing simple components
- Use props, children, render props

**Prop-Driven:**
- Component behavior controlled by props
- No hidden state dependencies

**Self-Contained:**
- Component includes all necessary logic and styles
- Minimal external dependencies

---

## 3. Performance Optimization

### Principle

**Efficient rendering techniques (virtual DOM, memoization) and lightweight API responses ensure smooth interactions, minimal layout shifts, and high frame rates.**

### Performance Targets

**MUST meet:**
- **First Contentful Paint (FCP):** < 1.8s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Total Blocking Time (TBT):** < 200ms
- **Cumulative Layout Shift (CLS):** < 0.1
- **Time to Interactive (TTI):** < 3.5s
- **Frame Rate:** 60fps (16.67ms per frame)

### Optimization Techniques

#### 1. Memoization (Prevent Unnecessary Re-renders)

```tsx
// ✅ CORRECT: Memoize expensive computations
export const DataTable = memo(function DataTable({ data, filters }: DataTableProps) {
  // Expensive filtering/sorting only runs when data or filters change
  const filteredData = useMemo(() => {
    return data
      .filter(row => matchesFilters(row, filters))
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [data, filters]);

  return (
    <table>
      {filteredData.map(row => (
        <DataRow key={row.id} row={row} />
      ))}
    </table>
  );
});

// ✅ Memoize callbacks passed to children
export const UserList = memo(function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  const handleDelete = useCallback((userId: string) => {
    setUsers(current => current.filter(u => u.id !== userId));
  }, []); // Empty deps: uses functional setState

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} onDelete={handleDelete} />
      ))}
    </div>
  );
});
```

#### 2. Code Splitting & Lazy Loading

```tsx
// ✅ CORRECT: Lazy load heavy components
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));
const AdminPanel = lazy(() => import('./AdminPanel'));

export function Dashboard({ user }: DashboardProps) {
  return (
    <div>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart data={chartData} />
      </Suspense>

      {user.isAdmin && (
        <Suspense fallback={<AdminSkeleton />}>
          <AdminPanel />
        </Suspense>
      )}
    </div>
  );
}
```

#### 3. Virtualization (Long Lists)

```tsx
// ✅ CORRECT: Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual';

export function VirtualList({ items }: VirtualListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Row height
    overscan: 5, // Render extra rows
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <ListItem item={items[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### 4. Image Optimization

```tsx
// ✅ CORRECT: Optimized images
<img
  src={image.url}
  srcSet={`${image.url}?w=400 400w, ${image.url}?w=800 800w, ${image.url}?w=1200 1200w`}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt={image.alt}
  loading="lazy"
  decoding="async"
  width={image.width}
  height={image.height}
/>
```

#### 5. API Response Optimization

```typescript
// ✅ CORRECT: Lightweight API responses
interface UserListResponse {
  users: Array<{
    id: string;
    name: string;
    avatar: string;
    // Only essential fields
  }>;
  total: number;
  nextCursor: string | null;
}

// ❌ WRONG: Overfetching
interface UserListResponse {
  users: Array<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    bio: string; // Not needed in list view
    preferences: object; // Not needed in list view
    auditLog: object[]; // Not needed in list view
  }>;
}
```

### Performance Monitoring

```typescript
// ✅ Monitor performance in production
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

onCLS(metric => analytics.track('CLS', metric.value));
onFCP(metric => analytics.track('FCP', metric.value));
onLCP(metric => analytics.track('LCP', metric.value));
onTTFB(metric => analytics.track('TTFB', metric.value));
```

---

## 4. Robust Accessibility (a11y) & Responsiveness

### Principle

**Built-in semantic HTML, ARIA labels, and keyboard navigation to meet WCAG standards, supporting diverse devices seamlessly.**

### Accessibility Requirements (WCAG 2.1 Level AA)

#### 1. Semantic HTML

```tsx
// ✅ CORRECT: Semantic HTML
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>
</main>

<footer>
  <p>&copy; 2026 Company</p>
</footer>

// ❌ WRONG: Divitis
<div className="nav">
  <div className="nav-item" onClick={goHome}>Home</div>
  <div className="nav-item" onClick={goAbout}>About</div>
</div>
```

#### 2. Keyboard Navigation

```tsx
// ✅ CORRECT: Full keyboard support
export const Dropdown = memo(function Dropdown({ items, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(i => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(items[focusedIndex]);
        setOpen(false);
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  }, [focusedIndex, items, onSelect]);

  return (
    <div role="combobox" aria-expanded={open} onKeyDown={handleKeyDown}>
      {/* Implementation */}
    </div>
  );
});
```

#### 3. ARIA Attributes

```tsx
// ✅ CORRECT: Proper ARIA usage
<button
  aria-label="Close dialog"
  aria-describedby="dialog-description"
  onClick={onClose}
>
  <CloseIcon aria-hidden="true" />
</button>

<input
  type="text"
  aria-invalid={!!error}
  aria-describedby={error ? "error-message" : undefined}
/>
{error && <div id="error-message" role="alert">{error}</div>}
```

#### 4. Focus Management

```tsx
// ✅ CORRECT: Focus management in modals
export const Modal = memo(function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus first focusable element
      const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();

      // Trap focus
      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        // Focus trap implementation
      };
      document.addEventListener('keydown', handleTab);

      return () => {
        document.removeEventListener('keydown', handleTab);
        // Restore focus
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {children}
    </div>
  );
});
```

#### 5. Color Contrast

```css
/* ✅ CORRECT: WCAG AA compliant (4.5:1 for normal text) */
.text-primary {
  color: #1a1a1a; /* On white: 16.1:1 contrast */
}

.text-secondary {
  color: #525252; /* On white: 7.5:1 contrast */
}

/* ❌ WRONG: Insufficient contrast */
.text-light {
  color: #cccccc; /* On white: 1.6:1 - FAILS */
}
```

### Responsive Design

```tsx
// ✅ CORRECT: Mobile-first responsive design
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4 
  md:gap-6
">
  {items.map(item => (
    <Card key={item.id} item={item} />
  ))}
</div>

// ✅ Responsive images
<picture>
  <source media="(min-width: 1024px)" srcSet={image.large} />
  <source media="(min-width: 768px)" srcSet={image.medium} />
  <img src={image.small} alt={image.alt} />
</picture>
```

---

## 5. Design System Integration

### Principle

**Code aligns with centralized styling (e.g., CSS modules, Tailwind) and tokens, ensuring consistent spacing, typography, and color usage.**

### Design Token Structure

```css
/* theme.css - Design tokens */
:root {
  /* Color palette */
  --color-primary-50: #fef2f2;
  --color-primary-600: #dc2626;
  --color-primary-700: #b91c1c;

  /* Semantic colors */
  --color-background: var(--color-white);
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-border: var(--color-gray-200);

  /* Typography */
  --font-sans: 'Rubik', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;
  
  --text-xs: 0.75rem;   /* 12px */
  --text-sm: 0.875rem;  /* 14px */
  --text-base: 1rem;    /* 16px */
  --text-lg: 1.125rem;  /* 18px */
  --text-xl: 1.25rem;   /* 20px */

  /* Spacing scale (4px base) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */

  /* Border radius */
  --radius-sm: 0.375rem;  /* 6px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

### Component Implementation with Tokens

```tsx
// ✅ CORRECT: Use design tokens
export const Card = memo(function Card({ children }: CardProps) {
  return (
    <div className="
      bg-background 
      border border-border 
      rounded-lg 
      shadow-sm 
      p-6 
      space-y-4
    ">
      {children}
    </div>
  );
});

// ❌ WRONG: Hardcoded values
export const Card = memo(function Card({ children }: CardProps) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '24px',
    }}>
      {children}
    </div>
  );
});
```

### Design System Documentation

**MUST maintain:**
- `docs/design/design-system.md` - Color palette, typography, spacing
- `docs/design/design-patterns.md` - Component patterns and conventions
- `docs/design/design-decisions.md` - Design decision log with rationale

---

## 6. Type Safety and Reliability

### Principle

**Usage of TypeScript or strongly typed languages to prevent errors during development and ensure data consistency.**

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Safety Patterns

#### 1. Domain Types

```typescript
// ✅ CORRECT: Strongly typed domain models
interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: 'admin' | 'user' | 'guest'; // Union type
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ✅ Discriminated unions for state
type AsyncData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function renderUser(state: AsyncData<User>) {
  switch (state.status) {
    case 'idle':
      return null;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <UserProfile user={state.data} />; // TypeScript knows data exists
    case 'error':
      return <ErrorMessage message={state.error} />; // TypeScript knows error exists
  }
}
```

#### 2. API Type Safety

```typescript
// ✅ CORRECT: Type-safe API client
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.string().datetime().transform(s => new Date(s)),
});

type User = z.infer<typeof UserSchema>;

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/api/users/${userId}`);
  const json = await response.json();
  
  // Runtime validation
  return UserSchema.parse(json);
}
```

#### 3. Component Props

```typescript
// ✅ CORRECT: Strictly typed component props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant: 'primary' | 'secondary' | 'ghost';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly loading?: boolean;
  readonly children: React.ReactNode;
}

export const Button = memo(function Button({
  variant,
  size = 'md',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        loading && 'btn-loading'
      )}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
});
```

---

## 7. Progressive Enhancement & Lazy Loading

### Principle

**Loading critical components first to improve perceived performance, with non-critical features loading progressively.**

### Critical Rendering Path

**Priority 1: Above-the-fold (0-800ms)**
- Navigation
- Hero content
- Primary CTA

**Priority 2: Near-viewport (800ms-2s)**
- Secondary content
- Images (lazy loaded)

**Priority 3: Below-the-fold (2s+)**
- Footer
- Analytics
- Non-essential widgets

### Implementation

#### 1. Code Splitting by Route

```tsx
// ✅ CORRECT: Route-level code splitting
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

#### 2. Component-Level Lazy Loading

```tsx
// ✅ CORRECT: Lazy load heavy components
import { lazy, Suspense } from 'react';

const Chart = lazy(() => import('./Chart'));
const DataTable = lazy(() => import('./DataTable'));
const RichTextEditor = lazy(() => import('./RichTextEditor'));

export function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Load immediately */}
      <SummaryCards />

      {/* Load on demand */}
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <Chart data={chartData} />
        </Suspense>
      )}
    </div>
  );
}
```

#### 3. Intersection Observer (Lazy Load on Scroll)

```tsx
// ✅ CORRECT: Load when scrolled into view
export function LazySection({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' } // Load 100px before visible
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? children : <Placeholder />}
    </div>
  );
}
```

#### 4. Preloading Critical Assets

```tsx
// ✅ CORRECT: Preload critical resources
export function App() {
  useEffect(() => {
    // Preload next likely route
    const preloadDashboard = () => import('./pages/Dashboard');
    
    // Preload after idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadDashboard);
    } else {
      setTimeout(preloadDashboard, 1000);
    }
  }, []);

  return <Routes>{/* routes */}</Routes>;
}
```

#### 5. Progressive Image Loading

```tsx
// ✅ CORRECT: Progressive image with blur-up
export const ProgressiveImage = memo(function ProgressiveImage({
  src,
  placeholder,
  alt,
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative">
      {/* Low-res placeholder */}
      <img
        src={placeholder}
        alt=""
        className={cn(
          "absolute inset-0 w-full h-full object-cover",
          "blur-sm transition-opacity duration-300",
          loaded && "opacity-0"
        )}
        aria-hidden="true"
      />
      
      {/* Full-res image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
});
```

---

## Architecture Checklist

When architecting a new frontend application or refactoring existing UI:

### Planning Phase
- [ ] Define state management strategy (local, global, server state)
- [ ] Establish component hierarchy and boundaries
- [ ] Identify performance-critical paths
- [ ] Document accessibility requirements (WCAG level)
- [ ] Define design system tokens and patterns
- [ ] Choose TypeScript configuration (strict mode)
- [ ] Plan code splitting and lazy loading strategy

### Implementation Phase
- [ ] Use declarative reactive state (no manual DOM manipulation)
- [ ] Build component library (presentational + container)
- [ ] Implement memoization (React.memo, useMemo, useCallback)
- [ ] Add code splitting (route-level + component-level)
- [ ] Ensure semantic HTML and ARIA attributes
- [ ] Use design tokens (no hardcoded values)
- [ ] Add TypeScript types for all components and APIs
- [ ] Implement progressive enhancement (critical path first)

### Quality Phase
- [ ] Run performance audit (Lighthouse, Web Vitals)
- [ ] Test keyboard navigation (all interactive elements)
- [ ] Validate WCAG compliance (automated + manual)
- [ ] Check responsive behavior (mobile, tablet, desktop)
- [ ] Verify design system consistency (colors, spacing, typography)
- [ ] Run TypeScript strict mode (no `any`, no type errors)
- [ ] Measure bundle size (code splitting effectiveness)

---

## Anti-Patterns to Avoid

### ❌ State Management
- Imperative DOM manipulation (`document.getElementById`)
- Prop drilling more than 2 levels (use Context or state library)
- Stale closures in hooks (missing dependencies)

### ❌ Component Architecture
- God components (500+ lines, too many responsibilities)
- Premature abstraction (DRY before patterns emerge)
- Coupling components (shared mutable state)

### ❌ Performance
- No memoization on expensive computations
- Rendering entire list (use virtualization for 100+ items)
- Large bundle sizes (no code splitting)
- Blocking main thread (heavy computations in render)

### ❌ Accessibility
- Non-semantic HTML (`<div onClick>` instead of `<button>`)
- Missing keyboard navigation
- Insufficient color contrast
- Missing ARIA labels on custom widgets

### ❌ Design System
- Hardcoded colors/spacing/typography
- Inconsistent component variants
- No design documentation

### ❌ Type Safety
- Using `any` type
- No runtime validation for API responses
- Optional props without defaults

### ❌ Progressive Enhancement
- Loading everything on mount
- No loading states or skeletons
- Not preloading likely next actions

---

## Related Skills

- `react-component-standards` - React-specific component patterns
- `react-tailwind-conventions` - Tailwind CSS conventions
- `heuristic-design-review` - UI usability evaluation
- `engineering-hygiene` - Quality and testing standards
- `teleological-planning` - Planning frontend architecture

---

## References

**Standards:**
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals](https://web.dev/vitals/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

**Project Documentation:**
- `docs/design/design-system.md` - Design tokens and patterns
- `docs/architecture/frontend-architecture.md` - Project-specific patterns

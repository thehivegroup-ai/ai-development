# React Anti-Patterns

Common mistakes in React development and how to fix them.

---

## 1. Inline Function Definitions in JSX

**Bad:**
```tsx
<button onClick={() => handleClick(item.id)}>
  Click
</button>
```

**Why:** Creates new function on every render, causes unnecessary re-renders.

**Good:**
```tsx
const handleItemClick = useCallback(() => handleClick(item.id), [item.id]);
<button onClick={handleItemClick}>Click</button>
```

---

## 2. Missing Keys in Lists

**Bad:**
```tsx
{items.map(item => <div>{item.name}</div>)}
```

**Why:** React can't track items, causes rendering issues.

**Good:**
```tsx
{items.map(item => <div key={item.id}>{item.name}</div>)}
```

---

## 3. Direct State Mutation

**Bad:**
```tsx
const [user, setUser] = useState({ name: 'John' });
user.name = 'Jane'; // WRONG
```

**Why:** React doesn't detect mutation, component doesn't re-render.

**Good:**
```tsx
setUser({ ...user, name: 'Jane' });
// or
setUser(prev => ({ ...prev, name: 'Jane' }));
```

---

## 4. Missing Dependencies in useEffect

**Bad:**
```tsx
useEffect(() => {
  fetchData(userId);
}, []); // userId missing from deps
```

**Why:** Effect doesn't re-run when userId changes, stale data.

**Good:**
```tsx
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

---

## 5. Too Many useState Calls

**Bad:**
```tsx
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
```

**Why:** Hard to manage, many re-renders, verbose updates.

**Good:**
```tsx
const [form, setForm] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
});
```

---

## 6. Prop Drilling

**Bad:**
```tsx
<GrandParent user={user}>
  <Parent user={user}>
    <Child user={user} />
```

**Why:** Props passed through multiple levels that don't use them.

**Good:**
```tsx
// Use Context
const UserContext = createContext();
<UserContext.Provider value={user}>
  <GrandParent><Parent><Child /></Parent></GrandParent>
</UserContext.Provider>
```

---

## 7. Not Memoizing Expensive Computations

**Bad:**
```tsx
function Component({ data }) {
  const processed = expensiveOperation(data); // Runs every render
  return <div>{processed}</div>;
}
```

**Why:** Expensive operation runs on every render.

**Good:**
```tsx
const processed = useMemo(
  () => expensiveOperation(data),
  [data]
);
```

---

## 8. useEffect for Derived State

**Bad:**
```tsx
const [count, setCount] = useState(0);
const [doubleCount, setDoubleCount] = useState(0);

useEffect(() => {
  setDoubleCount(count * 2);
}, [count]);
```

**Why:** Extra re-render, unnecessary state.

**Good:**
```tsx
const [count, setCount] = useState(0);
const doubleCount = count * 2; // Derived, not state
```

---

## 9. Missing data-testid

**Bad:**
```tsx
<button onClick={save}>Save</button>
<input value={name} onChange={handleChange} />
```

**Why:** Tests become fragile, rely on text or classes.

**Good:**
```tsx
<button onClick={save} data-testid="save-button">Save</button>
<input 
  value={name}
  onChange={handleChange}
  data-testid="name-input"
/>
```

---

## 10. Not Handling Loading/Error States

**Bad:**
```tsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  return <div>{user.name}</div>; // Crashes if user is null
}
```

**Why:** No loading state, crashes on error, poor UX.

**Good:**
```tsx
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetchUser(userId)
    .then(setUser)
    .catch(setError)
    .finally(() => setLoading(false));
}, [userId]);

if (loading) return <Loading />;
if (error) return <Error message={error.message} />;
if (!user) return <NotFound />;
return <div>{user.name}</div>;
```

---

## Quick Checklist

Before committing React code:

- [ ] All lists have unique keys
- [ ] No direct state mutation
- [ ] useEffect dependencies complete
- [ ] Loading/error states handled
- [ ] data-testid on interactive elements
- [ ] Expensive computations memoized
- [ ] No prop drilling (use Context)
- [ ] Functions in JSX are memoized
- [ ] Derived state not in useState
- [ ] TypeScript types defined

---

See SKILL.md for complete patterns and examples.

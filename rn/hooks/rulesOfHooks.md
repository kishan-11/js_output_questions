
# 📜 React Rules of Hooks: Common Pitfalls & Interview Gotchas

Hooks are powerful but come with **strict rules**. Violating these rules leads to bugs or broken behavior.  
This guide covers the **Rules of Hooks**, **common pitfalls**, and **interview-style questions**.

---

## ✅ Core Rules of Hooks

### 1. **Only Call Hooks at the Top Level**
- Don’t call hooks inside loops, conditions, or nested functions.
- Ensures hooks are called in the same order on every render.

❌ Wrong:
```jsx
if (isLoggedIn) {
  useEffect(() => {}, []);
}
```

✅ Right:
```jsx
useEffect(() => {
  if (isLoggedIn) {
    // do something
  }
}, [isLoggedIn]);
```

---

### 2. **Only Call Hooks from React Functions**
- Call hooks from:
  - Functional components
  - Custom hooks
- ❌ Not from regular JS functions or class components.

---

## ⚠️ Common Pitfalls

| Mistake | Explanation | Fix |
|--------|-------------|-----|
| Calling hooks conditionally | Order may differ between renders | Always call hooks unconditionally |
| Using hooks inside event handlers or callbacks | Doesn’t persist state between renders | Call hooks only at top level |
| Forgetting hook dependencies | Can cause stale values or infinite loops | Always check dependencies in ESLint |
| Updating state in `useEffect` without condition | Can cause infinite re-renders | Add dependency array |
| Using hooks in class components | Not allowed | Use in functional components only |

---

## 🎯 Example: Infinite Loop with `useEffect`

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  setCount(count + 1); // ❌ causes infinite loop
}, [count]);
```

✅ Fix:
```jsx
useEffect(() => {
  const timer = setTimeout(() => setCount(c => c + 1), 1000);
  return () => clearTimeout(timer);
}, []);
```

---

## 🧠 Interview Gotchas

### Q1: Can you use hooks inside a regular function?
**Answer**: No, only inside functional components or custom hooks.

---

### Q2: Why must hooks always be called at the top level?
**Answer**: React uses the **order of hook calls** to match up state and effects. Conditional calls break this order.

---

### Q3: What happens if you skip a dependency in `useEffect`?
**Answer**: React may use a stale variable. ESLint plugin helps catch this.

---

### Q4: Can custom hooks call other hooks?
**Answer**: ✅ Yes, that’s how they work. They’re just functions that use built-in hooks inside.

---

### Q5: Why does calling `useState` in a loop fail?
**Answer**: Because hook call order becomes inconsistent across renders.

---

## 🧠 Best Practices

- Use the [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- Keep hooks at the top level
- Break out logic into custom hooks for clarity
- Use `useCallback`/`useMemo` to prevent unnecessary computations
- Test custom hooks as standalone units

---


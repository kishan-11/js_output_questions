
# 🔁 React `useCallback` In-Depth Guide

`useCallback` is a Hook that returns a **memoized version of a callback function**.  
It is useful to prevent unnecessary re-creation of functions, especially when passing callbacks to child components.

---

## 📌 Syntax

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

- `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`

---

## 🧪 Basic Example

```jsx
import { useCallback, useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <button onClick={increment}>Increment</button>;
}
```

---

## 🧠 Preventing Unnecessary Renders with React.memo

```jsx
const Button = React.memo(({ onClick, label }) => {
  console.log("Rendering:", label);
  return <button onClick={onClick}>{label}</button>;
});

function App() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <Button onClick={handleClick} label="Click me" />;
}
```

Without `useCallback`, the `onClick` function would be re-created every render, causing `Button` to re-render even if props don’t change.

---

## 🧪 useCallback vs useMemo

| Feature | `useCallback` | `useMemo` |
|---------|---------------|-----------|
| Returns | Function       | Value     |
| Use for | Event handlers | Computed values |

---

## ⚠️ Common Mistakes

| Mistake | Why it's wrong | Fix |
|--------|----------------|-----|
| Overusing useCallback | Adds unnecessary complexity | Use only when performance matters |
| Missing dependencies | Causes stale values | Always include variables used inside the callback |
| Expecting it to stop re-renders | Only helps if used with `React.memo` | Combine with `React.memo` |

---

## 🧠 Best Practices

- Use `useCallback` to memoize event handlers passed to child components
- Use with `React.memo` to prevent unnecessary child renders
- Avoid using for local functions not passed as props

---

## 🔂 Advanced: Stable Function References for Custom Hooks

```jsx
const fetchData = useCallback(async () => {
  const res = await fetch(url);
  const data = await res.json();
  setData(data);
}, [url]);
```

---


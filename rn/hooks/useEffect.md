
# ⚙️ React `useEffect` In-Depth Guide

`useEffect` is a Hook that lets you perform **side effects** in functional components. It replaces lifecycle methods like `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.

---

## 📌 Syntax

```jsx
useEffect(() => {
  // Side effect code
  return () => {
    // Optional cleanup
  };
}, [dependencies]);
```

---

## 🧪 Basic Example

```jsx
import { useEffect, useState } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, []); // run once on mount
}
```

---

## 📦 Dependency Array

The second argument controls **when the effect runs**:

| Dependency Array | When it runs |
|------------------|--------------|
| `[]`             | Once after initial render (like `componentDidMount`) |
| `[a, b]`         | On initial render and when `a` or `b` change |
| *(omitted)*      | Runs after every render (can cause performance issues) |

---

## 🧼 Cleanup Function

- Returned function runs when:
  - Component unmounts
  - Before running the effect again (if dependencies change)

```jsx
useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

---

## ⏱ useEffect vs setInterval/setTimeout

```jsx
useEffect(() => {
  const timer = setTimeout(() => {
    alert("Hello");
  }, 1000);
  return () => clearTimeout(timer);
}, []);
```

---

## 🔄 useEffect and Props/State Changes

```jsx
useEffect(() => {
  // React to prop/state change
  console.log("User changed:", user);
}, [user]);
```

---

## 🔁 Chaining Multiple Effects

```jsx
useEffect(() => {
  console.log("Runs when 'a' changes");
}, [a]);

useEffect(() => {
  console.log("Runs when 'b' changes");
}, [b]);
```

---

## ⚠️ Common Mistakes

| Mistake | Why it’s wrong | Fix |
|--------|----------------|-----|
| Missing dependencies | Can cause stale values or bugs | Add all used vars to dependency array |
| Unnecessary dependencies | Can cause excessive rerenders | Memoize or restructure effect |
| No cleanup for listeners/timers | Can lead to memory leaks | Always return a cleanup function |

---

## 🧠 Best Practices

- Always list all external variables in the dependency array (or use `eslint-plugin-react-hooks`)
- Cleanup timers, subscriptions, or event listeners
- Use multiple `useEffect` calls for logically separate effects
- Prefer using `useMemo` or `useCallback` to avoid unnecessary reruns

---

## 🧪 Advanced: useEffect + Async

You can’t make `useEffect` callback async directly, but you can do this:

```jsx
useEffect(() => {
  async function fetchData() {
    const res = await fetch(...);
    const data = await res.json();
    setData(data);
  }
  fetchData();
}, []);
```


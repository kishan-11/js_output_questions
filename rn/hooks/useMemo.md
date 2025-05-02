
# 🧠 React `useMemo` In-Depth Guide

`useMemo` is a Hook that lets you **memoize** the result of a **computation** to avoid unnecessary recalculations on every render.

---

## 📌 Syntax

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

- Returns a memoized result of the function
- Recomputes only when one of the dependencies changes

---

## 🧪 Basic Example

```jsx
import { useMemo } from 'react';

function ExpensiveComponent({ number }) {
  const squared = useMemo(() => {
    console.log("Calculating square...");
    return number * number;
  }, [number]);

  return <p>{number} squared is {squared}</p>;
}
```

---

## ⚡ When to Use `useMemo`

- Expensive computations (e.g., filtering, sorting, heavy math)
- Deriving data from props or state
- Preventing unnecessary re-renders when value doesn’t change

---

## 📉 Example: Expensive Computation

```jsx
function slowFunction(num) {
  for (let i = 0; i < 1e9; i++) {} // simulate delay
  return num * 2;
}

function App({ number }) {
  const result = useMemo(() => slowFunction(number), [number]);
  return <div>{result}</div>;
}
```

---

## 📦 useMemo vs useCallback

| Feature       | `useMemo`                                      | `useCallback`                     |
|---------------|------------------------------------------------|-----------------------------------|
| Returns       | **Memoized value**                             | **Memoized function**             |
| Used for      | Avoiding expensive recalculations              | Preventing unnecessary function re-creations |
| Common use    | Derived data                                   | Memoized event handlers           |

---

## 🧠 useMemo + React.memo Combo

```jsx
const List = React.memo(({ items }) => {
  return items.map(item => <div key={item}>{item}</div>);
});

function Parent({ data }) {
  const filtered = useMemo(() => {
    return data.filter(item => item.active);
  }, [data]);

  return <List items={filtered} />;
}
```

---

## ⚠️ Common Mistakes

| Mistake | Why it’s wrong | Fix |
|--------|----------------|-----|
| Using useMemo everywhere | Adds complexity without gain | Use only for **expensive** computations |
| Forgetting dependencies | Causes stale values | Always list all variables used inside the callback |
| Expecting it to “cache” UI | Only caches **computed values** | Doesn’t prevent component re-renders |

---

## 🧠 Best Practices

- Use `useMemo` **only** when performance is a concern
- Combine with `React.memo` for optimizing child renders
- Avoid using it for simple expressions or constant values
- Always specify accurate dependencies

---

## 🧪 Alternative for Constants

```jsx
const CONSTANT_VALUE = useMemo(() => computeOnce(), []);
```

---


# 🧭 React `useRef` In-Depth Guide

`useRef` is a Hook that lets you persist **mutable values** across renders without causing re-renders. It’s also commonly used to **access DOM elements** directly.

---

## 📌 Syntax

```jsx
const refContainer = useRef(initialValue);
```

- `refContainer.current` holds the value
- Doesn’t trigger re-renders when changed

---

## 📦 Basic Example: Accessing DOM Elements

```jsx
import { useRef, useEffect } from 'react';

function InputFocus() {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} />;
}
```

---

## 🔄 Persisting Values Between Renders

```jsx
function Timer() {
  const count = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      count.current += 1;
      console.log(count.current);
    }, 1000);
    return () => clearInterval(id);
  }, []);
}
```

- `useRef` is perfect for storing **non-render-affecting values**.

---

## 🧪 useRef vs useState

| Feature | `useState` | `useRef` |
|--------|------------|----------|
| Triggers re-render on change | ✅ Yes | ❌ No |
| Used for UI data | ✅ Yes | ❌ No |
| Used for timers, instance vars | ❌ No | ✅ Yes |
| DOM access | ❌ No | ✅ Yes |

---

## 🧠 Common Use Cases

### 1. Accessing DOM nodes
```jsx
const inputRef = useRef();
<input ref={inputRef} />;
```

### 2. Tracking values without causing re-renders
```jsx
const renderCount = useRef(0);
useEffect(() => {
  renderCount.current += 1;
});
```

### 3. Storing interval or timeout IDs
```jsx
const intervalId = useRef();
intervalId.current = setInterval(...);
```

### 4. Integrating with third-party libraries
```jsx
useEffect(() => {
  thirdPartyLib.attach(containerRef.current);
}, []);
```

---

## ⚠️ Common Mistakes

| Mistake | Why it’s wrong | Fix |
|--------|----------------|-----|
| Expecting updates to trigger render | `useRef` doesn’t do that | Use `useState` if UI needs to update |
| Not initializing refs properly | `current` will be undefined | Always define with `useRef()` |
| Overusing `useRef` for state logic | Can become hard to trace | Prefer `useState` unless you want to avoid re-render |

---

## 🧠 Best Practices

- Use `useRef` for non-render-affecting values
- Avoid using `useRef` as a substitute for controlled state
- Useful for DOM access, timers, keeping previous values


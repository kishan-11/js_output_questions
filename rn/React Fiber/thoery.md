# React Fiber Architecture: Guide & Examples

React Fiber is the reconciliation engine introduced in React 16. It’s a complete rewrite of the core algorithm that enables better scheduling of rendering tasks.

---

## 🧠 Core Concepts of React Fiber

### 1. **Work Units (Fibers)**

- The rendering work is split into small units called _fibers_.
- Each fiber is a JavaScript object representing a component and its state.

### 2. **Prioritization**

- Fiber allows assigning **different priorities** to updates (e.g., high-priority user interactions vs. low-priority data fetches).

### 3. **Incremental Rendering (Time Slicing)**

- Work can be **paused, aborted, and resumed**.
- Makes React more responsive by yielding to high-priority work like user input.

### 4. **Better Error Boundaries**

- Fiber provides improved mechanisms to catch and recover from errors during rendering.

---

## ⚡ High-Priority Updates

Using hooks like `useTransition`, developers can explicitly mark certain updates as lower priority.

```jsx
const [isPending, startTransition] = useTransition();

startTransition(() => {
  // This update is low-priority
  setShowList(true);
});
```

Updates **outside** of `startTransition` (like clicks or typing) are treated as **urgent**.

---

## ⏱️ Incremental Rendering Example

```jsx
import React, { useState, useTransition } from "react";

function ExpensiveList() {
  const items = Array.from({ length: 10000 }, (_, i) => (
    <div key={i}>Item {i}</div>
  ));
  return <div>{items}</div>;
}

export default function App() {
  const [showList, setShowList] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      setShowList(true);
    });
  };

  return (
    <div>
      <h1>Fiber Demo: Time Slicing</h1>
      <button onClick={handleClick}>Show Expensive List</button>
      {isPending && <p>Loading...</p>}
      {showList && <ExpensiveList />}
    </div>
  );
}
```

---

## ❌ Will Incremental Rendering Slow Down React?

**No**, because:

- Fiber ensures DOM changes are batched together.
- Pausing/resuming happens **before** committing to the DOM.
- Only one commit happens, not multiple real DOM operations.

---

## 🛠️ Better Error Boundaries Example

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught by boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>;
```

---

## 📚 Summary

| Feature          | Description                                |
| ---------------- | ------------------------------------------ |
| Work Units       | Break rendering into discrete chunks       |
| Prioritization   | Handle urgent updates before deferred ones |
| Time Slicing     | Allows pausing/resuming rendering          |
| Error Boundaries | Catch render-time exceptions gracefully    |

React Fiber brings the architecture to make apps more fluid, interruptible, and responsive under load.

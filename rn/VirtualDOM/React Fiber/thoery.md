# React Fiber Architecture: Guide & Examples

React Fiber is the reconciliation engine introduced in React 16. It's a complete rewrite of the core algorithm that enables better scheduling of rendering tasks.

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

## 🔄 Concurrent Features

React Fiber enables several powerful concurrent features:

### Suspense
- Allows components to "wait" for something before rendering
- Can be used for data fetching, code splitting, and more
```jsx
<Suspense fallback={<LoadingSpinner />}>
  <MyComponent />
</Suspense>
```

### Automatic Batching
- React automatically batches multiple state updates into a single render
- Improves performance by reducing unnecessary re-renders

### Concurrent Mode
- Enables React to work on multiple versions of the UI simultaneously
- Helps maintain responsiveness during heavy rendering tasks

## 🌳 Fiber Tree Structure

- Each component instance has a corresponding Fiber node
- Forms a tree structure similar to the component tree
- Contains information about:
  - Component type
  - Props
  - State
  - Child relationships
  - Side effects to perform

## 📊 Performance Benefits

### Measurable Improvements
- Up to 50% reduction in time to interactive (TTI)
- Better handling of large lists and complex UIs
- Smoother animations and transitions
- Reduced main thread blocking

### Key Metrics
- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

## 🔍 Debugging with Fiber

### React DevTools
- Visualize the Fiber tree
- Inspect component props and state
- Profile component renders
- Track component updates

### Performance Profiling
```jsx
// Enable profiling in development
import { Profiler } from 'react';

<Profiler id="MyComponent" onRender={callback}>
  <MyComponent />
</Profiler>
```

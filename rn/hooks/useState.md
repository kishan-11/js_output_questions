
# 🔧 React `useState` In-Depth Guide

`useState` is a Hook that lets you add **state variables** to functional components in React.

---

## 📌 Syntax

```jsx
const [state, setState] = useState(initialValue);
```

- `state`: the current state value
- `setState`: function to update the state
- `initialValue`: the initial state, can be any type (number, string, object, etc.)

---

## 🧪 Basic Example

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## 🔄 Updating State

### ✅ Correct
```jsx
setCount(prevCount => prevCount + 1);
```

### ❌ Incorrect (if relying on previous state)
```jsx
setCount(count + 1); // May be stale in async updates
```

---

## 🧠 Initial State from Function

You can pass a function to `useState` to compute the initial state **lazily**, which is run **only once** on initial render.

```jsx
const [value, setValue] = useState(() => expensiveComputation());
```

Equivalent to:
```jsx
function lazyInitialState() {
  return expensiveComputation();
}
const [value, setValue] = useState(lazyInitialState);
```

✅ Best practice when initial value is expensive to compute.

---

## 📦 Using Objects in State

```jsx
const [user, setUser] = useState({ name: "John", age: 25 });

function updateName() {
  setUser(prev => ({ ...prev, name: "Jane" }));
}
```

❗ Always **spread the previous state** to preserve unchanged fields.

---

## 🧮 useState with Arrays

```jsx
const [items, setItems] = useState([]);

function addItem(newItem) {
  setItems(prev => [...prev, newItem]);
}
```

---

## 🧪 useState with Boolean

```jsx
const [isVisible, setIsVisible] = useState(false);

function toggleVisibility() {
  setIsVisible(prev => !prev);
}
```

---

## 🧵 useState with Multiple Values

Use multiple `useState` calls instead of a single object if fields are independent:

```jsx
const [name, setName] = useState('');
const [age, setAge] = useState(0);
```

---

## 🔁 Resetting State

```jsx
setCount(0); // reset to initial value
```

To reset to default from props or other source:
```jsx
useEffect(() => {
  setCount(initialValue);
}, [initialValue]);
```

---

## ⚠️ Common Mistakes

| Mistake | Why it’s wrong | Fix |
|--------|----------------|-----|
| Direct mutation (`state.name = "new"`) | Doesn’t trigger re-render | Use `setState({...})` |
| Not using functional update | Causes stale values in async updates | Use `setState(prev => ...)` |
| Not lazy-initializing expensive state | Unnecessary computation on every render | Use `useState(() => expensiveFn())` |

---

## 🧠 Best Practices

- Use functional update when the next state depends on the previous one
- Use lazy initialization if computing initial state is costly
- Avoid grouping unrelated state into one object
- Never mutate state directly


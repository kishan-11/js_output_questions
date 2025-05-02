
# React: Props vs State (with Functional Components)

This document explores the core differences between `props` and `state` in React with practical examples and common mistakes to avoid.

---

## ✅ What Are Props?

### 🔹 Definition:
**Props** (short for "properties") are **read-only** inputs to a component. They are passed down from a **parent component** to a **child component**.

### 🔹 Example:
```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage
<Greeting name="Kishan" />
```

### 🔹 Characteristics:
- Immutable within the component
- Passed from parent → child
- Can be of any data type (string, object, function, etc.)

### ⚠️ Common Mistakes with Props:

#### 1. ❌ Trying to modify props:
```jsx
function User(props) {
  props.name = "New Name"; // ❌ Illegal
  return <p>{props.name}</p>;
}
```
✅ **Fix**: Never mutate props. Use `state` instead.

#### 2. ❌ Forgetting to use destructuring:
```jsx
function Welcome(props) {
  return <h1>Hi, {props.name}</h1>;
}

// Better:
function Welcome({ name }) {
  return <h1>Hi, {name}</h1>;
}
```

---

## ✅ What Is State?

### 🔹 Definition:
**State** is a built-in object that holds data that **can change over time**. It is **local** and **controlled by the component**.

### 🔹 Example:
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  );
}
```

### 🔹 Characteristics:
- Mutable within the component
- Triggers a re-render when changed
- Defined using `useState(initialValue)`

### ⚠️ Common Mistakes with State:

#### 1. ❌ Mutating state directly:
```jsx
const [user, setUser] = useState({ name: "Alice" });

// Wrong:
user.name = "Bob"; // ❌ This won't trigger a re-render
```
✅ **Fix**:
```jsx
setUser({ ...user, name: "Bob" });
```

#### 2. ❌ Forgetting that state updates are async:
```jsx
const [count, setCount] = useState(0);

// Wrong:
setCount(count + 1);
console.log(count); // ❌ Will still log 0
```
✅ **Fix**:
```jsx
setCount(prev => prev + 1);
```

#### 3. ❌ Initial state depends on props (without lazy init):
```jsx
function Example({ initial }) {
  const [count, setCount] = useState(initial); // ❌ Traps the initial value
}
```
✅ **Fix**:
```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  setCount(initial);
}, [initial]);
```

---

## 🔄 Summary Table

| Feature     | Props                            | State                          |
|-------------|----------------------------------|--------------------------------|
| Mutable?    | ❌ No                            | ✅ Yes                         |
| Source      | Parent Component                 | The Component itself           |
| Purpose     | Configuration, data input        | Internal data, interactivity   |
| Trigger rerender? | ✅ Yes                    | ✅ Yes                         |
| How to change | Parent must update the prop    | Use `setState` or `useState`   |

---

## 🧠 Best Practices

| ✅ Do | ❌ Don’t |
|------|----------|
| Use props to pass data to child components | Modify props inside a child |
| Use state for internal component data | Directly mutate state |
| Use `useEffect` to react to prop changes | Assume prop updates auto-refresh state |
| Destructure props in function params | Repeatedly access `props.propName` |


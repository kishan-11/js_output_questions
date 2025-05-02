# React Components: Functional vs Class

This document explains the difference between Functional and Class components in React.

---

## 🔹 1. Syntax

### Functional Component
Written as a **JavaScript function**:
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

### Class Component
Written as a **JavaScript class**:
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

---

## 🔹 2. State Management

### Functional Component (using Hooks)
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

### Class Component
```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

---

## 🔹 3. Lifecycle Methods

### Functional Component
Uses `useEffect`:
```jsx
useEffect(() => {
  // componentDidMount + componentDidUpdate
  return () => {
    // componentWillUnmount
  };
}, [dependencies]);
```

### Class Component
Uses lifecycle methods:
```jsx
componentDidMount() { ... }
componentDidUpdate(prevProps, prevState) { ... }
componentWillUnmount() { ... }
```

---

## 🔹 4. 'this' Keyword

- **Functional**: No `this` keyword.
- **Class**: Uses `this` for state, props, methods.

---

## 🔹 5. Readability and Preference

- **Functional**: More concise and modern (with Hooks).
- **Class**: More verbose, legacy style.

---

## 🔹 6. Performance

Modern React offers **similar performance** for both component types.

---
---

## ✅ Summary Table

| Feature                    | Functional Component                                    | Class Component                              |
|---------------------------|----------------------------------------------------------|-----------------------------------------------|
| Syntax                    | Function                                                 | Class                                         |
| State                     | `useState()`                                             | `this.state`                                  |
| Lifecycle                 | `useEffect()`                                            | Lifecycle methods                             |
| `this` keyword            | Not used                                                 | Required                                      |
| Readability               | Concise, modern with Hooks                               | Verbose, legacy style                         |
| Performance               | Comparable                                               | Comparable                                    |
| Ref Handling              | `useImperativeHandle` + `forwardRef` needed              | Methods accessible via component instance     |
| Preferred in Modern React | ✅ Yes                                                    | Legacy but still supported                    |


# 🔄 React `useReducer` In-Depth Guide

`useReducer` is a Hook used to manage **more complex state logic** in React functional components.  
It’s an alternative to `useState`, especially when state depends on previous values or involves multiple sub-values.

---

## 📌 Syntax

```jsx
const [state, dispatch] = useReducer(reducer, initialArg, init?);
```

- `reducer`: A function `(state, action) => newState`
- `initialArg`: The initial state value
- `init`: Optional function to lazily initialize state

---

## 🧪 Basic Example

```jsx
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
```

---

## ⚙️ When to Use `useReducer`

- State transitions are complex (many sub-values)
- The next state depends on the previous one
- Better state organization in large components
- You want Redux-like structure

---

## 🧠 Lazy Initialization with `init`

```jsx
function init(initialCount) {
  return { count: initialCount };
}

const [state, dispatch] = useReducer(reducer, 0, init);
```

---

## 🎯 Dispatching Actions

Actions are plain objects:
```js
{ type: 'increment' }
{ type: 'setName', payload: 'Alice' }
```

Use constants or enums for action types to reduce bugs:
```js
const INCREMENT = 'increment';
```

---

## 🧩 useReducer vs useState

| Feature         | `useState`        | `useReducer`                      |
|----------------|-------------------|-----------------------------------|
| Simpler state  | ✅ Preferred       | ❌ Overkill                        |
| Complex logic  | ❌ Harder          | ✅ Better suited                   |
| Predictable    | ❌ Less explicit   | ✅ Centralized logic (pure reducer) |
| State shape    | Single value       | Object with multiple fields       |

---

## 🔁 useReducer + useContext = Global State Pattern

```jsx
const CountContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <CountContext.Provider value={{ state, dispatch }}>
      <Counter />
    </CountContext.Provider>
  );
}
```

Access via `useContext(CountContext)` in child components.

---

## ⚠️ Common Mistakes

| Mistake | Why it's wrong | Fix |
|--------|----------------|-----|
| Mutating state directly | Breaks immutability | Always return a new state object |
| Complex reducer logic | Hard to test and maintain | Keep reducer pure and minimal |
| Forgetting default case | May return `undefined` | Always handle unknown actions |

---

## 🧠 Best Practices

- Keep the reducer pure (no side effects)
- Use `init` for lazy state setup
- Use `switch` or lookup maps to handle action types
- Use `useReducer` when logic would clutter `useState`

---


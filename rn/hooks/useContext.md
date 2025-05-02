
# 🌐 React `useContext` In-Depth Guide

`useContext` is a Hook that lets you access values from a React Context directly in functional components, **without using a Consumer wrapper**.

---

## 📌 Syntax

```jsx
const value = useContext(MyContext);
```

---

## 🧪 Step-by-Step Example

### 1. Create a Context
```jsx
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

---

### 2. Provide the Context

```jsx
<ThemeContext.Provider value="dark">
  <MyComponent />
</ThemeContext.Provider>
```

---

### 3. Consume the Context

```jsx
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Current theme: {theme}</div>;
}
```

---

## 📦 Sharing State Across Components

```jsx
const UserContext = createContext();

function App() {
  const [user, setUser] = useState("Alice");

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Profile />
    </UserContext.Provider>
  );
}

function Profile() {
  const { user, setUser } = useContext(UserContext);
  return (
    <>
      <p>User: {user}</p>
      <button onClick={() => setUser("Bob")}>Switch User</button>
    </>
  );
}
```

---

## 🧠 useContext vs Prop Drilling

| Technique      | Description |
|----------------|-------------|
| Prop Drilling  | Passing props down through multiple levels |
| useContext     | Direct access from any nested component, without prop passing |

---

## ⚠️ Common Mistakes

| Mistake | Why it's wrong | Fix |
|--------|----------------|-----|
| Using useContext outside Provider | Context will return `undefined` or default | Always wrap consumers in a Provider |
| Mutating context value directly | Can lead to bugs | Use state setters or reducer |
| Re-creating value on every render | Causes unnecessary re-renders | Use `useMemo` to memoize context value |

---

## 🧠 Best Practices

- Define contexts outside components to avoid recreation
- Group related values into one context value object
- Use `useMemo` for complex objects/functions as context value
- Split into multiple contexts if values update independently

---

## 🧪 Bonus: Context with Reducer

```jsx
const CountContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <CountContext.Provider value={{ state, dispatch }}>
      <Counter />
    </CountContext.Provider>
  );
}

function Counter() {
  const { state, dispatch } = useContext(CountContext);
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
    </>
  );
}
```

---


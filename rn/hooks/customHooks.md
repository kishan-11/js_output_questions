
# 🛠️ React Custom Hooks: Abstraction & Reusability

**Custom Hooks** are JavaScript functions whose names start with "`use`" and that may call other Hooks.  
They help extract and reuse **stateful logic** between components.

---

## 📌 Why Custom Hooks?

- **Abstraction**: Encapsulate complex logic in a reusable, testable function
- **Reusability**: Share logic across multiple components without duplication
- **Cleaner Components**: Reduce clutter and improve maintainability

---

## 🧪 Basic Syntax

```jsx
function useCustomHook() {
  const [state, setState] = useState(initialValue);

  // logic...

  return { state, setState };
}
```

---

## 🧠 Example: useWindowWidth Hook

```jsx
import { useState, useEffect } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}
```

**Usage:**
```jsx
function MyComponent() {
  const width = useWindowWidth();
  return <p>Window width: {width}px</p>;
}
```

---

## 📦 Reusability in Practice

Instead of repeating this pattern in every component:

```jsx
useEffect(() => {
  const id = setInterval(...);
  return () => clearInterval(id);
}, []);
```

Create a custom hook:
```jsx
function useInterval(callback, delay) {
  useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
}
```

---

## ⚙️ Composing Hooks

Custom hooks can **use other hooks**, including built-in and other custom hooks.

```jsx
function useAuth() {
  const user = useContext(AuthContext);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (user) {
      fetchToken(user.id).then(setToken);
    }
  }, [user]);

  return { user, token };
}
```

---

## ✅ Benefits of Custom Hooks

| Benefit         | Explanation                                  |
|----------------|----------------------------------------------|
| Abstraction     | Encapsulates logic away from UI             |
| Reusability     | Use the same logic in multiple components   |
| Testability     | Easy to unit test as pure functions         |
| Readability     | Keeps components focused and clean          |

---

## ⚠️ Common Mistakes

| Mistake | Why it’s wrong | Fix |
|--------|----------------|-----|
| Not starting name with `use` | Breaks hook rules | Always start custom hooks with `use` |
| Calling hook conditionally | Violates hook rules | Call hooks at the top level |
| Putting UI inside custom hook | Breaks separation of concerns | Return data/functions, not JSX |

---

## 🧠 Best Practices

- Prefix with `use`
- Return an object or array for clarity
- Isolate side effects
- Keep hooks focused and composable
- Document input/output clearly

---


# 🧩 React Render Props Pattern

**Render Props** is a React pattern where a component’s child is a function that returns JSX.  
It allows components to **share logic via function-as-child**, offering flexibility similar to HOCs or hooks.

---

## 📌 What Is a Render Prop?

> A render prop is a function prop that a component uses to know what to render.

---

## 🧪 Basic Example

```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return render(position);
}
```

### ✅ Usage

```jsx
<MouseTracker render={({ x, y }) => (
  <p>Mouse position: {x}, {y}</p>
)} />
```

---

## 📦 Common Use Cases

| Use Case            | Description                     |
|---------------------|---------------------------------|
| Shared logic        | Reuse logic across components   |
| Component flexibility | Let consumers control rendering |
| UI customization    | Without losing encapsulation    |

---

## 🎯 Real-World Example: Toggle

```jsx
function Toggle({ children }) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(prev => !prev);

  return children({ on, toggle });
}
```

### ✅ Usage

```jsx
<Toggle>
  {({ on, toggle }) => (
    <>
      <button onClick={toggle}>{on ? "ON" : "OFF"}</button>
      {on && <p>The toggle is ON</p>}
    </>
  )}
</Toggle>
```

---

## ⚖️ Render Props vs HOC vs Hooks

| Pattern        | Use Case                            |
|----------------|-------------------------------------|
| Render Props   | Explicit rendering control via child function |
| HOC            | Inject props via wrapped component  |
| Hook           | Best for logic reuse in functional components |

---

## ⚠️ Common Pitfalls

| Mistake | Why it’s problematic | Fix |
|--------|------------------------|-----|
| Over-nesting | Too many render props = messy JSX | Use custom hooks or HOCs if simpler |
| Breaking component boundary | Expose too much internals | Return only needed values in render prop |
| Not memoizing | Can lead to unnecessary re-renders | Use `React.memo` or `useCallback` if needed |

---

## 🧠 Best Practices

- Name the prop clearly (`render`, `children`, `getContent`)
- Keep render logic clean and scoped
- Use when you need maximum flexibility in rendering UI
- Prefer hooks in modern React, but render props remain powerful

---


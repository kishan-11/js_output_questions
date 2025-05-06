
# 🧠 React.memo In-Depth Guide

`React.memo` is a **higher-order component** that **memoizes** the rendered output of a functional component.  
It helps prevent **unnecessary re-renders** when the component receives the same props.

---

## 📌 Syntax

```jsx
const MemoizedComponent = React.memo(MyComponent);
```

- `MyComponent` will only re-render if its props change (based on a **shallow comparison**)

---

## 🧪 Basic Example

```jsx
const Greeting = React.memo(function Greeting({ name }) {
  console.log("Rendering Greeting");
  return <h1>Hello, {name}</h1>;
});
```

```jsx
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Greeting name="Kishan" />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  );
}
```

✅ `Greeting` won’t re-render when `count` changes, because its props haven't changed.

---

## ⚙️ Custom Comparison Function

By default, `React.memo` uses **shallow comparison** between previous and next props.

You can customize it by passing a **comparison function** as the second argument:

```jsx
const MemoComponent = React.memo(MyComponent, (prevProps, nextProps) => {
  // return true to skip render (props are equal)
  // return false to allow re-render (props are different)
  return prevProps.value === nextProps.value;
});
```

### 🔹 What should it return?
- `true` ➝ **skip re-render** (props considered equal)
- `false` ➝ **re-render** (props considered different)

This gives you **fine-grained control** over when a component should update.

Use this when:
- Comparing deep objects
- Props contain functions or arrays that stay logically the same but differ by reference

---

## 📦 When to Use `React.memo`

| Use Case                        | Explanation |
|----------------------------------|-------------|
| Functional components receiving props | Only re-render when necessary |
| Component output is **pure**    | Same input = same output |
| Parent re-renders often          | Avoid child re-render overhead |
| Component is expensive to render | Reduce rendering cost |

---

## ⚠️ Common Pitfalls

| Mistake | Problem | Fix |
|--------|---------|-----|
| Inline functions/objects in props | Triggers re-render due to new reference | Use `useCallback` / `useMemo` |
| Mutating props | Breaks shallow comparison | Keep props immutable |
| Misunderstanding shallow comparison | Objects and arrays are reference-checked | Pass stable props |

---

## 🧪 Example with `useCallback`

```jsx
const handleClick = useCallback(() => {
  console.log("Clicked");
}, []);

<MemoizedButton onClick={handleClick} />
```

---

## 🧠 Best Practices

- Only wrap **pure**, stateless UI components
- Use with `useCallback` and `useMemo` for best results
- Don’t overuse: unnecessary memoization can hurt performance
- Measure before optimizing (`React.memo` is not always faster)

---

## 🔄 React.memo vs useMemo

| Feature      | `React.memo`                   | `useMemo`                      |
|--------------|--------------------------------|--------------------------------|
| Used on      | Components                     | Computed values                |
| Type         | Higher-order component         | Hook                           |
| Purpose      | Avoid re-rendering             | Avoid recomputation            |

---


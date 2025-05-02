
# 🛠️ React `useImperativeHandle` In-Depth Guide

`useImperativeHandle` is a React Hook that lets you **customize the ref exposure** of a component.  
It’s used with `forwardRef` to allow a parent component to **access specific methods or values** on a child component.

---

## 📌 Syntax

```jsx
useImperativeHandle(ref, () => ({
  method1,
  method2,
}), [dependencies]);
```

- `ref`: The forwarded ref from the parent
- Function returns an object of values/methods exposed to parent
- Re-evaluated only when dependencies change

---

## ⚙️ Required Setup: `forwardRef`

You **must** use `forwardRef` to use `useImperativeHandle`.

---

## 🧪 Basic Example

### 1. Child Component (Exposing Methods)

```jsx
import { useImperativeHandle, forwardRef, useRef } from 'react';

const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = '';
    }
  }));

  return <input ref={inputRef} />;
});
```

---

### 2. Parent Component (Using Ref)

```jsx
function Parent() {
  const inputRef = useRef();

  return (
    <>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.clear()}>Clear</button>
    </>
  );
}
```

---

## 📦 Common Use Cases

- Custom input controls
- Trigger animations from parent
- Focus management
- Controlling child state from parent (carefully)

---

## ⚠️ Common Mistakes

| Mistake | Why it's wrong | Fix |
|--------|----------------|-----|
| Using `useImperativeHandle` without `forwardRef` | Won’t work | Always wrap component with `forwardRef()` |
| Exposing too much internal state | Breaks encapsulation | Only expose needed APIs |
| Forgetting dependencies | May cause stale refs | Include relevant dependencies in hook |

---

## 🧠 Best Practices

- Keep exposed API small and well-documented
- Only use `useImperativeHandle` when necessary
- Prefer lifting state up or callbacks when possible
- Use with `forwardRef` consistently

---


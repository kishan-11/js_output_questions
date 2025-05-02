
# 🎛️ Controlled vs Uncontrolled Components in React

In React, form inputs can be **controlled** or **uncontrolled** depending on how their state is managed.

---

## ✅ Controlled Components

- Form data is **handled by React state**
- UI reflects the current state and changes go through state updates

### 🔹 Example

```jsx
function ControlledForm() {
  const [value, setValue] = useState("");

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

### ✅ Characteristics

- Input value is bound to `state`
- Single source of truth
- Easier to validate, transform, and control
- Common in large or dynamic forms

---

## ❎ Uncontrolled Components

- Form data is handled by the **DOM** itself
- Accessed via `ref` when needed (not through state)

### 🔹 Example

```jsx
function UncontrolledForm() {
  const inputRef = useRef();

  const handleSubmit = () => {
    alert(inputRef.current.value);
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```

### ❎ Characteristics

- Input value stored in the DOM
- No React state tracking changes
- Useful for simple forms, third-party libraries, or performance-sensitive use cases

---

## 📋 Comparison Table

| Feature                     | Controlled Component         | Uncontrolled Component        |
|----------------------------|------------------------------|-------------------------------|
| Data source                | React state                  | DOM (via `ref`)               |
| Change handler required?   | ✅ Yes (`onChange`)          | ❌ No                         |
| Default value              | `value` + state              | `defaultValue` prop           |
| Validation                 | Easier, declarative          | Manual                        |
| Use case                   | Complex forms, validation    | Simple inputs, quick prototyping |
| Performance                | Slightly less efficient      | Slightly faster               |

---

## ⚠️ Common Mistakes

| Mistake | Why it's wrong | Fix |
|--------|----------------|-----|
| Mixing controlled and uncontrolled inputs | Leads to inconsistent behavior | Choose one and stick with it |
| Using `value` without `onChange` | Input becomes read-only | Add an `onChange` handler |
| Forgetting to use `defaultValue` for uncontrolled | Results in uncontrolled warning | Use `defaultValue` for initial content |

---

## 🧠 Best Practices

- Use controlled components when:
  - You need validation or conditional UI
  - The form is dynamic or complex
- Use uncontrolled components when:
  - You don’t need real-time control
  - You want better performance or simpler setup
- Avoid switching between controlled and uncontrolled for the same input

---


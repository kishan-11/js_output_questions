
# 🔼 React: Lifting State Up

**Lifting State Up** is a pattern in React where shared state is moved to the **closest common ancestor** of components that need to access or modify it.

---

## 📌 Why Lift State Up?

- Allows **sibling components to share and sync data**
- Prevents duplication of state
- Creates a **single source of truth**

---

## 🧪 Without Lifting State Up

```jsx
function TemperatureInput() {
  const [temperature, setTemperature] = useState('');
  return (
    <input value={temperature} onChange={(e) => setTemperature(e.target.value)} />
  );
}

function BoilingVerdict() {
  const [temperature, setTemperature] = useState('');
  return temperature >= 100 ? <p>Boiling</p> : <p>Not Boiling</p>;
}
```

Each component manages its own state — they do not communicate or stay in sync.

---

## ✅ With Lifting State Up

```jsx
function TemperatureInput({ temperature, onChange }) {
  return (
    <input value={temperature} onChange={(e) => onChange(e.target.value)} />
  );
}

function BoilingVerdict({ temperature }) {
  return temperature >= 100 ? <p>Boiling</p> : <p>Not Boiling</p>;
}

function Calculator() {
  const [temperature, setTemperature] = useState('');

  return (
    <>
      <TemperatureInput temperature={temperature} onChange={setTemperature} />
      <BoilingVerdict temperature={temperature} />
    </>
  );
}
```

- State is **lifted up to `Calculator`**, the common ancestor.
- `TemperatureInput` and `BoilingVerdict` now stay in sync.

---

## 🧠 When to Use Lifting State Up

- When multiple components **need to share the same data**
- To avoid **inconsistent or duplicated state**
- For cleaner, more **maintainable code**

---

## 🧠 Best Practices

| ✅ Do | ❌ Don’t |
|------|----------|
| Lift state to nearest common parent | Duplicate state across components |
| Pass data and handlers via props | Use separate isolated states |
| Keep components focused and stateless if possible | Bloat each component with logic |

---


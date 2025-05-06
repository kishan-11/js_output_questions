
# 🧱 React Compound Components Pattern

**Compound Components** are a React pattern where multiple components work together and share an implicit state through a common parent. This pattern promotes **flexibility**, **composition**, and **encapsulation**.

---

## 📌 What Are Compound Components?

- A **parent component** manages state and logic.
- **Child components** are used declaratively and implicitly access shared state.
- Encourages building complex UIs with clean, reusable components.

---

## 🧪 Example: Simple Counter

### ✅ Components

```jsx
function Counter({ children }) {
  const [count, setCount] = useState(0);

  return React.Children.map(children, child =>
    React.cloneElement(child, { count, setCount })
  );
}

function CountDisplay({ count }) {
  return <p>Count: {count}</p>;
}

function IncrementButton({ setCount }) {
  return <button onClick={() => setCount(prev => prev + 1)}>Increment</button>;
}
```

### ✅ Usage

```jsx
<Counter>
  <CountDisplay />
  <IncrementButton />
</Counter>
```

---

## 📦 Real-World Example: Tabs

```jsx
function Tabs({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return React.Children.map(children, (child, index) =>
    React.cloneElement(child, {
      isActive: index === activeIndex,
      onClick: () => setActiveIndex(index)
    })
  );
}

function Tab({ isActive, onClick, children }) {
  return (
    <button
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### ✅ Usage

```jsx
<Tabs>
  <Tab>Tab 1</Tab>
  <Tab>Tab 2</Tab>
  <Tab>Tab 3</Tab>
</Tabs>
```

---

## 🎯 Benefits

| Feature         | Benefit                                  |
|----------------|-------------------------------------------|
| Flexibility     | Users can arrange child components freely |
| Reusability     | Components can be reused independently    |
| Encapsulation   | Shared logic stays in the parent component |

---

## ⚠️ Common Pitfalls

| Pitfall | Description |
|---------|-------------|
| Logic hidden in parent | Can be harder to trace/debug |
| Not standalone         | Child components may not work outside the parent |
| Overuse of cloneElement | May get verbose or hard to manage |

---

## 🧠 Best Practices

- Use `cloneElement` or `Context` to share state
- Design intuitive child APIs
- Document usage clearly
- Prefer Context for scalability in large apps

---


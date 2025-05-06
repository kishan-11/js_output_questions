
# 🧩 Dependency Injection Patterns in React

**Dependency Injection (DI)** in React means supplying external services or data to a component **from outside** rather than hard-coding them within.

---

## 📌 What Is Dependency Injection?

> Inject dependencies like configuration, services, or utilities into components using props, context, or hooks.

### ✅ Benefits:
- Testability
- Reusability
- Decoupling
- Flexibility

---

## 🧪 Props-Based Injection (Manual DI)

```jsx
function LoggerService() {
  return {
    log: (msg) => console.log("Log:", msg),
  };
}

function Button({ logger }) {
  return <button onClick={() => logger.log("Clicked!")}>Click</button>;
}

function App() {
  const logger = LoggerService();
  return <Button logger={logger} />;
}
```

---

## 📦 Common Dependency Injection Patterns in React

### 1. **Props Injection**

```jsx
<Component config={config} service={apiService} />
```

- Best for local dependencies
- Easy to test and trace

---

### 2. **Context-Based Injection (Global DI)**

```jsx
const LoggerContext = createContext();

function App() {
  const logger = LoggerService();
  return (
    <LoggerContext.Provider value={logger}>
      <Button />
    </LoggerContext.Provider>
  );
}

function Button() {
  const logger = useContext(LoggerContext);
  return <button onClick={() => logger.log("Clicked")}>Click</button>;
}
```

- Good for global services (auth, theme, logger)
- Avoid overuse for tightly-scoped logic

---

### 3. **Custom Hook Injection**

```jsx
function useLogger() {
  return useContext(LoggerContext);
}

function Button() {
  const logger = useLogger();
  return <button onClick={() => logger.log("Clicked")}>Click</button>;
}
```

- Encapsulates context usage
- Keeps component clean

---

### 4. **Higher-Order Component (HOC) Injection**

```jsx
function withLogger(Component) {
  return function Wrapped(props) {
    const logger = useContext(LoggerContext);
    return <Component {...props} logger={logger} />;
  };
}
```

- Can inject into many components
- Easy to add cross-cutting concerns

---

## 🎯 Why Use DI?

| Benefit        | Description                                |
|----------------|--------------------------------------------|
| Testability     | Swap real services with mocks              |
| Reusability     | Decouple components from specific logic    |
| Flexibility     | Swap implementations easily                |
| Maintainability | Centralized logic, consistent patterns     |

---

## ⚠️ Common Pitfalls

| Mistake | Problem | Fix |
|--------|---------|-----|
| Hardcoding dependencies | Tightly couples logic | Use props or context |
| Overusing context | Hidden dependencies | Use props where possible |
| Passing too many props | Bloated interface | Group into services or configs |

---

## 🧠 Best Practices

- Use props for localized, scoped injections
- Use Context and hooks for shared/global dependencies
- Avoid tightly coupling services inside components
- Keep injected interfaces small and testable

---


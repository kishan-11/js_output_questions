
# 🔁 React Higher-Order Components (HOC) Guide

A **Higher-Order Component (HOC)** is an advanced React pattern where a function takes a component and **returns a new component** with extended behavior.

---

## 📌 Definition

```jsx
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

- HOC is **a function**, not a component itself
- Adds **reusable behavior** to one or more components

---

## 🧪 Basic Example

```jsx
function withLogger(WrappedComponent) {
  return function EnhancedComponent(props) {
    console.log("Props:", props);
    return <WrappedComponent {...props} />;
  };
}
```

### ✅ Usage

```jsx
const LoggedButton = withLogger(Button);
```

Now every time `LoggedButton` renders, props are logged.

---

## 📦 Use Cases

| Use Case              | Description |
|-----------------------|-------------|
| Cross-cutting concerns | Logging, access control, analytics |
| Code reuse            | Add functionality to multiple components |
| Conditional rendering | Render alternative components |
| Data fetching         | Provide data via props |

---

## 🧠 Example: withLoading HOC

```jsx
function withLoading(Component) {
  return function WrappedComponent({ isLoading, ...rest }) {
    if (isLoading) return <p>Loading...</p>;
    return <Component {...rest} />;
  };
}

function DataView({ data }) {
  return <div>{data}</div>;
}

const DataViewWithLoading = withLoading(DataView);
```

### ✅ Usage

```jsx
<DataViewWithLoading isLoading={true} data="Hello" />
```

---

## ⚙️ HOC Characteristics

- Pure functions: no side effects
- Must pass props with `{...props}`
- Don’t modify the input component

---

## 🔄 HOC vs Render Props vs Hooks

| Pattern       | Description |
|---------------|-------------|
| HOC           | Reuse logic via wrapping |
| Render Props  | Reuse via a function-as-child pattern |
| Hooks         | Reuse logic in functional components |

---

## ⚠️ Common Mistakes

| Mistake | Problem | Fix |
|--------|---------|-----|
| Not forwarding props | Component loses access to props | Use `{...props}` |
| Losing `ref` | Ref won’t work on wrapped component | Use `forwardRef` |
| Overwrapping | Too many HOCs can obscure logic | Use hooks if simpler |

---

## 🧠 Best Practices

- Name HOCs clearly: `withLogger`, `withAuth`, etc.
- Always preserve the original component's contract
- Use HOCs for **behavior**, not just visual decorations
- Prefer Hooks in new code unless HOC is cleaner

---

## 🔁 Composing HOCs

```jsx
const enhance = compose(withAuth, withLogger);
const EnhancedComponent = enhance(MyComponent);
```

Use libraries like `recompose` or write your own `compose()` utility.

---


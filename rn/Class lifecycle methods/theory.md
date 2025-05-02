
# React Class Component Lifecycle Methods

This document provides an in-depth explanation of the lifecycle methods in React class components.

---

## 🔄 Lifecycle Phases

React class components go through **three main phases**:

1. **Mounting** – Component is created and inserted into the DOM.
2. **Updating** – Component is re-rendered due to changes in props or state.
3. **Unmounting** – Component is removed from the DOM.

---

## 🟢 1. Mounting Phase

### 🔹 constructor(props)
```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
}
```
- Initializes state and binds methods.
- Avoid side effects here.

---

### 🔹 static getDerivedStateFromProps(props, state)
```jsx
static getDerivedStateFromProps(props, state) {
  if (props.value !== state.value) {
    return { value: props.value };
  }
  return null;
}
```
- Sync state from props.
- Called before every render.

---

### 🔹 render()
```jsx
render() {
  return <h1>Hello, world</h1>;
}
```
- Required method.
- Pure function that returns JSX.

---

### 🔹 componentDidMount()
```jsx
componentDidMount() {
  fetchData().then(data => this.setState({ data }));
}
```
- Called after the component is mounted.
- Use for API calls, subscriptions, etc.

---

## 🟡 2. Updating Phase

### 🔹 getDerivedStateFromProps() (again)
- Same behavior as in mounting.

---

### 🔹 shouldComponentUpdate(nextProps, nextState)
```jsx
shouldComponentUpdate(nextProps, nextState) {
  return nextProps.value !== this.props.value;
}
```
- Return `false` to skip re-render.
- Used for performance optimization.

---

### 🔹 render() (again)

---

### 🔹 getSnapshotBeforeUpdate(prevProps, prevState)
```jsx
getSnapshotBeforeUpdate(prevProps, prevState) {
  if (prevProps.list.length < this.props.list.length) {
    return this.listRef.scrollHeight;
  }
  return null;
}
```
- Captures DOM info before update.

---

### 🔹 componentDidUpdate(prevProps, prevState, snapshot)
```jsx
componentDidUpdate(prevProps, prevState, snapshot) {
  if (snapshot !== null) {
    this.listRef.scrollTop = this.listRef.scrollHeight - snapshot;
  }
}
```
- Called after updates.
- Ideal for responding to DOM changes or making further updates.

---

## 🔴 3. Unmounting Phase

### 🔹 componentWillUnmount()
```jsx
componentWillUnmount() {
  clearInterval(this.timerID);
}
```
- Cleanup work (timers, event listeners).

---

## ❌ Deprecated Methods (Avoid)

- `componentWillMount()`
- `componentWillReceiveProps()`
- `componentWillUpdate()`

These are unsafe in modern React.

---

## 🔄 Lifecycle Flow Summary

```text
MOUNTING
---------
constructor()
getDerivedStateFromProps()
render()
componentDidMount()

UPDATING
---------
getDerivedStateFromProps()
shouldComponentUpdate()
render()
getSnapshotBeforeUpdate()
componentDidUpdate()

UNMOUNTING
-----------
componentWillUnmount()
```

---

## 🧠 Best Practices

| Method | Purpose |
|--------|---------|
| `constructor` | Initializing state, binding methods |
| `componentDidMount` | Fetching data, DOM side effects |
| `shouldComponentUpdate` | Skip unnecessary renders |
| `componentDidUpdate` | Respond to updates, manipulate DOM |
| `componentWillUnmount` | Cleanup on removal |
| `getSnapshotBeforeUpdate` | Capture pre-update DOM values |
| `getDerivedStateFromProps` | Sync state with props carefully |


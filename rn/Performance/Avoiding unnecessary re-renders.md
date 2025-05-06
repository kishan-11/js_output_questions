
# 🚀 Avoiding Unnecessary Re-renders in React and React Native

Avoiding unnecessary re-renders is key to building performant React apps. Here's a complete guide to understanding and optimizing rendering behavior.

---

## 🔁 What Triggers a Re-render?

React re-renders a component when:
- Its **state** changes
- Its **props** change
- Its **context value** changes

---

## ✅ General Optimization Techniques

### 1. `React.memo` for Functional Components

```jsx
const MyComponent = React.memo(({ value }) => {
  return <div>{value}</div>;
});
```

> Prevents re-rendering when props haven’t changed (shallow comparison).

---

### 2. `useCallback` for Stable Functions

```jsx
const handleClick = useCallback(() => {
  console.log("Clicked");
}, []);
```

> Useful when passing functions to memoized child components.

---

### 3. `useMemo` for Expensive Calculations

```jsx
const filteredList = useMemo(() => {
  return items.filter(item => item.visible);
}, [items]);
```

> Caches computed results unless dependencies change.

---

### 4. Avoid Inline Objects/Arrays in JSX

❌ Bad:
```jsx
<Component options={{ dark: true }} />
```

✅ Good:
```jsx
const options = useMemo(() => ({ dark: true }), []);
<Component options={options} />
```

---

### 5. Extract Independent Child Components

Split parts of the UI that don’t depend on parent’s state.

```jsx
function App() {
  return (
    <>
      <Header />
      <MainContent />
    </>
  );
}
```

---

### 6. Use `key` Correctly in Lists

```jsx
{items.map(item => <Item key={item.id} {...item} />)}
```

---

### 7. Optimize Context Usage

```jsx
const value = useMemo(() => ({ user }), [user]);
<Context.Provider value={value} />
```

---

### 8. Avoid State Updates When Value Hasn’t Changed

```jsx
if (newValue !== currentValue) {
  setState(newValue);
}
```

---

## 📱 FlatList Optimization in React Native

### 1. Use `React.memo` for Row Components

```jsx
const ListItem = React.memo(({ item }) => <Text>{item.title}</Text>);
```

---

### 2. Provide Stable `keyExtractor`

```jsx
keyExtractor={(item) => item.id.toString()}
```

---

### 3. Implement `getItemLayout` (for fixed heights)

```jsx
getItemLayout={(data, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
})}
```

---

### 4. Memoize `renderItem` with `useCallback`

```jsx
const renderItem = useCallback(({ item }) => <ListItem item={item} />, []);
```

---

### 5. Use `extraData` Wisely

```jsx
<FlatList data={items} extraData={selectedId} />
```

Avoid large objects or deeply nested references.

---

### 6. Configure `initialNumToRender` and `maxToRenderPerBatch`

```jsx
<FlatList initialNumToRender={10} maxToRenderPerBatch={10} />
```

---

## 🧠 Summary Table

| Strategy               | Benefit                        |
|------------------------|--------------------------------|
| `React.memo`           | Avoid re-renders on same props |
| `useCallback`          | Prevent function re-creation   |
| `useMemo`              | Avoid recomputation            |
| Extract components     | Isolate update boundaries      |
| Optimize context usage | Avoid global tree re-renders   |
| FlatList tuning        | Smooth large-list scrolling    |

---

## ✅ Best Practices

- Use `React.memo` for pure UI components
- Wrap callbacks with `useCallback`
- Avoid object/array recreations inline
- Profile performance using React DevTools or React Native Flipper

---

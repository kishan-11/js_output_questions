
# 🎨 Presentational vs Container Components in React

The **Presentational and Container Component pattern** is a design principle that helps **separate concerns** between **how things look** and **how things work**.

---

## 📌 Definitions

### 🎨 Presentational Component
- Focuses on **UI (how things look)**
- **Stateless** (or uses minimal state)
- Receives data and callbacks **via props**
- Does **not interact with Redux, Context, etc.**

### 🛠️ Container Component
- Focuses on **logic (how things work)**
- Manages **state**, **effects**, and **data fetching**
- Passes data and callbacks to presentational components
- Often connected to Redux, Context, etc.

---

## 🧪 Example

### ✅ Presentational Component

```jsx
function UserList({ users, onSelectUser }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => onSelectUser(user)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

### ✅ Container Component

```jsx
function UserListContainer() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const handleUserSelect = (user) => {
    console.log("Selected:", user);
  };

  return <UserList users={users} onSelectUser={handleUserSelect} />;
}
```

---

## 🎯 Why Use This Pattern?

| Benefit            | Description                                  |
|--------------------|----------------------------------------------|
| Separation of concerns | Easier to test, maintain, and reason about |
| Reusability         | Presentational components can be reused easily |
| Testability         | Easier to test UI and logic independently     |
| Scalability         | Encourages better structure in large apps     |

---

## ⚖️ Comparison Table

| Feature                  | Presentational Component | Container Component         |
|--------------------------|--------------------------|-----------------------------|
| Purpose                  | Display UI               | Handle logic, data          |
| Uses state?              | Usually no               | Yes                         |
| Aware of data sources?   | No                       | Yes                         |
| Reusable?                | Highly                   | Usually app-specific        |
| Aware of Redux/Context?  | No                       | Yes                         |

---

## ⚠️ Common Pitfalls

| Mistake | Why it's problematic | Fix |
|--------|------------------------|-----|
| Mixing logic and UI | Makes code hard to test or reuse | Split into two components |
| Making Presentational aware of global state | Reduces reusability | Use props instead |
| Passing too many props | Becomes hard to manage | Group or memoize handlers |

---

## 🧠 Best Practices

- Keep UI in pure presentational components
- Move API calls, state, and handlers to containers
- Use naming conventions: `UserList` vs `UserListContainer`
- Prefer hooks + composition in modern apps over strict separation

---


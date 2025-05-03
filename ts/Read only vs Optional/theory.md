
# TypeScript: Optional & Readonly Properties

TypeScript allows fine-grained control over **object shape contracts** using modifiers like `?` (optional) and `readonly`. These are used in interfaces, types, and classes to express intent and improve safety.

---

## 🔸 1. Optional Properties (`?`)

### 🧠 Purpose:
Marks a property as **optional** — it may or may not be present in an object.

### ✅ Syntax:

```ts
interface User {
  id: number;
  name?: string; // optional
}

const u1: User = { id: 1 }; // ✅
const u2: User = { id: 2, name: "Kishan" }; // ✅
```

### ✅ Use Cases:
- Optional fields in forms
- Partial updates to objects
- Config objects with defaults

### 🔍 Tip:
Optional properties automatically include `undefined` in their type:

```ts
function printName(user: User) {
  if (user.name !== undefined) {
    console.log(user.name.toUpperCase());
  }
}
```

---

## 🔸 2. Readonly Properties (`readonly`)

### 🧠 Purpose:
Prevents a property from being **reassigned** after initialization.

### ✅ Syntax:

```ts
interface User {
  readonly id: number;
  name: string;
}

const user: User = { id: 1, name: "Kishan" };
user.name = "Patel";  // ✅
user.id = 2;          // ❌ Error: Cannot assign to 'id'
```

### ✅ Use Cases:
- Immutable data structures
- Prevent accidental mutation
- API responses where IDs shouldn't change

---

## 🔁 Combining `readonly` and `?`

```ts
interface Config {
  readonly appName?: string;
}
```

- The property is both **optional** and **immutable if present**.

---

## 🔸 3. In Classes

Both modifiers work with class members:

```ts
class Point {
  readonly x: number;
  constructor(x: number) {
    this.x = x;
  }
}
```

- `readonly` works like `const`, but for object properties.
- Cannot be modified after assignment in constructor.

---

## 🔸 4. With Utility Types

### `Readonly<T>` – Make all properties readonly

```ts
type User = { id: number; name: string };
type ImmutableUser = Readonly<User>;

const user: ImmutableUser = { id: 1, name: "Kishan" };
user.name = "Patel"; // ❌ Error
```

### `Partial<T>` – Make all properties optional

```ts
type User = { id: number; name: string };
type PartialUser = Partial<User>;

const u: PartialUser = { id: 1 }; // ✅
```

---

## 🔚 Summary

| Modifier      | Effect                                   | Use Case                        |
|---------------|-------------------------------------------|----------------------------------|
| `?`           | Property may be `undefined` or absent     | Optional inputs or configs       |
| `readonly`    | Property cannot be reassigned             | Immutable data, constant fields  |
| `readonly ?`  | Optional and immutable (if present)       | Rare, but valid in configs       |
| `Readonly<T>` | Make all props immutable (utility type)   | Freezing object structures       |
| `Partial<T>`  | Make all props optional (utility type)    | Patch updates, config defaults   |

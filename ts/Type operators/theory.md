
# TypeScript: `typeof`, `keyof`, `in`, `instanceof`

These operators are essential tools for **type manipulation** and **type guards** in TypeScript. They help describe, inspect, or constrain types at **compile time** or **runtime**.

---

## 🔹 1. `typeof` (Type Query Operator)

### 🧠 Purpose:
Extract the **type of a variable** or **value**.

### ✅ Usage:

```ts
let name = "Kishan";
type NameType = typeof name; // NameType is string
```

### ✅ With functions:

```ts
function greet(user: string) {
  return \`Hello, \${user}\`;
}

type GreetFunction = typeof greet; // function type
```

### 🔍 Use Case:
Reusing the type of an existing variable or function.

---

## 🔹 2. `keyof` (Key Query Operator)

### 🧠 Purpose:
Get a union of all **property names (keys)** of a type as string literals.

### ✅ Usage:

```ts
type User = { id: number; name: string };
type UserKeys = keyof User; // "id" | "name"
```

### ✅ Practical Example:

```ts
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

> `keyof` is commonly used in **generic utilities** and **type-safe accessors**.

---

## 🔹 3. `in` (Mapped Types & Object Checks)

### 🧠 Purpose:
Used in **two contexts**:
1. **Mapped types** – iterate over keys of a type
2. **Runtime operator** – check if property exists

---

### ✅ Mapped Type Usage:

```ts
type User = { id: number; name: string };
type ReadOnlyUser = {
  readonly [K in keyof User]: User[K];
};
```

> Here, `in` is used to create a new type by transforming properties.

---

### ✅ Runtime Usage:

```ts
const user = { id: 1, name: "Kishan" };

if ("id" in user) {
  console.log("User has an id.");
}
```

> Works like JavaScript’s `in` for **existence checks**.

---

## 🔹 4. `instanceof` (Type Guard at Runtime)

### 🧠 Purpose:
Used to check if a value is an **instance of a class or constructor**.

### ✅ Usage:

```ts
class Car {
  drive() {}
}

const vehicle = new Car();

if (vehicle instanceof Car) {
  vehicle.drive(); // ✅ Safe to call
}
```

> `instanceof` is a **runtime operator** used for **class-based type guards**.

---

## 🔚 Summary

| Operator      | Purpose                            | Context        | Example                                |
|---------------|-------------------------------------|----------------|----------------------------------------|
| `typeof`      | Get type of a variable or function  | Compile-time   | `typeof name` → `string`               |
| `keyof`       | Get property names as string union  | Compile-time   | `keyof User` → `"id" | "name"`         |
| `in`          | Iterate keys / check property exist | Both           | `[K in keyof T]` or `"id" in obj`      |
| `instanceof`  | Class-based type check              | Runtime        | `obj instanceof SomeClass`             |

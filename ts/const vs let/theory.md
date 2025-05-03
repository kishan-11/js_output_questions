
# TypeScript: `const` vs `let` with Types

In TypeScript, both `const` and `let` are used to declare variables, but they differ in **mutability**, **reassignment rules**, and **how types are inferred**.

---

## 🔒 `const` – Immutable Bindings

- A `const` variable **cannot be reassigned**.
- The **value itself may still be mutable** (e.g., objects or arrays).
- TypeScript **infers literal types** when used with `const`.

```ts
const name = "Kishan"; // inferred as type "Kishan" (string literal)
```

```ts
const age: number = 30; // explicitly typed as number
```

```ts
const user = { name: "Kishan" }; 
user.name = "Patel"; // ✅ Allowed (object property is mutable)
user = { name: "Someone else" }; // ❌ Error: cannot reassign const
```

### ✅ Use `const` when:
- The variable **should not be reassigned**.
- You want **more precise type inference** (especially with literals).
- You want to signal that a variable is a **constant**.

---

## ♻️ `let` – Mutable Bindings

- A `let` variable **can be reassigned**.
- TypeScript infers **general types** (not literal types).

```ts
let city = "Mumbai"; // inferred as string (not "Mumbai")
city = "Delhi";      // ✅ OK
```

```ts
let count: number;
count = 10;
count = 20;
```

### ✅ Use `let` when:
- You **intend to reassign** the variable later.
- The variable needs to be **declared before it's initialized**.

---

## 🧠 Key Differences in Type Inference

```ts
const status = "success"; // type: "success" (string literal)
let status = "success";   // type: string
```

```ts
const numArray = [1, 2, 3]; // type: number[]
const tuple = [1, true] as const; // type: readonly [1, true]
```

- `const` + `as const` gives you **deep immutability** and **literal types**.

---

## 🧪 Example: Behavior Difference

```ts
const PI = 3.14;
// PI = 3.1415; // ❌ Error

let radius = 10;
radius = 12; // ✅ OK
```

---

## 🔚 Summary

| Feature              | `const`                           | `let`                           |
|----------------------|------------------------------------|----------------------------------|
| Reassignment         | ❌ Not allowed                     | ✅ Allowed                       |
| Type Inference       | Literal type (e.g., `"done"`)      | Broad type (e.g., `string`)     |
| Mutability of value  | Depends on object/array internals | Same                            |
| Best Use Case        | Constants, fixed values            | Changing values, loops, counters |

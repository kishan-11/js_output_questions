
# TypeScript: Union (`|`) & Intersection (`&`) Types

TypeScript provides advanced types to model flexible data structures.  
Two powerful tools in this system are **Union** and **Intersection** types.

---

## 🔀 Union Types (`|`)

A **Union type** allows a variable to be **one of multiple types**.

### 🔹 Syntax

```ts
let value: string | number;
value = "hello"; // ✅
value = 42;      // ✅
value = true;    // ❌
```

### 🔹 Use Cases
- Functions that accept multiple input types
- Flexible APIs
- Modeling data from untyped sources (e.g., JSON)

### 🔹 Example

```ts
function formatId(id: string | number): string {
  return id.toString();
}
```

### 🔹 Type Narrowing with `typeof`

```ts
function handleInput(input: string | number) {
  if (typeof input === "string") {
    console.log(input.toUpperCase());
  } else {
    console.log(input.toFixed(2));
  }
}
```

---

## 🧬 Intersection Types (`&`)

An **Intersection type** combines multiple types into one.  
A variable must satisfy **all** the types simultaneously.

### 🔹 Syntax

```ts
type Person = { name: string };
type Employee = { employeeId: number };

type Staff = Person & Employee;

const worker: Staff = {
  name: "Kishan",
  employeeId: 101
};
```

### 🔹 Use Cases
- Combine reusable types
- Merge multiple interfaces
- Add constraints to an object

### 🔹 Example with Functions

```ts
type Logger = { log: () => void };
type Serializer = { serialize: () => string };

function process(obj: Logger & Serializer) {
  obj.log();
  console.log(obj.serialize());
}
```

---

## ⚠️ Pitfall: Union vs Intersection

```ts
type A = { name: string };
type B = { age: number };

// Union: can be either A or B (or both)
let u: A | B = { name: "Kishan" }; // ✅
u = { age: 30 };                   // ✅
u = { name: "Kishan", age: 30 };   // ✅

// Intersection: must be A AND B
let i: A & B = { name: "Kishan" };      // ❌ Error
i = { name: "Kishan", age: 30 };        // ✅
```

---

## 🔚 Summary

| Feature             | Union (`|`)                          | Intersection (`&`)                      |
|---------------------|--------------------------------------|------------------------------------------|
| Meaning             | Either one type or another           | Must be all types combined               |
| Runtime behavior    | Requires type narrowing              | Must satisfy all members                 |
| Common use cases    | Flexible parameters, API models      | Merging types, enforcing multiple traits |
| Example             | `string | number`                    | `Person & Employee`                      |

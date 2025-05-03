
# TypeScript: `interface` vs `type`

TypeScript offers both `interface` and `type` to define the shape of data. While they are **similar and often interchangeable**, there are **key differences** and **specific scenarios** where one shines over the other.

---

## 🔶 1. Basic Syntax

### ✅ Interface

```ts
interface User {
  id: number;
  name: string;
}
```

### ✅ Type Alias

```ts
type User = {
  id: number;
  name: string;
};
```

➡️ **Equivalent for basic object shapes**

---

## 🔶 2. Extending and Composition

### ✅ Interface Inheritance (extends)

```ts
interface Person {
  name: string;
}

interface Employee extends Person {
  employeeId: number;
}
```

### ✅ Type Composition (intersection)

```ts
type Person = {
  name: string;
};

type Employee = Person & {
  employeeId: number;
};
```

➡️ **Both support composition**, but `interface` uses `extends`, while `type` uses `&`.

---

## 🔶 3. Extending Multiple Types

- `interface` can extend **multiple interfaces**.
- `type` can intersect **multiple types**.

```ts
interface A { a: string }
interface B { b: number }
interface C extends A, B {}

type X = A & B;
```

---

## 🔶 4. Compatibility with Classes

Interfaces are designed to describe **class shapes**:

```ts
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(message);
  }
}
```

➡️ **Interfaces integrate more naturally with classes.**

---

## 🔶 5. Non-object Types

`type` is more flexible — can represent **primitives**, **unions**, **tuples**, etc.

```ts
type Status = "success" | "error";
type Point = [number, number];
```

➡️ `interface` **cannot** do this.

---

## 🔶 6. Declaration Merging

### ✅ Interfaces can be **merged** across declarations:

```ts
interface User {
  id: number;
}
interface User {
  name: string;
}

// User is now { id: number; name: string }
```

❌ `type` aliases **cannot be merged**.

---

## 🔶 7. Discriminated Unions

Only `type` can represent tagged union types directly:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };
```

➡️ **Prefer `type`** for union/discriminated union scenarios.

---

## 🔚 Summary Table

| Feature                      | `interface`             | `type`                            |
|-----------------------------|--------------------------|-----------------------------------|
| Syntax for object shapes     | ✅ Yes                   | ✅ Yes                            |
| Extending other types        | `extends`                | `&` (intersection)                |
| Merges with same name        | ✅ Yes (declaration merging) | ❌ No                         |
| Works with primitives/tuples | ❌ No                    | ✅ Yes                            |
| Used with classes            | ✅ Yes                   | ⚠️ Limited (via structure only)   |
| Discriminated unions         | ❌ Not directly          | ✅ Yes                            |

---

## 🔧 When to Use What?

| Use Case                              | Prefer     |
|--------------------------------------|------------|
| Defining class contracts              | `interface`|
| Public APIs and libraries             | `interface`|
| Union/discriminated unions            | `type`     |
| Composition of primitives or tuples   | `type`     |
| When declaration merging is needed    | `interface`|
| Lightweight object modeling           | Either     |

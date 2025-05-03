
# TypeScript: Extending Interfaces

**Extending interfaces** is TypeScript’s way of allowing one interface to **inherit** the properties of another. This promotes **reusability**, **modularity**, and **clean architecture** when modeling object types.

---

## 🔹 1. Basic Syntax

You can create a new interface by **extending** an existing one using the `extends` keyword.

```ts
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: number;
}
```

Now, `Employee` has:
```ts
{
  name: string;
  age: number;
  employeeId: number;
}
```

---

## 🔹 2. Multiple Extensions

An interface can extend **multiple interfaces**.

```ts
interface Contact {
  email: string;
}

interface Staff extends Person, Contact {
  position: string;
}
```

Now `Staff` includes properties from `Person` and `Contact`.

---

## 🔹 3. Overriding or Adding New Properties

You can **add new properties** or **override existing ones** with compatible types.

```ts
interface A {
  id: number;
}

interface B extends A {
  id: number; // same type: OK
  name: string;
}
```

```ts
interface C extends A {
  id: string; // ❌ Error: incompatible override
}
```

---

## 🔹 4. Use with Classes

Interfaces are often extended and then implemented by classes:

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

class GermanShepherd implements Dog {
  name = "Max";
  breed = "German Shepherd";
}
```

---

## 🔹 5. Extending vs Type Intersections

You can achieve similar results with `type` intersections:

```ts
type Person = { name: string };
type Employee = Person & { employeeId: number };
```

| Feature                 | `interface`         | `type` + `&`             |
|-------------------------|---------------------|--------------------------|
| Syntax                  | `extends`           | Intersection (`&`)       |
| Declaration merging     | ✅ Supported        | ❌ Not supported          |
| Use with classes        | ✅ Natural fit      | ⚠️ Limited use            |

---

## 🔹 6. Real-World Use Case

```ts
interface APIResponse {
  status: number;
}

interface UserResponse extends APIResponse {
  data: {
    id: number;
    name: string;
  };
}
```

This models layered response formats without repeating base structure.

---

## 🔚 Summary

| Feature                 | Description                                               |
|-------------------------|-----------------------------------------------------------|
| `extends`               | Allows interface inheritance                              |
| Multiple interfaces     | Interfaces can extend more than one                       |
| Reuse                   | Enables reuse and modular type design                     |
| Compatibility           | Property types must match when overridden                 |
| Comparison              | Alternative to type intersections (`&`)                  |
| Best suited for         | Object structures, class contracts, layered architectures |

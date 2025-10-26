
# TypeScript: `interface` vs `type`

TypeScript offers both `interface` and `type` to define the shape of data. While they are **similar and often interchangeable**, there are **key differences** and **specific scenarios** where one shines over the other.

## 🎯 Key Concepts Overview

- **Interface**: Primarily for object shapes, supports declaration merging, designed for class contracts
- **Type**: More flexible, can represent any TypeScript type, supports unions and primitives
- **Performance**: Both compile to the same JavaScript (no runtime difference)
- **Compatibility**: Interfaces are more compatible with object-oriented patterns

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

### 🔍 Advanced Declaration Merging Examples:

```ts
// Merging with different property types
interface Config {
  apiUrl: string;
}
interface Config {
  apiUrl: string; // ✅ Same type - allowed
  // apiUrl: number; // ❌ Different type - error
}

// Merging with methods
interface Logger {
  log(message: string): void;
}
interface Logger {
  error(message: string): void;
}

// Merging with generics
interface Container<T> {
  value: T;
}
interface Container<T> {
  metadata: string;
}
```

### 🚫 Type Aliases Cannot Be Merged:

```ts
type User = { id: number };
type User = { name: string }; // ❌ Error: Duplicate identifier 'User'
```

### 🎯 When Declaration Merging is Useful:

1. **Library Augmentation**: Extending third-party library types
2. **Module Augmentation**: Adding properties to existing modules
3. **Progressive Enhancement**: Building interfaces incrementally

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

## 🔶 8. Callable Types and Function Signatures

### ✅ Type Aliases for Function Types:

```ts
// Function type
type Handler = (event: string) => void;

// Function with overloads
type MathOperation = {
  (a: number, b: number): number;
  (a: string, b: string): string;
};

// Constructor type
type Constructor<T> = new (...args: any[]) => T;
```

### ✅ Interfaces for Function Types:

```ts
// Callable interface
interface Handler {
  (event: string): void;
}

// Function with properties
interface Counter {
  (): number;
  reset(): void;
  count: number;
}
```

### 🔍 Advanced Function Patterns:

```ts
// Generic function type
type Mapper<T, U> = (value: T) => U;

// Conditional function type
type ConditionalHandler<T> = T extends string 
  ? (value: T) => void 
  : (value: T) => string;

// Function with rest parameters
type VariadicFunction = (...args: any[]) => any;
```

---

## 🔶 9. Performance and Compilation

### 📊 Compile-time Performance:

```ts
// Interface - faster compilation for simple cases
interface SimpleUser {
  id: number;
  name: string;
}

// Type - may be slower for complex unions
type ComplexUser = 
  | { type: 'admin'; permissions: string[] }
  | { type: 'user'; role: string }
  | { type: 'guest' };
```

### 🚀 Runtime Performance:

```ts
// Both compile to the same JavaScript
interface UserInterface {
  id: number;
  name: string;
}

type UserType = {
  id: number;
  name: string;
};

// Compiled JavaScript (both become):
// No runtime code - purely compile-time
```

### 📈 Memory Usage:

- **Interfaces**: Slightly more memory during compilation
- **Types**: Can use more memory for complex union types
- **Runtime**: No difference - both are erased

---

## 🔶 10. Advanced Patterns and Use Cases

### 🎯 Interface Augmentation (Third-party Libraries):

```ts
// Augmenting existing interfaces
declare global {
  interface Window {
    myCustomProperty: string;
  }
}

// Library augmentation
declare module 'some-library' {
  interface SomeInterface {
    customMethod(): void;
  }
}
```

### 🎯 Type Composition Patterns:

```ts
// Utility type composition
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Conditional type composition
type NonNullable<T> = T extends null | undefined ? never : T;

// Mapped type composition
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### 🎯 Hybrid Approaches:

```ts
// Interface for extensibility
interface BaseConfig {
  apiUrl: string;
}

// Type for specific implementations
type ProductionConfig = BaseConfig & {
  environment: 'production';
  debug: false;
};

// Interface for class implementation
interface Configurable {
  configure(config: BaseConfig): void;
}
```

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
| Function signatures          | ✅ Yes (callable)        | ✅ Yes (more flexible)           |
| Generic constraints          | ✅ Yes                   | ✅ Yes                            |
| Conditional types            | ❌ No                    | ✅ Yes                            |
| Mapped types                 | ❌ No                    | ✅ Yes                            |
| Template literals            | ❌ No                    | ✅ Yes                            |

---

## 🔧 When to Use What?

| Use Case                              | Prefer     | Reason |
|--------------------------------------|------------|---------|
| Defining class contracts              | `interface`| Better OOP integration, `implements` keyword |
| Public APIs and libraries             | `interface`| Declaration merging, extensibility |
| Union/discriminated unions            | `type`     | Only types support union syntax |
| Composition of primitives or tuples   | `type`     | Interfaces can't represent non-objects |
| When declaration merging is needed    | `interface`| Types don't support merging |
| Lightweight object modeling           | Either     | Both work equally well |
| Function types with properties        | `interface`| More readable callable interfaces |
| Complex conditional types             | `type`     | Interfaces don't support conditionals |
| Template literal types                | `type`     | Interfaces don't support template literals |
| Mapped types                          | `type`     | Interfaces don't support mapped types |
| Third-party library augmentation      | `interface`| Declaration merging is essential |
| Generic constraints                    | Either     | Both support generic constraints |
| Performance-critical compilation      | `interface`| Slightly faster for simple cases |

---

## 🎯 Decision Matrix

### Choose `interface` when:
- ✅ Building class hierarchies
- ✅ Creating public APIs
- ✅ Need declaration merging
- ✅ Working with third-party libraries
- ✅ Simple object shapes
- ✅ Team prefers OOP patterns

### Choose `type` when:
- ✅ Creating unions or discriminated unions
- ✅ Working with primitives, tuples, or arrays
- ✅ Need conditional types
- ✅ Creating utility types
- ✅ Complex type transformations
- ✅ Template literal types

### Use either when:
- ✅ Simple object modeling
- ✅ Generic constraints
- ✅ Function signatures
- ✅ Basic composition

---

## 🚀 Migration Strategies

### Converting Interface to Type:

```ts
// Before (interface)
interface User {
  id: number;
  name: string;
}

// After (type)
type User = {
  id: number;
  name: string;
};
```

### Converting Type to Interface:

```ts
// Before (type - only if it's an object type)
type User = {
  id: number;
  name: string;
};

// After (interface)
interface User {
  id: number;
  name: string;
}
```

### Hybrid Approach:

```ts
// Use interface for extensibility
interface BaseEntity {
  id: number;
  createdAt: Date;
}

// Use type for specific implementations
type User = BaseEntity & {
  name: string;
  email: string;
};

type Product = BaseEntity & {
  title: string;
  price: number;
};
```

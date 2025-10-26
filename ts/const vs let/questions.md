## Interview questions: const vs let (with types)

### 1. How does `const` interact with `as const` and literal inference?

**Answer:**
`const` and `as const` work together to provide deep immutability and precise literal type inference:

```ts
// Basic const - infers literal type
const status = "success"; // type: "success" (not string)

// as const - makes everything readonly and literal
const config = {
  api: "https://api.example.com",
  timeout: 5000,
  retries: 3
} as const;
// type: { readonly api: "https://api.example.com"; readonly timeout: 5000; readonly retries: 3; }

// Array with as const becomes readonly tuple
const colors = ["red", "green", "blue"] as const;
// type: readonly ["red", "green", "blue"]

// Without as const, arrays are mutable
const mutableColors = ["red", "green", "blue"];
// type: string[]
```

**Key interactions:**
- `const` alone: prevents reassignment, infers literal types for primitives
- `as const`: makes objects/arrays deeply readonly, preserves exact literal types
- Combined: maximum type safety and immutability

### 2. When does `const` not imply immutability? Contrast with `readonly`.

**Answer:**
`const` only prevents **reassignment** of the variable itself, not mutation of the value:

```ts
// const doesn't prevent object mutation
const user = { name: "John", age: 30 };
user.name = "Jane"; // ✅ Allowed - object is mutable
user.age = 25;      // ✅ Allowed
// user = { name: "Bob" }; // ❌ Error - cannot reassign const

// readonly prevents property mutation
interface ReadonlyUser {
  readonly name: string;
  readonly age: number;
}

const readonlyUser: ReadonlyUser = { name: "John", age: 30 };
// readonlyUser.name = "Jane"; // ❌ Error - cannot assign to readonly property
```

**Key differences:**
- `const`: Variable binding is immutable (cannot reassign)
- `readonly`: Property values are immutable (cannot modify)
- `const` + `readonly`: Both variable and properties are immutable

```ts
// Deep immutability with as const
const deepImmutable = {
  user: { name: "John", age: 30 },
  settings: { theme: "dark" }
} as const;
// All properties are readonly, all values are literal types
```

### 3. How do you preserve tuple literals and object literals precisely?

**Answer:**
Use `as const` assertion to preserve exact literal types and make them readonly:

```ts
// Preserving tuple literals
const coordinates = [10, 20] as const;
// type: readonly [10, 20] (not number[])

// Preserving object literals
const theme = {
  primary: "#007bff",
  secondary: "#6c757d",
  success: "#28a745"
} as const;
// type: { readonly primary: "#007bff"; readonly secondary: "#6c757d"; readonly success: "#28a745"; }

// Preserving function return types
function getStatus() {
  return { code: 200, message: "OK" } as const;
}
// Return type: { readonly code: 200; readonly message: "OK"; }

// Preserving array of objects
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
] as const;
// type: readonly [{ readonly id: 1; readonly name: "Alice"; }, { readonly id: 2; readonly name: "Bob"; }]
```

**Alternative approaches:**
```ts
// Using satisfies operator (TypeScript 4.9+)
const config = {
  api: "https://api.example.com",
  timeout: 5000
} satisfies Record<string, string | number>;

// Using const assertions in function parameters
function processData<T extends readonly unknown[]>(data: T) {
  // T preserves the exact tuple structure
}
```

### 4. When should you widen a literal type intentionally?

**Answer:**
Widen literal types when you need flexibility or when working with APIs that expect broader types:

```ts
// When you need to reassign with different values
let status: string = "loading"; // Widened to string
status = "success";
status = "error";

// When working with APIs that expect broader types
function logMessage(message: string) {
  console.log(message);
}

const specificMessage = "User logged in" as const; // type: "User logged in"
logMessage(specificMessage); // ✅ Works - literal is assignable to string

// When you need to modify arrays/objects
let items: string[] = ["apple", "banana"]; // Widened to string[]
items.push("orange");
items[0] = "grape";

// When using with union types
let theme: "light" | "dark" = "light"; // Widened to union
theme = "dark";

// When working with external libraries
const config: Record<string, any> = {
  api: "https://api.example.com",
  timeout: 5000
}; // Widened to allow any string keys and values
```

**Use cases for widening:**
- Variables that will be reassigned
- Function parameters that need flexibility
- Working with external APIs
- When you need to modify arrays/objects
- When using with union types

### 5. Show pitfalls of `const enum` vs `enum`.

**Answer:**
`const enum` and regular `enum` have different compilation behaviors and usage restrictions:

```ts
// Regular enum - generates runtime code
enum Status {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

// const enum - inlined at compile time, no runtime code
const enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3
}

// Usage differences
function processStatus(status: Status) {
  // Regular enum - can be used in switch statements
  switch (status) {
    case Status.PENDING:
      return "Processing...";
    case Status.APPROVED:
      return "Success!";
    case Status.REJECTED:
      return "Failed!";
  }
}

function processPriority(priority: Priority) {
  // const enum - inlined, but has limitations
  if (priority === Priority.HIGH) {
    return "Urgent";
  }
}
```

**Pitfalls of const enum:**

1. **No runtime representation:**
```ts
// ❌ This won't work - const enum has no runtime value
console.log(Object.keys(Priority)); // Error: Priority is not defined at runtime

// ✅ Regular enum works
console.log(Object.keys(Status)); // ["PENDING", "APPROVED", "REJECTED"]
```

2. **Cannot be used in computed property access:**
```ts
// ❌ Error with const enum
const key = "HIGH";
const value = Priority[key]; // Error: const enum members can only be accessed using string literals

// ✅ Works with regular enum
const statusKey = "APPROVED";
const statusValue = Status[statusKey]; // Works fine
```

3. **Cannot be used in template literals:**
```ts
// ❌ Error with const enum
const message = `Priority is ${Priority.HIGH}`; // Error in some contexts

// ✅ Works with regular enum
const statusMessage = `Status is ${Status.APPROVED}`; // Works fine
```

4. **Cannot be used with Object.keys/Object.values:**
```ts
// ❌ These don't work with const enum
Object.keys(Priority); // Error
Object.values(Priority); // Error

// ✅ Works with regular enum
Object.keys(Status); // ["PENDING", "APPROVED", "REJECTED"]
Object.values(Status); // ["pending", "approved", "rejected"]
```

5. **Cannot be used in reflection:**
```ts
// ❌ Cannot iterate over const enum
for (const key in Priority) {
  console.log(key); // Error
}

// ✅ Works with regular enum
for (const key in Status) {
  console.log(key); // "PENDING", "APPROVED", "REJECTED"
}
```

**When to use each:**
- **Regular enum**: When you need runtime values, iteration, or computed access
- **const enum**: When you want zero runtime cost and don't need runtime features


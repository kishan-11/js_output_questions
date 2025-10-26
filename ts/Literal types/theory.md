# TypeScript: Literal Types

**Literal types** are one of TypeScript's most powerful features, allowing you to specify exact values a variable can take. Instead of just `string`, `number`, or `boolean`, you can restrict variables to **specific string, number, or boolean values**.

This enables **more precise typing**, **better IntelliSense**, **compile-time error checking**, and **safer code**, especially when used with unions, enums, and discriminated unions.

---

## 🔹 1. String Literal Types

String literal types allow you to restrict a variable to specific string values, providing compile-time safety and better autocomplete.

### 🔸 Basic String Literals

```ts
let direction: "up" | "down" | "left" | "right";

direction = "up";    // ✅
direction = "right"; // ✅
direction = "side";  // ❌ Error: Type '"side"' is not assignable to type '"up" | "down" | "left" | "right"'
```

### 🔸 Use in Functions

```ts
function move(dir: "up" | "down") {
  console.log(`Moving ${dir}`);
}

move("up");   // ✅
move("left"); // ❌ Error: Argument of type '"left"' is not assignable to parameter of type '"up" | "down"'
```

### 🔸 Advanced String Literal Patterns

```ts
// HTTP Methods
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// CSS Units
type CssUnit = "px" | "em" | "rem" | "%" | "vh" | "vw";

// File Extensions
type ImageFormat = "jpg" | "jpeg" | "png" | "gif" | "webp" | "svg";

// API Response Status
type ApiStatus = "idle" | "loading" | "success" | "error";
```

### 🔸 Template Literal Types (Advanced)

```ts
// Create dynamic string literal types
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<"click">; // "onClick"
type SubmitEvent = EventName<"submit">; // "onSubmit"

// CSS Property Names
type CssProperty = `--${string}` | `-webkit-${string}` | `-moz-${string}`;
```

---

## 🔹 2. Number Literal Types

Number literal types restrict variables to specific numeric values, useful for enums, dice rolls, and finite numeric states.

### 🔸 Basic Number Literals

```ts
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

let roll: DiceRoll = 4; // ✅
roll = 7;               // ❌ Error: Type '7' is not assignable to type '1 | 2 | 3 | 4 | 5 | 6'
```

### 🔸 Practical Examples

```ts
// HTTP Status Codes
type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 500;

// Priority Levels
type Priority = 1 | 2 | 3 | 4 | 5;

// RGB Values (0-255)
type RgbValue = 0 | 1 | 2 | 3 | 4 | 5; // ... up to 255

// Age Groups
type AgeGroup = 18 | 25 | 35 | 45 | 55 | 65;
```

### 🔸 Number Literal Ranges (Advanced)

```ts
// Create number literal types for ranges
type Range1To10 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Using conditional types to generate ranges
type Enumerate<N extends number, Acc extends number[] = []> = 
  Acc['length'] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>;

type Range<F extends number, T extends number> = 
  Exclude<Enumerate<T>, Enumerate<F>>;
```

---

## 🔹 3. Boolean Literal Types

Boolean literal types restrict variables to specific boolean values, useful for flags and state management.

### 🔸 Basic Boolean Literals

```ts
type IsEnabled = true;
type IsDisabled = false;

let flag: IsEnabled = true;  // ✅
flag = false;                // ❌ Error: Type 'false' is not assignable to type 'true'

let disabled: IsDisabled = false; // ✅
disabled = true;                  // ❌ Error
```

### 🔸 Practical Applications

```ts
// Feature Flags
type FeatureFlag = true | false;

// Toggle States
type ToggleState = "on" | "off";

// Binary States
type BinaryState = 0 | 1;
```

---

## 🔹 4. Literal Types in Unions

Combining literal types using unions creates powerful enum-like behavior with better type safety than traditional enums.

### 🔸 Basic Union Literals

```ts
type Status = "success" | "error" | "loading" | "idle";

function showStatus(status: Status) {
  console.log(`Status is: ${status}`);
}

showStatus("success"); // ✅
showStatus("pending"); // ❌ Error
```

### 🔸 Advanced Union Patterns

```ts
// Theme System
type Theme = "light" | "dark" | "auto" | "high-contrast";

// User Roles
type UserRole = "admin" | "user" | "moderator" | "guest";

// API Endpoints
type ApiEndpoint = "/users" | "/posts" | "/comments" | "/auth";

// Database Operations
type DbOperation = "create" | "read" | "update" | "delete";
```

### 🔸 Mixed Literal Types

```ts
type MixedLiteral = "hello" | 42 | true | null;

let value: MixedLiteral = "hello"; // ✅
value = 42;                        // ✅
value = true;                      // ✅
value = null;                      // ✅
value = "world";                   // ❌ Error
```

---

## 🔹 5. Literal Inference with `const`

TypeScript's literal inference behavior differs between `const` and `let` declarations.

### 🔸 Automatic Literal Inference

```ts
const role = "admin"; // inferred as type "admin"
const count = 42;     // inferred as type 42
const flag = true;    // inferred as type true
```

### 🔸 `let` vs `const` Behavior

```ts
let role = "admin"; // inferred as string
const roleConst = "admin"; // inferred as "admin"

// To get literal behavior with let
let roleLiteral = "admin" as const; // type is "admin"
```

### 🔸 `as const` Assertion

```ts
// Without as const
const config = {
  mode: "dark",
  layout: "grid"
};
// config.mode is type string

// With as const
const configConst = {
  mode: "dark",
  layout: "grid"
} as const;
// configConst.mode is type "dark"
```

---

## 🔹 6. Literal Types in Objects (`as const`)

The `as const` assertion freezes object properties to their literal types.

### 🔸 Object Literal Types

```ts
const config = {
  mode: "dark",
  layout: "grid",
  theme: "material"
} as const;

// All properties are now literal types
// config.mode is "dark", not string
// config.layout is "grid", not string
// config.theme is "material", not string
```

### 🔸 Nested Object Literals

```ts
const appConfig = {
  api: {
    baseUrl: "https://api.example.com",
    version: "v1"
  },
  features: {
    darkMode: true,
    notifications: false
  }
} as const;

// appConfig.api.baseUrl is "https://api.example.com"
// appConfig.features.darkMode is true
```

### 🔸 Array Literal Types

```ts
const colors = ["red", "green", "blue"] as const;
// colors is readonly ["red", "green", "blue"]

const numbers = [1, 2, 3] as const;
// numbers is readonly [1, 2, 3]
```

---

## 🔹 7. Literal Types with Discriminated Unions

Literal types are the foundation for **discriminated unions**, enabling type-safe polymorphism and exhaustive checking.

### 🔸 Basic Discriminated Union

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default:
      // TypeScript ensures this is exhaustive
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

### 🔸 Advanced Discriminated Union

```ts
type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function handleResponse<T>(response: ApiResponse<T>) {
  switch (response.status) {
    case "loading":
      console.log("Loading...");
      break;
    case "success":
      console.log("Data:", response.data);
      break;
    case "error":
      console.log("Error:", response.error);
      break;
  }
}
```

---

## 🔹 8. Advanced Literal Type Patterns

### 🔸 Branded Types with Literals

```ts
type UserId = string & { readonly __brand: unique symbol };
type ProductId = string & { readonly __brand: unique symbol };

function getUser(id: UserId) { /* ... */ }
function getProduct(id: ProductId) { /* ... */ }

// Prevents mixing up different string IDs
const userId = "user123" as UserId;
const productId = "prod456" as ProductId;

getUser(userId);     // ✅
getUser(productId);  // ❌ Error: Argument of type 'ProductId' is not assignable to parameter of type 'UserId'
```

### 🔸 Conditional Literal Types

```ts
type IsStringLiteral<T> = T extends string ? (string extends T ? false : true) : false;

type Test1 = IsStringLiteral<"hello">; // true
type Test2 = IsStringLiteral<string>;  // false
type Test3 = IsStringLiteral<number>;  // false
```

### 🔸 Mapped Literal Types

```ts
type EventMap = {
  click: MouseEvent;
  keydown: KeyboardEvent;
  scroll: Event;
};

type EventHandlers = {
  [K in keyof EventMap]: (event: EventMap[K]) => void;
};

// Results in:
// {
//   click: (event: MouseEvent) => void;
//   keydown: (event: KeyboardEvent) => void;
//   scroll: (event: Event) => void;
// }
```

---

## 🔹 9. Performance and Best Practices

### 🔸 When to Use Literal Types

✅ **Use literal types when:**
- You have a finite set of known values
- You need compile-time validation
- Building APIs with strict contracts
- Creating state machines
- Implementing discriminated unions

❌ **Avoid literal types when:**
- Values are truly dynamic
- You need runtime flexibility
- Building generic utilities
- Performance is critical (large unions)

### 🔸 Performance Considerations

```ts
// ❌ Avoid very large unions
type LargeUnion = "a" | "b" | "c" | /* ... 1000+ values */;

// ✅ Use enums or const objects for large sets
enum Status {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}
```

### 🔸 Best Practices

```ts
// ✅ Use descriptive names
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// ✅ Group related literals
type Theme = "light" | "dark";
type Layout = "grid" | "list";

// ✅ Use const assertions for immutable data
const API_ENDPOINTS = {
  USERS: "/users",
  POSTS: "/posts"
} as const;

// ✅ Combine with utility types
type PartialTheme = Partial<Record<Theme, boolean>>;
```

---

## 🔚 Summary

| Feature               | Description                             | Use Case                    |
|------------------------|-----------------------------------------|-----------------------------|
| String literals        | `"start"`, `"stop"`, `"pause"`          | API endpoints, status values |
| Number literals        | `0`, `1`, `42`                          | HTTP codes, enum values     |
| Boolean literals       | `true`, `false`                         | Feature flags, toggles      |
| Combined with unions   | Creates finite, strict value sets       | State machines, options     |
| With `as const`        | Freezes values to literal types         | Configuration objects        |
| Discriminated unions   | Type-safe polymorphism                  | Event handling, API responses |
| Template literals      | Dynamic string generation               | Event names, CSS properties |
| Common use             | APIs, state machines, discriminated unions | Type-safe development       |

**Key Benefits:**
- **Compile-time safety**: Catch errors before runtime
- **Better IntelliSense**: Enhanced autocomplete and suggestions
- **Self-documenting code**: Types serve as documentation
- **Refactoring safety**: Changes propagate through the type system
- **Exhaustive checking**: Ensure all cases are handled

# TypeScript: Type Assertions (`as`, `<>`)

**Type assertions** tell the TypeScript compiler to **treat a value as a specific type**, overriding its inferred type.  
They do **not** change the actual runtime behavior — they only affect type checking at compile time.

---

## ✅ Syntax Options

### 1. `as` syntax (Recommended)

```ts
let someValue: unknown = "hello";
let strLength = (someValue as string).length;
```

### 2. Angle-bracket syntax (Not recommended for JSX)

```ts
let someValue: unknown = "hello";
let strLength = (<string>someValue).length;
```

> ⚠️ Avoid the angle-bracket syntax if you're working in a `.tsx` (JSX/React) file, because it conflicts with JSX tags.

---

## 🧠 When to Use Type Assertions

1. **You're confident** about the value's type but TypeScript can't infer it.
2. You want to **narrow from a broader type** like `unknown` or `any`.
3. Working with **DOM elements** where you know the specific element type.
4. **API responses** where you know the structure but TypeScript doesn't.
5. **Legacy code integration** where types are unclear.

### Example 1: Working with DOM elements

```ts
const input = document.querySelector("input") as HTMLInputElement;
console.log(input.value);
```

> Without the `as` assertion, TypeScript would treat `input` as `Element | null`.

---

### Example 2: Asserting `any` or `unknown`

```ts
let data: any = "TypeScript";
let len: number = (data as string).length;

// Better approach with unknown
let unknownData: unknown = "Hello World";
let strLength = (unknownData as string).length;
```

---

### Example 3: Force narrowing

```ts
type Animal = { name: string };
type Dog = { name: string; bark: () => void };

let pet: Animal = { name: "Buddy" };
let dog = pet as Dog; // ❗️TypeScript will allow it, even if unsafe
```

> ⚠️ **Type assertions do not perform runtime checks** — use with caution.

---

## 🔧 Advanced Type Assertion Patterns

### 1. Const Assertions

```ts
// Without const assertion
let colors = ["red", "green", "blue"]; // string[]

// With const assertion
let colors = ["red", "green", "blue"] as const; // readonly ["red", "green", "blue"]

// Object const assertion
let config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
} as const;
// Result: { readonly apiUrl: "https://api.example.com"; readonly timeout: 5000; }
```

### 2. Assertion Functions

```ts
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Expected string");
  }
}

let data: unknown = "hello";
assertIsString(data); // Now TypeScript knows data is string
console.log(data.toUpperCase()); // ✅ No error
```

### 3. Type Predicates vs Type Assertions

```ts
// Type predicate (runtime check)
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// Type assertion (no runtime check)
function assertString(value: unknown): asserts value is string {
  // No runtime validation!
}

let data: unknown = 123;

if (isString(data)) {
  console.log(data.toUpperCase()); // ✅ Safe
}

assertString(data); // ❌ Unsafe - no runtime check
console.log(data.toUpperCase()); // Runtime error!
```

---

## 🛑 Double Assertion (use with care)

Sometimes used to force a cast between unrelated types:

```ts
let num = "123" as unknown as number;
let bool = 1 as unknown as boolean;
```

- Useful for edge cases, but dangerous.
- Can lead to runtime errors if misused.
- Use only when you're absolutely certain about the conversion.

---

## 🎯 Best Practices

### ✅ Do's

1. **Use type guards when possible** instead of assertions
2. **Validate at runtime** when using assertions
3. **Prefer `as` syntax** over angle brackets
4. **Use const assertions** for literal types
5. **Document why** you're using an assertion

```ts
// Good: Using type guard
function processData(data: unknown) {
  if (typeof data === "string") {
    return data.toUpperCase(); // Safe
  }
  throw new Error("Expected string");
}

// Acceptable: When you're certain
const element = document.getElementById("myInput") as HTMLInputElement;
```

### ❌ Don'ts

1. **Don't use assertions to bypass type safety**
2. **Don't assert without runtime validation**
3. **Don't use double assertions unless absolutely necessary**
4. **Don't ignore TypeScript errors with assertions**

```ts
// Bad: Bypassing type safety
let user = {} as User; // No properties, but TypeScript thinks it's a User

// Bad: No runtime validation
let data = someApiResponse as UserData; // Could be anything

// Good: With validation
function validateUserData(data: unknown): UserData {
  if (typeof data === "object" && data !== null && "name" in data) {
    return data as UserData; // Safe after validation
  }
  throw new Error("Invalid user data");
}
```

---

## 🚨 Common Pitfalls

### 1. Asserting without validation

```ts
// Dangerous
let user = JSON.parse(response) as User;

// Better
function parseUser(json: string): User {
  const parsed = JSON.parse(json);
  if (isValidUser(parsed)) {
    return parsed;
  }
  throw new Error("Invalid user data");
}
```

### 2. Overusing assertions

```ts
// Bad: Too many assertions
let result = (data as ApiResponse).data as UserData;

// Better: Use proper typing
interface ApiResponse<T> {
  data: T;
}
let result: ApiResponse<UserData> = data;
```

### 3. Ignoring null/undefined

```ts
// Dangerous
let element = document.querySelector("#myDiv") as HTMLDivElement;

// Better
let element = document.querySelector("#myDiv");
if (element) {
  let div = element as HTMLDivElement;
  // Use div safely
}
```

---

## 🔚 Summary

| Feature           | Description                                        |
|------------------|----------------------------------------------------|
| `as` syntax       | Safe and JSX-compatible                           |
| `<T>` syntax      | Classic JS-style, but not JSX-safe                |
| Purpose           | Override inferred type                            |
| Runtime impact    | None — purely compile-time                        |
| Use cases         | DOM access, unknown/any types, complex narrowing  |
| Const assertions  | Create literal types                               |
| Assertion functions | Runtime validation with type narrowing          |
| Best practice     | Use type guards when possible                     |


# TypeScript: Type Inference vs Explicit Types

In TypeScript, types can be either **inferred automatically** or **declared explicitly**. Understanding the difference is essential for writing clean, safe, and maintainable code.

---

## ✅ 1. Type Inference

**Definition**: TypeScript automatically infers (guesses) the type based on the value assigned.

```ts
let name = "Kishan"; // inferred as string
let count = 10;      // inferred as number
```

**When it happens**:
- Variable initialization
- Function return types (if not specified)
- Array and object literals

**Example:**

```ts
function add(a: number, b: number) {
  return a + b; // inferred as number
}
```

> ✅ **Good Practice**: Let TypeScript infer simple and obvious types to reduce verbosity.

---

## ❗️ 2. Explicit Types

**Definition**: You manually declare the type of a variable or function.

```ts
let name: string = "Kishan";
let count: number = 10;
```

**When to use**:
- When variable is declared but not initialized
- For function arguments and return values (especially in libraries)
- For clarity and API documentation
- When inference is not possible or ambiguous

**Example:**

```ts
function greet(name: string): string {
  return \`Hello, \${name}\`;
}
```

> ✅ **Good Practice**: Use explicit types in public APIs or complex logic for better clarity and tooling.

---

## ⚖️ When to Use What?

| Use Case                      | Recommended Approach      |
|------------------------------|---------------------------|
| Obvious initial value        | Inference (`let x = 42`)  |
| No initial value             | Explicit (`let x: number`)|
| Public API (functions, libs) | Explicit                  |
| Complex logic or constraints | Explicit                  |
| Prototypes or early drafts   | Inference                 |

---

## 🧠 Pitfall Example

```ts
let data; // inferred as `any`
data = "hello"; // allowed
data = 42;      // also allowed
```

💡 **Solution**: Always specify a type if you're declaring without initializing:

```ts
let data: string;
```

---

## 🔁 Inference with Arrays & Objects

```ts
let colors = ["red", "green", "blue"]; // inferred as string[]
let user = { name: "Kishan", age: 30 }; // inferred as { name: string; age: number }
```

If more precision is needed:

```ts
let colors: Array<"red" | "green" | "blue">;
```

---

## 🔚 Summary

| Feature           | Type Inference              | Explicit Types                      |
|------------------|-----------------------------|-------------------------------------|
| Developer Input  | Not needed                  | Required                            |
| Code Verbosity   | Less                        | More                                |
| Readability      | Cleaner in simple cases     | Better in complex/public interfaces |
| Type Safety      | Good                        | Excellent                           |
| Refactoring      | Easy                        | Clearer for teams                   |

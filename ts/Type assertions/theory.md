
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

## 🛑 Double Assertion (use with care)

Sometimes used to force a cast between unrelated types:

```ts
let num = "123" as unknown as number;
```

- Useful for edge cases, but dangerous.
- Can lead to runtime errors if misused.

---

## 🔚 Summary

| Feature           | Description                                        |
|------------------|----------------------------------------------------|
| `as` syntax       | Safe and JSX-compatible                           |
| `<T>` syntax      | Classic JS-style, but not JSX-safe                |
| Purpose           | Override inferred type                            |
| Runtime impact    | None — purely compile-time                        |
| Use cases         | DOM access, unknown/any types, complex narrowing  |

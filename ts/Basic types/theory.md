
# TypeScript: Basic Types

TypeScript enhances JavaScript by adding **static types**. These types help you catch errors at compile time and provide better developer tooling (like autocompletion and refactoring).

---

## 1. `string`

Represents textual data.

```ts
let firstName: string = "Kishan";
```

- Can use `'`, `"`, or backticks `` ` ``.
- Supports string interpolation with template literals.

---

## 2. `number`

Represents all numbers (integers and floats).

```ts
let age: number = 25;
let temperature: number = 98.6;
```

- No separate `int`, `float`, or `double` types.

---

## 3. `boolean`

Represents a value that is either `true` or `false`.

```ts
let isLoggedIn: boolean = true;
```

---

## 4. `any`

Disables type checking. You can assign anything.

```ts
let data: any = 5;
data = "hello";
data = true;
```

- **Avoid overusing** `any`; it defeats the purpose of TypeScript.
- Use it only when you're migrating from JS or dealing with dynamic inputs (e.g., 3rd-party data).

---

## 5. `unknown`

Like `any`, but **safer**. You must check its type before using it.

```ts
let value: unknown = "text";

if (typeof value === "string") {
  console.log(value.toUpperCase()); // OK
}
```

- Good for APIs where the type is unknown until runtime.
- Encourages **type narrowing** before use.

---

## 6. `never`

Represents values that **never occur**.

```ts
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
```

- Used when a function never returns (throws or loops forever).
- Also used in exhaustive `switch` cases for type safety.

---

## 7. `null` and `undefined`

Both are JavaScript primitives and can be their own types.

```ts
let n: null = null;
let u: undefined = undefined;
```

- By default, variables can't be `null` or `undefined` unless explicitly allowed (with `strictNullChecks` on).

---

## 8. `void`

Used when a function doesn’t return anything.

```ts
function logMessage(msg: string): void {
  console.log(msg);
}
```

- Return type of `void` indicates absence of a value.

---

## 9. Literal Types

You can restrict a variable to a specific value.

```ts
let direction: "up" | "down" | "left" | "right";
direction = "up"; // ✅
direction = "sideways"; // ❌ Error
```

---

## Summary Table

| Type        | Description                      |
|-------------|----------------------------------|
| `string`    | Textual data                     |
| `number`    | Integer or float numbers         |
| `boolean`   | `true` or `false`                |
| `any`       | Opt-out of type-checking         |
| `unknown`   | Like `any` but must be checked   |
| `never`     | Function never returns           |
| `null`      | Explicit absence of value        |
| `undefined` | Uninitialized or missing value   |
| `void`      | No return value                  |


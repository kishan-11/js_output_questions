
# TypeScript: Literal Types

**Literal types** allow you to specify exact values a variable can take — instead of just `string`, `number`, or `boolean`, you can restrict it to **specific string, number, or boolean values**.

This enables **more precise typing** and **safer code**, especially when used with unions and enums.

---

## 🔹 1. String Literal Types

You can restrict a variable to specific string values:

```ts
let direction: "up" | "down" | "left" | "right";

direction = "up";    // ✅
direction = "right"; // ✅
direction = "side";  // ❌ Error
```

### 🔸 Use in Functions

```ts
function move(dir: "up" | "down") {
  console.log(\`Moving \${dir}\`);
}

move("up");   // ✅
move("left"); // ❌ Error
```

---

## 🔹 2. Number Literal Types

Restrict to specific numbers:

```ts
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

let roll: DiceRoll = 4; // ✅
roll = 7;               // ❌ Error
```

---

## 🔹 3. Boolean Literal Types

Restrict to `true` or `false` specifically:

```ts
type IsEnabled = true;

let flag: IsEnabled = true;  // ✅
flag = false;                // ❌ Error
```

---

## 🔹 4. Literal Types in Unions

Combining literal types using unions gives powerful enum-like behavior:

```ts
type Status = "success" | "error" | "loading";

function showStatus(status: Status) {
  console.log(\`Status is: \${status}\`);
}
```

---

## 🔹 5. Literal Inference with `const`

When you use `const`, TypeScript infers literal types automatically:

```ts
const role = "admin"; // inferred as type "admin"
```

But with `let`, it’s broader:

```ts
let role = "admin"; // inferred as string
```

To get literal behavior:

```ts
const role = "admin" as const; // type is "admin"
```

---

## 🔹 6. Literal Types in Objects (`as const`)

```ts
const config = {
  mode: "dark",
  layout: "grid"
} as const;
```

Now `config.mode` is type `"dark"` instead of `string`.

---

## 🔹 7. Literal Types with Discriminated Unions

Literal types are the basis for **discriminated unions**, enabling type-safe polymorphism:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  } else {
    return shape.side ** 2;
  }
}
```

---

## 🔚 Summary

| Feature               | Description                             |
|------------------------|-----------------------------------------|
| String literals        | `"start"`, `"stop"`, `"pause"`          |
| Number literals        | `0`, `1`, `42`                          |
| Boolean literals       | `true`, `false`                         |
| Combined with unions   | Creates finite, strict value sets       |
| With `as const`        | Freezes values to literal types         |
| Common use             | APIs, state machines, discriminated unions |

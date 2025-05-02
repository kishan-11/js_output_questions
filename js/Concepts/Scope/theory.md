
# JavaScript Scope Types

JavaScript scope defines the accessibility (visibility) of variables and functions in different parts of the code.

---

## 🔹 1. Global Scope

- Declared **outside** of any function or block.
- Accessible **everywhere** in your code.

```javascript
var globalVar = "I'm global";

function test() {
  console.log(globalVar); // Accessible
}
```

---

## 🔹 2. Function Scope

- Variables declared with `var` inside a function are only accessible **within that function**.

```javascript
function greet() {
  var message = "Hello";
  console.log(message);
}
console.log(message); // ❌ ReferenceError
```

---

## 🔹 3. Block Scope

- Applies to `{}` blocks (e.g., `if`, `for`, `while`, etc.).
- Variables declared with `let` or `const` are only accessible **within the block**.

```javascript
if (true) {
  let a = 10;
  const b = 20;
}
console.log(a); // ❌ ReferenceError
console.log(b); // ❌ ReferenceError
```

---

## 🔹 4. Lexical Scope

- Refers to how JavaScript resolves variable names based on where functions are **defined**, not where they are **called**.
- Inner functions have access to outer function variables.

```javascript
function outer() {
  let name = "Kishan";

  function inner() {
    console.log(name); // ✅ Accessible due to lexical scope
  }

  inner();
}
outer();
```

---

## 🔹 5. Module Scope (ES6 Modules)

- Each ES6 module has its own scope.
- Variables/functions declared in one module are not available in another unless explicitly exported/imported.

```javascript
// file: utils.js
export const tool = "scope";

// file: main.js
import { tool } from './utils.js';
```

---

## 🧠 Summary Table

| Scope Type     | Keyword(s)         | Visibility                   | Notes                          |
|----------------|--------------------|-------------------------------|--------------------------------|
| Global         | `var`, `let`, `const` | Whole script/file          | Available anywhere             |
| Function       | `var`              | Inside the function only      | Function-scoped                |
| Block          | `let`, `const`     | Inside `{}` blocks only       | ES6 feature                    |
| Lexical        | N/A                | Inner functions access outer vars | Based on definition location |
| Module         | `import`, `export` | File-level scope              | Used in ES6 modules            |

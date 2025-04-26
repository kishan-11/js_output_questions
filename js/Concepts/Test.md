# Hoisting in JavaScript

## What is Hoisting?

**Hoisting** is a JavaScript mechanism where **variable declarations** and **function declarations** are moved ("hoisted") to the top of their containing scope **during the compilation phase** — before the code actually runs.

In simpler terms:  
You can use functions and variables **before** you declare them in the code.

---

## How Hoisting Works

When the JavaScript engine runs your code:
1. It **first scans** for all variable and function declarations.
2. It **hoists** (moves) the declarations to the top of their scope.
3. **Initializations (assignments)** are **not hoisted** — only the declarations are.

---

## Example: Variable Hoisting

```javascript
console.log(a); // Output: undefined
var a = 5;

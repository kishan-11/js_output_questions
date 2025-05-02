
# JavaScript Hoisting: Variables and Functions

---

## ✅ What is Hoisting?

**Hoisting** is JavaScript's behavior of moving **declarations** (not initializations) to the top of their scope before code execution.

---

## 🔹 Variable Hoisting

### `var`
- **Hoisted** to the top of its function scope.
- **Initialized with `undefined`**.
- Can be accessed before declaration without error.

```javascript
console.log(a); // undefined
var a = 10;
```

### `let` and `const`
- **Hoisted**, but **not initialized**.
- Exist in a **Temporal Dead Zone (TDZ)** from start of block until declaration.
- Accessing them before declaration throws a `ReferenceError`.

```javascript
console.log(b); // ReferenceError
let b = 20;

console.log(c); // ReferenceError
const c = 30;
```

---

## 🧠 Temporal Dead Zone (TDZ)

A time between entering scope and the actual declaration where `let`/`const` variables **exist but can't be accessed**.

```javascript
{
  console.log(x); // ❌ ReferenceError
  let x = 5;      // TDZ ends here
}
```

---

## 🔹 Function Hoisting

### Function Declarations
- **Fully hoisted**: both name and body are moved to the top.
- Can be called before declaration.

```javascript
greet(); // ✅ Works

function greet() {
  console.log("Hello!");
}
```

### Function Expressions & Arrow Functions
- Only the **variable name is hoisted**, not the function body.
- Accessing before declaration gives a `TypeError`.

```javascript
sayHi(); // ❌ TypeError: sayHi is not a function

var sayHi = function () {
  console.log("Hi");
};

arrow(); // ❌ TypeError: arrow is not a function

var arrow = () => {
  console.log("Arrow!");
};
```

---

## 🆚 Summary Table

| Feature                   | `var`             | `let` / `const`      | Function Declaration | Arrow Function (`const/let`) |
|---------------------------|-------------------|-----------------------|-----------------------|-------------------------------|
| Scope                     | Function           | Block                 | Function              | Block                         |
| Hoisted?                  | ✅ Yes             | ✅ Yes (TDZ applies)  | ✅ Fully              | ❌ Only name hoisted          |
| Initialized at hoisting? | ✅ `undefined`     | ❌ No (TDZ)           | ✅ Yes                | ❌ No                         |
| Callable before declared? | N/A               | ❌ ReferenceError     | ✅ Yes                | ❌ TypeError                 |


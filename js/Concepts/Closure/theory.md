
# JavaScript Closures: Lexical Scope & Execution Context

---

## ✅ What is a Closure?

A **closure** is a function that “remembers” the variables from its **lexical scope** even when it's executed **outside** that scope.

---

## 🔹 1. How Closures Work – Step by Step

### 📌 Step 1: Lexical Scope

JavaScript uses **lexical scoping**, meaning the scope is determined by the function's location in the code.

```javascript
function outer() {
  let name = "Kishan";

  function inner() {
    console.log(name); // ✅ Accesses variable from lexical scope
  }

  return inner;
}
```

### 📌 Step 2: Execution Context

Each function call creates a new **execution context**.  
If an inner function accesses outer variables, a **closure** is formed and the reference to those variables is **preserved**.

```javascript
const fn = outer(); // outer() returns inner function
fn();               // Logs "Kishan"
```

Even though `outer()` has returned, `inner()` still has access to `name` via a closure.

---

## 🔁 Conceptual Diagram

```text
Global Scope
  └── outer() Execution Context
         └── inner() has closure → remembers `name = "Kishan"`
```

---

## 🔍 Practical Example

```javascript
function counter() {
  let count = 0;

  return function () {
    count++;
    console.log(count);
  };
}

const inc = counter();
inc(); // 1
inc(); // 2
```

- The `count` variable is remembered across multiple calls thanks to a **closure**.

---

## 🧠 Summary Table

| Concept              | Role in Closures                                               |
|----------------------|----------------------------------------------------------------|
| **Lexical Scope**    | Determines what variables are available in nested functions    |
| **Execution Context**| Runtime environment where code is evaluated                    |
| **Closure**          | Preserved access to outer scope variables after function ends  |

---

## 🔒 Common Use Cases of Closures

- Private variables
- Function factories
- Stateful callbacks
- Memoization and caching


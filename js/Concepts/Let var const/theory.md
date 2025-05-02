
# `var`, `let`, and `const` in JavaScript – Scope & Hoisting

## 🔹 `var`

- **Scope:**  
  Function-scoped (visible throughout the entire function where it's declared)

- **Hoisting:**  
  **Hoisted** to the top of its function **and initialized with `undefined`**

- **Reassignable:** ✅ Yes  
- **Redeclarable:** ✅ Yes

**Example:**
```javascript
function example() {
  console.log(a); // undefined (hoisted)
  var a = 10;
  console.log(a); // 10
}
```

---

## 🔹 `let`

- **Scope:**  
  **Block-scoped** (only visible inside the `{}` block where it's declared)

- **Hoisting:**  
  **Hoisted**, but **not initialized** (accessing before declaration throws a `ReferenceError`)

- **Reassignable:** ✅ Yes  
- **Redeclarable:** ❌ No (within the same scope)

**Example:**
```javascript
function example() {
  console.log(b); // ReferenceError
  let b = 20;
}
```

---

## 🔹 `const`

- **Scope:**  
  **Block-scoped**

- **Hoisting:**  
  Same as `let` – hoisted but not initialized

- **Reassignable:** ❌ No  
- **Redeclarable:** ❌ No

**Note:** `const` **does not mean immutable** – objects and arrays declared with `const` can still be modified internally.

**Example:**
```javascript
const obj = { name: "Kishan" };
obj.name = "Patel";  // ✅ allowed

obj = {}; // ❌ TypeError (can't reassign)
```

---

## 🆚 Summary Table

| Feature      | `var`            | `let`            | `const`            |
|--------------|------------------|------------------|---------------------|
| Scope        | Function          | Block             | Block               |
| Hoisted      | Yes (initialized)| Yes (not initialized) | Yes (not initialized) |
| Redeclarable | Yes              | No               | No                  |
| Reassignable | Yes              | Yes              | No                  |
| TDZ Error    | No               | Yes              | Yes                 |

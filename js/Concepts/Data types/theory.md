
# JavaScript Data Types

JavaScript has two broad categories of data types:

1. **Primitive Data Types**
2. **Non-Primitive (Reference) Data Types**

---

## 🔹 1. Primitive Data Types

These are **immutable** and stored **by value**.

| Type        | Description                         | Example                    |
|-------------|-------------------------------------|----------------------------|
| `String`    | Textual data                        | `"Hello"`                  |
| `Number`    | Numeric values                      | `42`, `3.14`               |
| `BigInt`    | Large integers beyond `Number` range| `12345678901234567890n`    |
| `Boolean`   | Logical true or false               | `true`, `false`            |
| `undefined` | Variable declared but not assigned  | `let x;`                   |
| `null`      | Intentional absence of value        | `let x = null;`            |
| `Symbol`    | Unique identifiers                  | `Symbol("id")`             |

---

## 🔹 2. Non-Primitive (Reference) Data Types

These are **mutable** and stored **by reference**.

| Type       | Description                       | Example                |
|------------|-----------------------------------|------------------------|
| `Object`   | Key-value pairs                   | `{ name: "Kishan" }`   |
| `Array`    | Ordered list of values            | `[1, 2, 3]`            |
| `Function` | Callable object                   | `function() {}`        |
| `Date`, `RegExp`, etc. | Built-in objects       | `new Date()`           |

---

## 🆚 Primitive vs Non-Primitive

| Feature              | Primitive                       | Non-Primitive                |
|----------------------|----------------------------------|------------------------------|
| Stored as            | **Value**                       | **Reference** (memory address)|
| Mutability           | Immutable (can't change value)  | Mutable (can change contents)|
| Memory               | Stored in stack                 | Stored in heap (reference in stack) |
| Comparison           | Compared by value               | Compared by reference        |
| Examples             | `5`, `"hello"`, `true`          | `{}`, `[]`, `function(){}`   |

---

## 🔍 Example: Comparison

```javascript
// Primitive
let a = 10;
let b = a;
b = 20;
console.log(a); // 10

// Non-Primitive
let obj1 = { name: "Kishan" };
let obj2 = obj1;
obj2.name = "Patel";
console.log(obj1.name); // "Patel" (same reference)
```

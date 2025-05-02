
# Destructuring, Spread & Rest Operators in JavaScript

These modern JavaScript features (introduced in ES6) help simplify code when working with arrays, objects, and function arguments.

---

## 🔹 1. Destructuring

Destructuring allows you to **unpack values** from arrays or **properties** from objects into **separate variables**.

### 🔸 Array Destructuring
```javascript
const nums = [1, 2, 3];
const [a, b, c] = nums;
console.log(a); // 1
```

### 🔸 Object Destructuring
```javascript
const user = { name: "Kishan", age: 25 };
const { name, age } = user;
console.log(name); // Kishan
```

### 🔸 Renaming While Destructuring
```javascript
const { name: userName } = user;
console.log(userName); // Kishan
```

---

## 🔹 2. Spread Operator (`...`)

The **spread operator** is used to **expand** elements of an array or object.

### 🔸 Spread with Arrays
```javascript
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]
```

### 🔸 Spread with Objects
```javascript
const obj1 = { a: 1 };
const obj2 = { ...obj1, b: 2 }; // { a: 1, b: 2 }
```

### 🔸 Spread in Function Arguments
```javascript
function sum(x, y, z) {
  return x + y + z;
}
const numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6
```

---

## 🔹 3. Rest Operator (`...`)

The **rest operator** is used to **collect** multiple elements into an array or object.

### 🔸 Rest with Arrays
```javascript
const [first, ...rest] = [1, 2, 3, 4];
console.log(rest); // [2, 3, 4]
```

### 🔸 Rest with Objects
```javascript
const { a, ...others } = { a: 1, b: 2, c: 3 };
console.log(others); // { b: 2, c: 3 }
```

### 🔸 Rest in Function Parameters
```javascript
function logAll(...args) {
  console.log(args);
}
logAll(1, 2, 3); // [1, 2, 3]
```

---

## 🧠 Summary Table

| Feature         | Symbol | Purpose                       | Example                             |
|------------------|--------|-------------------------------|--------------------------------------|
| Destructuring    | —      | Unpack array/object values    | `const [a, b] = arr`                |
| Spread Operator  | `...`  | Expand elements               | `const arr2 = [...arr1]`           |
| Rest Operator    | `...`  | Collect multiple values       | `function(...args) {}`             |


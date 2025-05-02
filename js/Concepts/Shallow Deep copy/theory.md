
# Shallow Copy vs Deep Copy in JavaScript

When copying objects or arrays, JavaScript handles values by reference. Understanding the difference between shallow and deep copies is important to avoid unintended side effects.

---

## 🔹 What is a Shallow Copy?

A **shallow copy** only copies the first level of an object or array.  
Nested objects are still references to the original memory location.

### Example:
```javascript
const original = {
  name: "Kishan",
  address: { city: "Mumbai" }
};

const shallow = { ...original };
shallow.address.city = "Delhi";

console.log(original.address.city); // "Delhi"
```

### Common shallow copy techniques:
- Objects: `Object.assign({}, obj)`, `{ ...obj }`
- Arrays: `arr.slice()`, `[...arr]`, `Array.from(arr)`

---

## 🔹 What is a Deep Copy?

A **deep copy** duplicates all levels of the original data.  
Nested objects and arrays are also cloned, so the new structure is independent.

### Example:
```javascript
const original = {
  name: "Kishan",
  address: { city: "Mumbai" }
};

const deep = JSON.parse(JSON.stringify(original));
deep.address.city = "Delhi";

console.log(original.address.city); // "Mumbai"
```

### Common deep copy techniques:
- `JSON.parse(JSON.stringify(obj))` *(simple cases)*
- `_.cloneDeep(obj)` from Lodash *(robust and handles complex structures)*

---

## 🧠 Summary Table

| Feature             | Shallow Copy                         | Deep Copy                          |
|---------------------|--------------------------------------|-------------------------------------|
| Top-level copy      | ✅ Yes                                | ✅ Yes                               |
| Nested reference    | ❌ Still shared                       | ✅ Fully copied                      |
| Performance         | ✅ Fast                               | ⚠️ Slower (recursive)               |
| Use cases           | No nested mutation needed            | Isolation from original object      |
| Tools               | `Object.assign`, spread operator     | `JSON.stringify`, `_.cloneDeep`     |

---

## 🧪 Bonus: Object Comparison

```javascript
const a = { x: 1 };
const b = { x: 1 };

console.log(a === b); // false – different references
```

To compare actual values, use deep equality check tools like Lodash's `isEqual`.

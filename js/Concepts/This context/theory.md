
# JavaScript `this` – Regular Functions vs Arrow Functions

---

## ✅ What is `this`?

The value of `this` refers to the **object that is executing the function**.

Its behavior depends on:
- Where and how the function is **defined**
- How the function is **called**

---

## 🔸 1. `this` in Regular Functions

- `this` is **dynamic** and set based on the **calling context**.
- In methods, `this` refers to the object.
- In standalone calls, `this` is `undefined` in strict mode (or `window` in non-strict mode).

### Example:
```javascript
const user = {
  name: "Kishan",
  greet: function () {
    console.log(this.name); // "Kishan"
  }
};

user.greet(); // 'this' = user
```

```javascript
function show() {
  console.log(this); // 'this' = undefined in strict mode
}

show();
```

---

## 🔸 2. `this` in Arrow Functions

- Arrow functions **do not have their own `this`**.
- They inherit `this` from the **lexical (parent) scope**.

### Example:
```javascript
const user = {
  name: "Kishan",
  greet: () => {
    console.log(this.name); // 'this' is not `user`
  }
};

user.greet(); // undefined
```

To preserve the correct `this`:

```javascript
const user = {
  name: "Kishan",
  greet: function () {
    const arrow = () => {
      console.log(this.name); // 'this' = user
    };
    arrow();
  }
};

user.greet(); // "Kishan"
```

---

## 🧠 Summary Table

| Feature                 | Regular Function                  | Arrow Function                        |
|--------------------------|-----------------------------------|----------------------------------------|
| Own `this`?              | ✅ Yes                            | ❌ No (inherits from parent scope)     |
| Bound at                | Call time                        | Definition time (lexical scope)       |
| Useful for              | Dynamic contexts (e.g., methods) | Preserving outer `this` (e.g., callbacks) |
| Can be used as method?  | ✅ Yes                            | ⚠️ Not recommended                     |


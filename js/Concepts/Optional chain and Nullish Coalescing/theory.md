
# Optional Chaining (`?.`) & Nullish Coalescing (`??`) in JavaScript

## ✅ Optional Chaining (`?.`)

**Purpose:**  
Avoids runtime errors when accessing deeply nested properties that may not exist.

**Syntax:**
```javascript
obj?.prop
obj?.[expr]
obj?.method?.()
```

**Example:**
```javascript
const user = {
  name: "Kishan",
  address: {
    city: "Mumbai"
  }
};

console.log(user.address?.city);      // "Mumbai"
console.log(user.address?.pincode);  // undefined (no error)
console.log(user.contact?.phone);    // undefined (no error)
```

**Without optional chaining:**
```javascript
console.log(user && user.address && user.address.city);  // "Mumbai"
```

---

## ✅ Nullish Coalescing (`??`)

**Purpose:**  
Provides a default value **only when the left-hand side is `null` or `undefined`** (not `0`, `false`, or `""`).

**Syntax:**
```javascript
let result = a ?? b;
```

**Example:**
```javascript
let input = null;
let name = input ?? "Default Name";
console.log(name);  // "Default Name"

let count = 0;
console.log(count ?? 10);  // 0 (not replaced)
```

**Compared to `||`:**
```javascript
let value = 0 || 100;   // 100 (because 0 is falsy)
let value2 = 0 ?? 100;  // 0 (nullish coalescing ignores falsy like 0)
```

---

## ✅ Use Together:

```javascript
const user = {
  profile: null
};

const theme = user?.settings?.theme ?? "light";
console.log(theme); // "light"
```

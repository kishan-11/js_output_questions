
# JavaScript Prototypes, Inheritance & Prototype Chain

---

## ✅ Prototypes in JavaScript

Every JavaScript object has an internal link to another object called its **prototype**.

- This link is accessible via `__proto__` (or `Object.getPrototypeOf(obj)`)
- Shared methods and properties can be placed on the prototype

### Example:
```javascript
const person = {
  greet() {
    console.log("Hello!");
  }
};

const user = {
  name: "Kishan"
};

user.__proto__ = person;
user.greet(); // "Hello!" from person prototype
```

---

## 🔹 Inheritance

Inheritance is when one object **gains access** to properties and methods of another.

In JavaScript, inheritance is achieved via **prototypes**.

### Example:
```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(`${this.name} makes a noise.`);
};

const dog = new Animal("Buddy");
dog.speak(); // Buddy makes a noise.
```

---

## 🔹 ES6 Class Syntax (Syntax Sugar for Prototypes)

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks.`);
  }
}

const d = new Dog("Max");
d.speak(); // Max barks.
```

---

## 🔗 Understanding the Prototype Chain

When accessing a property:
1. JS looks at the object itself
2. If not found, it looks up `__proto__`
3. Continues until it reaches `null`

### Example:
```javascript
const grandparent = {
  greet: () => console.log("Hi from Grandparent")
};

const parent = Object.create(grandparent);
const child = Object.create(parent);

child.greet(); // "Hi from Grandparent"
```

### Prototype Chain:
```text
child.__proto__ === parent
parent.__proto__ === grandparent
grandparent.__proto__ === Object.prototype
Object.prototype.__proto__ === null
```

---

## 🔁 Property Lookup Steps

1. Check the object itself
2. If property not found, follow `__proto__`
3. Repeat up the chain until found or `null`

---

## 🧠 Summary Table

| Feature           | Prototype                            | Inheritance                         |
|-------------------|---------------------------------------|--------------------------------------|
| Definition        | A hidden object that other objects inherit from | Mechanism to access properties from another object |
| Mechanism         | Object-to-object link via `__proto__` | Achieved using prototype chaining    |
| Use               | To define shared properties/methods   | To reuse behavior across instances   |
| Involves          | A single object                       | One or more levels of objects        |
| Related to        | Object structure                      | Code reuse and hierarchy             |


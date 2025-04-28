# Comprehensive Guide to Call, Apply, and Bind Methods in JavaScript

## Basic Example

Let's start with a simple object with a method:

```javascript
const person1 = {
  firstName: "Kishan",
  lastName: "Patel",
  printFullName: function () {
    console.log(this.firstName + " " + this.lastName);
  },
};
person1.printFullName(); // Output: Kishan Patel
```

Now, let's say we have another object:

```javascript
const person2 = {
  firstName: "Bhoomi",
  lastName: "Shah",
};
```

## Problem: How can we use the printFullName function with person2?

### Option 1: Duplicate the method (Not Recommended)

```javascript
const person2 = {
  firstName: "Bhoomi",
  lastName: "Shah",
  printFullName: function () {
    console.log(this.firstName + " " + this.lastName);
  },
};
```

**Drawbacks**: Creates duplicate code and makes future maintenance difficult.

### Option 2: Using `.call()` method

```javascript
person1.printFullName.call(person2); // Output: Bhoomi Shah
```

**Drawback**: Still depends on `person1` object.

### Option 3: Create a separate function and use `.call()` (Recommended)

```javascript
function printFullName() {
  console.log(this.firstName + " " + this.lastName);
}

const person1 = {
  firstName: "Kishan",
  lastName: "Patel",
};

const person2 = {
  firstName: "Bhoomi",
  lastName: "Shah",
};

printFullName.call(person1); // Output: Kishan Patel
printFullName.call(person2); // Output: Bhoomi Shah
```

## Passing Arguments with `.call()`

The first argument to `.call()` sets the `this` context, and subsequent arguments are passed to the function:

```javascript
function printFullName(city, state) {
  console.log(`${this.firstName} ${this.lastName} is from ${city}, ${state}`);
}

printFullName.call(person1, "Surendranagar", "Gujarat");
// Output: Kishan Patel is from Surendranagar, Gujarat

printFullName.call(person2, "Limbdi", "Gujarat");
// Output: Bhoomi Shah is from Limbdi, Gujarat
```

## Using `.apply()`

`.apply()` works like `.call()`, but accepts arguments as an array:

```javascript
printFullName.apply(person1, ["Surendranagar", "Gujarat"]);
// Output: Kishan Patel is from Surendranagar, Gujarat

printFullName.apply(person2, ["Limbdi", "Gujarat"]);
// Output: Bhoomi Shah is from Limbdi, Gujarat
```

## Using `.bind()`

Unlike `.call()` and `.apply()`, `.bind()` returns a new function with the specified `this` context that can be executed later:

```javascript
const printablePerson1 = printFullName.bind(
  person1,
  "Surendranagar",
  "Gujarat"
);
const printablePerson2 = printFullName.bind(person2, "Limbdi", "Gujarat");

printablePerson1(); // Output: Kishan Patel is from Surendranagar, Gujarat
printablePerson2(); // Output: Bhoomi Shah is from Limbdi, Gujarat
```

### Partial Application with `.bind()`

You can provide some arguments during binding and the rest when calling the function:

```javascript
const printablePerson1 = printFullName.bind(person1, "Surendranagar");
const printablePerson2 = printFullName.bind(person2, "Limbdi");

printablePerson1("Gujarat");
// Output: Kishan Patel is from Surendranagar, Gujarat

printablePerson1("Maharashtra");
// Output: Kishan Patel is from Surendranagar, Maharashtra

printablePerson2("Gujarat");
// Output: Bhoomi Shah is from Limbdi, Gujarat
```

## Arrow Functions and `this` Binding

Arrow functions behave differently with `.call()`, `.apply()`, and `.bind()` because they don't have their own `this` context:

```javascript
const person = {
  firstName: "Kishan",
  lastName: "Patel",
};

// Regular function
const printNameRegular = function () {
  console.log(this.firstName + " " + this.lastName);
};

// Arrow function
const printNameArrow = () => {
  console.log(this.firstName + " " + this.lastName);
};

printNameRegular.call(person); // Output: "Kishan Patel"
printNameArrow.call(person); // Output: "undefined undefined"
```

The arrow function's `this` is lexically bound to the surrounding scope when the function is created and cannot be changed with `.call()`, `.apply()`, or `.bind()`.

## Common Use Cases

### Function Borrowing

Borrow methods from other objects:

```javascript
const calculator = {
  multiply: function (a, b) {
    return a * b;
  },
};

const scientificCalc = {
  // Borrow the multiply method
  doMultiplication(a, b) {
    return calculator.multiply.call(this, a, b);
  },
};
```

### Event Handlers

Maintaining context in event handlers:

```javascript
class Component {
  constructor() {
    this.name = "Button";
    // Using bind to maintain "this" context
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(`${this.name} clicked`);
  }

  render() {
    // Without .bind(), "this" would be the button element, not the component
    return `<button onclick="${this.handleClick}">Click me</button>`;
  }
}
```

### Function Currying

Creating specialized functions:

```javascript
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);
console.log(double(4)); // Output: 8
```

## Performance Considerations

There are subtle performance differences between these methods:

- `.bind()` is generally slower because it creates a new function
- `.call()` and `.apply()` have similar performance, but:
  - `.call()` is slightly faster than `.apply()` for functions with few arguments
  - `.apply()` used to be more efficient for functions with many arguments, but with spread syntax in modern JS, this advantage is less significant

```javascript
// Performance comparison example
function sum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

// Using .apply() (traditional approach)
sum.apply(null, [1, 2, 3, 4, 5]);

// Using .call() with spread (modern approach)
sum.call(null, ...[1, 2, 3, 4, 5]);
```

## Modern Alternatives

ES6+ features provide alternatives to some use cases:

### Instead of `.bind()` for partial application:

```javascript
// Traditional approach
function greet(greeting, name) {
  return `${greeting}, ${name}!`;
}
const sayHello = greet.bind(null, "Hello");
sayHello("John"); // "Hello, John!"

// Modern approach with arrow functions and closures
const sayHello2 = (name) => greet("Hello", name);
sayHello2("John"); // "Hello, John!"
```

### Instead of `.apply()` for variable arguments:

```javascript
// Traditional approach
Math.max.apply(null, [1, 5, 3, 7, 2]);

// Modern approach with spread syntax
Math.max(...[1, 5, 3, 7, 2]);
```

## Edge Cases

### Primitive values as context:

When you pass primitive values as the context to `.call()` or `.apply()`, JavaScript automatically wraps them in their corresponding wrapper objects:

```javascript
function showType() {
  console.log(typeof this);
}

showType.call(1); // "object" - Number object
showType.call("string"); // "object" - String object
showType.call(true); // "object" - Boolean object
```

### Null or undefined as context:

In non-strict mode, passing `null` or `undefined` as the context will default to the global object (window in browsers):

```javascript
function showContext() {
  console.log(this);
}

// In non-strict mode
showContext.call(null); // window object
showContext.call(undefined); // window object

// In strict mode
("use strict");
showContext.call(null); // null
showContext.call(undefined); // undefined
```

[Checkout pollyfills for these function](pollyfill.js)

## Summary

- **`.call()`**: Invokes a function with a specified `this` context and arguments listed individually
- **`.apply()`**: Invokes a function with a specified `this` context and arguments as an array
- **`.bind()`**: Returns a new function with the specified `this` context and optional pre-set arguments
- Arrow functions maintain their original lexical scope and ignore these methods' context binding
- These methods have various use cases including function borrowing, event handling, and currying
- Modern JavaScript offers alternatives like spread syntax and arrow functions for some use cases
- Be aware of behavior differences in strict mode and with primitive values as context

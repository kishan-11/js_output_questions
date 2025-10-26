## Function Typing

### Basic Function Types

Function typing in TypeScript involves specifying parameter types and return types for functions.

### Parameter Types

```ts
// Basic parameter typing
function greet(name: string, age: number): string {
  return `Hello ${name}, you are ${age} years old`;
}

// Optional parameters
function createUser(name: string, email?: string): User {
  return { name, email };
}

// Default parameters
function multiply(a: number, b: number = 1): number {
  return a * b;
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}
```

### Return Types

#### `void` vs `undefined`

```ts
// void - function doesn't return a meaningful value
function logMessage(msg: string): void {
  console.log(msg);
  // No return statement needed
}

// undefined - function explicitly returns undefined
function getValue(): undefined {
  return undefined;
}

// never - function never returns (throws or infinite loop)
function throwError(): never {
  throw new Error("Something went wrong");
}

function infiniteLoop(): never {
  while (true) {
    // This never returns
  }
}
```

### Function Overloads

```ts
// Function overloads for different parameter combinations
function process(value: string): string;
function process(value: number): number;
function process(value: string | number): string | number {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value * 2;
}
```

### Generic Functions

```ts
// Generic function with type parameter
function identity<T>(arg: T): T {
  return arg;
}

// Constrained generics
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Multiple type parameters
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}
```

### Function Type Expressions

```ts
// Function type as variable
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

// Call signatures
interface Calculator {
  (a: number, b: number): number;
  operation: string;
}

const calc: Calculator = (a, b) => a + b;
calc.operation = "addition";
```

### Contextual Typing

```ts
// TypeScript infers types from context
const numbers = [1, 2, 3, 4, 5];

// Contextual typing infers parameter types
const doubled = numbers.map(n => n * 2); // n is inferred as number

// Explicit typing when needed
const strings = numbers.map((n: number) => n.toString());
```

### Advanced Patterns

#### Conditional Return Types

```ts
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };

function apiCall<T>(input: T): ApiResponse<T> {
  if (typeof input === 'string') {
    return { message: input } as ApiResponse<T>;
  }
  return { data: input } as ApiResponse<T>;
}
```

#### Function Composition

```ts
type Compose = <A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
) => (a: A) => C;

const compose: Compose = (f, g) => (a) => f(g(a));

// Usage
const addOne = (x: number) => x + 1;
const multiplyByTwo = (x: number) => x * 2;
const addOneThenDouble = compose(multiplyByTwo, addOne);
```

### Best Practices

1. **Prefer specific function types over `Function`**
   ```ts
   // ❌ Avoid
   const fn: Function = () => {};
   
   // ✅ Better
   const fn: () => void = () => {};
   ```

2. **Use `unknown` for untrusted inputs**
   ```ts
   function processUserInput(input: unknown): string {
     if (typeof input === 'string') {
       return input.toUpperCase();
     }
     throw new Error('Invalid input');
   }
   ```

3. **Leverage contextual typing**
   ```ts
   // TypeScript infers the callback parameter types
   const users = ['Alice', 'Bob'];
   const userObjects = users.map(name => ({ name, id: Math.random() }));
   ```

4. **Use function overloads for complex APIs**
   ```ts
   function createElement(tag: 'div'): HTMLDivElement;
   function createElement(tag: 'span'): HTMLSpanElement;
   function createElement(tag: string): HTMLElement {
     return document.createElement(tag);
   }
   ```

### Common Pitfalls

1. **Confusing `void` and `undefined`**
   ```ts
   // void means "no return value"
   function log(): void { console.log('hello'); }
   
   // undefined means "returns undefined"
   function getUndefined(): undefined { return undefined; }
   ```

2. **Over-specifying generic constraints**
   ```ts
   // ❌ Too restrictive
   function process<T extends string | number>(value: T): T {
     return value;
   }
   
   // ✅ More flexible
   function process<T>(value: T): T {
     return value;
   }
   ```

3. **Ignoring return type inference**
   ```ts
   // Let TypeScript infer when possible
   const add = (a: number, b: number) => a + b; // Returns number
   
   // Only specify when necessary
   const addExplicit = (a: number, b: number): number => a + b;
   ```



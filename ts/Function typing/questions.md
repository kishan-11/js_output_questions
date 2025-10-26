## Interview questions: Function typing

### 1. Difference between `void` and `undefined` as return types?

**Answer:**

`void` and `undefined` are both return types in TypeScript, but they have different meanings:

**`void`:**
- Indicates that a function doesn't return a meaningful value
- The function may have no return statement or return without a value
- Used for functions that perform side effects (logging, DOM manipulation, etc.)

```ts
function logMessage(msg: string): void {
  console.log(msg);
  // No return statement needed
}

function processData(): void {
  // Some processing...
  return; // Optional explicit return
}
```

**`undefined`:**
- Indicates that a function explicitly returns `undefined`
- The function must have a return statement that returns `undefined`
- Less commonly used than `void`

```ts
function getValue(): undefined {
  return undefined; // Must explicitly return undefined
}

// This would be a type error:
function getValue(): undefined {
  // Error: Function lacks ending return statement
}
```

**Key Differences:**
- `void` is more permissive - no return statement needed
- `undefined` requires explicit return of `undefined`
- `void` is preferred for side-effect functions
- `undefined` is rarely used in practice

### 2. How to type variadic functions and rest params precisely?

**Answer:**

TypeScript provides several ways to type variadic functions with rest parameters:

**Basic Rest Parameters:**
```ts
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

function log(...messages: string[]): void {
  console.log(messages.join(' '));
}
```

**Generic Rest Parameters (TypeScript 4.0+):**
```ts
function callWithArgs<T extends unknown[]>(
  fn: (...args: T) => void,
  ...args: T
): void {
  fn(...args);
}

// Usage
callWithArgs((a: string, b: number) => {}, "hello", 42);
```

**Tuple Types for Precise Typing:**
```ts
function createTuple<T extends readonly unknown[]>(...args: T): T {
  return args;
}

const tuple = createTuple("hello", 42, true); // Type: readonly ["hello", 42, true]
```

**Function Overloads for Different Arity:**
```ts
function process(): string;
function process(a: string): string;
function process(a: string, b: number): string;
function process(...args: any[]): string {
  return args.join(' ');
}
```

**Advanced: Conditional Rest Parameters:**
```ts
type RestParams<T> = T extends readonly [any, ...infer Rest] ? Rest : never;

function tail<T extends readonly unknown[]>(...args: T): RestParams<T> {
  return args.slice(1) as RestParams<T>;
}
```

### 3. Why avoid the `Function` type? Show better alternatives.

**Answer:**

The `Function` type should be avoided because it's too generic and provides no type safety:

**Problems with `Function`:**
```ts
// ❌ No type safety
const fn: Function = () => {};
fn.call(null, "any", "arguments", "accepted");

// ❌ Can call with any arguments
const badFn: Function = (a: number, b: string) => a + b;
badFn(1, 2, 3, 4, 5); // No error, but runtime issues
```

**Better Alternatives:**

**1. Specific Function Signatures:**
```ts
// ✅ Specific parameter and return types
const add: (a: number, b: number) => number = (a, b) => a + b;
const log: (msg: string) => void = (msg) => console.log(msg);
```

**2. Function Type Aliases:**
```ts
type MathOperation = (a: number, b: number) => number;
type EventHandler = (event: Event) => void;

const multiply: MathOperation = (a, b) => a * b;
const handleClick: EventHandler = (event) => console.log(event);
```

**3. Generic Function Types:**
```ts
type Mapper<T, U> = (value: T) => U;
type Predicate<T> = (value: T) => boolean;

const stringify: Mapper<number, string> = (n) => n.toString();
const isEven: Predicate<number> = (n) => n % 2 === 0;
```

**4. Call Signatures in Interfaces:**
```ts
interface Calculator {
  (a: number, b: number): number;
  operation: string;
}

const calc: Calculator = (a, b) => a + b;
calc.operation = "addition";
```

**5. Method Signatures:**
```ts
interface EventEmitter {
  on(event: string, handler: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
}
```

### 4. How do contextual types influence inference for callbacks?

**Answer:**

Contextual typing allows TypeScript to infer types based on the expected signature, making code more concise and type-safe:

**Array Methods:**
```ts
const numbers = [1, 2, 3, 4, 5];

// TypeScript infers 'n' as number from array type
const doubled = numbers.map(n => n * 2);

// Explicit typing not needed
const strings = numbers.map(n => n.toString());
```

**Event Handlers:**
```ts
// TypeScript infers event parameter type
button.addEventListener('click', event => {
  // event is inferred as MouseEvent
  console.log(event.clientX, event.clientY);
});

// For custom events, provide type annotation
button.addEventListener('customEvent', (event: CustomEvent) => {
  console.log(event.detail);
});
```

**Promise Callbacks:**
```ts
fetch('/api/data')
  .then(response => response.json()) // response inferred as Response
  .then(data => {
    // data inferred as any, but you can narrow it
    console.log(data);
  });
```

**Generic Context:**
```ts
function processItems<T>(items: T[], processor: (item: T) => T): T[] {
  return items.map(processor); // processor parameter inferred as T
}

const numbers = [1, 2, 3];
const processed = processItems(numbers, n => n * 2); // n inferred as number
```

**Function Parameters:**
```ts
type Callback<T> = (value: T) => void;

function withCallback<T>(value: T, callback: Callback<T>): void {
  callback(value);
}

// TypeScript infers the callback parameter type
withCallback("hello", str => {
  // str is inferred as string
  console.log(str.toUpperCase());
});
```

**Overriding Contextual Types:**
```ts
const numbers = [1, 2, 3];

// Sometimes you need explicit typing
const processed = numbers.map((n: number) => {
  // Explicit typing when contextual inference isn't sufficient
  return n.toString();
});
```

### 5. When to add explicit generics to functions despite inference?

**Answer:**

While TypeScript's type inference is powerful, there are several scenarios where explicit generics are necessary or beneficial:

**1. When Inference Fails:**
```ts
// ❌ Inference fails - returns any[]
function createArray<T>(...items: T[]): T[] {
  return items;
}

// ✅ Explicit generic needed
const numbers = createArray<number>(1, 2, 3);
const strings = createArray<string>("a", "b", "c");
```

**2. Constraining Generic Types:**
```ts
// Without explicit generic, T could be anything
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Explicit generics provide better type checking
const user = { name: "John", age: 30 };
const name = getProperty<typeof user, "name">(user, "name"); // string
```

**3. Multiple Generic Parameters:**
```ts
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

// Explicit generics for clarity
const result = merge<{ a: number }, { b: string }>({ a: 1 }, { b: "hello" });
```

**4. Conditional Types:**
```ts
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };

function apiCall<T>(input: T): ApiResponse<T> {
  // Implementation
}

// Explicit generic for conditional type
const response = apiCall<string>("hello"); // { message: string }
```

**5. Function Overloads with Generics:**
```ts
function process<T extends string>(input: T): T;
function process<T extends number>(input: T): T;
function process<T>(input: T): T {
  return input;
}

// Explicit generics help with overload resolution
const result = process<string>("hello");
```

**6. Generic Constraints:**
```ts
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// Explicit generic when constraint is important
const result = logLength<string>("hello");
```

**7. Complex Generic Relationships:**
```ts
function mapArray<T, U>(
  array: T[],
  mapper: (item: T, index: number) => U
): U[] {
  return array.map(mapper);
}

// Explicit generics for complex transformations
const numbers = [1, 2, 3];
const strings = mapArray<number, string>(numbers, (n, i) => `${i}: ${n}`);
```

**When NOT to use explicit generics:**
```ts
// ✅ Let inference work when it's clear
const identity = <T>(x: T): T => x;
const result = identity("hello"); // T inferred as string

// ✅ Simple cases where inference is sufficient
const add = <T extends number>(a: T, b: T): T => a + b;
const sum = add(1, 2); // T inferred as number
```

**Best Practices:**
- Use explicit generics when inference fails or is unclear
- Prefer inference for simple, obvious cases
- Use explicit generics for complex type relationships
- Consider explicit generics for public APIs to improve clarity


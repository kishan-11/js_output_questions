# TypeScript This Types - Practice Questions

## Basic This Types

### Question 1: Explicit This Parameter
What will be the output of the following code?

```ts
function process(this: void, x: number): number {
  return x * 2;
}

console.log(process(5));
```

**Answer:**
```ts
// Error: Expected 1 arguments, but got 1
// The function expects 'this' to be void, but it's being called without explicit binding
```

**Explanation:** When you use an explicit `this` parameter, you need to call the function with `.call()` or `.bind()` to provide the `this` context, even if it's `void`.

**Correct usage:**
```ts
function process(this: void, x: number): number {
  return x * 2;
}

console.log(process.call(null, 5)); // 10
// or
const boundProcess = process.bind(null);
console.log(boundProcess(5)); // 10
```

### Question 2: Polymorphic This in Classes
What will be the output of the following code?

```ts
class Builder {
  private value: string = '';
  
  append(s: string): this {
    this.value += s;
    return this;
  }
  
  getValue(): string {
    return this.value;
  }
}

class ExtendedBuilder extends Builder {
  prepend(s: string): this {
    this.value = s + this.value;
    return this;
  }
}

const builder = new ExtendedBuilder();
const result = builder
  .append("World")
  .prepend("Hello ")
  .append("!")
  .getValue();

console.log(result);
```

**Answer:**
```
Hello World!
```

**Explanation:** The polymorphic `this` type ensures that method chaining works correctly with inheritance. Even though `append` is defined in the base class, it returns `this` which maintains the correct type (`ExtendedBuilder`), allowing the `prepend` method to be called.

### Question 3: This in Callbacks
What will be the output of the following code?

```ts
class Counter {
  private count = 0;
  
  increment(this: Counter): void {
    this.count++;
    console.log(this.count);
  }
  
  getCount(): number {
    return this.count;
  }
}

const counter = new Counter();
const incrementFn = counter.increment;

incrementFn();
```

**Answer:**
```
Error: Cannot read property 'count' of undefined
```

**Explanation:** When you extract a method from an object, it loses its `this` context. The `incrementFn` is called without a `this` context, so `this` is `undefined`.

**Correct usage:**
```ts
const counter = new Counter();
const incrementFn = counter.increment.bind(counter);
incrementFn(); // 1

// or
counter.increment.call(counter); // 1
```

### Question 4: This Parameter Constraints
What will be the output of the following code?

```ts
interface HasName {
  name: string;
}

function greet(this: HasName): string {
  return `Hello, ${this.name}!`;
}

class Person implements HasName {
  constructor(public name: string) {}
  
  sayHello = greet;
}

class Animal {
  constructor(public name: string) {}
  
  sayHello = greet;
}

const person = new Person("John");
const animal = new Animal("Buddy");

console.log(person.sayHello());
console.log(animal.sayHello());
```

**Answer:**
```
Hello, John!
Hello, Buddy!
```

**Explanation:** Both classes have a `name` property, so they can use the `greet` function even though `Animal` doesn't explicitly implement `HasName`. TypeScript's structural typing allows this.

### Question 5: This in Function Types
What will be the output of the following code?

```ts
type Handler = (this: void, event: Event) => void;
type ElementHandler = (this: HTMLElement, event: Event) => void;

const voidHandler: Handler = function(event) {
  console.log("Event type:", event.type);
};

const elementHandler: ElementHandler = function(event) {
  console.log("Element tag:", this.tagName);
};

// Simulating event
const mockEvent = { type: 'click' } as Event;
const mockElement = { tagName: 'BUTTON' } as HTMLElement;

voidHandler.call(null, mockEvent);
elementHandler.call(mockElement, mockEvent);
```

**Answer:**
```
Event type: click
Element tag: BUTTON
```

**Explanation:** The `this` parameter in function types specifies what `this` should be when the function is called. `voidHandler` has `this: void`, so it can't access `this`, while `elementHandler` has `this: HTMLElement`, so it can access element properties.

## Intermediate This Types

### Question 6: This in Inheritance Chain
What will be the output of the following code?

```ts
class Base {
  protected data: any = {};
  
  set(key: string, value: any): this {
    this.data[key] = value;
    return this;
  }
  
  get(key: string): any {
    return this.data[key];
  }
}

class User extends Base {
  name(name: string): this {
    return this.set('name', name);
  }
  
  email(email: string): this {
    return this.set('email', email);
  }
}

class Admin extends User {
  role(role: string): this {
    return this.set('role', role);
  }
}

const admin = new Admin();
const result = admin
  .name("Alice")
  .email("alice@example.com")
  .role("admin")
  .set("permissions", ["read", "write"])
  .get("name");

console.log(result);
```

**Answer:**
```
Alice
```

**Explanation:** The polymorphic `this` type works through the entire inheritance chain. Each method returns `this`, which maintains the correct type (`Admin`) throughout the chain, allowing all methods to be called in sequence.

### Question 7: This with Generic Constraints
What will be the output of the following code?

```ts
interface Mappable<T> {
  map<U>(this: T, fn: (item: any) => U): T;
}

class NumberArray {
  private items: number[] = [];
  
  add(item: number): this {
    this.items.push(item);
    return this;
  }
  
  map<U>(this: NumberArray, fn: (item: number) => U): NumberArray {
    const result = new NumberArray();
    result.items = this.items.map(fn);
    return result;
  }
  
  getItems(): number[] {
    return this.items;
  }
}

const numbers = new NumberArray();
const doubled = numbers
  .add(1)
  .add(2)
  .add(3)
  .map(x => x * 2)
  .getItems();

console.log(doubled);
```

**Answer:**
```
[2, 4, 6]
```

**Explanation:** The `map` method uses `this: NumberArray` to ensure it's called on a `NumberArray` instance. The method chains work correctly because each method returns `this`.

### Question 8: This Parameter in Interface Methods
What will be the output of the following code?

```ts
interface Clickable {
  onClick(this: Clickable, event: MouseEvent): void;
}

class Button implements Clickable {
  private isClicked = false;
  
  onClick(this: Clickable, event: MouseEvent): void {
    this.isClicked = true;
    console.log(`Button clicked: ${this.isClicked}`);
  }
  
  getClicked(): boolean {
    return this.isClicked;
  }
}

class Link implements Clickable {
  private isClicked = false;
  
  onClick(this: Clickable, event: MouseEvent): void {
    this.isClicked = true;
    console.log(`Link clicked: ${this.isClicked}`);
  }
  
  getClicked(): boolean {
    return this.isClicked;
  }
}

const button = new Button();
const link = new Link();

// Simulating click events
const mockEvent = { type: 'click' } as MouseEvent;

button.onClick.call(button, mockEvent);
link.onClick.call(link, mockEvent);

console.log(button.getClicked());
console.log(link.getClicked());
```

**Answer:**
```
Button clicked: true
Link clicked: true
true
true
```

**Explanation:** The interface defines the `this` parameter type, and both implementations correctly use `this: Clickable`. The `this` context is properly bound when calling the methods.

### Question 9: This with Utility Types
What will be the output of the following code?

```ts
function process(this: { id: number; name: string }, prefix: string): string {
  return `${prefix}: ${this.name} (${this.id})`;
}

type ProcessThis = ThisParameterType<typeof process>;

const obj: ProcessThis = { id: 1, name: "Test" };
const result = process.call(obj, "ID");

console.log(result);
```

**Answer:**
```
ID: Test (1)
```

**Explanation:** `ThisParameterType` extracts the `this` parameter type from a function. Here it extracts `{ id: number; name: string }`, which is then used to type the `obj` variable.

### Question 10: This in Module Context
What will be the output of the following code?

```ts
// In a module
function moduleFunction(this: void, param: string): string {
  return param.toUpperCase();
}

function globalFunction(this: any, param: string): string {
  return this?.prefix ? `${this.prefix}${param}` : param;
}

console.log(moduleFunction.call(null, "hello"));
console.log(globalFunction.call({ prefix: "Mr. " }, "Smith"));
console.log(globalFunction.call(null, "World"));
```

**Answer:**
```
HELLO
Mr. Smith
World
```

**Explanation:** The `this: void` parameter prevents access to `this` in the module function, while `this: any` allows flexible `this` usage in the global function.

## Advanced This Types

### Question 11: This with Conditional Types
What will be the output of the following code?

```ts
type ThisOrVoid<T> = T extends (this: any, ...args: any[]) => any 
  ? ThisParameterType<T> 
  : void;

function withThis(this: { name: string }, x: number): string {
  return `${this.name}: ${x}`;
}

function withoutThis(x: number): number {
  return x * 2;
}

type WithThisType = ThisOrVoid<typeof withThis>;
type WithoutThisType = ThisOrVoid<typeof withoutThis>;

const obj: WithThisType = { name: "Test" };
const result = withThis.call(obj, 42);

console.log(result);
console.log(typeof ({} as WithoutThisType));
```

**Answer:**
```
Test: 42
undefined
```

**Explanation:** The conditional type `ThisOrVoid` extracts the `this` parameter type if the function has one, otherwise returns `void`. `withThis` has a `this` parameter, so it extracts `{ name: string }`, while `withoutThis` has no `this` parameter, so it returns `void`.

### Question 12: This in Mapped Types
What will be the output of the following code?

```ts
type MethodsWithThis<T> = {
  [K in keyof T]: T[K] extends (this: any, ...args: any[]) => any 
    ? T[K] 
    : never;
};

class Example {
  method1(this: Example, x: number): number {
    return x * 2;
  }
  
  method2(x: number): number {
    return x + 1;
  }
  
  property: string = "test";
}

type ExampleMethods = MethodsWithThis<Example>;

const example = new Example();
const result1 = example.method1.call(example, 5);
const result2 = example.method2(5);

console.log(result1);
console.log(result2);
```

**Answer:**
```
10
6
```

**Explanation:** The `MethodsWithThis` type filters out only methods that have a `this` parameter. `method1` has a `this` parameter, so it's included, while `method2` and `property` are filtered out.

### Question 13: This Parameter in Overloads
What will be the output of the following code?

```ts
function process(this: void, data: string): string;
function process(this: { prefix: string }, data: string): string;
function process(this: any, data: string): string {
  if (this && this.prefix) {
    return this.prefix + data;
  }
  return data;
}

console.log(process.call(null, "hello"));
console.log(process.call({ prefix: "Mr. " }, "Smith"));
console.log(process.call({}, "world"));
```

**Answer:**
```
hello
Mr. Smith
world
```

**Explanation:** The function has two overloads: one with `this: void` and one with `this: { prefix: string }`. The implementation handles both cases, returning the prefixed string when `this` has a `prefix` property, otherwise returning the data as-is.

### Question 14: This in Builder Pattern
What will be the output of the following code?

```ts
class QueryBuilder {
  private query: string = '';
  private params: any[] = [];
  
  select(fields: string): this {
    this.query += `SELECT ${fields}`;
    return this;
  }
  
  from(table: string): this {
    this.query += ` FROM ${table}`;
    return this;
  }
  
  where(condition: string, ...params: any[]): this {
    this.query += ` WHERE ${condition}`;
    this.params.push(...params);
    return this;
  }
  
  orderBy(field: string): this {
    this.query += ` ORDER BY ${field}`;
    return this;
  }
  
  build(): { query: string; params: any[] } {
    return { query: this.query, params: this.params };
  }
}

const query = new QueryBuilder()
  .select("name, email")
  .from("users")
  .where("age > ?", 18)
  .orderBy("name")
  .build();

console.log(query);
```

**Answer:**
```
{ query: 'SELECT name, email FROM users WHERE age > ? ORDER BY name', params: [18] }
```

**Explanation:** The builder pattern with polymorphic `this` allows method chaining. Each method returns `this`, enabling fluent API usage while maintaining the correct type throughout the chain.

### Question 15: This in Event Handlers
What will be the output of the following code?

```ts
class Component {
  private state: any = {};
  
  handleEvent(this: Component, event: Event): void {
    this.state.lastEvent = event;
    this.state.eventCount = (this.state.eventCount || 0) + 1;
    console.log(`Event ${this.state.eventCount}: ${event.type}`);
  }
  
  getState(): any {
    return this.state;
  }
}

class Button extends Component {
  handleClick(this: Button, event: MouseEvent): void {
    this.state.lastClick = event;
    console.log(`Button clicked: ${event.type}`);
  }
}

const button = new Button();
const mockEvent = { type: 'click' } as MouseEvent;

button.handleEvent.call(button, mockEvent);
button.handleClick.call(button, mockEvent);

console.log(button.getState());
```

**Answer:**
```
Event 1: click
Button clicked: click
{ lastEvent: { type: 'click' }, eventCount: 1, lastClick: { type: 'click' } }
```

**Explanation:** The `this` parameter ensures proper context binding. Both methods maintain their `this` context, allowing access to the component's state and proper method chaining.

## Complex Scenarios

### Question 16: This with Generic Classes
What will be the output of the following code?

```ts
interface Builder<T> {
  build(): T;
}

class StringBuilder implements Builder<string> {
  private parts: string[] = [];
  
  append(s: string): this {
    this.parts.push(s);
    return this;
  }
  
  build(): string {
    return this.parts.join('');
  }
}

class NumberBuilder implements Builder<number> {
  private sum = 0;
  
  add(n: number): this {
    this.sum += n;
    return this;
  }
  
  build(): number {
    return this.sum;
  }
}

const stringResult = new StringBuilder()
  .append("Hello")
  .append(" ")
  .append("World")
  .build();

const numberResult = new NumberBuilder()
  .add(10)
  .add(20)
  .add(30)
  .build();

console.log(stringResult);
console.log(numberResult);
```

**Answer:**
```
Hello World
60
```

**Explanation:** Both builders use polymorphic `this` to enable method chaining while implementing the `Builder<T>` interface. The `this` type is preserved through the inheritance chain.

### Question 17: This with Mixins
What will be the output of the following code?

```ts
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<T extends Constructor>(Base: T) {
  return class extends Base {
    timestamp = Date.now();
    
    getTimestamp(): number {
      return this.timestamp;
    }
  };
}

function Loggable<T extends Constructor>(Base: T) {
  return class extends Base {
    log(message: string): this {
      console.log(`[${new Date().toISOString()}] ${message}`);
      return this;
    }
  };
}

class BaseComponent {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  getName(): string {
    return this.name;
  }
}

const EnhancedComponent = Loggable(Timestamped(BaseComponent));

const component = new EnhancedComponent("Test");
const result = component
  .log("Component created")
  .getName();

console.log(result);
console.log(component.getTimestamp());
```

**Answer:**
```
[2024-01-01T00:00:00.000Z] Component created
Test
1704067200000
```

**Explanation:** The mixins use polymorphic `this` to enable method chaining. The `log` method returns `this`, allowing chaining with other methods, and the `this` type is preserved through the mixin chain.

### Question 18: This with Decorators
What will be the output of the following code?

```ts
function bound(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  return {
    ...descriptor,
    value: function(this: any, ...args: any[]) {
      return originalMethod.apply(this, args);
    }
  };
}

class Calculator {
  private value = 0;
  
  @bound
  add(n: number): this {
    this.value += n;
    return this;
  }
  
  @bound
  multiply(n: number): this {
    this.value *= n;
    return this;
  }
  
  getValue(): number {
    return this.value;
  }
}

const calc = new Calculator();
const addMethod = calc.add;
const result = addMethod.call(calc, 5)
  .multiply(2)
  .getValue();

console.log(result);
```

**Answer:**
```
10
```

**Explanation:** The `@bound` decorator ensures that the method maintains its `this` context even when extracted from the object. The polymorphic `this` type is preserved, allowing method chaining.

### Question 19: This with Proxy
What will be the output of the following code?

```ts
class Target {
  private value = 0;
  
  add(n: number): this {
    this.value += n;
    return this;
  }
  
  getValue(): number {
    return this.value;
  }
}

const target = new Target();
const proxy = new Proxy(target, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    if (typeof value === 'function') {
      return function(this: any, ...args: any[]) {
        console.log(`Calling ${String(prop)} with args:`, args);
        return value.apply(this, args);
      };
    }
    return value;
  }
});

const result = proxy.add(10).add(5).getValue();

console.log(result);
```

**Answer:**
```
Calling add with args: [10]
Calling add with args: [5]
Calling getValue with args: []
15
```

**Explanation:** The proxy intercepts method calls and logs them while preserving the `this` context. The polymorphic `this` type is maintained through the proxy, allowing method chaining.

### Question 20: This with Async Methods
What will be the output of the following code?

```ts
class AsyncBuilder {
  private operations: (() => Promise<any>)[] = [];
  
  async addAsync(operation: () => Promise<any>): Promise<this> {
    this.operations.push(operation);
    return this;
  }
  
  async execute(): Promise<any[]> {
    const results = await Promise.all(this.operations.map(op => op()));
    return results;
  }
}

async function example() {
  const builder = new AsyncBuilder();
  
  await builder
    .addAsync(async () => {
      console.log("Operation 1");
      return 1;
    })
    .addAsync(async () => {
      console.log("Operation 2");
      return 2;
    });
  
  const results = await builder.execute();
  console.log("Results:", results);
}

example();
```

**Answer:**
```
Operation 1
Operation 2
Results: [1, 2]
```

**Explanation:** The async method returns `Promise<this>`, allowing async method chaining. The `this` context is preserved through the promise chain, enabling fluent async APIs.

## Summary

These questions demonstrate the power and flexibility of TypeScript's `this` types:

1. **Explicit Control**: Specify exactly what `this` should be
2. **Fluent APIs**: Enable method chaining with polymorphic `this`
3. **Type Safety**: Prevent incorrect `this` usage
4. **Inheritance Support**: Maintain correct types in class hierarchies
5. **Callback Safety**: Proper typing for event handlers and callbacks
6. **Advanced Patterns**: Mixins, decorators, proxies, and async methods

Understanding these concepts is crucial for building robust, type-safe TypeScript applications with fluent APIs and proper callback handling.

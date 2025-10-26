# TypeScript: Classes

TypeScript classes provide object-oriented programming features with static type checking. They support inheritance, encapsulation, and polymorphism with compile-time type safety.

---

## Basic Class Syntax

### Property and Method Typing
```ts
class User {
  // Property declarations with types
  name: string;
  age: number;
  isActive: boolean = true; // Default value
  
  // Constructor with parameter properties
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  
  // Method with return type
  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
  
  // Method with optional parameters
  updateAge(newAge?: number): void {
    if (newAge !== undefined) {
      this.age = newAge;
    }
  }
}
```

### Parameter Properties
```ts
class User {
  // Parameter properties automatically create and assign properties
  constructor(
    public readonly id: string,    // Creates readonly id property
    private name: string,          // Creates private name property
    protected email: string,       // Creates protected email property
    public age: number = 0        // Creates public age property with default
  ) {
    // No need to manually assign - TypeScript does it automatically
  }
  
  // Access the properties
  get displayName(): string {
    return `${this.name} (${this.id})`;
  }
}
```

---

## Access Modifiers

### Public (Default)
```ts
class User {
  public name: string; // Explicitly public
  age: number;         // Implicitly public
  
  public greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

const user = new User("John", 25);
console.log(user.name);    // ✅ Accessible
console.log(user.age);     // ✅ Accessible
user.greet();              // ✅ Accessible
```

### Private
```ts
class User {
  private id: string;
  private password: string;
  
  constructor(name: string, password: string) {
    this.id = this.generateId();
    this.password = this.hashPassword(password);
  }
  
  private generateId(): string {
    return Math.random().toString(36);
  }
  
  private hashPassword(password: string): string {
    // Simple hash for example
    return btoa(password);
  }
  
  public authenticate(inputPassword: string): boolean {
    return this.hashPassword(inputPassword) === this.password;
  }
}

const user = new User("John", "secret123");
// console.log(user.id);        // ❌ Error: Property 'id' is private
// console.log(user.password);  // ❌ Error: Property 'password' is private
console.log(user.authenticate("secret123")); // ✅ Public method
```

### Protected
```ts
class Animal {
  protected name: string;
  protected age: number;
  
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  
  protected getInfo(): string {
    return `${this.name} is ${this.age} years old`;
  }
}

class Dog extends Animal {
  private breed: string;
  
  constructor(name: string, age: number, breed: string) {
    super(name, age);
    this.breed = breed;
  }
  
  public getDescription(): string {
    // Can access protected members from parent
    return `${this.getInfo()} and is a ${this.breed}`;
  }
  
  public getName(): string {
    return this.name; // ✅ Can access protected property
  }
}

const dog = new Dog("Buddy", 3, "Golden Retriever");
console.log(dog.getDescription()); // ✅ Public method
// console.log(dog.name);         // ❌ Error: Property 'name' is protected
```

---

## Readonly Properties

### Basic Readonly
```ts
class User {
  readonly id: string;
  readonly createdAt: Date;
  name: string;
  
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.createdAt = new Date();
  }
  
  updateName(newName: string): void {
    this.name = newName;
    // this.id = "new-id";        // ❌ Error: Cannot assign to 'id' because it is read-only
    // this.createdAt = new Date(); // ❌ Error: Cannot assign to 'createdAt' because it is read-only
  }
}
```

### Readonly with Parameter Properties
```ts
class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public name: string
  ) {
    // id and email are automatically readonly
    // name can be modified
  }
  
  changeName(newName: string): void {
    this.name = newName; // ✅ Allowed
    // this.id = "new-id";     // ❌ Error: Cannot assign to 'id'
    // this.email = "new@email.com"; // ❌ Error: Cannot assign to 'email'
  }
}
```

---

## Getters and Setters

### Basic Getters and Setters
```ts
class User {
  private _name: string;
  private _age: number;
  
  constructor(name: string, age: number) {
    this._name = name;
    this._age = age;
  }
  
  // Getter
  get name(): string {
    return this._name;
  }
  
  // Setter with validation
  set name(value: string) {
    if (value.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }
    this._name = value.trim();
  }
  
  // Getter with computed value
  get displayName(): string {
    return `${this._name} (${this._age})`;
  }
  
  // Read-only getter
  get age(): number {
    return this._age;
  }
  
  // Method to update age (no setter for age)
  updateAge(newAge: number): void {
    if (newAge < 0) {
      throw new Error("Age cannot be negative");
    }
    this._age = newAge;
  }
}

const user = new User("John", 25);
console.log(user.name);        // "John"
console.log(user.displayName); // "John (25)"
user.name = "Jane";            // ✅ Uses setter
// user.age = 30;              // ❌ Error: No setter for age
user.updateAge(30);           // ✅ Uses method
```

### Advanced Getters and Setters
```ts
class BankAccount {
  private _balance: number = 0;
  private _transactions: string[] = [];
  
  constructor(initialBalance: number = 0) {
    this._balance = initialBalance;
  }
  
  get balance(): number {
    return this._balance;
  }
  
  set balance(amount: number) {
    if (amount < 0) {
      throw new Error("Balance cannot be negative");
    }
    this._balance = amount;
    this._transactions.push(`Balance set to ${amount}`);
  }
  
  get transactionHistory(): readonly string[] {
    return [...this._transactions]; // Return copy to prevent external modification
  }
  
  get isOverdrawn(): boolean {
    return this._balance < 0;
  }
}
```

---

## Static Members

### Static Properties and Methods
```ts
class MathUtils {
  static readonly PI = 3.14159;
  static readonly E = 2.71828;
  
  static add(a: number, b: number): number {
    return a + b;
  }
  
  static multiply(a: number, b: number): number {
    return a * b;
  }
  
  static circleArea(radius: number): number {
    return MathUtils.PI * radius * radius;
  }
}

// Usage
console.log(MathUtils.PI);                    // 3.14159
console.log(MathUtils.add(5, 3));             // 8
console.log(MathUtils.circleArea(5));         // 78.54
```

### Static with Instance Members
```ts
class Counter {
  private static _totalCount: number = 0;
  private _count: number = 0;
  
  constructor() {
    Counter._totalCount++;
  }
  
  increment(): void {
    this._count++;
    Counter._totalCount++;
  }
  
  get count(): number {
    return this._count;
  }
  
  static get totalCount(): number {
    return Counter._totalCount;
  }
  
  static resetTotal(): void {
    Counter._totalCount = 0;
  }
}

const counter1 = new Counter();
const counter2 = new Counter();
counter1.increment();
counter2.increment();
console.log(Counter.totalCount); // 2
```

---

## Abstract Classes

### Basic Abstract Class
```ts
abstract class Shape {
  protected color: string;
  
  constructor(color: string) {
    this.color = color;
  }
  
  // Abstract method - must be implemented by subclasses
  abstract getArea(): number;
  
  // Abstract method - must be implemented by subclasses
  abstract getPerimeter(): number;
  
  // Concrete method - shared by all subclasses
  getColor(): string {
    return this.color;
  }
  
  // Abstract getter
  abstract get name(): string;
}

class Circle extends Shape {
  private radius: number;
  
  constructor(color: string, radius: number) {
    super(color);
    this.radius = radius;
  }
  
  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }
  
  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
  
  get name(): string {
    return "Circle";
  }
}

class Rectangle extends Shape {
  private width: number;
  private height: number;
  
  constructor(color: string, width: number, height: number) {
    super(color);
    this.width = width;
    this.height = height;
  }
  
  getArea(): number {
    return this.width * this.height;
  }
  
  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
  
  get name(): string {
    return "Rectangle";
  }
}
```

---

## Interface Implementation

### Basic Interface Implementation
```ts
interface Drawable {
  draw(): void;
  getColor(): string;
}

interface Movable {
  move(x: number, y: number): void;
  getPosition(): { x: number; y: number };
}

class Circle implements Drawable, Movable {
  private x: number = 0;
  private y: number = 0;
  private color: string;
  
  constructor(color: string) {
    this.color = color;
  }
  
  draw(): void {
    console.log(`Drawing circle at (${this.x}, ${this.y}) with color ${this.color}`);
  }
  
  getColor(): string {
    return this.color;
  }
  
  move(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
  
  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}
```

### Interface with Optional Methods
```ts
interface Logger {
  log(message: string): void;
  error(message: string): void;
  warn?(message: string): void; // Optional method
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
  
  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
  
  // warn is optional, so we don't need to implement it
}

class FullLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
  
  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
  
  warn(message: string): void {
    console.warn(`[WARN] ${message}`);
  }
}
```

---

## Polymorphic `this` Type

### Basic Polymorphic `this`
```ts
class Animal {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  // Return type is 'this' - allows method chaining
  setName(name: string): this {
    this.name = name;
    return this;
  }
  
  speak(): this {
    console.log(`${this.name} makes a sound`);
    return this;
  }
}

class Dog extends Animal {
  breed: string;
  
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
  
  setBreed(breed: string): this {
    this.breed = breed;
    return this;
  }
  
  speak(): this {
    console.log(`${this.name} barks`);
    return this;
  }
}

// Method chaining works with inheritance
const dog = new Dog("Buddy", "Golden Retriever");
dog.setName("Max").setBreed("Labrador").speak();
// Output: Max barks
```

### Fluent API Pattern
```ts
class QueryBuilder {
  private table: string = "";
  private conditions: string[] = [];
  private orderBy: string = "";
  private limit: number = 0;
  
  from(table: string): this {
    this.table = table;
    return this;
  }
  
  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }
  
  orderBy(column: string): this {
    this.orderBy = column;
    return this;
  }
  
  limitTo(count: number): this {
    this.limit = count;
    return this;
  }
  
  build(): string {
    let query = `SELECT * FROM ${this.table}`;
    
    if (this.conditions.length > 0) {
      query += ` WHERE ${this.conditions.join(' AND ')}`;
    }
    
    if (this.orderBy) {
      query += ` ORDER BY ${this.orderBy}`;
    }
    
    if (this.limit > 0) {
      query += ` LIMIT ${this.limit}`;
    }
    
    return query;
  }
}

// Usage
const query = new QueryBuilder()
  .from("users")
  .where("age > 18")
  .where("status = 'active'")
  .orderBy("name")
  .limitTo(10)
  .build();

console.log(query);
// Output: SELECT * FROM users WHERE age > 18 AND status = 'active' ORDER BY name LIMIT 10
```

---

## Composition vs Inheritance

### Inheritance Example
```ts
class Vehicle {
  protected speed: number = 0;
  protected maxSpeed: number;
  
  constructor(maxSpeed: number) {
    this.maxSpeed = maxSpeed;
  }
  
  accelerate(amount: number): void {
    this.speed = Math.min(this.speed + amount, this.maxSpeed);
  }
  
  brake(amount: number): void {
    this.speed = Math.max(this.speed - amount, 0);
  }
  
  getSpeed(): number {
    return this.speed;
  }
}

class Car extends Vehicle {
  private doors: number;
  
  constructor(maxSpeed: number, doors: number) {
    super(maxSpeed);
    this.doors = doors;
  }
  
  openTrunk(): void {
    console.log("Trunk opened");
  }
}
```

### Composition Example
```ts
// Engine component
class Engine {
  private isRunning: boolean = false;
  
  start(): void {
    this.isRunning = true;
    console.log("Engine started");
  }
  
  stop(): void {
    this.isRunning = false;
    console.log("Engine stopped");
  }
  
  get running(): boolean {
    return this.isRunning;
  }
}

// Wheel component
class Wheel {
  constructor(private size: number) {}
  
  rotate(): void {
    console.log(`Wheel rotating (size: ${this.size})`);
  }
}

// Car using composition
class Car {
  private engine: Engine;
  private wheels: Wheel[];
  
  constructor() {
    this.engine = new Engine();
    this.wheels = [
      new Wheel(16),
      new Wheel(16),
      new Wheel(16),
      new Wheel(16)
    ];
  }
  
  start(): void {
    this.engine.start();
  }
  
  stop(): void {
    this.engine.stop();
  }
  
  drive(): void {
    if (this.engine.running) {
      this.wheels.forEach(wheel => wheel.rotate());
    }
  }
}
```

---

## Dependency Injection

### Constructor Injection
```ts
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

class FileLogger implements Logger {
  log(message: string): void {
    // Write to file
    console.log(`[FILE] ${message}`);
  }
}

class UserService {
  constructor(private logger: Logger) {}
  
  createUser(name: string): void {
    this.logger.log(`Creating user: ${name}`);
    // User creation logic
  }
}

// Usage
const consoleLogger = new ConsoleLogger();
const userService = new UserService(consoleLogger);
userService.createUser("John");
```

### Property Injection
```ts
class UserService {
  private logger?: Logger;
  
  setLogger(logger: Logger): void {
    this.logger = logger;
  }
  
  createUser(name: string): void {
    if (this.logger) {
      this.logger.log(`Creating user: ${name}`);
    }
    // User creation logic
  }
}

const userService = new UserService();
userService.setLogger(new ConsoleLogger());
userService.createUser("John");
```

---

## Best Practices

### 1. Use Parameter Properties
```ts
// Good
class User {
  constructor(
    public readonly id: string,
    public name: string,
    private email: string
  ) {}
}

// Avoid
class User {
  public readonly id: string;
  public name: string;
  private email: string;
  
  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}
```

### 2. Use Readonly for Immutable Properties
```ts
class User {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public name: string
  ) {}
}
```

### 3. Use Abstract Classes for Shared Behavior
```ts
abstract class BaseRepository<T> {
  protected abstract tableName: string;
  
  abstract findById(id: string): Promise<T | null>;
  abstract save(entity: T): Promise<void>;
  
  // Shared method
  protected log(message: string): void {
    console.log(`[${this.tableName}] ${message}`);
  }
}
```

### 4. Use Composition Over Inheritance
```ts
// Prefer composition
class UserService {
  constructor(
    private logger: Logger,
    private validator: Validator,
    private repository: Repository
  ) {}
}
```

---

## Summary

TypeScript classes provide:
- **Type Safety**: Compile-time checking for properties and methods
- **Encapsulation**: Private and protected members
- **Inheritance**: Extends and implements keywords
- **Polymorphism**: Method overriding and abstract classes
- **Static Members**: Class-level properties and methods
- **Parameter Properties**: Automatic property creation
- **Readonly Properties**: Immutable class members
- **Getters/Setters**: Controlled property access



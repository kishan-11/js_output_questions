# Abstract Classes & Interfaces in TypeScript

## Overview
Abstract classes and interfaces are two fundamental concepts in TypeScript for defining contracts and shared behavior. Understanding their differences, use cases, and implementation patterns is crucial for effective TypeScript development.

## Interfaces

### Definition
Interfaces define the shape of an object - they describe what properties and methods an object should have, but don't provide implementation.

### Key Characteristics
- **Pure contracts**: Only define structure, no implementation
- **Multiple inheritance**: Can extend multiple interfaces
- **Compile-time only**: Disappear after compilation
- **Open for extension**: Can be merged using declaration merging
- **No constructors**: Cannot be instantiated directly

### Interface Syntax
```ts
interface Logger {
  log(message: string): void;
  level: 'debug' | 'info' | 'warn' | 'error';
}

// Interface extension
interface FileLogger extends Logger {
  filename: string;
  writeToFile(message: string): void;
}

// Multiple interface extension
interface TimestampedLogger extends Logger, TimestampProvider {
  timestamp: Date;
}
```

### Interface Merging
```ts
interface User {
  name: string;
}

interface User {
  age: number;
}

// Both properties are now part of User interface
const user: User = { name: 'John', age: 30 };
```

## Abstract Classes

### Definition
Abstract classes are classes that cannot be instantiated directly and may contain both implemented and abstract (unimplemented) members.

### Key Characteristics
- **Partial implementation**: Can have both concrete and abstract members
- **Single inheritance**: Can only extend one class
- **Runtime presence**: Exist at runtime
- **Constructor support**: Can have constructors
- **Access modifiers**: Support public, private, protected

### Abstract Class Syntax
```ts
abstract class Animal {
  protected name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  // Concrete method
  getName(): string {
    return this.name;
  }
  
  // Abstract method - must be implemented by subclasses
  abstract makeSound(): string;
  
  // Abstract property
  abstract get species(): string;
}

class Dog extends Animal {
  makeSound(): string {
    return 'Woof!';
  }
  
  get species(): string {
    return 'Canine';
  }
}
```

## Key Differences

| Feature | Interface | Abstract Class |
|---------|-----------|----------------|
| **Instantiation** | Cannot be instantiated | Cannot be instantiated |
| **Implementation** | No implementation | Can have implementation |
| **Inheritance** | Multiple via `extends` | Single inheritance only |
| **Runtime** | Compile-time only | Runtime presence |
| **Constructor** | No constructor | Can have constructor |
| **Access Modifiers** | All members public | Support all modifiers |
| **Merging** | Declaration merging | No merging |

## When to Use Interfaces

### 1. Public API Contracts
```ts
interface PaymentProcessor {
  processPayment(amount: number): Promise<PaymentResult>;
  validateCard(card: Card): boolean;
}

class StripeProcessor implements PaymentProcessor {
  async processPayment(amount: number): Promise<PaymentResult> {
    // Stripe-specific implementation
  }
  
  validateCard(card: Card): boolean {
    // Stripe validation logic
  }
}
```

### 2. Multiple Inheritance Needs
```ts
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

interface Duck extends Flyable, Swimmable {
  quack(): void;
}
```

### 3. Type Constraints
```ts
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
}

class UserRepository implements Repository<User> {
  // Implementation
}
```

## When to Use Abstract Classes

### 1. Shared Implementation
```ts
abstract class BaseRepository<T> {
  protected connection: DatabaseConnection;
  
  constructor(connection: DatabaseConnection) {
    this.connection = connection;
  }
  
  // Shared implementation
  async findById(id: string): Promise<T | null> {
    return this.connection.query(`SELECT * FROM ${this.getTableName()} WHERE id = ?`, [id]);
  }
  
  // Abstract method - must be implemented by subclasses
  protected abstract getTableName(): string;
  abstract save(entity: T): Promise<T>;
}

class UserRepository extends BaseRepository<User> {
  protected getTableName(): string {
    return 'users';
  }
  
  async save(user: User): Promise<User> {
    // User-specific save logic
  }
}
```

### 2. Template Method Pattern
```ts
abstract class DataProcessor {
  // Template method
  process(data: any[]): any[] {
    const validated = this.validate(data);
    const transformed = this.transform(validated);
    return this.finalize(transformed);
  }
  
  // Abstract methods to be implemented
  protected abstract validate(data: any[]): any[];
  protected abstract transform(data: any[]): any[];
  
  // Optional hook method
  protected finalize(data: any[]): any[] {
    return data;
  }
}
```

## Advanced Patterns

### 1. Interface Segregation
```ts
interface Readable {
  read(): string;
}

interface Writable {
  write(data: string): void;
}

interface ReadWrite extends Readable, Writable {}

class File implements ReadWrite {
  read(): string { return 'file content'; }
  write(data: string): void { /* implementation */ }
}
```

### 2. Abstract Factory Pattern
```ts
abstract class UIFactory {
  abstract createButton(): Button;
  abstract createDialog(): Dialog;
}

class MaterialUIFactory extends UIFactory {
  createButton(): Button { return new MaterialButton(); }
  createDialog(): Dialog { return new MaterialDialog(); }
}
```

### 3. Mixins with Interfaces
```ts
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface TimestampedConstructor {
  new (...args: any[]): Timestamped;
}

function withTimestamps<T extends TimestampedConstructor>(Base: T) {
  return class extends Base {
    createdAt = new Date();
    updatedAt = new Date();
  };
}
```

## Best Practices

### 1. Interface Naming
- Use descriptive names: `PaymentProcessor` not `Processor`
- Use adjectives for capabilities: `Serializable`, `Comparable`
- Use nouns for entities: `User`, `Product`

### 2. Abstract Class Design
- Keep abstract methods minimal
- Provide sensible defaults where possible
- Use protected for shared implementation details

### 3. Composition over Inheritance
```ts
// Prefer composition
class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}
}

// Over deep inheritance
class UserService extends BaseService {
  // Multiple levels of inheritance
}
```

## Common Pitfalls

### 1. Overusing Abstract Classes
```ts
// ❌ Don't create abstract classes for simple contracts
abstract class Shape {
  abstract area(): number;
}

// ✅ Use interfaces for simple contracts
interface Shape {
  area(): number;
}
```

### 2. Interface Pollution
```ts
// ❌ Don't create interfaces for everything
interface UserName { name: string; }

// ✅ Use types for simple structures
type UserName = { name: string; };
```

### 3. Circular Dependencies
```ts
// ❌ Avoid circular interface dependencies
interface A extends B {}
interface B extends A {}

// ✅ Use composition or redesign
interface A { b: B; }
interface B { a: A; }
```

## Migration Strategies

### From Interface to Abstract Class
```ts
// Before: Interface
interface Logger {
  log(message: string): void;
}

// After: Abstract class with shared implementation
abstract class Logger {
  protected formatMessage(message: string): string {
    return `[${new Date().toISOString()}] ${message}`;
  }
  
  abstract log(message: string): void;
}
```

### From Abstract Class to Interface
```ts
// Before: Abstract class with no shared implementation
abstract class Shape {
  abstract area(): number;
}

// After: Interface (simpler)
interface Shape {
  area(): number;
}
```



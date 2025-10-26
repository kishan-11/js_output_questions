# Interview Questions: Abstract Classes & Interfaces

## 1. What are the differences between an `interface` and an `abstract class`? When would you choose one over the other?

### Key Differences:

| Aspect | Interface | Abstract Class |
|--------|-----------|----------------|
| **Implementation** | No implementation, only contracts | Can have both concrete and abstract members |
| **Inheritance** | Multiple inheritance via `extends` | Single inheritance only |
| **Runtime** | Compile-time only (disappear after compilation) | Exist at runtime |
| **Constructor** | Cannot have constructors | Can have constructors |
| **Access Modifiers** | All members are implicitly public | Support private, protected, public |
| **Instantiation** | Cannot be instantiated | Cannot be instantiated |
| **Merging** | Support declaration merging | No merging capability |

### When to Choose Interface:
- **Public API contracts**: When defining external APIs
- **Multiple inheritance needs**: When a class needs to implement multiple contracts
- **Simple contracts**: When you only need to define structure
- **Type constraints**: For generic type parameters

```ts
// Interface for public API
interface PaymentProcessor {
  processPayment(amount: number): Promise<PaymentResult>;
}

// Multiple inheritance
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

### When to Choose Abstract Class:
- **Shared implementation**: When subclasses need common functionality
- **Template method pattern**: When you want to define a skeleton algorithm
- **Constructor logic**: When initialization is needed
- **Access control**: When you need private/protected members

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
  
  // Abstract method - must be implemented
  protected abstract getTableName(): string;
  abstract save(entity: T): Promise<T>;
}
```

## 2. Can an `interface` extend multiple interfaces? Can an abstract class implement interfaces and define abstract members simultaneously?

### Yes to both questions!

### Interface Multiple Extension:
```ts
interface Readable {
  read(): string;
}

interface Writable {
  write(data: string): void;
}

interface Closable {
  close(): void;
}

// Interface can extend multiple interfaces
interface FileHandle extends Readable, Writable, Closable {
  filename: string;
}

class File implements FileHandle {
  filename: string;
  
  read(): string { return 'file content'; }
  write(data: string): void { /* implementation */ }
  close(): void { /* implementation */ }
}
```

### Abstract Class Implementing Interfaces:
```ts
interface Logger {
  log(message: string): void;
}

interface Timestamped {
  getTimestamp(): Date;
}

// Abstract class can implement interfaces AND have abstract members
abstract class BaseLogger implements Logger, Timestamped {
  protected level: string;
  
  constructor(level: string) {
    this.level = level;
  }
  
  // Concrete implementation from Logger interface
  log(message: string): void {
    console.log(`[${this.level}] ${message}`);
  }
  
  // Concrete implementation from Timestamped interface
  getTimestamp(): Date {
    return new Date();
  }
  
  // Abstract method - must be implemented by subclasses
  abstract formatMessage(message: string): string;
  
  // Abstract property
  abstract get logLevel(): string;
}

class FileLogger extends BaseLogger {
  constructor() {
    super('INFO');
  }
  
  formatMessage(message: string): string {
    return `[${this.getTimestamp().toISOString()}] ${message}`;
  }
  
  get logLevel(): string {
    return 'FILE';
  }
}
```

## 3. How do you enforce a contract for a class without exposing implementation details? Give examples with `implements` and abstract members.

### Using Interfaces for Contracts:
```ts
// Contract definition - no implementation details
interface DataProcessor<T> {
  process(data: T[]): Promise<T[]>;
  validate(data: T): boolean;
}

// Implementation without exposing internal details
class UserProcessor implements DataProcessor<User> {
  private validationRules: ValidationRule[];
  private processingQueue: ProcessingQueue;
  
  constructor(validationRules: ValidationRule[]) {
    this.validationRules = validationRules;
    this.processingQueue = new ProcessingQueue();
  }
  
  async process(users: User[]): Promise<User[]> {
    // Internal implementation details hidden
    return this.processingQueue.process(users);
  }
  
  validate(user: User): boolean {
    // Internal validation logic hidden
    return this.validationRules.every(rule => rule.validate(user));
  }
}
```

### Using Abstract Classes for Partial Implementation:
```ts
// Abstract class with hidden implementation details
abstract class BaseService {
  private config: ServiceConfig;
  protected logger: Logger;
  
  constructor(config: ServiceConfig) {
    this.config = config;
    this.logger = this.createLogger();
  }
  
  // Hidden implementation details
  private createLogger(): Logger {
    return new Logger(this.config.logLevel);
  }
  
  // Public contract method
  async execute<T>(operation: Operation<T>): Promise<T> {
    this.logger.log(`Executing operation: ${operation.name}`);
    
    try {
      const result = await this.performOperation(operation);
      this.logger.log(`Operation completed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Operation failed: ${error.message}`);
      throw error;
    }
  }
  
  // Abstract method - implementation required by subclasses
  protected abstract performOperation<T>(operation: Operation<T>): Promise<T>;
}

// Concrete implementation
class UserService extends BaseService {
  protected async performOperation<T>(operation: Operation<T>): Promise<T> {
    // User-specific operation logic
    return operation.execute();
  }
}
```

### Interface Segregation for Focused Contracts:
```ts
// Separate, focused contracts
interface Readable {
  read(): string;
}

interface Writable {
  write(data: string): void;
}

interface Closable {
  close(): void;
}

// Class implements only what it needs
class ReadOnlyFile implements Readable, Closable {
  read(): string { return 'content'; }
  close(): void { /* implementation */ }
  // No write method - contract not exposed
}
```

## 4. When would you refactor from an interface to an abstract class (or vice versa) in a real codebase?

### Interface → Abstract Class Refactoring:

**When you need shared implementation:**
```ts
// Before: Interface with repeated implementation
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }
}

class FileLogger implements Logger {
  log(message: string): void {
    // Duplicate timestamp logic
    const timestamp = new Date().toISOString();
    fs.appendFileSync('log.txt', `[${timestamp}] ${message}\n`);
  }
}

// After: Abstract class with shared implementation
abstract class Logger {
  protected formatMessage(message: string): string {
    return `[${new Date().toISOString()}] ${message}`;
  }
  
  abstract log(message: string): void;
}

class ConsoleLogger extends Logger {
  log(message: string): void {
    console.log(this.formatMessage(message));
  }
}

class FileLogger extends Logger {
  log(message: string): void {
    fs.appendFileSync('log.txt', this.formatMessage(message) + '\n');
  }
}
```

**When you need constructor logic:**
```ts
// Before: Interface with manual initialization
interface DatabaseRepository {
  findById(id: string): Promise<any>;
}

class UserRepository implements DatabaseRepository {
  private connection: DatabaseConnection;
  
  constructor() {
    this.connection = new DatabaseConnection(); // Repeated in every implementation
  }
  
  async findById(id: string): Promise<any> {
    return this.connection.query('SELECT * FROM users WHERE id = ?', [id]);
  }
}

// After: Abstract class with constructor logic
abstract class DatabaseRepository {
  protected connection: DatabaseConnection;
  
  constructor() {
    this.connection = new DatabaseConnection();
  }
  
  abstract findById(id: string): Promise<any>;
}

class UserRepository extends DatabaseRepository {
  async findById(id: string): Promise<any> {
    return this.connection.query('SELECT * FROM users WHERE id = ?', [id]);
  }
}
```

### Abstract Class → Interface Refactoring:

**When you don't need shared implementation:**
```ts
// Before: Abstract class with no shared implementation
abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;
}

// After: Interface (simpler, more flexible)
interface Shape {
  area(): number;
  perimeter(): number;
}
```

**When you need multiple inheritance:**
```ts
// Before: Abstract class (single inheritance limitation)
abstract class BaseService {
  abstract process(data: any): any;
}

class UserService extends BaseService {
  process(data: any): any { /* implementation */ }
}

// Can't extend both BaseService and another class
// class UserService extends BaseService, Cacheable { } // ❌ Not allowed

// After: Interfaces allow multiple inheritance
interface Service {
  process(data: any): any;
}

interface Cacheable {
  cache(key: string, value: any): void;
}

class UserService implements Service, Cacheable {
  process(data: any): any { /* implementation */ }
  cache(key: string, value: any): void { /* implementation */ }
}
```

## 5. How do abstract constructors work in TypeScript and how do you type factory functions that accept abstract classes?

### Abstract Constructors:

Abstract classes can have constructors, but they cannot be instantiated directly:

```ts
abstract class Animal {
  protected name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  abstract makeSound(): string;
}

// ❌ Cannot instantiate abstract class directly
// const animal = new Animal("Generic"); // Error!

// ✅ Can instantiate concrete subclasses
class Dog extends Animal {
  makeSound(): string {
    return 'Woof!';
  }
}

const dog = new Dog("Buddy"); // ✅ Works
```

### Typing Factory Functions with Abstract Classes:

**Basic Factory Pattern:**
```ts
abstract class Vehicle {
  protected brand: string;
  
  constructor(brand: string) {
    this.brand = brand;
  }
  
  abstract start(): void;
}

class Car extends Vehicle {
  start(): void {
    console.log(`${this.brand} car started`);
  }
}

class Motorcycle extends Vehicle {
  start(): void {
    console.log(`${this.brand} motorcycle started`);
  }
}

// Factory function that accepts abstract class constructor
function createVehicle<T extends Vehicle>(
  VehicleClass: new (brand: string) => T,
  brand: string
): T {
  return new VehicleClass(brand);
}

// Usage
const car = createVehicle(Car, "Toyota");
const motorcycle = createVehicle(Motorcycle, "Honda");
```

**Advanced Factory with Generic Constraints:**
```ts
// Abstract base with generic type
abstract class Repository<T> {
  protected connection: DatabaseConnection;
  
  constructor(connection: DatabaseConnection) {
    this.connection = connection;
  }
  
  abstract findById(id: string): Promise<T | null>;
  abstract save(entity: T): Promise<T>;
}

// Concrete implementations
class UserRepository extends Repository<User> {
  async findById(id: string): Promise<User | null> {
    return this.connection.query('SELECT * FROM users WHERE id = ?', [id]);
  }
  
  async save(user: User): Promise<User> {
    return this.connection.query('INSERT INTO users ...', [user]);
  }
}

// Factory function with proper typing
function createRepository<T, R extends Repository<T>>(
  RepositoryClass: new (connection: DatabaseConnection) => R,
  connection: DatabaseConnection
): R {
  return new RepositoryClass(connection);
}

// Usage with type inference
const userRepo = createRepository(UserRepository, connection);
// userRepo is typed as UserRepository
```

**Factory with Abstract Class Constructor Type:**
```ts
// Define constructor signature for abstract class
type AbstractConstructor<T = {}> = abstract new (...args: any[]) => T;

// Factory that works with any class extending the abstract class
function createInstance<T extends Animal>(
  AnimalClass: AbstractConstructor<T>,
  name: string
): T {
  return new (AnimalClass as any)(name);
}

// Usage
const dog = createInstance(Dog, "Buddy");
const cat = createInstance(Cat, "Whiskers");
```

**Registry Pattern with Abstract Classes:**
```ts
abstract class Plugin {
  abstract name: string;
  abstract initialize(): void;
  abstract execute(): Promise<void>;
}

class DatabasePlugin extends Plugin {
  name = "DatabasePlugin";
  
  initialize(): void {
    console.log("Database plugin initialized");
  }
  
  async execute(): Promise<void> {
    console.log("Database operations executed");
  }
}

// Registry that accepts abstract class constructors
class PluginRegistry {
  private plugins = new Map<string, AbstractConstructor<Plugin>>();
  
  register<T extends Plugin>(
    name: string,
    PluginClass: AbstractConstructor<T>
  ): void {
    this.plugins.set(name, PluginClass as AbstractConstructor<Plugin>);
  }
  
  createPlugin(name: string, ...args: any[]): Plugin {
    const PluginClass = this.plugins.get(name);
    if (!PluginClass) {
      throw new Error(`Plugin ${name} not found`);
    }
    return new (PluginClass as any)(...args);
  }
}

// Usage
const registry = new PluginRegistry();
registry.register("database", DatabasePlugin);
const plugin = registry.createPlugin("database");
```

### Key Points:
- Abstract classes can have constructors for initialization
- Use `AbstractConstructor<T>` type for factory functions
- Factory functions can create instances of concrete subclasses
- Type constraints ensure only valid subclasses can be used
- Registry patterns work well with abstract class hierarchies


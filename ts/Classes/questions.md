## Interview questions: Classes

### 1. How do you type class properties, parameter properties, and getters/setters? Include `readonly` and `private`.

**Answer:**

**Class Properties:**
```ts
class User {
  // Explicit property declarations with types
  public name: string;
  private id: string;
  protected email: string;
  readonly createdAt: Date;
  public age: number = 0; // With default value
  
  constructor(name: string, email: string) {
    this.name = name;
    this.id = this.generateId();
    this.email = email;
    this.createdAt = new Date();
  }
  
  private generateId(): string {
    return Math.random().toString(36);
  }
}
```

**Parameter Properties:**
```ts
class User {
  // Parameter properties automatically create and assign properties
  constructor(
    public readonly id: string,        // Creates readonly public id
    private name: string,               // Creates private name
    protected email: string,            // Creates protected email
    public age: number = 0,             // Creates public age with default
    private readonly createdAt: Date = new Date() // Creates readonly private createdAt
  ) {
    // TypeScript automatically assigns these properties
    // No need for manual assignment
  }
  
  // Access the properties
  get displayName(): string {
    return `${this.name} (${this.id})`;
  }
}
```

**Getters and Setters:**
```ts
class BankAccount {
  private _balance: number = 0;
  private _transactions: string[] = [];
  private readonly _accountNumber: string;
  
  constructor(accountNumber: string, initialBalance: number = 0) {
    this._accountNumber = accountNumber;
    this._balance = initialBalance;
  }
  
  // Getter with return type
  get balance(): number {
    return this._balance;
  }
  
  // Setter with validation
  set balance(amount: number) {
    if (amount < 0) {
      throw new Error("Balance cannot be negative");
    }
    this._balance = amount;
    this._transactions.push(`Balance set to ${amount}`);
  }
  
  // Read-only getter
  get accountNumber(): string {
    return this._accountNumber;
  }
  
  // Computed getter
  get isOverdrawn(): boolean {
    return this._balance < 0;
  }
  
  // Getter returning readonly array
  get transactionHistory(): readonly string[] {
    return [...this._transactions]; // Return copy to prevent external modification
  }
  
  // Private getter (internal use only)
  private get _isValid(): boolean {
    return this._balance >= 0 && this._accountNumber.length > 0;
  }
}

// Usage
const account = new BankAccount("123456", 1000);
console.log(account.balance);        // 1000
console.log(account.accountNumber);  // "123456"
account.balance = 1500;              // Uses setter
// account.accountNumber = "new";    // ❌ Error: No setter for accountNumber
```

**Advanced Getters and Setters:**
```ts
class User {
  private _name: string;
  private _age: number;
  private _email: string;
  
  constructor(name: string, age: number, email: string) {
    this._name = name;
    this._age = age;
    this._email = email;
  }
  
  // Getter with validation
  get name(): string {
    return this._name;
  }
  
  // Setter with validation and side effects
  set name(value: string) {
    if (value.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }
    this._name = value.trim();
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
  
  // Getter with computed value
  get displayInfo(): string {
    return `${this._name} (${this._age}) - ${this._email}`;
  }
}
```

### 2. Explain `public` vs `private` vs `protected` with a real-world example.

**Answer:**

**Access Modifiers Explained:**

- **`public`**: Accessible from anywhere (default in TypeScript)
- **`private`**: Only accessible within the same class
- **`protected`**: Accessible within the class and its subclasses

**Real-world Example - Banking System:**

```ts
class BankAccount {
  // Public - accessible from anywhere
  public readonly accountNumber: string;
  public accountHolder: string;
  
  // Private - only accessible within BankAccount class
  private _balance: number;
  private _pin: string;
  private _transactions: Transaction[];
  
  // Protected - accessible in BankAccount and its subclasses
  protected _lastAccessed: Date;
  protected _accessCount: number = 0;
  
  constructor(accountNumber: string, accountHolder: string, pin: string, initialBalance: number = 0) {
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this._pin = pin;
    this._balance = initialBalance;
    this._transactions = [];
    this._lastAccessed = new Date();
  }
  
  // Public methods - accessible from anywhere
  public getBalance(): number {
    this._updateAccess();
    return this._balance;
  }
  
  public deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }
    this._balance += amount;
    this._addTransaction("deposit", amount);
    this._updateAccess();
  }
  
  public withdraw(amount: number, pin: string): boolean {
    if (!this._verifyPin(pin)) {
      throw new Error("Invalid PIN");
    }
    
    if (amount > this._balance) {
      return false; // Insufficient funds
    }
    
    this._balance -= amount;
    this._addTransaction("withdrawal", amount);
    this._updateAccess();
    return true;
  }
  
  // Private methods - only accessible within this class
  private _verifyPin(pin: string): boolean {
    return this._pin === pin;
  }
  
  private _addTransaction(type: string, amount: number): void {
    this._transactions.push({
      type,
      amount,
      timestamp: new Date()
    });
  }
  
  private _updateAccess(): void {
    this._lastAccessed = new Date();
    this._accessCount++;
  }
  
  // Protected methods - accessible in subclasses
  protected _getTransactionHistory(): readonly Transaction[] {
    return [...this._transactions];
  }
  
  protected _getAccessInfo(): { lastAccessed: Date; accessCount: number } {
    return {
      lastAccessed: this._lastAccessed,
      accessCount: this._accessCount
    };
  }
}

// Subclass that can access protected members
class SavingsAccount extends BankAccount {
  private _interestRate: number;
  
  constructor(accountNumber: string, accountHolder: string, pin: string, interestRate: number) {
    super(accountNumber, accountHolder, pin);
    this._interestRate = interestRate;
  }
  
  // Can access protected members from parent
  public getAccountSummary(): string {
    const accessInfo = this._getAccessInfo();
    const transactions = this._getTransactionHistory();
    
    return `
      Account: ${this.accountNumber}
      Holder: ${this.accountHolder}
      Balance: $${this.getBalance()}
      Interest Rate: ${this._interestRate}%
      Last Accessed: ${accessInfo.lastAccessed}
      Access Count: ${accessInfo.accessCount}
      Transactions: ${transactions.length}
    `;
  }
  
  public applyInterest(): void {
    const interest = this.getBalance() * this._interestRate / 100;
    this.deposit(interest);
  }
}

// Usage demonstrating access levels
const account = new SavingsAccount("123456", "John Doe", "1234", 2.5);

// ✅ Public access - works from anywhere
console.log(account.accountNumber);     // "123456"
console.log(account.accountHolder);    // "John Doe"
console.log(account.getBalance());     // 0

// ✅ Public methods
account.deposit(1000);
account.withdraw(100, "1234");

// ❌ Private access - compilation error
// console.log(account._balance);        // Error: Property '_balance' is private
// console.log(account._pin);           // Error: Property '_pin' is private

// ❌ Protected access - compilation error from outside
// console.log(account._lastAccessed);   // Error: Property '_lastAccessed' is protected

// ✅ Protected access works within subclass
console.log(account.getAccountSummary());
```

**Key Points:**

1. **Public**: Use for the external API of your class
2. **Private**: Use for internal implementation details that shouldn't be accessed externally
3. **Protected**: Use for implementation details that subclasses need to access

**Best Practices:**
- Start with private and make public only what's necessary
- Use protected sparingly - prefer composition over inheritance
- Use readonly for immutable properties
- Use getters/setters for controlled access to private properties

### 3. How do you model fluent APIs using polymorphic `this`?

**Answer:**

**Polymorphic `this`** allows methods to return the actual type of the object, enabling method chaining and fluent APIs that work correctly with inheritance.

**Basic Fluent API:**
```ts
class QueryBuilder {
  private table: string = "";
  private conditions: string[] = [];
  private orderBy: string = "";
  private limit: number = 0;
  
  // Return type is 'this' - allows method chaining
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
```

**Inheritance with Polymorphic `this`:**
```ts
class Animal {
  protected name: string;
  protected age: number;
  
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  
  // Return type is 'this' - allows method chaining
  setName(name: string): this {
    this.name = name;
    return this;
  }
  
  setAge(age: number): this {
    this.age = age;
    return this;
  }
  
  speak(): this {
    console.log(`${this.name} makes a sound`);
    return this;
  }
}

class Dog extends Animal {
  private breed: string;
  
  constructor(name: string, age: number, breed: string) {
    super(name, age);
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
  
  fetch(): this {
    console.log(`${this.name} fetches the ball`);
    return this;
  }
}

// Method chaining works with inheritance
const dog = new Dog("Buddy", 3, "Golden Retriever");
dog.setName("Max").setBreed("Labrador").setAge(4).speak().fetch();
// Output: Max barks
//         Max fetches the ball
```

**Advanced Fluent API - HTTP Client:**
```ts
class HttpClient {
  private baseUrl: string = "";
  private headers: Record<string, string> = {};
  private timeout: number = 5000;
  
  setBaseUrl(url: string): this {
    this.baseUrl = url;
    return this;
  }
  
  setHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }
  
  setTimeout(ms: number): this {
    this.timeout = ms;
    return this;
  }
  
  async get(endpoint: string): Promise<Response> {
    return this._request("GET", endpoint);
  }
  
  async post(endpoint: string, data: any): Promise<Response> {
    return this._request("POST", endpoint, data);
  }
  
  private async _request(method: string, endpoint: string, data?: any): Promise<Response> {
    // Implementation details
    console.log(`${method} ${this.baseUrl}${endpoint}`);
    return new Response();
  }
}

// Usage
const client = new HttpClient()
  .setBaseUrl("https://api.example.com")
  .setHeader("Authorization", "Bearer token")
  .setHeader("Content-Type", "application/json")
  .setTimeout(10000);

await client.get("/users");
await client.post("/users", { name: "John" });
```

**Fluent API with Validation:**
```ts
class FormValidator {
  private errors: string[] = [];
  private value: any;
  
  constructor(value: any) {
    this.value = value;
  }
  
  required(): this {
    if (this.value === null || this.value === undefined || this.value === "") {
      this.errors.push("Field is required");
    }
    return this;
  }
  
  minLength(min: number): this {
    if (typeof this.value === "string" && this.value.length < min) {
      this.errors.push(`Minimum length is ${min}`);
    }
    return this;
  }
  
  maxLength(max: number): this {
    if (typeof this.value === "string" && this.value.length > max) {
      this.errors.push(`Maximum length is ${max}`);
    }
    return this;
  }
  
  email(): this {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof this.value === "string" && !emailRegex.test(this.value)) {
      this.errors.push("Invalid email format");
    }
    return this;
  }
  
  isValid(): boolean {
    return this.errors.length === 0;
  }
  
  getErrors(): string[] {
    return [...this.errors];
  }
}

// Usage
const validator = new FormValidator("john@example.com");
const isValid = validator
  .required()
  .email()
  .minLength(5)
  .maxLength(50)
  .isValid();

if (!isValid) {
  console.log(validator.getErrors());
}
```

**Key Benefits of Polymorphic `this`:**
1. **Method Chaining**: Enables fluent APIs
2. **Inheritance Safety**: Methods return the correct type in subclasses
3. **Type Safety**: TypeScript knows the exact return type
4. **Extensibility**: Easy to extend with new methods

### 4. When would you choose composition over inheritance in TS and how to type each?

**Answer:**

**When to Choose Composition Over Inheritance:**

1. **"Has-a" vs "Is-a" relationship**: Use composition when objects have a relationship, not when one is a type of another
2. **Multiple behaviors**: When an object needs multiple behaviors that don't fit a single inheritance hierarchy
3. **Flexibility**: When you need to change behavior at runtime
4. **Testing**: Easier to mock and test individual components
5. **Avoiding deep inheritance chains**: Prevents complex class hierarchies

**Inheritance Example:**
```ts
// Inheritance - "Is-a" relationship
abstract class Vehicle {
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

class Motorcycle extends Vehicle {
  private hasWindshield: boolean;
  
  constructor(maxSpeed: number, hasWindshield: boolean) {
    super(maxSpeed);
    this.hasWindshield = hasWindshield;
  }
  
  wheelie(): void {
    console.log("Doing a wheelie");
  }
}
```

**Composition Example:**
```ts
// Composition - "Has-a" relationship
interface Engine {
  start(): void;
  stop(): void;
  getRpm(): number;
}

interface Wheel {
  rotate(): void;
  getSize(): number;
}

interface Brake {
  apply(): void;
  release(): void;
}

// Engine implementation
class GasEngine implements Engine {
  private rpm: number = 0;
  
  start(): void {
    this.rpm = 1000;
    console.log("Gas engine started");
  }
  
  stop(): void {
    this.rpm = 0;
    console.log("Gas engine stopped");
  }
  
  getRpm(): number {
    return this.rpm;
  }
}

class ElectricEngine implements Engine {
  private rpm: number = 0;
  
  start(): void {
    this.rpm = 2000;
    console.log("Electric engine started");
  }
  
  stop(): void {
    this.rpm = 0;
    console.log("Electric engine stopped");
  }
  
  getRpm(): number {
    return this.rpm;
  }
}

// Wheel implementation
class StandardWheel implements Wheel {
  constructor(private size: number) {}
  
  rotate(): void {
    console.log(`Wheel rotating (size: ${this.size})`);
  }
  
  getSize(): number {
    return this.size;
  }
}

// Brake implementation
class DiscBrake implements Brake {
  apply(): void {
    console.log("Disc brake applied");
  }
  
  release(): void {
    console.log("Disc brake released");
  }
}

// Car using composition
class Car {
  private engine: Engine;
  private wheels: Wheel[];
  private brakes: Brake[];
  
  constructor(engine: Engine, wheels: Wheel[], brakes: Brake[]) {
    this.engine = engine;
    this.wheels = wheels;
    this.brakes = brakes;
  }
  
  start(): void {
    this.engine.start();
  }
  
  stop(): void {
    this.engine.stop();
  }
  
  drive(): void {
    if (this.engine.getRpm() > 0) {
      this.wheels.forEach(wheel => wheel.rotate());
    }
  }
  
  brake(): void {
    this.brakes.forEach(brake => brake.apply());
  }
  
  // Getter for engine type (useful for diagnostics)
  getEngineType(): string {
    return this.engine.constructor.name;
  }
}

// Usage with different compositions
const gasEngine = new GasEngine();
const electricEngine = new ElectricEngine();
const wheels = [
  new StandardWheel(16),
  new StandardWheel(16),
  new StandardWheel(16),
  new StandardWheel(16)
];
const brakes = [
  new DiscBrake(),
  new DiscBrake()
];

// Gas-powered car
const gasCar = new Car(gasEngine, wheels, brakes);
gasCar.start();
gasCar.drive();

// Electric car
const electricCar = new Car(electricEngine, wheels, brakes);
electricCar.start();
electricCar.drive();
```

**Advanced Composition with Dependency Injection:**
```ts
// Service interfaces
interface Logger {
  log(message: string): void;
}

interface Database {
  save(data: any): Promise<void>;
  find(id: string): Promise<any>;
}

interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

// Implementations
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

class FileLogger implements Logger {
  log(message: string): void {
    console.log(`[FILE] ${message}`);
  }
}

class PostgresDatabase implements Database {
  async save(data: any): Promise<void> {
    console.log("Saving to PostgreSQL:", data);
  }
  
  async find(id: string): Promise<any> {
    console.log("Finding in PostgreSQL:", id);
    return { id, name: "John" };
  }
}

class SMTPEmailService implements EmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    console.log(`Sending email to ${to}: ${subject}`);
  }
}

// User service using composition
class UserService {
  constructor(
    private logger: Logger,
    private database: Database,
    private emailService: EmailService
  ) {}
  
  async createUser(name: string, email: string): Promise<void> {
    this.logger.log(`Creating user: ${name}`);
    
    const user = { name, email, id: Math.random().toString(36) };
    await this.database.save(user);
    
    await this.emailService.send(
      email,
      "Welcome!",
      `Hello ${name}, welcome to our service!`
    );
    
    this.logger.log(`User created successfully: ${name}`);
  }
  
  async getUser(id: string): Promise<any> {
    this.logger.log(`Fetching user: ${id}`);
    return await this.database.find(id);
  }
}

// Usage with different compositions
const consoleLogger = new ConsoleLogger();
const fileLogger = new FileLogger();
const database = new PostgresDatabase();
const emailService = new SMTPEmailService();

// Development environment
const devUserService = new UserService(consoleLogger, database, emailService);

// Production environment
const prodUserService = new UserService(fileLogger, database, emailService);

// Testing with mocks
class MockLogger implements Logger {
  log(message: string): void {
    // Mock implementation
  }
}

class MockDatabase implements Database {
  async save(data: any): Promise<void> {
    // Mock implementation
  }
  
  async find(id: string): Promise<any> {
    return { id, name: "Mock User" };
  }
}

const testUserService = new UserService(new MockLogger(), new MockDatabase(), emailService);
```

**When to Use Each:**

**Use Inheritance when:**
- You have a clear "is-a" relationship
- You need to share common behavior
- You have a stable hierarchy
- You need polymorphic behavior

**Use Composition when:**
- You have a "has-a" relationship
- You need multiple behaviors
- You need runtime flexibility
- You want to avoid deep inheritance chains
- You need better testability

**TypeScript Benefits:**
- **Interface Segregation**: Define small, focused interfaces
- **Dependency Injection**: Easy to swap implementations
- **Type Safety**: Compile-time checking for all dependencies
- **Testing**: Easy to mock individual components

### 5. How do you type static members and constructor parameters for dependency injection?

**Answer:**

**Static Members Typing:**
```ts
class DatabaseConnection {
  // Static properties with types
  private static instance: DatabaseConnection | null = null;
  private static connectionCount: number = 0;
  private static readonly MAX_CONNECTIONS: number = 10;
  
  // Static methods with return types
  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
  
  static getConnectionCount(): number {
    return DatabaseConnection.connectionCount;
  }
  
  static canCreateConnection(): boolean {
    return DatabaseConnection.connectionCount < DatabaseConnection.MAX_CONNECTIONS;
  }
  
  // Static method with generic type
  static create<T>(config: DatabaseConfig): T {
    if (!DatabaseConnection.canCreateConnection()) {
      throw new Error("Maximum connections reached");
    }
    DatabaseConnection.connectionCount++;
    return new DatabaseConnection() as T;
  }
  
  // Static method with overloads
  static connect(url: string): DatabaseConnection;
  static connect(url: string, options: ConnectionOptions): DatabaseConnection;
  static connect(url: string, options?: ConnectionOptions): DatabaseConnection {
    // Implementation
    return new DatabaseConnection();
  }
}

// Usage
const db = DatabaseConnection.getInstance();
const connectionCount = DatabaseConnection.getConnectionCount();
```

**Constructor Parameters for Dependency Injection:**
```ts
// Service interfaces
interface Logger {
  log(message: string): void;
  error(message: string): void;
}

interface Database {
  save(data: any): Promise<void>;
  find(id: string): Promise<any>;
}

interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

// Configuration interface
interface ServiceConfig {
  logger: Logger;
  database: Database;
  emailService: EmailService;
  retryAttempts: number;
  timeout: number;
}

// Service class with constructor injection
class UserService {
  constructor(
    private logger: Logger,
    private database: Database,
    private emailService: EmailService,
    private config: ServiceConfig
  ) {}
  
  async createUser(name: string, email: string): Promise<void> {
    this.logger.log(`Creating user: ${name}`);
    
    try {
      const user = { name, email, id: Math.random().toString(36) };
      await this.database.save(user);
      
      await this.emailService.send(
        email,
        "Welcome!",
        `Hello ${name}, welcome to our service!`
      );
      
      this.logger.log(`User created successfully: ${name}`);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error}`);
      throw error;
    }
  }
}

// Factory class for dependency injection
class ServiceFactory {
  static createUserService(config: ServiceConfig): UserService {
    return new UserService(
      config.logger,
      config.database,
      config.emailService,
      config
    );
  }
  
  // Generic factory method
  static create<T>(
    serviceClass: new (...args: any[]) => T,
    dependencies: any[]
  ): T {
    return new serviceClass(...dependencies);
  }
}
```

**Advanced Dependency Injection with Decorators:**
```ts
// Dependency injection decorator
function Injectable(target: any) {
  // Mark class as injectable
  target.__injectable = true;
}

// Service registry
class ServiceRegistry {
  private static services = new Map<string, any>();
  
  static register<T>(token: string, service: T): void {
    ServiceRegistry.services.set(token, service);
  }
  
  static get<T>(token: string): T {
    const service = ServiceRegistry.services.get(token);
    if (!service) {
      throw new Error(`Service ${token} not found`);
    }
    return service as T;
  }
}

// Injectable services
@Injectable
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
  
  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

@Injectable
class PostgresDatabase implements Database {
  async save(data: any): Promise<void> {
    console.log("Saving to PostgreSQL:", data);
  }
  
  async find(id: string): Promise<any> {
    console.log("Finding in PostgreSQL:", id);
    return { id, name: "John" };
  }
}

@Injectable
class SMTPEmailService implements EmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    console.log(`Sending email to ${to}: ${subject}`);
  }
}

// Register services
ServiceRegistry.register("logger", new ConsoleLogger());
ServiceRegistry.register("database", new PostgresDatabase());
ServiceRegistry.register("emailService", new SMTPEmailService());

// Service with constructor injection
class UserService {
  constructor(
    private logger: Logger,
    private database: Database,
    private emailService: EmailService
  ) {}
  
  async createUser(name: string, email: string): Promise<void> {
    this.logger.log(`Creating user: ${name}`);
    // Implementation
  }
}

// Factory with dependency injection
class ServiceFactory {
  static createUserService(): UserService {
    return new UserService(
      ServiceRegistry.get<Logger>("logger"),
      ServiceRegistry.get<Database>("database"),
      ServiceRegistry.get<EmailService>("emailService")
    );
  }
}
```

**Constructor Parameter Types with Generics:**
```ts
// Generic service class
class GenericService<T> {
  constructor(
    private repository: Repository<T>,
    private logger: Logger,
    private validator: Validator<T>
  ) {}
  
  async create(entity: T): Promise<T> {
    this.logger.log(`Creating entity: ${JSON.stringify(entity)}`);
    
    if (!this.validator.validate(entity)) {
      throw new Error("Invalid entity");
    }
    
    return await this.repository.save(entity);
  }
  
  async findById(id: string): Promise<T | null> {
    this.logger.log(`Finding entity by id: ${id}`);
    return await this.repository.findById(id);
  }
}

// Usage with specific types
interface User {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

// Create typed services
const userService = new GenericService<User>(
  userRepository,
  logger,
  userValidator
);

const productService = new GenericService<Product>(
  productRepository,
  logger,
  productValidator
);
```

**Best Practices:**

1. **Use interfaces for dependencies**: Makes testing and mocking easier
2. **Constructor injection**: Preferred over property injection
3. **Factory pattern**: For complex object creation
4. **Service registry**: For managing dependencies
5. **Generic types**: For reusable service classes
6. **Type safety**: Always type constructor parameters

**Benefits:**
- **Testability**: Easy to mock dependencies
- **Flexibility**: Easy to swap implementations
- **Type Safety**: Compile-time checking
- **Maintainability**: Clear dependencies
- **Reusability**: Services can be reused with different dependencies


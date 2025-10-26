# TypeScript Type Operators: Questions & Answers

## 🔹 `typeof` Operator Questions

### Q1: What is the difference between `typeof` in JavaScript and TypeScript?

**Answer:**
```ts
// JavaScript typeof (runtime)
const name = "Kishan";
console.log(typeof name); // "string"

// TypeScript typeof (compile-time)
const name = "Kishan";
type NameType = typeof name; // "Kishan" (literal type)
```

**Key Differences:**
- **JavaScript `typeof`**: Runtime operator that returns a string describing the type
- **TypeScript `typeof`**: Compile-time operator that extracts the type of a value
- **Context**: JavaScript works with values, TypeScript works with types

### Q2: How can you extract the return type of a function using `typeof`?

**Answer:**
```ts
function getUser(id: number): { id: number; name: string } {
  return { id, name: "Kishan" };
}

// Extract function type
type GetUserFunction = typeof getUser;
// (id: number) => { id: number; name: string; }

// Extract return type
type UserReturnType = ReturnType<typeof getUser>;
// { id: number; name: string; }

// Extract parameter types
type GetUserParams = Parameters<typeof getUser>;
// [number]
```

### Q3: What happens when you use `typeof` with const assertions?

**Answer:**
```ts
// Without const assertion
const colors = ['red', 'green', 'blue'];
type Colors = typeof colors; // string[]

// With const assertion
const colors = ['red', 'green', 'blue'] as const;
type Colors = typeof colors; // readonly ["red", "green", "blue"]
type Color = typeof colors[number]; // "red" | "green" | "blue"
```

### Q4: How do you extract types from imported modules using `typeof`?

**Answer:**
```ts
// In module.ts
export class User {
  constructor(public name: string, public age: number) {}
  greet() { return `Hello, ${this.name}`; }
}

export function createUser(name: string, age: number): User {
  return new User(name, age);
}

// In another file
import { User, createUser } from './module';

// Extract class constructor type
type UserConstructor = typeof User;
// new (name: string, age: number) => User

// Extract function type
type CreateUserFunction = typeof createUser;
// (name: string, age: number) => User

// Extract instance type
type UserInstance = InstanceType<typeof User>;
// User
```

### Q5: What are the limitations of `typeof` with classes?

**Answer:**
```ts
class Car {
  brand: string;
  year: number;
  
  constructor(brand: string, year: number) {
    this.brand = brand;
    this.year = year;
  }
  
  drive() { console.log("Driving..."); }
}

// typeof Car gives you the constructor type, not the instance type
type CarConstructor = typeof Car;
// new (brand: string, year: number) => Car

// To get the instance type, use InstanceType
type CarInstance = InstanceType<typeof Car>;
// Car

// Or use the class directly
type CarType = Car;
// Car
```

---

## 🔹 `keyof` Operator Questions

### Q6: What does `keyof` return for different types?

**Answer:**
```ts
// Object types
type User = { id: number; name: string; email: string };
type UserKeys = keyof User; // "id" | "name" | "email"

// Array types
type ArrayKeys = keyof string[]; // number | "length" | "push" | "pop" | "shift" | "unshift" | ...

// Function types
type FunctionKeys = keyof Function; // "prototype" | "length" | "name" | "call" | "apply" | "bind"

// String types
type StringKeys = keyof string; // number | "charAt" | "indexOf" | "length" | "substring" | ...

// Primitive types
type NumberKeys = keyof number; // "toString" | "valueOf" | "toFixed" | "toExponential" | ...
```

### Q7: How do you create a type-safe property accessor using `keyof`?

**Answer:**
```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

// Usage
const user = { id: 1, name: "Kishan", age: 25 };

const id = getProperty(user, "id"); // number
const name = getProperty(user, "name"); // string
// const invalid = getProperty(user, "invalid"); // ❌ Error: Argument of type '"invalid"' is not assignable

setProperty(user, "name", "John"); // ✅ Valid
// setProperty(user, "age", "25"); // ❌ Error: Type 'string' is not assignable to type 'number'
```

### Q8: How can you filter keys by their value types using `keyof`?

**Answer:**
```ts
// Extract keys that have string values
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

// Extract keys that have number values
type NumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

// Extract keys that have function values
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

// Usage
type User = { 
  id: number; 
  name: string; 
  email: string; 
  age: number; 
  greet: () => void;
};

type UserStringKeys = StringKeys<User>; // "name" | "email"
type UserNumberKeys = NumberKeys<User>; // "id" | "age"
type UserFunctionKeys = FunctionKeys<User>; // "greet"
```

### Q9: How do you create a type that picks specific keys from an object?

**Answer:**
```ts
// Pick specific keys
type PickKeys<T, K extends keyof T> = Pick<T, K>;

// Omit specific keys
type OmitKeys<T, K extends keyof T> = Omit<T, K>;

// Pick keys by value type
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

// Usage
type User = { 
  id: number; 
  name: string; 
  email: string; 
  password: string; 
  age: number;
};

type PublicUser = PickKeys<User, "id" | "name" | "email">;
// { id: number; name: string; email: string; }

type UserWithoutPassword = OmitKeys<User, "password">;
// { id: number; name: string; email: string; age: number; }

type UserStrings = PickByType<User, string>;
// { name: string; email: string; password: string; }
```

### Q10: How can you create event handlers from object properties using `keyof`?

**Answer:**
```ts
// Create event handlers from object properties
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (value: T[K]) => void;
};

// Create getter/setter pairs
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

// Usage
type User = { name: string; age: number; email: string };

type UserEventHandlers = EventHandlers<User>;
// {
//   onName: (value: string) => void;
//   onAge: (value: number) => void;
//   onEmail: (value: string) => void;
// }

type UserGetters = Getters<User>;
// {
//   getName: () => string;
//   getAge: () => number;
//   getEmail: () => string;
// }

type UserSetters = Setters<User>;
// {
//   setName: (value: string) => void;
//   setAge: (value: number) => void;
//   setEmail: (value: string) => void;
// }
```

---

## 🔹 `in` Operator Questions

### Q11: What are the two different uses of the `in` operator?

**Answer:**
```ts
// 1. Compile-time: Mapped types
type User = { id: number; name: string };
type ReadOnlyUser = {
  readonly [K in keyof User]: User[K];
};
// { readonly id: number; readonly name: string; }

// 2. Runtime: Property existence check
const user = { id: 1, name: "Kishan" };

if ("id" in user) {
  console.log("User has an id:", user.id);
}

// Type guard function
function hasProperty<T, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> {
  return prop in obj;
}
```

### Q12: How do you create utility types using the `in` operator?

**Answer:**
```ts
// Make all properties optional
type Partial<T> = {
  [K in keyof T]?: T[K];
};

// Make all properties required
type Required<T> = {
  [K in keyof T]-?: T[K];
};

// Make all properties readonly
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Transform all properties to a specific type
type Stringify<T> = {
  [K in keyof T]: string;
};

// Usage
type User = { id: number; name: string; email: string };

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }

type RequiredUser = Required<PartialUser>;
// { id: number; name: string; email: string; }

type StringifiedUser = Stringify<User>;
// { id: string; name: string; email: string; }
```

### Q13: How do you create conditional mapped types using `in`?

**Answer:**
```ts
// Pick properties by value type
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

// Omit properties by value type
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

// Pick properties by key pattern
type PickByKeyPattern<T, P extends string> = {
  [K in keyof T as K extends P ? K : never]: T[K];
};

// Usage
type User = { 
  id: number; 
  name: string; 
  email: string; 
  age: number; 
  password: string;
};

type UserStrings = PickByType<User, string>;
// { name: string; email: string; password: string; }

type UserNumbers = PickByType<User, number>;
// { id: number; age: number; }

type UserWithoutStrings = OmitByType<User, string>;
// { id: number; age: number; }
```

### Q14: How do you create API endpoints from object keys using `in`?

**Answer:**
```ts
// Create API endpoints from object keys
type ApiEndpoints<T> = {
  [K in keyof T as `/${string & K}`]: {
    get: () => Promise<T[K]>;
    post: (data: T[K]) => Promise<void>;
    put: (data: T[K]) => Promise<void>;
    delete: () => Promise<void>;
  };
};

// Create RESTful API structure
type RestApi<T> = {
  [K in keyof T as `/${string & K}`]: {
    [Method in 'GET' | 'POST' | 'PUT' | 'DELETE']: Method extends 'GET' 
      ? () => Promise<T[K]>
      : (data: T[K]) => Promise<void>;
  };
};

// Usage
type User = { profile: any; settings: any; posts: any };

type UserApi = ApiEndpoints<User>;
// {
//   "/profile": { get: () => Promise<any>; post: (data: any) => Promise<void>; ... };
//   "/settings": { get: () => Promise<any>; post: (data: any) => Promise<void>; ... };
//   "/posts": { get: () => Promise<any>; post: (data: any) => Promise<void>; ... };
// }
```

### Q15: How do you validate object structure at runtime using `in`?

**Answer:**
```ts
// Validate object has required properties
function validateObject<T>(
  obj: any,
  requiredKeys: (keyof T)[]
): obj is T {
  return requiredKeys.every(key => key in obj);
}

// Check if object has all properties of a type
function hasAllProperties<T, K extends keyof T>(
  obj: any,
  keys: K[]
): obj is T {
  return keys.every(key => key in obj);
}

// Type-safe property access with validation
function getProperty<T, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  if (key in obj) {
    return obj[key];
  }
  throw new Error(`Property ${String(key)} does not exist`);
}

// Usage
interface User {
  id: number;
  name: string;
  email: string;
}

const data = { id: 1, name: "Kishan" };

if (validateObject<User>(data, ["id", "name", "email"])) {
  // data is now typed as User
  console.log(data.email); // TypeScript knows email exists
}

if (hasAllProperties<User, "id" | "name">(data, ["id", "name"])) {
  // data has id and name properties
  console.log(data.id, data.name);
}
```

---

## 🔹 `instanceof` Operator Questions

### Q16: How does `instanceof` work with inheritance hierarchies?

**Answer:**
```ts
class Animal {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  breed: string;
  
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
  
  bark() {
    console.log(`${this.name} barks`);
  }
}

class Cat extends Animal {
  color: string;
  
  constructor(name: string, color: string) {
    super(name);
    this.color = color;
  }
  
  meow() {
    console.log(`${this.name} meows`);
  }
}

// instanceof works with inheritance
const dog = new Dog("Buddy", "Golden Retriever");
const cat = new Cat("Whiskers", "Orange");

console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true (inheritance)
console.log(cat instanceof Cat); // true
console.log(cat instanceof Animal); // true (inheritance)
console.log(dog instanceof Cat); // false

// Type narrowing with instanceof
function processAnimal(animal: Animal) {
  if (animal instanceof Dog) {
    // TypeScript knows this is a Dog
    animal.bark(); // ✅ Safe to call
    console.log(animal.breed); // ✅ Safe to access
  } else if (animal instanceof Cat) {
    // TypeScript knows this is a Cat
    animal.meow(); // ✅ Safe to call
    console.log(animal.color); // ✅ Safe to access
  } else {
    // TypeScript knows this is a base Animal
    animal.speak(); // ✅ Safe to call
  }
}
```

### Q17: How do you create generic type guards using `instanceof`?

**Answer:**
```ts
// Generic type guard function
function isInstanceOf<T>(
  obj: any,
  constructor: new (...args: any[]) => T
): obj is T {
  return obj instanceof constructor;
}

// Multiple type checking
function getType<T>(obj: any, constructors: (new (...args: any[]) => T)[]): T | null {
  for (const constructor of constructors) {
    if (obj instanceof constructor) {
      return obj;
    }
  }
  return null;
}

// Usage
class Car {
  brand: string;
  constructor(brand: string) { this.brand = brand; }
}

class Motorcycle {
  engineSize: number;
  constructor(engineSize: number) { this.engineSize = engineSize; }
}

const vehicle = new Car("Toyota");

if (isInstanceOf(vehicle, Car)) {
  console.log(vehicle.brand); // TypeScript knows this is a Car
}

// Check against multiple types
const result = getType(vehicle, [Car, Motorcycle]);
if (result) {
  // result is typed as Car | Motorcycle
  console.log(result);
}
```

### Q18: How do you handle error types with `instanceof`?

**Answer:**
```ts
// Custom error classes
class CustomError extends Error {
  code: number;
  
  constructor(message: string, code: number) {
    super(message);
    this.name = "CustomError";
    this.code = code;
  }
}

class ValidationError extends CustomError {
  field: string;
  
  constructor(field: string, message: string) {
    super(message, 400);
    this.field = field;
  }
}

class NetworkError extends CustomError {
  url: string;
  
  constructor(url: string, message: string) {
    super(message, 500);
    this.url = url;
  }
}

// Error handling with instanceof
function handleError(error: unknown) {
  if (error instanceof ValidationError) {
    console.log(`Validation error in field: ${error.field}`);
    console.log(`Code: ${error.code}`);
    // Handle validation error
  } else if (error instanceof NetworkError) {
    console.log(`Network error for URL: ${error.url}`);
    console.log(`Code: ${error.code}`);
    // Handle network error
  } else if (error instanceof CustomError) {
    console.log(`Custom error: ${error.message}`);
    console.log(`Code: ${error.code}`);
    // Handle custom error
  } else if (error instanceof Error) {
    console.log(`Generic error: ${error.message}`);
    // Handle generic error
  } else {
    console.log("Unknown error");
    // Handle unknown error
  }
}

// Usage
try {
  throw new ValidationError("email", "Invalid email format");
} catch (error) {
  handleError(error);
}
```

### Q19: How do you use `instanceof` with built-in types?

**Answer:**
```ts
// Array checking
function processArray(data: unknown): string[] {
  if (data instanceof Array) {
    // data is typed as any[]
    return data.map(item => String(item));
  }
  return [];
}

// Date checking
function formatDate(date: unknown): string {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return "Invalid date";
}

// RegExp checking
function testPattern(pattern: unknown, text: string): boolean {
  if (pattern instanceof RegExp) {
    return pattern.test(text);
  }
  return false;
}

// Function checking
function callIfFunction(fn: unknown, ...args: any[]): any {
  if (fn instanceof Function) {
    return fn(...args);
  }
  return undefined;
}

// Map and Set checking
function processCollection(collection: unknown): string[] {
  if (collection instanceof Map) {
    return Array.from(collection.values()).map(String);
  } else if (collection instanceof Set) {
    return Array.from(collection).map(String);
  }
  return [];
}

// Usage
const arr = [1, 2, 3];
const date = new Date();
const regex = /test/;
const func = () => "hello";
const map = new Map([["key", "value"]]);
const set = new Set([1, 2, 3]);

console.log(processArray(arr)); // ["1", "2", "3"]
console.log(formatDate(date)); // "2023-..."
console.log(testPattern(regex, "test")); // true
console.log(callIfFunction(func)); // "hello"
console.log(processCollection(map)); // ["value"]
console.log(processCollection(set)); // ["1", "2", "3"]
```

### Q20: How do you create custom `instanceof` behavior?

**Answer:**
```ts
// Custom instanceof behavior using Symbol.hasInstance
class MyClass {
  static [Symbol.hasInstance](instance: any): boolean {
    return instance && typeof instance === 'object' && instance.isMyClass;
  }
}

// Usage
const obj = { isMyClass: true };
console.log(obj instanceof MyClass); // true

// Duck typing with instanceof
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly() {
    console.log("Flying like a bird");
  }
}

class Airplane implements Flyable {
  fly() {
    console.log("Flying like an airplane");
  }
}

class Rocket implements Flyable {
  fly() {
    console.log("Flying like a rocket");
  }
}

function makeItFly(flyable: unknown) {
  if (flyable instanceof Bird || flyable instanceof Airplane || flyable instanceof Rocket) {
    flyable.fly();
  }
}

// Factory pattern with instanceof
class VehicleFactory {
  static createVehicle(type: string): Vehicle {
    switch (type) {
      case "car":
        return new Car("Generic", 2020);
      case "motorcycle":
        return new Motorcycle(250);
      default:
        throw new Error("Unknown vehicle type");
    }
  }
}

const vehicle = VehicleFactory.createVehicle("car");
if (vehicle instanceof Car) {
  vehicle.drive();
}
```

---

## 🔹 Advanced Combined Questions

### Q21: How do you combine multiple type operators for complex type manipulation?

**Answer:**
```ts
// Extract function parameter types and create a type-safe API
type ApiMethod<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};

type ApiParams<T> = {
  [K in keyof ApiMethod<T>]: Parameters<ApiMethod<T>[K]>;
};

type ApiReturns<T> = {
  [K in keyof ApiMethod<T>]: ReturnType<ApiMethod<T>[K]>;
};

// Usage
class UserService {
  getUser(id: number): { id: number; name: string } {
    return { id, name: "Kishan" };
  }
  
  createUser(data: { name: string }): { id: number; name: string } {
    return { id: 1, name: data.name };
  }
  
  updateUser(id: number, data: { name: string }): void {
    // Update logic
  }
}

type UserApiMethods = ApiMethod<UserService>;
// { getUser: (id: number) => { id: number; name: string; }; ... }

type UserApiParams = ApiParams<UserService>;
// { getUser: [number]; createUser: [{ name: string; }]; updateUser: [number, { name: string; }]; }

type UserApiReturns = ApiReturns<UserService>;
// { getUser: { id: number; name: string; }; createUser: { id: number; name: string; }; updateUser: void; }
```

### Q22: How do you create a type-safe event system using all operators?

**Answer:**
```ts
// Event system with type safety
type EventMap = {
  userCreated: { id: number; name: string };
  userUpdated: { id: number; changes: Partial<{ name: string; email: string }> };
  userDeleted: { id: number };
};

type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (data: T[K]) => void;
};

type EventEmitter<T> = {
  emit<K extends keyof T>(event: K, data: T[K]): void;
  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void;
  off<K extends keyof T>(event: K, handler: (data: T[K]) => void): void;
};

// Type-safe event emitter implementation
class TypeSafeEventEmitter<T> implements EventEmitter<T> {
  private handlers: Map<keyof T, Set<Function>> = new Map();
  
  emit<K extends keyof T>(event: K, data: T[K]): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.forEach(handler => handler(data));
    }
  }
  
  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }
  
  off<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler);
    }
  }
}

// Usage
const eventEmitter = new TypeSafeEventEmitter<EventMap>();

eventEmitter.on("userCreated", (data) => {
  console.log(`User created: ${data.name} (ID: ${data.id})`);
});

eventEmitter.on("userUpdated", (data) => {
  console.log(`User ${data.id} updated with changes:`, data.changes);
});

eventEmitter.emit("userCreated", { id: 1, name: "Kishan" });
eventEmitter.emit("userUpdated", { id: 1, changes: { name: "John" } });
```

### Q23: How do you create a type-safe database ORM using type operators?

**Answer:**
```ts
// Database entity types
type Entity<T> = T & { id: number; createdAt: Date; updatedAt: Date };

type User = Entity<{
  name: string;
  email: string;
  age: number;
}>;

type Post = Entity<{
  title: string;
  content: string;
  authorId: number;
}>;

// ORM operations with type safety
type CreateData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateData<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;
type FindOptions<T> = {
  where?: Partial<Pick<T, keyof T>>;
  select?: (keyof T)[];
  orderBy?: keyof T;
  limit?: number;
};

// Type-safe ORM class
class TypeSafeORM<T extends Entity<any>> {
  private data: T[] = [];
  
  create(data: CreateData<T>): T {
    const entity = {
      ...data,
      id: Math.random(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as T;
    
    this.data.push(entity);
    return entity;
  }
  
  update(id: number, data: UpdateData<T>): T | null {
    const entity = this.data.find(item => item.id === id);
    if (entity) {
      Object.assign(entity, data, { updatedAt: new Date() });
      return entity;
    }
    return null;
  }
  
  find(options: FindOptions<T>): T[] {
    let results = this.data;
    
    if (options.where) {
      results = results.filter(item => {
        return Object.entries(options.where!).every(([key, value]) => 
          item[key as keyof T] === value
        );
      });
    }
    
    if (options.select) {
      results = results.map(item => {
        const selected = {} as T;
        options.select!.forEach(key => {
          (selected as any)[key] = item[key];
        });
        return selected;
      });
    }
    
    if (options.orderBy) {
      results.sort((a, b) => {
        const aVal = a[options.orderBy!];
        const bVal = b[options.orderBy!];
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      });
    }
    
    if (options.limit) {
      results = results.slice(0, options.limit);
    }
    
    return results;
  }
  
  findById(id: number): T | null {
    return this.data.find(item => item.id === id) || null;
  }
}

// Usage
const userORM = new TypeSafeORM<User>();
const postORM = new TypeSafeORM<Post>();

// Create users
const user = userORM.create({ name: "Kishan", email: "kishan@example.com", age: 25 });
const post = postORM.create({ title: "My Post", content: "Hello World", authorId: user.id });

// Find users with type safety
const users = userORM.find({
  where: { age: 25 },
  select: ["name", "email"],
  orderBy: "name",
  limit: 10
});

// Update user
const updatedUser = userORM.update(user.id, { name: "John" });
```

### Q24: How do you create a type-safe form validation system?

**Answer:**
```ts
// Form validation types
type ValidationRule<T> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
};

type FormSchema<T> = {
  [K in keyof T]: ValidationRule<T[K]>;
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

type FormState<T> = {
  values: T;
  errors: FormErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
};

// Type-safe form validation
class TypeSafeForm<T extends Record<string, any>> {
  private schema: FormSchema<T>;
  private state: FormState<T>;
  
  constructor(schema: FormSchema<T>, initialValues: T) {
    this.schema = schema;
    this.state = {
      values: initialValues,
      errors: {},
      touched: {},
      isValid: true
    };
  }
  
  validate<K extends keyof T>(field: K, value: T[K]): string | null {
    const rule = this.schema[field];
    if (!rule) return null;
    
    if (rule.required && (value === null || value === undefined || value === '')) {
      return `${String(field)} is required`;
    }
    
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return `${String(field)} must be at least ${rule.minLength} characters`;
      }
      
      if (rule.maxLength && value.length > rule.maxLength) {
        return `${String(field)} must be at most ${rule.maxLength} characters`;
      }
      
      if (rule.pattern && !rule.pattern.test(value)) {
        return `${String(field)} format is invalid`;
      }
    }
    
    if (rule.custom) {
      return rule.custom(value);
    }
    
    return null;
  }
  
  setValue<K extends keyof T>(field: K, value: T[K]): void {
    this.state.values[field] = value;
    this.state.touched[field] = true;
    
    const error = this.validate(field, value);
    if (error) {
      this.state.errors[field] = error;
      this.state.isValid = false;
    } else {
      delete this.state.errors[field];
      this.state.isValid = Object.keys(this.state.errors).length === 0;
    }
  }
  
  getValue<K extends keyof T>(field: K): T[K] {
    return this.state.values[field];
  }
  
  getError<K extends keyof T>(field: K): string | undefined {
    return this.state.errors[field];
  }
  
  isTouched<K extends keyof T>(field: K): boolean {
    return !!this.state.touched[field];
  }
  
  getState(): FormState<T> {
    return { ...this.state };
  }
}

// Usage
type UserForm = {
  name: string;
  email: string;
  age: number;
  password: string;
};

const userFormSchema: FormSchema<UserForm> = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value) => {
      if (value === 'admin@example.com') {
        return 'This email is not allowed';
      }
      return null;
    }
  },
  age: {
    required: true,
    custom: (value) => {
      if (value < 18) {
        return 'Must be at least 18 years old';
      }
      return null;
    }
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  }
};

const form = new TypeSafeForm(userFormSchema, {
  name: '',
  email: '',
  age: 0,
  password: ''
});

// Form usage
form.setValue('name', 'Kishan');
form.setValue('email', 'kishan@example.com');
form.setValue('age', 25);
form.setValue('password', 'Password123');

console.log(form.getState());
```

### Q25: How do you create a type-safe state management system?

**Answer:**
```ts
// State management types
type Action<T = any> = {
  type: string;
  payload?: T;
};

type Reducer<S, A extends Action> = (state: S, action: A) => S;

type Store<S> = {
  getState(): S;
  dispatch<A extends Action>(action: A): void;
  subscribe(listener: () => void): () => void;
};

// Type-safe state management
class TypeSafeStore<S> implements Store<S> {
  private state: S;
  private listeners: Set<() => void> = new Set();
  private reducers: Map<string, Reducer<S, Action>> = new Set();
  
  constructor(initialState: S) {
    this.state = initialState;
  }
  
  addReducer<A extends Action>(actionType: string, reducer: Reducer<S, A>): void {
    this.reducers.set(actionType, reducer as Reducer<S, Action>);
  }
  
  getState(): S {
    return this.state;
  }
  
  dispatch<A extends Action>(action: A): void {
    const reducer = this.reducers.get(action.type);
    if (reducer) {
      this.state = reducer(this.state, action);
      this.listeners.forEach(listener => listener());
    }
  }
  
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

// Usage
type UserState = {
  users: User[];
  loading: boolean;
  error: string | null;
};

type UserActions = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: { id: number; changes: Partial<User> } }
  | { type: 'DELETE_USER'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null };

const userStore = new TypeSafeStore<UserState>({
  users: [],
  loading: false,
  error: null
});

// Add reducers
userStore.addReducer('SET_LOADING', (state, action) => ({
  ...state,
  loading: action.payload
}));

userStore.addReducer('SET_USERS', (state, action) => ({
  ...state,
  users: action.payload,
  loading: false,
  error: null
}));

userStore.addReducer('ADD_USER', (state, action) => ({
  ...state,
  users: [...state.users, action.payload]
}));

userStore.addReducer('UPDATE_USER', (state, action) => ({
  ...state,
  users: state.users.map(user => 
    user.id === action.payload.id 
      ? { ...user, ...action.payload.changes }
      : user
  )
}));

userStore.addReducer('DELETE_USER', (state, action) => ({
  ...state,
  users: state.users.filter(user => user.id !== action.payload)
}));

userStore.addReducer('SET_ERROR', (state, action) => ({
  ...state,
  error: action.payload,
  loading: false
}));

// Usage
userStore.dispatch({ type: 'SET_LOADING', payload: true });
userStore.dispatch({ type: 'SET_USERS', payload: [{ id: 1, name: 'Kishan', email: 'kishan@example.com' }] });
userStore.dispatch({ type: 'ADD_USER', payload: { id: 2, name: 'John', email: 'john@example.com' } });

console.log(userStore.getState());
```

---

## 🔚 Summary

These questions cover the essential aspects of TypeScript type operators:

1. **`typeof`**: Type extraction from values and functions
2. **`keyof`**: Key extraction and type-safe property access
3. **`in`**: Mapped types and runtime property checks
4. **`instanceof`**: Runtime type checking with classes

### 🎯 Key Patterns:

- **Type extraction**: Using `typeof` to get types from values
- **Key manipulation**: Using `keyof` for type-safe property access
- **Type transformation**: Using `in` for mapped types
- **Runtime safety**: Using `instanceof` for type guards
- **Combined usage**: Leveraging all operators together for complex type systems

### 🔧 Best Practices:

1. Use `typeof` for extracting types from existing values
2. Use `keyof` for creating generic utilities that work with object properties
3. Use `in` for transforming types and checking property existence
4. Use `instanceof` for runtime type checking with classes
5. Combine operators for complex type manipulation and validation systems

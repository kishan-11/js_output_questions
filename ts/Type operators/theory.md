
# TypeScript: `typeof`, `keyof`, `in`, `instanceof`

These operators are essential tools for **type manipulation** and **type guards** in TypeScript. They help describe, inspect, or constrain types at **compile time** or **runtime**.

---

## 🔹 1. `typeof` (Type Query Operator)

### 🧠 Purpose:
Extract the **type of a variable** or **value**. This is a compile-time operator that creates a type from a value.

### ✅ Basic Usage:

```ts
let name = "Kishan";
type NameType = typeof name; // NameType is string

const age = 25;
type AgeType = typeof age; // AgeType is 25 (literal type)
```

### ✅ With functions:

```ts
function greet(user: string) {
  return \`Hello, \${user}\`;
}

type GreetFunction = typeof greet; // (user: string) => string

// Extract return type
type GreetReturn = ReturnType<typeof greet>; // string

// Extract parameter types
type GreetParams = Parameters<typeof greet>; // [string]
```

### ✅ With objects and classes:

```ts
const user = {
  id: 1,
  name: "Kishan",
  email: "kishan@example.com"
};

type UserType = typeof user;
// { id: number; name: string; email: string; }

class Car {
  brand: string;
  year: number;
  
  constructor(brand: string, year: number) {
    this.brand = brand;
    this.year = year;
  }
}

type CarType = typeof Car; // typeof Car (constructor type)
type CarInstance = InstanceType<typeof Car>; // Car
```

### ✅ Advanced patterns:

```ts
// Extract type from module
import { MyClass } from './module';
type MyClassType = typeof MyClass;

// Extract type from namespace
namespace Utils {
  export function formatDate(date: Date): string {
    return date.toISOString();
  }
}

type FormatDateFunction = typeof Utils.formatDate;

// Extract type from const assertion
const colors = ['red', 'green', 'blue'] as const;
type Colors = typeof colors; // readonly ["red", "green", "blue"]
type Color = typeof colors[number]; // "red" | "green" | "blue"
```

### 🔍 Use Cases:
- **Type extraction**: Reusing the type of an existing variable or function
- **Module type extraction**: Getting types from imported modules
- **Literal type extraction**: Working with const assertions
- **Generic type constraints**: Using with utility types like `ReturnType`, `Parameters`

---

## 🔹 2. `keyof` (Key Query Operator)

### 🧠 Purpose:
Get a union of all **property names (keys)** of a type as string literals. This is a compile-time operator that extracts all possible keys from a type.

### ✅ Basic Usage:

```ts
type User = { id: number; name: string; email: string };
type UserKeys = keyof User; // "id" | "name" | "email"

// With optional properties
type PartialUser = { id?: number; name?: string };
type PartialUserKeys = keyof PartialUser; // "id" | "name"
```

### ✅ With different types:

```ts
// With arrays
type ArrayKeys = keyof string[]; // number | "length" | "push" | "pop" | ...

// With functions
type FunctionKeys = keyof Function; // "prototype" | "length" | "name" | "call" | ...

// With primitives
type StringKeys = keyof string; // number | "charAt" | "indexOf" | "length" | ...

// With classes
class Person {
  name: string;
  age: number;
  greet(): string { return "Hello"; }
}
type PersonKeys = keyof Person; // "name" | "age" | "greet"
```

### ✅ Advanced patterns:

```ts
// Conditional key extraction
type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type User = { id: number; name: string; greet: () => void };
type UserDataKeys = NonFunctionKeys<User>; // "id" | "name"

// Required vs Optional keys
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

type User = { id: number; name?: string; email?: string };
type Required = RequiredKeys<User>; // "id"
type Optional = OptionalKeys<User>; // "name" | "email"
```

### ✅ Practical Examples:

```ts
// Type-safe property access
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Kishan", age: 25 };
const id = getValue(user, "id"); // number
const name = getValue(user, "name"); // string

// Type-safe property setting
function setValue<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

// Pick specific keys
type PickKeys<T, K extends keyof T> = Pick<T, K>;

type User = { id: number; name: string; email: string; password: string };
type PublicUser = PickKeys<User, "id" | "name" | "email">;
// { id: number; name: string; email: string; }

// Omit specific keys
type OmitKeys<T, K extends keyof T> = Omit<T, K>;
type UserWithoutPassword = OmitKeys<User, "password">;
// { id: number; name: string; email: string; }
```

### ✅ Real-world patterns:

```ts
// API response type safety
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

function createApiResponse<T>(data: T): ApiResponse<T> {
  return { data, status: 200, message: "Success" };
}

// Type-safe object manipulation
function updateObject<T extends Record<string, any>>(
  obj: T,
  updates: Partial<Pick<T, keyof T>>
): T {
  return { ...obj, ...updates };
}

// Event handler type safety
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type User = { name: string; age: number };
type UserEventHandlers = EventHandlers<User>;
// { onName: (value: string) => void; onAge: (value: number) => void; }
```

### 🔍 Use Cases:
- **Type-safe property access**: Ensuring keys exist on objects
- **Generic utilities**: Creating reusable type-safe functions
- **Mapped types**: Transforming object types
- **API type safety**: Ensuring correct property access in API responses
- **Event handling**: Type-safe event handler creation

---

## 🔹 3. `in` (Mapped Types & Object Checks)

### 🧠 Purpose:
Used in **two contexts**:
1. **Mapped types** – iterate over keys of a type (compile-time)
2. **Runtime operator** – check if property exists in an object

---

### ✅ Mapped Type Usage (Compile-time):

```ts
// Basic mapped type
type User = { id: number; name: string };
type ReadOnlyUser = {
  readonly [K in keyof User]: User[K];
};
// { readonly id: number; readonly name: string; }

// Make all properties optional
type PartialUser = {
  [K in keyof User]?: User[K];
};
// { id?: number; name?: string; }

// Make all properties required
type RequiredUser = {
  [K in keyof User]-?: User[K];
};
// { id: number; name: string; }
```

### ✅ Advanced Mapped Types:

```ts
// Transform property types
type Stringify<T> = {
  [K in keyof T]: string;
};

type User = { id: number; name: string; age: number };
type StringifiedUser = Stringify<User>;
// { id: string; name: string; age: string; }

// Filter properties by type
type StringProperties<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type User = { id: number; name: string; email: string; age: number };
type UserStrings = StringProperties<User>;
// { name: string; email: string; }

// Create getter/setter pairs
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type User = { name: string; age: number };
type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; }

type UserSetters = Setters<User>;
// { setName: (value: string) => void; setAge: (value: number) => void; }
```

### ✅ Conditional Mapped Types:

```ts
// Pick properties by value type
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

type User = { id: number; name: string; email: string; age: number };
type UserNumbers = PickByType<User, number>;
// { id: number; age: number; }

// Omit properties by value type
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

type UserStrings = OmitByType<User, number>;
// { name: string; email: string; }

// Create API endpoints from object keys
type ApiEndpoints<T> = {
  [K in keyof T as `/${string & K}`]: {
    get: () => Promise<T[K]>;
    post: (data: T[K]) => Promise<void>;
  };
};

type User = { profile: any; settings: any };
type UserApi = ApiEndpoints<User>;
// { "/profile": { get: () => Promise<any>; post: (data: any) => Promise<void>; }; ... }
```

### ✅ Runtime Usage (Object Property Checks):

```ts
const user = { id: 1, name: "Kishan", age: 25 };

// Basic property existence check
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

if (hasProperty(user, "email")) {
  // user.email is now available
  console.log(user.email);
}

// Check multiple properties
function hasAllProperties<T, K extends keyof T>(
  obj: any,
  keys: K[]
): obj is T {
  return keys.every(key => key in obj);
}

const userData = { id: 1, name: "Kishan" };
if (hasAllProperties<User, "id" | "name">(userData, ["id", "name"])) {
  // userData is now typed as User
  console.log(userData.id, userData.name);
}
```

### ✅ Advanced Runtime Patterns:

```ts
// Dynamic property access with type safety
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  if (key in obj) {
    return obj[key];
  }
  throw new Error(`Property ${String(key)} does not exist`);
}

// Object validation
function validateObject<T>(
  obj: any,
  requiredKeys: (keyof T)[]
): obj is T {
  return requiredKeys.every(key => key in obj);
}

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

// Property existence with default values
function getPropertyOrDefault<T, K extends keyof T>(
  obj: T,
  key: K,
  defaultValue: T[K]
): T[K] {
  return key in obj ? obj[key] : defaultValue;
}

const user = { name: "Kishan" };
const age = getPropertyOrDefault(user, "age" as keyof typeof user, 0);
```

### 🔍 Use Cases:
- **Mapped types**: Creating new types by transforming existing ones
- **Type transformations**: Making properties readonly, optional, or required
- **Property filtering**: Selecting properties based on their types
- **API generation**: Creating type-safe API endpoints
- **Runtime checks**: Validating object structure and property existence
- **Type guards**: Ensuring type safety at runtime

---

## 🔹 4. `instanceof` (Type Guard at Runtime)

### 🧠 Purpose:
Used to check if a value is an **instance of a class or constructor**. This is a runtime operator that performs prototype chain checking.

### ✅ Basic Usage:

```ts
class Car {
  brand: string;
  year: number;
  
  constructor(brand: string, year: number) {
    this.brand = brand;
    this.year = year;
  }
  
  drive() {
    console.log("Driving...");
  }
}

const vehicle = new Car("Toyota", 2020);

if (vehicle instanceof Car) {
  vehicle.drive(); // ✅ Safe to call
  console.log(vehicle.brand); // ✅ Safe to access
}
```

### ✅ With inheritance:

```ts
class Vehicle {
  wheels: number;
  
  constructor(wheels: number) {
    this.wheels = wheels;
  }
}

class Car extends Vehicle {
  brand: string;
  
  constructor(brand: string, wheels: number = 4) {
    super(wheels);
    this.brand = brand;
  }
}

class Motorcycle extends Vehicle {
  engineSize: number;
  
  constructor(engineSize: number) {
    super(2);
    this.engineSize = engineSize;
  }
}

function processVehicle(vehicle: Vehicle) {
  if (vehicle instanceof Car) {
    // TypeScript knows this is a Car
    console.log(`Car brand: ${vehicle.brand}`);
  } else if (vehicle instanceof Motorcycle) {
    // TypeScript knows this is a Motorcycle
    console.log(`Motorcycle engine: ${vehicle.engineSize}cc`);
  }
}
```

### ✅ Advanced patterns:

```ts
// Generic type guard
function isInstanceOf<T>(
  obj: any,
  constructor: new (...args: any[]) => T
): obj is T {
  return obj instanceof constructor;
}

// Usage
const vehicle = new Car("Honda", 2021);
if (isInstanceOf(vehicle, Car)) {
  // vehicle is typed as Car
  console.log(vehicle.brand);
}

// Multiple type checking
function getVehicleType(vehicle: Vehicle): string {
  if (vehicle instanceof Car) {
    return "Car";
  } else if (vehicle instanceof Motorcycle) {
    return "Motorcycle";
  }
  return "Unknown";
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

### ✅ Error handling with instanceof:

```ts
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

function handleError(error: unknown) {
  if (error instanceof ValidationError) {
    console.log(`Validation error in field: ${error.field}`);
    console.log(`Code: ${error.code}`);
  } else if (error instanceof CustomError) {
    console.log(`Custom error: ${error.message}`);
    console.log(`Code: ${error.code}`);
  } else if (error instanceof Error) {
    console.log(`Generic error: ${error.message}`);
  } else {
    console.log("Unknown error");
  }
}

// Usage
try {
  throw new ValidationError("email", "Invalid email format");
} catch (error) {
  handleError(error);
}
```

### ✅ Built-in types with instanceof:

```ts
// Array checking
function processArray(data: unknown) {
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
```

### ✅ Custom instanceof behavior:

```ts
// Symbol.hasInstance for custom instanceof behavior
class MyClass {
  static [Symbol.hasInstance](instance: any): boolean {
    return instance && typeof instance === 'object' && instance.isMyClass;
  }
}

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

function makeItFly(flyable: unknown) {
  if (flyable instanceof Bird || flyable instanceof Airplane) {
    flyable.fly();
  }
}
```

### 🔍 Use Cases:
- **Type narrowing**: Narrowing union types to specific classes
- **Error handling**: Distinguishing between different error types
- **Polymorphism**: Working with inheritance hierarchies
- **Runtime type checking**: Ensuring objects are instances of expected classes
- **Factory patterns**: Creating objects and verifying their types
- **API responses**: Validating response objects are of expected types

---

## 🔚 Summary

| Operator      | Purpose                            | Context        | Example                                |
|---------------|-------------------------------------|----------------|----------------------------------------|
| `typeof`      | Get type of a variable or function  | Compile-time   | `typeof name` → `string`               |
| `keyof`       | Get property names as string union  | Compile-time   | `keyof User` → `"id" | "name"`         |
| `in`          | Iterate keys / check property exist | Both           | `[K in keyof T]` or `"id" in obj`      |
| `instanceof`  | Class-based type check              | Runtime        | `obj instanceof SomeClass`             |

### 🎯 Key Takeaways:

1. **`typeof`** is primarily for **type extraction** and works with **values**
2. **`keyof`** is for **key extraction** and works with **types**
3. **`in`** has **dual purpose**: mapped types (compile-time) and property checks (runtime)
4. **`instanceof`** is for **runtime type checking** with classes and constructors

### 🔧 When to Use Each:

- **`typeof`**: When you need to extract types from existing values or functions
- **`keyof`**: When creating generic utilities that work with object properties
- **`in`**: When transforming types or checking property existence
- **`instanceof`**: When working with class hierarchies and runtime type checking

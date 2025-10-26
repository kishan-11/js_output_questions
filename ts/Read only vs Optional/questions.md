# TypeScript: Read Only vs Optional - Questions & Answers

## 🔸 Basic Concepts

### Q1: What is the difference between optional properties (`?`) and readonly properties (`readonly`) in TypeScript?

**Answer:**
- **Optional properties (`?`)**: Mark a property as optional, meaning it may or may not be present in an object. The property can be `undefined` or absent entirely.
- **Readonly properties (`readonly`)**: Prevent a property from being reassigned after initialization. The property must be present but cannot be modified once set.

```ts
interface Example {
  readonly id: number;    // Must be present, cannot be changed
  name?: string;         // May be absent or undefined
}
```

### Q2: How do you create an interface with both optional and readonly properties?

**Answer:**
You can combine both modifiers on the same property:

```ts
interface Config {
  readonly appName?: string;  // Optional AND readonly
  readonly version?: number;  // Optional AND readonly
  readonly id: number;        // Required AND readonly
  name?: string;             // Optional only
}

const config: Config = { id: 1 }; // ✅ Valid
// config.id = 2; // ❌ Error: Cannot assign to 'id'
// config.appName = "MyApp"; // ❌ Error: Cannot assign to 'appName'
```

### Q3: What happens when you try to modify a readonly property after initialization?

**Answer:**
TypeScript will throw a compile-time error:

```ts
interface User {
  readonly id: number;
  name: string;
}

const user: User = { id: 1, name: "John" };
user.name = "Jane";  // ✅ Allowed
user.id = 2;         // ❌ Error: Cannot assign to 'id' because it is a read-only property
```

## 🔸 Optional Properties Deep Dive

### Q4: How do optional properties affect type checking and what type do they include?

**Answer:**
Optional properties automatically include `undefined` in their type union:

```ts
interface User {
  id: number;
  name?: string;  // Type is: string | undefined
}

function processUser(user: User) {
  // user.name could be undefined, so we need to check
  if (user.name !== undefined) {
    console.log(user.name.toUpperCase()); // ✅ Safe
  }
  
  // Or use optional chaining
  console.log(user.name?.toUpperCase()); // ✅ Safe
}
```

### Q5: What are the common use cases for optional properties?

**Answer:**
- **Form data**: Not all fields may be filled
- **Partial updates**: Only update changed fields
- **Configuration objects**: Optional settings with defaults
- **API responses**: Some fields may not always be present

```ts
// Form data example
interface UserForm {
  firstName: string;
  lastName: string;
  middleName?: string;  // Optional
  email?: string;       // Optional
}

// Partial update example
interface UserUpdate {
  id: number;
  name?: string;        // Optional - only update if provided
  email?: string;       // Optional - only update if provided
}
```

### Q6: How do you handle optional properties in functions?

**Answer:**
You need to check for undefined before using optional properties:

```ts
interface Product {
  id: number;
  name: string;
  description?: string;
  price?: number;
}

function displayProduct(product: Product) {
  console.log(`Name: ${product.name}`);
  
  // Check if optional properties exist
  if (product.description) {
    console.log(`Description: ${product.description}`);
  }
  
  // Use optional chaining
  console.log(`Price: ${product.price?.toFixed(2) || 'Not specified'}`);
}
```

## 🔸 Readonly Properties Deep Dive

### Q7: How do readonly properties work in classes?

**Answer:**
Readonly properties in classes can only be assigned during initialization (in the constructor):

```ts
class Point {
  readonly x: number;
  readonly y: number;
  
  constructor(x: number, y: number) {
    this.x = x;  // ✅ Allowed during initialization
    this.y = y;  // ✅ Allowed during initialization
  }
  
  move(newX: number, newY: number) {
    // this.x = newX;  // ❌ Error: Cannot assign to 'x'
    // this.y = newY;  // ❌ Error: Cannot assign to 'y'
  }
}

const point = new Point(10, 20);
// point.x = 30;  // ❌ Error: Cannot assign to 'x'
```

### Q8: What's the difference between `readonly` and `const` in TypeScript?

**Answer:**
- **`const`**: Creates an immutable binding for the entire variable
- **`readonly`**: Makes object properties immutable, but the object itself can be reassigned

```ts
// const example
const numbers = [1, 2, 3];
// numbers = [4, 5, 6];  // ❌ Error: Cannot assign to 'numbers'

// readonly example
interface ReadonlyArray {
  readonly items: number[];
}

const arr: ReadonlyArray = { items: [1, 2, 3] };
// arr.items = [4, 5, 6];  // ❌ Error: Cannot assign to 'items'
arr.items.push(4);  // ✅ Allowed - modifying the array content
```

### Q9: How do you create a readonly array or readonly object?

**Answer:**
Use the `readonly` modifier or utility types:

```ts
// Readonly array
interface Data {
  readonly items: readonly number[];
}

// Or using utility types
type ReadonlyData = {
  readonly items: ReadonlyArray<number>;
}

// Readonly object properties
interface ImmutableUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}
```

## 🔸 Utility Types

### Q10: How do you use the `Readonly<T>` utility type?

**Answer:**
`Readonly<T>` makes all properties of a type readonly:

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type ImmutableUser = Readonly<User>;
// Equivalent to:
// {
//   readonly id: number;
//   readonly name: string;
//   readonly email: string;
// }

const user: ImmutableUser = { id: 1, name: "John", email: "john@example.com" };
// user.name = "Jane";  // ❌ Error: Cannot assign to 'name'
```

### Q11: How do you use the `Partial<T>` utility type?

**Answer:**
`Partial<T>` makes all properties of a type optional:

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// Equivalent to:
// {
//   id?: number;
//   name?: string;
//   email?: string;
// }

const userUpdate: PartialUser = { name: "Jane" };  // ✅ Valid
const userCreate: PartialUser = { id: 1 };         // ✅ Valid
```

### Q12: How do you combine `Readonly<T>` and `Partial<T>`?

**Answer:**
You can combine utility types to create more specific types:

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

// All properties optional and readonly
type OptionalReadonlyUser = Readonly<Partial<User>>;
// Equivalent to:
// {
//   readonly id?: number;
//   readonly name?: string;
//   readonly email?: string;
// }

const config: OptionalReadonlyUser = { name: "Config" };
// config.name = "New Config";  // ❌ Error: Cannot assign to 'name'
```

## 🔸 Advanced Scenarios

### Q13: How do you create a type that makes some properties readonly and others optional?

**Answer:**
You can use mapped types to create custom utility types:

```ts
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// Make specific properties readonly
type ReadonlyId<T> = {
  readonly [K in keyof T]: K extends 'id' ? T[K] : T[K];
};

// Make specific properties optional
type OptionalEmail<T> = {
  [K in keyof T]: K extends 'email' ? T[K] | undefined : T[K];
};

type CustomUser = ReadonlyId<OptionalEmail<User>>;
// {
//   readonly id: number;
//   name: string;
//   email: string | undefined;
//   createdAt: Date;
// }
```

### Q14: How do you handle readonly properties in function parameters?

**Answer:**
Readonly properties in function parameters prevent accidental mutations:

```ts
interface Point {
  readonly x: number;
  readonly y: number;
}

function calculateDistance(p1: Point, p2: Point): number {
  // p1.x = 0;  // ❌ Error: Cannot assign to 'x'
  // p2.y = 0;   // ❌ Error: Cannot assign to 'y'
  
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
```

### Q15: How do you create a type that allows partial updates but prevents certain fields from being changed?

**Answer:**
Combine `Partial<T>` with `Omit<T, K>` and `Pick<T, K>`:

```ts
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// Allow partial updates but exclude readonly fields
type UserUpdate = Partial<Omit<User, 'id' | 'createdAt'>> & Pick<User, 'id'>;

const update: UserUpdate = {
  id: 1,           // Required
  name: "New Name", // Optional
  email: "new@example.com" // Optional
  // createdAt: new Date()  // ❌ Error: Not allowed
};
```

## 🔸 Practical Examples

### Q16: How would you implement a configuration object with optional and readonly properties?

**Answer:**
```ts
interface AppConfig {
  readonly appName: string;
  readonly version: string;
  readonly environment: 'development' | 'production';
  readonly apiUrl?: string;
  readonly debug?: boolean;
  readonly maxRetries?: number;
}

class ConfigManager {
  private config: AppConfig;
  
  constructor(config: AppConfig) {
    this.config = config;
  }
  
  getConfig(): Readonly<AppConfig> {
    return this.config; // Return readonly version
  }
  
  // Cannot modify readonly properties
  // updateAppName(name: string) {
  //   this.config.appName = name; // ❌ Error
  // }
}

const config: AppConfig = {
  appName: "MyApp",
  version: "1.0.0",
  environment: "production",
  apiUrl: "https://api.example.com",
  debug: false
};
```

### Q17: How do you handle optional properties in API response types?

**Answer:**
```ts
interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly timestamp: number;
}

interface UserData {
  id: number;
  name: string;
  email?: string;
}

function handleApiResponse(response: ApiResponse<UserData>) {
  if (response.success && response.data) {
    console.log(`User: ${response.data.name}`);
    if (response.data.email) {
      console.log(`Email: ${response.data.email}`);
    }
  } else if (response.error) {
    console.error(`Error: ${response.error}`);
  }
}
```

### Q18: How do you create a type-safe form validation system using optional and readonly properties?

**Answer:**
```ts
interface FormField<T> {
  readonly name: string;
  readonly required: boolean;
  value?: T;
  readonly error?: string;
}

interface UserForm {
  readonly name: FormField<string>;
  readonly email: FormField<string>;
  readonly age: FormField<number>;
  readonly bio: FormField<string>;
}

function validateForm(form: UserForm): boolean {
  const fields = [form.name, form.email, form.age, form.bio];
  
  return fields.every(field => {
    if (field.required && !field.value) {
      return false;
    }
    return !field.error;
  });
}

const userForm: UserForm = {
  name: { name: "name", required: true, value: "John" },
  email: { name: "email", required: true, value: "john@example.com" },
  age: { name: "age", required: false, value: 25 },
  bio: { name: "bio", required: false }
};
```

## 🔸 Common Pitfalls

### Q19: What are common mistakes when working with optional and readonly properties?

**Answer:**
1. **Forgetting to check for undefined with optional properties**:
```ts
interface User {
  name?: string;
}

function greet(user: User) {
  console.log(user.name.toUpperCase()); // ❌ Error if name is undefined
  console.log(user.name?.toUpperCase()); // ✅ Safe
}
```

2. **Trying to modify readonly properties**:
```ts
interface Config {
  readonly apiUrl: string;
}

const config: Config = { apiUrl: "https://api.example.com" };
// config.apiUrl = "https://new-api.com"; // ❌ Error
```

3. **Confusing optional with nullable**:
```ts
interface User {
  name?: string;        // Optional (may be absent)
  email: string | null; // Required but can be null
}
```

### Q20: How do you create a type that represents a database entity with some fields that can be updated and others that cannot?

**Answer:**
```ts
interface DatabaseUser {
  readonly id: number;           // Never changes
  readonly createdAt: Date;     // Never changes
  readonly updatedAt: Date;     // Never changes
  name: string;                 // Can be updated
  email: string;                // Can be updated
  isActive?: boolean;           // Optional, can be updated
}

// Type for updates (exclude readonly fields)
type UserUpdate = Partial<Omit<DatabaseUser, 'id' | 'createdAt' | 'updatedAt'>>;

function updateUser(id: number, updates: UserUpdate): DatabaseUser {
  // Implementation would merge updates with existing user
  // while preserving readonly fields
  return {
    id,                    // Preserved
    createdAt: new Date(), // Preserved
    updatedAt: new Date(), // Updated
    ...updates             // Applied updates
  };
}
```

## 🔸 Advanced Utility Types

### Q21: How do you create a utility type that makes specific properties readonly?

**Answer:**
```ts
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Make specific properties readonly
type ReadonlyFields<T, K extends keyof T> = {
  readonly [P in K]: T[P];
} & {
  [P in Exclude<keyof T, K>]: T[P];
};

type UserWithReadonlyId = ReadonlyFields<User, 'id'>;
// {
//   readonly id: number;
//   name: string;
//   email: string;
//   password: string;
// }
```

### Q22: How do you create a utility type that makes specific properties optional?

**Answer:**
```ts
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Make specific properties optional
type OptionalFields<T, K extends keyof T> = {
  [P in K]?: T[P];
} & {
  [P in Exclude<keyof T, K>]: T[P];
};

type UserWithOptionalEmail = OptionalFields<User, 'email'>;
// {
//   id: number;
//   name: string;
//   email?: string;
//   password: string;
// }
```

### Q23: How do you create a utility type that combines readonly and optional for specific fields?

**Answer:**
```ts
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Make specific properties readonly and optional
type ReadonlyOptionalFields<T, K extends keyof T> = {
  readonly [P in K]?: T[P];
} & {
  [P in Exclude<keyof T, K>]: T[P];
};

type UserWithReadonlyOptionalId = ReadonlyOptionalFields<User, 'id'>;
// {
//   readonly id?: number;
//   name: string;
//   email: string;
//   password: string;
//   createdAt: Date;
// }
```

## 🔸 Real-World Scenarios

### Q24: How do you handle optional properties in React component props?

**Answer:**
```ts
interface ButtonProps {
  readonly children: React.ReactNode;
  readonly onClick?: () => void;
  readonly disabled?: boolean;
  readonly variant?: 'primary' | 'secondary';
  readonly size?: 'small' | 'medium' | 'large';
}

function Button({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  size = 'medium' 
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size}`}
    >
      {children}
    </button>
  );
}

// Usage
<Button onClick={() => console.log('clicked')}>Click me</Button>
<Button disabled={true} variant="secondary">Disabled</Button>
```

### Q25: How do you create a type-safe state management system with readonly and optional properties?

**Answer:**
```ts
interface AppState {
  readonly user?: {
    readonly id: number;
    readonly name: string;
    readonly email: string;
  };
  readonly loading: boolean;
  readonly error?: string;
  readonly theme: 'light' | 'dark';
}

class StateManager {
  private state: AppState;
  
  constructor(initialState: AppState) {
    this.state = initialState;
  }
  
  getState(): Readonly<AppState> {
    return this.state;
  }
  
  updateUser(user: AppState['user']) {
    this.state = {
      ...this.state,
      user: user ? { ...user } : undefined
    };
  }
  
  setError(error: string) {
    this.state = {
      ...this.state,
      error
    };
  }
  
  clearError() {
    this.state = {
      ...this.state,
      error: undefined
    };
  }
}
```

### Q26: How do you handle optional properties in database queries and updates?

**Answer:**
```ts
interface DatabaseUser {
  readonly id: number;
  readonly createdAt: Date;
  name: string;
  email: string;
  age?: number;
  bio?: string;
}

// Type for creating a new user
type CreateUser = Omit<DatabaseUser, 'id' | 'createdAt'>;

// Type for updating a user (exclude readonly fields)
type UpdateUser = Partial<Omit<DatabaseUser, 'id' | 'createdAt'>>;

class UserRepository {
  async createUser(userData: CreateUser): Promise<DatabaseUser> {
    // Implementation
    return {
      id: Math.random(),
      createdAt: new Date(),
      ...userData
    };
  }
  
  async updateUser(id: number, updates: UpdateUser): Promise<DatabaseUser> {
    // Implementation
    const existingUser = await this.findById(id);
    return {
      ...existingUser,
      ...updates
    };
  }
  
  async findById(id: number): Promise<DatabaseUser> {
    // Implementation
    return {
      id,
      createdAt: new Date(),
      name: 'John',
      email: 'john@example.com'
    };
  }
}
```

This comprehensive set of questions covers all the key concepts from the theory file, including practical examples, common pitfalls, and advanced scenarios for working with optional and readonly properties in TypeScript.

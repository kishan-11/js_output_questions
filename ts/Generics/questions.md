# Interview Questions: TypeScript Generics

## Questions and Detailed Answers

### 1. How do you design a generic API that preserves relationships between inputs and outputs?

**Answer:**

The key is to use generic type parameters that maintain the connection between input and output types. Here are several patterns:

#### Pattern 1: Direct Type Preservation
```ts
// Simple identity function that preserves exact input type
function identity<T>(value: T): T {
    return value;
}

const result = identity("hello"); // Type: string
const number = identity(42); // Type: number
```

#### Pattern 2: Transformation with Type Relationship
```ts
// Map function that preserves the relationship between input and output
function map<T, U>(array: T[], transform: (item: T) => U): U[] {
    return array.map(transform);
}

const numbers = [1, 2, 3];
const strings = map(numbers, n => n.toString()); // string[]
const doubled = map(numbers, n => n * 2); // number[]
```

#### Pattern 3: API Response Wrapper
```ts
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

async function fetchData<T>(
    url: string,
    parser: (rawData: unknown) => T
): Promise<ApiResponse<T>> {
    const response = await fetch(url);
    const rawData = await response.json();
    return {
        data: parser(rawData),
        status: response.status,
        message: response.statusText
    };
}

// Usage preserves the parsed type
const userData = await fetchData('/api/user', (data) => ({
    id: data.id,
    name: data.name,
    email: data.email
}));
// userData.data is properly typed as { id: any, name: any, email: any }
```

#### Pattern 4: Builder Pattern
```ts
class QueryBuilder<T> {
    private conditions: string[] = [];
    
    where<K extends keyof T>(field: K, value: T[K]): QueryBuilder<T> {
        this.conditions.push(`${String(field)} = ${value}`);
        return this;
    }
    
    build(): string {
        return `SELECT * FROM table WHERE ${this.conditions.join(' AND ')}`;
    }
}

interface User {
    id: number;
    name: string;
    email: string;
}

const query = new QueryBuilder<User>()
    .where('id', 123)
    .where('name', 'John')
    .build();
```

### 2. When do you add constraints (`extends`) and default type parameters?

**Answer:**

#### When to Use Constraints (`extends`)

**Use constraints when you need to:**
- Access specific properties or methods on the generic type
- Ensure type safety while working with the generic value
- Create relationships between generic types

```ts
// ✅ Good - Need to access length property
function logLength<T extends { length: number }>(item: T): T {
    console.log(item.length);
    return item;
}

// ✅ Good - Working with object properties
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

// ✅ Good - Ensuring the type has specific methods
function processArray<T extends Array<any>>(arr: T): T {
    return arr.filter(Boolean) as T;
}
```

**Don't use constraints when:**
- The constraint is too restrictive
- You're losing flexibility unnecessarily
- The constraint doesn't add value

```ts
// ❌ Bad - Too restrictive, limits usage
function process<T extends string>(value: T): T {
    return value;
}

// ✅ Better - More flexible
function process<T>(value: T): T {
    return value;
}
```

#### When to Use Default Type Parameters

**Use defaults for:**
- Improving API ergonomics
- Providing sensible fallbacks
- Making optional type parameters

```ts
// ✅ Good - Default makes the API easier to use
interface ApiResponse<TData = unknown> {
    data: TData;
    status: number;
}

// Can be used without explicit typing
const response: ApiResponse = { data: null, status: 404 };
// Or with explicit typing
const userResponse: ApiResponse<User> = { data: user, status: 200 };

// ✅ Good - Optional generic with default
class Repository<T = any> {
    private items: T[] = [];
    
    add(item: T): void {
        this.items.push(item);
    }
}
```

### 3. Show how to type a `mapObject` utility preserving value types.

**Answer:**

Here's a comprehensive `mapObject` utility that preserves value types:

```ts
// Basic mapObject utility
function mapObject<T, U>(
    obj: Record<string, T>,
    mapper: (value: T, key: string) => U
): Record<string, U> {
    const result: Record<string, U> = {};
    for (const key in obj) {
        result[key] = mapper(obj[key], key);
    }
    return result;
}

// Usage examples
const numbers = { a: 1, b: 2, c: 3 };
const strings = mapObject(numbers, (value, key) => `${key}: ${value}`);
// Result: { a: "a: 1", b: "b: 2", c: "c: 3" }

const users = { 
    user1: { name: "John", age: 30 }, 
    user2: { name: "Jane", age: 25 } 
};
const names = mapObject(users, (user, key) => user.name);
// Result: { user1: "John", user2: "Jane" }
```

#### Advanced Version with Key Preservation
```ts
// More sophisticated version that preserves key types
function mapObject<T, U, K extends string>(
    obj: Record<K, T>,
    mapper: (value: T, key: K) => U
): Record<K, U> {
    const result = {} as Record<K, U>;
    for (const key in obj) {
        result[key] = mapper(obj[key], key);
    }
    return result;
}

// Usage with key preservation
const config = { 
    apiUrl: "https://api.example.com", 
    timeout: 5000 
} as const;

const configValues = mapObject(config, (value, key) => {
    // key is typed as "apiUrl" | "timeout"
    return `${key}: ${value}`;
});
// Result: { apiUrl: "apiUrl: https://api.example.com", timeout: "timeout: 5000" }
```

#### Version with Partial Mapping
```ts
// MapObject that can skip certain keys
function mapObjectSelective<T, U>(
    obj: Record<string, T>,
    mapper: (value: T, key: string) => U | undefined
): Record<string, U> {
    const result: Record<string, U> = {};
    for (const key in obj) {
        const mapped = mapper(obj[key], key);
        if (mapped !== undefined) {
            result[key] = mapped;
        }
    }
    return result;
}

// Usage
const data = { a: 1, b: 2, c: 3, d: 4 };
const evenOnly = mapObjectSelective(data, (value, key) => 
    value % 2 === 0 ? value * 2 : undefined
);
// Result: { b: 4, d: 8 }
```

### 4. How to avoid over-constraining generics and harming inference?

**Answer:**

#### Common Over-constraining Mistakes

**❌ Too Restrictive Constraints:**
```ts
// Bad - unnecessarily restrictive
function process<T extends string>(value: T): T {
    return value;
}

// Good - more flexible
function process<T>(value: T): T {
    return value;
}
```

**❌ Over-constraining with Multiple Requirements:**
```ts
// Bad - too many constraints
function process<T extends string & { length: number } & { toUpperCase(): string }>(value: T): T {
    return value;
}

// Good - only constrain what you actually need
function process<T extends string>(value: T): T {
    return value.toUpperCase() as T;
}
```

#### Best Practices for Constraints

**1. Start Broad, Add Constraints Only When Needed:**
```ts
// Start with no constraints
function identity<T>(value: T): T {
    return value;
}

// Add constraints only when you need specific properties
function getLength<T extends { length: number }>(value: T): number {
    return value.length;
}
```

**2. Use Union Types Instead of Over-constraining:**
```ts
// ❌ Bad - over-constrained
function process<T extends string | number>(value: T): T {
    return value;
}

// ✅ Good - let the type system work
function process<T>(value: T): T {
    return value;
}
```

**3. Preserve Inference with Proper Generic Order:**
```ts
// ✅ Good - inference works well
function map<T, U>(array: T[], fn: (item: T) => U): U[] {
    return array.map(fn);
}

// ❌ Bad - generic order can hurt inference
function badMap<U, T>(array: T[], fn: (item: T) => U): U[] {
    return array.map(fn);
}
```

**4. Use Conditional Types Instead of Over-constraining:**
```ts
// ✅ Good - conditional type preserves flexibility
type ApiResponse<T> = T extends string 
    ? { message: T } 
    : { data: T };

// ❌ Bad - over-constrained
type BadApiResponse<T extends string> = { message: T };
```

**5. Let TypeScript Infer When Possible:**
```ts
// ❌ Bad - unnecessary explicit typing
const result = identity<string>("hello");

// ✅ Good - let TypeScript infer
const result = identity("hello"); // TypeScript infers string
```

### 5. Differences between generic interfaces, type aliases, and classes.

**Answer:**

#### Generic Interfaces

**Characteristics:**
- Can be extended and implemented
- Support declaration merging
- Can have default type parameters
- Best for object shapes and contracts

```ts
interface Repository<T> {
    findById(id: string): T | undefined;
    save(item: T): void;
    delete(id: string): boolean;
}

// Can be extended
interface UserRepository extends Repository<User> {
    findByEmail(email: string): User | undefined;
}

// Can be implemented
class InMemoryUserRepository implements UserRepository {
    private users: User[] = [];
    
    findById(id: string): User | undefined {
        return this.users.find(u => u.id === id);
    }
    
    save(user: User): void {
        this.users.push(user);
    }
    
    delete(id: string): boolean {
        const index = this.users.findIndex(u => u.id === id);
        if (index > -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }
    
    findByEmail(email: string): User | undefined {
        return this.users.find(u => u.email === email);
    }
}
```

#### Generic Type Aliases

**Characteristics:**
- Cannot be extended or implemented
- More flexible for complex type operations
- Better for utility types and transformations
- Can use conditional types and mapped types

```ts
// Utility type using generics
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Conditional type with generics
type ApiResponse<T> = T extends string 
    ? { message: T } 
    : { data: T };

// Mapped type with generics
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

// Usage
interface User {
    id: number;
    name: string;
    email: string;
}

type PartialUser = Optional<User, 'email'>;
// Result: { id: number; name: string; email?: string }
```

#### Generic Classes

**Characteristics:**
- Can be instantiated with type parameters
- Support inheritance with generics
- Can have static and instance methods
- Best for creating reusable components

```ts
class Box<T> {
    private contents: T;
    
    constructor(value: T) {
        this.contents = value;
    }
    
    getValue(): T {
        return this.contents;
    }
    
    setValue(value: T): void {
        this.contents = value;
    }
    
    // Static method with different generic
    static create<U>(value: U): Box<U> {
        return new Box(value);
    }
}

// Inheritance with generics
class NumberBox extends Box<number> {
    double(): number {
        return this.getValue() * 2;
    }
}

// Usage
const stringBox = new Box("hello");
const numberBox = new NumberBox(42);
const createdBox = Box.create(true); // Box<boolean>
```

#### Comparison Table

| Feature | Interface | Type Alias | Class |
|---------|-----------|------------|-------|
| Extendable | ✅ | ❌ | ✅ |
| Implementable | ✅ | ❌ | ❌ |
| Instantiable | ❌ | ❌ | ✅ |
| Declaration Merging | ✅ | ❌ | ❌ |
| Conditional Types | ✅ | ✅ | ❌ |
| Mapped Types | ✅ | ✅ | ❌ |
| Static Methods | ❌ | ❌ | ✅ |
| Default Parameters | ✅ | ✅ | ✅ |

#### When to Use Each

**Use Generic Interfaces for:**
- API contracts and object shapes
- When you need to extend or implement
- Public APIs and library interfaces

**Use Generic Type Aliases for:**
- Complex type transformations
- Utility types
- Conditional and mapped types
- Type computations

**Use Generic Classes for:**
- Reusable components
- State management
- Data structures
- When you need instantiation and inheritance


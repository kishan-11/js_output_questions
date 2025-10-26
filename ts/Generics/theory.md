# TypeScript Generics

## What are Generics?

Generics allow you to create reusable components that work with multiple types while maintaining type safety. They enable you to write code that is both flexible and type-safe by parameterizing types.

## Key Concepts

### 1. Basic Generic Syntax
```ts
// Generic function
function identity<T>(arg: T): T {
    return arg;
}

// Generic interface
interface Container<T> {
    value: T;
}

// Generic class
class Box<T> {
    private contents: T;
    constructor(value: T) {
        this.contents = value;
    }
    getValue(): T {
        return this.contents;
    }
}
```

### 2. Type Constraints (`extends`)
```ts
// Constraint to ensure T has a length property
function logLength<T extends { length: number }>(arg: T): T {
    console.log(arg.length);
    return arg;
}

// Multiple constraints
function process<T extends string | number>(value: T): T {
    return value;
}

// Keyof constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}
```

### 3. Default Type Parameters
```ts
interface ApiResponse<TData = unknown> {
    data: TData;
    ok: boolean;
    status: number;
}

// Usage with and without explicit type
const stringResponse: ApiResponse<string> = { data: "hello", ok: true, status: 200 };
const unknownResponse: ApiResponse = { data: null, ok: false, status: 404 };
```

### 4. Multiple Type Parameters
```ts
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

// Usage
const numbers = { a: 1, b: 2, c: 3 };
const strings = mapObject(numbers, (value, key) => `${key}: ${value}`);
// Result: { a: "a: 1", b: "b: 2", c: "c: 3" }
```

### 5. Generic Utility Types
```ts
// Conditional types with generics
type NonNullable<T> = T extends null | undefined ? never : T;

// Mapped types
type Partial<T> = {
    [P in keyof T]?: T[P];
};

// Template literal types
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<'click'>; // "onClick"
```

## Advanced Patterns

### 1. Preserving Input-Output Relationships
```ts
// Generic function that preserves the relationship between input and output
function map<T, U>(array: T[], fn: (item: T, index: number) => U): U[] {
    return array.map(fn);
}

// The type system knows the exact relationship
const numbers = [1, 2, 3];
const strings = map(numbers, n => n.toString()); // string[]
const doubled = map(numbers, n => n * 2); // number[]
```

### 2. Generic Constraints with Function Overloads
```ts
// Overloads for better inference
function createArray<T>(length: number, value: T): T[];
function createArray<T>(items: T[]): T[];
function createArray<T>(arg: number | T[], value?: T): T[] {
    if (Array.isArray(arg)) {
        return arg;
    }
    return new Array(arg).fill(value!);
}
```

### 3. Generic Classes with Inheritance
```ts
class Repository<T> {
    protected items: T[] = [];
    
    add(item: T): void {
        this.items.push(item);
    }
    
    find(predicate: (item: T) => boolean): T | undefined {
        return this.items.find(predicate);
    }
}

class UserRepository extends Repository<User> {
    findByEmail(email: string): User | undefined {
        return this.find(user => user.email === email);
    }
}
```

## Best Practices

### 1. Prefer Constraints Over `any`
```ts
// ❌ Bad - loses type safety
function processValue(value: any): any {
    return value;
}

// ✅ Good - maintains type safety with constraints
function processValue<T extends string | number>(value: T): T {
    return value;
}
```

### 2. Let Type Inference Work
```ts
// ❌ Bad - unnecessary explicit typing
const result = identity<string>("hello");

// ✅ Good - let TypeScript infer
const result = identity("hello"); // TypeScript infers string
```

### 3. Use Default Parameters for Ergonomics
```ts
// Good API design with defaults
interface ApiClient<TResponse = unknown> {
    get<TData = TResponse>(url: string): Promise<TData>;
    post<TData = TResponse>(url: string, data: unknown): Promise<TData>;
}
```

### 4. Avoid Over-constraining
```ts
// ❌ Bad - too restrictive
function process<T extends string>(value: T): T {
    return value;
}

// ✅ Good - more flexible
function process<T>(value: T): T {
    return value;
}
```

## Common Gotchas

1. **Generic constraints can be too restrictive** - Start broad, add constraints only when needed
2. **Inference vs explicit typing** - Let TypeScript infer when possible
3. **Generic defaults** - Use them to improve API ergonomics
4. **Multiple type parameters** - Order matters for inference
5. **Conditional types** - Can be complex but powerful for advanced scenarios

## Real-world Examples

### 1. Typed API Wrapper
```ts
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

async function fetchData<T>(
    url: string,
    parser: (response: unknown) => T
): Promise<ApiResponse<T>> {
    const response = await fetch(url);
    const rawData = await response.json();
    return {
        data: parser(rawData),
        status: response.status,
        message: response.statusText
    };
}

// Usage with type safety
const userData = await fetchData('/api/user', (data) => ({
    id: data.id,
    name: data.name,
    email: data.email
}));
// userData.data is properly typed
```

### 2. Generic State Management
```ts
interface State<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

class StateManager<T> {
    private state: State<T> = { data: null, loading: false, error: null };
    
    setLoading(loading: boolean): void {
        this.state.loading = loading;
    }
    
    setData(data: T): void {
        this.state.data = data;
        this.state.error = null;
    }
    
    setError(error: string): void {
        this.state.error = error;
        this.state.data = null;
    }
    
    getState(): State<T> {
        return { ...this.state };
    }
}
```

## Interview Key Points

- **When to use generics**: For reusable, type-safe components
- **Constraints vs overloads**: Use constraints for type relationships, overloads for different behavior
- **Inference**: Let TypeScript infer types when possible
- **Defaults**: Improve API ergonomics without losing type safety
- **Real-world applications**: API wrappers, state management, utility functions



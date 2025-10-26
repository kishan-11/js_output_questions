## Interview questions: Inference vs explicit types

### 1. When should you annotate vs rely on inference? Give code examples.

**Answer:**

**Use Inference When:**
- Simple, obvious types with clear initial values
- Function return types that are straightforward
- Local variables with immediate initialization

```ts
// ✅ GOOD: Let TypeScript infer simple types
const name = "John"; // inferred as string
const age = 25; // inferred as number
const isActive = true; // inferred as boolean

// ✅ GOOD: Function return type inference
function add(a: number, b: number) {
  return a + b; // inferred as number
}

// ✅ GOOD: Object literal inference
const user = { name: "John", age: 25 }; // inferred as { name: string; age: number }
```

**Use Explicit Types When:**
- Uninitialized variables
- Public API functions
- Complex union types
- When inference might be ambiguous

```ts
// ✅ GOOD: Explicit for uninitialized variables
let user: User;
let config: Config | undefined;

// ✅ GOOD: Explicit for public APIs
export function createUser(userData: CreateUserRequest): Promise<User> {
  return api.post('/users', userData);
}

// ✅ GOOD: Explicit for union types
let status: 'loading' | 'success' | 'error' = 'loading';

// ✅ GOOD: Explicit when inference is too broad
const data: string | null = fetchData(); // Without explicit, might infer as any
```

---

### 2. How do contextual types affect inference for callbacks?

**Answer:**

Contextual types allow TypeScript to infer parameter types in callbacks based on the expected signature:

```ts
// Contextual inference in array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2); // n is inferred as number
const strings = numbers.map(n => n.toString()); // n is inferred as number

// Contextual inference in event handlers
document.addEventListener('click', (event) => {
  // event is inferred as MouseEvent based on addEventListener signature
  console.log(event.clientX, event.clientY);
});

// Contextual inference with generic functions
function processItems<T>(items: T[], processor: (item: T) => T): T[] {
  return items.map(processor);
}

const users = [{ name: "John", age: 30 }, { name: "Jane", age: 25 }];
const processed = processItems(users, user => ({ ...user, age: user.age + 1 }));
// user parameter is inferred as { name: string; age: number }
```

**Advanced Contextual Types:**

```ts
// Contextual inference with overloads
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: 'span'): HTMLSpanElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

// Contextual inference with conditional types
type EventMap = {
  click: MouseEvent;
  keydown: KeyboardEvent;
  load: Event;
};

function addEventListener<K extends keyof EventMap>(
  type: K,
  listener: (event: EventMap[K]) => void
): void {
  // Implementation
}

addEventListener('click', (event) => {
  // event is inferred as MouseEvent
  console.log(event.clientX);
});
```

---

### 3. How do generics influence inference at call sites vs declarations?

**Answer:**

**At Call Sites (Inference):**
TypeScript infers generic type parameters from the arguments passed:

```ts
function identity<T>(value: T): T {
  return value;
}

// T is inferred as string
const result1 = identity("hello");

// T is inferred as number  
const result2 = identity(42);

// T is inferred as { name: string; age: number }
const result3 = identity({ name: "John", age: 30 });

// Complex generic inference
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
}

const user = { name: "John", age: 30, email: "john@example.com" };
const partial = pick(user, ['name', 'age']);
// T inferred as { name: string; age: number; email: string }
// K inferred as 'name' | 'age'
// Return type inferred as { name: string; age: number }
```

**At Declarations (Explicit):**
You can explicitly specify generic type parameters:

```ts
// Explicit generic parameters
const result1 = identity<string>("hello");
const result2 = identity<number>(42);

// Explicit with constraints
function processData<T extends Record<string, any>>(
  data: T,
  transformer: (item: T) => T
): T {
  return transformer(data);
}

// Explicit generic in class
class Repository<T> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  findById(id: number): T | undefined {
    return this.items.find((item: any) => item.id === id);
  }
}

// Usage with explicit type
const userRepo = new Repository<User>();
```

**Inference vs Explicit Trade-offs:**

```ts
// ✅ GOOD: Let TypeScript infer when possible
const data = fetchData(); // Inferred based on return type

// ✅ GOOD: Explicit when you need specific constraints
function processItems<T extends { id: number }>(items: T[]): T[] {
  return items.filter(item => item.id > 0);
}

// ❌ BAD: Over-constraining when inference would work
const result = identity<string>("hello"); // Unnecessary
const result = identity("hello"); // Better
```

---

### 4. When can explicit annotations harm inference downstream?

**Answer:**

**Over-annotation can break inference in several ways:**

**1. Breaking Contextual Inference:**
```ts
// ❌ BAD: Over-annotating breaks contextual inference
const numbers = [1, 2, 3];
const doubled = numbers.map((n: number) => n * 2); // Redundant annotation

// ✅ GOOD: Let contextual inference work
const doubled = numbers.map(n => n * 2); // n is inferred as number
```

**2. Over-constraining Generic Inference:**
```ts
// ❌ BAD: Unnecessary explicit generic parameters
function process<T>(items: T[]): T[] {
  return items;
}

const result = process<string>(["a", "b", "c"]); // Unnecessary
const result = process(["a", "b", "c"]); // Better - T inferred as string

// ❌ BAD: Over-constraining return types
function createUser(name: string, age: number): { name: string; age: number } {
  return { name, age }; // Redundant - would be inferred anyway
}
```

**3. Breaking Conditional Type Inference:**
```ts
// ❌ BAD: Over-annotating breaks conditional inference
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };

function handleResponse<T>(response: ApiResponse<T>): T {
  if ('message' in response) {
    return response.message as T; // Over-annotation breaks inference
  }
  return response.data as T; // Over-annotation breaks inference
}

// ✅ GOOD: Let TypeScript infer
function handleResponse<T>(response: ApiResponse<T>): T {
  if ('message' in response) {
    return response.message; // Inferred correctly
  }
  return response.data; // Inferred correctly
}
```

**4. Breaking Function Overload Inference:**
```ts
// ❌ BAD: Over-annotating breaks overload inference
function parse(input: string): number;
function parse(input: number): string;
function parse(input: string | number): string | number {
  if (typeof input === 'string') {
    return parseFloat(input);
  }
  return input.toString();
}

// Usage with broken inference
const result = parse("123"); // Should infer as number, but over-annotation can break this
```

**5. Breaking Mapped Type Inference:**
```ts
// ❌ BAD: Over-annotating breaks mapped type inference
type Partial<T> = {
  [P in keyof T]?: T[P];
};

function createPartial<T>(obj: T): Partial<T> {
  return obj; // Over-annotation here can break inference
}

// ✅ GOOD: Let TypeScript infer the mapped type
function createPartial<T>(obj: T): Partial<T> {
  return obj; // Inferred correctly
}
```

---

### 5. Strategies to improve inference in public APIs (overloads, defaults).

**Answer:**

**1. Function Overloads for Better Inference:**

```ts
// Multiple overloads for different input types
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: 'span'): HTMLSpanElement;
function createElement(tag: 'button'): HTMLButtonElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

// Usage with perfect inference
const div = createElement('div'); // Inferred as HTMLDivElement
const span = createElement('span'); // Inferred as HTMLSpanElement
const button = createElement('button'); // Inferred as HTMLButtonElement
```

**2. Default Generic Parameters:**

```ts
// Default generic parameters for better inference
interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
}

// Without explicit type - uses default
const response1: ApiResponse = { data: "hello", status: 200, message: "OK" };

// With explicit type for specific data
const response2: ApiResponse<User> = { data: user, status: 200, message: "OK" };

// Function with default generic
function fetchData<T = any>(url: string): Promise<ApiResponse<T>> {
  return fetch(url).then(res => res.json());
}

// Usage with inference
const userData = fetchData('/users'); // T inferred as any (default)
const specificData = fetchData<User>('/users/1'); // T explicitly set as User
```

**3. Conditional Return Types:**

```ts
// Conditional return types for better inference
function fetchData<T extends boolean>(
  shouldReturnArray: T
): T extends true ? string[] : string {
  return shouldReturnArray ? ['a', 'b', 'c'] : 'single value' as any;
}

const arrayResult = fetchData(true); // Inferred as string[]
const singleResult = fetchData(false); // Inferred as string
```

**4. Template Literal Types for Better Inference:**

```ts
// Template literal types for better inference
type EventName<T extends string> = `on${Capitalize<T>}`;

function addEventListener<T extends string>(
  event: T,
  handler: (event: EventName<T>) => void
): void {
  // Implementation
}

addEventListener('click', (event) => {
  // event is inferred as 'onClick'
  console.log(event);
});
```

**5. Branded Types for Better Inference:**

```ts
// Branded types for better inference
type UserId = number & { __brand: 'UserId' };
type ProductId = number & { __brand: 'ProductId' };

function createUserId(id: number): UserId {
  return id as UserId;
}

function createProductId(id: number): ProductId {
  return id as ProductId;
}

// Usage with better type safety
const userId = createUserId(123);
const productId = createProductId(456);

// These are not assignable to each other
// userId = productId; // Error: Type 'ProductId' is not assignable to type 'UserId'
```

**6. Utility Types for Better Inference:**

```ts
// Utility types for better inference
type NonNullable<T> = T extends null | undefined ? never : T;

function processValue<T>(value: T): NonNullable<T> {
  if (value == null) {
    throw new Error('Value cannot be null or undefined');
  }
  return value as NonNullable<T>;
}

const result = processValue("hello"); // Inferred as string (not string | null | undefined)
const result2 = processValue(null); // Inferred as never (due to error)
```

**7. Const Assertions for Better Inference:**

```ts
// Const assertions for better inference
const colors = ['red', 'green', 'blue'] as const;
// Inferred as readonly ['red', 'green', 'blue'] instead of string[]

const config = {
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 5000
  }
} as const;
// Inferred with literal types instead of string/number

// Usage with better inference
type Color = typeof colors[number]; // 'red' | 'green' | 'blue'
type ApiConfig = typeof config.api; // { baseUrl: 'https://api.example.com'; timeout: 5000 }
```

**8. Discriminated Unions for Better Inference:**

```ts
// Discriminated unions for better inference
type LoadingState = { status: 'loading' };
type SuccessState = { status: 'success'; data: any };
type ErrorState = { status: 'error'; error: string };

type AppState = LoadingState | SuccessState | ErrorState;

function handleState(state: AppState) {
  switch (state.status) {
    case 'loading':
      // state is inferred as LoadingState
      console.log('Loading...');
      break;
    case 'success':
      // state is inferred as SuccessState
      console.log('Data:', state.data);
      break;
    case 'error':
      // state is inferred as ErrorState
      console.log('Error:', state.error);
      break;
  }
}
```

These strategies help create APIs that provide excellent type inference while maintaining type safety and developer experience.


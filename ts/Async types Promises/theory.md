# Async Types & Promises in TypeScript

## Overview
TypeScript provides powerful type system support for asynchronous operations through Promises, async/await syntax, and various utility types. Understanding these patterns is crucial for building robust, type-safe asynchronous applications.

## Core Promise Types

### Basic Promise Typing
```ts
// Promise that resolves to a string
const stringPromise: Promise<string> = Promise.resolve("Hello");

// Promise that resolves to a number
const numberPromise: Promise<number> = Promise.resolve(42);

// Promise that never resolves (pending forever)
const pendingPromise: Promise<never> = new Promise(() => {});

// Promise that rejects
const rejectedPromise: Promise<never> = Promise.reject(new Error("Failed"));
```

### Generic Promise Functions
```ts
// Generic function returning a promise
function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then(response => response.json());
}

// Usage with type inference
const userData = await fetchData<User>('/api/user');
const productData = await fetchData<Product[]>('/api/products');
```

## Async Function Types

### Return Type of Async Functions
```ts
// Async function return type is always Promise<T>
async function getUserId(): Promise<number> {
  return 123; // This is wrapped in Promise.resolve(123)
}

// Even if you don't explicitly return a Promise
async function getName(): Promise<string> {
  return "John"; // TypeScript infers Promise<string>
}

// Void async function
async function logMessage(message: string): Promise<void> {
  console.log(message);
  // No return statement = Promise<void>
}
```

### Async Function Type Annotations
```ts
// Function type for async functions
type AsyncFunction<T, R> = (input: T) => Promise<R>;

// Example usage
const asyncProcessor: AsyncFunction<string, number> = async (input) => {
  return input.length;
};

// Async function as parameter
function withRetry<T>(
  asyncFn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  // Implementation
}
```

## Awaited Utility Type

### Flattening Nested Promises
```ts
// Without Awaited - nested Promise
type NestedPromise = Promise<Promise<string>>;

// With Awaited - flattened to string
type Flattened = Awaited<Promise<Promise<string>>>; // string

// Real-world example
async function fetchUser(id: string): Promise<User> {
  return { id, name: "John" };
}

async function fetchUserWithPosts(id: string): Promise<Promise<User & { posts: Post[] }>> {
  const user = await fetchUser(id);
  const posts = await fetchPosts(id);
  return Promise.resolve({ ...user, posts });
}

// Using Awaited to get the final type
type UserWithPosts = Awaited<ReturnType<typeof fetchUserWithPosts>>;
// Result: User & { posts: Post[] }
```

### Awaited with Complex Types
```ts
// Awaited works with any thenable
type ThenableString = { then: (onfulfilled: (value: string) => any) => any };
type AwaitedString = Awaited<ThenableString>; // string

// Awaited with union types
type PromiseUnion = Promise<string | number>;
type AwaitedUnion = Awaited<PromiseUnion>; // string | number

// Awaited with conditional types
type ConditionalPromise<T> = T extends string ? Promise<string> : Promise<number>;
type AwaitedConditional = Awaited<ConditionalPromise<string>>; // string
```

## Error Handling Patterns

### Safe Error Typing
```ts
// ❌ Don't type errors as any
async function badErrorHandling(): Promise<string> {
  try {
    return await riskyOperation();
  } catch (error: any) { // ❌ Avoid any
    return "fallback";
  }
}

// ✅ Use unknown for caught errors
async function goodErrorHandling(): Promise<string> {
  try {
    return await riskyOperation();
  } catch (error: unknown) { // ✅ Use unknown
    if (error instanceof Error) {
      console.error(error.message);
    }
    return "fallback";
  }
}
```

### Error Type Narrowing
```ts
// Custom error types
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NetworkError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

// Type guard functions
function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

// Safe error handling with type guards
async function processData(data: unknown): Promise<string> {
  try {
    return await validateAndProcess(data);
  } catch (error: unknown) {
    if (isValidationError(error)) {
      return `Validation failed for field: ${error.field}`;
    }
    if (isNetworkError(error)) {
      return `Network error: ${error.statusCode}`;
    }
    return "Unknown error occurred";
  }
}
```

### Result Pattern for Error Handling
```ts
// Result type for explicit error handling
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Safe async function using Result
async function safeFetch<T>(url: string): Promise<Result<T, string>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Usage
const result = await safeFetch<User>('/api/user');
if (result.success) {
  console.log(result.data.name); // TypeScript knows this is User
} else {
  console.error(result.error); // TypeScript knows this is string
}
```

## Async Iterators and Generators

### AsyncIterable Types
```ts
// AsyncIterable interface
interface AsyncIterable<T> {
  [Symbol.asyncIterator](): AsyncIterator<T>;
}

// AsyncIterator interface
interface AsyncIterator<T> {
  next(): Promise<IteratorResult<T>>;
  return?(value?: any): Promise<IteratorResult<T>>;
  throw?(error?: any): Promise<IteratorResult<T>>;
}

// Custom async iterable
class AsyncNumberGenerator implements AsyncIterable<number> {
  constructor(private max: number) {}
  
  async *[Symbol.asyncIterator](): AsyncIterator<number> {
    for (let i = 0; i < this.max; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      yield i;
    }
  }
}

// Usage
async function consumeAsyncIterable() {
  const generator = new AsyncNumberGenerator(5);
  for await (const num of generator) {
    console.log(num); // 0, 1, 2, 3, 4
  }
}
```

### Async Generator Functions
```ts
// Async generator function
async function* fetchPages<T>(
  baseUrl: string,
  parser: (data: any) => T
): AsyncGenerator<T, void, unknown> {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`${baseUrl}?page=${page}`);
    const data = await response.json();
    
    for (const item of data.items) {
      yield parser(item);
    }
    
    hasMore = data.hasMore;
    page++;
  }
}

// Usage
async function processAllUsers() {
  const userParser = (data: any): User => ({
    id: data.id,
    name: data.name,
    email: data.email
  });
  
  for await (const user of fetchPages('/api/users', userParser)) {
    console.log(`Processing user: ${user.name}`);
  }
}
```

## Cancellation and AbortSignal

### AbortSignal Integration
```ts
// Function that supports cancellation
async function fetchWithCancel<T>(
  url: string,
  signal?: AbortSignal
): Promise<T> {
  const response = await fetch(url, { signal });
  
  if (signal?.aborted) {
    throw new DOMException('Operation was aborted', 'AbortError');
  }
  
  return response.json();
}

// Usage with timeout
async function fetchWithTimeout<T>(
  url: string,
  timeoutMs: number
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const result = await fetchWithCancel<T>(url, controller.signal);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
```

### Custom Cancellable Operations
```ts
// Cancellable async operation
class CancellableOperation<T> {
  private controller = new AbortController();
  private isCompleted = false;
  
  constructor(
    private operation: (signal: AbortSignal) => Promise<T>
  ) {}
  
  async execute(): Promise<T> {
    if (this.isCompleted) {
      throw new Error('Operation already completed');
    }
    
    try {
      const result = await this.operation(this.controller.signal);
      this.isCompleted = true;
      return result;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Operation was cancelled');
      }
      throw error;
    }
  }
  
  cancel(): void {
    if (!this.isCompleted) {
      this.controller.abort();
    }
  }
  
  get signal(): AbortSignal {
    return this.controller.signal;
  }
}

// Usage
const operation = new CancellableOperation(async (signal) => {
  // Long-running operation
  await new Promise(resolve => setTimeout(resolve, 5000));
  return "Operation completed";
});

// Start operation
const resultPromise = operation.execute();

// Cancel after 2 seconds
setTimeout(() => operation.cancel(), 2000);

try {
  const result = await resultPromise;
  console.log(result);
} catch (error) {
  console.log("Operation was cancelled");
}
```

## Advanced Promise Patterns

### Promise.all with Type Safety
```ts
// Type-safe Promise.all
async function fetchMultiple<T extends readonly unknown[]>(
  promises: { [K in keyof T]: Promise<T[K]> }
): Promise<T> {
  return Promise.all(promises);
}

// Usage
const [user, posts, comments] = await fetchMultiple([
  fetchUser(1),
  fetchPosts(1),
  fetchComments(1)
]);
// user: User, posts: Post[], comments: Comment[]
```

### Promise.allSettled with Type Safety
```ts
// Type-safe Promise.allSettled
type SettledResult<T> = 
  | { status: 'fulfilled'; value: T }
  | { status: 'rejected'; reason: unknown };

async function fetchAllSettled<T extends readonly unknown[]>(
  promises: { [K in keyof T]: Promise<T[K]> }
): Promise<{ [K in keyof T]: SettledResult<T[K]> }> {
  return Promise.allSettled(promises) as any;
}

// Usage
const results = await fetchAllSettled([
  fetchUser(1),
  fetchPosts(1),
  fetchComments(1)
]);

results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`Promise ${index} succeeded:`, result.value);
  } else {
    console.log(`Promise ${index} failed:`, result.reason);
  }
});
```

### Promise.race with Timeout
```ts
// Race with timeout
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

// Usage
try {
  const result = await withTimeout(fetchData('/api/slow'), 5000);
  console.log(result);
} catch (error) {
  if (error.message === 'Timeout') {
    console.log('Request timed out');
  }
}
```

## Utility Types for Async Operations

### Custom Utility Types
```ts
// Extract promise value type
type PromiseValue<T> = T extends Promise<infer U> ? U : T;

// Extract async function return type
type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer R> ? R : never;

// Example usage
async function getUser(id: string): Promise<User> {
  return { id, name: "John" };
}

type UserType = PromiseValue<ReturnType<typeof getUser>>; // User
type AsyncUserType = AsyncReturnType<typeof getUser>; // User

// Conditional async type
type MaybeAsync<T, IsAsync extends boolean> = IsAsync extends true 
  ? Promise<T> 
  : T;

// Usage
type SyncResult = MaybeAsync<string, false>; // string
type AsyncResult = MaybeAsync<string, true>; // Promise<string>
```

## Best Practices

### 1. Always Handle Errors
```ts
// ❌ Don't ignore promise rejections
fetch('/api/data').then(data => console.log(data));

// ✅ Handle errors properly
fetch('/api/data')
  .then(data => console.log(data))
  .catch(error => console.error('Failed to fetch:', error));
```

### 2. Use Type Guards for Error Handling
```ts
// ✅ Use type guards for safe error handling
function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error';
}
```

### 3. Prefer async/await over .then()
```ts
// ❌ Promise chains can be hard to read
fetch('/api/user')
  .then(response => response.json())
  .then(user => fetch(`/api/posts/${user.id}`))
  .then(response => response.json())
  .then(posts => console.log(posts))
  .catch(error => console.error(error));

// ✅ async/await is more readable
try {
  const userResponse = await fetch('/api/user');
  const user = await userResponse.json();
  const postsResponse = await fetch(`/api/posts/${user.id}`);
  const posts = await postsResponse.json();
  console.log(posts);
} catch (error) {
  console.error(error);
}
```

### 4. Use AbortSignal for Cancellation
```ts
// ✅ Always support cancellation for long-running operations
async function processLargeDataset(
  data: any[],
  signal?: AbortSignal
): Promise<void> {
  for (const item of data) {
    if (signal?.aborted) {
      throw new DOMException('Operation aborted', 'AbortError');
    }
    await processItem(item);
  }
}
```

## Common Pitfalls

### 1. Forgetting to Await
```ts
// ❌ Forgetting await
function badExample(): Promise<string> {
  return fetch('/api/data').then(response => response.text());
}

// ✅ Proper async/await
async function goodExample(): Promise<string> {
  const response = await fetch('/api/data');
  return response.text();
}
```

### 2. Incorrect Error Typing
```ts
// ❌ Using any for errors
catch (error: any) {
  console.log(error.message); // Might not exist
}

// ✅ Using unknown and type guards
catch (error: unknown) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

### 3. Not Handling Promise Rejections
```ts
// ❌ Unhandled promise rejection
async function riskyOperation() {
  const result = await mightFail();
  return result;
}

// ✅ Proper error handling
async function safeOperation() {
  try {
    const result = await mightFail();
    return result;
  } catch (error) {
    console.error('Operation failed:', error);
    throw error; // Re-throw if needed
  }
}
```



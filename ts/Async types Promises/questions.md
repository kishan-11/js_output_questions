## Interview questions: Async types & Promises

### 1. What is the return type of an `async` function and how does `Awaited<T>` help model nested promises?

**Answer:**
An `async` function always returns a `Promise<T>`, where `T` is the type of the value that would be returned if the function were synchronous.

```typescript
async function fetchData(): Promise<string> {
  return "Hello World";
}

// The function above returns Promise<string>, not string
```

`Awaited<T>` is a utility type that recursively unwraps Promise types:

```typescript
type Example1 = Awaited<Promise<string>>; // string
type Example2 = Awaited<Promise<Promise<number>>>; // number
type Example3 = Awaited<string>; // string (no change if not a Promise)

// Practical example with nested promises
async function getNestedData(): Promise<Promise<{ id: number; name: string }>> {
  return Promise.resolve({ id: 1, name: "John" });
}

type NestedResult = Awaited<ReturnType<typeof getNestedData>>; // { id: number; name: string }
```

This is particularly useful when dealing with functions that might return promises or when working with generic async operations.

### 2. How do you type a function that accepts a parser and returns parsed JSON from `fetch` while preserving the parser's return type?

**Answer:**
Use generics to preserve the parser's return type:

```typescript
async function fetchAndParse<T>(
  url: string,
  parser: (data: any) => T
): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();
  return parser(data);
}

// Usage examples
const userParser = (data: any) => ({ id: data.id, name: data.name });
const result = await fetchAndParse('/api/user', userParser); // result is { id: number; name: string }

// With more complex parser
const usersParser = (data: any) => data.map((user: any) => ({ id: user.id, name: user.name }));
const users = await fetchAndParse('/api/users', usersParser); // users is { id: number; name: string }[]
```

Alternative approach with function overloads for better type inference:

```typescript
function fetchAndParse<T>(url: string, parser: (data: any) => T): Promise<T>;
function fetchAndParse(url: string): Promise<any>;
async function fetchAndParse<T>(url: string, parser?: (data: any) => T): Promise<T | any> {
  const response = await fetch(url);
  const data = await response.json();
  return parser ? parser(data) : data;
}
```

### 3. How do you type errors from `try/catch` safely? Why should the caught error be `unknown`?

**Answer:**
The caught error should be typed as `unknown` because JavaScript can throw anything (not just Error objects), and TypeScript's strict mode requires this for type safety.

```typescript
// ❌ Unsafe - assumes error is always an Error
try {
  await riskyOperation();
} catch (error: Error) { // TypeScript error in strict mode
  console.log(error.message);
}

// ✅ Safe approach
try {
  await riskyOperation();
} catch (error: unknown) {
  // Type guard to check if it's an Error
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log('Unknown error:', error);
  }
}

// ✅ More robust error handling
function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

// ✅ Custom error type guard
function isApiError(error: unknown): error is { status: number; message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error
  );
}

try {
  await apiCall();
} catch (error: unknown) {
  if (isApiError(error)) {
    console.log(`API Error ${error.status}: ${error.message}`);
  } else {
    console.log('Unexpected error:', error);
  }
}
```

**Why `unknown`?**
- JavaScript can throw anything: `throw "string"`, `throw 42`, `throw { custom: "object" }`
- `unknown` forces you to check the type before using it
- Prevents runtime errors from assuming the wrong type
- Makes error handling explicit and safe

### 4. How do you type an async iterator (`AsyncIterable<T>`) and consume it correctly?

**Answer:**
Use `AsyncIterable<T>` for the type and `for await...of` for consumption:

```typescript
// Creating an async iterable
async function* asyncGenerator(): AsyncIterable<number> {
  for (let i = 0; i < 3; i++) {
    await new Promise(resolve => setTimeout(resolve, 100));
    yield i;
  }
}

// Typing async iterables
interface AsyncDataStream<T> {
  [Symbol.asyncIterator](): AsyncIterator<T>;
}

class DataStream<T> implements AsyncDataStream<T> {
  constructor(private data: T[]) {}
  
  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    for (const item of this.data) {
      await new Promise(resolve => setTimeout(resolve, 50));
      yield item;
    }
  }
}

// Consuming async iterables
async function consumeAsyncIterable() {
  // Method 1: for await...of
  for await (const value of asyncGenerator()) {
    console.log(value); // 0, 1, 2
  }
  
  // Method 2: Manual iteration
  const stream = new DataStream(['a', 'b', 'c']);
  const iterator = stream[Symbol.asyncIterator]();
  
  let result = await iterator.next();
  while (!result.done) {
    console.log(result.value);
    result = await iterator.next();
  }
}

// Generic async iterable function
async function processAsyncIterable<T>(
  iterable: AsyncIterable<T>,
  processor: (item: T) => Promise<void>
): Promise<void> {
  for await (const item of iterable) {
    await processor(item);
  }
}
```

### 5. How would you expose a cancelable async operation in TypeScript (signal types, return type)?

**Answer:**
Use `AbortSignal` and return a Promise that can be cancelled:

```typescript
// Basic cancelable operation
async function cancelableOperation(
  signal: AbortSignal,
  duration: number = 1000
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if already cancelled
    if (signal.aborted) {
      reject(new DOMException('Operation was aborted', 'AbortError'));
      return;
    }
    
    const timeout = setTimeout(() => {
      resolve('Operation completed');
    }, duration);
    
    // Listen for cancellation
    signal.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new DOMException('Operation was aborted', 'AbortError'));
    });
  });
}

// Usage
const controller = new AbortController();
const signal = controller.signal;

// Start operation
cancelableOperation(signal, 2000)
  .then(result => console.log(result))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Operation was cancelled');
    }
  });

// Cancel after 1 second
setTimeout(() => controller.abort(), 1000);

// Generic cancelable fetch wrapper
async function cancelableFetch<T>(
  url: string,
  signal: AbortSignal,
  parser?: (data: any) => T
): Promise<T> {
  const response = await fetch(url, { signal });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return parser ? parser(data) : data;
}

// Advanced: Cancelable async generator
async function* cancelableAsyncGenerator(
  signal: AbortSignal
): AsyncIterable<number> {
  let count = 0;
  
  while (!signal.aborted) {
    await new Promise(resolve => setTimeout(resolve, 100));
    yield count++;
  }
  
  if (signal.aborted) {
    throw new DOMException('Generator was aborted', 'AbortError');
  }
}

// Usage with timeout
async function withTimeout<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    return await operation(controller.signal);
  } finally {
    clearTimeout(timeoutId);
  }
}

// Example usage
const result = await withTimeout(
  signal => cancelableFetch('/api/data', signal),
  5000 // 5 second timeout
);
```

**Key points:**
- Always check `signal.aborted` before starting work
- Listen for the `abort` event to clean up resources
- Reject with `DOMException` with name `'AbortError'`
- Use `AbortController` to create and manage signals
- Combine with `setTimeout` for automatic timeouts


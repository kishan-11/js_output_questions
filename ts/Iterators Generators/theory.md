## Iterators & Generators

### Core Concepts

**Iterators** are objects that implement the iterator protocol, providing a way to access elements of a collection sequentially.

**Generators** are functions that can be paused and resumed, returning an iterator object.

### TypeScript Types

#### Basic Iterator Types
- `Iterator<T>`: Defines the iterator protocol with `next()`, `return()`, and `throw()` methods
- `Iterable<T>`: Defines objects that can be iterated over (have `[Symbol.iterator]()` method)
- `IterableIterator<T>`: Combines both - an object that is both iterable and an iterator

#### Async Iterator Types
- `AsyncIterator<T>`: Async version of Iterator with `next()`, `return()`, and `throw()` methods
- `AsyncIterable<T>`: Objects that can be async iterated (have `[Symbol.asyncIterator]()` method)
- `AsyncIterableIterator<T>`: Combines both async iterator and iterable

### Iterator Protocol

```typescript
interface Iterator<T, TReturn = any, TNext = undefined> {
  next(...args: TNext[]): IteratorResult<T, TReturn>;
  return?(value?: TReturn): IteratorResult<T, TReturn>;
  throw?(e?: any): IteratorResult<T, TReturn>;
}

interface IteratorResult<T, TReturn = any> {
  done: boolean;
  value: T | TReturn;
}
```

### Generator Functions

```typescript
// Basic generator
function* numberGenerator(): Generator<number, void, unknown> {
  yield 1;
  yield 2;
  yield 3;
}

// Async generator
async function* asyncGenerator(): AsyncGenerator<number, void, unknown> {
  yield 1;
  await new Promise(resolve => setTimeout(resolve, 100));
  yield 2;
  yield 3;
}

// Generator with return value
function* generatorWithReturn(): Generator<number, string, unknown> {
  yield 1;
  yield 2;
  return "done";
}
```

### Custom Iterables

```typescript
class NumberRange implements Iterable<number> {
  constructor(private start: number, private end: number) {}
  
  [Symbol.iterator](): Iterator<number> {
    let current = this.start;
    const end = this.end;
    
    return {
      next(): IteratorResult<number> {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

// Usage
const range = new NumberRange(1, 5);
for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}
```

### Async Iterables for Streams

```typescript
// Node.js readable stream as async iterable
async function* streamGenerator(): AsyncIterable<string> {
  const stream = createReadStream('file.txt');
  
  for await (const chunk of stream) {
    yield chunk.toString();
  }
}

// Usage with for await...of
async function processStream() {
  for await (const data of streamGenerator()) {
    console.log(data);
  }
}
```

### Generator Methods and Control

```typescript
function* controlledGenerator(): Generator<number, void, number> {
  let value = yield 1;
  console.log('Received:', value);
  
  value = yield 2;
  console.log('Received:', value);
  
  yield 3;
}

const gen = controlledGenerator();
console.log(gen.next());        // { value: 1, done: false }
console.log(gen.next(100));     // Received: 100, { value: 2, done: false }
console.log(gen.next(200));     // Received: 200, { value: 3, done: false }
console.log(gen.next());        // { value: undefined, done: true }
```

### Error Handling

```typescript
function* errorGenerator(): Generator<number, void, unknown> {
  try {
    yield 1;
    yield 2;
  } catch (error) {
    console.log('Caught error:', error);
    yield 999;
  }
}

const gen = errorGenerator();
console.log(gen.next());        // { value: 1, done: false }
console.log(gen.throw('Error')); // Caught error: Error, { value: 999, done: false }
```

### Practical Use Cases

#### 1. Lazy Evaluation
```typescript
function* fibonacci(): Generator<number, void, unknown> {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
console.log(fib.next().value); // 0
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
```

#### 2. Data Processing Pipeline
```typescript
function* map<T, U>(iterable: Iterable<T>, fn: (item: T) => U): Generator<U, void, unknown> {
  for (const item of iterable) {
    yield fn(item);
  }
}

function* filter<T>(iterable: Iterable<T>, predicate: (item: T) => boolean): Generator<T, void, unknown> {
  for (const item of iterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}

// Usage
const numbers = [1, 2, 3, 4, 5];
const pipeline = map(filter(numbers, n => n % 2 === 0), n => n * 2);

for (const result of pipeline) {
  console.log(result); // 4, 8
}
```

#### 3. Async Data Streaming
```typescript
async function* processLargeFile(): AsyncIterable<string> {
  const fileStream = createReadStream('large-file.txt');
  
  for await (const chunk of fileStream) {
    const lines = chunk.toString().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        yield line.trim();
      }
    }
  }
}
```

### Type Safety Considerations

```typescript
// Generic iterator type
function createIterator<T>(items: T[]): Iterator<T> {
  let index = 0;
  return {
    next(): IteratorResult<T> {
      if (index < items.length) {
        return { value: items[index++], done: false };
      }
      return { value: undefined, done: true };
    }
  };
}

// Type-safe async iteration
async function* typedAsyncGenerator<T>(
  source: AsyncIterable<T>
): AsyncGenerator<T, void, unknown> {
  for await (const item of source) {
    yield item;
  }
}
```

### Performance Considerations

- **Memory Efficiency**: Generators provide lazy evaluation, only computing values when needed
- **Backpressure**: Async iterables can handle backpressure in streaming scenarios
- **Infinite Sequences**: Generators can represent infinite sequences without memory issues
- **Composability**: Multiple generators can be composed for complex data transformations
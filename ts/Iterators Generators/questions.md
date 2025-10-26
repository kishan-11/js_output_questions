## Interview questions: Iterators & Generators

### 1. Difference between `Iterator<T>`, `Iterable<T>`, and `IterableIterator<T>`?

**Answer:**
- **`Iterator<T>`**: An object that implements the iterator protocol with `next()`, `return()`, and `throw()` methods. It's the actual iteration mechanism.

- **`Iterable<T>`**: An object that has a `[Symbol.iterator]()` method, making it iterable with `for...of` loops. It returns an iterator when called.

- **`IterableIterator<T>`**: An object that is both iterable AND an iterator. It implements both the `[Symbol.iterator]()` method and the iterator protocol methods.

```typescript
// Iterator only
const iterator: Iterator<number> = {
  next() { return { value: 1, done: false }; }
};

// Iterable only
const iterable: Iterable<number> = {
  [Symbol.iterator]() { return iterator; }
};

// Both (IterableIterator)
const iterableIterator: IterableIterator<number> = {
  [Symbol.iterator]() { return this; },
  next() { return { value: 1, done: false }; }
};
```

### 2. How do you type async generators and `for await...of` consumers?

**Answer:**
```typescript
// Async generator function
async function* asyncNumberGenerator(): AsyncGenerator<number, void, unknown> {
  yield 1;
  await new Promise(resolve => setTimeout(resolve, 100));
  yield 2;
  yield 3;
}

// Async iterable interface
interface AsyncDataStream<T> extends AsyncIterable<T> {
  [Symbol.asyncIterator](): AsyncIterator<T>;
}

// Usage with for await...of
async function consumeAsyncGenerator() {
  for await (const value of asyncNumberGenerator()) {
    console.log(value); // 1, 2, 3
  }
}

// Typed async iteration
async function processAsyncIterable<T>(
  source: AsyncIterable<T>,
  processor: (item: T) => Promise<void>
): Promise<void> {
  for await (const item of source) {
    await processor(item);
  }
}
```

### 3. Model a streaming parser with `AsyncIterable<string>`; backpressure concerns.

**Answer:**
```typescript
interface StreamingParser {
  parse(chunk: string): string[];
  flush(): string[];
}

class JSONStreamParser implements StreamingParser {
  private buffer = '';
  
  parse(chunk: string): string[] {
    this.buffer += chunk;
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || ''; // Keep incomplete line in buffer
    
    return lines.filter(line => line.trim());
  }
  
  flush(): string[] {
    return this.buffer.trim() ? [this.buffer] : [];
  }
}

// Backpressure-aware async generator
async function* streamParser(
  source: AsyncIterable<string>,
  parser: StreamingParser
): AsyncGenerator<string, void, unknown> {
  let pending = 0;
  const maxPending = 10; // Backpressure threshold
  
  for await (const chunk of source) {
    // Check backpressure
    if (pending >= maxPending) {
      await new Promise(resolve => setTimeout(resolve, 10));
      pending = 0;
    }
    
    const parsed = parser.parse(chunk);
    for (const item of parsed) {
      yield item;
      pending++;
    }
  }
  
  // Flush remaining buffer
  const remaining = parser.flush();
  for (const item of remaining) {
    yield item;
  }
}

// Usage with backpressure control
async function processStream() {
  const parser = new JSONStreamParser();
  const stream = createReadStream('data.json');
  
  for await (const parsedItem of streamParser(stream, parser)) {
    console.log('Parsed:', parsedItem);
    // Process item here
  }
}
```

### 4. How to create a typed pipeline of transforms with generators?

**Answer:**
```typescript
// Generic transform function type
type Transform<T, U> = (input: T) => U;
type AsyncTransform<T, U> = (input: T) => Promise<U>;

// Pipeline builder
class Pipeline<T> {
  constructor(private source: Iterable<T>) {}
  
  map<U>(transform: Transform<T, U>): Pipeline<U> {
    return new Pipeline(this.transformSource(transform));
  }
  
  filter(predicate: (item: T) => boolean): Pipeline<T> {
    return new Pipeline(this.filterSource(predicate));
  }
  
  async mapAsync<U>(transform: AsyncTransform<T, U>): Promise<Pipeline<U>> {
    const asyncSource = this.asyncTransformSource(transform);
    return new Pipeline(await this.collectAsync(asyncSource));
  }
  
  private *transformSource<U>(transform: Transform<T, U>): Generator<U, void, unknown> {
    for (const item of this.source) {
      yield transform(item);
    }
  }
  
  private *filterSource(predicate: (item: T) => boolean): Generator<T, void, unknown> {
    for (const item of this.source) {
      if (predicate(item)) {
        yield item;
      }
    }
  }
  
  private async *asyncTransformSource<U>(
    transform: AsyncTransform<T, U>
  ): AsyncGenerator<U, void, unknown> {
    for (const item of this.source) {
      yield await transform(item);
    }
  }
  
  private async collectAsync<U>(source: AsyncIterable<U>): Promise<U[]> {
    const result: U[] = [];
    for await (const item of source) {
      result.push(item);
    }
    return result;
  }
  
  toArray(): T[] {
    return Array.from(this.source);
  }
  
  async toArrayAsync(): Promise<T[]> {
    return this.toArray();
  }
}

// Usage
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const pipeline = new Pipeline(data)
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .map(x => `Number: ${x}`);

const result = pipeline.toArray();
console.log(result); // ["Number: 4", "Number: 8", "Number: 12", "Number: 16", "Number: 20"]
```

### 5. Pitfalls when mixing DOM vs Node stream types with async iterables.

**Answer:**
```typescript
// Common pitfalls and solutions

// ❌ Pitfall 1: Mixing ReadableStream (DOM) with Node.js streams
async function problematicMixing() {
  // DOM ReadableStream
  const domStream = new ReadableStream({
    start(controller) {
      controller.enqueue('data');
      controller.close();
    }
  });
  
  // Node.js Readable
  const nodeStream = createReadStream('file.txt');
  
  // This won't work - different APIs
  // for await (const chunk of domStream) { } // Error!
}

// ✅ Solution 1: Convert between stream types
async function convertDOMToNode(domStream: ReadableStream): Promise<NodeJS.Readable> {
  const reader = domStream.getReader();
  const chunks: Uint8Array[] = [];
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  
  return Readable.from(Buffer.concat(chunks));
}

// ✅ Solution 2: Use proper async iterable adapters
class StreamAdapter {
  static fromDOMStream(stream: ReadableStream): AsyncIterable<Uint8Array> {
    return {
      async *[Symbol.asyncIterator]() {
        const reader = stream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            yield value;
          }
        } finally {
          reader.releaseLock();
        }
      }
    };
  }
  
  static fromNodeStream(stream: NodeJS.Readable): AsyncIterable<Buffer> {
    return {
      async *[Symbol.asyncIterator]() {
        for await (const chunk of stream) {
          yield chunk;
        }
      }
    };
  }
}

// ✅ Solution 3: Type-safe stream processing
interface StreamProcessor<T> {
  process(chunk: T): Promise<void>;
}

async function processStreamSafely<T>(
  source: AsyncIterable<T>,
  processor: StreamProcessor<T>
): Promise<void> {
  try {
    for await (const chunk of source) {
      await processor.process(chunk);
    }
  } catch (error) {
    console.error('Stream processing error:', error);
    throw error;
  }
}

// Usage example
async function handleMixedStreams() {
  // DOM stream
  const domStream = new ReadableStream(/* ... */);
  const domIterable = StreamAdapter.fromDOMStream(domStream);
  
  // Node stream
  const nodeStream = createReadStream('file.txt');
  const nodeIterable = StreamAdapter.fromNodeStream(nodeStream);
  
  // Process both safely
  await processStreamSafely(domIterable, {
    async process(chunk) {
      console.log('DOM chunk:', chunk);
    }
  });
  
  await processStreamSafely(nodeIterable, {
    async process(chunk) {
      console.log('Node chunk:', chunk);
    }
  });
}
```

### Additional Advanced Questions:

#### 6. How do you implement a custom async iterator with proper error handling?

**Answer:**
```typescript
class RobustAsyncIterator<T> implements AsyncIterableIterator<T> {
  private isClosed = false;
  
  constructor(private source: AsyncIterable<T>) {}
  
  async next(): Promise<IteratorResult<T>> {
    if (this.isClosed) {
      return { value: undefined, done: true };
    }
    
    try {
      const iterator = this.source[Symbol.asyncIterator]();
      const result = await iterator.next();
      
      if (result.done) {
        this.isClosed = true;
      }
      
      return result;
    } catch (error) {
      this.isClosed = true;
      throw error;
    }
  }
  
  async return(value?: any): Promise<IteratorResult<T>> {
    this.isClosed = true;
    return { value, done: true };
  }
  
  async throw(error?: any): Promise<IteratorResult<T>> {
    this.isClosed = true;
    throw error;
  }
  
  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return this;
  }
}
```

#### 7. How do you implement backpressure in async generators?

**Answer:**
```typescript
class BackpressureController {
  private queue: any[] = [];
  private maxQueueSize: number;
  private isProcessing = false;
  
  constructor(maxQueueSize = 100) {
    this.maxQueueSize = maxQueueSize;
  }
  
  async *process<T>(
    source: AsyncIterable<T>,
    processor: (item: T) => Promise<void>
  ): AsyncGenerator<T, void, unknown> {
    for await (const item of source) {
      // Check backpressure
      while (this.queue.length >= this.maxQueueSize) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Add to queue
      this.queue.push(item);
      
      // Process asynchronously
      this.processQueue(processor);
      
      yield item;
    }
  }
  
  private async processQueue<T>(processor: (item: T) => Promise<void>): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      try {
        await processor(item);
      } catch (error) {
        console.error('Processing error:', error);
      }
    }
    
    this.isProcessing = false;
  }
}
```
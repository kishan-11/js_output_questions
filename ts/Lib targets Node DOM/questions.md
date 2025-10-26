## Interview questions: Lib targets (Node vs DOM)

### 1. How does the `lib` option affect available globals and types?

**Answer:**

The `lib` option in `tsconfig.json` determines which ambient type definitions TypeScript includes, directly affecting what global APIs and types are available in your project.

**Key Effects:**

1. **Global Objects:** Controls which global objects are available
   ```typescript
   // With lib: ["ES2022", "DOM"]
   console.log(typeof window); // "object" - available
   console.log(typeof document); // "object" - available
   
   // With lib: ["ES2022"] only
   console.log(typeof window); // "undefined" - not available
   console.log(typeof document); // "undefined" - not available
   ```

2. **Type Definitions:** Determines which built-in types are included
   ```typescript
   // DOM lib includes:
   interface HTMLElement { ... }
   interface Event { ... }
   interface Window { ... }
   
   // ES2022 lib includes:
   interface Promise<T> { ... }
   interface Array<T> { ... }
   interface Map<K, V> { ... }
   ```

3. **IntelliSense:** Affects autocomplete and type checking
   ```typescript
   // With DOM lib:
   document.getElementById('btn') // ✅ Available
   
   // Without DOM lib:
   document.getElementById('btn') // ❌ Error: Cannot find name 'document'
   ```

4. **Runtime vs Compile-time:** Lib only affects TypeScript compilation, not runtime
   ```typescript
   // This compiles fine with DOM lib, but crashes at runtime in Node.js
   const element = document.getElementById('test');
   ```

### 2. Why avoid including `DOM` in Node projects? Name conflict examples.

**Answer:**

Including `DOM` in Node.js projects causes several issues:

**1. Type Conflicts:**
```typescript
// Both Node and DOM have Event types
// Node: process.EventEmitter
// DOM: Event interface

// ❌ Confusion: Which Event type?
function handleEvent(event: Event) {
  // Is this NodeJS.EventEmitter or DOM Event?
}

// ✅ Solution: Be explicit
import { EventEmitter } from 'events';
function handleNodeEvent(event: EventEmitter) { ... }

// For DOM events (if needed in Node):
function handleDOMEvent(event: globalThis.Event) { ... }
```

**2. Global Object Conflicts:**
```typescript
// ❌ Problem: global vs window
declare global {
  var myGlobal: string; // Which global scope?
}

// Node.js
global.myGlobal = 'node'; // global object

// DOM
window.myGlobal = 'browser'; // window object

// ✅ Solution: Environment-specific declarations
// types/node.d.ts
declare global {
  namespace NodeJS {
    interface Global {
      myGlobal: string;
    }
  }
}

// types/dom.d.ts  
declare global {
  interface Window {
    myGlobal: string;
  }
}
```

**3. API Confusion:**
```typescript
// ❌ DOM APIs don't exist in Node
const element = document.getElementById('btn'); // Runtime error in Node

// ❌ Node APIs don't exist in DOM
const fs = require('fs'); // Runtime error in browser
```

**4. Bundle Size:**
```typescript
// Including DOM lib adds unnecessary type definitions
// that will never be used in Node.js environment
```

**5. Buffer vs ArrayBuffer Confusion:**
```typescript
// Node.js Buffer
const nodeBuffer = Buffer.from('hello');

// DOM ArrayBuffer  
const domBuffer = new ArrayBuffer(8);

// ❌ Mixing libs can cause confusion about which to use
```

### 3. How to share types across Node and RN projects safely?

**Answer:**

Sharing types between Node.js and React Native projects requires careful consideration of their different environments:

**1. Environment Detection:**
```typescript
// utils/environment.ts
export type Environment = 'node' | 'react-native' | 'web';

export function getEnvironment(): Environment {
  if (typeof process !== 'undefined' && process.versions?.node) {
    return 'node';
  }
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'react-native';
  }
  return 'web';
}
```

**2. Conditional Types:**
```typescript
// types/shared.ts
type PlatformStorage<T extends Environment> = 
  T extends 'node' ? NodeJS.Global :
  T extends 'react-native' ? AsyncStorage :
  T extends 'web' ? Storage :
  never;

// Usage
function createStorage<T extends Environment>(
  platform: T
): PlatformStorage<T> {
  switch (platform) {
    case 'node':
      return global as PlatformStorage<T>;
    case 'react-native':
      return AsyncStorage as PlatformStorage<T>;
    case 'web':
      return localStorage as PlatformStorage<T>;
  }
}
```

**3. Shared Configuration:**
```json
// tsconfig.base.json
{
  "compilerOptions": {
    "lib": ["ES2022"],
    "target": "ES2022",
    "strict": true
  }
}

// tsconfig.node.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "module": "CommonJS"
  }
}

// tsconfig.rn.json
{
  "extends": "./tsconfig.base.json", 
  "compilerOptions": {
    "lib": ["ES2022"]
  }
}
```

**4. Platform-Specific Implementations:**
```typescript
// interfaces/storage.interface.ts
export interface StorageInterface {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

// implementations/node-storage.ts
export class NodeStorage implements StorageInterface {
  async getItem(key: string): Promise<string | null> {
    const fs = await import('fs/promises');
    try {
      return await fs.readFile(key, 'utf-8');
    } catch {
      return null;
    }
  }
  
  async setItem(key: string, value: string): Promise<void> {
    const fs = await import('fs/promises');
    await fs.writeFile(key, value);
  }
}

// implementations/rn-storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export class RNStorage implements StorageInterface {
  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }
  
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }
}
```

**5. Factory Pattern:**
```typescript
// factories/storage-factory.ts
import { StorageInterface } from '../interfaces/storage.interface';
import { NodeStorage } from '../implementations/node-storage';
import { RNStorage } from '../implementations/rn-storage';

export function createStorage(): StorageInterface {
  if (typeof process !== 'undefined' && process.versions?.node) {
    return new NodeStorage();
  }
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return new RNStorage();
  }
  throw new Error('Unsupported environment');
}
```

### 4. What `lib` combos do you use for modern Node and why?

**Answer:**

For modern Node.js projects, I use these lib combinations:

**1. Standard Node.js Setup:**
```json
{
  "compilerOptions": {
    "lib": ["ES2022", "ES2022.Array", "ES2022.Object"],
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node"
  }
}
```

**Why this combination:**
- `ES2022`: Latest stable JavaScript features
- `ES2022.Array`: Array methods like `Array.prototype.at()`
- `ES2022.Object`: Object methods like `Object.hasOwn()`
- Avoids DOM bloat and conflicts

**2. Node.js with Web APIs (Rare cases):**
```json
{
  "compilerOptions": {
    "lib": ["ES2022", "WebWorker"],
    "target": "ES2022"
  }
}
```

**When to use:**
- Building Node.js applications that need Web Worker APIs
- Server-side rendering with worker threads
- Microservices that communicate via Web Workers

**3. Node.js with Specific Features:**
```json
{
  "compilerOptions": {
    "lib": [
      "ES2022",
      "ES2022.Array",
      "ES2022.Object", 
      "ES2022.String",
      "ES2022.AsyncIterable"
    ],
    "target": "ES2022"
  }
}
```

**Why specific libs:**
- `ES2022.String`: String methods like `String.prototype.replaceAll()`
- `ES2022.AsyncIterable`: Async iteration support
- Only include what you actually use

**4. Node.js with TypeScript Features:**
```json
{
  "compilerOptions": {
    "lib": ["ES2022"],
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

**Best Practices:**
- Start with `ES2022` only
- Add specific libs as needed
- Never include `DOM` in Node projects
- Use `skipLibCheck: true` for faster compilation
- Consider `ES2023` for cutting-edge features

### 5. How does targeting older JS versions impact generator/async types?

**Answer:**

Targeting older JavaScript versions significantly impacts generator and async types:

**1. Generator Types:**
```typescript
// ES2015 (ES6) - Basic generators
function* basicGenerator() {
  yield 1;
  yield 2;
  return 3;
}

// ES2018 - Async generators
async function* asyncGenerator() {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
  return Promise.resolve(3);
}

// Impact of lib targeting:
// lib: ["ES2015"] - ✅ Basic generators work
// lib: ["ES2015"] - ❌ Async generators fail
// lib: ["ES2018"] - ✅ Both work
```

**2. Async/Await Types:**
```typescript
// ES2017 - Async/await
async function fetchData(): Promise<string> {
  const response = await fetch('/api/data');
  return response.text();
}

// Impact:
// lib: ["ES2015"] - ❌ async/await not available
// lib: ["ES2017"] - ✅ async/await works
// lib: ["ES2022"] - ✅ async/await + top-level await
```

**3. Promise Types:**
```typescript
// ES2015 - Basic Promise
const promise = new Promise<string>((resolve) => {
  resolve('hello');
});

// ES2020 - Promise.allSettled
const results = await Promise.allSettled([
  Promise.resolve('success'),
  Promise.reject('error')
]);

// Impact:
// lib: ["ES2015"] - ❌ Promise.allSettled not available
// lib: ["ES2020"] - ✅ Promise.allSettled works
```

**4. Async Iteration:**
```typescript
// ES2018 - Async iteration
async function processAsyncIterable() {
  for await (const item of asyncIterable) {
    console.log(item);
  }
}

// Impact:
// lib: ["ES2017"] - ❌ for await not available
// lib: ["ES2018"] - ✅ for await works
```

**5. Top-level Await:**
```typescript
// ES2022 - Top-level await
const data = await fetch('/api/data');
console.log(data);

// Impact:
// lib: ["ES2021"] - ❌ Top-level await not available
// lib: ["ES2022"] - ✅ Top-level await works
```

**6. Real-world Example:**
```typescript
// This code requires ES2022 lib
async function* streamData() {
  for await (const chunk of readableStream) {
    yield await processChunk(chunk);
  }
}

// With lib: ["ES2015"]:
// ❌ Error: Cannot find name 'async'
// ❌ Error: Cannot find name 'for await'
// ❌ Error: Cannot find name 'yield'

// With lib: ["ES2022"]:
// ✅ All features work correctly
```

**Migration Strategy:**
```json
// Gradual migration approach
{
  "compilerOptions": {
    // Start with current target
    "lib": ["ES2017"],
    "target": "ES2017",
    
    // Gradually upgrade
    "lib": ["ES2018"], // Add async iteration
    "lib": ["ES2020"], // Add Promise.allSettled
    "lib": ["ES2022"]  // Add top-level await
  }
}
```

**Key Takeaways:**
- Older lib versions limit available async/generator features
- ES2017+ needed for async/await
- ES2018+ needed for async iteration
- ES2022+ needed for top-level await
- Always match lib with your runtime target
- Consider polyfills for older environments


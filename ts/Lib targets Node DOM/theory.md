## Lib Targets: Node vs DOM

The `lib` option in TypeScript's `tsconfig.json` determines which ambient type definitions are included, affecting what global APIs and types are available in your project.

### Understanding Lib Targets

#### What is `lib`?
- Controls which built-in library declaration files TypeScript includes
- Determines available global types, interfaces, and ambient declarations
- Affects IntelliSense, type checking, and available APIs

#### Common Lib Values:
- `ES5`, `ES2015`, `ES2016`, `ES2017`, `ES2018`, `ES2019`, `ES2020`, `ES2021`, `ES2022`, `ES2023`
- `DOM` - Browser DOM APIs
- `DOM.Iterable` - Iterable DOM collections
- `WebWorker` - Web Worker APIs
- `ScriptHost` - Windows Script Host (legacy)

### Node.js vs DOM Environment

#### Node.js Projects
```json
{
  "compilerOptions": {
    "lib": ["ES2022", "ES2022.Array", "ES2022.Object"],
    "target": "ES2022",
    "module": "CommonJS"
  }
}
```

**Recommended for Node.js:**
- `ES2022` or latest ES version
- `ES2022.Array`, `ES2022.Object` for specific features
- **Avoid `DOM`** - causes conflicts and unnecessary bloat

#### DOM/Browser Projects
```json
{
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "target": "ES2022"
  }
}
```

**Recommended for browsers:**
- `ES2022` for modern JavaScript features
- `DOM` for browser APIs (document, window, etc.)
- `DOM.Iterable` for iterable DOM collections

### Key Differences

#### Node.js Environment
- **Global Objects:** `process`, `Buffer`, `global`
- **APIs:** File system, HTTP, streams, crypto
- **No DOM:** No `document`, `window`, `HTMLElement`
- **Module System:** CommonJS or ESM

#### DOM Environment
- **Global Objects:** `window`, `document`, `navigator`
- **APIs:** DOM manipulation, events, storage
- **No Node APIs:** No `process`, `Buffer`, file system
- **Module System:** ESM or script tags

### Common Conflicts and Issues

#### 1. Event Type Conflicts
```typescript
// ❌ Problem: Both Node and DOM have Event types
// Node: process.EventEmitter
// DOM: Event interface

// Node.js
import { EventEmitter } from 'events';
const emitter = new EventEmitter();

// DOM
const button = document.getElementById('btn');
button?.addEventListener('click', (e: Event) => {
  // Event here is DOM Event, not Node EventEmitter
});
```

#### 2. Global Object Conflicts
```typescript
// ❌ Problem: global vs window
// Node: global
// DOM: window

// This causes confusion:
declare global {
  var myGlobal: string; // Which global? Node or DOM?
}
```

#### 3. Buffer vs ArrayBuffer
```typescript
// Node.js
const buffer = Buffer.from('hello'); // Node Buffer

// DOM
const arrayBuffer = new ArrayBuffer(8); // Web API ArrayBuffer
```

### Best Practices

#### 1. Separate Configurations
```json
// tsconfig.node.json
{
  "compilerOptions": {
    "lib": ["ES2022"],
    "target": "ES2022",
    "module": "CommonJS"
  }
}

// tsconfig.web.json
{
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "target": "ES2022"
  }
}
```

#### 2. Conditional Types for Cross-Platform
```typescript
// Shared types that work in both environments
type PlatformEvent<T> = T extends 'node' 
  ? NodeJS.EventEmitter 
  : Event;

// Usage
function createEvent<T extends 'node' | 'dom'>(
  platform: T
): PlatformEvent<T> {
  if (platform === 'node') {
    return new EventEmitter() as PlatformEvent<T>;
  } else {
    return new Event('custom') as PlatformEvent<T>;
  }
}
```

#### 3. Environment-Specific Declarations
```typescript
// types/node.d.ts
declare global {
  namespace NodeJS {
    interface Global {
      myNodeGlobal: string;
    }
  }
}

// types/dom.d.ts
declare global {
  interface Window {
    myDomGlobal: string;
  }
}
```

### React Native Considerations

React Native has its own environment that's neither pure Node nor DOM:

```json
{
  "compilerOptions": {
    "lib": ["ES2022"],
    "target": "ES2022"
  }
}
```

**Why avoid DOM in RN:**
- RN doesn't have DOM APIs
- Including DOM causes confusion
- RN has its own APIs (React Native specific)

### Modern Node.js Setup

```json
{
  "compilerOptions": {
    "lib": ["ES2022", "ES2022.Array", "ES2022.Object"],
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

### Debugging Lib Issues

#### Check Available Globals
```typescript
// This will show what's available
type AvailableGlobals = keyof typeof globalThis;

// Or check specific APIs
type HasProcess = typeof process;
type HasWindow = typeof window;
type HasDocument = typeof document;
```

#### TypeScript Compiler API
```typescript
import * as ts from 'typescript';

// Check what lib files are included
const program = ts.createProgram(['file.ts'], {
  lib: ['ES2022', 'DOM']
});

const sourceFile = program.getSourceFile('file.ts');
const libFiles = program.getLibFiles();
console.log(libFiles.map(f => f.fileName));
```

### Migration Strategies

#### From Mixed to Clean Separation
1. **Audit current usage:** Find DOM APIs in Node code
2. **Create separate configs:** Node vs DOM specific
3. **Use conditional compilation:** `/// <reference lib="..." />`
4. **Gradual migration:** Move shared code to separate packages

#### Example Migration
```typescript
// Before: Mixed environment
/// <reference lib="ES2022" />
/// <reference lib="DOM" />

// After: Environment-specific
// tsconfig.node.json
{
  "compilerOptions": {
    "lib": ["ES2022"]
  }
}

// tsconfig.web.json  
{
  "compilerOptions": {
    "lib": ["ES2022", "DOM"]
  }
}
```

### Summary

- **Node.js:** Use `ES2022` only, avoid `DOM`
- **Browser:** Use `ES2022` + `DOM` + `DOM.Iterable`
- **React Native:** Use `ES2022` only
- **Shared code:** Use conditional types and environment detection
- **Avoid mixing:** Prevents conflicts and reduces bundle size

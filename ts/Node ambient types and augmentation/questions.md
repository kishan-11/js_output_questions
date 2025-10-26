# Node Ambient Types & Augmentation - Questions

## 1. What are ambient types in TypeScript?

**Answer:**
Ambient types in TypeScript are type declarations that exist in the global scope without any implementation. They tell TypeScript about the shape of external JavaScript libraries, browser APIs, or Node.js globals that exist at runtime but don't have TypeScript definitions.

```typescript
// Ambient declaration for a global variable
declare var process: any;

// Ambient declaration for a module
declare module 'some-library' {
  export function doSomething(): void;
}
```

## 2. How does `@types/node` provide ambient types for Node.js?

**Answer:**
`@types/node` is a TypeScript declaration package that provides ambient type definitions for Node.js built-in modules and globals. It includes:

- Global objects like `process`, `Buffer`, `global`
- Built-in modules like `fs`, `path`, `crypto`
- Node.js-specific types and interfaces

```typescript
// These are provided by @types/node
process.env.NODE_ENV; // string | undefined
Buffer.from('hello'); // Buffer
global.setTimeout; // (callback: Function, ms: number) => NodeJS.Timeout
```

## 3. What is module augmentation and how do you use it?

**Answer:**
Module augmentation allows you to extend or modify existing module declarations. You use the `declare module` syntax to add new properties, methods, or types to existing modules.

```typescript
// Augmenting a third-party library
declare module 'express' {
  interface Request {
    user?: {
      id: string;
      name: string;
    };
  }
}

// Now you can use req.user in Express handlers
app.get('/profile', (req, res) => {
  if (req.user) {
    res.json({ name: req.user.name });
  }
});
```

## 4. How do you perform global augmentation in TypeScript?

**Answer:**
Global augmentation allows you to add new properties to the global scope. You use the `declare global` block to extend global interfaces or add new global variables.

```typescript
// Extending the global Window interface
declare global {
  interface Window {
    myCustomProperty: string;
  }
  
  var myGlobalVar: number;
}

// Now you can use these globally
window.myCustomProperty = 'hello';
console.log(myGlobalVar);
```

## 5. How do you augment Node.js ProcessEnv interface?

**Answer:**
You can extend the `ProcessEnv` interface to add type safety for your environment variables:

```typescript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      DATABASE_URL: string;
      API_KEY: string;
    }
  }
}

// Now process.env has proper typing
const port = process.env.PORT; // string | undefined
const nodeEnv = process.env.NODE_ENV; // 'development' | 'production' | 'test' | undefined
```

## 6. What's the difference between ambient declarations and regular type declarations?

**Answer:**

| Ambient Declarations | Regular Type Declarations |
|---------------------|---------------------------|
| Use `declare` keyword | No `declare` keyword needed |
| No implementation | Must have implementation |
| Global scope by default | Scoped to module/file |
| Used for external libraries | Used for your own code |
| Tell TypeScript "this exists" | Tell TypeScript "this is how it works" |

```typescript
// Ambient declaration (no implementation)
declare function externalLibraryFunction(): void;

// Regular type declaration (with implementation)
function myFunction(): void {
  console.log('Hello');
}
```

## 7. How do you create ambient declarations for global variables?

**Answer:**
Use the `declare` keyword with `var`, `let`, or `const` to create ambient declarations for global variables:

```typescript
// Global variable declarations
declare var globalVar: string;
declare let globalLet: number;
declare const globalConst: boolean;

// Global function declarations
declare function globalFunction(param: string): number;

// Global class declarations
declare class GlobalClass {
  constructor(value: string);
  method(): void;
}
```

## 8. How do you augment existing interfaces in third-party libraries?

**Answer:**
You can extend interfaces from third-party libraries using module augmentation:

```typescript
// Augmenting a library's interface
declare module 'some-library' {
  interface Config {
    newProperty: string;
    optionalMethod?(): void;
  }
}

// Augmenting multiple interfaces in the same module
declare module 'express' {
  interface Request {
    user?: User;
    session?: Session;
  }
  
  interface Response {
    locals: {
      user?: User;
    };
  }
}
```

## 9. What are namespace augmentations and how do you use them?

**Answer:**
Namespace augmentations allow you to add new properties to existing namespaces. This is commonly used with Node.js types:

```typescript
// Augmenting NodeJS namespace
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CUSTOM_VAR: string;
    }
    
    interface Global {
      myGlobalFunction(): void;
    }
  }
}

// You can also augment other namespaces
declare module 'some-library' {
  namespace Utils {
    function newUtility(): void;
  }
}
```

## 10. How do you handle conflicting ambient declarations?

**Answer:**
When you have conflicting ambient declarations, TypeScript will merge them if they're compatible, or throw an error if they're incompatible:

```typescript
// These will merge successfully
declare module 'my-module' {
  interface Config {
    prop1: string;
  }
}

declare module 'my-module' {
  interface Config {
    prop2: number;
  }
}

// Result: Config has both prop1 and prop2

// This will cause an error
declare module 'my-module' {
  interface Config {
    prop1: string;
  }
}

declare module 'my-module' {
  interface Config {
    prop1: number; // Error: conflicting types
  }
}
```

## 11. How do you create ambient declarations for modules that don't have types?

**Answer:**
For modules without type definitions, you can create ambient declarations:

```typescript
// For a module with no types
declare module 'legacy-library' {
  export function doSomething(param: string): number;
  export class LegacyClass {
    constructor(value: any);
    method(): void;
  }
  export const CONSTANT: string;
}

// For a module you want to treat as any
declare module 'untyped-module';

// For JSON modules
declare module '*.json' {
  const value: any;
  export default value;
}
```

## 12. What's the difference between `declare global` and `declare module`?

**Answer:**

| `declare global` | `declare module` |
|-------------------|------------------|
| Augments global scope | Augments specific module |
| Available everywhere | Only in that module's context |
| Uses `declare global {}` | Uses `declare module 'module-name' {}` |
| For global variables/interfaces | For third-party library types |

```typescript
// Global augmentation
declare global {
  interface Window {
    myGlobal: string;
  }
}

// Module augmentation
declare module 'express' {
  interface Request {
    user: User;
  }
}
```

## 13. How do you create ambient declarations for custom global properties?

**Answer:**
You can add custom properties to the global scope using ambient declarations:

```typescript
// Adding to global object
declare global {
  var myGlobalVar: string;
  function myGlobalFunction(): void;
  
  namespace MyGlobal {
    interface Config {
      setting: string;
    }
  }
}

// Adding to window object (browser)
declare global {
  interface Window {
    myCustomAPI: {
      method(): void;
    };
  }
}

// Usage
global.myGlobalVar = 'hello';
window.myCustomAPI.method();
```

## 14. How do you handle ambient declarations in different environments (Node.js vs Browser)?

**Answer:**
You can use conditional compilation and environment-specific declarations:

```typescript
// Node.js specific
declare global {
  namespace NodeJS {
    interface Global {
      nodeSpecificVar: string;
    }
  }
}

// Browser specific
declare global {
  interface Window {
    browserSpecificVar: string;
  }
}

// Environment-specific module augmentation
declare module 'my-module' {
  interface Config {
    // Common properties
    baseUrl: string;
  }
}

// Node.js specific augmentation
declare module 'my-module' {
  interface Config {
    nodeSpecific?: string;
  }
}

// Browser specific augmentation
declare module 'my-module' {
  interface Config {
    browserSpecific?: string;
  }
}
```

## 15. What are the best practices for ambient declarations?

**Answer:**

1. **Keep declarations minimal**: Only declare what you actually use
2. **Use proper typing**: Avoid `any` when possible
3. **Group related declarations**: Use namespaces for organization
4. **Document complex declarations**: Add comments for clarity
5. **Use module augmentation over global**: Prefer module-specific augmentations
6. **Version your declarations**: Keep track of library versions

```typescript
// Good: Specific and well-typed
declare module 'my-library' {
  interface Config {
    apiKey: string;
    timeout: number;
    retries?: number;
  }
  
  function initialize(config: Config): Promise<void>;
}

// Bad: Too broad and untyped
declare module 'my-library' {
  const anything: any;
  export = anything;
}
```

## 16. How do you test ambient declarations?

**Answer:**
You can test ambient declarations by creating test files that use the declared types:

```typescript
// test-ambient.ts
import { expect } from 'chai';

// Test that your ambient declarations work
describe('Ambient Declarations', () => {
  it('should have proper typing for process.env', () => {
    const nodeEnv = process.env.NODE_ENV; // Should be typed as string | undefined
    expect(typeof nodeEnv).to.be.oneOf(['string', 'undefined']);
  });
  
  it('should have proper typing for augmented interfaces', () => {
    // Test your augmented interfaces
    const config: MyLibrary.Config = {
      apiKey: 'test',
      timeout: 5000
    };
    expect(config.apiKey).to.be.a('string');
  });
});
```

## 17. How do you handle ambient declarations in a monorepo?

**Answer:**
In a monorepo, you can organize ambient declarations:

```typescript
// types/global.d.ts
declare global {
  namespace MyApp {
    interface Config {
      apiUrl: string;
      environment: 'dev' | 'prod';
    }
  }
}

// types/modules.d.ts
declare module 'shared-library' {
  interface SharedConfig {
    version: string;
  }
}

// types/index.d.ts
/// <reference path="./global.d.ts" />
/// <reference path="./modules.d.ts" />
```

## 18. What are the limitations of ambient declarations?

**Answer:**

1. **No runtime behavior**: They don't affect runtime, only compile-time
2. **No implementation**: You can't provide actual implementations
3. **Merge conflicts**: Conflicting declarations can cause errors
4. **Global pollution**: Can make code harder to understand
5. **Version compatibility**: Need to keep up with library changes
6. **Testing complexity**: Harder to mock and test

```typescript
// Limitation: Can't provide implementation
declare function externalFunction(): void;
// externalFunction(); // Runtime error if not actually available

// Limitation: Global scope pollution
declare global {
  var globalVar: string; // Available everywhere, can be confusing
}
```

## 19. How do you create ambient declarations for dynamic imports?

**Answer:**
You can create ambient declarations for dynamic imports and modules:

```typescript
// For dynamic imports
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// For dynamic imports with specific types
declare module 'dynamic-module' {
  interface DynamicConfig {
    load(): Promise<any>;
  }
  
  function createLoader(config: DynamicConfig): Promise<any>;
  export = createLoader;
}

// Usage
const module = await import('dynamic-module');
const loader = module({ load: () => fetch('/data') });
```

## 20. How do you handle ambient declarations for complex third-party libraries?

**Answer:**
For complex libraries, you can create comprehensive ambient declarations:

```typescript
// Complex library augmentation
declare module 'complex-library' {
  interface Options {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
    retries?: number;
  }
  
  interface Response<T = any> {
    data: T;
    status: number;
    message: string;
  }
  
  class Client {
    constructor(options: Options);
    get<T>(path: string): Promise<Response<T>>;
    post<T>(path: string, data: any): Promise<Response<T>>;
  }
  
  namespace Utils {
    function formatUrl(base: string, path: string): string;
    function parseResponse<T>(response: any): Response<T>;
  }
  
  export = Client;
}
```

This comprehensive questions file covers all the key concepts of Node ambient types and augmentation in TypeScript, from basic concepts to advanced usage patterns and best practices.

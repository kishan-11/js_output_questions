## Declaration Files (.d.ts)

### What are Declaration Files?
Declaration files (`.d.ts`) are TypeScript files that contain only type information. They describe the shape of JavaScript libraries, modules, or global variables without providing any runtime implementation.

### Key Concepts

#### 1. Ambient Declarations
Ambient declarations tell TypeScript about code that exists elsewhere (like JavaScript libraries).

```ts
// Global ambient declaration
declare global {
  interface Window {
    myCustomProperty: string;
  }
}

// Module ambient declaration
declare module 'my-library' {
  export function doSomething(): void;
  export const version: string;
}
```

#### 2. Types of Declaration Files

**Global Declaration Files:**
- Files that don't have import/export statements
- Automatically included in compilation
- Use `declare global` for global augmentations

**Module Declaration Files:**
- Files with import/export statements
- Must be explicitly imported or referenced
- Use `declare module` for module augmentation

#### 3. Creating vs Generating Declarations

**When to Create `.d.ts` files:**
- For JavaScript libraries without types
- For ambient global variables
- For module augmentation
- For complex type definitions that can't be inferred

**When to Generate Declarations:**
- For TypeScript projects you want to publish
- Use `tsc --declaration` to generate `.d.ts` files
- Automatically creates type definitions from your TypeScript code

#### 4. Module Augmentation
Safely extend existing modules without modifying their source:

```ts
// Augmenting a third-party module
declare module 'express' {
  interface Request {
    user?: {
      id: string;
      name: string;
    };
  }
}

// Augmenting global types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CUSTOM_VAR: string;
    }
  }
}
```

#### 5. Publishing Types

**Including Declaration Files:**
```json
// package.json
{
  "types": "./dist/index.d.ts",
  "main": "./dist/index.js",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  }
}
```

**TypeScript Configuration:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist"
  }
}
```

#### 6. TypeScript Configuration Options

**typeRoots:**
```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./custom-types"]
  }
}
```

**types:**
```json
{
  "compilerOptions": {
    "types": ["node", "jest", "express"]
  }
}
```

#### 7. Best Practices

**File Organization:**
- Use `.d.ts` for ambient declarations
- Use `index.d.ts` as entry point for type packages
- Group related types in separate files

**Naming Conventions:**
- Use PascalCase for interfaces and types
- Use camelCase for functions and variables
- Use UPPER_CASE for constants

**Common Patterns:**
```ts
// Conditional exports
declare module 'my-package' {
  export function create<T>(config: T): T;
  export default create;
}

// Namespace merging
declare namespace MyLibrary {
  interface Config {
    apiKey: string;
  }
}

// Generic constraints
declare module 'generic-lib' {
  export function process<T extends Record<string, any>>(data: T): T;
}
```

#### 8. Common Pitfalls

**Global Pollution:**
```ts
// ❌ Bad - pollutes global scope
declare var myGlobal: string;

// ✅ Good - use modules or namespaces
declare module 'my-module' {
  export const myGlobal: string;
}
```

**Module Resolution Issues:**
```ts
// ❌ Bad - incorrect module path
declare module 'wrong-path' { }

// ✅ Good - correct module path
declare module 'correct-path' { }
```

**Type Conflicts:**
```ts
// ❌ Bad - conflicting declarations
declare module 'lib' { export const x: string; }
declare module 'lib' { export const x: number; }

// ✅ Good - use module augmentation
declare module 'lib' {
  interface ExtendedInterface {
    newProperty: string;
  }
}
```



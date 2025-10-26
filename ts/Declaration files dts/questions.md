## Interview questions: Declaration files (.d.ts)

### 1. When do you create `.d.ts` files vs generating declarations from `.ts`?

**Creating `.d.ts` files manually:**
- For JavaScript libraries without TypeScript support
- For ambient global variables and browser APIs
- For module augmentation of third-party libraries
- For complex type definitions that can't be inferred

```ts
// Manual declaration for JS library
declare module 'lodash' {
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number
  ): T;
}

// Global ambient declaration
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}
```

**Generating declarations from `.ts`:**
- For TypeScript projects you want to publish
- Use `tsc --declaration` to auto-generate
- Automatically creates type definitions from your code

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

**When to choose each approach:**
- **Manual**: External JS libraries, global augmentations, complex ambient types
- **Generated**: Your own TypeScript code, libraries you maintain

### 2. How do you augment a third-party module safely? Show `declare module`.

Module augmentation allows you to extend existing modules without modifying their source code.

```ts
// Augmenting Express Request interface
declare module 'express' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: 'admin' | 'user';
    };
    session?: {
      cartId?: string;
      lastActivity: Date;
    };
  }
}

// Augmenting Node.js ProcessEnv
declare module 'process' {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

// Augmenting a library with new methods
declare module 'moment' {
  interface Moment {
    businessDays(): number;
    isBusinessDay(): boolean;
  }
}
```

**Best practices for module augmentation:**
- Use interface merging (not class extension)
- Be specific about what you're augmenting
- Avoid conflicting with existing properties
- Use namespace merging for complex augmentations

```ts
// ✅ Good - interface merging
declare module 'my-lib' {
  interface Config {
    newOption: string;
  }
}

// ❌ Bad - conflicting declarations
declare module 'my-lib' {
  export const existingProperty: string; // Conflicts with original
}
```

### 3. How do `typeRoots` and `types` influence global ambient types?

**typeRoots:**
Controls where TypeScript looks for type definitions.

```json
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./custom-types",
      "./src/types"
    ]
  }
}
```

**types:**
Explicitly includes only specified type packages.

```json
{
  "compilerOptions": {
    "types": ["node", "jest", "express"]
  }
}
```

**Key differences:**
- `typeRoots`: Adds directories to search path
- `types`: Restricts which packages are included (excludes others)
- Empty `types` array: No global types included

```ts
// With typeRoots: ["./custom-types"]
// TypeScript will find types in custom-types/ directory

// With types: ["node"]
// Only @types/node is included, other @types packages ignored

// With types: []
// No global types included at all
```

**Practical example:**
```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./src/ambient"],
    "types": ["node", "jest"]
  }
}
```

### 4. What are pitfalls of `declare global` and how do you isolate them?

**Common pitfalls:**

**1. Global namespace pollution:**
```ts
// ❌ Bad - pollutes global scope
declare global {
  var myGlobalVar: string;
  function myGlobalFunction(): void;
}

// ✅ Good - use modules or namespaces
declare global {
  namespace MyApp {
    interface Config {
      apiKey: string;
    }
  }
}
```

**2. Conflicting with existing globals:**
```ts
// ❌ Bad - might conflict with existing Window properties
declare global {
  interface Window {
    location: string; // Conflicts with existing location
  }
}

// ✅ Good - extend safely
declare global {
  interface Window {
    myCustomProperty: string;
  }
}
```

**3. Module context issues:**
```ts
// ❌ Bad - declare global in module without proper setup
declare global {
  var globalVar: string;
}

// ✅ Good - ensure module context
export {}; // Makes this a module
declare global {
  var globalVar: string;
}
```

**Isolation strategies:**

**1. Use namespaces:**
```ts
declare global {
  namespace MyApp {
    interface Config {
      apiKey: string;
    }
    const version: string;
  }
}
```

**2. Use modules instead:**
```ts
// Instead of global pollution
declare module 'my-app/globals' {
  export const config: {
    apiKey: string;
  };
}
```

**3. Conditional global declarations:**
```ts
declare global {
  interface Window {
    __DEV__?: boolean;
  }
}

// Only available in development
if (typeof window !== 'undefined' && window.__DEV__) {
  // Development-only code
}
```

### 5. How do you publish types in a package with `exports` fields?

**Modern package.json with exports field:**

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./utils": {
      "types": "./dist/utils.d.ts",
      "import": "./dist/utils.mjs",
      "require": "./dist/utils.js"
    }
  },
  "files": [
    "dist/**/*",
    "README.md"
  ]
}
```

**TypeScript configuration for publishing:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "module": "ESNext",
    "target": "ES2020",
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Directory structure:**
```
my-package/
├── src/
│   ├── index.ts
│   └── utils.ts
├── dist/
│   ├── index.d.ts
│   ├── index.d.ts.map
│   ├── index.js
│   ├── utils.d.ts
│   └── utils.js
├── package.json
└── tsconfig.json
```

**Advanced exports patterns:**

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./package.json": "./package.json",
    "./types": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/types/index.mjs",
      "require": "./dist/types/index.js"
    }
  }
}
```

**Best practices:**
- Always include `types` field in exports
- Use declaration maps for better debugging
- Test your package with `npm pack` before publishing
- Consider using `typesVersions` for multiple TypeScript versions

```json
{
  "typesVersions": {
    ">=3.1": {
      "*": ["dist/*"]
    }
  }
}
```


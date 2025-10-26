# Module Resolution & ESM/CJS Interop - Practice Questions

## Basic Concepts

### Q1: What's the difference between `module` and `moduleResolution` in tsconfig.json?

**Answer:**
- `module`: Specifies what module system TypeScript compiles to (ES2020, CommonJS, etc.)
- `moduleResolution`: Specifies how TypeScript resolves module imports ("node", "node16", "nodenext")

```json
{
  "compilerOptions": {
    "module": "ES2020",           // Output format
    "moduleResolution": "node16"  // Resolution strategy
  }
}
```

### Q2: What does `esModuleInterop: true` do?

**Answer:**
`esModuleInterop: true` enables synthetic default imports for CommonJS modules, allowing:

```typescript
// Instead of this (without esModuleInterop):
import * as React from 'react'

// You can do this:
import React from 'react'
```

It automatically sets `allowSyntheticDefaultImports: true` and provides better CommonJS compatibility.

### Q3: When should you use `moduleResolution: "node16"` vs `"node"`?

**Answer:**
- **`"node"`**: Classic resolution, good for older projects, supports both `.js` and `.ts` files
- **`"node16"`/`"nodenext"`**: Modern resolution for Node 16+, supports package.json `exports`/`imports`, requires file extensions

Use `"node16"` for new projects with modern Node.js and better ESM support.

## Package.json Configuration

### Q4: What's the difference between `"type": "module"` and `"type": "commonjs"` in package.json?

**Answer:**
```json
{
  "type": "module"    // Treats .js files as ES modules
}
// vs
{
  "type": "commonjs"  // Treats .js files as CommonJS (default)
}
```

- `"module"`: Enables ES module syntax by default
- `"commonjs"`: Uses require/module.exports syntax (Node.js default)

### Q5: How do you configure conditional exports in package.json?

**Answer:**
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils.mjs",
      "require": "./dist/utils.cjs"
    }
  }
}
```

This allows the same package to work with both ESM and CommonJS importers.

## Import/Export Issues

### Q6: Why might this import fail and how do you fix it?

```typescript
import React from 'react'
```

**Answer:**
This can fail if:
1. `esModuleInterop: false` and React is a CommonJS module
2. Missing file extensions with `moduleResolution: "node16"`

**Solutions:**
```typescript
// Option 1: Enable esModuleInterop
// tsconfig.json: "esModuleInterop": true

// Option 2: Use namespace import
import * as React from 'react'

// Option 3: Use require (CommonJS)
const React = require('react')
```

### Q7: What's wrong with this import and how do you fix it?

```typescript
import { utils } from './utils'
```

**Answer:**
With `moduleResolution: "node16"` or `"nodenext"`, you need file extensions:

```typescript
import { utils } from './utils.js'  // ✅ Correct
```

The `.js` extension is used even for TypeScript files because the compiler handles the mapping.

### Q8: How do you handle dynamic imports in both ESM and CommonJS?

**Answer:**
```typescript
// ES Modules
const module = await import('./module.js')

// CommonJS
const module = require('./module')

// Universal approach
const module = typeof require !== 'undefined' 
  ? require('./module') 
  : await import('./module.js')
```

## Path Resolution

### Q9: How do you configure path mapping in TypeScript?

**Answer:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/utils": ["src/utils/index.ts"]
    }
  }
}
```

Usage:
```typescript
import { Button } from '@/components/Button'
import { utils } from '@/utils'
```

### Q10: What's the difference between `exports` and `imports` in package.json?

**Answer:**
- **`exports`**: Defines what external consumers can import from your package
- **`imports`**: Defines internal module resolution for your own package

```json
{
  "exports": {
    ".": "./dist/index.js",           // External API
    "./utils": "./dist/utils.js"
  },
  "imports": {
    "#internal/*": "./src/internal/*"  // Internal modules
  }
}
```

Usage:
```typescript
// External consumers
import { utils } from 'my-package/utils'

// Internal usage
import { internal } from '#internal/helper'
```

## Advanced Scenarios

### Q11: How do you create a dual package that supports both ESM and CommonJS?

**Answer:**
1. **Build both formats:**
```json
{
  "scripts": {
    "build": "npm run build:esm && npm run build:cjs",
    "build:esm": "tsc --module ES2020 --outDir dist/esm",
    "build:cjs": "tsc --module CommonJS --outDir dist/cjs"
  }
}
```

2. **Configure package.json:**
```json
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/esm/index.d.ts"
    }
  },
  "main": "./dist/cjs/index.js"
}
```

### Q12: How do you handle TypeScript with ES modules in Node.js?

**Answer:**
**Option 1: ts-node with ESM loader**
```bash
node --loader ts-node/esm src/index.ts
```

**Option 2: tsx (recommended)**
```bash
npm install tsx
npx tsx src/index.ts
```

**Option 3: Compile first**
```bash
tsc
node dist/index.js
```

### Q13: What are the common pitfalls when migrating from CommonJS to ESM?

**Answer:**
1. **File extensions required:**
```typescript
// ❌ Fails with Node 16+
import { utils } from './utils'

// ✅ Correct
import { utils } from './utils.js'
```

2. **Dynamic imports are async:**
```typescript
// ❌ CommonJS style
const module = require('./module')

// ✅ ESM style
const module = await import('./module.js')
```

3. **Top-level await:**
```typescript
// ✅ Only works in ES modules
const data = await fetch('/api/data')
```

4. **Package.json type field:**
```json
{
  "type": "module"  // Required for .js files to be treated as ES modules
}
```

## Debugging and Tools

### Q14: How do you debug module resolution issues?

**Answer:**
1. **TypeScript trace resolution:**
```bash
tsc --traceResolution
```

2. **Check file extensions and paths**
3. **Verify package.json exports**
4. **Use Node.js module resolution:**
```bash
node --loader ts-node/esm src/index.ts
```

### Q15: What's the difference between `allowSyntheticDefaultImports` and `esModuleInterop`?

**Answer:**
- **`allowSyntheticDefaultImports`**: Allows default imports from modules without default exports
- **`esModuleInterop`**: Enables synthetic default imports AND provides better CommonJS compatibility

```typescript
// With allowSyntheticDefaultImports: true
import React from 'react'  // Works if React has default export

// With esModuleInterop: true
import React from 'react'  // Works even if React is CommonJS
```

`esModuleInterop` is more comprehensive and automatically sets `allowSyntheticDefaultImports`.

## Practical Exercises

### Q16: Create a tsconfig.json for a modern ESM project

**Answer:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node16",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Q17: How do you handle Jest testing with ES modules?

**Answer:**
```json
{
  "jest": {
    "preset": "ts-jest/presets/default-esm",
    "extensionsToTreatAsEsm": [".ts"],
    "globals": {
      "ts-jest": {
        "useESM": true
      }
    }
  }
}
```

Or use Vitest (ESM-first):
```json
{
  "scripts": {
    "test": "vitest"
  },
  "devDependencies": {
    "vitest": "^1.0.0"
  }
}
```

### Q18: What's the correct way to import a CommonJS module in an ES module?

**Answer:**
```typescript
// ✅ Default import (with esModuleInterop)
import express from 'express'

// ✅ Namespace import
import * as express from 'express'

// ✅ Destructured import
import { Router } from 'express'

// ❌ Don't use require in ES modules
// const express = require('express')  // This won't work in ES modules
```

### Q19: How do you handle circular dependencies in ES modules?

**Answer:**
ES modules handle circular dependencies better than CommonJS, but you should still avoid them:

```typescript
// ❌ Avoid circular dependencies
// fileA.ts
import { funcB } from './fileB.js'
export const funcA = () => funcB()

// fileB.ts  
import { funcA } from './fileA.js'  // Circular!
export const funcB = () => funcA()

// ✅ Better approach - extract shared logic
// shared.ts
export const sharedLogic = () => { /* ... */ }

// fileA.ts
import { sharedLogic } from './shared.js'
export const funcA = () => sharedLogic()

// fileB.ts
import { sharedLogic } from './shared.js'
export const funcB = () => sharedLogic()
```

### Q20: How do you create a library that works with both ESM and CommonJS consumers?

**Answer:**
1. **Build both formats:**
```json
{
  "scripts": {
    "build": "npm run build:esm && npm run build:cjs",
    "build:esm": "tsc --module ES2020 --outDir dist/esm",
    "build:cjs": "tsc --module CommonJS --outDir dist/cjs"
  }
}
```

2. **Package.json configuration:**
```json
{
  "name": "my-library",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/esm/index.d.ts"
    }
  },
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/esm/index.d.ts"
}
```

3. **Test both import styles:**
```typescript
// ESM consumer
import { myFunction } from 'my-library'

// CommonJS consumer  
const { myFunction } = require('my-library')
```

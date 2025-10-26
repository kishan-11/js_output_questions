# Module Resolution & ESM/CJS Interop

## Overview
Module resolution in TypeScript involves how TypeScript finds and loads modules, while ESM/CJS interop deals with the compatibility between ES Modules and CommonJS modules.

## Module Resolution Strategies

### 1. TypeScript Module Resolution Options

#### `moduleResolution: "node"`
- Classic Node.js resolution algorithm
- Looks for files in `node_modules`
- Supports both `.js` and `.ts` files
- Default for most projects

#### `moduleResolution: "node16"` / `"nodenext"`
- Modern Node.js resolution (Node 16+)
- Supports package.json `exports` and `imports` fields
- Stricter about file extensions
- Better ESM support

### 2. Module System Configuration

#### `module` vs Runtime
```json
{
  "compilerOptions": {
    "module": "ES2020",        // What TypeScript compiles to
    "moduleResolution": "node" // How TypeScript resolves modules
  }
}
```

#### Package.json `type` Field
```json
{
  "type": "module"    // Treats .js files as ES modules
}
// or
{
  "type": "commonjs"  // Treats .js files as CommonJS (default)
}
```

## ESM/CJS Interop Settings

### 1. `esModuleInterop: true`
- Enables synthetic default imports for CommonJS modules
- Allows `import React from 'react'` instead of `import * as React from 'react'`
- Automatically sets `allowSyntheticDefaultImports: true`

### 2. `allowSyntheticDefaultImports: true`
- Allows default imports from modules without default exports
- Works with `esModuleInterop: false`

### 3. `allowImportingTsExtensions: true`
- Allows importing `.ts` files directly
- Requires `noEmit: true` or custom bundler

## Import Path Resolution

### 1. File Extensions
```typescript
// With moduleResolution: "node16" or "nodenext"
import { foo } from './module.js'  // Must include .js extension
import { bar } from './module.mjs'  // For ES modules
```

### 2. Package.json Exports/Imports
```json
{
  "exports": {
    ".": "./dist/index.js",
    "./utils": "./dist/utils.js",
    "./package.json": "./package.json"
  },
  "imports": {
    "#internal/*": "./src/internal/*"
  }
}
```

### 3. Path Mapping
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"]
    }
  }
}
```

## Common Patterns and Pitfalls

### 1. Default Import Issues
```typescript
// ❌ Problematic with CommonJS modules
import React from 'react'  // May fail without esModuleInterop

// ✅ Correct approaches
import * as React from 'react'
// or with esModuleInterop: true
import React from 'react'
```

### 2. Dynamic Imports
```typescript
// ES Modules
const module = await import('./module.js')

// CommonJS
const module = require('./module')
```

### 3. Conditional Exports
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

## Best Practices

### 1. Project Setup
- Use `moduleResolution: "node16"` or `"nodenext"` for new projects
- Set `type: "module"` in package.json for ESM-first projects
- Enable `esModuleInterop: true` for better CJS compatibility

### 2. File Extensions
- Always include file extensions in imports for Node 16+ resolution
- Use `.js` extensions even for TypeScript files (compiler handles this)

### 3. Type Definitions
- Provide separate `.d.ts` files for different module formats
- Use conditional exports for dual package support

### 4. Tooling Alignment
- Ensure TypeScript settings match your bundler (Webpack, Vite, etc.)
- Use `ts-node` with `--esm` flag for ES module support
- Consider `tsx` for modern TypeScript execution

## Runtime Considerations

### Node.js
- Node 16+ has better ESM support
- Use `--loader ts-node/esm` for TypeScript ES modules
- Consider `tsx` for simpler execution

### Bundlers
- Webpack 5 has improved ESM support
- Vite is ESM-first by design
- Rollup handles both formats well

### Testing
- Jest requires additional configuration for ESM
- Vitest is ESM-first and works well with TypeScript
- Use `@swc/jest` for faster TypeScript compilation

## Migration Strategies

### From CommonJS to ESM
1. Set `type: "module"` in package.json
2. Update import/export syntax
3. Add file extensions to imports
4. Update build tools and test runners
5. Handle dynamic imports properly

### Dual Package Support
1. Build both ESM and CJS versions
2. Use conditional exports
3. Provide separate type definitions
4. Test both import styles

## Debugging Module Issues

### Common Errors
- "Cannot find module" - Check file extensions and paths
- "Module not found" - Verify package.json exports
- Import/export mismatches - Check module format compatibility

### Tools
- `tsc --traceResolution` - Debug module resolution
- `node --loader ts-node/esm` - Run TypeScript as ES modules
- Package.json `exports` field validator tools


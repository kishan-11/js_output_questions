# TypeScript tsconfig.json Options - Complete Guide

## Overview
The `tsconfig.json` file is the configuration file for TypeScript projects. It controls how TypeScript compiles your code, what features are enabled, and how modules are resolved.

## Core Configuration Categories

### 1. Strictness Options
These options control how strict TypeScript is with type checking.

#### `strict` (boolean)
- **Default**: `false`
- **Purpose**: Enables all strict type checking options
- **Effect**: When `true`, enables: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitReturns`, `noFallthroughCasesInSwitch`

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

#### `noImplicitAny` (boolean)
- **Default**: `false` (unless `strict` is `true`)
- **Purpose**: Raises error on expressions and declarations with an implied `any` type
- **Example**:
```typescript
// Error with noImplicitAny: true
function add(a, b) { // 'a' and 'b' have implicit 'any' type
  return a + b;
}
```

#### `strictNullChecks` (boolean)
- **Default**: `false` (unless `strict` is `true`)
- **Purpose**: Enables strict null checks
- **Effect**: `null` and `undefined` are not assignable to any type except themselves and `any`

```typescript
// Error with strictNullChecks: true
let x: number = null; // Error: Type 'null' is not assignable to type 'number'
```

#### `noUncheckedIndexedAccess` (boolean)
- **Default**: `false`
- **Purpose**: Adds `undefined` to the type of index signatures
- **Effect**: Array and object access returns `T | undefined`

```typescript
// With noUncheckedIndexedAccess: true
const arr: number[] = [1, 2, 3];
const item = arr[0]; // Type: number | undefined
```

### 2. Module Resolution & Interop

#### `module` (string)
- **Options**: `"none"`, `"commonjs"`, `"amd"`, `"system"`, `"umd"`, `"es6"`, `"es2015"`, `"es2020"`, `"es2022"`, `"esnext"`, `"node16"`, `"nodenext"`
- **Purpose**: Specifies the module code generation
- **Common Values**:
  - `"commonjs"`: For Node.js applications
  - `"es6"`/`"es2015"`: For modern browsers with ES6 support
  - `"esnext"`: Latest ES features

#### `moduleResolution` (string)
- **Options**: `"node"`, `"classic"`, `"node16"`, `"nodenext"`
- **Purpose**: Specifies how TypeScript resolves modules
- **Node16/NodeNext**: Modern Node.js resolution with ESM support

```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "node"
  }
}
```

#### `esModuleInterop` (boolean)
- **Default**: `false`
- **Purpose**: Enables interoperability between CommonJS and ES modules
- **Effect**: Allows default imports from CommonJS modules

```typescript
// With esModuleInterop: true
import React from 'react'; // Works even if React is CommonJS
```

#### `allowSyntheticDefaultImports` (boolean)
- **Default**: `false`
- **Purpose**: Allows default imports from modules with no default export
- **Effect**: Works with `esModuleInterop` for better module compatibility

### 3. Target & Libraries

#### `target` (string)
- **Options**: `"es3"`, `"es5"`, `"es6"`/`"es2015"`, `"es2017"`, `"es2018"`, `"es2019"`, `"es2020"`, `"es2021"`, `"es2022"`, `"esnext"`
- **Purpose**: Specifies the ECMAScript target version
- **Effect**: Determines which JavaScript features can be used

```json
{
  "compilerOptions": {
    "target": "es2020" // Modern JavaScript features
  }
}
```

#### `lib` (string[])
- **Purpose**: Specifies which library files to include
- **Common Values**: `["dom"]`, `["dom.iterable"]`, `["es6"]`, `["es2020"]`
- **Effect**: Determines which built-in types and APIs are available

```json
{
  "compilerOptions": {
    "lib": ["es2020", "dom", "dom.iterable"]
  }
}
```

#### `downlevelIteration` (boolean)
- **Default**: `false`
- **Purpose**: Provides more accurate iteration behavior for older targets
- **Effect**: Better support for `for...of` loops in ES5

### 4. Project Structure

#### `baseUrl` (string)
- **Purpose**: Base directory for resolving non-relative module names
- **Effect**: Allows absolute imports from project root

```json
{
  "compilerOptions": {
    "baseUrl": "./src"
  }
}
```

#### `paths` (object)
- **Purpose**: Maps module names to locations
- **Effect**: Enables path mapping for cleaner imports

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/utils/*": ["utils/*"]
    }
  }
}
```

#### `composite` (boolean)
- **Default**: `false`
- **Purpose**: Enables project references for TypeScript projects
- **Effect**: Allows building multiple TypeScript projects together

#### `references` (array)
- **Purpose**: References to other TypeScript projects
- **Effect**: Enables project references for monorepos

```json
{
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/ui" }
  ]
}
```

#### `skipLibCheck` (boolean)
- **Default**: `false`
- **Purpose**: Skip type checking of declaration files
- **Effect**: Faster compilation, but less type safety

### 5. Node.js & ESM Support

#### `moduleResolution: "node16"` or `"nodenext"`
- **Purpose**: Modern Node.js module resolution
- **Effect**: Supports both CommonJS and ESM in the same project
- **Requirements**: Requires `module: "node16"` or `"nodenext"`

#### `types` (string[])
- **Purpose**: Specifies which `@types` packages to include
- **Effect**: Limits type checking to specified packages

```json
{
  "compilerOptions": {
    "types": ["node", "jest"]
  }
}
```

#### `typeRoots` (string[])
- **Purpose**: Specifies directories for type definitions
- **Effect**: Custom locations for `@types` packages

```json
{
  "compilerOptions": {
    "typeRoots": ["./types", "./node_modules/@types"]
  }
}
```

### 6. Additional Important Options

#### `declaration` (boolean)
- **Default**: `false`
- **Purpose**: Generates corresponding `.d.ts` files
- **Effect**: Creates type declaration files for libraries

#### `declarationMap` (boolean)
- **Default**: `false`
- **Purpose**: Generates source maps for declaration files
- **Effect**: Better debugging experience for library consumers

#### `sourceMap` (boolean)
- **Default**: `false`
- **Purpose**: Generates source map files
- **Effect**: Enables debugging of original TypeScript code

#### `outDir` (string)
- **Purpose**: Specifies output directory for compiled files
- **Effect**: Organizes compiled JavaScript files

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

#### `rootDir` (string)
- **Purpose**: Specifies the root directory of input files
- **Effect**: Controls the structure of output files

#### `removeComments` (boolean)
- **Default**: `false`
- **Purpose**: Removes comments from output files
- **Effect**: Smaller bundle size

#### `noEmit` (boolean)
- **Default**: `false`
- **Purpose**: Prevents TypeScript from emitting files
- **Effect**: Type checking only, no compilation

#### `noEmitOnError` (boolean)
- **Default**: `false`
- **Purpose**: Prevents emitting files if any errors are reported
- **Effect**: Ensures clean builds

## Common Configuration Patterns

### Modern Node.js Application
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### Modern Browser Application
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["es2020", "dom", "dom.iterable"]
  }
}
```

### Library Development
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### Monorepo with Project References
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "composite": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/ui" }
  ]
}
```

## Best Practices

1. **Always use `strict: true`** for new projects
2. **Use `noUncheckedIndexedAccess`** for better array/object safety
3. **Configure `paths`** for cleaner imports
4. **Use `composite` and `references`** for monorepos
5. **Set appropriate `target`** based on your deployment environment
6. **Use `skipLibCheck: true`** for faster compilation in development
7. **Enable `sourceMap`** for better debugging experience



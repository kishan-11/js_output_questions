# TypeScript tsconfig.json Options - Questions & Answers

## Basic Configuration Questions

### Q1: What is the difference between `strict: true` and enabling individual strict options?
**Answer:**
`strict: true` is a shorthand that enables all strict type checking options at once. When you set `strict: true`, it automatically enables:
- `noImplicitAny`
- `strictNullChecks`
- `strictFunctionTypes`
- `strictBindCallApply`
- `strictPropertyInitialization`
- `noImplicitReturns`
- `noFallthroughCasesInSwitch`

If you want more granular control, you can set `strict: false` and enable individual options. However, it's recommended to use `strict: true` for new projects as it provides the best type safety.

### Q2: What happens when you set `noImplicitAny: true`?
**Answer:**
With `noImplicitAny: true`, TypeScript will raise an error whenever it cannot infer a type and would default to `any`. This helps catch potential type issues early.

```typescript
// Error with noImplicitAny: true
function processData(data) { // Error: Parameter 'data' implicitly has 'any' type
  return data.toString();
}

// Fix: Add explicit type
function processData(data: string) {
  return data.toString();
}
```

### Q3: How does `strictNullChecks` affect your code?
**Answer:**
`strictNullChecks` makes `null` and `undefined` not assignable to any type except themselves and `any`. This prevents common runtime errors.

```typescript
// With strictNullChecks: false (default)
let name: string = null; // No error

// With strictNullChecks: true
let name: string = null; // Error: Type 'null' is not assignable to type 'string'

// Fix: Use union type
let name: string | null = null;
```

## Module Resolution Questions

### Q4: What's the difference between `moduleResolution: "node"` and `"node16"`?
**Answer:**
- `"node"`: Classic Node.js resolution, supports CommonJS and basic ESM
- `"node16"`: Modern Node.js resolution with full ESM support, respects `package.json` type field

```json
// Classic resolution
{
  "moduleResolution": "node",
  "module": "commonjs"
}

// Modern resolution with ESM support
{
  "moduleResolution": "node16",
  "module": "node16"
}
```

### Q5: When should you use `esModuleInterop`?
**Answer:**
Use `esModuleInterop` when you need to import CommonJS modules using ES6 import syntax. It's especially useful when working with libraries that haven't fully migrated to ESM.

```typescript
// Without esModuleInterop
import * as React from 'react'; // Required syntax

// With esModuleInterop: true
import React from 'react'; // Cleaner syntax
```

### Q6: What's the difference between `module: "esnext"` and `"es2020"`?
**Answer:**
- `"esnext"`: Uses the latest ECMAScript features available
- `"es2020"`: Uses features from ECMAScript 2020 specification

`"esnext"` is more future-proof but may not be supported by all environments, while `"es2020"` provides a stable target.

## Target and Libraries Questions

### Q7: How do you choose the right `target` value?
**Answer:**
Choose based on your deployment environment:
- `"es5"`: For older browsers (IE11 support)
- `"es2015"`: For modern browsers with ES6 support
- `"es2020"`: For current browsers and Node.js 14+
- `"esnext"`: For cutting-edge environments

```json
{
  "compilerOptions": {
    "target": "es2020" // Good balance of features and compatibility
  }
}
```

### Q8: What does the `lib` option control?
**Answer:**
The `lib` option specifies which built-in library files to include, determining what global types and APIs are available.

```json
{
  "compilerOptions": {
    "lib": ["es2020", "dom", "dom.iterable"] // ES2020 + DOM APIs
  }
}
```

Common combinations:
- `["es2020", "dom"]`: Browser applications
- `["es2020"]`: Node.js applications
- `["es2020", "webworker"]`: Web Worker applications

## Project Structure Questions

### Q9: How do `baseUrl` and `paths` work together?
**Answer:**
`baseUrl` sets the base directory for module resolution, while `paths` provides path mapping for cleaner imports.

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

This allows:
```typescript
// Instead of: import { Button } from '../../../components/Button'
import { Button } from '@/components/Button'
```

### Q10: When should you use `composite: true`?
**Answer:**
Use `composite: true` for:
- Monorepos with multiple TypeScript projects
- Projects that will be referenced by other projects
- When you want incremental compilation

```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "./dist"
  }
}
```

### Q11: What are project references and how do they work?
**Answer:**
Project references allow TypeScript to understand dependencies between projects in a monorepo.

```json
{
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/ui" }
  ]
}
```

Benefits:
- Incremental compilation
- Better IDE support
- Dependency tracking

## Advanced Configuration Questions

### Q12: What's the difference between `declaration` and `declarationMap`?
**Answer:**
- `declaration`: Generates `.d.ts` files for type definitions
- `declarationMap`: Generates source maps for declaration files

```json
{
  "compilerOptions": {
    "declaration": true,        // Creates .d.ts files
    "declarationMap": true      // Creates .d.ts.map files
  }
}
```

Use both for library development to provide better debugging experience.

### Q13: When should you use `skipLibCheck: true`?
**Answer:**
Use `skipLibCheck: true` when:
- You want faster compilation
- You trust your dependencies' type definitions
- You're in development mode

**Trade-off**: Faster compilation vs. less type safety

### Q14: What does `noUncheckedIndexedAccess` do?
**Answer:**
`noUncheckedIndexedAccess` adds `undefined` to the type of index signatures, making array and object access safer.

```typescript
// Without noUncheckedIndexedAccess
const arr: number[] = [1, 2, 3];
const item = arr[0]; // Type: number

// With noUncheckedIndexedAccess: true
const arr: number[] = [1, 2, 3];
const item = arr[0]; // Type: number | undefined
```

### Q15: How do you configure TypeScript for a Node.js library?
**Answer:**
For a Node.js library, use this configuration:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Q16: What's the difference between `module: "node16"` and `"nodenext"`?
**Answer:**
- `"node16"`: Uses Node.js 16 module resolution
- `"nodenext"`: Uses the latest Node.js module resolution

Both support ESM and CommonJS in the same project, but `"nodenext"` is more future-proof.

### Q17: How do you configure TypeScript for a React application?
**Answer:**
For a React application:

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
    "lib": ["es2020", "dom", "dom.iterable"],
    "jsx": "react-jsx"
  }
}
```

### Q18: What does `forceConsistentCasingInFileNames` do?
**Answer:**
`forceConsistentCasingInFileNames` ensures that file names in imports match the actual file system casing. This prevents issues when deploying to case-sensitive file systems.

```typescript
// Error with forceConsistentCasingInFileNames: true
import { Button } from './Components/Button' // Wrong casing
// Should be: import { Button } from './components/Button'
```

### Q19: When should you use `noEmit: true`?
**Answer:**
Use `noEmit: true` when:
- You only want type checking (no compilation)
- Using TypeScript with other build tools (Babel, Webpack)
- In CI/CD for type checking only

```json
{
  "compilerOptions": {
    "noEmit": true,
    "strict": true
  }
}
```

### Q20: How do you configure TypeScript for a monorepo?
**Answer:**
For a monorepo, use project references:

**Root tsconfig.json:**
```json
{
  "files": [],
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/ui" },
    { "path": "./apps/web" }
  ]
}
```

**Package tsconfig.json:**
```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "references": [
    { "path": "../shared" }
  ]
}
```

## Troubleshooting Questions

### Q21: Why am I getting "Cannot find module" errors?
**Answer:**
Common causes:
1. **Wrong `moduleResolution`**: Use `"node"` for most cases
2. **Missing `baseUrl`**: Set `baseUrl` for absolute imports
3. **Incorrect `paths`**: Check path mapping configuration
4. **Missing dependencies**: Install required packages

### Q22: How do you debug TypeScript compilation issues?
**Answer:**
1. **Use `--verbose` flag**: `tsc --verbose`
2. **Check `tsconfig.json`**: Validate configuration
3. **Use `--listFiles`**: See which files are included
4. **Enable `sourceMap`**: For better debugging
5. **Check `include`/`exclude`**: Ensure files are included

### Q23: What's the difference between `include` and `files` in tsconfig.json?
**Answer:**
- `files`: Explicitly lists files to include
- `include`: Uses glob patterns to include files

```json
{
  "files": ["src/index.ts"], // Explicit files
  "include": ["src/**/*"],   // Glob pattern
  "exclude": ["node_modules", "dist"] // Exclude patterns
}
```

Use `files` for explicit control, `include` for pattern-based inclusion.

### Q24: How do you optimize TypeScript compilation speed?
**Answer:**
1. **Use `skipLibCheck: true`**: Skip type checking of declaration files
2. **Enable `incremental: true`**: Use incremental compilation
3. **Use `composite: true`**: For project references
4. **Set appropriate `target`**: Don't use unnecessarily old targets
5. **Exclude unnecessary files**: Use `exclude` patterns

### Q25: What's the difference between `types` and `typeRoots`?
**Answer:**
- `types`: Specifies which `@types` packages to include
- `typeRoots`: Specifies directories to search for type definitions

```json
{
  "compilerOptions": {
    "types": ["node", "jest"], // Only include these types
    "typeRoots": ["./types", "./node_modules/@types"] // Search these directories
  }
}
```

Use `types` to limit type checking, `typeRoots` to add custom type locations.

# Interview Questions: Deep Partial / Recursive

## 1. Implement `DeepPartial<T>` and discuss pitfalls for arrays, maps, and sets.

### Answer:

**Basic Implementation:**
```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
```

**Enhanced Implementation with Edge Cases:**
```ts
// Helper to identify plain objects
type IsObject<T> = T extends object 
  ? T extends any[] 
    ? false 
    : T extends Function 
      ? false 
      : T extends Date 
        ? false 
        : T extends RegExp 
          ? false 
          : T extends Map<any, any>
            ? false
            : T extends Set<any>
              ? false
              : true 
  : false

type DeepPartial<T> = {
  [K in keyof T]?: IsObject<T[K]> extends true ? DeepPartial<T[K]> : T[K]
}
```

**Pitfalls and Solutions:**

1. **Arrays**: Basic implementation makes arrays optional
   ```ts
   // Problem
   type Bad = DeepPartial<{ items: string[] }> // { items?: string[] }
   
   // Solution
   type DeepPartialArray<T> = {
     [K in keyof T]?: T[K] extends (infer U)[]
       ? U extends object ? DeepPartial<U>[] : T[K]
       : T[K] extends object ? DeepPartial<T[K]> : T[K]
   }
   ```

2. **Maps and Sets**: These should not be deep-partialized
   ```ts
   interface Data {
     map: Map<string, number>
     set: Set<string>
     nested: { value: string }
   }
   
   // Maps and Sets remain as-is, only nested objects get partialized
   type PartialData = DeepPartial<Data>
   // Result: { map?: Map<string, number>, set?: Set<string>, nested?: { value?: string } }
   ```

3. **Functions**: Should not be deep-partialized
   ```ts
   interface Config {
     handler: (x: number) => string
     nested: { value: string }
   }
   // Functions remain unchanged, nested objects get partialized
   ```

## 2. How to selectively deep-partialize by key path? Provide a type-level approach.

### Answer:

**Approach 1: Single Key Path**
```ts
type DeepPartialByPath<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Usage
interface User {
  id: number
  profile: { name: string; address: { street: string } }
  settings: { theme: string }
}

type PartialProfile = DeepPartialByPath<User, 'profile'>
// Result: { id: number; profile?: { name?: string; address?: { street?: string } }; settings: { theme: string } }
```

**Approach 2: Multiple Key Paths**
```ts
type DeepPartialByPaths<T, K extends keyof T> = {
  [P in keyof T]: P extends K 
    ? T[P] extends object 
      ? DeepPartial<T[P]> 
      : T[P]
    : T[P]
}

type PartialUser = DeepPartialByPaths<User, 'profile' | 'settings'>
```

**Approach 3: Nested Key Paths**
```ts
type DeepPartialByNestedPath<T, Path extends string> = 
  Path extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? Omit<T, K> & {
          [P in K]: T[P] extends object 
            ? DeepPartialByNestedPath<T[P], Rest>
            : T[P]
        }
      : T
    : T extends object 
      ? DeepPartial<T>
      : T

// Usage
type PartialAddress = DeepPartialByNestedPath<User, 'profile.address'>
```

## 3. When does deep typing cause performance issues and how to mitigate?

### Answer:

**Performance Issues:**

1. **Compilation Time**: Deep recursion on large types can slow down TypeScript compilation
2. **Memory Usage**: Complex type operations consume significant memory
3. **IntelliSense**: IDE performance can degrade with deeply nested types
4. **Type Checking**: Complex types increase type checking time

**Mitigation Strategies:**

1. **Depth Limiting**
   ```ts
   type SafeDeepPartial<T, Depth extends number = 5> = 
     Depth extends 0 
       ? T 
       : {
           [K in keyof T]?: IsObject<T[K]> extends true 
             ? SafeDeepPartial<T[K], Prev<Depth>>
             : T[K]
         }
   
   type Prev<T extends number> = T extends 0 ? never : T extends 1 ? 0 : T extends 2 ? 1 : never
   ```

2. **Selective Deep Partial**
   ```ts
   // Only deep partial specific properties
   type SelectiveDeepPartial<T, Keys extends keyof T> = {
     [K in keyof T]: K extends Keys 
       ? T[K] extends object ? DeepPartial<T[K]> : T[K]
       : T[K]
   }
   ```

3. **Lazy Evaluation**
   ```ts
   // Use conditional types to avoid unnecessary computation
   type LazyDeepPartial<T> = T extends object 
     ? { [K in keyof T]?: LazyDeepPartial<T[K]> }
     : T
   ```

4. **Type Caching**
   ```ts
   // Cache intermediate types
   type CachedDeepPartial<T> = T extends infer U 
     ? { [K in keyof U]?: CachedDeepPartial<U[K]> }
     : never
   ```

## 4. Compare runtime recursive merges vs type-only deep partials.

### Answer:

**Runtime Recursive Merges:**
```ts
function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const result = { ...target }
  
  for (const key in source) {
    if (source[key] !== undefined) {
      if (typeof source[key] === 'object' && source[key] !== null) {
        result[key] = deepMerge(target[key], source[key] as any)
      } else {
        result[key] = source[key] as any
      }
    }
  }
  
  return result
}

// Usage
const user = { id: 1, profile: { name: 'John', age: 30 } }
const updates = { profile: { name: 'Jane' } }
const merged = deepMerge(user, updates)
```

**Type-Only Deep Partials:**
```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

// Usage - only provides type safety, no runtime behavior
function updateUser(user: User, updates: DeepPartial<User>): User {
  return { ...user, ...updates } // Simple shallow merge
}
```

**Comparison:**

| Aspect | Runtime Recursive | Type-Only |
|--------|------------------|-----------|
| **Type Safety** | ✅ Full type safety | ✅ Full type safety |
| **Runtime Behavior** | ✅ Actual deep merging | ❌ No deep merging |
| **Performance** | ❌ Slower (recursive) | ✅ Fast (shallow) |
| **Bundle Size** | ❌ Larger (runtime code) | ✅ No runtime overhead |
| **Flexibility** | ✅ Configurable merge logic | ❌ Fixed behavior |
| **Debugging** | ❌ Harder to debug | ✅ Easier to debug |

**When to Use Each:**

- **Runtime Recursive**: When you need actual deep merging behavior
- **Type-Only**: When you only need type safety for shallow operations

## 5. How to test deep types with `tsd` or `dtslint`?

### Answer:

**Using tsd (TypeScript Definition Tester):**

```ts
import { expectType, expectError } from 'tsd'

// Test basic functionality
interface TestInterface {
  a: string
  b: {
    c: number
    d: {
      e: boolean
    }
  }
}

type TestDeepPartial = DeepPartial<TestInterface>

// Test valid assignments
expectType<TestDeepPartial>({
  a: 'test',
  b: {
    c: 1,
    d: {
      e: true
    }
  }
})

expectType<TestDeepPartial>({
  b: {
    c: 1
  }
})

expectType<TestDeepPartial>({})

// Test invalid assignments
expectError<TestDeepPartial>({
  a: 123 // Should be string
})

expectError<TestDeepPartial>({
  b: {
    c: 'not a number' // Should be number
  }
})
```

**Using dtslint:**

```ts
// test.d.ts
import { DeepPartial } from './index'

interface Test {
  a: string
  b: { c: number }
}

// Test type assignments
const valid: DeepPartial<Test> = {
  a: 'test',
  b: { c: 1 }
}

const partial: DeepPartial<Test> = {
  b: { c: 1 }
}

const empty: DeepPartial<Test> = {}

// Test error cases
const invalid: DeepPartial<Test> = {
  a: 123 // $ExpectError
}

const invalidNested: DeepPartial<Test> = {
  b: { c: 'string' } // $ExpectError
}
```

**Advanced Testing Patterns:**

```ts
// Test array handling
interface WithArray {
  items: string[]
  nested: { items: number[] }
}

type ArrayTest = DeepPartial<WithArray>

expectType<ArrayTest>({
  items: ['a', 'b'],
  nested: { items: [1, 2] }
})

// Test edge cases
interface EdgeCases {
  func: () => void
  date: Date
  regex: RegExp
  map: Map<string, number>
  set: Set<string>
}

type EdgeTest = DeepPartial<EdgeCases>

expectType<EdgeTest>({
  func: () => {},
  date: new Date(),
  regex: /test/,
  map: new Map(),
  set: new Set()
})
```

**Testing Performance:**

```ts
// Test with large interfaces
interface LargeInterface {
  level1: {
    level2: {
      level3: {
        level4: {
          level5: {
            value: string
          }
        }
      }
    }
  }
}

// This should not cause performance issues
type LargeTest = DeepPartial<LargeInterface>
expectType<LargeTest>({})
```


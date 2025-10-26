# Deep Partial / Recursive Types

## Overview

Deep Partial types are utility types that make all properties of an object (and nested objects) optional recursively. Unlike the built-in `Partial<T>` which only makes the top-level properties optional, `DeepPartial<T>` traverses the entire object structure.

## Basic Implementation

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
```

## Enhanced Implementation with Edge Cases

```ts
// Helper type to check if something is a plain object
type IsObject<T> = T extends object 
  ? T extends any[] 
    ? false 
    : T extends Function 
      ? false 
      : T extends Date 
        ? false 
        : T extends RegExp 
          ? false 
          : true 
  : false

// More robust DeepPartial
type DeepPartial<T> = {
  [K in keyof T]?: IsObject<T[K]> extends true ? DeepPartial<T[K]> : T[K]
}
```

## Advanced Patterns

### 1. Selective Deep Partial by Key Path

```ts
type DeepPartialByPath<T, K extends string> = K extends keyof T
  ? Omit<T, K> & { [P in K]?: DeepPartial<T[P]> }
  : T

// Usage
interface User {
  id: number
  profile: {
    name: string
    address: {
      street: string
      city: string
    }
  }
  settings: {
    theme: string
    notifications: boolean
  }
}

type PartialUserProfile = DeepPartialByPath<User, 'profile'>
```

### 2. Deep Partial with Array Handling

```ts
type DeepPartialArray<T> = {
  [K in keyof T]?: T[K] extends (infer U)[]
    ? DeepPartialArray<U>[]
    : T[K] extends object
      ? DeepPartialArray<T[K]>
      : T[K]
}
```

### 3. Conditional Deep Partial

```ts
type ConditionalDeepPartial<T, Condition> = {
  [K in keyof T]: T[K] extends Condition 
    ? DeepPartial<T[K]> 
    : T[K]
}
```

## Use Cases

### 1. API Update Operations
```ts
interface User {
  id: number
  name: string
  profile: {
    bio: string
    avatar: string
    preferences: {
      theme: string
      language: string
    }
  }
}

// For PATCH requests
type UserUpdate = DeepPartial<User>

const updateUser = (id: number, updates: UserUpdate) => {
  // Only update provided fields
}
```

### 2. Form State Management
```ts
interface FormData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
  }
  address: {
    street: string
    city: string
    country: string
  }
}

type FormState = DeepPartial<FormData>
```

### 3. Configuration Objects
```ts
interface AppConfig {
  database: {
    host: string
    port: number
    credentials: {
      username: string
      password: string
    }
  }
  features: {
    auth: boolean
    analytics: boolean
  }
}

type PartialConfig = DeepPartial<AppConfig>
```

## Common Pitfalls and Solutions

### 1. Array Handling
```ts
// Problem: Arrays become optional arrays
type BadDeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

// Solution: Handle arrays specially
type GoodDeepPartial<T> = {
  [K in keyof T]?: T[K] extends (infer U)[]
    ? U extends object
      ? DeepPartial<U>[]
      : T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
}
```

### 2. Primitive Type Distribution
```ts
// Problem: Primitives get distributed
type Problematic<T> = T extends object ? DeepPartial<T> : T

// Solution: Use helper type
type IsObject<T> = T extends object 
  ? T extends any[] 
    ? false 
    : T extends Function 
      ? false 
      : T extends Date 
        ? false 
        : T extends RegExp 
          ? false 
          : true 
  : false
```

### 3. Performance Issues
```ts
// Avoid deep recursion on large types
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

## Testing Deep Types

### Using tsd
```ts
import { expectType } from 'tsd'

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
```

## Performance Considerations

1. **Recursion Depth**: Deep types can cause performance issues with deeply nested objects
2. **Type Complexity**: Large interfaces with many properties can slow down compilation
3. **Memory Usage**: Complex type operations consume more memory during compilation

## Best Practices

1. **Use depth limits** for very deep object structures
2. **Prefer specific partial types** over generic deep partials when possible
3. **Test type correctness** with tools like tsd or dtslint
4. **Consider runtime alternatives** for very complex scenarios
5. **Document type constraints** and limitations



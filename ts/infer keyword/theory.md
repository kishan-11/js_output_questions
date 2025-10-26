# The `infer` Keyword in TypeScript

## Overview

The `infer` keyword is a powerful TypeScript feature that allows you to **capture and extract types** from other types within conditional type expressions. It's primarily used to "reverse engineer" types from complex type structures.

## Syntax and Basic Usage

```ts
type ExtractType<T> = T extends Promise<infer U> ? U : never;
```

The `infer` keyword can only be used:
- Inside conditional types (`T extends ... ? ... : ...`)
- In the `extends` clause of a conditional type
- To declare a new type variable that will be inferred

## Key Concepts

### 1. Position-Based Inference
`infer` captures types from specific positions in type structures:

```ts
// Infer from function parameters
type FirstParameter<T> = T extends (arg: infer P) => any ? P : never;

// Infer from function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Infer from array/tuple elements
type ArrayElement<T> = T extends (infer U)[] ? U : never;
```

### 2. Multiple Inference Points
You can use multiple `infer` declarations in a single conditional type:

```ts
type FunctionInfo<T> = T extends (a: infer A, b: infer B) => infer R 
  ? { firstParam: A; secondParam: B; returnType: R } 
  : never;
```

### 3. Recursive Type Unwrapping
Common pattern for unwrapping nested types:

```ts
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

// Usage
type Result = Awaited<Promise<Promise<string>>>; // string
```

## Common Use Cases

### 1. Built-in Utility Types Implementation

```ts
// Parameters<T> - Extract function parameters
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

// ReturnType<T> - Extract return type
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// ConstructorParameters<T> - Extract constructor parameters
type MyConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;
```

### 2. Array and Tuple Manipulation

```ts
// Get first element type
type Head<T> = T extends [infer H, ...any[]] ? H : never;

// Get last element type
type Tail<T> = T extends [...any[], infer L] ? L : never;

// Remove first element
type Rest<T> = T extends [any, ...infer R] ? R : never;
```

### 3. Promise and Async Types

```ts
// Unwrap Promise types recursively
type UnwrapPromise<T> = T extends Promise<infer U> ? UnwrapPromise<U> : T;

// Extract resolved value from async function
type AsyncReturn<T> = T extends (...args: any[]) => Promise<infer R> ? R : never;
```

## Advanced Patterns

### 1. Conditional Inference Based on Structure

```ts
type ExtractFromArray<T> = T extends (infer U)[] 
  ? U 
  : T extends readonly (infer U)[] 
  ? U 
  : never;

type ExtractFromTuple<T> = T extends [infer U, ...any[]] ? U : never;
```

### 2. Nested Type Extraction

```ts
type DeepArrayElement<T> = T extends (infer U)[] 
  ? U extends (infer V)[] 
    ? DeepArrayElement<V> 
    : U 
  : T;
```

### 3. Function Overload Resolution

```ts
type OverloadReturn<T> = T extends {
  (...args: any[]): infer R;
} ? R : never;
```

## Limitations and Gotchas

### 1. Inference Scope
`infer` only works within the conditional type where it's declared:

```ts
// ❌ This won't work - infer is scoped to the conditional
type BadExample<T> = T extends Promise<infer U> ? U : U; // Error: U is not defined

// ✅ Correct approach
type GoodExample<T> = T extends Promise<infer U> ? U : never;
```

### 2. Ambiguous Inference
When TypeScript can't determine a unique type, it may infer `unknown`:

```ts
type Ambiguous<T> = T extends (infer U)[] ? U : never;
type Result = Ambiguous<any[]>; // unknown
```

### 3. Covariance and Contravariance
Be aware of variance when inferring function types:

```ts
type Contravariant<T> = T extends (x: infer U) => any ? U : never;
type Covariant<T> = T extends () => infer U ? U : never;
```

## Best Practices

1. **Be Specific**: Use precise type constraints to avoid overly broad inference
2. **Handle Edge Cases**: Always provide fallback types (usually `never`)
3. **Test with Real Types**: Verify your inference works with actual TypeScript types
4. **Use Recursion Carefully**: Avoid infinite recursion in recursive type definitions
5. **Document Complex Types**: Add comments for complex inference logic

## Real-World Examples

### 1. API Response Type Extraction

```ts
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

type ExtractApiData<T> = T extends ApiResponse<infer D> ? D : never;

type UserData = ExtractApiData<ApiResponse<{ id: number; name: string }>>;
// Result: { id: number; name: string }
```

### 2. Event Handler Type Extraction

```ts
type EventHandler<T> = (event: T) => void;

type ExtractEventType<T> = T extends EventHandler<infer E> ? E : never;

type ClickEvent = ExtractEventType<EventHandler<{ x: number; y: number }>>;
// Result: { x: number; y: number }
```

### 3. Generic Constraint Inference

```ts
type ExtractGeneric<T> = T extends Array<infer U> 
  ? U extends string 
    ? 'string-array' 
    : 'other-array' 
  : 'not-array';

type Test1 = ExtractGeneric<string[]>; // 'string-array'
type Test2 = ExtractGeneric<number[]>; // 'other-array'
type Test3 = ExtractGeneric<string>;    // 'not-array'
```

## Summary

The `infer` keyword is essential for:
- **Type manipulation**: Extracting types from complex structures
- **Utility type creation**: Building reusable type utilities
- **API design**: Creating flexible, type-safe APIs
- **Advanced TypeScript patterns**: Implementing sophisticated type logic

Mastering `infer` opens up powerful possibilities for creating reusable, type-safe code that can adapt to various input types while maintaining compile-time safety.



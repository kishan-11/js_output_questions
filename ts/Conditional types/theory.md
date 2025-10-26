# Conditional Types

## What are Conditional Types?

Conditional types allow you to express non-uniform type mappings. They take the form `T extends U ? X : Y`, where the type is `X` if `T` is assignable to `U`, otherwise `Y`.

## Basic Syntax

```ts
T extends U ? X : Y
```

- `T` is the type being checked
- `U` is the type to check against
- `X` is the type if condition is true
- `Y` is the type if condition is false

## Key Concepts

### 1. Distributive Conditional Types

When the checked type is a naked type parameter, conditional types are **distributive** over union types:

```ts
type ToArray<T> = T extends any ? T[] : never;

// This distributes over the union
type StrArrOrNumArr = ToArray<string | number>; // string[] | number[]
```

**Preventing Distribution:**
```ts
// Wrap in square brackets to prevent distribution
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type StrOrNumArr = ToArrayNonDist<string | number>; // (string | number)[]
```

### 2. The `infer` Keyword

`infer` allows you to extract types from other types:

```ts
// Extract return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract array element type
type ElementType<T> = T extends (infer U)[] ? U : T;

// Extract promise type
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;
```

### 3. Practical Examples

#### Utility Types Implementation
```ts
// NonNullable - remove null and undefined
type NonNullable<T> = T extends null | undefined ? never : T;

// Exclude - remove specific types
type Exclude<T, U> = T extends U ? never : T;

// Extract - keep only specific types
type Extract<T, U> = T extends U ? T : never;

// Pick - select specific properties
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit - exclude specific properties
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

#### Advanced Examples
```ts
// Flatten array types
type Flatten<T> = T extends (infer U)[] ? Flatten<U> : T;

// Get function parameters
type Parameters<T extends (...args: any) => any> = 
  T extends (...args: infer P) => any ? P : never;

// Get constructor parameters
type ConstructorParameters<T extends new (...args: any) => any> = 
  T extends new (...args: infer P) => any ? P : never;
```

### 4. Common Patterns

#### Type Guards with Conditional Types
```ts
type IsArray<T> = T extends any[] ? true : false;
type IsString<T> = T extends string ? true : false;
```

#### Recursive Types
```ts
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

#### Template Literal Types with Conditionals
```ts
type EventName<T extends string> = T extends `on${infer U}` ? U : never;
type ClickEvent = EventName<'onClick'>; // 'Click'
```

## Common Pitfalls

### 1. Unexpected Distribution
```ts
// This might not work as expected
type MyType<T> = T extends string ? T : never;
type Result = MyType<string | number>; // string (distributed)
```

### 2. Never Type Evaluation
```ts
// This can result in 'never' unexpectedly
type Problematic<T> = T extends never ? true : false;
type Test = Problematic<never>; // never (not true!)
```

### 3. Circular References
```ts
// Avoid infinite recursion
type BadRecursive<T> = T extends any ? BadRecursive<T> : never;
```

## Best Practices

1. **Use square brackets to prevent distribution when needed**
2. **Be careful with `never` types in conditionals**
3. **Test edge cases like `never`, `any`, and union types**
4. **Use `infer` to extract types from complex structures**
5. **Combine with mapped types for powerful transformations**

## Interview Focus Areas

- **Distributivity**: When and why it happens, how to prevent it
- **Infer keyword**: Usage patterns and limitations
- **Utility type implementation**: Building common utility types
- **Edge cases**: Handling `never`, `any`, and complex unions
- **Performance**: Avoiding infinite recursion and complex evaluations



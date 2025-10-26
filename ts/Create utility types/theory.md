## Creating Utility Types

Creating utility types is a fundamental skill in TypeScript that demonstrates deep understanding of the type system. By reimplementing built-in utilities, you learn the mechanics of conditional types, mapped types, and type manipulation.

### Core Concepts

#### 1. Conditional Types
The foundation of most utility types:
```ts
type MyExclude<T, U> = T extends U ? never : T
type MyExtract<T, U> = T extends U ? T : never
type MyNonNullable<T> = T extends null | undefined ? never : T
```

#### 2. Mapped Types
For transforming object types:
```ts
type MyPartial<T> = {
  [P in keyof T]?: T[P]
}

type MyRequired<T> = {
  [P in keyof T]-?: T[P]
}

type MyReadonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

#### 3. Combining Techniques
Advanced utilities combine multiple concepts:
```ts
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

### Advanced Utility Types

#### Deep Utilities
Recursive type manipulation:
```ts
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}
```

#### Union Manipulation
```ts
type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never
```

#### Variance Control
```ts
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

type Immutable<T> = {
  readonly [P in keyof T]: T[P]
}
```

### Key Principles

#### 1. Distributivity Control
Conditional types distribute over union types by default:
```ts
// This distributes: (string extends string ? never : string) | (number extends string ? never : number)
type MyExclude<T, U> = T extends U ? never : T

// To prevent distribution, wrap in array:
type NonDistributive<T> = [T] extends [U] ? X : Y
```

#### 2. Template Literal Types
For string manipulation:
```ts
type Capitalize<S extends string> = S extends `${infer F}${infer R}` 
  ? `${Uppercase<F>}${R}` 
  : S

type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${P1}${Uppercase<P2>}${CamelCase<P3>}`
  : S
```

#### 3. Recursive Types
For deep transformations:
```ts
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object 
    ? T[P] extends any[] 
      ? T[P] 
      : DeepPartial<T[P]> 
    : T[P]
}
```

### Performance Considerations

#### When to Avoid Deep Utilities
- **Recursive depth**: TypeScript has recursion limits (default ~50)
- **Complex unions**: Large unions can cause exponential type checking
- **Circular references**: Can cause infinite recursion
- **Large object types**: Deep utilities on large objects are slow

#### Optimization Strategies
```ts
// Use shallow utilities when possible
type ShallowPartial<T> = {
  [P in keyof T]?: T[P]
}

// Limit recursion depth
type DeepPartial<T, D extends number = 3> = 
  D extends 0 ? T : {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P], Prev<D>> : T[P]
  }
```

### Common Patterns

#### 1. Key Manipulation
```ts
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]
```

#### 2. Type Guards
```ts
type IsArray<T> = T extends any[] ? true : false
type IsFunction<T> = T extends (...args: any[]) => any ? true : false
```

#### 3. Utility Combinations
```ts
type NonNullableKeys<T> = {
  [K in keyof T]: T[K] extends null | undefined ? never : K
}[keyof T]

type PickNonNullable<T> = Pick<T, NonNullableKeys<T>>
```

### Best Practices

1. **Start Simple**: Begin with basic conditional and mapped types
2. **Test Edge Cases**: Handle `never`, `any`, `unknown` appropriately
3. **Control Distribution**: Use `[T] extends [U]` to prevent unwanted distribution
4. **Limit Recursion**: Set reasonable depth limits for recursive types
5. **Document Complex Types**: Add comments for intricate type logic
6. **Consider Performance**: Avoid deep utilities on large types
7. **Use Constraints**: Leverage `extends` to ensure type safety

### Debugging Tips

```ts
// Use this to inspect types during development
type Debug<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

// Check if a type is never
type IsNever<T> = [T] extends [never] ? true : false

// Get the type of a property
type PropType<T, K extends keyof T> = T[K]
```



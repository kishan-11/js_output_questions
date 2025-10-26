## Interview questions: Creating utility types

### 1. Re-implement `Omit`, `Extract`, and `NonNullable` from first principles.

**Answer:**

```ts
// Extract: Get types from T that are assignable to U
type MyExtract<T, U> = T extends U ? T : never

// Example usage:
type Result1 = MyExtract<string | number | boolean, string | number> // string | number

// NonNullable: Remove null and undefined from T
type MyNonNullable<T> = T extends null | undefined ? never : T

// Example usage:
type Result2 = MyNonNullable<string | null | undefined> // string

// Omit: Remove properties K from T
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

// Alternative implementation using mapped types:
type MyOmit2<T, K extends keyof any> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}

// Example usage:
interface User {
  id: number
  name: string
  email: string
  password: string
}

type PublicUser = MyOmit<User, 'password'> // { id: number; name: string; email: string }
```

**Key Concepts:**
- `Extract` uses conditional types with `extends` to filter union members
- `NonNullable` uses conditional types to exclude null/undefined
- `Omit` combines `Pick` and `Exclude` to remove specific keys
- The alternative `Omit` implementation uses mapped types with key remapping (`as`)

### 2. How do you write `DeepPartial<T>` and control array handling separately?

**Answer:**

```ts
// Basic DeepPartial - makes all properties optional recursively
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Enhanced version with array handling
type DeepPartialWithArrays<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends any[] // Check if it's an array
      ? T[P] // Keep arrays as-is (don't make array elements optional)
      : DeepPartialWithArrays<T[P]> // Recurse for objects
    : T[P] // Keep primitives as-is
}

// More sophisticated version with different array strategies
type DeepPartialArraysOptional<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends any[]
      ? Partial<T[P]> // Make array elements optional
      : DeepPartialArraysOptional<T[P]>
    : T[P]
}

// Version that preserves array structure but makes elements partial
type DeepPartialPreserveArrays<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends (infer U)[] // Extract array element type
      ? DeepPartialPreserveArrays<U>[] // Recurse on element type, keep array structure
      : DeepPartialPreserveArrays<T[P]>
    : T[P]
}

// Example usage:
interface NestedData {
  user: {
    profile: {
      name: string
      age: number
      hobbies: string[]
    }
    posts: Array<{
      title: string
      content: string
      tags: string[]
    }>
  }
  settings: {
    theme: string
    notifications: boolean[]
  }
}

type PartialNested = DeepPartialWithArrays<NestedData>
// Result: All properties optional, arrays remain as arrays but elements can be partial
```

**Key Points:**
- Use `extends any[]` to detect arrays
- Choose strategy: keep arrays intact, make elements optional, or recurse into elements
- Consider performance implications of deep recursion
- Handle edge cases like `never`, `any`, and circular references

### 3. Show a `UnionToIntersection` implementation; explain why it works.

**Answer:**

```ts
// UnionToIntersection: Convert union to intersection
type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

// Example usage:
type Union = string | number | boolean
type Intersection = UnionToIntersection<Union> // string & number & boolean (never)

// More practical example:
type Functions = (() => string) | (() => number) | (() => boolean)
type IntersectedFunctions = UnionToIntersection<Functions> // (() => string) & (() => number) & (() => boolean)

// How it works:
// 1. (U extends any ? (k: U) => void : never) - This distributes over the union
//    For U = A | B | C, this becomes:
//    ((k: A) => void) | ((k: B) => void) | ((k: C) => void)
//
// 2. This union of functions extends (k: infer I) => void
//    TypeScript infers I as the intersection of all parameter types
//    So I becomes A & B & C

// Alternative implementation using function overloads:
type UnionToIntersection2<U> = 
  (U extends any ? (x: U) => any : never) extends (x: infer I) => any ? I : never

// Practical use case - getting the last type in a union:
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never

type Last = LastOf<'a' | 'b' | 'c'> // 'c'

// Another use case - getting all possible keys from a union of objects:
type AllKeys<T> = UnionToIntersection<T extends any ? keyof T : never>

interface A { a: string }
interface B { b: number }
interface C { c: boolean }

type AllKeysResult = AllKeys<A | B | C> // 'a' & 'b' & 'c' (never, since no key exists in all)
```

**Why it works:**
1. **Distribution**: `U extends any` distributes the conditional over each union member
2. **Function Contravariance**: Function parameters are contravariant - a function that accepts `A & B` can be assigned to a function that accepts `A` or `B`
3. **Inference**: TypeScript infers the intersection type when matching the distributed union against the target function signature
4. **Contravariance Magic**: The contravariant nature of function parameters flips the union into an intersection

### 4. Implement a `Mutable<T>` utility; explain variance implications.

**Answer:**

```ts
// Mutable: Remove readonly modifiers from all properties
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

// More comprehensive version that handles nested readonly
type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P]
}

// Example usage:
interface ReadonlyUser {
  readonly id: number
  readonly name: string
  readonly profile: {
    readonly age: number
    readonly email: string
  }
}

type MutableUser = Mutable<ReadonlyUser>
// Result: { id: number; name: string; profile: { age: number; email: string } }

type DeepMutableUser = DeepMutable<ReadonlyUser>
// Result: { id: number; name: string; profile: { age: number; email: string } }

// Variance implications:
interface Source {
  readonly data: string
}

interface Target {
  data: string
}

// Covariance example
type Covariant<T> = { value: T }
let covariant: Covariant<Source> = { value: { data: 'test' } }
let covariantTarget: Covariant<Target> = covariant // ✅ Works - covariant is safe

// Contravariance example  
type Contravariant<T> = (x: T) => void
let contravariant: Contravariant<Target> = (x) => console.log(x.data)
let contravariantSource: Contravariant<Source> = contravariant // ❌ Error - not safe

// Invariance example
type Invariant<T> = { value: T; setValue: (x: T) => void }
let invariant: Invariant<Source> = { 
  value: { data: 'test' }, 
  setValue: (x) => console.log(x.data) 
}
// let invariantTarget: Invariant<Target> = invariant // ❌ Error - not safe
```

**Variance Implications:**

1. **Covariance** (read-only positions): `Source` can be assigned to `Target` if `Source` is more specific
2. **Contravariance** (write-only positions): `Target` can be assigned to `Source` if `Target` is more general  
3. **Invariance** (read-write positions): Types must be exactly the same

**Key Points:**
- `Mutable<T>` removes readonly modifiers, making types more permissive
- This can break type safety if the original readonly constraints were intentional
- Use carefully - consider if the readonly constraints serve a purpose
- Deep mutable versions can have significant performance implications

### 5. When to avoid deep utilities due to performance of the checker?

**Answer:**

```ts
// Performance problems with deep utilities:

// 1. Recursion depth limits (default ~50 levels)
type DeepRecursive<T, Depth extends number = 0> = 
  Depth extends 50 ? T : {
    [P in keyof T]: T[P] extends object ? DeepRecursive<T[P], Add<Depth, 1>> : T[P]
  }

// 2. Exponential type checking with large unions
type LargeUnion = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j'
type ProcessedUnion = LargeUnion extends string ? `prefix_${LargeUnion}` : never
// This creates 2^n combinations for n union members

// 3. Circular references cause infinite recursion
interface Circular {
  self: Circular
}
type DeepPartialCircular<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartialCircular<T[P]> : T[P]
}
// type Test = DeepPartialCircular<Circular> // ❌ Infinite recursion

// 4. Large object types with many properties
interface LargeObject {
  prop1: string
  prop2: number
  prop3: boolean
  // ... 100+ more properties
}
// type DeepPartialLarge = DeepPartial<LargeObject> // Very slow

// When to avoid deep utilities:

// ❌ Avoid: Deep utilities on large types
type Avoid1 = DeepPartial<VeryLargeInterface>

// ❌ Avoid: Deep utilities with circular references  
type Avoid2 = DeepPartial<CircularReference>

// ❌ Avoid: Deep utilities in hot paths
function processData<T>(data: T): DeepPartial<T> { // Slow!
  return data as any
}

// ✅ Better: Shallow utilities when possible
type ShallowPartial<T> = {
  [P in keyof T]?: T[P]
}

// ✅ Better: Targeted deep utilities
type DeepPartialKeys<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// ✅ Better: Depth-limited recursion
type DeepPartialLimited<T, D extends number = 3> = 
  D extends 0 ? T : {
    [P in keyof T]?: T[P] extends object ? DeepPartialLimited<T[P], Prev<D>> : T[P]
  }

// Performance optimization strategies:

// 1. Use shallow utilities when possible
type OptimizedPartial<T> = {
  [P in keyof T]?: T[P]
}

// 2. Limit recursion depth
type SafeDeepPartial<T, D extends number = 5> = 
  D extends 0 ? T : {
    [P in keyof T]?: T[P] extends object ? SafeDeepPartial<T[P], Prev<D>> : T[P]
  }

// 3. Use conditional types to avoid unnecessary recursion
type SmartDeepPartial<T> = T extends object
  ? T extends any[] 
    ? T // Don't recurse into arrays
    : { [P in keyof T]?: SmartDeepPartial<T[P]> }
  : T

// 4. Cache expensive computations
type CachedDeepPartial<T> = T extends infer U ? {
  [P in keyof U]?: U[P] extends object ? CachedDeepPartial<U[P]> : U[P]
} : never
```

**Performance Guidelines:**

1. **Avoid deep utilities on:**
   - Large interfaces (50+ properties)
   - Types with circular references
   - Very deep object hierarchies (10+ levels)
   - Hot code paths (frequently called functions)

2. **Use alternatives:**
   - Shallow utilities when possible
   - Targeted deep utilities for specific keys
   - Depth-limited recursion
   - Conditional types to avoid unnecessary work

3. **Monitor performance:**
   - Use TypeScript's `--incremental` flag
   - Profile type checking times
   - Consider breaking large types into smaller ones
   - Use type assertions for performance-critical paths

4. **Best practices:**
   - Start with shallow utilities
   - Add depth only when necessary
   - Test with realistic data sizes
   - Document performance implications


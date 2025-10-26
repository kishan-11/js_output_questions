## Interview questions: Deep Readonly

### 1. Implement `DeepReadonly<T>`; handle arrays and tuples correctly.

**Answer:**

```ts
// Basic implementation
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// Enhanced implementation with proper array/tuple handling
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T[P] extends readonly (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T[P] extends [infer U, ...infer Rest]
    ? readonly [DeepReadonly<U>, ...DeepReadonly<Rest>]
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}

// Example usage
interface Data {
  name: string
  items: string[]
  coordinates: [number, number]
  nested: {
    value: number
    tags: string[]
  }
}

type ImmutableData = DeepReadonly<Data>
// Results in:
// {
//   readonly name: string
//   readonly items: ReadonlyArray<string>
//   readonly coordinates: readonly [number, number]
//   readonly nested: {
//     readonly value: number
//     readonly tags: ReadonlyArray<string>
//   }
// }
```

### 2. How to brand a deeply readonly type to prevent casting back?

**Answer:**

```ts
// Branded readonly type
type BrandedReadonly<T> = T & { readonly __brand: unique symbol }

type DeepReadonly<T> = BrandedReadonly<{
  readonly [P in keyof T]: T[P] extends (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}>

// Usage
interface User {
  name: string
  age: number
}

type ImmutableUser = DeepReadonly<User>

// This prevents casting back to mutable
function processUser(user: ImmutableUser) {
  // user is branded, can't be cast back to mutable User
  // const mutableUser: User = user // Error: Type 'ImmutableUser' is not assignable to 'User'
}

// Alternative approach with branded symbol
declare const __immutable: unique symbol
type Immutable<T> = T & { readonly [__immutable]: true }

type DeepReadonly<T> = Immutable<{
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}>
```

### 3. When should APIs accept readonly arrays vs mutable arrays?

**Answer:**

**Use ReadonlyArray when:**
- **Input parameters**: Functions that don't modify the array
- **Return values**: When returning data that shouldn't be modified
- **API responses**: Data fetched from external sources
- **Configuration**: Settings that shouldn't change
- **State snapshots**: Historical or cached state

```ts
// Good: Accept readonly for input
function calculateSum(numbers: ReadonlyArray<number>): number {
  return numbers.reduce((sum, num) => sum + num, 0)
}

// Good: Return readonly for immutable data
function getUsers(): ReadonlyArray<User> {
  return fetchUsers() // Returns immutable user list
}

// Good: Configuration objects
interface Config {
  readonly apiUrl: string
  readonly features: ReadonlyArray<string>
}
```

**Use mutable arrays when:**
- **Internal processing**: When you need to modify the array
- **Builder patterns**: When constructing objects step by step
- **Performance critical**: When avoiding array copying is important
- **Third-party integration**: When libraries expect mutable arrays

```ts
// Good: Internal processing
function processItems(items: Item[]): Item[] {
  const processed: Item[] = []
  for (const item of items) {
    processed.push(transform(item))
  }
  return processed
}

// Good: Builder pattern
class QueryBuilder {
  private conditions: string[] = []
  
  where(condition: string): this {
    this.conditions.push(condition)
    return this
  }
}
```

### 4. How do you express immutability at type level vs runtime level?

**Answer:**

**Type Level (Compile-time):**
```ts
// TypeScript readonly modifiers
interface ImmutableUser {
  readonly name: string
  readonly age: number
  readonly address: {
    readonly street: string
    readonly city: string
  }
}

// Deep readonly utility
type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> }

// Const assertions
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} as const
// Results in: { readonly apiUrl: 'https://api.example.com', readonly timeout: 5000 }
```

**Runtime Level:**
```ts
// Object.freeze() - shallow immutability
const user = Object.freeze({
  name: 'John',
  age: 30,
  address: { street: '123 Main St', city: 'NYC' }
})

// Deep freeze implementation
function deepFreeze<T>(obj: T): Readonly<T> {
  Object.freeze(obj)
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = (obj as any)[prop]
    if (value && typeof value === 'object') {
      deepFreeze(value)
    }
  })
  return obj
}

// Immutable.js library
import { Map, List } from 'immutable'

const state = Map({
  users: List([{ name: 'John' }, { name: 'Jane' }]),
  loading: false
})

// Immer for immutable updates
import { produce } from 'immer'

const newState = produce(state, draft => {
  draft.users.push({ name: 'Bob' })
})
```

**Key Differences:**
- **Type level**: Prevents compilation, no runtime cost, can be bypassed with type assertions
- **Runtime level**: Actual immutability, has performance cost, cannot be bypassed

### 5. What are tradeoffs of pervasive readonly in large codebases?

**Answer:**

**Benefits:**
```ts
// 1. Prevents accidental mutations
function updateUser(user: Readonly<User>, updates: Partial<User>): User {
  // user.name = "new name" // Compile error
  return { ...user, ...updates } // Forces immutable update
}

// 2. Clear API contracts
interface UserService {
  getUser(id: string): Promise<Readonly<User>>
  updateUser(id: string, updates: Partial<User>): Promise<Readonly<User>>
}

// 3. Better functional programming
const users = getUsers() // ReadonlyArray<User>
const activeUsers = users.filter(user => user.active) // Still ReadonlyArray<User>
```

**Drawbacks:**
```ts
// 1. Type complexity
type ComplexType = {
  readonly data: {
    readonly items: ReadonlyArray<{
      readonly metadata: {
        readonly tags: ReadonlyArray<string>
        readonly created: Date
      }
    }>
  }
}

// 2. Library compatibility issues
function thirdPartyFunction(data: User[]) {
  // Expects mutable array, but we have ReadonlyArray<User>
}

// 3. Performance considerations
// Deep readonly types can be expensive for large objects
type LargeConfig = DeepReadonly<{
  // ... hundreds of properties
}>

// 4. Development friction
const config: Readonly<Config> = getConfig()
// config.someProperty = newValue // Error, need to create new object
const newConfig = { ...config, someProperty: newValue }
```

**Best Practices:**
- **Gradual adoption**: Start with new code, gradually migrate existing
- **Selective application**: Use readonly for public APIs, mutable for internal processing
- **Utility types**: Create reusable readonly utilities
- **Documentation**: Clearly document readonly vs mutable expectations
- **Testing**: Ensure readonly constraints don't break functionality

**When to avoid:**
- Performance-critical code paths
- Heavy third-party library integration
- Complex object graphs with frequent updates
- Teams new to functional programming concepts


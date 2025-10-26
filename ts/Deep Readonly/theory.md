## Deep Readonly

Deep Readonly is a TypeScript utility type that recursively makes all properties of an object (and nested objects) readonly, preventing any modifications at compile time.

### Basic Pattern

```ts
type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] }
```

### Enhanced Implementation with Array/Tuple Support

```ts
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T[P] extends readonly (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}
```

### Advanced Implementation with Branding

```ts
// Branded readonly type to prevent casting back
type BrandedReadonly<T> = T & { readonly __brand: unique symbol }

type DeepReadonly<T> = BrandedReadonly<{
  readonly [P in keyof T]: T[P] extends (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T[P] extends readonly (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}>
```

### Key Concepts

1. **Recursive Application**: The type recursively applies `readonly` to all nested objects
2. **Array Handling**: Special handling for arrays and tuples to make them `ReadonlyArray`
3. **Primitive Preservation**: Primitive types remain unchanged
4. **Branding**: Prevents accidental casting back to mutable types

### Use Cases

- **API Responses**: Making fetched data immutable
- **Configuration Objects**: Preventing accidental modifications
- **State Management**: Ensuring state immutability
- **Library APIs**: Providing immutable data structures

### Considerations

- **Performance**: Deep readonly types can be expensive for large, deeply nested objects
- **Array Methods**: ReadonlyArray doesn't have mutating methods like `push()`, `pop()`, etc.
- **Type Compatibility**: May cause issues with libraries expecting mutable objects
- **Runtime vs Compile-time**: This is purely a compile-time feature; runtime objects can still be modified

### Example Usage

```ts
interface User {
  id: number
  name: string
  address: {
    street: string
    city: string
    coordinates: [number, number]
  }
  hobbies: string[]
}

type ImmutableUser = DeepReadonly<User>

// This will cause TypeScript errors:
// const user: ImmutableUser = { ... }
// user.name = "new name" // Error: Cannot assign to 'name' because it is a read-only property
// user.address.street = "new street" // Error: Cannot assign to 'street' because it is a read-only property
// user.hobbies.push("new hobby") // Error: Property 'push' does not exist on type 'readonly string[]'
```

### Trade-offs

**Pros:**
- Prevents accidental mutations
- Better type safety
- Clear intent in APIs
- Helps with functional programming patterns

**Cons:**
- Increased type complexity
- Potential performance impact
- May conflict with third-party libraries
- Requires careful design of APIs



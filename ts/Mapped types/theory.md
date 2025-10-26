# Mapped Types in TypeScript

## What are Mapped Types?

Mapped types are a powerful TypeScript feature that allows you to transform properties of existing types by creating new types based on the structure of existing ones. They provide a way to iterate over the keys of a type and transform them systematically.

## Basic Syntax

The fundamental syntax for mapped types is:
```ts
{ [K in Keys]: Type }
```

Where:
- `K` is the key variable (can be any name)
- `Keys` is a union type of keys to iterate over
- `Type` is the type to assign to each property

## Core Concepts

### 1. Basic Mapped Types
```ts
// Transform all properties to optional
type Partial<T> = {
  [K in keyof T]?: T[K];
};

// Transform all properties to readonly
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Transform all properties to required
type Required<T> = {
  [K in keyof T]-?: T[K];
};
```

### 2. Modifiers
Mapped types support modifiers to add or remove property attributes:

- `+readonly` or `readonly`: Add readonly modifier
- `-readonly`: Remove readonly modifier  
- `?`: Add optional modifier
- `-?`: Remove optional modifier

```ts
// Remove readonly from all properties
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Make all properties optional
type Partial<T> = {
  [K in keyof T]?: T[K];
};

// Make all properties required
type Required<T> = {
  [K in keyof T]-?: T[K];
};
```

### 3. Key Remapping with `as`
TypeScript 4.1+ allows remapping keys using the `as` clause:

```ts
// Rename all keys to uppercase
type UppercaseKeys<T> = {
  [K in keyof T as Uppercase<string & K>]: T[K];
};

// Add prefix to all keys
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${string & K}`]: T[K];
};

// Filter keys based on condition
type StringKeys<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
```

## Advanced Patterns

### 1. Conditional Key Remapping
```ts
// Only include keys that match a condition
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

// Exclude keys that match a condition
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};
```

### 2. Template Literal Types
```ts
// Create getter methods
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

// Create setter methods
type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};
```

### 3. Recursive Mapped Types
```ts
// Deep readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object 
    ? DeepReadonly<T[K]> 
    : T[K];
};

// Deep partial
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object 
    ? DeepPartial<T[K]> 
    : T[K];
};
```

## Built-in Utility Types Using Mapped Types

Many of TypeScript's built-in utility types are implemented using mapped types:

```ts
// Pick - select specific keys
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit - exclude specific keys
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// Record - create object type with specific keys and values
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

## Practical Examples

### 1. API Response Transformation
```ts
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Remove sensitive fields
type PublicUser = Omit<User, 'password'>;

// Add metadata
type UserWithMeta = User & {
  createdAt: Date;
  updatedAt: Date;
};
```

### 2. Form State Management
```ts
interface FormData {
  username: string;
  email: string;
  age: number;
}

// Create form state with validation
type FormState<T> = {
  [K in keyof T]: {
    value: T[K];
    error?: string;
    touched: boolean;
  };
};
```

### 3. Event System
```ts
interface Events {
  click: MouseEvent;
  keydown: KeyboardEvent;
  submit: Event;
}

// Create event handler types
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (event: T[K]) => void;
};
```

## Key Remapping Use Cases

### 1. Property Transformation
```ts
// Convert all properties to functions
type ToFunctions<T> = {
  [K in keyof T as K]: () => T[K];
};

// Convert to async functions
type ToAsync<T> = {
  [K in keyof T as K]: () => Promise<T[K]>;
};
```

### 2. Key Filtering
```ts
// Only string properties
type StringProps<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

// Only function properties
type FunctionProps<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};
```

### 3. Key Transformation
```ts
// Add prefix to all keys
type WithPrefix<T, P extends string> = {
  [K in keyof T as `${P}${string & K}`]: T[K];
};

// Convert to snake_case
type SnakeCase<T> = {
  [K in keyof T as K extends string ? K extends Uppercase<K> ? Lowercase<K> : K : K]: T[K];
};
```

## Best Practices

1. **Use descriptive key variable names**: `K`, `P`, `Key` are common conventions
2. **Leverage conditional types**: Combine with conditional types for complex transformations
3. **Consider performance**: Deep recursive types can impact compilation time
4. **Use key remapping judiciously**: It's powerful but can make types complex
5. **Test with edge cases**: Empty objects, union types, etc.

## Common Pitfalls

1. **Infinite recursion**: Be careful with recursive mapped types
2. **Key type constraints**: Ensure keys are compatible with string operations
3. **Modifier conflicts**: Don't use conflicting modifiers
4. **Complex key remapping**: Can make types hard to understand

## Interview Questions

- Implement a `DeepReadonly` type using mapped types
- Explain the difference between `+readonly` and `-readonly` modifiers
- How would you create a type that makes all properties optional except for specific ones?
- Implement a type that renames all keys to have a specific prefix
- Create a mapped type that filters properties based on their value types



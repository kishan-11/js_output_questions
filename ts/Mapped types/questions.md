# Mapped Types - Interview Questions and Answers

## Basic Concepts

### Q1: What are mapped types in TypeScript?

**Answer:**
Mapped types are a powerful TypeScript feature that allows you to transform properties of existing types by creating new types based on the structure of existing ones. They provide a way to iterate over the keys of a type and transform them systematically.

**Key characteristics:**
- Transform existing types by iterating over their keys
- Use the syntax `{ [K in Keys]: Type }`
- Support modifiers like `readonly`, `?`, `-readonly`, `-?`
- Enable key remapping with the `as` clause (TypeScript 4.1+)

**Example:**
```ts
type Partial<T> = {
  [K in keyof T]?: T[K];
};

interface User {
  name: string;
  age: number;
}

type PartialUser = Partial<User>; // { name?: string; age?: number; }
```

### Q2: Explain the basic syntax of mapped types.

**Answer:**
The basic syntax is: `{ [K in Keys]: Type }`

Where:
- `K` is the key variable (can be any name like `P`, `Key`, etc.)
- `Keys` is a union type of keys to iterate over
- `Type` is the type to assign to each property

**Examples:**
```ts
// Basic mapped type
type Stringify<T> = {
  [K in keyof T]: string;
};

// Using different key variable name
type Numberify<T> = {
  [P in keyof T]: number;
};

// With specific keys
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

## Modifiers

### Q3: What are the different modifiers available in mapped types?

**Answer:**
Mapped types support several modifiers to add or remove property attributes:

1. **`+readonly` or `readonly`**: Add readonly modifier
2. **`-readonly`**: Remove readonly modifier
3. **`?`**: Add optional modifier
4. **`-?`**: Remove optional modifier

**Examples:**
```ts
// Add readonly to all properties
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

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

### Q4: What's the difference between `+readonly` and `-readonly` modifiers?

**Answer:**
- **`+readonly` (or just `readonly`)**: Adds the readonly modifier to properties
- **`-readonly`**: Removes the readonly modifier from properties

**Examples:**
```ts
interface User {
  readonly id: number;
  name: string;
}

// Add readonly to all properties
type AllReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Remove readonly from all properties
type AllMutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type ReadonlyUser = AllReadonly<User>; // { readonly id: number; readonly name: string; }
type MutableUser = AllMutable<User>;   // { id: number; name: string; }
```

## Key Remapping

### Q5: What is key remapping and how do you use it?

**Answer:**
Key remapping (introduced in TypeScript 4.1) allows you to transform the keys of a type using the `as` clause. This enables you to rename, filter, or transform keys based on conditions.

**Syntax:**
```ts
{ [K in keyof T as NewKey]: T[K] }
```

**Examples:**
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

interface User {
  name: string;
  age: number;
  email: string;
}

type UserUppercase = UppercaseKeys<User>; // { NAME: string; AGE: number; EMAIL: string; }
type UserPrefixed = Prefixed<User, 'user_'>; // { user_name: string; user_age: number; user_email: string; }
type UserStringKeys = StringKeys<User>; // { name: string; email: string; }
```

### Q6: How do you create getter and setter methods using key remapping?

**Answer:**
You can use template literal types with key remapping to create getter and setter methods:

```ts
// Create getter methods
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

// Create setter methods
type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

// Create both getters and setters
type GettersAndSetters<T> = Getters<T> & Setters<T>;

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; }

type UserSetters = Setters<User>;
// { setName: (value: string) => void; setAge: (value: number) => void; }

type UserAccessors = GettersAndSetters<User>;
// { getName: () => string; getAge: () => number; setName: (value: string) => void; setAge: (value: number) => void; }
```

## Advanced Patterns

### Q7: How do you implement conditional key remapping?

**Answer:**
Conditional key remapping allows you to include or exclude keys based on conditions:

```ts
// Only include keys that match a condition
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

// Exclude keys that match a condition
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

// Only include string properties
type StringProps<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

// Only include function properties
type FunctionProps<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};

interface MixedObject {
  name: string;
  age: number;
  greet: () => void;
  email: string;
  calculate: (x: number) => number;
}

type StringOnly = StringProps<MixedObject>; // { name: string; email: string; }
type FunctionsOnly = FunctionProps<MixedObject>; // { greet: () => void; calculate: (x: number) => number; }
```

### Q8: How do you implement recursive mapped types?

**Answer:**
Recursive mapped types allow you to transform nested object structures:

```ts
// Deep readonly - makes all properties readonly recursively
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object 
    ? DeepReadonly<T[K]> 
    : T[K];
};

// Deep partial - makes all properties optional recursively
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object 
    ? DeepPartial<T[K]> 
    : T[K];
};

// Deep required - makes all properties required recursively
type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object 
    ? DeepRequired<T[K]> 
    : T[K];
};

interface NestedUser {
  name: string;
  address: {
    street: string;
    city: string;
    country: {
      name: string;
      code: string;
    };
  };
  preferences?: {
    theme: string;
    notifications: boolean;
  };
}

type DeepReadonlyUser = DeepReadonly<NestedUser>;
// {
//   readonly name: string;
//   readonly address: {
//     readonly street: string;
//     readonly city: string;
//     readonly country: {
//       readonly name: string;
//       readonly code: string;
//     };
//   };
//   readonly preferences?: {
//     readonly theme: string;
//     readonly notifications: boolean;
//   };
// }
```

## Built-in Utility Types

### Q9: How are built-in utility types implemented using mapped types?

**Answer:**
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

// Partial - make all properties optional
type Partial<T> = {
  [K in keyof T]?: T[K];
};

// Required - make all properties required
type Required<T> = {
  [K in keyof T]-?: T[K];
};

// Readonly - make all properties readonly
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};
```

## Practical Applications

### Q10: How would you create a form state type using mapped types?

**Answer:**
You can create a form state type that wraps each field with validation information:

```ts
// Basic form state
type FormState<T> = {
  [K in keyof T]: {
    value: T[K];
    error?: string;
    touched: boolean;
  };
};

// Advanced form state with validation
type AdvancedFormState<T> = {
  [K in keyof T]: {
    value: T[K];
    error?: string;
    touched: boolean;
    dirty: boolean;
    valid: boolean;
  };
};

interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

type LoginFormState = FormState<LoginForm>;
// {
//   username: { value: string; error?: string; touched: boolean; };
//   password: { value: string; error?: string; touched: boolean; };
//   rememberMe: { value: boolean; error?: string; touched: boolean; };
// }
```

### Q11: How would you create an API response transformation type?

**Answer:**
You can use mapped types to transform API responses:

```ts
// Remove sensitive fields
type PublicUser<T> = Omit<T, 'password' | 'ssn' | 'creditCard'>;

// Add metadata to responses
type WithMetadata<T> = T & {
  createdAt: Date;
  updatedAt: Date;
  version: number;
};

// Transform all string fields to optional
type OptionalStrings<T> = {
  [K in keyof T]: T[K] extends string ? T[K] | undefined : T[K];
};

// Create API response wrapper
type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
};

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  ssn: string;
}

type PublicUserData = PublicUser<User>; // { id: number; name: string; email: string; }
type UserWithMeta = WithMetadata<PublicUserData>;
type UserApiResponse = ApiResponse<UserWithMeta>;
```

### Q12: How would you create an event system using mapped types?

**Answer:**
You can create event handler types using key remapping:

```ts
// Basic event handlers
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (event: T[K]) => void;
};

// Event handlers with return values
type EventHandlersWithReturn<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (event: T[K]) => boolean;
};

// Async event handlers
type AsyncEventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (event: T[K]) => Promise<void>;
};

interface Events {
  click: MouseEvent;
  keydown: KeyboardEvent;
  submit: Event;
  change: Event;
}

type ClickHandlers = EventHandlers<Events>;
// {
//   onClick: (event: MouseEvent) => void;
//   onKeydown: (event: KeyboardEvent) => void;
//   onSubmit: (event: Event) => void;
//   onChange: (event: Event) => void;
// }
```

## Complex Scenarios

### Q13: How would you create a type that makes all properties optional except for specific ones?

**Answer:**
You can combine mapped types with conditional types to achieve this:

```ts
// Make all properties optional except specified ones
type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Alternative approach using mapped types
type PartialExceptMapped<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? T[P] : T[P] | undefined;
};

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type UserPartialExceptId = PartialExcept<User, 'id'>;
// { id: number; name?: string; email?: string; age?: number; }

type UserPartialExceptIdAndName = PartialExcept<User, 'id' | 'name'>;
// { id: number; name: string; email?: string; age?: number; }
```

### Q14: How would you create a type that renames all keys to have a specific prefix?

**Answer:**
You can use template literal types with key remapping:

```ts
// Add prefix to all keys
type WithPrefix<T, P extends string> = {
  [K in keyof T as `${P}${string & K}`]: T[K];
};

// Add suffix to all keys
type WithSuffix<T, S extends string> = {
  [K in keyof T as `${string & K}${S}`]: T[K];
};

// Transform keys to snake_case with prefix
type SnakeCaseWithPrefix<T, P extends string> = {
  [K in keyof T as `${P}${string & K}`]: T[K];
};

interface User {
  firstName: string;
  lastName: string;
  emailAddress: string;
}

type PrefixedUser = WithPrefix<User, 'user_'>;
// { user_firstName: string; user_lastName: string; user_emailAddress: string; }

type SuffixedUser = WithSuffix<User, '_field'>;
// { firstName_field: string; lastName_field: string; emailAddress_field: string; }
```

### Q15: How would you create a mapped type that filters properties based on their value types?

**Answer:**
You can use conditional types with key remapping to filter properties:

```ts
// Filter by specific type
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

// Filter by multiple types
type PickByTypes<T, U extends any[]> = {
  [K in keyof T as T[K] extends U[number] ? K : never]: T[K];
};

// Filter by function types
type PickFunctions<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};

// Filter by object types
type PickObjects<T> = {
  [K in keyof T as T[K] extends object ? K : never]: T[K];
};

// Filter by primitive types
type PickPrimitives<T> = {
  [K in keyof T as T[K] extends string | number | boolean ? K : never]: T[K];
};

interface MixedObject {
  name: string;
  age: number;
  isActive: boolean;
  greet: () => void;
  calculate: (x: number) => number;
  address: { street: string; city: string; };
  metadata: { version: string; };
}

type StringProps = PickByType<MixedObject, string>; // { name: string; }
type FunctionProps = PickFunctions<MixedObject>; // { greet: () => void; calculate: (x: number) => number; }
type ObjectProps = PickObjects<MixedObject>; // { address: { street: string; city: string; }; metadata: { version: string; }; }
type PrimitiveProps = PickPrimitives<MixedObject>; // { name: string; age: number; isActive: boolean; }
```

## Best Practices and Pitfalls

### Q16: What are the best practices when working with mapped types?

**Answer:**
1. **Use descriptive key variable names**: `K`, `P`, `Key` are common conventions
2. **Leverage conditional types**: Combine with conditional types for complex transformations
3. **Consider performance**: Deep recursive types can impact compilation time
4. **Use key remapping judiciously**: It's powerful but can make types complex
5. **Test with edge cases**: Empty objects, union types, etc.
6. **Document complex types**: Add comments for complex mapped type logic
7. **Use utility types**: Leverage built-in utility types when possible

### Q17: What are common pitfalls when using mapped types?

**Answer:**
1. **Infinite recursion**: Be careful with recursive mapped types
2. **Key type constraints**: Ensure keys are compatible with string operations
3. **Modifier conflicts**: Don't use conflicting modifiers
4. **Complex key remapping**: Can make types hard to understand
5. **Performance issues**: Deep recursive types can slow down compilation
6. **Type compatibility**: Mapped types might not be assignable to original types

**Examples of pitfalls:**
```ts
// ❌ Infinite recursion
type BadRecursive<T> = {
  [K in keyof T]: BadRecursive<T[K]>; // No base case!
};

// ❌ Conflicting modifiers
type Conflicting<T> = {
  readonly [K in keyof T]?: T[K]; // readonly and optional - confusing
};

// ❌ Complex key remapping
type TooComplex<T> = {
  [K in keyof T as K extends string ? K extends 'a' ? 'A' : K extends 'b' ? 'B' : K : K]: T[K];
};

// ✅ Good recursive type with base case
type GoodRecursive<T> = {
  [K in keyof T]: T[K] extends object ? GoodRecursive<T[K]> : T[K];
};
```

### Q18: How do you handle edge cases in mapped types?

**Answer:**
Handle edge cases by considering various scenarios:

```ts
// Handle empty objects
type SafeMapped<T> = T extends {} ? {
  [K in keyof T]: T[K];
} : never;

// Handle union types
type UnionMapped<T> = T extends any ? {
  [K in keyof T]: T[K];
} : never;

// Handle arrays and primitives
type SafeDeepReadonly<T> = T extends object
  ? T extends any[]
    ? ReadonlyArray<SafeDeepReadonly<T[number]>>
    : { readonly [K in keyof T]: SafeDeepReadonly<T[K]> }
  : T;

// Handle null and undefined
type NonNullable<T> = {
  [K in keyof T]: T[K] extends null | undefined ? never : T[K];
};
```

## Advanced Interview Questions

### Q19: Implement a type that creates a proxy object with getter and setter methods for all properties.

**Answer:**
```ts
type ProxyObject<T> = {
  [K in keyof T]: {
    get(): T[K];
    set(value: T[K]): void;
  };
};

// Alternative approach with separate getter/setter methods
type ProxyMethods<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
} & {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

interface User {
  name: string;
  age: number;
}

type UserProxy = ProxyObject<User>;
// {
//   name: { get(): string; set(value: string): void; };
//   age: { get(): number; set(value: number): void; };
// }

type UserProxyMethods = ProxyMethods<User>;
// {
//   getName: () => string;
//   setName: (value: string) => void;
//   getAge: () => number;
//   setAge: (value: number) => void;
// }
```

### Q20: Create a type that transforms all properties to be observable (with subscribe/unsubscribe methods).

**Answer:**
```ts
type Observable<T> = {
  [K in keyof T]: {
    value: T[K];
    subscribe(callback: (value: T[K]) => void): () => void;
    unsubscribe(id: string): void;
  };
};

// Alternative with event emitter pattern
type EventEmitter<T> = {
  [K in keyof T]: {
    value: T[K];
    on(event: string, callback: (value: T[K]) => void): void;
    off(event: string, callback: (value: T[K]) => void): void;
    emit(event: string, value: T[K]): void;
  };
};

interface State {
  count: number;
  message: string;
}

type ObservableState = Observable<State>;
// {
//   count: { value: number; subscribe(callback: (value: number) => void): () => void; unsubscribe(id: string): void; };
//   message: { value: string; subscribe(callback: (value: string) => void): () => void; unsubscribe(id: string): void; };
// }
```

These questions and answers cover the fundamental concepts, advanced patterns, and practical applications of mapped types in TypeScript, providing a comprehensive understanding for interviews and real-world usage.

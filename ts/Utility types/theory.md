# TypeScript Utility Types

Utility types are built-in TypeScript types that provide common type transformations. They are generic types that take other types as parameters and return new types based on them.

## Core Utility Types

### 1. Partial<T>
Makes all properties of type T optional.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// Result: { id?: number; name?: string; email?: string; }
```

**Use cases:**
- Update operations where not all fields are required
- Form data where fields are filled incrementally
- API request bodies with optional fields

### 2. Required<T>
Makes all properties of type T required (removes optional modifiers).

```ts
interface Config {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

type RequiredConfig = Required<Config>;
// Result: { apiUrl: string; timeout: number; retries: number; }
```

### 3. Readonly<T>
Makes all properties of type T readonly.

```ts
interface MutableData {
  value: number;
  count: number;
}

type ReadonlyData = Readonly<MutableData>;
// Result: { readonly value: number; readonly count: number; }
```

### 4. Record<K, T>
Creates an object type with keys of type K and values of type T.

```ts
type Status = 'loading' | 'success' | 'error';
type StatusMessages = Record<Status, string>;
// Result: { loading: string; success: string; error: string; }

// More complex example
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
```

**When to use Record vs Index Signatures:**
- Use `Record<K, T>` when you know the exact keys at compile time
- Use index signatures `{ [key: string]: T }` when keys are dynamic

### 5. Pick<T, K>
Selects specific properties from type T.

```ts
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

type PublicUser = Pick<User, 'id' | 'name' | 'email'>;
// Result: { id: number; name: string; email: string; }
```

### 6. Omit<T, K>
Excludes specific properties from type T.

```ts
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type UserWithoutPassword = Omit<User, 'password'>;
// Result: { id: number; name: string; email: string; }
```

**Implementing Omit using Pick and Exclude:**
```ts
type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

### 7. Exclude<T, U>
Excludes from T all union members that are assignable to U.

```ts
type AllColors = 'red' | 'green' | 'blue' | 'yellow';
type PrimaryColors = Exclude<AllColors, 'yellow'>;
// Result: 'red' | 'green' | 'blue'
```

### 8. Extract<T, U>
Extracts from T all union members that are assignable to U.

```ts
type AllColors = 'red' | 'green' | 'blue' | 'yellow';
type WarmColors = Extract<AllColors, 'red' | 'yellow'>;
// Result: 'red' | 'yellow'
```

### 9. NonNullable<T>
Excludes null and undefined from T.

```ts
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// Result: string
```

### 10. ReturnType<F>
Extracts the return type of function type F.

```ts
function getUser(id: number): { id: number; name: string } {
  return { id, name: 'John' };
}

type UserReturnType = ReturnType<typeof getUser>;
// Result: { id: number; name: string }
```

### 11. Parameters<F>
Extracts the parameter types of function type F as a tuple.

```ts
function createUser(name: string, age: number, email: string): void {
  // implementation
}

type CreateUserParams = Parameters<typeof createUser>;
// Result: [string, number, string]
```

### 12. ConstructorParameters<C>
Extracts the parameter types of a constructor function type.

```ts
class User {
  constructor(public name: string, public age: number) {}
}

type UserConstructorParams = ConstructorParameters<typeof User>;
// Result: [string, number]
```

### 13. InstanceType<C>
Extracts the instance type of a constructor function type.

```ts
class User {
  constructor(public name: string) {}
}

type UserInstance = InstanceType<typeof User>;
// Result: User
```

## Advanced Utility Types

### 14. Awaited<T>
Unwraps the type that a Promise resolves to.

```ts
type PromiseString = Promise<string>;
type UnwrappedString = Awaited<PromiseString>;
// Result: string

// Works with nested promises
type NestedPromise = Promise<Promise<number>>;
type UnwrappedNumber = Awaited<NestedPromise>;
// Result: number
```

### 15. ThisParameterType<T>
Extracts the type of the `this` parameter of a function type.

```ts
function greet(this: { name: string }) {
  return `Hello, ${this.name}`;
}

type GreetThis = ThisParameterType<typeof greet>;
// Result: { name: string }
```

### 16. OmitThisParameter<T>
Removes the `this` parameter from a function type.

```ts
function greet(this: { name: string }, message: string) {
  return `${message}, ${this.name}`;
}

type GreetWithoutThis = OmitThisParameter<typeof greet>;
// Result: (message: string) => string
```

## Practical Examples

### API Response Types
```ts
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

type UserApiResponse = ApiResponse<User>;
type PartialUserApiResponse = ApiResponse<Partial<User>>;
```

### Form Handling
```ts
interface UserForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// For creating user (all fields required)
type CreateUserData = Required<UserForm>;

// For updating user (all fields optional)
type UpdateUserData = Partial<UserForm>;

// For display (exclude sensitive fields)
type DisplayUser = Omit<UserForm, 'password' | 'confirmPassword'>;
```

### Event Handling
```ts
interface ButtonProps {
  onClick: (event: MouseEvent) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

// Extract just the event handler type
type ClickHandler = Pick<ButtonProps, 'onClick'>['onClick'];
// Result: (event: MouseEvent) => void
```

## Common Patterns

### Conditional Utility Types
```ts
type NonNullable<T> = T extends null | undefined ? never : T;
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### Mapped Utility Types
```ts
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };
```

## Interview Questions

1. **Implement `Omit` using `Pick` and `Exclude`**
2. **When to prefer `Record<string, T>` vs index signatures**
3. **Create a utility type that makes specific properties required**
4. **Implement a `DeepReadonly` utility type**
5. **Create a utility type that extracts function parameter names**



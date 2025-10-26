# TypeScript Utility Types - Interview Questions & Answers

## Basic Utility Types

### Q1: What is the difference between `Partial<T>` and `Required<T>`?

**Answer:**
- `Partial<T>` makes all properties of type T optional by adding `?` to each property
- `Required<T>` makes all properties of type T required by removing `?` from each property

```ts
interface User {
  id: number;
  name: string;
  email?: string;
}

type PartialUser = Partial<User>;
// Result: { id?: number; name?: string; email?: string; }

type RequiredUser = Required<User>;
// Result: { id: number; name: string; email: string; }
```

**Use cases:**
- `Partial<T>`: Update operations, form data, API requests with optional fields
- `Required<T>`: Configuration objects, ensuring all properties are provided

### Q2: How do `Pick<T, K>` and `Omit<T, K>` differ?

**Answer:**
- `Pick<T, K>` selects specific properties from type T
- `Omit<T, K>` excludes specific properties from type T

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

type UserWithoutPassword = Omit<User, 'password'>;
// Result: { id: number; name: string; email: string; createdAt: Date; }
```

### Q3: Implement `Omit<T, K>` using `Pick<T, K>` and `Exclude<T, U>`.

**Answer:**
```ts
type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Explanation:
// 1. Exclude<keyof T, K> removes K from the union of all keys of T
// 2. Pick<T, ...> selects only the remaining keys
```

**Step-by-step breakdown:**
```ts
interface User {
  id: number;
  name: string;
  email: string;
}

// For Omit<User, 'email'>:
// 1. keyof User = 'id' | 'name' | 'email'
// 2. Exclude<'id' | 'name' | 'email', 'email'> = 'id' | 'name'
// 3. Pick<User, 'id' | 'name'> = { id: number; name: string; }
```

### Q4: What is the difference between `Exclude<T, U>` and `Extract<T, U>`?

**Answer:**
- `Exclude<T, U>` removes from T all union members that are assignable to U
- `Extract<T, U>` keeps from T only union members that are assignable to U

```ts
type Colors = 'red' | 'green' | 'blue' | 'yellow';

type PrimaryColors = Exclude<Colors, 'yellow'>;
// Result: 'red' | 'green' | 'blue'

type WarmColors = Extract<Colors, 'red' | 'yellow'>;
// Result: 'red' | 'yellow'
```

### Q5: When should you use `Record<K, T>` vs index signatures?

**Answer:**

**Use `Record<K, T>` when:**
- You know the exact keys at compile time
- Keys are from a union type or string literal
- You want type safety for specific keys

```ts
type Status = 'loading' | 'success' | 'error';
type StatusMessages = Record<Status, string>;
// Result: { loading: string; success: string; error: string; }
```

**Use index signatures when:**
- Keys are dynamic and unknown at compile time
- You need runtime flexibility
- Keys come from external sources

```ts
type DynamicObject = { [key: string]: any };
```

## Advanced Utility Types

### Q6: How does `ReturnType<F>` work and what are its limitations?

**Answer:**
`ReturnType<F>` extracts the return type of function type F.

```ts
function getUser(id: number): { id: number; name: string } {
  return { id, name: 'John' };
}

type UserReturnType = ReturnType<typeof getUser>;
// Result: { id: number; name: string; }
```

**Limitations:**
- Only works with function types, not method types
- Doesn't work with overloaded functions (returns the last overload)
- Doesn't work with generic functions that have type parameters

```ts
// This won't work as expected
function genericFunction<T>(value: T): T {
  return value;
}
type GenericReturn = ReturnType<typeof genericFunction>; // Returns unknown
```

### Q7: What is `Parameters<F>` and how is it useful?

**Answer:**
`Parameters<F>` extracts the parameter types of function type F as a tuple.

```ts
function createUser(name: string, age: number, email: string): void {
  // implementation
}

type CreateUserParams = Parameters<typeof createUser>;
// Result: [string, number, string]

// Useful for creating wrapper functions
function createUserWrapper(...args: Parameters<typeof createUser>) {
  console.log('Creating user...');
  return createUser(...args);
}
```

### Q8: Explain `NonNullable<T>` and provide a practical example.

**Answer:**
`NonNullable<T>` excludes null and undefined from type T.

```ts
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// Result: string

// Practical example with API responses
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

type UserResponse = ApiResponse<User>;
type UserData = NonNullable<UserResponse['data']>; // User
```

### Q9: What are `ConstructorParameters<C>` and `InstanceType<C>`?

**Answer:**
- `ConstructorParameters<C>` extracts parameter types of a constructor
- `InstanceType<C>` extracts the instance type of a constructor

```ts
class User {
  constructor(public name: string, public age: number) {}
}

type UserConstructorParams = ConstructorParameters<typeof User>;
// Result: [string, number]

type UserInstance = InstanceType<typeof User>;
// Result: User

// Practical use case
function createUserInstance(...args: ConstructorParameters<typeof User>): InstanceType<typeof User> {
  return new User(...args);
}
```

### Q10: What is `Awaited<T>` and when is it useful?

**Answer:**
`Awaited<T>` unwraps the type that a Promise resolves to.

```ts
type PromiseString = Promise<string>;
type UnwrappedString = Awaited<PromiseString>;
// Result: string

// Works with nested promises
type NestedPromise = Promise<Promise<number>>;
type UnwrappedNumber = Awaited<NestedPromise>;
// Result: number

// Practical example
async function fetchUser(id: number): Promise<User> {
  return { id, name: 'John' };
}

type UserData = Awaited<ReturnType<typeof fetchUser>>;
// Result: User
```

## Custom Utility Types

### Q11: Create a utility type that makes specific properties required.

**Answer:**
```ts
type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

interface User {
  id?: number;
  name?: string;
  email?: string;
}

type UserWithRequiredId = Required<User, 'id'>;
// Result: { id: number; name?: string; email?: string; }
```

### Q12: Implement a `DeepReadonly` utility type.

**Answer:**
```ts
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

interface NestedObject {
  user: {
    name: string;
    settings: {
      theme: string;
      notifications: boolean;
    };
  };
}

type DeepReadonlyNested = DeepReadonly<NestedObject>;
// Result: All properties are deeply readonly
```

### Q13: Create a utility type that extracts function parameter names.

**Answer:**
```ts
type ParameterNames<T> = T extends (...args: infer P) => any 
  ? P extends readonly [infer First, ...infer Rest]
    ? First extends string
      ? First | ParameterNames<(...args: Rest) => any>
      : never
    : never
  : never;

// Alternative approach using template literal types
type GetParameterNames<T> = T extends (...args: infer P) => any
  ? {
      [K in keyof P]: P[K] extends string ? K : never;
    }[number]
  : never;
```

### Q14: Create a utility type that makes all properties optional except specific ones.

**Answer:**
```ts
type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type UpdateUserData = OptionalExcept<User, 'id'>;
// Result: { id: number; name?: string; email?: string; password?: string; }
```

### Q15: Implement a `DeepPartial` utility type.

**Answer:**
```ts
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface NestedConfig {
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
}

type PartialConfig = DeepPartial<NestedConfig>;
// Result: All properties are deeply optional
```

## Practical Scenarios

### Q16: How would you type a form that has different validation states?

**Answer:**
```ts
interface BaseForm {
  name: string;
  email: string;
  age: number;
}

type FormState<T> = {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
};

type UserFormState = FormState<BaseForm>;

// Usage
const formState: UserFormState = {
  data: { name: 'John', email: 'john@example.com', age: 25 },
  errors: { email: 'Invalid email format' },
  touched: { name: true, email: true },
  isValid: false
};
```

### Q17: How would you create a type-safe event handler system?

**Answer:**
```ts
interface EventMap {
  'user:created': { id: number; name: string };
  'user:updated': { id: number; changes: Partial<User> };
  'user:deleted': { id: number };
}

type EventHandler<T> = (payload: T) => void;

type EventHandlers = {
  [K in keyof EventMap]: EventHandler<EventMap[K]>;
};

// Usage
const handlers: EventHandlers = {
  'user:created': (payload) => {
    // payload is { id: number; name: string }
    console.log(`User created: ${payload.name}`);
  },
  'user:updated': (payload) => {
    // payload is { id: number; changes: Partial<User> }
    console.log(`User ${payload.id} updated`);
  },
  'user:deleted': (payload) => {
    // payload is { id: number }
    console.log(`User ${payload.id} deleted`);
  }
};
```

### Q18: Create a type-safe API client using utility types.

**Answer:**
```ts
interface ApiEndpoints {
  '/users': {
    GET: { response: User[] };
    POST: { body: Omit<User, 'id'>; response: User };
  };
  '/users/:id': {
    GET: { params: { id: number }; response: User };
    PUT: { params: { id: number }; body: Partial<User>; response: User };
    DELETE: { params: { id: number }; response: void };
  };
}

type ApiMethod<T> = T extends { [K in keyof T]: infer U } ? U : never;

type GetEndpoint<T extends keyof ApiEndpoints> = ApiEndpoints[T];
type GetMethod<T extends keyof ApiEndpoints, M extends keyof GetEndpoint<T>> = GetEndpoint<T>[M];

type ApiClient = {
  [K in keyof ApiEndpoints]: {
    [M in keyof ApiEndpoints[K]]: (
      ...args: GetMethod<K, M> extends { params: infer P; body: infer B }
        ? [P, B]
        : GetMethod<K, M> extends { params: infer P }
        ? [P]
        : GetMethod<K, M> extends { body: infer B }
        ? [B]
        : []
    ) => Promise<GetMethod<K, M> extends { response: infer R } ? R : never>;
  };
};
```

### Q19: How would you implement a type-safe state machine?

**Answer:**
```ts
interface StateMachine<TState extends string, TEvent extends string> {
  states: Record<TState, Record<TEvent, TState>>;
  currentState: TState;
}

type ValidTransitions<T extends StateMachine<any, any>> = {
  [K in keyof T['states']]: keyof T['states'][K];
};

type StateMachineAPI<T extends StateMachine<any, any>> = {
  transition: <E extends ValidTransitions<T>[T['currentState']]>(
    event: E
  ) => T extends StateMachine<infer S, any> ? StateMachine<S, any> : never;
  canTransition: <E extends string>(event: E) => E extends ValidTransitions<T>[T['currentState']] ? true : false;
};

// Example usage
type TrafficLight = StateMachine<'red' | 'yellow' | 'green', 'next'>;

const trafficLight: TrafficLight = {
  states: {
    red: { next: 'green' },
    yellow: { next: 'red' },
    green: { next: 'yellow' }
  },
  currentState: 'red'
};
```

### Q20: Create a utility type that extracts all function types from an object.

**Answer:**
```ts
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

interface MixedObject {
  name: string;
  age: number;
  getName: () => string;
  setName: (name: string) => void;
  calculateAge: (birthYear: number) => number;
}

type Functions = FunctionProperties<MixedObject>;
// Result: { getName: () => string; setName: (name: string) => void; calculateAge: (birthYear: number) => number; }
```

## Performance and Best Practices

### Q21: What are the performance implications of deeply nested utility types?

**Answer:**
- Deep utility types can cause TypeScript compilation to slow down
- Complex recursive types may hit TypeScript's recursion limits
- Use shallow utility types when possible
- Consider breaking down complex types into smaller, composable pieces

```ts
// Good: Shallow utility type
type UserUpdate = Partial<Pick<User, 'name' | 'email'>>;

// Avoid: Deeply nested recursive types for large objects
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### Q22: How do you handle utility types with generic constraints?

**Answer:**
```ts
// Constrain utility types with generic bounds
type NonEmptyObject<T> = T extends object ? T : never;

type SafePick<T, K extends keyof T> = T extends object ? Pick<T, K> : never;

// Use conditional types for better type safety
type ConditionalUtility<T> = T extends string 
  ? { value: T; length: number }
  : T extends number
  ? { value: T; isInteger: boolean }
  : { value: T; type: string };
```

### Q23: What are common pitfalls when using utility types?

**Answer:**

1. **Forgetting that utility types are compile-time only**
```ts
// This won't work at runtime
const user: Partial<User> = { name: 'John' };
console.log(user.id); // undefined, not type error
```

2. **Overusing complex utility types**
```ts
// Too complex
type OverlyComplex = DeepReadonly<DeepPartial<Pick<Omit<User, 'password'>, 'id' | 'name'>>>;

// Better approach
type SimpleUser = Pick<User, 'id' | 'name'>;
type ReadonlySimpleUser = Readonly<SimpleUser>;
```

3. **Not handling edge cases**
```ts
// This fails with empty objects
type BadUtility<T> = T extends { [K in keyof T]: any } ? T : never;

// Better approach
type GoodUtility<T> = T extends object ? T : never;
```

### Q24: How do you test utility types?

**Answer:**
```ts
// Use type assertions to test utility types
type TestPartial = Partial<{ a: number; b: string }>;
const testPartial: TestPartial = {}; // Should compile
const testPartial2: TestPartial = { a: 1 }; // Should compile
const testPartial3: TestPartial = { a: 1, b: 'test' }; // Should compile

// Use conditional types for testing
type AssertTrue<T extends true> = T;
type AssertFalse<T extends false> = T;

type TestPick = AssertTrue<Pick<{ a: number; b: string }, 'a'> extends { a: number } ? true : false>;
type TestOmit = AssertTrue<Omit<{ a: number; b: string }, 'a'> extends { b: string } ? true : false>;
```

### Q25: Create a utility type that validates object shapes at compile time.

**Answer:**
```ts
type ValidateShape<T, Shape> = T extends Shape 
  ? Shape extends T 
    ? T 
    : never 
  : never;

interface User {
  id: number;
  name: string;
  email: string;
}

// This will compile
type ValidUser = ValidateShape<{ id: number; name: string; email: string }, User>;

// This will not compile (missing required properties)
type InvalidUser = ValidateShape<{ id: number; name: string }, User>;

// This will not compile (extra properties)
type ExtraPropsUser = ValidateShape<{ id: number; name: string; email: string; extra: string }, User>;
```

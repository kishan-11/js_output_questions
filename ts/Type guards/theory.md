# Type Guards in TypeScript

Type guards are a way to narrow down the type of a variable within a certain scope. They help TypeScript understand the specific type of a value at runtime, enabling better type safety and IntelliSense.

## Built-in Type Guards

### 1. typeof Operator
The `typeof` operator is the most common built-in type guard:

```typescript
function processValue(value: string | number) {
  if (typeof value === 'string') {
    // TypeScript knows value is string here
    console.log(value.toUpperCase()); // ✅ No error
  } else {
    // TypeScript knows value is number here
    console.log(value.toFixed(2)); // ✅ No error
  }
}
```

**Supported types:**
- `'string'`
- `'number'`
- `'boolean'`
- `'undefined'`
- `'function'`
- `'object'`
- `'bigint'`
- `'symbol'`

### 2. instanceof Operator
Used to check if an object is an instance of a specific class:

```typescript
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Dog extends Animal {
  breed: string;
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
}

function handleAnimal(animal: Animal | Dog) {
  if (animal instanceof Dog) {
    // TypeScript knows animal is Dog here
    console.log(animal.breed); // ✅ No error
  } else {
    // TypeScript knows animal is Animal here
    console.log(animal.name); // ✅ No error
  }
}
```

### 3. in Operator
Checks if a property exists in an object:

```typescript
interface Bird {
  fly(): void;
}

interface Fish {
  swim(): void;
}

function move(animal: Bird | Fish) {
  if ('fly' in animal) {
    // TypeScript knows animal is Bird
    animal.fly(); // ✅ No error
  } else {
    // TypeScript knows animal is Fish
    animal.swim(); // ✅ No error
  }
}
```

## Custom Type Guards

Custom type guards are functions that return a type predicate (`parameter is Type`):

### Basic Custom Type Guard
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processUnknown(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is string
    console.log(value.toUpperCase()); // ✅ No error
  }
}
```

### Complex Custom Type Guards
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface Admin extends User {
  permissions: string[];
}

function isAdmin(user: User | Admin): user is Admin {
  return 'permissions' in user;
}

function handleUser(user: User | Admin) {
  if (isAdmin(user)) {
    // TypeScript knows user is Admin
    console.log(user.permissions); // ✅ No error
  } else {
    // TypeScript knows user is User
    console.log(user.name); // ✅ No error
  }
}
```

### Error Handling with Type Guards
```typescript
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

function handleError(error: unknown) {
  if (isError(error)) {
    // TypeScript knows error is Error
    console.log(error.message); // ✅ No error
    console.log(error.stack); // ✅ No error
  }
}
```

## Type Predicates in Array Methods

Type guards work particularly well with array methods like `filter`:

```typescript
function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

const mixedArray: (string | number)[] = ['hello', 42, 'world', 100];
const numbers: number[] = mixedArray.filter(isNumber);
// TypeScript knows numbers is number[], not (string | number)[]
```

## Discriminated Union Type Guards

For discriminated unions, you can create type guards based on discriminant properties:

```typescript
interface LoadingState {
  status: 'loading';
}

interface SuccessState {
  status: 'success';
  data: string[];
}

interface ErrorState {
  status: 'error';
  error: string;
}

type AppState = LoadingState | SuccessState | ErrorState;

function isSuccessState(state: AppState): state is SuccessState {
  return state.status === 'success';
}

function handleState(state: AppState) {
  if (isSuccessState(state)) {
    // TypeScript knows state is SuccessState
    console.log(state.data); // ✅ No error
  }
}
```

## Advanced Type Guard Patterns

### Multiple Type Guards
```typescript
function isStringOrNumber(value: unknown): value is string | number {
  return typeof value === 'string' || typeof value === 'number';
}

function processValue(value: unknown) {
  if (isStringOrNumber(value)) {
    // TypeScript knows value is string | number
    if (typeof value === 'string') {
      console.log(value.toUpperCase());
    } else {
      console.log(value.toFixed(2));
    }
  }
}
```

### Generic Type Guards
```typescript
function isArrayOf<T>(value: unknown, typeGuard: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(typeGuard);
}

function isStringArray(value: unknown): value is string[] {
  return isArrayOf(value, (item): item is string => typeof item === 'string');
}
```

### Null/Undefined Guards
```typescript
function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
```

## Best Practices

1. **Use descriptive names**: `isUser`, `isAdmin`, `isError`
2. **Keep guards simple**: Focus on one type check per guard
3. **Use for error handling**: Always use type guards when dealing with `unknown` types
4. **Combine with discriminated unions**: Perfect for handling different state types
5. **Test your guards**: Ensure they correctly identify types at runtime

## Common Pitfalls

1. **Don't forget the return type**: Always use `parameter is Type` syntax
2. **Runtime vs compile-time**: Type guards must work at runtime, not just compile-time
3. **Avoid complex logic**: Keep guards simple and focused
4. **Handle edge cases**: Consider null, undefined, and unexpected values

Type guards are essential for working with dynamic data, API responses, and any scenario where you need to narrow types based on runtime checks.



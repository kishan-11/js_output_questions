# Type Guards Interview Questions & Answers

## Basic Type Guards

### Q1: What are Type Guards in TypeScript?
**Answer:**
Type guards are a way to narrow down the type of a variable within a certain scope. They help TypeScript understand the specific type of a value at runtime, enabling better type safety and IntelliSense.

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

### Q2: What are the built-in type guards in TypeScript?
**Answer:**
TypeScript provides several built-in type guards:

1. **typeof operator**: Checks primitive types
2. **instanceof operator**: Checks class instances
3. **in operator**: Checks property existence

```typescript
// typeof
if (typeof value === 'string') { /* value is string */ }

// instanceof
if (value instanceof Date) { /* value is Date */ }

// in operator
if ('length' in value) { /* value has length property */ }
```

### Q3: How do you create a custom type guard?
**Answer:**
Custom type guards are functions that return a type predicate using the `parameter is Type` syntax:

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

## Advanced Type Guards

### Q4: How do you create a type guard for error handling?
**Answer:**
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

### Q5: How do type guards work with array methods like filter?
**Answer:**
Type guards work particularly well with array methods like `filter`:

```typescript
function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

const mixedArray: (string | number)[] = ['hello', 42, 'world', 100];
const numbers: number[] = mixedArray.filter(isNumber);
// TypeScript knows numbers is number[], not (string | number)[]
```

### Q6: How do you create type guards for discriminated unions?
**Answer:**
For discriminated unions, create type guards based on discriminant properties:

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

## Complex Scenarios

### Q7: How do you create a type guard for multiple types?
**Answer:**
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

### Q8: How do you create generic type guards?
**Answer:**
```typescript
function isArrayOf<T>(value: unknown, typeGuard: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(typeGuard);
}

function isStringArray(value: unknown): value is string[] {
  return isArrayOf(value, (item): item is string => typeof item === 'string');
}

// Usage
const data: unknown = ['hello', 'world'];
if (isStringArray(data)) {
  // TypeScript knows data is string[]
  console.log(data.join(' ')); // ✅ No error
}
```

### Q9: How do you handle null and undefined with type guards?
**Answer:**
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

// Usage
function processValue(value: string | null | undefined) {
  if (isDefined(value)) {
    // TypeScript knows value is string
    console.log(value.toUpperCase()); // ✅ No error
  }
}
```

### Q10: How do you create type guards for complex objects?
**Answer:**
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

## Practical Applications

### Q11: How do you use type guards with API responses?
**Answer:**
```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
}

interface ApiError {
  success: false;
  error: string;
}

type ApiResult<T> = ApiResponse<T> | ApiError;

function isApiResponse<T>(result: ApiResult<T>): result is ApiResponse<T> {
  return result.success === true;
}

function handleApiResult(result: ApiResult<User[]>) {
  if (isApiResponse(result)) {
    // TypeScript knows result is ApiResponse<User[]>
    console.log(result.data); // ✅ No error
  } else {
    // TypeScript knows result is ApiError
    console.log(result.error); // ✅ No error
  }
}
```

### Q12: How do you create type guards for union types with overlapping properties?
**Answer:**
```typescript
interface Bird {
  type: 'bird';
  fly(): void;
  name: string;
}

interface Fish {
  type: 'fish';
  swim(): void;
  name: string;
}

type Animal = Bird | Fish;

function isBird(animal: Animal): animal is Bird {
  return animal.type === 'bird';
}

function move(animal: Animal) {
  if (isBird(animal)) {
    // TypeScript knows animal is Bird
    animal.fly(); // ✅ No error
  } else {
    // TypeScript knows animal is Fish
    animal.swim(); // ✅ No error
  }
}
```

### Q13: How do you create type guards for optional properties?
**Answer:**
```typescript
interface User {
  id: number;
  name: string;
  email?: string;
}

function hasEmail(user: User): user is User & { email: string } {
  return user.email !== undefined;
}

function processUser(user: User) {
  if (hasEmail(user)) {
    // TypeScript knows user.email is string
    console.log(user.email.toUpperCase()); // ✅ No error
  }
}
```

### Q14: How do you create type guards for function types?
**Answer:**
```typescript
function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

function isAsyncFunction(value: unknown): value is (...args: any[]) => Promise<any> {
  return isFunction(value) && value.constructor.name === 'AsyncFunction';
}

function handleCallback(callback: unknown) {
  if (isAsyncFunction(callback)) {
    // TypeScript knows callback is async function
    callback().then(result => console.log(result)); // ✅ No error
  }
}
```

### Q15: How do you create type guards for array types?
**Answer:**
```typescript
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every(item => typeof item === 'number');
}

function processArray(data: unknown) {
  if (isStringArray(data)) {
    // TypeScript knows data is string[]
    console.log(data.join(', ')); // ✅ No error
  } else if (isNumberArray(data)) {
    // TypeScript knows data is number[]
    console.log(data.reduce((sum, num) => sum + num, 0)); // ✅ No error
  }
}
```

## Best Practices and Common Pitfalls

### Q16: What are the best practices for creating type guards?
**Answer:**
1. **Use descriptive names**: `isUser`, `isAdmin`, `isError`
2. **Keep guards simple**: Focus on one type check per guard
3. **Use for error handling**: Always use type guards when dealing with `unknown` types
4. **Combine with discriminated unions**: Perfect for handling different state types
5. **Test your guards**: Ensure they correctly identify types at runtime

### Q17: What are common pitfalls when using type guards?
**Answer:**
1. **Don't forget the return type**: Always use `parameter is Type` syntax
2. **Runtime vs compile-time**: Type guards must work at runtime, not just compile-time
3. **Avoid complex logic**: Keep guards simple and focused
4. **Handle edge cases**: Consider null, undefined, and unexpected values

### Q18: How do you test type guards?
**Answer:**
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Test cases
console.log(isString('hello')); // true
console.log(isString(42)); // false
console.log(isString(null)); // false
console.log(isString(undefined)); // false
console.log(isString({})); // false
```

### Q19: How do you combine multiple type guards?
**Answer:**
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNotEmpty(value: string): value is string {
  return value.length > 0;
}

function processValue(value: unknown) {
  if (isString(value) && isNotEmpty(value)) {
    // TypeScript knows value is non-empty string
    console.log(value.toUpperCase()); // ✅ No error
  }
}
```

### Q20: How do you create type guards for nested objects?
**Answer:**
```typescript
interface Address {
  street: string;
  city: string;
  country: string;
}

interface User {
  id: number;
  name: string;
  address?: Address;
}

function hasAddress(user: User): user is User & { address: Address } {
  return user.address !== undefined;
}

function processUser(user: User) {
  if (hasAddress(user)) {
    // TypeScript knows user.address is Address
    console.log(user.address.city); // ✅ No error
  }
}
```

## Advanced Patterns

### Q21: How do you create type guards for recursive types?
**Answer:**
```typescript
interface TreeNode {
  value: number;
  children?: TreeNode[];
}

function isTreeNode(value: unknown): value is TreeNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    typeof (value as any).value === 'number' &&
    (!('children' in value) || Array.isArray((value as any).children))
  );
}

function processTree(data: unknown) {
  if (isTreeNode(data)) {
    // TypeScript knows data is TreeNode
    console.log(data.value); // ✅ No error
    if (data.children) {
      data.children.forEach(child => processTree(child));
    }
  }
}
```

### Q22: How do you create type guards for generic types?
**Answer:**
```typescript
interface Container<T> {
  value: T;
  type: string;
}

function isContainer<T>(value: unknown, typeGuard: (item: unknown) => item is T): value is Container<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'type' in value &&
    typeGuard((value as any).value)
  );
}

function isStringContainer(value: unknown): value is Container<string> {
  return isContainer(value, (item): item is string => typeof item === 'string');
}
```

### Q23: How do you create type guards for union types with complex conditions?
**Answer:**
```typescript
interface SuccessResult {
  success: true;
  data: any;
  timestamp: number;
}

interface ErrorResult {
  success: false;
  error: string;
  code: number;
}

type Result = SuccessResult | ErrorResult;

function isSuccessResult(result: Result): result is SuccessResult {
  return result.success === true;
}

function isErrorResult(result: Result): result is ErrorResult {
  return result.success === false;
}

function handleResult(result: Result) {
  if (isSuccessResult(result)) {
    // TypeScript knows result is SuccessResult
    console.log(result.data, result.timestamp); // ✅ No error
  } else if (isErrorResult(result)) {
    // TypeScript knows result is ErrorResult
    console.log(result.error, result.code); // ✅ No error
  }
}
```

### Q24: How do you create type guards for function overloads?
**Answer:**
```typescript
function processValue(value: string): string;
function processValue(value: number): number;
function processValue(value: string | number): string | number {
  if (typeof value === 'string') {
    return value.toUpperCase();
  } else {
    return value * 2;
  }
}

function isStringValue(value: string | number): value is string {
  return typeof value === 'string';
}

function handleValue(value: string | number) {
  if (isStringValue(value)) {
    // TypeScript knows value is string
    const result = processValue(value); // result is string
    console.log(result.toLowerCase()); // ✅ No error
  } else {
    // TypeScript knows value is number
    const result = processValue(value); // result is number
    console.log(result.toFixed(2)); // ✅ No error
  }
}
```

### Q25: How do you create type guards for mapped types?
**Answer:**
```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
}

function isPartialUser(value: unknown): value is Partial<User> {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as any).id === undefined || typeof (value as any).id === 'number') &&
    (value as any).name === undefined || typeof (value as any).name === 'string') &&
    (value as any).email === undefined || typeof (value as any).email === 'string')
  );
}

function updateUser(user: User, updates: Partial<User>) {
  // TypeScript knows updates is Partial<User>
  return { ...user, ...updates };
}
```

These questions cover the fundamental concepts, advanced patterns, and practical applications of Type Guards in TypeScript, providing comprehensive coverage for interview preparation.

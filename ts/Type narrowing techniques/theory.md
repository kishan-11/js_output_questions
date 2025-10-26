# Type Narrowing Techniques in TypeScript

Type narrowing is the process of reducing the possible types of a variable within a specific code block. TypeScript uses various techniques to narrow types, making your code more type-safe and enabling better IntelliSense.

## 1. Equality Checks

TypeScript can narrow types based on equality comparisons:

```typescript
function processValue(value: string | number) {
  if (value === "hello") {
    // TypeScript knows value is "hello" (string literal)
    console.log(value.toUpperCase()); // ✅ Safe
  }
  
  if (value !== null) {
    // TypeScript knows value is not null
    console.log(value.toString()); // ✅ Safe
  }
}
```

## 2. Truthiness Checks

TypeScript narrows types based on truthiness:

```typescript
function processValue(value: string | null | undefined) {
  if (value) {
    // TypeScript knows value is truthy (not null, undefined, or empty string)
    console.log(value.length); // ✅ Safe
  }
  
  if (!value) {
    // TypeScript knows value is falsy
    console.log("Value is falsy");
  }
}
```

## 3. Literal Comparisons

TypeScript can narrow to specific literal types:

```typescript
type Status = "loading" | "success" | "error";

function handleStatus(status: Status) {
  switch (status) {
    case "loading":
      // TypeScript knows status is "loading"
      return "Please wait...";
    case "success":
      // TypeScript knows status is "success"
      return "Operation completed";
    case "error":
      // TypeScript knows status is "error"
      return "Something went wrong";
  }
}
```

## 4. `typeof` Guards

Use `typeof` to narrow primitive types:

```typescript
function processValue(value: string | number | boolean) {
  if (typeof value === "string") {
    // TypeScript knows value is string
    console.log(value.toUpperCase());
  } else if (typeof value === "number") {
    // TypeScript knows value is number
    console.log(value.toFixed(2));
  } else {
    // TypeScript knows value is boolean
    console.log(value ? "true" : "false");
  }
}
```

## 5. `instanceof` Guards

Use `instanceof` to narrow class types:

```typescript
class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function handleAnimal(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    // TypeScript knows animal is Dog
    animal.bark(); // ✅ Safe
  } else {
    // TypeScript knows animal is Cat
    animal.meow(); // ✅ Safe
  }
}
```

## 6. `in` Guards

Use `in` operator to check for property existence:

```typescript
interface Bird {
  fly(): void;
}

interface Fish {
  swim(): void;
}

function handleAnimal(animal: Bird | Fish) {
  if ("fly" in animal) {
    // TypeScript knows animal is Bird
    animal.fly(); // ✅ Safe
  } else {
    // TypeScript knows animal is Fish
    animal.swim(); // ✅ Safe
  }
}
```

## 7. Control Flow Analysis

TypeScript analyzes control flow to narrow types:

```typescript
function processValue(value: string | null) {
  // Early return narrows the type
  if (value === null) {
    return; // Early return
  }
  
  // TypeScript knows value is string here
  console.log(value.length); // ✅ Safe
}
```

## 8. Discriminated Unions

Use discriminant properties for type narrowing:

```typescript
interface LoadingState {
  status: "loading";
  progress: number;
}

interface SuccessState {
  status: "success";
  data: string;
}

interface ErrorState {
  status: "error";
  message: string;
}

type AppState = LoadingState | SuccessState | ErrorState;

function handleState(state: AppState) {
  switch (state.status) {
    case "loading":
      // TypeScript knows state is LoadingState
      console.log(`Progress: ${state.progress}%`);
      break;
    case "success":
      // TypeScript knows state is SuccessState
      console.log(`Data: ${state.data}`);
      break;
    case "error":
      // TypeScript knows state is ErrorState
      console.log(`Error: ${state.message}`);
      break;
  }
}
```

## 9. User-Defined Type Predicates

Create custom type guards:

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

function processValue(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is string
    console.log(value.toUpperCase());
  } else if (isNumber(value)) {
    // TypeScript knows value is number
    console.log(value.toFixed(2));
  }
}
```

## 10. Assertion Functions

Use assertion functions for type narrowing:

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Expected string");
  }
}

function processValue(value: unknown) {
  assertIsString(value);
  // TypeScript knows value is string after assertion
  console.log(value.toUpperCase()); // ✅ Safe
}
```

## 11. Nullish Coalescing and Optional Chaining

Use modern operators for safe type narrowing:

```typescript
interface User {
  name?: string;
  email?: string;
}

function processUser(user: User | null | undefined) {
  const name = user?.name ?? "Anonymous";
  const email = user?.email ?? "No email";
  
  // TypeScript knows name and email are strings
  console.log(`Name: ${name}, Email: ${email}`);
}
```

## Best Practices

1. **Prefer Early Returns**: Use early returns to help TypeScript narrow types reliably
2. **Use Discriminated Unions**: Design your types with discriminant properties for better narrowing
3. **Create Custom Type Guards**: Write reusable type predicates for complex type checks
4. **Leverage Control Flow**: Let TypeScript's control flow analysis work for you
5. **Use Modern Operators**: Take advantage of optional chaining and nullish coalescing

## Common Patterns

### Defensive Programming
```typescript
function safeProcess(value: unknown) {
  if (typeof value === "string" && value.length > 0) {
    // TypeScript knows value is non-empty string
    return value.toUpperCase();
  }
  return "Invalid input";
}
```

### Union Type Narrowing
```typescript
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

function handleResult<T>(result: Result<T>) {
  if (result.success) {
    // TypeScript knows result has data property
    return result.data;
  } else {
    // TypeScript knows result has error property
    throw new Error(result.error);
  }
}
```

Type narrowing is essential for writing type-safe TypeScript code and should be used whenever you need to work with union types or unknown values.

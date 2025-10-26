# Type Narrowing Techniques - Questions and Answers

## Basic Type Narrowing

### Q1: What is type narrowing in TypeScript and why is it important?

**Answer:**
Type narrowing is the process of reducing the possible types of a variable within a specific code block. TypeScript uses various techniques to narrow types, making your code more type-safe and enabling better IntelliSense.

**Why it's important:**
- **Type Safety**: Prevents runtime errors by ensuring operations are performed on the correct types
- **Better IntelliSense**: Provides accurate autocomplete and error detection
- **Code Clarity**: Makes code more readable by explicitly handling different types
- **Runtime Safety**: Catches type-related bugs at compile time

**Example:**
```typescript
function processValue(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    console.log(value.toUpperCase()); // ✅ Safe
  } else {
    // TypeScript knows value is number here
    console.log(value.toFixed(2)); // ✅ Safe
  }
}
```

### Q2: How does TypeScript narrow types using equality checks?

**Answer:**
TypeScript can narrow types based on equality comparisons using `===`, `!==`, `==`, and `!=` operators.

**Examples:**
```typescript
function processValue(value: string | null | undefined) {
  if (value === null) {
    // TypeScript knows value is null
    console.log("Value is null");
  } else if (value === undefined) {
    // TypeScript knows value is undefined
    console.log("Value is undefined");
  } else {
    // TypeScript knows value is string
    console.log(value.toUpperCase());
  }
}

// Literal type narrowing
type Status = "loading" | "success" | "error";
function handleStatus(status: Status) {
  if (status === "loading") {
    // TypeScript knows status is "loading"
    return "Please wait...";
  }
  // TypeScript knows status is "success" | "error"
}
```

### Q3: Explain how truthiness checks work for type narrowing.

**Answer:**
TypeScript narrows types based on truthiness checks using `if`, `!`, and other boolean contexts.

**Examples:**
```typescript
function processValue(value: string | null | undefined | "") {
  if (value) {
    // TypeScript knows value is truthy (not null, undefined, or empty string)
    console.log(value.length); // ✅ Safe
  }
  
  if (!value) {
    // TypeScript knows value is falsy
    console.log("Value is falsy");
  }
}

// With arrays
function processArray(arr: string[] | null) {
  if (arr && arr.length > 0) {
    // TypeScript knows arr is non-empty array
    console.log(arr[0].toUpperCase());
  }
}
```

## Built-in Type Guards

### Q4: How do `typeof` guards work for type narrowing?

**Answer:**
The `typeof` operator is used to narrow primitive types. TypeScript recognizes specific `typeof` patterns and narrows accordingly.

**Examples:**
```typescript
function processValue(value: string | number | boolean | object) {
  if (typeof value === "string") {
    // TypeScript knows value is string
    console.log(value.toUpperCase());
  } else if (typeof value === "number") {
    // TypeScript knows value is number
    console.log(value.toFixed(2));
  } else if (typeof value === "boolean") {
    // TypeScript knows value is boolean
    console.log(value ? "true" : "false");
  } else {
    // TypeScript knows value is object
    console.log("Object received");
  }
}

// Common typeof patterns
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}
```

### Q5: Explain `instanceof` guards and when to use them.

**Answer:**
`instanceof` guards are used to narrow class types by checking if an object is an instance of a specific class.

**Examples:**
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

// With built-in types
function processValue(value: Date | string) {
  if (value instanceof Date) {
    // TypeScript knows value is Date
    console.log(value.getFullYear());
  } else {
    // TypeScript knows value is string
    console.log(value.toUpperCase());
  }
}
```

### Q6: How does the `in` operator work for type narrowing?

**Answer:**
The `in` operator checks for property existence and can be used to narrow types based on the presence of specific properties.

**Examples:**
```typescript
interface Bird {
  fly(): void;
  name: string;
}

interface Fish {
  swim(): void;
  name: string;
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

// With optional properties
interface User {
  name: string;
  email?: string;
}

function processUser(user: User) {
  if ("email" in user) {
    // TypeScript knows email exists
    console.log(user.email.toUpperCase()); // ✅ Safe
  }
}
```

## Control Flow Analysis

### Q7: How does TypeScript's control flow analysis work for type narrowing?

**Answer:**
TypeScript analyzes the control flow of your code to narrow types based on the execution path. This includes early returns, conditional statements, and loop conditions.

**Examples:**
```typescript
function processValue(value: string | null) {
  // Early return narrows the type
  if (value === null) {
    return; // Early return
  }
  
  // TypeScript knows value is string here
  console.log(value.length); // ✅ Safe
}

// With loops
function processArray(arr: (string | null)[]) {
  for (const item of arr) {
    if (item === null) continue;
    // TypeScript knows item is string here
    console.log(item.toUpperCase());
  }
}

// With switch statements
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

### Q8: What are discriminated unions and how do they help with type narrowing?

**Answer:**
Discriminated unions are union types that share a common discriminant property. This property helps TypeScript narrow the type more effectively.

**Examples:**
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

// With multiple discriminants
interface User {
  type: "admin" | "user";
  permissions: string[];
}

interface Admin extends User {
  type: "admin";
  adminLevel: number;
}

interface RegularUser extends User {
  type: "user";
  lastLogin: Date;
}

function processUser(user: Admin | RegularUser) {
  if (user.type === "admin") {
    // TypeScript knows user is Admin
    console.log(`Admin level: ${user.adminLevel}`);
  } else {
    // TypeScript knows user is RegularUser
    console.log(`Last login: ${user.lastLogin}`);
  }
}
```

## Custom Type Guards

### Q9: How do you create custom type predicates for type narrowing?

**Answer:**
Custom type predicates are functions that return a type predicate (`value is Type`) to help TypeScript narrow types.

**Examples:**
```typescript
// Basic type predicates
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

// Complex type predicates
interface User {
  name: string;
  email: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "email" in value &&
    typeof (value as any).name === "string" &&
    typeof (value as any).email === "string"
  );
}

// Usage
function processValue(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is string
    console.log(value.toUpperCase());
  } else if (isNumber(value)) {
    // TypeScript knows value is number
    console.log(value.toFixed(2));
  } else if (isUser(value)) {
    // TypeScript knows value is User
    console.log(`User: ${value.name} (${value.email})`);
  }
}
```

### Q10: What are assertion functions and how do they differ from type predicates?

**Answer:**
Assertion functions are functions that throw an error if a condition is not met, and they use the `asserts` keyword to indicate that they narrow the type.

**Key differences:**
- **Type predicates**: Return boolean, used in conditional statements
- **Assertion functions**: Throw errors, used for runtime validation

**Examples:**
```typescript
// Type predicate (returns boolean)
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// Assertion function (throws error)
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Expected string");
  }
}

// Usage comparison
function processWithPredicate(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is string
    console.log(value.toUpperCase());
  }
}

function processWithAssertion(value: unknown) {
  assertIsString(value);
  // TypeScript knows value is string after assertion
  console.log(value.toUpperCase());
}

// Complex assertion function
function assertIsUser(value: unknown): asserts value is User {
  if (
    typeof value !== "object" ||
    value === null ||
    !("name" in value) ||
    !("email" in value) ||
    typeof (value as any).name !== "string" ||
    typeof (value as any).email !== "string"
  ) {
    throw new Error("Expected User object");
  }
}
```

## Advanced Patterns

### Q11: How do you handle type narrowing with optional chaining and nullish coalescing?

**Answer:**
Modern JavaScript operators like optional chaining (`?.`) and nullish coalescing (`??`) work well with TypeScript's type narrowing.

**Examples:**
```typescript
interface User {
  name?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
  };
}

function processUser(user: User | null | undefined) {
  // Optional chaining with type narrowing
  const name = user?.name ?? "Anonymous";
  const email = user?.email ?? "No email";
  
  // TypeScript knows name and email are strings
  console.log(`Name: ${name}, Email: ${email}`);
  
  // Nested optional chaining
  const city = user?.address?.city ?? "Unknown city";
  console.log(`City: ${city}`);
}

// With arrays
function processItems(items: (string | null)[] | null) {
  const validItems = items?.filter((item): item is string => item !== null) ?? [];
  // TypeScript knows validItems is string[]
  console.log(validItems.map(item => item.toUpperCase()));
}
```

### Q12: How do you handle type narrowing with generics?

**Answer:**
Type narrowing works with generics, but you need to be careful about the constraints and how TypeScript infers types.

**Examples:**
```typescript
// Generic type guard
function isOfType<T>(value: unknown, type: string): value is T {
  return typeof value === type;
}

// Generic assertion function
function assertIsOfType<T>(value: unknown, type: string): asserts value is T {
  if (typeof value !== type) {
    throw new Error(`Expected ${type}`);
  }
}

// Usage with generics
function processGenericValue<T extends string | number>(value: T) {
  if (typeof value === "string") {
    // TypeScript knows value is string
    console.log(value.toUpperCase());
  } else {
    // TypeScript knows value is number
    console.log(value.toFixed(2));
  }
}

// With generic constraints
interface Identifiable {
  id: string;
}

function processIdentifiable<T extends Identifiable>(item: T | null) {
  if (item === null) {
    return;
  }
  // TypeScript knows item is T (which extends Identifiable)
  console.log(`ID: ${item.id}`);
}
```

## Common Pitfalls and Best Practices

### Q13: What are common pitfalls when using type narrowing?

**Answer:**
Common pitfalls include:

1. **Assuming type narrowing persists across function boundaries**
2. **Not handling all cases in discriminated unions**
3. **Using type assertions instead of proper narrowing**
4. **Ignoring the `never` type in exhaustive checks**

**Examples:**
```typescript
// ❌ Bad: Type narrowing doesn't persist across function boundaries
function isString(value: unknown): boolean {
  return typeof value === "string";
}

function processValue(value: unknown) {
  if (isString(value)) {
    // ❌ TypeScript doesn't know value is string
    console.log(value.toUpperCase()); // Error!
  }
}

// ✅ Good: Use type predicates
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue(value: unknown) {
  if (isString(value)) {
    // ✅ TypeScript knows value is string
    console.log(value.toUpperCase());
  }
}

// ❌ Bad: Not handling all cases
type Status = "loading" | "success" | "error";
function handleStatus(status: Status) {
  switch (status) {
    case "loading":
      return "Please wait...";
    case "success":
      return "Done!";
    // ❌ Missing "error" case
  }
}

// ✅ Good: Handle all cases
function handleStatus(status: Status) {
  switch (status) {
    case "loading":
      return "Please wait...";
    case "success":
      return "Done!";
    case "error":
      return "Something went wrong";
  }
}
```

### Q14: What are the best practices for type narrowing?

**Answer:**
Best practices include:

1. **Prefer early returns** to help TypeScript narrow types reliably
2. **Use discriminated unions** for better type safety
3. **Create reusable type guards** for complex type checks
4. **Leverage control flow analysis** instead of type assertions
5. **Use modern operators** like optional chaining and nullish coalescing

**Examples:**
```typescript
// ✅ Good: Early returns
function processValue(value: string | null) {
  if (value === null) {
    return; // Early return
  }
  // TypeScript knows value is string
  console.log(value.length);
}

// ✅ Good: Discriminated unions
interface LoadingState {
  status: "loading";
  progress: number;
}

interface SuccessState {
  status: "success";
  data: string;
}

type AppState = LoadingState | SuccessState;

function handleState(state: AppState) {
  switch (state.status) {
    case "loading":
      console.log(`Progress: ${state.progress}%`);
      break;
    case "success":
      console.log(`Data: ${state.data}`);
      break;
  }
}

// ✅ Good: Reusable type guards
function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function processValue(value: unknown) {
  if (isNonEmptyString(value)) {
    // TypeScript knows value is non-empty string
    console.log(value.toUpperCase());
  }
}
```

### Q15: How do you handle type narrowing with complex nested types?

**Answer:**
For complex nested types, use a combination of type guards, optional chaining, and careful type design.

**Examples:**
```typescript
interface User {
  id: string;
  profile?: {
    name?: string;
    email?: string;
    preferences?: {
      theme?: "light" | "dark";
      notifications?: boolean;
    };
  };
}

// Type guards for nested types
function hasProfile(user: User): user is User & { profile: NonNullable<User["profile"]> } {
  return user.profile !== undefined;
}

function hasPreferences(user: User): user is User & { 
  profile: NonNullable<User["profile"]> & { 
    preferences: NonNullable<User["profile"]["preferences"]> 
  } 
} {
  return user.profile?.preferences !== undefined;
}

// Usage
function processUser(user: User) {
  if (hasProfile(user)) {
    // TypeScript knows user.profile exists
    console.log(`Profile exists: ${user.profile.name ?? "No name"}`);
    
    if (hasPreferences(user)) {
      // TypeScript knows user.profile.preferences exists
      console.log(`Theme: ${user.profile.preferences.theme}`);
    }
  }
}

// Alternative approach with optional chaining
function processUserSimple(user: User) {
  const name = user.profile?.name ?? "Anonymous";
  const theme = user.profile?.preferences?.theme ?? "light";
  
  console.log(`Name: ${name}, Theme: ${theme}`);
}
```

These questions and answers cover the essential aspects of TypeScript type narrowing techniques, from basic concepts to advanced patterns and best practices.

# Strict Null Checks - Questions and Answers

## Basic Concepts

### Q1: What are strict null checks in TypeScript and why are they important?

**Answer:**
Strict null checks (`--strictNullChecks`) is a TypeScript compiler option that makes `null` and `undefined` values more explicit in the type system. When enabled:

- `null` and `undefined` become distinct types that are not assignable to other types
- You must explicitly handle potentially null/undefined values
- Prevents common runtime errors like "Cannot read property 'x' of null"

**Example:**
```ts
// Without strict null checks
let name: string = null; // ✅ Allowed but dangerous

// With strict null checks
let name: string = null; // ❌ Error: Type 'null' is not assignable to type 'string'
let name: string | null = null; // ✅ Correct
```

### Q2: How do you enable strict null checks in a TypeScript project?

**Answer:**
You can enable strict null checks in two ways:

1. **In tsconfig.json:**
```json
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

2. **Via command line:**
```bash
tsc --strictNullChecks
```

3. **As part of strict mode:**
```json
{
  "compilerOptions": {
    "strict": true // This includes strictNullChecks
  }
}
```

### Q3: What's the difference between optional properties (`?`) and union types with `null`?

**Answer:**

**Optional properties (`?`):**
```ts
interface User {
  name: string;
  email?: string; // Optional - can be string or undefined
}

const user: User = { name: "John" }; // email is undefined
```

**Union types with null:**
```ts
interface User {
  name: string;
  email: string | null; // Explicitly nullable
}

const user: User = { name: "John", email: null }; // email is explicitly null
```

**Key differences:**
- Optional properties default to `undefined` when not provided
- Union types with `null` require explicit `null` assignment
- Optional properties are more common for optional data
- Union types with `null` are better for "no value" scenarios

## Type Narrowing and Guards

### Q4: How does type narrowing work with strict null checks?

**Answer:**
TypeScript can narrow types based on runtime checks, allowing you to safely access properties after null checks:

```ts
function processValue(value: string | null) {
  if (value === null) {
    // TypeScript knows value is null here
    console.log("Value is null");
    return;
  }
  // TypeScript knows value is string here
  console.log(value.toUpperCase()); // ✅ Safe
}
```

**Common narrowing patterns:**
```ts
// Truthy checks
if (value) {
  // value is not null/undefined
}

// Explicit null checks
if (value !== null) {
  // value is not null
}

// Type guards
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```

### Q5: What are type guards and how do they work with strict null checks?

**Answer:**
Type guards are functions that help TypeScript narrow types at runtime. They're especially useful with strict null checks:

```ts
// Simple type guard
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Null check type guard
function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

// Usage
function processInput(input: unknown) {
  if (isString(input)) {
    // TypeScript knows input is string
    console.log(input.toUpperCase());
  }
  
  if (isNotNull(input)) {
    // TypeScript knows input is not null
    console.log(input);
  }
}
```

## Advanced Patterns

### Q6: What is the non-null assertion operator (`!`) and when should you use it?

**Answer:**
The non-null assertion operator (`!`) tells TypeScript that a value is not null/undefined:

```ts
let element = document.getElementById("myDiv");
element!.style.color = "red"; // Assert that element is not null
```

**When to use:**
- When you're certain a value is not null/undefined
- After manual null checks
- With DOM elements you know exist

**When NOT to use:**
- As a quick fix for compilation errors
- When you're not certain about the value
- Instead of proper null handling

**Better approach:**
```ts
// Instead of:
element!.style.color = "red";

// Use:
if (element) {
  element.style.color = "red";
}
```

### Q7: How do you handle arrays and objects with strict null checks?

**Answer:**

**Arrays:**
```ts
// Array that might be null
let items: string[] | null = null;

// Safe access
if (items) {
  items.forEach(item => console.log(item));
}

// Or use optional chaining
items?.forEach(item => console.log(item));
```

**Objects:**
```ts
interface User {
  name: string;
  profile?: {
    avatar?: string;
    settings?: {
      theme: string;
    };
  };
}

// Safe nested access
function getTheme(user: User): string | undefined {
  return user.profile?.settings?.theme;
}

// With nullish coalescing
function getThemeWithDefault(user: User): string {
  return user.profile?.settings?.theme ?? "light";
}
```

### Q8: What are utility types for handling null/undefined values?

**Answer:**
TypeScript provides several utility types for working with null/undefined:

```ts
// NonNullable<T> - removes null and undefined
type NonNullable<T> = T extends null | undefined ? never : T;

type UserName = string | null;
type NonNullUserName = NonNullable<UserName>; // string

// Partial<T> - makes all properties optional
interface User {
  name: string;
  email: string;
}
type PartialUser = Partial<User>; // { name?: string; email?: string; }

// Required<T> - makes all properties required
type RequiredUser = Required<PartialUser>; // { name: string; email: string; }

// Pick<T, K> - select specific properties
type UserNameOnly = Pick<User, 'name'>; // { name: string; }

// Omit<T, K> - exclude specific properties
type UserWithoutEmail = Omit<User, 'email'>; // { name: string; }
```

## Error Handling Patterns

### Q9: How do you implement proper error handling with strict null checks?

**Answer:**

**Result Pattern:**
```ts
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

function fetchUser(id: number): Result<User> {
  try {
    const user = getUserById(id);
    if (!user) {
      return { success: false, error: new Error("User not found") };
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Usage
const result = fetchUser(1);
if (result.success) {
  console.log(result.data.name); // TypeScript knows data exists
} else {
  console.error(result.error.message);
}
```

**Maybe Pattern:**
```ts
class Maybe<T> {
  constructor(private value: T | null) {}
  
  map<U>(fn: (value: T) => U): Maybe<U> {
    return this.value === null ? new Maybe<U>(null) : new Maybe(fn(this.value));
  }
  
  getOrElse(defaultValue: T): T {
    return this.value ?? defaultValue;
  }
  
  isPresent(): boolean {
    return this.value !== null;
  }
}

// Usage
const maybeName = new Maybe<string>(null);
const upperName = maybeName
  .map(name => name.toUpperCase())
  .getOrElse("UNKNOWN");
```

### Q10: How do you migrate existing code to use strict null checks?

**Answer:**

**Migration strategy:**

1. **Enable incrementally:**
```json
{
  "compilerOptions": {
    "strictNullChecks": true,
    "skipLibCheck": true // Skip checking .d.ts files initially
  }
}
```

2. **Fix errors systematically:**
```ts
// Before
function getUser(id: number) {
  return users.find(u => u.id === id); // Returns User | undefined
}

// After
function getUser(id: number): User | null {
  return users.find(u => u.id === id) ?? null;
}
```

3. **Use type assertions temporarily:**
```ts
// Temporary fix
const user = getUser(1) as User;

// Then refactor to proper handling
const user = getUser(1);
if (!user) {
  throw new Error("User not found");
}
```

4. **Add proper null checks:**
```ts
// Before
function processUser(user: User) {
  return user.profile.settings.theme; // Might throw
}

// After
function processUser(user: User): string | undefined {
  return user.profile?.settings?.theme;
}
```

## Practical Examples

### Q11: How do you handle API responses with strict null checks?

**Answer:**

```ts
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

interface User {
  id: number;
  name: string;
  email?: string;
}

// API call with proper typing
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return { data: null, error: "User not found", success: false };
    }
    const user = await response.json();
    return { data: user, error: null, success: true };
  } catch (error) {
    return { data: null, error: "Network error", success: false };
  }
}

// Usage
const result = await fetchUser(1);
if (result.success && result.data) {
  console.log(result.data.name);
  if (result.data.email) {
    console.log(result.data.email);
  }
} else {
  console.error(result.error);
}
```

### Q12: How do you handle form validation with strict null checks?

**Answer:**

```ts
interface FormData {
  name: string;
  email: string;
  age?: number;
}

interface ValidationError {
  field: string;
  message: string;
}

type ValidationResult = 
  | { valid: true; data: FormData }
  | { valid: false; errors: ValidationError[] };

function validateForm(formData: Partial<FormData>): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (!formData.name || formData.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  }
  
  if (!formData.email || !formData.email.includes('@')) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }
  
  if (formData.age !== undefined && (formData.age < 0 || formData.age > 120)) {
    errors.push({ field: 'age', message: 'Age must be between 0 and 120' });
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return { 
    valid: true, 
    data: {
      name: formData.name!,
      email: formData.email!,
      age: formData.age
    }
  };
}

// Usage
const formData = { name: "John", email: "john@example.com" };
const result = validateForm(formData);

if (result.valid) {
  console.log("Form is valid:", result.data);
} else {
  console.log("Validation errors:", result.errors);
}
```

### Q13: How do you handle optional chaining and nullish coalescing with strict null checks?

**Answer:**

**Optional chaining (`?.`):**
```ts
interface User {
  name: string;
  profile?: {
    avatar?: string;
    settings?: {
      theme: string;
      notifications: boolean;
    };
  };
}

// Safe property access
function getUserTheme(user: User): string | undefined {
  return user.profile?.settings?.theme;
}

// Safe method calls
function getAvatarUrl(user: User): string | undefined {
  return user.profile?.avatar?.toLowerCase();
}
```

**Nullish coalescing (`??`):**
```ts
// Provide default values
function getDisplayName(user: User): string {
  return user.name ?? user.email ?? "Anonymous";
}

// Configuration with defaults
interface Config {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

function createConfig(userConfig: Config): Required<Config> {
  return {
    apiUrl: userConfig.apiUrl ?? "https://api.example.com",
    timeout: userConfig.timeout ?? 5000,
    retries: userConfig.retries ?? 3
  };
}
```

### Q14: How do you handle DOM manipulation with strict null checks?

**Answer:**

```ts
// Safe DOM element access
function updateElementText(id: string, text: string): boolean {
  const element = document.getElementById(id);
  if (!element) {
    console.error(`Element with id "${id}" not found`);
    return false;
  }
  
  element.textContent = text;
  return true;
}

// Safe event handling
function setupClickHandler(selector: string, handler: () => void): boolean {
  const element = document.querySelector(selector);
  if (!element) {
    console.error(`Element with selector "${selector}" not found`);
    return false;
  }
  
  element.addEventListener('click', handler);
  return true;
}

// Safe form handling
function getFormValue(form: HTMLFormElement, name: string): string | null {
  const input = form.elements.namedItem(name) as HTMLInputElement;
  return input?.value ?? null;
}

// Usage
const form = document.getElementById('myForm') as HTMLFormElement;
if (form) {
  const email = getFormValue(form, 'email');
  if (email) {
    console.log('Email:', email);
  }
}
```

### Q15: How do you create reusable null-safe utility functions?

**Answer:**

```ts
// Safe property access
function safeGet<T, K extends keyof T>(obj: T | null, key: K): T[K] | undefined {
  return obj?.[key];
}

// Safe array access
function safeGetArrayItem<T>(array: T[] | null, index: number): T | undefined {
  return array?.[index];
}

// Safe function call
function safeCall<T extends (...args: any[]) => any>(
  fn: T | null, 
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  return fn?.(...args);
}

// Safe object creation
function createSafeObject<T extends Record<string, any>>(
  data: Partial<T> | null
): T {
  return (data ?? {}) as T;
}

// Usage examples
interface User {
  name: string;
  age: number;
}

const user: User | null = { name: "John", age: 30 };
const name = safeGet(user, 'name'); // string | undefined
const age = safeGet(user, 'age'); // number | undefined

const users: User[] | null = [{ name: "John", age: 30 }];
const firstUser = safeGetArrayItem(users, 0); // User | undefined

const callback: ((x: number) => string) | null = (x) => `Number: ${x}`;
const result = safeCall(callback, 42); // string | undefined
```

## Best Practices Summary

### Q16: What are the key best practices for working with strict null checks?

**Answer:**

1. **Always enable strict null checks in new projects**
2. **Use optional chaining instead of manual null checks**
3. **Prefer nullish coalescing over logical OR for defaults**
4. **Create type guards for complex null checks**
5. **Use the Result pattern for error handling**
6. **Avoid non-null assertions unless absolutely necessary**
7. **Handle null/undefined cases explicitly**
8. **Use utility types for common patterns**
9. **Migrate existing code incrementally**
10. **Write defensive code that handles edge cases**

**Example of good practices:**
```ts
// ✅ Good: Explicit null handling
function processUser(user: User | null): string {
  if (!user) {
    return "No user provided";
  }
  
  return user.name ?? user.email ?? "Anonymous";
}

// ✅ Good: Using optional chaining
function getTheme(user: User): string {
  return user.profile?.settings?.theme ?? "light";
}

// ✅ Good: Type guards
function isValidUser(user: unknown): user is User {
  return typeof user === 'object' && 
         user !== null && 
         'name' in user && 
         typeof (user as any).name === 'string';
}

// ❌ Bad: Ignoring null checks
function badProcessUser(user: User | null): string {
  return user.name; // Might throw if user is null
}

// ❌ Bad: Overusing non-null assertions
function badGetTheme(user: User): string {
  return user.profile!.settings!.theme; // Might throw
}
```

These questions and answers cover the essential concepts, patterns, and best practices for working with strict null checks in TypeScript.

# Strict Null Checks in TypeScript

## Overview

Strict null checks is a TypeScript compiler option that makes `null` and `undefined` values more explicit in the type system. When enabled, it prevents many common runtime errors by catching potential null/undefined access at compile time.

## Key Concepts

### 1. What are Strict Null Checks?

Strict null checks (`--strictNullChecks`) is a TypeScript compiler flag that:
- Makes `null` and `undefined` distinct types that are not assignable to other types
- Requires explicit handling of potentially null/undefined values
- Prevents common runtime errors like "Cannot read property 'x' of null"

### 2. Type System Changes

**Without strict null checks:**
```ts
let name: string = null; // ✅ Allowed
let age: number = undefined; // ✅ Allowed
```

**With strict null checks:**
```ts
let name: string = null; // ❌ Error: Type 'null' is not assignable to type 'string'
let age: number = undefined; // ❌ Error: Type 'undefined' is not assignable to type 'number'
```

### 3. Optional Properties and Parameters

Use `?` to make properties optional:
```ts
interface User {
  name: string;
  email?: string; // Optional property
}

function greet(user: User) {
  console.log(`Hello ${user.name}`);
  if (user.email) {
    console.log(`Email: ${user.email}`);
  }
}
```

### 4. Union Types for Nullable Values

Use union types to explicitly allow null/undefined:
```ts
let value: string | null = null;
let data: number | undefined = undefined;

// Function that might return null
function findUser(id: number): User | null {
  // Implementation
}
```

### 5. Type Narrowing

TypeScript can narrow types based on runtime checks:
```ts
function processValue(value: string | null) {
  if (value === null) {
    // TypeScript knows value is null here
    console.log("Value is null");
    return;
  }
  // TypeScript knows value is string here
  console.log(value.toUpperCase());
}
```

### 6. Non-null Assertion Operator

Use `!` to tell TypeScript that a value is not null/undefined:
```ts
let element = document.getElementById("myDiv");
element!.style.color = "red"; // Assert that element is not null
```

### 7. Optional Chaining and Nullish Coalescing

Modern JavaScript features work great with strict null checks:
```ts
// Optional chaining
const user = getUser();
const email = user?.profile?.email;

// Nullish coalescing
const displayName = user?.name ?? "Anonymous";
```

### 8. Utility Types

TypeScript provides utility types for working with null/undefined:

```ts
// NonNullable<T> - removes null and undefined from T
type NonNullable<T> = T extends null | undefined ? never : T;

// Example usage
type UserName = string | null;
type NonNullUserName = NonNullable<UserName>; // string

// Partial<T> - makes all properties optional
interface User {
  name: string;
  email: string;
}
type PartialUser = Partial<User>; // { name?: string; email?: string; }
```

## Best Practices

### 1. Enable Strict Null Checks
Always enable strict null checks in new projects:
```json
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

### 2. Use Type Guards
Create type guard functions for complex null checks:
```ts
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processInput(input: unknown) {
  if (isString(input)) {
    // TypeScript knows input is string here
    console.log(input.toUpperCase());
  }
}
```

### 3. Prefer Optional Chaining
Use optional chaining instead of manual null checks:
```ts
// Instead of:
if (user && user.profile && user.profile.settings) {
  return user.profile.settings.theme;
}

// Use:
return user?.profile?.settings?.theme;
```

### 4. Use Nullish Coalescing for Defaults
```ts
// Instead of:
const name = user.name || "Anonymous";

// Use:
const name = user.name ?? "Anonymous";
```

### 5. Handle Errors Explicitly
```ts
function parseJSON(json: string): { data: any } | null {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}
```

## Common Patterns

### 1. Defensive Programming
```ts
function safeGetProperty<T>(obj: T | null, key: keyof T): T[keyof T] | undefined {
  return obj?.[key];
}
```

### 2. Result Pattern
```ts
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

function fetchUser(id: number): Result<User> {
  try {
    const user = getUserById(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

### 3. Maybe Pattern
```ts
class Maybe<T> {
  constructor(private value: T | null) {}
  
  map<U>(fn: (value: T) => U): Maybe<U> {
    return this.value === null ? new Maybe<U>(null) : new Maybe(fn(this.value));
  }
  
  getOrElse(defaultValue: T): T {
    return this.value ?? defaultValue;
  }
}
```

## Migration Strategy

When enabling strict null checks in existing projects:

1. **Start with new files** - Enable for new files first
2. **Fix incrementally** - Address errors file by file
3. **Use type assertions temporarily** - Use `as` for quick fixes, then refactor
4. **Add proper null checks** - Replace assumptions with explicit checks

## Example: Complete Implementation

```ts
interface User {
  id: number;
  name: string;
  email?: string;
  profile?: {
    avatar?: string;
    settings?: {
      theme: string;
      notifications: boolean;
    };
  };
}

class UserService {
  private users: Map<number, User> = new Map();
  
  getUser(id: number): User | null {
    return this.users.get(id) ?? null;
  }
  
  updateUserSettings(id: number, settings: User['profile']['settings']): boolean {
    const user = this.getUser(id);
    if (!user) return false;
    
    if (!user.profile) {
      user.profile = {};
    }
    
    user.profile.settings = settings;
    return true;
  }
  
  getDisplayName(user: User): string {
    return user.name ?? user.email ?? "Anonymous";
  }
  
  getAvatarUrl(user: User): string | null {
    return user.profile?.avatar ?? null;
  }
}

// Usage
const userService = new UserService();
const user = userService.getUser(1);

if (user) {
  const displayName = userService.getDisplayName(user);
  const avatar = userService.getAvatarUrl(user);
  
  console.log(`Welcome ${displayName}`);
  if (avatar) {
    console.log(`Avatar: ${avatar}`);
  }
}
```

## Summary

Strict null checks make TypeScript code more robust by:
- Preventing null/undefined access errors
- Making null handling explicit
- Encouraging defensive programming
- Improving code reliability and maintainability

The key is to embrace the type system and handle null/undefined cases explicitly rather than ignoring them.



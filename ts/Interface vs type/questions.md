# Interview Questions: Interface vs Type

## 1. Differences in declaration merging, extends vs intersections, and callable types

### Declaration Merging

**Interfaces support declaration merging:**
```ts
interface User {
  id: number;
}

interface User {
  name: string;
}

// Result: User = { id: number; name: string }
```

**Types do NOT support declaration merging:**
```ts
type User = { id: number };
type User = { name: string }; // ❌ Error: Duplicate identifier 'User'
```

### Extends vs Intersections

**Interface extends (inheritance):**
```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}
// Dog = { name: string; breed: string }
```

**Type intersections (&):**
```ts
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};
// Dog = { name: string; breed: string }
```

**Key differences:**
- `extends` creates a true inheritance relationship
- `&` creates a computed intersection type
- Interfaces can extend multiple interfaces
- Types can intersect multiple types

### Callable Types

**Interface callable signatures:**
```ts
interface Handler {
  (event: string): void;
  reset(): void;
  count: number;
}
```

**Type callable signatures:**
```ts
type Handler = {
  (event: string): void;
  reset(): void;
  count: number;
};

// Or as function type
type SimpleHandler = (event: string) => void;
```

---

## 2. When would you prefer an interface for public API vs a type alias?

### Prefer Interface for Public APIs when:

**✅ Declaration merging is needed:**
```ts
// Library can be extended by users
interface MyLibrary {
  version: string;
}

// User can extend
interface MyLibrary {
  customMethod(): void;
}
```

**✅ Class-based architecture:**
```ts
interface Repository<T> {
  findById(id: string): Promise<T>;
  save(entity: T): Promise<T>;
}

class UserRepository implements Repository<User> {
  // Implementation
}
```

**✅ Third-party library integration:**
```ts
// Better for augmenting existing libraries
declare module 'express' {
  interface Request {
    user?: User;
  }
}
```

### Prefer Type for Public APIs when:

**✅ Union types or discriminated unions:**
```ts
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };
```

**✅ Complex conditional logic:**
```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

**✅ Utility types:**
```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

---

## 3. How do you augment third-party interfaces vs re-open types?

### Interface Augmentation (Recommended)

**Global augmentation:**
```ts
declare global {
  interface Window {
    myCustomProperty: string;
  }
}
```

**Module augmentation:**
```ts
declare module 'some-library' {
  interface SomeInterface {
    customMethod(): void;
  }
}
```

**Library-specific augmentation:**
```ts
// For Express.js
declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
    session?: Session;
  }
}
```

### Type Re-opening (Limited options)

**Using module augmentation with types:**
```ts
declare module 'some-library' {
  type ExtendedType = OriginalType & {
    customProperty: string;
  };
}
```

**Using namespace merging:**
```ts
namespace MyLibrary {
  export type ExtendedConfig = Config & {
    customOption: boolean;
  };
}
```

**Best practices:**
- Use interfaces for third-party augmentation
- Create new types that extend existing ones
- Use module augmentation for library extensions

---

## 4. Show converting between interface-based and type-based models cleanly

### Interface to Type Conversion

**Simple object interface:**
```ts
// Before (interface)
interface User {
  id: number;
  name: string;
  email: string;
}

// After (type)
type User = {
  id: number;
  name: string;
  email: string;
};
```

**Interface with methods:**
```ts
// Before (interface)
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

// After (type)
type Calculator = {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
};
```

**Interface with generics:**
```ts
// Before (interface)
interface Repository<T> {
  findById(id: string): Promise<T>;
  save(entity: T): Promise<T>;
}

// After (type)
type Repository<T> = {
  findById(id: string): Promise<T>;
  save(entity: T): Promise<T>;
};
```

### Type to Interface Conversion

**Object type (only possible for object types):**
```ts
// Before (type)
type User = {
  id: number;
  name: string;
  email: string;
};

// After (interface)
interface User {
  id: number;
  name: string;
  email: string;
}
```

**Cannot convert union types to interfaces:**
```ts
// This CANNOT be converted to interface
type Status = 'loading' | 'success' | 'error';

// This CANNOT be converted to interface
type Point = [number, number];
```

### Migration Strategies

**Gradual migration approach:**
```ts
// Step 1: Create type alias for existing interface
interface LegacyUser {
  id: number;
  name: string;
}

type User = LegacyUser; // Bridge

// Step 2: Extend with new properties
type ExtendedUser = User & {
  email: string;
  createdAt: Date;
};

// Step 3: Eventually replace interface with type
type User = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};
```

**Hybrid approach:**
```ts
// Use interface for extensibility
interface BaseEntity {
  id: number;
  createdAt: Date;
}

// Use type for specific implementations
type User = BaseEntity & {
  name: string;
  email: string;
};

type Product = BaseEntity & {
  title: string;
  price: number;
};
```

---

## 5. How do interfaces/types affect emit and runtime (if at all)?

### Compile-time Impact

**No runtime difference:**
```ts
// Both compile to the same JavaScript (nothing)
interface UserInterface {
  id: number;
  name: string;
}

type UserType = {
  id: number;
  name: string;
};

// Compiled JavaScript output:
// (empty - both are erased)
```

**Compilation performance:**
```ts
// Interfaces - slightly faster for simple cases
interface SimpleUser {
  id: number;
  name: string;
}

// Types - may be slower for complex unions
type ComplexUser = 
  | { type: 'admin'; permissions: string[] }
  | { type: 'user'; role: string }
  | { type: 'guest' };
```

### Memory Usage During Compilation

**Interface compilation:**
- Slightly more memory for declaration merging
- Better for large codebases with many extensions
- Faster type checking for simple object shapes

**Type compilation:**
- More memory for complex union types
- Slower type checking for conditional types
- Better for complex type transformations

### Runtime Behavior

**Both are completely erased:**
```ts
// TypeScript
interface User {
  id: number;
  name: string;
}

function createUser(): User {
  return { id: 1, name: 'John' };
}

// Compiled JavaScript
function createUser() {
  return { id: 1, name: 'John' };
}
```

**No runtime performance difference:**
- Both compile to identical JavaScript
- No runtime type checking
- No memory overhead
- No performance impact

### Bundle Size Impact

**No impact on bundle size:**
```ts
// These produce identical JavaScript
interface ApiResponse<T> {
  data: T;
  status: number;
}

type ApiResponse<T> = {
  data: T;
  status: number;
};

// Both compile to nothing in JavaScript
```

**Only affects TypeScript compilation:**
- Faster compilation with interfaces for simple cases
- Slower compilation with complex type unions
- No impact on final JavaScript bundle
- No impact on runtime performance

### Best Practices for Performance

**Use interfaces for:**
- Simple object shapes
- Class contracts
- Public APIs
- When declaration merging is needed

**Use types for:**
- Union types
- Complex conditional types
- Utility types
- When you need advanced type features

**Performance considerations:**
- Choose based on functionality, not performance
- Both have negligible performance differences
- Focus on code maintainability and team preferences
- Consider the specific use case requirements


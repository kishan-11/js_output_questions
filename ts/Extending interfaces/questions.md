## Interview questions: Extending interfaces

### 1. How do interfaces extend multiple parents? How are conflicts resolved?

**Answer:**

Interfaces can extend multiple parents using comma-separated syntax:

```ts
interface A { id: number; name: string; }
interface B { id: string; age: number; }
interface C { email: string; }

// Multiple extension
interface D extends A, B, C {
  // Must resolve all conflicts
}
```

**Conflict Resolution Strategies:**

1. **Compatible Types**: Both types must be assignable to each other
```ts
interface A { id: number; }
interface B { id: number; } // ✅ Compatible
interface C extends A, B { } // ✅ Works
```

2. **Explicit Override**: Redefine conflicting properties
```ts
interface A { id: number; }
interface B { id: string; }
interface C extends A, B {
  id: number | string; // ✅ Explicit resolution
}
```

3. **Union Types**: For truly different types
```ts
interface D extends A, B {
  id: A['id'] | B['id']; // ✅ Union of both types
}
```

**Error Cases:**
```ts
interface E extends A, B {
  // ❌ Error: Property 'id' of type 'string' is not assignable to 'number'
}
```

---

### 2. Contrast `extends` on interfaces vs intersection types for composition.

**Answer:**

| Aspect | Interface `extends` | Type Intersection (`&`) |
|--------|-------------------|------------------------|
| **Syntax** | `interface B extends A` | `type B = A & { ... }` |
| **Declaration Merging** | ✅ Supported | ❌ Not supported |
| **Class Implementation** | ✅ Natural fit | ⚠️ Limited use |
| **Readability** | Clear hierarchy | Functional composition |
| **Performance** | Better for large hierarchies | Better for utility types |

**Interface Extension:**
```ts
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }

class GermanShepherd implements Dog {
  name = "Max";
  breed = "German Shepherd";
}
```

**Type Intersection:**
```ts
type Animal = { name: string; };
type Dog = Animal & { breed: string; };

// ❌ Can't implement with class directly
class GermanShepherd implements Dog { // Error!
  name = "Max";
  breed = "German Shepherd";
}
```

**When to Use Each:**

- **Use `extends`** for:
  - Class hierarchies
  - Clear inheritance relationships
  - Library APIs that need declaration merging
  - When you need to implement with classes

- **Use `&`** for:
  - Utility type compositions
  - Functional programming patterns
  - Complex type transformations
  - When you don't need class implementation

---

### 3. When do you choose augmentation vs extension vs re-declaration merging?

**Answer:**

| Approach | Use Case | Example | Limitations |
|----------|----------|---------|-------------|
| **Extension** (`extends`) | Clear inheritance hierarchy | `interface B extends A` | Single inheritance only |
| **Augmentation** (Declaration Merging) | Adding to existing interfaces | `interface A { id: number; }`<br>`interface A { name: string; }` | Can't remove properties |
| **Re-declaration** | Library type extensions | `declare module 'lib' { interface Config { custom: string; } }` | Module-scoped only |

**Extension (`extends`):**
```ts
interface BaseUser { id: number; }
interface AdminUser extends BaseUser { permissions: string[]; }
// Use when: Clear parent-child relationship
```

**Augmentation (Declaration Merging):**
```ts
interface User { id: number; }
interface User { name: string; } // Merges automatically
// Use when: Adding properties to existing interfaces
```

**Re-declaration (Module Augmentation):**
```ts
// In your code
declare module 'express' {
  interface Request {
    user: User; // Adding custom property
  }
}
// Use when: Extending third-party library types
```

**Decision Matrix:**
- **Need class implementation?** → Use `extends`
- **Extending third-party library?** → Use module augmentation
- **Adding properties to existing interface?** → Use declaration merging
- **Complex type composition?** → Use intersection types (`&`)

---

### 4. Show pitfalls when extending third-party types and how to avoid breaking changes.

**Answer:**

**Common Pitfalls:**

1. **Breaking Changes in Library Updates**
```ts
// Library v1.0
interface LibraryConfig {
  apiKey: string;
}

// Your extension
interface MyConfig extends LibraryConfig {
  timeout: number;
}

// Library v2.0 - BREAKING CHANGE!
interface LibraryConfig {
  apiKey: string;
  timeout: number; // ❌ Your extension now conflicts!
}
```

2. **Property Name Collisions**
```ts
interface ThirdPartyUser { id: string; }
interface MyUser extends ThirdPartyUser {
  id: number; // ❌ Type conflict!
}
```

**Solutions:**

1. **Composition over Extension**
```ts
interface MyConfig {
  library: LibraryConfig;
  timeout: number;
}
```

2. **Branded Types for Version Safety**
```ts
interface MyConfig extends Omit<LibraryConfig, 'timeout'> {
  timeout: number;
}
```

3. **Generic Constraints**
```ts
interface MyConfig<T extends LibraryConfig> extends T {
  timeout: number;
}
```

4. **Module Augmentation (Safer)**
```ts
declare module 'third-party-lib' {
  interface Config {
    timeout?: number; // Optional to avoid conflicts
  }
}
```

5. **Wrapper Pattern**
```ts
interface SafeConfig {
  base: LibraryConfig;
  extensions: {
    timeout: number;
  };
}
```

**Best Practices:**
- Use composition instead of extension for third-party types
- Mark your extensions as optional properties
- Use branded types for version safety
- Document breaking change policies
- Consider using wrapper patterns

---

### 5. How do you document extension points for library users?

**Answer:**

**For Library Authors:**

1. **Mark Extension Points**
```ts
/**
 * Base interface for all API responses
 * @public
 * @extensible - Safe to extend for custom response types
 * @version 1.0.0
 */
interface APIResponse {
  status: number;
  message: string;
}
```

2. **Provide Extension Examples**
```ts
/**
 * User-specific response extending base
 * @example
 * ```ts
 * interface CustomUserResponse extends UserResponse {
 *   customField: string;
 *   metadata: Record<string, any>;
 * }
 * ```
 */
interface UserResponse extends APIResponse {
  data: User;
}
```

3. **Document Breaking Change Policies**
```ts
/**
 * @stable - This interface is stable and safe to extend
 * @breaking-changes - We will not add required properties
 * @deprecation-policy - 6 months notice for breaking changes
 */
interface StableInterface {
  id: number;
  name: string;
}
```

4. **Version-Safe Extension Guidelines**
```ts
/**
 * @extensible - Safe to extend
 * @guidelines
 * - Use optional properties for extensions
 * - Avoid property name conflicts
 * - Use branded types for version safety
 * 
 * @example
 * ```ts
 * interface MyExtension extends BaseInterface {
 *   customField?: string; // Optional to avoid conflicts
 * }
 * ```
 */
interface BaseInterface {
  id: number;
}
```

5. **Extension Point Documentation**
```ts
/**
 * Plugin interface for extensibility
 * @extensible - Implement this interface to create plugins
 * @required-methods - All methods must be implemented
 * @optional-properties - Properties are optional
 */
interface Plugin {
  name: string;
  version: string;
  initialize?(): Promise<void>;
  destroy?(): Promise<void>;
}
```

**Documentation Best Practices:**
- Use JSDoc tags (`@extensible`, `@stable`, `@deprecated`)
- Provide concrete extension examples
- Document breaking change policies
- Use version numbers for stability
- Include migration guides for breaking changes
- Mark interfaces as `@final` when not meant to be extended


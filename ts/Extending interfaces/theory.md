
# TypeScript: Extending Interfaces

**Extending interfaces** is TypeScript’s way of allowing one interface to **inherit** the properties of another. This promotes **reusability**, **modularity**, and **clean architecture** when modeling object types.

---

## 🔹 1. Basic Syntax

You can create a new interface by **extending** an existing one using the `extends` keyword.

```ts
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: number;
}
```

Now, `Employee` has:
```ts
{
  name: string;
  age: number;
  employeeId: number;
}
```

---

## 🔹 2. Multiple Extensions

An interface can extend **multiple interfaces**.

```ts
interface Contact {
  email: string;
}

interface Staff extends Person, Contact {
  position: string;
}
```

Now `Staff` includes properties from `Person` and `Contact`.

---

## 🔹 3. Overriding or Adding New Properties

You can **add new properties** or **override existing ones** with compatible types.

```ts
interface A {
  id: number;
}

interface B extends A {
  id: number; // same type: OK
  name: string;
}
```

```ts
interface C extends A {
  id: string; // ❌ Error: incompatible override
}
```

---

## 🔹 4. Use with Classes

Interfaces are often extended and then implemented by classes:

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

class GermanShepherd implements Dog {
  name = "Max";
  breed = "German Shepherd";
}
```

---

## 🔹 5. Extending vs Type Intersections

You can achieve similar results with `type` intersections:

```ts
type Person = { name: string };
type Employee = Person & { employeeId: number };
```

| Feature                 | `interface`         | `type` + `&`             |
|-------------------------|---------------------|--------------------------|
| Syntax                  | `extends`           | Intersection (`&`)       |
| Declaration merging     | ✅ Supported        | ❌ Not supported          |
| Use with classes        | ✅ Natural fit      | ⚠️ Limited use            |

---

## 🔹 6. Conflict Resolution in Multiple Extensions

When extending multiple interfaces, **conflicts can arise** if they have properties with the same name but different types.

```ts
interface A {
  id: number;
  name: string;
}

interface B {
  id: string; // ❌ Conflict: different type than A.id
  age: number;
}

interface C extends A, B {
  // ❌ Error: Property 'id' of type 'string' is not assignable to 'number'
}
```

**Resolution strategies:**
1. **Compatible types**: Both must be assignable to each other
2. **Explicit override**: Redefine the conflicting property
3. **Union types**: Use union for truly different types

```ts
interface D extends A, B {
  id: number | string; // ✅ Explicit union resolution
}
```

---

## 🔹 7. Augmentation vs Extension vs Declaration Merging

### **Interface Extension** (`extends`)
```ts
interface Base { id: number; }
interface Extended extends Base { name: string; }
```

### **Interface Augmentation** (Declaration Merging)
```ts
interface User { id: number; }
interface User { name: string; } // Merges with above
// Result: { id: number; name: string; }
```

### **Type Intersection** (`&`)
```ts
type Base = { id: number; };
type Extended = Base & { name: string; };
```

| Approach | Use Case | Limitations |
|----------|----------|-------------|
| `extends` | Class-like inheritance, clear hierarchy | Single inheritance only |
| Augmentation | Adding to existing interfaces (libraries) | Can't remove properties |
| Intersection | Complex compositions, utility types | No declaration merging |

---

## 🔹 8. Third-Party Type Extension Pitfalls

### **Problem**: Breaking Changes
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

### **Solutions**:

1. **Composition over Extension**:
```ts
interface MyConfig {
  library: LibraryConfig;
  timeout: number;
}
```

2. **Branded Types**:
```ts
interface MyConfig extends Omit<LibraryConfig, 'timeout'> {
  timeout: number;
}
```

3. **Generic Constraints**:
```ts
interface MyConfig<T extends LibraryConfig> extends T {
  timeout: number;
}
```

---

## 🔹 9. Documenting Extension Points

### **For Library Authors**:

```ts
/**
 * Base interface for all API responses
 * @public
 * @extensible - Safe to extend for custom response types
 */
interface APIResponse {
  status: number;
  message: string;
}

/**
 * User-specific response extending base
 * @example
 * ```ts
 * interface CustomUserResponse extends UserResponse {
 *   customField: string;
 * }
 * ```
 */
interface UserResponse extends APIResponse {
  data: User;
}
```

### **Extension Guidelines**:
- Mark interfaces as `@extensible` or `@final`
- Provide examples of safe extensions
- Document breaking change policies
- Use branded types for version safety

---

## 🔹 10. Advanced Patterns

### **Conditional Extensions**:
```ts
interface BaseUser {
  id: number;
  name: string;
}

interface AdminUser extends BaseUser {
  permissions: string[];
}

// Conditional interface based on user type
type User<T extends 'admin' | 'user'> = T extends 'admin' 
  ? AdminUser 
  : BaseUser;
```

### **Mixin Pattern**:
```ts
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Auditable {
  createdBy: string;
  updatedBy: string;
}

interface User extends BaseUser, Timestamped, Auditable {
  // Combines all properties
}
```

---

## 🔹 11. Real-World Use Cases

### **API Response Layering**:
```ts
interface APIResponse {
  status: number;
  message: string;
}

interface UserResponse extends APIResponse {
  data: {
    id: number;
    name: string;
  };
}

interface PaginatedResponse<T> extends APIResponse {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

### **Plugin Architecture**:
```ts
interface Plugin {
  name: string;
  version: string;
}

interface DatabasePlugin extends Plugin {
  connect(): Promise<void>;
  query(sql: string): Promise<any[]>;
}

interface CachePlugin extends Plugin {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
}
```

---

## 🔚 Summary

| Feature                 | Description                                               |
|-------------------------|-----------------------------------------------------------|
| `extends`               | Allows interface inheritance                              |
| Multiple interfaces     | Interfaces can extend more than one                       |
| Conflict resolution     | Compatible types or explicit overrides required          |
| Augmentation            | Declaration merging for library extension                 |
| Third-party safety      | Use composition or branded types to avoid breaking changes |
| Documentation           | Mark extension points and provide examples                |
| Advanced patterns       | Mixins, conditionals, and plugin architectures           |
| Best suited for         | Object structures, class contracts, layered architectures |

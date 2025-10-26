# TypeScript: Branded / Nominal Types

Branded types (also called nominal types) allow you to create distinct types from primitive types that would otherwise be structurally identical. This prevents mixing up values that have the same underlying type but represent different concepts.

---

## Basic Pattern

```ts
type Brand<T, B extends string> = T & { readonly __brand: B }
type UserId = Brand<string, 'UserId'>
type ProductId = Brand<string, 'ProductId'>

// Usage
const userId: UserId = "user123" as UserId;
const productId: ProductId = "prod456" as ProductId;

// This will cause a TypeScript error
// const mixed: UserId = productId; // ❌ Error!
```

---

## Advanced Branding Patterns

### 1. Multiple Brand Properties
```ts
type Brand<T, B extends string> = T & { readonly __brand: B }
type StrongBrand<T, B extends string> = T & { readonly __brand: B; readonly __phantom: unique symbol }

type UserId = StrongBrand<string, 'UserId'>
type ProductId = StrongBrand<string, 'ProductId'>
```

### 2. Branded Primitives
```ts
type BrandedString<T extends string> = string & { readonly __brand: T }
type BrandedNumber<T extends string> = number & { readonly __brand: T }

type Email = BrandedString<'Email'>
type Age = BrandedNumber<'Age'>
```

### 3. Branded Objects
```ts
type BrandedObject<T, B extends string> = T & { readonly __brand: B }
type User = BrandedObject<{ name: string; email: string }, 'User'>
```

---

## Common Use Cases

### 1. ID Types
```ts
type UserId = Brand<string, 'UserId'>
type ProductId = Brand<string, 'ProductId'>
type OrderId = Brand<string, 'OrderId'>

function getUser(id: UserId): User { /* ... */ }
function getProduct(id: ProductId): Product { /* ... */ }

// Prevents mixing IDs
const userId: UserId = "user123" as UserId;
const productId: ProductId = "prod456" as ProductId;

// getUser(productId); // ❌ TypeScript error!
```

### 2. Currency Types
```ts
type USD = Brand<number, 'USD'>
type EUR = Brand<number, 'EUR'>
type GBP = Brand<number, 'GBP'>

function convertUSDToEUR(amount: USD): EUR {
  return (amount * 0.85) as EUR;
}

// Prevents currency mixing
const usdAmount: USD = 100 as USD;
const eurAmount: EUR = 85 as EUR;
// const result = usdAmount + eurAmount; // ❌ TypeScript error!
```

### 3. Unit Types
```ts
type Meters = Brand<number, 'Meters'>
type Feet = Brand<number, 'Feet'>
type Kilograms = Brand<number, 'Kilograms'>
type Pounds = Brand<number, 'Pounds'>

function metersToFeet(meters: Meters): Feet {
  return (meters * 3.28084) as Feet;
}

// Prevents unit mixing
const distance: Meters = 10 as Meters;
const weight: Kilograms = 70 as Kilograms;
// const result = distance + weight; // ❌ TypeScript error!
```

### 4. Email and Validation
```ts
type Email = Brand<string, 'Email'>

function createEmail(email: string): Email | null {
  if (isValidEmail(email)) {
    return email as Email;
  }
  return null;
}

function sendEmail(to: Email, subject: string): void {
  // Only validated emails can reach here
}
```

---

## Brand Creation Helpers

### 1. Brand Constructor
```ts
function createBrand<T, B extends string>(value: T, brand: B): Brand<T, B> {
  return value as Brand<T, B>;
}

const userId = createBrand("user123", "UserId");
```

### 2. Brand Validator
```ts
function isUserId(value: unknown): value is UserId {
  return typeof value === 'string' && value.length > 0;
}

function assertUserId(value: unknown): asserts value is UserId {
  if (!isUserId(value)) {
    throw new Error('Invalid UserId');
  }
}
```

### 3. Brand Factory
```ts
class BrandFactory<T, B extends string> {
  constructor(private brand: B) {}
  
  create(value: T): Brand<T, B> {
    return value as Brand<T, B>;
  }
  
  isValid(value: unknown): value is Brand<T, B> {
    return typeof value === typeof this.create(value as T);
  }
}

const userIdFactory = new BrandFactory<string, 'UserId'>('UserId');
const userId = userIdFactory.create("user123");
```

---

## Serialization Considerations

### 1. JSON Serialization
```ts
// Brands are stripped during JSON serialization
const user: { id: UserId; name: string } = {
  id: "user123" as UserId,
  name: "John"
};

const json = JSON.stringify(user); // { "id": "user123", "name": "John" }
const parsed = JSON.parse(json); // id is now plain string, not UserId
```

### 2. Brand Restoration
```ts
function restoreUserId(data: any): UserId {
  if (typeof data.id === 'string') {
    return data.id as UserId;
  }
  throw new Error('Invalid user data');
}

const userData = JSON.parse(json);
const userId = restoreUserId(userData);
```

### 3. API Response Handling
```ts
interface ApiUser {
  id: string; // Plain string from API
  name: string;
}

function processApiUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id as UserId, // Brand at boundary
    name: apiUser.name
  };
}
```

---

## Best Practices

### 1. Brand at Boundaries
- Add brands when data enters your system
- Strip brands when data leaves your system
- Keep internal APIs branded for safety

### 2. Validation
- Always validate before branding
- Use type guards for runtime checks
- Provide clear error messages

### 3. Documentation
- Document brand meanings
- Explain when to use each brand
- Provide migration guides

### 4. Performance
- Brands have zero runtime cost
- Use for critical type safety
- Avoid over-branding simple values

---

## Alternatives to Branding

### 1. Opaque Types
```ts
declare const __opaque: unique symbol;
type Opaque<T, K> = T & { readonly [__opaque]: K };
type UserId = Opaque<string, 'UserId'>;
```

### 2. Unique Symbols
```ts
declare const UserIdBrand: unique symbol;
type UserId = string & { readonly [UserIdBrand]: true };
```

### 3. Classes
```ts
class UserId {
  constructor(private value: string) {}
  toString() { return this.value; }
  equals(other: UserId) { return this.value === other.value; }
}
```

---

## Summary

Branded types provide:
- **Type Safety**: Prevent mixing semantically different values
- **Zero Runtime Cost**: Pure compile-time feature
- **Clear Intent**: Self-documenting code
- **Boundary Safety**: Safe data flow across module boundaries

Use branded types when you need to distinguish between values that are structurally identical but semantically different.



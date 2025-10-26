## Interview questions: Branded / nominal types

### 1. Why introduce branded types in a structurally typed system like TypeScript?

**Answer:**

TypeScript is structurally typed, meaning types are compatible if they have the same structure. However, this can lead to problems when you have values that are structurally identical but semantically different.

**Problems without branded types:**
```ts
// All these are just strings, but they represent different concepts
function processUser(id: string) { /* ... */ }
function processProduct(id: string) { /* ... */ }
function processOrder(id: string) { /* ... */ }

// Easy to mix up - no compile-time protection
const userId = "user123";
const productId = "prod456";
processUser(productId); // ❌ Wrong! But TypeScript allows it
```

**Benefits of branded types:**
- **Semantic Safety**: Prevents mixing conceptually different values
- **Self-Documenting**: Code clearly shows intent
- **Refactoring Safety**: Changes to one type don't affect others
- **API Safety**: Functions can only accept the correct branded type
- **Zero Runtime Cost**: Pure compile-time feature

**Example:**
```ts
type UserId = Brand<string, 'UserId'>
type ProductId = Brand<string, 'ProductId'>

function processUser(id: UserId) { /* ... */ }
function processProduct(id: ProductId) { /* ... */ }

const userId: UserId = "user123" as UserId;
const productId: ProductId = "prod456" as ProductId;

processUser(productId); // ❌ TypeScript error!
```

### 2. Show how to prevent mixing `UserId` and plain `string` across module boundaries.

**Answer:**

**Module A (User Service):**
```ts
// user-service.ts
export type UserId = Brand<string, 'UserId'>;

export function createUserId(id: string): UserId {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid user ID');
  }
  return id as UserId;
}

export function getUser(id: UserId): User {
  // Only accepts branded UserId
  return userRepository.findById(id);
}

export function validateUserId(id: unknown): id is UserId {
  return typeof id === 'string' && id.length > 0;
}
```

**Module B (Product Service):**
```ts
// product-service.ts
export type ProductId = Brand<string, 'ProductId'>;

export function createProductId(id: string): ProductId {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid product ID');
  }
  return id as ProductId;
}

export function getProduct(id: ProductId): Product {
  // Only accepts branded ProductId
  return productRepository.findById(id);
}
```

**Module C (Main Application):**
```ts
// app.ts
import { UserId, getUser, createUserId } from './user-service';
import { ProductId, getProduct, createProductId } from './product-service';

// Safe usage
const userId = createUserId("user123");
const productId = createProductId("prod456");

const user = getUser(userId); // ✅ Correct
const product = getProduct(productId); // ✅ Correct

// These would cause TypeScript errors:
// getUser(productId); // ❌ Error: ProductId not assignable to UserId
// getProduct(userId); // ❌ Error: UserId not assignable to ProductId

// API boundary handling
function handleApiResponse(data: { userId: string; productId: string }) {
  // Re-brand at the boundary
  const user = getUser(data.userId as UserId);
  const product = getProduct(data.productId as ProductId);
}
```

**Key strategies:**
- Export branded types from modules
- Provide factory functions for creating brands
- Use type guards for validation
- Re-brand at API boundaries
- Never export raw values without branding

### 3. How do brands interact with serialization/deserialization? Where do you add/strip the brand?

**Answer:**

**The Problem:**
Brands are compile-time only and don't exist at runtime. JSON serialization strips brands, so you need to handle this at boundaries.

**Serialization (Brand → JSON):**
```ts
// Brands are automatically stripped during JSON.stringify
const user: { id: UserId; name: string } = {
  id: "user123" as UserId,
  name: "John"
};

const json = JSON.stringify(user);
// Result: { "id": "user123", "name": "John" }
// Brand is lost!
```

**Deserialization (JSON → Brand):**
```ts
// You must re-brand when deserializing
function deserializeUser(json: string): { id: UserId; name: string } {
  const data = JSON.parse(json);
  return {
    id: data.id as UserId, // Re-brand here
    name: data.name
  };
}

// Or with validation
function safeDeserializeUser(json: string): { id: UserId; name: string } | null {
  const data = JSON.parse(json);
  
  if (typeof data.id === 'string' && typeof data.name === 'string') {
    return {
      id: data.id as UserId,
      name: data.name
    };
  }
  
  return null;
}
```

**API Boundary Pattern:**
```ts
// API Response (external)
interface ApiUserResponse {
  id: string; // Plain string from API
  name: string;
  email: string;
}

// Internal Domain (internal)
interface User {
  id: UserId; // Branded internally
  name: string;
  email: Email; // Also branded
}

// Conversion at boundary
function fromApiUser(apiUser: ApiUserResponse): User {
  return {
    id: apiUser.id as UserId, // Add brand here
    name: apiUser.name,
    email: apiUser.email as Email
  };
}

function toApiUser(user: User): ApiUserResponse {
  return {
    id: user.id, // Brand is stripped automatically
    name: user.name,
    email: user.email
  };
}
```

**Database Pattern:**
```ts
// Database layer
interface DbUser {
  id: string; // Plain string in DB
  name: string;
  email: string;
}

// Domain layer
interface User {
  id: UserId;
  name: string;
  email: Email;
}

// Repository pattern
class UserRepository {
  async findById(id: UserId): Promise<User | null> {
    const dbUser = await this.db.findUser(id); // Brand is stripped
    if (!dbUser) return null;
    
    return {
      id: dbUser.id as UserId, // Re-brand
      name: dbUser.name,
      email: dbUser.email as Email
    };
  }
  
  async save(user: User): Promise<void> {
    const dbUser: DbUser = {
      id: user.id, // Brand stripped
      name: user.name,
      email: user.email
    };
    
    await this.db.saveUser(dbUser);
  }
}
```

**Best Practices:**
- **Add brands** when data enters your domain
- **Strip brands** when data leaves your domain
- **Validate** before re-branding
- **Use type guards** for safe conversion
- **Document** brand boundaries clearly

### 4. How do you design a safe API for currency/units using brands to prevent mistakes?

**Answer:**

**Currency System:**
```ts
// Currency brands
type USD = Brand<number, 'USD'>
type EUR = Brand<number, 'EUR'>
type GBP = Brand<number, 'GBP'>

// Currency conversion rates
const EXCHANGE_RATES = {
  'USD_EUR': 0.85,
  'EUR_USD': 1.18,
  'USD_GBP': 0.73,
  'GBP_USD': 1.37
} as const;

// Safe currency operations
class Currency {
  static createUSD(amount: number): USD {
    if (amount < 0) throw new Error('Amount cannot be negative');
    return amount as USD;
  }
  
  static createEUR(amount: number): EUR {
    if (amount < 0) throw new Error('Amount cannot be negative');
    return amount as EUR;
  }
  
  static convertUSDToEUR(usd: USD): EUR {
    return (usd * EXCHANGE_RATES.USD_EUR) as EUR;
  }
  
  static convertEURToUSD(eur: EUR): USD {
    return (eur * EXCHANGE_RATES.EUR_USD) as USD;
  }
  
  static addUSD(a: USD, b: USD): USD {
    return (a + b) as USD;
  }
  
  static addEUR(a: EUR, b: EUR): EUR {
    return (a + b) as EUR;
  }
}

// Usage - prevents mixing currencies
const usdAmount = Currency.createUSD(100);
const eurAmount = Currency.createEUR(85);

// const mixed = usdAmount + eurAmount; // ❌ TypeScript error!
const converted = Currency.convertUSDToEUR(usdAmount);
const total = Currency.addEUR(converted, eurAmount); // ✅ Safe
```

**Unit System:**
```ts
// Unit brands
type Meters = Brand<number, 'Meters'>
type Feet = Brand<number, 'Feet'>
type Kilograms = Brand<number, 'Kilograms'>
type Pounds = Brand<number, 'Pounds'>

// Unit conversion constants
const CONVERSION_FACTORS = {
  METERS_TO_FEET: 3.28084,
  FEET_TO_METERS: 0.3048,
  KILOGRAMS_TO_POUNDS: 2.20462,
  POUNDS_TO_KILOGRAMS: 0.453592
} as const;

// Safe unit operations
class UnitConverter {
  static metersToFeet(meters: Meters): Feet {
    return (meters * CONVERSION_FACTORS.METERS_TO_FEET) as Feet;
  }
  
  static feetToMeters(feet: Feet): Meters {
    return (feet * CONVERSION_FACTORS.FEET_TO_METERS) as Meters;
  }
  
  static kilogramsToPounds(kg: Kilograms): Pounds {
    return (kg * CONVERSION_FACTORS.KILOGRAMS_TO_POUNDS) as Pounds;
  }
  
  static poundsToKilograms(lbs: Pounds): Kilograms {
    return (lbs * CONVERSION_FACTORS.POUNDS_TO_KILOGRAMS) as Kilograms;
  }
}

// Usage - prevents mixing units
const distance: Meters = 10 as Meters;
const weight: Kilograms = 70 as Kilograms;

// const mixed = distance + weight; // ❌ TypeScript error!
const distanceInFeet = UnitConverter.metersToFeet(distance);
const weightInPounds = UnitConverter.kilogramsToPounds(weight);
```

**API Design:**
```ts
// API endpoints with branded types
interface PaymentRequest {
  amount: USD; // Must be USD
  currency: 'USD'; // Literal type for validation
}

interface ShippingRequest {
  weight: Kilograms; // Must be in kilograms
  distance: Meters; // Must be in meters
}

// Service layer
class PaymentService {
  processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Only accepts USD amounts
    return this.paymentGateway.charge(request.amount);
  }
}

class ShippingService {
  calculateShipping(request: ShippingRequest): USD {
    // Only accepts proper units
    const baseRate = this.getBaseRate(request.weight);
    const distanceRate = this.getDistanceRate(request.distance);
    return (baseRate + distanceRate) as USD;
  }
}
```

**Validation at Boundaries:**
```ts
// Input validation
function validateCurrencyInput(data: any): USD | null {
  if (typeof data.amount === 'number' && data.amount > 0) {
    return data.amount as USD;
  }
  return null;
}

function validateUnitInput(data: any): { weight: Kilograms; distance: Meters } | null {
  if (typeof data.weight === 'number' && typeof data.distance === 'number' &&
      data.weight > 0 && data.distance > 0) {
    return {
      weight: data.weight as Kilograms,
      distance: data.distance as Meters
    };
  }
  return null;
}
```

### 5. What are alternatives to branding (opaque type pattern, unique symbol) and tradeoffs?

**Answer:**

**1. Opaque Types (using unique symbols):**
```ts
declare const __opaque: unique symbol;
type Opaque<T, K> = T & { readonly [__opaque]: K };

type UserId = Opaque<string, 'UserId'>;
type ProductId = Opaque<string, 'ProductId'>;

// Usage
const userId: UserId = "user123" as UserId;
const productId: ProductId = "prod456" as ProductId;
```

**Tradeoffs:**
- ✅ **Pros**: More explicit, harder to accidentally cast
- ❌ **Cons**: More verbose, requires unique symbol declaration

**2. Unique Symbol Branding:**
```ts
declare const UserIdBrand: unique symbol;
declare const ProductIdBrand: unique symbol;

type UserId = string & { readonly [UserIdBrand]: true };
type ProductId = string & { readonly [ProductIdBrand]: true };

// Usage
const userId: UserId = "user123" as UserId;
const productId: ProductId = "prod456" as ProductId;
```

**Tradeoffs:**
- ✅ **Pros**: Very explicit, unique per type
- ❌ **Cons**: Requires separate declaration for each type

**3. Class-based Approach:**
```ts
class UserId {
  constructor(private value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('Invalid UserId');
    }
  }
  
  toString(): string {
    return this.value;
  }
  
  equals(other: UserId): boolean {
    return this.value === other.value;
  }
  
  static fromString(value: string): UserId {
    return new UserId(value);
  }
}

class ProductId {
  constructor(private value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('Invalid ProductId');
    }
  }
  
  toString(): string {
    return this.value;
  }
  
  equals(other: ProductId): boolean {
    return this.value === other.value;
  }
  
  static fromString(value: string): ProductId {
    return new ProductId(value);
  }
}

// Usage
const userId = UserId.fromString("user123");
const productId = ProductId.fromString("prod456");
```

**Tradeoffs:**
- ✅ **Pros**: Runtime validation, methods, serialization support
- ❌ **Cons**: Runtime overhead, more complex, not zero-cost

**4. Template Literal Types:**
```ts
type UserId = `user_${string}`;
type ProductId = `prod_${string}`;

// Usage
const userId: UserId = "user_123";
const productId: ProductId = "prod_456";
```

**Tradeoffs:**
- ✅ **Pros**: Self-documenting, pattern-based
- ❌ **Cons**: Limited to string patterns, less flexible

**5. Discriminated Unions:**
```ts
type UserId = { type: 'user'; id: string };
type ProductId = { type: 'product'; id: string };

// Usage
const userId: UserId = { type: 'user', id: '123' };
const productId: ProductId = { type: 'product', id: '456' };
```

**Tradeoffs:**
- ✅ **Pros**: Runtime discrimination, clear intent
- ❌ **Cons**: Runtime overhead, more verbose

**Comparison Table:**

| Approach | Runtime Cost | Type Safety | Verbosity | Serialization |
|----------|-------------|-------------|-----------|---------------|
| Branded Types | Zero | High | Low | Manual |
| Opaque Types | Zero | High | Medium | Manual |
| Unique Symbols | Zero | High | Medium | Manual |
| Classes | High | High | High | Built-in |
| Template Literals | Zero | Medium | Low | Automatic |
| Discriminated Unions | Medium | High | High | Automatic |

**Recommendations:**
- **Use branded types** for most cases (zero cost, high safety)
- **Use classes** when you need runtime validation
- **Use template literals** for pattern-based string types
- **Use discriminated unions** when you need runtime type information
- **Avoid opaque types** unless you need the extra explicitness


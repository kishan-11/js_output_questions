## Interview questions: Basic types

### 1. Compare `any`, `unknown`, and `never`. When is each appropriate and what risks do they carry?

**Answer:**

- **`any`**: Disables all type checking. You can assign and use anything without TypeScript errors.
  - **When to use**: Legacy code migration, third-party libraries without types, dynamic content
  - **Risks**: Defeats TypeScript's purpose, runtime errors, loss of IDE support, no compile-time safety
  - **Example**: `let data: any = JSON.parse(response);`

- **`unknown`**: Type-safe version of `any`. Must be type-checked before use.
  - **When to use**: APIs with unknown return types, user input, external data sources
  - **Risks**: Requires type narrowing, more verbose code
  - **Example**: 
    ```ts
    let value: unknown = getData();
    if (typeof value === 'string') {
      console.log(value.toUpperCase()); // Safe
    }
    ```

- **`never`**: Represents values that never occur (unreachable code).
  - **When to use**: Functions that always throw, exhaustive switch cases, infinite loops
  - **Risks**: If code after `never` is reachable, it indicates a logic error
  - **Example**: 
    ```ts
    function throwError(): never {
      throw new Error('Always throws');
    }
    ```

### 2. How do `null` and `undefined` differ under `strictNullChecks`, and how do you model optional vs nullable fields?

**Answer:**

**Without `strictNullChecks`** (default):
- All types implicitly include `null` and `undefined`
- `string` is actually `string | null | undefined`
- No compile-time protection against null/undefined errors

**With `strictNullChecks`** (recommended):
- Types are strict - `string` means only string values
- Must explicitly allow `null`/`undefined` using union types
- Better runtime safety and clearer intent

**Modeling optional vs nullable fields:**

```ts
// Optional field (may be missing)
interface User {
  name: string;
  email?: string; // email is optional
}

// Nullable field (explicitly null)
interface Product {
  id: string;
  description: string | null; // description can be null
}

// Both optional and nullable
interface Config {
  apiUrl: string;
  timeout?: number | null; // may be missing OR explicitly null
}
```

### 3. When do you use `void` vs `undefined` in function return types?

**Answer:**

- **`void`**: Indicates a function doesn't return a meaningful value (side effects only)
  - **When to use**: Event handlers, logging functions, DOM manipulation
  - **Example**: `function logMessage(msg: string): void { console.log(msg); }`
  - **Key point**: `void` means "no return value intended"

- **`undefined`**: Indicates a function explicitly returns `undefined`
  - **When to use**: Functions that might return a value but currently return `undefined`
  - **Example**: `function getValue(): string | undefined { return someCondition ? "value" : undefined; }`
  - **Key point**: `undefined` is an actual return value

**Practical difference:**
```ts
// void - no return value expected
function onClick(): void {
  // No return statement needed
}

// undefined - explicitly returns undefined
function getData(): string | undefined {
  return someCondition ? "data" : undefined;
}
```

### 4. What are the tradeoffs of using literal types vs broad primitives?

**Answer:**

**Literal Types:**
- **Pros**: 
  - Type safety at compile time
  - Better autocomplete and IntelliSense
  - Prevents invalid values
  - Self-documenting code
- **Cons**: 
  - More verbose type definitions
  - Harder to extend
  - Can be overly restrictive
- **Example**: `type Status = "loading" | "success" | "error";`

**Broad Primitives:**
- **Pros**: 
  - Flexible and easy to use
  - Less verbose
  - Easy to extend
- **Cons**: 
  - No compile-time validation
  - Runtime errors possible
  - Less precise documentation
- **Example**: `let status: string;`

**Best practices:**
- Use literals for known, finite sets of values (status, direction, theme)
- Use primitives for open-ended data (user input, external APIs)
- Combine both: `type Theme = "light" | "dark" | string;` (allows custom themes)

### 5. How do you model `Date`, `bigint`, and `symbol` in APIs and why do they matter in Node/RN?

**Answer:**

**`Date`:**
```ts
// API responses
interface ApiResponse {
  createdAt: string; // ISO string from server
  updatedAt: string;
}

// Client-side conversion
const user: ApiResponse = await fetchUser();
const createdDate = new Date(user.createdAt);
```

**`bigint`:**
```ts
// For large integers (timestamps, IDs, financial calculations)
interface Transaction {
  id: bigint; // Large transaction ID
  amount: number; // Use number for currency (with decimal handling)
  timestamp: bigint; // Unix timestamp in milliseconds
}

// Usage
const tx: Transaction = {
  id: 1234567890123456789n,
  amount: 99.99,
  timestamp: BigInt(Date.now())
};
```

**`symbol`:**
```ts
// For unique identifiers and metadata
const USER_ID = Symbol('userId');
const METADATA = Symbol('metadata');

interface User {
  [USER_ID]: string;
  name: string;
  [METADATA]: Record<string, any>;
}
```

**Why they matter in Node/RN:**

- **`Date`**: Critical for timestamps, scheduling, date arithmetic. Node.js uses `Date` extensively for file system operations, logging, and API responses.

- **`bigint`**: Essential for:
  - Large integer IDs (Twitter snowflakes, database IDs)
  - Financial calculations (avoiding floating-point precision issues)
  - Timestamp precision (nanoseconds)
  - Cryptographic operations

- **`symbol`**: Important for:
  - Creating unique object properties
  - Avoiding property name conflicts
  - Implementing iterators and well-known symbols
  - Metadata and internal object state

**Serialization considerations:**
```ts
// JSON doesn't support these types natively
const data = {
  date: new Date(),
  big: 123n,
  sym: Symbol('test')
};

// Need custom serialization
const serialized = {
  date: data.date.toISOString(),
  big: data.big.toString(),
  // symbols are omitted from JSON.stringify
};
```


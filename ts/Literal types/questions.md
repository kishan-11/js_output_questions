## Interview Questions: Literal Types

### 1. What are literal types in TypeScript? How do they differ from primitive types?

**Answer:**

**Literal types** represent exact, specific values rather than general types. They are a more precise subset of primitive types.

**Differences:**

| Aspect | Primitive Types | Literal Types |
|--------|----------------|---------------|
| Scope | General category (`string`, `number`, `boolean`) | Specific value (`"hello"`, `42`, `true`) |
| Values Allowed | Any value of that type | Only the exact specified value(s) |
| Flexibility | More flexible | More restrictive and precise |
| Type Safety | Basic type checking | Exact value checking |

**Example:**

```ts
// Primitive type - accepts any string
let name: string = "Alice";
name = "Bob"; // ✅
name = "Charlie"; // ✅

// Literal type - accepts only specific string
let status: "active" | "inactive" = "active";
status = "inactive"; // ✅
status = "pending"; // ❌ Error: Type '"pending"' is not assignable to type '"active" | "inactive"'

// Number primitive vs literal
let age: number = 25; // Any number
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6 = 3; // Only specific numbers

// Boolean primitive vs literal
let isValid: boolean = true; // true or false
let mustBeTrue: true = true; // Only true
```

**When to use:**
- Use **primitive types** when you need flexibility with any value of that type
- Use **literal types** when you want to restrict to specific known values for better type safety

---

### 2. Explain the difference between `const` and `let` declarations in terms of literal type inference. Why does this matter?

**Answer:**

TypeScript infers different types for `const` and `let` declarations due to their mutability characteristics.

**`const` - Literal Type Inference:**

```ts
const role = "admin"; // Type: "admin" (literal type)
const count = 42;     // Type: 42 (literal type)
const flag = true;    // Type: true (literal type)

// TypeScript knows these values cannot change, so it infers the exact literal type
```

**`let` - Primitive Type Inference:**

```ts
let role = "admin"; // Type: string (primitive type)
let count = 42;     // Type: number (primitive type)
let flag = true;    // Type: boolean (primitive type)

// TypeScript knows these values can be reassigned, so it infers a wider type
```

**Why does this matter?**

1. **Type Safety**: Literal types provide stronger guarantees about what values are allowed
2. **Function Parameters**: When passing values to functions expecting literal types
3. **Discriminated Unions**: Literal types are essential for type discrimination
4. **Configuration Objects**: Ensures config values match expected options

**Example Problem:**

```ts
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function makeRequest(method: HttpMethod) {
  // ... implementation
}

// Problem with let
let method = "GET"; // Type: string
makeRequest(method); // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'HttpMethod'

// Solutions:
// 1. Use const
const methodConst = "GET"; // Type: "GET"
makeRequest(methodConst); // ✅

// 2. Use 'as const' assertion
let methodAsConst = "GET" as const; // Type: "GET"
makeRequest(methodAsConst); // ✅

// 3. Type annotation
let methodTyped: HttpMethod = "GET"; // Type: HttpMethod
makeRequest(methodTyped); // ✅

// 4. Type assertion
let methodAsserted = "GET" as HttpMethod; // Type: HttpMethod
makeRequest(methodAsserted); // ✅
```

**Best Practice:**
- Use `const` when values won't change (most cases)
- Use `let` with explicit type annotations when mutation is needed
- Use `as const` for objects and arrays to preserve literal types

---

### 3. What is the `as const` assertion? How does it affect objects, arrays, and nested structures?

**Answer:**

The `as const` assertion tells TypeScript to infer the **most specific (literal) types** possible and marks properties as **readonly**.

**Effects:**

1. **Object Properties** → Literal types instead of primitive types
2. **All Properties** → Marked as `readonly`
3. **Arrays** → Become readonly tuples with literal element types
4. **Nested Structures** → Applied recursively to all nested properties

**Object Examples:**

```ts
// WITHOUT as const
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retry: true
};
// Type:
// {
//   apiUrl: string;
//   timeout: number;
//   retry: boolean;
// }

config.apiUrl = "https://other.com"; // ✅ Allowed
config.timeout = 10000; // ✅ Allowed

// WITH as const
const configConst = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retry: true
} as const;
// Type:
// {
//   readonly apiUrl: "https://api.example.com";
//   readonly timeout: 5000;
//   readonly retry: true;
// }

configConst.apiUrl = "https://other.com"; // ❌ Error: Cannot assign to 'apiUrl' because it is a read-only property
configConst.timeout = 10000; // ❌ Error: Cannot assign to 'timeout' because it is a read-only property
```

**Array Examples:**

```ts
// WITHOUT as const
const colors = ["red", "green", "blue"];
// Type: string[]
colors.push("yellow"); // ✅ Allowed
colors[0] = "purple"; // ✅ Allowed

// WITH as const
const colorsConst = ["red", "green", "blue"] as const;
// Type: readonly ["red", "green", "blue"]
colorsConst.push("yellow"); // ❌ Error: Property 'push' does not exist on type 'readonly ["red", "green", "blue"]'
colorsConst[0] = "purple"; // ❌ Error: Cannot assign to '0' because it is a read-only property

// Accessing elements gives literal types
let firstColor = colorsConst[0]; // Type: "red"
let secondColor = colorsConst[1]; // Type: "green"
```

**Nested Structure Examples:**

```ts
const appConfig = {
  api: {
    baseUrl: "https://api.example.com",
    version: "v1",
    endpoints: {
      users: "/users",
      posts: "/posts"
    }
  },
  features: {
    darkMode: true,
    notifications: false
  },
  supportedLanguages: ["en", "es", "fr"]
} as const;

// Type (deeply readonly and literal):
// {
//   readonly api: {
//     readonly baseUrl: "https://api.example.com";
//     readonly version: "v1";
//     readonly endpoints: {
//       readonly users: "/users";
//       readonly posts: "/posts";
//     };
//   };
//   readonly features: {
//     readonly darkMode: true;
//     readonly notifications: false;
//   };
//   readonly supportedLanguages: readonly ["en", "es", "fr"];
// }

// All nested properties are literal types
type BaseUrl = typeof appConfig.api.baseUrl; // "https://api.example.com"
type FirstLang = typeof appConfig.supportedLanguages[0]; // "en"
type DarkMode = typeof appConfig.features.darkMode; // true
```

**Practical Use Cases:**

```ts
// 1. Configuration Objects
const DATABASE_CONFIG = {
  host: "localhost",
  port: 5432,
  database: "myapp"
} as const;

// 2. Constants for Type Extraction
const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact"
} as const;

type Route = typeof ROUTES[keyof typeof ROUTES]; // "/" | "/about" | "/contact"

// 3. Enum-like Objects
const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected"
} as const;

type Status = typeof STATUS[keyof typeof STATUS]; // "pending" | "approved" | "rejected"

// 4. API Response Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404
} as const;
```

**Benefits:**
- **Immutability**: Prevents accidental mutations
- **Type Safety**: Exact value checking at compile time
- **Better IntelliSense**: IDE autocomplete shows exact values
- **Refactoring Safety**: Changes propagate through the codebase

---

### 4. How do literal types enable discriminated unions? Provide a real-world example.

**Answer:**

**Discriminated unions** (also called tagged unions) use literal types as a **discriminant property** to distinguish between different variants of a union. This enables type-safe narrowing and exhaustive checking.

**Key Components:**
1. **Union type** with multiple variants
2. **Discriminant property** (literal type) shared across all variants
3. **Type narrowing** based on the discriminant
4. **Exhaustive checking** to ensure all cases are handled

**Basic Example:**

```ts
// Discriminated union using literal types
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rectangle"; width: number; height: number };

function calculateArea(shape: Shape): number {
  // TypeScript narrows the type based on the discriminant
  switch (shape.kind) {
    case "circle":
      // TypeScript knows shape is { kind: "circle"; radius: number }
      return Math.PI * shape.radius ** 2;
    case "square":
      // TypeScript knows shape is { kind: "square"; side: number }
      return shape.side ** 2;
    case "rectangle":
      // TypeScript knows shape is { kind: "rectangle"; width: number; height: number }
      return shape.width * shape.height;
    default:
      // Exhaustive check - ensures all cases are handled
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

// Usage
const circle: Shape = { kind: "circle", radius: 5 };
const square: Shape = { kind: "square", side: 4 };
const rectangle: Shape = { kind: "rectangle", width: 3, height: 6 };

console.log(calculateArea(circle)); // 78.54
console.log(calculateArea(square)); // 16
console.log(calculateArea(rectangle)); // 18
```

**Real-World Example 1: API Response Handling**

```ts
// API response with different states
type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string; code: number };

function handleUserResponse(response: ApiResponse<User>) {
  switch (response.status) {
    case "loading":
      // TypeScript knows response has no other properties
      return <Spinner />;
      
    case "success":
      // TypeScript knows response has 'data' property
      return <UserProfile user={response.data} />;
      
    case "error":
      // TypeScript knows response has 'error' and 'code' properties
      return <ErrorMessage 
               message={response.error} 
               code={response.code} 
             />;
      
    default:
      const _exhaustive: never = response;
      return _exhaustive;
  }
}

// Usage
const loadingResponse: ApiResponse<User> = { status: "loading" };
const successResponse: ApiResponse<User> = { 
  status: "success", 
  data: { id: 1, name: "Alice" } 
};
const errorResponse: ApiResponse<User> = { 
  status: "error", 
  error: "User not found", 
  code: 404 
};
```

**Real-World Example 2: Form Validation**

```ts
type ValidationResult =
  | { valid: true; value: string }
  | { valid: false; errors: string[] };

function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email) {
    errors.push("Email is required");
  }
  if (!email.includes("@")) {
    errors.push("Email must contain @");
  }
  if (email.length < 5) {
    errors.push("Email must be at least 5 characters");
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return { valid: true, value: email };
}

function processForm(email: string) {
  const result = validateEmail(email);
  
  if (result.valid) {
    // TypeScript knows result has 'value' property
    console.log("Valid email:", result.value);
    submitForm(result.value);
  } else {
    // TypeScript knows result has 'errors' property
    console.log("Validation errors:", result.errors.join(", "));
    showErrors(result.errors);
  }
}
```

**Real-World Example 3: Redux Actions**

```ts
// Redux action types using discriminated unions
type Action =
  | { type: "ADD_TODO"; payload: { id: string; text: string } }
  | { type: "REMOVE_TODO"; payload: { id: string } }
  | { type: "TOGGLE_TODO"; payload: { id: string } }
  | { type: "SET_FILTER"; payload: { filter: "all" | "active" | "completed" } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TODO":
      // TypeScript knows action.payload has id and text
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };
      
    case "REMOVE_TODO":
      // TypeScript knows action.payload has only id
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id)
      };
      
    case "TOGGLE_TODO":
      // TypeScript knows action.payload has only id
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
      
    case "SET_FILTER":
      // TypeScript knows action.payload has filter property
      return {
        ...state,
        filter: action.payload.filter
      };
      
    default:
      // Exhaustive check
      const _exhaustive: never = action;
      return state;
  }
}
```

**Real-World Example 4: Payment Processing**

```ts
type PaymentMethod =
  | { type: "credit_card"; cardNumber: string; cvv: string; expiry: string }
  | { type: "paypal"; email: string }
  | { type: "bank_transfer"; accountNumber: string; routingNumber: string }
  | { type: "crypto"; walletAddress: string; currency: "BTC" | "ETH" };

function processPayment(method: PaymentMethod, amount: number): Promise<PaymentResult> {
  switch (method.type) {
    case "credit_card":
      return processCreditCard(
        method.cardNumber,
        method.cvv,
        method.expiry,
        amount
      );
      
    case "paypal":
      return processPayPal(method.email, amount);
      
    case "bank_transfer":
      return processBankTransfer(
        method.accountNumber,
        method.routingNumber,
        amount
      );
      
    case "crypto":
      return processCrypto(
        method.walletAddress,
        method.currency,
        amount
      );
      
    default:
      const _exhaustive: never = method;
      throw new Error("Unknown payment method");
  }
}
```

**Benefits of Discriminated Unions:**

1. **Type Safety**: Compiler ensures correct property access
2. **Exhaustive Checking**: Guarantees all cases are handled
3. **IntelliSense**: IDE provides accurate autocomplete
4. **Refactoring**: Adding new variants causes compile errors if not handled
5. **Self-Documenting**: Code clearly shows all possible states

**Key Points:**
- The discriminant property must be a **literal type**
- All variants must have the **same discriminant property name**
- TypeScript uses **control flow analysis** to narrow types
- The `never` type ensures **exhaustive checking**

---

### 5. Can you combine different types of literals (string, number, boolean) in a union? Provide examples and use cases.

**Answer:**

Yes! TypeScript allows mixing different types of literals in a union, creating flexible yet type-safe combinations.

**Basic Mixed Literal Union:**

```ts
type MixedLiteral = "hello" | 42 | true | null | undefined;

let value: MixedLiteral;

value = "hello"; // ✅
value = 42;      // ✅
value = true;    // ✅
value = null;    // ✅
value = undefined; // ✅

value = "world"; // ❌ Error
value = 43;      // ❌ Error
value = false;   // ❌ Error
```

**Real-World Use Case 1: Configuration Values**

```ts
// Mixed literals for configuration options
type ConfigValue = string | number | boolean | null;

interface AppConfig {
  debugMode: boolean | "verbose" | "minimal";
  logLevel: 0 | 1 | 2 | 3 | "off";
  apiTimeout: number | "infinite";
  theme: "light" | "dark" | "auto" | null;
  maxRetries: number | false; // false means no retries
}

const config: AppConfig = {
  debugMode: "verbose",     // string literal
  logLevel: 2,              // number literal
  apiTimeout: "infinite",   // string literal or number
  theme: null,              // null literal
  maxRetries: 3             // number or false
};

// Type-safe usage
function setDebugMode(mode: AppConfig["debugMode"]) {
  if (mode === "verbose") {
    console.log("Enabling verbose debugging");
  } else if (mode === "minimal") {
    console.log("Enabling minimal debugging");
  } else if (mode === true) {
    console.log("Enabling standard debugging");
  } else {
    console.log("Debugging disabled");
  }
}
```

**Real-World Use Case 2: HTML Attribute Values**

```ts
// HTML attributes can have mixed types
type BooleanOrString = boolean | "true" | "false";
type AriaAttribute = boolean | "true" | "false" | "mixed" | undefined;
type CrossOrigin = "anonymous" | "use-credentials" | "" | undefined;

interface ImgAttributes {
  src: string;
  alt: string;
  loading: "lazy" | "eager" | undefined;
  crossOrigin: CrossOrigin;
  width: number | string; // Can be 100 or "100px"
  height: number | string;
}

const img: ImgAttributes = {
  src: "image.jpg",
  alt: "Description",
  loading: "lazy",
  crossOrigin: "anonymous",
  width: 300,        // number
  height: "200px"    // string
};
```

**Real-World Use Case 3: Database Query Results**

```ts
// Database can return different types for the same field
type DbValue = string | number | boolean | null | Date;

interface QueryResult {
  id: number;
  status: "active" | "inactive" | 0 | 1; // Mixed string and number literals
  priority: 1 | 2 | 3 | "low" | "medium" | "high";
  metadata: Record<string, DbValue>;
}

const result: QueryResult = {
  id: 123,
  status: "active",    // Could also be 0 or 1
  priority: "high",    // Could also be 1, 2, or 3
  metadata: {
    createdAt: new Date(),
    isPublic: true,
    viewCount: 42,
    tags: null
  }
};

// Type-safe handling
function getStatusText(status: QueryResult["status"]): string {
  if (status === "active" || status === 1) {
    return "Active";
  } else if (status === "inactive" || status === 0) {
    return "Inactive";
  }
  const _exhaustive: never = status;
  return _exhaustive;
}
```

**Real-World Use Case 4: API Response Status Codes**

```ts
// Mix HTTP status codes (numbers) with status text (strings)
type StatusCode = 
  | 200 | "OK"
  | 201 | "Created"
  | 400 | "Bad Request"
  | 401 | "Unauthorized"
  | 404 | "Not Found"
  | 500 | "Internal Server Error";

interface ApiResponse {
  status: StatusCode;
  data?: unknown;
  error?: string;
}

function handleStatus(status: StatusCode) {
  // Can check either number or string
  if (status === 200 || status === "OK") {
    console.log("Success!");
  } else if (status === 404 || status === "Not Found") {
    console.log("Resource not found");
  }
}
```

**Real-World Use Case 5: Form Input Values**

```ts
// Form inputs can have different value types
type InputValue = string | number | boolean | null | readonly string[];

interface FormData {
  username: string;
  age: number | "";              // Empty string before filled
  newsletter: boolean;
  favoriteColors: readonly string[]; // Multiple select
  country: string | null;        // Nullable dropdown
  terms: true;                   // Must be exactly true
}

const formData: FormData = {
  username: "alice",
  age: "",                       // Not yet filled
  newsletter: false,
  favoriteColors: ["red", "blue"],
  country: null,                 // Not selected
  terms: true                    // Checkbox must be checked
};
```

**Real-World Use Case 6: Feature Flags**

```ts
// Feature flags with mixed types
type FeatureFlag = 
  | boolean              // Simple on/off
  | "enabled" | "disabled" | "beta"  // String states
  | 0 | 1 | 2           // Numeric levels
  | null;               // Not configured

interface FeatureFlags {
  darkMode: boolean | "auto";
  analytics: true | "limited" | false;
  experimentalFeatures: 0 | 1 | 2; // 0=off, 1=some, 2=all
  newUI: "enabled" | "disabled" | "beta" | null;
}

const flags: FeatureFlags = {
  darkMode: "auto",
  analytics: "limited",
  experimentalFeatures: 1,
  newUI: "beta"
};

function isFeatureEnabled(flag: FeatureFlag): boolean {
  if (typeof flag === "boolean") {
    return flag;
  } else if (typeof flag === "string") {
    return flag === "enabled" || flag === "beta";
  } else if (typeof flag === "number") {
    return flag > 0;
  } else {
    return false; // null case
  }
}
```

**Real-World Use Case 7: Event System**

```ts
// Event codes and names
type EventCode = 
  | "click" | 1
  | "submit" | 2
  | "change" | 3
  | "error" | -1;

interface Event {
  code: EventCode;
  timestamp: number;
  data?: unknown;
}

function logEvent(event: Event) {
  const eventName = 
    event.code === 1 || event.code === "click" ? "Click" :
    event.code === 2 || event.code === "submit" ? "Submit" :
    event.code === 3 || event.code === "change" ? "Change" :
    event.code === -1 || event.code === "error" ? "Error" :
    "Unknown";
  
  console.log(`Event: ${eventName} at ${event.timestamp}`);
}
```

**Benefits of Mixed Literal Unions:**

1. **Flexibility**: Support multiple data formats (legacy + new)
2. **API Compatibility**: Handle different versions or formats
3. **Type Safety**: Still maintain compile-time checking
4. **Expressiveness**: Model real-world data accurately
5. **Migration Support**: Gradually transition between formats

**Best Practices:**

```ts
// ✅ Good: Group related literals by purpose
type Status = "active" | "inactive"; // String literals for state
type Priority = 1 | 2 | 3; // Number literals for levels

// ✅ Good: Use discriminated unions for clarity
type Result = 
  | { success: true; data: string }
  | { success: false; error: number };

// ⚠️ Caution: Too many mixed types can be confusing
type Confusing = string | number | boolean | null | symbol | bigint | undefined;

// ✅ Better: Create meaningful sub-types
type PrimitiveValue = string | number | boolean;
type NullableValue = PrimitiveValue | null | undefined;
```

**Key Points:**
- Mixed literal unions are fully type-safe
- Use type guards to narrow types at runtime
- Document the meaning of different literal types
- Consider discriminated unions for complex scenarios

---

### 6. How do template literal types extend the power of string literal types? Provide advanced examples.

**Answer:**

**Template literal types** allow you to create new string literal types by combining or transforming existing string literal types using template string syntax. They enable powerful type-level string manipulation.

**Basic Syntax:**

```ts
type Greeting = `Hello, ${string}!`;

let greeting1: Greeting = "Hello, World!"; // ✅
let greeting2: Greeting = "Hello, Alice!"; // ✅
let greeting3: Greeting = "Hi, Bob!";      // ❌ Error: doesn't match pattern
```

**Advanced Example 1: Event Names from Base Names**

```ts
// Generate event handler names from event names
type EventName = "click" | "focus" | "blur" | "change";
type EventHandler = `on${Capitalize<EventName>}`;
// Result: "onClick" | "onFocus" | "onBlur" | "onChange"

interface EventHandlers {
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: (value: string) => void;
}

// Automatically generate handler types from events
type HandlerFromEvent<T extends string> = `on${Capitalize<T>}`;

type ClickHandler = HandlerFromEvent<"click">; // "onClick"
type SubmitHandler = HandlerFromEvent<"submit">; // "onSubmit"
```

**Advanced Example 2: CSS Properties**

```ts
// CSS custom properties
type CssVar = `--${string}`;
type CssColor = `--color-${string}`;
type CssSize = `--size-${string}`;

const validCssVars: CssVar[] = [
  "--primary-color",
  "--font-size",
  "--spacing"
]; // ✅

const invalidCssVar: CssVar = "primary-color"; // ❌ Error: missing "--"

// Combine with specific values
type Color = "red" | "blue" | "green";
type Shade = "light" | "dark";
type ColorVariable = `--color-${Color}-${Shade}`;
// Result: "--color-red-light" | "--color-red-dark" | "--color-blue-light" | ...

const colors: ColorVariable[] = [
  "--color-red-light",
  "--color-blue-dark",
  "--color-green-light"
]; // ✅
```

**Advanced Example 3: REST API Endpoints**

```ts
// Generate API endpoint types
type Resource = "users" | "posts" | "comments";
type ApiEndpoint = `/api/${Resource}`;
// Result: "/api/users" | "/api/posts" | "/api/comments"

type ResourceId = `/api/${Resource}/${number}`;
// Result: "/api/users/123" pattern

// More complex routing
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Route = "users" | "posts" | "products";
type ApiRoute = `${HttpMethod} /api/${Route}`;
// Result: "GET /api/users" | "POST /api/users" | ...

function handleRoute(route: ApiRoute) {
  console.log(`Handling: ${route}`);
}

handleRoute("GET /api/users");    // ✅
handleRoute("POST /api/products"); // ✅
handleRoute("PATCH /api/users");  // ❌ Error: PATCH not in HttpMethod
```

**Advanced Example 4: Type-Safe Query Selectors**

```ts
// HTML element IDs and classes
type ElementId = `#${string}`;
type ElementClass = `.${string}`;
type Selector = ElementId | ElementClass | string;

function querySelector<T extends Selector>(selector: T): Element | null {
  return document.querySelector(selector);
}

querySelector("#my-id");     // ✅
querySelector(".my-class");  // ✅
querySelector("div");        // ✅

// More specific selectors
type DataAttribute = `[data-${string}]`;
type AriaAttribute = `[aria-${string}]`;

type AdvancedSelector = ElementId | ElementClass | DataAttribute | AriaAttribute;

const selectors: AdvancedSelector[] = [
  "#header",
  ".button",
  "[data-testid='submit']",
  "[aria-label='close']"
]; // ✅
```

**Advanced Example 5: Type-Safe State Machines**

```ts
// Generate action types for state machines
type EntityType = "user" | "post" | "comment";
type ActionType = "create" | "update" | "delete";
type ActionName = `${EntityType}/${ActionType}`;
// Result: "user/create" | "user/update" | "user/delete" | "post/create" | ...

type Action = {
  type: ActionName;
  payload?: unknown;
};

const actions: Action[] = [
  { type: "user/create", payload: { name: "Alice" } },
  { type: "post/update", payload: { id: 1, title: "Updated" } },
  { type: "comment/delete", payload: { id: 5 } }
]; // ✅

function dispatch(action: Action) {
  console.log(`Dispatching: ${action.type}`);
}

dispatch({ type: "user/create" }); // ✅
dispatch({ type: "user/fetch" });  // ❌ Error: "fetch" not in ActionType
```

**Advanced Example 6: Database Table/Column Names**

```ts
// Generate type-safe database queries
type Table = "users" | "posts" | "comments";
type SelectQuery = `SELECT * FROM ${Table}`;
type InsertQuery = `INSERT INTO ${Table}`;
type UpdateQuery = `UPDATE ${Table} SET`;
type DeleteQuery = `DELETE FROM ${Table}`;

type Query = SelectQuery | InsertQuery | UpdateQuery | DeleteQuery;

function executeQuery(query: Query) {
  console.log(`Executing: ${query}`);
}

executeQuery("SELECT * FROM users");   // ✅
executeQuery("INSERT INTO posts");     // ✅
executeQuery("DELETE FROM products");  // ❌ Error: "products" not in Table

// Column access
type UserColumn = "id" | "name" | "email";
type PostColumn = "id" | "title" | "content";

type ColumnAccess<T extends Table, C extends string> = `${T}.${C}`;

type UserField = ColumnAccess<"users", UserColumn>;
// Result: "users.id" | "users.name" | "users.email"

const userFields: UserField[] = [
  "users.id",
  "users.name",
  "users.email"
]; // ✅
```

**Advanced Example 7: Version Strings**

```ts
// Semantic versioning
type Major = 0 | 1 | 2 | 3;
type Minor = 0 | 1 | 2 | 3 | 4 | 5;
type Patch = 0 | 1 | 2 | 3 | 4 | 5;

type Version = `${Major}.${Minor}.${Patch}`;
// Result: "0.0.0" | "0.0.1" | "0.1.0" | ... | "3.5.5"

const versions: Version[] = [
  "1.0.0",
  "2.3.1",
  "3.5.5"
]; // ✅

const invalidVersion: Version = "1.0";    // ❌ Error
const invalidVersion2: Version = "4.0.0"; // ❌ Error: 4 not in Major

// With pre-release tags
type PreRelease = "alpha" | "beta" | "rc";
type VersionWithTag = `${Version}-${PreRelease}`;

const taggedVersions: VersionWithTag[] = [
  "1.0.0-alpha",
  "2.0.0-beta",
  "3.0.0-rc"
]; // ✅
```

**Advanced Example 8: Utility String Transformations**

```ts
// Built-in utility types for string manipulation
type UppercaseTest = Uppercase<"hello">; // "HELLO"
type LowercaseTest = Lowercase<"WORLD">; // "world"
type CapitalizeTest = Capitalize<"alice">; // "Alice"
type UncapitalizeTest = Uncapitalize<"Bob">; // "bob"

// Combining transformations
type Method = "get" | "post" | "put" | "delete";
type UpperMethod = Uppercase<Method>;
// Result: "GET" | "POST" | "PUT" | "DELETE"

type SnakeCase<T extends string> = T extends `${infer A}${infer B}`
  ? `${Lowercase<A>}_${SnakeCase<B>}`
  : Lowercase<T>;

// Generate constant names
type ConstantName<T extends string> = Uppercase<T>;
type ActionConstant = ConstantName<"user_logged_in">;
// Result: "USER_LOGGED_IN"

// Environment variables
type EnvVar<T extends string> = Uppercase<`${T}_env`>;
type NodeEnv = EnvVar<"node">; // "NODE_ENV"
type ApiEnv = EnvVar<"api">; // "API_ENV"
```

**Advanced Example 9: Type-Safe Internationalization (i18n)**

```ts
// i18n keys with namespaces
type Namespace = "common" | "errors" | "validation";
type Key = "title" | "description" | "button";
type I18nKey = `${Namespace}:${Key}`;
// Result: "common:title" | "errors:title" | ...

function translate(key: I18nKey): string {
  // Translation logic
  return translations[key];
}

translate("common:title");      // ✅
translate("errors:description"); // ✅
translate("invalid:key");       // ❌ Error

// With parameters
type ParamKey = `${Namespace}:${Key}:${string}`;
const paramKeys: ParamKey[] = [
  "common:title:en",
  "errors:button:es",
  "validation:description:fr"
]; // ✅
```

**Advanced Example 10: Path Types**

```ts
// File system paths
type Extension = "ts" | "tsx" | "js" | "jsx";
type FilePath = `${string}.${Extension}`;

const filePaths: FilePath[] = [
  "index.ts",
  "App.tsx",
  "utils.js"
]; // ✅

const invalidPath: FilePath = "styles.css"; // ❌ Error

// URL paths
type Protocol = "http" | "https";
type Domain = string;
type Url = `${Protocol}://${Domain}`;

const urls: Url[] = [
  "https://example.com",
  "http://localhost:3000"
]; // ✅

const invalidUrl: Url = "ftp://example.com"; // ❌ Error
```

**Advanced Example 11: Mapping Object Keys**

```ts
// Generate getter/setter names from property names
type PropertyName = "name" | "age" | "email";
type Getter<T extends string> = `get${Capitalize<T>}`;
type Setter<T extends string> = `set${Capitalize<T>}`;

type PropertyAccessors = {
  [K in PropertyName as Getter<K>]: () => string;
} & {
  [K in PropertyName as Setter<K>]: (value: string) => void;
};

// Result:
// {
//   getName: () => string;
//   getAge: () => string;
//   getEmail: () => string;
//   setName: (value: string) => void;
//   setAge: (value: string) => void;
//   setEmail: (value: string) => void;
// }

const obj: PropertyAccessors = {
  getName: () => "Alice",
  getAge: () => "30",
  getEmail: () => "alice@example.com",
  setName: (value) => console.log(value),
  setAge: (value) => console.log(value),
  setEmail: (value) => console.log(value)
};
```

**Advanced Example 12: Extracting Parts from Template Literals**

```ts
// Extract parts using infer
type ExtractRouteParams<T extends string> = 
  T extends `${infer _Start}/:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : T extends `${infer _Start}/:${infer Param}`
    ? Param
    : never;

type Route1 = "/users/:userId/posts/:postId";
type Params1 = ExtractRouteParams<Route1>; // "userId" | "postId"

type Route2 = "/products/:productId";
type Params2 = ExtractRouteParams<Route2>; // "productId"

// Use extracted params for type-safe route handlers
type RouteParams<T extends string> = {
  [K in ExtractRouteParams<T>]: string;
};

function handleRoute<T extends string>(
  route: T,
  params: RouteParams<T>
) {
  console.log(route, params);
}

// TypeScript infers the required params!
handleRoute("/users/:userId/posts/:postId", {
  userId: "123",
  postId: "456"
}); // ✅

handleRoute("/users/:userId/posts/:postId", {
  userId: "123"
  // ❌ Error: missing postId
});
```

**Benefits of Template Literal Types:**

1. **Type-Safe String Patterns**: Enforce string formats at compile time
2. **Automatic Code Generation**: Generate related types from base types
3. **Better DX**: Autocomplete for string patterns
4. **Refactoring Safety**: Changes propagate through string-based APIs
5. **Self-Documenting**: Types describe expected string formats

**Best Practices:**

```ts
// ✅ Good: Use for structured string patterns
type HttpMethod = "GET" | "POST";
type Route = "/users" | "/posts";
type ApiCall = `${HttpMethod} ${Route}`;

// ✅ Good: Generate related types
type EventName = "click" | "submit";
type Handler = `on${Capitalize<EventName>}`;

// ❌ Avoid: Too general (loses type safety)
type TooGeneral = `${string}-${string}`;

// ❌ Avoid: Overly complex (hard to understand)
type TooComplex = `${string}-${number}-${string}-${boolean}`;

// ✅ Better: Break into smaller, named types
type Prefix = string;
type Id = number;
type Status = "active" | "inactive";
type ComplexId = `${Prefix}-${Id}-${Status}`;
```

**Key Points:**
- Template literal types work at the type level, not runtime
- They support all intrinsic string manipulation utilities
- They can be combined with mapped types for powerful transformations
- They enable type-safe APIs for string-based patterns

---

### 7. What happens when you widen a literal type to its primitive type? How can you prevent unwanted widening?

**Answer:**

**Type widening** occurs when TypeScript expands a specific literal type to its more general primitive type. This typically happens with mutable variable declarations or when TypeScript cannot infer a specific enough type.

**When Widening Happens:**

```ts
// 1. Using `let` instead of `const`
const role1 = "admin"; // Type: "admin" (literal)
let role2 = "admin";   // Type: string (widened)

// 2. Object properties without `as const`
const config = {
  mode: "dark" // Type: string (widened)
};

// 3. Array elements
const colors = ["red", "green"]; // Type: string[]

// 4. Function returns without explicit type
function getStatus() {
  return "active"; // Return type: string (widened)
}

// 5. When passed to functions expecting broader types
function takeString(s: string) {}
const literal = "hello"; // Type: "hello"
takeString(literal); // Widens to string when passed
```

**Problems Caused by Widening:**

```ts
type Theme = "light" | "dark";

function setTheme(theme: Theme) {
  console.log(`Setting theme to: ${theme}`);
}

// Problem 1: Variable widening
let theme = "light"; // Type: string
setTheme(theme); 
// ❌ Error: Argument of type 'string' is not assignable to parameter of type 'Theme'

// Problem 2: Object property widening
const config = {
  theme: "light" // Type: string
};
setTheme(config.theme);
// ❌ Error: Argument of type 'string' is not assignable to parameter of type 'Theme'

// Problem 3: Array widening
const themes = ["light", "dark"]; // Type: string[]
themes.forEach(setTheme);
// ❌ Error: Argument of type 'string' is not assignable to parameter of type 'Theme'
```

**Solutions to Prevent Widening:**

**Solution 1: Use `const` instead of `let`**

```ts
const theme = "light"; // Type: "light" (not widened)
setTheme(theme); // ✅ Works!

// Note: `const` only prevents widening for the variable itself,
// not for object properties or array elements
```

**Solution 2: Use `as const` Assertion**

```ts
// For single values
let theme = "light" as const; // Type: "light"
setTheme(theme); // ✅

// For objects
const config = {
  theme: "light",
  fontSize: 14
} as const;
// Type: { readonly theme: "light"; readonly fontSize: 14 }
setTheme(config.theme); // ✅

// For arrays
const themes = ["light", "dark"] as const;
// Type: readonly ["light", "dark"]
themes.forEach(theme => setTheme(theme)); // ✅
```

**Solution 3: Explicit Type Annotations**

```ts
// For variables
let theme: Theme = "light"; // Type: Theme (union of literals)
setTheme(theme); // ✅

// For object properties
const config: { theme: Theme } = {
  theme: "light"
};
setTheme(config.theme); // ✅

// For arrays
const themes: Theme[] = ["light", "dark"];
themes.forEach(setTheme); // ✅

// For function returns
function getTheme(): Theme {
  return "light"; // Type is narrowed to Theme
}
setTheme(getTheme()); // ✅
```

**Solution 4: Type Assertions**

```ts
// Cast to specific literal type
let theme = "light" as "light"; // Type: "light"
setTheme(theme); // ✅

// Cast to union type
let theme2 = "dark" as Theme; // Type: Theme
setTheme(theme2); // ✅

// For object properties
const config = {
  theme: "light" as Theme
};
setTheme(config.theme); // ✅
```

**Solution 5: Using satisfies Operator (TypeScript 4.9+)**

```ts
// Ensures type compatibility while preserving literal types
const config = {
  theme: "light",
  fontSize: 14
} satisfies { theme: Theme; fontSize: number };

// config.theme is type "light", not Theme or string
setTheme(config.theme); // ✅

// Benefits: Catches errors AND preserves literals
const badConfig = {
  theme: "invalid", // ❌ Error: "invalid" not in Theme
  fontSize: "large" // ❌ Error: string not assignable to number
} satisfies { theme: Theme; fontSize: number };
```

**Real-World Example: API Configuration**

```ts
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ContentType = "application/json" | "text/plain" | "multipart/form-data";

interface RequestConfig {
  method: HttpMethod;
  contentType: ContentType;
  timeout: number;
}

// ❌ Problem: Types are widened
const config1 = {
  method: "GET",        // Type: string
  contentType: "application/json", // Type: string
  timeout: 5000
};

function makeRequest(config: RequestConfig) {
  // ... implementation
}

makeRequest(config1); // ❌ Error: Types don't match

// ✅ Solution 1: as const
const config2 = {
  method: "GET",
  contentType: "application/json",
  timeout: 5000
} as const;

makeRequest(config2); // ✅

// ✅ Solution 2: Explicit type annotation
const config3: RequestConfig = {
  method: "GET",
  contentType: "application/json",
  timeout: 5000
};

makeRequest(config3); // ✅

// ✅ Solution 3: satisfies (best of both worlds)
const config4 = {
  method: "GET",
  contentType: "application/json",
  timeout: 5000
} satisfies RequestConfig;

// config4.method is "GET", not HttpMethod or string
// But still type-checked against RequestConfig
makeRequest(config4); // ✅
```

**Advanced: Conditional Widening**

```ts
// Create a type that conditionally widens
type Widen<T> = T extends string ? string :
                T extends number ? number :
                T extends boolean ? boolean :
                T;

type Test1 = Widen<"hello">; // string
type Test2 = Widen<42>; // number
type Test3 = Widen<true>; // boolean

// Prevent widening with a type guard
type NoWiden<T> = T extends string ? (string extends T ? never : T) :
                  T extends number ? (number extends T ? never : T) :
                  T;

type Test4 = NoWiden<"hello">; // "hello"
type Test5 = NoWiden<string>; // never
```

**Best Practices:**

```ts
// ✅ Use const for immutable values
const status = "active";

// ✅ Use as const for configuration objects
const CONFIG = {
  API_URL: "https://api.example.com",
  TIMEOUT: 5000
} as const;

// ✅ Use type annotations for mutable variables
let currentTheme: Theme = "light";

// ✅ Use satisfies for type-checked configuration with literal preservation
const routes = {
  home: "/",
  about: "/about",
  contact: "/contact"
} satisfies Record<string, `/${string}`>;

// ✅ Explicitly type function returns when needed
function getDefaultTheme(): Theme {
  return "light";
}

// ❌ Avoid: Letting types widen unintentionally
let theme = "light"; // Problematic if used with literal type APIs

// ❌ Avoid: Unnecessary widening with type assertions
const theme2 = "light" as string; // Unnecessarily wide
```

**Comparison: Different Approaches**

```ts
type Theme = "light" | "dark";

// Approach 1: const (immutable, literal type)
const theme1 = "light"; // Type: "light"
// Pros: Simple, automatic
// Cons: Immutable

// Approach 2: let with type annotation (mutable, union type)
let theme2: Theme = "light"; // Type: Theme
// Pros: Mutable, type-safe
// Cons: Loses specific literal type

// Approach 3: let with as const (mutable variable, literal type)
let theme3 = "light" as const; // Type: "light"
// Pros: Mutable, preserves literal
// Cons: Requires explicit cast to assign new literals

// Approach 4: satisfies (type-checked, literal preservation)
const theme4 = "light" satisfies Theme; // Type: "light"
// Pros: Type-checked, preserves literal
// Cons: Requires TypeScript 4.9+, immutable

// Approach 5: as const on object
const config = { theme: "light" } as const;
// Pros: Preserves literals, readonly
// Cons: Entire object is readonly
```

**Key Points:**
- Widening converts specific literal types to general primitive types
- It happens with `let`, object properties, and arrays without `as const`
- Prevent widening using `const`, `as const`, type annotations, or `satisfies`
- Choose the approach based on mutability needs and TypeScript version
- `satisfies` (TS 4.9+) offers the best balance of type checking and literal preservation

---

### 8. Explain the performance implications of using very large literal union types. When should you use enums instead?

**Answer:**

**Performance Implications of Large Literal Unions:**

Large literal union types can impact TypeScript compiler performance, IDE responsiveness, and type-checking speed. Understanding these implications helps make informed architectural decisions.

**Performance Impact Areas:**

**1. Compile-Time Performance:**

```ts
// Small union (fast)
type SmallStatus = "pending" | "approved" | "rejected";

// Large union (slower)
type LargeCountryCode = 
  | "US" | "CA" | "MX" | "UK" | "FR" | "DE" | "IT" | "ES" | "PT" | "NL"
  | "BE" | "LU" | "CH" | "AT" | "PL" | "CZ" | "SK" | "HU" | "RO" | "BG"
  | "GR" | "HR" | "SI" | "LT" | "LV" | "EE" | "FI" | "SE" | "NO" | "DK"
  | "IE" | "IS" | "TR" | "RU" | "UA" | "BY" | "RS" | "BA" | "AL" | "MK"
  // ... 200+ more country codes
  ;

// Very large union (can be very slow)
type VeryLargeUnion = 
  | "value1" | "value2" | "value3" | /* ... */ "value10000";
  // 10,000+ literal values
```

**Performance Characteristics:**

- **Small unions (< 20 members)**: Negligible performance impact
- **Medium unions (20-100 members)**: Noticeable in complex types, generally acceptable
- **Large unions (100-1000 members)**: Can slow down IDE, type checking, and compilation
- **Very large unions (> 1000 members)**: Can cause significant performance issues

**2. IDE Performance:**

```ts
// IDE struggles with autocomplete
type StatusCode = 
  | 100 | 101 | 102 | 103
  | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226
  | 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308
  | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410
  | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423
  | 424 | 425 | 426 | 428 | 429 | 431 | 451
  | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511;

// Autocomplete shows ALL values (overwhelming)
let code: StatusCode = // IDE shows 60+ suggestions
```

**3. Type Checking Speed:**

```ts
// Fast type checking
type SmallUnion = "a" | "b" | "c";

function check1(value: SmallUnion) {
  // Quick to check
}

// Slower type checking
type LargeUnion = "a1" | "a2" | "a3" /* ... */ | "a1000";

function check2(value: LargeUnion) {
  // Slower to check, especially with multiple parameters
}

// Even slower with combinations
function check3(
  value1: LargeUnion,
  value2: LargeUnion,
  value3: LargeUnion
) {
  // Cartesian product of possibilities slows down checking
}
```

**When to Use Enums Instead:**

**Use Enums When:**

1. **Many Values (> 50-100)**: Better performance for large sets
2. **Runtime Value Lookup**: Need reverse mapping (number enums)
3. **Grouped Constants**: Logical grouping of related values
4. **Iteration Needed**: Need to iterate over all possible values
5. **Name**: Need both name and value at runtime

**Enum Advantages:**

```ts
// ✅ Better for large sets
enum StatusCode {
  OK = 200,
  Created = 201,
  Accepted = 202,
  // ... 50+ more
  InternalServerError = 500,
  BadGateway = 502,
  ServiceUnavailable = 503
}

// Fast lookups
function handleStatus(code: StatusCode) {
  // TypeScript compiles this efficiently
}

// Runtime reverse mapping (number enums)
enum Priority {
  Low = 1,
  Medium = 2,
  High = 3
}

console.log(Priority[1]); // "Low" (reverse lookup)
console.log(Priority.Low); // 1 (forward lookup)

// Can iterate over values
const priorityValues = Object.keys(Priority)
  .filter(key => isNaN(Number(key)))
  .map(key => Priority[key as keyof typeof Priority]);
```

**Use Literal Unions When:**

1. **Few Values (< 50)**: Minimal performance impact
2. **Type-Level Operations**: Need to manipulate types at compile time
3. **Discriminated Unions**: Creating tagged unions
4. **Template Literals**: Generating string patterns
5. **Readonly Values**: Want const-like behavior

**Literal Union Advantages:**

```ts
// ✅ Better for small sets
type Status = "pending" | "approved" | "rejected";

// ✅ Works with template literal types
type EventHandler = `on${Capitalize<"click" | "submit" | "change">}`;

// ✅ Works in discriminated unions
type Result = 
  | { status: "success"; data: string }
  | { status: "error"; message: string };

// ✅ Type-level manipulation
type Uppercase<T extends string> = T extends "pending" ? "PENDING" :
                                    T extends "approved" ? "APPROVED" :
                                    "REJECTED";
```

**Hybrid Approach:**

```ts
// Use enum for the implementation
enum StatusCodeEnum {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500
}

// Export as literal union type for better type-level operations
export type StatusCode = StatusCodeEnum;

// Or extract the values
export type StatusCodeValue = `${StatusCodeEnum}`;
// Result: "200" | "201" | "400" | "401" | "404" | "500"
```

**Const Objects as Alternative:**

```ts
// Best of both worlds for medium-sized sets
const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  IN_REVIEW: "in_review",
  CANCELLED: "cancelled"
} as const;

// Extract type
type Status = typeof STATUS[keyof typeof STATUS];
// Result: "pending" | "approved" | "rejected" | "in_review" | "cancelled"

// Runtime access
console.log(STATUS.PENDING); // "pending"

// Can check membership
function isValidStatus(value: string): value is Status {
  return Object.values(STATUS).includes(value as Status);
}
```

**Performance Comparison:**

```ts
// ❌ Slow: Very large literal union
type VeryLargeUnion = 
  | "val1" | "val2" | "val3" /* ... */ | "val10000";

// ✅ Fast: Enum
enum VeryLargeEnum {
  Val1 = "val1",
  Val2 = "val2",
  Val3 = "val3",
  // ... 10000 more
}

// ✅ Fast: Const object with extracted type
const LARGE_SET = {
  VAL1: "val1",
  VAL2: "val2",
  // ... 10000 more
} as const;

type LargeSetValue = typeof LARGE_SET[keyof typeof LARGE_SET];
```

**Benchmark Guidelines:**

```ts
// Up to ~20 values: Literal unions are fine
type SmallSet = "a" | "b" | "c" | "d" | "e";

// 20-100 values: Consider use case
// - Literal union: If doing type-level operations
// - Const object: If need runtime access
// - Enum: If need reverse mapping

// 100-1000 values: Prefer alternatives
// - Const object with type extraction (recommended)
// - Enum (if need runtime features)

// 1000+ values: Avoid literal unions
// - Use const objects or enums
// - Consider if you really need all values as types
```

**Real-World Example:**

```ts
// ❌ Don't do this for country codes (195+ countries)
type CountryCode = "US" | "CA" | "MX" | /* ... */ | "ZW";

// ✅ Better: Use const object
const COUNTRY_CODES = {
  US: "US",
  CA: "CA",
  MX: "MX",
  // ... all countries
  ZW: "ZW"
} as const;

type CountryCode = typeof COUNTRY_CODES[keyof typeof COUNTRY_CODES];

// ✅ Or use string type with runtime validation
type CountryCode = string;

function isValidCountryCode(code: string): code is CountryCode {
  return VALID_COUNTRY_CODES.has(code);
}

// ✅ Or use a branded type
type CountryCode = string & { readonly __brand: unique symbol };

function validateCountryCode(code: string): CountryCode {
  if (!VALID_COUNTRY_CODES.has(code)) {
    throw new Error(`Invalid country code: ${code}`);
  }
  return code as CountryCode;
}
```

**Decision Matrix:**

| Criteria | Literal Union | Const Object | Enum |
|----------|--------------|--------------|------|
| Size < 20 | ✅ Preferred | ✅ Good | ⚠️ Overkill |
| Size 20-100 | ✅ Good | ✅ Preferred | ✅ Good |
| Size 100+ | ❌ Slow | ✅ Preferred | ✅ Good |
| Template Literals | ✅ Yes | ❌ No | ❌ No |
| Discriminated Unions | ✅ Yes | ✅ Yes | ⚠️ Limited |
| Runtime Iteration | ❌ No | ✅ Yes | ✅ Yes |
| Reverse Mapping | ❌ No | ❌ No | ✅ Yes (number enums) |
| Tree-Shaking | ✅ Best | ✅ Good | ⚠️ Limited |

**Best Practices:**

```ts
// ✅ Small set: Use literal unions
type Status = "active" | "inactive" | "pending";

// ✅ Medium set: Use const object with type extraction
const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS"
} as const;

type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];

// ✅ Large set: Consider if you need all as types
// Maybe use runtime validation instead
type UserId = string; // Don't enumerate all possible IDs

function isValidUserId(id: string): id is UserId {
  return /^user_[0-9a-f]{24}$/.test(id);
}

// ✅ For truly large enumerations with runtime needs: Use enum
enum StatusCode {
  // ... 100+ status codes
}
```

**Key Points:**
- Small literal unions (< 20) have negligible performance impact
- Large unions (> 100) can significantly slow down compilation and IDE
- Const objects with type extraction offer a good middle ground
- Enums are better for large sets needing runtime features
- Consider runtime validation instead of exhaustive type enumerations

---

### 9. How would you implement exhaustive checking using literal types and the `never` type?

**Answer:**

**Exhaustive checking** ensures that all possible cases of a union type are handled. The `never` type is used to catch any unhandled cases at compile time.

**Basic Concept:**

The `never` type represents values that never occur. If TypeScript can reach a point where a variable is assigned to `never`, it means all possible cases haven't been handled.

**Simple Example:**

```ts
type Status = "pending" | "approved" | "rejected";

function handleStatus(status: Status): string {
  switch (status) {
    case "pending":
      return "Waiting for approval";
    case "approved":
      return "Application approved";
    case "rejected":
      return "Application rejected";
    default:
      // Exhaustive check
      const _exhaustive: never = status;
      return _exhaustive;
  }
}

// If we add a new status without handling it:
type Status2 = "pending" | "approved" | "rejected" | "in_review";

function handleStatus2(status: Status2): string {
  switch (status) {
    case "pending":
      return "Waiting for approval";
    case "approved":
      return "Application approved";
    case "rejected":
      return "Application rejected";
    default:
      const _exhaustive: never = status;
      // ❌ Error: Type '"in_review"' is not assignable to type 'never'
      return _exhaustive;
  }
}
```

**Why It Works:**

1. TypeScript narrows the type in each `case` branch
2. After all handled cases, only unhandled types remain
3. If all cases are handled, the remaining type is `never`
4. If some cases aren't handled, assigning to `never` causes a compile error

**Exhaustive Checking Patterns:**

**Pattern 1: Switch Statement (Recommended)**

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rectangle"; width: number; height: number };

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default:
      // Ensures all cases are handled
      const _exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${JSON.stringify(_exhaustive)}`);
  }
}

// Adding a new shape will cause a compile error in the default case
type Shape2 = Shape | { kind: "triangle"; base: number; height: number };
// Need to add: case "triangle": ...
```

**Pattern 2: If-Else Chain**

```ts
type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function handleResponse<T>(response: ApiResponse<T>): React.ReactNode {
  if (response.status === "loading") {
    return <Spinner />;
  } else if (response.status === "success") {
    return <DataDisplay data={response.data} />;
  } else if (response.status === "error") {
    return <ErrorMessage error={response.error} />;
  } else {
    // Exhaustive check
    const _exhaustive: never = response;
    throw new Error(`Unhandled response: ${JSON.stringify(_exhaustive)}`);
  }
}
```

**Pattern 3: Helper Function**

```ts
// Reusable exhaustive check function
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

type Color = "red" | "green" | "blue";

function getColorCode(color: Color): string {
  switch (color) {
    case "red":
      return "#FF0000";
    case "green":
      return "#00FF00";
    case "blue":
      return "#0000FF";
    default:
      return assertNever(color);
  }
}

// Adding a color without handling it will cause an error
type Color2 = "red" | "green" | "blue" | "yellow";

function getColorCode2(color: Color2): string {
  switch (color) {
    case "red":
      return "#FF0000";
    case "green":
      return "#00FF00";
    case "blue":
      return "#0000FF";
    default:
      return assertNever(color);
      // ❌ Error: Argument of type '"yellow"' is not assignable to parameter of type 'never'
  }
}
```

**Pattern 4: Type-Level Exhaustiveness**

```ts
// Ensure all members of a union are handled at the type level
type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET"; payload: number };

// Create a mapped type that requires handlers for all action types
type ActionHandlers<T extends Action> = {
  [K in T["type"]]: (action: Extract<T, { type: K }>) => void;
};

// TypeScript enforces that all action types have handlers
const handlers: ActionHandlers<Action> = {
  INCREMENT: (action) => console.log("Incrementing"),
  DECREMENT: (action) => console.log("Decrementing"),
  RESET: (action) => console.log("Resetting to", action.payload)
};

// ❌ Error if any handler is missing
const incompleteHandlers: ActionHandlers<Action> = {
  INCREMENT: (action) => console.log("Incrementing"),
  DECREMENT: (action) => console.log("Decrementing")
  // ❌ Error: Property 'RESET' is missing
};
```

**Real-World Example 1: Redux Reducer**

```ts
type Action =
  | { type: "USER_LOGIN"; payload: { userId: string; token: string } }
  | { type: "USER_LOGOUT" }
  | { type: "UPDATE_PROFILE"; payload: { name: string; email: string } }
  | { type: "DELETE_ACCOUNT" };

interface State {
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  profile: { name: string; email: string } | null;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "USER_LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        userId: action.payload.userId,
        token: action.payload.token
      };
    case "USER_LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        userId: null,
        token: null,
        profile: null
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: action.payload
      };
    case "DELETE_ACCOUNT":
      return {
        isLoggedIn: false,
        userId: null,
        token: null,
        profile: null
      };
    default:
      const _exhaustive: never = action;
      return state;
  }
}
```

**Real-World Example 2: Route Handling**

```ts
type Route =
  | { path: "/"; component: "Home" }
  | { path: "/about"; component: "About" }
  | { path: "/contact"; component: "Contact" }
  | { path: "/products/:id"; component: "ProductDetails"; params: { id: string } };

function renderRoute(route: Route): JSX.Element {
  switch (route.component) {
    case "Home":
      return <HomePage />;
    case "About":
      return <AboutPage />;
    case "Contact":
      return <ContactPage />;
    case "ProductDetails":
      return <ProductDetailsPage productId={route.params.id} />;
    default:
      const _exhaustive: never = route;
      throw new Error(`Unhandled route: ${JSON.stringify(_exhaustive)}`);
  }
}
```

**Real-World Example 3: Form Validation**

```ts
type ValidationRule =
  | { type: "required"; message: string }
  | { type: "minLength"; length: number; message: string }
  | { type: "maxLength"; length: number; message: string }
  | { type: "pattern"; regex: RegExp; message: string }
  | { type: "custom"; validator: (value: string) => boolean; message: string };

function validateField(value: string, rule: ValidationRule): string | null {
  switch (rule.type) {
    case "required":
      return value.length === 0 ? rule.message : null;
    case "minLength":
      return value.length < rule.length ? rule.message : null;
    case "maxLength":
      return value.length > rule.length ? rule.message : null;
    case "pattern":
      return !rule.regex.test(value) ? rule.message : null;
    case "custom":
      return !rule.validator(value) ? rule.message : null;
    default:
      const _exhaustive: never = rule;
      throw new Error(`Unknown validation rule: ${JSON.stringify(_exhaustive)}`);
  }
}
```

**Advanced: Exhaustiveness with Generics**

```ts
// Generic exhaustive check
function exhaustiveCheck<T extends never>(value: T): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

type Event = 
  | { type: "click"; x: number; y: number }
  | { type: "keypress"; key: string }
  | { type: "scroll"; delta: number };

function handleEvent(event: Event): void {
  switch (event.type) {
    case "click":
      console.log(`Clicked at (${event.x}, ${event.y})`);
      break;
    case "keypress":
      console.log(`Key pressed: ${event.key}`);
      break;
    case "scroll":
      console.log(`Scrolled: ${event.delta}px`);
      break;
    default:
      exhaustiveCheck(event);
  }
}
```

**Testing Exhaustiveness:**

```ts
// Test that all cases are covered
type TestExhaustiveness<T, U> = T extends U ? (U extends T ? true : false) : false;

type AllActionsHandled = TestExhaustiveness<
  keyof typeof handlers,
  Action["type"]
>;
// Type: true if all actions are handled, false otherwise
```

**Benefits of Exhaustive Checking:**

1. **Compile-Time Safety**: Catches missing cases before runtime
2. **Refactoring Safety**: Adding new cases causes compile errors
3. **Documentation**: Code clearly shows all possible cases
4. **Maintenance**: Easier to maintain as codebase evolves
5. **Confidence**: Guaranteed all cases are handled

**Common Pitfalls:**

```ts
// ❌ Pitfall 1: Forgetting the default case
function handleStatus(status: Status): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    // Missing default case - no compile error if a case is missing!
  }
  return "Unknown"; // Type error, but not exhaustive
}

// ✅ Solution: Always include default with never check
function handleStatusCorrect(status: Status): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      const _exhaustive: never = status;
      return _exhaustive;
  }
}

// ❌ Pitfall 2: Using any or unknown
function handleStatusBad(status: any): string {
  switch (status) {
    case "pending":
      return "Pending";
    default:
      const _exhaustive: never = status; // No error! 'any' is assignable to never
      return _exhaustive;
  }
}

// ✅ Solution: Use specific union types
function handleStatusGood(status: Status): string {
  // ... proper implementation
}

// ❌ Pitfall 3: Type widening
const status = "pending"; // Type: string, not "pending"
function test(s: Status) {
  // ...
}
test(status); // ❌ Error

// ✅ Solution: Use const or type annotation
const statusCorrect = "pending" as const; // Type: "pending"
test(statusCorrect); // ✅
```

**Best Practices:**

```ts
// ✅ Always use a reusable assertNever function
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

// ✅ Include meaningful error messages
default:
  return assertNever(shape);
  // Better: throw new Error(`Unhandled shape type: ${(shape as any).kind}`);

// ✅ Use discriminated unions for complex types
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };
// The 'kind' property enables exhaustive checking

// ✅ Keep the never variable for documentation
default:
  const _exhaustive: never = value;
  throw new Error(`Unhandled case: ${_exhaustive}`);
```

**Key Points:**
- Exhaustive checking ensures all union cases are handled
- Use `never` type to catch unhandled cases at compile time
- Always include a default case with `never` check
- The pattern works best with discriminated unions
- Reusable `assertNever` function improves consistency

---

### 10. How do literal types interact with `strictNullChecks`? What are the implications for optional properties?

**Answer:**

**`strictNullChecks`** is a TypeScript compiler flag that changes how `null` and `undefined` are treated in the type system. This significantly affects how literal types work, especially with optional properties.

**Without `strictNullChecks` (Default Behavior in Older TS):**

```ts
// Without strictNullChecks, all types implicitly include null and undefined
type Status = "active" | "inactive";

let status1: Status = "active";     // ✅
let status2: Status = "inactive";   // ✅
let status3: Status = null;         // ✅ (implicitly allowed)
let status4: Status = undefined;    // ✅ (implicitly allowed)

// This can lead to runtime errors
function getStatusText(status: Status): string {
  return status.toUpperCase(); 
  // ❌ Runtime error if status is null or undefined!
}

getStatusText(null); // Compiles but crashes at runtime
```

**With `strictNullChecks` (Recommended):**

```ts
// With strictNullChecks, null and undefined must be explicitly included
type Status = "active" | "inactive";

let status1: Status = "active";     // ✅
let status2: Status = "inactive";   // ✅
let status3: Status = null;         // ❌ Error: Type 'null' is not assignable to type 'Status'
let status4: Status = undefined;    // ❌ Error: Type 'undefined' is not assignable to type 'Status'

// Must explicitly allow null/undefined
type NullableStatus = "active" | "inactive" | null;
type MaybeStatus = "active" | "inactive" | undefined;
type OptionalStatus = "active" | "inactive" | null | undefined;

let status5: NullableStatus = null;      // ✅
let status6: MaybeStatus = undefined;    // ✅
let status7: OptionalStatus = null;      // ✅
let status8: OptionalStatus = undefined; // ✅
```

**Literal Types with Null/Undefined:**

```ts
// Literal types can include null/undefined as literal values
type Result = "success" | "error" | null;

let result1: Result = "success"; // ✅
let result2: Result = "error";   // ✅
let result3: Result = null;      // ✅
let result4: Result = undefined; // ❌ Error

// null and undefined are themselves literal types
type JustNull = null;
type JustUndefined = undefined;

let x: JustNull = null;      // ✅
let y: JustNull = undefined; // ❌ Error

// Using both
type MaybeString = string | null | undefined;
```

**Optional Properties and Literal Types:**

**The Difference Between `?` and `| undefined`:**

```ts
interface Config {
  // Optional property: Can be missing OR undefined
  theme?: "light" | "dark";
  
  // Explicit undefined: MUST be present, can be undefined
  mode: "auto" | "manual" | undefined;
  
  // Nullable: MUST be present, can be null
  status: "active" | "inactive" | null;
}

// Optional property can be omitted
const config1: Config = {
  mode: "auto",
  status: "active"
  // theme is omitted - ✅
};

// Optional property can be undefined
const config2: Config = {
  theme: undefined, // ✅
  mode: "auto",
  status: "active"
};

// mode must be present (even if undefined)
const config3: Config = {
  theme: "light",
  // mode: missing - ❌ Error: Property 'mode' is missing
  status: "active"
};

// status cannot be undefined (only null or literal)
const config4: Config = {
  mode: "auto",
  status: undefined // ❌ Error: Type 'undefined' is not assignable to type '"active" | "inactive" | null'
};
```

**Real-World Example 1: API Response**

```ts
// API response with optional fields and nullable values
interface ApiResponse {
  // Required literal
  status: "success" | "error";
  
  // Optional field (might not be present)
  message?: string;
  
  // Nullable field (present but can be null)
  data: UserData | null;
  
  // Optional nullable field
  metadata?: Record<string, unknown> | null;
}

// Valid responses
const response1: ApiResponse = {
  status: "success",
  data: { id: 1, name: "Alice" }
  // message and metadata omitted - ✅
};

const response2: ApiResponse = {
  status: "error",
  message: "Not found",
  data: null, // ✅ Explicitly null
  metadata: null // ✅ Explicitly null
};

const response3: ApiResponse = {
  status: "success",
  data: null // ✅ Must be present even if null
  // ❌ Error if data is omitted
};
```

**Real-World Example 2: Form State**

```ts
interface FormState {
  // Current value - literal types for specific states
  status: "idle" | "submitting" | "success" | "error";
  
  // Optional error message
  error?: string;
  
  // Validated value - can be the value or null if invalid
  validatedEmail: string | null;
  
  // Optional validation rules
  customValidator?: ((value: string) => boolean) | null;
}

// Form in idle state
const formState1: FormState = {
  status: "idle",
  validatedEmail: null
  // error and customValidator omitted - ✅
};

// Form with error
const formState2: FormState = {
  status: "error",
  error: "Invalid email",
  validatedEmail: null
};

// Form with custom validator
const formState3: FormState = {
  status: "idle",
  validatedEmail: null,
  customValidator: (value) => value.includes("@")
};

// Clearing custom validator
const formState4: FormState = {
  status: "idle",
  validatedEmail: null,
  customValidator: null // ✅ Explicitly set to null
};
```

**Handling Optional Literal Types:**

```ts
type Theme = "light" | "dark" | "auto";

interface UserPreferences {
  theme?: Theme; // Optional
  notifications: boolean | null; // Nullable
  language?: string | null; // Optional and nullable
}

function applyPreferences(prefs: UserPreferences) {
  // Handling optional literal type
  const theme = prefs.theme ?? "auto"; // Use default if undefined
  
  // Type narrowing with optional property
  if (prefs.theme !== undefined) {
    // prefs.theme is Theme here
    console.log(`Theme is: ${prefs.theme}`);
  }
  
  // Handling nullable property
  if (prefs.notifications !== null) {
    // prefs.notifications is boolean here
    console.log(`Notifications: ${prefs.notifications}`);
  }
  
  // Handling optional nullable property
  if (prefs.language !== undefined && prefs.language !== null) {
    // prefs.language is string here
    console.log(`Language: ${prefs.language}`);
  }
}
```

**Type Guards for Optional Literals:**

```ts
type Status = "pending" | "approved" | "rejected";

interface Application {
  id: string;
  status?: Status; // Optional
  priority: number | null; // Nullable
}

// Type guard for optional property
function hasStatus(app: Application): app is Application & { status: Status } {
  return app.status !== undefined;
}

// Type guard for non-null
function hasPriority(app: Application): app is Application & { priority: number } {
  return app.priority !== null;
}

function processApplication(app: Application) {
  if (hasStatus(app)) {
    // app.status is Status, not Status | undefined
    console.log(`Status: ${app.status}`);
  }
  
  if (hasPriority(app)) {
    // app.priority is number, not number | null
    console.log(`Priority: ${app.priority}`);
  }
}
```

**Discriminated Unions with Optional Fields:**

```ts
type ApiResult =
  | { status: "loading"; data?: undefined }
  | { status: "success"; data: UserData }
  | { status: "error"; data?: undefined; error: string };

function handleResult(result: ApiResult) {
  switch (result.status) {
    case "loading":
      // result.data is undefined
      console.log("Loading...");
      break;
    case "success":
      // result.data is UserData
      console.log("Data:", result.data);
      break;
    case "error":
      // result.error is string, result.data is undefined
      console.log("Error:", result.error);
      break;
  }
}
```

**Utility Types with Literal Optional Properties:**

```ts
type Theme = "light" | "dark";

interface Config {
  theme: Theme;
  autoSave?: boolean;
  language?: string;
}

// Make all properties optional
type PartialConfig = Partial<Config>;
// { theme?: Theme; autoSave?: boolean; language?: string }

// Make all properties required
type RequiredConfig = Required<Config>;
// { theme: Theme; autoSave: boolean; language: string }

// Remove optional properties
type DefinedConfig = {
  [K in keyof Config as Config[K] extends undefined ? never : K]: Config[K];
};
// { theme: Theme }

// Extract only optional properties
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

type ConfigOptionalKeys = OptionalKeys<Config>;
// "autoSave" | "language"
```

**Best Practices:**

```ts
// ✅ Use `?` for truly optional properties
interface User {
  id: string;
  name: string;
  nickname?: string; // May not exist
}

// ✅ Use `| null` when a value can be explicitly absent
interface Product {
  id: string;
  name: string;
  discount: number | null; // Explicitly no discount
}

// ✅ Use `| undefined` when a value might not be set yet
interface Cache {
  timestamp: number;
  data: string | undefined; // Not loaded yet
}

// ✅ Combine when needed
interface FormField {
  value: string | null;           // Can be null (cleared)
  error?: string;                 // May not exist (no error)
  validator?: ((v: string) => boolean) | null; // Optional AND nullable
}

// ❌ Avoid: Redundant undefined in optional properties
interface Bad {
  name?: string | undefined; // Redundant - `?` already includes undefined
}

// ✅ Better
interface Good {
  name?: string; // Sufficient
}

// ❌ Avoid: Using null when undefined is more appropriate
interface AlsoBad {
  optionalCallback: (() => void) | null; // Should probably be optional
}

// ✅ Better
interface AlsoGood {
  optionalCallback?: () => void;
}
```

**Migration Strategy:**

```ts
// When enabling strictNullChecks in existing codebase

// Before (without strictNullChecks):
type Status = "active" | "inactive";
let status: Status = getStat(); // Could return null

// After (with strictNullChecks):
type Status = "active" | "inactive" | null;
let status: Status = getStatus(); // Explicitly handle null

if (status !== null) {
  // Type narrowed to "active" | "inactive"
  console.log(status.toUpperCase());
}
```

**Key Points:**
- With `strictNullChecks`, `null` and `undefined` must be explicitly included in types
- `?` makes a property optional (can be omitted or `undefined`)
- `| null` makes a value nullable (must be present, can be `null`)
- `| undefined` means value must be present but can be `undefined`
- Combine them (`?: Type | null`) for optional nullable properties
- Use type guards and narrowing to handle optional/nullable literal types safely



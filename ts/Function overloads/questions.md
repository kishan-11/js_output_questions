# Interview Questions: Function Overloads

## 1. When do overloads provide better ergonomics than generics? Give examples.

**Answer:**

Overloads provide better ergonomics than generics when you need **different return types based on specific input types** or when you want **distinct API shapes** that generics cannot express clearly.

### Example 1: Different Return Types Based on Input
```ts
// ✅ Better with overloads - specific return types
function parse(input: string): string;
function parse(input: number): number;
function parse(input: string | number): string | number {
  return typeof input === "string" ? input.toUpperCase() : input * 2;
}

// ❌ Generic approach - loses specificity
function parseGeneric<T extends string | number>(input: T): T {
  return typeof input === "string" ? input.toUpperCase() as T : (input * 2) as T;
}

// Usage comparison
const str = parse("hello");     // Type: string
const num = parse(42);          // Type: number
// vs
const strGeneric = parseGeneric("hello"); // Type: string (but less clear)
```

### Example 2: API with Different Parameter Shapes
```ts
// ✅ Overloads for distinct API patterns
function createElement(tag: string): HTMLElement;
function createElement(tag: string, props: Record<string, any>): HTMLElement;
function createElement(tag: string, props?: Record<string, any>): HTMLElement {
  const element = document.createElement(tag);
  if (props) Object.assign(element, props);
  return element;
}

// ❌ Generic approach would be awkward
function createElementGeneric<T extends HTMLElement>(
  tag: string, 
  props?: Record<string, any>
): T {
  // Less type-safe, harder to use
}
```

### Example 3: Event Handlers with Specific Types
```ts
// ✅ Overloads provide precise event types
function addEventListener(
  event: "click",
  handler: (event: MouseEvent) => void
): void;
function addEventListener(
  event: "keydown", 
  handler: (event: KeyboardEvent) => void
): void;
function addEventListener(
  event: string,
  handler: (event: Event) => void
): void {
  // implementation
}

// Usage - precise typing
addEventListener("click", (e) => {
  e.clientX; // ✅ MouseEvent properties available
});
```

**When to prefer generics:**
```ts
// ✅ Generics better for uniform behavior
function identity<T>(value: T): T {
  return value;
}

function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  return array.map(fn);
}
```

---

## 2. How do you ensure the implementation signature is compatible with all overloads?

**Answer:**

The implementation signature must be **assignable to all overload signatures**. This means:

1. **Parameter types**: Implementation parameters must be assignable to all overload parameters
2. **Return type**: Implementation return type must be assignable to all overload return types
3. **Parameter count**: Must match exactly

### ✅ Correct Implementation
```ts
// Overloads
function process(input: string): string;
function process(input: number): number;
function process(input: boolean): boolean;

// ✅ Implementation - union type covers all overloads
function process(input: string | number | boolean): string | number | boolean {
  if (typeof input === "string") return input.toUpperCase();
  if (typeof input === "number") return input * 2;
  return !input;
}
```

### ❌ Incorrect Implementation
```ts
// Overloads
function process(input: string): string;
function process(input: number): number;

// ❌ Error: Implementation signature not compatible
function process(input: string | number): string { // Missing number return type
  return input.toString();
}
```

### Advanced Example: Complex Overloads
```ts
// Multiple parameter overloads
function createUser(name: string): User;
function createUser(name: string, age: number): User;
function createUser(name: string, age: number, email: string): User;

// ✅ Implementation covers all cases
function createUser(
  name: string, 
  age?: number, 
  email?: string
): User {
  return {
    name,
    age: age ?? 0,
    email: email ?? ""
  };
}
```

### Type Compatibility Rules
```ts
// ✅ These are compatible:
function fn1(x: string): string;
function fn1(x: string | number): string | number; // Implementation

// ❌ These are NOT compatible:
function fn2(x: string): string;
function fn2(x: number): string; // Wrong return type for number input
```

---

## 3. What pitfalls occur with union parameters and overload resolution?

**Answer:**

Union parameters can cause **ambiguous overload resolution** and **unexpected type inference**. Here are the main pitfalls:

### Pitfall 1: Ambiguous Overload Resolution
```ts
// ❌ Problematic overloads
function process(input: string | number): string;
function process(input: number | boolean): number;

// TypeScript error: "Overload signatures must all be ambient or non-ambient"
// The compiler can't determine which overload to use
```

### Pitfall 2: Union Parameters Hide Specific Types
```ts
// ❌ Loses type specificity
function handle(value: string | number): string | number {
  if (typeof value === "string") {
    return value.toUpperCase(); // Type is still string | number
  }
  return value * 2;
}

// ✅ Better with overloads
function handle(value: string): string;
function handle(value: number): number;
function handle(value: string | number): string | number {
  if (typeof value === "string") {
    return value.toUpperCase(); // Type is string
  }
  return value * 2; // Type is number
}
```

### Pitfall 3: Implementation Signature Too Broad
```ts
// ❌ Implementation too permissive
function create(input: any): any {
  return input;
}

// ✅ More specific implementation
function create(input: string | number): string | number {
  return input;
}
```

### Pitfall 4: Overload Order Matters
```ts
// ❌ Wrong order - more specific should come first
function process(input: string | number): string | number;
function process(input: string): string; // This will never be reached!

// ✅ Correct order - most specific first
function process(input: string): string;
function process(input: number): number;
function process(input: string | number): string | number;
```

### Best Practices to Avoid Pitfalls
```ts
// ✅ Clear, non-overlapping overloads
function format(value: string): string;
function format(value: number): string;
function format(value: Date): string;
function format(value: string | number | Date): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  return value.toISOString();
}

// ✅ Use type guards for complex logic
function isString(value: any): value is string {
  return typeof value === "string";
}

function process(value: string | number): string {
  if (isString(value)) {
    return value.toUpperCase(); // Type narrowed to string
  }
  return value.toString(); // Type narrowed to number
}
```

---

## 4. How to expose string vs object param styles with overloads (builder APIs)?

**Answer:**

Overloads are perfect for **builder APIs** that support both string-based and object-based parameter styles. This provides flexibility and better developer experience.

### Basic Builder Pattern
```ts
class QueryBuilder {
  // String-based API
  where(condition: string): QueryBuilder;
  // Object-based API  
  where(condition: Record<string, any>): QueryBuilder;
  // Implementation
  where(condition: string | Record<string, any>): QueryBuilder {
    if (typeof condition === "string") {
      this.addStringCondition(condition);
    } else {
      this.addObjectCondition(condition);
    }
    return this;
  }
  
  private addStringCondition(condition: string): void {
    // Handle string conditions
  }
  
  private addObjectCondition(condition: Record<string, any>): void {
    // Handle object conditions
  }
}

// Usage
const query1 = new QueryBuilder()
  .where("age > 18")
  .where("name = 'John'");

const query2 = new QueryBuilder()
  .where({ age: { $gt: 18 } })
  .where({ name: "John" });
```

### Advanced Builder with Multiple Styles
```ts
class DatabaseQuery {
  // String SQL
  select(fields: string): DatabaseQuery;
  // Array of fields
  select(fields: string[]): DatabaseQuery;
  // Object with options
  select(options: { fields: string[]; distinct?: boolean }): DatabaseQuery;
  
  // Implementation
  select(fields: string | string[] | { fields: string[]; distinct?: boolean }): DatabaseQuery {
    if (typeof fields === "string") {
      this.addField(fields);
    } else if (Array.isArray(fields)) {
      fields.forEach(field => this.addField(field));
    } else {
      fields.fields.forEach(field => this.addField(field));
      if (fields.distinct) this.setDistinct();
    }
    return this;
  }
  
  private addField(field: string): void { /* implementation */ }
  private setDistinct(): void { /* implementation */ }
}

// Usage examples
const query1 = new DatabaseQuery().select("name, age");
const query2 = new DatabaseQuery().select(["name", "age"]);
const query3 = new DatabaseQuery().select({ 
  fields: ["name", "age"], 
  distinct: true 
});
```

### Configuration Object Pattern
```ts
class ApiClient {
  // String URL
  get(url: string): Promise<any>;
  // Object with options
  get(options: { url: string; headers?: Record<string, string> }): Promise<any>;
  
  // Implementation
  get(urlOrOptions: string | { url: string; headers?: Record<string, string> }): Promise<any> {
    if (typeof urlOrOptions === "string") {
      return this.makeRequest(urlOrOptions, {});
    } else {
      return this.makeRequest(urlOrOptions.url, urlOrOptions.headers || {});
    }
  }
  
  private makeRequest(url: string, headers: Record<string, string>): Promise<any> {
    // Implementation
  }
}

// Usage
const client = new ApiClient();
client.get("https://api.example.com/users");
client.get({ 
  url: "https://api.example.com/users", 
  headers: { "Authorization": "Bearer token" } 
});
```

### React Component Props Pattern
```ts
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

// String-based props
function Button(props: ButtonProps & { variant: string }): JSX.Element;
// Object-based props
function Button(props: ButtonProps & { variant: { type: string; size: string } }): JSX.Element;
// Implementation
function Button(props: ButtonProps & { 
  variant: string | { type: string; size: string } 
}): JSX.Element {
  const variantClass = typeof props.variant === "string" 
    ? props.variant 
    : `${props.variant.type}-${props.variant.size}`;
    
  return <button className={variantClass} onClick={props.onClick}>
    {props.children}
  </button>;
}

// Usage
<Button variant="primary">Click me</Button>
<Button variant={{ type: "primary", size: "large" }}>Click me</Button>
```

---

## 5. Can you overload constructors and what are the constraints?

**Answer:**

**Yes, you can overload constructors**, but there are important constraints and patterns to follow.

### Basic Constructor Overloads
```ts
class User {
  name: string;
  age: number;
  email: string;
  
  // Overload 1: Name and age only
  constructor(name: string, age: number);
  // Overload 2: All parameters
  constructor(name: string, age: number, email: string);
  // Implementation
  constructor(name: string, age: number, email?: string) {
    this.name = name;
    this.age = age;
    this.email = email ?? "";
  }
}

// Usage
const user1 = new User("John", 25);
const user2 = new User("Jane", 30, "jane@example.com");
```

### Advanced Constructor Patterns
```ts
class DatabaseConnection {
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  
  // String connection string
  constructor(connectionString: string);
  // Object configuration
  constructor(config: { host: string; port: number; database: string; username?: string; password?: string });
  // Individual parameters
  constructor(host: string, port: number, database: string, username?: string, password?: string);
  
  // Implementation
  constructor(
    hostOrConfigOrString: string | { host: string; port: number; database: string; username?: string; password?: string },
    port?: number,
    database?: string,
    username?: string,
    password?: string
  ) {
    if (typeof hostOrConfigOrString === "string") {
      if (port === undefined) {
        // Connection string format: "host:port/database"
        const [hostPart, dbPart] = hostOrConfigOrString.split("/");
        const [host, portStr] = hostPart.split(":");
        this.host = host;
        this.port = parseInt(portStr);
        this.database = dbPart;
      } else {
        // Individual parameters
        this.host = hostOrConfigOrString;
        this.port = port;
        this.database = database!;
        this.username = username;
        this.password = password;
      }
    } else {
      // Object configuration
      this.host = hostOrConfigOrString.host;
      this.port = hostOrConfigOrString.port;
      this.database = hostOrConfigOrString.database;
      this.username = hostOrConfigOrString.username;
      this.password = hostOrConfigOrString.password;
    }
  }
}

// Usage
const conn1 = new DatabaseConnection("localhost:5432/mydb");
const conn2 = new DatabaseConnection("localhost", 5432, "mydb", "user", "pass");
const conn3 = new DatabaseConnection({ 
  host: "localhost", 
  port: 5432, 
  database: "mydb" 
});
```

### Key Constraints and Rules

1. **Implementation must be compatible**: The implementation constructor must handle all overload cases
2. **No return type annotation**: Constructors don't have explicit return types
3. **Parameter compatibility**: All overload parameters must be assignable to implementation parameters
4. **Same parameter count**: All overloads must have the same number of parameters (optional parameters allowed)

### ❌ Common Mistakes
```ts
class BadExample {
  // ❌ Error: Different parameter counts
  constructor(name: string);
  constructor(name: string, age: number, email: string);
  
  // ❌ Error: Implementation incompatible
  constructor(name: string, age?: number) {
    // Missing email parameter handling
  }
}
```

### ✅ Correct Pattern
```ts
class GoodExample {
  name: string;
  age: number;
  email: string;
  
  // All overloads have same parameter count (using optional parameters)
  constructor(name: string);
  constructor(name: string, age: number);
  constructor(name: string, age: number, email: string);
  
  // Implementation handles all cases
  constructor(name: string, age?: number, email?: string) {
    this.name = name;
    this.age = age ?? 0;
    this.email = email ?? "";
  }
}
```

### Factory Pattern Alternative
```ts
class User {
  private constructor(
    public name: string,
    public age: number,
    public email: string
  ) {}
  
  // Static factory methods instead of constructor overloads
  static fromNameAndAge(name: string, age: number): User {
    return new User(name, age, "");
  }
  
  static fromObject(data: { name: string; age: number; email: string }): User {
    return new User(data.name, data.age, data.email);
  }
  
  static fromString(userString: string): User {
    const [name, age, email] = userString.split(",");
    return new User(name, parseInt(age), email);
  }
}

// Usage
const user1 = User.fromNameAndAge("John", 25);
const user2 = User.fromObject({ name: "Jane", age: 30, email: "jane@example.com" });
const user3 = User.fromString("Bob,35,bob@example.com");
```

**Best Practice**: Use constructor overloads for simple cases, but consider static factory methods for complex initialization logic.


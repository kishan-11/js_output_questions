## Interview questions: Index signatures

### 1. When should you use an index signature vs `Record<K, T>`?

**Answer:**

Use **index signatures** when:
- You need to define the shape within an interface or type alias
- You want to mix known properties with dynamic keys
- You need more control over the object structure

```ts
interface Config {
  [key: string]: string | number;
  apiUrl: string; // Known property
  timeout: number; // Known property
}
```

Use **`Record<K, T>`** when:
- You want a simple, clean type for homogeneous key-value pairs
- You don't need to mix with known properties
- You want a more concise syntax

```ts
type ErrorMessages = Record<string, string>;
// Equivalent to: { [key: string]: string }

type StatusMap = Record<'pending' | 'success' | 'error', string>;
```

**Key differences:**
- `Record<K, T>` is a utility type, index signatures are part of interface/type definitions
- Index signatures allow mixing with known properties
- `Record<K, T>` is more explicit about the key type constraints

---

### 2. How do `noUncheckedIndexedAccess` and exact optional property types affect safety?

**Answer:**

**`noUncheckedIndexedAccess`** (TypeScript 4.1+):
- Makes index signature access return `T | undefined` instead of just `T`
- Prevents runtime errors from accessing non-existent keys
- Requires null checks before using values

```ts
// Without noUncheckedIndexedAccess
interface Dict {
  [key: string]: string;
}
const dict: Dict = { a: "hello" };
const value = dict.b; // string (unsafe!)

// With noUncheckedIndexedAccess
const value = dict.b; // string | undefined (safe!)
if (value) {
  console.log(value.toUpperCase()); // Safe to use
}
```

**Exact optional property types:**
- Makes all properties in an index signature optional by default
- Prevents accidental property access without checking existence
- Encourages defensive programming

```ts
interface Config {
  [key: string]: string | undefined;
}

const config: Config = {};
const value = config.someKey; // string | undefined
// Must check before use
```

**Safety benefits:**
- Prevents `undefined` runtime errors
- Forces explicit null/undefined checks
- Makes code more robust and predictable

---

### 3. How do you model heterogeneous dictionaries (value unions) safely?

**Answer:**

**Option 1: Union value types**
```ts
interface MixedDict {
  [key: string]: string | number | boolean;
}

const data: MixedDict = {
  name: "John",      // string
  age: 30,           // number
  active: true       // boolean
};
```

**Option 2: Discriminated unions for type safety**
```ts
type ConfigValue = 
  | { type: 'string'; value: string }
  | { type: 'number'; value: number }
  | { type: 'boolean'; value: boolean };

interface TypedConfig {
  [key: string]: ConfigValue;
}

const config: TypedConfig = {
  apiUrl: { type: 'string', value: 'https://api.com' },
  timeout: { type: 'number', value: 5000 }
};
```

**Option 3: Generic constraints**
```ts
interface FlexibleDict<T extends string | number | boolean> {
  [key: string]: T;
}

const stringDict: FlexibleDict<string> = { a: "hello" };
const numberDict: FlexibleDict<number> = { b: 42 };
```

**Option 4: Type guards for runtime safety**
```ts
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(key: string, value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // Safe
  }
}
```

---

### 4. How to narrow values from an index signature before use?

**Answer:**

**Type guards:**
```ts
interface Data {
  [key: string]: unknown;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

const data: Data = { name: "John", age: 30 };

// Safe narrowing
if (isString(data.name)) {
  console.log(data.name.toUpperCase()); // Safe
}

if (isNumber(data.age)) {
  console.log(data.age.toFixed(2)); // Safe
}
```

**Discriminated unions:**
```ts
type ApiResponse = 
  | { status: 'success'; data: any }
  | { status: 'error'; message: string };

interface Responses {
  [endpoint: string]: ApiResponse;
}

function handleResponse(response: ApiResponse) {
  if (response.status === 'success') {
    console.log(response.data); // Narrowed to success case
  } else {
    console.log(response.message); // Narrowed to error case
  }
}
```

**Optional chaining with type assertions:**
```ts
interface Config {
  [key: string]: string | number | undefined;
}

const config: Config = { apiUrl: "https://api.com" };

// Safe access with fallback
const timeout = config.timeout ?? 5000; // number
const url = config.apiUrl?.toUpperCase(); // string | undefined
```

**Runtime validation:**
```ts
function validateConfig(config: Record<string, unknown>) {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(config)) {
    if (typeof value === 'string') {
      result[key] = value;
    } else {
      throw new Error(`Invalid config for ${key}: expected string`);
    }
  }
  
  return result;
}
```

---

### 5. What are pitfalls of overly broad `[key: string]: any` and how to fix?

**Answer:**

**Pitfalls of `[key: string]: any`:**

1. **Loss of type safety:**
```ts
interface BadConfig {
  [key: string]: any; // Too broad!
}

const config: BadConfig = { apiUrl: "https://api.com" };
config.apiUrl.toUpperCase(); // No error, but could be undefined!
```

2. **No IntelliSense/autocomplete:**
```ts
const config: BadConfig = {};
config. // No suggestions, no type checking
```

3. **Runtime errors:**
```ts
const config: BadConfig = { timeout: "5000" };
const timeout = config.timeout * 2; // Runtime error: "5000" * 2 = NaN
```

**How to fix:**

**Option 1: Use specific union types**
```ts
interface BetterConfig {
  [key: string]: string | number | boolean;
}

const config: BetterConfig = { 
  apiUrl: "https://api.com",
  timeout: 5000,
  debug: true
};
```

**Option 2: Use `unknown` and type guards**
```ts
interface SafeConfig {
  [key: string]: unknown;
}

function getString(config: SafeConfig, key: string): string {
  const value = config[key];
  if (typeof value === 'string') {
    return value;
  }
  throw new Error(`Expected string for ${key}`);
}
```

**Option 3: Use generic constraints**
```ts
interface TypedConfig<T extends string | number | boolean> {
  [key: string]: T;
}

const stringConfig: TypedConfig<string> = { apiUrl: "https://api.com" };
const numberConfig: TypedConfig<number> = { timeout: 5000 };
```

**Option 4: Use mapped types for specific keys**
```ts
type ConfigKeys = 'apiUrl' | 'timeout' | 'debug';
type TypedConfig = {
  [K in ConfigKeys]: K extends 'apiUrl' ? string :
                    K extends 'timeout' ? number :
                    K extends 'debug' ? boolean : never;
};
```

**Option 5: Use branded types for extra safety**
```ts
type ConfigKey = string & { __brand: 'ConfigKey' };
interface BrandedConfig {
  [key: ConfigKey]: string | number | boolean;
}

function createConfigKey(key: string): ConfigKey {
  return key as ConfigKey;
}
```

**Best practices:**
- Avoid `any` in index signatures
- Use `unknown` with proper type guards
- Prefer specific union types over `any`
- Use generic constraints when possible
- Consider using `Record<K, V>` for homogeneous data


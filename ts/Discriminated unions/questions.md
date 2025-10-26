# Interview Questions: Discriminated Unions

## 1. Model async state (`idle` | `loading` | `success` | `error`) and write an exhaustive handler.

### Answer:

```ts
// Define the discriminated union for async state
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// Exhaustive handler with proper type narrowing
function handleAsyncState<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case 'idle':
      return 'Ready to start';
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Success: ${JSON.stringify(state.data)}`;
    case 'error':
      return `Error: ${state.error}`;
    default:
      // This ensures exhaustive checking - TypeScript will error if we miss a case
      const _exhaustive: never = state;
      return _exhaustive;
  }
}

// Usage examples
const idleState: AsyncState<User> = { status: 'idle' };
const loadingState: AsyncState<User> = { status: 'loading' };
const successState: AsyncState<User> = { 
  status: 'success', 
  data: { id: 1, name: 'John' } 
};
const errorState: AsyncState<User> = { 
  status: 'error', 
  error: 'Network timeout' 
};

console.log(handleAsyncState(idleState));    // "Ready to start"
console.log(handleAsyncState(loadingState)); // "Loading..."
console.log(handleAsyncState(successState)); // "Success: {"id":1,"name":"John"}"
console.log(handleAsyncState(errorState));   // "Error: Network timeout"
```

## 2. How do you migrate from boolean flags to discriminated unions? Show benefits.

### Answer:

### Before (Boolean Flags - Problematic):
```ts
interface UserState {
  isLoading: boolean;
  data?: User;
  error?: string;
  isRetrying?: boolean;
}

function renderUser(state: UserState) {
  // Problem: Multiple boolean flags can create impossible states
  if (state.isLoading && state.data) {
    // This shouldn't be possible but TypeScript allows it
  }
  
  if (state.error && state.data) {
    // Should we show error or data? Ambiguous!
  }
  
  if (state.isRetrying && !state.isLoading) {
    // Inconsistent state
  }
}
```

### After (Discriminated Union - Type Safe):
```ts
type UserState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'retrying'; error: string }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string };

function renderUser(state: UserState) {
  switch (state.status) {
    case 'idle':
      return <Button onClick={loadUser}>Load User</Button>;
    case 'loading':
      return <Spinner />;
    case 'retrying':
      return (
        <div>
          <ErrorMessage error={state.error} />
          <Button onClick={retry}>Retry</Button>
        </div>
      );
    case 'success':
      return <UserProfile user={state.data} />;
    case 'error':
      return <ErrorMessage error={state.error} />;
    default:
      const _exhaustive: never = state;
      return _exhaustive;
  }
}
```

### Benefits:
1. **Impossible states prevented**: Can't have both `data` and `error` simultaneously
2. **Exhaustive checking**: TypeScript ensures all cases are handled
3. **Clear intent**: Status is explicit and unambiguous
4. **Better refactoring**: Adding new states requires updating all handlers
5. **Improved IntelliSense**: IDE provides accurate autocomplete

## 3. How do you safely add a new variant without breaking callers? Tooling tips.

### Answer:

### Step-by-Step Migration Process:

```ts
// 1. Original union
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// 2. Add new variant (TypeScript will show errors in existing code)
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }
  | { success: false; error: string; retryable: boolean }; // New variant

// 3. Update all handlers to be exhaustive
function handleApiResponse<T>(response: ApiResponse<T>) {
  if (response.success) {
    return `Data: ${response.data}`;
  } else {
    // TypeScript will error here until we handle the new variant
    if (response.retryable) {
      return `Retryable error: ${response.error}`;
    } else {
      return `Fatal error: ${response.error}`;
    }
  }
}
```

### Tooling Tips:

#### 1. Use TypeScript's `--strict` mode:
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### 2. Use ESLint rules:
```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error"
  }
}
```

#### 3. Gradual migration strategy:
```ts
// Phase 1: Add new variant as optional
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; retryable?: boolean };

// Phase 2: Make it required and update all callers
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; retryable: boolean };
```

#### 4. Use exhaustive checking helper:
```ts
function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}

function handleResponse<T>(response: ApiResponse<T>) {
  if (response.success) {
    return response.data;
  } else {
    // TypeScript ensures this is exhaustive
    switch (response.retryable) {
      case true:
        return `Retryable: ${response.error}`;
      case false:
        return `Fatal: ${response.error}`;
      default:
        return assertNever(response);
    }
  }
}
```

## 4. Compare discriminants with compound narrowing via guards; pros/cons.

### Answer:

### Discriminated Unions vs Type Guards

#### Discriminated Unions:
```ts
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius * shape.radius;
    case 'rectangle':
      return shape.width * shape.height;
    default:
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

#### Type Guards:
```ts
interface Circle {
  radius: number;
}

interface Rectangle {
  width: number;
  height: number;
}

type Shape = Circle | Rectangle;

function isCircle(shape: Shape): shape is Circle {
  return 'radius' in shape;
}

function isRectangle(shape: Shape): shape is Rectangle {
  return 'width' in shape && 'height' in shape;
}

function area(shape: Shape): number {
  if (isCircle(shape)) {
    return Math.PI * shape.radius * shape.radius;
  } else if (isRectangle(shape)) {
    return shape.width * shape.height;
  } else {
    // TypeScript can't guarantee exhaustiveness here
    throw new Error('Unknown shape');
  }
}
```

### Comparison:

| Aspect | Discriminated Unions | Type Guards |
|--------|---------------------|-------------|
| **Exhaustiveness** | ✅ Compile-time guarantee | ❌ Runtime errors possible |
| **Performance** | ✅ No runtime overhead | ❌ Function call overhead |
| **Maintainability** | ✅ Adding variants breaks compilation | ❌ Easy to forget updating guards |
| **Flexibility** | ❌ Requires discriminant field | ✅ Can use any property |
| **Serialization** | ✅ Easy to serialize/deserialize | ❌ Complex with custom logic |
| **Refactoring** | ✅ TypeScript forces updates | ❌ Manual updates required |

### When to Use Each:

#### Use Discriminated Unions when:
- You control the data structure
- Exhaustiveness is critical
- Performance matters
- You need serialization
- The discriminant is meaningful

#### Use Type Guards when:
- Working with external APIs
- Complex narrowing logic needed
- Legacy code migration
- Property-based discrimination isn't feasible

## 5. How to serialize/deserialize discriminated unions in APIs.

### Answer:

### Serialization (TypeScript → JSON):

```ts
type ApiResponse<T> =
  | { success: true; data: T; timestamp: number }
  | { success: false; error: string; code: number };

// Simple serialization
function serializeResponse<T>(response: ApiResponse<T>): string {
  return JSON.stringify(response);
}

// Advanced serialization with custom data handling
function serializeResponseWithTransform<T>(
  response: ApiResponse<T>,
  dataTransform?: (data: T) => unknown
): string {
  if (response.success) {
    const serializedData = dataTransform 
      ? dataTransform(response.data)
      : response.data;
    
    return JSON.stringify({
      success: true,
      data: serializedData,
      timestamp: response.timestamp
    });
  } else {
    return JSON.stringify({
      success: false,
      error: response.error,
      code: response.code
    });
  }
}
```

### Deserialization (JSON → TypeScript):

```ts
// Basic deserialization with validation
function deserializeResponse<T>(
  json: string,
  dataValidator?: (data: unknown) => T
): ApiResponse<T> | null {
  try {
    const parsed = JSON.parse(json);
    
    // Validate discriminant
    if (typeof parsed.success !== 'boolean') {
      return null;
    }
    
    if (parsed.success) {
      // Validate success response
      if (typeof parsed.timestamp !== 'number') {
        return null;
      }
      
      if (dataValidator && !dataValidator(parsed.data)) {
        return null;
      }
      
      return {
        success: true,
        data: parsed.data as T,
        timestamp: parsed.timestamp
      };
    } else {
      // Validate error response
      if (typeof parsed.error !== 'string' || typeof parsed.code !== 'number') {
        return null;
      }
      
      return {
        success: false,
        error: parsed.error,
        code: parsed.code
      };
    }
  } catch {
    return null;
  }
}
```

### Advanced Pattern with Zod Validation:

```ts
import { z } from 'zod';

// Define schemas
const SuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.unknown(),
  timestamp: z.number()
});

const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.number()
});

const ApiResponseSchema = z.union([SuccessResponseSchema, ErrorResponseSchema]);

// Type-safe deserialization
function deserializeWithZod<T>(
  json: string,
  dataSchema: z.ZodSchema<T>
): ApiResponse<T> | null {
  try {
    const parsed = JSON.parse(json);
    const validated = ApiResponseSchema.parse(parsed);
    
    if (validated.success) {
      const data = dataSchema.parse(validated.data);
      return {
        success: true,
        data,
        timestamp: validated.timestamp
      };
    } else {
      return {
        success: false,
        error: validated.error,
        code: validated.code
      };
    }
  } catch {
    return null;
  }
}
```

### Real-world API Integration:

```ts
// API client with discriminated unions
class ApiClient {
  async fetchUser(id: number): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`/api/users/${id}`);
      const json = await response.text();
      
      if (response.ok) {
        const user = JSON.parse(json);
        return {
          success: true,
          data: user,
          timestamp: Date.now()
        };
      } else {
        const error = JSON.parse(json);
        return {
          success: false,
          error: error.message || 'Unknown error',
          code: response.status
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        code: 0
      };
    }
  }
}

// Usage
const client = new ApiClient();
const result = await client.fetchUser(123);

if (result.success) {
  console.log('User:', result.data);
  console.log('Fetched at:', new Date(result.timestamp));
} else {
  console.error('Error:', result.error, 'Code:', result.code);
}
```

### Best Practices:

1. **Always validate discriminants first**
2. **Use schema validation libraries** (Zod, io-ts, etc.)
3. **Handle deserialization errors gracefully**
4. **Consider versioning** for API evolution
5. **Use branded types** for additional safety
6. **Test serialization round-trips**


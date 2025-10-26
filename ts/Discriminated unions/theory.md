# Discriminated Unions

## What are Discriminated Unions?

Discriminated unions (also called tagged unions or algebraic data types) are union types that share a common literal property called a "discriminant" or "tag". This discriminant allows TypeScript to safely narrow the type within each branch of a switch statement or conditional.

## Key Concepts

### 1. Common Discriminant Field
All variants must share a field with literal values that uniquely identify each variant:
```ts
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number };
```

### 2. Exhaustive Pattern Matching
Use switch statements with `never` type to ensure all cases are handled:
```ts
function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius * shape.radius;
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return (shape.base * shape.height) / 2;
    default:
      // This ensures exhaustive checking
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

## Advanced Patterns

### 1. Async State Management
```ts
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function handleAsyncState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'idle':
      return 'Ready to load';
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Data: ${state.data}`;
    case 'error':
      return `Error: ${state.error}`;
    default:
      const _exhaustive: never = state;
      return _exhaustive;
  }
}
```

### 2. API Response Types
```ts
type ApiResponse<T> =
  | { success: true; data: T; timestamp: number }
  | { success: false; error: string; code: number };

function handleApiResponse<T>(response: ApiResponse<T>) {
  if (response.success) {
    // TypeScript knows this is the success variant
    console.log(response.data, response.timestamp);
  } else {
    // TypeScript knows this is the error variant
    console.error(response.error, response.code);
  }
}
```

### 3. Recursive Discriminated Unions
```ts
type JsonValue =
  | { type: 'string'; value: string }
  | { type: 'number'; value: number }
  | { type: 'boolean'; value: boolean }
  | { type: 'null'; value: null }
  | { type: 'array'; value: JsonValue[] }
  | { type: 'object'; value: Record<string, JsonValue> };

function stringifyJson(json: JsonValue): string {
  switch (json.type) {
    case 'string':
      return `"${json.value}"`;
    case 'number':
    case 'boolean':
      return String(json.value);
    case 'null':
      return 'null';
    case 'array':
      return `[${json.value.map(stringifyJson).join(',')}]`;
    case 'object':
      const pairs = Object.entries(json.value)
        .map(([key, value]) => `"${key}":${stringifyJson(value)}`);
      return `{${pairs.join(',')}}`;
    default:
      const _exhaustive: never = json;
      return _exhaustive;
  }
}
```

### 4. Generic Discriminated Unions
```ts
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

type Optional<T> =
  | { present: true; value: T }
  | { present: false };

function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (result.success) {
    return { success: true, data: fn(result.data) };
  } else {
    return result; // Error case unchanged
  }
}
```

## Migration from Boolean Flags

### Before (Boolean Flags)
```ts
interface UserState {
  isLoading: boolean;
  data?: User;
  error?: string;
}

function renderUser(state: UserState) {
  if (state.isLoading) {
    return <Spinner />;
  }
  
  if (state.error) {
    return <ErrorMessage error={state.error} />;
  }
  
  if (state.data) {
    return <UserProfile user={state.data} />;
  }
  
  // What if both data and error exist? Ambiguous state!
}
```

### After (Discriminated Union)
```ts
type UserState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string };

function renderUser(state: UserState) {
  switch (state.status) {
    case 'idle':
      return <Button onClick={loadUser}>Load User</Button>;
    case 'loading':
      return <Spinner />;
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

## Benefits

1. **Type Safety**: Impossible states are prevented at compile time
2. **Exhaustive Checking**: TypeScript ensures all cases are handled
3. **Clear Intent**: The discriminant makes the current state explicit
4. **Refactoring Safety**: Adding new variants requires updating all handlers
5. **Better IntelliSense**: IDE can provide accurate autocomplete

## Best Practices

1. **Use descriptive discriminant names**: `status`, `kind`, `type`, `state`
2. **Keep discriminants simple**: Use string literals, not complex expressions
3. **Make discriminants required**: Don't make them optional
4. **Use exhaustive checking**: Always include the `never` default case
5. **Consider serialization**: Ensure your unions can be serialized/deserialized

## Serialization/Deserialization

```ts
// Serialization
function serializeAsyncState<T>(state: AsyncState<T>): string {
  return JSON.stringify(state);
}

// Deserialization with validation
function deserializeAsyncState<T>(
  json: string,
  dataParser?: (data: unknown) => T
): AsyncState<T> | null {
  try {
    const parsed = JSON.parse(json);
    
    // Validate the discriminant
    if (!parsed.status || typeof parsed.status !== 'string') {
      return null;
    }
    
    // Validate based on status
    switch (parsed.status) {
      case 'idle':
      case 'loading':
        return parsed;
      case 'success':
        if (!dataParser || !parsed.data) return null;
        return { status: 'success', data: dataParser(parsed.data) };
      case 'error':
        if (typeof parsed.error !== 'string') return null;
        return parsed;
      default:
        return null;
    }
  } catch {
    return null;
  }
}
```

## Common Interview Questions

- Design a discriminated union for async states (idle/loading/success/error)
- How do you migrate from boolean flags to discriminated unions?
- How do you safely add new variants without breaking existing code?
- Compare discriminated unions with type guards and compound narrowing
- How to handle serialization/deserialization of discriminated unions



# Exhaustive Checks with never

## Overview

Exhaustive checks with the `never` type are a powerful TypeScript pattern that ensures all possible cases in a union type are handled. This prevents runtime errors and provides compile-time safety when working with discriminated unions, state machines, and command patterns.

## The never Type

The `never` type represents values that never occur. It's the bottom type in TypeScript's type system and can be assigned to any other type, but no type can be assigned to `never` (except `never` itself).

## Basic Pattern

```ts
function assertNever(x: never): never { 
  throw new Error(`Unexpected value: ${String(x)}`) 
}

// Usage in switch statements
function handleAction(action: Action) {
  switch (action.type) {
    case 'LOGIN':
      // handle login
      break;
    case 'LOGOUT':
      // handle logout
      break;
    default:
      assertNever(action); // Compile-time error if union not exhausted
  }
}
```

## How It Works

1. **Compile-time Safety**: When you use `assertNever()` in the default case, TypeScript checks if the parameter can be assigned to `never`
2. **Union Exhaustion**: If all cases of a union are handled, the remaining type in the default case is `never`
3. **Error Prevention**: If a case is missing, TypeScript will show a compile-time error

## Advanced Patterns

### 1. Discriminated Unions
```ts
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: string }
  | { status: 'error'; error: string }

function handleState(state: LoadingState) {
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
      assertNever(state); // Ensures all cases handled
  }
}
```

### 2. Command Pattern
```ts
type Command = 
  | { type: 'CREATE'; payload: { name: string } }
  | { type: 'UPDATE'; payload: { id: string; data: any } }
  | { type: 'DELETE'; payload: { id: string } }

function executeCommand(cmd: Command) {
  switch (cmd.type) {
    case 'CREATE':
      return createItem(cmd.payload);
    case 'UPDATE':
      return updateItem(cmd.payload);
    case 'DELETE':
      return deleteItem(cmd.payload);
    default:
      assertNever(cmd);
  }
}
```

### 3. State Machine
```ts
type State = 
  | { current: 'idle' }
  | { current: 'processing'; progress: number }
  | { current: 'completed'; result: any }
  | { current: 'failed'; error: string }

function processState(state: State) {
  switch (state.current) {
    case 'idle':
      return 'Waiting to start';
    case 'processing':
      return `Progress: ${state.progress}%`;
    case 'completed':
      return `Result: ${state.result}`;
    case 'failed':
      return `Failed: ${state.error}`;
    default:
      assertNever(state);
  }
}
```

## Alternative Patterns

### 1. Object-based Dispatch
```ts
const handlers = {
  LOGIN: (action: LoginAction) => { /* handle login */ },
  LOGOUT: (action: LogoutAction) => { /* handle logout */ },
} as const;

function handleAction(action: Action) {
  const handler = handlers[action.type];
  if (!handler) {
    assertNever(action);
  }
  return handler(action);
}
```

### 2. Map-based Dispatch
```ts
const actionMap = new Map([
  ['LOGIN', (action: LoginAction) => { /* handle login */ }],
  ['LOGOUT', (action: LogoutAction) => { /* handle logout */ }],
]);

function handleAction(action: Action) {
  const handler = actionMap.get(action.type);
  if (!handler) {
    assertNever(action);
  }
  return handler(action);
}
```

## Common Issues and Solutions

### 1. Union Widening
```ts
// Problem: Union widens and loses exhaustiveness
const actions = ['LOGIN', 'LOGOUT'] as const;
type ActionType = typeof actions[number]; // 'LOGIN' | 'LOGOUT'

// Solution: Use const assertions
const actions = ['LOGIN', 'LOGOUT'] as const;
type ActionType = typeof actions[number];
```

### 2. Dynamic Union Types
```ts
// Problem: Runtime union that TypeScript can't track
function handleDynamicUnion(value: string | number | boolean) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  } else if (typeof value === 'number') {
    return value * 2;
  } else {
    assertNever(value); // Error: boolean not handled
  }
}
```

### 3. Generic Constraints
```ts
function exhaustiveCheck<T extends string>(value: T): T {
  switch (value) {
    case 'A':
    case 'B':
    case 'C':
      return value;
    default:
      assertNever(value); // May not work with generics
  }
}
```

## Best Practices

1. **Always use `assertNever` in default cases** of switch statements with unions
2. **Prefer discriminated unions** over string literals for better type safety
3. **Use const assertions** to prevent union widening
4. **Consider alternative patterns** like object dispatch for complex scenarios
5. **Test exhaustiveness** by temporarily removing cases to ensure compile errors

## Runtime vs Compile-time

- **Compile-time**: TypeScript ensures all cases are handled
- **Runtime**: `assertNever` throws an error if an unexpected value is encountered
- **Best of both**: Get compile-time safety with runtime error handling for edge cases

## Use Cases

- **Redux reducers**: Ensure all action types are handled
- **State machines**: Verify all states are processed
- **Command patterns**: Handle all command types
- **API responses**: Process all possible response types
- **Event handlers**: Handle all event types



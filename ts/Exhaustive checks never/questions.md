# Interview Questions: Exhaustive Checks with never

## 1. Show the `assertNever` pattern and explain how it prevents missing cases.

### Answer:

The `assertNever` pattern is a TypeScript technique that ensures all cases in a union type are handled at compile time.

```ts
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${String(x)}`);
}

// Example with discriminated union
type Action = 
  | { type: 'LOGIN'; payload: { username: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: { name: string } };

function handleAction(action: Action) {
  switch (action.type) {
    case 'LOGIN':
      console.log(`Logging in: ${action.payload.username}`);
      break;
    case 'LOGOUT':
      console.log('Logging out');
      break;
    case 'UPDATE_PROFILE':
      console.log(`Updating profile: ${action.payload.name}`);
      break;
    default:
      assertNever(action); // Compile-time error if union not exhausted
  }
}
```

**How it prevents missing cases:**
1. **Type Safety**: TypeScript checks if the parameter can be assigned to `never`
2. **Union Exhaustion**: If all cases are handled, the remaining type is `never`
3. **Compile-time Errors**: Missing cases cause TypeScript compilation errors
4. **Runtime Safety**: Unexpected values throw descriptive errors

**Example of missing case:**
```ts
// If we remove the 'UPDATE_PROFILE' case:
function handleAction(action: Action) {
  switch (action.type) {
    case 'LOGIN':
      // handle login
      break;
    case 'LOGOUT':
      // handle logout
      break;
    // Missing UPDATE_PROFILE case
    default:
      assertNever(action); // ERROR: Argument of type 'UPDATE_PROFILE' is not assignable to parameter of type 'never'
  }
}
```

---

## 2. Why might exhaustive checks fail when unions widen? How to fix?

### Answer:

Union widening occurs when TypeScript infers a broader type than intended, breaking exhaustive checks.

### Common Causes:

**1. Array Inference:**
```ts
// Problem: Union widens to string[]
const actions = ['LOGIN', 'LOGOUT']; // Type: string[]
type ActionType = typeof actions[number]; // string (not 'LOGIN' | 'LOGOUT')

// Solution: Use const assertion
const actions = ['LOGIN', 'LOGOUT'] as const; // Type: readonly ['LOGIN', 'LOGOUT']
type ActionType = typeof actions[number]; // 'LOGIN' | 'LOGOUT'
```

**2. Object Properties:**
```ts
// Problem: Properties widen to string
const config = {
  theme: 'dark',
  mode: 'production'
}; // theme: string, mode: string

// Solution: Use const assertion
const config = {
  theme: 'dark',
  mode: 'production'
} as const; // theme: 'dark', mode: 'production'
```

**3. Function Parameters:**
```ts
// Problem: Parameter widens
function handleAction(action: 'LOGIN' | 'LOGOUT') {
  switch (action) {
    case 'LOGIN':
      break;
    case 'LOGOUT':
      break;
    default:
      assertNever(action); // Works here
  }
}

// But if called with widened type:
const action = 'LOGIN'; // Type: string
handleAction(action); // Error: string not assignable to 'LOGIN' | 'LOGOUT'
```

### Solutions:

**1. Const Assertions:**
```ts
const actions = ['LOGIN', 'LOGOUT'] as const;
type ActionType = typeof actions[number]; // 'LOGIN' | 'LOGOUT'
```

**2. Explicit Typing:**
```ts
const actions: readonly ['LOGIN', 'LOGOUT'] = ['LOGIN', 'LOGOUT'];
```

**3. Generic Constraints:**
```ts
function createAction<T extends string>(action: T): T {
  return action;
}

const action = createAction('LOGIN'); // Type: 'LOGIN'
```

**4. Discriminated Unions:**
```ts
type Action = 
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' };

function handleAction(action: Action) {
  switch (action.type) {
    case 'LOGIN':
      break;
    case 'LOGOUT':
      break;
    default:
      assertNever(action);
  }
}
```

---

## 3. How do you ensure exhaustive checks in reducers or command handlers?

### Answer:

Exhaustive checks in reducers and command handlers ensure all possible actions/commands are handled.

### Redux Reducers:

```ts
type State = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

type Action = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

function authReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        user: action.payload, 
        loading: false, 
        error: null 
      };
    
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
    
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        loading: false, 
        error: null 
      };
    
    default:
      assertNever(action); // Ensures all actions handled
  }
}
```

### Command Handlers:

```ts
type Command = 
  | { type: 'CREATE_USER'; payload: { name: string; email: string } }
  | { type: 'UPDATE_USER'; payload: { id: string; updates: Partial<User> } }
  | { type: 'DELETE_USER'; payload: { id: string } }
  | { type: 'SEND_EMAIL'; payload: { to: string; subject: string } };

class CommandHandler {
  handle(command: Command): Promise<void> {
    switch (command.type) {
      case 'CREATE_USER':
        return this.createUser(command.payload);
      
      case 'UPDATE_USER':
        return this.updateUser(command.payload);
      
      case 'DELETE_USER':
        return this.deleteUser(command.payload);
      
      case 'SEND_EMAIL':
        return this.sendEmail(command.payload);
      
      default:
        assertNever(command); // Compile-time safety
    }
  }
}
```

### State Machines:

```ts
type State = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: any }
  | { status: 'error'; error: string };

type Event = 
  | { type: 'START_LOADING' }
  | { type: 'LOADING_SUCCESS'; data: any }
  | { type: 'LOADING_ERROR'; error: string }
  | { type: 'RESET' };

function stateMachine(state: State, event: Event): State {
  switch (state.status) {
    case 'idle':
      switch (event.type) {
        case 'START_LOADING':
          return { status: 'loading' };
        default:
          assertNever(event);
      }
    
    case 'loading':
      switch (event.type) {
        case 'LOADING_SUCCESS':
          return { status: 'success', data: event.data };
        case 'LOADING_ERROR':
          return { status: 'error', error: event.error };
        default:
          assertNever(event);
      }
    
    case 'success':
    case 'error':
      switch (event.type) {
        case 'RESET':
          return { status: 'idle' };
        default:
          assertNever(event);
      }
    
    default:
      assertNever(state);
  }
}
```

---

## 4. Can you enforce exhaustiveness without switches? Alternative patterns.

### Answer:

Yes, there are several alternative patterns to enforce exhaustiveness without switch statements.

### 1. Object-based Dispatch:

```ts
type Action = 
  | { type: 'LOGIN'; payload: { username: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: { name: string } };

const actionHandlers = {
  LOGIN: (action: Extract<Action, { type: 'LOGIN' }>) => {
    console.log(`Logging in: ${action.payload.username}`);
  },
  LOGOUT: (action: Extract<Action, { type: 'LOGOUT' }>) => {
    console.log('Logging out');
  },
  UPDATE_PROFILE: (action: Extract<Action, { type: 'UPDATE_PROFILE' }>) => {
    console.log(`Updating profile: ${action.payload.name}`);
  }
} as const;

function handleAction(action: Action) {
  const handler = actionHandlers[action.type];
  if (!handler) {
    assertNever(action);
  }
  return handler(action);
}
```

### 2. Map-based Dispatch:

```ts
const actionMap = new Map([
  ['LOGIN', (action: Extract<Action, { type: 'LOGIN' }>) => {
    console.log(`Logging in: ${action.payload.username}`);
  }],
  ['LOGOUT', (action: Extract<Action, { type: 'LOGOUT' }>) => {
    console.log('Logging out');
  }],
  ['UPDATE_PROFILE', (action: Extract<Action, { type: 'UPDATE_PROFILE' }>) => {
    console.log(`Updating profile: ${action.payload.name}`);
  }]
]);

function handleAction(action: Action) {
  const handler = actionMap.get(action.type);
  if (!handler) {
    assertNever(action);
  }
  return handler(action);
}
```

### 3. Class-based Pattern:

```ts
abstract class ActionHandler<T extends Action> {
  abstract handle(action: T): void;
}

class LoginHandler extends ActionHandler<Extract<Action, { type: 'LOGIN' }>> {
  handle(action) {
    console.log(`Logging in: ${action.payload.username}`);
  }
}

class LogoutHandler extends ActionHandler<Extract<Action, { type: 'LOGOUT' }>> {
  handle(action) {
    console.log('Logging out');
  }
}

const handlers = {
  LOGIN: new LoginHandler(),
  LOGOUT: new LogoutHandler(),
  UPDATE_PROFILE: new UpdateProfileHandler()
} as const;

function handleAction(action: Action) {
  const handler = handlers[action.type];
  if (!handler) {
    assertNever(action);
  }
  return handler.handle(action);
}
```

### 4. Functional Pattern with Currying:

```ts
type ActionHandler<T extends Action> = (action: T) => void;

const createActionHandler = <T extends Action>(
  handler: ActionHandler<T>
): ActionHandler<T> => handler;

const actionHandlers = {
  LOGIN: createActionHandler((action) => {
    console.log(`Logging in: ${action.payload.username}`);
  }),
  LOGOUT: createActionHandler((action) => {
    console.log('Logging out');
  }),
  UPDATE_PROFILE: createActionHandler((action) => {
    console.log(`Updating profile: ${action.payload.name}`);
  })
} as const;
```

### 5. Visitor Pattern:

```ts
interface ActionVisitor {
  visitLogin(action: Extract<Action, { type: 'LOGIN' }>): void;
  visitLogout(action: Extract<Action, { type: 'LOGOUT' }>): void;
  visitUpdateProfile(action: Extract<Action, { type: 'UPDATE_PROFILE' }>): void;
}

class ActionProcessor implements ActionVisitor {
  visitLogin(action) {
    console.log(`Logging in: ${action.payload.username}`);
  }
  
  visitLogout(action) {
    console.log('Logging out');
  }
  
  visitUpdateProfile(action) {
    console.log(`Updating profile: ${action.payload.name}`);
  }
}

function handleAction(action: Action, visitor: ActionVisitor) {
  switch (action.type) {
    case 'LOGIN':
      return visitor.visitLogin(action);
    case 'LOGOUT':
      return visitor.visitLogout(action);
    case 'UPDATE_PROFILE':
      return visitor.visitUpdateProfile(action);
    default:
      assertNever(action);
  }
}
```

---

## 5. What are pros/cons of throwing in `assertNever` at runtime?

### Answer:

### Pros of Throwing in `assertNever`:

**1. Runtime Safety:**
```ts
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${String(x)}`);
}
```
- Catches unexpected values at runtime
- Provides clear error messages for debugging
- Fails fast when something goes wrong

**2. Development Safety:**
- Helps catch issues during development
- Provides immediate feedback when code changes
- Useful for testing edge cases

**3. Production Safety:**
- Prevents silent failures
- Makes bugs more visible
- Helps with monitoring and alerting

### Cons of Throwing in `assertNever`:

**1. Performance Impact:**
```ts
// Every call has overhead
function handleAction(action: Action) {
  switch (action.type) {
    // ... cases
    default:
      assertNever(action); // Runtime check on every call
  }
}
```

**2. Production Crashes:**
- Can crash the application
- May not be recoverable
- Could affect user experience

**3. Bundle Size:**
- Adds code to the bundle
- Increases bundle size for production

### Alternative Approaches:

**1. Logging Instead of Throwing:**
```ts
function assertNever(x: never): never {
  console.error(`Unexpected value: ${String(x)}`);
  // Return a default value or continue execution
  return x as never;
}
```

**2. Development vs Production:**
```ts
function assertNever(x: never): never {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(`Unexpected value: ${String(x)}`);
  }
  console.error(`Unexpected value: ${String(x)}`);
  return x as never;
}
```

**3. Conditional Compilation:**
```ts
function assertNever(x: never): never {
  if (__DEV__) {
    throw new Error(`Unexpected value: ${String(x)}`);
  }
  return x as never;
}
```

**4. Monitoring Integration:**
```ts
function assertNever(x: never): never {
  // Send to monitoring service
  monitoringService.reportError('Unexpected value', { value: x });
  
  // Log for debugging
  console.error(`Unexpected value: ${String(x)}`);
  
  // Return safe default
  return x as never;
}
```

**5. Type-safe Alternatives:**
```ts
// Use exhaustive type checking without runtime throws
function handleAction(action: Action): string {
  if (action.type === 'LOGIN') {
    return `Logging in: ${action.payload.username}`;
  }
  if (action.type === 'LOGOUT') {
    return 'Logging out';
  }
  if (action.type === 'UPDATE_PROFILE') {
    return `Updating profile: ${action.payload.name}`;
  }
  
  // TypeScript ensures this is unreachable
  const _exhaustiveCheck: never = action;
  return _exhaustiveCheck;
}
```

### Best Practices:

1. **Use in development** for immediate feedback
2. **Consider alternatives in production** like logging or monitoring
3. **Test exhaustiveness** by temporarily removing cases
4. **Use TypeScript's strict mode** to catch issues at compile time
5. **Consider the impact** on performance and user experience

### Recommended Pattern:

```ts
function assertNever(x: never): never {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(`Unexpected value: ${String(x)}`);
  }
  
  // In production, log and continue
  console.error(`Unexpected value: ${String(x)}`);
  return x as never;
}
```


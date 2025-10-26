# Template Literal Types

## Overview
Template literal types are a powerful TypeScript feature that allows you to build string literal types from unions and templates. They use template literal syntax (backticks) to create new string types by combining existing types.

## Basic Syntax
```ts
type Template = `prefix${Type}suffix`
```

## Key Concepts

### 1. String Interpolation
Template literal types can interpolate other types into strings:
```ts
type Greeting = `Hello, ${string}!`
type EventName = `on${string}`
```

### 2. Union Distribution
When a union type is used in a template literal, TypeScript distributes the union:
```ts
type EventName = `on${'click' | 'change' | 'submit'}` 
// Result: 'onclick' | 'onchange' | 'onsubmit'
```

### 3. Built-in String Manipulation Types
TypeScript provides several built-in utility types for string manipulation:

#### Capitalize
```ts
type Capitalized = Capitalize<'hello'> // 'Hello'
type EventName = `on${Capitalize<'click'>}` // 'onClick'
```

#### Uncapitalize
```ts
type Uncapitalized = Uncapitalize<'Hello'> // 'hello'
```

#### Uppercase
```ts
type Uppercased = Uppercase<'hello'> // 'HELLO'
```

#### Lowercase
```ts
type Lowercased = Lowercase<'HELLO'> // 'hello'
```

## Advanced Patterns

### 1. Key Remapping with Template Literals
```ts
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (event: T[K]) => void
}

type UserEvents = {
  click: MouseEvent
  change: ChangeEvent
}

type UserEventHandlers = EventHandlers<UserEvents>
// Result: { onClick: (event: MouseEvent) => void, onChange: (event: ChangeEvent) => void }
```

### 2. Path Generation
```ts
type Path<T, K extends keyof T = keyof T> = 
  K extends string 
    ? T[K] extends Record<string, any>
      ? `${K}.${Path<T[K]>}`
      : K
    : never

type User = {
  name: string
  address: {
    street: string
    city: string
  }
}

type UserPaths = Path<User> // 'name' | 'address.street' | 'address.city'
```

### 3. API Route Generation
```ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type ApiRoute<T extends string> = `/${T}`

type UserRoutes = ApiRoute<'users' | 'posts' | 'comments'>
// Result: '/users' | '/posts' | '/comments'

type FullApiRoute<M extends HttpMethod, R extends string> = `${M} ${ApiRoute<R>}`
type UserApiRoutes = FullApiRoute<'GET', 'users'> // 'GET /users'
```

### 4. CSS Property Generation
```ts
type CssProperty = 'margin' | 'padding' | 'border'
type CssSide = 'top' | 'right' | 'bottom' | 'left'

type CssProperties = `${CssProperty}-${CssSide}`
// Result: 'margin-top' | 'margin-right' | 'margin-bottom' | 'margin-left' | 'padding-top' | ...

type CssValue<T extends string> = `${T}-${number}px` | `${T}-${number}%` | `${T}-auto`
type MarginValue = CssValue<'margin'> // 'margin-10px' | 'margin-50%' | 'margin-auto'
```

### 5. Database Query Generation
```ts
type TableName = 'users' | 'posts' | 'comments'
type QueryType = 'select' | 'insert' | 'update' | 'delete'

type SqlQuery<T extends QueryType, U extends TableName> = `${T} * from ${U}`
type UserQueries = SqlQuery<'select', 'users'> // 'select * from users'
```

## Conditional Template Literals

### 1. Conditional String Building
```ts
type ApiEndpoint<T extends string> = T extends `api/${string}` 
  ? T 
  : `api/${T}`

type UserEndpoint = ApiEndpoint<'users'> // 'api/users'
type FullEndpoint = ApiEndpoint<'api/users'> // 'api/users'
```

### 2. Optional Prefixes
```ts
type OptionalPrefix<T extends string, P extends string = ''> = 
  P extends '' ? T : `${P}${Capitalize<T>}`

type EventName<T extends string> = OptionalPrefix<T, 'on'>
type ClickEvent = EventName<'click'> // 'onClick'
type SimpleEvent = EventName<'click', ''> // 'click'
```

## Recursive Template Literals

### 1. Deep Path Generation
```ts
type DeepPath<T, K extends keyof T = keyof T> = 
  K extends string 
    ? T[K] extends Record<string, any>
      ? `${K}.${DeepPath<T[K]>}`
      : K
    : never

type NestedObject = {
  user: {
    profile: {
      name: string
      age: number
    }
    settings: {
      theme: string
    }
  }
}

type NestedPaths = DeepPath<NestedObject>
// Result: 'user.profile.name' | 'user.profile.age' | 'user.settings.theme'
```

### 2. Recursive String Manipulation
```ts
type Reverse<T extends string> = T extends `${infer First}${infer Rest}`
  ? `${Reverse<Rest>}${First}`
  : ''

type Reversed = Reverse<'hello'> // 'olleh'
```

## Utility Types with Template Literals

### 1. String Splitting
```ts
type Split<S extends string, D extends string> = 
  string extends S ? string[] :
  S extends '' ? [] :
  S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S]

type PathParts = Split<'user.profile.name', '.'> // ['user', 'profile', 'name']
```

### 2. String Joining
```ts
type Join<T extends readonly string[], D extends string> = 
  T extends readonly [infer F, ...infer R]
    ? F extends string
      ? R extends readonly string[]
        ? R['length'] extends 0
          ? F
          : `${F}${D}${Join<R, D>}`
        : never
      : never
    : ''

type Joined = Join<['user', 'profile', 'name'], '.'> // 'user.profile.name'
```

## Best Practices

### 1. Performance Considerations
- Template literal types can be expensive for large unions
- Use conditional types to limit recursion depth
- Consider using mapped types for better performance

### 2. Type Safety
- Always validate input types before using in template literals
- Use branded types for additional type safety
- Leverage string literal types for better IntelliSense

### 3. Common Patterns
- Use with key remapping for API generation
- Combine with conditional types for complex logic
- Leverage recursive types for deep object manipulation

## Real-world Applications

### 1. Form Validation
```ts
type FormField<T extends string> = {
  name: T
  value: string
  error?: `${T}Error`
}

type UserForm = FormField<'email' | 'password'>
// Result: { name: 'email' | 'password', value: string, error?: 'emailError' | 'passwordError' }
```

### 2. Event System
```ts
type EventMap = {
  click: MouseEvent
  change: ChangeEvent
  submit: FormEvent
}

type EventHandler<T extends keyof EventMap> = {
  [K in T as `on${Capitalize<K>}`]: (event: EventMap[K]) => void
}
```

### 3. Configuration Objects
```ts
type ConfigKey<T extends string> = `config.${T}`
type UserConfig = ConfigKey<'theme' | 'language' | 'notifications'>
// Result: 'config.theme' | 'config.language' | 'config.notifications'
```

## Tips and Tricks

1. **Combine with key remapping** for powerful API surfaces
2. **Use conditional types** to handle edge cases
3. **Leverage recursive types** for deep object manipulation
4. **Consider performance** for large unions
5. **Use branded types** for additional type safety
6. **Test with complex scenarios** to ensure type correctness



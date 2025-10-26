# Template Literal Types - Questions and Answers

## Basic Questions

### Q1: What is the output of the following code?
```ts
type EventName = `on${'click' | 'change'}`
type Result = EventName
```

**Answer:**
```ts
type Result = 'onclick' | 'onchange'
```

**Explanation:** Template literal types distribute unions, so each member of the union is combined with the template literal prefix.

### Q2: What will be the result of this template literal type?
```ts
type Greeting = `Hello, ${string}!`
type Test = Greeting extends string ? true : false
```

**Answer:**
```ts
type Test = true
```

**Explanation:** `Greeting` is a template literal type that matches any string starting with "Hello, " and ending with "!", which is still a string type.

### Q3: What is the output of this code?
```ts
type Action = 'create' | 'update' | 'delete'
type Resource = 'user' | 'post' | 'comment'
type ApiEndpoint = `/${Action}/${Resource}`
```

**Answer:**
```ts
type ApiEndpoint = 
  | '/create/user' 
  | '/create/post' 
  | '/create/comment'
  | '/update/user' 
  | '/update/post' 
  | '/update/comment'
  | '/delete/user' 
  | '/delete/post' 
  | '/delete/comment'
```

**Explanation:** Template literal types distribute over both unions, creating a cartesian product of all possible combinations.

## Intermediate Questions

### Q4: What will be the result of this conditional type?
```ts
type EventMap = {
  click: MouseEvent
  change: ChangeEvent
  submit: FormEvent
}

type EventHandler<T extends keyof EventMap> = {
  [K in T as `on${Capitalize<K>}`]: (event: EventMap[K]) => void
}

type ClickHandler = EventHandler<'click'>
```

**Answer:**
```ts
type ClickHandler = {
  onClick: (event: MouseEvent) => void
}
```

**Explanation:** The key remapping transforms 'click' to 'onClick' using the `Capitalize` utility type, and the value type is inferred from the EventMap.

### Q5: What is the output of this recursive template literal?
```ts
type Reverse<T extends string> = T extends `${infer First}${infer Rest}`
  ? `${Reverse<Rest>}${First}`
  : ''

type Reversed = Reverse<'hello'>
```

**Answer:**
```ts
type Reversed = 'olleh'
```

**Explanation:** The recursive type extracts the first character and recursively processes the rest, then concatenates them in reverse order.

### Q6: What will be the result of this path generation?
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

type UserPaths = Path<User>
```

**Answer:**
```ts
type UserPaths = 'name' | 'address.street' | 'address.city'
```

**Explanation:** The recursive type generates dot-notation paths for nested object properties, stopping at primitive values.

## Advanced Questions

### Q7: What is the output of this complex template literal with conditional types?
```ts
type ApiEndpoint<T extends string> = T extends `api/${string}` 
  ? T 
  : `api/${T}`

type UserEndpoint = ApiEndpoint<'users'>
type FullEndpoint = ApiEndpoint<'api/users'>
type NestedEndpoint = ApiEndpoint<'api/users/profile'>
```

**Answer:**
```ts
type UserEndpoint = 'api/users'
type FullEndpoint = 'api/users'
type NestedEndpoint = 'api/users/profile'
```

**Explanation:** The conditional type checks if the input already has the 'api/' prefix. If it does, it returns the input as-is; otherwise, it adds the prefix.

### Q8: What will be the result of this string splitting utility?
```ts
type Split<S extends string, D extends string> = 
  string extends S ? string[] :
  S extends '' ? [] :
  S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S]

type PathParts = Split<'user.profile.name', '.'>
type EmptySplit = Split<'', '.'>
type NoDelimiter = Split<'hello', '.'>
```

**Answer:**
```ts
type PathParts = ['user', 'profile', 'name']
type EmptySplit = []
type NoDelimiter = ['hello']
```

**Explanation:** The recursive type splits the string at the delimiter, handling edge cases like empty strings and strings without delimiters.

### Q9: What is the output of this CSS property generation?
```ts
type CssProperty = 'margin' | 'padding' | 'border'
type CssSide = 'top' | 'right' | 'bottom' | 'left'

type CssProperties = `${CssProperty}-${CssSide}`
type CssValue<T extends string> = `${T}-${number}px` | `${T}-${number}%` | `${T}-auto`

type MarginValue = CssValue<'margin'>
```

**Answer:**
```ts
type CssProperties = 
  | 'margin-top' | 'margin-right' | 'margin-bottom' | 'margin-left'
  | 'padding-top' | 'padding-right' | 'padding-bottom' | 'padding-left'
  | 'border-top' | 'border-right' | 'border-bottom' | 'border-left'

type MarginValue = 'margin-${number}px' | 'margin-${number}%' | 'margin-auto'
```

**Explanation:** Template literals distribute over unions, creating all possible combinations. The CssValue type creates a union of template literals with different value patterns.

### Q10: What will be the result of this event system implementation?
```ts
type EventMap = {
  click: MouseEvent
  change: ChangeEvent
  submit: FormEvent
  focus: FocusEvent
}

type EventHandler<T extends keyof EventMap> = {
  [K in T as `on${Capitalize<K>}`]: (event: EventMap[K]) => void
}

type AllEventHandlers = EventHandler<keyof EventMap>
```

**Answer:**
```ts
type AllEventHandlers = {
  onClick: (event: MouseEvent) => void
  onChange: (event: ChangeEvent) => void
  onSubmit: (event: FormEvent) => void
  onFocus: (event: FocusEvent) => void
}
```

**Explanation:** The key remapping transforms each event name to its corresponding handler name using `Capitalize`, and the value type is inferred from the EventMap.

## Complex Scenarios

### Q11: What is the output of this deep path generation?
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
      language: string
    }
  }
  posts: {
    title: string
    content: string
  }[]
}

type NestedPaths = DeepPath<NestedObject>
```

**Answer:**
```ts
type NestedPaths = 
  | 'user.profile.name' 
  | 'user.profile.age' 
  | 'user.settings.theme' 
  | 'user.settings.language'
  | 'posts'
```

**Explanation:** The recursive type generates dot-notation paths for nested objects, stopping at primitive values and arrays (which are not Record<string, any>).

### Q12: What will be the result of this string joining utility?
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

type Joined = Join<['user', 'profile', 'name'], '.'>
type Single = Join<['hello'], '.'>
type Empty = Join<[], '.'>
```

**Answer:**
```ts
type Joined = 'user.profile.name'
type Single = 'hello'
type Empty = ''
```

**Explanation:** The recursive type joins array elements with the delimiter, handling edge cases like single elements and empty arrays.

### Q13: What is the output of this conditional template literal with multiple conditions?
```ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type ApiRoute<T extends string> = `/${T}`
type FullApiRoute<M extends HttpMethod, R extends string> = `${M} ${ApiRoute<R>}`

type UserRoutes = FullApiRoute<'GET', 'users'>
type PostRoutes = FullApiRoute<'POST', 'posts'>
type AllRoutes = FullApiRoute<HttpMethod, 'users' | 'posts'>
```

**Answer:**
```ts
type UserRoutes = 'GET /users'
type PostRoutes = 'POST /posts'
type AllRoutes = 
  | 'GET /users' | 'GET /posts'
  | 'POST /users' | 'POST /posts'
  | 'PUT /users' | 'PUT /posts'
  | 'DELETE /users' | 'DELETE /posts'
```

**Explanation:** Template literals distribute over unions, creating all possible combinations of HTTP methods and routes.

### Q14: What will be the result of this form validation system?
```ts
type FormField<T extends string> = {
  name: T
  value: string
  error?: `${T}Error`
}

type UserForm = FormField<'email' | 'password' | 'confirmPassword'>
type FormErrors = UserForm['error']
```

**Answer:**
```ts
type UserForm = {
  name: 'email' | 'password' | 'confirmPassword'
  value: string
  error?: 'emailError' | 'passwordError' | 'confirmPasswordError'
}

type FormErrors = 'emailError' | 'passwordError' | 'confirmPasswordError' | undefined
```

**Explanation:** The template literal creates error field names by appending "Error" to the field names, and the error field is optional.

### Q15: What is the output of this configuration system?
```ts
type ConfigKey<T extends string> = `config.${T}`
type UserConfig = ConfigKey<'theme' | 'language' | 'notifications'>
type ConfigValue<T extends string> = T extends `config.${infer U}` ? U : never

type ThemeConfig = ConfigValue<'config.theme'>
type InvalidConfig = ConfigValue<'invalid.key'>
```

**Answer:**
```ts
type UserConfig = 'config.theme' | 'config.language' | 'config.notifications'
type ThemeConfig = 'theme'
type InvalidConfig = never
```

**Explanation:** The template literal creates configuration keys with the "config." prefix, and the ConfigValue type extracts the suffix using conditional types with `infer`.

## Performance and Best Practices

### Q16: What is a potential issue with this template literal type?
```ts
type LargeUnion = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j'
type Template = `prefix-${LargeUnion}-suffix`
```

**Answer:**
The template literal will create a union of 10 string literals, which is manageable. However, with larger unions (100+ members), this could cause performance issues during type checking.

**Best Practice:** Use conditional types to limit the size of unions or consider using mapped types for better performance.

### Q17: How would you optimize this recursive template literal?
```ts
type DeepPath<T, K extends keyof T = keyof T> = 
  K extends string 
    ? T[K] extends Record<string, any>
      ? `${K}.${DeepPath<T[K]>}`
      : K
    : never
```

**Answer:**
```ts
type DeepPath<T, K extends keyof T = keyof T, Depth extends number = 0> = 
  Depth extends 5 ? never : // Limit recursion depth
  K extends string 
    ? T[K] extends Record<string, any>
      ? `${K}.${DeepPath<T[K], keyof T[K], [...Depth[], 1]['length']>}`
      : K
    : never
```

**Explanation:** Add a depth counter to prevent infinite recursion and limit the maximum depth of path generation.

### Q18: What is the output of this branded type with template literals?
```ts
type Brand<T, B extends string> = T & { __brand: B }
type UserId = Brand<number, 'UserId'>
type PostId = Brand<number, 'PostId'>

type ApiEndpoint<T extends string> = `api/${T}`
type UserEndpoint = ApiEndpoint<'users'>
type PostEndpoint = ApiEndpoint<'posts'>
```

**Answer:**
```ts
type UserEndpoint = 'api/users'
type PostEndpoint = 'api/posts'
```

**Explanation:** The branded types don't affect the template literal generation, but they provide additional type safety when used with the endpoints.

## Real-world Applications

### Q19: How would you create a type-safe event system using template literals?
```ts
type EventMap = {
  click: MouseEvent
  change: ChangeEvent
  submit: FormEvent
}

type EventHandler<T extends keyof EventMap> = {
  [K in T as `on${Capitalize<K>}`]: (event: EventMap[K]) => void
}

type ClickHandler = EventHandler<'click'>
type AllHandlers = EventHandler<keyof EventMap>
```

**Answer:**
```ts
type ClickHandler = {
  onClick: (event: MouseEvent) => void
}

type AllHandlers = {
  onClick: (event: MouseEvent) => void
  onChange: (event: ChangeEvent) => void
  onSubmit: (event: FormEvent) => void
}
```

**Explanation:** This creates a type-safe event system where event names are automatically transformed to handler names, and the event types are properly inferred.

### Q20: What is the output of this API route generation system?
```ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type Resource = 'users' | 'posts' | 'comments'
type ApiRoute<M extends HttpMethod, R extends Resource> = `${M} /${R}`

type UserRoutes = ApiRoute<HttpMethod, 'users'>
type PostRoutes = ApiRoute<'GET', Resource>
type AllRoutes = ApiRoute<HttpMethod, Resource>
```

**Answer:**
```ts
type UserRoutes = 
  | 'GET /users' | 'POST /users' | 'PUT /users' | 'DELETE /users'

type PostRoutes = 
  | 'GET /posts' | 'GET /comments'

type AllRoutes = 
  | 'GET /users' | 'GET /posts' | 'GET /comments'
  | 'POST /users' | 'POST /posts' | 'POST /comments'
  | 'PUT /users' | 'PUT /posts' | 'PUT /comments'
  | 'DELETE /users' | 'DELETE /posts' | 'DELETE /comments'
```

**Explanation:** Template literals distribute over unions, creating all possible combinations of HTTP methods and resources.

## Summary

Template literal types are a powerful feature for:
1. **String manipulation** - Creating new string types from existing ones
2. **API generation** - Building type-safe APIs with consistent naming
3. **Path generation** - Creating dot-notation paths for nested objects
4. **Event systems** - Transforming event names to handler names
5. **Configuration** - Building configuration key patterns
6. **Form validation** - Creating error field names from field names

Key concepts to remember:
- Template literals distribute over unions
- Use with key remapping for powerful transformations
- Combine with conditional types for complex logic
- Consider performance for large unions
- Use recursive types for deep object manipulation
- Leverage built-in string utility types (Capitalize, Uppercase, etc.)

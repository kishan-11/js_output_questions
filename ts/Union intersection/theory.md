
# TypeScript: Union (`|`) & Intersection (`&`) Types

TypeScript provides advanced types to model flexible data structures.  
Two powerful tools in this system are **Union** and **Intersection** types.

---

## 🔀 Union Types (`|`)

A **Union type** allows a variable to be **one of multiple types**. It represents a value that can be any one of several types.

### 🔹 Basic Syntax

```ts
let value: string | number;
value = "hello"; // ✅
value = 42;      // ✅
value = true;    // ❌ Type 'boolean' is not assignable to type 'string | number'
```

### 🔹 Union with Literal Types

```ts
type Status = "loading" | "success" | "error";
type Theme = "light" | "dark";

function setStatus(status: Status) {
  // status can only be one of the three literal values
}
```

### 🔹 Union with Object Types

```ts
type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Shape = Circle | Rectangle;

function getArea(shape: Shape): number {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  } else {
    return shape.width * shape.height;
  }
}
```

### 🔹 Discriminated Unions (Tagged Unions)

```ts
type LoadingState = { status: "loading" };
type SuccessState = { status: "success"; data: any[] };
type ErrorState = { status: "error"; error: string };

type AppState = LoadingState | SuccessState | ErrorState;

function handleState(state: AppState) {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Data: ${state.data.length} items`;
    case "error":
      return `Error: ${state.error}`;
  }
}
```

### 🔹 Union with Functions

```ts
type EventHandler = ((event: MouseEvent) => void) | ((event: KeyboardEvent) => void);

function addEventListener(handler: EventHandler) {
  // handler can be either mouse or keyboard event handler
}
```

### 🔹 Type Narrowing Techniques

#### Using `typeof`
```ts
function processValue(value: string | number | boolean) {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value.toFixed(2);
  } else {
    return value ? "true" : "false";
  }
}
```

#### Using `instanceof`
```ts
function processInput(input: string | Date | RegExp) {
  if (input instanceof Date) {
    return input.toISOString();
  } else if (input instanceof RegExp) {
    return input.test("test");
  } else {
    return input.length;
  }
}
```

#### Using `in` operator
```ts
type Bird = { fly: () => void };
type Fish = { swim: () => void };

function move(animal: Bird | Fish) {
  if ("fly" in animal) {
    animal.fly();
  } else {
    animal.swim();
  }
}
```

#### Using type predicates
```ts
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(value: string | number) {
  if (isString(value)) {
    return value.toUpperCase(); // TypeScript knows value is string
  }
  return value.toFixed(2);
}
```

### 🔹 Union with Optional Properties

```ts
type User = {
  id: number;
  name: string;
  email?: string;
} | {
  id: number;
  username: string;
  phone?: string;
};

// User can be either email-based or username-based
```

---

## 🧬 Intersection Types (`&`)

An **Intersection type** combines multiple types into one. A variable must satisfy **all** the types simultaneously.

### 🔹 Basic Syntax

```ts
type Person = { name: string };
type Employee = { employeeId: number };
type Manager = { department: string };

type Staff = Person & Employee;
type ManagerStaff = Person & Employee & Manager;

const worker: Staff = {
  name: "Kishan",
  employeeId: 101
};

const manager: ManagerStaff = {
  name: "Alice",
  employeeId: 102,
  department: "Engineering"
};
```

### 🔹 Intersection with Functions

```ts
type Logger = { log: (message: string) => void };
type Serializer = { serialize: () => string };
type Validator = { validate: () => boolean };

type Processable = Logger & Serializer & Validator;

function process(obj: Processable) {
  if (obj.validate()) {
    obj.log("Processing...");
    console.log(obj.serialize());
  }
}
```

### 🔹 Intersection with Generic Types

```ts
type Timestamped<T> = T & { timestamp: Date };
type Logged<T> = T & { log: () => void };

type TimestampedLogged<T> = Timestamped<T> & Logged<T>;

function createLoggedEvent<T>(data: T): TimestampedLogged<T> {
  return {
    ...data,
    timestamp: new Date(),
    log: () => console.log(`Event at ${new Date().toISOString()}`)
  };
}
```

### 🔹 Intersection with Utility Types

```ts
type PartialUser = Partial<{ name: string; email: string; age: number }>;
type RequiredUser = Required<{ id: number }>;

type User = PartialUser & RequiredUser;
// User has optional name, email, age but required id
```

### 🔹 Intersection with Conditional Types

```ts
type NonNullable<T> = T extends null | undefined ? never : T;

type SafeString = NonNullable<string | null | undefined>; // string
type SafeNumber = NonNullable<number | null>; // number
```

---

## 🔄 Advanced Union Patterns

### 🔹 Union with Mapped Types

```ts
type EventMap = {
  click: MouseEvent;
  keydown: KeyboardEvent;
  scroll: Event;
};

type EventHandler<T extends keyof EventMap> = (event: EventMap[T]) => void;

function addEvent<T extends keyof EventMap>(
  event: T,
  handler: EventHandler<T>
) {
  // Type-safe event handling
}
```

### 🔹 Union with Template Literal Types

```ts
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiEndpoint = `/${string}`;

type ApiCall = `${HttpMethod} ${ApiEndpoint}`;

function makeRequest(call: ApiCall) {
  // call is type-safe like "GET /users" or "POST /login"
}
```

### 🔹 Union with Recursive Types

```ts
type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonValue[] 
  | { [key: string]: JsonValue };

function parseJson(json: JsonValue) {
  // Handle any valid JSON structure
}
```

---

## 🔄 Advanced Intersection Patterns

### 🔹 Intersection with Branded Types

```ts
type Brand<T, B> = T & { __brand: B };

type UserId = Brand<number, "UserId">;
type ProductId = Brand<number, "ProductId">;

function getUser(id: UserId) {
  // Prevents mixing up different ID types
}

function getProduct(id: ProductId) {
  // Type-safe ID handling
}
```

### 🔹 Intersection with Mixins

```ts
type TimestampMixin = { createdAt: Date; updatedAt: Date };
type SoftDeleteMixin = { deletedAt: Date | null };

type BaseEntity = TimestampMixin & SoftDeleteMixin;

type User = BaseEntity & {
  id: number;
  name: string;
  email: string;
};
```

---

## ⚠️ Common Pitfalls and Best Practices

### 🔹 Union vs Intersection Confusion

```ts
type A = { name: string };
type B = { age: number };

// Union: can be either A or B (or both)
let u: A | B = { name: "Kishan" }; // ✅
u = { age: 30 };                   // ✅
u = { name: "Kishan", age: 30 };   // ✅

// Intersection: must be A AND B
let i: A & B = { name: "Kishan" };      // ❌ Error: missing 'age'
i = { name: "Kishan", age: 30 };        // ✅
```

### 🔹 Union Type Narrowing Issues

```ts
function badExample(value: string | number) {
  // ❌ Error: Property 'toUpperCase' does not exist on type 'string | number'
  return value.toUpperCase();
}

function goodExample(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // ✅ Type narrowed to string
  }
  return value.toString();
}
```

### 🔹 Intersection with Conflicting Properties

```ts
type A = { prop: string };
type B = { prop: number };

// ❌ This creates never type due to conflicting properties
type Conflict = A & B; // prop: never

// ✅ Use union instead
type Union = A | B;
```

### 🔹 Best Practices

1. **Use discriminated unions for state management**
2. **Prefer intersection for mixins and composition**
3. **Always use type guards with unions**
4. **Avoid complex nested unions/intersections**
5. **Use branded types for type safety**

---

## 🔚 Summary

| Feature             | Union (`|`)                          | Intersection (`&`)                      |
|---------------------|--------------------------------------|------------------------------------------|
| Meaning             | Either one type or another           | Must be all types combined               |
| Runtime behavior    | Requires type narrowing              | Must satisfy all members                 |
| Common use cases    | Flexible parameters, API models      | Merging types, enforcing multiple traits |
| Example             | `string | number`                    | `Person & Employee`                      |
| Type narrowing      | Required for safe access            | Not needed (all properties available)    |
| Performance         | Runtime type checking needed        | No runtime overhead                      |

# TypeScript Union & Intersection Types - Questions & Answers

## Basic Union Types

### Q1: What is the output of the following code?

```ts
let value: string | number;
value = "hello";
console.log(typeof value);
```

**Answer:** `"string"`

**Explanation:** The variable `value` is declared as a union type `string | number`. When we assign `"hello"` to it, TypeScript narrows the type to `string`, and `typeof value` returns `"string"`.

---

### Q2: What will be the result of this code?

```ts
function process(input: string | number): string {
  return input.toString();
}

console.log(process(42));
console.log(process("hello"));
```

**Answer:** 
```
42
hello
```

**Explanation:** The function accepts a union type `string | number`. Both `42` and `"hello"` can be converted to strings using `toString()`, so both calls work correctly.

---

### Q3: What's wrong with this code?

```ts
function getLength(input: string | number): number {
  return input.length;
}
```

**Answer:** TypeScript error: `Property 'length' does not exist on type 'string | number'`

**Explanation:** The `length` property doesn't exist on `number` type. You need to use type narrowing:

```ts
function getLength(input: string | number): number {
  if (typeof input === "string") {
    return input.length;
  }
  return input.toString().length;
}
```

---

## Type Narrowing

### Q4: What is the output of this code?

```ts
function processValue(value: string | number | boolean) {
  if (typeof value === "string") {
    console.log("String:", value.toUpperCase());
  } else if (typeof value === "number") {
    console.log("Number:", value.toFixed(2));
  } else {
    console.log("Boolean:", value ? "true" : "false");
  }
}

processValue("hello");
processValue(3.14159);
processValue(true);
```

**Answer:**
```
String: HELLO
Number: 3.14
Boolean: true
```

**Explanation:** TypeScript's type narrowing allows us to safely access type-specific methods after checking the type with `typeof`.

---

### Q5: What will this code output?

```ts
type Bird = { fly: () => void };
type Fish = { swim: () => void };

function move(animal: Bird | Fish) {
  if ("fly" in animal) {
    animal.fly();
    console.log("Flying");
  } else {
    animal.swim();
    console.log("Swimming");
  }
}

move({ fly: () => {} });
move({ swim: () => {} });
```

**Answer:**
```
Flying
Swimming
```

**Explanation:** The `in` operator is used for type narrowing. It checks if a property exists on an object, allowing TypeScript to narrow the union type.

---

## Discriminated Unions

### Q6: What is the output of this discriminated union example?

```ts
type LoadingState = { status: "loading" };
type SuccessState = { status: "success"; data: string[] };
type ErrorState = { status: "error"; error: string };

type AppState = LoadingState | SuccessState | ErrorState;

function handleState(state: AppState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Success: ${state.data.length} items`;
    case "error":
      return `Error: ${state.error}`;
  }
}

console.log(handleState({ status: "loading" }));
console.log(handleState({ status: "success", data: ["item1", "item2"] }));
console.log(handleState({ status: "error", error: "Network error" }));
```

**Answer:**
```
Loading...
Success: 2 items
Error: Network error
```

**Explanation:** Discriminated unions use a common property (the "discriminant") to distinguish between different types. TypeScript can narrow the type based on the discriminant value.

---

## Intersection Types

### Q7: What is the result of this intersection type example?

```ts
type Person = { name: string };
type Employee = { employeeId: number };
type Manager = { department: string };

type Staff = Person & Employee;
type ManagerStaff = Person & Employee & Manager;

const worker: Staff = {
  name: "Alice",
  employeeId: 123
};

const manager: ManagerStaff = {
  name: "Bob",
  employeeId: 456,
  department: "Engineering"
};

console.log(worker.name, worker.employeeId);
console.log(manager.name, manager.employeeId, manager.department);
```

**Answer:**
```
Alice 123
Bob 456 Engineering
```

**Explanation:** Intersection types combine all properties from multiple types. `Staff` has both `name` and `employeeId`, while `ManagerStaff` has all three properties.

---

### Q8: What happens with this intersection type?

```ts
type A = { prop: string };
type B = { prop: number };

type Conflict = A & B;

const obj: Conflict = {
  prop: "hello" // What happens here?
};
```

**Answer:** TypeScript error: `Type 'string' is not assignable to type 'never'`

**Explanation:** When intersection types have conflicting properties, TypeScript creates a `never` type for that property because a value cannot be both `string` and `number` simultaneously.

---

## Advanced Union Patterns

### Q9: What is the output of this mapped type with union?

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
): void {
  console.log(`Added ${event} handler`);
}

addEvent("click", (event) => console.log("Clicked"));
addEvent("keydown", (event) => console.log("Key pressed"));
```

**Answer:**
```
Added click handler
Added keydown handler
```

**Explanation:** This demonstrates type-safe event handling where the event parameter type is correctly inferred based on the event name.

---

### Q10: What will this recursive union type example output?

```ts
type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonValue[] 
  | { [key: string]: JsonValue };

function processJson(json: JsonValue): string {
  if (typeof json === "string") {
    return `String: ${json}`;
  } else if (typeof json === "number") {
    return `Number: ${json}`;
  } else if (typeof json === "boolean") {
    return `Boolean: ${json}`;
  } else if (json === null) {
    return "Null";
  } else if (Array.isArray(json)) {
    return `Array with ${json.length} items`;
  } else {
    return `Object with ${Object.keys(json).length} keys`;
  }
}

console.log(processJson("hello"));
console.log(processJson(42));
console.log(processJson([1, 2, 3]));
console.log(processJson({ name: "John", age: 30 }));
```

**Answer:**
```
String: hello
Number: 42
Array with 3 items
Object with 2 keys
```

**Explanation:** Recursive union types allow modeling complex data structures like JSON, where values can be nested.

---

## Advanced Intersection Patterns

### Q11: What is the result of this branded type example?

```ts
type Brand<T, B> = T & { __brand: B };

type UserId = Brand<number, "UserId">;
type ProductId = Brand<number, "ProductId">;

function createUserId(id: number): UserId {
  return id as UserId;
}

function createProductId(id: number): ProductId {
  return id as ProductId;
}

function getUser(id: UserId) {
  return `User ${id}`;
}

function getProduct(id: ProductId) {
  return `Product ${id}`;
}

const userId = createUserId(123);
const productId = createProductId(456);

console.log(getUser(userId));
console.log(getProduct(productId));
// console.log(getUser(productId)); // What happens here?
```

**Answer:**
```
User 123
Product 456
```

**Explanation:** Branded types prevent mixing up different ID types. The commented line would cause a TypeScript error because `ProductId` cannot be assigned to `UserId`.

---

### Q12: What does this mixin pattern demonstrate?

```ts
type TimestampMixin = { createdAt: Date; updatedAt: Date };
type SoftDeleteMixin = { deletedAt: Date | null };

type BaseEntity = TimestampMixin & SoftDeleteMixin;

type User = BaseEntity & {
  id: number;
  name: string;
  email: string;
};

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
};

console.log(`User: ${user.name}, Created: ${user.createdAt.toISOString()}`);
```

**Answer:**
```
User: Alice, Created: 2024-01-15T10:30:00.000Z
```

**Explanation:** Mixins allow composing reusable type features. The `User` type gets all properties from `BaseEntity` plus its own specific properties.

---

## Complex Scenarios

### Q13: What is the output of this complex union and intersection example?

```ts
type ApiResponse<T> = 
  | { status: "success"; data: T }
  | { status: "error"; error: string };

type Timestamped<T> = T & { timestamp: Date };

type ApiResponseWithTimestamp<T> = Timestamped<ApiResponse<T>>;

function handleResponse<T>(response: ApiResponseWithTimestamp<T>): string {
  if (response.status === "success") {
    return `Success at ${response.timestamp.toISOString()}: ${JSON.stringify(response.data)}`;
  } else {
    return `Error at ${response.timestamp.toISOString()}: ${response.error}`;
  }
}

const successResponse: ApiResponseWithTimestamp<{ id: number; name: string }> = {
  status: "success",
  data: { id: 1, name: "Test" },
  timestamp: new Date("2024-01-15T10:30:00Z")
};

const errorResponse: ApiResponseWithTimestamp<never> = {
  status: "error",
  error: "Not found",
  timestamp: new Date("2024-01-15T10:31:00Z")
};

console.log(handleResponse(successResponse));
console.log(handleResponse(errorResponse));
```

**Answer:**
```
Success at 2024-01-15T10:30:00.000Z: {"id":1,"name":"Test"}
Error at 2024-01-15T10:31:00.000Z: Not found
```

**Explanation:** This demonstrates combining union types (for API responses) with intersection types (for adding timestamps) to create complex, type-safe data structures.

---

### Q14: What happens with this conditional type and union?

```ts
type NonNullable<T> = T extends null | undefined ? never : T;

type SafeString = NonNullable<string | null | undefined>;
type SafeNumber = NonNullable<number | null>;

function processValue<T>(value: NonNullable<T>): string {
  return `Value: ${value}`;
}

console.log(processValue("hello" as SafeString));
console.log(processValue(42 as SafeNumber));
// console.log(processValue(null as SafeString)); // What happens?
```

**Answer:**
```
Value: hello
Value: 42
```

**Explanation:** The `NonNullable` utility type removes `null` and `undefined` from a type. The commented line would cause a TypeScript error because `null` cannot be assigned to `SafeString`.

---

## Type Guards and Assertions

### Q15: What is the output of this type guard example?

```ts
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function processUnknown(value: unknown): string {
  if (isString(value)) {
    return `String: ${value.toUpperCase()}`;
  } else if (isNumber(value)) {
    return `Number: ${value.toFixed(2)}`;
  } else {
    return `Unknown: ${String(value)}`;
  }
}

console.log(processUnknown("hello"));
console.log(processUnknown(3.14159));
console.log(processUnknown(true));
console.log(processUnknown(null));
```

**Answer:**
```
String: HELLO
Number: 3.14
Unknown: true
Unknown: null
```

**Explanation:** Type guards allow TypeScript to narrow types based on runtime checks. The `isString` and `isNumber` functions act as type predicates.

---

## Performance and Best Practices

### Q16: Which approach is better for performance?

```ts
// Approach 1: Union with type narrowing
function processUnion(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value.toString();
  }
}

// Approach 2: Intersection (not applicable here)
// Approach 3: Generic with constraints
function processGeneric<T extends string | number>(value: T): string {
  return value.toString();
}
```

**Answer:** Approach 3 (Generic with constraints) is generally better for performance.

**Explanation:** 
- **Approach 1** requires runtime type checking
- **Approach 3** has no runtime overhead and provides better type safety
- **Approach 2** doesn't apply here since we need different behavior for different types

---

### Q17: What's the best practice for this scenario?

```ts
// Scenario: API response that can be either success or error
type ApiResponse<T> = 
  | { status: "success"; data: T }
  | { status: "error"; error: string; code: number };

// Which approach is better?
// A: Using type assertions
function handleResponseA(response: ApiResponse<any>) {
  if (response.status === "success") {
    return (response as any).data; // ❌ Type assertion
  }
  return null;
}

// B: Using proper type narrowing
function handleResponseB<T>(response: ApiResponse<T>): T | null {
  if (response.status === "success") {
    return response.data; // ✅ Type narrowing
  }
  return null;
}
```

**Answer:** Approach B is better.

**Explanation:** 
- **Approach A** uses type assertions which bypass TypeScript's type checking
- **Approach B** uses proper type narrowing which is type-safe and doesn't require runtime overhead
- Type narrowing is the recommended approach for union types

---

## Summary

These questions cover the fundamental concepts of TypeScript Union and Intersection types:

1. **Union Types (`|`)**: Represent values that can be one of several types
2. **Intersection Types (`&`)**: Combine multiple types into one
3. **Type Narrowing**: Essential for safely working with union types
4. **Discriminated Unions**: Powerful pattern for state management
5. **Advanced Patterns**: Branded types, mixins, and complex compositions
6. **Best Practices**: Use type narrowing over type assertions, prefer generics when possible

Understanding these concepts is crucial for writing type-safe, maintainable TypeScript code.

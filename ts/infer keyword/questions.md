# Interview Questions: `infer` Keyword

## 1. Explain how `infer` captures a type variable from a specific position.

**Answer:**

The `infer` keyword captures types from specific positions within type structures by declaring a new type variable that TypeScript will automatically infer based on the structure being matched.

### How it works:

```ts
// Basic syntax: T extends SomeType<infer U> ? U : never
type ExtractPromiseType<T> = T extends Promise<infer U> ? U : never;

// Usage
type StringPromise = ExtractPromiseType<Promise<string>>; // string
type NumberPromise = ExtractPromiseType<Promise<number>>; // number
```

### Position-based capture:

```ts
// 1. Function parameters
type FirstParam<T> = T extends (arg: infer P) => any ? P : never;
type Test1 = FirstParam<(x: string) => void>; // string

// 2. Function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Test2 = ReturnType<() => number>; // number

// 3. Array element type
type ArrayElement<T> = T extends (infer U)[] ? U : never;
type Test3 = ArrayElement<string[]>; // string

// 4. Tuple first element
type TupleHead<T> = T extends [infer H, ...any[]] ? H : never;
type Test4 = TupleHead<[string, number, boolean]>; // string
```

### Multiple position inference:

```ts
type FunctionSignature<T> = T extends (a: infer A, b: infer B) => infer R 
  ? { firstParam: A; secondParam: B; returnType: R } 
  : never;

type Test5 = FunctionSignature<(x: string, y: number) => boolean>;
// Result: { firstParam: string; secondParam: number; returnType: boolean }
```

**Key Points:**
- `infer` only works inside conditional types (`T extends ... ? ... : ...`)
- The inferred type variable is scoped to that specific conditional type
- TypeScript matches the structure and extracts the type from the specified position
- If the structure doesn't match, the fallback type (usually `never`) is used

---

## 2. Implement `Parameters<T>` and `ReturnType<T>` using `infer`.

**Answer:**

Here are the implementations of these built-in utility types:

### Parameters<T> Implementation:

```ts
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

// Test cases
type Test1 = MyParameters<(a: string, b: number) => void>; 
// Result: [string, number]

type Test2 = MyParameters<() => void>; 
// Result: []

type Test3 = MyParameters<(x: string, ...rest: number[]) => void>; 
// Result: [string, ...number[]]
```

### ReturnType<T> Implementation:

```ts
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Test cases
type Test1 = MyReturnType<() => string>; 
// Result: string

type Test2 = MyReturnType<(x: number) => Promise<boolean>>; 
// Result: Promise<boolean>

type Test3 = MyReturnType<() => void>; 
// Result: void
```

### Advanced Examples:

```ts
// ConstructorParameters<T>
type MyConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;

class MyClass {
  constructor(public name: string, public age: number) {}
}

type ConstructorArgs = MyConstructorParameters<typeof MyClass>;
// Result: [string, number]

// InstanceType<T>
type MyInstanceType<T> = T extends new (...args: any[]) => infer R ? R : never;

type Instance = MyInstanceType<typeof MyClass>;
// Result: MyClass
```

### Real-world usage:

```ts
// Function type extraction
function createHandler<T extends (...args: any[]) => any>(
  fn: T
): {
  parameters: MyParameters<T>;
  returnType: MyReturnType<T>;
} {
  return {
    parameters: [] as any,
    returnType: undefined as any
  };
}

const handler = createHandler((name: string, age: number) => `Hello ${name}, age ${age}`);
// handler.parameters is [string, number]
// handler.returnType is string
```

---

## 3. How to conditionally infer the element type of tuple vs array differently?

**Answer:**

You can use conditional types to differentiate between tuples and arrays and infer their element types differently:

### Basic Differentiation:

```ts
type ElementType<T> = T extends readonly (infer U)[] 
  ? T extends readonly [any, ...any[]] 
    ? U  // Tuple case
    : U  // Array case
  : never;

// This doesn't differentiate well, so let's be more specific:
```

### Better Approach - Explicit Tuple vs Array Detection:

```ts
type IsTuple<T> = T extends readonly [any, ...any[]] ? true : false;

type TupleElement<T> = T extends readonly [infer U, ...any[]] ? U : never;
type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

type SmartElementType<T> = IsTuple<T> extends true 
  ? TupleElement<T>  // For tuples, get first element
  : ArrayElement<T>; // For arrays, get element type

// Test cases
type Test1 = SmartElementType<[string, number, boolean]>; // string (first tuple element)
type Test2 = SmartElementType<string[]>; // string (array element type)
type Test3 = SmartElementType<readonly [1, 2, 3]>; // 1 (first tuple element)
```

### Advanced Pattern - Different Handling for Tuples vs Arrays:

```ts
type ProcessCollection<T> = T extends readonly [infer First, ...infer Rest]
  ? {
      type: 'tuple';
      firstElement: First;
      restElements: Rest;
      length: T['length'];
    }
  : T extends readonly (infer Element)[]
  ? {
      type: 'array';
      elementType: Element;
      length: number;
    }
  : never;

// Test cases
type TupleResult = ProcessCollection<[string, number, boolean]>;
// Result: { type: 'tuple'; firstElement: string; restElements: [number, boolean]; length: 3 }

type ArrayResult = ProcessCollection<string[]>;
// Result: { type: 'array'; elementType: string; length: number }
```

### Practical Example - API Response Handling:

```ts
type ApiResponse<T> = T extends readonly [infer First, ...infer Rest]
  ? {
      isTuple: true;
      firstItem: First;
      remainingItems: Rest;
      totalCount: T['length'];
    }
  : T extends readonly (infer Item)[]
  ? {
      isTuple: false;
      itemType: Item;
      isArray: true;
    }
  : never;

// Usage
type TupleResponse = ApiResponse<['user', 'admin', 'guest']>;
// Result: { isTuple: true; firstItem: 'user'; remainingItems: ['admin', 'guest']; totalCount: 3 }

type ArrayResponse = ApiResponse<string[]>;
// Result: { isTuple: false; itemType: string; isArray: true }
```

---

## 4. Why does inference sometimes produce `unknown`? How to tighten it?

**Answer:**

Inference produces `unknown` when TypeScript cannot determine a unique type from the given structure. This happens in several scenarios:

### Common Causes of `unknown` Inference:

```ts
// 1. Ambiguous inference from any
type Ambiguous1<T> = T extends (infer U)[] ? U : never;
type Result1 = Ambiguous1<any[]>; // unknown

// 2. Inference from generic without constraints
type Ambiguous2<T> = T extends Promise<infer U> ? U : never;
type Result2 = Ambiguous2<Promise<any>>; // unknown

// 3. Inference from union types
type Ambiguous3<T> = T extends (infer U)[] ? U : never;
type Result3 = Ambiguous3<(string | number)[]>; // string | number (not unknown, but can be improved)
```

### Strategies to Tighten Inference:

#### 1. Add Type Constraints:

```ts
// Before: Produces unknown
type LooseInference<T> = T extends (infer U)[] ? U : never;

// After: Constrained to specific types
type TightInference<T extends (string | number)[]> = T extends (infer U)[] ? U : never;

type Test1 = TightInference<string[]>; // string
type Test2 = TightInference<number[]>; // number
// type Test3 = TightInference<boolean[]>; // Error: Type 'boolean[]' is not assignable
```

#### 2. Use Conditional Constraints:

```ts
type SafeInference<T> = T extends (infer U)[] 
  ? U extends string | number | boolean 
    ? U 
    : 'unsupported-element-type'
  : never;

type Test1 = SafeInference<string[]>; // string
type Test2 = SafeInference<object[]>; // 'unsupported-element-type'
```

#### 3. Provide Default Types:

```ts
type WithDefault<T> = T extends (infer U)[] 
  ? U extends never 
    ? 'empty-array' 
    : U 
  : 'not-array';

type Test1 = WithDefault<string[]>; // string
type Test2 = WithDefault<never[]>; // 'empty-array'
type Test3 = WithDefault<number>; // 'not-array'
```

#### 4. Use Branded Types for Better Inference:

```ts
type BrandedString = string & { __brand: 'string' };
type BrandedNumber = number & { __brand: 'number' };

type BrandedInference<T> = T extends (infer U)[] 
  ? U extends BrandedString 
    ? 'string-array' 
    : U extends BrandedNumber 
    ? 'number-array' 
    : 'other-array'
  : never;
```

#### 5. Recursive Type Tightening:

```ts
type TightenInference<T> = T extends Promise<infer U>
  ? U extends Promise<any>
    ? TightenInference<U> // Recursively unwrap nested promises
    : U extends string | number | boolean
      ? U
      : 'unsupported-promise-type'
  : T extends (infer U)[]
    ? U extends string | number
      ? U
      : 'unsupported-array-element'
    : 'not-promise-or-array';

// Test cases
type Test1 = TightenInference<Promise<string>>; // string
type Test2 = TightenInference<Promise<Promise<number>>>; // number
type Test3 = TightenInference<string[]>; // string
type Test4 = TightenInference<Promise<object>>; // 'unsupported-promise-type'
```

### Real-world Example - API Response Type Safety:

```ts
type ApiResponse<T> = {
  data: T;
  status: 'success' | 'error';
  message: string;
};

type SafeDataExtraction<T> = T extends ApiResponse<infer D>
  ? D extends string | number | boolean | object
    ? D
    : 'unsupported-data-type'
  : 'not-api-response';

// Usage
type UserResponse = ApiResponse<{ id: number; name: string }>;
type ExtractedData = SafeDataExtraction<UserResponse>; // { id: number; name: string }

type InvalidResponse = ApiResponse<Function>;
type InvalidData = SafeDataExtraction<InvalidResponse>; // 'unsupported-data-type'
```

---

## 5. Use `infer` to extract the resolved type of nested promises/observables.

**Answer:**

Here are comprehensive examples of extracting resolved types from nested promises and observables:

### Nested Promise Unwrapping:

```ts
// Basic recursive promise unwrapping
type UnwrapPromise<T> = T extends Promise<infer U> ? UnwrapPromise<U> : T;

// Test cases
type Test1 = UnwrapPromise<Promise<string>>; // string
type Test2 = UnwrapPromise<Promise<Promise<number>>>; // number
type Test3 = UnwrapPromise<Promise<Promise<Promise<boolean>>>>; // boolean
type Test4 = UnwrapPromise<string>; // string (not a promise)

// With depth limit to prevent infinite recursion
type UnwrapPromiseWithLimit<T, Depth extends number = 10> = 
  Depth extends 0 
    ? T 
    : T extends Promise<infer U> 
      ? UnwrapPromiseWithLimit<U, Prev<Depth>>
      : T;

type Prev<T extends number> = T extends 0 ? never : T extends 1 ? 0 : T extends 2 ? 1 : T extends 3 ? 2 : never;

type Test5 = UnwrapPromiseWithLimit<Promise<Promise<Promise<string>>>>; // string
```

### Observable Type Extraction:

```ts
// Basic Observable type
type Observable<T> = {
  subscribe: (observer: (value: T) => void) => () => void;
};

// Extract Observable value type
type UnwrapObservable<T> = T extends Observable<infer U> ? U : never;

// Test cases
type Test1 = UnwrapObservable<Observable<string>>; // string
type Test2 = UnwrapObservable<Observable<number>>; // number

// Nested Observable unwrapping
type UnwrapNestedObservable<T> = T extends Observable<infer U>
  ? U extends Observable<any>
    ? UnwrapNestedObservable<U>
    : U
  : T;

type Test3 = UnwrapNestedObservable<Observable<Observable<string>>>; // string
```

### Advanced Promise Patterns:

```ts
// Extract from async function return type
type AsyncReturn<T> = T extends (...args: any[]) => Promise<infer R> ? R : never;

// Test cases
type Test1 = AsyncReturn<() => Promise<string>>; // string
type Test2 = AsyncReturn<(x: number) => Promise<boolean>>; // boolean

// Extract from Promise.all type
type PromiseAllResult<T extends readonly unknown[]> = T extends readonly [infer First, ...infer Rest]
  ? First extends Promise<infer F>
    ? [F, ...PromiseAllResult<Rest>]
    : [First, ...PromiseAllResult<Rest>]
  : [];

type Test3 = PromiseAllResult<[Promise<string>, Promise<number>, Promise<boolean>]>;
// Result: [string, number, boolean]
```

### Real-world Observable Patterns:

```ts
// RxJS-style Observable with operators
type RxObservable<T> = {
  pipe: <R>(...operators: any[]) => RxObservable<R>;
  subscribe: (observer: (value: T) => void) => () => void;
};

// Extract final type after pipe operations
type UnwrapPipedObservable<T> = T extends RxObservable<infer U> ? U : never;

// Chain extraction for complex observable chains
type ExtractObservableChain<T> = T extends RxObservable<infer U>
  ? U extends RxObservable<any>
    ? ExtractObservableChain<U>
    : U
  : T;

// Test cases
type Test1 = UnwrapPipedObservable<RxObservable<string>>; // string
type Test2 = ExtractObservableChain<RxObservable<RxObservable<number>>>; // number
```

### Advanced Nested Type Extraction:

```ts
// Extract from complex nested structures
type ComplexNested<T> = T extends Promise<Observable<infer U>>
  ? U
  : T extends Observable<Promise<infer U>>
  ? U
  : T extends Promise<infer U>
  ? U extends Observable<infer V>
    ? V
    : U
  : T extends Observable<infer U>
  ? U extends Promise<infer V>
    ? V
    : U
  : T;

// Test cases
type Test1 = ComplexNested<Promise<Observable<string>>>; // string
type Test2 = ComplexNested<Observable<Promise<number>>>; // number
type Test3 = ComplexNested<Promise<string>>; // string
type Test4 = ComplexNested<Observable<boolean>>; // boolean
```

### Practical API Response Example:

```ts
// API response with nested async operations
type ApiResponse<T> = Promise<{
  data: T;
  status: number;
  message: string;
}>;

type AsyncApiResponse<T> = Promise<Observable<ApiResponse<T>>>;

// Extract the final data type
type ExtractApiData<T> = T extends AsyncApiResponse<infer D>
  ? D
  : T extends ApiResponse<infer D>
  ? D
  : T extends Promise<infer D>
  ? D extends Observable<infer O>
    ? O extends ApiResponse<infer A>
      ? A
      : O
    : D
  : T;

// Usage
type UserApiResponse = AsyncApiResponse<{ id: number; name: string }>;
type UserData = ExtractApiData<UserApiResponse>; // { id: number; name: string }
```

### Error Handling in Type Extraction:

```ts
// Safe extraction with error handling
type SafeUnwrap<T, Fallback = never> = T extends Promise<infer U>
  ? U extends Promise<any>
    ? SafeUnwrap<U, Fallback>
    : U
  : T extends Observable<infer U>
  ? U extends Observable<any>
    ? SafeUnwrap<U, Fallback>
    : U
  : Fallback;

// Test cases
type Test1 = SafeUnwrap<Promise<string>>; // string
type Test2 = SafeUnwrap<Observable<number>>; // number
type Test3 = SafeUnwrap<string, 'not-async'>; // 'not-async'
type Test4 = SafeUnwrap<Promise<Observable<boolean>>>; // Observable<boolean>
```

These examples demonstrate how `infer` can be used to extract types from complex nested structures, making it possible to work with deeply nested async operations while maintaining type safety.


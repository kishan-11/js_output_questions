# Interview Questions: Conditional Types

## 1. Explain distributive conditional types and how to prevent distribution.

**Answer:**

Distributive conditional types occur when the checked type is a "naked" type parameter (not wrapped in any other type). TypeScript distributes the conditional type over each member of a union type.

```ts
// Distributive behavior
type ToArray<T> = T extends any ? T[] : never;
type Result = ToArray<string | number>; // string[] | number[]

// Step-by-step evaluation:
// 1. string extends any ? string[] : never → string[]
// 2. number extends any ? number[] : never → number[]
// 3. Final result: string[] | number[]
```

**How to prevent distribution:**
```ts
// Wrap the type parameter in square brackets
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type Result = ToArrayNonDist<string | number>; // (string | number)[]

// Other ways to prevent distribution:
type NonDist1<T> = T extends any ? T[] : never; // Still distributive
type NonDist2<T> = { t: T } extends { t: any } ? T[] : never; // Non-distributive
type NonDist3<T> = T[] extends any[] ? T[] : never; // Non-distributive
```

**Why this matters:**
- Distribution can lead to unexpected results when working with unions
- Sometimes you want to treat the union as a whole, not distribute over it
- Understanding this helps avoid subtle bugs in complex type transformations

---

## 2. What does `infer` do and where can it be used? Give two examples.

**Answer:**

The `infer` keyword allows you to extract and capture types from other types within conditional types. It's used to "infer" or deduce types from complex type structures.

**Key points:**
- Can only be used in the `extends` clause of conditional types
- Creates a new type variable that represents the inferred type
- Must be used in a position where TypeScript can determine the type

**Example 1: Extract function return type**
```ts
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Func1 = () => string;
type Func2 = (x: number) => boolean;

type Return1 = MyReturnType<Func1>; // string
type Return2 = MyReturnType<Func2>; // boolean
type Return3 = MyReturnType<string>; // never (not a function)
```

**Example 2: Extract array element type**
```ts
type MyElementType<T> = T extends (infer U)[] ? U : T;

type Array1 = string[];
type Array2 = number[];
type NonArray = string;

type Element1 = MyElementType<Array1>; // string
type Element2 = MyElementType<Array2>; // number
type Element3 = MyElementType<NonArray>; // string (not an array)
```

**Other common uses:**
```ts
// Extract promise type
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

// Extract function parameters
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// Extract constructor parameters
type ConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;
```

---

## 3. Implement `Awaited<T>` and `ElementType<T>`; discuss edge cases.

**Answer:**

**Awaited<T> Implementation:**
```ts
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

// Test cases:
type Test1 = Awaited<Promise<string>>; // string
type Test2 = Awaited<Promise<Promise<number>>>; // number
type Test3 = Awaited<string>; // string
type Test4 = Awaited<Promise<string | number>>; // string | number
```

**ElementType<T> Implementation:**
```ts
type ElementType<T> = T extends (infer U)[] ? U : T;

// Test cases:
type Test1 = ElementType<string[]>; // string
type Test2 = ElementType<number[]>; // number
type Test3 = ElementType<string>; // string
type Test4 = ElementType<(string | number)[]>; // string | number
```

**Edge Cases and Considerations:**

**For Awaited<T>:**
```ts
// Edge case 1: Nested promises
type Nested = Awaited<Promise<Promise<Promise<string>>>>; // string

// Edge case 2: Non-promise types
type NonPromise = Awaited<string>; // string

// Edge case 3: Union with promises
type Mixed = Awaited<string | Promise<number>>; // string | number

// Edge case 4: Never type
type NeverCase = Awaited<never>; // never

// Edge case 5: Any type
type AnyCase = Awaited<any>; // any
```

**For ElementType<T>:**
```ts
// Edge case 1: Non-array types
type NonArray = ElementType<string>; // string

// Edge case 2: Empty arrays
type EmptyArray = ElementType<[]>; // never

// Edge case 3: Tuple types
type Tuple = ElementType<[string, number]>; // string | number

// Edge case 4: Readonly arrays
type ReadonlyArray = ElementType<readonly string[]>; // string

// Edge case 5: Nested arrays
type NestedArray = ElementType<string[][]>; // string[]
```

**Improved implementations with better edge case handling:**
```ts
// More robust Awaited that handles edge cases
type Awaited<T> = 
  T extends Promise<infer U> 
    ? U extends Promise<any> 
      ? Awaited<U> 
      : U 
    : T;

// More robust ElementType
type ElementType<T> = 
  T extends readonly (infer U)[] 
    ? U 
    : T extends Array<infer U> 
      ? U 
      : T;
```

---

## 4. How would you build `XOR<A,B>` using conditional and mapped types?

**Answer:**

XOR (exclusive or) means "A or B, but not both". In TypeScript, this means a type that has properties from either A or B, but not from both.

**Implementation using conditional types:**
```ts
type XOR<A, B> = 
  (A extends B ? never : A) | 
  (B extends A ? never : B);

// Test cases:
type Test1 = XOR<{ a: string }, { b: number }>; // { a: string } | { b: number }
type Test2 = XOR<{ a: string }, { a: number }>; // never (conflicting properties)
type Test3 = XOR<{ a: string }, { b: number, c: boolean }>; // { a: string } | { b: number, c: boolean }
```

**More sophisticated XOR implementation:**
```ts
type XOR<A, B> = 
  | (A & { [K in keyof B]?: never })
  | (B & { [K in keyof A]?: never });

// This ensures that if you have a property from A, you can't have the same property from B
type Test1 = XOR<{ a: string }, { b: number }>; 
// Result: { a: string; b?: never } | { b: number; a?: never }

type Test2 = XOR<{ a: string }, { a: number }>; 
// Result: { a: string; a?: never } | { a: number; a?: never }
// This creates a type that's impossible to satisfy (a can't be both string and number)
```

**Alternative implementation using utility types:**
```ts
type XOR<A, B> = 
  | (A & { [K in keyof B]?: never })
  | (B & { [K in keyof A]?: never });

// Helper type to make properties required
type RequiredXOR<A, B> = Required<XOR<A, B>>;

// Test the implementation
interface User { name: string; age: number; }
interface Admin { name: string; permissions: string[]; }

type UserOrAdmin = XOR<User, Admin>;
// Result: (User & { permissions?: never }) | (Admin & { age?: never })
```

**Real-world example:**
```ts
// API response that's either success or error, but not both
type SuccessResponse = { data: any; success: true };
type ErrorResponse = { error: string; success: false };

type APIResponse = XOR<SuccessResponse, ErrorResponse>;

// This ensures you can't have both data and error properties
const response1: APIResponse = { data: "test", success: true }; // ✅
const response2: APIResponse = { error: "failed", success: false }; // ✅
// const response3: APIResponse = { data: "test", error: "failed", success: true }; // ❌ Error
```

---

## 5. Why might a conditional type be evaluated to `never` unexpectedly?

**Answer:**

There are several scenarios where conditional types can unexpectedly evaluate to `never`:

**1. Never type in the condition:**
```ts
type Problematic<T> = T extends never ? true : false;
type Test = Problematic<never>; // never (not true!)

// This happens because 'never' is the bottom type and doesn't extend anything
// The conditional type itself becomes 'never'
```

**2. Distributive behavior with never:**
```ts
type DistributiveNever<T> = T extends any ? T : never;
type Test = DistributiveNever<never>; // never

// When T is never, the distribution results in never
```

**3. Circular or infinite recursion:**
```ts
type Infinite<T> = T extends any ? Infinite<T> : never;
type Test = Infinite<string>; // never (due to infinite recursion)

// TypeScript gives up and returns 'never' to prevent infinite loops
```

**4. Impossible conditions:**
```ts
type Impossible<T> = T extends string & number ? T : never;
type Test = Impossible<any>; // never

// No type can be both string and number simultaneously
```

**5. Complex union distribution:**
```ts
type Complex<T> = T extends string ? T : T extends number ? T : never;
type Test = Complex<boolean>; // never

// When none of the conditions match, the result is 'never'
```

**6. Infer with impossible patterns:**
```ts
type BadInfer<T> = T extends (infer U)[] ? U : never;
type Test = BadInfer<string>; // never

// When the pattern doesn't match, infer fails and returns 'never'
```

**How to debug and fix:**

**1. Check for never in input:**
```ts
type SafeConditional<T> = [T] extends [never] ? never : T extends string ? T : never;
```

**2. Add fallback cases:**
```ts
type RobustConditional<T> = T extends string ? T : T extends number ? T : T;
// Always returns the original type as fallback
```

**3. Use type guards:**
```ts
type IsNever<T> = [T] extends [never] ? true : false;
type ConditionalWithGuard<T> = IsNever<T> extends true ? never : T extends string ? T : never;
```

**4. Test edge cases:**
```ts
// Always test with: never, any, unknown, union types, and complex types
type TestCases = [
  MyConditional<never>,
  MyConditional<any>,
  MyConditional<unknown>,
  MyConditional<string | number>,
  MyConditional<{ complex: { nested: string } }>
];
```

**Best practices to avoid unexpected `never`:**
1. Always provide meaningful fallback types
2. Test with edge cases (never, any, unknown)
3. Use square brackets to prevent distribution when needed
4. Avoid infinite recursion in recursive types
5. Be explicit about impossible conditions


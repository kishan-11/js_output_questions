# Function Overloads in TypeScript

## What are Function Overloads?

Function overloads allow you to define multiple function signatures for a single function implementation. They provide a way to express different parameter types and return types for the same function name, enabling better type safety and API ergonomics.

## Syntax and Rules

### Basic Syntax
```ts
// Overload signatures (declarations only)
function functionName(param1: type1): returnType1;
function functionName(param2: type2): returnType2;
// Implementation signature (actual function body)
function functionName(param: unionType): returnType {
  // implementation
}
```

### Key Rules
1. **Overload signatures first**: All overload signatures must come before the implementation
2. **Implementation signature last**: The final signature is the actual implementation
3. **Compatibility requirement**: The implementation signature must be compatible with all overload signatures
4. **No implementation in overloads**: Overload signatures cannot have function bodies
5. **Parameter count**: All overloads must have the same number of parameters

## Examples

### Basic Example
```ts
function len(x: string): number;
function len(x: any[]): number;
function len(x: string | any[]): number {
  return x.length;
}

// Usage
len("hello");     // Returns 5
len([1, 2, 3]);   // Returns 3
```

### Advanced Example - API with Different Parameter Types
```ts
function createElement(tag: string): HTMLElement;
function createElement(tag: string, props: Record<string, any>): HTMLElement;
function createElement(tag: string, props?: Record<string, any>): HTMLElement {
  const element = document.createElement(tag);
  if (props) {
    Object.assign(element, props);
  }
  return element;
}

// Usage
const div1 = createElement("div");
const div2 = createElement("div", { id: "myDiv", className: "container" });
```

### Method Overloads in Classes
```ts
class Calculator {
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  add(a: number | string, b: number | string): number | string {
    if (typeof a === "number" && typeof b === "number") {
      return a + b;
    }
    return `${a}${b}`;
  }
}
```

## When to Use Function Overloads

### ✅ Good Use Cases
1. **API ergonomics**: When you want different parameter types to return different types
2. **Builder patterns**: Different parameter combinations for object construction
3. **Library APIs**: Providing multiple ways to call the same function
4. **Type narrowing**: When you need specific return types based on input types

### ❌ When NOT to Use
1. **Simple generics suffice**: If generics can express the same functionality
2. **Overly complex**: When overloads make the API harder to understand
3. **Union types work**: When union types provide sufficient type safety

## Overloads vs Generics

### Use Overloads When:
```ts
// Different return types based on input types
function parse(input: string): string;
function parse(input: number): number;
function parse(input: string | number): string | number {
  return typeof input === "string" ? input.toUpperCase() : input * 2;
}
```

### Use Generics When:
```ts
// Same logic, different types
function identity<T>(value: T): T {
  return value;
}
```

## Common Patterns

### Builder Pattern
```ts
class QueryBuilder {
  select(fields: string): QueryBuilder;
  select(fields: string[]): QueryBuilder;
  select(fields: string | string[]): QueryBuilder {
    // implementation
    return this;
  }
  
  where(condition: string): QueryBuilder;
  where(condition: Record<string, any>): QueryBuilder;
  where(condition: string | Record<string, any>): QueryBuilder {
    // implementation
    return this;
  }
}
```

### Event Handler Overloads
```ts
function addEventListener(
  event: "click",
  handler: (event: MouseEvent) => void
): void;
function addEventListener(
  event: "keydown",
  handler: (event: KeyboardEvent) => void
): void;
function addEventListener(
  event: string,
  handler: (event: Event) => void
): void {
  // implementation
}
```

## Best Practices

1. **Keep overloads simple**: Avoid too many overloads (max 3-4)
2. **Clear parameter differences**: Make it obvious which overload will be called
3. **Documentation**: Document each overload's purpose
4. **Test all paths**: Ensure all overload combinations work correctly
5. **Consider alternatives**: Sometimes union types or generics are better

## Pitfalls to Avoid

1. **Ambiguous overloads**: When TypeScript can't determine which overload to use
2. **Implementation incompatibility**: When implementation doesn't match overload signatures
3. **Too many overloads**: Can make the API confusing
4. **Inconsistent behavior**: Different overloads should have similar semantics



# Interview Questions: TypeScript Decorators

## 1. Contrast legacy TS decorators vs TC39 decorators; build compatibility advice.

### Legacy TypeScript Decorators (Current)

**Characteristics:**
- Based on an older version of the decorators proposal
- More mature and widely supported
- Used by frameworks like Angular, NestJS, TypeORM
- Requires `experimentalDecorators: true`
- More flexible but non-standard

**Syntax:**
```typescript
function legacyDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // Decorator logic
}

class MyClass {
  @legacyDecorator
  method() {}
}
```

### TC39 Stage 3 Decorators (Future)

**Characteristics:**
- Newer standardized approach
- More limited but standardized
- Better performance
- Different syntax and capabilities
- Will eventually replace legacy decorators

**Syntax:**
```typescript
function tc39Decorator(value: any, context: DecoratorContext) {
  // Decorator logic
  return value;
}

class MyClass {
  @tc39Decorator
  method() {}
}
```

### Compatibility Advice

1. **For new projects**: Consider waiting for TC39 decorators to stabilize
2. **For existing projects**: Stick with legacy decorators for now
3. **Migration strategy**: Plan for eventual migration to TC39 decorators
4. **Framework considerations**: Angular/NestJS use legacy decorators extensively

## 2. Which compiler options are required and what do they emit?

### Required Compiler Options

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "target": "ES5"
  }
}
```

### What Each Option Does

**`experimentalDecorators: true`**
- Enables decorator syntax support
- Allows `@decorator` syntax
- Required for any decorator usage

**`emitDecoratorMetadata: true`**
- Emits type metadata for decorators
- Requires `reflect-metadata` package
- Enables runtime type information access
- Emits metadata like `design:type`, `design:paramtypes`, `design:returntype`

**`target: "ES5"`**
- Must be ES5 or higher for decorator support
- Decorators require ES5+ features

### What Gets Emitted

With `emitDecoratorMetadata: true`, TypeScript emits:

```typescript
// Input
class MyClass {
  @decorator
  method(param: string): number { return 1; }
}

// Emitted (simplified)
__decorate([
  decorator,
  __metadata("design:type", Function),
  __metadata("design:paramtypes", [String]),
  __metadata("design:returntype", Number)
], MyClass.prototype, "method", null);
```

## 3. How do you type a method/class decorator generically and preserve `this`?

### Generic Method Decorator with `this` Preservation

```typescript
// Generic method decorator that preserves 'this'
function logMethod<T extends (...args: any[]) => any>(
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> {
  const originalMethod = descriptor.value!;
  
  descriptor.value = function(this: any, ...args: Parameters<T>): ReturnType<T> {
    console.log(`Calling ${String(propertyKey)} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  } as T;
  
  return descriptor;
}

// Usage
class Calculator {
  @logMethod
  add(a: number, b: number): number {
    return a + b;
  }
  
  @logMethod
  multiply(a: number, b: number): number {
    return a * b;
  }
}
```

### Generic Class Decorator

```typescript
// Generic class decorator
function withTiming<T extends new (...args: any[]) => any>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      const start = performance.now();
      super(...args);
      const end = performance.now();
      console.log(`Constructor took ${end - start} milliseconds`);
    }
  };
}

// Usage
@withTiming
class MyClass {
  constructor(public name: string) {}
}
```

### Preserving `this` Context

```typescript
// Decorator that preserves 'this' context
function bindThis<T extends (...args: any[]) => any>(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> {
  const originalMethod = descriptor.value!;
  
  descriptor.value = function(this: any, ...args: Parameters<T>): ReturnType<T> {
    // 'this' is properly bound here
    return originalMethod.apply(this, args);
  } as T;
  
  return descriptor;
}
```

## 4. What are runtime and type-safety drawbacks of decorators vs composition?

### Runtime Drawbacks

**Performance Overhead:**
```typescript
// Decorators add runtime overhead
@logMethod
@validate
@cache
expensiveMethod() {
  // Each decorator adds function call overhead
}
```

**Memory Usage:**
- Decorators create additional function closures
- Metadata storage increases memory footprint
- Reflection metadata can be large

**Debugging Complexity:**
```typescript
// Hard to debug when decorators hide behavior
@complexDecorator
method() {
  // Stack traces become unclear
  // Hard to step through decorator logic
}
```

### Type-Safety Drawbacks

**Type Information Loss:**
```typescript
// Type information can be lost in complex decorators
function problematicDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // 'descriptor.value' loses original type information
  descriptor.value = function(...args: any[]) {
    // Return type is now 'any'
    return originalMethod.apply(this, args);
  };
}
```

**Generic Constraints:**
```typescript
// Hard to maintain generic constraints through decorators
class GenericClass<T> {
  @decorator // T is lost in decorator context
  method(value: T): T {
    return value;
  }
}
```

### Composition Advantages

**Explicit and Clear:**
```typescript
// Composition is more explicit
class Calculator {
  private addWithLogging = logMethod(this.add.bind(this));
  private addWithValidation = validateMethod(this.addWithLogging);
  
  add(a: number, b: number): number {
    return a + b;
  }
}
```

**Better Type Safety:**
```typescript
// Composition preserves types better
const loggedAdd = logMethod(add);
const validatedAdd = validateMethod(loggedAdd);
// Types are preserved through the chain
```

**Easier Testing:**
```typescript
// Easier to test individual pieces
const addFunction = (a: number, b: number) => a + b;
const loggedAdd = logMethod(addFunction);
// Can test addFunction and logMethod separately
```

## 5. How would you expose metadata types when using `reflect-metadata`?

### Basic Metadata Exposure

```typescript
import "reflect-metadata";

// Define metadata keys
const METADATA_KEYS = {
  DESIGN_TYPE: "design:type",
  DESIGN_PARAMTYPES: "design:paramtypes",
  DESIGN_RETURNTYPE: "design:returntype",
  CUSTOM: "custom:metadata"
} as const;

// Custom metadata decorator
function customMetadata(value: any) {
  return Reflect.metadata(METADATA_KEYS.CUSTOM, value);
}

// Type-safe metadata accessor
function getMetadata<T>(key: string, target: any, propertyKey?: string): T | undefined {
  return Reflect.getMetadata(key, target, propertyKey);
}

// Usage
class MyClass {
  @customMetadata("important")
  @logType
  public value: string;
  
  constructor(value: string) {
    this.value = value;
  }
}
```

### Advanced Metadata Types

```typescript
// Define metadata interfaces
interface MethodMetadata {
  name: string;
  returnType: Function;
  parameterTypes: Function[];
  customData?: any;
}

interface ClassMetadata {
  name: string;
  methods: Map<string, MethodMetadata>;
  properties: Map<string, any>;
}

// Metadata collector
class MetadataCollector {
  static collectClassMetadata(target: any): ClassMetadata {
    const methods = new Map<string, MethodMetadata>();
    const properties = new Map<string, any>();
    
    // Get all property names
    const propertyNames = Object.getOwnPropertyNames(target.prototype);
    
    for (const propName of propertyNames) {
      if (propName !== 'constructor') {
        const returnType = Reflect.getMetadata(METADATA_KEYS.DESIGN_RETURNTYPE, target.prototype, propName);
        const paramTypes = Reflect.getMetadata(METADATA_KEYS.DESIGN_PARAMTYPES, target.prototype, propName);
        const customData = Reflect.getMetadata(METADATA_KEYS.CUSTOM, target.prototype, propName);
        
        if (returnType || paramTypes) {
          methods.set(propName, {
            name: propName,
            returnType: returnType || Function,
            parameterTypes: paramTypes || [],
            customData
          });
        } else {
          const propType = Reflect.getMetadata(METADATA_KEYS.DESIGN_TYPE, target.prototype, propName);
          properties.set(propName, propType);
        }
      }
    }
    
    return {
      name: target.name,
      methods,
      properties
    };
  }
}
```

### Type-Safe Metadata Access

```typescript
// Type-safe metadata decorators
function typedMetadata<T>(key: string, value: T) {
  return function(target: any, propertyKey?: string) {
    Reflect.defineMetadata(key, value, target, propertyKey);
  };
}

// Type-safe metadata getter
function getTypedMetadata<T>(key: string, target: any, propertyKey?: string): T | undefined {
  return Reflect.getMetadata(key, target, propertyKey) as T | undefined;
}

// Usage with type safety
class ApiController {
  @typedMetadata("route", "/users")
  @typedMetadata("method", "GET")
  getUsers(): User[] {
    return [];
  }
}

// Type-safe metadata access
const route = getTypedMetadata<string>("route", ApiController.prototype, "getUsers");
const method = getTypedMetadata<string>("method", ApiController.prototype, "getUsers");
```

### Runtime Type Information

```typescript
// Expose runtime type information
function exposeTypeInfo(target: any, propertyKey: string) {
  const typeInfo = {
    name: propertyKey,
    type: Reflect.getMetadata(METADATA_KEYS.DESIGN_TYPE, target, propertyKey),
    parameterTypes: Reflect.getMetadata(METADATA_KEYS.DESIGN_PARAMTYPES, target, propertyKey),
    returnType: Reflect.getMetadata(METADATA_KEYS.DESIGN_RETURNTYPE, target, propertyKey)
  };
  
  console.log(`Type info for ${propertyKey}:`, typeInfo);
  return typeInfo;
}

// Usage
class Example {
  @exposeTypeInfo
  processData(input: string, count: number): boolean {
    return input.length > count;
  }
}
```

This comprehensive approach to metadata exposure provides type safety, runtime information, and clear patterns for working with decorator metadata in TypeScript.


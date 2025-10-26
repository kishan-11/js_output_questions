# TypeScript Decorators

## Overview

Decorators are a design pattern that allows you to add behavior to classes, methods, properties, or parameters at design time. TypeScript supports decorators through experimental features that are based on the ECMAScript decorators proposal.

## Configuration

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

- `experimentalDecorators`: Enables decorator support
- `emitDecoratorMetadata`: Emits type metadata for decorators (requires `reflect-metadata` package)
- `target`: Must be ES5 or higher for decorator support

## Types of Decorators

### 1. Class Decorators

Applied to class constructors. They can observe, modify, or replace class definitions.

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class BugReport {
  type = "report";
  title: string;
  
  constructor(t: string) {
    this.title = t;
  }
}
```

### 2. Method Decorators

Applied to method definitions. They can observe, modify, or replace method definitions.

```typescript
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

### 3. Accessor Decorators

Applied to getter/setter definitions.

```typescript
function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}

class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() { return this._x; }

  @configurable(false)
  get y() { return this._y; }
}
```

### 4. Property Decorators

Applied to property declarations.

```typescript
import "reflect-metadata";

const formatMetadataKey = Symbol("format");

function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}

class Greeter {
  @format("Hello, %s")
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }
}
```

### 5. Parameter Decorators

Applied to parameter declarations.

```typescript
import "reflect-metadata";

const requiredMetadataKey = Symbol("required");

function required(target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
  let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  let method = descriptor.value!;

  descriptor.value = function () {
    let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
    if (requiredParameters) {
      for (let parameterIndex of requiredParameters) {
        if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
          throw new Error("Missing required argument.");
        }
      }
    }
    return method.apply(this, arguments);
  };
}

class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }

  @validate
  print(@required verbose: boolean) {
    if (verbose) {
      return `type: ${this.type}\ntitle: ${this.title}`;
    } else {
      return this.title;
    }
  }
}
```

## Decorator Factories

Decorator factories are functions that return decorator functions:

```typescript
function color(value: string) {
  return function (target: any) {
    // this is the decorator
    target.color = value;
  };
}

@color("red")
class Car {}
```

## Metadata and Reflection

With `emitDecoratorMetadata: true`, TypeScript emits type metadata that can be accessed at runtime:

```typescript
import "reflect-metadata";

function logType(target: any, key: string) {
  const t = Reflect.getMetadata("design:type", target, key);
  console.log(`${key} type: ${t.name}`);
}

class Demo {
  @logType
  public attr1: string;
}
```

## Legacy vs TC39 Decorators

### TypeScript Legacy Decorators (Current)
- Based on an older version of the decorators proposal
- More mature and widely supported
- Used by frameworks like Angular, NestJS
- Requires `experimentalDecorators: true`

### TC39 Stage 3 Decorators (Future)
- Newer standard that's more limited but standardized
- Different syntax and capabilities
- Better performance
- Will eventually replace legacy decorators

## Common Use Cases

### 1. Logging
```typescript
function log(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyName} with args:`, args);
    return method.apply(this, args);
  };
}
```

### 2. Validation
```typescript
function validate(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = function (...args: any[]) {
    // Add validation logic
    return method.apply(this, args);
  };
}
```

### 3. Caching
```typescript
function cache(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  const cache = new Map();
  
  descriptor.value = function (...args: any[]) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = method.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

## Best Practices

1. **Use sparingly**: Decorators can make code harder to understand
2. **Prefer composition**: Consider if explicit composition would be clearer
3. **Document thoroughly**: Decorators can hide behavior
4. **Consider alternatives**: Higher-order functions, mixins, or explicit patterns
5. **Type safety**: Ensure decorators preserve type information

## Limitations

- Experimental feature (may change)
- Performance overhead
- Debugging complexity
- Limited browser support without compilation
- Type information can be lost in complex scenarios

## Dependencies

```bash
npm install reflect-metadata
```

```typescript
import "reflect-metadata";
```



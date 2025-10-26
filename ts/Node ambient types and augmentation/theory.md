# Node Ambient Types & Augmentation

## Overview
Node.js ambient types and augmentation are powerful TypeScript features that allow you to extend and modify existing type definitions, particularly for Node.js globals and third-party modules. This is essential for adding type safety to global variables and extending library types.

## Key Concepts

### 1. Ambient Types
Ambient types are type declarations that exist in the global scope without being imported. In Node.js, these include:
- `process` - Node.js process object
- `Buffer` - Node.js Buffer class
- `global` - Global object
- `console` - Console object
- `setTimeout`, `setInterval` - Timer functions
- `__dirname`, `__filename` - Module variables

### 2. @types/node Package
The `@types/node` package provides comprehensive TypeScript definitions for Node.js:
```bash
npm install --save-dev @types/node
```

This package includes:
- All Node.js built-in modules
- Global variables and functions
- Process environment types
- File system types
- Network and HTTP types

### 3. Module Augmentation
Module augmentation allows you to extend existing module types:

```typescript
// Extending Express Request interface
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
    };
  }
}

// Extending a third-party library
declare module 'some-library' {
  interface SomeInterface {
    newProperty: string;
  }
}
```

### 4. Global Augmentation
Global augmentation extends the global namespace:

```typescript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      DATABASE_URL: string;
    }
  }
  
  // Adding custom global variables
  var myGlobalVar: string;
  
  // Extending existing globals
  interface Window {
    myCustomProperty: string;
  }
}
```

## Practical Examples

### 1. Environment Variables
```typescript
// Augment process.env with specific types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      API_KEY: string;
    }
  }
}

// Now process.env has proper typing
const port = process.env.PORT; // string | undefined
const nodeEnv = process.env.NODE_ENV; // 'development' | 'production' | 'test' | undefined
```

### 2. Extending Express Types
```typescript
// types/express.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'admin' | 'user';
      };
      requestId: string;
    }
  }
}
```

### 3. Custom Global Variables
```typescript
// Adding custom globals
declare global {
  var __APP_VERSION__: string;
  var __BUILD_TIME__: string;
  
  function myGlobalFunction(): void;
}

// Usage
console.log(__APP_VERSION__);
myGlobalFunction();
```

### 4. Extending Node.js Built-ins
```typescript
// Extending Buffer
declare global {
  interface Buffer {
    toBase64(): string;
    fromBase64(base64: string): Buffer;
  }
}

// Implementation
Buffer.prototype.toBase64 = function() {
  return this.toString('base64');
};

Buffer.prototype.fromBase64 = function(base64: string) {
  return Buffer.from(base64, 'base64');
};
```

## Advanced Patterns

### 1. Conditional Augmentation
```typescript
// Only augment in development
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

// Conditional types based on environment
type Config = NodeJS.ProcessEnv['NODE_ENV'] extends 'development' 
  ? { debug: boolean; verbose: boolean }
  : { debug: false; verbose: false };
```

### 2. Module Merging with Namespaces
```typescript
// Original module
declare module 'my-module' {
  namespace MyModule {
    interface Config {
      apiUrl: string;
    }
  }
}

// Augmentation
declare module 'my-module' {
  namespace MyModule {
    interface Config {
      timeout: number;
      retries: number;
    }
  }
}
```

### 3. Augmenting with Generics
```typescript
declare global {
  interface Array<T> {
    groupBy<K extends keyof T>(key: K): Record<T[K], T[]>;
  }
}

// Implementation
Array.prototype.groupBy = function<T, K extends keyof T>(
  this: T[], 
  key: K
): Record<T[K], T[]> {
  return this.reduce((groups, item) => {
    const groupKey = item[key];
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<T[K], T[]>);
};
```

## Best Practices

### 1. File Organization
```
types/
├── global.d.ts          # Global augmentations
├── express.d.ts         # Express-specific augmentations
├── custom.d.ts          # Custom type definitions
└── modules/             # Module-specific augmentations
    ├── lodash.d.ts
    └── moment.d.ts
```

### 2. Naming Conventions
```typescript
// Use descriptive namespaces
declare global {
  namespace MyApp {
    interface Config {
      // app-specific config
    }
  }
}

// Use consistent prefixes
declare global {
  var __MY_APP__: {
    version: string;
    buildTime: string;
  };
}
```

### 3. Type Safety
```typescript
// Always provide proper types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Use union types for known values
      NODE_ENV: 'development' | 'production' | 'test';
      
      // Use string for unknown values
      CUSTOM_VAR: string;
      
      // Use optional for non-required vars
      OPTIONAL_VAR?: string;
    }
  }
}
```

### 4. Documentation
```typescript
/**
 * Global augmentation for custom environment variables
 * @see https://docs.example.com/env-vars
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Database connection string */
      DATABASE_URL: string;
      
      /** JWT secret for authentication */
      JWT_SECRET: string;
      
      /** API rate limit per minute */
      RATE_LIMIT?: string;
    }
  }
}
```

## Common Use Cases

### 1. API Response Types
```typescript
declare global {
  namespace Express {
    interface Response {
      success<T>(data: T): Response;
      error(message: string, code?: number): Response;
    }
  }
}
```

### 2. Database Models
```typescript
declare global {
  namespace Express {
    interface Request {
      db: {
        user: UserModel;
        post: PostModel;
      };
    }
  }
}
```

### 3. Authentication
```typescript
declare global {
  namespace Express {
    interface Request {
      auth: {
        user: User;
        token: string;
        permissions: string[];
      };
    }
  }
}
```

## Troubleshooting

### 1. Type Conflicts
```typescript
// Use module augmentation instead of global when possible
declare module 'express' {
  interface Request {
    user?: User;
  }
}
```

### 2. Import Issues
```typescript
// Ensure proper imports in augmentation files
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      // augmentation
    }
  }
}
```

### 3. Declaration Merging
```typescript
// Be careful with declaration merging
interface MyInterface {
  prop1: string;
}

// This will merge with the above
interface MyInterface {
  prop2: number;
}

// Result: { prop1: string; prop2: number; }
```

## Summary

Node ambient types and augmentation are essential for:
- Adding type safety to global variables
- Extending third-party library types
- Creating custom global interfaces
- Maintaining type consistency across large applications

Key takeaways:
- Use `@types/node` for Node.js type definitions
- Leverage module augmentation for library extensions
- Use global augmentation sparingly and with proper namespacing
- Follow consistent naming conventions
- Document your augmentations for team clarity




# TypeScript: Index Signatures

**Index signatures** allow you to define the shape of objects that **don’t have a predefined set of property names**. They are useful when working with **dynamic or unknown keys**.

---

## 🔹 1. What Is an Index Signature?

An index signature lets you specify **what type of key** and **what type of value** an object can have:

```ts
interface StringMap {
  [key: string]: string;
}

const labels: StringMap = {
  title: "Hello",
  subtitle: "World"
};
```

- The `[key: string]` part is the **index signature**.
- It means any string key is allowed, and the value must be a string.

---

## 🔹 2. Key Types: `string` vs `number`

You can use `string` or `number` as the key type:

```ts
interface NumberArray {
  [index: number]: number;
}

const arr: NumberArray = [1, 2, 3];
```

- Array indices are numeric keys, so `number` index signatures are common in typed arrays.

---

## 🔹 3. Mixed Known + Index Keys

You can mix fixed properties and an index signature, but the value type must be compatible:

```ts
interface Dictionary {
  [key: string]: string;
  title: string; // ✅ must be a string (same as index value type)
}
```

```ts
interface Invalid {
  [key: string]: string;
  age: number; // ❌ Error: number is not assignable to string
}
```

> All fixed properties must match the **index signature's value type** or be a subtype.

---

## 🔹 4. Index Signature with `number` is a subtype of `string`

```ts
interface Mixed {
  [x: string]: string;
  [x: number]: string;
}
```

- Numeric keys are converted to strings at runtime.
- So `[number]: T` must be assignable to `[string]: T`.

---

## 🔹 5. Use Cases

- Dictionary-like objects
- Config maps
- JSON responses
- Dynamic key-value pairs

### Example:

```ts
interface ErrorMessages {
  [fieldName: string]: string;
}

const errors: ErrorMessages = {
  username: "Username is required",
  email: "Email is invalid"
};
```

---

## 🔹 6. Optional Index Signature with `Record`

Sometimes, you can use `Record<K, V>` as a shortcut:

```ts
type ErrorMessages = Record<string, string>;
```

Equivalent to:

```ts
interface ErrorMessages {
  [key: string]: string;
}
```

---

## 🔹 7. Index Signature with Union Types

```ts
interface StatusMap {
  [status: string]: "success" | "error" | "pending";
}

const result: StatusMap = {
  login: "success",
  logout: "pending"
};
```

---

## 🔚 Summary

| Feature                  | Description                                       |
|--------------------------|---------------------------------------------------|
| Index signature syntax   | `[key: string]: Type` or `[index: number]: Type`  |
| Flexible property names  | Accepts any unknown key                          |
| Key types allowed        | `string` or `number` (not `boolean` or `symbol`) |
| Use case                 | Dictionaries, maps, dynamic data models          |
| Shortcut                 | `Record<K, V>` utility type                      |

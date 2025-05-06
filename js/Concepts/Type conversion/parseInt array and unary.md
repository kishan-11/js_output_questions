# JavaScript Type Conversion: `+`, `Number()`, and `parseInt()`

In JavaScript, there are several ways to convert a value to a number. Three common methods are:

- Unary plus operator: `+<variable>`
- `Number(<variable>)`
- `parseInt(<variable>)`

Each behaves differently depending on the input.

---

## 1. Unary Plus (`+<variable>`)

The unary plus operator attempts to convert the operand into a number.

### Behavior:

- Converts strings to numbers (only if the entire string is numeric)
- Converts booleans: `true` to `1`, `false` to `0`
- Converts `null` to `0`, `undefined` to `NaN`

### Examples:

```js
+"42" + // 42
  "42abc" + // NaN
  true + // 1
  false + // 0
  null + // 0
  undefined + // NaN
  ""; // 0
```

---

## 2. `Number()`

`Number()` is a function that also converts values to numbers, using similar internal logic to unary plus.

### Behavior:

- Performs full-string validation for strings
- Converts booleans and null similarly to unary plus

### Examples:

```js
Number("42"); // 42
Number("42abc"); // NaN
Number(true); // 1
Number(null); // 0
Number(undefined); // NaN
Number(""); // 0
```

---

## 3. `parseInt()`

`parseInt()` parses a string and returns an integer. It parses as much as it can from the beginning of the string.

### Behavior:

- Stops parsing at first invalid character
- Ignores trailing characters after a valid number prefix
- Requires a string or string-coercible input
- Accepts an optional radix parameter

### Examples:

```js
parseInt("42"); // 42
parseInt("42abc"); // 42
parseInt("abc42"); // NaN
parseInt("08", 10); // 8
parseInt(true); // NaN
```

---

## Summary Table

| Input     | `+value` | `Number(value)` | `parseInt(value)` |
| --------- | -------- | --------------- | ----------------- |
| `"42"`    | `42`     | `42`            | `42`              |
| `"42abc"` | `NaN`    | `NaN`           | `42`              |
| `"abc42"` | `NaN`    | `NaN`           | `NaN`             |
| `true`    | `1`      | `1`             | `NaN`             |
| `null`    | `0`      | `0`             | `NaN`             |
| `""`      | `0`      | `0`             | `NaN`             |

---

## When to Use

- Use `+` or `Number()` when strict conversion to a number is needed.
- Use `parseInt()` when extracting a numeric prefix from a string.

---

This guide helps you understand the differences between these conversion methods and choose the right one for your use case.

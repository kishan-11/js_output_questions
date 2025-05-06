
# Regular Expressions (RegEx) in JavaScript

Regular Expressions are patterns used to match character combinations in strings.

---

## 🔹 What is RegEx?

- Used for **searching**, **validating**, **extracting**, or **replacing** text.
- Built-in support via `RegExp` and string methods like `.test()`, `.match()`, `.replace()`, etc.

---

## 🔹 How to Create a RegEx

### Literal Syntax
```javascript
const pattern = /hello/;
```

### Constructor Syntax
```javascript
const pattern = new RegExp("hello");
```

---

## 🔹 Common Methods

| Method    | Description                          |
|-----------|--------------------------------------|
| `test()`  | Returns true/false if pattern matches |
| `match()` | Returns matched parts                |
| `replace()` | Replaces matched parts             |
| `exec()`  | Returns match result or null         |

---

## 🔹 Basic Symbols

| Symbol  | Meaning                         | Example             |
|---------|----------------------------------|---------------------|
| `.`     | Any character except newline     | `/h.llo/` → hello   |
| `^`     | Start of string                  | `/^hi/`             |
| `$`     | End of string                    | `/end$/`            |
| `*`     | 0 or more repetitions            | `/a*/`              |
| `+`     | 1 or more repetitions            | `/a+/`              |
| `?`     | 0 or 1 (optional)                | `/colou?r/`         |
| `[]`    | Character set                    | `/[aeiou]/`         |
| `[^]`   | Negated character set            | `/[^0-9]/`          |
| `{n}`   | Exactly n repetitions            | `/a{3}/`            |
| `|`     | OR                               | `/cat|dog/`         |
| `\`    | Escape special characters        | `/\d/`             |

---

## 🔹 Character Classes

| Pattern | Matches             |
|---------|---------------------|
| `\d`   | Digit (0–9)         |
| `\D`   | Non-digit           |
| `\w`   | Word character      |
| `\W`   | Non-word character  |
| `\s`   | Whitespace          |
| `\S`   | Non-whitespace      |

---

## 🔹 Useful Examples

### Validate Email
```javascript
const emailPattern = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
console.log(emailPattern.test("user@example.com")); // true
```

### Check if String is a Number
```javascript
const numberPattern = /^\d+$/;
console.log(numberPattern.test("12345")); // true
```

### Extract Hashtags
```javascript
const text = "Loving #JavaScript and #regex!";
const hashtags = text.match(/#\w+/g);
console.log(hashtags); // ["#JavaScript", "#regex"]
```

### Match Phone Number
```javascript
const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
console.log(phonePattern.test("(123) 456-7890")); // true
```

### Replace All Digits
```javascript
const result = "My pin is 1234".replace(/\d/g, "*");
console.log(result); // "My pin is ****"
```

---

## ⚠️ Common Pitfalls

| Issue                        | Why it's a problem                                |
|-----------------------------|---------------------------------------------------|
| Greedy matching             | `.*` can overmatch – use `.*?` for lazy match     |
| Forgetting to escape chars  | e.g. `.` or `?` – use `\.` to match a literal dot |
| Overly complex patterns     | Reduce complexity for maintainability             |
| ReDoS risk                  | Poor patterns can cause performance issues        |


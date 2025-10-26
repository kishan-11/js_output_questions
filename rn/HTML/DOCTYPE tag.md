# `<!DOCTYPE html>` Explained

## What is `<!DOCTYPE html>`?
The `<!DOCTYPE html>` declaration is used to tell the web browser what version of HTML the document is written in. It must appear at the very top of the HTML document, before the `<html>` tag.

### Purpose
- Ensures the browser renders the page in **standards mode**.
- Helps maintain consistent rendering across different browsers.
- Not an HTML tag — it's an instruction to the browser.

## HTML5 Doctype (Recommended)
```html
<!DOCTYPE html>
```
- **Case-insensitive** (e.g., `<!doctype html>` is valid).
- Activates HTML5 **standards mode**.
- **Recommended** for all modern web development.

---

## Legacy Doctypes
### HTML 4.01

#### Strict
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
  "http://www.w3.org/TR/html4/strict.dtd">
```
- No deprecated tags (like `<font>` or `<center>`).

#### Transitional
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
  "http://www.w3.org/TR/html4/loose.dtd">
```
- Allows deprecated tags/attributes for backward compatibility.

#### Frameset
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN"
  "http://www.w3.org/TR/html4/frameset.dtd">
```
- Used for documents with `<frameset>` instead of `<body>`.

---

### XHTML 1.0 / 1.1

#### XHTML 1.0 Strict
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

#### XHTML 1.0 Transitional
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```

#### XHTML 1.0 Frameset
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```

#### XHTML 1.1
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
  "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
```

---

## Summary Table

| Standard      | Doctype Declaration (Shortened)              | Use Today? |
|---------------|----------------------------------------------|------------|
| HTML5         | `<!DOCTYPE html>`                            | ✅ Yes      |
| HTML 4.01     | `Strict`, `Transitional`, `Frameset`         | ❌ No       |
| XHTML 1.0/1.1 | Multiple versions with XML-style syntax      | ❌ No       |

For **modern web development**, always use:
```html
<!DOCTYPE html>

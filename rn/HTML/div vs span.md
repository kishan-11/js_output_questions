# `<div>` vs `<span>`

## 🔹 `<div>` – Block-level element
- Display: `block`
- Starts on a new line and takes full width.
- Used to group large blocks of content.

```html
<div>
  <h2>Article Title</h2>
  <p>This is a paragraph inside a div block.</p>
</div>
```

---

## 🔹 `<span>` – Inline-level element
- Display: `inline`
- Does not start on a new line, takes only as much space as needed.
- Used to style or group small text portions inline.

```html
<p>This is a <span style="color: red;">highlighted</span> word.</p>
```

---

## ⚖️ Comparison Table

| Feature            | `<div>` (Block)             | `<span>` (Inline)           |
|--------------------|-----------------------------|-----------------------------|
| Display type       | Block                       | Inline                      |
| Breaks to new line | Yes                         | No                          |
| Default width      | Full width                  | As much as content needs    |
| Typical use        | Layout, containers          | Styling, inline content     |
| Can contain block? | ✅ Yes                      | ❌ No (only inline content) |
| Style flexibility  | Great for layout & spacing  | Great for inline formatting |

---

## 🔧 CSS Note
You can override behavior using CSS:
```css
span {
  display: block;
}

div {
  display: inline;
}
```

---


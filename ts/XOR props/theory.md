## Conditional Prop Requirements (XOR)

Pattern:
```ts
type Without<T, K> = { [P in Exclude<keyof T, keyof K>]?: never }
type XOR<A, B> = (A | B) extends object ? (Without<A, B> & B) | (Without<B, A> & A) : A | B
```

Use cases:
- Exactly one of multiple config options must be provided



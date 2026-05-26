# SentientSearchBar

A search input that ignores reality and autocompletes with absurd,
template-driven suggestions. Every fifth query's top option gets a "judgmental"
side-eye icon, and occasionally a thought bubble appears with self-aware
commentary ("I'm making these up, you know."). Fully keyboard-navigable as a
proper combobox.

## Props

| Prop          | Type                       | Default                  | Description                                                   |
| ------------- | -------------------------- | ------------------------ | ------------------------------------------------------------- |
| `placeholder` | `string`                   | `'Search for anything'`  | Input placeholder.                                            |
| `onSearch`    | `(query: string) => void`  | —                        | Fired when a suggestion is chosen or Enter is pressed.        |
| `templates`   | `string[]`                 | built-in pool            | Override the template pool. Use `{input}` as the placeholder. |

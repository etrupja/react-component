# SentientSearchBar

A search input that doesn't actually search anything — it autocompletes with
absurd, self-aware suggestions generated from your input. Every fifth query
gets a side-eye on its top suggestion. Occasionally a thought bubble appears
to remind you that none of this is real.

## Installation

```bash
npm install framer-motion
```

## Basic usage

```tsx
import SentientSearchBar from '@/components/SentientSearchBar';

function App() {
  return <SentientSearchBar onSearch={(q) => console.log(q)} />;
}
```

## Props

| Prop          | Type                       | Default                  | Description                                       |
| ------------- | -------------------------- | ------------------------ | ------------------------------------------------- |
| `placeholder` | `string`                   | `'Search for anything'`  | Input placeholder.                                |
| `onSearch`    | `(query: string) => void`  | —                        | Fired when a suggestion is chosen or Enter is hit. |
| `templates`   | `string[]`                 | built-in pool of ~15     | Override the template pool. Use `{input}` as the placeholder. |

## Common patterns

### Pattern 1: custom templates

```tsx
<SentientSearchBar
  templates={[
    'how to {input} (gracefully)',
    '{input} for mobile-first humans',
    'the deprecated way to {input}',
  ]}
/>
```

### Pattern 2: hook into your real search

```tsx
<SentientSearchBar onSearch={(q) => router.push(`/search?q=${q}`)} />
```

The component does no actual searching — `onSearch` is your bridge to whatever
real backend you have.

## Gotchas

- Suggestions are regenerated on every debounced query (200ms). If you type
  fast, you'll only see the suggestions for the *final* pause.
- The "judgmental" side-eye fires on every 5th distinct query, not every 5th
  keystroke. Spam-pressing one key will not increment the judgment counter
  past the first query change.
- Thoughts appear with ~18% probability per query, so don't expect them every
  time.

## Accessibility

- The dropdown is a true `combobox` + `listbox`: arrow keys move the highlight,
  Enter selects, Escape closes.
- `aria-activedescendant` is set so screen readers announce the currently
  highlighted option without moving DOM focus.
- The thought bubble is decorative — it doesn't steal focus or rely on color
  alone to communicate.
- Animations honor `prefers-reduced-motion`.

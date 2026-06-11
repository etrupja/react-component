# PassiveAggressiveSpinner

A loading spinner that starts polite and ends up openly resentful. Status
text escalates through configurable stages, the arc color shifts from calm
blue to furious rose, and the rotation slows down as the spinner loses the
will to spin. After the final stage it mutters salty one-liners on a loop.
The retry button resets the timer and counts how many times you fell for it.

## Installation

```bash
npm install framer-motion
```

## Basic usage

```tsx
import PassiveAggressiveSpinner from '@/components/PassiveAggressiveSpinner';

function App() {
  return <PassiveAggressiveSpinner />;
}
```

## Props

| Prop         | Type                             | Default            | Description                                                |
| ------------ | -------------------------------- | ------------------ | ---------------------------------------------------------- |
| `stages`     | `{ at: number; text: string }[]` | 4 stages, 0–30s    | Escalation messages and when (ms elapsed) they kick in.    |
| `mutterings` | `string[]`                       | 4 salty remarks    | Messages rotated endlessly after the last stage.           |
| `size`       | `number`                         | `48`               | Spinner diameter in px.                                    |

## Common patterns

### Pattern 1: faster demo

```tsx
<PassiveAggressiveSpinner
  stages={[
    { at: 0, text: 'Loading…' },
    { at: 4_000, text: 'Still loading. No rush.' },
    { at: 8_000, text: 'Taking its sweet time, apparently.' },
    { at: 14_000, text: 'I mean, YOU try fetching this data.' },
  ]}
/>
```

Compresses the full meltdown to ~25 seconds — useful for demos.

### Pattern 2: on-brand salt

```tsx
<PassiveAggressiveSpinner
  mutterings={[
    'Your dashboard is doing its best.',
    'Blame the analytics service.',
    'This is a feature, not a bug.',
  ]}
/>
```

## Gotchas

- The spinner never resolves on its own — it's a loading indicator, not a
  loader. Unmount it when your data arrives, as you would any spinner.
- The retry button only resets the escalation timer (and increments the
  retry counter). Wire your actual retry logic around the component.
- Elapsed time is sampled every 500ms, so stage transitions can land up to
  half a second late. The spinner does not apologize for this.

## Accessibility

- The spinner has `role="status"` with an `aria-label` that includes the
  current message.
- Message changes are announced via an `aria-live="polite"` region.
- Rotation is fully disabled when `prefers-reduced-motion: reduce` is set;
  the text escalation (color and copy) still conveys the state.

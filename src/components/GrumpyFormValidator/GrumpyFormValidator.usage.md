# GrumpyFormValidator

A login form whose error messages get progressively more annoyed at typos. It
escalates from polite hints through passive-aggressive ellipsis to outright
disgust, complete with a runaway submit button and a green-to-red annoyance
meter.

## Installation

```bash
npm install framer-motion
```

## Basic usage

```tsx
import GrumpyFormValidator from '@/components/GrumpyFormValidator';

function App() {
  return <GrumpyFormValidator onSuccess={() => console.log('logged in')} />;
}
```

## Props

| Prop            | Type           | Default | Description                                                  |
| --------------- | -------------- | ------- | ------------------------------------------------------------ |
| `onSuccess`     | `() => void`   | —       | Fired when the form is submitted with valid email + password. |
| `maxAnnoyance`  | `number`       | `5`     | Number of mistakes before the form reaches maximum grumpiness. |

## Common patterns

### Pattern 1: tune the patience

```tsx
<GrumpyFormValidator maxAnnoyance={3} />
```

A lower threshold makes the form snap faster — useful for demos or comedic effect.

### Pattern 2: hook into auth

```tsx
<GrumpyFormValidator
  onSuccess={() => router.push('/dashboard')}
/>
```

The component validates on the client only; treat `onSuccess` as a UI signal and
do the real authentication in your handler.

## Gotchas

- The dodging submit button only kicks in past `mistakeCount >= 3` and is
  automatically disabled when `prefers-reduced-motion` is set. Don't rely on it
  for keyboard users — they can always submit via `Enter`.
- The "sorry" easter egg matches any field containing the substring (case
  insensitive). If you don't want this behavior, fork the component.
- The annoyance counter increments at most once per unique invalid input — so
  rapidly retyping the same wrong thing won't double-count.

## Accessibility

- Inputs have visible, associated `<label>` elements.
- The error region uses `role="status"` with `aria-live="polite"` so screen
  readers announce escalating messages without interrupting.
- The annoyance meter exposes `role="progressbar"` with `aria-valuenow` /
  `aria-valuemax`.
- All animations honor `prefers-reduced-motion`.

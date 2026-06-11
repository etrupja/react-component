# GuiltTripModal

A confirm dialog that takes rejection personally. Hovering the Cancel button
raises its sadness level (0–3): the face droops, tears well up, the Cancel
label loses confidence, and a guilt line appears below the message. Every
actual cancel is counted and persisted to `localStorage`, so the dialog
greets repeat abandoners with their statistics. Confirming closes it with
quiet dignity.

## Installation

```bash
npm install framer-motion
```

## Basic usage

```tsx
import GuiltTripModal from '@/components/GuiltTripModal';

function App() {
  return <GuiltTripModal onConfirm={() => deleteAccount()} />;
}
```

## Props

| Prop           | Type         | Default                  | Description                                              |
| -------------- | ------------ | ------------------------ | -------------------------------------------------------- |
| `triggerLabel` | `string`     | `'Delete account'`       | Label of the button that opens the modal.                |
| `title`        | `string`     | `'Are you absolutely sure?'` | Dialog heading.                                      |
| `message`      | `string`     | dramatic default         | Dialog body text.                                        |
| `onConfirm`    | `() => void` | —                        | Called when the user confirms.                           |
| `storageKey`   | `string`     | `'guilt-trip-abandons'`  | localStorage key for the abandonment counter.            |

## Common patterns

### Pattern 1: custom copy

```tsx
<GuiltTripModal
  triggerLabel="Unsubscribe"
  title="Leaving so soon?"
  message="We'll only email you 14 more times about it."
  onConfirm={() => unsubscribe()}
/>
```

### Pattern 2: separate counters per dialog

Give each instance its own `storageKey` so their emotional baggage doesn't mix:

```tsx
<GuiltTripModal storageKey="guilt-delete-account" />
<GuiltTripModal storageKey="guilt-cancel-subscription" />
```

## Gotchas

- Clicking the backdrop or pressing Escape counts as an abandonment. The
  dialog is keeping score, after all.
- Sadness resets every time the modal opens — it's emotionally volatile,
  not permanently scarred. Only the abandonment count persists.
- The overlay uses `position: fixed`, so it covers the whole viewport even
  when the trigger lives deep in your layout.

## Accessibility

- The dialog has `role="dialog"`, `aria-modal="true"`, and is labelled by
  its title. Focus moves into the dialog on open and back to the trigger on
  close.
- Escape closes the dialog (and yes, still hurts its feelings).
- Guilt lines are announced via an `aria-live="polite"` region.
- Entry/exit motion and the Cancel button's sad droop are reduced to simple
  fades when `prefers-reduced-motion: reduce` is set.

# TrustFallButton

A destructive-action button that you confirm by pressing and holding. While
you hold, a progress ring fills around the button, it shakes with rising
amplitude, sweat drops fall, and a tiny speech bubble panics at you. Release
early and it exhales a relieved "Phew." Release at 100% and it flashes,
screams "It is done.", and fires `onConfirm`.

## Installation

```bash
npm install framer-motion
```

## Basic usage

```tsx
import TrustFallButton from '@/components/TrustFallButton';

function App() {
  return (
    <TrustFallButton
      label="Delete everything"
      onConfirm={() => api.dropEverything()}
    />
  );
}
```

## Props

| Prop           | Type                       | Default              | Description                                              |
| -------------- | -------------------------- | -------------------- | -------------------------------------------------------- |
| `label`        | `string`                   | `'Delete everything'`| Button label.                                            |
| `holdDuration` | `number` (ms)              | `2500`               | How long to hold before `onConfirm` fires.              |
| `onConfirm`    | `() => void`               | —                    | Fired when the hold completes.                          |
| `variant`      | `'danger' \| 'warning'`    | `'danger'`           | Color treatment.                                         |

## Common patterns

### Pattern 1: snappier confirm for "soft" destructive actions

```tsx
<TrustFallButton
  label="Discard draft"
  variant="warning"
  holdDuration={1200}
  onConfirm={discardDraft}
/>
```

### Pattern 2: pair with a secondary cancel

The button doesn't need an external Cancel — releasing it cancels. But if your
UX expects a paired button, just render one beside it; the trust fall ignores
clicks elsewhere.

```tsx
<div className="flex gap-3">
  <button onClick={onCancel}>Cancel</button>
  <TrustFallButton label="Delete user" onConfirm={onDelete} />
</div>
```

## Gotchas

- The button uses Pointer Events with `setPointerCapture`, so the gesture
  survives the cursor leaving the button. It is cancelled on `pointerup`,
  `pointerleave`, and `pointercancel`.
- After confirm or early release, the button auto-resets (1.2–2s later) so it
  remains usable. If you want it to stay confirmed permanently, unmount it
  from your `onConfirm` callback.
- `onConfirm` fires synchronously inside the RAF tick that crosses 100%. If
  your handler is heavy, schedule the work yourself (e.g. `setTimeout(fn, 0)`).
- Shake and speech bubble animations are disabled under
  `prefers-reduced-motion`; the ring still fills so the confirmation gesture
  is unchanged.

## Accessibility

- The button has `aria-label="<label> — hold to confirm"` so screen readers
  describe the gesture, not just the destructive label.
- Speech bubbles are decorative — the underlying button label and aria-label
  describe the action. The progress ring is purely visual.
- All motion respects `prefers-reduced-motion`.
- Touch users get the same behavior as pointer users via Pointer Events.

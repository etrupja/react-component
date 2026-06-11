# DramaQueenToast

A toast system that has its priorities exactly backwards. Severity is
inverted: trivial info arrives as a shaking, siren-adorned emergency in
all caps; a success gets a sparkling monument to itself; a warning is
delivered with mild disinterest; and a real error is a tiny gray mumble.
Click a toast to acknowledge it. Let it expire and it sulks — shrinking
into the corner with "fine. it probably wasn't important anyway." — before
leaving and adding itself to your ignored count.

## Installation

```bash
npm install framer-motion
```

## Basic usage

```tsx
import DramaQueenToast from '@/components/DramaQueenToast';

function App() {
  return <DramaQueenToast />;
}
```

## Props

| Prop           | Type     | Default | Description                                              |
| -------------- | -------- | ------- | -------------------------------------------------------- |
| `duration`     | `number` | `5000`  | ms before an unacknowledged toast starts sulking.        |
| `sulkDuration` | `number` | `2500`  | ms a sulking toast lingers before leaving for good.      |

## Common patterns

### Pattern 1: faster demo

```tsx
<DramaQueenToast duration={3_000} sulkDuration={1_500} />
```

Toasts start sulking after 3 seconds — useful for demos.

### Pattern 2: maximum guilt

```tsx
<DramaQueenToast sulkDuration={8_000} />
```

Sulking toasts linger long enough that you have to watch them be sad.

## Gotchas

- This component is a self-contained demo stage: the trigger buttons and the
  toast area are part of it. For a real app you'd lift the `fire()` logic
  into your own toast manager and keep the drama table.
- Toasts render inside the component's bordered stage, not a portal — they
  won't float over the rest of your page.
- Each toast runs on two timers (expire, then sulk). All timers are cleaned
  up on unmount, mid-sulk or not.

## Accessibility

- The toast stage is an `aria-live="polite"` region, so new toasts are
  announced without interrupting.
- Each toast is a real `<button>` — keyboard users can Tab to it and
  acknowledge it with Enter/Space.
- The urgency shake and entry/exit motion are disabled when
  `prefers-reduced-motion: reduce` is set; the size/color hierarchy still
  carries the (inverted) drama.

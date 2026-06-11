# NosyStepper

A multi-step wizard that monitors your pacing and comments accordingly.
Advance in under the `rushed` threshold and it questions your reading
comprehension. Sit on a step past the `lingering` threshold and it nags
(once per step — it's nosy, not relentless). Going back triggers a gasp.
Completing the wizard fires confetti and a behavioral report: steps rushed
and gasps caused.

## Installation

```bash
npm install framer-motion canvas-confetti
```

## Basic usage

```tsx
import NosyStepper from '@/components/NosyStepper';

function App() {
  return <NosyStepper onComplete={() => console.log('done')} />;
}
```

## Props

| Prop         | Type                                  | Default                       | Description                                                  |
| ------------ | ------------------------------------- | ----------------------------- | ------------------------------------------------------------ |
| `steps`      | `{ title: string; content: string }[]` | 4 onboarding-parody steps    | The wizard steps.                                            |
| `pacing`     | `{ rushed: number; lingering: number }` (ms) | `{ 2000, 20000 }`      | Under `rushed` = judged for speed; over `lingering` = nagged. |
| `onComplete` | `() => void`                          | —                             | Called when the last step is finished.                       |

## Common patterns

### Pattern 1: your own steps

```tsx
<NosyStepper
  steps={[
    { title: 'Plan', content: 'Choose a plan you will outgrow immediately.' },
    { title: 'Billing', content: 'Enter the card you meant to cancel.' },
    { title: 'Confirm', content: 'Sign here. And here. And initial here.' },
  ]}
  onComplete={submitSignup}
/>
```

### Pattern 2: impatient demo

```tsx
<NosyStepper pacing={{ rushed: 3_000, lingering: 8_000 }} />
```

Nags about lingering after just 8 seconds — useful for demos.

## Gotchas

- Pacing judgments are cosmetic: rushing or lingering never blocks
  navigation. The stepper judges; it does not gatekeep.
- The linger nag fires at most once per step per run; restarting the wizard
  resets its memory (the personality stat, however, keeps the totals).
- Confetti is fired via `canvas-confetti` onto the document body. If your
  page uses `overflow: hidden` on a parent, particles past the edge are
  clipped.

## Accessibility

- The step indicator is an ordered list; the active step is marked with
  `aria-current="step"`.
- Pacing commentary is announced via an `aria-live="polite"` region.
- Step transitions reduce to simple fades when
  `prefers-reduced-motion: reduce` is set, and confetti is suppressed
  entirely.

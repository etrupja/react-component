# InteractiveProgressBar

A themed progress bar with three visual styles (Space, Nature, Minimal) and an
optional confetti burst when progress reaches 100%.

## Installation

```bash
npm install canvas-confetti
```

## Basic usage

```tsx
import { InteractiveProgressBar } from '@/components/InteractiveProgressBar';

function App() {
  const [progress, setProgress] = useState(0);

  return (
    <InteractiveProgressBar
      progress={progress}
      theme="space"
      showConfetti
      onComplete={() => console.log('done!')}
    />
  );
}
```

## Props

| Prop                | Type                                     | Default     | Description                                          |
| ------------------- | ---------------------------------------- | ----------- | ---------------------------------------------------- |
| `progress`          | `number` (0–100)                         | —           | Direct percentage. Takes priority over step props.   |
| `currentStep`       | `number`                                 | —           | Current step (used when `progress` is omitted).      |
| `totalSteps`        | `number`                                 | `1`         | Total steps for step-based progress.                 |
| `theme`             | `'space' \| 'nature' \| 'minimal'`       | `'minimal'` | Visual style.                                        |
| `showConfetti`      | `boolean`                                | `false`     | Fire a confetti burst when progress reaches 100%.    |
| `onComplete`        | `() => void`                             | —           | Called once when progress reaches 100%.              |
| `width`             | `string`                                 | `'100%'`    | CSS width.                                           |
| `height`            | `string`                                 | `'20px'`    | CSS height.                                          |
| `animationDuration` | `number` (ms)                            | `500`       | Fill animation duration.                             |

## Common patterns

### Pattern 1: percentage-driven

```tsx
<InteractiveProgressBar progress={uploadPercent} theme="space" showConfetti />
```

### Pattern 2: step-driven onboarding

```tsx
<InteractiveProgressBar
  currentStep={currentStep}
  totalSteps={5}
  theme="nature"
/>
```

## Gotchas

- If both `progress` and `currentStep` are provided, `progress` wins.
- `onComplete` fires on the transition from <100 to 100, not on every render
  where `progress === 100`. Reset to a lower value to re-arm.
- Confetti is rendered on the document body via a canvas overlay — make sure
  nothing in the layout has `pointer-events: none` rules that would interfere.

## Accessibility

- The progress bar exposes its current value visually but does not yet expose
  `role="progressbar"` semantics. If you use it in a flow that screen reader
  users depend on, wrap it with your own ARIA-labelled container.
- Respects `prefers-reduced-motion` for the fill transition.

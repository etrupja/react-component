# ProcrastinatorTodoList

A todo list where each task ages visibly. Fresh tasks sit politely. After a
while they wiggle, get a frowny face, then turn red and start complaining via
floating speech bubbles. Furious tasks float to the top so they keep nagging.
Completing a task waves goodbye and fires a small confetti burst at the
task's position. Tasks persist to `localStorage` so the procrastinator's
shame survives a refresh.

## Installation

```bash
npm install framer-motion canvas-confetti
```

## Basic usage

```tsx
import ProcrastinatorTodoList from '@/components/ProcrastinatorTodoList';

function App() {
  return <ProcrastinatorTodoList />;
}
```

## Props

| Prop            | Type                                                       | Default                         | Description                                                |
| --------------- | ---------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------- |
| `ageThresholds` | `{ stale: number; annoyed: number; furious: number }` (ms) | `{ 60000, 120000, 240000 }`     | When tasks transition between aging stages.                |
| `storageKey`    | `string`                                                   | `'procrastinator-todos'`        | localStorage key for persistence. Use unique keys per instance. |

## Common patterns

### Pattern 1: faster demo

```tsx
<ProcrastinatorTodoList
  ageThresholds={{ stale: 10_000, annoyed: 20_000, furious: 40_000 }}
/>
```

Compresses the aging cycle to ~40 seconds — useful for demos.

### Pattern 2: multiple instances on a page

Give each instance its own `storageKey` to avoid them stomping on each other:

```tsx
<ProcrastinatorTodoList storageKey="todos-work" />
<ProcrastinatorTodoList storageKey="todos-home" />
```

## Gotchas

- Aging is driven by a single 2s interval, not per-task timers. If the tab is
  backgrounded for hours, the next visible re-render snaps to the correct stage
  — visually a jump, but functionally correct.
- Confetti is fired via `canvas-confetti` onto the document body. If your page
  uses `overflow: hidden` on a parent, particles past the edge are clipped.
- localStorage writes happen on every task mutation. If you store thousands of
  tasks, batch your writes or move to a more durable store.

## Accessibility

- Each task has an associated `<label>` connected to its checkbox.
- The personality stat for screen readers is published via the surrounding
  showcase; consumers using this component standalone can read live counts
  from their own UI.
- Wiggle/shake animations honor `prefers-reduced-motion` (they're suppressed
  via CSS).
- Confetti is suppressed when `prefers-reduced-motion: reduce` is set.

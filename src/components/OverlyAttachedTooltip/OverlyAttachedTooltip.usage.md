# OverlyAttachedTooltip

A tooltip with an anxious attachment style. On hover it behaves like any
tooltip. On mouse leave it refuses to disappear: it springs off its anchor
and follows the cursor, wobbling and escalating from "wait—" to "please.
PLEASE." as you get further away. Once the cursor has travelled
`clinginess` pixels from the anchor, it accepts the breakup ("fine. go.")
and fades out. Returning your cursor to the anchor re-attaches it like
nothing happened.

## Installation

```bash
npm install framer-motion
```

## Basic usage

```tsx
import OverlyAttachedTooltip from '@/components/OverlyAttachedTooltip';

function App() {
  return <OverlyAttachedTooltip />;
}
```

## Props

| Prop         | Type        | Default                 | Description                                                  |
| ------------ | ----------- | ----------------------- | ------------------------------------------------------------ |
| `content`    | `string`    | a clingy default        | What the tooltip says while still behaving normally.         |
| `clinginess` | `number`    | `180`                   | How many px it chases the cursor before letting go.          |
| `children`   | `ReactNode` | a "Hover me" button     | The anchor element the tooltip is attached to.               |

## Common patterns

### Pattern 1: custom anchor

```tsx
<OverlyAttachedTooltip content="Deletes the file. Don't go.">
  <button className="btn-danger">Delete</button>
</OverlyAttachedTooltip>
```

### Pattern 2: extra clingy

```tsx
<OverlyAttachedTooltip clinginess={400} />
```

It will follow your cursor across most of the screen. Use responsibly.

## Gotchas

- The chase listens to `mousemove` on `window`, but only while clinging —
  there is no global listener when the tooltip is hidden or attached.
- The chasing tooltip is positioned relative to the component's container,
  so if the cursor leaves the container the tooltip can hit the container's
  `overflow` clipping. Give it room or `overflow: visible`.
- This is a novelty component: the chase is pointer-driven, so touch
  devices only ever see the attached tooltip.

## Accessibility

- The tooltip has `role="tooltip"` and is wired to the anchor via
  `aria-describedby` while visible.
- Keyboard users get the normal tooltip on focus/blur — focus loss skips
  the chase scene and goes straight to the (brief) goodbye.
- With `prefers-reduced-motion: reduce`, the chase is skipped entirely; the
  tooltip simply fades out after a quiet "fine. go."

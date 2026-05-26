# MoodRingColorPicker

A color picker that reads your "vibe" from how fast you're interacting with
it. Move slowly and it stays Chill (pastel suggestions, gentle transitions).
Move at a steady pace and it's Neutral. Mash the controls and it goes
Chaotic — neon palette, faster transitions, subtly pulsing glow. Each pick
gets an absurd name like "Tuesday Afternoon Mauve" or "Forgot My Charger Teal".

## Installation

```bash
npm install framer-motion
```

## Basic usage

```tsx
import MoodRingColorPicker from '@/components/MoodRingColorPicker';

function App() {
  return <MoodRingColorPicker onColorChange={(hex, name) => console.log(hex, name)} />;
}
```

## Props

| Prop            | Type                                       | Default     | Description                                          |
| --------------- | ------------------------------------------ | ----------- | ---------------------------------------------------- |
| `initialColor`  | `string` (hex)                             | `'#3b82f6'` | Starting color.                                      |
| `onColorChange` | `(color: string, name: string) => void`    | —           | Fired ~120ms after the user stops adjusting the color. |

## Common patterns

### Pattern 1: write into a form

```tsx
<MoodRingColorPicker
  initialColor={value}
  onColorChange={(hex) => setFieldValue('brandColor', hex)}
/>
```

### Pattern 2: log the absurd names for fun

```tsx
<MoodRingColorPicker onColorChange={(_, name) => recentNames.add(name)} />
```

## Gotchas

- The vibe is computed from the *last 2 seconds* of interaction. Stop touching
  it and the vibe relaxes back to Chill within ~2 seconds.
- The color name is generated client-side from two ~30-string pools. You'll
  see repeats over time. Override `ADJECTIVES`/`ENDINGS` if you fork the
  component for your own brand.
- The surface drag uses Pointer Events with `setPointerCapture`, so the
  gesture survives the pointer leaving the surface.

## Accessibility

- The hue slider is a native `<input type="range">`.
- The 2D surface is exposed as `role="application"` with a label — its drag
  gesture is mouse/touch first. Power users typically reach for the hue slider
  + manual hex entry; if you need keyboard arrow control over the surface,
  wrap and add it.
- The chaotic pulse animation is suppressed under `prefers-reduced-motion`.

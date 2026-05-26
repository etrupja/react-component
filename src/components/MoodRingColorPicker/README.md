# MoodRingColorPicker

A color picker that reads your interaction speed and adapts. Slow movements
yield pastel suggestions and gentle transitions (Chill). Frantic movements
trigger neon suggestions, fast transitions, and a pulsing glow (Chaotic).
Every pick gets an absurd, generated name like "Tuesday Afternoon Mauve" or
"Forgot My Charger Teal" drawn from two ~30-string pools.

## Props

| Prop            | Type                                       | Default     | Description                                          |
| --------------- | ------------------------------------------ | ----------- | ---------------------------------------------------- |
| `initialColor`  | `string` (hex)                             | `'#3b82f6'` | Starting color.                                      |
| `onColorChange` | `(color: string, name: string) => void`    | —           | Fired shortly after the user stops adjusting.        |

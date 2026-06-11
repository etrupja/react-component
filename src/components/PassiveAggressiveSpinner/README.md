# PassiveAggressiveSpinner

A loading spinner whose status text degrades from "Loading…" to open
resentment the longer it runs. The arc color shifts warmer and the rotation
gets visibly lazier with each escalation stage. Past the final stage it
rotates through passive-aggressive mutterings forever. Comes with a retry
button that resets the timer but changes nothing else — just like real life.

## Props

| Prop         | Type                             | Default            | Description                                                |
| ------------ | -------------------------------- | ------------------ | ---------------------------------------------------------- |
| `stages`     | `{ at: number; text: string }[]` | 4 stages, 0–30s    | Escalation messages and when (ms elapsed) they kick in.    |
| `mutterings` | `string[]`                       | 4 salty remarks    | Messages rotated endlessly after the last stage.           |
| `size`       | `number`                         | `48`               | Spinner diameter in px.                                    |

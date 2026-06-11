# NosyStepper

A multi-step wizard that has opinions about your pace. Click Next too fast
and it asks if you even read the step. Linger too long and it wonders if it
should come back later. Going back a step makes it gasp. Finishing earns
you a confetti burst, a summary of your behavior, and the assurance that it
will remember.

## Props

| Prop         | Type                                  | Default                       | Description                                                  |
| ------------ | ------------------------------------- | ----------------------------- | ------------------------------------------------------------ |
| `steps`      | `{ title: string; content: string }[]` | 4 onboarding-parody steps    | The wizard steps.                                            |
| `pacing`     | `{ rushed: number; lingering: number }` (ms) | `{ 2000, 20000 }`      | Under `rushed` = judged for speed; over `lingering` = nagged. |
| `onComplete` | `() => void`                          | —                             | Called when the last step is finished.                       |

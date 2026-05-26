# ProcrastinatorTodoList

A todo list where ignored tasks visibly complain. Tasks age through four
stages — fresh, stale, annoyed, furious — with rising wiggle amplitude and
visual urgency. Furious tasks float to the top of the list so they keep
nagging. Completing a task waves goodbye, fires a small confetti burst at
the task's position, and removes it. Tasks persist to `localStorage`.

## Props

| Prop            | Type                                                  | Default                       | Description                                              |
| --------------- | ----------------------------------------------------- | ----------------------------- | -------------------------------------------------------- |
| `ageThresholds` | `{ stale, annoyed, furious }` in ms                   | `{ 60000, 120000, 240000 }`   | When tasks transition between aging stages.              |
| `storageKey`    | `string`                                              | `'procrastinator-todos'`      | localStorage key — give each instance a unique key.      |

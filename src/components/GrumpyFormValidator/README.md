# GrumpyFormValidator

A login form whose error messages escalate as the user keeps mistyping. The
counter increments on each unique invalid input (debounced 600ms after typing
stops), the submit button dodges the cursor once the form is properly annoyed,
and a green-to-red meter at the bottom shows how close the form is to giving
up entirely.

Typing "sorry" anywhere resets the counter — apology accepted.

## Props

| Prop           | Type         | Default | Description                                              |
| -------------- | ------------ | ------- | -------------------------------------------------------- |
| `onSuccess`    | `() => void` | —       | Fired on successful submit.                              |
| `maxAnnoyance` | `number`     | `5`     | Maximum mistake count; controls the annoyance meter scale. |

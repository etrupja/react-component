# GuiltTripModal

A confirm dialog with abandonment issues. Every time you hover the Cancel
button, the dialog's face gets sadder (drooping mouth, then tears), the
Cancel label degrades from "Cancel" to "fine. cancel.", and a guilt line
appears. Cancelling is remembered in `localStorage` — reopen it and it
tells you exactly how many times you've abandoned it.

## Props

| Prop           | Type         | Default                  | Description                                              |
| -------------- | ------------ | ------------------------ | -------------------------------------------------------- |
| `triggerLabel` | `string`     | `'Delete account'`       | Label of the button that opens the modal.                |
| `title`        | `string`     | `'Are you absolutely sure?'` | Dialog heading.                                      |
| `message`      | `string`     | dramatic default         | Dialog body text.                                        |
| `onConfirm`    | `() => void` | —                        | Called when the user confirms.                           |
| `storageKey`   | `string`     | `'guilt-trip-abandons'`  | localStorage key for the abandonment counter.            |

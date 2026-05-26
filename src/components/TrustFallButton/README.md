# TrustFallButton

A destructive-action button you confirm by pressing and holding. A progress
ring fills as you hold, the button shakes with rising amplitude, sweat drops
appear at 30/60/90% progress, and a speech bubble cycles through escalating
panic messages. Release early and it exhales a "Phew."; release at 100% and
it flashes red, screams "It is done.", and fires `onConfirm`. Uses
`requestAnimationFrame` and Pointer Events for smooth, touch-friendly
behavior.

## Props

| Prop           | Type                       | Default               | Description                                       |
| -------------- | -------------------------- | --------------------- | ------------------------------------------------- |
| `label`        | `string`                   | `'Delete everything'` | Button label.                                     |
| `holdDuration` | `number` (ms)              | `2500`                | How long the user must hold before confirmation. |
| `onConfirm`    | `() => void`               | —                     | Fires when the hold completes.                   |
| `variant`      | `'danger' \| 'warning'`    | `'danger'`            | Color treatment.                                  |

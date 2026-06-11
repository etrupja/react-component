# OverlyAttachedTooltip

A tooltip that does not handle goodbyes well. It appears politely on hover,
but when your cursor leaves, it detaches from its anchor and chases the
cursor — wobbling and pleading ("wait—", "I had more to say!", "please.
PLEASE.") — until the cursor has run `clinginess` pixels from the anchor.
Then it mutters "fine. go." and fades out, dramatically.

## Props

| Prop         | Type        | Default                 | Description                                                  |
| ------------ | ----------- | ----------------------- | ------------------------------------------------------------ |
| `content`    | `string`    | a clingy default        | What the tooltip says while still behaving normally.         |
| `clinginess` | `number`    | `180`                   | How many px it chases the cursor before letting go.          |
| `children`   | `ReactNode` | a "Hover me" button     | The anchor element the tooltip is attached to.               |

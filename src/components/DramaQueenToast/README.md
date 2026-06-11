# DramaQueenToast

A toast notification system with severity inversion: the more trivial the
event, the bigger the production. An info toast ("someone liked your
comment") arrives oversized, siren-iconed, and vibrating with urgency; a
genuine error slinks in as a tiny gray afterthought ("database is gone,
whatever"). Toasts you don't acknowledge before they expire don't just
leave — they sulk in the corner first ("fine. it probably wasn't important
anyway") and your ignored count is tallied.

## Props

| Prop           | Type     | Default | Description                                              |
| -------------- | -------- | ------- | -------------------------------------------------------- |
| `duration`     | `number` | `5000`  | ms before an unacknowledged toast starts sulking.        |
| `sulkDuration` | `number` | `2500`  | ms a sulking toast lingers before leaving for good.      |

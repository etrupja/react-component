# MonkeyLoginForm

An animated, monkey-themed login form. The monkey's eyes track the cursor as the
user types in the username field, and its eyes close as the password is entered
to keep the secret safe.

## Installation

This component has no extra runtime dependencies beyond React.

## Basic usage

```tsx
import { MonkeyLoginForm } from '@/components/LoginForms';

function App() {
  return (
    <MonkeyLoginForm
      onSubmit={(username, password) => {
        console.log('login', { username, password });
      }}
    />
  );
}
```

## Props

| Prop       | Type                                              | Default | Description                                |
| ---------- | ------------------------------------------------- | ------- | ------------------------------------------ |
| `onSubmit` | `(username: string, password: string) => void`    | —       | Called when the user submits the form.     |

## Common patterns

### Pattern 1: hook it into an auth flow

```tsx
<MonkeyLoginForm
  onSubmit={async (u, p) => {
    const ok = await signIn(u, p);
    if (!ok) setError('Try again');
  }}
/>
```

### Pattern 2: drop it on a marketing page

The component renders inside its own card and is centered, so you can drop it
into any container without extra layout glue.

## Gotchas

- The monkey's pupils animate using inline transforms — wrapping the component
  in a `transform: scale(...)` parent will compound the math and look slightly off.
- The form does not perform any validation. Pass validated values back from your
  `onSubmit` handler.

## Accessibility

- All inputs have associated `<label>` elements.
- The form is keyboard-navigable in source order.
- The decorative monkey is non-interactive and does not steal focus.

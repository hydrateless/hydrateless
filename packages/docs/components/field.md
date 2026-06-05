# Field

An accessible layout wrapper for a single form control: a label, the control,
optional help text, and a validation message — all wired together. CSS-only.

## Demo

<div class="hl-demo">
<div class="hl-field">
  <label class="hl-label" data-hl-required>Email</label>
  <input class="hl-input" placeholder="you@example.com" />
  <p class="hl-help">We never share it.</p>
</div>
</div>

## HTML

```html
<div class="hl-field">
  <label class="hl-label" data-hl-required>Email</label>
  <input class="hl-input" />
  <p class="hl-help">We never share it.</p>
</div>
```

For the invalid state, add `data-hl-invalid` to `.hl-field` and render an
`.hl-error` message:

```html
<div class="hl-field" data-hl-invalid>
  <label class="hl-label" data-hl-required>Email</label>
  <input class="hl-input" aria-invalid="true" />
  <p class="hl-error">Enter a valid email address.</p>
</div>
```

Group related fields with a fieldset:

```html
<fieldset class="hl-fieldset">
  <legend class="hl-legend">Notifications</legend>
  <!-- fields… -->
</fieldset>
```

- **CSS**: `hydrateless/field.css`
- **JS**: none.
- **Accessibility**: `data-hl-required` on the label adds the required marker;
  point the control's `aria-describedby` at the help/error text and set
  `aria-invalid="true"` when invalid.

## Frameworks

In React, spread `useField()` onto the control — it returns
`{ id, 'aria-describedby', 'aria-invalid' }` so the label, help, and error are
linked automatically. `Field` accepts `invalid` and `required` props.

::: code-group

```tsx [React]
import { Field, Label, Input, Help, FieldError, useField } from '@hydrateless/react';

function EmailField({ error }: { error?: string }) {
  return (
    <Field required invalid={!!error}>
      <Label>Email</Label>
      <Control />
      <Help>We never share it.</Help>
      <FieldError>{error}</FieldError>
    </Field>
  );
}

function Control() {
  return <Input {...useField()} placeholder="you@example.com" />;
}
```

```vue [Vue]
<template>
  <div class="hl-field">
    <label class="hl-label" data-hl-required>Email</label>
    <input class="hl-input" />
    <p class="hl-help">We never share it.</p>
  </div>
</template>
```

```svelte [Svelte]
<div class="hl-field">
  <label class="hl-label" data-hl-required>Email</label>
  <input class="hl-input" />
  <p class="hl-help">We never share it.</p>
</div>
```

:::

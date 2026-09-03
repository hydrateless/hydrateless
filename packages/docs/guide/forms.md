# Forms

Hydrateless form controls are native elements with a class. They submit with
the form, validate with the browser's constraint validation, and are announced
by assistive technology without any JavaScript. `Field` ties a control to its
label, help text, and error message.

## Anatomy of a field

```html
<div class="hl-field">
  <label class="hl-label" for="email" data-hl-required>Email</label>
  <input
    class="hl-input"
    id="email"
    name="email"
    type="email"
    required
    aria-describedby="email-help"
  />
  <p class="hl-help" id="email-help">We never share it.</p>
</div>
```

- `.hl-field` stacks the parts with a consistent gap.
- `.hl-label[data-hl-required]` renders the required marker.
- `.hl-help` and `.hl-error` are the description and validation message. Point
  `aria-describedby` at whichever is present so it is read after the label.
- `.hl-fieldset` and `.hl-legend` group related fields.

Any Hydrateless control fits in the middle slot: `.hl-input`, `.hl-textarea`,
`.hl-select`, a `[data-hl-switch]`, a `[data-hl-combobox]`, or an
`.hl-slider`.

## Field wiring in the framework bindings

The framework `Field` does the id plumbing for you. Hydrateless inputs placed
inside it (`Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Combobox`,
`Slider`) read the field context and set their own `id`, `aria-describedby`,
`aria-invalid`, and `required`. Used outside a `Field`, they render plain
attributes and never throw.

::: code-group

```tsx [React]
import { Field, FieldLabel, FieldHelp, FieldError, Input } from '@hydrateless/react';

<Field required invalid={!!error}>
  <FieldLabel>Email</FieldLabel>
  <Input type="email" name="email" />
  <FieldHelp>We never share it.</FieldHelp>
  {error && <FieldError>{error}</FieldError>}
</Field>;
```

```vue [Vue]
<script setup>
import { ref } from 'vue';
import { Field, FieldLabel, FieldHelp, FieldError, Input } from '@hydrateless/vue';
const email = ref('');
const error = ref('');
</script>

<template>
  <Field required :invalid="!!error">
    <FieldLabel>Email</FieldLabel>
    <Input v-model="email" type="email" name="email" />
    <FieldHelp>We never share it.</FieldHelp>
    <FieldError v-if="error">{{ error }}</FieldError>
  </Field>
</template>
```

```svelte [Svelte]
<script>
  import { Field, FieldLabel, FieldHelp, FieldError, Input } from '@hydrateless/svelte';
  let email = $state('');
  let error = $state('');
</script>

<Field required invalid={!!error}>
  <FieldLabel>Email</FieldLabel>
  <Input bind:value={email} type="email" name="email" />
  <FieldHelp>We never share it.</FieldHelp>
  {#if error}<FieldError>{error}</FieldError>{/if}
</Field>
```

:::

## Custom controls with `useField`

To wire a control the library doesn't ship (a date picker, a rich text editor,
a third-party input), read the same context with `useField()`. It returns
`{ id, describedBy, invalid, required }` inside a `Field` and `null` outside
one, so the control works in both places.

::: code-group

```tsx [React]
import { useField } from '@hydrateless/react';

function ColorInput(props) {
  const field = useField();
  return (
    <input
      type="color"
      id={field?.id}
      aria-describedby={field?.describedBy}
      aria-invalid={field?.invalid || undefined}
      required={field?.required}
      {...props}
    />
  );
}
```

```vue [Vue]
<script setup>
import { useField } from '@hydrateless/vue';
const field = useField();
</script>

<template>
  <input
    type="color"
    :id="field?.id"
    :aria-describedby="field?.describedBy"
    :aria-invalid="field?.invalid || undefined"
    :required="field?.required"
  />
</template>
```

```svelte [Svelte]
<script>
  import { useField } from '@hydrateless/svelte';
  const field = useField();
</script>

<input
  type="color"
  id={field?.id}
  aria-describedby={field?.describedBy}
  aria-invalid={field?.invalid || undefined}
  required={field?.required}
/>
```

:::

## Validation states

A field has three visual states, all driven by attributes:

| State    | Field                         | Control                                                     | Message     |
| -------- | ----------------------------- | ----------------------------------------------------------- | ----------- |
| Default  | `.hl-field`                   |                                                             | `.hl-help`  |
| Required | `.hl-label[data-hl-required]` | `required`                                                  | `.hl-help`  |
| Invalid  | `.hl-field[data-hl-invalid]`  | `aria-invalid="true"` (or `data-hl-invalid` on the control) | `.hl-error` |

```html
<div class="hl-field" data-hl-invalid>
  <label class="hl-label" for="email" data-hl-required>Email</label>
  <input
    class="hl-input"
    id="email"
    type="email"
    required
    aria-invalid="true"
    aria-describedby="email-error"
    value="not-an-email"
  />
  <p class="hl-error" id="email-error">Enter a valid email address.</p>
</div>
```

`aria-invalid="true"` is what screen readers announce; `data-hl-invalid` on
the field is what colors the label. The framework `Field invalid` prop sets
both.

## Native constraint validation

Because the controls are real inputs, the browser validates them on submit:
`required`, `type="email"`, `minlength`, `pattern`, `min`/`max` on ranges, and
so on. Hydrateless deliberately doesn't style `:invalid`, which would flag a
required field red before the user has typed anything. Error styling is keyed
to `aria-invalid="true"` (or `data-hl-invalid`), so a control turns red only
when you say so, which is also exactly when it's announced.

If you want the browser's timing without any script, `:user-invalid` matches
only after interaction:

```css
.hl-input:user-invalid {
  border-color: var(--hl-danger);
}
```

To show your own messages while keeping native validation:

```js
form.addEventListener('submit', (event) => {
  if (!form.checkValidity()) {
    event.preventDefault();
    for (const control of form.querySelectorAll(':invalid')) {
      const field = control.closest('.hl-field');
      field?.setAttribute('data-hl-invalid', '');
      control.setAttribute('aria-invalid', 'true');
      field?.querySelector('.hl-error')?.replaceChildren(control.validationMessage);
    }
    form.querySelector(':invalid')?.focus();
  }
});
```

Add `novalidate` to the form if you render every message yourself and don't want
the browser's bubbles.

## Native form participation

Everything submits without glue code:

- `Switch` and `Checkbox` are `<input type="checkbox">`; give them a `name` and
  `value`.
- `Radio Group` and `Segmented Control` are native radios sharing a `name`.
- `Slider` is `<input type="range">`.
- `Select` is a native `<select>`.
- `Combobox` submits the text in its `<input>`; add a hidden input if you need
  to submit the option's `data-hl-value` instead of its label.

## Controlled and uncontrolled

Framework controls follow the platform convention: pass `defaultValue` (or
`defaultChecked`) to let the browser own the state, or `value` plus a change
callback (React `onValueChange`/`onCheckedChange`, Vue `v-model`, Svelte
`bind:value`/`bind:checked`) to own it yourself. See the framework guides for
details.

import type { ComponentDoc } from '../types';

export const field: ComponentDoc = {
  slug: 'field',
  name: 'Field',
  category: 'Forms',
  importName: 'Field',
  summary: 'An accessible layout wrapper for one form control.',
  description:
    'An accessible layout wrapper for a single form control: a label, the control, optional help text, and a validation message, all wired together. In the framework bindings, Hydrateless inputs placed inside a `Field` pick up its `id`, `aria-describedby`, `aria-invalid`, and `required` automatically; `useField()` exposes the same wiring for custom controls. CSS-only.',
  status: 'stable',
  cssOnly: true,
  cssFile: 'field.css',
  demos: [
    {
      id: 'default',
      title: 'Field',
      layout: 'fill',
      render: () =>
        `<div class="hl-field" style="max-width:20rem">
  <label class="hl-label" for="demo-email" data-hl-required>Email</label>
  <input class="hl-input" id="demo-email" type="email" required aria-describedby="demo-email-help" placeholder="you@example.com" />
  <p class="hl-help" id="demo-email-help">We never share it.</p>
</div>`,
      code: {
        react: () =>
          `import { Field, FieldLabel, FieldHelp, Input } from '@hydrateless/react';\n\n<Field required>\n  <FieldLabel>Email</FieldLabel>\n  <Input type="email" placeholder="you@example.com" />\n  <FieldHelp>We never share it.</FieldHelp>\n</Field>`,
        vue: () =>
          `<script setup>\nimport { Field, FieldLabel, FieldHelp, Input } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Field required>\n    <FieldLabel>Email</FieldLabel>\n    <Input type="email" placeholder="you@example.com" />\n    <FieldHelp>We never share it.</FieldHelp>\n  </Field>\n</template>`,
        svelte: () =>
          `<script>\n  import { Field, FieldLabel, FieldHelp, Input } from '@hydrateless/svelte';\n</script>\n\n<Field required>\n  <FieldLabel>Email</FieldLabel>\n  <Input type="email" placeholder="you@example.com" />\n  <FieldHelp>We never share it.</FieldHelp>\n</Field>`,
      },
    },
    {
      id: 'invalid',
      title: 'Invalid state',
      description:
        'Add `data-hl-invalid` to the field, `aria-invalid="true"` to the control, and render an `.hl-error` message referenced by `aria-describedby`.',
      layout: 'fill',
      render: () =>
        `<div class="hl-field" data-hl-invalid style="max-width:20rem">
  <label class="hl-label" for="demo-email-bad" data-hl-required>Email</label>
  <input class="hl-input" id="demo-email-bad" type="email" required aria-invalid="true" aria-describedby="demo-email-error" value="not-an-email" />
  <p class="hl-error" id="demo-email-error">Enter a valid email address.</p>
</div>`,
      code: {
        react: () =>
          `import { Field, FieldLabel, FieldError, Input } from '@hydrateless/react';\n\n<Field required invalid>\n  <FieldLabel>Email</FieldLabel>\n  <Input type="email" defaultValue="not-an-email" />\n  <FieldError>Enter a valid email address.</FieldError>\n</Field>`,
        vue: () =>
          `<script setup>\nimport { Field, FieldLabel, FieldError, Input } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Field required invalid>\n    <FieldLabel>Email</FieldLabel>\n    <Input type="email" model-value="not-an-email" />\n    <FieldError>Enter a valid email address.</FieldError>\n  </Field>\n</template>`,
        svelte: () =>
          `<script>\n  import { Field, FieldLabel, FieldError, Input } from '@hydrateless/svelte';\n</script>\n\n<Field required invalid>\n  <FieldLabel>Email</FieldLabel>\n  <Input type="email" value="not-an-email" />\n  <FieldError>Enter a valid email address.</FieldError>\n</Field>`,
      },
    },
    {
      id: 'custom-control',
      title: 'Custom controls with useField',
      description:
        'Any control can join a `Field`. `useField()` returns `{ id, describedBy, invalid, required }` (or `null` outside a `Field`) so you can wire your own element.',
      layout: 'fill',
      render: () =>
        `<div class="hl-field" style="max-width:20rem">
  <label class="hl-label" for="demo-color">Accent color</label>
  <input id="demo-color" type="color" value="#2563eb" aria-describedby="demo-color-help" />
  <p class="hl-help" id="demo-color-help">Used for links and buttons.</p>
</div>`,
      code: {
        react: () =>
          `import { Field, FieldLabel, FieldHelp, useField } from '@hydrateless/react';\n\nfunction ColorInput() {\n  const field = useField();\n  return (\n    <input\n      type="color"\n      id={field?.id}\n      aria-describedby={field?.describedBy}\n      aria-invalid={field?.invalid || undefined}\n      required={field?.required}\n    />\n  );\n}\n\n<Field>\n  <FieldLabel>Accent color</FieldLabel>\n  <ColorInput />\n  <FieldHelp>Used for links and buttons.</FieldHelp>\n</Field>`,
        vue: () =>
          `<!-- ColorInput.vue -->\n<script setup>\nimport { useField } from '@hydrateless/vue';\nconst field = useField();\n</script>\n\n<template>\n  <input\n    type="color"\n    :id="field?.id"\n    :aria-describedby="field?.describedBy"\n    :aria-invalid="field?.invalid || undefined"\n    :required="field?.required"\n  />\n</template>`,
        svelte: () =>
          `<!-- ColorInput.svelte -->\n<script>\n  import { useField } from '@hydrateless/svelte';\n  const field = useField();\n</script>\n\n<input\n  type="color"\n  id={field?.id}\n  aria-describedby={field?.describedBy}\n  aria-invalid={field?.invalid || undefined}\n  required={field?.required}\n/>`,
      },
    },
  ],
  props: [
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Show the required marker on the label and set `required` on the wired control.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: 'false',
      description: 'Apply the error styling and set `aria-invalid="true"` on the wired control.',
    },
  ],
  tokens: [
    { name: '--hl-fg-muted', description: 'Help text color.' },
    { name: '--hl-danger', description: 'Error text and required marker color.' },
    { name: '--hl-space-1-5', description: 'Gap between label, control, and message.' },
  ],
  a11y: [
    'The label is associated with the control through `for`/`id`, and help and error text through `aria-describedby`, so both are announced on focus.',
    'Set `aria-invalid="true"` on the control when invalid so the error is announced; the framework `Field` does this for you.',
  ],
  related: ['input', 'textarea', 'select'],
};

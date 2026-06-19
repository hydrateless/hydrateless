import type { ComponentDoc } from '../types';

export const field: ComponentDoc = {
  slug: 'field',
  name: 'Field',
  category: 'Forms',
  importName: 'Field',
  summary: 'An accessible layout wrapper for one form control.',
  description:
    'An accessible layout wrapper for a single form control: a label, the control, optional help text, and a validation message, all wired together. CSS-only.',
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
  <label class="hl-label" data-hl-required>Email</label>
  <input class="hl-input" placeholder="you@example.com" />
  <p class="hl-help">We never share it.</p>
</div>`,
      code: {
        react: () =>
          `import { Field, FieldLabel, FieldHelp, Input, useField } from '@hydrateless/react';\n\nfunction EmailField() {\n  return (\n    <Field required>\n      <FieldLabel>Email</FieldLabel>\n      <Input {...useField()} placeholder="you@example.com" />\n      <FieldHelp>We never share it.</FieldHelp>\n    </Field>\n  );\n}`,
        vue: () =>
          `<script setup>\nimport { Field, FieldLabel, FieldHelp, Input } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Field required>\n    <FieldLabel>Email</FieldLabel>\n    <Input placeholder="you@example.com" />\n    <FieldHelp>We never share it.</FieldHelp>\n  </Field>\n</template>`,
        svelte: () =>
          `<script>\n  import { Field, FieldLabel, FieldHelp, Input } from '@hydrateless/svelte';\n</script>\n\n<Field required>\n  <FieldLabel>Email</FieldLabel>\n  <Input placeholder="you@example.com" />\n  <FieldHelp>We never share it.</FieldHelp>\n</Field>`,
      },
    },
    {
      id: 'invalid',
      title: 'Invalid state',
      description: 'Add `data-hl-invalid` to the field and render an `.hl-error` message.',
      layout: 'fill',
      render: () =>
        `<div class="hl-field" data-hl-invalid style="max-width:20rem">
  <label class="hl-label" data-hl-required>Email</label>
  <input class="hl-input" aria-invalid="true" value="not-an-email" />
  <p class="hl-error">Enter a valid email address.</p>
</div>`,
    },
  ],
  props: [
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Show the required marker on the label.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: 'false',
      description: 'Apply the error styling to the field.',
    },
  ],
  tokens: [
    { name: '--hl-fg-muted', description: 'Help text color.' },
    { name: '--hl-danger', description: 'Error text and required marker color.' },
    { name: '--hl-space-2', description: 'Gap between label, control, and message.' },
  ],
  a11y: [
    'In React, spreading `useField()` links the control to its label, help, and error via `aria-describedby`.',
    'Set `aria-invalid="true"` on the control when invalid so the error is announced.',
  ],
  related: ['input', 'textarea', 'select'],
};

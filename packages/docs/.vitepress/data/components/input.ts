import type { ComponentDoc } from '../types';
import { attr, str } from './_util';

export const input: ComponentDoc = {
  slug: 'input',
  name: 'Input',
  category: 'Forms',
  importName: 'Input',
  summary: 'A text input styled with the hl-input primitive.',
  description:
    'A text input styled with the `hl-input` primitive. It is a native `<input>`, so validation, autofill, and form behavior all work exactly as the browser intends, with no JavaScript.',
  status: 'stable',
  cssOnly: true,
  native: '<input>',
  cssFile: 'input.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'column',
      knobs: [
        { id: 'placeholder', type: 'text', label: 'Placeholder', default: 'you@example.com' },
        { id: 'size', type: 'select', label: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
        { id: 'invalid', type: 'boolean', label: 'Invalid', default: false },
        { id: 'disabled', type: 'boolean', label: 'Disabled', default: false },
      ],
      render: (v) =>
        `<input class="hl-input"${v.size !== 'md' ? attr('data-hl-size', v.size) : ''}${attr('data-hl-invalid', v.invalid)}${attr('aria-invalid', v.invalid ? 'true' : '')}${attr('disabled', v.disabled)} placeholder="${str(v, 'placeholder')}" />`,
      code: {
        react: (v) =>
          `import { Input } from '@hydrateless/react';\n\n<Input placeholder="${str(v, 'placeholder')}"${v.size !== 'md' ? ` size="${v.size}"` : ''}${v.invalid ? ' invalid' : ''}${v.disabled ? ' disabled' : ''} />`,
        vue: (v) =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Input } from '@hydrateless/vue';\nconst value = ref('');\n</script>\n\n<template>\n  <Input v-model="value" placeholder="${str(v, 'placeholder')}"${v.size !== 'md' ? ` size="${v.size}"` : ''}${v.invalid ? ' invalid' : ''} />\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Input } from '@hydrateless/svelte';\n  let value = $state('');\n</script>\n\n<Input bind:value placeholder="${str(v, 'placeholder')}"${v.size !== 'md' ? ` size="${v.size}"` : ''}${v.invalid ? ' invalid' : ''} />`,
      },
    },
  ],
  props: [
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Control height and font size.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: 'false',
      description: 'Apply the error state and set `aria-invalid`.',
    },
  ],
  tokens: [
    { name: '--hl-border', description: 'Resting border color.' },
    { name: '--hl-ring', description: 'Focus ring color.' },
    { name: '--hl-radius-md', description: 'Corner radius.' },
    { name: '--hl-control-height-md', description: 'Default height.' },
  ],
  a11y: [
    'A native `<input>`, so labels, autofill, and constraint validation behave normally.',
    'Pair `invalid` with a visible message and `aria-describedby` for the best screen-reader experience.',
    'Focus is shown with the shared `--hl-ring` token, never removed.',
  ],
  related: ['textarea', 'select', 'field', 'combobox'],
};

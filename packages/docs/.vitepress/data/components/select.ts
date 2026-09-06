import type { ComponentDoc } from '../types';
import { attr } from './_util';

export const select: ComponentDoc = {
  slug: 'select',
  name: 'Select',
  category: 'Forms',
  importName: 'Select',
  summary: 'A native select with a CSS-drawn caret.',
  description:
    'A native `<select>` styled with the `hl-select` primitive. The wrapper draws a custom caret in pure CSS while the native control keeps full keyboard and mobile behavior. No JavaScript.',
  status: 'stable',
  cssOnly: true,
  native: '<select>',
  cssFile: 'select.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'column',
      knobs: [
        { id: 'size', type: 'select', label: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
        { id: 'invalid', type: 'boolean', label: 'Invalid', default: false },
        { id: 'disabled', type: 'boolean', label: 'Disabled', default: false },
      ],
      render: (v) =>
        `<span class="hl-select-wrapper">
  <select aria-label="Number" class="hl-select"${v.size !== 'md' ? attr('data-hl-size', v.size) : ''}${attr('data-hl-invalid', v.invalid)}${attr('aria-invalid', v.invalid ? 'true' : '')}${attr('disabled', v.disabled)}>
    <option>One</option>
    <option>Two</option>
    <option>Three</option>
  </select>
</span>`,
      code: {
        react: (v) =>
          `import { Select } from '@hydrateless/react';\n\n<Select aria-label="Number"${v.size !== 'md' ? ` size="${v.size}"` : ''}${v.invalid ? ' invalid' : ''}${v.disabled ? ' disabled' : ''} defaultValue="1">\n  <option value="1">One</option>\n  <option value="2">Two</option>\n  <option value="3">Three</option>\n</Select>`,
        vue: (v) =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Select } from '@hydrateless/vue';\nconst value = ref('1');\n</script>\n\n<template>\n  <Select aria-label="Number"${v.size !== 'md' ? ` size="${v.size}"` : ''}${v.invalid ? ' invalid' : ''}${v.disabled ? ' disabled' : ''} v-model="value">\n    <option value="1">One</option>\n    <option value="2">Two</option>\n    <option value="3">Three</option>\n  </Select>\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Select } from '@hydrateless/svelte';\n  let value = $state('1');\n</script>\n\n<Select aria-label="Number"${v.size !== 'md' ? ` size="${v.size}"` : ''}${v.invalid ? ' invalid' : ''}${v.disabled ? ' disabled' : ''} bind:value>\n  <option value="1">One</option>\n  <option value="2">Two</option>\n  <option value="3">Three</option>\n</Select>`,
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
  ],
  a11y: [
    'A native `<select>`, so the platform picker, type-ahead, and keyboard all work.',
    'The caret is decorative CSS and never intercepts pointer or assistive interaction.',
  ],
  related: ['combobox', 'input', 'field'],
};

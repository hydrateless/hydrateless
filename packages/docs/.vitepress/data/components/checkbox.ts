import type { ComponentDoc } from '../types';

export const checkbox: ComponentDoc = {
  slug: 'checkbox',
  name: 'Checkbox',
  category: 'Forms',
  importName: 'Checkbox',
  summary: 'A label-wrapped checkbox on a native input.',
  description:
    'A checkbox built on a native `<input type="checkbox">`, label-wrapped for a larger hit target. It keeps `:checked`, `:focus-visible`, the Space key, and form participation, with no JavaScript.',
  status: 'stable',
  cssOnly: true,
  native: '<input type="checkbox">',
  cssFile: 'checkbox.css',
  demos: [
    {
      id: 'default',
      title: 'Checkbox',
      layout: 'column',
      render: () =>
        `<label class="hl-checkbox">
  <input type="checkbox" checked />
  <span>Accept terms</span>
</label>
<label class="hl-checkbox">
  <input type="checkbox" />
  <span>Subscribe to updates</span>
</label>
<label class="hl-checkbox">
  <input type="checkbox" disabled />
  <span>Disabled option</span>
</label>`,
      code: {
        react: () =>
          `import { Checkbox } from '@hydrateless/react';\n\n<Checkbox defaultChecked>Accept terms</Checkbox>`,
        vue: () =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Checkbox } from '@hydrateless/vue';\nconst checked = ref(true);\n</script>\n\n<template>\n  <Checkbox v-model="checked">Accept terms</Checkbox>\n</template>`,
        svelte: () =>
          `<script>\n  import { Checkbox } from '@hydrateless/svelte';\n  let checked = $state(true);\n</script>\n\n<Checkbox bind:checked>Accept terms</Checkbox>`,
      },
    },
  ],
  props: [
    {
      name: 'defaultChecked',
      type: 'boolean',
      description: 'Initial checked state (uncontrolled).',
    },
    {
      name: 'checked',
      type: 'boolean',
      description: 'Controlled checked state; pair with `onCheckedChange`.',
    },
  ],
  tokens: [
    { name: '--hl-primary', description: 'Fill of the checked box.' },
    { name: '--hl-border', description: 'Border of the unchecked box.' },
    { name: '--hl-radius-sm', description: 'Corner radius of the box.' },
  ],
  a11y: [
    'Wrapping the input in a `<label>` makes the text a click target and labels the control.',
    'A real checkbox keeps Space toggling, `:focus-visible`, and form submission.',
  ],
  related: ['switch', 'radio-group', 'field'],
};

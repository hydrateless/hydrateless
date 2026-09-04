import type { ComponentDoc } from '../types';

export const checkbox: ComponentDoc = {
  slug: 'checkbox',
  name: 'Checkbox',
  category: 'Forms',
  importName: 'Checkbox',
  summary: 'A label-wrapped checkbox on a native input.',
  description:
    'A checkbox built on a native `<input type="checkbox">`, label-wrapped for a larger hit target. It keeps `:checked`, `:focus-visible`, the Space key, and form participation, with no JavaScript. Wrap several in a `data-hl-checkbox-group` and the optional enhancer adds a select-all box with a real `indeterminate` state and reports the checked values.',
  status: 'stable',
  cssOnly: true,
  native: '<input type="checkbox">',
  cssFile: 'checkbox.css',
  enhancer: {
    fn: 'enhanceCheckbox',
    subpath: '@hydrateless/enhancers/checkbox',
    signature: 'enhanceCheckbox(container, { defaultValue, onValueChange })',
  },
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
    {
      id: 'group',
      title: 'Group with select all',
      description:
        'The `data-hl-checkbox-all` box mirrors the group: checked when every box is, `indeterminate` when only some are. Toggling it checks or clears every enabled box. Boxes added to the group later join automatically.',
      layout: 'column',
      render: () =>
        `<fieldset class="hl-fieldset" data-hl-checkbox-group style="border:0;padding:0;margin:0;display:grid;gap:var(--hl-space-2)">
  <legend class="hl-label">Notifications</legend>
  <label class="hl-checkbox">
    <input type="checkbox" data-hl-checkbox-all />
    <span><strong>All notifications</strong></span>
  </label>
  <label class="hl-checkbox" style="margin-inline-start:var(--hl-space-6)">
    <input type="checkbox" value="mentions" checked />
    <span>Mentions</span>
  </label>
  <label class="hl-checkbox" style="margin-inline-start:var(--hl-space-6)">
    <input type="checkbox" value="replies" />
    <span>Replies</span>
  </label>
  <label class="hl-checkbox" style="margin-inline-start:var(--hl-space-6)">
    <input type="checkbox" value="digest" />
    <span>Weekly digest</span>
  </label>
</fieldset>`,
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
      description:
        'Controlled checked state; pair with the native `onChange` in React (Vue: `v-model`, Svelte: `bind:checked`).',
    },
  ],
  events: [
    {
      name: 'hl:change',
      detail: '{ value: string[] }',
      description:
        'Fires from an enhanced group with the checked values after every change (also the `onValueChange` callback).',
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
    'The select-all box uses the native `indeterminate` property, which screen readers announce as "mixed".',
  ],
  related: ['switch', 'radio-group', 'field'],
};

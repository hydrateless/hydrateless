import type { ComponentDoc } from '../types';
import { attr, escapeHtml } from './_util';

export const switchToggle: ComponentDoc = {
  slug: 'switch',
  name: 'Switch',
  category: 'Forms',
  importName: 'Switch',
  summary: 'A toggle built on a native checkbox with role="switch".',
  description:
    'A toggle switch built on a native checkbox with `role="switch"`. Because it is a real checkbox, it participates in forms, supports `:checked`, `:focus-visible`, and the Space key, and is announced correctly by assistive technology. No JavaScript.',
  status: 'stable',
  cssOnly: true,
  native: '<input type="checkbox">',
  cssFile: 'switch.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'column',
      knobs: [
        { id: 'checked', type: 'boolean', label: 'Checked', default: true },
        { id: 'disabled', type: 'boolean', label: 'Disabled', default: false },
        { id: 'label', type: 'text', label: 'Label', default: 'Enable notifications' },
      ],
      render: (v) =>
        `<label data-hl-switch>
  <input type="checkbox" role="switch"${attr('checked', v.checked)}${attr('disabled', v.disabled)} />
  ${escapeHtml(v.label)}
</label>`,
      code: {
        react: (v) =>
          `import { Switch } from '@hydrateless/react';\n\n<Switch${v.checked ? ' defaultChecked' : ''}${v.disabled ? ' disabled' : ''}>${escapeHtml(v.label)}</Switch>`,
        vue: (v) =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Switch } from '@hydrateless/vue';\nconst checked = ref(${v.checked});\n</script>\n\n<template>\n  <Switch v-model="checked"${v.disabled ? ' disabled' : ''}>${escapeHtml(v.label)}</Switch>\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Switch } from '@hydrateless/svelte';\n  let checked = $state(${v.checked});\n</script>\n\n<Switch bind:checked${v.disabled ? ' disabled' : ''}>${escapeHtml(v.label)}</Switch>`,
      },
    },
  ],
  props: [
    {
      name: 'checked',
      type: 'boolean',
      description:
        'Controlled state; pair with the native `onChange` in React (Vue: `v-model`, Svelte: `bind:checked`).',
    },
    { name: 'defaultChecked', type: 'boolean', description: 'Initial state (uncontrolled).' },
  ],
  tokens: [
    { name: '--hl-primary', description: 'Track color when on.' },
    { name: '--hl-border', description: 'Track color when off.' },
  ],
  a11y: [
    '`role="switch"` makes assistive tech announce "on/off" rather than "checked".',
    'A native checkbox underneath keeps Space toggling and form submission.',
  ],
  related: ['checkbox', 'field'],
};

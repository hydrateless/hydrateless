import type { ComponentDoc } from '../types';
import { attr } from './_util';

export const segmentedControl: ComponentDoc = {
  slug: 'segmented-control',
  name: 'Segmented Control',
  category: 'Forms',
  importName: 'SegmentedControl',
  summary: 'A compact single-select built on native radios.',
  description:
    'A compact single-select control built on native radios under `role="radiogroup"`. The radios give you keyboard navigation and form semantics for free. No JavaScript. Add `data-hl-segmented` and the optional enhancer reports the selection; with `<button>` segments instead of radios it also applies the radio-group pattern (`role="radio"`, `aria-checked`, a roving tab stop, and arrow keys).',
  status: 'stable',
  cssOnly: true,
  native: '<input type="radio">',
  cssFile: 'segmented-control.css',
  enhancer: {
    fn: 'enhanceSegmented',
    subpath: '@hydrateless/enhancers/segmented',
    signature: 'enhanceSegmented(container, { defaultValue, onValueChange })',
  },
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'center',
      knobs: [
        { id: 'size', type: 'select', label: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
      ],
      render: (v) =>
        `<div class="hl-segmented" role="radiogroup" aria-label="View"${v.size !== 'md' ? attr('data-hl-size', v.size) : ''}>
  <label class="hl-segmented-item"><input type="radio" name="view-demo" checked /><span>List</span></label>
  <label class="hl-segmented-item"><input type="radio" name="view-demo" /><span>Board</span></label>
  <label class="hl-segmented-item"><input type="radio" name="view-demo" /><span>Calendar</span></label>
</div>`,
      code: {
        react: (v) =>
          `import { SegmentedControl } from '@hydrateless/react';\n\n<SegmentedControl aria-label="View" size="${v.size}"\n  options={[\n    { label: 'List', value: 'list' },\n    { label: 'Board', value: 'board' },\n  ]}\n  defaultValue="list"\n/>`,
        vue: (v) =>
          `<script setup>\nimport { ref } from 'vue';\nimport { SegmentedControl } from '@hydrateless/vue';\nconst value = ref('list');\nconst options = [\n  { label: 'List', value: 'list' },\n  { label: 'Board', value: 'board' },\n];\n</script>\n\n<template>\n  <SegmentedControl aria-label="View" size="${v.size}" v-model="value" :options="options" />\n</template>`,
        svelte: (v) =>
          `<script>\n  import { SegmentedControl } from '@hydrateless/svelte';\n  let value = $state('list');\n  const options = [\n    { label: 'List', value: 'list' },\n    { label: 'Board', value: 'board' },\n  ];\n</script>\n\n<SegmentedControl aria-label="View" size="${v.size}" bind:value {options} />`,
      },
    },
    {
      id: 'buttons',
      title: 'Button segments',
      description:
        'When the control drives a view rather than a form value, plain buttons avoid a stray form field. The enhancer turns them into an APG radio group: one tab stop, arrow keys move the selection, and `aria-checked` marks the active segment. `data-hl-value` supplies the value.',
      layout: 'center',
      render: () =>
        `<div class="hl-segmented" data-hl-segmented aria-label="Density">
  <button type="button" class="hl-segmented-item" data-hl-value="compact">Compact</button>
  <button type="button" class="hl-segmented-item" data-hl-value="cozy" aria-pressed="true">Cozy</button>
  <button type="button" class="hl-segmented-item" data-hl-value="comfortable">Comfortable</button>
</div>`,
    },
  ],
  props: [
    {
      name: 'options',
      type: '{ label: string; value: string }[]',
      description: 'The selectable segments.',
    },
    { name: 'value', type: 'string', description: 'Controlled value; pair with `onValueChange`.' },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Uncontrolled initially selected value. Defaults to the first option.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: 'Called with the selected value (Vue: `v-model`, Svelte: `bind:value`).',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Control height and font size.',
    },
  ],
  events: [
    {
      name: 'hl:change',
      detail: '{ value: string }',
      description:
        'Fires from an enhanced control with the selected value after every change (also the `onValueChange` callback).',
    },
  ],
  tokens: [
    { name: '--hl-surface-2', description: 'Track background.' },
    { name: '--hl-surface', description: 'Selected segment background.' },
    { name: '--hl-radius-md', description: 'Corner radius.' },
  ],
  a11y: [
    'Native radios share a `name`, so only one segment can be selected at a time.',
    'Arrow keys move the selection, matching the radio group pattern.',
    'Button segments get the same pattern from the enhancer: `role="radio"`, `aria-checked`, and a single roving tab stop.',
  ],
  related: ['radio-group', 'tabs'],
};

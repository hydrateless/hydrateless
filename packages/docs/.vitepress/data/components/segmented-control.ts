import type { ComponentDoc } from '../types';
import { attr } from './_util';

export const segmentedControl: ComponentDoc = {
  slug: 'segmented-control',
  name: 'Segmented Control',
  category: 'Forms',
  importName: 'SegmentedControl',
  summary: 'A compact single-select built on native radios.',
  description:
    'A compact single-select control built on native radios under `role="radiogroup"`. The radios give you keyboard navigation and form semantics for free. No JavaScript.',
  status: 'stable',
  cssOnly: true,
  native: '<input type="radio">',
  cssFile: 'segmented-control.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'center',
      knobs: [
        { id: 'size', type: 'select', label: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
      ],
      render: (v) =>
        `<div class="hl-segmented" role="radiogroup"${v.size !== 'md' ? attr('data-hl-size', v.size) : ''}>
  <label class="hl-segmented-item"><input type="radio" name="view-demo" checked /><span>List</span></label>
  <label class="hl-segmented-item"><input type="radio" name="view-demo" /><span>Board</span></label>
  <label class="hl-segmented-item"><input type="radio" name="view-demo" /><span>Calendar</span></label>
</div>`,
      code: {
        react: () =>
          `import { SegmentedControl } from '@hydrateless/react';\n\n<SegmentedControl\n  options={[\n    { label: 'List', value: 'list' },\n    { label: 'Board', value: 'board' },\n  ]}\n  defaultValue="list"\n/>`,
        vue: () =>
          `<script setup>\nimport { ref } from 'vue';\nimport { SegmentedControl } from '@hydrateless/vue';\nconst value = ref('list');\nconst options = [\n  { label: 'List', value: 'list' },\n  { label: 'Board', value: 'board' },\n];\n</script>\n\n<template>\n  <SegmentedControl v-model="value" :options="options" />\n</template>`,
        svelte: () =>
          `<script>\n  import { SegmentedControl } from '@hydrateless/svelte';\n  let value = $state('list');\n  const options = [\n    { label: 'List', value: 'list' },\n    { label: 'Board', value: 'board' },\n  ];\n</script>\n\n<SegmentedControl bind:value {options} />`,
      },
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
  tokens: [
    { name: '--hl-surface', description: 'Track background.' },
    { name: '--hl-bg', description: 'Selected segment background.' },
    { name: '--hl-radius-md', description: 'Corner radius.' },
  ],
  a11y: [
    'Native radios share a `name`, so only one segment can be selected at a time.',
    'Arrow keys move the selection, matching the radio group pattern.',
  ],
  related: ['radio-group', 'tabs'],
};

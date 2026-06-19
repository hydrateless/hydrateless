import type { ComponentDoc } from '../types';
import { str } from './_util';

export const slider: ComponentDoc = {
  slug: 'slider',
  name: 'Slider',
  category: 'Forms',
  importName: 'Slider',
  summary: 'A range slider on a native input[type=range].',
  description:
    'A range slider styled with the `hl-slider` primitive. It is a native `<input type="range">`, so keyboard support, step increments, and form values all come built in. No JavaScript.',
  status: 'stable',
  cssOnly: true,
  native: '<input type="range">',
  cssFile: 'slider.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'fill',
      knobs: [
        { id: 'value', type: 'number', label: 'Value', default: 50, min: 0, max: 100, step: 1 },
        { id: 'disabled', type: 'boolean', label: 'Disabled', default: false },
      ],
      render: (v) =>
        `<input type="range" class="hl-slider" min="0" max="100" value="${str(v, 'value', '50')}"${v.disabled ? ' disabled' : ''} style="width:100%" />`,
      code: {
        react: () =>
          `import { Slider } from '@hydrateless/react';\n\n<Slider min={0} max={100} defaultValue={50} />`,
        vue: () =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Slider } from '@hydrateless/vue';\nconst value = ref(50);\n</script>\n\n<template>\n  <Slider v-model="value" min="0" max="100" />\n</template>`,
        svelte: () =>
          `<script>\n  import { Slider } from '@hydrateless/svelte';\n  let value = $state(50);\n</script>\n\n<Slider bind:value min={0} max={100} />`,
      },
    },
  ],
  props: [
    { name: 'min', type: 'number', default: '0', description: 'Minimum value.' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
    { name: 'value', type: 'number', description: 'Controlled value; pair with `onValueChange`.' },
  ],
  tokens: [
    { name: '--hl-primary', description: 'Filled track and thumb color.' },
    { name: '--hl-border', description: 'Empty track color.' },
  ],
  a11y: [
    'A native range input exposes value, min, max, and step to assistive tech.',
    'Arrow keys, Home, End, and Page Up/Down all adjust the value natively.',
  ],
  related: ['progress', 'field'],
};

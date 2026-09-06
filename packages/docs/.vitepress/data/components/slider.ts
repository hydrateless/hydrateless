import type { ComponentDoc } from '../types';
import { str } from './_util';

export const slider: ComponentDoc = {
  slug: 'slider',
  name: 'Slider',
  category: 'Forms',
  importName: 'Slider',
  summary: 'A range slider on a native input[type=range].',
  description:
    'A range slider styled with the `hl-slider` primitive. It is a native `<input type="range">`, so keyboard support, step increments, and form values all come built in. No JavaScript. Wrap it in `data-hl-slider` with an `<output>` and the optional enhancer keeps the readout, `aria-valuetext`, and the filled track in sync.',
  status: 'stable',
  cssOnly: true,
  native: '<input type="range">',
  cssFile: 'slider.css',
  enhancer: {
    fn: 'enhanceSlider',
    subpath: '@hydrateless/enhancers/slider',
    signature: 'enhanceSlider(container, { defaultValue, unit, format, onValueChange })',
  },
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
        `<input aria-label="Value" type="range" class="hl-slider" min="0" max="100" value="${str(v, 'value', '50')}"${v.disabled ? ' disabled' : ''} style="width:100%" />`,
      code: {
        react: (v) =>
          `import { Slider } from '@hydrateless/react';\n\n<Slider aria-label="Value"${v.disabled ? ' disabled' : ''} min={0} max={100} defaultValue={${v.value}} />`,
        vue: (v) =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Slider } from '@hydrateless/vue';\nconst value = ref(${v.value});\n</script>\n\n<template>\n  <Slider aria-label="Value"${v.disabled ? ' disabled' : ''} v-model="value" min="0" max="100" />\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Slider } from '@hydrateless/svelte';\n  let value = $state(${v.value});\n</script>\n\n<Slider aria-label="Value"${v.disabled ? ' disabled' : ''} bind:value min={0} max={100} />`,
      },
    },
    {
      id: 'output',
      title: 'With a live readout',
      description:
        'The enhancer writes the formatted value to the `<output>` and to `aria-valuetext` on every change, and publishes `--hl-slider-progress` so the track fills up to the thumb in every engine. `data-hl-unit` adds a suffix without any script.',
      layout: 'fill',
      render: () =>
        `<label class="hl-label" for="volume-demo">Volume</label>
<div data-hl-slider data-hl-unit="%" style="width:100%">
  <input type="range" class="hl-slider" id="volume-demo" min="0" max="100" value="35" />
  <output for="volume-demo">35%</output>
</div>`,
    },
  ],
  props: [
    { name: 'min', type: 'number', default: '0', description: 'Minimum value.' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
    {
      name: 'value',
      type: 'number',
      description:
        'Controlled value; pair with the native `onChange` in React (Vue: `v-model`, Svelte: `bind:value`).',
    },
  ],
  events: [
    {
      name: 'hl:change',
      detail: '{ value: number }',
      description:
        'Fires from an enhanced slider with the numeric value on every `input` (also the `onValueChange` callback).',
    },
  ],
  tokens: [
    { name: '--hl-primary', description: 'Filled track and thumb color.' },
    { name: '--hl-surface-3', description: 'Empty track color.' },
  ],
  a11y: [
    'A native range input exposes value, min, max, and step to assistive tech.',
    'Arrow keys, Home, End, and Page Up/Down all adjust the value natively.',
    'With the enhancer, `aria-valuetext` carries the formatted value and unit so "35%" is announced instead of "35".',
  ],
  related: ['progress', 'field'],
};

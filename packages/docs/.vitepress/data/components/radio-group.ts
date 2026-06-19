import type { ComponentDoc } from '../types';
import { attr } from './_util';

export const radioGroup: ComponentDoc = {
  slug: 'radio-group',
  name: 'Radio Group',
  category: 'Forms',
  importName: 'RadioGroup',
  summary: 'Native radios grouped under role="radiogroup".',
  description:
    'A set of native radios grouped under `role="radiogroup"`. Sharing a `name` gives you single-selection and arrow-key navigation for free, with no JavaScript.',
  status: 'stable',
  cssOnly: true,
  native: '<input type="radio">',
  cssFile: 'radio.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'column',
      knobs: [
        {
          id: 'orientation',
          type: 'select',
          label: 'Orientation',
          options: ['vertical', 'horizontal'],
          default: 'vertical',
        },
      ],
      render: (v) =>
        `<div class="hl-radio-group" role="radiogroup"${v.orientation === 'horizontal' ? attr('data-hl-orientation', 'horizontal') : ''}>
  <label class="hl-radio"><input type="radio" name="plan-demo" checked /><span>Free</span></label>
  <label class="hl-radio"><input type="radio" name="plan-demo" /><span>Pro</span></label>
  <label class="hl-radio"><input type="radio" name="plan-demo" /><span>Team</span></label>
</div>`,
      code: {
        react: () =>
          `import { useState } from 'react';\nimport { RadioGroup, Radio } from '@hydrateless/react';\n\nfunction Example() {\n  const [value, setValue] = useState('free');\n  return (\n    <RadioGroup value={value} onValueChange={setValue}>\n      <Radio value="free">Free</Radio>\n      <Radio value="pro">Pro</Radio>\n    </RadioGroup>\n  );\n}`,
        vue: () =>
          `<script setup>\nimport { ref } from 'vue';\nimport { RadioGroup, Radio } from '@hydrateless/vue';\nconst value = ref('free');\n</script>\n\n<template>\n  <RadioGroup v-model="value">\n    <Radio value="free">Free</Radio>\n    <Radio value="pro">Pro</Radio>\n  </RadioGroup>\n</template>`,
        svelte: () =>
          `<script>\n  import { RadioGroup, Radio } from '@hydrateless/svelte';\n  let value = $state('free');\n</script>\n\n<RadioGroup bind:value>\n  <Radio value="free">Free</Radio>\n  <Radio value="pro">Pro</Radio>\n</RadioGroup>`,
      },
    },
  ],
  props: [
    { name: 'value', type: 'string', description: 'Selected value; pair with `onValueChange`.' },
    { name: 'defaultValue', type: 'string', description: 'Initial value (uncontrolled).' },
    {
      name: 'orientation',
      type: `'vertical' | 'horizontal'`,
      default: `'vertical'`,
      description: 'Layout direction.',
    },
  ],
  tokens: [
    { name: '--hl-primary', description: 'Dot and ring of the selected radio.' },
    { name: '--hl-border', description: 'Border of unselected radios.' },
  ],
  a11y: [
    'A shared `name` makes the browser enforce single selection and arrow-key roving.',
    '`role="radiogroup"` exposes the set as one control to assistive technology.',
  ],
  related: ['checkbox', 'segmented-control', 'field'],
};

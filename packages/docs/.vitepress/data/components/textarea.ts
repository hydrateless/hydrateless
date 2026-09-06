import type { ComponentDoc } from '../types';
import { attr } from './_util';

export const textarea: ComponentDoc = {
  slug: 'textarea',
  name: 'Textarea',
  category: 'Forms',
  importName: 'Textarea',
  summary: 'A multi-line text input built on a native textarea.',
  description:
    'A multi-line text input styled with the `hl-textarea` primitive and built on a native `<textarea>`. No JavaScript required.',
  status: 'stable',
  cssOnly: true,
  native: '<textarea>',
  cssFile: 'textarea.css',
  demos: [
    {
      id: 'playground',
      title: 'Playground',
      layout: 'column',
      knobs: [
        { id: 'invalid', type: 'boolean', label: 'Invalid', default: false },
        { id: 'disabled', type: 'boolean', label: 'Disabled', default: false },
      ],
      render: (v) =>
        `<textarea aria-label="Message" class="hl-textarea" rows="3" placeholder="Write a message…"${attr('data-hl-invalid', v.invalid)}${attr('aria-invalid', v.invalid ? 'true' : '')}${attr('disabled', v.disabled)}></textarea>`,
      code: {
        react: (v) =>
          `import { Textarea } from '@hydrateless/react';\n\n<Textarea aria-label="Message" placeholder="Write a message…" rows={3}${v.invalid ? ' invalid' : ''}${v.disabled ? ' disabled' : ''} />`,
        vue: (v) =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Textarea } from '@hydrateless/vue';\nconst value = ref('');\n</script>\n\n<template>\n  <Textarea aria-label="Message" v-model="value" placeholder="Write a message…" rows="3"${v.invalid ? ' invalid' : ''}${v.disabled ? ' disabled' : ''} />\n</template>`,
        svelte: (v) =>
          `<script>\n  import { Textarea } from '@hydrateless/svelte';\n  let value = $state('');\n</script>\n\n<Textarea aria-label="Message" bind:value placeholder="Write a message…" rows="3"${v.invalid ? ' invalid' : ''}${v.disabled ? ' disabled' : ''} />`,
      },
    },
  ],
  props: [
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
    'A native `<textarea>` with full keyboard, resize, and form support.',
    'The error state pairs with `aria-invalid="true"` so it is announced.',
  ],
  related: ['input', 'field'],
};

import type { ComponentDoc } from '../types';

export const disclosure: ComponentDoc = {
  slug: 'disclosure',
  name: 'Disclosure',
  category: 'Disclosure',
  importName: 'Disclosure',
  summary: 'A single expandable section via native <details>.',
  description:
    'A single expandable section. Purely CSS via the native `<details>` element, with no enhancer needed for a lone disclosure. Use the disclosure enhancer on a wrapper only when you want a group of disclosures to be mutually exclusive.',
  status: 'stable',
  cssOnly: true,
  native: '<details>',
  cssFile: 'disclosure.css',
  enhancer: {
    fn: 'enhanceDisclosure',
    subpath: '@hydrateless/enhancers/disclosure',
    signature: 'enhanceDisclosure(container, { allowMultiple })',
  },
  demos: [
    {
      id: 'default',
      title: 'Disclosure',
      layout: 'fill',
      render: () =>
        `<details class="hl-disclosure" data-hl-disclosure style="width:100%">
  <summary>Show more details</summary>
  <div class="hl-disclosure-panel">This content is revealed when you expand the disclosure. The native details element handles all of the toggling, no JavaScript required.</div>
</details>`,
      code: {
        react: () =>
          `import { Disclosure } from '@hydrateless/react';\n\n<Disclosure summary="Show more">Hidden content revealed.</Disclosure>`,
        vue: () =>
          `<script setup>\nimport { Disclosure } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Disclosure>\n    <template #summary>Show more</template>\n    Hidden content revealed.\n  </Disclosure>\n</template>`,
        svelte: () =>
          `<script>\n  import { Disclosure } from '@hydrateless/svelte';\n</script>\n\n<Disclosure>\n  {#snippet summary()}Show more{/snippet}\n  Hidden content revealed.\n</Disclosure>`,
      },
    },
  ],
  props: [
    {
      name: 'summary',
      type: 'string',
      description: 'The visible toggle label (or use the `summary` slot).',
    },
  ],
  tokens: [
    { name: '--hl-border', description: 'Panel border.' },
    { name: '--hl-radius-md', description: 'Corner radius.' },
  ],
  a11y: [
    'The native `<details>` summary is a real button with built-in keyboard support.',
    'No ARIA is needed for a single disclosure; the element is self-describing.',
  ],
  related: ['accordion', 'tabs'],
};

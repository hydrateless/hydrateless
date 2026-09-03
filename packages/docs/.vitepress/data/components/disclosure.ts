import type { ComponentDoc } from '../types';

export const disclosure: ComponentDoc = {
  slug: 'disclosure',
  name: 'Disclosure',
  category: 'Disclosure',
  importName: 'Disclosure',
  summary: 'A single expandable section via native <details>.',
  description:
    'A single expandable section. Purely CSS via the native `<details>` element; give several disclosures the same `name` attribute and the browser itself makes them mutually exclusive. The optional enhancer only adds observable state: an `open`/`setOpen` API, an `onOpenChange` callback, and a bubbling `hl:open-change` event.',
  status: 'stable',
  cssOnly: true,
  native: '<details>',
  cssFile: 'disclosure.css',
  enhancer: {
    fn: 'enhanceDisclosure',
    subpath: '@hydrateless/enhancers/disclosure',
    signature: 'enhanceDisclosure(container, { defaultOpen, onOpenChange })',
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
      type: 'ReactNode',
      description:
        'The visible toggle label. In Vue and Svelte, pass a plain-text `title` prop or the `summary` slot/snippet instead.',
    },
    {
      name: 'open',
      type: 'boolean',
      description:
        'Controlled open state; pair with `onOpenChange` (Vue: `v-model:open`, Svelte: `bind:open`).',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'false',
      description: 'Uncontrolled initial open state.',
    },
    {
      name: 'name',
      type: 'string',
      description: 'Shared group name; the browser closes the other disclosures in the group.',
    },
  ],
  events: [
    {
      name: 'hl:open-change',
      detail: '{ open: boolean }',
      description: 'Fires after the disclosure opens or closes (also the `onOpenChange` callback).',
    },
  ],
  tokens: [
    { name: '--hl-border', description: 'Panel border.' },
    { name: '--hl-radius-md', description: 'Corner radius.' },
  ],
  a11y: [
    'The native `<details>` summary is a real button with built-in keyboard support.',
    'No ARIA is needed for a single disclosure; the element is self-describing.',
    'Exclusivity comes from the native `name` attribute, so it works without JavaScript.',
  ],
  related: ['accordion', 'tabs'],
};

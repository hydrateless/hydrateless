import type { ComponentDoc } from '../types';

export const accordion: ComponentDoc = {
  slug: 'accordion',
  name: 'Accordion',
  category: 'Disclosure',
  importName: 'Accordion',
  summary: 'Collapsible sections built on native <details>.',
  description:
    'Collapsible sections built on the native `<details>`/`<summary>` elements. CSS handles open and close with zero JavaScript. The optional enhancer enforces single-panel-open behavior and adds the right ARIA wiring.',
  status: 'stable',
  cssOnly: false,
  native: '<details>',
  cssFile: 'accordion.css',
  enhancer: {
    fn: 'enhanceAccordion',
    subpath: '@hydrateless/enhancers/accordion',
    signature: 'enhanceAccordion(container, { allowMultiple, defaultValue, onValueChange })',
  },
  demos: [
    {
      id: 'default',
      title: 'Accordion',
      description:
        'With the enhancer, opening one panel closes the others. Toggle JS off and each `<details>` works on its own.',
      layout: 'fill',
      render: () =>
        `<div data-hl-accordion style="width:100%">
  <details open>
    <summary>What is Hydrateless?</summary>
    <div class="hl-accordion-panel">A library of accessible UI primitives that work with semantic HTML and CSS first, with optional JS enhancers.</div>
  </details>
  <details>
    <summary>Does it require JavaScript?</summary>
    <div class="hl-accordion-panel">No. Most components work with CSS alone. JS is loaded only where an interaction truly needs it.</div>
  </details>
  <details>
    <summary>Is it themeable?</summary>
    <div class="hl-accordion-panel">Yes. Every component is driven by CSS variables, with dark mode built in.</div>
  </details>
</div>`,
      code: {
        react: () =>
          `import { Accordion, AccordionItem } from '@hydrateless/react';\n\n<Accordion>\n  <AccordionItem summary="Section one">Panel content.</AccordionItem>\n  <AccordionItem summary="Section two">Panel content.</AccordionItem>\n</Accordion>`,
        vue: () =>
          `<script setup>\nimport { Accordion, AccordionItem } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Accordion>\n    <AccordionItem>\n      <template #summary>Section one</template>\n      Panel content.\n    </AccordionItem>\n  </Accordion>\n</template>`,
        svelte: () =>
          `<script>\n  import { Accordion, AccordionItem } from '@hydrateless/svelte';\n</script>\n\n<Accordion>\n  <AccordionItem>\n    {#snippet summary()}Section one{/snippet}\n    Panel content.\n  </AccordionItem>\n</Accordion>`,
      },
    },
  ],
  props: [
    {
      name: 'allowMultiple',
      type: 'boolean',
      default: 'false',
      description: 'Let several panels stay open at once.',
    },
    {
      name: 'defaultValue',
      type: 'string | string[]',
      description: 'Initially open item value(s).',
    },
  ],
  events: [
    {
      name: 'hl:change',
      detail: '{ value: string }',
      description: 'Fires when the open panel changes.',
    },
  ],
  tokens: [
    { name: '--hl-border', description: 'Divider between items.' },
    { name: '--hl-fg', description: 'Summary text color.' },
  ],
  a11y: [
    'Native `<details>` gives each section a real disclosure button and Space/Enter toggling.',
    'The enhancer keeps `aria-expanded` in sync when it manages single-open behavior.',
  ],
  related: ['disclosure', 'tabs'],
};

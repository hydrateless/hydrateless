import type { ComponentDoc } from '../types';

export const accordion: ComponentDoc = {
  slug: 'accordion',
  name: 'Accordion',
  category: 'Disclosure',
  importName: 'Accordion',
  summary: 'Collapsible sections built on native <details>.',
  description:
    'Collapsible sections built on the native `<details>`/`<summary>` elements. CSS handles open and close with zero JavaScript. The optional enhancer enforces single-panel-open behavior, adds the APG header navigation (`Up`/`Down`/`Home`/`End` move focus between summaries), and exposes the open items as a value.',
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
        'With the enhancer, opening one panel closes the others and arrow keys move between headers. Toggle JS off and each `<details>` works on its own.',
      layout: 'fill',
      render: () =>
        `<div data-hl-accordion style="width:100%">
  <details data-hl-value="what" open>
    <summary>What is Hydrateless?</summary>
    <div class="hl-accordion-panel">A library of accessible UI primitives that work with semantic HTML and CSS first, with optional JS enhancers.</div>
  </details>
  <details data-hl-value="js">
    <summary>Does it require JavaScript?</summary>
    <div class="hl-accordion-panel">No. Most components work with CSS alone. JS is loaded only where an interaction truly needs it.</div>
  </details>
  <details data-hl-value="theme">
    <summary>Is it themeable?</summary>
    <div class="hl-accordion-panel">Yes. Every component is driven by CSS variables, with dark mode built in.</div>
  </details>
</div>`,
      code: {
        react: () =>
          `import { Accordion, AccordionItem } from '@hydrateless/react';\n\n<Accordion defaultValue={['one']} onValueChange={(open) => console.log(open)}>\n  <AccordionItem value="one" summary="Section one">Panel content.</AccordionItem>\n  <AccordionItem value="two" summary="Section two">Panel content.</AccordionItem>\n</Accordion>`,
        vue: () =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Accordion, AccordionItem } from '@hydrateless/vue';\nconst open = ref(['one']);\n</script>\n\n<template>\n  <Accordion v-model="open">\n    <AccordionItem value="one">\n      <template #summary>Section one</template>\n      Panel content.\n    </AccordionItem>\n    <AccordionItem value="two">\n      <template #summary>Section two</template>\n      Panel content.\n    </AccordionItem>\n  </Accordion>\n</template>`,
        svelte: () =>
          `<script>\n  import { Accordion, AccordionItem } from '@hydrateless/svelte';\n  let open = $state(['one']);\n</script>\n\n<Accordion bind:value={open}>\n  <AccordionItem value="one">\n    {#snippet summary()}Section one{/snippet}\n    Panel content.\n  </AccordionItem>\n  <AccordionItem value="two">\n    {#snippet summary()}Section two{/snippet}\n    Panel content.\n  </AccordionItem>\n</Accordion>`,
      },
    },
  ],
  props: [
    {
      name: 'value',
      type: 'string[]',
      description:
        'Controlled open item values; pair with `onValueChange` (Vue: `v-model`, Svelte: `bind:value`).',
    },
    {
      name: 'defaultValue',
      type: 'string[]',
      description:
        'Uncontrolled initially open items. Falls back to the `open` attributes in the markup.',
    },
    {
      name: 'onValueChange',
      type: '(value: string[]) => void',
      description: 'Called with the open item values, in document order, after every change.',
    },
    {
      name: 'allowMultiple',
      type: 'boolean',
      default: 'false',
      description: 'Let several panels stay open at once.',
    },
    {
      name: 'AccordionItem.value',
      type: 'string',
      description:
        'Identifier used in `value`; rendered as `data-hl-value`. Defaults to the index.',
    },
  ],
  events: [
    {
      name: 'hl:change',
      detail: '{ value: string[] }',
      description: 'Fires when the set of open panels changes (also the `onValueChange` callback).',
    },
  ],
  tokens: [
    { name: '--hl-border', description: 'Divider between items.' },
    { name: '--hl-fg', description: 'Summary text color.' },
  ],
  a11y: [
    'Native `<details>` gives each section a real disclosure button and Space/Enter toggling; `aria-expanded` is implicit.',
    'With the enhancer, `Up`/`Down` and `Home`/`End` move focus between headers, matching the APG accordion pattern.',
  ],
  related: ['disclosure', 'tabs'],
};

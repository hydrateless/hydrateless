# Accordion

Collapsible sections built on the native `<details>`/`<summary>` elements. CSS
handles open/close with zero JavaScript. The optional enhancer enforces
single-panel-open behavior and adds the right ARIA wiring.

## Demo

<div class="hl-demo">
<div data-hl-accordion>
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
</div>
</div>

## HTML

```html
<div data-hl-accordion>
  <details>
    <summary>Section one</summary>
    <div class="hl-accordion-panel">Panel content.</div>
  </details>
  <details>
    <summary>Section two</summary>
    <div class="hl-accordion-panel">Panel content.</div>
  </details>
</div>
```

- **CSS**: `hydrateless/accordion.css`
- **JS**: `enhanceAccordion(container, { allowMultiple?, defaultValue?, onValueChange? })`.
  Item values come from `data-hl-value` (default: index); the handle's `api`
  exposes `value`/`setValue`, and changes emit `hl:change`.

Without the enhancer, each `<details>` toggles independently. With it, opening
one panel closes the others, unless you pass `allowMultiple: true`.

## Frameworks

::: code-group

```tsx [React]
import { Accordion, AccordionItem } from '@hydrateless/react';

<Accordion>
  <AccordionItem summary="Section one">Panel content.</AccordionItem>
  <AccordionItem summary="Section two">Panel content.</AccordionItem>
</Accordion>;
```

```vue [Vue]
<script setup>
import { Accordion, AccordionItem } from '@hydrateless/vue';
</script>

<template>
  <Accordion>
    <AccordionItem>
      <template #summary>Section one</template>
      Panel content.
    </AccordionItem>
    <AccordionItem>
      <template #summary>Section two</template>
      Panel content.
    </AccordionItem>
  </Accordion>
</template>
```

```svelte [Svelte]
<script>
  import { Accordion, AccordionItem } from '@hydrateless/svelte';
</script>

<Accordion>
  <AccordionItem>
    {#snippet summary()}Section one{/snippet}
    Panel content.
  </AccordionItem>
  <AccordionItem>
    {#snippet summary()}Section two{/snippet}
    Panel content.
  </AccordionItem>
</Accordion>
```

:::

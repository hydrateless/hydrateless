# Tabs

A tabbed interface with full ARIA roles and keyboard support. The enhancer wires
roving tabindex and arrow-key navigation; the markup is plain buttons and
panels.

## Demo

<div class="hl-demo">
<div data-hl-tabs>
  <div role="tablist">
    <button role="tab">Overview</button>
    <button role="tab">Features</button>
    <button role="tab">Pricing</button>
  </div>
  <div role="tabpanel">
    <p>Hydrateless ships accessible primitives with near-zero runtime cost.</p>
  </div>
  <div role="tabpanel">
    <p>CSS-first components, optional enhancers, auto-init, and design tokens.</p>
  </div>
  <div role="tabpanel">
    <p>Free and open source under the MIT license.</p>
  </div>
</div>
</div>

## HTML

```html
<div data-hl-tabs>
  <div role="tablist">
    <button role="tab">Tab 1</button>
    <button role="tab">Tab 2</button>
  </div>
  <div role="tabpanel">Panel 1 content.</div>
  <div role="tabpanel">Panel 2 content.</div>
</div>
```

- **CSS**: `hydrateless/tabs.css`
- **JS**: `enhanceTabs(container)`
- **Keyboard**: `←`/`→` move between tabs, `Home`/`End` jump to first/last,
  `Enter`/`Space` activate.

## Frameworks

::: code-group

```tsx [React]
import { Tabs } from '@hydrateless/react';

<Tabs
  items={[
    { label: 'Tab 1', content: <p>Panel 1</p> },
    { label: 'Tab 2', content: <p>Panel 2</p> },
  ]}
/>;
```

```vue [Vue]
<template>
  <div v-hl-tabs data-hl-tabs>
    <div role="tablist">
      <button role="tab">Tab 1</button>
      <button role="tab">Tab 2</button>
    </div>
    <div role="tabpanel">Panel 1</div>
    <div role="tabpanel">Panel 2</div>
  </div>
</template>
```

```svelte [Svelte]
<script>
  import { tabs } from '@hydrateless/svelte';
</script>

<div use:tabs data-hl-tabs>
  <div role="tablist">
    <button role="tab">Tab 1</button>
    <button role="tab">Tab 2</button>
  </div>
  <div role="tabpanel">Panel 1</div>
  <div role="tabpanel">Panel 2</div>
</div>
```

:::

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
import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/react';

<Tabs>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanel>Panel 1 content.</TabPanel>
  <TabPanel>Panel 2 content.</TabPanel>
</Tabs>;
```

```vue [Vue]
<script setup>
import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/vue';
</script>

<template>
  <Tabs>
    <TabList>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
    </TabList>
    <TabPanel>Panel 1 content.</TabPanel>
    <TabPanel>Panel 2 content.</TabPanel>
  </Tabs>
</template>
```

```svelte [Svelte]
<script>
  import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/svelte';
</script>

<Tabs>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanel>Panel 1 content.</TabPanel>
  <TabPanel>Panel 2 content.</TabPanel>
</Tabs>
```

:::

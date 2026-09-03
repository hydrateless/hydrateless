import type { ComponentDoc } from '../types';

export const tabs: ComponentDoc = {
  slug: 'tabs',
  name: 'Tabs',
  category: 'Disclosure',
  importName: 'Tabs',
  summary: 'A tabbed interface with full ARIA roles and keyboard support.',
  description:
    'A tabbed interface following the WAI-ARIA tabs pattern. Two markups are supported: role-based tabs (`role="tablist"`, `role="tab"`, `role="tabpanel"`) that render the selected state on the server, and a CSS-only baseline built on visually hidden radios that switches panels with no JavaScript. The enhancer adds the roving tabindex, arrow-key navigation, manual or automatic activation, and keeps `aria-selected` and `hidden` in sync.',
  status: 'stable',
  cssOnly: false,
  native: '<button role="tab">',
  cssFile: 'tabs.css',
  enhancer: {
    fn: 'enhanceTabs',
    subpath: '@hydrateless/enhancers/tabs',
    signature: 'enhanceTabs(container, { activation, orientation, defaultValue, onValueChange })',
  },
  demos: [
    {
      id: 'default',
      title: 'Tabs',
      description:
        'Render `aria-selected`, `tabindex`, and `hidden` on the server so the selected tab shows before any JavaScript runs. `Left`/`Right` move focus, `Home`/`End` jump to the ends, and `Enter`/`Space` activate (manual activation is the default).',
      layout: 'fill',
      render: () =>
        `<div data-hl-tabs style="width:100%">
  <div role="tablist" aria-label="Product">
    <button role="tab" id="tab-overview" aria-selected="true" aria-controls="panel-overview" data-hl-value="overview">Overview</button>
    <button role="tab" id="tab-features" aria-selected="false" tabindex="-1" aria-controls="panel-features" data-hl-value="features">Features</button>
    <button role="tab" id="tab-pricing" aria-selected="false" tabindex="-1" aria-controls="panel-pricing" data-hl-value="pricing">Pricing</button>
  </div>
  <div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" tabindex="0"><p style="margin:0">Hydrateless ships accessible primitives with near-zero runtime cost.</p></div>
  <div role="tabpanel" id="panel-features" aria-labelledby="tab-features" tabindex="0" hidden><p style="margin:0">CSS-first components, optional enhancers, auto-init, and design tokens.</p></div>
  <div role="tabpanel" id="panel-pricing" aria-labelledby="tab-pricing" tabindex="0" hidden><p style="margin:0">Free and open source under the MIT license.</p></div>
</div>`,
      code: {
        react: () =>
          `import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/react';\n\n<Tabs defaultValue="overview">\n  <TabList aria-label="Product">\n    <Tab value="overview">Overview</Tab>\n    <Tab value="features">Features</Tab>\n  </TabList>\n  <TabPanel>Overview content.</TabPanel>\n  <TabPanel>Features content.</TabPanel>\n</Tabs>`,
        vue: () =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Tabs, TabList, Tab, TabPanel } from '@hydrateless/vue';\nconst tab = ref('overview');\n</script>\n\n<template>\n  <Tabs v-model="tab">\n    <TabList aria-label="Product">\n      <Tab value="overview">Overview</Tab>\n      <Tab value="features">Features</Tab>\n    </TabList>\n    <TabPanel>Overview content.</TabPanel>\n    <TabPanel>Features content.</TabPanel>\n  </Tabs>\n</template>`,
        svelte: () =>
          `<script>\n  import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/svelte';\n  let tab = $state('overview');\n</script>\n\n<Tabs bind:value={tab}>\n  <TabList aria-label="Product">\n    <Tab value="overview">Overview</Tab>\n    <Tab value="features">Features</Tab>\n  </TabList>\n  <TabPanel>Overview content.</TabPanel>\n  <TabPanel>Features content.</TabPanel>\n</Tabs>`,
      },
    },
    {
      id: 'css-only',
      title: 'CSS-only baseline',
      description:
        'Each tab is a `<label class="hl-tab">` wrapping a radio, and `:has(input:checked)` reveals the matching panel. Panels switch with no JavaScript; the enhancer upgrades the same markup to the full ARIA pattern when it runs.',
      layout: 'fill',
      render: () =>
        `<div data-hl-tabs style="width:100%">
  <div class="hl-tablist">
    <label class="hl-tab"><input type="radio" name="tabs-baseline" value="overview" checked /> Overview</label>
    <label class="hl-tab"><input type="radio" name="tabs-baseline" value="features" /> Features</label>
  </div>
  <div class="hl-tabpanels">
    <div class="hl-tabpanel"><p style="margin:0">Overview panel, shown by the checked radio.</p></div>
    <div class="hl-tabpanel"><p style="margin:0">Features panel, revealed by CSS alone.</p></div>
  </div>
</div>`,
    },
  ],
  props: [
    {
      name: 'value',
      type: 'string',
      description:
        'Controlled selected tab; pair with `onValueChange` (Vue: `v-model`, Svelte: `bind:value`).',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Uncontrolled initial tab. Defaults to the first enabled tab.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: 'Called with the new tab value after every selection change.',
    },
    {
      name: 'activation',
      type: `'manual' | 'automatic'`,
      default: `'manual'`,
      description:
        'Whether arrow keys only move focus (`manual`, activate with Enter/Space) or select immediately (`automatic`).',
    },
    {
      name: 'orientation',
      type: `'horizontal' | 'vertical'`,
      default: `'horizontal'`,
      description: 'Tab list direction; vertical lists use Up/Down instead of Left/Right.',
    },
  ],
  events: [
    {
      name: 'hl:change',
      detail: '{ value: string }',
      description: 'Fires when the selected tab changes (also the `onValueChange` callback).',
    },
  ],
  tokens: [
    { name: '--hl-surface-2', description: 'Selected tab background.' },
    { name: '--hl-border', description: 'Tab list underline and outer border.' },
    { name: '--hl-focus-ring', description: 'Focus ring on the active tab.' },
  ],
  a11y: [
    'The framework components render `role="tablist"`/`tab`/`tabpanel`, `aria-selected`, `aria-controls`, and `hidden` on the server, so there is no flash of unselected state before hydration.',
    'A roving tabindex keeps the tab list a single tab stop; each panel has `tabindex="0"` so keyboard users can reach its content.',
    'Disabled tabs (`disabled` or `aria-disabled="true"`) are skipped during arrow navigation.',
  ],
  related: ['accordion', 'segmented-control'],
};

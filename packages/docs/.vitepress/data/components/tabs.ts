import type { ComponentDoc } from '../types';

export const tabs: ComponentDoc = {
  slug: 'tabs',
  name: 'Tabs',
  category: 'Disclosure',
  importName: 'Tabs',
  summary: 'A tabbed interface with full ARIA roles and keyboard support.',
  description:
    'A tabbed interface with full ARIA roles and keyboard support. The enhancer wires roving tabindex and arrow-key navigation; the markup is plain buttons and panels. Without JS, CSS shows only the first panel.',
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
      description: '`←`/`→` move between tabs, `Home`/`End` jump to the ends.',
      layout: 'fill',
      render: () =>
        `<div data-hl-tabs style="width:100%">
  <div role="tablist">
    <button role="tab">Overview</button>
    <button role="tab">Features</button>
    <button role="tab">Pricing</button>
  </div>
  <div role="tabpanel"><p style="margin:0">Hydrateless ships accessible primitives with near-zero runtime cost.</p></div>
  <div role="tabpanel"><p style="margin:0">CSS-first components, optional enhancers, auto-init, and design tokens.</p></div>
  <div role="tabpanel"><p style="margin:0">Free and open source under the MIT license.</p></div>
</div>`,
      code: {
        react: () =>
          `import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/react';\n\n<Tabs>\n  <TabList>\n    <Tab>Tab 1</Tab>\n    <Tab>Tab 2</Tab>\n  </TabList>\n  <TabPanel>Panel 1 content.</TabPanel>\n  <TabPanel>Panel 2 content.</TabPanel>\n</Tabs>`,
        vue: () =>
          `<script setup>\nimport { Tabs, TabList, Tab, TabPanel } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Tabs>\n    <TabList>\n      <Tab>Tab 1</Tab>\n      <Tab>Tab 2</Tab>\n    </TabList>\n    <TabPanel>Panel 1 content.</TabPanel>\n    <TabPanel>Panel 2 content.</TabPanel>\n  </Tabs>\n</template>`,
        svelte: () =>
          `<script>\n  import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/svelte';\n</script>\n\n<Tabs>\n  <TabList>\n    <Tab>Tab 1</Tab>\n    <Tab>Tab 2</Tab>\n  </TabList>\n  <TabPanel>Panel 1 content.</TabPanel>\n  <TabPanel>Panel 2 content.</TabPanel>\n</Tabs>`,
      },
    },
  ],
  props: [
    {
      name: 'activation',
      type: `'automatic' | 'manual'`,
      default: `'automatic'`,
      description: 'Whether arrow keys select on focus or require Enter/Space.',
    },
    {
      name: 'orientation',
      type: `'horizontal' | 'vertical'`,
      default: `'horizontal'`,
      description: 'Tab list direction.',
    },
  ],
  events: [
    {
      name: 'hl:change',
      detail: '{ value: string }',
      description: 'Fires when the active tab changes.',
    },
  ],
  tokens: [
    { name: '--hl-primary', description: 'Active tab indicator.' },
    { name: '--hl-border', description: 'Tab list underline.' },
  ],
  a11y: [
    'Roles (`tablist`, `tab`, `tabpanel`) and `aria-selected` are wired by the enhancer.',
    'A roving tabindex keeps the tab list a single tab stop.',
  ],
  related: ['accordion', 'segmented-control'],
};

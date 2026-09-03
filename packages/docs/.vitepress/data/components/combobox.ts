import type { ComponentDoc } from '../types';

export const combobox: ComponentDoc = {
  slug: 'combobox',
  name: 'Combobox',
  category: 'Forms',
  importName: 'Combobox',
  summary: 'An editable input paired with a filterable listbox.',
  description:
    'An editable input paired with a filterable listbox, following the WAI-ARIA combobox pattern. Before JavaScript runs, the stylesheet reveals the listbox on `:focus-within` so the options are reachable. The enhancer marks the root `data-hl-ready`, then adds type-to-filter, keyboard navigation that skips disabled options, `aria-activedescendant` wiring, and selection.',
  status: 'stable',
  cssOnly: false,
  native: '<input> + <ul role="listbox">',
  cssFile: 'combobox.css',
  enhancer: {
    fn: 'enhanceCombobox',
    subpath: '@hydrateless/enhancers/combobox',
    signature:
      'enhanceCombobox(container, { filter, autoHighlight, defaultValue, onValueChange, onOpenChange })',
  },
  demos: [
    {
      id: 'default',
      title: 'Combobox',
      description:
        'Type to filter, use `Up`/`Down` to move (`Alt+Down` expands without moving), `PageUp`/`PageDown` to jump, and `Enter` to select. `Home`/`End` stay with the text caret. Disabled options are skipped.',
      layout: 'fill',
      render: () =>
        `<div data-hl-combobox style="max-width:18rem">
  <input class="hl-input" placeholder="Search fruit" aria-label="Fruit" />
  <ul role="listbox" aria-label="Fruit">
    <li role="option" data-hl-value="apple">Apple</li>
    <li role="option" data-hl-value="banana">Banana</li>
    <li role="option" data-hl-value="cherry" aria-disabled="true">Cherry (out of season)</li>
    <li role="option" data-hl-value="grape">Grape</li>
  </ul>
</div>`,
      code: {
        react: () =>
          `import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from '@hydrateless/react';\n\n<Combobox defaultValue="" onValueChange={(value) => console.log(value)}>\n  <ComboboxInput placeholder="Search fruit" />\n  <ComboboxList>\n    <ComboboxOption value="apple">Apple</ComboboxOption>\n    <ComboboxOption value="banana">Banana</ComboboxOption>\n    <ComboboxOption value="cherry" disabled>Cherry (out of season)</ComboboxOption>\n  </ComboboxList>\n</Combobox>`,
        vue: () =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from '@hydrateless/vue';\nconst fruit = ref('');\n</script>\n\n<template>\n  <Combobox v-model="fruit">\n    <ComboboxInput placeholder="Search fruit" />\n    <ComboboxList>\n      <ComboboxOption value="apple">Apple</ComboboxOption>\n      <ComboboxOption value="banana">Banana</ComboboxOption>\n      <ComboboxOption value="cherry" disabled>Cherry (out of season)</ComboboxOption>\n    </ComboboxList>\n  </Combobox>\n</template>`,
        svelte: () =>
          `<script>\n  import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from '@hydrateless/svelte';\n  let fruit = $state('');\n</script>\n\n<Combobox bind:value={fruit}>\n  <ComboboxInput placeholder="Search fruit" />\n  <ComboboxList>\n    <ComboboxOption value="apple">Apple</ComboboxOption>\n    <ComboboxOption value="banana">Banana</ComboboxOption>\n    <ComboboxOption value="cherry" disabled>Cherry (out of season)</ComboboxOption>\n  </ComboboxList>\n</Combobox>`,
      },
    },
  ],
  props: [
    {
      name: 'value',
      type: 'string',
      description:
        'Controlled committed value; pair with `onValueChange` (Vue: `v-model`, Svelte: `bind:value`).',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Uncontrolled initial value; pre-fills the input.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: 'Called when a selection is committed.',
    },
    {
      name: 'open',
      type: 'boolean',
      description:
        'Controlled listbox visibility; pair with `onOpenChange` (Vue: `v-model:open`, Svelte: `bind:open`).',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'false',
      description: 'Expand the listbox on mount.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Called after the listbox expands or collapses.',
    },
    {
      name: 'filter',
      type: 'boolean',
      default: 'true',
      description: 'Hide options that do not match the typed query.',
    },
    {
      name: 'autoHighlight',
      type: 'boolean',
      default: 'true',
      description: 'Highlight the first match automatically while typing.',
    },
    {
      name: 'ComboboxOption.disabled',
      type: 'boolean',
      default: 'false',
      description: 'Renders `aria-disabled="true"`; the option is skipped and cannot be selected.',
    },
  ],
  events: [
    {
      name: 'hl:select',
      detail: '{ value: string, option: HTMLElement }',
      description:
        'Cancelable CustomEvent on selection; call `preventDefault()` to keep the input unchanged.',
    },
    {
      name: 'hl:change',
      detail: '{ value: string }',
      description: 'Fires after the value commits (also the `onValueChange` callback).',
    },
    {
      name: 'hl:open-change',
      detail: '{ open: boolean }',
      description:
        'Fires when the listbox expands or collapses (also the `onOpenChange` callback).',
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Listbox background.' },
    { name: '--hl-border', description: 'Listbox and input border.' },
    { name: '--hl-surface-2', description: 'Active option highlight.' },
    { name: '--hl-focus-ring', description: 'Focus ring on the input.' },
  ],
  a11y: [
    'The input becomes `role="combobox"` with `aria-expanded`, `aria-controls`, `aria-haspopup="listbox"`, and `aria-activedescendant`.',
    'The active option is tracked with `aria-selected`; `Esc`, `Tab`, or an outside click closes the list.',
    'Options with `aria-disabled="true"` are skipped during navigation and cannot be committed.',
  ],
  related: ['select', 'command-palette', 'dropdown'],
};

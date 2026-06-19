import type { ComponentDoc } from '../types';

export const combobox: ComponentDoc = {
  slug: 'combobox',
  name: 'Combobox',
  category: 'Forms',
  importName: 'Combobox',
  summary: 'An editable input paired with a filterable listbox.',
  description:
    'An editable input paired with a filterable listbox, following the WAI-ARIA combobox pattern. The enhancer adds type-to-filter, keyboard navigation, `aria-activedescendant` wiring, and selection.',
  status: 'stable',
  cssOnly: false,
  native: '<input> + <ul role="listbox">',
  cssFile: 'combobox.css',
  enhancer: {
    fn: 'enhanceCombobox',
    subpath: '@hydrateless/enhancers/combobox',
    signature: 'enhanceCombobox(container, { filter, autoHighlight, defaultValue, onValueChange })',
  },
  demos: [
    {
      id: 'default',
      title: 'Combobox',
      description: 'Type to filter, use `↑`/`↓` to move, and `Enter` to select.',
      layout: 'fill',
      render: () =>
        `<div data-hl-combobox style="max-width:18rem">
  <input class="hl-input" placeholder="Search fruit" />
  <ul role="listbox">
    <li role="option" data-hl-value="apple">Apple</li>
    <li role="option" data-hl-value="banana">Banana</li>
    <li role="option" data-hl-value="cherry">Cherry</li>
    <li role="option" data-hl-value="grape">Grape</li>
  </ul>
</div>`,
      code: {
        react: () =>
          `import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from '@hydrateless/react';\n\n<Combobox onValueChange={(value) => console.log(value)}>\n  <ComboboxInput placeholder="Search fruit" />\n  <ComboboxList>\n    <ComboboxOption value="apple">Apple</ComboboxOption>\n    <ComboboxOption value="banana">Banana</ComboboxOption>\n  </ComboboxList>\n</Combobox>`,
        vue: () =>
          `<script setup>\nimport { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Combobox @select="(value) => console.log(value)">\n    <ComboboxInput placeholder="Search fruit" />\n    <ComboboxList>\n      <ComboboxOption value="apple">Apple</ComboboxOption>\n      <ComboboxOption value="banana">Banana</ComboboxOption>\n    </ComboboxList>\n  </Combobox>\n</template>`,
        svelte: () =>
          `<script>\n  import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from '@hydrateless/svelte';\n</script>\n\n<Combobox onValueChange={(value) => console.log(value)}>\n  <ComboboxInput placeholder="Search fruit" />\n  <ComboboxList>\n    <ComboboxOption value="apple">Apple</ComboboxOption>\n    <ComboboxOption value="banana">Banana</ComboboxOption>\n  </ComboboxList>\n</Combobox>`,
      },
    },
  ],
  props: [
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: 'Fires when a selection is committed.',
    },
    { name: 'defaultValue', type: 'string', description: 'Initially selected option value.' },
  ],
  events: [
    {
      name: 'hl:select',
      detail: '{ value: string; option: HTMLElement }',
      description:
        'Cancelable CustomEvent on selection; call `preventDefault()` to keep the input unchanged.',
    },
    {
      name: 'hl:change',
      detail: '{ value: string }',
      description: 'Fires after the value commits.',
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Listbox background.' },
    { name: '--hl-border', description: 'Listbox and input border.' },
    { name: '--hl-primary', description: 'Active option highlight.' },
  ],
  a11y: [
    'The input becomes `role="combobox"` with `aria-expanded`, `aria-controls`, and `aria-activedescendant`.',
    'The active option is tracked with `aria-selected`; `Esc` or an outside click closes the list.',
  ],
  related: ['select', 'command-palette', 'dropdown'],
};

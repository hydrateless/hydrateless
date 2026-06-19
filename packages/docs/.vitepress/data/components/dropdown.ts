import type { ComponentDoc } from '../types';

export const dropdown: ComponentDoc = {
  slug: 'dropdown',
  name: 'Dropdown Menu',
  category: 'Actions & Overlays',
  importName: 'Dropdown',
  summary: 'A button-triggered menu following the WAI-ARIA menu pattern.',
  description:
    'A button-triggered menu following the WAI-ARIA menu pattern. The enhancer adds keyboard navigation, typeahead, viewport-aware placement, and `aria-expanded`/`role` wiring.',
  status: 'stable',
  cssOnly: false,
  native: '<button> + <ul>',
  cssFile: 'dropdown.css',
  enhancer: {
    fn: 'enhanceDropdown',
    subpath: '@hydrateless/enhancers/dropdown',
    signature: 'enhanceDropdown(container, { defaultOpen, onOpenChange, onSelect })',
  },
  demos: [
    {
      id: 'default',
      title: 'Dropdown',
      description: 'Open with click or `↓`, then navigate with the arrow keys and typeahead.',
      layout: 'center',
      render: () =>
        `<div data-hl-dropdown>
  <button class="hl-button" data-hl-variant="outline" data-hl-dropdown-trigger>Actions</button>
  <ul data-hl-dropdown-menu>
    <li><button role="menuitem">Edit</button></li>
    <li><button role="menuitem">Duplicate</button></li>
    <li role="separator"></li>
    <li><button role="menuitem">Delete</button></li>
  </ul>
</div>`,
      code: {
        react: () =>
          `import {\n  Dropdown,\n  DropdownTrigger,\n  DropdownMenu,\n  DropdownItem,\n  DropdownSeparator,\n} from '@hydrateless/react';\n\n<Dropdown>\n  <DropdownTrigger>Actions</DropdownTrigger>\n  <DropdownMenu>\n    <DropdownItem onSelect={edit}>Edit</DropdownItem>\n    <DropdownItem onSelect={duplicate}>Duplicate</DropdownItem>\n    <DropdownSeparator />\n    <DropdownItem onSelect={remove}>Delete</DropdownItem>\n  </DropdownMenu>\n</Dropdown>`,
        vue: () =>
          `<script setup>\nimport {\n  Dropdown,\n  DropdownTrigger,\n  DropdownMenu,\n  DropdownItem,\n  DropdownSeparator,\n} from '@hydrateless/vue';\n</script>\n\n<template>\n  <Dropdown>\n    <DropdownTrigger>Actions</DropdownTrigger>\n    <DropdownMenu>\n      <DropdownItem @select="edit">Edit</DropdownItem>\n      <DropdownItem @select="duplicate">Duplicate</DropdownItem>\n      <DropdownSeparator />\n      <DropdownItem @select="remove">Delete</DropdownItem>\n    </DropdownMenu>\n  </Dropdown>\n</template>`,
        svelte: () =>
          `<script>\n  import {\n    Dropdown,\n    DropdownTrigger,\n    DropdownMenu,\n    DropdownItem,\n    DropdownSeparator,\n  } from '@hydrateless/svelte';\n</script>\n\n<Dropdown>\n  <DropdownTrigger>Actions</DropdownTrigger>\n  <DropdownMenu>\n    <DropdownItem onSelect={edit}>Edit</DropdownItem>\n    <DropdownItem onSelect={duplicate}>Duplicate</DropdownItem>\n    <DropdownSeparator />\n    <DropdownItem onSelect={remove}>Delete</DropdownItem>\n  </DropdownMenu>\n</Dropdown>`,
      },
    },
  ],
  props: [
    {
      name: 'onSelect',
      type: '(value: string) => void',
      description: 'Fires with the selected item value.',
    },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Open on mount.' },
  ],
  events: [
    {
      name: 'hl:select',
      detail: '{ value: string }',
      description: "Cancelable CustomEvent carrying the item's `data-hl-value` (or text).",
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Menu background.' },
    { name: '--hl-border', description: 'Menu border.' },
    { name: '--hl-shadow-md', description: 'Menu elevation.' },
  ],
  a11y: [
    'The trigger exposes `aria-haspopup` and `aria-expanded`; the list is `role="menu"`.',
    'Arrow keys, Home/End, typeahead, and `Esc` to close are all handled.',
  ],
  related: ['menu', 'popover', 'combobox'],
};

import type { ComponentDoc } from '../types';

export const dropdown: ComponentDoc = {
  slug: 'dropdown',
  name: 'Dropdown Menu',
  category: 'Actions & Overlays',
  importName: 'Dropdown',
  summary: 'A button-triggered menu following the WAI-ARIA menu button pattern.',
  description:
    'A button-triggered menu following the WAI-ARIA menu button pattern, built on the native Popover API. Put `popover` on the menu and `popovertarget` on the trigger and the browser handles opening, Escape, light dismiss, and the top layer with no JavaScript. The enhancer adds `role="menu"` wiring, roving focus, arrow/Home/End/typeahead navigation that skips disabled items, `menuitemcheckbox`/`menuitemradio` state, and focus return to the trigger.',
  status: 'stable',
  cssOnly: false,
  native: '<button popovertarget> + <ul popover>',
  cssFile: 'dropdown.css',
  enhancer: {
    fn: 'enhanceDropdown',
    subpath: '@hydrateless/enhancers/dropdown',
    signature:
      'enhanceDropdown(container, { placement, closeOnSelect, defaultOpen, onOpenChange, onSelect })',
  },
  demos: [
    {
      id: 'default',
      title: 'Dropdown',
      description:
        'Open with a click or `Down`, then navigate with the arrow keys and typeahead. `Esc` closes and returns focus to the trigger; clicking outside closes without moving focus.',
      layout: 'center',
      render: () =>
        `<div data-hl-dropdown>
  <button class="hl-button" data-hl-variant="outline" data-hl-dropdown-trigger popovertarget="demo-dropdown-menu">Actions</button>
  <ul id="demo-dropdown-menu" data-hl-dropdown-menu popover>
    <li role="none"><button role="menuitem" data-hl-value="edit">Edit</button></li>
    <li role="none"><button role="menuitem" data-hl-value="duplicate">Duplicate</button></li>
    <li role="none"><button role="menuitem" data-hl-value="archive" disabled>Archive</button></li>
    <li role="separator" class="hl-dropdown-separator"></li>
    <li role="none"><button role="menuitem" data-hl-value="delete">Delete</button></li>
  </ul>
</div>`,
      code: {
        react: () =>
          `import {\n  Dropdown,\n  DropdownTrigger,\n  DropdownMenu,\n  DropdownItem,\n  DropdownSeparator,\n} from '@hydrateless/react';\n\n<Dropdown onSelect={(value) => console.log(value)}>\n  <DropdownTrigger>Actions</DropdownTrigger>\n  <DropdownMenu>\n    <DropdownItem value="edit">Edit</DropdownItem>\n    <DropdownItem value="duplicate">Duplicate</DropdownItem>\n    <DropdownItem value="archive" disabled>Archive</DropdownItem>\n    <DropdownSeparator />\n    <DropdownItem value="delete">Delete</DropdownItem>\n  </DropdownMenu>\n</Dropdown>`,
        vue: () =>
          `<script setup>\nimport {\n  Dropdown,\n  DropdownTrigger,\n  DropdownMenu,\n  DropdownItem,\n  DropdownSeparator,\n} from '@hydrateless/vue';\n</script>\n\n<template>\n  <Dropdown @select="(value) => console.log(value)">\n    <DropdownTrigger>Actions</DropdownTrigger>\n    <DropdownMenu>\n      <DropdownItem value="edit">Edit</DropdownItem>\n      <DropdownItem value="duplicate">Duplicate</DropdownItem>\n      <DropdownItem value="archive" disabled>Archive</DropdownItem>\n      <DropdownSeparator />\n      <DropdownItem value="delete">Delete</DropdownItem>\n    </DropdownMenu>\n  </Dropdown>\n</template>`,
        svelte: () =>
          `<script>\n  import {\n    Dropdown,\n    DropdownTrigger,\n    DropdownMenu,\n    DropdownItem,\n    DropdownSeparator,\n  } from '@hydrateless/svelte';\n</script>\n\n<Dropdown onSelect={(value) => console.log(value)}>\n  <DropdownTrigger>Actions</DropdownTrigger>\n  <DropdownMenu>\n    <DropdownItem value="edit">Edit</DropdownItem>\n    <DropdownItem value="duplicate">Duplicate</DropdownItem>\n    <DropdownItem value="archive" disabled>Archive</DropdownItem>\n    <DropdownSeparator />\n    <DropdownItem value="delete">Delete</DropdownItem>\n  </DropdownMenu>\n</Dropdown>`,
      },
    },
    {
      id: 'checkable',
      title: 'Checkable items and groups',
      description:
        '`role="menuitemcheckbox"` toggles `aria-checked`; `role="menuitemradio"` checks itself and unchecks its siblings in the same `role="group"`. `hl:select` and `onSelect` report the new `checked` state. Pass `closeOnSelect: false` to keep the menu open while several boxes are toggled.',
      layout: 'center',
      render: () =>
        `<div data-hl-dropdown data-hl-close-on-select="false">
  <button class="hl-button" data-hl-variant="outline" data-hl-dropdown-trigger popovertarget="demo-dropdown-view">View</button>
  <ul id="demo-dropdown-view" data-hl-dropdown-menu popover>
    <li role="none">
      <ul role="group" aria-label="Layout">
        <li role="none"><button role="menuitemradio" aria-checked="true" data-hl-value="list">List</button></li>
        <li role="none"><button role="menuitemradio" aria-checked="false" data-hl-value="grid">Grid</button></li>
      </ul>
    </li>
    <li role="separator" class="hl-dropdown-separator"></li>
    <li role="none"><button role="menuitemcheckbox" aria-checked="false" data-hl-value="hidden">Show hidden files</button></li>
    <li role="none"><button role="menuitemcheckbox" aria-checked="true" data-hl-value="extensions">Show extensions</button></li>
  </ul>
</div>`,
      code: {
        react: () =>
          `import {\n  Dropdown,\n  DropdownTrigger,\n  DropdownMenu,\n  DropdownGroup,\n  DropdownItem,\n  DropdownSeparator,\n} from '@hydrateless/react';\n\n<Dropdown closeOnSelect={false} onSelect={(value, item, checked) => console.log(value, checked)}>\n  <DropdownTrigger>View</DropdownTrigger>\n  <DropdownMenu>\n    <DropdownGroup label="Layout">\n      <DropdownItem role="menuitemradio" value="list" checked>List</DropdownItem>\n      <DropdownItem role="menuitemradio" value="grid">Grid</DropdownItem>\n    </DropdownGroup>\n    <DropdownSeparator />\n    <DropdownItem role="menuitemcheckbox" value="hidden">Show hidden files</DropdownItem>\n    <DropdownItem role="menuitemcheckbox" value="extensions" checked>Show extensions</DropdownItem>\n  </DropdownMenu>\n</Dropdown>`,
        vue: () =>
          `<script setup>\nimport {\n  Dropdown,\n  DropdownTrigger,\n  DropdownMenu,\n  DropdownGroup,\n  DropdownItem,\n  DropdownSeparator,\n} from '@hydrateless/vue';\n</script>\n\n<template>\n  <Dropdown :close-on-select="false" @select="(value, item, checked) => console.log(value, checked)">\n    <DropdownTrigger>View</DropdownTrigger>\n    <DropdownMenu>\n      <DropdownGroup label="Layout">\n        <DropdownItem role="menuitemradio" value="list" checked>List</DropdownItem>\n        <DropdownItem role="menuitemradio" value="grid">Grid</DropdownItem>\n      </DropdownGroup>\n      <DropdownSeparator />\n      <DropdownItem role="menuitemcheckbox" value="hidden">Show hidden files</DropdownItem>\n      <DropdownItem role="menuitemcheckbox" value="extensions" checked>Show extensions</DropdownItem>\n    </DropdownMenu>\n  </Dropdown>\n</template>`,
        svelte: () =>
          `<script>\n  import {\n    Dropdown,\n    DropdownTrigger,\n    DropdownMenu,\n    DropdownGroup,\n    DropdownItem,\n    DropdownSeparator,\n  } from '@hydrateless/svelte';\n</script>\n\n<Dropdown closeOnSelect={false} onSelect={(value, item, checked) => console.log(value, checked)}>\n  <DropdownTrigger>View</DropdownTrigger>\n  <DropdownMenu>\n    <DropdownGroup label="Layout">\n      <DropdownItem role="menuitemradio" value="list" checked>List</DropdownItem>\n      <DropdownItem role="menuitemradio" value="grid">Grid</DropdownItem>\n    </DropdownGroup>\n    <DropdownSeparator />\n    <DropdownItem role="menuitemcheckbox" value="hidden">Show hidden files</DropdownItem>\n    <DropdownItem role="menuitemcheckbox" value="extensions" checked>Show extensions</DropdownItem>\n  </DropdownMenu>\n</Dropdown>`,
      },
    },
  ],
  props: [
    {
      name: 'open',
      type: 'boolean',
      description:
        'Controlled open state; pair with `onOpenChange` (Vue: `v-model:open`, Svelte: `bind:open`).',
    },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Open on mount.' },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Called after the menu opens or closes.',
    },
    {
      name: 'onSelect',
      type: '(value: string, item: HTMLElement, checked?: boolean) => void',
      description:
        'Called with the activated item value. For checkable items, `checked` is the new state.',
    },
    {
      name: 'closeOnSelect',
      type: 'boolean',
      default: 'true',
      description: 'Close the menu after an item is activated.',
    },
    {
      name: 'placement',
      type: 'Placement',
      default: `'bottom-start'`,
      description:
        'Placement used by the JS positioning fallback when CSS anchor positioning is missing.',
    },
    {
      name: 'DropdownItem.value',
      type: 'string',
      description: 'Value reported by `onSelect`; defaults to the item text.',
    },
    {
      name: 'DropdownItem.role',
      type: `'menuitem' | 'menuitemcheckbox' | 'menuitemradio'`,
      default: `'menuitem'`,
      description: 'Plain action, toggle, or single-select item.',
    },
    {
      name: 'DropdownItem.checked',
      type: 'boolean',
      default: 'false',
      description: 'Initial `aria-checked` for checkable items.',
    },
    {
      name: 'DropdownItem.disabled',
      type: 'boolean',
      default: 'false',
      description: 'Skipped by arrow navigation and typeahead; cannot be activated.',
    },
    {
      name: 'DropdownGroup.label',
      type: 'string',
      description: 'Accessible name of the `role="group"`; scopes `menuitemradio` exclusivity.',
    },
  ],
  events: [
    {
      name: 'hl:open-change',
      detail: '{ open: boolean }',
      description: 'Fires after the menu opens or closes (also the `onOpenChange` callback).',
    },
    {
      name: 'hl:select',
      detail: '{ value: string, item: HTMLElement, checked?: boolean }',
      description:
        "Cancelable CustomEvent carrying the item's `data-hl-value` (or text). `preventDefault()` vetoes the activation and restores the previous checked state.",
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Menu background.' },
    { name: '--hl-border', description: 'Menu border.' },
    { name: '--hl-overlay-shadow', description: 'Menu elevation.' },
  ],
  a11y: [
    'The trigger exposes `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`; the list is `role="menu"` labelled by the trigger.',
    'Arrow keys, Home/End, typeahead, Enter/Space, and `Esc` are handled; disabled items are skipped and inert.',
    'Focus returns to the trigger when the menu closes via `Esc`, `Tab`, or item activation, but not on light dismiss.',
    'Every `menuitemcheckbox`/`menuitemradio` carries an explicit `aria-checked`.',
  ],
  related: ['menu', 'popover', 'combobox'],
};

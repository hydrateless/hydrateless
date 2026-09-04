import type { ComponentDoc } from '../types';

export const menu: ComponentDoc = {
  slug: 'menu',
  name: 'Menu',
  category: 'Actions & Overlays',
  importName: 'Menu',
  summary: 'A menubar with nested submenus.',
  description:
    "A menubar or navigation menu with nested submenus, following the WAI-ARIA menubar pattern. Without JavaScript the stylesheet reveals submenus on hover and `:focus-within`. The enhancer marks the root `data-hl-ready`, takes over visibility, and wires a roving tabindex, orientation-aware arrow navigation, typeahead, checkable items, and disabled skipping. Submenus are promoted to native popovers so they render in the top layer, positioned against their trigger with CSS anchor positioning (with a JS fallback). Submenus nest to any depth: an item followed by a sibling `data-hl-submenu` opens it with `Right` (`Left` in RTL), and `Left` or `Esc` steps back out. The open top-level submenu is the menu's value.",
  status: 'stable',
  cssOnly: false,
  native: '<ul role="menubar">',
  cssFile: 'menu.css',
  enhancer: {
    fn: 'enhanceMenu',
    subpath: '@hydrateless/enhancers/menu',
    signature: 'enhanceMenu(container, { orientation, defaultValue, onValueChange, onSelect })',
  },
  demos: [
    {
      id: 'default',
      title: 'Menubar',
      description:
        "Arrow keys move between items; `Enter`, `Space`, or `Down` opens a submenu and `Esc` closes it. Each top-level trigger's `data-hl-value` is the value reported while its submenu is open.",
      layout: 'fill',
      render: () =>
        `<ul data-hl-menu role="menubar" aria-label="Editor">
  <li>
    <button role="menuitem" data-hl-value="file">File</button>
    <ul role="menu" data-hl-submenu>
      <li><button role="menuitem" data-hl-value="new">New</button></li>
      <li><button role="menuitem" data-hl-value="open">Open</button></li>
      <li>
        <button role="menuitem" data-hl-value="export">Export</button>
        <ul role="menu" data-hl-submenu>
          <li><button role="menuitem" data-hl-value="export-pdf">PDF</button></li>
          <li><button role="menuitem" data-hl-value="export-png">PNG</button></li>
        </ul>
      </li>
      <li><button role="menuitem" data-hl-value="save-as" disabled>Save As</button></li>
    </ul>
  </li>
  <li>
    <button role="menuitem" data-hl-value="view">View</button>
    <ul role="menu" data-hl-submenu>
      <li><button role="menuitemcheckbox" aria-checked="true" data-hl-value="sidebar">Sidebar</button></li>
      <li><button role="menuitemcheckbox" aria-checked="false" data-hl-value="minimap">Minimap</button></li>
    </ul>
  </li>
  <li><a role="menuitem" href="#help" data-hl-value="help">Help</a></li>
</ul>`,
      code: {
        react: () =>
          `import { Menu, MenuItem, MenuSubmenu } from '@hydrateless/react';\n\n<Menu\n  orientation="horizontal"\n  onValueChange={(value) => console.log('open submenu', value)}\n  onSelect={(value, item, checked) => run(value, checked)}\n>\n  <MenuSubmenu label="File" value="file">\n    <MenuItem value="new">New</MenuItem>\n    <MenuSubmenu label="Export">\n      <MenuItem value="export-pdf">PDF</MenuItem>\n      <MenuItem value="export-png">PNG</MenuItem>\n    </MenuSubmenu>\n  </MenuSubmenu>\n  <MenuItem value="help" href="/help">Help</MenuItem>\n</Menu>`,
        vue: () =>
          `<script setup>\nimport { ref } from 'vue';\nimport { Menu, MenuItem, MenuSubmenu } from '@hydrateless/vue';\nconst openSubmenu = ref(null);\n</script>\n\n<template>\n  <Menu v-model="openSubmenu" orientation="horizontal" @select="(value, item, checked) => run(value, checked)">\n    <MenuSubmenu label="File" value="file">\n      <MenuItem value="new">New</MenuItem>\n      <MenuItem value="open">Open</MenuItem>\n    </MenuSubmenu>\n    <MenuItem value="help" href="/help">Help</MenuItem>\n  </Menu>\n</template>`,
        svelte: () =>
          `<script>\n  import { Menu, MenuItem, MenuSubmenu } from '@hydrateless/svelte';\n  let openSubmenu = $state(null);\n</script>\n\n<Menu bind:value={openSubmenu} orientation="horizontal" onSelect={(value, item, checked) => run(value, checked)}>\n  <MenuSubmenu label="File" value="file">\n    <MenuItem value="new">New</MenuItem>\n    <MenuSubmenu label="Export">\n      <MenuItem value="export-pdf">PDF</MenuItem>\n      <MenuItem value="export-png">PNG</MenuItem>\n    </MenuSubmenu>\n  </MenuSubmenu>\n  <MenuItem value="help" href="/help">Help</MenuItem>\n</Menu>`,
      },
    },
  ],
  props: [
    {
      name: 'value',
      type: 'string | null',
      description:
        'Controlled open submenu (`null` when all are closed); pair with `onValueChange` (Vue: `v-model`, Svelte: `bind:value`).',
    },
    {
      name: 'defaultValue',
      type: 'string | null',
      default: 'null',
      description: 'Submenu to open on mount, uncontrolled.',
    },
    {
      name: 'onValueChange',
      type: '(value: string | null) => void',
      description: 'Called with the open submenu value (or `null`) after every change.',
    },
    {
      name: 'onSelect',
      type: '(value: string, item: HTMLElement, checked?: boolean) => void',
      description:
        'Called with the item value when a leaf item is activated. For checkable items, `checked` is the new state.',
    },
    {
      name: 'orientation',
      type: `'horizontal' | 'vertical'`,
      default: `'horizontal'`,
      description: 'Direction of the top-level items. Vertical menus open submenus to the side.',
    },
    {
      name: 'MenuSubmenu.label',
      type: 'string',
      description:
        'Text of the top-level trigger that opens the submenu. Vue and Svelte also accept a `trigger` slot/snippet for rich content; React accepts any node.',
    },
    {
      name: 'MenuSubmenu.value',
      type: 'string',
      description:
        'Value reported by `onValueChange` while the submenu is open. Defaults to the top-level index.',
    },
    {
      name: 'MenuItem.value',
      type: 'string',
      description:
        'Value reported by `onSelect` when the leaf item is activated. Defaults to the item text.',
    },
    {
      name: 'MenuItem.href',
      type: 'string',
      description: 'Render the item as a link instead of a button.',
    },
    {
      name: 'MenuItem.role',
      type: `'menuitem' | 'menuitemcheckbox' | 'menuitemradio'`,
      default: `'menuitem'`,
      description:
        'Plain action, toggle, or single-select item. Pair checkable roles with `checked`.',
    },
    {
      name: 'MenuItem.disabled',
      type: 'boolean',
      default: 'false',
      description: 'Skipped by arrow navigation and typeahead; cannot be activated.',
    },
  ],
  events: [
    {
      name: 'hl:change',
      detail: '{ value: string | null }',
      description:
        'Fires when a submenu opens or closes, with the open submenu value (also `onValueChange`).',
    },
    {
      name: 'hl:select',
      detail: '{ value: string, item: HTMLElement, checked?: boolean }',
      description: 'Fires when a leaf item is activated. Cancelable.',
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Submenu background.' },
    { name: '--hl-border', description: 'Submenu border.' },
    { name: '--hl-overlay-shadow', description: 'Submenu elevation.' },
  ],
  a11y: [
    'A roving tabindex keeps the menubar a single tab stop.',
    'Submenu triggers expose `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`, at every level of nesting.',
    'Before the enhancer runs, submenus open on hover and `:focus-within`, so the navigation is usable with no JavaScript.',
    'Disabled items are skipped; `menuitemcheckbox` and `menuitemradio` keep `aria-checked` in sync.',
  ],
  related: ['dropdown', 'breadcrumb'],
};

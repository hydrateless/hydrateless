import type { ComponentDoc } from '../types';

export const menu: ComponentDoc = {
  slug: 'menu',
  name: 'Menu',
  category: 'Actions & Overlays',
  importName: 'Menu',
  summary: 'A menubar with single-level submenus.',
  description:
    'A menubar or navigation menu with single-level submenus, following the WAI-ARIA menubar pattern. The enhancer wires a roving tabindex, orientation-aware arrow navigation, submenu toggling, and typeahead.',
  status: 'stable',
  cssOnly: false,
  native: '<ul role="menubar">',
  cssFile: 'menu.css',
  enhancer: {
    fn: 'enhanceMenu',
    subpath: '@hydrateless/enhancers/menu',
    signature: "enhanceMenu(container, { orientation: 'horizontal' | 'vertical' })",
  },
  demos: [
    {
      id: 'default',
      title: 'Menubar',
      description: 'Arrow keys move between items; `Enter` or an arrow opens a submenu.',
      layout: 'fill',
      render: () =>
        `<ul data-hl-menu role="menubar">
  <li>
    <button role="menuitem">File</button>
    <ul role="menu" data-hl-menu-submenu>
      <li><button role="menuitem">New</button></li>
      <li><button role="menuitem">Open</button></li>
      <li><button role="menuitem">Save As…</button></li>
    </ul>
  </li>
  <li>
    <button role="menuitem">Edit</button>
    <ul role="menu" data-hl-menu-submenu>
      <li><button role="menuitem">Undo</button></li>
      <li><button role="menuitem">Redo</button></li>
    </ul>
  </li>
  <li><button role="menuitem">View</button></li>
</ul>`,
      code: {
        react: () =>
          `import { Menu, MenuItem } from '@hydrateless/react';\n\n<Menu orientation="horizontal">\n  <MenuItem\n    submenu={\n      <>\n        <MenuItem>New</MenuItem>\n        <MenuItem>Open</MenuItem>\n      </>\n    }\n  >\n    File\n  </MenuItem>\n  <MenuItem>Edit</MenuItem>\n</Menu>`,
        vue: () =>
          `<script setup>\nimport { Menu, MenuItem } from '@hydrateless/vue';\n</script>\n\n<template>\n  <Menu orientation="horizontal">\n    <MenuItem>\n      File\n      <template #submenu>\n        <MenuItem>New</MenuItem>\n        <MenuItem>Open</MenuItem>\n      </template>\n    </MenuItem>\n    <MenuItem>Edit</MenuItem>\n  </Menu>\n</template>`,
        svelte: () =>
          `<script>\n  import { Menu, MenuItem } from '@hydrateless/svelte';\n</script>\n\n<Menu orientation="horizontal">\n  <MenuItem>\n    File\n    {#snippet submenu()}\n      <MenuItem>New</MenuItem>\n      <MenuItem>Open</MenuItem>\n    {/snippet}\n  </MenuItem>\n  <MenuItem>Edit</MenuItem>\n</Menu>`,
      },
    },
  ],
  props: [
    {
      name: 'orientation',
      type: `'horizontal' | 'vertical'`,
      default: `'horizontal'`,
      description: 'Direction of the top-level items.',
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Submenu background.' },
    { name: '--hl-border', description: 'Submenu border.' },
    { name: '--hl-shadow-md', description: 'Submenu elevation.' },
  ],
  a11y: [
    'A roving tabindex keeps the menubar a single tab stop.',
    'Submenu triggers expose `aria-haspopup`, `aria-expanded`, and `aria-controls`.',
  ],
  related: ['dropdown', 'breadcrumb'],
};

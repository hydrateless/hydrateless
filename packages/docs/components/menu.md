# Menu

A menubar / navigation menu with single-level submenus, following the WAI-ARIA
menubar pattern. The enhancer wires a roving tabindex, orientation-aware arrow
navigation, submenu toggling, and typeahead.

## Demo

<div class="hl-demo">
<ul data-hl-menu role="menubar">
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
</ul>
</div>

## HTML

```html
<ul data-hl-menu role="menubar">
  <li>
    <button role="menuitem">File</button>
    <ul role="menu" data-hl-menu-submenu>
      <li><button role="menuitem">New</button></li>
      <li><button role="menuitem">Open</button></li>
    </ul>
  </li>
  <li><button role="menuitem">Edit</button></li>
</ul>
```

- **CSS**: `hydrateless/menu.css`
- **JS**: `enhanceMenu(container, { orientation })`, where `orientation` is
  `'horizontal'` (default) or `'vertical'`.
- **Keyboard**: `←`/`→` (or `↑`/`↓` when vertical) move between top-level items,
  `Enter`/`Space`/arrow opens a submenu, `Home`/`End` jump to first/last, `Esc`
  closes, plus typeahead within submenus.
- **ARIA**: roving tabindex across top items; submenu triggers expose
  `aria-haspopup`, `aria-expanded`, and `aria-controls`.

## Frameworks

::: code-group

```tsx [React]
import { Menu, MenuItem } from '@hydrateless/react';

<Menu orientation="horizontal">
  <MenuItem
    submenu={
      <>
        <MenuItem>New</MenuItem>
        <MenuItem>Open</MenuItem>
      </>
    }
  >
    File
  </MenuItem>
  <MenuItem>Edit</MenuItem>
</Menu>;
```

```vue [Vue]
<script setup>
import { Menu, MenuItem } from '@hydrateless/vue';
</script>

<template>
  <Menu orientation="horizontal">
    <MenuItem>
      File
      <template #submenu>
        <MenuItem>New</MenuItem>
        <MenuItem>Open</MenuItem>
      </template>
    </MenuItem>
    <MenuItem>Edit</MenuItem>
  </Menu>
</template>
```

```svelte [Svelte]
<script>
  import { Menu, MenuItem } from '@hydrateless/svelte';
</script>

<Menu orientation="horizontal">
  <MenuItem>
    File
    {#snippet submenu()}
      <MenuItem>New</MenuItem>
      <MenuItem>Open</MenuItem>
    {/snippet}
  </MenuItem>
  <MenuItem>Edit</MenuItem>
</Menu>
```

:::

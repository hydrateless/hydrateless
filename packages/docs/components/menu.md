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
- **JS**: `enhanceMenu(container, { orientation })` — `orientation` is
  `'horizontal'` (default) or `'vertical'`.
- **Keyboard**: `←`/`→` (or `↑`/`↓` when vertical) move between top-level items,
  `Enter`/`Space`/arrow opens a submenu, `Home`/`End` jump to first/last, `Esc`
  closes, plus typeahead within submenus.
- **ARIA**: roving tabindex across top items; submenu triggers expose
  `aria-haspopup`, `aria-expanded`, and `aria-controls`.

## Frameworks

::: code-group

```tsx [React]
import { Menu } from '@hydrateless/react';

<Menu
  orientation="horizontal"
  items={[
    {
      label: 'File',
      items: [
        { label: 'New', onSelect: () => {} },
        { label: 'Open', onSelect: () => {} },
      ],
    },
    { label: 'Edit', onSelect: () => {} },
  ]}
/>;
```

```vue [Vue]
<template>
  <ul v-hl-menu data-hl-menu role="menubar">
    <li>
      <button role="menuitem">File</button>
      <ul role="menu" data-hl-menu-submenu>
        <li><button role="menuitem">New</button></li>
        <li><button role="menuitem">Open</button></li>
      </ul>
    </li>
    <li><button role="menuitem">Edit</button></li>
  </ul>
</template>
```

```svelte [Svelte]
<script>
  import { menu } from '@hydrateless/svelte';
</script>

<ul use:menu data-hl-menu role="menubar">
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

:::

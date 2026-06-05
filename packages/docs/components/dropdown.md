# Dropdown Menu

A button-triggered menu following the WAI-ARIA menu pattern. The enhancer adds
keyboard navigation, typeahead, viewport-aware placement, and
`aria-expanded`/`role` wiring.

## Demo

<div class="hl-demo">
<div data-hl-dropdown>
  <button data-hl-dropdown-trigger>Actions</button>
  <ul data-hl-dropdown-menu>
    <li><button role="menuitem">Edit</button></li>
    <li><button role="menuitem">Duplicate</button></li>
    <li role="separator"></li>
    <li><button role="menuitem">Delete</button></li>
  </ul>
</div>
</div>

## HTML

```html
<div data-hl-dropdown>
  <button data-hl-dropdown-trigger>Actions</button>
  <ul data-hl-dropdown-menu>
    <li><button role="menuitem">Edit</button></li>
    <li><button role="menuitem">Duplicate</button></li>
    <li role="separator"></li>
    <li><button role="menuitem">Delete</button></li>
  </ul>
</div>
```

- **CSS**: `hydrateless/dropdown.css`
- **JS**: `enhanceDropdown(container)`
- **Keyboard**: `↓`/`↑` move between items, `Enter`/`Space` activate, `Esc`
  closes, `Home`/`End` jump to first/last, plus character typeahead.
- **ARIA**: sets `aria-haspopup` and `aria-expanded` on the trigger and
  `role="menu"` on the list.

## Frameworks

::: code-group

```tsx [React]
import { Dropdown } from '@hydrateless/react';

<Dropdown
  trigger="Actions"
  items={[
    { label: 'Edit', onSelect: () => edit() },
    { label: 'Duplicate', onSelect: () => duplicate() },
    { separator: true },
    { label: 'Delete', onSelect: () => remove() },
  ]}
/>;
```

```vue [Vue]
<template>
  <div v-hl-dropdown data-hl-dropdown>
    <button data-hl-dropdown-trigger>Actions</button>
    <ul data-hl-dropdown-menu>
      <li><button role="menuitem">Edit</button></li>
      <li><button role="menuitem">Delete</button></li>
    </ul>
  </div>
</template>
```

```svelte [Svelte]
<script>
  import { dropdown } from '@hydrateless/svelte';
</script>

<div use:dropdown data-hl-dropdown>
  <button data-hl-dropdown-trigger>Actions</button>
  <ul data-hl-dropdown-menu>
    <li><button role="menuitem">Edit</button></li>
    <li><button role="menuitem">Delete</button></li>
  </ul>
</div>
```

:::

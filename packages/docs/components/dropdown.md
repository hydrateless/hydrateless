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
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
} from '@hydrateless/react';

<Dropdown>
  <DropdownTrigger>Actions</DropdownTrigger>
  <DropdownMenu>
    <DropdownItem onSelect={edit}>Edit</DropdownItem>
    <DropdownItem onSelect={duplicate}>Duplicate</DropdownItem>
    <DropdownSeparator />
    <DropdownItem onSelect={remove}>Delete</DropdownItem>
  </DropdownMenu>
</Dropdown>;
```

```vue [Vue]
<script setup>
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
} from '@hydrateless/vue';
</script>

<template>
  <Dropdown>
    <DropdownTrigger>Actions</DropdownTrigger>
    <DropdownMenu>
      <DropdownItem @select="edit">Edit</DropdownItem>
      <DropdownItem @select="duplicate">Duplicate</DropdownItem>
      <DropdownSeparator />
      <DropdownItem @select="remove">Delete</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>
```

```svelte [Svelte]
<script>
  import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSeparator,
  } from '@hydrateless/svelte';
</script>

<Dropdown>
  <DropdownTrigger>Actions</DropdownTrigger>
  <DropdownMenu>
    <DropdownItem onSelect={edit}>Edit</DropdownItem>
    <DropdownItem onSelect={duplicate}>Duplicate</DropdownItem>
    <DropdownSeparator />
    <DropdownItem onSelect={remove}>Delete</DropdownItem>
  </DropdownMenu>
</Dropdown>
```

:::

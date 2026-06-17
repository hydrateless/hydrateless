# Combobox

An editable input paired with a filterable listbox, following the WAI-ARIA
combobox pattern. The enhancer adds type-to-filter, keyboard navigation,
`aria-activedescendant` wiring, and selection.

## Demo

<div class="hl-demo">
<div data-hl-combobox>
  <input class="hl-input" placeholder="Search fruit" />
  <ul role="listbox">
    <li role="option" data-hl-value="apple">Apple</li>
    <li role="option" data-hl-value="banana">Banana</li>
    <li role="option" data-hl-value="cherry">Cherry</li>
    <li role="option" data-hl-value="grape">Grape</li>
  </ul>
</div>
</div>

## HTML

```html
<div data-hl-combobox>
  <input class="hl-input" placeholder="Search fruit" />
  <ul role="listbox">
    <li role="option" data-hl-value="apple">Apple</li>
    <li role="option" data-hl-value="banana">Banana</li>
  </ul>
</div>
```

- **CSS**: `hydrateless/combobox.css`
- **JS**: `enhanceCombobox(container, { filter?, autoHighlight?, defaultValue?, onValueChange? })`.
  The handle's `api` exposes `value`/`setValue` and `open`/`setOpen`;
  selection emits a cancelable `hl:select` followed by `hl:change`.
- **Events**: emits a cancelable `hl:select` `CustomEvent` with
  `{ value, option }`; call `preventDefault()` to stop the input value from
  updating.
- **Keyboard**: `↑`/`↓` navigate options, `Enter` selects, `Esc` or an outside
  click closes, and typing filters the list.
- **ARIA**: the input gets `role="combobox"`, `aria-expanded`, `aria-controls`,
  and `aria-activedescendant`; the active option is `aria-selected`.

## Frameworks

::: code-group

```tsx [React]
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from '@hydrateless/react';

<Combobox onValueChange={(value) => console.log(value)}>
  <ComboboxInput placeholder="Search fruit" />
  <ComboboxList>
    <ComboboxOption value="apple">Apple</ComboboxOption>
    <ComboboxOption value="banana">Banana</ComboboxOption>
    <ComboboxOption value="cherry">Cherry</ComboboxOption>
    <ComboboxOption value="grape">Grape</ComboboxOption>
  </ComboboxList>
</Combobox>;
```

```vue [Vue]
<script setup>
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from '@hydrateless/vue';
</script>

<template>
  <Combobox @select="(value) => console.log(value)">
    <ComboboxInput placeholder="Search fruit" />
    <ComboboxList>
      <ComboboxOption value="apple">Apple</ComboboxOption>
      <ComboboxOption value="banana">Banana</ComboboxOption>
      <ComboboxOption value="cherry">Cherry</ComboboxOption>
      <ComboboxOption value="grape">Grape</ComboboxOption>
    </ComboboxList>
  </Combobox>
</template>
```

```svelte [Svelte]
<script>
  import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from '@hydrateless/svelte';
</script>

<Combobox onValueChange={(value) => console.log(value)}>
  <ComboboxInput placeholder="Search fruit" />
  <ComboboxList>
    <ComboboxOption value="apple">Apple</ComboboxOption>
    <ComboboxOption value="banana">Banana</ComboboxOption>
    <ComboboxOption value="cherry">Cherry</ComboboxOption>
    <ComboboxOption value="grape">Grape</ComboboxOption>
  </ComboboxList>
</Combobox>
```

:::

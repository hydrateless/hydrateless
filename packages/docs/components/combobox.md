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
- **JS**: `enhanceCombobox(container)`
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
import { Combobox } from '@hydrateless/react';

<Combobox
  options={[
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
  ]}
  placeholder="Search fruit"
  onValueChange={(value) => console.log(value)}
/>;
```

```vue [Vue]
<template>
  <div v-hl-combobox data-hl-combobox>
    <input class="hl-input" placeholder="Search fruit" />
    <ul role="listbox">
      <li role="option" data-hl-value="apple">Apple</li>
      <li role="option" data-hl-value="banana">Banana</li>
    </ul>
  </div>
</template>
```

```svelte [Svelte]
<script>
  import { combobox } from '@hydrateless/svelte';
</script>

<div use:combobox data-hl-combobox>
  <input class="hl-input" placeholder="Search fruit" />
  <ul role="listbox">
    <li role="option" data-hl-value="apple">Apple</li>
    <li role="option" data-hl-value="banana">Banana</li>
  </ul>
</div>
```

:::

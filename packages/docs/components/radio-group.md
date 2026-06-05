# Radio Group

A set of native radios grouped under `role="radiogroup"`. CSS-only — sharing a
`name` gives you single-selection and arrow-key navigation for free.

## Demo

<div class="hl-demo">
<div class="hl-radio-group" role="radiogroup">
  <label class="hl-radio">
    <input type="radio" name="plan" checked />
    <span>Free</span>
  </label>
  <label class="hl-radio">
    <input type="radio" name="plan" />
    <span>Pro</span>
  </label>
</div>
</div>

## HTML

```html
<div class="hl-radio-group" role="radiogroup">
  <label class="hl-radio">
    <input type="radio" name="plan" />
    <span>Free</span>
  </label>
  <label class="hl-radio">
    <input type="radio" name="plan" />
    <span>Pro</span>
  </label>
</div>
```

- **CSS**: `hydrateless/radio.css`
- **JS**: none.
- **Orientation**: add `data-hl-orientation="horizontal"` to the group to lay the
  radios out in a row.

## Frameworks

The React `RadioGroup` shares the `name`, owns the selected value, and wires each
`Radio` automatically.

::: code-group

```tsx [React]
import { useState } from 'react';
import { RadioGroup, Radio } from '@hydrateless/react';

function Example() {
  const [value, setValue] = useState('free');
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
    </RadioGroup>
  );
}
```

```vue [Vue]
<template>
  <div class="hl-radio-group" role="radiogroup">
    <label class="hl-radio">
      <input type="radio" name="plan" />
      <span>Free</span>
    </label>
    <label class="hl-radio">
      <input type="radio" name="plan" />
      <span>Pro</span>
    </label>
  </div>
</template>
```

```svelte [Svelte]
<div class="hl-radio-group" role="radiogroup">
  <label class="hl-radio">
    <input type="radio" name="plan" />
    <span>Free</span>
  </label>
  <label class="hl-radio">
    <input type="radio" name="plan" />
    <span>Pro</span>
  </label>
</div>
```

:::

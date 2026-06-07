# Disclosure

A single expandable section. Purely CSS via the native `<details>` element — no
enhancer needed for a lone disclosure. Use the disclosure enhancer on a wrapper
only when you want a group of disclosures to be mutually exclusive.

## Demo

<div class="hl-demo">
<details class="hydrateless-disclosure" data-hl-disclosure>
  <summary>Show more details</summary>
  <div class="disclosure-panel">This content is revealed when you expand the disclosure. The native <code>&lt;details&gt;</code> element handles all of the toggling.</div>
</details>
</div>

## HTML

```html
<details class="hydrateless-disclosure" data-hl-disclosure>
  <summary>Show more</summary>
  <div class="disclosure-panel">Hidden content revealed.</div>
</details>
```

- **CSS**: `hydrateless/disclosure.css`
- **JS**: `enhanceDisclosure(container, { allowMultiple?: boolean })` — only for
  grouping multiple disclosures.

## Frameworks

::: code-group

```tsx [React]
import { Disclosure } from '@hydrateless/react';

<Disclosure summary="Show more">Hidden content revealed.</Disclosure>;
```

```vue [Vue]
<script setup>
import { Disclosure } from '@hydrateless/vue';
</script>

<template>
  <Disclosure>
    <template #summary>Show more</template>
    Hidden content revealed.
  </Disclosure>
</template>
```

```svelte [Svelte]
<script>
  import { Disclosure } from '@hydrateless/svelte';
</script>

<Disclosure>
  {#snippet summary()}Show more{/snippet}
  Hidden content revealed.
</Disclosure>
```

:::

For a mutually exclusive group, wrap the disclosures and apply the enhancer:

::: code-group

```tsx [React]
import { useDisclosureGroup } from '@hydrateless/react';

function Group() {
  const ref = useDisclosureGroup<HTMLDivElement>();
  return (
    <div ref={ref}>
      <details data-hl-disclosure>…</details>
      <details data-hl-disclosure>…</details>
    </div>
  );
}
```

```vue [Vue]
<template>
  <div v-hl-disclosure>
    <details data-hl-disclosure>…</details>
    <details data-hl-disclosure>…</details>
  </div>
</template>
```

```svelte [Svelte]
<script>
  import { disclosure } from '@hydrateless/svelte';
</script>

<div use:disclosure>
  <details data-hl-disclosure>…</details>
  <details data-hl-disclosure>…</details>
</div>
```

:::

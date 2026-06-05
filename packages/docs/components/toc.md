# Table of Contents

Auto-generated navigation built from the headings on the page, with optional
scroll-spy highlighting of the current section.

## HTML

Add an empty `<nav data-hl-toc>` and the enhancer fills it in from the page
headings:

```html
<nav data-hl-toc></nav>

<main>
  <h2>First section</h2>
  <p>…</p>
  <h2>Second section</h2>
  <p>…</p>
</main>
```

- **CSS**: `hydrateless/toc.css`
- **JS**: `enhanceToc(document, { headings?: string, scrollSpy?: boolean, contentSelector?: string })`
- **Data attributes**: `data-hl-toc-content="selector"` sets the content root to
  scan.

Headings without an `id` are given one automatically so the generated links
resolve.

## Options

| Option            | Default   | Description                             |
| ----------------- | --------- | --------------------------------------- |
| `headings`        | `"h2,h3"` | Which headings to include               |
| `scrollSpy`       | `true`    | Highlight the section currently in view |
| `contentSelector` | `"main"`  | Root element to scan for headings       |

## Frameworks

::: code-group

```tsx [React]
import { Toc } from '@hydrateless/react';

<Toc headings="h2,h3" scrollSpy />;
```

```vue [Vue]
<template>
  <nav v-hl-toc data-hl-toc></nav>
</template>
```

```svelte [Svelte]
<script>
  import { toc } from '@hydrateless/svelte';
</script>

<nav use:toc data-hl-toc></nav>
```

:::

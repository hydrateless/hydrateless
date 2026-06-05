# Skip Link

An accessibility "skip to content" link that is visually hidden until it
receives keyboard focus, letting keyboard and screen-reader users jump past
repeated navigation.

## Demo

Press <kbd>Tab</kbd> while focused on this page to reveal a skip link in the
top-left corner.

<div class="hl-demo">
<a class="a11y-skip-link" href="#main-content">Skip to content</a>
<p style="margin:0">The link above is hidden until focused. Tab to it to see it appear.</p>
</div>

## HTML

Place it as the first focusable element in the document, pointing at your main
content landmark:

```html
<body>
  <a class="a11y-skip-link" href="#main-content">Skip to content</a>
  <header>…</header>
  <main id="main-content">…</main>
</body>
```

- **CSS**: `hydrateless/skip-link.css`
- **JS**: none.

## Frameworks

::: code-group

```tsx [React]
import { SkipLink } from '@hydrateless/react';

<SkipLink href="#main-content" />; // defaults to "Skip to content"
```

```vue [Vue]
<template>
  <a class="a11y-skip-link" href="#main-content">Skip to content</a>
</template>
```

```svelte [Svelte]
<a class="a11y-skip-link" href="#main-content">Skip to content</a>
```

:::

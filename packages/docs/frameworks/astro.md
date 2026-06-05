# Astro

Astro and Hydrateless share the same philosophy: ship HTML and CSS, send
JavaScript only where it earns its place. Astro renders static HTML by default,
and Hydrateless components are static HTML — so there is no hydration to pay
for. Add a tiny enhancer only on the pages that need interactivity.

There is no dedicated Astro package; you use `hydrateless` and
`@hydrateless/auto` (or `@hydrateless/enhancers`) directly.

## Install

```bash
npm install hydrateless @hydrateless/auto
```

## Global setup

Add the CSS and the auto-initializer in a shared layout so every page is styled
and enhanced. A `<script>` tag in an `.astro` file is processed and bundled by
Astro, and runs on the client.

```astro
---
// src/layouts/Base.astro
import 'hydrateless/hydrateless.css';
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <slot name="head" />
  </head>
  <body>
    <slot />

    <script>
      // Bundled by Astro and shipped to the browser. Scans the page and
      // lazy-loads only the enhancers the page actually uses.
      import '@hydrateless/auto';
    </script>
  </body>
</html>
```

Now any page using the layout can drop in semantic Hydrateless markup:

```astro
---
import Base from '../layouts/Base.astro';
---

<Base>
  <div data-hl-tabs>
    <div role="tablist">
      <button role="tab">Overview</button>
      <button role="tab">Install</button>
    </div>
    <div role="tabpanel">Zero runtime by default.</div>
    <div role="tabpanel">npm install hydrateless</div>
  </div>
</Base>
```

## Per-page enhancers

If you'd rather not ship the auto-initializer everywhere, import individual
enhancers only on the pages that need them:

```astro
<div data-hl-dropdown>…</div>

<script>
  import { enhanceDropdown } from '@hydrateless/enhancers/dropdown';
  enhanceDropdown(document);
</script>
```

Because each enhancer is a few hundred bytes and Astro scopes the script to the
page, interactive pages stay lean and static pages ship zero Hydrateless JS.

## Using framework islands

If you author parts of your site as React, Vue, or Svelte islands, you can use
the matching Hydrateless binding inside them and let Astro control hydration
with `client:*` directives:

```astro
---
import { Tabs } from '@hydrateless/react';
---

<!-- Only this island hydrates; the rest of the page stays static HTML. -->
<Tabs client:visible items={[
  { label: 'Overview', content: 'Zero runtime by default.' },
  { label: 'Install', content: 'npm install hydrateless' },
]} />
```

See the [React](./react), [Vue](./vue), and [Svelte](./svelte) guides for the
component and directive APIs.

## CDN alternative

For a content site with no build pipeline for assets, you can also pull
Hydrateless straight from a CDN — see [CDN Usage](/guide/cdn).

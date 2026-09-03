# Astro

Astro and Hydrateless share the same philosophy: ship HTML and CSS, send
JavaScript only where it earns its place. Astro renders static HTML by default,
and Hydrateless components are static HTML, so there's no hydration to pay
for. Add a tiny enhancer only on the pages that need interactivity.

There's no dedicated Astro package; you use `hydrateless` and
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

Now any page using the layout can drop in semantic Hydrateless markup. Render
the state the browser needs (`aria-selected`, `hidden`, `popover`,
`popovertarget`, `command`/`commandfor`) so the page works before, and without,
the enhancers:

```astro
---
import Base from '../layouts/Base.astro';
---

<Base>
  <div data-hl-tabs>
    <div role="tablist">
      <button role="tab" aria-selected="true" tabindex="0">Overview</button>
      <button role="tab" aria-selected="false" tabindex="-1">Install</button>
    </div>
    <div role="tabpanel">Zero runtime by default.</div>
    <div role="tabpanel" hidden>npm install hydrateless</div>
  </div>

  <button class="hl-button" command="show-modal" commandfor="confirm">Open</button>
  <dialog id="confirm" class="hl-modal" data-hl-modal>
    <p>Native dialog, no script needed to open it.</p>
    <button class="hl-button" command="close" commandfor="confirm">Close</button>
  </dialog>
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
import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/react';
---

<!-- Only this island hydrates; the rest of the page stays static HTML. -->
<Tabs client:visible>
  <TabList>
    <Tab>Overview</Tab>
    <Tab>Install</Tab>
  </TabList>
  <TabPanel>Zero runtime by default.</TabPanel>
  <TabPanel>npm install hydrateless</TabPanel>
</Tabs>
```

See the [React](./react), [Vue](./vue), and [Svelte](./svelte) guides for the
component APIs.

## CDN alternative

For a content site with no build pipeline for assets, you can also pull
Hydrateless straight from a CDN. See [CDN Usage](/guide/cdn).

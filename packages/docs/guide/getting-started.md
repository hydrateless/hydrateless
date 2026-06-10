# Getting Started

Hydrateless is a lightweight component library that delivers accessible,
themeable UI primitives using semantic HTML and modern CSS first, with no
JavaScript by default. It relies on native browser capabilities such as
`<details>`, `<dialog>`, and the `:has()` selector to keep runtime cost near
zero, then selectively auto-loads tiny JavaScript enhancers only when an
interaction truly requires it.

## Install

Pick the packages you need:

```bash
# CSS only (most users start here)
npm install hydrateless

# CSS + auto-init (detects components and loads JS enhancers automatically)
npm install hydrateless @hydrateless/auto

# CSS + manual JS enhancers (pick exactly which enhancers to load)
npm install hydrateless @hydrateless/enhancers
```

Prefer no build step at all? Jump to [CDN Usage](./cdn).

## Import the CSS

Import everything:

```css
@import 'hydrateless';
```

Or import individual layers and components for the smallest possible payload:

```css
@import 'hydrateless/reset.css';
@import 'hydrateless/tokens.css';
@import 'hydrateless/theme.css';
@import 'hydrateless/accordion.css';
@import 'hydrateless/tabs.css';
```

## Add JS enhancers (optional)

Most components work with CSS alone. For components that need JavaScript (tabs,
modals, focus traps), you have two options.

**Option A: Auto-init** — import once and forget. It scans the DOM for
`data-hl-*` attributes, lazy-loads only the enhancers that are needed, and
keeps watching so dynamically added markup is enhanced too.

```js
import '@hydrateless/auto';
```

**Option B: Manual** — import specific enhancers and call them yourself. Each
returns a handle with the component's imperative API and a `destroy` teardown.

```js
import { enhanceTabs } from '@hydrateless/enhancers/tabs';
import { enhanceModal } from '@hydrateless/enhancers/modal';

const tabs = enhanceTabs(document);
const modal = enhanceModal(document, { onOpenChange: (open) => console.log(open) });

tabs.api?.setValue('install');
modal.api?.setOpen(true);
// later: tabs.destroy(); modal.destroy();
```

## Write semantic HTML

Components use standard HTML elements with `data-hl-*` attributes:

<div class="hl-demo">
<div data-hl-tabs>
  <div role="tablist">
    <button role="tab">Overview</button>
    <button role="tab">Features</button>
    <button role="tab">Install</button>
  </div>
  <div role="tabpanel">
    <p>Hydrateless delivers accessible UI primitives with zero runtime cost by default.</p>
  </div>
  <div role="tabpanel">
    <p>CSS-first components, optional JS enhancers, auto-init, design tokens, and full ARIA support.</p>
  </div>
  <div role="tabpanel">
    <p><code>npm install hydrateless @hydrateless/auto</code></p>
  </div>
</div>
</div>

```html
<div data-hl-tabs>
  <div role="tablist">
    <button role="tab">Overview</button>
    <button role="tab">Features</button>
    <button role="tab">Install</button>
  </div>
  <div role="tabpanel">…</div>
  <div role="tabpanel">…</div>
  <div role="tabpanel">…</div>
</div>
```

## Next steps

- Explore the [components](/components/button) — forms, actions & overlays,
  disclosure, feedback, data display, and navigation primitives.
- Learn about [theming](./theming) and [dark mode](./dark-mode).
- Using a framework? See the [React](/frameworks/react), [Vue](/frameworks/vue),
  [Svelte](/frameworks/svelte), and [Astro](/frameworks/astro) guides.

## Quickstart

### Install

Pick the packages you need:

```bash
# CSS only (most users start here)
npm install hydrateless

# CSS + auto-init (detects components and loads JS enhancers automatically)
npm install hydrateless @hydrateless/auto

# CSS + manual JS enhancers (pick exactly which enhancers to load)
npm install hydrateless @hydrateless/enhancers
```

### Import CSS

Import everything:

```css
@import 'hydrateless';
```

Or import individual layers and components:

```css
@import 'hydrateless/reset.css';
@import 'hydrateless/tokens.css';
@import 'hydrateless/theme.css';
@import 'hydrateless/accordion.css';
@import 'hydrateless/tabs.css';
```

### Add JS enhancers (optional)

Most components work with CSS alone. For components that need JavaScript
(tabs, modals, focus traps), you have two options:

**Option A: Auto-init** — import once and forget. Scans the DOM for `data-hl-*`
attributes and lazy-loads only the enhancers that are needed.

```js
import '@hydrateless/auto';
```

**Option B: Manual** — import specific enhancers and call them yourself.

```js
import { enhanceTabs } from '@hydrateless/enhancers/tabs';
import { enhanceModal } from '@hydrateless/enhancers/modal';

enhanceTabs(document);
enhanceModal(document);
```

### Write semantic HTML

Components use standard HTML elements with `data-hl-*` attributes:

```html
<!-- Accordion (CSS-only open/close, JS enforces single-open) -->
<div data-hl-accordion>
  <details>
    <summary>Section one</summary>
    <div class="accordion-panel">Content here.</div>
  </details>
  <details>
    <summary>Section two</summary>
    <div class="accordion-panel">More content.</div>
  </details>
</div>

<!-- Modal -->
<button data-hl-modal-open="my-modal">Open modal</button>
<dialog id="my-modal" class="hydrateless-modal" data-hl-modal>
  <div class="hl-modal-header">Title</div>
  <div class="hl-modal-body">Body content.</div>
  <div class="hl-modal-footer">
    <button data-hl-modal-close>Close</button>
  </div>
</dialog>
```

### Theming

Override CSS variables to customize the look:

```css
:root {
  --hl-color-bg: #1a1a2e;
  --hl-color-fg: #eaeaea;
  --hl-color-accent: #e94560;
  --hl-radius-3: 0.75rem;
}
```

See `hydrateless/tokens.css` for the full list of available tokens.

### Dark mode

Hydrateless supports dark mode out of the box. It responds to the user's OS
preference via `prefers-color-scheme`:

```css
/* Automatic — follows the OS setting (works by default, no extra CSS) */
@import 'hydrateless';
```

To let users override the OS preference, set `data-theme` on the root element:

```html
<html data-theme="dark"></html>
```

Toggle it at runtime with JavaScript:

```js
document.documentElement.dataset.theme =
  document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
```

When `data-theme` is set, it takes priority over the OS preference. Remove the
attribute to fall back to automatic behavior.

### CSS layers

All Hydrateless styles are wrapped in CSS `@layer` declarations. The layer
order is:

```
reset → tokens → theme → components
```

This means your un-layered CSS always wins over Hydrateless styles — no
specificity battles. If you use layers yourself, you can slot Hydrateless
into your cascade:

```css
@layer vendor, app;
@import 'hydrateless' layer(vendor);
```

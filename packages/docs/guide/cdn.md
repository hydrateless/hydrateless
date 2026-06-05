# CDN Usage

You can use Hydrateless with no build step at all. Both the CSS and the
auto-initializer are published as CDN-ready bundles on
[unpkg](https://unpkg.com) and [jsDelivr](https://www.jsdelivr.com).

## Quick start

Drop two tags into your page:

```html
<!-- 1. Styles -->
<link rel="stylesheet" href="https://unpkg.com/hydrateless/dist/hydrateless.min.css" />

<!-- 2. Auto-initializer (self-contained, no import map needed) -->
<script type="module" src="https://unpkg.com/@hydrateless/auto/dist/hydrateless.js"></script>
```

That's it. Write semantic HTML with `data-hl-*` attributes and the enhancers run
automatically once the DOM is ready.

```html
<div data-hl-tabs>
  <div role="tablist">
    <button role="tab">One</button>
    <button role="tab">Two</button>
  </div>
  <div role="tabpanel">First panel</div>
  <div role="tabpanel">Second panel</div>
</div>
```

## What's in the bundle

The CDN `@hydrateless/auto` bundle (`dist/hydrateless.js`) is **self-contained**:
all enhancers are inlined, so a single `<script type="module">` works without an
import map or any bundler. It scans the page for `data-hl-*` attributes on
`DOMContentLoaded` and enhances only the components it finds.

## CSS options

| File                                   | Use case                                              |
| -------------------------------------- | ----------------------------------------------------- |
| `hydrateless/dist/hydrateless.min.css` | Minified, all components — recommended for production |
| `hydrateless/dist/hydrateless.css`     | Unminified, all components                            |
| `hydrateless/dist/tabs.css` (etc.)     | Individual component styles                           |

```html
<!-- Just the pieces you need -->
<link rel="stylesheet" href="https://unpkg.com/hydrateless/dist/reset.css" />
<link rel="stylesheet" href="https://unpkg.com/hydrateless/dist/tokens.css" />
<link rel="stylesheet" href="https://unpkg.com/hydrateless/dist/theme.css" />
<link rel="stylesheet" href="https://unpkg.com/hydrateless/dist/tabs.css" />
```

## Pinning a version

Unpinned URLs always resolve to the latest release. For production, pin an exact
version so upgrades are deliberate:

```html
<link rel="stylesheet" href="https://unpkg.com/hydrateless@0.3.0/dist/hydrateless.min.css" />
<script type="module" src="https://unpkg.com/@hydrateless/auto@0.3.0/dist/hydrateless.js"></script>
```

The same paths work on jsDelivr — swap the host for
`https://cdn.jsdelivr.net/npm/`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hydrateless/dist/hydrateless.min.css" />
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@hydrateless/auto/dist/hydrateless.js"
></script>
```

## Manual control via the CDN

If you'd rather drive enhancers yourself, import the named exports from the
bundle instead of relying on the side-effecting auto-run:

```html
<script type="module">
  import { autoSync } from 'https://unpkg.com/@hydrateless/auto/dist/hydrateless.js';

  // Enhance only a specific subtree, and keep the disposer for later cleanup.
  const dispose = autoSync(document.querySelector('#widget'));
</script>
```

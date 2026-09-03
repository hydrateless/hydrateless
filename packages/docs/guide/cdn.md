# CDN Usage

You can use Hydrateless with no build step at all. Both the CSS and the
auto-initializer are published as CDN-ready bundles on
[unpkg](https://unpkg.com) and [jsDelivr](https://www.jsdelivr.com).

## Quick start

Drop two tags into your page:

```html
<!-- 1. Styles -->
<link rel="stylesheet" href="https://unpkg.com/hydrateless@latest/dist/hydrateless.min.css" />

<!-- 2. Auto-initializer (self-contained, no import map needed) -->
<script type="module" src="https://unpkg.com/@hydrateless/auto@latest/dist/hydrateless.js"></script>
```

That's it. Write semantic HTML with `data-hl-*` attributes and the enhancers run
automatically once the DOM is ready:

```html
<button class="hl-button" command="show-modal" commandfor="confirm">Open</button>
<dialog id="confirm" class="hl-modal" data-hl-modal>
  <div class="hl-modal-header">Confirm</div>
  <div class="hl-modal-body">This dialog opened with no JavaScript.</div>
  <div class="hl-modal-footer">
    <button class="hl-button" command="close" commandfor="confirm">Close</button>
  </div>
</dialog>
```

## Pinning a version

`@latest` always resolves to the newest release, including breaking ones. For
anything beyond a prototype, pin to a major so you get fixes but not surprises,
and bump it deliberately:

```html
<link rel="stylesheet" href="https://unpkg.com/hydrateless@1/dist/hydrateless.min.css" />
<script type="module" src="https://unpkg.com/@hydrateless/auto@1/dist/hydrateless.js"></script>
```

Before 1.0, minor releases can include breaking changes, so pin the minor
instead (`hydrateless@0.8`). Pin an exact version (`hydrateless@1.2.3`) when you
need byte-for-byte reproducibility, for example alongside a Subresource
Integrity hash.

## What's in the bundle

The CDN `@hydrateless/auto` bundle (`dist/hydrateless.js`) is **self-contained**:
all enhancers are inlined, so a single `<script type="module">` works without an
import map or any bundler. It scans the page for `data-hl-*` attributes on
`DOMContentLoaded`, enhances only the components it finds, and keeps watching
for content added later.

## CSS options

| File                                    | Use case                                             |
| --------------------------------------- | ---------------------------------------------------- |
| `hydrateless/dist/hydrateless.min.css`  | Minified, all components; recommended for production |
| `hydrateless/dist/hydrateless.css`      | Unminified, all components                           |
| `hydrateless/dist/tabs.css` (and so on) | Individual component styles                          |

```html
<!-- Just the pieces you need -->
<link rel="stylesheet" href="https://unpkg.com/hydrateless@1/dist/reset.css" />
<link rel="stylesheet" href="https://unpkg.com/hydrateless@1/dist/tokens.css" />
<link rel="stylesheet" href="https://unpkg.com/hydrateless@1/dist/theme.css" />
<link rel="stylesheet" href="https://unpkg.com/hydrateless@1/dist/tabs.css" />
```

Component file names match the subpath exports: `segmented-control.css`,
`radio-group.css`, `command-palette.css`, and so on. Always include `tokens.css`
and `theme.css` when loading components individually.

## jsDelivr

The same paths work on jsDelivr; swap the host for `https://cdn.jsdelivr.net/npm/`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hydrateless@1/dist/hydrateless.min.css" />
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@hydrateless/auto@1/dist/hydrateless.js"
></script>
```

## Manual control via the CDN

If you'd rather drive enhancers yourself, import the named exports from the
bundle instead of relying on the side-effecting auto-run:

```html
<script type="module">
  import { autoSync } from 'https://unpkg.com/@hydrateless/auto@1/dist/hydrateless.js';

  // Enhance only a specific subtree, and keep the disposer for later cleanup.
  const dispose = autoSync(document.querySelector('#widget'));
</script>
```

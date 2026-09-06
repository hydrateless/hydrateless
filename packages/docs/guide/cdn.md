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
anything beyond a prototype, pin to the current minor release so you get patch fixes,
and update it deliberately:

```html
<link rel="stylesheet" href="https://unpkg.com/hydrateless@0.10/dist/hydrateless.min.css" />
<script type="module" src="https://unpkg.com/@hydrateless/auto@0.10/dist/hydrateless.js"></script>
```

Before 1.0, minor releases can include breaking changes, so pin the minor
instead (`hydrateless@0.10`). Pin an exact version (`hydrateless@0.10.0`) when
you need byte-for-byte reproducibility, for example alongside a Subresource
Integrity hash.

## What's in the bundle

The CDN `@hydrateless/auto` bundle (`dist/hydrateless.js`) is **self-contained**:
all enhancers are inlined, so a single `<script type="module">` works without an
import map or any bundler. It scans the page for `data-hl-*` attributes on
`DOMContentLoaded`, enhances only the components it finds, and keeps watching
for content added later. If one enhancer throws, the others still run; the
failure is reported to `console.error` (or your own `onError`, see below).

## Configuring without JavaScript

The bundle passes no options, so configuration lives in the markup. Every
non-function option has a `data-hl-*` attribute:

```html
<div data-hl-accordion data-hl-allow-multiple>…</div>
<div data-hl-tabs data-hl-activation="automatic">…</div>
<nav data-hl-pagination data-hl-total="20" data-hl-default-value="3"><ul></ul></nav>
<div data-hl-toast-region data-hl-duration="8000"></div>
```

See [Configuring with Data Attributes](/guide/data-attributes) for naming and
parsing rules.

## CSS options

| File                                    | Use case                                             |
| --------------------------------------- | ---------------------------------------------------- |
| `hydrateless/dist/hydrateless.min.css`  | Minified, all components; recommended for production |
| `hydrateless/dist/hydrateless.css`      | Unminified, all components                           |
| `hydrateless/dist/tabs.css` (and so on) | Individual component styles                          |

```html
<!-- Just the pieces you need -->
<link rel="stylesheet" href="https://unpkg.com/hydrateless@0.10/dist/reset.css" />
<link rel="stylesheet" href="https://unpkg.com/hydrateless@0.10/dist/tokens.css" />
<link rel="stylesheet" href="https://unpkg.com/hydrateless@0.10/dist/theme.css" />
<link rel="stylesheet" href="https://unpkg.com/hydrateless@0.10/dist/tabs.css" />
```

Component file names match the subpath exports: `segmented-control.css`,
`radio-group.css`, `command-palette.css`, and so on. Always include `tokens.css`
and `theme.css` when loading components individually.

## jsDelivr

The same paths work on jsDelivr; swap the host for `https://cdn.jsdelivr.net/npm/`:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/hydrateless@0.10/dist/hydrateless.min.css"
/>
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@hydrateless/auto@0.10/dist/hydrateless.js"
></script>
```

## Manual control via the CDN

If you'd rather drive enhancers yourself, add `data-hl-manual` to `<html>` so
importing the bundle doesn't scan the page, then call `autoSync` with the
container and options you want:

```html
<html data-hl-manual>
  <script type="module">
    import { autoSync } from 'https://unpkg.com/@hydrateless/auto@0.10/dist/hydrateless.js';

    // Enhance only a specific subtree, and keep the disposer for later cleanup.
    const dispose = autoSync(document.querySelector('#widget'), {
      onError: (error, component) => console.warn(component, error),
    });
  </script>
</html>
```

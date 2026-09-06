# Browser Support

Hydrateless targets the modern Baseline: the current and previous major
versions of Chrome, Edge, Firefox, and Safari (desktop and iOS). Instead of
reimplementing overlays, focus trapping, and light dismiss in script, the
components lean on platform features that are now interoperable, and the
enhancers fill the few remaining gaps.

## Platform features by component

| Feature                                                 | Used by                                                         | Without it                                                                                                                  |
| ------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Popover API (`popover`, `popovertarget`)                | Dropdown, menu submenus, popover, tooltip, combobox             | Required. Surfaces render inline (not in the top layer) and don't light-dismiss.                                            |
| `<dialog>` with `showModal()` and `closedby`            | Modal, drawer, command palette host                             | `<dialog>` is required. Without `closedby`, the enhancer adds backdrop dismissal; the no-JS baseline still supports Escape. |
| Invoker Commands (`command`/`commandfor`)               | Buttons that open dialogs and popovers with no JS               | Required for declarative invokers. Where missing, call `showModal()` or the enhancer API from your own trigger.             |
| CSS anchor positioning (`anchor-name`, `position-area`) | Dropdown, menu, popover, tooltip, combobox                      | Progressive. `supportsAnchorPositioning()` is false and a small JS positioner runs (`position: true`).                      |
| `light-dark()` and `color-scheme`                       | Every color token                                               | Required for automatic dark mode. See [Dark Mode](/guide/dark-mode).                                                        |
| `@layer`                                                | The whole stylesheet (`reset`, `tokens`, `theme`, `components`) | Required. Layers are shipped natively, not flattened.                                                                       |
| `@starting-style`                                       | Entry transitions on overlays and toasts                        | Progressive. Surfaces appear without the fade.                                                                              |
| `:has()`                                                | Checkbox, switch, radio group, segmented control, tabs baseline | Required for the CSS-only selection styling.                                                                                |
| `:dir()`                                                | Logical mirroring in drawer, slider, switch, disclosure         | Progressive. `[dir="rtl"]` selectors cover the same cases.                                                                  |
| `field-sizing: content`                                 | Textarea auto-grow                                              | Progressive. The textarea keeps its `rows`.                                                                                 |
| `MutationObserver`, `IntersectionObserver`              | Live collections, the auto-loader, TOC scroll spy               | Required for enhancement. The CSS baseline is unaffected.                                                                   |

The CSS build runs through `postcss-preset-env` (stage 1) and Autoprefixer, but
deliberately leaves the features above native rather than polyfilling them, and
disables the cascade-layers transform so the documented layer order survives.

## Detection helpers

`@hydrateless/enhancers` exports the same checks the enhancers use:

```ts
import { supportsPopover, supportsAnchorPositioning } from '@hydrateless/enhancers';

if (!supportsAnchorPositioning()) {
  // the JS fallback is positioning floating surfaces
}
```

## What "no JavaScript" means here

Every component renders and is operable before any script runs, and the CSS
baselines (tab panels by radio, menu submenus on hover and `:focus-within`,
combobox list on `:focus-within`, `<details>` accordions, `<dialog>` and
`popover` invokers) are what a user sees if JavaScript fails, is blocked, or is
still loading. When an enhancer takes over it marks the root `data-hl-ready`
and the baseline stands down. The tests in `packages/e2e` run every fixture
twice, with JavaScript disabled and enabled, in Chromium, Firefox, and WebKit.

## Testing matrix

| Engine   | Playwright project | Notes                                                                     |
| -------- | ------------------ | ------------------------------------------------------------------------- |
| Chromium | `chromium`         | Reference engine; anchor positioning and invokers both native.            |
| Firefox  | `firefox`          | Exercises the JS positioning fallback where anchor positioning is absent. |
| WebKit   | `webkit`           | Exercises the Popover API and `<dialog>` paths on the Safari engine.      |

Tests that depend on a feature an engine hasn't shipped (for example Invoker
Commands) call `test.skip` with the reason, so a run is never green because a
path was silently skipped without saying so.

## Not supported

- Internet Explorer and legacy Edge (EdgeHTML).
- Browsers without the Popover API. There is no polyfill path; the CSS renders,
  but dropdowns, tooltips, and popovers won't behave as overlays.
- Server environments are supported only in the sense that every enhancer and
  the auto-loader are safe no-ops without a DOM; see
  [Server-Side Rendering](/guide/ssr).

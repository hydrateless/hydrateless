# Roadmap

Hydrateless is pre-1.0. Minor releases can break; each one ships with a
[migration guide](https://hydrateless.com/guide/migration). This page says what
1.0 means and what's on the way there. It's a statement of intent, not a
schedule.

## Where things stand (0.10)

- Every interactive component has a CSS baseline and an optional enhancer with
  one contract: `enhanceX(container?, options?)`, `value`/`setValue` or
  `open`/`setOpen`, and `hl:*` events.
- Enhancers are live (items added later take part) and configurable from
  markup (`data-hl-*` for every non-function option).
- Overlays ride on the Popover API, `<dialog>`, Invoker Commands, and CSS
  anchor positioning, with a JS positioning fallback.
- React, Vue, and Svelte export the same component set, verified by a shared
  contract test.
- A Playwright and axe suite runs every fixture with JavaScript off and on in
  Chromium, Firefox, and WebKit.

## 1.0 criteria

1.0 is a promise to stop breaking things, so the bar is stability of the
surface, not feature count. We'll cut 1.0 when all of the following hold:

- **Frozen contracts.** No enhancer option, API member, `hl:*` event, or
  `data-hl-*` attribute has been renamed for two consecutive minors.
- **Framework parity.** Every component with an enhancer has a wrapper in all
  three bindings with the same prop names (`value`/`defaultValue`/
  `onValueChange`, `open`/`defaultOpen`/`onOpenChange`), and the contract test
  covers props, not just export names.
- **Token vocabulary settled.** Every intent is a full `light-dark()` pair with
  hover and active states and forced-colors remaps; `data-hl-size` and
  disabled styling are uniform across controls; no hardcoded colors or spacing
  remain in component CSS.
- **Visual regression coverage.** Screenshot tests across light, dark, and RTL
  for every component, so CSS refactors can't regress silently.
- **Documented browser matrix** with a policy for dropping fallbacks (for
  example, removing the JS positioner once anchor positioning is Baseline
  Widely Available).
- **No known WCAG 2.2 AA failures** in the e2e axe runs or in manual screen
  reader passes of the overlay and menu components.

## Before 1.0

Roughly in order.

### Framework bindings on the new enhancers

Wrap alert dismissal, checkbox groups, pagination, segmented buttons, slider
output, and table sorting in React, Vue, and Svelte with the same controlled/
uncontrolled conventions as the rest of the suite. Move the shared pieces
(element schema, controlled-state sync, id derivation, collection indexing) into
a headless core so the three bindings are thin projections of it, and extend the
contract test to props.

### Design system completeness

Full intent pairs with `-hover`/`-active`, forced-colors coverage for every
component, uniform sizing and disabled states, container queries for card and
table, and the missing CSS-first primitives: typography and prose, link and
code styles, layout utilities (stack, cluster, grid, container), a sheet
variant of the drawer, tag/chip, empty state, and native form validation styling
through `:user-invalid`.

### Visual regression

A Playwright screenshot suite across light, dark, and RTL, run in CI alongside
the existing behavior and axe checks.

### Docs

Per-attribute documentation generated from each enhancer's `definition`, so the
reference can't drift from the code; a "recipes" section for common
compositions (settings page, data table with toolbar, command-driven app
shell).

## After 1.0

Ideas that are compatible with a frozen 1.x surface:

- Additional enhancers: date input helpers, tree view, listbox/multi-select,
  resizable panels, tag input.
- An Astro integration package (currently a guide).
- A `@hydrateless/test` package with the e2e helpers (`gotoFixture`,
  `supportsPopover`, axe wrappers) for consumers' own suites.
- Web Components wrappers generated from the same headless core.

## Non-goals

- Reimplementing platform features in script. If the browser can do it
  (top layer, light dismiss, focus trapping, anchor positioning), Hydrateless
  uses that and waits for the rest.
- Supporting browsers without the Popover API.
- A theming runtime. Tokens are CSS custom properties; that's the API.

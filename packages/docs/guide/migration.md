# Migrating to 0.10

0.10 makes every enhancer live (items added after enhancement take part) and
declaratively configurable (every non-function option has a `data-hl-*`
attribute), adds six enhancers for the components that were CSS-only, adds
nested submenus, and normalizes the last few enhancer contracts. Before 1.0,
minor releases can break; this page lists everything that changed shape and how
to update. Nothing here needs a code change if you only use the stylesheet.

## Renamed attributes

| 0.9                           | 0.10                               | Where                   |
| ----------------------------- | ---------------------------------- | ----------------------- |
| `data-hl-toc-content="#main"` | `data-hl-content-selector="#main"` | `<nav data-hl-toc>`     |
| `data-hl-command-hotkey="k"`  | `data-hl-hotkey="k"`               | `<div data-hl-command>` |
| `data-hl-menu-submenu`        | `data-hl-submenu`                  | Menu submenu `<ul>`     |

The new names follow the general rule: an option `fooBar` is set with
`data-hl-foo-bar`, on the component root. The framework components render the
new names, so only hand-written markup needs updating.

## Placement is logical

`Placement` sides are now `top`, `bottom`, `start`, and `end`; `left` and
`right` are gone. `start` and `end` follow text direction, so a
`placement: 'end'` popover opens to the right in LTR and the left in RTL.

```diff
- <span data-hl-tooltip="tip" data-hl-placement="right">
+ <span data-hl-tooltip="tip" data-hl-placement="end">

- enhancePopover(el, { placement: 'left-start' });
+ enhancePopover(el, { placement: 'start-start' });
```

The JS positioning fallback stamps `data-hl-side` and `data-hl-align` on every
floating surface it places, and the tooltip enhancer stamps `data-hl-side` on
the tip in all cases, so the stylesheet orients arrows from one attribute. If
you had custom CSS keyed on `[data-hl-placement="left"]` or `"right"`, switch
it to `[data-hl-side="start"]` and `"end"`.

## Enhancer API changes

### Tooltip

- New `defaultOpen` option (also `data-hl-default-open`), for parity with the
  other overlays.
- Placement now comes from the `placement` option or `data-hl-placement` with
  the logical values above.

### Command palette

- The API gained `open` and `setOpen(open)` for the hosting `<dialog>`, and the
  enhancer emits `hl:open-change` when it opens or closes.
- New `closeOnCommand` option (default `true`). Set it to `false` to keep the
  palette open after a command runs.
- New `defaultOpen` and `onOpenChange` options.
- `Home` and `End` jump to the first and last option, and options marked
  `aria-disabled="true"` are skipped, matching the dropdown and combobox.

### Table of contents

- The API gained `value` and `setValue(id)`: the id of the heading in view,
  reported through `onValueChange` and `hl:change`.
- New `watch` option (default `true`). The list rebuilds automatically when
  headings are added, removed, or renamed. `refresh()` still exists for
  forcing a rebuild with `watch: false`.
- The default `contentSelector` is `'main, article'`.

### Toast

- New `dismissAll()` on the API and on every framework `useToast`.
- The region can set its default `duration` with `data-hl-duration`.
- Each toast's hover and focus listeners are now released when it is
  dismissed, so a long-lived region no longer accumulates handlers. No change
  needed, but if you worked around it by re-creating the region, stop.

### Combobox

- New `position` option (default `true`) to disable the JS positioning
  fallback, and `defaultOpen` to start expanded.

### Menu and dropdown

- Submenus nest to any depth. Any item followed by a sibling `data-hl-submenu`
  (or `role="menu"`) inside the same `<li>` becomes a submenu trigger.
  `Right` (`Left` in RTL) opens, `Left` and `Esc` close one level.
- Clicking a top-level menubar item now focuses the first item of the submenu
  it opens, as the APG menubar pattern describes. Previously focus stayed on
  the trigger.

## New enhancers

Six components that were CSS-only now have optional enhancers. Existing markup
keeps working unchanged; opt in with the root attribute.

| Component         | Opt-in                                     | Adds                                                                           |
| ----------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| Alert             | `data-hl-alert` + `data-hl-dismiss` button | Dismissal with an exit transition, `open`/`setOpen`, `hl:open-change`          |
| Checkbox          | `data-hl-checkbox-group`                   | Select-all with `indeterminate`, `value`/`setValue`, `hl:change`               |
| Pagination        | `data-hl-pagination`                       | `aria-current`, disabled ends, arrow keys, rendering from `data-hl-total`      |
| Segmented control | `data-hl-segmented`                        | Reports selection; makes `<button>` segments a `role="radio"` group            |
| Slider            | `data-hl-slider` wrapper                   | `<output>` sync, `aria-valuetext`, `--hl-slider-progress` for the filled track |
| Table             | `data-hl-table` + `data-hl-sort` headers   | Column sorting with `aria-sort`, `value`/`setValue`, `hl:change`               |

The auto-loader and CDN bundle pick them up automatically. Each has its own
subpath (`@hydrateless/enhancers/table` and so on) and appears in `MANIFEST`,
so a custom loader keyed on `ComponentName` must handle the six new names.

## Options from markup

Every option that isn't a callback can be set on the root as a `data-hl-*`
attribute, read with the option's type and merged between the defaults and the
options object. Existing attribute-driven options (`data-hl-placement`,
`data-hl-toast-duration` on triggers, `data-hl-side` on drawers) keep working.
Enhancers also expose `enhanceX.definition` with the selector, defaults, and
attribute schema. See [Configuring with Data Attributes](/guide/data-attributes).

## Live collections

Enhancers no longer snapshot their items at setup. Tabs, accordion items, menu
and dropdown items, combobox options, commands, pagination controls, table
rows, and checkboxes added or removed later are picked up through a
`MutationObserver` on the root. If you previously destroyed and re-ran an
enhancer after rendering new items, remove that code.

## Removed

- Core exports: `supportsInvokers` (the enhancers never branched on it; the
  e2e helpers have their own check).
- Tokens: `--hl-z-drawer` and `--hl-z-modal`. Dialogs live in the top layer
  and never needed a z-index. The remaining `--hl-z-*` tokens only affect the
  JS positioning fallback.
- Physical `left`/`right` placements, as above.

## Auto-loader

- Importing `@hydrateless/auto` or the CDN bundle still starts scanning on
  load. To call `auto()`/`autoSync()` yourself (to pass options or a
  container), add `data-hl-manual` to `<html>`; otherwise two watchers run
  and your options apply only to the second.
- New `onError(error, component)` option. One failing enhancer no longer stops
  the others; failures are reported here (default `console.error`) instead of
  rejecting the `ready` promise.
- `@hydrateless/enhancers` declares `sideEffects: false`, so bundlers drop the
  enhancers a page doesn't import. `@hydrateless/auto` keeps its side effect
  by design.

## Framework bindings

- **React `Field`**: `id` now names the control (the input a `<FieldLabel>`
  points at), not the wrapper `<div>`, matching Vue and Svelte. Tests or CSS
  that selected the wrapper by id should target the control or add a class.
- **React `useForwardedRef`**: merges callback refs correctly; no change
  needed unless you relied on the old object-only behavior.
- **React `Combobox`**: `defaultOpen` seeds the enhancer and the `open` prop is
  synced through the API, so a controlled `open` no longer fights the
  uncontrolled default.
- **Vue `DropdownItem`**: the `select` emit is now `(value, item, checked?)`,
  matching React's `onSelect` and the `hl:select` detail.
- **Vue `Disclosure`**: new `name` prop for native exclusive groups.
- **Vue and Svelte `Accordion`/`Tabs`**: items rendered from a list are indexed
  in DOM order and renumber when inserted or removed, so `v-for`/`{#each}`
  driven items keep their values stable. No API change.
- **Svelte `DropdownTrigger`**: `aria-expanded` is reactive to the open state.
- **Svelte `Tooltip`**: the `children` snippet receives the trigger attributes.
  Spread them for correct server-rendered markup; without the spread the first
  child is linked on the client, as before.

  ```svelte
  <Tooltip content="Save">
    {#snippet children(trigger)}<Button {...trigger}>Save</Button>{/snippet}
  </Tooltip>
  ```

- **All three packages** now export the same component set, verified by a
  shared contract test. The convenience hooks `useTabs`, `useDropdown`,
  `useTooltip`, `useAccordion`, and `useModalGroup` stay removed; use the
  components or `useEnhancer`.

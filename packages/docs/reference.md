# API Reference

The full, type-level API documentation for every Hydrateless package is generated
from source with [TypeDoc](https://typedoc.org/): the framework-agnostic
`@hydrateless/enhancers`, the `@hydrateless/auto` initializer, and the
`@hydrateless/react`, `@hydrateless/vue`, and `@hydrateless/svelte` bindings.

::: tip Generated reference
Browse the complete API for every package, with each function, component, option type, and return type. [Open the generated API reference](./api/)
:::

## Calling an enhancer

Every enhancer has the same shape:

```ts
enhanceX(container?: Document | HTMLElement, options?: EnhanceXOptions): EnhancerHandle<XApi>;
```

- `container` defaults to `document` in the browser. Outside a browser (SSR,
  tests without a DOM) the call is a safe no-op that returns an empty handle.
- The enhancer finds every root matching its selector inside the container
  (including the container itself) and enhances each one once. Re-running it on
  already-enhanced roots is a no-op.
- The returned [`EnhancerHandle`](#enhancerhandle) exposes the first root's
  imperative API and a `destroy` teardown for all of them.

```ts
import { enhanceTabs } from '@hydrateless/enhancers/tabs';

const tabs = enhanceTabs(document, { activation: 'automatic' });
tabs.api?.setValue('install');
// later, e.g. on unmount or route change:
tabs.destroy();
```

### Options from markup

Every option that isn't a callback or a function can also be set on the root as
a `data-hl-*` attribute, so a server-rendered page configures its components
without writing JavaScript. The attribute name is the option name in kebab
case: `allowMultiple` is `data-hl-allow-multiple`, `defaultValue` is
`data-hl-default-value`, `showDelay` is `data-hl-show-delay`.

```html
<div data-hl-accordion data-hl-allow-multiple data-hl-default-value="shipping returns">…</div>
<div data-hl-tabs data-hl-activation="automatic" data-hl-orientation="vertical">…</div>
<span data-hl-tooltip="tip" data-hl-placement="bottom-start" data-hl-show-delay="0">…</span>
```

Parsing follows the option's type: booleans accept a bare attribute, `""`, or
`"true"`/`"false"`; numbers are parsed with `Number()`; lists (accordion and
checkbox group `defaultValue`) split on whitespace or commas. Attributes that
are absent or fail to parse are ignored, so they never shadow a default.
Precedence is defaults, then attributes, then the options object passed to
the call. Options passed as `undefined` are dropped, so a framework binding can
forward unset props without overriding either.

Each enhancer exposes its definition for tooling:

```ts
enhanceAccordion.definition.selector; // '[data-hl-accordion]'
enhanceAccordion.definition.attributes; // { allowMultiple: 'boolean', defaultValue: [Function] }
```

### Live collections

Enhancers read their items from the DOM every time they need them and watch
their root with a `MutationObserver`, so accordion items, tabs, menu items,
combobox options, commands, pagination controls, table rows, and checkboxes
that are added or removed after enhancement take part without re-enhancing.
Frameworks that render lists from state get this for free; plain scripts can
append markup and move on.

## Enhancers

Defaults are shown after `=`. Every option is optional, and every non-function
option can be set with the matching `data-hl-*` attribute on the root.

### `enhanceAccordion`

Selector `[data-hl-accordion]`. Item values come from `data-hl-value` on each `<details>`, defaulting to the index.

| Option          | Type                        | Description                                                                            |
| --------------- | --------------------------- | -------------------------------------------------------------------------------------- |
| `allowMultiple` | `boolean = false`           | Allow more than one panel open at a time.                                              |
| `defaultValue`  | `string[]`                  | Values of the initially open items. Falls back to the `open` attributes in the markup. |
| `onValueChange` | `(value: string[]) => void` | Called with the open item values after every change.                                   |

| API                         | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| `value: string[]`           | Values of the currently open items, in document order. |
| `setValue(value: string[])` | Open exactly the listed items (others close).          |

Events: `hl:change { value: string[] }`. Keyboard: `Up`/`Down`/`Home`/`End` move focus between headers.

### `enhanceAlert`

Selector `[data-hl-alert]`, containing a `[data-hl-dismiss]` button. Clicking the button marks the alert `data-hl-alert-closing` for the CSS exit transition, then sets `hidden`. The button is labelled "Dismiss" if it has no accessible name.

| Option         | Type                      | Description                                                                          |
| -------------- | ------------------------- | ------------------------------------------------------------------------------------ |
| `defaultOpen`  | `boolean`                 | Show or hide on enhance. Defaults to the markup (an alert without `hidden` is open). |
| `onOpenChange` | `(open: boolean) => void` | Called after the alert is shown or dismissed.                                        |

| API                      | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| `open: boolean`          | Whether the alert is visible (and not mid-dismissal).    |
| `setOpen(open: boolean)` | Show the alert again, or dismiss it with the transition. |

Events: `hl:open-change { open }`.

### `enhanceCheckbox`

Selector `[data-hl-checkbox-group]`, a group of native checkboxes. An optional `[data-hl-checkbox-all]` master box reflects the group (checked when all are, `indeterminate` when some are) and toggles every enabled box at once. `data-hl-indeterminate` on a box renders the mixed state initially. Values come from each box's `value`.

| Option          | Type                        | Description                                                        |
| --------------- | --------------------------- | ------------------------------------------------------------------ |
| `defaultValue`  | `string[]`                  | Values to check on enhance. Falls back to `checked` in the markup. |
| `onValueChange` | `(value: string[]) => void` | Called with the checked values after every change.                 |

| API                         | Description                                      |
| --------------------------- | ------------------------------------------------ |
| `value: string[]`           | Checked values, in document order.               |
| `setValue(value: string[])` | Check exactly the listed boxes (others uncheck). |

Events: `hl:change { value: string[] }`.

### `enhanceDisclosure`

Selector `details[data-hl-disclosure]`.

| Option         | Type                      | Description                                                 |
| -------------- | ------------------------- | ----------------------------------------------------------- |
| `defaultOpen`  | `boolean`                 | Open on enhance. Defaults to the markup's `open` attribute. |
| `onOpenChange` | `(open: boolean) => void` | Called after the disclosure opens or closes.                |

| API                      | Description                     |
| ------------------------ | ------------------------------- |
| `open: boolean`          | Whether the disclosure is open. |
| `setOpen(open: boolean)` | Open or close the disclosure.   |

Events: `hl:open-change { open }`.

### `enhanceTabs`

Selector `[data-hl-tabs]`. Tab values come from each radio's `value`, else `data-hl-value`, else the index.

| Option          | Type                                        | Description                                                                                                      |
| --------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `activation`    | `'manual' \| 'automatic' = 'manual'`        | `manual`: arrows move focus and Enter/Space activates. `automatic`: arrows activate immediately.                 |
| `orientation`   | `'horizontal' \| 'vertical' = 'horizontal'` | Vertical lists use Up/Down instead of Left/Right.                                                                |
| `defaultValue`  | `string`                                    | Initially selected tab. Falls back to a pre-checked radio or `aria-selected="true"`, then the first enabled tab. |
| `onValueChange` | `(value: string) => void`                   | Called with the new tab value after every selection change.                                                      |

| API                                   | Description                                          |
| ------------------------------------- | ---------------------------------------------------- |
| `value: string`                       | Value of the selected tab.                           |
| `setValue(value, { focus? = false })` | Select a tab; pass `focus: true` to also move focus. |

Events: `hl:change { value }`.

### `enhanceDropdown`

Selector `[data-hl-dropdown]`, containing `[data-hl-dropdown-trigger]` and `[data-hl-dropdown-menu]`. Put `popover` on the menu and `popovertarget` on the trigger in your markup; the enhancer adds them if missing, but only the markup works before JavaScript.

| Option          | Type                                                            | Description                                                                          |
| --------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `placement`     | `Placement = 'bottom-start'`                                    | Placement for the JS positioning fallback.                                           |
| `position`      | `boolean = true`                                                | Run the JS positioning fallback when CSS anchor positioning is missing.              |
| `closeOnSelect` | `boolean = true`                                                | Close after an item is activated. Set `false` for menus of `menuitemcheckbox` items. |
| `defaultOpen`   | `boolean = false`                                               | Open on enhance without moving focus.                                                |
| `onOpenChange`  | `(open: boolean) => void`                                       | Called after the menu opens or closes.                                               |
| `onSelect`      | `(value: string, item: HTMLElement, checked?: boolean) => void` | Called when an item is activated; `checked` is the new state for checkable items.    |

| API                                | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `open: boolean`                    | Whether the menu is open.                                            |
| `setOpen(open, { focus? = true })` | Open or close. Opening focuses the first item unless `focus: false`. |

Events: `hl:open-change { open }`, `hl:select { value, item, checked? }` (cancelable). Items may be `role="menuitem"`, `menuitemcheckbox`, or `menuitemradio`; disabled items (`disabled` or `aria-disabled="true"`) are skipped. Groups: `<li><ul role="group">...</ul></li>`.

Nested submenus: an item followed by a sibling `[data-hl-submenu]` (or `[role="menu"]`) inside the same `<li>` becomes a submenu trigger with `aria-haspopup`/`aria-expanded`. Submenus open on click, hover, `Right` (`Left` in RTL), `Enter`, or `Space`; `Left` and `Esc` close one level and return focus to the trigger. Each submenu is a `popover="manual"` anchored to its trigger, so nesting can go as deep as the markup does.

### `enhanceMenu`

Selector `[data-hl-menu]`. Submenu values come from `data-hl-value` on each top-level trigger, defaulting to the index. The root is marked `data-hl-ready` so the CSS hover baseline stands down. Submenus nest the same way as in the dropdown: any item with a sibling `[data-hl-submenu]` opens it, to any depth.

| Option          | Type                                                            | Description                                                          |
| --------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| `orientation`   | `'horizontal' \| 'vertical' = 'horizontal'`                     | Layout of the top-level menu.                                        |
| `defaultValue`  | `string \| null`                                                | Submenu to open on enhance.                                          |
| `onValueChange` | `(value: string \| null) => void`                               | Called with the open submenu's value (or `null`) after every change. |
| `onSelect`      | `(value: string, item: HTMLElement, checked?: boolean) => void` | Called when a leaf item is activated.                                |

| API                               | Description                                                     |
| --------------------------------- | --------------------------------------------------------------- |
| `value: string \| null`           | Value of the open submenu, or `null`.                           |
| `setValue(value: string \| null)` | Open the submenu with `value` (closing any other) or close all. |

Events: `hl:change { value: string | null }`, `hl:select { value, item, checked? }` (cancelable).

### `enhanceModal` and `enhanceDrawer`

Selectors `dialog[data-hl-modal]` and `dialog[data-hl-drawer]`. Both share `DialogOptions` and `DialogApi`.

| Option            | Type                      | Description                                                          |
| ----------------- | ------------------------- | -------------------------------------------------------------------- |
| `closeOnBackdrop` | `boolean = true`          | Set `closedby="any"` so Escape and backdrop clicks dismiss natively. |
| `defaultOpen`     | `boolean = false`         | Open (`showModal()`) on enhance.                                     |
| `onOpenChange`    | `(open: boolean) => void` | Called after the dialog opens or closes, including native Escape.    |

| API                      | Description                 |
| ------------------------ | --------------------------- |
| `open: boolean`          | Whether the dialog is open. |
| `setOpen(open: boolean)` | `showModal()` or `close()`. |

Events: `hl:open-change { open }`. Drawers take their edge from `data-hl-side="start | end"` in the markup.

### `enhancePopover`

Selector `[data-hl-popover]` (an explicit opt-in; bare `[popover]` elements are left alone).

| Option            | Type                           | Description                                                             |
| ----------------- | ------------------------------ | ----------------------------------------------------------------------- |
| `triggerEvent`    | `'click' \| 'hover' = 'click'` | `click` uses the native invoker; `hover` also opens on pointer/focus.   |
| `placement`       | `Placement = 'bottom'`         | Placement for the JS positioning fallback.                              |
| `position`        | `boolean = true`               | Run the JS positioning fallback when CSS anchor positioning is missing. |
| `hoverCloseDelay` | `number = 100`                 | Grace period in ms before a hover popover closes.                       |
| `defaultOpen`     | `boolean = false`              | Show on enhance.                                                        |
| `onOpenChange`    | `(open: boolean) => void`      | Called after the popover shows or hides.                                |

| API                      | Description                  |
| ------------------------ | ---------------------------- |
| `open: boolean`          | Whether the popover is open. |
| `setOpen(open: boolean)` | Show or hide.                |

Events: `hl:open-change { open }`.

### `enhancePagination`

Selector `[data-hl-pagination]`. Each control carries `data-hl-page` with a page number or `prev`/`next`/`first`/`last`. Links with a real `href` keep navigating (the server renders the next page); buttons and hash links become in-page page changes. When the list is empty and `total` is known, the controls are rendered from the same range algorithm the framework bindings use and re-rendered on change.

| Option          | Type                       | Description                                                               |
| --------------- | -------------------------- | ------------------------------------------------------------------------- |
| `total`         | `number`                   | Number of pages. Defaults to the largest authored page number.            |
| `defaultValue`  | `number`                   | Current page on enhance. Defaults to the item with `aria-current="page"`. |
| `siblings`      | `number = 1`               | Pages shown on each side of the current one when rendering.               |
| `boundaries`    | `number = 1`               | Pages always shown at each end when rendering.                            |
| `prevLabel`     | `string = 'Previous page'` | Accessible name of the rendered previous control.                         |
| `nextLabel`     | `string = 'Next page'`     | Accessible name of the rendered next control.                             |
| `onValueChange` | `(value: number) => void`  | Called with the new page after every change.                              |

| API                       | Description                           |
| ------------------------- | ------------------------------------- |
| `value: number`           | The current page.                     |
| `setValue(value: number)` | Go to a page (clamped to `1..total`). |
| `total: number`           | The page count.                       |

Events: `hl:change { value: number }`. The current page gets `aria-current="page"`; controls at the ends are disabled. Keyboard: `Left`/`Right` (flipped in RTL), `Home`, and `End` move between the numbered controls, which all stay in the tab order.

### `enhanceSegmented`

Selector `[data-hl-segmented]`. With radio inputs inside, the browser handles selection and the enhancer only reports it. With `<button>` segments, the root becomes `role="radiogroup"`, each button `role="radio"` with `aria-checked` and a roving `tabindex`, and arrow keys move the selection (`Left`/`Right` flip in RTL; `Up`/`Down` also work). Button values come from `data-hl-value`, defaulting to the text.

| Option          | Type                      | Description                                                                                  |
| --------------- | ------------------------- | -------------------------------------------------------------------------------------------- |
| `defaultValue`  | `string`                  | Segment to select on enhance. Defaults to the checked radio or `aria-pressed="true"` button. |
| `onValueChange` | `(value: string) => void` | Called with the selected value after every change.                                           |

| API                       | Description         |
| ------------------------- | ------------------- |
| `value: string`           | The selected value. |
| `setValue(value: string)` | Select a segment.   |

Events: `hl:change { value }`.

### `enhanceSlider`

Selector `[data-hl-slider]`, a wrapper around a native `<input type="range">` and an optional `<output>`. The input already handles the keyboard; the enhancer keeps the output text, `aria-valuetext`, and the `--hl-slider-progress` custom property (used to paint the filled track) in sync with the value.

| Option          | Type                        | Description                                           |
| --------------- | --------------------------- | ----------------------------------------------------- |
| `defaultValue`  | `number`                    | Value to set on enhance.                              |
| `unit`          | `string`                    | Suffix appended to the formatted value, e.g. `'%'`.   |
| `format`        | `(value: number) => string` | Custom formatter for the output and `aria-valuetext`. |
| `onValueChange` | `(value: number) => void`   | Called with the numeric value on every `input`.       |

| API                       | Description                             |
| ------------------------- | --------------------------------------- |
| `value: number`           | The numeric value.                      |
| `setValue(value: number)` | Set the value (clamped to `min`/`max`). |

Events: `hl:change { value: number }`.

### `enhanceTable`

Selector `table[data-hl-table]`. Headers marked `data-hl-sort` (optionally with a column key as the value; otherwise the cell index) become sortable: focusable, `aria-sort`, and clicking or pressing `Enter`/`Space` cycles ascending then descending. Rows sort by each cell's `data-hl-value` (falling back to its text), numerically when both sides are numbers. Rows added later sort into place.

| Option          | Type                                                         | Description                                                                                |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `defaultValue`  | `{ column: string; direction: 'ascending' \| 'descending' }` | Sort on enhance. As an attribute: `data-hl-default-value="price"` or `"price:descending"`. |
| `compare`       | `(a: string, b: string, column: string) => number`           | Custom comparator for cell values.                                                         |
| `onValueChange` | `(value: SortState \| null) => void`                         | Called after the sort changes.                                                             |

| API                                  | Description                                            |
| ------------------------------------ | ------------------------------------------------------ |
| `value: SortState \| null`           | The active sort, or `null` for authored order.         |
| `setValue(value: SortState \| null)` | Sort by a column, or `null` to restore authored order. |

Events: `hl:change { value: SortState | null }`.

### `enhanceTooltip`

Selector `[data-hl-tooltip]` on the trigger; the value (or `aria-describedby`) names the tip.

| Option         | Type                      | Description                                                                                 |
| -------------- | ------------------------- | ------------------------------------------------------------------------------------------- |
| `placement`    | `Placement = 'top'`       | Preferred placement relative to the trigger; logical (`start`/`end` follow text direction). |
| `position`     | `boolean = true`          | Run the JS positioning fallback when CSS anchor positioning is missing.                     |
| `showDelay`    | `number = 150`            | Delay in ms before showing on hover. Focus shows immediately.                               |
| `hideDelay`    | `number = 100`            | Grace period in ms before hiding.                                                           |
| `defaultOpen`  | `boolean = false`         | Show on enhance.                                                                            |
| `onOpenChange` | `(open: boolean) => void` | Called after the tooltip shows or hides.                                                    |

| API                      | Description                          |
| ------------------------ | ------------------------------------ |
| `open: boolean`          | Whether the tooltip is shown.        |
| `setOpen(open: boolean)` | Show or hide immediately, no delays. |

Events: `hl:open-change { open }`. The tip becomes `popover="manual"` where the Popover API exists and toggles `data-hl-tooltip-open`. The resolved side is stamped on the tip as `data-hl-side="top | bottom | start | end"` so the stylesheet can orient the arrow, whether CSS anchor positioning or the JS fallback placed it.

`Placement` is logical everywhere: a `Side` is `top`, `bottom`, `start`, or `end`, optionally suffixed with an `Align` of `start`, `center`, or `end` (`bottom-start`, `end-center`). `start` and `end` mirror under `dir="rtl"`. The JS positioning fallback also stamps `data-hl-side` and `data-hl-align` on every floating surface it places.

### `enhanceCombobox`

Selector `[data-hl-combobox]`, containing an `<input>` and a `[role="listbox"]`. The root is marked `data-hl-ready`.

| Option          | Type                      | Description                                                             |
| --------------- | ------------------------- | ----------------------------------------------------------------------- |
| `filter`        | `boolean = true`          | Hide options that don't match the typed query.                          |
| `autoHighlight` | `boolean = true`          | Highlight the first match automatically while typing.                   |
| `position`      | `boolean = true`          | Run the JS positioning fallback when CSS anchor positioning is missing. |
| `defaultValue`  | `string`                  | Initial committed value; pre-fills the input.                           |
| `defaultOpen`   | `boolean = false`         | Start with the listbox expanded.                                        |
| `onValueChange` | `(value: string) => void` | Called with the committed value after a selection or `setValue`.        |
| `onOpenChange`  | `(open: boolean) => void` | Called after the listbox expands or collapses.                          |

| API                       | Description                                     |
| ------------------------- | ----------------------------------------------- |
| `value: string`           | The input's current text.                       |
| `setValue(value: string)` | Commit a value: updates the input and notifies. |
| `open: boolean`           | Whether the listbox is expanded.                |
| `setOpen(open: boolean)`  | Expand or collapse the listbox.                 |

Events: `hl:select { value, option }` (cancelable), `hl:change { value }`, `hl:open-change { open }`. Options with `aria-disabled="true"` are skipped. Options rendered later (async results) are picked up automatically.

### `enhanceCommand`

Selector `[data-hl-command]`, containing `[data-hl-command-input]` and `[data-hl-command-list]`. The root is marked `data-hl-ready`.

| Option           | Type                                         | Description                                                                          |
| ---------------- | -------------------------------------------- | ------------------------------------------------------------------------------------ |
| `hotkey`         | `string`                                     | Lowercased key that, with Cmd/Ctrl, opens the hosting `<dialog>` (`data-hl-hotkey`). |
| `closeOnCommand` | `boolean = true`                             | Close the hosting `<dialog>` after a command runs.                                   |
| `defaultValue`   | `string`                                     | Initial filter query; pre-fills the input.                                           |
| `defaultOpen`    | `boolean`                                    | Open the hosting `<dialog>` on enhance.                                              |
| `onValueChange`  | `(value: string) => void`                    | Called with the filter query after every change.                                     |
| `onOpenChange`   | `(open: boolean) => void`                    | Called after the hosting `<dialog>` opens or closes.                                 |
| `onCommand`      | `(value: string, item: HTMLElement) => void` | Called when a command runs.                                                          |

| API                       | Description                                                          |
| ------------------------- | -------------------------------------------------------------------- |
| `value: string`           | The current filter query.                                            |
| `setValue(value: string)` | Set the query: updates the input and re-filters.                     |
| `open: boolean`           | Whether the hosting `<dialog>` is open (`false` when there is none). |
| `setOpen(open: boolean)`  | Open or close the hosting `<dialog>`.                                |

Events: `hl:command { value, item }` (cancelable), `hl:change { value }`, `hl:open-change { open }`. Keyboard: `Up`/`Down`, `Home`/`End`, `PageUp`/`PageDown` (ten at a time), `Enter`, and `Esc` (clears a non-empty query, then closes the dialog). Disabled options (`aria-disabled="true"`) are skipped.

### `enhanceToc`

Selector `[data-hl-toc]`.

| Option            | Type                              | Description                                                                  |
| ----------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| `contentSelector` | `string = 'main, article'`        | Region whose headings populate the list.                                     |
| `headings`        | `string = 'h2,h3'`                | Which headings to include.                                                   |
| `scrollSpy`       | `boolean = true`                  | Mark the entry for the heading in view with `aria-current`.                  |
| `watch`           | `boolean = true`                  | Rebuild automatically when headings are added, removed, or renamed.          |
| `onValueChange`   | `(value: string \| null) => void` | Called with the id of the heading in view (or `null`) as the reader scrolls. |

| API                               | Description                                   |
| --------------------------------- | --------------------------------------------- |
| `value: string \| null`           | Id of the active heading.                     |
| `setValue(value: string \| null)` | Mark an entry current (e.g. from a router).   |
| `refresh()`                       | Rebuild the list by hand when `watch` is off. |

Events: `hl:change { value: string | null }`.

### `enhanceToast`

Selector `[data-hl-toast-region]`. If the container has no region, one is appended so the API always has somewhere to render. Declarative triggers use `data-hl-toast-trigger="message"`, `data-hl-toast-intent`, and `data-hl-toast-duration`; the region itself can set `data-hl-duration`.

| Option         | Type                                          | Description                                                          |
| -------------- | --------------------------------------------- | -------------------------------------------------------------------- |
| `duration`     | `number = 5000`                               | Default auto-dismiss delay in ms for toasts without an explicit one. |
| `onOpenChange` | `(open: boolean, toast: HTMLElement) => void` | Called after a toast appears or is dismissed.                        |

| API                                                  | Description                                                                                                                            |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `show(message, { duration?, intent? }): HTMLElement` | Show a toast. `intent` is `'info' \| 'success' \| 'warning' \| 'danger'` and sets `data-hl-intent`; `danger` also sets `role="alert"`. |
| `dismiss(toast: HTMLElement)`                        | Dismiss a toast returned by `show`.                                                                                                    |
| `dismissAll()`                                       | Dismiss every toast in the region.                                                                                                     |

Events: `hl:open-change { open, toast }`. Auto-dismiss pauses on hover and focus-within.

## EnhancerHandle

Every enhancer returns the same handle shape:

```ts
interface EnhancerHandle<Api> {
  /** Tear down every instance this call created. */
  destroy: () => void;
  /** The first enhanced root's API, or null when nothing matched. */
  api: Api | null;
  /** One entry per enhanced root: { root, api, destroy }. */
  instances: EnhancerInstance<Api>[];
}
```

## Events

State changes are also broadcast as bubbling `CustomEvent`s from the component
root, so you can listen without holding a handle:

| Event            | Detail                                | Fired by                                                                                                                                                                                            | Cancelable |
| ---------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `hl:change`      | `{ value }`                           | tabs (`string`), accordion and checkbox group (`string[]`), menu and toc (`string \| null`), pagination and slider (`number`), segmented (`string`), table (`SortState \| null`), combobox, command | No         |
| `hl:open-change` | `{ open, ... }`                       | alert, disclosure, dropdown, modal, drawer, popover, tooltip, combobox, command, toast (adds `toast`)                                                                                               | No         |
| `hl:select`      | `{ value, item \| option, checked? }` | dropdown, menu (`item`, plus `checked` for checkable items), combobox (`option`)                                                                                                                    | Yes        |
| `hl:command`     | `{ value, item }`                     | command palette                                                                                                                                                                                     | Yes        |

Calling `preventDefault()` on a cancelable event vetoes the action: a dropdown
or menu item's `aria-checked` is restored, a combobox keeps its input unchanged,
and a command's link isn't followed.

```js
document.addEventListener('hl:select', (e) => {
  if (e.detail.value === 'delete' && !confirm('Delete?')) e.preventDefault();
});
```

## Building your own enhancer

`defineEnhancer` gives a custom component the same lifecycle every built-in one
has: root discovery, idempotent de-duplication, option merging from defaults
and `data-hl-*` attributes, automatic listener and observer teardown, and the
uniform handle. See [Composing and Extending](/guide/composing#writing-your-own-enhancer).

## Framework APIs

The framework bindings are included in the generated reference above:
`@hydrateless/react`, `@hydrateless/vue`, and `@hydrateless/svelte`. Svelte's
single-file components can't be read by TypeDoc, so their props are covered in
the Svelte guide instead.

For usage patterns and examples, see the framework guides:

- [React](/frameworks/react)
- [Vue](/frameworks/vue)
- [Svelte](/frameworks/svelte)

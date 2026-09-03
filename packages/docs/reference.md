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

## Enhancers

Defaults are shown after `=`. Every option is optional.

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

### `enhanceMenu`

Selector `[data-hl-menu]`. Submenu values come from `data-hl-value` on each top-level trigger, defaulting to the index. The root is marked `data-hl-ready` so the CSS hover baseline stands down.

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

### `enhanceTooltip`

Selector `[data-hl-tooltip]` on the trigger; the value (or `aria-describedby`) names the tip. Placement can also come from `data-hl-placement` on the trigger.

| Option         | Type                      | Description                                                             |
| -------------- | ------------------------- | ----------------------------------------------------------------------- |
| `placement`    | `Placement = 'top'`       | Preferred placement relative to the trigger.                            |
| `position`     | `boolean = true`          | Run the JS positioning fallback when CSS anchor positioning is missing. |
| `showDelay`    | `number = 150`            | Delay in ms before showing on hover. Focus shows immediately.           |
| `hideDelay`    | `number = 100`            | Grace period in ms before hiding.                                       |
| `onOpenChange` | `(open: boolean) => void` | Called after the tooltip shows or hides.                                |

| API                      | Description                          |
| ------------------------ | ------------------------------------ |
| `open: boolean`          | Whether the tooltip is shown.        |
| `setOpen(open: boolean)` | Show or hide immediately, no delays. |

Events: `hl:open-change { open }`. The tip becomes `popover="manual"` where the Popover API exists and toggles `data-hl-tooltip-open`.

### `enhanceCombobox`

Selector `[data-hl-combobox]`, containing an `<input>` and a `[role="listbox"]`. The root is marked `data-hl-ready`.

| Option          | Type                      | Description                                                      |
| --------------- | ------------------------- | ---------------------------------------------------------------- |
| `filter`        | `boolean = true`          | Hide options that don't match the typed query.                   |
| `autoHighlight` | `boolean = true`          | Highlight the first match automatically while typing.            |
| `defaultValue`  | `string`                  | Initial committed value; pre-fills the input.                    |
| `onValueChange` | `(value: string) => void` | Called with the committed value after a selection or `setValue`. |
| `onOpenChange`  | `(open: boolean) => void` | Called after the listbox expands or collapses.                   |

| API                       | Description                                     |
| ------------------------- | ----------------------------------------------- |
| `value: string`           | The input's current text.                       |
| `setValue(value: string)` | Commit a value: updates the input and notifies. |
| `open: boolean`           | Whether the listbox is expanded.                |
| `setOpen(open: boolean)`  | Expand or collapse the listbox.                 |

Events: `hl:select { value, option }` (cancelable), `hl:change { value }`, `hl:open-change { open }`. Options with `aria-disabled="true"` are skipped.

### `enhanceCommand`

Selector `[data-hl-command]`, containing `[data-hl-command-input]` and `[data-hl-command-list]`. The root is marked `data-hl-ready`.

| Option          | Type                                         | Description                                                                                                    |
| --------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `hotkey`        | `string`                                     | Lowercased key that, with Cmd/Ctrl, opens the hosting `<dialog>`. Also readable from `data-hl-command-hotkey`. |
| `defaultValue`  | `string`                                     | Initial filter query; pre-fills the input.                                                                     |
| `onValueChange` | `(value: string) => void`                    | Called with the filter query after every change.                                                               |
| `onCommand`     | `(value: string, item: HTMLElement) => void` | Called when a command runs.                                                                                    |

| API                       | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `value: string`           | The current filter query.                        |
| `setValue(value: string)` | Set the query: updates the input and re-filters. |

Events: `hl:command { value, item }` (cancelable), `hl:change { value }`. Keyboard: `Up`/`Down`, `PageUp`/`PageDown` (ten at a time), `Enter`, and `Esc` (clears a non-empty query, then closes the dialog).

### `enhanceToc`

Selector `[data-hl-toc]`. The content region can also be named with `data-hl-toc-content`.

| Option            | Type                       | Description                                                 |
| ----------------- | -------------------------- | ----------------------------------------------------------- |
| `contentSelector` | `string = 'main, article'` | Region whose headings populate the list.                    |
| `headings`        | `string = 'h2,h3'`         | Which headings to include.                                  |
| `scrollSpy`       | `boolean = true`           | Mark the entry for the heading in view with `aria-current`. |

| API         | Description                                 |
| ----------- | ------------------------------------------- |
| `refresh()` | Rebuild the list after the content changes. |

### `enhanceToast`

Selector `[data-hl-toast-region]`. If the container has no region, one is appended so the API always has somewhere to render. Declarative triggers use `data-hl-toast-trigger="message"`, `data-hl-toast-intent`, and `data-hl-toast-duration`.

| Option         | Type                                          | Description                                                          |
| -------------- | --------------------------------------------- | -------------------------------------------------------------------- |
| `duration`     | `number = 5000`                               | Default auto-dismiss delay in ms for toasts without an explicit one. |
| `onOpenChange` | `(open: boolean, toast: HTMLElement) => void` | Called after a toast appears or is dismissed.                        |

| API                                                  | Description                                                                                                                            |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `show(message, { duration?, intent? }): HTMLElement` | Show a toast. `intent` is `'info' \| 'success' \| 'warning' \| 'danger'` and sets `data-hl-intent`; `danger` also sets `role="alert"`. |
| `dismiss(toast: HTMLElement)`                        | Dismiss a toast returned by `show`.                                                                                                    |

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

| Event            | Detail                                | Fired by                                                                              | Cancelable |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------- | ---------- |
| `hl:change`      | `{ value }`                           | tabs (`string`), accordion (`string[]`), menu (`string \| null`), combobox, command   | No         |
| `hl:open-change` | `{ open, ... }`                       | disclosure, dropdown, modal, drawer, popover, tooltip, combobox, toast (adds `toast`) | No         |
| `hl:select`      | `{ value, item \| option, checked? }` | dropdown, menu (`item`, plus `checked` for checkable items), combobox (`option`)      | Yes        |
| `hl:command`     | `{ value, item }`                     | command palette                                                                       | Yes        |

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
has: root discovery, idempotent de-duplication, automatic listener teardown, and
the uniform handle. See [Composing and Extending](/guide/composing#writing-your-own-enhancer).

## Framework APIs

The framework bindings are included in the generated reference above:
`@hydrateless/react`, `@hydrateless/vue`, and `@hydrateless/svelte`. Svelte's
single-file components can't be read by TypeDoc, so their props are covered in
the Svelte guide instead.

For usage patterns and examples, see the framework guides:

- [React](/frameworks/react)
- [Vue](/frameworks/vue)
- [Svelte](/frameworks/svelte)

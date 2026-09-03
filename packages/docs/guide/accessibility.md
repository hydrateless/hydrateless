# Accessibility

Hydrateless starts from the platform: native elements carry their own roles,
keyboard handling, and focus management, and the enhancers add only what the
platform can't express yet. Every component is verified in Chromium, Firefox,
and WebKit with axe, with JavaScript both off and on.

This page maps each component to its
[WAI-ARIA Authoring Practices (APG)](https://www.w3.org/WAI/ARIA/apg/) pattern,
lists the keyboard support, and explains the policies that apply across the
library.

## Pattern mapping

| Component         | APG pattern                                                                             | Native basis                                    | Enhancer adds                                                                    |
| ----------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------- |
| Accordion         | [Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)                        | `<details>`/`<summary>`                         | Single-open behavior, header arrow navigation                                    |
| Disclosure        | [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)                      | `<details>`                                     | Observable open state only                                                       |
| Tabs              | [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)                                  | Radios (CSS baseline) or `role="tab"` buttons   | Roving tabindex, arrow/Home/End, manual or automatic activation, `aria-selected` |
| Dropdown Menu     | [Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)                    | `<button popovertarget>` + `[popover]`          | `role="menu"`, focus into items, typeahead, checkable items, focus return        |
| Menu              | [Menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)                            | `<ul role="menubar">`                           | Roving tabindex, submenu control, `aria-haspopup="menu"`, `aria-expanded`        |
| Modal, Drawer     | [Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)                | `<dialog>` + `showModal()` via Invoker Commands | `aria-labelledby`, scroll lock                                                   |
| Popover           | Disclosure-style non-modal surface                                                      | `[popover]` + `popovertarget`                   | `aria-expanded`/`aria-controls` on invokers                                      |
| Tooltip           | [Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)                            | `role="tooltip"` + `aria-describedby`           | Delays, top-layer `popover="manual"`, Escape from anywhere                       |
| Combobox          | [Combobox (list autocomplete)](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)      | `<input>` + `role="listbox"`                    | `aria-activedescendant`, filtering, disabled skipping                            |
| Command Palette   | Combobox + [Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)                 | `<input>` + `role="listbox"`                    | Filtering, group hiding, PageUp/PageDown, Escape policy                          |
| Switch            | [Switch](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)                              | `<input type="checkbox" role="switch">`         | None                                                                             |
| Radio Group       | [Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)                          | Native radios sharing a `name`                  | None                                                                             |
| Segmented Control | [Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)                          | Native radios under `role="radiogroup"`         | None                                                                             |
| Slider            | [Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)                              | `<input type="range">`                          | None                                                                             |
| Breadcrumb        | [Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)                      | `<nav aria-label>` + `<ol>` + `aria-current`    | None                                                                             |
| Toast             | [Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) and live regions               | `role="status"` region                          | Timers that pause on hover/focus, `role="alert"` for `danger`                    |
| Alert             | [Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)                                | `role="alert"` or `role="status"`               | None                                                                             |
| Table of Contents | Navigation landmark                                                                     | `<nav>` + list of links                         | Generated links, `aria-current` scroll spy                                       |
| Skip Link         | [Bypass Blocks (WCAG 2.4.1)](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks) | `<a href="#main">`                              | None                                                                             |

## Keyboard support

Keys marked "native" come from the browser; the rest are added by the enhancer.

### Tabs

| Key                                       | Action                                                         |
| ----------------------------------------- | -------------------------------------------------------------- |
| `Tab`                                     | Moves into the tab list (selected tab) or on to the panel      |
| `Left` / `Right` (`Up` / `Down` vertical) | Move focus to the previous/next enabled tab, wrapping          |
| `Home` / `End`                            | First / last enabled tab                                       |
| `Enter` / `Space`                         | Activate the focused tab (`activation: 'manual'`, the default) |

With `activation: 'automatic'` the arrow keys activate as they move.

### Accordion

| Key               | Action                                             |
| ----------------- | -------------------------------------------------- |
| `Enter` / `Space` | Toggle the focused header (native `<summary>`)     |
| `Down` / `Up`     | Move focus to the next / previous header, wrapping |
| `Home` / `End`    | First / last header                                |

### Dropdown Menu

| Key                  | Action                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| `Enter` / `Space`    | On the trigger: open (native `popovertarget`). On an item: activate                              |
| `Down` / `Up`        | On the trigger: open and focus the first / last item. In the menu: move, skipping disabled items |
| `Home` / `End`       | First / last enabled item                                                                        |
| Printable characters | Typeahead to the next item starting with those characters                                        |
| `Esc`                | Close and return focus to the trigger                                                            |
| `Tab`                | Close, return focus to the trigger, then let the browser move on                                 |

### Menu (menubar)

| Key                                         | Action                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------- |
| `Right` / `Left` (`Down` / `Up` vertical)   | Move between top-level items                                                    |
| `Down`, `Enter`, `Space` (`Right` vertical) | Open the focused item's submenu and focus its first item                        |
| `Up` (horizontal)                           | Open the submenu and focus its last item                                        |
| `Down` / `Up` in a submenu                  | Move between submenu items, skipping disabled ones                              |
| `Right` / `Left` in a submenu               | Close and open the adjacent top-level submenu (`Left` closes in vertical menus) |
| `Home` / `End`                              | First / last item at the current level                                          |
| `Esc`                                       | Close the submenu and return focus to its trigger                               |

### Combobox

| Key                   | Action                                                                      |
| --------------------- | --------------------------------------------------------------------------- |
| Typing                | Filters the list and highlights the first match                             |
| `Down` / `Up`         | Open the list if closed, then move the highlight, skipping disabled options |
| `Alt` + `Down`        | Open the list without moving the highlight                                  |
| `PageDown` / `PageUp` | Move the highlight ten options                                              |
| `Home` / `End`        | Move the text caret (not intercepted, per the APG)                          |
| `Enter`               | Commit the highlighted option                                               |
| `Esc`                 | Close the list                                                              |
| `Tab`                 | Close the list and move on                                                  |

### Command Palette

| Key                   | Action                                                              |
| --------------------- | ------------------------------------------------------------------- |
| Typing                | Filters commands (text plus `data-hl-keywords`), hides empty groups |
| `Down` / `Up`         | Move the active command, wrapping                                   |
| `PageDown` / `PageUp` | Move ten commands                                                   |
| `Enter`               | Run the active command                                              |
| `Esc`                 | Clear a non-empty query; when empty, close the hosting `<dialog>`   |
| `Cmd`/`Ctrl` + hotkey | Open the hosting `<dialog>` and focus the input                     |

### Modal and Drawer

| Key   | Action                                                                 |
| ----- | ---------------------------------------------------------------------- |
| `Tab` | Cycles within the dialog (native focus containment from `showModal()`) |
| `Esc` | Closes (native, with `closedby="any"`)                                 |

### Popover and Tooltip

| Key                        | Action                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `Enter` / `Space`          | Toggle a popover from its invoker (native `popovertarget`)                          |
| `Esc`                      | Close the popover (native) or dismiss the tooltip (from anywhere while it is shown) |
| Focus on a tooltip trigger | Shows the tooltip immediately                                                       |

### Native controls

Switch, Checkbox, Radio Group, Segmented Control, Slider, Select, and Input rely
entirely on the browser's keyboard handling: `Space` toggles, arrows move radios
and sliders, `Home`/`End` jump sliders to their bounds.

## Focus return

Whenever a surface closes because of a keyboard action, focus goes back to the
element that opened it:

- **Modal and Drawer**: the browser returns focus to the invoker when a
  `showModal()` dialog closes.
- **Popover**: the browser returns focus to the `popovertarget` button when a
  popover closes via `Esc`.
- **Dropdown Menu**: the enhancer returns focus to the trigger on `Esc`, `Tab`,
  and item activation. Light dismiss (clicking elsewhere) leaves focus where the
  user put it, because moving it would fight their intent.
- **Menu**: `Esc` in a submenu returns focus to the submenu's trigger; activating
  a leaf item closes the submenu and focuses the trigger.
- **Tooltip**: `Esc` dismisses without moving focus (WCAG 1.4.13).

## Live regions

- The toast region is `role="status"` with `aria-live="polite"` and
  `aria-relevant="additions"`. Toasts are announced when they arrive without
  interrupting the current announcement. A `danger` toast also gets
  `role="alert"`, which is assertive.
- `Alert` components use `role="alert"` for `danger`/`warning` content that
  appears dynamically, and `role="status"` otherwise. Content present at page
  load doesn't need a live role.
- The table of contents marks the heading in view with `aria-current="true"`
  rather than announcing every scroll change.

## Disabled items

Menu items, combobox options, and tabs can be disabled with the native
`disabled` attribute (on buttons) or `aria-disabled="true"` (on anything). The
enhancers skip them during arrow navigation and typeahead, and refuse to
activate them, so keyboard and pointer users get the same result. Disabled
controls render at `--hl-disabled-opacity` and keep a visible border under
forced colors.

## Forced colors

Under `@media (forced-colors: active)` (Windows High Contrast), the semantic
tokens resolve to system colors and each component adds the rules that
`forced-color-adjust` would otherwise flatten:

- Buttons, inputs, and selects keep a visible `CanvasText` border.
- The selected tab, segment, active option, and checked switch use `Highlight`
  and `HighlightText`.
- Focus rings use `Highlight`.

Nothing depends on color alone: selected states also change `aria-selected`,
`aria-checked`, or `aria-current`, which assistive technology announces.

## Reduced motion

Under `prefers-reduced-motion: reduce` every duration token is zeroed, so
transitions and `@starting-style` entries complete instantly, and the spinner,
loading button, and indeterminate progress bar render as static shapes. See
[Motion](./motion).

## Checklist for your own markup

- Give every `role="tablist"`, `role="menubar"`, `role="listbox"`, and `<nav>`
  an `aria-label` (or `aria-labelledby`) when a page has more than one.
- Render initial state in HTML: `aria-selected`, `hidden`, `open`,
  `aria-checked`. The enhancers read it, and so do users with JavaScript off.
- Use `<button type="button">` for menu items and tabs so they are focusable
  and activate on `Enter` and `Space` natively.
- Put `popover` on dropdown menus and `popovertarget` on their triggers so they
  open before hydration.
- Mark placeholders (`Skeleton`) `aria-hidden="true"` and give spinners
  `role="status"` with an `aria-label`.

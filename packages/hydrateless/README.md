# hydrateless

Accessible, themeable UI primitives built on semantic HTML and modern CSS. This package is the CSS: every component works with no JavaScript, and the optional enhancers in `@hydrateless/enhancers` layer keyboard patterns and APIs on top of the same markup.

## Install

```sh
npm install hydrateless
```

```html
<link rel="stylesheet" href="node_modules/hydrateless/dist/hydrateless.css" />
```

Or from a CDN, pinned to a major:

```html
<link rel="stylesheet" href="https://unpkg.com/hydrateless@0/dist/hydrateless.min.css" />
```

## Entry points

`hydrateless.css` bundles everything in four cascade layers, declared in this order so later layers always win:

```css
@layer reset, tokens, theme, components;
```

Each layer and each component is also a subpath export, so you can take only what you need. Always include `tokens.css`; the components reference the tokens and nothing else.

| Subpath                                                                                                                                                                                  | Contents                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `hydrateless/reset.css`                                                                                                                                                                  | Border-box sizing, zeroed margins, inherited form fonts |
| `hydrateless/tokens.css`                                                                                                                                                                 | Palette, scales, and semantic tokens (`--hl-*`)         |
| `hydrateless/theme.css`                                                                                                                                                                  | Body colors and type built on the tokens                |
| `hydrateless/components.css`                                                                                                                                                             | Every component below                                   |
| `hydrateless/accordion.css`, `disclosure.css`, `tabs.css`, `toc.css`, `breadcrumb.css`, `pagination.css`, `separator.css`                                                                | Disclosure and navigation                               |
| `hydrateless/modal.css`, `drawer.css`, `popover.css`, `tooltip.css`, `dropdown.css`, `menu.css`, `toast.css`, `command-palette.css`                                                      | Overlays                                                |
| `hydrateless/button.css`, `input.css`, `textarea.css`, `select.css`, `checkbox.css`, `radio-group.css`, `switch.css`, `field.css`, `combobox.css`, `segmented-control.css`, `slider.css` | Forms                                                   |
| `hydrateless/alert.css`, `badge.css`, `card.css`, `avatar.css`, `progress.css`, `spinner.css`, `skeleton.css`, `kbd.css`, `table.css`                                                    | Feedback and data display                               |
| `hydrateless/skip-link.css`                                                                                                                                                              | Navigation utility                                      |

```js
import 'hydrateless/tokens.css';
import 'hydrateless/button.css';
import 'hydrateless/segmented-control.css';
```

Class names don't follow the file names one to one: `segmented-control.css` styles `.hl-segmented`, `radio-group.css` styles `.hl-radio-group` and `.hl-radio`, and `command-palette.css` styles `[data-hl-command]` and `.hl-command-*`.

## Theming

Every color token is a `light-dark()` pair, resolved by `color-scheme`. The root follows the system preference; set `data-theme` on any element to pin a scheme for that subtree:

```html
<html data-theme="dark">
  ...
  <aside data-theme="light">Always light</aside>
</html>
```

Override tokens anywhere in the cascade; the components read only the semantic layer, so a brand swap is a handful of variables:

```css
:root {
  --hl-primary: light-dark(hsl(280deg 70% 45%), hsl(280deg 80% 65%));
  --hl-primary-fg: white;
  --hl-radius-md: 0.25rem;
}
```

### Token reference

Palette ramps (`--hl-gray-50` to `--hl-gray-950`, `--hl-brand-*`, `--hl-red-*`, `--hl-amber-*`, `--hl-green-*`, `--hl-sky-*`) live in `tokens/palette.css`. The tokens components actually use:

| Token                                                                           | Purpose                                                         |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `--hl-bg`, `--hl-surface`, `--hl-surface-2`, `--hl-surface-3`                   | Page and stepped surfaces                                       |
| `--hl-fg`, `--hl-fg-muted`, `--hl-fg-subtle`                                    | Text                                                            |
| `--hl-border`, `--hl-border-strong`, `--hl-border-width`, `--hl-border-width-2` | Borders                                                         |
| `--hl-ring`, `--hl-focus-ring`, `--hl-focus-shadow`, `--hl-focus-offset`        | Focus ring color, full outline value, soft halo, outline gap    |
| `--hl-primary`, `--hl-danger`, `--hl-success`, `--hl-warning`, `--hl-info`      | Intents, each with `-hover`, `-fg`, `-subtle`, `-subtle-fg`     |
| `--hl-scrim`, `--hl-overlay`, `--hl-overlay-shadow`                             | Backdrop and floating surfaces                                  |
| `--hl-shadow-xs` to `--hl-shadow-xl`, `--hl-shadow-color`                       | Elevation                                                       |
| `--hl-space-*`, `--hl-radius-*`, `--hl-text-*`, `--hl-leading-*`, `--hl-font-*` | Spacing, radii, and type scales                                 |
| `--hl-control-block-size`, `--hl-control-height-sm`, `-md`, `-lg`               | Control heights; `-md` is an alias of `--hl-control-block-size` |
| `--hl-overlay-inline-size`, `--hl-modal-inline-size`                            | Drawer and modal widths                                         |
| `--hl-disabled-opacity`                                                         | Opacity of disabled controls and items                          |
| `--hl-z-*`                                                                      | Stacking order for the JS positioning fallback                  |
| `--hl-duration-fast`, `-base`, `-slow`, `--hl-ease-standard`, `-emphasized`     | Motion                                                          |

## Conventions

State and variants are `data-hl-*` attributes rather than modifier classes:

- `data-hl-intent="primary | danger | success | warning | info | neutral"` on buttons, badges, alerts, progress, and toasts.
- `data-hl-variant="solid | soft | outline | ghost | link"` is the button's visual style (and `soft | solid | outline` on badges).
- `data-hl-size="sm | md | lg"` on controls, tables, and avatars.
- `data-hl-side="start | end"` on the drawer (default `end`). Sides are logical, so they flip under `dir="rtl"`.
- `data-hl-shape="text | circle | rect"` on skeletons.
- `data-hl-orientation` on radio groups and separators; `aria-orientation` on tablists and menus.
- `data-hl-ready` is set by an enhancer once it owns a component; the CSS no-JS baselines (menu submenus on hover, combobox list on focus, tab panels by radio, command palette empty state) stand down when it's present.

Modal and drawer selectors accept either the class or the data attribute: `:is(.hl-modal, dialog[data-hl-modal])` and `:is(.hl-drawer, dialog[data-hl-drawer])`.

## Right to left

The stylesheet uses logical properties throughout (`inline-size`, `margin-inline-start`, `inset-inline-end`, `text-align: start`), so setting `dir="rtl"` mirrors every component. Transforms are physical, so the two places that move things, the switch thumb and the drawer slide, are mirrored with `:dir(rtl)`.

## Motion

Overlays (popover, dropdown, menu submenus, tooltip, modal and its backdrop, drawer, toast) enter through `@starting-style` and exit through `transition-behavior: allow-discrete` on `display` and `overlay`, using the duration and easing tokens. Under `prefers-reduced-motion: reduce` the duration tokens drop to `0ms`, and the spinner, loading button, and indeterminate progress stop animating and render a static arc or bar.

## Forced colors

Under `forced-colors: active` the semantic tokens map to system colors (`Canvas`, `CanvasText`, `Highlight`, `HighlightText`, `GrayText`), controls that normally rely on fills gain `ButtonBorder`/`CanvasText` borders, and selected tabs, segments, options, and checked switches use `Highlight`. Only the custom-drawn checkbox mark, radio dot, and switch thumb use `forced-color-adjust: none`.

## Browser support

The CSS targets evergreen browsers with the Popover API, `:has()`, `light-dark()`, and `@starting-style`. CSS anchor positioning is used where available; the enhancers provide a JS positioning fallback elsewhere. The build (`scripts/build.mjs`) intentionally leaves these features native rather than polyfilling them.

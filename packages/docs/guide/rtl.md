# Right-to-Left

Hydrateless is written with CSS logical properties, so every component mirrors
correctly in right-to-left languages with no extra stylesheet. Set `dir` and
you're done.

## Enable a direction

Put `dir` on the root (or on any subtree):

```html
<html lang="ar" dir="rtl"></html>
```

The browser flips the inline axis, and because the components never use
physical `left`/`right`, everything follows: padding, margins, borders, icon
placement, alignment, and the positions of floating surfaces.

You can mix directions on one page. A `dir="ltr"` code block inside an RTL
article keeps its own layout, and components inside it lay out left to right.

## What "logical" means in practice

| Physical (not used)            | Logical (used throughout)                      |
| ------------------------------ | ---------------------------------------------- |
| `margin-left`, `padding-right` | `margin-inline-start`, `padding-inline-end`    |
| `left: 0`, `right: 0`          | `inset-inline-start: 0`, `inset-inline-end: 0` |
| `width`, `height`              | `inline-size`, `block-size`                    |
| `border-top`, `border-bottom`  | `border-block-start`, `border-block-end`       |
| `text-align: left`             | `text-align: start`                            |
| `float: left`                  | `float: inline-start`                          |

The same applies to the tokens: `--hl-overlay-inline-size` and
`--hl-modal-inline-size` are widths on the inline axis, and Skeleton's
`width`/`height` props map to `inline-size`/`block-size`.

The one exception is the JavaScript positioning fallback used on engines
without CSS anchor positioning. It measures the anchor's rectangle and writes
inline `top`/`left`, which is direction-agnostic because it works from the
measured geometry rather than from a side name.

## Components with a side

### Drawer

`data-hl-side` takes logical values. `end` (the default) is the right edge in
LTR and the left edge in RTL; `start` is the opposite. The slide animation
follows the same edge.

```html
<dialog class="hl-drawer" data-hl-drawer data-hl-side="start">...</dialog>
```

In the framework bindings the prop is `side="start" | "end"`. If you need a
drawer that always opens from a specific physical edge regardless of language,
wrap it in an element with a fixed `dir`.

### Switch

The thumb sits at `inset-inline-start` and moves along the inline axis with a
`translate` that flips under `:dir(rtl)`, so a checked switch's thumb is on the
left in RTL, matching platform switches.

### Breadcrumb and Pagination

Breadcrumb separators are generated content between inline siblings, so a
breadcrumb reads "Home / Docs / Components" from right to left in RTL.
Pagination is a flex row, so the previous and next controls swap sides as well.
If you render arrow glyphs in those controls, use text-direction-neutral icons
or flip them with `:dir(rtl)`; the library doesn't supply glyphs.

### Dropdown, Menu, Popover, Tooltip

Floating surfaces are placed with CSS anchor positioning using logical
`position-area` values (`block-end span-inline-end`), so a dropdown that opens
below and to the right of its trigger in LTR opens below and to the left in RTL.
The `Placement` option on the enhancers (`bottom-start`, `right-start`, and so
on) uses logical `start`/`end` for the alignment part.

### Table

`data-hl-align="start" | "center" | "end"` on cells or on the table is logical:
numbers aligned `end` sit on the right in LTR and on the left in RTL.

## Keyboard directions

Arrow keys are not mirrored. `Right` moves to the next tab or menubar item in
document order in both directions, which is what the ARIA Authoring Practices
recommend and what native controls (radio groups, sliders) do. Visually this
means `Right` moves left in an RTL tab list, matching native behavior.

## Testing

To check your own pages, toggle `document.documentElement.dir = 'rtl'` in the
console; there is no rebuild step. In Playwright, set the attribute in
`page.addInitScript` or pass `dir="rtl"` on the fixture's `<html>` element.

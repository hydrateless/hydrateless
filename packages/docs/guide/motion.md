# Motion

Motion in Hydrateless is short, purposeful, and entirely opt-out. Every
transition reads a duration token, entries use `@starting-style` so the browser
does the work, and `prefers-reduced-motion` turns everything off with one rule.

## Tokens

Defined in `scale.css`:

| Token                  | Default                      | Used for                                         |
| ---------------------- | ---------------------------- | ------------------------------------------------ |
| `--hl-duration-fast`   | `120ms`                      | Hover and focus color changes, switch thumb      |
| `--hl-duration-base`   | `180ms`                      | Popovers, menus, tooltips, toasts, tab indicator |
| `--hl-duration-slow`   | `280ms`                      | Modal and drawer entry                           |
| `--hl-ease-standard`   | `cubic-bezier(0.2, 0, 0, 1)` | Most transitions                                 |
| `--hl-ease-emphasized` | `cubic-bezier(0.3, 0, 0, 1)` | Drawer slide, larger movements                   |

Retune the whole library by overriding the tokens:

```css
:root {
  --hl-duration-base: 240ms;
  --hl-ease-standard: ease-out;
}
```

Set every duration to `0ms` to disable motion for everyone, not only users who
asked for it.

## Entry transitions with `@starting-style`

Overlays live in the top layer (`<dialog>` and `[popover]`), which means they
switch between `display: none` and rendered. Hydrateless animates that switch
with `@starting-style` and `transition-behavior: allow-discrete`, so the entry
and exit are declarative:

```css
.hl-popover {
  opacity: 1;
  translate: 0 0;
  transition:
    opacity var(--hl-duration-base) var(--hl-ease-standard),
    translate var(--hl-duration-base) var(--hl-ease-standard),
    display var(--hl-duration-base) allow-discrete,
    overlay var(--hl-duration-base) allow-discrete;

  @starting-style {
    opacity: 0;
    translate: 0 -0.25rem;
  }
}

.hl-popover:not(:popover-open) {
  opacity: 0;
  translate: 0 -0.25rem;
}
```

- `@starting-style` supplies the "from" values for the first frame after the
  element becomes rendered.
- Transitioning `display` and `overlay` with `allow-discrete` keeps the element
  visible (and in the top layer) until the exit transition finishes.

Which components animate, and how:

| Component         | Entry                                            |
| ----------------- | ------------------------------------------------ |
| Popover, Dropdown | Fade plus a small translate away from the anchor |
| Menu submenus     | Fade plus a small translate                      |
| Tooltip           | Fade                                             |
| Modal             | Fade plus a slight scale up                      |
| Drawer            | Slide in from its `data-hl-side` edge            |
| Toast             | Fade plus a translate up from the bottom         |
| Backdrops         | Fade of `::backdrop`                             |

Because they are ordinary transitions, you can restyle them by overriding the
same properties in an un-layered rule. To change the drawer to a fade:

```css
/* Neutralize the slide in every state; the opacity transition remains. */
.hl-drawer,
.hl-drawer:not([open]) {
  translate: 0 0;
}

.hl-drawer {
  @starting-style {
    translate: 0 0;
  }
}
```

## Reduced motion

Under `@media (prefers-reduced-motion: reduce)`:

1. **Every duration token is zeroed.** `--hl-duration-fast`, `-base`, and
   `-slow` become `0ms`, so all transitions (including `@starting-style`
   entries) complete instantly. Surfaces still appear and disappear; they just
   don't travel.
2. **Looping animations stop.** The spinner renders a static arc, a button in
   `data-hl-loading` shows its spinner without rotating, and an indeterminate
   progress bar shows a static segment instead of sweeping.
3. **The skeleton shimmer is disabled.**

No opacity or layout changes are removed, so state remains visible; only the
movement goes away. This follows the WCAG 2.3.3 guidance that interaction-
triggered motion be disableable.

If your own components read the duration tokens, they inherit the policy for
free:

```css
.my-card {
  transition: box-shadow var(--hl-duration-fast) var(--hl-ease-standard);
}
```

## Testing

Emulate the preference in Chromium DevTools (**Rendering > Emulate CSS media
feature prefers-reduced-motion**) or in Playwright with
`page.emulateMedia({ reducedMotion: 'reduce' })`. Under that emulation the
spinner's computed `animation-name` is `none` and every `--hl-duration-*` token
resolves to `0ms`.

# Dark Mode

Hydrateless supports dark mode out of the box. There's nothing to configure for
the common case, and there is no separate dark stylesheet: every semantic color
token is a `light-dark()` pair, and the browser picks the right side based on
the element's `color-scheme`.

## How it works

`tokens/semantic.css` declares the color scheme alongside the semantic color
tokens:

```css
:root {
  color-scheme: light dark;
}

[data-hl-theme='light'] {
  color-scheme: light;
}

[data-hl-theme='dark'] {
  color-scheme: dark;
}
```

And defines each color once:

```css
:root {
  --hl-bg: light-dark(var(--hl-gray-50), var(--hl-gray-950));
  --hl-fg: light-dark(var(--hl-gray-900), var(--hl-gray-50));
  /* ... */
}
```

With `color-scheme: light dark`, the browser resolves `light-dark()` from the
user's operating-system preference. Native form controls, scrollbars, and the
default canvas color follow the same setting, so the whole page agrees.

## Automatic (OS preference)

Import the CSS and you're done:

```css
@import 'hydrateless';
```

Pages follow `prefers-color-scheme` with no extra markup.

## Manual override

To let users pick a theme regardless of their OS setting, set `data-hl-theme` on
the root element:

```html
<html data-hl-theme="dark">
  ...
</html>
```

`data-hl-theme` accepts `light` or `dark`. It works by narrowing `color-scheme`
to a single value, which forces every `light-dark()` token to that side. Remove
the attribute to fall back to automatic behavior.

Because the override is just `color-scheme`, you can also scope it. Setting
`data-hl-theme="dark"` on a sidebar makes only the sidebar dark:

```html
<aside data-hl-theme="dark">
  <!-- Every component inside renders with the dark token values. -->
</aside>
```

## Toggling at runtime

A theme toggle is a single attribute flip:

```js
function setTheme(theme) {
  // 'light' | 'dark' | undefined (follow the OS)
  if (theme) document.documentElement.dataset.hlTheme = theme;
  else delete document.documentElement.dataset.hlTheme;
}
```

To persist the choice and avoid a flash of the wrong theme, apply it before
first paint:

```html
<script>
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.dataset.hlTheme = saved;
</script>
```

```js
function saveTheme(theme) {
  setTheme(theme);
  if (theme) localStorage.setItem('theme', theme);
  else localStorage.removeItem('theme');
}
```

## Customizing dark colors

There is no dark block to override. Redefine the token with both values:

```css
:root {
  --hl-bg: light-dark(hsl(0deg 0% 100%), hsl(222deg 47% 11%));
  --hl-primary: light-dark(hsl(221deg 80% 50%), hsl(221deg 80% 65%));
}
```

If you only want to change the dark side, keep the light value by referencing
the palette:

```css
:root {
  --hl-surface: light-dark(hsl(0deg 0% 100%), var(--hl-gray-800));
}
```

Shadows and the dialog scrim are also `light-dark()` pairs (`--hl-shadow-*`,
`--hl-scrim`), so dark surfaces get deeper shadows automatically.

## Forced colors

Under Windows High Contrast (`forced-colors: active`) the semantic tokens map to
system colors (`CanvasText`, `Highlight`, `Canvas`), and components keep visible
borders and use `Highlight` for selected states. See
[Accessibility](./accessibility#forced-colors).

## Testing both schemes

In Chromium DevTools, use **Rendering > Emulate CSS media feature
prefers-color-scheme** to flip the OS preference without touching your system
settings. The end-to-end suite does the same with Playwright's
`emulateMedia({ colorScheme: 'dark' })`.

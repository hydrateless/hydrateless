# Dark Mode

Hydrateless supports dark mode out of the box. There is nothing to configure
for the common case.

## Automatic (OS preference)

By default, Hydrateless follows the user's operating system setting through the
`prefers-color-scheme` media query. Simply importing the CSS is enough:

```css
@import 'hydrateless';
```

The root also sets `color-scheme: light dark`, so native form controls and
scrollbars match the active theme.

## Manual override

To let users pick a theme regardless of their OS setting, set `data-theme` on
the root element:

```html
<html data-theme="dark">
  …
</html>
```

`data-theme` accepts `light` or `dark`. When present, it takes priority over the
OS preference. Remove the attribute to fall back to automatic behavior.

## Toggling at runtime

A theme toggle is just a single attribute flip:

```js
function toggleTheme() {
  const root = document.documentElement;
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
}
```

To persist the choice across visits, store it and apply it before first paint:

```html
<script>
  // Run as early as possible to avoid a flash of the wrong theme.
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.dataset.theme = saved;
</script>
```

```js
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
}
```

## Customizing dark colors

Dark mode values are regular tokens. Override them for the dark theme like so:

```css
[data-theme='dark'] {
  --hl-color-bg: hsl(222 47% 11%);
  --hl-color-fg: hsl(210 40% 98%);
  --hl-color-accent: hsl(221 80% 65%);
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Mirror the same overrides for the automatic case. */
    --hl-color-accent: hsl(221 80% 65%);
  }
}
```

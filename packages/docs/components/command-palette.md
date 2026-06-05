# Command Palette

A filterable list of commands with keyboard navigation and an empty state.
Render it inline, or drop it inside a `<dialog>` and open it with a hotkey.

## Demo

<div class="hl-demo">
<div data-hl-command>
  <input class="hl-input" data-hl-command-input placeholder="Type a command…" />
  <div data-hl-command-empty hidden>No results found.</div>
  <div data-hl-command-list role="listbox">
    <div data-hl-command-group>
      <div class="hl-command-group-label">Actions</div>
      <div role="option" data-hl-value="new" data-hl-keywords="create">New File</div>
      <div role="option" data-hl-value="open">Open…</div>
    </div>
    <div data-hl-command-group>
      <div class="hl-command-group-label">Navigation</div>
      <div role="option" data-hl-value="settings" data-hl-keywords="preferences">Go to Settings</div>
      <div role="option" data-hl-value="docs">Open Docs</div>
    </div>
  </div>
</div>
</div>

## HTML

```html
<div data-hl-command>
  <input class="hl-input" data-hl-command-input placeholder="Type a command…" />
  <div data-hl-command-empty hidden>No results found.</div>
  <div data-hl-command-list role="listbox">
    <div data-hl-command-group>
      <div class="hl-command-group-label">Actions</div>
      <div role="option" data-hl-value="new" data-hl-keywords="create">New File</div>
      <div role="option" data-hl-value="open">Open…</div>
    </div>
  </div>
</div>
```

To open it as a modal with `Cmd`/`Ctrl`+`K`, wrap it in a `<dialog>` and add
`data-hl-command-hotkey` to the root:

```html
<dialog class="hl-modal">
  <div data-hl-command data-hl-command-hotkey="k">
    <input class="hl-input" data-hl-command-input placeholder="Type a command…" />
    <div data-hl-command-list role="listbox">
      <div role="option" data-hl-value="new">New File</div>
    </div>
  </div>
</dialog>
```

- **CSS**: `hydrateless/command.css`
- **JS**: `enhanceCommand(container)`
- **Events**: emits a cancelable `hl:command` `CustomEvent` with `{ value, item }`
  when a command runs; call `preventDefault()` to handle navigation yourself.
- **Keyboard**: `↑`/`↓` and `Home`/`End` navigate, `Enter` runs the active
  command, `Esc` closes the dialog, and typing filters (matching text plus
  `data-hl-keywords`).
- **ARIA**: the input is a `role="combobox"` controlling the `role="listbox"`;
  the active option is tracked with `aria-activedescendant`.

## Frameworks

::: code-group

```tsx [React]
import { Command } from '@hydrateless/react';

<Command
  hotkey="k"
  items={[
    { value: 'new', label: 'New File', keywords: 'create', group: 'Actions', onSelect: () => {} },
    { value: 'open', label: 'Open…', group: 'Actions', onSelect: () => {} },
  ]}
  onSelect={(value) => console.log(value)}
/>;
```

```vue [Vue]
<template>
  <div v-hl-command data-hl-command>
    <input class="hl-input" data-hl-command-input placeholder="Type a command…" />
    <div data-hl-command-list role="listbox">
      <div role="option" data-hl-value="new" data-hl-keywords="create">New File</div>
      <div role="option" data-hl-value="open">Open…</div>
    </div>
  </div>
</template>
```

```svelte [Svelte]
<script>
  import { command } from '@hydrateless/svelte';
</script>

<div use:command data-hl-command>
  <input class="hl-input" data-hl-command-input placeholder="Type a command…" />
  <div data-hl-command-list role="listbox">
    <div role="option" data-hl-value="new" data-hl-keywords="create">New File</div>
    <div role="option" data-hl-value="open">Open…</div>
  </div>
</div>
```

:::

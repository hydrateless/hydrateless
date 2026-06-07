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
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from '@hydrateless/react';

<Command onSelect={(value) => console.log(value)}>
  <CommandInput placeholder="Type a command…" />
  <CommandEmpty>No results found.</CommandEmpty>
  <CommandList>
    <CommandGroup label="Actions">
      <CommandItem value="new" keywords="create">
        New File
      </CommandItem>
      <CommandItem value="open">Open…</CommandItem>
    </CommandGroup>
    <CommandGroup label="Navigation">
      <CommandItem value="settings" keywords="preferences">
        Go to Settings
      </CommandItem>
      <CommandItem value="docs">Open Docs</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>;
```

```vue [Vue]
<script setup>
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from '@hydrateless/vue';
</script>

<template>
  <Command @select="(value) => console.log(value)">
    <CommandInput placeholder="Type a command…" />
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandList>
      <CommandGroup>
        <template #label>Actions</template>
        <CommandItem value="new" keywords="create">New File</CommandItem>
        <CommandItem value="open">Open…</CommandItem>
      </CommandGroup>
      <CommandGroup>
        <template #label>Navigation</template>
        <CommandItem value="settings" keywords="preferences">Go to Settings</CommandItem>
        <CommandItem value="docs">Open Docs</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>
```

```svelte [Svelte]
<script>
  import {
    Command,
    CommandInput,
    CommandList,
    CommandGroup,
    CommandItem,
    CommandEmpty,
  } from '@hydrateless/svelte';
</script>

<Command onSelect={(value) => console.log(value)}>
  <CommandInput placeholder="Type a command…" />
  <CommandEmpty>No results found.</CommandEmpty>
  <CommandList>
    <CommandGroup>
      {#snippet label()}Actions{/snippet}
      <CommandItem value="new" keywords="create">New File</CommandItem>
      <CommandItem value="open">Open…</CommandItem>
    </CommandGroup>
    <CommandGroup>
      {#snippet label()}Navigation{/snippet}
      <CommandItem value="settings" keywords="preferences">Go to Settings</CommandItem>
      <CommandItem value="docs">Open Docs</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

:::

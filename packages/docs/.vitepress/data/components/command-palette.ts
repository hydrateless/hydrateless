import type { ComponentDoc } from '../types';

export const commandPalette: ComponentDoc = {
  slug: 'command-palette',
  name: 'Command Palette',
  category: 'Actions & Overlays',
  importName: 'Command',
  summary: 'A filterable list of commands with keyboard navigation.',
  description:
    'A filterable list of commands with keyboard navigation and an empty state. Render it inline, or drop it inside a `<dialog>` and open it with a hotkey.',
  status: 'stable',
  cssOnly: false,
  native: '<input> + listbox',
  cssFile: 'command.css',
  enhancer: {
    fn: 'enhanceCommand',
    subpath: '@hydrateless/enhancers/command',
    signature: 'enhanceCommand(container, { hotkey, defaultValue, onValueChange, onCommand })',
  },
  demos: [
    {
      id: 'default',
      title: 'Command palette',
      description: 'Type to filter, navigate with `↑`/`↓`, and run with `Enter`.',
      layout: 'fill',
      render: () =>
        `<div data-hl-command style="max-width:22rem">
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
</div>`,
      code: {
        react: () =>
          `import {\n  Command,\n  CommandInput,\n  CommandList,\n  CommandGroup,\n  CommandItem,\n  CommandEmpty,\n} from '@hydrateless/react';\n\n<Command onSelect={(value) => console.log(value)}>\n  <CommandInput placeholder="Type a command…" />\n  <CommandEmpty>No results found.</CommandEmpty>\n  <CommandList>\n    <CommandGroup label="Actions">\n      <CommandItem value="new" keywords="create">New File</CommandItem>\n      <CommandItem value="open">Open…</CommandItem>\n    </CommandGroup>\n  </CommandList>\n</Command>`,
        vue: () =>
          `<script setup>\nimport {\n  Command,\n  CommandInput,\n  CommandList,\n  CommandGroup,\n  CommandItem,\n  CommandEmpty,\n} from '@hydrateless/vue';\n</script>\n\n<template>\n  <Command @select="(value) => console.log(value)">\n    <CommandInput placeholder="Type a command…" />\n    <CommandEmpty>No results found.</CommandEmpty>\n    <CommandList>\n      <CommandGroup>\n        <template #label>Actions</template>\n        <CommandItem value="new" keywords="create">New File</CommandItem>\n        <CommandItem value="open">Open…</CommandItem>\n      </CommandGroup>\n    </CommandList>\n  </Command>\n</template>`,
        svelte: () =>
          `<script>\n  import {\n    Command,\n    CommandInput,\n    CommandList,\n    CommandGroup,\n    CommandItem,\n    CommandEmpty,\n  } from '@hydrateless/svelte';\n</script>\n\n<Command onSelect={(value) => console.log(value)}>\n  <CommandInput placeholder="Type a command…" />\n  <CommandEmpty>No results found.</CommandEmpty>\n  <CommandList>\n    <CommandGroup>\n      {#snippet label()}Actions{/snippet}\n      <CommandItem value="new" keywords="create">New File</CommandItem>\n      <CommandItem value="open">Open…</CommandItem>\n    </CommandGroup>\n  </CommandList>\n</Command>`,
      },
    },
  ],
  props: [
    {
      name: 'onSelect',
      type: '(value: string) => void',
      description: 'Fires when a command runs.',
    },
    {
      name: 'hotkey',
      type: 'string',
      description: 'Key that opens the palette when wrapped in a dialog, e.g. `"k"`.',
    },
  ],
  events: [
    {
      name: 'hl:command',
      detail: '{ value: string; item: HTMLElement }',
      description:
        'Cancelable CustomEvent when a command runs; `preventDefault()` to handle navigation yourself.',
    },
    {
      name: 'hl:change',
      detail: '{ value: string }',
      description: 'Fires when the filter query changes (also the `onValueChange` callback).',
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Palette background.' },
    { name: '--hl-border', description: 'Palette border.' },
    { name: '--hl-primary', description: 'Active item highlight.' },
  ],
  a11y: [
    'The input is `role="combobox"` controlling the `role="listbox"`, tracked with `aria-activedescendant`.',
    'Filtering matches visible text plus any `data-hl-keywords`.',
  ],
  related: ['combobox', 'modal', 'dropdown'],
};

import type { ComponentDoc } from '../types';

export const commandPalette: ComponentDoc = {
  slug: 'command-palette',
  name: 'Command Palette',
  category: 'Actions & Overlays',
  importName: 'Command',
  summary: 'A filterable list of commands with keyboard navigation.',
  description:
    "A filterable list of commands with keyboard navigation, group hiding, and an empty state. Render it inline, or drop it inside a `<dialog>` and open it with a hotkey. Without JavaScript the full list simply renders; the root is marked `data-hl-ready` once filtering is live. The filter query is the component's value.",
  status: 'stable',
  cssOnly: false,
  native: '<input> + listbox',
  cssFile: 'command-palette.css',
  enhancer: {
    fn: 'enhanceCommand',
    subpath: '@hydrateless/enhancers/command',
    signature: 'enhanceCommand(container, { hotkey, defaultValue, onValueChange, onCommand })',
  },
  demos: [
    {
      id: 'default',
      title: 'Command palette',
      description:
        'Type to filter, navigate with `Up`/`Down` (and `PageUp`/`PageDown` in steps of ten), and run with `Enter`. `Esc` clears a non-empty query first, then closes the hosting `<dialog>`.',
      layout: 'fill',
      render: () =>
        `<div data-hl-command class="hl-command" style="max-width:22rem">
  <input class="hl-input hl-command-input" data-hl-command-input placeholder="Type a command" aria-label="Command" />
  <div data-hl-command-empty class="hl-command-empty" hidden>No results found.</div>
  <div data-hl-command-list role="listbox" aria-label="Commands">
    <div data-hl-command-group role="group" aria-labelledby="demo-cmd-actions">
      <div class="hl-command-group-label" id="demo-cmd-actions">Actions</div>
      <div role="option" data-hl-value="new" data-hl-keywords="create">New File</div>
      <div role="option" data-hl-value="open">Open</div>
    </div>
    <div data-hl-command-group role="group" aria-labelledby="demo-cmd-nav">
      <div class="hl-command-group-label" id="demo-cmd-nav">Navigation</div>
      <div role="option" data-hl-value="settings" data-hl-keywords="preferences">Go to Settings</div>
      <div role="option" data-hl-value="docs">Open Docs</div>
    </div>
  </div>
</div>`,
      code: {
        react: () =>
          `import {\n  Command,\n  CommandInput,\n  CommandList,\n  CommandGroup,\n  CommandItem,\n  CommandEmpty,\n} from '@hydrateless/react';\n\n<Command hotkey="k" onCommand={(value) => run(value)} onQueryChange={(query) => track(query)}>\n  <CommandInput placeholder="Type a command" />\n  <CommandEmpty>No results found.</CommandEmpty>\n  <CommandList>\n    <CommandGroup label="Actions">\n      <CommandItem value="new" keywords="create">New File</CommandItem>\n      <CommandItem value="open">Open</CommandItem>\n    </CommandGroup>\n  </CommandList>\n</Command>`,
        vue: () =>
          `<script setup>\nimport { ref } from 'vue';\nimport {\n  Command,\n  CommandInput,\n  CommandList,\n  CommandGroup,\n  CommandItem,\n  CommandEmpty,\n} from '@hydrateless/vue';\nconst query = ref('');\n</script>\n\n<template>\n  <Command v-model:query="query" hotkey="k" @command="(value) => run(value)">\n    <CommandInput placeholder="Type a command" />\n    <CommandEmpty>No results found.</CommandEmpty>\n    <CommandList>\n      <CommandGroup label="Actions">\n        <CommandItem value="new" keywords="create">New File</CommandItem>\n        <CommandItem value="open">Open</CommandItem>\n      </CommandGroup>\n    </CommandList>\n  </Command>\n</template>`,
        svelte: () =>
          `<script>\n  import {\n    Command,\n    CommandInput,\n    CommandList,\n    CommandGroup,\n    CommandItem,\n    CommandEmpty,\n  } from '@hydrateless/svelte';\n  let query = $state('');\n</script>\n\n<Command bind:query hotkey="k" onCommand={(value) => run(value)}>\n  <CommandInput placeholder="Type a command" />\n  <CommandEmpty>No results found.</CommandEmpty>\n  <CommandList>\n    <CommandGroup>\n      {#snippet label()}Actions{/snippet}\n      <CommandItem value="new" keywords="create">New File</CommandItem>\n      <CommandItem value="open">Open</CommandItem>\n    </CommandGroup>\n  </CommandList>\n</Command>`,
      },
    },
  ],
  props: [
    {
      name: 'query',
      type: 'string',
      description:
        'Controlled filter query; pair with `onQueryChange` (Vue: `v-model:query`, Svelte: `bind:query`).',
    },
    {
      name: 'defaultQuery',
      type: 'string',
      default: `''`,
      description: 'Uncontrolled initial query.',
    },
    {
      name: 'onQueryChange',
      type: '(query: string) => void',
      description: 'Called with the filter query after every change.',
    },
    {
      name: 'onCommand',
      type: '(value: string, item: HTMLElement) => void',
      description: 'Called when a command runs (Vue: the `command` emit).',
    },
    {
      name: 'hotkey',
      type: 'string',
      description: 'Key that, with Cmd/Ctrl, opens the hosting `<dialog>`, e.g. `"k"`.',
    },
    {
      name: 'CommandItem.value',
      type: 'string',
      required: true,
      description: 'Value reported by `onCommand`; rendered as `data-hl-value`.',
    },
    {
      name: 'CommandGroup.label',
      type: 'string',
      description:
        'Heading shown above the group. In Vue it is a prop or the `label` slot; in Svelte it is the `label` snippet.',
    },
    {
      name: 'CommandItem.keywords',
      type: 'string',
      description: 'Extra terms the filter matches against, rendered as `data-hl-keywords`.',
    },
  ],
  events: [
    {
      name: 'hl:command',
      detail: '{ value: string, item: HTMLElement }',
      description:
        'Cancelable CustomEvent when a command runs; `preventDefault()` to handle navigation yourself.',
    },
    {
      name: 'hl:change',
      detail: '{ value: string }',
      description:
        'Fires when the filter query changes (also the `onValueChange` enhancer callback).',
    },
  ],
  tokens: [
    { name: '--hl-surface', description: 'Palette background.' },
    { name: '--hl-border', description: 'Palette border.' },
    { name: '--hl-surface-2', description: 'Active item highlight.' },
    { name: '--hl-focus-ring', description: 'Focus ring on the input.' },
  ],
  a11y: [
    'The input is `role="combobox"` controlling the `role="listbox"`, tracked with `aria-activedescendant`.',
    'Filtering matches visible text plus any `data-hl-keywords`; groups with no visible options are hidden.',
    '`Esc` clears the query before it closes the dialog, so a mistyped search never dismisses the palette by surprise.',
  ],
  related: ['combobox', 'modal', 'dropdown'],
};

# @hydrateless/svelte

Svelte 5 bindings for [Hydrateless](https://github.com/hydrateless/hydrateless):
components built on runes and attachments that render the same semantic markup
as the CSS package and hand behavior to the framework-agnostic enhancers on the
client. Everything server-renders, and the enhancers are no-ops without a DOM.

## Install

```bash
npm install hydrateless @hydrateless/svelte
```

Import the CSS once (for example, in your root layout):

```ts
import 'hydrateless/hydrateless.css';
```

## Components

Interactive components are controlled or uncontrolled. Bind the primary state
(`bind:value`, `bind:open`, `bind:query`), seed it with `defaultValue`,
`defaultOpen`, or `defaultQuery`, and observe it through `onValueChange`,
`onOpenChange`, or `onQueryChange`. Every component forwards `class`, `id`, and
the rest of its attributes to its root element.

```svelte
<script lang="ts">
  import { Tabs, TabList, Tab, TabPanel, Modal, ModalBody } from '@hydrateless/svelte';

  let tab = $state('overview');
  let open = $state(false);
</script>

<Tabs bind:value={tab}>
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="install">Install</Tab>
  </TabList>
  <TabPanel>Zero runtime by default.</TabPanel>
  <TabPanel><code>npm i hydrateless</code></TabPanel>
</Tabs>

<button onclick={() => (open = true)}>Open</button>
<Modal bind:open>
  <ModalBody>Body content.</ModalBody>
</Modal>
```

Tabs, Accordion, and Disclosure render their selected or open state on the
server (`aria-selected`, `hidden`, `open`), so nothing flashes before the
enhancer hydrates.

### Dropdown

The menu is a native `popover` and the trigger carries a matching
`popovertarget`, so the menu opens before any script runs. Items can be plain
actions, checkboxes, or radios; group radios with `<DropdownGroup>`.

```svelte
<script lang="ts">
  import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownGroup,
    DropdownSeparator,
  } from '@hydrateless/svelte';
</script>

<Dropdown closeOnSelect={false} onSelect={(value, item, checked) => console.log(value, checked)}>
  <DropdownTrigger>View</DropdownTrigger>
  <DropdownMenu>
    <DropdownItem value="refresh">Refresh</DropdownItem>
    <DropdownSeparator />
    <DropdownGroup label="Density">
      <DropdownItem role="menuitemradio" value="compact" checked>Compact</DropdownItem>
      <DropdownItem role="menuitemradio" value="comfortable">Comfortable</DropdownItem>
    </DropdownGroup>
    <DropdownItem role="menuitemcheckbox" value="grid">Show grid</DropdownItem>
  </DropdownMenu>
</Dropdown>
```

### Menu

`<Menu>` is a menubar (or a vertical menu) whose value is the open submenu:
`bind:value` gives you a `string | null`. Nest items in `<MenuSubmenu>`.

```svelte
<Menu bind:value={openSubmenu} onSelect={(value) => navigate(value)}>
  <MenuItem href="/">Home</MenuItem>
  <MenuSubmenu label="Resources" value="resources">
    <MenuItem href="/docs">Docs</MenuItem>
    <MenuItem value="blog">Blog</MenuItem>
  </MenuSubmenu>
</Menu>
```

### Command

`<Command>` binds its filter text as `query`; `onCommand(value, item)` fires
when a command runs. Give it a `hotkey` to open its hosting `<dialog>` with
Cmd/Ctrl plus that key.

```svelte
<Command bind:query hotkey="k" onCommand={(value) => run(value)}>
  <CommandInput placeholder="Type a command" />
  <CommandList>
    <CommandItem value="new-file">New file</CommandItem>
  </CommandList>
  <CommandEmpty />
</Command>
```

### Forms

Wrap a control in `<Field>` and it picks up the field's `id`,
`aria-describedby`, `aria-invalid`, and `required` automatically. This applies
to `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Slider`, and
`ComboboxInput`; outside a Field they render as plain controls.

```svelte
<Field invalid={!valid} required>
  <FieldLabel>Email</FieldLabel>
  <Input type="email" bind:value={email} />
  <FieldHelp>We never share it.</FieldHelp>
  <FieldError
    >{#if !valid}Enter a valid email.{/if}</FieldError
  >
</Field>
```

For a custom control, call `useField()` during initialization. It returns
`{ id, describedBy, invalid, required }` inside a Field and `null` outside one;
the properties are getters, so they stay reactive in your template.

```svelte
<script lang="ts">
  import { useField } from '@hydrateless/svelte';

  const field = useField();
</script>

<input
  id={field?.id}
  required={field?.required || undefined}
  aria-describedby={field?.describedBy}
  aria-invalid={field?.invalid || undefined}
/>
```

## Toasts

Mount a `<ToastRegion>` where toasts should appear (it's enhanced on mount),
then call `useToast()` from anywhere. Without a region, the first `show`
appends one to `<body>`.

```svelte
<script lang="ts">
  import { ToastRegion, useToast } from '@hydrateless/svelte';

  const toast = useToast();
</script>

<button onclick={() => toast.show('Saved', { intent: 'success', duration: 4000 })}>Save</button>
<ToastRegion />
```

`show(message, { duration, intent })` returns the toast element; pass it to
`dismiss(el)` to remove it early. `intent` is one of `info`, `success`,
`warning`, or `danger` (`danger` toasts are announced assertively).

## useEnhancer

Every component is built on one attachment factory, and it's exported so a
custom wrapper behaves exactly like the shipped ones. Pass an enhancer and a
function returning its options; the returned `attach` runs the enhancer when the
element mounts and destroys it when the element leaves or the options change.
`api` is the enhancer's imperative handle (or `null` while detached).

```svelte
<script lang="ts">
  import { enhanceTabs } from '@hydrateless/enhancers';
  import { useEnhancer } from '@hydrateless/svelte';

  let { activation = 'manual' } = $props();
  const tabs = useEnhancer(enhanceTabs, () => ({ activation }));
</script>

<button onclick={() => tabs.api?.setValue('install')}>Jump to Install</button>
<div data-hl-tabs {@attach tabs.attach}>...</div>
```

Reactive state read inside the options function re-runs the enhancer; wrap
seed values (like a bound `value` passed as `defaultValue`) in `untrack` to
keep them from doing so.

## Changes from 0.x actions

- The `use:` actions (`tabs`, `dropdown`, and so on) are gone; use
  `useEnhancer` or the components.
- `fieldBindings()` and `getFieldContext()` are replaced by `useField()`.
- `Menu` exposes `value`/`defaultValue`/`onValueChange` (the open submenu)
  instead of `open`/`onOpenChange`; submenus are `<MenuSubmenu>` instead of a
  `submenu` snippet.
- `Command` exposes `query`/`defaultQuery`/`onQueryChange` and `onCommand`
  instead of `onSelect`.
- `Dropdown` adds `onSelect(value, item, checked)`, `closeOnSelect`, and
  `placement`; `DropdownItem` adds `value`, `disabled`, `role`, and `checked`;
  `DropdownGroup` is new.
- `Drawer` `side` is `'start' | 'end'` (default `end`) and renders
  `data-hl-side`.
- `Tooltip` takes `content` (text or snippet), `placement`, `showDelay`,
  `hideDelay`, and `bind:open`.
- Toast options use `intent` instead of `variant`.
- `Skeleton` takes `shape` instead of `variant`.
- `AccordionItem` drops `defaultOpen`; open items come from the Accordion's
  `value`/`defaultValue`.
- `SegmentedControl` defaults to its first option when uncontrolled.
- `Table` is new.

## License

[MIT](../../LICENSE)

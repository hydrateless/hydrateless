# Svelte

`@hydrateless/svelte` ships first-class Svelte 5 components for every
Hydrateless primitive. Components render the same semantic markup as the core
CSS, so they look right before hydration, and the enhancer that adds keyboard
navigation, ARIA wiring, and focus management is attached when the root mounts
and disposed when it's removed.

## Install

```bash
npm install hydrateless @hydrateless/svelte
```

Requires **Svelte 5 or later**. The components are written with runes
(`$props`, `$state`, `$bindable`) and use
[attachments](https://svelte.dev/docs/svelte/@attach) to bind enhancers. Import
the CSS once at your app entry:

```js
import 'hydrateless/hydrateless.css';
```

## Components

Composable primitives use a **compound API**: a parent plus named parts you
arrange yourself.

```svelte
<script>
  import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/svelte';
</script>

<Tabs defaultValue="overview">
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="install">Install</Tab>
  </TabList>
  <TabPanel>Zero runtime by default.</TabPanel>
  <TabPanel>npm install hydrateless</TabPanel>
</Tabs>
```

`Tabs` renders `role="tablist"`, `aria-selected`, `tabindex`, and `hidden` in
its template, so server output is already correct and there's no flash when
the enhancer attaches.

### Bindable and uncontrolled state

Every stateful component works both ways:

- **Uncontrolled**: pass `defaultValue` (or `defaultOpen`, `defaultQuery`) and
  let the component own its state.
- **Controlled**: use `bind:value`, `bind:open`, or `bind:query`. The props are
  declared with `$bindable()`, and the matching `onValueChange`,
  `onOpenChange`, or `onQueryChange` callback fires as well. Dismissals the
  user triggers (Escape, backdrop click, outside click) flow back into your
  bound state.

```svelte
<script>
  import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/svelte';

  let tab = $state('overview');
</script>

<Tabs bind:value={tab}>
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="install">Install</Tab>
  </TabList>
  <TabPanel>...</TabPanel>
  <TabPanel>...</TabPanel>
</Tabs>
```

```svelte
<script>
  import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@hydrateless/svelte';

  let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Delete</Button>

<Modal bind:open>
  <ModalHeader><h2>Delete project?</h2></ModalHeader>
  <ModalBody>This can't be undone.</ModalBody>
  <ModalFooter>
    <Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
    <Button intent="danger">Delete</Button>
  </ModalFooter>
</Modal>
```

Which binding and callbacks each component uses:

| Component          | Bindable                                                                                                      | Other props and callbacks                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Tabs`             | `bind:value` (string), `defaultValue`                                                                         | `onValueChange`, `orientation`, `activation`                                    |
| `Accordion`        | `bind:value` (string[]), `defaultValue`                                                                       | `onValueChange`, `allowMultiple`                                                |
| `Disclosure`       | `bind:open`, `defaultOpen`                                                                                    | `onOpenChange`, `title` or the `summary` snippet, `name`                        |
| `Menu`             | `bind:value` (open submenu or `null`), `defaultValue`                                                         | `onValueChange`, `onSelect(value, item, checked?)`, `orientation`               |
| `Dropdown`         | `bind:open`, `defaultOpen`                                                                                    | `onOpenChange`, `onSelect(value, item, checked?)`, `closeOnSelect`, `placement` |
| `Modal`, `Drawer`  | `bind:open`, `defaultOpen`                                                                                    | `onOpenChange`, `closeOnBackdrop`; Drawer `side="start" \| "end"`               |
| `Popover`          | `bind:open`, `defaultOpen`                                                                                    | `onOpenChange`, `placement`, `hover`                                            |
| `Tooltip`          | `bind:open`                                                                                                   | `content`, `onOpenChange`, `placement`, `showDelay`, `hideDelay`                |
| `Combobox`         | `bind:value`, `bind:open`                                                                                     | `onValueChange`, `onOpenChange`, `filter`, `autoHighlight`                      |
| `Command`          | `bind:query`, `defaultQuery`                                                                                  | `onQueryChange`, `onCommand(value, item)`, `hotkey`                             |
| `SegmentedControl` | `bind:value` (defaults to the first option)                                                                   | `onValueChange`, `options`, `size`                                              |
| Form controls      | `bind:value` on `Input`, `Textarea`, `Select`, `Slider`, `RadioGroup`; `bind:checked` on `Checkbox`, `Switch` |                                                                                 |

### Dropdown with checkable items

`DropdownItem` accepts `role="menuitemcheckbox" | "menuitemradio"` and
`checked`; `DropdownGroup` wraps a labeled `role="group"`. The trigger renders
`popovertarget` and the menu renders `popover`, so the menu opens before
JavaScript loads.

```svelte
<script>
  import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownGroup,
    DropdownItem,
    DropdownSeparator,
  } from '@hydrateless/svelte';
</script>

<Dropdown onSelect={(value, item, checked) => console.log(value, checked)}>
  <DropdownTrigger>View</DropdownTrigger>
  <DropdownMenu>
    <DropdownGroup label="Show">
      <DropdownItem value="grid" role="menuitemradio" checked>Grid</DropdownItem>
      <DropdownItem value="list" role="menuitemradio">List</DropdownItem>
    </DropdownGroup>
    <DropdownSeparator />
    <DropdownItem value="hidden" role="menuitemcheckbox">Show hidden files</DropdownItem>
    <DropdownItem value="reset" disabled>Reset view</DropdownItem>
  </DropdownMenu>
</Dropdown>
```

### Available components

| Group        | Components                                                                                                                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Disclosure   | `Accordion`, `AccordionItem`, `Disclosure`, `Tabs`, `TabList`, `Tab`, `TabPanel`                                                                                                                                |
| Overlays     | `Dropdown` (+ `DropdownTrigger`, `DropdownMenu`, `DropdownGroup`, `DropdownItem`, `DropdownSeparator`), `Menu`, `MenuItem`, `MenuSubmenu`, `Modal`, `Drawer` (+ `Header`/`Body`/`Footer`), `Popover`, `Tooltip` |
| Forms        | `Field`, `FieldLabel`, `FieldHelp`, `FieldError`, `Fieldset`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Slider`, `RadioGroup`, `Radio`, `SegmentedControl`, `Button`                                |
| Combobox     | `Combobox`, `ComboboxInput`, `ComboboxList`, `ComboboxOption`                                                                                                                                                   |
| Command      | `Command`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`                                                                                                                         |
| Feedback     | `Alert`, `Badge`, `Progress`, `Spinner`, `Skeleton`, `ToastRegion`                                                                                                                                              |
| Data display | `Card` (+ `CardHeader`, `CardBody`, `CardFooter`, `CardTitle`, `CardDescription`), `Avatar`, `AvatarGroup`, `Kbd`, `Separator`, `Table`                                                                         |
| Navigation   | `Breadcrumb`, `BreadcrumbItem`, `Pagination`, `Toc`, `SkipLink`                                                                                                                                                 |

Every component forwards `class`, `id`, and rest attributes to its root
element. Ids are generated with `$props.id()` so they're stable across server
and client.

## Forms and `useField`

`Field` provides a shared id so `FieldLabel`, `FieldHelp`, and `FieldError`
wire `for` and `aria-describedby` for you. Pass `label`, `description`, and
`error` for the common layout (a non-empty `error` also marks the field
invalid), or compose the parts as children. The built-in controls read the
field context automatically, and work without it.

```svelte
<script>
  import { Field, Input } from '@hydrateless/svelte';

  let email = $state('');
  let error = $state('');
</script>

<Field label="Email" description="We never share it." {error} required>
  <Input type="email" name="email" bind:value={email} />
</Field>
```

For a custom control, `useField()` returns live bindings
(`{ id, describedBy, invalid, required }`) inside a `Field` and `null` outside
one. Call it during component initialization, like any context read:

```svelte
<script>
  import { useField } from '@hydrateless/svelte';

  const field = useField();
</script>

<input
  type="color"
  id={field?.id}
  aria-describedby={field?.describedBy}
  aria-invalid={field?.invalid || undefined}
  required={field?.required}
/>
```

See [Forms](/guide/forms) for validation states and native constraint
validation.

## Toasts and `useToast`

`useToast()` returns `{ show(message, { duration, intent }), dismiss(toast) }`
and works anywhere with no setup. The first `show()` creates a polite live
region at the end of `<body>`; render `<ToastRegion />` once if you want to
control where toasts appear.

```svelte
<script>
  import { ToastRegion, useToast } from '@hydrateless/svelte';

  const toast = useToast();
</script>

<button onclick={() => toast.show('Saved', { intent: 'success' })}>Save</button>
<ToastRegion />
```

`intent` is one of `info`, `success`, `warning`, or `danger`; `danger` toasts
are announced assertively.

## `useEnhancer`

The one low-level escape hatch. It returns an attachment for the element the
enhancer should treat as its container, plus the live imperative API:

```svelte
<script lang="ts">
  import { useEnhancer } from '@hydrateless/svelte';
  import { enhanceTabs } from '@hydrateless/enhancers';

  const tabs = useEnhancer(enhanceTabs, () => ({ activation: 'automatic' }));
  // tabs.api?.setValue('install')
</script>

<div data-hl-tabs {@attach tabs.attach}>
  <!-- your own tablist and tabpanel markup -->
</div>
```

Signature: `useEnhancer(enhancer, getOptions?)` returning `{ attach, api }`.

- The attachment runs the enhancer when the element mounts and destroys it
  when the element is removed.
- `getOptions` is read inside the attachment, so any reactive state it touches
  re-runs the enhancer (destroy, then enhance again with fresh options). Wrap
  values that should only seed the initial state, such as a bound `value`
  passed as `defaultValue`, in `untrack`.
- Options left `undefined` are dropped so the enhancer's own defaults apply.

All shipped components are built on this call, so custom wrappers behave
exactly like the built-in ones. See [Composing](/guide/composing#writing-your-own-enhancer)
for writing an enhancer to attach.

## TypeScript

The package ships with full type definitions generated by `svelte-package`.
Components are typed `.svelte` modules, `useEnhancer` returns
`UseEnhancer<Api>`, `useField` returns `FieldBindings | null`, and the enhancer
API types (`TabsApi`, `ModalApi`, `ToastApi`, `ToastIntent`) are re-exported.

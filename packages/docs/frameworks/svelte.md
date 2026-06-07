# Svelte

`@hydrateless/svelte` ships **first-class Svelte 5 components** for every
Hydrateless primitive, plus the low-level [actions](https://svelte.dev/docs/svelte-action)
and a toast store. Components render the same semantic markup as the core
library, and the interactive behavior (keyboard navigation, ARIA wiring, focus
traps) comes from the underlying enhancer, attached and disposed automatically
through the component lifecycle.

## Install

```bash
npm install hydrateless @hydrateless/svelte
```

Import the CSS once at your app entry:

```js
import 'hydrateless/hydrateless.css';
```

## Components

Composable primitives use a **compound API** — a parent plus named parts you
arrange yourself:

```svelte
<script>
  import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/svelte';
</script>

<Tabs>
  <TabList>
    <Tab>Overview</Tab>
    <Tab>Install</Tab>
  </TabList>
  <TabPanel>Zero runtime by default.</TabPanel>
  <TabPanel>npm install hydrateless</TabPanel>
</Tabs>
```

Controlled overlays take an `open` prop and an `onclose` callback:

```svelte
<script>
  import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@hydrateless/svelte';

  let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Open</Button>

<Modal {open} onclose={() => (open = false)}>
  <ModalHeader><h2>Confirm</h2></ModalHeader>
  <ModalBody>Are you sure?</ModalBody>
  <ModalFooter>
    <Button onclick={() => (open = false)}>Close</Button>
  </ModalFooter>
</Modal>
```

Form controls support `bind:` for two-way binding, and `<Field>` wires up
`label`, help, and error ids automatically:

```svelte
<script>
  import { Field, FieldLabel, FieldHelp, Input } from '@hydrateless/svelte';

  let email = $state('');
</script>

<Field>
  <FieldLabel>Email</FieldLabel>
  <Input type="email" bind:value={email} />
  <FieldHelp>We never share it.</FieldHelp>
</Field>
```

### Available components

| Group        | Components                                                                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Disclosure   | `Accordion`, `AccordionItem`, `Disclosure`, `Tabs`, `TabList`, `Tab`, `TabPanel`                                                                                                 |
| Overlays     | `Dropdown` (+ `DropdownTrigger`/`DropdownMenu`/`DropdownItem`/`DropdownSeparator`), `Menu`, `MenuItem`, `Modal`, `Drawer` (+ parts), `Popover`, `Tooltip`                        |
| Forms        | `Field`, `FieldLabel`, `FieldHelp`, `FieldError`, `Fieldset`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Slider`, `RadioGroup`, `Radio`, `SegmentedControl`, `Button` |
| Combobox     | `Combobox`, `ComboboxInput`, `ComboboxList`, `ComboboxOption`                                                                                                                    |
| Command      | `Command`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`                                                                                          |
| Feedback     | `Alert`, `Badge`, `Progress`, `Spinner`, `Skeleton`, `ToastRegion`                                                                                                               |
| Data display | `Card` (+ `CardHeader`/`CardBody`/`CardFooter`/`CardTitle`/`CardDescription`), `Avatar`, `AvatarGroup`, `Kbd`, `Separator`                                                       |
| Navigation   | `Breadcrumb`, `BreadcrumbItem`, `Pagination`, `Toc`, `SkipLink`                                                                                                                  |

Interactive components forward `data-hl-*` attributes and host the enhancer;
presentational primitives (`Alert`, `Badge`, `Card`, `Avatar`, …) render the
same markup as the core CSS and need no JavaScript.

## Low-level: actions

If you'd rather render your own markup, every enhancer is also exposed as a
Svelte action. Add `use:<name>` to the element you want enhanced:

```svelte
<script>
  import { tabs } from '@hydrateless/svelte';
</script>

<div use:tabs data-hl-tabs>
  <div role="tablist">
    <button role="tab">Overview</button>
    <button role="tab">Install</button>
  </div>
  <div role="tabpanel">Zero runtime by default.</div>
  <div role="tabpanel">npm install hydrateless</div>
</div>
```

The action runs the enhancer when the node mounts and calls its disposer in the
action's `destroy` lifecycle, so listeners are cleaned up automatically.

Available actions: `accordion`, `disclosure`, `tabs`, `dropdown`, `menu`,
`modal`, `drawer`, `popover`, `tooltip`, `combobox`, `command`, `toc`.

## Toasts

`createToast` returns the imperative toast API. Create it in `$effect` so it is
torn down automatically:

```svelte
<script>
  import { createToast } from '@hydrateless/svelte';

  let toast;
  $effect(() => {
    toast = createToast();
    return () => toast?.destroy();
  });
</script>

<button onclick={() => toast.show('Saved!')}>Save</button>
```

## TypeScript

The package ships with full type definitions, generated by `svelte-package`.
Components are typed `.svelte` modules, actions are typed `Action<HTMLElement>`,
and the `Disposer` type is re-exported.

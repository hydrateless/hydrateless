# React

`@hydrateless/react` wraps the Hydrateless enhancers in idiomatic React
components and hooks. Components render the same semantic markup as the core
library, and the enhancers are attached and disposed automatically across the
component lifecycle (including React 18 Strict Mode's double-invoke in
development).

## Install

```bash
npm install hydrateless @hydrateless/react
```

Import the CSS once at your app entry:

```js
import 'hydrateless/hydrateless.css';
```

## Components

Composable primitives use a **compound API**: a parent plus named parts you
arrange yourself. Behavior (keyboard navigation, ARIA wiring, focus traps) comes
from the underlying enhancer.

```tsx
import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/react';

export function Example() {
  return (
    <Tabs defaultValue="overview">
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="install">Install</Tab>
      </TabList>
      <TabPanel>
        <p>Zero runtime by default.</p>
      </TabPanel>
      <TabPanel>
        <p>npm install hydrateless</p>
      </TabPanel>
    </Tabs>
  );
}
```

### Controlled and uncontrolled state

Every interactive component supports both modes, mirroring native inputs:

- **Uncontrolled**: pass `defaultValue` (or `defaultOpen`) and let the
  enhancer manage state internally.
- **Controlled**: pass `value` + `onValueChange` (or `open` + `onOpenChange`)
  and own the state yourself.

```tsx
import { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/react';

export function Controlled() {
  const [tab, setTab] = useState('overview');
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="install">Install</Tab>
      </TabList>
      <TabPanel>…</TabPanel>
      <TabPanel>…</TabPanel>
    </Tabs>
  );
}
```

Overlays are controlled through `open` + `onOpenChange`, which also reports
Escape and backdrop dismissals:

```tsx
import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@hydrateless/react';

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalHeader>
          <h2>Confirm</h2>
        </ModalHeader>
        <ModalBody>
          <p>Are you sure?</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

### Available components

| Group      | Components                                                                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Disclosure | `Accordion`, `AccordionItem`, `Disclosure`, `Tabs`, `TabList`, `Tab`, `TabPanel`                                                                          |
| Overlays   | `Dropdown` (+ `DropdownTrigger`/`DropdownMenu`/`DropdownItem`/`DropdownSeparator`), `Menu`, `MenuItem`, `Modal`, `Drawer` (+ parts), `Popover`, `Tooltip` |
| Combobox   | `Combobox`, `ComboboxInput`, `ComboboxList`, `ComboboxOption`                                                                                             |
| Command    | `Command`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`                                                                   |
| Navigation | `Breadcrumb`, `BreadcrumbItem`, `Pagination`, `Toc`, `SkipLink`                                                                                           |

Compose menus and lists from their parts; for example a dropdown:

```tsx
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@hydrateless/react';

<Dropdown>
  <DropdownTrigger>Actions</DropdownTrigger>
  <DropdownMenu>
    <DropdownItem onSelect={edit}>Edit</DropdownItem>
    <DropdownItem onSelect={remove}>Delete</DropdownItem>
  </DropdownMenu>
</Dropdown>;
```

The package also ships styled **form controls** (`Button`, `Input`, `Textarea`,
`Select`, `Checkbox`, `Radio` / `RadioGroup`, `Field` with `FieldLabel` /
`FieldHelp` / `FieldError` and `useField()`, `Fieldset`, `Switch`, `Slider`,
`SegmentedControl`) and **presentational primitives** (`Alert`, `Badge`, `Card`
and parts, `Avatar` / `AvatarGroup`, `Progress`, `Spinner`, `Skeleton`, `Kbd`,
`Separator`). These render the same markup as the core CSS and need no enhancer.

## Toasts

`useToast()` works from any component, no provider required. The first
`show()` call creates a polite live region at the end of `<body>`; render
`<ToastRegion />` once if you want to control where toasts appear:

```tsx
import { ToastRegion, useToast } from '@hydrateless/react';

function SaveButton() {
  const toast = useToast();
  return <button onClick={() => toast.show('Saved!', { variant: 'success' })}>Save</button>;
}

export function App() {
  return (
    <>
      <SaveButton />
      <ToastRegion /> {/* optional */}
    </>
  );
}
```

## Hooks

Prefer to render your own markup? Use a hook to attach an enhancer to a ref.
You get `{ ref, api }` back (`api` is a ref to the enhancer's imperative API),
and the instance is destroyed automatically on unmount.

```tsx
import { useTabs } from '@hydrateless/react';

export function MyTabs() {
  const { ref, api } = useTabs<HTMLDivElement>();
  // api.current?.setValue('install')
  return (
    <div data-hl-tabs ref={ref}>
      {/* your own tablist / tabpanel markup */}
    </div>
  );
}
```

Built-in hooks: `useTabs`, `useDropdown`, `useTooltip`, `useAccordion`,
`useDisclosureGroup`, `useModalGroup`, `useTocEnhancer`.

For any enhancer not covered by a dedicated hook, use the generic `useEnhancer`:

```tsx
import { useEnhancer } from '@hydrateless/react';
import { enhancePopover, type PopoverApi } from '@hydrateless/enhancers';

const { ref, api } = useEnhancer<HTMLDivElement, PopoverApi>((el) => enhancePopover(el));
```

## TypeScript

The package ships full type definitions. Every component's props (`TabsProps`,
`DropdownItemProps`, `ModalProps`, `ComboboxProps`, etc.) are exported for reuse.

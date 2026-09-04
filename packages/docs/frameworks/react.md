# React

`@hydrateless/react` wraps every Hydrateless component in an idiomatic React
component. Components render the same semantic markup as the core CSS, so they
look right before hydration, and the enhancer that adds keyboard navigation,
ARIA wiring, and focus management is attached and disposed with the component
lifecycle (Strict Mode's double-invoke included).

## Install

```bash
npm install hydrateless @hydrateless/react
```

Requires React 18 or later. Import the CSS once at your app entry:

```js
import 'hydrateless/hydrateless.css';
```

## Components

Composable primitives use a **compound API**: a parent plus named parts you
arrange yourself.

```tsx
import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/react';

export function Example() {
  return (
    <Tabs defaultValue="overview">
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="install">Install</Tab>
      </TabList>
      <TabPanel>Zero runtime by default.</TabPanel>
      <TabPanel>npm install hydrateless</TabPanel>
    </Tabs>
  );
}
```

`Tabs` renders `role="tablist"`, `aria-selected`, `tabindex`, and `hidden`
during render, so server output is already correct and there's no flash when
the enhancer attaches.

### Controlled and uncontrolled

Every stateful component follows the native-input convention:

- **Uncontrolled**: pass `defaultValue` (or `defaultOpen`, `defaultQuery`) and
  let the component own its state.
- **Controlled**: pass `value` + `onValueChange` (or `open` + `onOpenChange`,
  `query` + `onQueryChange`) and own the state yourself. The change callback
  also fires for dismissals the user triggers (Escape, backdrop click, outside
  click), so your state never drifts from the DOM.

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
      <TabPanel>...</TabPanel>
      <TabPanel>...</TabPanel>
    </Tabs>
  );
}
```

```tsx
import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@hydrateless/react';

export function Confirm() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete</Button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalHeader>
          <h2>Delete project?</h2>
        </ModalHeader>
        <ModalBody>This can't be undone.</ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button intent="danger">Delete</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

Which prop is "the value" per component:

| Component                     | State props                                                                                                    | Extra callbacks                   |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `Tabs`                        | `value` / `defaultValue` / `onValueChange` (string)                                                            |                                   |
| `Accordion`                   | `value` / `defaultValue` / `onValueChange` (string[]), `allowMultiple`                                         |                                   |
| `Menu`                        | `value` / `defaultValue` / `onValueChange` (open submenu or null)                                              | `onSelect(value, item, checked?)` |
| `Dropdown`                    | `open` / `defaultOpen` / `onOpenChange`, `closeOnSelect`, `placement`                                          | `onSelect(value, item, checked?)` |
| `Modal`, `Drawer`             | `open` / `defaultOpen` / `onOpenChange`, `closeOnBackdrop`; Drawer `side="start" \| "end"`                     |                                   |
| `Popover`                     | `open` / `defaultOpen` / `onOpenChange`, `placement`, `hover`                                                  |                                   |
| `Tooltip`                     | `content`, `open` / `onOpenChange`, `placement`, `showDelay`, `hideDelay`                                      |                                   |
| `Combobox`                    | `value` / `defaultValue` / `onValueChange`, `open` / `defaultOpen` / `onOpenChange`, `filter`, `autoHighlight` |                                   |
| `Command`                     | `query` / `defaultQuery` / `onQueryChange`, `hotkey`                                                           | `onCommand(value, item)`          |
| `SegmentedControl`            | `options`, `value` / `defaultValue` / `onValueChange` (defaults to the first option)                           |                                   |
| `Switch`, `Checkbox`, `Input` | Native: `checked` / `defaultChecked` / `onChange`, `value` / `defaultValue` / `onChange`                       |                                   |

### Dropdown with checkable items

`DropdownItem` accepts `role="menuitemcheckbox" | "menuitemradio"` and
`checked`; `DropdownGroup` wraps a labeled `role="group"`. The trigger renders
`popovertarget` and the menu renders `popover`, so the menu opens before
JavaScript loads.

```tsx
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownGroup,
  DropdownItem,
  DropdownSeparator,
} from '@hydrateless/react';

<Dropdown onSelect={(value, item, checked) => console.log(value, checked)}>
  <DropdownTrigger>View</DropdownTrigger>
  <DropdownMenu>
    <DropdownGroup label="Show">
      <DropdownItem value="grid" role="menuitemradio" checked>
        Grid
      </DropdownItem>
      <DropdownItem value="list" role="menuitemradio">
        List
      </DropdownItem>
    </DropdownGroup>
    <DropdownSeparator />
    <DropdownItem value="hidden" role="menuitemcheckbox">
      Show hidden files
    </DropdownItem>
    <DropdownItem value="reset" disabled>
      Reset view
    </DropdownItem>
  </DropdownMenu>
</Dropdown>;
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

Every component forwards `className`, `id`, `ref`, and rest props to its root
element.

## Forms and `useField`

`Field` provides a shared id so `FieldLabel`, `FieldHelp`, and `FieldError`
wire `htmlFor` and `aria-describedby` for you. The built-in controls read that
context automatically, and work without it.

```tsx
import { Field, Input } from '@hydrateless/react';

<Field label="Email" description="We never share it." error={errors.email} required>
  <Input type="email" name="email" />
</Field>;
```

For a custom control, `useField()` returns `{ id, describedBy, invalid, required }`
inside a `Field` and `null` outside one:

```tsx
import { useField } from '@hydrateless/react';

function ColorPicker(props) {
  const field = useField();
  return (
    <input
      type="color"
      id={field?.id}
      aria-describedby={field?.describedBy}
      aria-invalid={field?.invalid || undefined}
      required={field?.required}
      {...props}
    />
  );
}
```

See [Forms](/guide/forms) for validation states and native constraint
validation.

## Toasts and `useToast`

`useToast()` returns `{ show(message, { duration, intent }), dismiss(toast), dismissAll() }`
and works from any component with no provider. The first `show()` creates a
polite live region at the end of `<body>`; render `<ToastRegion />` once if you
want to control where toasts appear.

```tsx
import { ToastRegion, useToast } from '@hydrateless/react';

function SaveButton() {
  const toast = useToast();
  return <button onClick={() => toast.show('Saved', { intent: 'success' })}>Save</button>;
}

export function App() {
  return (
    <>
      <SaveButton />
      <ToastRegion />
    </>
  );
}
```

`intent` is one of `info`, `success`, `warning`, or `danger`; `danger` toasts
are announced assertively.

## `useEnhancer`

The one low-level escape hatch. Attach any enhancer to your own markup and get
back a ref to its imperative API:

```tsx
import { useRef } from 'react';
import { useEnhancer } from '@hydrateless/react';
import { enhanceTabs } from '@hydrateless/enhancers';

export function MyTabs() {
  const ref = useRef<HTMLDivElement>(null);
  const api = useEnhancer(ref, enhanceTabs, {
    activation: 'automatic',
    onValueChange: console.log,
  });
  // api.current?.setValue('install')
  return (
    <div ref={ref} data-hl-tabs>
      {/* your own tablist and tabpanel markup */}
    </div>
  );
}
```

Signature: `useEnhancer(ref, enhancer, options?, deps?)`.

- The instance is destroyed on unmount, and destroyed and re-created when
  `deps` change.
- Function-valued options (`onValueChange`, `onOpenChange`, and so on) always
  call the handler from the latest render, so they never need to be in `deps`.
- Other options are read once; list the ones that should trigger
  re-enhancement in `deps`.

All shipped components are built on this hook, so custom wrappers behave
exactly like the built-in ones. See [Composing](/guide/composing#writing-your-own-enhancer)
for writing an enhancer to attach.

## Server components

Every module in `@hydrateless/react` carries a `'use client'` directive, so you
can import components directly into React Server Components (Next.js App
Router, for example) without writing wrapper files. The components render
their full markup on the server; only the enhancer waits for the client.

## TypeScript

Full type definitions ship with the package. Every component's props
(`TabsProps`, `DropdownItemProps`, `ModalProps`, `TableProps`, and so on) and
the enhancer API types (`TabsApi`, `ModalApi`, `ToastApi`, `ToastIntent`) are
exported for reuse.

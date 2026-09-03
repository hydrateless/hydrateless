# @hydrateless/react

React bindings for [Hydrateless](https://github.com/hydrateless/hydrateless). Thin
components that render semantic HTML and wire the framework-agnostic enhancers,
with automatic cleanup on unmount.

## Install

```bash
npm install hydrateless @hydrateless/react
```

Import the CSS once (e.g., in your root):

```ts
import 'hydrateless/hydrateless.css';
```

## Components

```tsx
import { Tabs, TabList, Tab, TabPanel } from '@hydrateless/react';

function Example() {
  return (
    <Tabs defaultValue="overview">
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="install">Install</Tab>
      </TabList>
      <TabPanel>Zero runtime by default.</TabPanel>
      <TabPanel>
        <code>npm i hydrateless</code>
      </TabPanel>
    </Tabs>
  );
}
```

Every component forwards `ref`, `className`, `id`, and any other attributes to
its root element. Interactive components work uncontrolled (`defaultValue` /
`defaultOpen`) or fully controlled (`value` + `onValueChange`, `open` +
`onOpenChange`). Tabs render `aria-selected`, `hidden`, and `tabindex` from the
value during render, so server output is correct before hydration.

### Server Components

The package is a client bundle: `'use client'` is embedded at the top of the
built module, so you can import any component from a React Server Components
app (Next.js App Router, for example) without wrapping it yourself.

### Dialogs

`Modal` and `Drawer` are built on the native `<dialog>` element plus the modal
enhancer (focus trap, scroll-lock, background `inert`). Escape and backdrop
clicks report back through `onOpenChange`. `Drawer` takes `side="start" | "end"`
(default `end`), which follows the writing direction.

```tsx
const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Open</button>
<Modal open={open} onOpenChange={setOpen}>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Body content.</ModalBody>
  <ModalFooter><button onClick={() => setOpen(false)}>Close</button></ModalFooter>
</Modal>;
```

### Dropdown

The menu renders as a native `popover` and the trigger carries `popovertarget`,
so the menu opens before hydration. Items can be plain, checkable, or radio,
and `onSelect` receives the value, the element, and (for checkable items) the
new checked state. Pass `closeOnSelect={false}` for menus that stay open while
several items are toggled.

```tsx
<Dropdown closeOnSelect={false} onSelect={(value, _item, checked) => toggle(value, checked)}>
  <DropdownTrigger>View</DropdownTrigger>
  <DropdownMenu>
    <DropdownItem value="reload">Reload</DropdownItem>
    <DropdownSeparator />
    <DropdownGroup label="Panels">
      <DropdownItem role="menuitemcheckbox" value="sidebar" checked={sidebar}>
        Sidebar
      </DropdownItem>
      <DropdownItem role="menuitemcheckbox" value="minimap" checked={minimap} disabled>
        Minimap
      </DropdownItem>
    </DropdownGroup>
  </DropdownMenu>
</Dropdown>
```

### Menu

`Menu` is a menubar (or vertical menu) whose value is the open submenu. Use
`MenuItem` for leaf items and `MenuSubmenu` for items that open a flyout;
control it with `value` / `defaultValue` / `onValueChange` (`null` means every
submenu is closed) and listen for activations with `onSelect`.

```tsx
<Menu value={openSubmenu} onValueChange={setOpenSubmenu} onSelect={navigate}>
  <MenuItem href="/">Home</MenuItem>
  <MenuSubmenu label="Resources" value="resources">
    <MenuItem href="/docs">Docs</MenuItem>
    <MenuItem href="/blog">Blog</MenuItem>
  </MenuSubmenu>
</Menu>
```

### Command palette

`Command` exposes the filter query as `query` / `defaultQuery` / `onQueryChange`
and reports the chosen item through `onCommand(value, item)`. Inside a
`<dialog>`, `hotkey="k"` opens it with Cmd/Ctrl+K.

### Forms

`Field` wires a label, help text, and error message to its control. The
built-in controls (`Input`, `Textarea`, `Select`, `Checkbox`, `Switch`,
`Slider`, `ComboboxInput`) read the field automatically and pick up `id`,
`aria-describedby`, `aria-invalid`, and `required`; they also work on their
own outside a Field.

```tsx
<Field label="Email" description="We never share it." error={errors.email} required>
  <Input type="email" />
</Field>
```

For a custom control, `useField()` returns
`{ id, describedBy, invalid, required }`, or `null` outside a Field:

```tsx
function ColorPicker() {
  const field = useField();
  return (
    <input
      type="color"
      id={field?.id}
      aria-describedby={field?.describedBy}
      aria-invalid={field?.invalid || undefined}
      required={field?.required}
    />
  );
}
```

### Toasts

`useToast()` works anywhere, no provider required. It returns
`show(message, { duration, intent })` (which returns the toast element) and
`dismiss(toast)`. `intent` is one of `info`, `success`, `warning`, or `danger`
and is rendered as `data-hl-intent`; `danger` toasts are announced assertively.
Render `<ToastRegion />` once if you want to control where toasts appear; it
enhances on mount.

```tsx
function Save() {
  const toast = useToast();
  return <button onClick={() => toast.show('Saved', { intent: 'success' })}>Save</button>;
}
```

### Other changes worth knowing

- `Skeleton` takes `shape="text" | "circle" | "rect"` (rendered as
  `data-hl-shape`); `width` and `height` map to the logical `inline-size` and
  `block-size`.
- `Tooltip` takes `content` plus `placement`, `showDelay`, `hideDelay`, and
  `open` / `onOpenChange`.
- `SegmentedControl` selects the first option when uncontrolled and no
  `defaultValue` is given.
- `Table` renders `<table class="hl-table">` with `striped`, `hover`,
  `align="start" | "center" | "end"`, and `size` modifiers.

## Escape hatch: `useEnhancer`

For your own markup, attach any enhancer with `useEnhancer(ref, enhancer,
options, deps)`. It returns a ref to the enhancer's imperative API, destroys
the instance on unmount, and re-creates it when `deps` change. Callback options
always call the handler from the latest render, so they never need to be
listed in `deps`.

```tsx
import { useRef } from 'react';
import { useEnhancer } from '@hydrateless/react';
import { enhanceTabs } from '@hydrateless/enhancers';

function CustomTabs() {
  const ref = useRef<HTMLDivElement>(null);
  const api = useEnhancer(ref, enhanceTabs, { activation: 'automatic', onValueChange: log });
  // api.current?.setValue('install')
  return (
    <div data-hl-tabs ref={ref}>
      {/* tablist + tabpanels */}
    </div>
  );
}
```

## License

[MIT](../../LICENSE)

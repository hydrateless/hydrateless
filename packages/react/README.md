# @hydrateless/react

React bindings for [Hydrateless](https://github.com/hydrateless/hydrateless). Thin
hooks and components that render semantic HTML and wire the framework-agnostic
enhancers, with automatic cleanup on unmount.

## Install

```bash
npm install hydrateless @hydrateless/react
```

Import the CSS once (e.g. in your root):

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

Interactive components work uncontrolled (`defaultValue` / `defaultOpen`) or
fully controlled (`value` + `onValueChange`, `open` + `onOpenChange`).

### Controlled dialogs

`Modal` and `Drawer` are controlled via the `open` prop and built on the native
`<dialog>` element plus the modal enhancer (focus trap, scroll-lock, background
`inert`). Escape and backdrop clicks report back through `onOpenChange`:

```tsx
const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Open</button>
<Modal open={open} onOpenChange={setOpen}>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Body content.</ModalBody>
  <ModalFooter><button onClick={() => setOpen(false)}>Close</button></ModalFooter>
</Modal>;
```

### Toasts

`useToast()` works anywhere — no provider required. Render `<ToastRegion />`
once if you want to control where toasts appear:

```tsx
function Save() {
  const toast = useToast();
  return <button onClick={() => toast.show('Saved', { variant: 'success' })}>Save</button>;
}
```

## Hooks

For your own markup, attach any enhancer with a ref. You get the enhancer's
imperative API back, and the instance is destroyed automatically on unmount:

```tsx
import { useEnhancer } from '@hydrateless/react';
import { enhanceTabs, type TabsApi } from '@hydrateless/enhancers';

function CustomTabs() {
  const { ref, api } = useEnhancer<HTMLDivElement, TabsApi>((el) => enhanceTabs(el));
  // api.current?.setValue('install')
  return (
    <div data-hl-tabs ref={ref}>
      {/* tablist + tabpanels */}
    </div>
  );
}
```

Convenience hooks: `useTabs`, `useDropdown`, `useTooltip`, `useAccordion`,
`useDisclosureGroup`, `useModalGroup`, `useTocEnhancer`.

## License

[MIT](../../LICENSE)

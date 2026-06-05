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
import { Tabs, Dropdown, Modal, ToastProvider, useToast } from '@hydrateless/react';

function Example() {
  return (
    <Tabs
      items={[
        { label: 'Overview', content: <p>Zero-runtime by default.</p> },
        { label: 'Install', content: <code>npm i hydrateless</code> },
      ]}
    />
  );
}
```

Available: `Accordion` / `AccordionItem`, `Disclosure`, `Tabs`, `Dropdown`,
`Modal`, `Drawer`, `Popover`, `Tooltip`, `Breadcrumb`, `Switch`, `SkipLink`,
`Toc`, and `ToastProvider` + `useToast`.

### Controlled dialogs

`Modal` and `Drawer` are controlled via the `open` prop and built on the native
`<dialog>` element (focus is contained by the browser's top layer):

```tsx
const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Open</button>
<Modal open={open} onClose={() => setOpen(false)} title="Title" footer={<button onClick={() => setOpen(false)}>Close</button>}>
  Body content.
</Modal>;
```

### Toasts

```tsx
function Save() {
  const toast = useToast();
  return <button onClick={() => toast.show('Saved')}>Save</button>;
}

<ToastProvider>
  <Save />
</ToastProvider>;
```

## Hooks

For your own markup, attach any enhancer with a ref. The enhancer's disposer is
called automatically on unmount:

```tsx
import { useEnhancer } from '@hydrateless/react';
import { enhanceTabs } from '@hydrateless/enhancers';

function CustomTabs() {
  const ref = useEnhancer<HTMLDivElement>(enhanceTabs);
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

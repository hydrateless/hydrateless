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

Every interactive primitive has a ready-made component. Behavior (keyboard
navigation, ARIA wiring, focus traps) comes from the underlying enhancer.

```tsx
import { Tabs } from '@hydrateless/react';

export function Example() {
  return (
    <Tabs
      items={[
        { label: 'Overview', content: <p>Zero runtime by default.</p> },
        { label: 'Install', content: <p>npm install hydrateless</p> },
      ]}
    />
  );
}
```

Controlled overlays use an `open` prop and an `onClose` callback:

```tsx
import { useState } from 'react';
import { Modal } from '@hydrateless/react';

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm"
        footer={<button onClick={() => setOpen(false)}>Close</button>}
      >
        <p>Are you sure?</p>
      </Modal>
    </>
  );
}
```

### Available components

| Component                    | Notes                                       |
| ---------------------------- | ------------------------------------------- |
| `Accordion`, `AccordionItem` | `allowMultiple` to keep several panels open |
| `Disclosure`                 | Single expandable section                   |
| `Tabs`                       | `items={[{ label, content }]}`              |
| `Dropdown`                   | `trigger` + `items={[{ label, onSelect }]}` |
| `Modal`                      | Controlled via `open` / `onClose`           |
| `Drawer`                     | Controlled; `side="left" \| "right"`        |
| `Popover`                    | Controlled via `open`                       |
| `Tooltip`                    | Wraps a single focusable child with `label` |
| `Breadcrumb`                 | `items={[{ label, href, current }]}`        |
| `Switch`                     | Native checkbox toggle                      |
| `SkipLink`                   | Visually hidden until focused               |
| `Toc`                        | Auto-generated table of contents            |
| `ToastProvider` + `useToast` | Imperative toasts                           |
| `Menu`                       | Menubar; `items` + `orientation`            |
| `Combobox`                   | Editable input; `options`, `onValueChange`  |
| `Command`                    | Command palette; `items`, `hotkey`          |

The package also ships styled **form controls** (`Button`, `Input`, `Textarea`,
`Select`, `Checkbox`, `Radio` / `RadioGroup`, `Field` with `useField()`,
`Slider`, `SegmentedControl`) and **presentational primitives** (`Alert`,
`Badge`, `Card`, `Avatar` / `AvatarGroup`, `Progress`, `Spinner`, `Skeleton`,
`Pagination`, `Kbd`, `Separator`). These render the same markup as the core CSS
and need no enhancer.

## Toasts

Wrap your app once with `ToastProvider`, then call `useToast()` anywhere below:

```tsx
import { ToastProvider, useToast } from '@hydrateless/react';

function SaveButton() {
  const toast = useToast();
  return <button onClick={() => toast.show('Saved!')}>Save</button>;
}

export function App() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}
```

## Hooks

Prefer to render your own markup? Use a hook to attach an enhancer to a ref. The
disposer is called automatically on unmount.

```tsx
import { useTabs } from '@hydrateless/react';

export function MyTabs() {
  const ref = useTabs<HTMLDivElement>();
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
import { enhancePopover } from '@hydrateless/enhancers';

const ref = useEnhancer<HTMLDivElement>((el) => enhancePopover(el));
```

## TypeScript

The package ships full type definitions. Every component's props and item shapes
(`TabItem`, `DropdownItem`, `BreadcrumbItem`, etc.) are exported for reuse.

## Component Reference

Every component works with semantic HTML and modern CSS. JS enhancers are
optional — they add keyboard navigation, ARIA wiring, or focus management
where native HTML falls short.

---

### Accordion

Collapsible sections. CSS handles open/close via `<details>`. The JS enhancer
enforces single-panel-open behavior.

```html
<div data-hl-accordion>
  <details>
    <summary>Section one</summary>
    <div class="accordion-panel">Panel content.</div>
  </details>
  <details>
    <summary>Section two</summary>
    <div class="accordion-panel">Panel content.</div>
  </details>
</div>
```

**CSS**: `hydrateless/accordion.css`
**JS**: `@hydrateless/enhancers/accordion` — `enhanceAccordion(container, { allowMultiple?: boolean })`

---

### Disclosure

A single expandable section. Purely CSS via `<details>`.

```html
<details class="hydrateless-disclosure" data-hl-disclosure>
  <summary>Show more</summary>
  <div class="disclosure-panel">Hidden content revealed.</div>
</details>
```

**CSS**: `hydrateless/disclosure.css`
**JS**: `@hydrateless/enhancers/disclosure` — `enhanceDisclosure(container, { allowMultiple?: boolean })`

---

### Tabs

Tabbed interface with ARIA roles. The JS enhancer handles keyboard navigation
(Arrow keys, Home, End) and panel switching.

```html
<div data-hl-tabs>
  <div role="tablist">
    <button role="tab">Tab 1</button>
    <button role="tab">Tab 2</button>
  </div>
  <div role="tabpanel">Panel 1 content.</div>
  <div role="tabpanel">Panel 2 content.</div>
</div>
```

**CSS**: `hydrateless/tabs.css`
**JS**: `@hydrateless/enhancers/tabs` — `enhanceTabs(container)`
**Keyboard**: ArrowLeft/ArrowRight to navigate tabs, Enter/Space to select, Home/End for first/last.

---

### Modal

Dialog overlay with backdrop. Uses `<dialog>` with `showModal()`. The JS
enhancer wires open/close buttons and adds a focus trap.

```html
<button data-hl-modal-open="my-modal">Open</button>
<dialog id="my-modal" class="hydrateless-modal" data-hl-modal>
  <div class="hl-modal-header">Title</div>
  <div class="hl-modal-body">Content.</div>
  <div class="hl-modal-footer">
    <button data-hl-modal-close>Close</button>
  </div>
</dialog>
```

**CSS**: `hydrateless/modal.css`
**JS**: `@hydrateless/enhancers/modal` — `enhanceModal(container, { closeOnBackdrop?: boolean })`
**Keyboard**: Escape closes (native `<dialog>` behavior). Tab is trapped within the modal.

---

### Drawer

Off-canvas panel. Built on `<dialog>` with slide-in animation.

```html
<button data-hl-drawer-open="my-drawer">Open drawer</button>
<dialog id="my-drawer" class="hydrateless-drawer" data-hl-drawer data-side="right">
  <div class="hl-drawer-header">Drawer title</div>
  <div class="hl-drawer-body">Drawer content.</div>
  <div class="hl-drawer-footer">
    <button data-hl-drawer-close>Close</button>
  </div>
</dialog>
```

**CSS**: `hydrateless/drawer.css`
**JS**: `@hydrateless/enhancers/drawer` — `enhanceDrawer(container, { closeOnBackdrop?: boolean })`
**Variants**: `data-side="left"` or `data-side="right"`.

---

### Popover

Floating content anchored to a trigger. Uses the native Popover API where
available, with a `hidden`-attribute fallback.

```html
<button data-hl-popover-open="my-pop">Toggle</button>
<div id="my-pop" popover>Popover content.</div>
```

Or with fallback (no `popover` attribute):

```html
<button data-hl-popover-open="my-pop">Toggle</button>
<div id="my-pop" data-hl-popover hidden>Popover content.</div>
<button data-hl-popover-close="my-pop">Close</button>
```

**CSS**: `hydrateless/popover.css`
**JS**: `@hydrateless/enhancers/popover` — `enhancePopover(container, { triggerEvent?: 'click' | 'hover' })`

---

### Tooltip

Text hint shown on hover/focus. Uses `role="tooltip"` and `aria-describedby`.

```html
<button data-hl-tooltip="tip1" aria-describedby="tip1">Hover me</button>
<div id="tip1" role="tooltip" hidden>Helpful tooltip text.</div>
```

**CSS**: `hydrateless/tooltip.css`
**JS**: `@hydrateless/enhancers/tooltip` — `enhanceTooltip(container)`
**Keyboard**: Escape dismisses the tooltip.

---

### Table of Contents (TOC)

Auto-generated navigation from page headings with scroll-spy highlighting.

```html
<nav data-hl-toc></nav>
<main>
  <h2>First section</h2>
  <p>Content...</p>
  <h2>Second section</h2>
  <p>Content...</p>
</main>
```

**CSS**: `hydrateless/toc.css`
**JS**: `@hydrateless/enhancers/toc` — `enhanceToc(container, { headings?: string, scrollSpy?: boolean })`
**Data attributes**: `data-hl-toc-content="selector"` to specify the content root.

---

### Skip Link

Accessibility skip-navigation link, hidden until focused.

```html
<a class="a11y-skip-link" href="#main-content">Skip to content</a>
```

**CSS**: `hydrateless/skip-link.css`
**JS**: None needed.

---

### Switch

Toggle switch built on a native checkbox. CSS-only, no JS required.

```html
<label data-hl-switch>
  <input type="checkbox" role="switch" />
  Enable notifications
</label>
```

**CSS**: `hydrateless/switch.css`
**JS**: None needed.

---

### Breadcrumb

Breadcrumb navigation using a semantic `<nav>` with an ordered list.
CSS-only — no JS required.

```html
<nav data-hl-breadcrumb aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/docs">Docs</a></li>
    <li><span aria-current="page">Components</span></li>
  </ol>
</nav>
```

**CSS**: `hydrateless/breadcrumb.css`
**JS**: None needed.
**Accessibility**: Use `aria-label="Breadcrumb"` on the `<nav>` and
`aria-current="page"` on the current page item.

---

### Dropdown Menu

Button-triggered menu with full keyboard navigation following the WAI-ARIA
menu pattern.

```html
<div data-hl-dropdown>
  <button data-hl-dropdown-trigger>Actions</button>
  <ul data-hl-dropdown-menu>
    <li><button role="menuitem">Edit</button></li>
    <li><button role="menuitem">Duplicate</button></li>
    <li role="separator"></li>
    <li><button role="menuitem">Delete</button></li>
  </ul>
</div>
```

**CSS**: `hydrateless/dropdown.css`
**JS**: `@hydrateless/enhancers/dropdown` — `enhanceDropdown(container)`
**Keyboard**: ArrowDown/ArrowUp to navigate items, Enter/Space to activate,
Escape to close, Home/End for first/last, typeahead by character.
**ARIA**: Sets `aria-haspopup`, `aria-expanded` on trigger; `role="menu"` on
the menu container.

---

### Toast / Notification

Non-modal notifications that appear temporarily and auto-dismiss. Uses a live
region for screen reader announcements.

Place the region in your HTML:

```html
<div data-hl-toast-region></div>
```

Show toasts programmatically:

```js
import { enhanceToast } from '@hydrateless/enhancers/toast';

const toast = enhanceToast(document);
toast.show('Changes saved.');
toast.show('Something went wrong.', { duration: 8000 });
```

Or use declarative trigger buttons:

```html
<button data-hl-toast-trigger="Item copied!">Copy</button>
```

**CSS**: `hydrateless/toast.css`
**JS**: `@hydrateless/enhancers/toast` — `enhanceToast(container)` returns
`{ show(message, options?), dismiss(toast) }`
**Options**: `duration` (ms, default 5000; set to 0 to disable auto-dismiss).
**Accessibility**: Region uses `role="status"` with `aria-live="polite"`.
Close buttons include `aria-label="Dismiss"`.

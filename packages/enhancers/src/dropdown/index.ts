import {
  defineEnhancer,
  ensureId,
  setAttrs,
  onClickOutside,
  nextIndex,
  createTypeahead,
  type MoveDirection,
} from '../core/index.js';

export type EnhanceDropdownOptions = {
  /** Preferred side; flips to `top` when there is no room below. */
  placement?: 'bottom' | 'top';
};

/**
 * Menu-button pattern: a trigger toggles a `role="menu"` of `role="menuitem"`
 * children with full arrow/Home/End/typeahead navigation, Escape + outside
 * click to dismiss, and ARIA expanded/haspopup wiring.
 */
export const enhanceDropdown = defineEnhancer<EnhanceDropdownOptions>({
  name: 'dropdown',
  selector: '[data-hl-dropdown]',
  defaults: { placement: 'bottom' },
  setup({ root, options, on, add }) {
    const trigger = root.querySelector<HTMLElement>('[data-hl-dropdown-trigger]');
    const menu = root.querySelector<HTMLElement>('[data-hl-dropdown-menu]');
    if (!trigger || !menu) return;

    const items = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    if (items.length === 0) return;

    const triggerId = ensureId(trigger, 'hl-dropdown-trigger');
    setAttrs(trigger, { 'aria-haspopup': 'true', 'aria-expanded': 'false' });
    setAttrs(menu, { role: 'menu', 'aria-labelledby': triggerId });
    menu.hidden = true;
    for (const item of items) item.tabIndex = -1;

    const labels = items.map((item) => item.textContent ?? '');
    const typeahead = createTypeahead();
    const isOpen = () => !menu.hidden;

    const place = () => {
      menu.dataset.hlSide = options.placement;
      const triggerRect = trigger.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const viewport = root.ownerDocument.documentElement.clientHeight || 0;
      const spaceBelow = viewport - triggerRect.bottom;
      if (spaceBelow < menuRect.height && triggerRect.top > spaceBelow) {
        menu.dataset.hlSide = 'top';
      }
    };

    const open = (focusLast = false) => {
      menu.hidden = false;
      place();
      setAttrs(trigger, { 'aria-expanded': 'true' });
      (focusLast ? items[items.length - 1] : items[0])?.focus();
    };

    const close = (restoreFocus = true) => {
      menu.hidden = true;
      setAttrs(trigger, { 'aria-expanded': 'false' });
      if (restoreFocus) trigger.focus();
    };

    const move = (direction: MoveDirection) => {
      const active = root.ownerDocument.activeElement as HTMLElement | null;
      const current = active ? items.indexOf(active) : -1;
      items[nextIndex(current, items.length, direction)]?.focus();
    };

    on(trigger, 'click', (e) => {
      e.preventDefault();
      if (isOpen()) close();
      else open();
    });

    on<KeyboardEvent>(trigger, 'keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        if (!isOpen()) {
          e.preventDefault();
          open();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen()) open(true);
      }
    });

    on<KeyboardEvent>(menu, 'keydown', (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          move('next');
          break;
        case 'ArrowUp':
          e.preventDefault();
          move('prev');
          break;
        case 'Home':
          e.preventDefault();
          move('first');
          break;
        case 'End':
          e.preventDefault();
          move('last');
          break;
        case 'Escape':
          e.preventDefault();
          close();
          break;
        case 'Tab':
          close(false);
          break;
        default: {
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            const active = root.ownerDocument.activeElement as HTMLElement | null;
            const from = active ? items.indexOf(active) : -1;
            const match = typeahead(e.key, labels, from);
            if (match !== -1) items[match]?.focus();
          }
        }
      }
    });

    for (const item of items) {
      on(item, 'click', () => close());
    }

    add(onClickOutside(root, () => isOpen() && close(false)));
  },
});

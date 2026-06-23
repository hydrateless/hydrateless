import {
  defineEnhancer,
  ensureId,
  setAttrs,
  nextIndex,
  createTypeahead,
  supportsAnchorPositioning,
  positionFallback,
  Events,
  type MoveDirection,
  type Placement,
} from '../core/index.js';

/** Options for {@link enhanceDropdown}. */
export type EnhanceDropdownOptions = {
  /** Placement passed to the JS positioning fallback. Defaults to `bottom-start`. */
  placement?: Placement;
  /** Run the JS positioning fallback when CSS anchor positioning is missing. Defaults to `true`. */
  position?: boolean;
  /** Open the menu immediately on enhance, without moving focus. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called after the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Called with the item's value when a menu item is activated. */
  onSelect?: (value: string, item: HTMLElement) => void;
};

/** Imperative handle returned by {@link enhanceDropdown}. */
export type DropdownApi = {
  /** Whether the menu is currently open. */
  readonly open: boolean;
  /** Open or close the menu. Pass `focus: false` to leave focus untouched. */
  setOpen: (open: boolean, options?: { focus?: boolean }) => void;
};

/**
 * Menu-button pattern built on the native Popover API. The menu is a `popover`
 * the trigger toggles through `popovertarget`, so opening, closing, Escape, and
 * light-dismiss all work with no JavaScript, and CSS anchor positioning places
 * it. This enhancer adds the menu semantics the platform doesn't: `role="menu"`
 * wiring, roving focus into the items on open, arrow/Home/End/typeahead
 * navigation, and a JS positioning fallback for engines without anchor
 * positioning. Open state is observable through `onOpenChange`/`hl:open-change`
 * and activating an item emits a cancelable `hl:select`.
 */
export const enhanceDropdown = defineEnhancer<EnhanceDropdownOptions, DropdownApi>({
  name: 'dropdown',
  selector: '[data-hl-dropdown]',
  defaults: { placement: 'bottom-start', position: true },
  setup({ root, options, on, emit }) {
    const doc = root.ownerDocument;
    const trigger = root.querySelector<HTMLElement>('[data-hl-dropdown-trigger]');
    const menu = root.querySelector<HTMLElement>('[data-hl-dropdown-menu]');
    if (!trigger || !menu) return;

    const items = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    if (items.length === 0) return;

    if (!menu.hasAttribute('popover')) menu.setAttribute('popover', 'auto');
    const menuId = ensureId(menu, 'hl-dropdown-menu');
    const triggerId = ensureId(trigger, 'hl-dropdown-trigger');
    setAttrs(trigger, {
      'aria-haspopup': 'menu',
      'aria-expanded': 'false',
      'aria-controls': menuId,
    });
    if (trigger.tagName === 'BUTTON' && !trigger.hasAttribute('popovertarget')) {
      trigger.setAttribute('popovertarget', menuId);
    }
    setAttrs(menu, { role: 'menu', 'aria-labelledby': triggerId });
    for (const item of items) item.tabIndex = -1;

    const labels = items.map((item) => item.textContent ?? '');
    const typeahead = createTypeahead();
    const isOpen = () => menu.matches(':popover-open');

    let focusOnOpen: 'first' | 'last' | 'none' = 'first';
    const focusItem = (which: 'first' | 'last') =>
      (which === 'last' ? items[items.length - 1] : items[0])?.focus();

    on(menu, 'toggle', (e) => {
      const open = (e as ToggleEvent).newState === 'open';
      setAttrs(trigger, { 'aria-expanded': open ? 'true' : 'false' });
      if (open) {
        if (options.position && !supportsAnchorPositioning()) {
          positionFallback(trigger, menu, { placement: options.placement });
        }
        if (focusOnOpen !== 'none') focusItem(focusOnOpen === 'last' ? 'last' : 'first');
        focusOnOpen = 'first';
      }
      options.onOpenChange?.(open);
      emit(Events.openChange, { open });
    });

    const show = (focus: 'first' | 'last' | 'none' = 'first') => {
      focusOnOpen = focus;
      if (!isOpen()) menu.showPopover();
      else if (focus !== 'none') focusItem(focus === 'last' ? 'last' : 'first');
    };
    const hide = () => {
      if (isOpen()) menu.hidePopover();
    };

    const move = (direction: MoveDirection) => {
      const active = doc.activeElement as HTMLElement | null;
      const current = active ? items.indexOf(active) : -1;
      items[nextIndex(current, items.length, direction)]?.focus();
    };

    const select = (item: HTMLElement) => {
      const value = item.dataset.hlValue ?? item.textContent?.trim() ?? '';
      if (!emit(Events.select, { value, item }, { cancelable: true })) return;
      options.onSelect?.(value, item);
      hide();
    };

    on<KeyboardEvent>(trigger, 'keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        show('first');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        show('last');
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
          hide();
          break;
        case 'Tab':
          hide();
          break;
        default: {
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            const active = doc.activeElement as HTMLElement | null;
            const from = active ? items.indexOf(active) : -1;
            const match = typeahead(e.key, labels, from);
            if (match !== -1) items[match]?.focus();
          }
        }
      }
    });

    for (const item of items) {
      on(item, 'click', () => select(item));
    }

    if (options.defaultOpen) show('none');

    return {
      get open() {
        return isOpen();
      },
      setOpen(next, { focus = false } = {}) {
        if (next) show(focus ? 'first' : 'none');
        else hide();
      },
    };
  },
});

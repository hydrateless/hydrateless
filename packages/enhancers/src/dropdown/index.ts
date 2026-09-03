import {
  defineEnhancer,
  ensureId,
  setAttrs,
  createTypeahead,
  isTypeaheadKey,
  keepPositioned,
  noop,
  menuItemsOf,
  isDisabledItem,
  nextEnabledIndex,
  activateMenuItem,
  prepareMenuItems,
  Events,
  Keys,
  type Disposer,
  type MoveDirection,
  type Placement,
} from '../core/index.js';

/** Options for {@link enhanceDropdown}. */
export type EnhanceDropdownOptions = {
  /** Placement passed to the JS positioning fallback. Defaults to `bottom-start`. */
  placement?: Placement;
  /** Run the JS positioning fallback when CSS anchor positioning is missing. Defaults to `true`. */
  position?: boolean;
  /**
   * Close the menu after an item is activated. Defaults to `true`. Set to
   * `false` for menus of `menuitemcheckbox` items that should stay open while
   * several are toggled.
   */
  closeOnSelect?: boolean;
  /** Open the menu immediately on enhance, without moving focus. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called after the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Called with the item's value when a menu item is activated. For
   * `menuitemcheckbox`/`menuitemradio` items, `checked` is the new state.
   */
  onSelect?: (value: string, item: HTMLElement, checked?: boolean) => void;
};

/** Imperative handle returned by {@link enhanceDropdown}. */
export type DropdownApi = {
  /** Whether the menu is currently open. */
  readonly open: boolean;
  /**
   * Open or close the menu. Opening moves focus to the first item, as the APG
   * menu button pattern expects; pass `focus: false` to leave focus untouched.
   */
  setOpen: (open: boolean, options?: { focus?: boolean }) => void;
};

/**
 * Menu-button pattern built on the native Popover API. The menu is a `popover`
 * the trigger toggles through `popovertarget`, so opening, closing, Escape, and
 * light-dismiss all work with no JavaScript, and CSS anchor positioning places
 * it. This enhancer adds the menu semantics the platform doesn't: `role="menu"`
 * wiring, roving focus into the items on open, arrow/Home/End/typeahead
 * navigation that skips disabled items, `menuitemcheckbox`/`menuitemradio`
 * state, focus returned to the trigger when the menu closes from the keyboard
 * or by activating an item, and a JS positioning fallback (kept in sync on
 * scroll and resize) for engines without anchor positioning. Open state is
 * observable through `onOpenChange`/`hl:open-change` and activating an item
 * emits a cancelable `hl:select`.
 */
export const enhanceDropdown = defineEnhancer<EnhanceDropdownOptions, DropdownApi>({
  name: 'dropdown',
  selector: '[data-hl-dropdown]',
  defaults: { placement: 'bottom-start', position: true, closeOnSelect: true },
  setup({ root, options, on, add, emit }) {
    const doc = root.ownerDocument;
    const trigger = root.querySelector<HTMLElement>('[data-hl-dropdown-trigger]');
    const menu = root.querySelector<HTMLElement>('[data-hl-dropdown-menu]');
    if (!trigger || !menu) return;

    const items = menuItemsOf(menu);
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
    prepareMenuItems(items);

    const labels = items.map((item) => item.textContent ?? '');
    const typeahead = createTypeahead();
    const isOpen = () => menu.matches(':popover-open');

    type FocusTarget = 'first' | 'last' | 'none';
    // What `show()` asked for; `null` means the popover was opened natively
    // (the trigger's `popovertarget`), which the APG treats like "focus first".
    let requestedFocus: FocusTarget | null = null;
    let stopPositioning: Disposer = noop;
    add(() => stopPositioning());

    const focusIndex = (index: number) => {
      if (index !== -1) items[index]?.focus();
    };
    const focusEdge = (which: 'first' | 'last') => focusIndex(nextEnabledIndex(items, -1, which));

    // `toggle` is the single source of truth for open state, but browsers
    // dispatch it asynchronously, so anything focus-related that must beat the
    // browser's own default action (Tab moving on, for instance) happens
    // synchronously in `show`/`hide` below rather than here.
    on(menu, 'toggle', (e) => {
      const open = (e as ToggleEvent).newState === 'open';
      setAttrs(trigger, { 'aria-expanded': open ? 'true' : 'false' });
      stopPositioning();
      stopPositioning = noop;
      if (open) {
        if (options.position) {
          stopPositioning = keepPositioned(trigger, menu, { placement: options.placement });
        }
        const which = requestedFocus ?? 'first';
        requestedFocus = null;
        if (which !== 'none' && !menu.contains(doc.activeElement)) focusEdge(which);
      }
      options.onOpenChange?.(open);
      emit(Events.openChange, { open });
    });

    const show = (focus: FocusTarget = 'first') => {
      if (isOpen()) {
        if (focus !== 'none') focusEdge(focus);
        return;
      }
      requestedFocus = focus;
      menu.showPopover();
      if (focus !== 'none') focusEdge(focus);
    };
    const hide = (restoreFocus = true) => {
      if (!isOpen()) return;
      menu.hidePopover();
      // Keyboard and item-activation paths hand focus back to the trigger, as
      // the menu button pattern requires; light dismiss leaves focus alone.
      if (restoreFocus) trigger.focus();
    };

    const move = (direction: MoveDirection) => {
      const active = doc.activeElement as HTMLElement | null;
      const current = active ? items.indexOf(active) : -1;
      focusIndex(nextEnabledIndex(items, current, direction));
    };

    const select = (item: HTMLElement) => {
      if (isDisabledItem(item)) return;
      const role = item.getAttribute('role');
      const checkable = role === 'menuitemcheckbox' || role === 'menuitemradio';
      const previous = item.getAttribute('aria-checked');
      const { value, checked } = activateMenuItem(item);
      if (!emit(Events.select, { value, item, checked }, { cancelable: true })) {
        // A listener vetoed the activation; put checkable state back.
        if (checkable) setAttrs(item, { 'aria-checked': previous });
        return;
      }
      options.onSelect?.(value, item, checked);
      if (options.closeOnSelect) hide(true);
    };

    on<KeyboardEvent>(trigger, 'keydown', (e) => {
      if (e.key === Keys.ArrowDown) {
        e.preventDefault();
        show('first');
      } else if (e.key === Keys.ArrowUp) {
        e.preventDefault();
        show('last');
      }
    });

    on<KeyboardEvent>(menu, 'keydown', (e) => {
      const target = e.target as HTMLElement;
      switch (e.key) {
        case Keys.ArrowDown:
          e.preventDefault();
          move('next');
          break;
        case Keys.ArrowUp:
          e.preventDefault();
          move('prev');
          break;
        case Keys.Home:
          e.preventDefault();
          move('first');
          break;
        case Keys.End:
          e.preventDefault();
          move('last');
          break;
        case Keys.Escape:
          e.preventDefault();
          hide(true);
          break;
        case Keys.Tab:
          // Let the browser move focus on from the trigger, which is where the
          // APG expects it to land after a menu closes.
          hide(true);
          break;
        case Keys.Enter:
        case Keys.Space: {
          // Buttons activate natively; anything else (links, list items) gets
          // the same click-driven path so every item type behaves alike.
          const item = target.closest<HTMLElement>('[role^="menuitem"]');
          if (item && items.includes(item) && item.tagName !== 'BUTTON') {
            e.preventDefault();
            item.click();
          }
          break;
        }
        default: {
          if (isTypeaheadKey(e)) {
            e.preventDefault();
            const active = doc.activeElement as HTMLElement | null;
            const from = active ? items.indexOf(active) : -1;
            const match = typeahead(e.key, labels, from);
            if (match !== -1 && !isDisabledItem(items[match])) focusIndex(match);
          }
        }
      }
    });

    on(menu, 'click', (e) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>('[role^="menuitem"]');
      if (item && items.includes(item)) select(item);
    });

    if (options.defaultOpen) show('none');

    return {
      get open() {
        return isOpen();
      },
      setOpen(next, { focus = true } = {}) {
        if (next) show(focus ? 'first' : 'none');
        else hide(false);
      },
    };
  },
});

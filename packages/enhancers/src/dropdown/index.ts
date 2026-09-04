import { defineEnhancer } from '../core/define.js';
import { ensureId, setAttrs, isRtl } from '../core/dom.js';
import { Events } from '../core/events.js';
import { createTypeahead, isTypeaheadKey, Keys, type MoveDirection } from '../core/keys.js';
import { noop, type Disposer } from '../core/lifecycle.js';
import {
  menuItemsOf,
  isDisabledItem,
  nextEnabledIndex,
  activateMenuItem,
  prepareMenuItems,
} from '../core/menu-items.js';
import {
  keepPositioned,
  parsePlacement,
  supportsPopover,
  type Placement,
} from '../core/platform.js';
import { menuOf, submenuOf, createSubmenus } from '../core/submenus.js';

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
 * state, nested submenus (an item followed by a sibling `[role="menu"]` opens
 * it with the inline-end arrow, Enter, Space, click, or hover; the inline-start
 * arrow and Escape step back out), focus returned to the trigger when the menu
 * closes from the keyboard or by activating an item, and a JS positioning
 * fallback for engines without anchor positioning. Items added or removed
 * after enhancement are picked up automatically. Open state is observable
 * through `onOpenChange`/`hl:open-change` and activating an item emits a
 * cancelable `hl:select`. Markup can set `data-hl-placement`,
 * `data-hl-close-on-select`, and `data-hl-default-open` on the root.
 */
export const enhanceDropdown = defineEnhancer<EnhanceDropdownOptions, DropdownApi>({
  name: 'dropdown',
  selector: '[data-hl-dropdown]',
  defaults: { placement: 'bottom-start', position: true, closeOnSelect: true },
  attributes: {
    placement: parsePlacement,
    position: 'boolean',
    closeOnSelect: 'boolean',
    defaultOpen: 'boolean',
  },
  setup({ root, options, on, observe, add, emit }) {
    const doc = root.ownerDocument;
    const trigger = root.querySelector<HTMLElement>('[data-hl-dropdown-trigger]');
    const menu = root.querySelector<HTMLElement>('[data-hl-dropdown-menu]');
    if (!trigger || !menu) return;

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

    const submenus = createSubmenus(
      { add },
      { usePopover: supportsPopover(), position: options.position!, placement: () => 'end-start' },
    );

    // Items are re-read on every interaction, and re-prepared whenever the
    // menu's subtree changes, so items rendered later behave like the rest.
    const prepare = () => {
      prepareMenuItems(menuItemsOf(menu));
      submenus.prepare(menu);
    };
    prepare();
    observe(menu, prepare);

    const typeahead = createTypeahead();
    const isOpen = () => menu.matches(':popover-open');

    type FocusTarget = 'first' | 'last' | 'none';
    // What `show()` asked for; `null` means the popover was opened natively
    // (the trigger's `popovertarget`), which the APG treats like "focus first".
    let requestedFocus: FocusTarget | null = null;
    let stopPositioning: Disposer = noop;
    add(() => stopPositioning());

    const focusIn = (items: HTMLElement[], index: number) => {
      if (index !== -1) items[index]?.focus();
    };
    const focusEdge = (which: 'first' | 'last') => {
      const items = menuItemsOf(menu);
      focusIn(items, nextEnabledIndex(items, -1, which));
    };

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
      } else {
        submenus.close(0);
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
      submenus.close(0);
      menu.hidePopover();
      // Keyboard and item-activation paths hand focus back to the trigger, as
      // the menu button pattern requires; light dismiss leaves focus alone.
      if (restoreFocus) trigger.focus();
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
      // Keys act on the focused item; fall back to the event target so a
      // keydown dispatched on the menu itself still navigates.
      const focused = doc.activeElement as HTMLElement | null;
      const origin = focused && menu.contains(focused) ? focused : (e.target as HTMLElement);
      const item = origin.closest<HTMLElement>('[role^="menuitem"]');
      const surface = (item && menuOf(item)) ?? menu;
      const items = menuItemsOf(surface);
      const current = item ? items.indexOf(item) : -1;
      const depth = submenus.depthOf(origin);
      const rtl = isRtl(root);
      const openKey = rtl ? Keys.ArrowLeft : Keys.ArrowRight;
      const closeKey = rtl ? Keys.ArrowRight : Keys.ArrowLeft;
      const move = (direction: MoveDirection) =>
        focusIn(items, nextEnabledIndex(items, current, direction));

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
          if (depth > 0) submenus.close(depth - 1, true);
          else hide(true);
          break;
        case Keys.Tab:
          // Let the browser move focus on from the trigger, which is where the
          // APG expects it to land after a menu closes.
          hide(true);
          break;
        case Keys.Enter:
        case Keys.Space:
          if (!item) break;
          if (submenuOf(item) && !isDisabledItem(item)) {
            e.preventDefault();
            submenus.open(item, 'first');
          } else if (item.tagName !== 'BUTTON') {
            // Buttons activate natively; anything else (links, list items) gets
            // the same click-driven path so every item type behaves alike.
            e.preventDefault();
            item.click();
          }
          break;
        default:
          if (e.key === openKey) {
            if (item && submenuOf(item) && !isDisabledItem(item)) {
              e.preventDefault();
              submenus.open(item, 'first');
            }
          } else if (e.key === closeKey) {
            if (depth > 0) {
              e.preventDefault();
              submenus.close(depth - 1, true);
            }
          } else if (isTypeaheadKey(e)) {
            e.preventDefault();
            const labels = items.map((entry) => entry.textContent ?? '');
            const match = typeahead(e.key, labels, current);
            if (match !== -1 && !isDisabledItem(items[match])) focusIn(items, match);
          }
      }
    });

    on(menu, 'click', (e) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>('[role^="menuitem"]');
      if (!item || !menu.contains(item)) return;
      if (submenuOf(item)) {
        e.preventDefault();
        if (isDisabledItem(item)) return;
        const depth = submenus.depthOf(item);
        if (submenus.layers[depth]?.trigger === item) submenus.close(depth, true);
        else submenus.open(item, 'first');
        return;
      }
      select(item);
    });

    // Hovering a submenu trigger opens it (without stealing focus); hovering a
    // sibling leaf collapses any branch below that level.
    on(menu, 'pointerover', (e) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>('[role^="menuitem"]');
      if (!item || !menu.contains(item) || isDisabledItem(item)) return;
      const depth = submenus.depthOf(item);
      if (submenuOf(item)) submenus.open(item, 'none');
      else if (submenus.layers.length > depth) submenus.close(depth);
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

import { defineEnhancer } from '../core/define.js';
import { setAttrs, isRtl } from '../core/dom.js';
import { createTypeahead, isTypeaheadKey, Keys, type MoveDirection } from '../core/keys.js';
import { supportsPopover } from '../core/platform.js';
import {
  menuItemsOf,
  isDisabledItem,
  nextEnabledIndex,
  activateMenuItem,
} from '../core/menu-items.js';
import { menuOf, submenuOf, createSubmenus } from '../core/submenus.js';
import { Events } from '../core/events.js';

/** Options for {@link enhanceMenu}. */
export type EnhanceMenuOptions = {
  /** Layout of the top-level menu. Defaults to `horizontal` (menubar). */
  orientation?: 'horizontal' | 'vertical';
  /** Run the JS positioning fallback when CSS anchor positioning is missing. Defaults to `true`. */
  position?: boolean;
  /**
   * Value of the submenu to open on enhance. Submenu values come from
   * `data-hl-value` on each top-level trigger, defaulting to the index.
   */
  defaultValue?: string | null;
  /** Called with the open top-level submenu's value (or `null`) after every change. */
  onValueChange?: (value: string | null) => void;
  /**
   * Called with the item's value when a leaf menu item is activated. For
   * `menuitemcheckbox`/`menuitemradio` items, `checked` is the new state.
   */
  onSelect?: (value: string, item: HTMLElement, checked?: boolean) => void;
};

/** Imperative handle returned by {@link enhanceMenu}. */
export type MenuApi = {
  /** Value of the currently open top-level submenu, or `null` when all are closed. */
  readonly value: string | null;
  /** Open the top-level submenu with `value` (closing any other), or pass `null` to close. */
  setValue: (value: string | null) => void;
};

/**
 * Menubar / navigation-menu pattern with nested submenus. Without JavaScript
 * the stylesheet reveals submenus on hover and `:focus-within`, so the
 * navigation stays usable; this enhancer marks the root `data-hl-ready` and
 * takes over. Top-level items use a roving tabindex with orientation-aware
 * arrow navigation; submenu triggers expose `aria-haspopup`/`aria-expanded`
 * and open on Enter/Space/arrow, click, or hover once a sibling is open.
 * Submenus are promoted to native `popover="manual"` surfaces so they render
 * in the top layer, placed against their trigger with CSS anchor positioning
 * (with a JS fallback on engines without it). Inside a submenu, arrows, Home,
 * End, and typeahead move between items and skip disabled ones; the
 * inline-end arrow opens a nested submenu and the inline-start arrow (or
 * Escape) closes one level; at the first level the inline arrows move to the
 * adjacent top-level menu instead (Left alone closes when vertical). Items
 * added or removed after enhancement are picked up automatically. The open
 * top-level submenu is observable through `onValueChange`/`hl:change`,
 * activating a leaf item emits a cancelable `hl:select`, and the open submenu
 * is controllable through the returned API. Markup can set
 * `data-hl-orientation` and `data-hl-default-value` on the root.
 */
export const enhanceMenu = defineEnhancer<EnhanceMenuOptions, MenuApi>({
  name: 'menu',
  selector: '[data-hl-menu]',
  defaults: { orientation: 'horizontal', position: true },
  attributes: {
    orientation: ['horizontal', 'vertical'],
    position: 'boolean',
    defaultValue: 'string',
  },
  setup({ root, options, on, observe, add, emit }) {
    const vertical =
      root.getAttribute('aria-orientation') === 'vertical' || options.orientation === 'vertical';
    setAttrs(root, {
      role: root.getAttribute('role') || 'menubar',
      'aria-orientation': vertical ? 'vertical' : 'horizontal',
    });

    const topItems = () => menuItemsOf(root);
    if (topItems().length === 0) return;

    const typeahead = createTypeahead();

    const valueOf = (item: HTMLElement, i: number): string =>
      item.getAttribute('data-hl-value') ?? String(i);
    const openTop = (): HTMLElement | null => submenus.layers[0]?.trigger ?? null;
    const currentValue = (): string | null => {
      const trigger = openTop();
      if (!trigger) return null;
      const items = topItems();
      return valueOf(trigger, items.indexOf(trigger));
    };

    let lastValue: string | null = null;
    const notify = () => {
      const value = currentValue();
      if (value === lastValue) return;
      lastValue = value;
      options.onValueChange?.(value);
      emit(Events.change, { value });
    };

    const submenus = createSubmenus(
      { add },
      {
        usePopover: supportsPopover(),
        position: options.position!,
        placement: (depth) => (depth === 0 && !vertical ? 'bottom-start' : 'end-start'),
        onChange: notify,
      },
    );

    // Signal to CSS that JS owns submenu visibility, so the hover/focus-within
    // no-JS baseline stands down. Removed on destroy so the baseline returns.
    root.setAttribute('data-hl-ready', '');
    add(() => root.removeAttribute('data-hl-ready'));

    /** Roving tabindex across the top level: exactly one item is tabbable. */
    let tabbable: HTMLElement | null = null;
    const prepare = () => {
      const items = topItems();
      if (!tabbable || !items.includes(tabbable)) {
        const first = nextEnabledIndex(items, -1, 'first');
        tabbable = items[first === -1 ? 0 : first] ?? null;
      }
      for (const item of items) item.tabIndex = item === tabbable ? 0 : -1;
      submenus.prepare(root);
    };
    prepare();
    observe(root, prepare);

    const focusTop = (index: number) => {
      const items = topItems();
      const item = items[index];
      if (!item) return;
      tabbable = item;
      for (const entry of items) entry.tabIndex = entry === item ? 0 : -1;
      item.focus();
    };
    const moveTop = (from: number, direction: MoveDirection) =>
      focusTop(nextEnabledIndex(topItems(), from, direction));

    const select = (item: HTMLElement, event?: Event) => {
      if (isDisabledItem(item)) {
        event?.preventDefault();
        return;
      }
      const role = item.getAttribute('role');
      const checkable = role === 'menuitemcheckbox' || role === 'menuitemradio';
      const previous = item.getAttribute('aria-checked');
      const { value, checked } = activateMenuItem(item);
      if (!emit(Events.select, { value, item, checked }, { cancelable: true })) {
        if (checkable) setAttrs(item, { 'aria-checked': previous });
        event?.preventDefault();
        return;
      }
      options.onSelect?.(value, item, checked);
      if (submenus.layers.length > 0) submenus.close(0, true);
    };

    on<KeyboardEvent>(root, 'keydown', (e) => {
      const target = e.target as HTMLElement;
      const item = target.closest<HTMLElement>('[role^="menuitem"]');
      if (!item) return;
      const items = topItems();
      const topIdx = items.indexOf(item);
      const rtl = isRtl(root);
      const inlineNext = rtl ? Keys.ArrowLeft : Keys.ArrowRight;
      const inlinePrev = rtl ? Keys.ArrowRight : Keys.ArrowLeft;

      if (topIdx !== -1) {
        const nextKey = vertical ? Keys.ArrowDown : inlineNext;
        const prevKey = vertical ? Keys.ArrowUp : inlinePrev;
        const openKey = vertical ? inlineNext : Keys.ArrowDown;
        const hasSubmenu = !!submenuOf(item);
        if (e.key === nextKey) {
          e.preventDefault();
          moveTop(topIdx, 'next');
        } else if (e.key === prevKey) {
          e.preventDefault();
          moveTop(topIdx, 'prev');
        } else if (e.key === Keys.Home) {
          e.preventDefault();
          moveTop(topIdx, 'first');
        } else if (e.key === Keys.End) {
          e.preventDefault();
          moveTop(topIdx, 'last');
        } else if (
          hasSubmenu &&
          (e.key === openKey || e.key === Keys.Enter || e.key === Keys.Space)
        ) {
          e.preventDefault();
          if (!isDisabledItem(item)) submenus.open(item, 'first');
        } else if (hasSubmenu && !vertical && e.key === Keys.ArrowUp) {
          e.preventDefault();
          if (!isDisabledItem(item)) submenus.open(item, 'last');
        } else if (!hasSubmenu && (e.key === Keys.Enter || e.key === Keys.Space)) {
          if (item.tagName !== 'BUTTON') {
            e.preventDefault();
            item.click();
          }
        } else if (e.key === Keys.Escape && submenus.layers.length > 0) {
          e.preventDefault();
          submenus.close(0, true);
        } else if (isTypeaheadKey(e)) {
          const match = typeahead(
            e.key,
            items.map((entry) => entry.textContent ?? ''),
            topIdx,
          );
          if (match !== -1 && !isDisabledItem(items[match])) focusTop(match);
        }
        return;
      }

      // Inside a submenu at some depth.
      const surface = menuOf(item);
      if (!surface || surface === root) return;
      const subs = menuItemsOf(surface);
      const subIdx = subs.indexOf(item);
      const depth = submenus.depthOf(item);
      if (depth === 0) return;
      const parentTop = items.indexOf(submenus.layers[0].trigger);

      const move = (direction: MoveDirection) => {
        const index = nextEnabledIndex(subs, subIdx, direction);
        if (index !== -1) subs[index].focus();
      };
      /** Close every submenu and move to the adjacent top-level item, opening its submenu. */
      const jumpTop = (direction: 'next' | 'prev') => {
        submenus.close(0);
        const targetIdx = nextEnabledIndex(items, parentTop, direction);
        focusTop(targetIdx);
        const next = items[targetIdx];
        if (next && submenuOf(next)) submenus.open(next, 'none');
      };

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
          submenus.close(depth - 1, true);
          break;
        case Keys.Enter:
        case Keys.Space:
          if (submenuOf(item) && !isDisabledItem(item)) {
            e.preventDefault();
            submenus.open(item, 'first');
          } else if (item.tagName !== 'BUTTON') {
            e.preventDefault();
            item.click();
          }
          break;
        default:
          if (e.key === inlineNext) {
            e.preventDefault();
            if (submenuOf(item) && !isDisabledItem(item)) submenus.open(item, 'first');
            else if (!vertical) jumpTop('next');
          } else if (e.key === inlinePrev) {
            e.preventDefault();
            if (depth > 1) submenus.close(depth - 1, true);
            else if (vertical) submenus.close(0, true);
            else jumpTop('prev');
          } else if (isTypeaheadKey(e)) {
            const match = typeahead(
              e.key,
              subs.map((s) => s.textContent ?? ''),
              subIdx,
            );
            if (match !== -1 && !isDisabledItem(subs[match])) subs[match]?.focus();
          }
      }
    });

    on(root, 'click', (e) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>('[role^="menuitem"]');
      if (!item || !root.contains(item)) return;
      if (submenuOf(item)) {
        e.preventDefault();
        if (isDisabledItem(item)) return;
        const depth = submenus.depthOf(item);
        // Like the dropdown, a click opens the submenu and moves focus into it
        // so keyboard users who clicked can arrow through the items at once.
        if (submenus.layers[depth]?.trigger === item) submenus.close(depth, true);
        else submenus.open(item, 'first');
        if (depth === 0) {
          tabbable = item;
          for (const entry of topItems()) entry.tabIndex = entry === item ? 0 : -1;
        }
        return;
      }
      select(item, e);
    });

    // Hover: once a top-level submenu is open, pointing at a sibling top item
    // switches to it (menubar convention); inside submenus, hovering a trigger
    // opens its nested submenu and hovering a leaf collapses deeper branches.
    on(root, 'pointerover', (e) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>('[role^="menuitem"]');
      if (!item || !root.contains(item) || isDisabledItem(item)) return;
      const depth = submenus.depthOf(item);
      const isTop = topItems().includes(item);
      if (isTop) {
        if (submenus.layers.length > 0 && submenuOf(item)) submenus.open(item, 'none');
        return;
      }
      if (submenuOf(item)) submenus.open(item, 'none');
      else if (submenus.layers.length > depth) submenus.close(depth);
    });

    // Manual popovers don't light-dismiss, so close the open branch when a
    // pointer lands outside the menu and its submenus. Capture phase still
    // fires when inner handlers stop propagation.
    on(
      root.ownerDocument,
      'pointerdown',
      (e) => {
        if (submenus.layers.length === 0) return;
        const node = e.target as Node;
        const inside =
          root.contains(node) || submenus.layers.some((layer) => layer.submenu.contains(node));
        if (!inside) submenus.close(0);
      },
      true,
    );

    const openByValue = (value: string) => {
      const items = topItems();
      const index = items.findIndex((item, i) => valueOf(item, i) === value);
      if (index !== -1) submenus.open(items[index], 'none');
    };
    if (options.defaultValue != null) openByValue(options.defaultValue);
    lastValue = currentValue();

    return {
      get value() {
        return currentValue();
      },
      setValue(value) {
        if (value === null) submenus.close(0);
        else openByValue(value);
      },
    };
  },
});

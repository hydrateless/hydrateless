import {
  defineEnhancer,
  ensureId,
  setAttrs,
  createTypeahead,
  isTypeaheadKey,
  supportsPopover,
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
} from '../core/index.js';

/** Options for {@link enhanceMenu}. */
export type EnhanceMenuOptions = {
  /** Layout of the top-level menu. Defaults to `horizontal` (menubar). */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Value of the submenu to open on enhance. Submenu values come from
   * `data-hl-value` on each top-level trigger, defaulting to the index.
   */
  defaultValue?: string | null;
  /** Called with the open submenu's value (or `null`) after every change. */
  onValueChange?: (value: string | null) => void;
  /**
   * Called with the item's value when a leaf menu item is activated. For
   * `menuitemcheckbox`/`menuitemradio` items, `checked` is the new state.
   */
  onSelect?: (value: string, item: HTMLElement, checked?: boolean) => void;
};

/** Imperative handle returned by {@link enhanceMenu}. */
export type MenuApi = {
  /** Value of the currently open submenu, or `null` when all are closed. */
  readonly value: string | null;
  /** Open the submenu with `value` (closing any other), or pass `null` to close. */
  setValue: (value: string | null) => void;
};

/**
 * Menubar / navigation-menu pattern with single-level submenus. Without
 * JavaScript the stylesheet reveals submenus on hover and `:focus-within`, so
 * the navigation stays usable; this enhancer marks the root `data-hl-ready`
 * and takes over. Top-level items use a roving tabindex with orientation-aware
 * arrow navigation; submenu triggers expose `aria-haspopup`/`aria-expanded`
 * and open on Enter/Space/arrow or click. Submenus are promoted to native
 * `popover="manual"` surfaces so they render in the top layer, placed against
 * their trigger with CSS anchor positioning (with a JS fallback on engines
 * without it). Submenu items support arrow/Home/End/typeahead with disabled
 * items skipped, `menuitemcheckbox`/`menuitemradio` state, Escape to close,
 * and Left/Right (Left alone when vertical) to move between adjacent top-level
 * menus. The open submenu is observable through `onValueChange`/`hl:change`,
 * activating a leaf item emits a cancelable `hl:select`, and the open submenu
 * is controllable through the returned API.
 */
export const enhanceMenu = defineEnhancer<EnhanceMenuOptions, MenuApi>({
  name: 'menu',
  selector: '[data-hl-menu]',
  setup({ root, options, on, add, emit }) {
    const vertical =
      root.getAttribute('aria-orientation') === 'vertical' || options.orientation === 'vertical';
    setAttrs(root, {
      role: root.getAttribute('role') || 'menubar',
      'aria-orientation': vertical ? 'vertical' : 'horizontal',
    });

    const topItems = menuItemsOf(root);
    if (topItems.length === 0) return;

    const typeahead = createTypeahead();
    const usePopover = supportsPopover();

    const submenuOf = (item: HTMLElement): HTMLElement | null => {
      const scope = item.parentElement ?? root;
      return scope.querySelector<HTMLElement>(
        ':scope > [role="menu"], :scope > [data-hl-menu-submenu]',
      );
    };
    const subItemsOf = (submenu: HTMLElement) => menuItemsOf(submenu);

    const valueOf = (item: HTMLElement, i: number): string =>
      item.getAttribute('data-hl-value') ?? String(i);
    const values = topItems.map(valueOf);

    let openIndex = -1;
    let stopPositioning: Disposer = noop;
    add(() => stopPositioning());

    // Signal to CSS that JS owns submenu visibility, so the hover/focus-within
    // no-JS baseline stands down. Removed on destroy so the baseline returns.
    root.setAttribute('data-hl-ready', '');
    add(() => root.removeAttribute('data-hl-ready'));

    topItems.forEach((item, i) => {
      item.tabIndex = i === 0 ? 0 : -1;
      const submenu = submenuOf(item);
      if (submenu) {
        const submenuId = ensureId(submenu, 'hl-submenu');
        setAttrs(item, {
          'aria-haspopup': 'menu',
          'aria-expanded': 'false',
          'aria-controls': submenuId,
        });
        setAttrs(submenu, { role: 'menu' });
        submenu.hidden = true;
        add(() => {
          submenu.hidden = false;
        });
        prepareMenuItems(subItemsOf(submenu));

        if (usePopover) {
          // `manual` keeps the browser from light-dismissing while arrow keys
          // move between adjacent submenus; outside clicks are handled below.
          submenu.setAttribute('popover', 'manual');
          add(() => submenu.removeAttribute('popover'));
          // Anchor the top-layer submenu to its trigger item for CSS anchor
          // positioning; engines without it get the JS fallback on open.
          const anchorName = `--${ensureId(item, 'hl-menu-anchor')}`;
          item.style.setProperty('anchor-name', anchorName);
          submenu.style.setProperty('position-anchor', anchorName);
        }
      }
    });

    const notify = () => {
      const value = openIndex === -1 ? null : values[openIndex];
      options.onValueChange?.(value);
      emit(Events.change, { value });
    };

    const focusTop = (index: number) => {
      if (index === -1) return;
      topItems.forEach((item, i) => (item.tabIndex = i === index ? 0 : -1));
      topItems[index]?.focus();
    };
    const moveTop = (from: number, direction: MoveDirection) =>
      focusTop(nextEnabledIndex(topItems, from, direction));

    const closeSubmenu = (index: number, restoreFocus = false, silent = false) => {
      const item = topItems[index];
      const submenu = item ? submenuOf(item) : null;
      if (item && submenu) {
        stopPositioning();
        stopPositioning = noop;
        if (usePopover && submenu.matches(':popover-open')) submenu.hidePopover();
        submenu.hidden = true;
        setAttrs(item, { 'aria-expanded': 'false' });
        if (restoreFocus) item.focus();
      }
      if (openIndex === index) {
        openIndex = -1;
        if (!silent) notify();
      }
    };

    const openSubmenu = (index: number, focusLast = false, moveFocus = true) => {
      const item = topItems[index];
      const submenu = item ? submenuOf(item) : null;
      if (!item || !submenu || isDisabledItem(item)) return false;
      if (openIndex === index) return true;
      if (openIndex !== -1) closeSubmenu(openIndex, false, true);
      submenu.hidden = false;
      if (usePopover) {
        submenu.showPopover();
        stopPositioning = keepPositioned(item, submenu, {
          placement: vertical ? 'right-start' : 'bottom-start',
        });
      }
      setAttrs(item, { 'aria-expanded': 'true' });
      openIndex = index;
      if (moveFocus) {
        const subs = subItemsOf(submenu);
        const target = nextEnabledIndex(subs, -1, focusLast ? 'last' : 'first');
        if (target !== -1) subs[target].focus();
      }
      notify();
      return true;
    };

    const indexOfTop = (el: Element | null) => topItems.findIndex((item) => item === el);

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
      if (openIndex !== -1) closeSubmenu(openIndex, true);
    };

    on<KeyboardEvent>(root, 'keydown', (e) => {
      const target = e.target as HTMLElement;
      const topIdx = indexOfTop(target);

      if (topIdx !== -1) {
        const nextKey = vertical ? Keys.ArrowDown : Keys.ArrowRight;
        const prevKey = vertical ? Keys.ArrowUp : Keys.ArrowLeft;
        const openKey = vertical ? Keys.ArrowRight : Keys.ArrowDown;
        const hasSubmenu = !!submenuOf(target);
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
          openSubmenu(topIdx, false);
        } else if (hasSubmenu && !vertical && e.key === Keys.ArrowUp) {
          e.preventDefault();
          openSubmenu(topIdx, true);
        } else if (!hasSubmenu && (e.key === Keys.Enter || e.key === Keys.Space)) {
          if (target.tagName !== 'BUTTON') {
            e.preventDefault();
            target.click();
          }
        } else if (isTypeaheadKey(e)) {
          const match = typeahead(
            e.key,
            topItems.map((item) => item.textContent ?? ''),
            topIdx,
          );
          if (match !== -1 && !isDisabledItem(topItems[match])) focusTop(match);
        }
        return;
      }

      // Inside a submenu.
      const submenu = target.closest<HTMLElement>('[role="menu"]');
      if (!submenu) return;
      const subs = subItemsOf(submenu);
      const subIdx = subs.indexOf(target);
      const parentIdx = topItems.findIndex((item) => submenuOf(item) === submenu);

      const move = (direction: MoveDirection) => {
        const index = nextEnabledIndex(subs, subIdx, direction);
        if (index !== -1) subs[index].focus();
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
          closeSubmenu(parentIdx, true);
          break;
        case Keys.Enter:
        case Keys.Space:
          if (target.tagName !== 'BUTTON') {
            e.preventDefault();
            target.click();
          }
          break;
        case Keys.ArrowRight:
        case Keys.ArrowLeft: {
          if (vertical) {
            // In a vertical menubar the submenu opens to the side, so Left
            // walks back to its trigger; Right has nowhere further to go.
            if (e.key === Keys.ArrowLeft) {
              e.preventDefault();
              closeSubmenu(parentIdx, true);
            }
            break;
          }
          e.preventDefault();
          closeSubmenu(parentIdx);
          const dir = e.key === Keys.ArrowRight ? 'next' : 'prev';
          const targetIdx = nextEnabledIndex(topItems, parentIdx, dir);
          focusTop(targetIdx);
          if (targetIdx !== -1 && submenuOf(topItems[targetIdx])) openSubmenu(targetIdx);
          break;
        }
        default:
          if (isTypeaheadKey(e)) {
            const match = typeahead(
              e.key,
              subs.map((s) => s.textContent ?? ''),
              subIdx,
            );
            if (match !== -1 && !isDisabledItem(subs[match])) subs[match]?.focus();
          }
      }
    });

    topItems.forEach((item, i) => {
      if (submenuOf(item)) {
        on(item, 'click', (e) => {
          e.preventDefault();
          if (openIndex === i) closeSubmenu(i, true);
          else openSubmenu(i);
        });
      } else {
        on(item, 'click', (e) => select(item, e));
      }
    });

    on(root, 'click', (e) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>('[role^="menuitem"]');
      if (!item || topItems.includes(item)) return;
      // A leaf item inside a submenu.
      select(item, e);
    });

    // Manual popovers don't light-dismiss, so close an open submenu when a
    // pointer lands outside the menu. Capture phase still fires when inner
    // handlers stop propagation.
    on(
      root.ownerDocument,
      'pointerdown',
      (e) => {
        if (openIndex === -1) return;
        const node = e.target as Node;
        const submenu = submenuOf(topItems[openIndex]);
        if (!root.contains(node) && !submenu?.contains(node)) closeSubmenu(openIndex);
      },
      true,
    );

    if (options.defaultValue != null) {
      const index = values.indexOf(options.defaultValue);
      if (index !== -1) openSubmenu(index, false, false);
    }

    return {
      get value() {
        return openIndex === -1 ? null : values[openIndex];
      },
      setValue(value) {
        if (value === null) {
          if (openIndex !== -1) closeSubmenu(openIndex);
          return;
        }
        const index = values.indexOf(value);
        if (index !== -1) openSubmenu(index, false, false);
      },
    };
  },
});

import {
  defineEnhancer,
  ensureId,
  setAttrs,
  nextIndex,
  createTypeahead,
  supportsPopover,
  supportsAnchorPositioning,
  positionFallback,
  Events,
  type MoveDirection,
} from '../core/index.js';

/** Options for {@link enhanceMenu}. */
export type EnhanceMenuOptions = {
  /** Layout of the top-level menu. Defaults to `horizontal` (menubar). */
  orientation?: 'horizontal' | 'vertical';
  /** Called with the open submenu's value (or `null`) after every change. */
  onOpenChange?: (value: string | null) => void;
  /** Called with the item's value when a leaf menu item is activated. */
  onSelect?: (value: string, item: HTMLElement) => void;
};

/** Imperative handle returned by {@link enhanceMenu}. */
export type MenuApi = {
  /** Value of the currently open submenu, or `null` when all are closed. */
  readonly open: string | null;
  /** Open the submenu with `value` (closing any other), or pass `null` to close. */
  setOpen: (value: string | null) => void;
};

/**
 * Menubar / navigation-menu pattern with single-level submenus. Top-level items
 * use a roving tabindex with orientation-aware arrow navigation; submenu
 * triggers expose `aria-haspopup`/`aria-expanded` and open on Enter/Space/arrow
 * or click. Submenus are promoted to native `popover="manual"` surfaces so they
 * render in the top layer, placed against their trigger with CSS anchor
 * positioning (with a JS fallback on engines without it). Submenu items support
 * arrow/Home/End/typeahead, Escape to close, and Left/Right to move between
 * adjacent top-level menus. The open submenu is observable through
 * `onOpenChange`/`hl:open-change`, activating a leaf item emits a cancelable
 * `hl:select`, and the open submenu is controllable through the returned API.
 * Submenu values come from `data-hl-value` on each trigger, defaulting to the
 * index.
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

    const topItems = Array.from(
      root.querySelectorAll<HTMLElement>(
        ':scope > li > [role="menuitem"], :scope > [role="menuitem"]',
      ),
    );
    if (topItems.length === 0) return;

    const typeahead = createTypeahead();
    const usePopover = supportsPopover();

    const submenuOf = (item: HTMLElement): HTMLElement | null => {
      const scope = item.parentElement ?? root;
      return scope.querySelector<HTMLElement>(
        ':scope > [role="menu"], :scope > [data-hl-menu-submenu]',
      );
    };
    const subItemsOf = (submenu: HTMLElement) =>
      Array.from(
        submenu.querySelectorAll<HTMLElement>(
          ':scope > li > [role="menuitem"], :scope > [role="menuitem"]',
        ),
      );

    const valueOf = (item: HTMLElement, i: number): string =>
      item.getAttribute('data-hl-value') ?? String(i);
    const values = topItems.map(valueOf);

    let openIndex = -1;

    topItems.forEach((item, i) => {
      item.tabIndex = i === 0 ? 0 : -1;
      const submenu = submenuOf(item);
      if (submenu) {
        const submenuId = ensureId(submenu, 'hl-submenu');
        setAttrs(item, {
          'aria-haspopup': 'true',
          'aria-expanded': 'false',
          'aria-controls': submenuId,
        });
        setAttrs(submenu, { role: 'menu' });
        submenu.hidden = true;
        for (const sub of subItemsOf(submenu)) sub.tabIndex = -1;

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
      options.onOpenChange?.(value);
      emit(Events.openChange, { open: value !== null, value });
    };

    const focusTop = (index: number) => {
      topItems.forEach((item, i) => (item.tabIndex = i === index ? 0 : -1));
      topItems[index]?.focus();
    };

    const closeSubmenu = (index: number, restoreFocus = false, silent = false) => {
      const item = topItems[index];
      const submenu = item ? submenuOf(item) : null;
      if (item && submenu) {
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

    const openSubmenu = (index: number, focusLast = false) => {
      const item = topItems[index];
      const submenu = item ? submenuOf(item) : null;
      if (!item || !submenu) return false;
      if (openIndex === index) return true;
      if (openIndex !== -1) closeSubmenu(openIndex, false, true);
      submenu.hidden = false;
      if (usePopover) {
        submenu.showPopover();
        if (!supportsAnchorPositioning()) {
          positionFallback(item, submenu, {
            placement: vertical ? 'right-start' : 'bottom-start',
          });
        }
      }
      setAttrs(item, { 'aria-expanded': 'true' });
      openIndex = index;
      const subs = subItemsOf(submenu);
      (focusLast ? subs[subs.length - 1] : subs[0])?.focus();
      notify();
      return true;
    };

    const indexOfTop = (el: Element | null) => topItems.findIndex((item) => item === el);

    const select = (item: HTMLElement, event?: Event) => {
      const value = item.dataset.hlValue ?? item.textContent?.trim() ?? '';
      if (!emit(Events.select, { value, item }, { cancelable: true })) {
        event?.preventDefault();
        return;
      }
      options.onSelect?.(value, item);
      if (openIndex !== -1) closeSubmenu(openIndex);
    };

    on<KeyboardEvent>(root, 'keydown', (e) => {
      const target = e.target as HTMLElement;
      const topIdx = indexOfTop(target);

      if (topIdx !== -1) {
        const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
        const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';
        const openKey = vertical ? 'ArrowRight' : 'ArrowDown';
        const hasSubmenu = !!submenuOf(target);
        if (e.key === nextKey) {
          e.preventDefault();
          focusTop(nextIndex(topIdx, topItems.length, 'next'));
        } else if (e.key === prevKey) {
          e.preventDefault();
          focusTop(nextIndex(topIdx, topItems.length, 'prev'));
        } else if (e.key === 'Home') {
          e.preventDefault();
          focusTop(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          focusTop(topItems.length - 1);
        } else if (hasSubmenu && (e.key === openKey || e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          openSubmenu(topIdx, false);
        } else if (hasSubmenu && !vertical && e.key === 'ArrowUp') {
          e.preventDefault();
          openSubmenu(topIdx, true);
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          const match = typeahead(
            e.key,
            topItems.map((item) => item.textContent ?? ''),
            topIdx,
          );
          if (match !== -1) focusTop(match);
        }
        return;
      }

      // Inside a submenu.
      const submenu = target.closest<HTMLElement>('[role="menu"]');
      if (!submenu) return;
      const subs = subItemsOf(submenu);
      const subIdx = subs.indexOf(target);
      const parentIdx = indexOfTop(
        submenu.parentElement?.querySelector('[role="menuitem"]') ?? null,
      );

      const move = (direction: MoveDirection) =>
        subs[nextIndex(subIdx, subs.length, direction)]?.focus();

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
          closeSubmenu(parentIdx, true);
          break;
        case 'ArrowRight':
        case 'ArrowLeft': {
          if (vertical) break;
          e.preventDefault();
          closeSubmenu(parentIdx);
          const dir = e.key === 'ArrowRight' ? 'next' : 'prev';
          const targetIdx = nextIndex(parentIdx, topItems.length, dir);
          focusTop(targetIdx);
          if (submenuOf(topItems[targetIdx])) openSubmenu(targetIdx);
          break;
        }
        default:
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            const match = typeahead(
              e.key,
              subs.map((s) => s.textContent ?? ''),
              subIdx,
            );
            if (match !== -1) subs[match]?.focus();
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
      const item = (e.target as HTMLElement).closest<HTMLElement>('[role="menuitem"]');
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

    return {
      get open() {
        return openIndex === -1 ? null : values[openIndex];
      },
      setOpen(value) {
        if (value === null) {
          if (openIndex !== -1) closeSubmenu(openIndex);
          return;
        }
        const index = values.indexOf(value);
        if (index !== -1) openSubmenu(index);
      },
    };
  },
});

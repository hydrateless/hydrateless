import {
  defineEnhancer,
  ensureId,
  setAttrs,
  onClickOutside,
  nextIndex,
  createTypeahead,
  type MoveDirection,
} from '../core/index.js';

export type EnhanceMenuOptions = {
  orientation?: 'horizontal' | 'vertical';
};

/**
 * Menubar / navigation-menu pattern with single-level submenus. Top-level items
 * use a roving tabindex with orientation-aware arrow navigation; submenu
 * triggers expose `aria-haspopup`/`aria-expanded` and open on Enter/Space/arrow
 * or click. Submenu items support arrow/Home/End/typeahead, Escape to close,
 * and Left/Right to move between adjacent top-level menus.
 */
export const enhanceMenu = defineEnhancer<EnhanceMenuOptions>({
  name: 'menu',
  selector: '[data-hl-menu]',
  setup({ root, options, on, add }) {
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
      }
    });

    const focusTop = (index: number) => {
      topItems.forEach((item, i) => (item.tabIndex = i === index ? 0 : -1));
      topItems[index]?.focus();
    };

    const closeSubmenu = (index: number, restoreFocus = false) => {
      const item = topItems[index];
      const submenu = item ? submenuOf(item) : null;
      if (item && submenu) {
        submenu.hidden = true;
        setAttrs(item, { 'aria-expanded': 'false' });
        if (restoreFocus) item.focus();
      }
      if (openIndex === index) openIndex = -1;
    };

    const openSubmenu = (index: number, focusLast = false) => {
      const item = topItems[index];
      const submenu = item ? submenuOf(item) : null;
      if (!item || !submenu) return false;
      if (openIndex !== -1 && openIndex !== index) closeSubmenu(openIndex);
      submenu.hidden = false;
      setAttrs(item, { 'aria-expanded': 'true' });
      openIndex = index;
      const subs = subItemsOf(submenu);
      (focusLast ? subs[subs.length - 1] : subs[0])?.focus();
      return true;
    };

    const indexOfTop = (el: Element | null) => topItems.findIndex((item) => item === el);

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
      }
    });

    add(
      onClickOutside(root, () => {
        if (openIndex !== -1) closeSubmenu(openIndex);
      }),
    );
  },
});

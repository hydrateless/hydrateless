import { ensureId, setAttrs } from './dom.js';
import { noop, type Disposer } from './lifecycle.js';
import { keepPositioned, type Placement } from './platform.js';
import { menuItemsOf, nextEnabledIndex, prepareMenuItems } from './menu-items.js';
import type { EnhancerContext } from './define.js';

/** Selector for a menu surface: a top-level menubar/menu or a nested submenu. */
export const MENU_SURFACE_SELECTOR = '[role="menu"], [role="menubar"], [data-hl-submenu]';

/**
 * The submenu a menu item opens: a `[role="menu"]` or `[data-hl-submenu]`
 * that is a sibling of the item inside the same wrapper (usually an `<li>`).
 */
export function submenuOf(item: HTMLElement): HTMLElement | null {
  const scope = item.parentElement;
  if (!scope) return null;
  return scope.querySelector<HTMLElement>(':scope > [role="menu"], :scope > [data-hl-submenu]');
}

/** The menu surface (`role="menu"`, `role="menubar"`, or `[data-hl-submenu]`) that contains `el`. */
export function menuOf(el: Element): HTMLElement | null {
  return el.closest<HTMLElement>(MENU_SURFACE_SELECTOR);
}

/** One open submenu: the item that opened it and the surface it revealed. */
export interface SubmenuLayer {
  trigger: HTMLElement;
  submenu: HTMLElement;
}

/** Configuration for {@link createSubmenus}. */
export interface SubmenuOptions {
  /** Promote submenus to `popover="manual"` so they render in the top layer. */
  usePopover: boolean;
  /** Run the JS positioning fallback on engines without CSS anchor positioning. */
  position: boolean;
  /** Placement of a submenu opened from an item at `depth` (`0` is a top-level trigger). */
  placement: (depth: number) => Placement;
  /** Called after any submenu opens or closes. */
  onChange?: () => void;
}

/** Controller returned by {@link createSubmenus}. */
export interface SubmenuController {
  /**
   * Wire every item inside `scope` (recursively) that has a submenu: ARIA,
   * `hidden`, popover promotion, anchor names, and item normalization.
   * Idempotent, so it can run again after the DOM changes.
   */
  prepare: (scope: HTMLElement) => void;
  /** Open `trigger`'s submenu, closing any branch that isn't an ancestor of it. */
  open: (trigger: HTMLElement, focus?: 'first' | 'last' | 'none') => boolean;
  /** Close the submenus from `depth` outward (`0` closes everything). */
  close: (depth: number, restoreFocus?: boolean) => void;
  /** How many submenus deep `el` sits (`0` inside the top-level surface). */
  depthOf: (el: Element) => number;
  /** The open layers, outermost first. */
  readonly layers: readonly SubmenuLayer[];
}

/**
 * Nested submenu machinery shared by the dropdown and menubar enhancers. Each
 * submenu is a native `popover="manual"` (where available) anchored to its
 * trigger with CSS anchor positioning (JS fallback otherwise). The controller
 * tracks the open branch as a stack of layers so keyboard handlers can open
 * one level deeper or close one level back, and so a click outside or a
 * closing parent can collapse the whole branch at once.
 */
export function createSubmenus(
  ctx: Pick<EnhancerContext<object>, 'add'>,
  options: SubmenuOptions,
): SubmenuController {
  const prepared = new WeakSet<HTMLElement>();
  const layers: SubmenuLayer[] = [];
  const stops: Disposer[] = [];
  ctx.add(() => close(0));

  const prepare = (scope: HTMLElement) => {
    for (const item of menuItemsOf(scope)) {
      const submenu = submenuOf(item);
      if (!submenu) continue;
      if (!prepared.has(submenu)) {
        prepared.add(submenu);
        const submenuId = ensureId(submenu, 'hl-submenu');
        setAttrs(item, {
          'aria-haspopup': 'menu',
          'aria-expanded': 'false',
          'aria-controls': submenuId,
        });
        setAttrs(submenu, {
          role: 'menu',
          'aria-labelledby': ensureId(item, 'hl-submenu-trigger'),
        });
        submenu.hidden = true;
        ctx.add(() => {
          submenu.hidden = false;
          setAttrs(item, { 'aria-expanded': null });
        });
        if (options.usePopover) {
          // `manual` keeps the browser from light-dismissing while arrow keys
          // move between sibling submenus; the enhancer handles outside clicks.
          submenu.setAttribute('popover', 'manual');
          ctx.add(() => submenu.removeAttribute('popover'));
          const anchorName = `--${ensureId(item, 'hl-submenu-trigger')}`;
          item.style.setProperty('anchor-name', anchorName);
          submenu.style.setProperty('position-anchor', anchorName);
        }
      }
      prepareMenuItems(menuItemsOf(submenu));
      prepare(submenu);
    }
  };

  const depthOf = (el: Element): number => {
    for (let i = layers.length - 1; i >= 0; i -= 1) {
      if (layers[i].submenu.contains(el)) return i + 1;
    }
    return 0;
  };

  const hide = (layer: SubmenuLayer, stop: Disposer) => {
    stop();
    if (options.usePopover && layer.submenu.matches(':popover-open')) layer.submenu.hidePopover();
    layer.submenu.hidden = true;
    setAttrs(layer.trigger, { 'aria-expanded': 'false' });
  };

  function close(depth: number, restoreFocus = false) {
    if (depth >= layers.length) return;
    const focusTarget = layers[depth]?.trigger;
    while (layers.length > depth) {
      const layer = layers.pop()!;
      const stop = stops.pop() ?? noop;
      hide(layer, stop);
    }
    if (restoreFocus) focusTarget?.focus();
    options.onChange?.();
  }

  const open = (trigger: HTMLElement, focus: 'first' | 'last' | 'none' = 'first'): boolean => {
    const submenu = submenuOf(trigger);
    if (!submenu) return false;
    const depth = depthOf(trigger);
    const current = layers[depth];
    if (current?.trigger !== trigger) {
      // Collapse any sibling branch before opening this one.
      if (layers.length > depth) close(depth);
      submenu.hidden = false;
      let stop: Disposer = noop;
      if (options.usePopover) submenu.showPopover();
      if (options.position) {
        stop = keepPositioned(trigger, submenu, { placement: options.placement(depth) });
      }
      setAttrs(trigger, { 'aria-expanded': 'true' });
      layers.push({ trigger, submenu });
      stops.push(stop);
      options.onChange?.();
    }
    if (focus !== 'none') {
      const items = menuItemsOf(submenu);
      const index = nextEnabledIndex(items, -1, focus);
      if (index !== -1) items[index].focus();
    }
    return true;
  };

  return { prepare, open, close, depthOf, layers };
}

import { defineEnhancer, type SetOptions } from '../core/define.js';
import { ensureId, setAttrs } from '../core/dom.js';
import { keepPositioned, parsePlacement, type Placement } from '../core/platform.js';
import { combine, noop, on as listen, type Disposer } from '../core/lifecycle.js';
import { Events } from '../core/events.js';

/** Options for {@link enhancePopover}. */
export type EnhancePopoverOptions = {
  /** `click` (default) toggles via the native invoker; `hover` opens on pointer/focus. */
  triggerEvent?: 'click' | 'hover';
  /** Placement passed to the JS positioning fallback. Defaults to `bottom`. */
  placement?: Placement;
  /** Run the JS positioning fallback when CSS anchor positioning is missing. Defaults to `true`. */
  position?: boolean;
  /** Grace period in ms before a hover popover closes. Defaults to `100`. */
  hoverCloseDelay?: number;
  /** Show the popover immediately on enhance. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called after the popover shows or hides. */
  onOpenChange?: (open: boolean) => void;
};

/** Imperative handle returned by {@link enhancePopover}. */
export type PopoverApi = {
  /** Whether the popover is currently shown. */
  readonly open: boolean;
  /** Show or hide the popover. Pass `silent: true` to skip change notifications. */
  setOpen: (open: boolean, options?: SetOptions) => void;
};

/**
 * Thin upgrade over the native Popover API. The popover lives in the top layer
 * with light-dismiss and Escape handled by the browser, and a button with
 * `popovertarget` (or `command="toggle-popover"`) opens it with no JavaScript.
 * CSS anchor positioning places it against the invoker. This enhancer only
 * mirrors `aria-expanded` onto the invokers, runs a JS positioning fallback
 * (kept in sync on scroll and resize) on engines without anchor positioning,
 * adds optional hover triggering, and exposes an imperative open/close API.
 * Markup can set `data-hl-trigger-event`, `data-hl-placement`,
 * `data-hl-hover-close-delay`, and `data-hl-default-open` on the popover.
 */
export const enhancePopover = defineEnhancer<EnhancePopoverOptions, PopoverApi>({
  name: 'popover',
  // Matches the auto-loader manifest exactly: enhancement is an explicit
  // opt-in via `data-hl-popover`, so bare `[popover]` elements (often used
  // for app-specific overlays) are left alone.
  selector: '[data-hl-popover]',
  defaults: {
    triggerEvent: 'click',
    placement: 'bottom',
    position: true,
    hoverCloseDelay: 100,
    defaultOpen: false,
  },
  attributes: {
    triggerEvent: ['click', 'hover'],
    placement: parsePlacement,
    position: 'boolean',
    hoverCloseDelay: 'number',
    defaultOpen: 'boolean',
  },
  setup({ root, options, on, add, onUpdate, emit }) {
    const popover = root;
    const doc = popover.ownerDocument;
    const win = doc.defaultView;

    if (!popover.hasAttribute('popover')) popover.setAttribute('popover', 'auto');
    const popoverId = ensureId(popover, 'hl-popover');

    const openers = Array.from(doc.querySelectorAll<HTMLButtonElement>('[popovertarget]')).filter(
      (el) => el.popoverTargetElement === popover || el.getAttribute('popovertarget') === popoverId,
    );
    for (const opener of openers) {
      setAttrs(opener, { 'aria-expanded': 'false', 'aria-controls': popoverId });
    }
    const anchor = openers[0] ?? popover;

    let stopPositioning: Disposer = noop;
    add(() => stopPositioning());

    const isOpen = () => popover.matches(':popover-open');
    let suppressNotify = false;

    const position = () => {
      stopPositioning();
      stopPositioning =
        isOpen() && options.position
          ? keepPositioned(anchor, popover, { placement: options.placement })
          : noop;
    };

    // The native `toggle` event is the single source of truth for open state.
    on(popover, 'toggle', (e) => {
      const open = (e as ToggleEvent).newState === 'open';
      const silent = suppressNotify;
      suppressNotify = false;
      stopPositioning();
      stopPositioning =
        open && options.position
          ? keepPositioned(anchor, popover, { placement: options.placement })
          : noop;
      for (const opener of openers) {
        setAttrs(opener, { 'aria-expanded': open ? 'true' : 'false' });
      }
      if (!silent) {
        options.onOpenChange?.(open);
        emit(Events.openChange, { open });
      }
    });

    const show = (silent = false) => {
      if (isOpen()) return;
      if (silent) suppressNotify = true;
      popover.showPopover();
    };
    const hide = (silent = false) => {
      if (!isOpen()) return;
      if (silent) suppressNotify = true;
      popover.hidePopover();
    };

    let unbindHover: Disposer = noop;
    let hoverBound = false;
    // Rebind only when the trigger mode changes: rebinding cancels a pending
    // hover close, which would leave the popover open after the pointer left.
    // The listeners read `hoverCloseDelay` live, so other updates need nothing.
    const syncHover = () => {
      const wantHover = options.triggerEvent === 'hover';
      if (wantHover === hoverBound) return;
      unbindHover();
      unbindHover = noop;
      hoverBound = wantHover;
      if (!wantHover) return;
      let closeTimer: number | undefined;
      const cancelClose = () => {
        if (closeTimer !== undefined) win?.clearTimeout(closeTimer);
        closeTimer = undefined;
      };
      const scheduleHide = () => {
        cancelClose();
        closeTimer = win?.setTimeout(() => hide(), options.hoverCloseDelay);
      };
      const bag: Disposer[] = [cancelClose];
      for (const opener of openers) {
        bag.push(
          listen(opener, 'mouseenter', () => show()),
          listen(opener, 'mouseleave', scheduleHide),
          listen(opener, 'focus', () => show()),
          listen(opener, 'blur', scheduleHide),
        );
      }
      bag.push(
        listen(popover, 'mouseenter', cancelClose),
        listen(popover, 'mouseleave', scheduleHide),
      );
      unbindHover = combine(bag);
    };
    add(() => unbindHover());
    syncHover();

    onUpdate(() => {
      syncHover();
      position();
    });

    if (options.defaultOpen) show();

    return {
      get open() {
        return isOpen();
      },
      setOpen(next, { silent = false } = {}) {
        if (next) show(silent);
        else hide(silent);
      },
    };
  },
});

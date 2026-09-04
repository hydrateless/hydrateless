import { defineEnhancer } from '../core/define.js';
import { ensureId, setAttrs } from '../core/dom.js';
import { keepPositioned, parsePlacement, type Placement } from '../core/platform.js';
import { noop, type Disposer } from '../core/lifecycle.js';
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
  /** Show or hide the popover. */
  setOpen: (open: boolean) => void;
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
  setup({ root, options, on, add, emit }) {
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

    // The native `toggle` event is the single source of truth for open state.
    on(popover, 'toggle', (e) => {
      const open = (e as ToggleEvent).newState === 'open';
      stopPositioning();
      stopPositioning =
        open && options.position
          ? keepPositioned(anchor, popover, { placement: options.placement })
          : noop;
      for (const opener of openers) {
        setAttrs(opener, { 'aria-expanded': open ? 'true' : 'false' });
      }
      options.onOpenChange?.(open);
      emit(Events.openChange, { open });
    });

    const isOpen = () => popover.matches(':popover-open');
    const show = () => {
      if (!isOpen()) popover.showPopover();
    };
    const hide = () => {
      if (isOpen()) popover.hidePopover();
    };

    if (options.triggerEvent === 'hover') {
      let closeTimer: number | undefined;
      const cancelClose = () => {
        if (closeTimer !== undefined) win?.clearTimeout(closeTimer);
        closeTimer = undefined;
      };
      const scheduleHide = () => {
        cancelClose();
        closeTimer = win?.setTimeout(hide, options.hoverCloseDelay);
      };
      add(cancelClose);
      for (const opener of openers) {
        on(opener, 'mouseenter', show);
        on(opener, 'mouseleave', scheduleHide);
        on(opener, 'focus', show);
        on(opener, 'blur', scheduleHide);
      }
      on(popover, 'mouseenter', cancelClose);
      on(popover, 'mouseleave', scheduleHide);
    }

    if (options.defaultOpen) show();

    return {
      get open() {
        return isOpen();
      },
      setOpen(next) {
        if (next) show();
        else hide();
      },
    };
  },
});

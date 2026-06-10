import {
  defineEnhancer,
  ensureId,
  setAttrs,
  resolveRef,
  onClickOutside,
  onEscape,
  placeFloating,
  Events,
  type Placement,
} from '../core/index.js';

export type EnhancePopoverOptions = {
  triggerEvent?: 'click' | 'hover';
  placement?: Placement;
  /** Position with collision-aware JS in the non-native fallback. */
  position?: boolean;
  /** Grace period in ms before a hover popover closes. Defaults to `100`. */
  hoverCloseDelay?: number;
  /** Show the popover immediately on enhance. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called after the popover shows or hides. */
  onOpenChange?: (open: boolean) => void;
};

export type PopoverApi = {
  /** Whether the popover is currently shown. */
  readonly open: boolean;
  /** Show or hide the popover. */
  setOpen: (open: boolean) => void;
};

/**
 * Drive a popover from `[data-hl-popover-open]`/`[data-hl-popover-close]`
 * triggers. Prefers the native Popover API (`showPopover`/`hidePopover`,
 * including light-dismiss) and falls back to toggling `hidden` with JS
 * positioning, outside-click, and Escape dismissal. Triggers get
 * `aria-expanded`/`aria-controls` wiring; open state is observable through
 * `onOpenChange`/`hl:open-change` and controllable through the returned API.
 */
export const enhancePopover = defineEnhancer<EnhancePopoverOptions, PopoverApi>({
  name: 'popover',
  selector: '[data-hl-popover], [popover]',
  defaults: {
    triggerEvent: 'click',
    placement: 'bottom',
    position: true,
    hoverCloseDelay: 100,
    defaultOpen: false,
  },
  setup({ root, options, on, add, emit }) {
    const popover = root;
    const doc = popover.ownerDocument;
    const win = doc.defaultView;
    const isNative = () => popover.popover != null;
    const popoverId = ensureId(popover, 'hl-popover');

    const matching = (attr: string) =>
      Array.from(doc.querySelectorAll<HTMLElement>(`[${attr}]`)).filter(
        (el) => resolveRef(doc, el.getAttribute(attr)) === popover,
      );
    const openers = matching('data-hl-popover-open');
    const closers = matching('data-hl-popover-close');
    let anchor: HTMLElement = openers[0] ?? popover;

    for (const opener of openers) {
      setAttrs(opener, { 'aria-expanded': 'false', 'aria-controls': popoverId });
    }

    let isOpen = isNative() ? false : !popover.hidden;
    const notify = (open: boolean) => {
      if (open === isOpen) return;
      isOpen = open;
      for (const opener of openers) {
        setAttrs(opener, { 'aria-expanded': open ? 'true' : 'false' });
      }
      options.onOpenChange?.(open);
      emit(Events.openChange, { open });
    };

    let closeTimer: number | undefined;
    const cancelClose = () => {
      if (closeTimer !== undefined) {
        win?.clearTimeout(closeTimer);
        closeTimer = undefined;
      }
    };
    add(cancelClose);

    const show = (from?: HTMLElement) => {
      cancelClose();
      if (from) anchor = from;
      if (isNative()) {
        popover.showPopover();
      } else {
        popover.hidden = false;
        if (options.position) placeFloating(anchor, popover, { placement: options.placement });
      }
      notify(true);
    };
    const hide = () => {
      cancelClose();
      if (isNative()) popover.hidePopover();
      else popover.hidden = true;
      notify(false);
    };
    /** Hover-mode close with a grace period so the pointer can cross the gap. */
    const scheduleHide = () => {
      cancelClose();
      if (!win) return hide();
      closeTimer = win.setTimeout(hide, options.hoverCloseDelay);
    };

    for (const opener of openers) {
      if (options.triggerEvent === 'hover') {
        on(opener, 'mouseenter', () => show(opener));
        on(opener, 'mouseleave', scheduleHide);
        on(opener, 'focus', () => show(opener));
        on(opener, 'blur', scheduleHide);
      } else {
        on(opener, 'click', (e) => {
          e.preventDefault();
          if (isOpen) hide();
          else show(opener);
        });
      }
    }

    if (options.triggerEvent === 'hover') {
      on(popover, 'mouseenter', cancelClose);
      on(popover, 'mouseleave', scheduleHide);
    }

    for (const closer of closers) {
      on(closer, 'click', (e) => {
        e.preventDefault();
        hide();
      });
    }

    if (isNative()) {
      // Track light-dismiss and programmatic toggles from the native API.
      on(popover, 'toggle', (e) => {
        const open = (e as ToggleEvent).newState === 'open';
        notify(open);
      });
    } else if (options.triggerEvent === 'click') {
      add(onClickOutside(popover, () => isOpen && hide(), { ignore: openers }));
      add(onEscape(() => isOpen && hide(), doc));
    }

    if (options.defaultOpen) show();

    return {
      get open() {
        return isOpen;
      },
      setOpen(next) {
        if (next) show();
        else hide();
      },
    };
  },
});

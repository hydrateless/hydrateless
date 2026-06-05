import {
  defineEnhancer,
  resolveRef,
  onClickOutside,
  onEscape,
  placeFloating,
  type Placement,
} from '../core/index.js';

export type EnhancePopoverOptions = {
  triggerEvent?: 'click' | 'hover';
  placement?: Placement;
  /** Position with collision-aware JS in the non-native fallback. */
  position?: boolean;
};

/**
 * Drive a popover from `[data-hl-popover-open]`/`[data-hl-popover-close]`
 * triggers. Prefers the native Popover API (`showPopover`/`hidePopover`,
 * including light-dismiss) and falls back to toggling `hidden` with JS
 * positioning, outside-click, and Escape dismissal.
 */
export const enhancePopover = defineEnhancer<EnhancePopoverOptions>({
  name: 'popover',
  selector: '[data-hl-popover], [popover]',
  defaults: { triggerEvent: 'click', placement: 'bottom', position: true },
  setup({ root, options, on, add }) {
    const popover = root;
    const doc = popover.ownerDocument;
    const isNative = () => popover.popover != null;

    const matching = (attr: string) =>
      Array.from(doc.querySelectorAll<HTMLElement>(`[${attr}]`)).filter(
        (el) => resolveRef(doc, el.getAttribute(attr)) === popover,
      );
    const openers = matching('data-hl-popover-open');
    const closers = matching('data-hl-popover-close');
    let anchor: HTMLElement = openers[0] ?? popover;

    const show = (from?: HTMLElement) => {
      if (from) anchor = from;
      if (isNative()) {
        popover.showPopover();
      } else {
        popover.hidden = false;
        if (options.position) placeFloating(anchor, popover, { placement: options.placement });
      }
    };
    const hide = () => {
      if (isNative()) popover.hidePopover();
      else popover.hidden = true;
    };

    for (const opener of openers) {
      if (options.triggerEvent === 'hover') {
        on(opener, 'mouseenter', () => show(opener));
        on(opener, 'mouseleave', hide);
        on(opener, 'focus', () => show(opener));
        on(opener, 'blur', hide);
      } else {
        on(opener, 'click', (e) => {
          e.preventDefault();
          show(opener);
        });
      }
    }

    for (const closer of closers) {
      on(closer, 'click', (e) => {
        e.preventDefault();
        hide();
      });
    }

    // The native Popover API provides its own light-dismiss + Escape handling.
    if (!isNative() && options.triggerEvent === 'click') {
      add(onClickOutside(popover, () => !popover.hidden && hide(), { ignore: openers }));
      add(onEscape(() => !popover.hidden && hide(), doc));
    }
  },
});

import { defineEnhancer } from '../core/define.js';
import { ensureId, setAttrs, resolveRef } from '../core/dom.js';
import { Events } from '../core/events.js';
import { Keys } from '../core/keys.js';
import { noop, type Disposer } from '../core/lifecycle.js';
import {
  supportsPopover,
  keepPositioned,
  parsePlacement,
  type Placement,
} from '../core/platform.js';

/** Options for {@link enhanceTooltip}. */
export type EnhanceTooltipOptions = {
  /**
   * Preferred placement relative to the trigger; `start`/`end` are logical
   * inline sides. Defaults to `top`.
   */
  placement?: Placement;
  /** Run the JS positioning fallback when CSS anchor positioning is missing. Defaults to `true`. */
  position?: boolean;
  /** Delay in ms before showing on hover. Focus shows immediately. */
  showDelay?: number;
  /** Grace period in ms before hiding, so the pointer can reach the tooltip. */
  hideDelay?: number;
  /** Show the tooltip immediately on enhance. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called after the tooltip shows or hides. */
  onOpenChange?: (open: boolean) => void;
};

/** Imperative handle returned by {@link enhanceTooltip}. */
export type TooltipApi = {
  /** Whether the tooltip is currently shown. */
  readonly open: boolean;
  /** Show or hide the tooltip immediately (no delays). */
  setOpen: (open: boolean) => void;
};

/**
 * Upgrade a CSS tooltip with the behavior the platform can't express in styles
 * alone. The baseline needs no JavaScript: the stylesheet reveals the tip on
 * the trigger's `:hover`/`:focus-visible` and places it with CSS anchor
 * positioning. When this enhancer runs, it wires `role="tooltip"` and
 * `aria-describedby`, promotes the tip to a `popover="manual"` so it renders
 * in the top layer above any clipping ancestor (falling back to `hidden` on
 * engines without the Popover API), then takes over visibility (marking the
 * trigger `data-hl-tooltip-managed`) so it can add show/hide delays, a grace
 * period for crossing onto the tip, Escape-to-dismiss from anywhere while the
 * tip is shown, and a JS positioning fallback kept in sync on scroll and
 * resize. The chosen side is stamped on the tip as `data-hl-side` so the
 * stylesheet can pick the matching `position-area`. Visibility is observable
 * through `onOpenChange`/`hl:open-change` and controllable through the
 * returned API. Markup can set `data-hl-placement`, `data-hl-show-delay`,
 * `data-hl-hide-delay`, and `data-hl-default-open` on the trigger.
 */
export const enhanceTooltip = defineEnhancer<EnhanceTooltipOptions, TooltipApi>({
  name: 'tooltip',
  selector: '[data-hl-tooltip]',
  defaults: { placement: 'top', position: true, showDelay: 150, hideDelay: 100 },
  attributes: {
    placement: parsePlacement,
    position: 'boolean',
    showDelay: 'number',
    hideDelay: 'number',
    defaultOpen: 'boolean',
  },
  setup({ root, options, on, add, emit }) {
    const ref = root.getAttribute('aria-describedby') || root.getAttribute('data-hl-tooltip');
    const tip = resolveRef(root.ownerDocument, ref);
    if (!tip) return;

    const doc = root.ownerDocument;
    const win = doc.defaultView;
    const usePopover = supportsPopover();

    setAttrs(tip, { role: 'tooltip' });
    setAttrs(root, {
      'aria-describedby': ensureId(tip, 'hl-tooltip'),
      'data-hl-tooltip-managed': '',
    });
    add(() => root.removeAttribute('data-hl-tooltip-managed'));

    // The enhancer owns visibility now, so start closed (the no-JS CSS hover
    // baseline only applies when this code isn't running). A manual popover
    // never light-dismisses, which is right for a tooltip: pointer and focus
    // decide when it goes away.
    if (usePopover) {
      if (!tip.hasAttribute('popover')) tip.setAttribute('popover', 'manual');
      // The popover's own UA styling now hides it; a leftover `hidden` would
      // keep it invisible even while shown.
      const wasHidden = tip.hasAttribute('hidden');
      tip.removeAttribute('hidden');
      add(() => {
        tip.removeAttribute('popover');
        if (wasHidden) tip.setAttribute('hidden', '');
      });
    } else {
      tip.setAttribute('hidden', '');
      add(() => tip.removeAttribute('hidden'));
    }

    // Link the tip to its trigger for CSS anchor positioning, and tell the
    // stylesheet which side was asked for.
    const anchorName = `--${ensureId(root, 'hl-tooltip-anchor')}`;
    root.style.setProperty('anchor-name', anchorName);
    tip.style.setProperty('position-anchor', anchorName);
    const placement = options.placement!;
    tip.dataset.hlSide = placement.split('-')[0];
    add(() => delete tip.dataset.hlSide);

    let showTimer: number | undefined;
    let hideTimer: number | undefined;
    let stopPositioning: Disposer = noop;
    const clearTimers = () => {
      if (showTimer !== undefined) win?.clearTimeout(showTimer);
      if (hideTimer !== undefined) win?.clearTimeout(hideTimer);
      showTimer = hideTimer = undefined;
    };
    add(clearTimers);
    add(() => stopPositioning());

    const isOpen = () => (usePopover ? tip.matches(':popover-open') : !tip.hasAttribute('hidden'));
    const notify = (open: boolean) => {
      options.onOpenChange?.(open);
      emit(Events.openChange, { open });
    };

    // `data-hl-tooltip-open` is the CSS-first hook (transitionable) and always
    // moves together with the popover/hidden state.
    const show = () => {
      clearTimers();
      if (isOpen()) return;
      if (usePopover) tip.showPopover();
      else tip.removeAttribute('hidden');
      tip.setAttribute('data-hl-tooltip-open', '');
      if (options.position) stopPositioning = keepPositioned(root, tip, { placement });
      notify(true);
    };
    const hide = () => {
      clearTimers();
      if (!isOpen()) return;
      stopPositioning();
      stopPositioning = noop;
      tip.removeAttribute('data-hl-tooltip-open');
      if (usePopover) tip.hidePopover();
      else tip.setAttribute('hidden', '');
      notify(false);
    };
    const scheduleShow = () => {
      clearTimers();
      if (!win || !options.showDelay) return show();
      showTimer = win.setTimeout(show, options.showDelay);
    };
    const scheduleHide = () => {
      clearTimers();
      if (!win || !options.hideDelay) return hide();
      hideTimer = win.setTimeout(hide, options.hideDelay);
    };

    on(root, 'mouseenter', scheduleShow);
    on(root, 'mouseleave', scheduleHide);
    on(root, 'focus', show);
    on(root, 'blur', hide);
    on(tip, 'mouseenter', clearTimers);
    on(tip, 'mouseleave', scheduleHide);
    // Escape dismisses a visible tooltip wherever focus is (WCAG 1.4.13).
    on<KeyboardEvent>(doc, 'keydown', (e) => {
      if (e.key === Keys.Escape && isOpen()) hide();
    });

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

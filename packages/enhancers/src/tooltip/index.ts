import {
  defineEnhancer,
  ensureId,
  setAttrs,
  resolveRef,
  placeFloating,
  type Placement,
} from '../core/index.js';

export type EnhanceTooltipOptions = {
  /** Preferred placement relative to the trigger. Defaults to `top`. */
  placement?: Placement;
  /** Position the tooltip with collision-aware JS. Defaults to `true`. */
  position?: boolean;
  /** Delay in ms before showing on hover. Focus shows immediately. */
  showDelay?: number;
  /** Grace period in ms before hiding, so the pointer can reach the tooltip. */
  hideDelay?: number;
};

export type TooltipApi = {
  /** Show the tooltip immediately. */
  show: () => void;
  /** Hide the tooltip immediately. */
  hide: () => void;
};

/**
 * Show/hide a tooltip referenced by a trigger's `aria-describedby` (or
 * `data-hl-tooltip`) on hover and focus, dismissing on Escape. The enhancer
 * wires `role="tooltip"` and `aria-describedby` automatically, shows after a
 * short hover delay (focus is immediate), and keeps the tooltip open while the
 * pointer crosses onto it. Positioning is collision-aware and respects the
 * trigger's `data-hl-placement` override.
 */
export const enhanceTooltip = defineEnhancer<EnhanceTooltipOptions, TooltipApi>({
  name: 'tooltip',
  selector: '[data-hl-tooltip]',
  defaults: { placement: 'top', position: true, showDelay: 150, hideDelay: 100 },
  setup({ root, options, on, add }) {
    const ref = root.getAttribute('aria-describedby') || root.getAttribute('data-hl-tooltip');
    const tip = resolveRef(root.ownerDocument, ref);
    if (!tip) return;

    const win = root.ownerDocument.defaultView;
    setAttrs(tip, { role: 'tooltip' });
    setAttrs(root, { 'aria-describedby': ensureId(tip, 'hl-tooltip') });

    const placement = (root.getAttribute('data-hl-placement') as Placement) || options.placement;

    let showTimer: number | undefined;
    let hideTimer: number | undefined;
    const clearTimers = () => {
      if (showTimer !== undefined) win?.clearTimeout(showTimer);
      if (hideTimer !== undefined) win?.clearTimeout(hideTimer);
      showTimer = hideTimer = undefined;
    };
    add(clearTimers);

    const show = () => {
      clearTimers();
      tip.removeAttribute('hidden');
      if (options.position) placeFloating(root, tip, { placement });
    };
    const hide = () => {
      clearTimers();
      tip.setAttribute('hidden', '');
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
    // Let the pointer rest on the tooltip without dismissing it.
    on(tip, 'mouseenter', () => clearTimers());
    on(tip, 'mouseleave', scheduleHide);
    on<KeyboardEvent>(root, 'keydown', (e) => {
      if (e.key === 'Escape') hide();
    });

    return { show, hide };
  },
});

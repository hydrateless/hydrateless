import {
  defineEnhancer,
  ensureId,
  setAttrs,
  resolveRef,
  supportsAnchorPositioning,
  positionFallback,
  type Placement,
} from '../core/index.js';

/** Options for {@link enhanceTooltip}. */
export type EnhanceTooltipOptions = {
  /** Preferred placement relative to the trigger. Defaults to `top`. */
  placement?: Placement;
  /** Run the JS positioning fallback when CSS anchor positioning is missing. Defaults to `true`. */
  position?: boolean;
  /** Delay in ms before showing on hover. Focus shows immediately. */
  showDelay?: number;
  /** Grace period in ms before hiding, so the pointer can reach the tooltip. */
  hideDelay?: number;
};

/** Imperative handle returned by {@link enhanceTooltip}. */
export type TooltipApi = {
  /** Show the tooltip immediately. */
  show: () => void;
  /** Hide the tooltip immediately. */
  hide: () => void;
};

/**
 * Upgrade a CSS tooltip with the behavior the platform can't express in styles
 * alone. The baseline needs no JavaScript: the stylesheet reveals the tip on
 * the trigger's `:hover`/`:focus-visible` and places it with CSS anchor
 * positioning. When this enhancer runs, it wires `role="tooltip"` and
 * `aria-describedby`, then takes over visibility (marking the trigger
 * `data-hl-tooltip-managed`) so it can add show/hide delays, a grace period for
 * crossing onto the tip, Escape-to-dismiss, and a JS positioning fallback on
 * engines without anchor positioning.
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
    setAttrs(root, {
      'aria-describedby': ensureId(tip, 'hl-tooltip'),
      'data-hl-tooltip-managed': '',
    });
    add(() => root.removeAttribute('data-hl-tooltip-managed'));
    // The enhancer owns visibility now, so start closed (the no-JS CSS hover
    // baseline only applies when this code isn't running).
    tip.setAttribute('hidden', '');

    // Link the tip to its trigger for CSS anchor positioning; `position: fixed`
    // in the stylesheet then escapes any clipping ancestor without the top layer.
    const anchorName = `--${ensureId(root, 'hl-tooltip-anchor')}`;
    root.style.setProperty('anchor-name', anchorName);
    tip.style.setProperty('position-anchor', anchorName);

    const placement = (root.getAttribute('data-hl-placement') as Placement) || options.placement;

    let showTimer: number | undefined;
    let hideTimer: number | undefined;
    const clearTimers = () => {
      if (showTimer !== undefined) win?.clearTimeout(showTimer);
      if (hideTimer !== undefined) win?.clearTimeout(hideTimer);
      showTimer = hideTimer = undefined;
    };
    add(clearTimers);

    // `data-hl-tooltip-open` is the CSS-first hook (transitionable); `hidden` is
    // toggled alongside it as a hard fallback for engines/styles that haven't
    // adopted the open-state selector yet. Both always move together.
    const show = () => {
      clearTimers();
      tip.removeAttribute('hidden');
      tip.setAttribute('data-hl-tooltip-open', '');
      if (options.position && !supportsAnchorPositioning()) {
        positionFallback(root, tip, { placement });
      }
    };
    const hide = () => {
      clearTimers();
      tip.removeAttribute('data-hl-tooltip-open');
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
    on(tip, 'mouseenter', clearTimers);
    on(tip, 'mouseleave', scheduleHide);
    on<KeyboardEvent>(root, 'keydown', (e) => {
      if (e.key === 'Escape') hide();
    });

    return { show, hide };
  },
});

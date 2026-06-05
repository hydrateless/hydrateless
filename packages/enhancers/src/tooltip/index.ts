import { defineEnhancer, resolveRef, placeFloating, type Placement } from '../core/index.js';

export type EnhanceTooltipOptions = {
  /** Preferred placement relative to the trigger. Defaults to `top`. */
  placement?: Placement;
  /** Position the tooltip with collision-aware JS. Defaults to `true`. */
  position?: boolean;
};

/**
 * Show/hide a tooltip referenced by a trigger's `aria-describedby` (or
 * `data-hl-tooltip`) on hover and focus, dismissing on Escape. Positioning is
 * collision-aware and respects the trigger's `data-hl-placement` override.
 */
export const enhanceTooltip = defineEnhancer<EnhanceTooltipOptions>({
  name: 'tooltip',
  selector: '[data-hl-tooltip]',
  defaults: { placement: 'top', position: true },
  setup({ root, options, on }) {
    const ref = root.getAttribute('aria-describedby') || root.getAttribute('data-hl-tooltip');
    const tip = resolveRef(root.ownerDocument, ref);
    if (!tip) return;

    const placement = (root.getAttribute('data-hl-placement') as Placement) || options.placement;

    const show = () => {
      tip.removeAttribute('hidden');
      if (options.position) placeFloating(root, tip, { placement });
    };
    const hide = () => tip.setAttribute('hidden', '');

    on(root, 'mouseenter', show);
    on(root, 'mouseleave', hide);
    on(root, 'focus', show);
    on(root, 'blur', hide);
    on<KeyboardEvent>(root, 'keydown', (e) => {
      if (e.key === 'Escape') hide();
    });
  },
});

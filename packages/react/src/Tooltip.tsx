import {
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  enhanceTooltip,
  type EnhanceTooltipOptions,
  type TooltipApi,
} from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { useControlled } from './internal/useControlled.js';
import { useSyncApi } from './internal/useSyncApi.js';
import { useForwardedRef } from './internal/useForwardedRef.js';
import { useHlId } from './internal/useHlId.js';

/** Props for {@link Tooltip}. */
export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  /** The hint shown on hover/focus. */
  content: ReactNode;
  /** A single focusable element that triggers the tooltip. */
  children: ReactElement;
  /** Preferred placement relative to the trigger. Defaults to `top`. */
  placement?: EnhanceTooltipOptions['placement'];
  /** Delay in ms before showing on hover. */
  showDelay?: number;
  /** Grace period in ms before hiding. */
  hideDelay?: number;
  /** Controlled visibility (pair with `onOpenChange`). */
  open?: boolean;
  /** Called after the tooltip shows or hides. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Adds an accessible tooltip to a focusable trigger. The trigger is linked to
 * the tip with `aria-describedby`; the enhancer shows it on hover/focus with
 * delays, promotes it to the top layer, and dismisses it on Escape.
 *
 * ```tsx
 * <Tooltip content="Save (Cmd+S)">
 *   <Button icon aria-label="Save">...</Button>
 * </Tooltip>
 * ```
 */
export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  {
    content,
    children,
    placement,
    showDelay,
    hideDelay,
    open: openProp,
    onOpenChange,
    id,
    style,
    ...rest
  },
  forwardedRef,
) {
  const ref = useForwardedRef(forwardedRef);
  const tipId = useHlId('tip');
  const [, setOpen] = useControlled(openProp, false, onOpenChange);
  const api = useEnhancer<EnhanceTooltipOptions, TooltipApi>(
    ref,
    enhanceTooltip,
    { placement, showDelay, hideDelay, onOpenChange: setOpen },
    [placement, showDelay, hideDelay],
  );
  useSyncApi(api, openProp, (api, open) => api.setOpen(open));

  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        'data-hl-tooltip': tipId,
        'aria-describedby': tipId,
      })
    : children;

  return (
    <span
      {...rest}
      ref={ref}
      id={id}
      style={{ position: 'relative', display: 'inline-block', ...style }}
    >
      {trigger}
      <span id={tipId} role="tooltip">
        {content}
      </span>
    </span>
  );
});

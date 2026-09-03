import { forwardRef, type HTMLAttributes } from 'react';
import {
  enhancePopover,
  type EnhancePopoverOptions,
  type PopoverApi,
} from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { useControlled } from './internal/useControlled.js';
import { useSyncApi } from './internal/useSyncApi.js';
import { useForwardedRef } from './internal/useForwardedRef.js';

/** Props for {@link Popover}. */
export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  /** Controlled open state (pair with `onOpenChange`). */
  open?: boolean;
  /** Show the popover initially for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called after the popover shows or hides (including the browser's light-dismiss). */
  onOpenChange?: (open: boolean) => void;
  /** Placement used by the JS positioning fallback. Defaults to `bottom`. */
  placement?: EnhancePopoverOptions['placement'];
  /** Open on pointer hover and focus instead of click. */
  hover?: boolean;
}

/**
 * Floating content built on the native Popover API. The surface lives in the
 * top layer with light-dismiss and Escape handled by the browser; visibility
 * works uncontrolled (`defaultOpen`, or a `popovertarget` trigger button) or
 * controlled (`open` + `onOpenChange`). Position it with the
 * `hydrateless/popover.css` styles.
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  { open: openProp, defaultOpen, onOpenChange, placement, hover, children, ...rest },
  forwardedRef,
) {
  const ref = useForwardedRef(forwardedRef);
  const [open, setOpen] = useControlled(openProp, defaultOpen ?? false, onOpenChange);
  const api = useEnhancer<EnhancePopoverOptions, PopoverApi>(
    ref,
    enhancePopover,
    {
      placement,
      triggerEvent: hover ? 'hover' : 'click',
      defaultOpen: open,
      onOpenChange: setOpen,
    },
    [placement, hover],
  );
  useSyncApi(api, openProp, (api, open) => api.setOpen(open));

  return (
    <div {...rest} ref={ref} data-hl-popover popover="auto" role="dialog">
      {children}
    </div>
  );
});

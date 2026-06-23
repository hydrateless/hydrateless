import { useEffect, type HTMLAttributes, type ReactNode } from 'react';
import { enhancePopover, type PopoverApi } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { useLatest } from './util.js';

/** Props for {@link Popover}. */
export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  /** Called when the browser's light-dismiss (Escape or outside click) closes it. */
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

/**
 * Controlled floating content built on the native Popover API. The surface
 * lives in the top layer with light-dismiss and Escape handled by the browser;
 * visibility follows the `open` prop and `onOpenChange` fires when the browser
 * dismisses it. Pair it with your own trigger button (toggling `open`) and
 * position it with the `hydrateless/popover.css` styles.
 */
export function Popover({ open, onOpenChange, children, ...rest }: PopoverProps) {
  const onOpenChangeRef = useLatest(onOpenChange);

  const { ref, api } = useEnhancer<HTMLDivElement, PopoverApi>(
    (el) => enhancePopover(el, { onOpenChange: (next) => onOpenChangeRef.current?.(next) }),
    [],
  );

  useEffect(() => {
    api.current?.setOpen(open);
  }, [open, api]);

  return (
    <div {...rest} ref={ref} data-hl-popover popover="auto" role="dialog">
      {children}
    </div>
  );
}

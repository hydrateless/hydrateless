import { useEffect, type HTMLAttributes, type ReactNode } from 'react';
import { enhancePopover, type PopoverApi } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { useLatest } from './util.js';

/** Props for {@link Popover}. */
export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  /** Controlled open state (pair with `onOpenChange`). */
  open?: boolean;
  /** Show the popover initially for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called when the browser's light-dismiss (Escape or outside click) closes it. */
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

/**
 * Floating content built on the native Popover API. The surface lives in the
 * top layer with light-dismiss and Escape handled by the browser; visibility
 * works uncontrolled (`defaultOpen`, or a `popovertarget` trigger button) or
 * controlled (`open` + `onOpenChange`). Position it with the
 * `hydrateless/popover.css` styles.
 */
export function Popover({ open, defaultOpen, onOpenChange, children, ...rest }: PopoverProps) {
  const onOpenChangeRef = useLatest(onOpenChange);
  const initialOpenRef = useLatest(open ?? defaultOpen);

  const { ref, api } = useEnhancer<HTMLDivElement, PopoverApi>(
    (el) =>
      enhancePopover(el, {
        defaultOpen: initialOpenRef.current,
        onOpenChange: (next) => onOpenChangeRef.current?.(next),
      }),
    [],
  );

  useEffect(() => {
    if (open != null) api.current?.setOpen(open);
  }, [open, api]);

  return (
    <div {...rest} ref={ref} data-hl-popover popover="auto" role="dialog">
      {children}
    </div>
  );
}

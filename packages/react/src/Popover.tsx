import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { onClickOutside, onEscape, combine } from '@hydrateless/enhancers';
import { useLatest } from './util.js';

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  /** Called when Escape or an outside click requests dismissal. */
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

/**
 * Controlled floating content. Visibility follows the `open` prop; wire
 * `onOpenChange` to let Escape and outside clicks request dismissal. Pair it
 * with your own trigger button (toggling `open`) and position it with the
 * `hydrateless/popover.css` styles.
 */
export function Popover({ open, onOpenChange, children, ...rest }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onOpenChangeRef = useLatest(onOpenChange);

  useEffect(() => {
    const el = ref.current;
    if (!el || !open) return;
    const dismiss = () => onOpenChangeRef.current?.(false);
    return combine([onClickOutside(el, dismiss), onEscape(dismiss, el.ownerDocument)]);
  }, [open, onOpenChangeRef]);

  return (
    <div {...rest} ref={ref} data-hl-popover role="dialog" hidden={!open}>
      {children}
    </div>
  );
}

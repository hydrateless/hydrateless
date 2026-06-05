import { type HTMLAttributes, type ReactNode } from 'react';

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  children?: ReactNode;
}

/**
 * Controlled floating content. Visibility follows the `open` prop. Pair it with
 * your own trigger button (toggling `open`) and position it with the
 * `hydrateless/popover.css` styles.
 */
export function Popover({ open, children, ...rest }: PopoverProps) {
  return (
    <div {...rest} data-hl-popover role="dialog" hidden={!open}>
      {children}
    </div>
  );
}

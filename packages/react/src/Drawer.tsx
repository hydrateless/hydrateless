import { useEffect, useRef, type HTMLAttributes, type MouseEvent } from 'react';
import { cx } from './util.js';

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title' | 'onClick'> {
  open: boolean;
  onClose?: () => void;
  side?: 'left' | 'right';
  closeOnBackdrop?: boolean;
}

/**
 * Controlled off-canvas panel built on the native `<dialog>` element. Mirrors
 * {@link Modal} but slides in from the chosen `side`. Compose with
 * `<DrawerHeader>`, `<DrawerBody>`, and `<DrawerFooter>`.
 */
export function Drawer({
  open,
  onClose,
  side = 'right',
  closeOnBackdrop = true,
  className,
  children,
  ...rest
}: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => onClose?.();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const handleClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdrop && e.target === ref.current) onClose?.();
  };

  return (
    <dialog
      {...rest}
      ref={ref}
      data-side={side}
      className={cx('hydrateless-drawer', className)}
      onClick={handleClick}
    >
      {children}
    </dialog>
  );
}

export type DrawerSectionProps = HTMLAttributes<HTMLDivElement>;

/** Drawer heading region. */
export function DrawerHeader({ className, ...rest }: DrawerSectionProps) {
  return <div {...rest} className={cx('hl-drawer-header', className)} />;
}

/** Drawer main content region. */
export function DrawerBody({ className, ...rest }: DrawerSectionProps) {
  return <div {...rest} className={cx('hl-drawer-body', className)} />;
}

/** Drawer actions region. */
export function DrawerFooter({ className, ...rest }: DrawerSectionProps) {
  return <div {...rest} className={cx('hl-drawer-footer', className)} />;
}

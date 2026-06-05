import { useEffect, useRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title' | 'onClick'> {
  open: boolean;
  onClose?: () => void;
  side?: 'left' | 'right';
  title?: ReactNode;
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
}

/**
 * Controlled off-canvas panel built on the native `<dialog>` element. Mirrors
 * {@link Modal} but slides in from the chosen `side`.
 */
export function Drawer({
  open,
  onClose,
  side = 'right',
  title,
  footer,
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
      className={['hydrateless-drawer', className].filter(Boolean).join(' ')}
      onClick={handleClick}
    >
      {title != null && <div className="hl-drawer-header">{title}</div>}
      <div className="hl-drawer-body">{children}</div>
      {footer != null && <div className="hl-drawer-footer">{footer}</div>}
    </dialog>
  );
}

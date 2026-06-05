import { useEffect, useRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title' | 'onClick'> {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
}

/**
 * Controlled dialog overlay. Driven by the `open` prop via the native
 * `<dialog>` element, which provides focus containment in the top layer. Wire
 * `onClose` so Escape and backdrop clicks can update your state.
 */
export function Modal({
  open,
  onClose,
  title,
  footer,
  closeOnBackdrop = true,
  className,
  children,
  ...rest
}: ModalProps) {
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
      className={['hydrateless-modal', className].filter(Boolean).join(' ')}
      onClick={handleClick}
    >
      {title != null && <div className="hl-modal-header">{title}</div>}
      <div className="hl-modal-body">{children}</div>
      {footer != null && <div className="hl-modal-footer">{footer}</div>}
    </dialog>
  );
}

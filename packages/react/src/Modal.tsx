import { useEffect, useRef, type HTMLAttributes, type MouseEvent } from 'react';
import { cx } from './util.js';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title' | 'onClick'> {
  open: boolean;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
}

/**
 * Controlled dialog overlay. Driven by the `open` prop via the native
 * `<dialog>` element, which provides focus containment in the top layer. Compose
 * with `<ModalHeader>`, `<ModalBody>`, and `<ModalFooter>`. Wire `onClose` so
 * Escape and backdrop clicks can update your state.
 *
 * ```tsx
 * <Modal open={open} onClose={close}>
 *   <ModalHeader>Confirm</ModalHeader>
 *   <ModalBody>Are you sure?</ModalBody>
 *   <ModalFooter><Button onClick={close}>Close</Button></ModalFooter>
 * </Modal>
 * ```
 */
export function Modal({
  open,
  onClose,
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
      className={cx('hydrateless-modal', className)}
      onClick={handleClick}
    >
      {children}
    </dialog>
  );
}

export type ModalSectionProps = HTMLAttributes<HTMLDivElement>;

/** Modal heading region; its content labels the dialog for assistive tech. */
export function ModalHeader({ className, ...rest }: ModalSectionProps) {
  return <div {...rest} className={cx('hl-modal-header', className)} />;
}

/** Modal main content region. */
export function ModalBody({ className, ...rest }: ModalSectionProps) {
  return <div {...rest} className={cx('hl-modal-body', className)} />;
}

/** Modal actions region. */
export function ModalFooter({ className, ...rest }: ModalSectionProps) {
  return <div {...rest} className={cx('hl-modal-footer', className)} />;
}

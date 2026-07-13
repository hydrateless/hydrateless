import { useEffect, type HTMLAttributes } from 'react';
import { enhanceModal, type ModalApi } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { cx, useLatest } from './util.js';

/** Props for {@link Modal}. */
export interface ModalProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title'> {
  /** Controlled open state (pair with `onOpenChange`). */
  open?: boolean;
  /** Open the dialog initially for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called after the dialog opens or closes (Escape, backdrop, close buttons). */
  onOpenChange?: (open: boolean) => void;
  closeOnBackdrop?: boolean;
}

/**
 * Dialog overlay built on the native `<dialog>` element and the modal
 * enhancer, which adds a focus trap, body scroll-lock, and a background
 * `inert` barrier. Compose with `<ModalHeader>`, `<ModalBody>`, and
 * `<ModalFooter>`. Open state works uncontrolled (`defaultOpen`, or a
 * `command="show-modal"` invoker button) or controlled (`open` +
 * `onOpenChange`).
 *
 * ```tsx
 * <Modal open={open} onOpenChange={setOpen}>
 *   <ModalHeader>Confirm</ModalHeader>
 *   <ModalBody>Are you sure?</ModalBody>
 *   <ModalFooter><Button onClick={() => setOpen(false)}>Close</Button></ModalFooter>
 * </Modal>
 * ```
 */
export function Modal({
  open,
  defaultOpen,
  onOpenChange,
  closeOnBackdrop = true,
  className,
  children,
  ...rest
}: ModalProps) {
  const onOpenChangeRef = useLatest(onOpenChange);
  const initialOpenRef = useLatest(open ?? defaultOpen);

  const { ref, api } = useEnhancer<HTMLDialogElement, ModalApi>(
    (el) =>
      enhanceModal(el, {
        closeOnBackdrop,
        defaultOpen: initialOpenRef.current,
        onOpenChange: (next) => onOpenChangeRef.current?.(next),
      }),
    [closeOnBackdrop],
  );

  useEffect(() => {
    if (open != null) api.current?.setOpen(open);
  }, [open, api]);

  return (
    <dialog {...rest} ref={ref} data-hl-modal className={cx('hl-modal', className)}>
      {children}
    </dialog>
  );
}

/** Props shared by the {@link Modal} section components. */
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

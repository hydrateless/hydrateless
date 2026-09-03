import { forwardRef, type HTMLAttributes } from 'react';
import { enhanceModal, type EnhanceModalOptions, type ModalApi } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { cx } from './util.js';
import { useControlled } from './internal/useControlled.js';
import { useSyncApi } from './internal/useSyncApi.js';
import { useForwardedRef } from './internal/useForwardedRef.js';

/** Props for {@link Modal}. */
export interface ModalProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title'> {
  /** Controlled open state (pair with `onOpenChange`). */
  open?: boolean;
  /** Open the dialog initially for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called after the dialog opens or closes (Escape, backdrop, close buttons). */
  onOpenChange?: (open: boolean) => void;
  /** Let Escape and backdrop clicks close the dialog. Defaults to `true`. */
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
export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  {
    open: openProp,
    defaultOpen,
    onOpenChange,
    closeOnBackdrop = true,
    className,
    children,
    ...rest
  },
  forwardedRef,
) {
  const ref = useForwardedRef(forwardedRef);
  const [open, setOpen] = useControlled(openProp, defaultOpen ?? false, onOpenChange);
  const api = useEnhancer<EnhanceModalOptions, ModalApi>(
    ref,
    enhanceModal,
    { closeOnBackdrop, defaultOpen: open, onOpenChange: setOpen },
    [closeOnBackdrop],
  );
  useSyncApi(api, openProp, (api, open) => api.setOpen(open));

  return (
    <dialog {...rest} ref={ref} data-hl-modal className={cx('hl-modal', className)}>
      {children}
    </dialog>
  );
});

/** Props shared by the {@link Modal} section components. */
export type ModalSectionProps = HTMLAttributes<HTMLDivElement>;

/** Modal heading region; its content labels the dialog for assistive tech. */
export const ModalHeader = forwardRef<HTMLDivElement, ModalSectionProps>(function ModalHeader(
  { className, ...rest },
  ref,
) {
  return <div {...rest} ref={ref} className={cx('hl-modal-header', className)} />;
});

/** Modal main content region. */
export const ModalBody = forwardRef<HTMLDivElement, ModalSectionProps>(function ModalBody(
  { className, ...rest },
  ref,
) {
  return <div {...rest} ref={ref} className={cx('hl-modal-body', className)} />;
});

/** Modal actions region. */
export const ModalFooter = forwardRef<HTMLDivElement, ModalSectionProps>(function ModalFooter(
  { className, ...rest },
  ref,
) {
  return <div {...rest} ref={ref} className={cx('hl-modal-footer', className)} />;
});

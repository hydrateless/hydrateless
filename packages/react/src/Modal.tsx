import { forwardRef, type HTMLAttributes } from 'react';
import { enhanceModal, type EnhanceModalOptions, type ModalApi } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { cx } from './util.js';
import { useControlled } from './internal/useControlled.js';
import { useSyncApi } from './internal/useSyncApi.js';
import { useForwardedRef } from './internal/useForwardedRef.js';

export {
  ModalTrigger,
  ModalHeader,
  ModalBody,
  ModalFooter,
  type ModalTriggerProps,
  type ModalSectionProps,
} from './OverlayParts.js';

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
 * `inert` barrier. Compose with `<ModalTrigger>`, `<ModalHeader>`,
 * `<ModalBody>`, and `<ModalFooter>`. Open state works uncontrolled
 * (`defaultOpen`, or a `<ModalTrigger>` invoker button) or controlled
 * (`open` + `onOpenChange`).
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
  const [open, setOpen, syncTick] = useControlled(openProp, defaultOpen ?? false, onOpenChange);
  const api = useEnhancer<EnhanceModalOptions, ModalApi>(
    ref,
    enhanceModal,
    { closeOnBackdrop, defaultOpen: open, onOpenChange: setOpen },
    [closeOnBackdrop],
  );
  useSyncApi(
    api,
    openProp,
    (api, open) => {
      if (api.open !== open) api.setOpen(open, { silent: true });
    },
    syncTick,
  );

  return (
    <dialog {...rest} ref={ref} data-hl-modal className={cx('hl-modal', className)}>
      {children}
    </dialog>
  );
});

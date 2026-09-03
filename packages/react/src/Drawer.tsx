import { forwardRef, type HTMLAttributes } from 'react';
import { enhanceDrawer, type DrawerApi, type EnhanceDrawerOptions } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { cx } from './util.js';
import { useControlled } from './internal/useControlled.js';
import { useSyncApi } from './internal/useSyncApi.js';
import { useForwardedRef } from './internal/useForwardedRef.js';

/** Props for {@link Drawer}. */
export interface DrawerProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title'> {
  /** Controlled open state (pair with `onOpenChange`). */
  open?: boolean;
  /** Open the drawer initially for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called after the drawer opens or closes (Escape, backdrop, close buttons). */
  onOpenChange?: (open: boolean) => void;
  /** Logical edge the panel slides in from (`end` follows the writing direction). Defaults to `end`. */
  side?: 'start' | 'end';
  /** Let Escape and backdrop clicks close the drawer. Defaults to `true`. */
  closeOnBackdrop?: boolean;
}

/**
 * Off-canvas panel built on the native `<dialog>` element and the drawer
 * enhancer (focus trap, scroll-lock, background `inert`). Mirrors
 * {@link Modal} but slides in from the chosen `side`. Compose with
 * `<DrawerHeader>`, `<DrawerBody>`, and `<DrawerFooter>`. Open state works
 * uncontrolled (`defaultOpen`, or an invoker button) or controlled (`open` +
 * `onOpenChange`).
 */
export const Drawer = forwardRef<HTMLDialogElement, DrawerProps>(function Drawer(
  {
    open: openProp,
    defaultOpen,
    onOpenChange,
    side = 'end',
    closeOnBackdrop = true,
    className,
    children,
    ...rest
  },
  forwardedRef,
) {
  const ref = useForwardedRef(forwardedRef);
  const [open, setOpen] = useControlled(openProp, defaultOpen ?? false, onOpenChange);
  const api = useEnhancer<EnhanceDrawerOptions, DrawerApi>(
    ref,
    enhanceDrawer,
    { closeOnBackdrop, defaultOpen: open, onOpenChange: setOpen },
    [closeOnBackdrop],
  );
  useSyncApi(api, openProp, (api, open) => api.setOpen(open));

  return (
    <dialog
      {...rest}
      ref={ref}
      data-hl-drawer
      data-hl-side={side}
      className={cx('hl-drawer', className)}
    >
      {children}
    </dialog>
  );
});

/** Props shared by the {@link Drawer} section components. */
export type DrawerSectionProps = HTMLAttributes<HTMLDivElement>;

/** Drawer heading region. */
export const DrawerHeader = forwardRef<HTMLDivElement, DrawerSectionProps>(function DrawerHeader(
  { className, ...rest },
  ref,
) {
  return <div {...rest} ref={ref} className={cx('hl-drawer-header', className)} />;
});

/** Drawer main content region. */
export const DrawerBody = forwardRef<HTMLDivElement, DrawerSectionProps>(function DrawerBody(
  { className, ...rest },
  ref,
) {
  return <div {...rest} ref={ref} className={cx('hl-drawer-body', className)} />;
});

/** Drawer actions region. */
export const DrawerFooter = forwardRef<HTMLDivElement, DrawerSectionProps>(function DrawerFooter(
  { className, ...rest },
  ref,
) {
  return <div {...rest} ref={ref} className={cx('hl-drawer-footer', className)} />;
});

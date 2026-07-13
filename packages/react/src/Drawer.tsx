import { useEffect, type HTMLAttributes } from 'react';
import { enhanceDrawer, type DrawerApi } from '@hydrateless/enhancers';
import { useEnhancer } from './useEnhancer.js';
import { cx, useLatest } from './util.js';

/** Props for {@link Drawer}. */
export interface DrawerProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title'> {
  /** Controlled open state (pair with `onOpenChange`). */
  open?: boolean;
  /** Open the drawer initially for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called after the drawer opens or closes (Escape, backdrop, close buttons). */
  onOpenChange?: (open: boolean) => void;
  side?: 'left' | 'right';
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
export function Drawer({
  open,
  defaultOpen,
  onOpenChange,
  side = 'right',
  closeOnBackdrop = true,
  className,
  children,
  ...rest
}: DrawerProps) {
  const onOpenChangeRef = useLatest(onOpenChange);
  const initialOpenRef = useLatest(open ?? defaultOpen);

  const { ref, api } = useEnhancer<HTMLDialogElement, DrawerApi>(
    (el) =>
      enhanceDrawer(el, {
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
    <dialog
      {...rest}
      ref={ref}
      data-hl-drawer
      data-side={side}
      className={cx('hl-drawer', className)}
    >
      {children}
    </dialog>
  );
}

/** Props shared by the {@link Drawer} section components. */
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

import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
import { cx } from './util.js';

/** Props for {@link ModalTrigger}. */
export interface ModalTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Id of the `<Modal>` dialog this button invokes (sets `commandfor`). */
  target: string;
  /** Invoker command to dispatch. Defaults to `'show-modal'`. */
  command?: 'show-modal' | 'close';
}

/**
 * Declarative trigger that opens or closes a {@link Modal} through native HTML
 * Invoker Commands (`command` and `commandfor`), so it works before hydration
 * and renders as a Server Component.
 */
export const ModalTrigger = forwardRef<HTMLButtonElement, ModalTriggerProps>(function ModalTrigger(
  { target, command = 'show-modal', type, children, ...rest },
  ref,
) {
  const invoker = { command, commandfor: target };
  return (
    <button {...rest} {...invoker} ref={ref} type={type ?? 'button'}>
      {children}
    </button>
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

/** Props for {@link DrawerTrigger}. */
export interface DrawerTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Id of the `<Drawer>` dialog this button invokes (sets `commandfor`). */
  target: string;
  /** Invoker command to dispatch. Defaults to `'show-modal'`. */
  command?: 'show-modal' | 'close';
}

/**
 * Declarative trigger that opens or closes a {@link Drawer} through native
 * HTML Invoker Commands (`command` and `commandfor`), so it works before
 * hydration and renders as a Server Component.
 */
export const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  function DrawerTrigger({ target, command = 'show-modal', type, children, ...rest }, ref) {
    const invoker = { command, commandfor: target };
    return (
      <button {...rest} {...invoker} ref={ref} type={type ?? 'button'}>
        {children}
      </button>
    );
  },
);

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

/** Props for {@link PopoverTrigger}. */
export interface PopoverTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Id of the `<Popover>` surface this button invokes (sets `popovertarget`). */
  target: string;
  /** Popover action to perform. Defaults to `'toggle'`. */
  action?: 'toggle' | 'show' | 'hide';
}

/**
 * Declarative trigger that toggles, shows, or hides a {@link Popover} through
 * the native `popovertarget` attribute, so it works before hydration and
 * renders as a Server Component.
 */
export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger({ target, action = 'toggle', type, children, ...rest }, ref) {
    const attrs = {
      popovertarget: target,
      popovertargetaction: action === 'toggle' ? undefined : action,
    };
    return (
      <button
        {...rest}
        {...attrs}
        popoverTarget={undefined}
        popoverTargetAction={undefined}
        ref={ref}
        type={type ?? 'button'}
      >
        {children}
      </button>
    );
  },
);

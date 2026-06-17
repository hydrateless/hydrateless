import { forwardRef, type HTMLAttributes } from 'react';

/** Props for {@link Kbd}. */
export type KbdProps = HTMLAttributes<HTMLElement>;

/** Keyboard key primitive: `<kbd class="hl-kbd">`. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, children, ...rest },
  ref,
) {
  return (
    <kbd {...rest} ref={ref} className={['hl-kbd', className].filter(Boolean).join(' ')}>
      {children}
    </kbd>
  );
});

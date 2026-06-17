import { forwardRef, type HTMLAttributes } from 'react';

/** Props for {@link Spinner}. */
export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Accessible label; announced via `role="status"`. */
  label?: string;
}

/** Spinner primitive — `hl-spinner`. Inherits `currentColor`. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size, label = 'Loading', className, ...rest },
  ref,
) {
  return (
    <span
      {...rest}
      ref={ref}
      className={['hl-spinner', className].filter(Boolean).join(' ')}
      data-hl-size={size}
      role="status"
      aria-label={label}
    />
  );
});

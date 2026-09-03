import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from './util.js';
import { useFieldControl } from './internal/useFieldControl.js';

/** Props for {@link Input}. */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  /** Error state; also inherited from an enclosing {@link Field}. */
  invalid?: boolean;
}

/**
 * Text input styled with the `hl-input` primitive. Inside a {@link Field} it
 * picks up `id`, `aria-describedby`, `aria-invalid`, and `required`.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, invalid, className, ...rest },
  ref,
) {
  const props = useFieldControl(rest, invalid);
  return (
    <input
      {...props}
      ref={ref}
      className={cx('hl-input', className)}
      data-hl-size={size}
      data-hl-invalid={props['aria-invalid'] || undefined}
    />
  );
});

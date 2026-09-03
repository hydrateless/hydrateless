import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from './util.js';
import { useFieldControl } from './internal/useFieldControl.js';

/** Props for {@link Checkbox}. */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children?: ReactNode;
}

/**
 * Checkbox built on a native `<input type="checkbox">`, label-wrapped. Inside
 * a {@link Field} it picks up `id`, `aria-describedby`, `aria-invalid`, and
 * `required`.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, className, ...rest },
  ref,
) {
  const props = useFieldControl(rest);
  return (
    <label className={cx('hl-checkbox', className)}>
      <input {...props} ref={ref} type="checkbox" />
      {children != null && <span>{children}</span>}
    </label>
  );
});

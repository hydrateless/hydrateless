import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

/** Props for {@link Checkbox}. */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children?: ReactNode;
}

/** Checkbox built on a native `<input type="checkbox">`, label-wrapped. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, className, ...rest },
  ref,
) {
  return (
    <label className={['hl-checkbox', className].filter(Boolean).join(' ')}>
      <input {...rest} ref={ref} type="checkbox" />
      {children != null && <span>{children}</span>}
    </label>
  );
});

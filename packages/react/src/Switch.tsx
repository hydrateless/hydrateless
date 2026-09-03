import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { useFieldControl } from './internal/useFieldControl.js';

/** Props for {@link Switch}. */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children?: ReactNode;
}

/**
 * Toggle switch built on a native checkbox with `role="switch"`. CSS-only.
 * Inside a {@link Field} it picks up `id`, `aria-describedby`, `aria-invalid`,
 * and `required`.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { children, className, ...rest },
  ref,
) {
  const props = useFieldControl(rest);
  return (
    <label data-hl-switch className={className}>
      <input {...props} ref={ref} type="checkbox" role="switch" />
      {children}
    </label>
  );
});

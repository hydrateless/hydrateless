import { forwardRef, type ProgressHTMLAttributes } from 'react';

/** Props for {@link Progress}. */
export interface ProgressProps extends Omit<ProgressHTMLAttributes<HTMLProgressElement>, 'value'> {
  /** Omit for an indeterminate bar. */
  value?: number;
  max?: number;
  intent?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

/** Progress primitive: native `<progress class="hl-progress">`. */
export const Progress = forwardRef<HTMLProgressElement, ProgressProps>(function Progress(
  { value, max = 100, intent, size, className, ...rest },
  ref,
) {
  return (
    <progress
      {...rest}
      ref={ref}
      className={['hl-progress', className].filter(Boolean).join(' ')}
      data-hl-intent={intent}
      data-hl-size={size}
      value={value}
      max={max}
    />
  );
});

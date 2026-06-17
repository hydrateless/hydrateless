import { forwardRef, type InputHTMLAttributes } from 'react';

/** Props for {@link Input}. */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
}

/** Text input styled with the `hl-input` primitive. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, invalid, className, ...rest },
  ref,
) {
  return (
    <input
      {...rest}
      ref={ref}
      className={['hl-input', className].filter(Boolean).join(' ')}
      data-hl-size={size}
      data-hl-invalid={invalid || undefined}
      aria-invalid={invalid || rest['aria-invalid']}
    />
  );
});

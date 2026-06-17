import { type InputHTMLAttributes, type ReactNode } from 'react';

/** Props for {@link Switch}. */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children?: ReactNode;
}

/** Toggle switch built on a native checkbox. CSS-only. */
export function Switch({ children, className, ...rest }: SwitchProps) {
  return (
    <label data-hl-switch className={className}>
      <input type="checkbox" role="switch" {...rest} />
      {children}
    </label>
  );
}

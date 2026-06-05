import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';

export interface SelectOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  /** Convenience for simple option lists; or pass `children` directly. */
  options?: SelectOption[];
}

/**
 * Native `<select>` styled with the `hl-select` primitive, wrapped so a custom
 * caret can be drawn purely in CSS. Native selects keep full mobile/keyboard
 * behavior for free.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { size, invalid, options, className, children, ...rest },
  ref,
) {
  return (
    <span className="hl-select-wrapper">
      <select
        {...rest}
        ref={ref}
        className={['hl-select', className].filter(Boolean).join(' ')}
        data-hl-size={size}
        data-hl-invalid={invalid || undefined}
        aria-invalid={invalid || rest['aria-invalid']}
      >
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))
          : children}
      </select>
    </span>
  );
});

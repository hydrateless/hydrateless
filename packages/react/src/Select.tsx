import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cx } from './util.js';
import { useFieldControl } from './internal/useFieldControl.js';

/** A single option in a {@link Select}. */
export interface SelectOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

/** Props for {@link Select}. */
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  /** Error state; also inherited from an enclosing {@link Field}. */
  invalid?: boolean;
  /** Convenience for simple option lists; or pass `children` directly. */
  options?: SelectOption[];
}

/**
 * Native `<select>` styled with the `hl-select` primitive, wrapped so a custom
 * caret can be drawn purely in CSS. Native selects keep full mobile/keyboard
 * behavior for free. Inside a {@link Field} it picks up `id`,
 * `aria-describedby`, `aria-invalid`, and `required`.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { size, invalid, options, className, children, ...rest },
  ref,
) {
  const props = useFieldControl(rest, invalid);
  return (
    <span className="hl-select-wrapper">
      <select
        {...props}
        ref={ref}
        className={cx('hl-select', className)}
        data-hl-size={size}
        data-hl-invalid={props['aria-invalid'] || undefined}
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

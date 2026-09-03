import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from './util.js';
import { useControlled } from './internal/useControlled.js';
import { useHlId } from './internal/useHlId.js';

/** A single option in a {@link SegmentedControl}. */
export interface SegmentedOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

/** Props for {@link SegmentedControl}. */
export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedOption[];
  /** Controlled selected value (pair with `onValueChange`). */
  value?: string;
  /** Initially selected value for uncontrolled usage; defaults to the first option. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Shared `name` for the underlying radios; generated when omitted. */
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Segmented control: an `hl-segmented` radiogroup built on native radios, so
 * keyboard navigation comes for free. Uncontrolled (`defaultValue`, falling
 * back to the first option) or controlled (`value` + `onValueChange`).
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    { options, value: valueProp, defaultValue, onValueChange, name, size, className, ...rest },
    ref,
  ) {
    const [value, setValue] = useControlled(
      valueProp,
      defaultValue ?? options[0]?.value,
      onValueChange,
    );
    const groupName = useHlId('segmented', name);

    return (
      <div
        {...rest}
        ref={ref}
        role="radiogroup"
        className={cx('hl-segmented', className)}
        data-hl-size={size}
      >
        {options.map((option) => (
          <label className="hl-segmented-item" key={option.value}>
            <input
              type="radio"
              name={groupName}
              value={option.value}
              checked={value === option.value}
              disabled={option.disabled}
              onChange={() => setValue(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    );
  },
);

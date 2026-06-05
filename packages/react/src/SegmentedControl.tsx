import { useId, useState, type HTMLAttributes, type ReactNode } from 'react';

export interface SegmentedOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Segmented control — `hl-segmented` radiogroup. Controlled via `value` or
 * uncontrolled via `defaultValue`. Built on native radios for free keyboard
 * navigation.
 */
export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  size,
  className,
  ...rest
}: SegmentedControlProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value);
  const current = value ?? internal;

  const select = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <div
      {...rest}
      role="radiogroup"
      className={['hl-segmented', className].filter(Boolean).join(' ')}
      data-hl-size={size}
    >
      {options.map((option) => (
        <label className="hl-segmented-item" key={option.value}>
          <input
            type="radio"
            name={groupName}
            value={option.value}
            checked={current === option.value}
            disabled={option.disabled}
            onChange={() => select(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

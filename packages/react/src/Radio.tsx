import {
  createContext,
  forwardRef,
  useContext,
  type InputHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from './util.js';
import { useControlled } from './internal/useControlled.js';
import { useHlId } from './internal/useHlId.js';

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  setValue: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/** Props for {@link Radio}. */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
  children?: ReactNode;
  value: string;
}

/** A single radio built on a native `<input type="radio">`, label-wrapped. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { children, className, value, ...rest },
  ref,
) {
  const group = useContext(RadioGroupContext);
  return (
    <label className={cx('hl-radio', className)}>
      <input
        {...rest}
        ref={ref}
        type="radio"
        name={rest.name ?? group?.name}
        value={value}
        checked={group ? group.value === value : rest.checked}
        onChange={(e) => {
          group?.setValue(value);
          rest.onChange?.(e);
        }}
      />
      {children != null && <span>{children}</span>}
    </label>
  );
});

/** Props for {@link RadioGroup}. */
export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Shared `name` for the radios; generated when omitted. */
  name?: string;
  /** Controlled selected value (pair with `onValueChange`). */
  value?: string;
  /** Initially selected value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Layout direction; sets `data-hl-orientation` and `aria-orientation`. */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Groups radios under a `role="radiogroup"`, sharing a name and managing the
 * selected value (uncontrolled via `defaultValue` or controlled via `value`).
 * Pass `<Radio value="...">` children.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    name,
    value: valueProp,
    defaultValue,
    onValueChange,
    orientation,
    className,
    children,
    ...rest
  },
  ref,
) {
  const [value, setValue] = useControlled(valueProp, defaultValue, onValueChange);
  const groupName = useHlId('radio', name);
  return (
    <RadioGroupContext.Provider value={{ name: groupName, value, setValue }}>
      <div
        {...rest}
        ref={ref}
        role="radiogroup"
        className={cx('hl-radio-group', className)}
        data-hl-orientation={orientation}
        aria-orientation={orientation}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});

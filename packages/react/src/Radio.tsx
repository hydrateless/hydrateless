import {
  createContext,
  forwardRef,
  useContext,
  type InputHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

interface RadioGroupContextValue {
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/** Props for {@link Radio}. */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children?: ReactNode;
  value: string;
}

/** A single radio built on a native `<input type="radio">`, label-wrapped. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { children, className, value, ...rest },
  ref,
) {
  const group = useContext(RadioGroupContext);
  const checked = group ? group.value === value : rest.checked;

  return (
    <label className={['hl-radio', className].filter(Boolean).join(' ')}>
      <input
        {...rest}
        ref={ref}
        type="radio"
        name={rest.name ?? group?.name}
        value={value}
        checked={checked}
        onChange={(e) => {
          group?.onValueChange?.(value);
          rest.onChange?.(e);
        }}
      />
      {children != null && <span>{children}</span>}
    </label>
  );
});

/** Props for {@link RadioGroup}. */
export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Groups radios under a `role="radiogroup"`, sharing a name and managing the
 * selected value. Pass `<Radio value="…">` children.
 */
export function RadioGroup({
  name,
  value,
  onValueChange,
  className,
  children,
  ...rest
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ name, value, onValueChange }}>
      <div
        {...rest}
        role="radiogroup"
        className={['hl-radio-group', className].filter(Boolean).join(' ')}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

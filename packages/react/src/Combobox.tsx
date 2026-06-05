import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { enhanceCombobox } from '@hydrateless/enhancers';

export interface ComboboxOption {
  value: string;
  label?: ReactNode;
}

export interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: ComboboxOption[];
  defaultValue?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'role'>;
}

/**
 * Editable combobox (input + listbox). The enhancer adds filtering,
 * `aria-activedescendant` navigation, and selection; `onValueChange` fires when
 * an option is committed.
 */
export function Combobox({
  options,
  defaultValue,
  placeholder,
  onValueChange,
  inputProps,
  ...rest
}: ComboboxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onValueChange);
  onChangeRef.current = onValueChange;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dispose = enhanceCombobox(el);
    const handler = (e: Event) => onChangeRef.current?.((e as CustomEvent).detail.value);
    el.addEventListener('hl:select', handler);
    return () => {
      el.removeEventListener('hl:select', handler);
      dispose();
    };
  }, [options.length]);

  return (
    <div {...rest} ref={ref} data-hl-combobox>
      <input
        {...inputProps}
        className={['hl-input', inputProps?.className].filter(Boolean).join(' ')}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
      <ul role="listbox" hidden>
        {options.map((option) => (
          <li role="option" data-hl-value={option.value} key={option.value}>
            {option.label ?? option.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

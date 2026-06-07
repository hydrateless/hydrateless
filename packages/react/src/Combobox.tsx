import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LiHTMLAttributes,
} from 'react';
import { enhanceCombobox, type EnhanceComboboxOptions } from '@hydrateless/enhancers';
import { cx } from './util.js';

export interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  filter?: EnhanceComboboxOptions['filter'];
  autoHighlight?: EnhanceComboboxOptions['autoHighlight'];
  /** Fires with the committed value when an option is selected. */
  onValueChange?: (value: string) => void;
}

/**
 * Editable combobox (input + listbox) implementing the APG pattern. Compose with
 * `<ComboboxInput>`, `<ComboboxList>`, and `<ComboboxOption>`. The enhancer adds
 * filtering, `aria-activedescendant` navigation, and selection.
 *
 * ```tsx
 * <Combobox onValueChange={setValue}>
 *   <ComboboxInput placeholder="Search…" />
 *   <ComboboxList>
 *     <ComboboxOption value="apple">Apple</ComboboxOption>
 *     <ComboboxOption value="banana">Banana</ComboboxOption>
 *   </ComboboxList>
 * </Combobox>
 * ```
 */
export function Combobox({
  filter,
  autoHighlight,
  onValueChange,
  children,
  ...rest
}: ComboboxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onValueChange);
  onChangeRef.current = onValueChange;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dispose = enhanceCombobox(el, { filter, autoHighlight });
    const handler = (e: Event) => onChangeRef.current?.((e as CustomEvent).detail.value);
    el.addEventListener('hl:select', handler);
    return () => {
      el.removeEventListener('hl:select', handler);
      dispose();
    };
  }, [filter, autoHighlight]);

  return (
    <div {...rest} ref={ref} data-hl-combobox>
      {children}
    </div>
  );
}

export interface ComboboxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Apply the `hl-input` style. Defaults to `true`. */
  styled?: boolean;
}

/** The combobox text field. */
export function ComboboxInput({ styled = true, className, ...rest }: ComboboxInputProps) {
  return <input {...rest} className={cx(styled && 'hl-input', className)} />;
}

export type ComboboxListProps = HTMLAttributes<HTMLUListElement>;

/** The option popup (`role="listbox"`). */
export function ComboboxList({ children, ...rest }: ComboboxListProps) {
  return (
    <ul {...rest} role="listbox" hidden>
      {children}
    </ul>
  );
}

export interface ComboboxOptionProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'value'> {
  value: string;
}

/** A selectable option. The `value` is committed on selection. */
export function ComboboxOption({ value, children, ...rest }: ComboboxOptionProps) {
  return (
    <li {...rest} role="option" data-hl-value={value}>
      {children ?? value}
    </li>
  );
}
